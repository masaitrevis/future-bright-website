/**
 * POST /api/payments/notify — NCBA push-notification webhook (JSON only).
 *
 * Always responds in NCBA format { ResultCode: "0" | "1", ResultDesc: "..." }.
 *   - Non-JSON content-type  -> HTTP 415, ResultCode "1"
 *   - Auth/hash failure      -> HTTP 401, ResultCode "1" (event logged, verified=false)
 *   - Duplicate TransID      -> HTTP 200, ResultCode "0" (idempotent no-op)
 *   - Matched / unmatched    -> HTTP 200, ResultCode "0"
 *
 * Processing rules (SPEC): verify -> persist raw event (idempotent on
 * TransID) -> match latest pending NCBA order by phone + amount (cent
 * tolerance, 2h window) -> state-guarded update to paid.
 */

import { NextResponse } from "next/server";
import { migrate, query } from "@/db/client";
import { verifyNotify } from "@/lib/ncba";

function ncbaResponse(code: "0" | "1", desc: string, httpStatus: number) {
  return NextResponse.json(
    { ResultCode: code, ResultDesc: desc },
    { status: httpStatus }
  );
}

/** Normalize 07…/01…/+254…/254… to 254XXXXXXXXX; null if invalid. */
function normalizePhone(input: unknown): string | null {
  if (typeof input !== "string") return null;
  let p = input.trim().replace(/[\s-]+/g, "");
  if (p.startsWith("+")) p = p.slice(1);
  if (/^0[17]\d{8}$/.test(p)) p = `254${p.slice(1)}`;
  return /^254[17]\d{8}$/.test(p) ? p : null;
}

function asString(v: unknown): string {
  return v === null || v === undefined ? "" : String(v);
}

interface PendingOrderRow {
  id: number;
  amount: string | number;
}

export async function POST(request: Request) {
  try {
    await migrate();

    // 1. JSON only.
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.toLowerCase().includes("application/json")) {
      return ncbaResponse("1", "Unsupported content type", 415);
    }

    let payload: Record<string, unknown>;
    try {
      payload = (await request.json()) as Record<string, unknown>;
    } catch {
      return ncbaResponse("1", "Invalid JSON body", 400);
    }
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
      return ncbaResponse("1", "Invalid JSON body", 400);
    }

    const transId = asString(payload["TransID"]) || null;

    // 2. Verify username + password + hash (all timing-safe). Failures are
    //    still logged to webhook_events (verified=false) for audit.
    //    Unverified events are stored with trans_id = NULL so a forged
    //    notification can never squat on a real TransID and cause the later
    //    GENUINE notification to be swallowed by ON CONFLICT DO NOTHING.
    const verification = verifyNotify(payload);
    if (!verification.ok) {
      console.warn(`[notify] Verification failed: ${verification.reason}`);
      try {
        await query(
          `INSERT INTO webhook_events (trans_id, payload, verified)
           VALUES (NULL, $1, false)`,
          [JSON.stringify(payload)]
        );
      } catch (logErr) {
        console.error("[notify] Failed to log unverified event:", logErr);
      }
      return ncbaResponse("1", "Authentication failed", 401);
    }

    // 3. Persist verified raw event; duplicate TransID => idempotent no-op.
    let inserted;
    try {
      inserted = await query<{ id: number }>(
        `INSERT INTO webhook_events (trans_id, payload, verified)
         VALUES ($1, $2, true)
         ON CONFLICT (trans_id) DO NOTHING
         RETURNING id`,
        [transId, JSON.stringify(payload)]
      );
    } catch (dbErr) {
      console.error("[notify] Failed to persist webhook event:", dbErr);
      return ncbaResponse("1", "Internal error", 500);
    }
    if (inserted.rows.length === 0) {
      // Already processed this TransID.
      return ncbaResponse("0", "Success", 200);
    }
    const eventId = inserted.rows[0].id;

    // 4. Match an order. FIRST try the exact provider_ref (TransID recorded
    //    at STK-initiate time) with a state-guarded update; if no row
    //    matches, FALL BACK to the phone + amount window match below.
    if (transId) {
      const direct = await query<{ id: number }>(
        `UPDATE orders
         SET status = 'paid', receipt = $1, raw_callback = $2
         WHERE provider_ref = $1 AND status = 'pending'
         RETURNING id`,
        [transId, JSON.stringify(payload)]
      );
      if (direct.rows.length > 0) {
        await query(
          `UPDATE webhook_events SET matched_order_id = $1 WHERE id = $2`,
          [direct.rows[0].id, eventId]
        );
        console.log(
          `[notify] Order ${direct.rows[0].id} marked paid via provider_ref (TransID ${transId})`
        );
        return ncbaResponse("0", "Success", 200);
      }
    }

    // 5. Fallback: match the latest pending NCBA order by phone + amount
    //    (cent tolerance on numeric compare) within a 2-hour window.
    const mobile = normalizePhone(payload["Mobile"]);
    const transAmount = Number(asString(payload["TransAmount"]));

    if (mobile && Number.isFinite(transAmount)) {
      const candidates = await query<PendingOrderRow>(
        `SELECT id, amount FROM orders
         WHERE status = 'pending' AND provider = 'ncba' AND phone_number = $1
           AND created_at > now() - interval '2 hours'
         ORDER BY created_at DESC
         LIMIT 10`,
        [mobile]
      );
      const match = candidates.rows.find(
        (row) => Math.abs(Number(row.amount) - transAmount) < 0.01
      );

      if (match) {
        // State-guarded update: only a still-pending order can transition.
        const updated = await query<{ id: number }>(
          `UPDATE orders
           SET status = 'paid', receipt = $1, raw_callback = $2
           WHERE id = $3 AND status = 'pending'
           RETURNING id`,
          [transId, JSON.stringify(payload), match.id]
        );
        if (updated.rows.length > 0) {
          await query(
            `UPDATE webhook_events SET matched_order_id = $1 WHERE id = $2`,
            [match.id, eventId]
          );
          console.log(`[notify] Order ${match.id} marked paid (TransID ${transId})`);
        }
      } else {
        // 5. Unmatched (e.g. manual till payment): keep the event logged.
        console.log(
          `[notify] No pending order matched TransID ${transId} (${mobile}, ${transAmount})`
        );
      }
    } else {
      console.warn(`[notify] Missing/invalid Mobile or TransAmount for TransID ${transId}`);
    }

    return ncbaResponse("0", "Success", 200);
  } catch (error) {
    console.error("[notify] Error:", error instanceof Error ? error.message : error);
    return ncbaResponse("1", "Internal error", 500);
  }
}

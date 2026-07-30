/**
 * GET /api/payments/status/[id]?token=<pollToken>
 *
 * 404 { error: "Not found" } unless the order id AND pollToken match
 * (pollToken compared timing-safe). Response:
 *   { status, receipt?, downloadToken?, downloadUrl?, productTitle, category, hasFile }
 * downloadUrl is built from APP_BASE_URL — never from the Host header.
 *
 * Confirmation fallback: if the order is still `pending` and has a
 * provider_ref, query NCBA directly (module-level cache, 10s per order).
 * "SUCCESS" triggers a state-guarded update to paid. Any failure of the
 * query API degrades to the current DB status — the poll never 500s on it.
 */

import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { migrate, query } from "@/db/client";
import { queryStkPush } from "@/lib/ncba";

/** Constant-time string compare (length check first; standard practice). */
function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

// Module-level NCBA query cache: orderId -> last query epoch ms (10s window).
const QUERY_CACHE_MS = 10_000;
const queryCache = new Map<string, number>();

interface OrderRow {
  id: number;
  status: string;
  provider_ref: string | null;
  poll_token: string | null;
  download_token: string | null;
  receipt_effective: string | null;
  title: string;
  category: string;
  file_path: string | null;
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await migrate();

    const orderId = params.id;
    const token = new URL(request.url).searchParams.get("token") || "";

    if (!/^\d+$/.test(orderId) || !token) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const result = await query<OrderRow>(
      `SELECT o.id, o.status, o.provider_ref, o.poll_token, o.download_token,
              COALESCE(o.receipt, o.mpesa_receipt) AS receipt_effective,
              p.title, p.category, p.file_path
       FROM orders o
       JOIN products p ON o.product_id = p.id
       WHERE o.id = $1`,
      [Number(orderId)]
    );
    const order = result.rows[0];

    // Poll token is a bearer secret — compare timing-safe.
    if (!order || !order.poll_token || !safeEqual(token, order.poll_token)) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Confirmation fallback: ask NCBA directly for still-pending orders.
    if (order.status === "pending" && order.provider_ref) {
      const lastQuery = queryCache.get(orderId) ?? 0;
      if (Date.now() - lastQuery >= QUERY_CACHE_MS) {
        queryCache.set(orderId, Date.now());
        // Opportunistic prune of stale cache entries.
        if (queryCache.size > 1000) {
          const cutoff = Date.now() - QUERY_CACHE_MS * 6;
          const staleKeys: string[] = [];
          queryCache.forEach((ts, key) => {
            if (ts < cutoff) staleKeys.push(key);
          });
          for (const key of staleKeys) queryCache.delete(key);
        }
        try {
          const ncba = await queryStkPush(order.provider_ref);
          if (ncba.status === "SUCCESS") {
            const updated = await query<{ id: number }>(
              `UPDATE orders
               SET status = 'paid', receipt = $1
               WHERE id = $2 AND status = 'pending'
               RETURNING id`,
              [order.provider_ref, order.id]
            );
            if (updated.rows.length > 0) {
              order.status = "paid";
              order.receipt_effective = order.provider_ref;
            }
          }
        } catch (queryErr) {
          // Never 500 the poll on a provider-query failure — degrade to the
          // current DB status.
          console.error(
            "[status] NCBA query fallback failed:",
            queryErr instanceof Error ? queryErr.message : queryErr
          );
        }
      }
    }

    const paid = order.status === "paid";
    const response: Record<string, unknown> = {
      status: order.status,
      productTitle: order.title,
      category: order.category,
      hasFile: Boolean(order.file_path),
    };

    if (paid) {
      response.receipt = order.receipt_effective;
      response.downloadToken = order.download_token;
      const appBaseUrl = process.env.APP_BASE_URL;
      if (appBaseUrl) {
        response.downloadUrl = `${appBaseUrl.replace(/\/+$/, "")}/api/download/${order.download_token}`;
      } else {
        // Never derive the origin from the Host header; degrade gracefully.
        console.error("[status] APP_BASE_URL is not set — downloadUrl omitted");
      }
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("[status] Error:", error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: "Unable to check payment status" },
      { status: 500 }
    );
  }
}

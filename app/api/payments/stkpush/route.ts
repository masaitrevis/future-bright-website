/**
 * POST /api/payments/stkpush
 *
 * Body:    { phoneNumber, productId }
 * Success: { success: true, orderId, pollToken, message }
 * Errors:  always generic { error: "..." } — details are logged server-side.
 *
 * The client MUST NOT send an amount; the price is looked up server-side
 * from `products.price`.
 *
 * Rate limits: 5 requests/minute per IP AND max 3 pending orders per phone.
 */

import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { migrate, query } from "@/db/client";
import { initiateStkPush } from "@/lib/ncba";
import { rateLimit } from "@/lib/ratelimit";

/** Normalize 07…/01…/+254…/254… to 254XXXXXXXXX; null if invalid. */
function normalizePhone(input: unknown): string | null {
  if (typeof input !== "string") return null;
  let p = input.trim().replace(/[\s-]+/g, "");
  if (p.startsWith("+")) p = p.slice(1);
  if (/^0[17]\d{8}$/.test(p)) p = `254${p.slice(1)}`;
  return /^254[17]\d{8}$/.test(p) ? p : null;
}

function clientIp(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  // Use the RIGHTMOST XFF entry — the hop appended by our trusted proxy.
  // The leftmost value is client-supplied and can be spoofed to bypass
  // per-IP rate limits.
  if (fwd) {
    const parts = fwd.split(",");
    return parts[parts.length - 1].trim() || "unknown";
  }
  return "unknown";
}

interface ProductRow {
  id: number;
  price: string | number;
  status: string;
}

export async function POST(request: Request) {
  try {
    await migrate();

    // Rate limit: 5 STK-push attempts per minute per client IP.
    if (!rateLimit(`stkpush:ip:${clientIp(request)}`, 5, 60_000)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    let body: Record<string, unknown>;
    try {
      body = (await request.json()) as Record<string, unknown>;
    } catch {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const phone = normalizePhone(body.phoneNumber);
    if (!phone) {
      return NextResponse.json(
        { error: "Invalid phone number" },
        { status: 400 }
      );
    }

    const productId = Number(body.productId);
    if (!Number.isInteger(productId) || productId <= 0) {
      return NextResponse.json({ error: "Invalid product" }, { status: 400 });
    }

    // Server-side price lookup — the client never sets the amount.
    const productResult = await query<ProductRow>(
      `SELECT id, price, status FROM products WHERE id = $1`,
      [productId]
    );
    const product = productResult.rows[0];
    if (!product || product.status !== "active") {
      return NextResponse.json({ error: "Product not available" }, { status: 404 });
    }

    // Max 3 pending orders per phone number (recent window).
    const pendingResult = await query<{ count: string }>(
      `SELECT COUNT(*)::text AS count FROM orders
       WHERE phone_number = $1 AND status = 'pending'
         AND created_at > now() - interval '2 hours'`,
      [phone]
    );
    if (Number(pendingResult.rows[0]?.count ?? "0") >= 3) {
      return NextResponse.json(
        { error: "Too many pending payments. Please complete or wait before retrying." },
        { status: 429 }
      );
    }

    const accountNo = process.env.NCBA_ACCOUNT_NO;
    if (!accountNo) {
      console.error("[stkpush] Missing required environment variable: NCBA_ACCOUNT_NO");
      return NextResponse.json(
        { error: "Payments are temporarily unavailable" },
        { status: 500 }
      );
    }

    const amount = String(Math.round(Number(product.price) * 100) / 100);

    const stk = await initiateStkPush({ phone, amount, accountRef: accountNo });

    const pollToken = randomUUID();
    const downloadToken = randomUUID();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const insertResult = await query<{ id: number }>(
      `INSERT INTO orders
         (product_id, phone_number, amount, status, provider, provider_ref,
          poll_token, download_token, download_expires_at)
       VALUES ($1, $2, $3, 'pending', 'ncba', $4, $5, $6, $7)
       RETURNING id`,
      [
        productId,
        phone,
        amount,
        stk.transactionId || null,
        pollToken,
        downloadToken,
        expiresAt.toISOString(),
      ]
    );
    const orderId = insertResult.rows[0].id;

    return NextResponse.json({
      success: true,
      orderId,
      pollToken,
      message: "STK push sent to your phone. Please complete payment.",
    });
  } catch (error) {
    console.error(
      "[stkpush] Error:",
      error instanceof Error ? error.message : error
    );
    return NextResponse.json(
      { error: "Unable to initiate payment. Please try again." },
      { status: 500 }
    );
  }
}

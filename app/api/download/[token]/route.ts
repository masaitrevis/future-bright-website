import { NextResponse } from "next/server";
import { query, migrate } from "@/db/client";

interface DownloadOrderRow {
  download_expires_at: string | null;
  receipt: string | null;
  file_path: string | null;
  category: string;
  title: string;
}

export async function GET(
  request: Request,
  { params }: { params: { token: string } }
) {
  try {
    await migrate();
    const { token } = params;

    // Post-cutover the receipt lives in `orders.receipt`; fall back to the
    // legacy `mpesa_receipt` column for pre-cutover rows.
    const result = await query<DownloadOrderRow>(
      `SELECT o.download_expires_at,
              COALESCE(o.receipt, o.mpesa_receipt) AS receipt,
              p.file_path, p.category, p.title
       FROM orders o
       JOIN products p ON o.product_id = p.id
       WHERE o.download_token = $1 AND o.status = 'paid'`,
      [token]
    );

    const order = result.rows[0];

    if (!order) {
      return NextResponse.json(
        { error: "Download not found or payment not confirmed" },
        { status: 404 }
      );
    }

    if (order.download_expires_at && new Date() > new Date(order.download_expires_at)) {
      return NextResponse.json(
        { error: "Download link has expired" },
        { status: 403 }
      );
    }

    // For services without files, return confirmation
    if (!order.file_path) {
      return NextResponse.json({
        type: "service",
        message: "Payment confirmed!",
        productTitle: order.title,
        category: order.category,
        mpesaReceipt: order.receipt,
        details: "You will receive a confirmation call/email shortly with next steps.",
      });
    }

    // For downloadable products, return info about the file
    return NextResponse.json({
      type: "download",
      message: "Payment confirmed!",
      productTitle: order.title,
      category: order.category,
      mpesaReceipt: order.receipt,
      filePath: order.file_path,
      details: "Your download is ready.",
    });
  } catch (error) {
    console.error(
      "[API /download] Error:",
      error instanceof Error ? error.message : error
    );
    return NextResponse.json(
      { error: "Failed to process download" },
      { status: 500 }
    );
  }
}

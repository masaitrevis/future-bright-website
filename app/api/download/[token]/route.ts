import { NextResponse } from "next/server";
import { query, initDb } from "@/db/client";

export async function GET(
  request: Request,
  { params }: { params: { token: string } }
) {
  try {
    await initDb();
    const { token } = params;

    const result = await query(
      `SELECT o.*, p.file_path, p.category, p.title FROM orders o
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

    if (new Date() > new Date(order.download_expires_at)) {
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
        mpesaReceipt: order.mpesa_receipt,
        details: "You will receive a confirmation call/email shortly with next steps.",
      });
    }

    // For downloadable products, return info about the file
    return NextResponse.json({
      type: "download",
      message: "Payment confirmed!",
      productTitle: order.title,
      category: order.category,
      mpesaReceipt: order.mpesa_receipt,
      filePath: order.file_path,
      details: "Your download is ready.",
    });
  } catch (error: any) {
    console.error("[API /download] Error:", error.message);
    return NextResponse.json(
      { error: "Failed to process download", detail: error.message },
      { status: 500 }
    );
  }
}

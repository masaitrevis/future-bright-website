import { NextResponse } from "next/server";
import { query, initDb } from "@/db/client";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await initDb();
    const { id } = params;

    const result = await query(
      `SELECT o.*, p.file_path, p.category, p.title, p.description FROM orders o
       JOIN products p ON o.product_id = p.id
       WHERE o.checkout_request_id = $1`,
      [id]
    );

    const order = result.rows[0];

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    const host = request.headers.get("host") || "future-bright-ventures.vercel.app";
    const protocol = host.includes("localhost") ? "http" : "https";

    return NextResponse.json({
      status: order.status,
      mpesaReceipt: order.mpesa_receipt,
      downloadToken: order.status === "paid" ? order.download_token : null,
      downloadUrl:
        order.status === "paid"
          ? `${protocol}://${host}/api/download/${order.download_token}`
          : null,
      hasFile: !!order.file_path,
      category: order.category,
      productTitle: order.title,
      details: order.description,
    });
  } catch (error: any) {
    console.error("[API /mpesa/status] Error:", error.message);
    return NextResponse.json(
      { error: "Failed to check status", detail: error.message },
      { status: 500 }
    );
  }
}

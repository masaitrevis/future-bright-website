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

    // Check if file_path is a base64 data URI
    if (order.file_path.startsWith("data:")) {
      // Extract mime type and base64 data
      const matches = order.file_path.match(/^data:([^;]+);base64,(.+)$/);
      
      if (matches) {
        const mimeType = matches[1]; // e.g., "application/pdf"
        const base64Data = matches[2];
        
        // Convert base64 to buffer
        const buffer = Buffer.from(base64Data, "base64");
        
        // Return as downloadable file
        return new NextResponse(buffer, {
          headers: {
            "Content-Type": mimeType,
            "Content-Disposition": `attachment; filename="${order.title.replace(/[^a-zA-Z0-9]/g, "_")}.pdf"`,
            "Content-Length": buffer.length.toString(),
          },
        });
      }
    }

    // If it's a URL (external storage like S3, Cloudinary, etc.)
    if (order.file_path.startsWith("http")) {
      // Redirect to the file URL
      return NextResponse.redirect(order.file_path);
    }

    // If it's a local file path (not recommended for serverless)
    // You would need to read the file from filesystem here
    // const fileBuffer = await fs.readFile(order.file_path);
    // return new NextResponse(fileBuffer, {...});

    // Fallback: return JSON if we can't handle the file type
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
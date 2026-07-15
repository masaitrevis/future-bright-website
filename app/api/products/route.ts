import { NextResponse } from "next/server";
import { query, initDb } from "@/db/client";

export async function GET() {
  try {
    await initDb();
    const result = await query(
      "SELECT * FROM products WHERE status = 'active' ORDER BY created_at DESC"
    );
    return NextResponse.json(result.rows);
  } catch (error: any) {
    console.error("[API /products] GET Error:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch products", detail: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await initDb();
    const body = await request.json();

    if (!body.title || body.price === undefined) {
      return NextResponse.json(
        { error: "Title and price are required" },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO products (title, author, description, price, category, cover_image, file_path, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'active')
       RETURNING *`,
      [
        body.title,
        body.author || null,
        body.description || null,
        body.price.toString(),
        body.category || "service",
        body.cover_image || null,
        body.file_path || null,
      ]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error: any) {
    console.error("[API /products] POST Error:", error.message);
    return NextResponse.json(
      { error: "Failed to create product", detail: error.message },
      { status: 500 }
    );
  }
}

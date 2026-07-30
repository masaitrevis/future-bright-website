import { NextResponse } from "next/server";
import { query, initDb } from "@/db/client";
import { requireAdmin } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await initDb();
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const result = await query(
      "SELECT * FROM products WHERE id = $1 AND status = 'active'",
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error: any) {
    console.error("[API /products/:id] GET Error:", error instanceof Error ? error.message : "unknown error");
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;

  try {
    await initDb();
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    await query(
      "UPDATE products SET status = 'inactive' WHERE id = $1",
      [id]
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[API /products/:id] DELETE Error:", error instanceof Error ? error.message : "unknown error");
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;

  try {
    await initDb();
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const body = await request.json();
    const result = await query(
      `UPDATE products
       SET title = $1, author = $2, description = $3, price = $4, category = $5, cover_image = $6, file_path = $7
       WHERE id = $8
       RETURNING *`,
      [
        body.title,
        body.author || null,
        body.description || null,
        body.price?.toString() || null,
        body.category || "service",
        body.cover_image || null,
        body.file_path || null,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error: any) {
    console.error("[API /products/:id] PUT Error:", error instanceof Error ? error.message : "unknown error");
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

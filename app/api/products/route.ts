import { NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const allProducts = await db.select().from(products).orderBy(desc(products.created_at));
    return NextResponse.json(allProducts);
  } catch (error: any) {
    console.error("[API /products] Error:", error.message);
    console.error("[API /products] POSTGRES_URL set?", !!process.env.POSTGRES_URL);
    console.error("[API /products] DATABASE_URL set?", !!process.env.DATABASE_URL);
    return NextResponse.json(
      { error: "Failed to fetch products", detail: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (!body.title || !body.price) {
      return NextResponse.json(
        { error: "Title and price are required" },
        { status: 400 }
      );
    }

    const newProduct = await db
      .insert(products)
      .values({
        title: body.title,
        author: body.author || null,
        description: body.description || null,
        price: body.price.toString(),
        category: body.category || "service",
        cover_image: body.cover_image || null,
        file_path: body.file_path || null,
        status: "active",
      })
      .returning();

    return NextResponse.json(newProduct[0], { status: 201 });
  } catch (error: any) {
    console.error("[API /products] POST Error:", error.message);
    return NextResponse.json(
      { error: "Failed to create product", detail: error.message },
      { status: 500 }
    );
  }
}

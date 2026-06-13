import { db } from "./index";
import { sql } from "drizzle-orm";

export async function initDatabase() {
  try {
    // Check if products table exists
    const result = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'products'
      );
    `);

    const tableExists = result[0]?.exists;

    if (!tableExists) {
      console.log("Creating products table...");
      await db.execute(sql`
        CREATE TABLE products (
          id SERIAL PRIMARY KEY,
          title TEXT NOT NULL,
          author TEXT,
          description TEXT,
          price DECIMAL(10,2) NOT NULL,
          category VARCHAR(50) NOT NULL DEFAULT 'service',
          cover_image TEXT,
          file_path TEXT,
          status VARCHAR(20) NOT NULL DEFAULT 'active',
          created_at TIMESTAMP DEFAULT NOW()
        );
      `);
      console.log("Products table created successfully!");
    } else {
      console.log("Products table already exists.");
    }
  } catch (error) {
    console.error("Database init error:", error);
  }
}

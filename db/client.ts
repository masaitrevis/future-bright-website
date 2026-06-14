import { Pool } from "pg";

const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL || "";

const pool = new Pool({
  connectionString,
  ssl: connectionString.includes("render.com") ? { rejectUnauthorized: false } : false,
});

export async function query(text: string, params?: any[]) {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
}

export async function initDb() {
  // Create table if it doesn't exist
  await query(`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      author TEXT,
      description TEXT,
      price DECIMAL(10,2) NOT NULL DEFAULT 0,
      category VARCHAR(50) NOT NULL DEFAULT 'service',
      cover_image TEXT,
      file_path TEXT,
      status VARCHAR(20) NOT NULL DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Add missing columns if table exists but was created with older schema
  const columns = await query(`
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = 'products' AND table_schema = 'public'
  `);
  
  const columnNames = columns.rows.map((r: any) => r.column_name);
  
  if (!columnNames.includes('status')) {
    await query(`ALTER TABLE products ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'active'`);
  }
  if (!columnNames.includes('author')) {
    await query(`ALTER TABLE products ADD COLUMN author TEXT`);
  }
  if (!columnNames.includes('cover_image')) {
    await query(`ALTER TABLE products ADD COLUMN cover_image TEXT`);
  }
  if (!columnNames.includes('file_path')) {
    await query(`ALTER TABLE products ADD COLUMN file_path TEXT`);
  }
  if (!columnNames.includes('category')) {
    await query(`ALTER TABLE products ADD COLUMN category VARCHAR(50) NOT NULL DEFAULT 'service'`);
  }
  if (!columnNames.includes('created_at')) {
    await query(`ALTER TABLE products ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`);
  }
}

export default pool;

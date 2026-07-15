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
  // Check if products table exists and has correct schema
  const tableCheck = await query(`
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_name = 'products' AND table_schema = 'public'
    );
  `);
  
  const tableExists = tableCheck.rows[0].exists;
  let needsRecreate = false;
  
  if (tableExists) {
    const cols = await query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'products' AND table_schema = 'public'
    `);
    const columnNames = cols.rows.map((r: any) => r.column_name);
    
    // Check if core columns are missing (old schema)
    const requiredColumns = ['id', 'title', 'price', 'status', 'created_at'];
    const missingCore = requiredColumns.filter(c => !columnNames.includes(c));
    
    if (missingCore.length > 0) {
      console.log(`[DB] Table missing core columns: ${missingCore.join(', ')}. Recreating...`);
      needsRecreate = true;
      await query(`DROP TABLE products CASCADE`);
    }
  }
  
  // Create products table with full schema
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
  
  // If table already existed with good schema, add any missing optional columns
  if (!needsRecreate && tableExists) {
    const cols = await query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'products' AND table_schema = 'public'
    `);
    const columnNames = cols.rows.map((r: any) => r.column_name);
    
    if (!columnNames.includes('author')) {
      await query(`ALTER TABLE products ADD COLUMN author TEXT`);
    }
    if (!columnNames.includes('cover_image')) {
      await query(`ALTER TABLE products ADD COLUMN cover_image TEXT`);
    }
    if (!columnNames.includes('file_path')) {
      await query(`ALTER TABLE products ADD COLUMN file_path TEXT`);
    }
    if (!columnNames.includes('description')) {
      await query(`ALTER TABLE products ADD COLUMN description TEXT`);
    }
    if (!columnNames.includes('category')) {
      await query(`ALTER TABLE products ADD COLUMN category VARCHAR(50) NOT NULL DEFAULT 'service'`);
    }
    if (!columnNames.includes('created_at')) {
      await query(`ALTER TABLE products ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`);
    }
  }
  
  // Create orders table for M-Pesa payments
  await query(`
    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      product_id INTEGER NOT NULL,
      phone_number TEXT NOT NULL,
      mpesa_receipt TEXT,
      checkout_request_id TEXT,
      amount DECIMAL(10,2) NOT NULL,
      status VARCHAR(20) NOT NULL DEFAULT 'pending',
      download_token TEXT,
      download_expires_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

export default pool;

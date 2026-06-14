import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL || "";

if (!connectionString) {
  console.error("[DB] ERROR: No POSTGRES_URL or DATABASE_URL env var set");
}

const pool = new Pool({
  connectionString,
  ssl: connectionString.includes("render.com") ? { rejectUnauthorized: false } : false,
});

export const db = drizzle(pool, { schema });

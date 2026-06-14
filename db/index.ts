import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL || "";

if (!connectionString) {
  console.error("[DB] ERROR: No connection string found. POSTGRES_URL or DATABASE_URL must be set.");
}

const client = postgres(connectionString, {
  prepare: false,
  ssl: connectionString.includes("render.com") ? "require" : false,
  max: 1,
});

export const db = drizzle(client, { schema });

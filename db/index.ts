import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL || "";

const client = postgres(connectionString, {
  prepare: false,
  ssl: connectionString.includes("render.com") ? { rejectUnauthorized: false } : false,
});

export const db = drizzle(client, { schema });

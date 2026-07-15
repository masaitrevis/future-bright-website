import { query, initDb } from "./client";

export async function initDatabase() {
  try {
    await initDb();
    console.log("[DB] Database initialized successfully");
  } catch (error: any) {
    console.error("[DB] Init error:", error.message);
  }
}

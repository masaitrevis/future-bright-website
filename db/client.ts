/**
 * Postgres client (Render Postgres via `pg` Pool) + additive migrations.
 *
 * - `query()` is the shared parameterized-query helper.
 * - `migrate()` is memoized (runs once per process), ADDITIVE ONLY — it never
 *   drops tables/columns. Safe to call at the top of every route handler.
 * - TLS: `DATABASE_CA_CERT` (PEM) => strict verification; otherwise, for
 *   render.com hosts only, `rejectUnauthorized:false` with a one-time warning
 *   (Render proxy constraint).
 */

import { Pool, type QueryResult, type QueryResultRow } from "pg";

const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL || "";

let sslWarningLogged = false;

function buildSsl(): false | { ca?: string; rejectUnauthorized: boolean } {
  const caCert = process.env.DATABASE_CA_CERT;
  if (caCert) {
    return { ca: caCert, rejectUnauthorized: true };
  }
  if (connectionString.includes("render.com")) {
    if (!sslWarningLogged) {
      console.warn(
        "[db] DATABASE_CA_CERT not set; using ssl.rejectUnauthorized=false for " +
          "render.com host (Render proxy constraint). Set DATABASE_CA_CERT to " +
          "enable full certificate verification."
      );
      sslWarningLogged = true;
    }
    return { rejectUnauthorized: false };
  }
  return false;
}

const pool = new Pool({
  connectionString,
  ssl: buildSsl(),
});

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[]
): Promise<QueryResult<T>> {
  if (!connectionString) {
    // Clear server-side log; route handlers surface only generic errors.
    console.error("[db] POSTGRES_URL is not set — cannot run query");
    throw new Error("Database is not configured");
  }
  const client = await pool.connect();
  try {
    return await client.query<T>(text, params as never[] | undefined);
  } finally {
    client.release();
  }
}

// ---------------------------------------------------------------------------
// Migrations — additive only, NEVER drop. Memoized to run once per process.
// ---------------------------------------------------------------------------

async function runMigrations(): Promise<void> {
  // --- products ------------------------------------------------------------
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
  // Add columns missing from older deployments (never DROP anything).
  await query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS author TEXT`);
  await query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS description TEXT`);
  await query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS cover_image TEXT`);
  await query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS file_path TEXT`);
  await query(
    `ALTER TABLE products ADD COLUMN IF NOT EXISTS category VARCHAR(50) NOT NULL DEFAULT 'service'`
  );
  await query(
    `ALTER TABLE products ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`
  );

  // --- orders --------------------------------------------------------------
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
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      provider TEXT NOT NULL DEFAULT 'ncba',
      provider_ref TEXT,
      receipt TEXT,
      poll_token TEXT,
      raw_callback JSONB
    )
  `);
  // NCBA cutover columns — added to existing deployments without data loss.
  await query(
    `ALTER TABLE orders ADD COLUMN IF NOT EXISTS provider TEXT NOT NULL DEFAULT 'ncba'`
  );
  await query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS provider_ref TEXT`);
  await query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS receipt TEXT`);
  await query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS poll_token TEXT`);
  await query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS raw_callback JSONB`);
  // Legacy rows (pre-cutover) were M-PESA orders; correct their provider label.
  // Safe for NCBA rows: they never populate the legacy columns.
  await query(
    `UPDATE orders SET provider = 'mpesa'
     WHERE provider = 'ncba'
       AND (checkout_request_id IS NOT NULL OR mpesa_receipt IS NOT NULL)`
  );
  await query(`
    CREATE UNIQUE INDEX IF NOT EXISTS orders_provider_ref_uniq
    ON orders(provider_ref) WHERE provider_ref IS NOT NULL
  `);

  // --- webhook_events --------------------------------------------------------
  await query(`
    CREATE TABLE IF NOT EXISTS webhook_events (
      id SERIAL PRIMARY KEY,
      trans_id TEXT UNIQUE,
      payload JSONB,
      matched_order_id INT,
      verified BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMP DEFAULT now()
    )
  `);
}

let migratePromise: Promise<void> | null = null;

/**
 * Memoized migration runner: executes once per process; concurrent callers
 * share the same promise (no races). On failure the memo is cleared so the
 * next call retries.
 */
export function migrate(): Promise<void> {
  if (!migratePromise) {
    migratePromise = runMigrations().catch((err) => {
      migratePromise = null;
      throw err;
    });
  }
  return migratePromise;
}

/** Back-compat alias for pre-cutover routes; identical to `migrate()`. */
export const initDb = migrate;

export default pool;

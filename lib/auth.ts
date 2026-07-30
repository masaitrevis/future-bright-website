import { NextResponse } from "next/server";
import { scrypt, createHmac, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);

/** Admin token lifetime: 8 hours (SPEC contract 4). */
const TOKEN_TTL_MS = 8 * 60 * 60 * 1000;

let warnedPlaintextFallback = false;

/**
 * Timing-safe string comparison that does not leak length information
 * via early exit (constant-time compare against equal-length buffers).
 */
function timingSafeCompare(a: string, b: string): boolean {
  const ba = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  if (ba.length !== bb.length) {
    // Burn equivalent time without revealing the length mismatch.
    timingSafeEqual(ba, ba);
    return false;
  }
  return timingSafeEqual(ba, bb);
}

function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

/**
 * Verify an admin password.
 * Preferred: ADMIN_PASSWORD_HASH in `saltHex:hashHex` scrypt format.
 * Fallback: ADMIN_PASSWORD plaintext (timing-safe compare, one-time warning).
 * Throws if neither is configured (no credential fallbacks in code).
 */
export async function verifyAdminPassword(password: string): Promise<boolean> {
  const hashSpec = process.env.ADMIN_PASSWORD_HASH;
  if (hashSpec) {
    const [saltHex, hashHex] = hashSpec.split(":");
    if (!saltHex || !hashHex) {
      throw new Error("ADMIN_PASSWORD_HASH is malformed; expected saltHex:hashHex");
    }
    const salt = Buffer.from(saltHex, "hex");
    const expected = Buffer.from(hashHex, "hex");
    const derived = (await scryptAsync(password, salt, expected.length)) as Buffer;
    return derived.length === expected.length && timingSafeEqual(derived, expected);
  }

  const plaintext = process.env.ADMIN_PASSWORD;
  if (plaintext) {
    if (!warnedPlaintextFallback) {
      warnedPlaintextFallback = true;
      console.warn(
        "[auth] WARNING: using ADMIN_PASSWORD plaintext fallback. Set ADMIN_PASSWORD_HASH (scrypt saltHex:hashHex) instead."
      );
    }
    return timingSafeCompare(password, plaintext);
  }

  throw new Error("No admin credential configured (set ADMIN_PASSWORD_HASH or ADMIN_PASSWORD)");
}

/** Timing-safe username check against ADMIN_USERNAME. Throws if unset. */
export function verifyAdminUsername(username: string): boolean {
  return timingSafeCompare(username, getEnv("ADMIN_USERNAME"));
}

/**
 * Issue an HMAC-SHA256 signed admin token.
 * Format: base64url(payload).base64url(sig), payload = {u, exp}.
 */
export function issueAdminToken(username: string): { token: string; expiresAt: string } {
  const exp = Date.now() + TOKEN_TTL_MS;
  const payload = Buffer.from(JSON.stringify({ u: username, exp }), "utf8").toString("base64url");
  const sig = createHmac("sha256", getEnv("ADMIN_TOKEN_SECRET")).update(payload).digest("base64url");
  return { token: `${payload}.${sig}`, expiresAt: new Date(exp).toISOString() };
}

/** Verify a token issued by issueAdminToken. Returns false on any failure. */
export function verifyAdminToken(token: string): boolean {
  const dot = token.lastIndexOf(".");
  if (dot <= 0) return false;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);

  const expectedSig = createHmac("sha256", getEnv("ADMIN_TOKEN_SECRET"))
    .update(payload)
    .digest("base64url");
  if (!timingSafeCompare(sig, expectedSig)) return false;

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      u?: unknown;
      exp?: unknown;
    };
    if (typeof data.exp !== "number" || data.exp < Date.now()) return false;
    if (typeof data.u !== "string" || !timingSafeCompare(data.u, getEnv("ADMIN_USERNAME"))) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Guard for admin-only route handlers.
 * Returns null if the request carries a valid admin token,
 * otherwise a 401 NextResponse with a generic error.
 */
export function requireAdmin(request: Request): NextResponse | null {
  const header = request.headers.get("authorization");
  const token = header && header.startsWith("Bearer ") ? header.slice(7).trim() : "";

  let ok = false;
  if (token) {
    try {
      ok = verifyAdminToken(token);
    } catch (error) {
      // Misconfiguration (missing env) — log server-side, never leak details.
      console.error(
        "[auth] token verification failed:",
        error instanceof Error ? error.message : "unknown error"
      );
    }
  }

  if (ok) return null;
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

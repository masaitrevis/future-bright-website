import { NextResponse } from "next/server";
import { issueAdminToken, verifyAdminPassword, verifyAdminUsername } from "@/lib/auth";

/**
 * Simple in-memory login rate limit: max 5 failed attempts per 5 minutes per IP.
 * Note: single-instance only (per-process memory). If the app ever runs
 * multiple instances, move this to a shared store (e.g. Redis).
 */
const WINDOW_MS = 5 * 60 * 1000;
const MAX_FAILURES = 5;
const failures = new Map<string, number[]>();

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  // Use the RIGHTMOST XFF entry — the hop appended by our trusted proxy.
  // The leftmost value is client-supplied and can be spoofed to bypass
  // per-IP rate limits.
  if (forwarded) {
    const parts = forwarded.split(",");
    return parts[parts.length - 1].trim() || "unknown";
  }
  return "unknown";
}

function prune(entries: number[], now: number): number[] {
  return entries.filter((t) => now - t < WINDOW_MS);
}

function isRateLimited(ip: string, now: number): boolean {
  const entries = prune(failures.get(ip) ?? [], now);
  if (entries.length === 0) failures.delete(ip);
  else failures.set(ip, entries);
  return entries.length >= MAX_FAILURES;
}

function recordFailure(ip: string, now: number): void {
  const entries = prune(failures.get(ip) ?? [], now);
  entries.push(now);
  failures.set(ip, entries);
  // Bound memory: keep the map from growing without limit.
  if (failures.size > 1000) {
    failures.forEach((value, key) => {
      if (prune(value, now).length === 0) failures.delete(key);
    });
  }
}

export async function POST(request: Request) {
  const now = Date.now();
  const ip = clientIp(request);

  try {
    if (isRateLimited(ip, now)) {
      return NextResponse.json(
        { error: "Too many attempts. Please try again later." },
        { status: 429 }
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const { username, password } = (body ?? {}) as { username?: unknown; password?: unknown };
    if (typeof username !== "string" || typeof password !== "string") {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    // Always evaluate BOTH checks so a valid username does not produce a
    // measurably different timing path than an invalid one.
    let usernameOk = false;
    let passwordOk = false;
    try {
      usernameOk = verifyAdminUsername(username);
      passwordOk = await verifyAdminPassword(password);
    } catch (error) {
      // Missing/misconfigured env — log server-side, generic client error.
      console.error(
        "[auth/login] configuration error:",
        error instanceof Error ? error.message : "unknown error"
      );
      return NextResponse.json({ error: "Login unavailable" }, { status: 500 });
    }

    if (!usernameOk || !passwordOk) {
      recordFailure(ip, now);
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    failures.delete(ip);
    const { token, expiresAt } = issueAdminToken(username);
    return NextResponse.json({ token, expiresAt });
  } catch (error) {
    console.error(
      "[auth/login] unexpected error:",
      error instanceof Error ? error.message : "unknown error"
    );
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}

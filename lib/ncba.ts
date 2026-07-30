/**
 * NCBA Bank C2B API client (STK Push + push-notification verification).
 *
 * All configuration is environment-driven with NO hardcoded credential
 * fallbacks: a missing required env var throws at use time with a clear
 * server-side log message; route handlers translate that into a generic
 * client error. Only global `fetch` and `node:crypto` are used.
 *
 * Required env:  NCBA_USERNAME, NCBA_PASSWORD, NCBA_PAYBILL_NO,
 *                NCBA_ACCOUNT_NO, NCBA_NOTIFY_USERNAME,
 *                NCBA_NOTIFY_PASSWORD, NCBA_NOTIFY_SECRET
 * Defaulted env: NCBA_BASE_URL (https://c2bapis.ncbagroup.com),
 *                NCBA_NETWORK (Safaricom)
 */

import { createHash, timingSafeEqual } from "node:crypto";

const DEFAULT_BASE_URL = "https://c2bapis.ncbagroup.com";
const DEFAULT_NETWORK = "Safaricom";

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    // Clear server-side log; callers must surface only a generic client error.
    console.error(`[ncba] Missing required environment variable: ${name}`);
    throw new Error(`NCBA configuration error (${name})`);
  }
  return value;
}

function baseUrl(): string {
  return (process.env.NCBA_BASE_URL || DEFAULT_BASE_URL).replace(/\/+$/, "");
}

/** Constant-time string comparison (length check first; standard practice). */
function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

/** Read the first present string-ish field from a loose API payload. */
function pickField(obj: Record<string, unknown>, keys: string[]): string {
  for (const k of keys) {
    const v = obj[k];
    if (v !== undefined && v !== null) return String(v);
  }
  return "";
}

// ---------------------------------------------------------------------------
// OAuth token (Basic auth) with in-process caching.
// ---------------------------------------------------------------------------

interface CachedToken {
  token: string;
  expiresAt: number; // epoch ms
}

let cachedToken: CachedToken | null = null;

export async function getNcbaToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.token;
  }

  const username = requiredEnv("NCBA_USERNAME");
  const password = requiredEnv("NCBA_PASSWORD");
  const basic = Buffer.from(`${username}:${password}`, "utf8").toString("base64");

  const res = await fetch(`${baseUrl()}/payments/api/v1/auth/token`, {
    method: "GET",
    headers: { Authorization: `Basic ${basic}` },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.error(`[ncba] Token request failed: HTTP ${res.status} ${body}`);
    throw new Error("NCBA authentication failed");
  }

  const data = (await res.json()) as Record<string, unknown>;
  const token = pickField(data, ["access_token", "accessToken", "token"]);
  if (!token) {
    console.error("[ncba] Token response missing access token field");
    throw new Error("NCBA authentication failed");
  }
  const expiresInRaw = Number(
    pickField(data, ["expires_in", "expiresIn"]) || "3600"
  );
  const expiresIn =
    Number.isFinite(expiresInRaw) && expiresInRaw > 0 ? expiresInRaw : 3600;

  // Cache with a 60-second safety margin before the provider-side expiry.
  cachedToken = {
    token,
    expiresAt: Date.now() + Math.max(expiresIn - 60, 30) * 1000,
  };
  return token;
}

// ---------------------------------------------------------------------------
// STK Push (initiate + query)
// ---------------------------------------------------------------------------

export interface StkPushArgs {
  phone: string;
  amount: string;
  /** Till account reference — callers pass the configured NCBA_ACCOUNT_NO. */
  accountRef: string;
}

export interface StkPushResult {
  transactionId: string;
  referenceId: string;
}

export async function initiateStkPush(args: StkPushArgs): Promise<StkPushResult> {
  if (!args.accountRef) {
    console.error("[ncba] Missing required environment variable: NCBA_ACCOUNT_NO");
    throw new Error("NCBA configuration error (NCBA_ACCOUNT_NO)");
  }
  const token = await getNcbaToken();

  // Payload shape per NCBA C2B guide: AccountNo carries the configured
  // till/account reference (NCBA_ACCOUNT_NO).
  const payload = {
    TelephoneNo: args.phone,
    Amount: String(args.amount),
    PayBillNo: requiredEnv("NCBA_PAYBILL_NO"),
    AccountNo: args.accountRef,
    Network: process.env.NCBA_NETWORK || DEFAULT_NETWORK,
    TransactionType: "CustomerPayBillOnline",
  };

  const res = await fetch(`${baseUrl()}/payments/api/v1/stk-push/initiate`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  const statusCode = pickField(data, ["StatusCode", "statusCode"]);
  if (!res.ok || statusCode !== "0") {
    console.error(
      `[ncba] STK push rejected: HTTP ${res.status} StatusCode=${statusCode} ` +
        `desc=${pickField(data, ["StatusDescription", "statusDescription", "message"])}`
    );
    throw new Error("NCBA STK push initiation failed");
  }

  return {
    transactionId: pickField(data, ["TransactionId", "transactionId", "TransactionID"]),
    referenceId: pickField(data, ["ReferenceId", "referenceId", "ReferenceID"]),
  };
}

export interface StkQueryResult {
  status: string;
  description: string;
}

export async function queryStkPush(transactionId: string): Promise<StkQueryResult> {
  const token = await getNcbaToken();

  const res = await fetch(`${baseUrl()}/payments/api/v1/stk-push/query`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ TransactionID: transactionId }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.error(`[ncba] STK query failed: HTTP ${res.status} ${body}`);
    throw new Error("NCBA STK query failed");
  }

  const data = (await res.json()) as Record<string, unknown>;
  const status = pickField(data, [
    "Status",
    "status",
    "TransactionStatus",
    "transactionStatus",
  ]);
  const description = pickField(data, [
    "StatusDescription",
    "statusDescription",
    "Description",
    "description",
  ]);
  return { status: status.toUpperCase(), description };
}

// ---------------------------------------------------------------------------
// Push-notification (webhook) hash computation + verification
// ---------------------------------------------------------------------------

const s = (v: unknown): string => (v === null || v === undefined ? "" : String(v));

/**
 * Notification hash, per NCBA C2B guide §"SecretKey Generation".
 *
 * Field mapping (concatenated in this exact order, missing values => ""):
 *   NCBA_NOTIFY_SECRET + TransType + TransID + TransTime + TransAmount +
 *   BusinessShortCode + BillRefNumber + Mobile + name + "1"
 *
 * The concatenated string is hashed with SHA-256, rendered as a lowercase
 * hex string, and the UTF-8 bytes of that hex string are Base64-encoded:
 *   Hash = base64(utf8Bytes(sha256hex(raw)))
 *
 * TODO(live-validation): confirm the exact mapping/encoding against the
 * first live test notification from NCBA; adjust here if the guide differs.
 */
export function computeNotifyHash(fields: Record<string, unknown>): string {
  const secret = requiredEnv("NCBA_NOTIFY_SECRET");
  const raw =
    secret +
    s(fields["TransType"]) +
    s(fields["TransID"]) +
    s(fields["TransTime"]) +
    s(fields["TransAmount"]) +
    s(fields["BusinessShortCode"]) +
    s(fields["BillRefNumber"]) +
    s(fields["Mobile"]) +
    s(fields["name"]) +
    "1";
  const hex = createHash("sha256").update(raw, "utf8").digest("hex");
  return Buffer.from(hex, "utf8").toString("base64");
}

export interface VerifyResult {
  ok: boolean;
  reason?: string;
}

/**
 * Verify an inbound NCBA push notification: username + password + hash,
 * ALL compared with timing-safe equality.
 */
export function verifyNotify(fields: Record<string, unknown>): VerifyResult {
  const expectedUsername = requiredEnv("NCBA_NOTIFY_USERNAME");
  const expectedPassword = requiredEnv("NCBA_NOTIFY_PASSWORD");

  const username = s(
    fields["UserName"] ?? fields["Username"] ?? fields["username"]
  ).trim();
  const password = s(fields["Password"] ?? fields["password"]);
  // Provider hash may arrive with stray whitespace/newlines — strip it.
  const providedHash = s(fields["Hash"] ?? fields["hash"]).replace(/\s+/g, "");

  if (!username || !safeEqual(username, expectedUsername)) {
    return { ok: false, reason: "username mismatch" };
  }
  if (!password || !safeEqual(password, expectedPassword)) {
    return { ok: false, reason: "password mismatch" };
  }
  const expectedHash = computeNotifyHash(fields);
  if (!providedHash || !safeEqual(providedHash, expectedHash)) {
    return { ok: false, reason: "hash mismatch" };
  }
  return { ok: true };
}

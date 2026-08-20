/**
 * NCBA Bank C2B API client + Express webhook server
 * 
 * Required env:
 *   NCBA_USERNAME
 *   NCBA_PASSWORD
 *   NCBA_PAYBILL_NO
 *   NCBA_ACCOUNT_NO
 *   NCBA_CREDIT_ACCOUNT
 *   NCBA_NOTIFY_USERNAME
 *   NCBA_NOTIFY_PASSWORD
 *   NCBA_NOTIFY_SECRET
 * 
 * Defaulted env:
 *   NCBA_BASE_URL  (https://c2bapis.ncbagroup.com)
 *   NCBA_NETWORK   (Safaricom)
 *   PORT           (3000)
 */

import express, { Request, Response } from "express";
import { createHash, timingSafeEqual } from "node:crypto";

const app = express();
app.use(express.json());

const DEFAULT_BASE_URL = "https://c2bapis.ncbagroup.com";
const DEFAULT_NETWORK = "Safaricom";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    console.error(`[ncba] Missing required environment variable: ${name}`);
    throw new Error(`NCBA configuration error (${name})`);
  }
  return value;
}

function baseUrl(): string {
  return (process.env.NCBA_BASE_URL || DEFAULT_BASE_URL).replace(/\/+$/, "");
}

/** Constant-time string comparison. */
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
    if (v !== undefined && v !== null) {
      return String(v);
    }
  }
  return "";
}

/** Coerce value to string, treating null/undefined as empty. */
const s = (v: unknown): string =>
  v === null || v === undefined ? "" : String(v);

// ---------------------------------------------------------------------------
// OAuth token (Basic auth) with in-process caching.
// ---------------------------------------------------------------------------

interface CachedToken {
  token: string;
  expiresAt: number;
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
    headers: {
      Authorization: `Basic ${basic}`,
    },
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

  const expiresInRaw = Number(pickField(data, ["expires_in", "expiresIn"]) || "3600");
  const expiresIn = Number.isFinite(expiresInRaw) && expiresInRaw > 0 ? expiresInRaw : 3600;

  cachedToken = {
    token,
    expiresAt: Date.now() + Math.max(expiresIn - 60, 30) * 1000,
  };

  return token;
}

// ---------------------------------------------------------------------------
// STK Push
// ---------------------------------------------------------------------------

export interface StkPushArgs {
  phone: string;
  amount: string;
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
      `[ncba] STK push rejected: HTTP ${res.status} ` +
      `StatusCode=${statusCode} ` +
      `desc=${pickField(data, ["StatusDescription", "statusDescription", "message"])}`
    );
    throw new Error("NCBA STK push initiation failed");
  }

  return {
    transactionId: pickField(data, ["TransactionId", "transactionId", "TransactionID"]),
    referenceId: pickField(data, ["ReferenceId", "referenceId", "ReferenceID"]),
  };
}

// ---------------------------------------------------------------------------
// STK Push Query
// ---------------------------------------------------------------------------

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

  const status = pickField(data, ["Status", "status", "TransactionStatus", "transactionStatus"]);
  const description = pickField(data, ["StatusDescription", "statusDescription", "Description", "description"]);

  return {
    status: status.toUpperCase(),
    description,
  };
}

// ---------------------------------------------------------------------------
// Push Notification Hash (CORRECTED)
// ---------------------------------------------------------------------------

/**
 * NCBA notification hash.
 * 
 * FIXED: Now uses BusinessShortCode from payload (what NCBA sends)
 * and falls back to NCBA_CREDIT_ACCOUNT env var only when absent.
 */
export function computeNotifyHash(fields: Record<string, unknown>): string {
  const secret = requiredEnv("NCBA_NOTIFY_SECRET");

  // FIXED: Use BusinessShortCode from payload if present (NCBA sends this),
  // otherwise fall back to the internal credit account from env.
  const creditAccount =
    s(fields["BusinessShortCode"]) ||
    requiredEnv("NCBA_CREDIT_ACCOUNT");

  const raw =
    secret +
    s(fields["TransType"]) +
    s(fields["TransID"]) +
    s(fields["TransTime"]) +
    s(fields["TransAmount"]) +
    creditAccount +
    s(fields["BillRefNumber"]) +
    s(fields["Mobile"]) +
    s(fields["name"] ?? fields["Name"]) +
    "1";

  const hex = createHash("sha256").update(raw, "utf8").digest("hex");
  return Buffer.from(hex, "utf8").toString("base64");
}

// ---------------------------------------------------------------------------
// Push Notification Verification
// ---------------------------------------------------------------------------

export interface VerifyResult {
  ok: boolean;
  reason?: string;
}

export function verifyNotify(fields: Record<string, unknown>): VerifyResult {
  const expectedUsername = requiredEnv("NCBA_NOTIFY_USERNAME");
  const expectedPassword = requiredEnv("NCBA_NOTIFY_PASSWORD");

  const username = s(fields["UserName"] ?? fields["Username"] ?? fields["username"]).trim();
  const password = s(fields["Password"] ?? fields["password"]);
  const providedHash = s(fields["Hash"] ?? fields["hash"]).replace(/\s+/g, "");

  // Username verification.
  if (!username || !safeEqual(username, expectedUsername)) {
    return { ok: false, reason: "username mismatch" };
  }

  // Password verification.
  if (!password || !safeEqual(password, expectedPassword)) {
    return { ok: false, reason: "password mismatch" };
  }

  // Hash verification.
  const expectedHash = computeNotifyHash(fields);

  if (!providedHash || !safeEqual(providedHash, expectedHash)) {
    return { ok: false, reason: "hash mismatch" };
  }

  return { ok: true };
}

// ===========================================================================
// EXPRESS ROUTES
// ===========================================================================

// ---------------------------------------------------------------------------
// TEMPORARY DEBUG ROUTE — remove after fixing
// ---------------------------------------------------------------------------
app.post("/api/payments/notify-debug", (req: Request, res: Response) => {
  const secret = process.env.NCBA_NOTIFY_SECRET || "NOT_SET";
  const creditAccount = process.env.NCBA_CREDIT_ACCOUNT || "NOT_SET";
  const expectedUser = process.env.NCBA_NOTIFY_USERNAME || "NOT_SET";
  const expectedPass = process.env.NCBA_NOTIFY_PASSWORD || "NOT_SET";

  const body = req.body;

  // Compute hash BOTH ways
  const rawOld =
    secret +
    body.TransType +
    body.TransID +
    body.TransTime +
    body.TransAmount +
    creditAccount +
    body.BillRefNumber +
    body.Mobile +
    (body.name || body.Name) +
    "1";
  const hashOld = Buffer.from(
    createHash("sha256").update(rawOld, "utf8").digest("hex"),
    "utf8"
  ).toString("base64");

  const rawNew =
    secret +
    body.TransType +
    body.TransID +
    body.TransTime +
    body.TransAmount +
    (body.BusinessShortCode || creditAccount) +
    body.BillRefNumber +
    body.Mobile +
    (body.name || body.Name) +
    "1";
  const hashNew = Buffer.from(
    createHash("sha256").update(rawNew, "utf8").digest("hex"),
    "utf8"
  ).toString("base64");

  res.json({
    serverEnv: {
      secretLength: secret.length,
      creditAccount: creditAccount,
      expectedUsername: expectedUser,
      expectedPasswordLength: expectedPass.length,
    },
    received: {
      username: body.Username || body.UserName || body.username,
      passwordLength: (body.Password || body.password || "").length,
      providedHash: body.Hash,
    },
    computed: {
      hashWithCreditAccount: hashOld,
      hashWithBusinessShortCode: hashNew,
    },
    matches: {
      oldCodeWouldPass: hashOld === body.Hash,
      newCodeWouldPass: hashNew === body.Hash,
      usernameMatches:
        (body.Username || body.UserName || "").trim() === expectedUser,
      passwordMatches: (body.Password || body.password || "") === expectedPass,
    },
  });
});

// ---------------------------------------------------------------------------
// PRODUCTION NOTIFICATION ROUTE
// ---------------------------------------------------------------------------
app.post("/api/payments/notify", (req: Request, res: Response) => {
  const result = verifyNotify(req.body);

  if (!result.ok) {
    console.error(`[ncba] Notification rejected: ${result.reason}`, {
      body: req.body,
    });
    return res.status(401).json({
      ResultCode: "1",
      ResultDesc: "Authentication failed",
    });
  }

  // TODO: Process the payment here
  // e.g., save to database, update order status, etc.

  console.log("[ncba] Notification accepted:", req.body.TransID);

  return res.status(200).json({
    ResultCode: "0",
    ResultDesc: "Accepted",
  });
});

// ---------------------------------------------------------------------------
// Health check
// ---------------------------------------------------------------------------
app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

// ---------------------------------------------------------------------------
// Start server
// ---------------------------------------------------------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`[ncba] Server running on port ${PORT}`);
});

/**
 * NCBA Bank C2B API client (STK Push + push-notification verification).
 *
 * Configuration is environment-driven.
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
 */

import { createHash, timingSafeEqual } from "node:crypto";

const DEFAULT_BASE_URL = "https://c2bapis.ncbagroup.com";
const DEFAULT_NETWORK = "Safaricom";

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

  const basic = Buffer.from(
    `${username}:${password}`,
    "utf8"
  ).toString("base64");

  const url = `${baseUrl()}/payments/api/v1/auth/token`;
  
  // DEBUG: Log exactly what we're sending
  console.log("[ncba] Token request URL:", url);
  console.log("[ncba] Token request username:", username);
  console.log("[ncba] Token request password length:", password.length);
  console.log("[ncba] Token request auth header:", `Basic ${basic.slice(0, 30)}...`);

  // Try GET first (per STK Push PDF page 3)
  let res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Basic ${basic}`,
    },
  });

  console.log("[ncba] GET token response status:", res.status);

  // If GET fails with 401, try POST (per QR Code PDF page 6)
  if (res.status === 401) {
    console.log("[ncba] GET failed, trying POST...");
    res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${basic}`,
        "Content-Type": "application/json",
      },
    });
    console.log("[ncba] POST token response status:", res.status);
  }

  if (!res.ok) {
    const body = await res.text().catch(() => "");

    console.error(
      `[ncba] Token request failed: HTTP ${res.status} ${body}`
    );

    throw new Error("NCBA authentication failed");
  }

  const data = (await res.json()) as Record<string, unknown>;

  const token = pickField(data, [
    "access_token",
    "accessToken",
    "token",
  ]);

  if (!token) {
    console.error(
      "[ncba] Token response missing access token field"
    );

    throw new Error("NCBA authentication failed");
  }

  const expiresInRaw = Number(
    pickField(data, ["expires_in", "expiresIn"]) || "3600"
  );

  const expiresIn =
    Number.isFinite(expiresInRaw) && expiresInRaw > 0
      ? expiresInRaw
      : 3600;

  cachedToken = {
    token,
    expiresAt:
      Date.now() +
      Math.max(expiresIn - 60, 30) * 1000,
  };

  return token;
}

// ---------------------------------------------------------------------------
// STK Push
// ---------------------------------------------------------------------------

export interface StkPushArgs {
  phone: string;
  amount: string;

  /** Till/account reference configured for NCBA STK Push. */
  accountRef: string;
}

export interface StkPushResult {
  transactionId: string;
  referenceId: string;
}

export async function initiateStkPush(
  args: StkPushArgs
): Promise<StkPushResult> {
  if (!args.accountRef) {
    console.error(
      "[ncba] Missing required environment variable: NCBA_ACCOUNT_NO"
    );

    throw new Error(
      "NCBA configuration error (NCBA_ACCOUNT_NO)"
    );
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

  const res = await fetch(
    `${baseUrl()}/payments/api/v1/stk-push/initiate`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  const data = (await res.json().catch(() => ({}))) as Record<
    string,
    unknown
  >;

  const statusCode = pickField(data, [
    "StatusCode",
    "statusCode",
  ]);

  if (!res.ok || statusCode !== "0") {
    console.error(
      `[ncba] STK push rejected: HTTP ${res.status} ` +
        `StatusCode=${statusCode} ` +
        `desc=${pickField(data, [
          "StatusDescription",
          "statusDescription",
          "message",
        ])}`
    );

    throw new Error(
      "NCBA STK push initiation failed"
    );
  }

  return {
    transactionId: pickField(data, [
      "TransactionId",
      "transactionId",
      "TransactionID",
    ]),

    referenceId: pickField(data, [
      "ReferenceId",
      "referenceId",
      "ReferenceID",
    ]),
  };
}

// ---------------------------------------------------------------------------
// STK Push Query
// ---------------------------------------------------------------------------

export interface StkQueryResult {
  status: string;
  description: string;
}

export async function queryStkPush(
  transactionId: string
): Promise<StkQueryResult> {
  const token = await getNcbaToken();

  const res = await fetch(
    `${baseUrl()}/payments/api/v1/stk-push/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        TransactionID: transactionId,
      }),
    }
  );

  if (!res.ok) {
    const body = await res.text().catch(() => "");

    console.error(
      `[ncba] STK query failed: HTTP ${res.status} ${body}`
    );

    throw new Error("NCBA STK query failed");
  }

  const data = (await res.json()) as Record<
    string,
    unknown
  >;

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

  return {
    status: status.toUpperCase(),
    description,
  };
}

// ---------------------------------------------------------------------------
// Push Notification Hash
// ---------------------------------------------------------------------------

const s = (v: unknown): string =>
  v === null || v === undefined ? "" : String(v);

/**
 * NCBA notification hash.
 *
 * NCBA hash construction:
 *
 *   SecretKey
 *   + TransType
 *   + TransID
 *   + TransTime
 *   + TransAmount
 *   + CreditAccount
 *   + BillRefNumber
 *   + Mobile
 *   + Name
 *   + "1"
 *
 * The resulting string is:
 *
 *   SHA-256
 *      ↓
 *   lowercase hexadecimal
 *      ↓
 *   Base64 encode the hexadecimal string
 *
 * IMPORTANT:
 * The NCBA hash uses the CREDIT ACCOUNT, not the
 * BusinessShortCode.
 */
export function computeNotifyHash(
  fields: Record<string, unknown>
): string {
  const secret = requiredEnv("NCBA_NOTIFY_SECRET");

  // This is the NCBA internal credit account that receives
  // the funds. It is NOT the public M-Pesa BusinessShortCode.
  const creditAccount = requiredEnv(
    "NCBA_CREDIT_ACCOUNT"
  );

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

  const hex = createHash("sha256")
    .update(raw, "utf8")
    .digest("hex");

  return Buffer.from(hex, "utf8").toString("base64");
}

// ---------------------------------------------------------------------------
// Push Notification Verification
// ---------------------------------------------------------------------------

export interface VerifyResult {
  ok: boolean;
  reason?: string;
}

/**
 * Verify an inbound NCBA push notification.
 *
 * Verification checks:
 *
 *   1. Username
 *   2. Password
 *   3. Hash
 */
export function verifyNotify(
  fields: Record<string, unknown>
): VerifyResult {
  const expectedUsername = requiredEnv(
    "NCBA_NOTIFY_USERNAME"
  );

  const expectedPassword = requiredEnv(
    "NCBA_NOTIFY_PASSWORD"
  );

  const username = s(
    fields["UserName"] ??
      fields["Username"] ??
      fields["username"]
  ).trim();

  const password = s(
    fields["Password"] ??
      fields["password"]
  );

  const providedHash = s(
    fields["Hash"] ??
      fields["hash"]
  ).replace(/\s+/g, "");

  // Username verification.
  if (
    !username ||
    !safeEqual(username, expectedUsername)
  ) {
    return {
      ok: false,
      reason: "username mismatch",
    };
  }

  // Password verification.
  if (
    !password ||
    !safeEqual(password, expectedPassword)
  ) {
    return {
      ok: false,
      reason: "password mismatch",
    };
  }

  // Hash verification.
  const expectedHash = computeNotifyHash(fields);

  if (
    !providedHash ||
    !safeEqual(providedHash, expectedHash)
  ) {
    return {
      ok: false,
      reason: "hash mismatch",
    };
  }

  return {
    ok: true,
  };
}

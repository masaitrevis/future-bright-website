import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { query, initDb } from "@/db/client";

const MPESA_CONFIG = {
  consumerKey: process.env.MPESA_CONSUMER_KEY || "JYImEIJDh95uBcbmjCrFIYZYx14qGTIlXWKqUIuDaY2G1xAg",
  consumerSecret: process.env.MPESA_CONSUMER_SECRET || "yAllZh1Dg2VOGA9zwqKqRtFSvaHTT6QDfzpyBY9Aosai6u5B2YZfpcGTmAQgoddS",
  passkey: process.env.MPESA_PASSKEY || "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919",
  shortcode: process.env.MPESA_SHORTCODE || "174379",
  businessShortcode: process.env.MPESA_BUSINESS_SHORTCODE || "174379",
  callbackUrl: process.env.MPESA_CALLBACK_URL || "",
  environment: process.env.MPESA_ENVIRONMENT || "sandbox",
};

function getBaseUrl() {
  return MPESA_CONFIG.environment === "sandbox"
    ? "https://sandbox.safaricom.co.ke"
    : "https://api.safaricom.co.ke";
}

async function getAccessToken() {
  const auth = Buffer.from(
    `${MPESA_CONFIG.consumerKey}:${MPESA_CONFIG.consumerSecret}`
  ).toString("base64");

  const response = await fetch(
    `${getBaseUrl()}/oauth/v1/generate?grant_type=client_credentials`,
    {
      headers: { Authorization: `Basic ${auth}` },
    }
  );

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Failed to get access token: ${errorData}`);
  }

  const data = await response.json();
  return data.access_token;
}

export async function POST(request: Request) {
  try {
    await initDb();
    const body = await request.json();
    const { phoneNumber, amount, productId } = body;

    if (!phoneNumber || !amount || !productId) {
      return NextResponse.json(
        { error: "Phone number, amount, and product ID are required" },
        { status: 400 }
      );
    }

    const token = await getAccessToken();
    const timestamp = new Date()
      .toISOString()
      .replace(/[^0-9]/g, "")
      .slice(0, 14);
    const password = Buffer.from(
      `${MPESA_CONFIG.shortcode}${MPESA_CONFIG.passkey}${timestamp}`
    ).toString("base64");

    const formattedPhone = phoneNumber.startsWith("0")
      ? `254${phoneNumber.slice(1)}`
      : phoneNumber;

    // Build callback URL if not provided
    let callbackUrl = MPESA_CONFIG.callbackUrl;
    if (!callbackUrl) {
      // Try to construct from request headers
      const host = request.headers.get("host") || "future-bright-ventures.vercel.app";
      const protocol = host.includes("localhost") ? "http" : "https";
      callbackUrl = `${protocol}://${host}/api/mpesa/callback`;
    }

    const response = await fetch(
      `${getBaseUrl()}/mpesa/stkpush/v1/processrequest`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          BusinessShortCode: MPESA_CONFIG.businessShortcode,
          Password: password,
          Timestamp: timestamp,
          TransactionType: "CustomerPayBillOnline",
          Amount: amount,
          PartyA: formattedPhone,
          PartyB: MPESA_CONFIG.businessShortcode,
          PhoneNumber: formattedPhone,
          CallBackURL: callbackUrl,
          AccountReference: `FBV-${productId}`,
          TransactionDesc: "Product Purchase",
        }),
      }
    );

    const data = await response.json();

    if (!response.ok || data.errorCode) {
      console.error("M-Pesa STK push error:", data);
      return NextResponse.json(
        { error: "Failed to initiate payment", details: data },
        { status: 500 }
      );
    }

    const checkoutRequestId = data.CheckoutRequestID;
    const downloadToken = randomUUID();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await query(
      `INSERT INTO orders (product_id, phone_number, checkout_request_id, amount, status, download_token, download_expires_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [productId, formattedPhone, checkoutRequestId, amount, "pending", downloadToken, expiresAt.toISOString()]
    );

    return NextResponse.json({
      success: true,
      checkoutRequestId: data.CheckoutRequestID,
      merchantRequestId: data.MerchantRequestID,
      message: "STK push sent to your phone. Please complete payment.",
    });
  } catch (error: any) {
    console.error("M-Pesa STK push error:", error.message);
    return NextResponse.json(
      { error: "Failed to initiate payment", detail: error.message },
      { status: 500 }
    );
  }
}

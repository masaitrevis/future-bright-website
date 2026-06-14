import { NextResponse } from "next/server";
import { query, initDb } from "@/db/client";

export async function POST(request: Request) {
  try {
    await initDb();
    const body = await request.json();
    const { Body } = body;

    if (!Body || !Body.stkCallback) {
      return NextResponse.json({ error: "Invalid callback" }, { status: 400 });
    }

    const callback = Body.stkCallback;
    const checkoutRequestId = callback.CheckoutRequestID;
    const resultCode = callback.ResultCode;
    const resultDesc = callback.ResultDesc;

    console.log("M-Pesa callback received:", { checkoutRequestId, resultCode, resultDesc });

    if (resultCode === 0) {
      // Payment successful
      const mpesaReceipt = callback.CallbackMetadata?.Item?.find(
        (item: any) => item.Name === "MpesaReceiptNumber"
      )?.Value;

      await query(
        `UPDATE orders SET status = 'paid', mpesa_receipt = $1 WHERE checkout_request_id = $2`,
        [mpesaReceipt, checkoutRequestId]
      );

      console.log("Payment confirmed for:", checkoutRequestId, "Receipt:", mpesaReceipt);
    } else {
      // Payment failed
      await query(
        `UPDATE orders SET status = 'failed' WHERE checkout_request_id = $1`,
        [checkoutRequestId]
      );

      console.log("Payment failed for:", checkoutRequestId, "Reason:", resultDesc);
    }

    return NextResponse.json({ ResultCode: 0, ResultDesc: "Success" });
  } catch (error: any) {
    console.error("M-Pesa callback error:", error.message);
    return NextResponse.json(
      { ResultCode: 1, ResultDesc: "Error processing callback" },
      { status: 500 }
    );
  }
}

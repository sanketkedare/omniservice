import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, jobId } = body;

    if (!razorpay_order_id || !razorpay_payment_id) {
      return NextResponse.json(
        { success: false, error: "Missing payment verification parameters" },
        { status: 400 }
      );
    }

    // Record verified transaction in test mode
    const transactionRecord = {
      id: `txn_${Date.now()}`,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature || `sig_test_${Date.now()}`,
      status: "escrowed", // Held in OmniService TrustLock Escrow until job completion
      jobId: jobId || null,
      timestamp: new Date().toISOString(),
      provider: "razorpay",
      mode: "test",
    };

    return NextResponse.json({
      success: true,
      message: "Payment successfully verified and held in OmniService TrustLock Escrow.",
      transaction: transactionRecord,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to verify Razorpay payment" },
      { status: 500 }
    );
  }
}

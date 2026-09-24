import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, currency = "INR", receipt = `receipt_${Date.now()}`, notes = {} } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { success: false, error: "Invalid payment amount" },
        { status: 400 }
      );
    }

    // Generate test Razorpay Order ID
    const orderId = `order_test_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    return NextResponse.json({
      success: true,
      order: {
        id: orderId,
        entity: "order",
        amount: Math.round(amount * 100), // amount in paise
        currency: currency,
        receipt: receipt,
        status: "created",
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_TIpOwrfH3Ko5Xp",
        notes: {
          ...notes,
          app: "OmniService AI",
        },
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to create Razorpay order" },
      { status: 500 }
    );
  }
}

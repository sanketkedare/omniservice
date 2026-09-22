import { NextRequest, NextResponse } from "next/server";
import { escrowService } from "@/lib/escrow/escrow.service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      jobId,
      paymentId,
      customerId = "user_cust_001",
      actorRole = "customer",
      rating = 5,
      reviewNote,
    } = body;

    if (!jobId && !paymentId) {
      return NextResponse.json(
        { success: false, message: "jobId or paymentId is required to release escrow" },
        { status: 400 }
      );
    }

    const result = await escrowService.release({
      jobId,
      paymentId,
      actorId: customerId,
      actorRole,
      rating,
      reviewNote,
    });

    return NextResponse.json({
      success: true,
      message: result.message,
      payment: result.payment,
      transaction: result.transaction,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to release escrow funds" },
      { status: 500 }
    );
  }
}

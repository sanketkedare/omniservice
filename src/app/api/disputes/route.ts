import { NextRequest, NextResponse } from "next/server";
import { escrowService } from "@/lib/escrow/escrow.service";
import { memoryStore } from "@/lib/memory-store";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      jobId,
      paymentId,
      customerId = "user_cust_001",
      professionalId = "pro_plumb_001",
      customerName,
      professionalName,
      reason,
      description,
    } = body;

    if (!jobId || !reason || !description) {
      return NextResponse.json(
        { success: false, message: "jobId, reason, and description are required" },
        { status: 400 }
      );
    }

    const result = await escrowService.raiseDispute({
      jobId,
      paymentId: paymentId || "pay_001",
      customerId,
      professionalId,
      customerName,
      professionalName,
      reason,
      description,
    });

    return NextResponse.json({
      success: true,
      message: "Dispute submitted successfully. Escrow funds have been frozen pending arbitration.",
      dispute: result.dispute,
      transaction: result.transaction,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to raise dispute" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get("jobId");
    const customerId = searchParams.get("customerId");
    const status = searchParams.get("status");

    let list = Array.from(memoryStore.disputes.values());
    if (jobId) list = list.filter((d) => d.jobId === jobId);
    if (customerId) list = list.filter((d) => d.customerId === customerId);
    if (status) list = list.filter((d) => d.status === status);

    return NextResponse.json({
      success: true,
      count: list.length,
      disputes: list,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch disputes" },
      { status: 500 }
    );
  }
}

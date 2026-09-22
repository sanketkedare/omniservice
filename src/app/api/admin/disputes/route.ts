import { NextRequest, NextResponse } from "next/server";
import { memoryStore } from "@/lib/memory-store";
import { escrowService } from "@/lib/escrow/escrow.service";

export async function GET(req: NextRequest) {
  try {
    const disputes = Array.from(memoryStore.disputes.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json({
      success: true,
      count: disputes.length,
      disputes,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch disputes" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { disputeId, resolution, resolutionNote, refundAmountPaise } = body;

    if (!disputeId || !resolution) {
      return NextResponse.json(
        { success: false, message: "disputeId and resolution are required" },
        { status: 400 }
      );
    }

    const dispute = memoryStore.disputes.get(disputeId);
    if (!dispute) {
      return NextResponse.json(
        { success: false, message: `Dispute ${disputeId} not found` },
        { status: 404 }
      );
    }

    dispute.status = resolution;
    dispute.resolutionNote = resolutionNote || `Arbitrated by Admin with outcome: ${resolution}`;
    dispute.resolvedAt = new Date();
    dispute.refundAmountPaise = refundAmountPaise;

    memoryStore.disputes.set(disputeId, dispute);

    // Apply escrow settlement based on resolution
    if (resolution === "resolved_for_customer") {
      await escrowService.refund({
        paymentId: dispute.paymentId,
        refundAmountPaise: refundAmountPaise,
        reason: dispute.resolutionNote || `Dispute resolved with outcome: ${resolution}`,
        actorId: "admin_user",
        actorRole: "admin",
      });
    } else if (resolution === "resolved_for_professional") {
      await escrowService.release({
        paymentId: dispute.paymentId,
        actorId: "admin_user",
        actorRole: "admin",
        reviewNote: dispute.resolutionNote,
      });
    }

    return NextResponse.json({
      success: true,
      message: `Dispute ${disputeId} resolved: ${resolution}`,
      dispute,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to resolve dispute" },
      { status: 500 }
    );
  }
}

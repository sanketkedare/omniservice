import { NextRequest, NextResponse } from "next/server";
import { escrowService } from "@/lib/escrow/escrow.service";
import { memoryStore } from "@/lib/memory-store";

export async function GET(req: NextRequest) {
  try {
    const summary = escrowService.getEscrowSummary();
    const payments = Array.from(memoryStore.payments.values());
    const ledger = Array.from(memoryStore.escrowLedger.values()).sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return NextResponse.json({
      success: true,
      summary,
      payments,
      ledger,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch escrow summary" },
      { status: 500 }
    );
  }
}

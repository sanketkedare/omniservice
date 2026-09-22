import { NextRequest, NextResponse } from "next/server";
import { memoryStore } from "@/lib/memory-store";

export async function GET(req: NextRequest) {
  return NextResponse.json({
    success: true,
    settings: memoryStore.adminSettings,
  });
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { platformFeePercent, gstPercent, escrowAutoReleaseHours, disputeGraceDays } = body;

    if (platformFeePercent !== undefined) {
      memoryStore.adminSettings.platformFeePercent = Number(platformFeePercent);
    }
    if (gstPercent !== undefined) {
      memoryStore.adminSettings.gstPercent = Number(gstPercent);
    }
    if (escrowAutoReleaseHours !== undefined) {
      memoryStore.adminSettings.escrowAutoReleaseHours = Number(escrowAutoReleaseHours);
    }
    if (disputeGraceDays !== undefined) {
      memoryStore.adminSettings.disputeGraceDays = Number(disputeGraceDays);
    }

    return NextResponse.json({
      success: true,
      message: "Platform settings updated successfully",
      settings: memoryStore.adminSettings,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update settings" },
      { status: 500 }
    );
  }
}

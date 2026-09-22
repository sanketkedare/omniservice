import { NextRequest, NextResponse } from "next/server";
import { trustlockService } from "@/ai/trustlock/trustlock.service";
import { memoryStore } from "@/lib/memory-store";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { jobId, professionalId, forceOutcome } = body;

    if (!jobId) {
      return NextResponse.json(
        { success: false, message: "jobId is required for TrustLock verification" },
        { status: 400 }
      );
    }

    const result = await trustlockService.verifyJob({
      jobId,
      professionalId,
      forceOutcome,
    });

    return NextResponse.json({
      success: true,
      verification: result,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "TrustLock verification failed" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get("jobId");

    const all = Array.from(memoryStore.verifications.values());
    const filtered = jobId ? all.filter((v) => v.jobId === jobId) : all;

    return NextResponse.json({
      success: true,
      count: filtered.length,
      verifications: filtered,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to retrieve verifications" },
      { status: 500 }
    );
  }
}

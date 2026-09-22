import { NextRequest, NextResponse } from "next/server";
import { homepassService } from "@/lib/homepass/homepass.service";
import { memoryStore } from "@/lib/memory-store";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: propertyId } = await params;

    const records = Array.from(memoryStore.maintenanceRecords.values())
      .filter((r) => r.propertyId === propertyId || propertyId === "all")
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json({
      success: true,
      propertyId,
      count: records.length,
      records,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch maintenance records" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: propertyId } = await params;
    const body = await req.json();

    const {
      title,
      category = "plumbing",
      performedBy = "Verified Professional",
      costPaise = 0,
      summary = "",
      warrantyMonths = 12,
      verifiedBadge = true,
      jobId,
    } = body;

    if (!title) {
      return NextResponse.json(
        { success: false, message: "title is required" },
        { status: 400 }
      );
    }

    const newRecord = await homepassService.logMaintenanceRecord({
      propertyId,
      jobId,
      title,
      category,
      performedBy,
      date: new Date(),
      costPaise,
      summary,
      warrantyMonths,
      warrantyExpiresAt: new Date(Date.now() + warrantyMonths * 30 * 86400000),
      verifiedBadge,
    });

    return NextResponse.json({
      success: true,
      message: "Maintenance event logged to HomePass successfully",
      record: newRecord,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to log maintenance event" },
      { status: 500 }
    );
  }
}

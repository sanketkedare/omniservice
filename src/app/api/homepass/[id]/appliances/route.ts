import { NextRequest, NextResponse } from "next/server";
import { homepassService } from "@/lib/homepass/homepass.service";
import { memoryStore } from "@/lib/memory-store";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: propertyId } = await params;

    const appliances = Array.from(memoryStore.appliances.values()).filter(
      (a) => a.propertyId === propertyId || propertyId === "all"
    );

    const health = await homepassService.calculateHealthScore(propertyId);
    const alerts = await homepassService.getPredictiveAlerts(propertyId);

    return NextResponse.json({
      success: true,
      propertyId,
      healthReport: health,
      appliances,
      predictiveAlerts: alerts,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch appliances" },
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
      name,
      brand,
      modelNumber,
      serialNumber,
      category = "appliance",
      installedDate,
      warrantyExpiryDate,
      status = "good",
    } = body;

    if (!name || !brand) {
      return NextResponse.json(
        { success: false, message: "name and brand are required" },
        { status: 400 }
      );
    }

    const newAppliance = await homepassService.addAppliance(propertyId, {
      name,
      brand,
      modelNumber: modelNumber || "OEM-STANDARD",
      serialNumber: serialNumber || `SN-${Date.now().toString(36).toUpperCase()}`,
      category,
      installedDate: installedDate ? new Date(installedDate) : new Date(),
      warrantyExpiryDate: warrantyExpiryDate
        ? new Date(warrantyExpiryDate)
        : new Date(Date.now() + 365 * 86400000),
      status,
      lastServicedDate: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: "Appliance registered into HomePass",
      appliance: newAppliance,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to register appliance" },
      { status: 500 }
    );
  }
}

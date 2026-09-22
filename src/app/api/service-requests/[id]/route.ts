import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { ServiceRequest } from "@/models/service-request.model";
import { getMockRequestById, DEMO_REQUESTS } from "@/lib/mock-data";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check in-memory store and demo requests first
    const mockFound = getMockRequestById(id);
    if (mockFound) {
      return NextResponse.json({
        success: true,
        data: mockFound,
      });
    }

    try {
      await connectToDatabase();
      const request = await ServiceRequest.findById(id).lean();
      if (request) {
        return NextResponse.json({
          success: true,
          data: request,
        });
      }
    } catch {
      // Continue to fallback
    }

    // Default to the first demo request for rich preview if id not found
    return NextResponse.json({
      success: true,
      data: {
        ...DEMO_REQUESTS[0],
        _id: id,
        requestNumber: `SR-2026-${id.slice(-4).toUpperCase()}`,
      },
      fallback: true,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to retrieve service request" },
      { status: 500 }
    );
  }
}

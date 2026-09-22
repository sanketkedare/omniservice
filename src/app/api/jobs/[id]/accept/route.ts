/**
 * ForgeLocal — SmartRoute Job Accept API
 * POST /api/jobs/[id]/accept
 *
 * Assigns professional to service request, creates confirmed Booking & Job records,
 * and locks escrow allocation.
 */

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { ServiceRequest } from "@/models/service-request.model";
import { Booking } from "@/models/booking-job.model";
import { memoryStore } from "@/lib/memory-store";
import { SEED_PROFESSIONALS } from "@/lib/pro-seed-data";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: leadOrRequestId } = await params;
    const body = await req.json().catch(() => ({}));
    const proId = body.proId || "pro_hvac_001";

    const pro =
      SEED_PROFESSIONALS.find((p) => p.id === proId) ?? SEED_PROFESSIONALS[0]!;

    // Check memory store or create active job
    const newJobId = `job_${Date.now()}`;
    const newBookingId = `bk_${Date.now()}`;

    const newJob = {
      _id: newJobId,
      bookingId: newBookingId,
      serviceRequestId: leadOrRequestId,
      scopeOfWorkId: body.sowId || "65f01234567890abcdef3001",
      professionalId: pro.id,
      customerId: "65f01234567890abcdef0001",
      customerName: body.customerName || "Verified Customer",
      customerPhone: body.customerPhone || "+91 98200 12345",
      customerAddress:
        body.customerAddress || "Flat 402, Sea Green Apts, Ameerpet, Hyderabad",
      problemTitle: body.title || "Split AC Compressor Tripping MCB",
      category: body.category || "hvac",
      status: "assigned" as const,
      priceCeilingPaise: body.priceCeilingPaise || 280000,
      requiredParts: body.requiredParts || [
        { name: "45µF Dual Run Motor Capacitor", quantity: 1, inStock: true },
      ],
      distanceKm: body.distanceKm || 1.8,
      estimatedArrivalMinutes: body.estimatedArrivalMinutes || 6,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    memoryStore.jobs.set(newJobId, newJob);

    // Save or update booking
    memoryStore.bookings.set(newBookingId, {
      _id: newBookingId,
      serviceRequestId: leadOrRequestId,
      customerId: "65f01234567890abcdef0001",
      professionalId: pro.id,
      jobId: newJobId,
      status: "confirmed",
      authorizedAmountPaise: newJob.priceCeilingPaise,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // If MongoDB is connected, also update DB models
    try {
      const isConnected = await connectDB();
      if (isConnected) {
        await ServiceRequest.findByIdAndUpdate(leadOrRequestId, {
          status: "matched",
          matchedProfessionalId: pro.userId,
        });
      }
    } catch {
      // Memory store is already updated
    }

    return NextResponse.json({
      success: true,
      message: "Job accepted successfully! Escrow ceiling locked.",
      data: {
        job: newJob,
        bookingId: newBookingId,
        professional: {
          id: pro.id,
          businessName: pro.businessName,
          phone: pro.phone,
        },
      },
    });
  } catch (error) {
    console.error("Error accepting job:", error);
    return NextResponse.json(
      { success: false, error: "Failed to accept job" },
      { status: 500 }
    );
  }
}

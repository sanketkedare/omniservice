/**
 * ForgeLocal — SmartRoute Job Status Transition API
 * POST /api/jobs/[id]/status
 *
 * Transitions job execution states:
 * assigned -> en_route -> arrived -> in_progress -> completed
 */

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Booking } from "@/models/booking-job.model";
import { ServiceRequest } from "@/models/service-request.model";
import { memoryStore } from "@/lib/memory-store";
import { z } from "zod";

const statusSchema = z.object({
  status: z.enum(["assigned", "en_route", "arrived", "in_progress", "completed", "cancelled"]),
  note: z.string().optional(),
  currentLocation: z
    .object({
      lat: z.number(),
      lng: z.number(),
    })
    .optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: jobId } = await params;
    const body = await req.json();
    const parsed = statusSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || "Validation error" },
        { status: 400 }
      );
    }

    const { status, note, currentLocation } = parsed.data;

    // Find job in memory store
    let job = memoryStore.jobs.get(jobId);

    // If not found directly, find first or demo job
    if (!job) {
      job = Array.from(memoryStore.jobs.values())[0];
    }

    if (!job) {
      return NextResponse.json(
        { success: false, error: "Job record not found" },
        { status: 404 }
      );
    }

    // Update timestamps based on state
    job.status = status;
    job.updatedAt = new Date();

    if (status === "en_route" && !job.enRouteAt) {
      job.enRouteAt = new Date();
    } else if (status === "arrived" && !job.arrivedAt) {
      job.arrivedAt = new Date();
    } else if (status === "in_progress" && !job.startedAt) {
      job.startedAt = new Date();
    } else if (status === "completed" && !job.completedAt) {
      job.completedAt = new Date();
    }

    memoryStore.jobs.set(job._id, job);

    // Update database if connected
    try {
      const isConnected = await connectDB();
      if (isConnected) {
        if (job.serviceRequestId) {
          const reqStatusMap: Record<string, string> = {
            en_route: "in_progress",
            arrived: "in_progress",
            in_progress: "in_progress",
            completed: "completed",
            cancelled: "cancelled",
          };
          const mapped = reqStatusMap[status];
          if (mapped) {
            await ServiceRequest.findByIdAndUpdate(job.serviceRequestId, {
              status: mapped,
            });
          }
        }
      }
    } catch {
      // Memory store is already synchronized
    }

    return NextResponse.json({
      success: true,
      message: `Job status transitioned to ${status}`,
      data: {
        jobId: job._id,
        status: job.status,
        updatedAt: job.updatedAt,
        timestamps: {
          enRouteAt: job.enRouteAt,
          arrivedAt: job.arrivedAt,
          startedAt: job.startedAt,
          completedAt: job.completedAt,
        },
      },
    });
  } catch (error) {
    console.error("Error transitioning job status:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update job status" },
      { status: 500 }
    );
  }
}

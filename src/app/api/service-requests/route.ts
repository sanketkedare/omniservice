import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db";
import { ServiceRequest } from "@/models/service-request.model";
import { DiagnosticSession } from "@/models/diagnostic.model";

// Demo mock requests for immediate preview & testing
export const DEMO_REQUESTS = [
  {
    _id: "65f01234567890abcdef2001",
    requestNumber: "SR-2026-0819",
    categorySlug: "plumbing",
    categoryName: "Plumbing & Drainage",
    title: "Kitchen Sink Waste Pipe Compression Leak",
    description: "Water continuously drips from the P-trap compression nut under the kitchen sink when water is running. Puddle forms inside the cabinet.",
    urgency: "urgent",
    status: "sow_ready",
    media: [
      {
        url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800",
        type: "image",
        filename: "sink_leak_joint.jpg",
      },
    ],
    propertyAddress: "Apartment 402, Sea Green Heights, Ameerpet, Hyderabad",
    estimatedPricePaise: 185000,
    aiFindings: [
      {
        component: "P-trap compression slip nut",
        issue: "Worn rubber washer / thread stripped",
        confidence: 0.94,
        requiredPart: "32mm PVC Waste Coupling Washer",
      },
    ],
    statusHistory: [
      { status: "submitted", timestamp: new Date(Date.now() - 3600000 * 2) },
      { status: "analyzing", timestamp: new Date(Date.now() - 3600000 * 1.8) },
      { status: "sow_ready", timestamp: new Date(Date.now() - 3600000 * 1.5) },
    ],
    createdAt: new Date(Date.now() - 3600000 * 2),
  },
  {
    _id: "65f01234567890abcdef2002",
    requestNumber: "SR-2026-0818",
    categorySlug: "hvac",
    categoryName: "HVAC & Air Conditioning",
    title: "Master Bedroom AC Tripping MCB after 5 minutes",
    description: "Daikin 1.5T split AC powers on normally, fan runs, but as soon as the outdoor compressor kicks in after 3-5 mins, the 16A MCB trips.",
    urgency: "routine",
    status: "booked",
    media: [
      {
        url: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800",
        type: "video",
        filename: "ac_compressor_trip.mp4",
      },
    ],
    propertyAddress: "Apartment 402, Sea Green Heights, Ameerpet, Hyderabad",
    estimatedPricePaise: 240000,
    aiFindings: [
      {
        component: "Outdoor unit run capacitor",
        issue: "Capacitor degradation or compressor locked rotor amp surge",
        confidence: 0.91,
        requiredPart: "45µF Dual Run Motor Capacitor",
      },
    ],
    assignedPro: {
      name: "Rajesh Kumar",
      businessName: "CoolAir Technical Solutions",
      rating: 4.9,
      phone: "+91 86248 51910",
      eta: "Today, 2:30 PM",
    },
    statusHistory: [
      { status: "submitted", timestamp: new Date(Date.now() - 3600000 * 24) },
      { status: "analyzing", timestamp: new Date(Date.now() - 3600000 * 23.5) },
      { status: "sow_ready", timestamp: new Date(Date.now() - 3600000 * 23) },
      { status: "matching", timestamp: new Date(Date.now() - 3600000 * 22) },
      { status: "booked", timestamp: new Date(Date.now() - 3600000 * 18) },
    ],
    createdAt: new Date(Date.now() - 3600000 * 24),
  },
];

const createRequestSchema = z.object({
  propertyId: z.string().optional(),
  categoryId: z.string().optional(),
  categorySlug: z.string().min(1, "Category is required"),
  title: z.string().min(3, "Title must be at least 3 characters").max(200),
  description: z.string().min(5, "Please provide a description of the issue").max(3000),
  urgency: z.enum(["routine", "urgent", "emergency"]).default("routine"),
  media: z
    .array(
      z.object({
        url: z.string().url(),
        type: z.enum(["image", "video", "audio"]),
        filename: z.string(),
        fileSize: z.number().optional(),
      })
    )
    .default([]),
});

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const url = new URL(req.url);
    const statusFilter = url.searchParams.get("status");

    let query: Record<string, unknown> = {};
    if (statusFilter && statusFilter !== "all") {
      if (statusFilter === "active") {
        query.status = { $nin: ["cancelled", "completed", "draft"] };
      } else {
        query.status = statusFilter;
      }
    }

    const requests = await ServiceRequest.find(query).sort({ createdAt: -1 }).lean();

    if (!requests || requests.length === 0) {
      return NextResponse.json({
        success: true,
        data: DEMO_REQUESTS,
        count: DEMO_REQUESTS.length,
      });
    }

    return NextResponse.json({
      success: true,
      data: requests,
      count: requests.length,
    });
  } catch (error) {
    return NextResponse.json({
      success: true,
      data: DEMO_REQUESTS,
      count: DEMO_REQUESTS.length,
      fallback: true,
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = createRequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, errors: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { categorySlug, title, description, urgency, media, propertyId } = validation.data;
    const customerId = new mongoose.Types.ObjectId("65f01234567890abcdef0001");
    const reqNumber = `SR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      await connectToDatabase();

      // Create new ServiceRequest in MongoDB
      const newRequest = await ServiceRequest.create({
        customerId,
        propertyId: propertyId ? new mongoose.Types.ObjectId(propertyId) : undefined,
        title,
        description,
        urgency,
        status: "submitted",
        media: media.map((m) => ({
          storageKey: m.filename,
          url: m.url,
          mimeType: m.type === "video" ? "video/mp4" : "image/jpeg",
          uploadedAt: new Date(),
        })),
        statusHistory: [
          { status: "submitted", timestamp: new Date(), reason: "Initial customer intake" },
        ],
      });

      // Initialize InspectAI DiagnosticSession
      const session = await DiagnosticSession.create({
        serviceRequestId: newRequest._id,
        customerId,
        status: "processing",
        mediaFiles: media.map((m) => ({
          fileId: new mongoose.Types.ObjectId(),
          storageKey: m.filename,
          fileType: m.type,
          url: m.url,
          uploadedAt: new Date(),
        })),
        sessionDurationSeconds: 15,
      });

      // Link session to request
      newRequest.diagnosticSessionId = session._id as mongoose.Types.ObjectId;
      await newRequest.save();

      return NextResponse.json(
        {
          success: true,
          data: {
            ...newRequest.toJSON(),
            requestNumber: reqNumber,
            diagnosticSessionId: session._id,
          },
          message: "Service request submitted. InspectAI diagnostic pipeline initiated.",
        },
        { status: 201 }
      );
    } catch {
      // In-memory fallback if MongoDB connection is pending
      const mockCreated = {
        _id: `mock_${Date.now()}`,
        requestNumber: reqNumber,
        categorySlug,
        title,
        description,
        urgency,
        status: "submitted",
        media,
        createdAt: new Date(),
      };

      return NextResponse.json(
        {
          success: true,
          data: mockCreated,
          message: "Service request submitted (mock mode).",
        },
        { status: 201 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to process service request" },
      { status: 500 }
    );
  }
}

/**
 * ForgeLocal — SmartRoute Jobs Feed API
 * GET /api/jobs/feed
 *
 * Returns live, algorithmic dispatch opportunities for technicians.
 * Evaluates proximity, required parts vs van inventory, price ceiling, and urgency.
 */

import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { ServiceRequest } from "@/models/service-request.model";
import { ScopeOfWork } from "@/models/scope-of-work.model";
import { memoryStore } from "@/lib/memory-store";
import { SEED_PROFESSIONALS } from "@/lib/pro-seed-data";
import {
  calculateHaversineDistanceKm,
  estimateDriveTimeMinutes,
  scoreVanInventory,
  scoreProximity,
} from "@/ai/smart-route/smart-route.service";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const proId = searchParams.get("proId") || "pro_hvac_001";
    const categoryFilter = searchParams.get("category");

    // Find technician profile
    const pro =
      SEED_PROFESSIONALS.find((p) => p.id === proId) ?? SEED_PROFESSIONALS[0]!;

    // Check if DB is already connected
    let dbConnected = false;
    try {
      if (typeof mongoose !== "undefined" && mongoose.connection.readyState === 1) {
        dbConnected = true;
      }
    } catch {
      dbConnected = false;
    }

    // Default mock dispatch leads matching the technician's trade
    const defaultLeads = [
      {
        _id: "lead_req_01",
        serviceRequestId: "65f01234567890abcdef2001",
        title: "Split AC Compressor Tripping MCB",
        description: "Customer uploaded 12s video showing compressor shudder and instant 16A MCB trip. Required parts: 45µF Dual Run Capacitor.",
        category: "hvac",
        urgency: "urgent",
        customerLocation: { lat: 17.4375, lng: 78.4482 }, // Ameerpet Main Road
        customerAddress: "Ameerpet Main Road, Hyderabad",
        priceCeilingPaise: 280000,
        requiredParts: [
          { name: "45µF Dual Run Motor Capacitor", quantity: 1 },
        ],
        sowId: "65f01234567890abcdef3001",
        createdAt: new Date(Date.now() - 1000 * 60 * 12), // 12 mins ago
      },
      {
        _id: "lead_req_02",
        serviceRequestId: "65f01234567890abcdef2002",
        title: "Kitchen Sink P-Trap Slip Joint Leak",
        description: "Constant dripping under main basin into vanity cabinet. Dislodged beveled washer and loose locknut.",
        category: "plumbing",
        urgency: "routine",
        customerLocation: { lat: 17.4420, lng: 78.4410 }, // SR Nagar
        customerAddress: "SR Nagar Road, Ameerpet, Hyderabad",
        priceCeilingPaise: 111014,
        requiredParts: [
          { name: "Rigid Anti-Odor Bottle P-Trap Assembly", quantity: 1 },
          { name: "Solid Brass Quarter-Turn Angle Valve", quantity: 1 },
        ],
        sowId: "65f01234567890abcdef3002",
        createdAt: new Date(Date.now() - 1000 * 60 * 45), // 45 mins ago
      },
      {
        _id: "lead_req_03",
        serviceRequestId: "65f01234567890abcdef2003",
        title: "Main Distribution Board Sparking on Geyser Load",
        description: "Heavy burning odor detected from electrical DB box when water heater activates. 32A isolator terminal loose.",
        category: "electrical",
        urgency: "emergency",
        customerLocation: { lat: 17.4440, lng: 78.4600 }, // Begumpet
        customerAddress: "Begumpet Airport Road, Hyderabad",
        priceCeilingPaise: 350000,
        requiredParts: [
          { name: "32A Double Pole Main Isolator Switch", quantity: 1 },
          { name: "16A Single Pole Type-C MCB Breaker", quantity: 1 },
        ],
        sowId: "65f01234567890abcdef3003",
        createdAt: new Date(Date.now() - 1000 * 60 * 5), // 5 mins ago
      },
    ];

    // Combine pro van inventory from memory store and seed
    const proInventory = Array.from(memoryStore.inventory.values())
      .filter((item) => item.professionalId === pro.id)
      .map((item) => ({ name: item.name, quantity: item.quantity }));

    // If memory store has no specific inventory for this pro, use seed
    const activeInventory =
      proInventory.length > 0
        ? proInventory
        : pro.inventory.map((i) => ({ name: i.name, quantity: i.quantity }));

    const scoredLeads = defaultLeads
      .filter((lead) => {
        if (categoryFilter && lead.category !== categoryFilter) return false;
        return true;
      })
      .map((lead) => {
        const proCoords = { lat: pro.coordinates[1], lng: pro.coordinates[0] };
        const distanceKm = calculateHaversineDistanceKm(
          proCoords,
          lead.customerLocation
        );
        const etaMinutes = estimateDriveTimeMinutes(distanceKm);
        const { score: inventoryScore, details: inventoryMatches } =
          scoreVanInventory(lead.requiredParts, activeInventory);

        const proximityScore = scoreProximity(distanceKm, pro.serviceRadiusKm);
        const matchScore = Math.round(proximityScore + inventoryScore + 25); // Baseline skill + trust

        const allPartsInStock = inventoryMatches.every((p) => p.inStock);

        return {
          id: lead._id,
          serviceRequestId: lead.serviceRequestId,
          sowId: lead.sowId,
          title: lead.title,
          description: lead.description,
          category: lead.category,
          urgency: lead.urgency,
          customerAddress: lead.customerAddress,
          distanceKm,
          estimatedArrivalMinutes: etaMinutes,
          lockedPricePaise: lead.priceCeilingPaise,
          matchScore,
          allPartsInStock,
          vanInventoryMatches: inventoryMatches,
          createdAt: lead.createdAt,
        };
      })
      .sort((a, b) => {
        // Emergency jobs top priority, then match score
        if (a.urgency === "emergency" && b.urgency !== "emergency") return -1;
        if (b.urgency === "emergency" && a.urgency !== "emergency") return 1;
        return b.matchScore - a.matchScore;
      });

    return NextResponse.json({
      success: true,
      data: scoredLeads,
      meta: {
        proId: pro.id,
        proName: pro.businessName,
        proCategory: pro.category,
        online: pro.isOnline,
        totalLeadsCount: scoredLeads.length,
      },
    });
  } catch (error) {
    console.error("Error generating jobs feed:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve jobs feed" },
      { status: 500 }
    );
  }
}

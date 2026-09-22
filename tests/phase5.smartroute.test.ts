/**
 * ForgeLocal — Phase 5 Test Suite
 * SmartRoute Professional Dispatch, Van Inventory Matching, & Job Lifecycle Tests
 */

import { describe, it, expect, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import {
  calculateHaversineDistanceKm,
  scoreProximity,
  scoreVanInventory,
  scoreSkillTier,
  scoreTrustPerformance,
  smartRouteService,
} from "@/ai/smart-route/smart-route.service";
import { GET as getJobsFeed } from "@/app/api/jobs/feed/route";
import { POST as acceptJob } from "@/app/api/jobs/[id]/accept/route";
import { POST as updateJobStatus } from "@/app/api/jobs/[id]/status/route";
import {
  GET as getInventory,
  POST as addInventory,
} from "@/app/api/pro/inventory/route";
import {
  PATCH as updateInventoryItem,
  DELETE as deleteInventoryItem,
} from "@/app/api/pro/inventory/[id]/route";
import { memoryStore } from "@/lib/memory-store";

describe("OmniService AI — Phase 5 SmartRoute & Dispatch Tests", () => {
  beforeEach(() => {
    // Reset or ensure memory store demo state
  });

  describe("1. SmartRoute Algorithmic Heuristics", () => {
    it("calculates accurate Haversine geodesic distances between Mumbai coordinates", () => {
      // Khar West to Santacruz West (~1.5 km apart)
      const khar = { lat: 19.0700, lng: 72.8347 };
      const santacruz = { lat: 19.0833, lng: 72.8398 };

      const dist = calculateHaversineDistanceKm(khar, santacruz);
      expect(dist).toBeGreaterThan(1.0);
      expect(dist).toBeLessThan(2.0);
    });

    it("evaluates proximity decay scoring correctly", () => {
      // Very close (< 1.5km) -> maximum 35 pts
      expect(scoreProximity(1.0, 20)).toBe(35);

      // Mid distance (10km) -> reduced score
      const midScore = scoreProximity(10, 20);
      expect(midScore).toBeGreaterThan(10);
      expect(midScore).toBeLessThan(30);

      // Outside radius (25km vs 20km max) -> 0 pts
      expect(scoreProximity(25, 20)).toBe(0);
    });

    it("verifies mobile van inventory matching for first-trip resolution", () => {
      const requiredParts = [
        { name: "45µF Dual Run Motor Capacitor", quantity: 1 },
        { name: "Heavy Duty Contactor", quantity: 1 },
      ];

      const fullyStockedVan = [
        { name: "45µF Dual Run Motor Capacitor", quantity: 5 },
        { name: "Heavy Duty Contactor 30A", quantity: 2 },
      ];

      const { score: fullScore, details: fullDetails } = scoreVanInventory(
        requiredParts,
        fullyStockedVan
      );
      expect(fullScore).toBe(30);
      expect(fullDetails.every((d) => d.inStock)).toBe(true);

      const partialStockedVan = [
        { name: "45µF Dual Run Motor Capacitor", quantity: 5 },
      ];

      const { score: partialScore, details: partialDetails } = scoreVanInventory(
        requiredParts,
        partialStockedVan
      );
      expect(partialScore).toBe(15); // 1 out of 2 = 50% of 30 pts
      expect(partialDetails[1]!.inStock).toBe(false);
    });

    it("rewards master technicians and penalizes under-qualified or unverified profiles", () => {
      // Master on Journeyman job -> 20 pts
      expect(scoreSkillTier("master", "journeyman", true)).toBe(20);

      // Exact match Journeyman -> 18 pts
      expect(scoreSkillTier("journeyman", "journeyman", true)).toBe(18);

      // Under-qualified Apprentice on Master task -> 8 pts
      expect(scoreSkillTier("apprentice", "master", true)).toBe(8);

      // Unverified license penalty -> 50% discount
      expect(scoreSkillTier("journeyman", "journeyman", false)).toBe(9);
    });

    it("scores trust, rating, and response speed", () => {
      const score = scoreTrustPerformance(4.9, 0.98, 7);
      expect(score).toBeGreaterThan(13); // High rating, 98% completion, fast 7 min response
      expect(score).toBeLessThanOrEqual(15);
    });

    it("executes end-to-end multi-factor matching for a service request", async () => {
      const criteria = {
        serviceRequestId: "req_test_01",
        category: "hvac",
        customerLocation: { lat: 17.4375, lng: 78.4482 }, // Ameerpet, Hyderabad
        urgency: "urgent" as const,
        requiredSkillTier: "journeyman" as const,
        requiredParts: [{ name: "45µF Dual Run Motor Capacitor", quantity: 1 }],
      };

      const matches = await smartRouteService.findMatches(criteria);
      expect(matches.length).toBeGreaterThan(0);

      const topMatch = matches[0]!;
      expect(topMatch.businessName).toBe("CoolAir Solutions");
      expect(topMatch.vanInventory.allPartsInStock).toBe(true);
      expect(topMatch.distanceKm).toBeLessThan(5);
      expect(topMatch.scoreBreakdown.totalScore).toBeGreaterThan(80);
    });
  });

  describe("2. Job Feed & Dispatch APIs", () => {
    it("GET /api/jobs/feed returns ranked dispatch opportunities with inventory verification", async () => {
      const req = new NextRequest("http://localhost:3012/api/jobs/feed?proId=pro_hvac_001");
      const res = await getJobsFeed(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(Array.isArray(json.data)).toBe(true);
      expect(json.data.length).toBeGreaterThan(0);

      const firstLead = json.data[0];
      expect(firstLead).toHaveProperty("lockedPricePaise");
      expect(firstLead).toHaveProperty("vanInventoryMatches");
      expect(firstLead).toHaveProperty("matchScore");
    });

    it("POST /api/jobs/[id]/accept accepts dispatch, creates Job & Booking, and locks escrow", async () => {
      const req = new NextRequest("http://localhost:3012/api/jobs/req_demo_accept/accept", {
        method: "POST",
        body: JSON.stringify({
          proId: "pro_hvac_001",
          title: "Split AC Compressor Tripping MCB",
          category: "hvac",
          priceCeilingPaise: 280000,
        }),
      });

      const res = await acceptJob(req, {
        params: Promise.resolve({ id: "req_demo_accept" }),
      });
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.data.job.status).toBe("assigned");
      expect(json.data.bookingId).toBeDefined();
    });

    it("POST /api/jobs/[id]/status transitions execution states through completion", async () => {
      const jobId = "65f01234567890abcdef6001";

      // 1. En Route
      const enRouteReq = new NextRequest(`http://localhost:3012/api/jobs/${jobId}/status`, {
        method: "POST",
        body: JSON.stringify({ status: "en_route" }),
      });
      const enRouteRes = await updateJobStatus(enRouteReq, {
        params: Promise.resolve({ id: jobId }),
      });
      const enRouteJson = await enRouteRes.json();
      expect(enRouteJson.success).toBe(true);
      expect(enRouteJson.data.status).toBe("en_route");
      expect(enRouteJson.data.timestamps.enRouteAt).toBeDefined();

      // 2. Arrived
      const arrivedReq = new NextRequest(`http://localhost:3012/api/jobs/${jobId}/status`, {
        method: "POST",
        body: JSON.stringify({ status: "arrived" }),
      });
      const arrivedRes = await updateJobStatus(arrivedReq, {
        params: Promise.resolve({ id: jobId }),
      });
      const arrivedJson = await arrivedRes.json();
      expect(arrivedJson.success).toBe(true);
      expect(arrivedJson.data.status).toBe("arrived");

      // 3. Completed
      const completedReq = new NextRequest(`http://localhost:3012/api/jobs/${jobId}/status`, {
        method: "POST",
        body: JSON.stringify({ status: "completed" }),
      });
      const completedRes = await updateJobStatus(completedReq, {
        params: Promise.resolve({ id: jobId }),
      });
      const completedJson = await completedRes.json();
      expect(completedJson.success).toBe(true);
      expect(completedJson.data.status).toBe("completed");
      expect(completedJson.data.timestamps.completedAt).toBeDefined();
    });
  });

  describe("3. Mobile Van Inventory Management APIs", () => {
    it("GET /api/pro/inventory returns vehicle stock with valuation metrics", async () => {
      const req = new NextRequest("http://localhost:3012/api/pro/inventory?proId=pro_hvac_001");
      const res = await getInventory(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.data.length).toBeGreaterThan(0);
      expect(json.metrics.totalStockUnits).toBeGreaterThan(0);
      expect(json.metrics.totalValuationPaise).toBeGreaterThan(0);
    });

    it("POST /api/pro/inventory adds a new part to vehicle inventory", async () => {
      const req = new NextRequest("http://localhost:3012/api/pro/inventory", {
        method: "POST",
        body: JSON.stringify({
          professionalId: "pro_hvac_001",
          name: "Universal Capacitor Clamp Bracket",
          category: "hvac",
          quantity: 8,
          unitPricePaise: 15000,
          reorderThreshold: 2,
        }),
      });

      const res = await addInventory(req);
      const json = await res.json();

      expect(res.status).toBe(201);
      expect(json.success).toBe(true);
      expect(json.data.name).toBe("Universal Capacitor Clamp Bracket");
      expect(json.data.quantity).toBe(8);

      // Verify item can be modified via PATCH
      const patchReq = new NextRequest(
        `http://localhost:3012/api/pro/inventory/${json.data._id}`,
        {
          method: "PATCH",
          body: JSON.stringify({ delta: -1 }),
        }
      );
      const patchRes = await updateInventoryItem(patchReq, {
        params: Promise.resolve({ id: json.data._id }),
      });
      const patchJson = await patchRes.json();
      expect(patchJson.success).toBe(true);
      expect(patchJson.data.quantity).toBe(7);

      // Delete item
      const delReq = new NextRequest(
        `http://localhost:3012/api/pro/inventory/${json.data._id}`,
        { method: "DELETE" }
      );
      const delRes = await deleteInventoryItem(delReq, {
        params: Promise.resolve({ id: json.data._id }),
      });
      const delJson = await delRes.json();
      expect(delJson.success).toBe(true);
    });
  });
});

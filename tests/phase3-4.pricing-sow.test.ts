import { describe, it, expect } from "vitest";
import mongoose from "mongoose";
import { NextRequest } from "next/server";
import { calculateEstimate } from "@/ai/pricing/pricing-engine";
import { getLaborRateForCategory } from "@/ai/pricing/labor-rates";
import { findPartByKeyword, PARTS_CATALOG } from "@/ai/pricing/parts-catalog";
import { inspectAIService } from "@/ai/inspect-ai/inspect-ai.service";
import { GET as getSow } from "@/app/api/sow/[id]/route";
import { POST as approveSow } from "@/app/api/sow/[id]/approve/route";
import { POST as escalateSow } from "@/app/api/sow/[id]/escalate/route";
import { GET as getChangeOrders, POST as createChangeOrder } from "@/app/api/change-orders/route";
import { POST as approveChangeOrder } from "@/app/api/change-orders/[id]/approve/route";
import { POST as declineChangeOrder } from "@/app/api/change-orders/[id]/decline/route";

describe("OmniService AI — Phase 3 & 4 Pricing Engine & Scope Validation Tests", () => {
  describe("Deterministic Pricing Engine (Phase 4)", () => {
    it("correctly identifies labor rate cards and minimum callouts for trades", () => {
      const plumbingRate = getLaborRateForCategory("plumbing");
      expect(plumbingRate.baseHourlyRatePaise).toBe(50000); // ₹500/hr
      expect(plumbingRate.minimumCalloutPaise).toBe(35000); // ₹350 min callout

      const electricalRate = getLaborRateForCategory("electrical");
      expect(electricalRate.baseHourlyRatePaise).toBe(55000); // ₹550/hr

      const hvacRate = getLaborRateForCategory("hvac");
      expect(hvacRate.baseHourlyRatePaise).toBe(70000); // ₹700/hr
    });

    it("matches parts from catalog with wholesale and retail prices in paise", () => {
      const washer = findPartByKeyword("32mm washer");
      expect(washer).toBeDefined();
      expect(washer?.retailPricePaise).toBe(8000); // ₹80.00
      expect(washer?.unitCostPaise).toBe(4000); // ₹40.00 wholesale

      const tape = findPartByKeyword("thread seal tape");
      expect(tape).toBeDefined();
      expect(tape?.retailPricePaise).toBe(6000); // ₹60.00
    });

    it("calculates deterministic estimate with labor, parts, 12% fee, and 18% GST", () => {
      const estimate = calculateEstimate({
        categorySlug: "plumbing",
        urgency: "routine",
        tasks: [
          {
            stepNumber: 1,
            taskTitle: "Disassemble P-trap",
            description: "Remove slip joints",
            estimatedMinutes: 30,
            skillLevelRequired: "journeyman",
          },
          {
            stepNumber: 2,
            taskTitle: "Install washer & seal",
            description: "Replace gasket and test",
            estimatedMinutes: 30,
            skillLevelRequired: "journeyman",
          },
        ],
        parts: [
          {
            partName: "32mm Beveled Washer",
            specification: "EPDM washer",
            quantity: 1,
            estimatedUnitCostPaise: 8000,
          },
          {
            partName: "PTFE Thread Seal Tape",
            specification: "12mm x 10m tape",
            quantity: 1,
            estimatedUnitCostPaise: 6000,
          },
        ],
      });

      // Total labor = 60 minutes = 1 hour
      // Base plumbing rate ₹500 = 50,000 paise * 1.0 journeyman = 50,000 paise
      expect(estimate.laborMinutes).toBe(60);
      expect(estimate.partsTotalPaise).toBe(14000); // ₹140.00
      expect(estimate.laborTotalPaise).toBe(50000); // ₹500.00

      // Platform protection fee = 12% of (parts + labor) = 12% of (14000 + 50000) = 7,680
      const expectedPlatformFee = Math.round((14000 + 50000) * 0.12);
      expect(estimate.platformProtectionFeePaise).toBe(expectedPlatformFee);

      // Subtotal
      const expectedSubtotal = 14000 + 50000 + expectedPlatformFee;
      expect(estimate.subtotalPaise).toBe(expectedSubtotal);

      // Tax = 18% GST
      const expectedTax = Math.round(expectedSubtotal * 0.18);
      expect(estimate.taxPaise).toBe(expectedTax);

      // Guaranteed Price Ceiling
      expect(estimate.totalPricePaise).toBe(expectedSubtotal + expectedTax);
      expect(estimate.guaranteedCeilingPaise).toBe(estimate.totalPricePaise);
    });

    it("enforces minimum callout rate for short duration tasks", () => {
      const estimate = calculateEstimate({
        categorySlug: "plumbing",
        urgency: "routine",
        tasks: [
          {
            stepNumber: 1,
            taskTitle: "Tighten aerator",
            description: "Quick 10 minute fix",
            estimatedMinutes: 10,
            skillLevelRequired: "apprentice",
          },
        ],
        parts: [],
      });

      // 10 minutes raw labor would be (10/60) * 50,000 * 0.85 = ~7,083 paise
      // But minimum callout for plumbing is 35,000 paise
      expect(estimate.laborTotalPaise).toBe(35000);
    });

    it("applies emergency urgency multiplier of 1.5x", () => {
      const estimate = calculateEstimate({
        categorySlug: "plumbing",
        urgency: "emergency",
        tasks: [
          {
            stepNumber: 1,
            taskTitle: "Burst Pipe Isolation",
            description: "Emergency main shutoff and pipe sleeve clamp",
            estimatedMinutes: 60,
            skillLevelRequired: "master",
          },
        ],
        parts: [],
      });

      // Plumbing ₹500/hr * 1.35 (master) * 1.5 (emergency) = 50000 * 1.35 * 1.5 = 101,250 paise
      expect(estimate.effectiveHourlyRatePaise).toBe(101250);
      expect(estimate.laborTotalPaise).toBe(101250);
    });
  });

  describe("InspectAI Diagnostic Pipeline & SOW Generation", () => {
    const testRequestId = "65f01234567890abcdef2001";
    let createdSowId: string;

    it("executes InspectAI pipeline, persists diagnostic findings, and locks SOW", async () => {
      const output = await inspectAIService.runDiagnostic(testRequestId);

      expect(output.requestId).toBe(testRequestId);
      expect(output.sowId).toBeDefined();
      expect(output.estimateId).toBeDefined();
      expect(output.confidence).toBeGreaterThan(0.8);
      expect(output.findingsCount).toBeGreaterThanOrEqual(1);
      expect(output.pricing.totalPricePaise).toBeGreaterThan(0);

      createdSowId = output.sowId;
    });

    it("GET /api/sow/[id] returns SOW, diagnostic findings, and pricing breakdown", async () => {
      const req = new NextRequest(`http://localhost:3000/api/sow/${createdSowId}`);
      const res = await getSow(req, { params: Promise.resolve({ id: createdSowId }) });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.success).toBe(true);
      expect(body.sow._id).toBe(createdSowId);
      expect(body.estimate).toBeDefined();
      expect(body.findings.length).toBeGreaterThanOrEqual(1);
    });

    it("POST /api/sow/[id]/escalate routes request to master technician review", async () => {
      const req = new NextRequest(`http://localhost:3000/api/sow/${createdSowId}/escalate`, {
        method: "POST",
        body: JSON.stringify({ reason: "Customer questions whether the valve also needs replacement" }),
      });
      const res = await escalateSow(req, { params: Promise.resolve({ id: createdSowId }) });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.success).toBe(true);
      expect(body.message).toContain("master technician");
    });

    it("POST /api/sow/[id]/approve locks price ceiling and advances status to sow_approved", async () => {
      const req = new NextRequest(`http://localhost:3000/api/sow/${createdSowId}/approve`, {
        method: "POST",
      });
      const res = await approveSow(req, { params: Promise.resolve({ id: createdSowId }) });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.success).toBe(true);
      expect(body.message).toContain("Scope of work approved");
      expect(body.totalPaise).toBeGreaterThan(0);
    });
  });

  describe("Digital Change Order Workflow (Phase 4)", () => {
    const testSowId = "65f01234567890abcdef3001";
    let testChangeOrderId: string;

    it("POST /api/change-orders creates change order with delta pricing and photographic proof", async () => {
      const req = new NextRequest("http://localhost:3000/api/change-orders", {
        method: "POST",
        body: JSON.stringify({
          scopeOfWorkId: testSowId,
          title: "Corroded Drywall Shutoff Valve",
          reason: "Found heavily rusted angle valve when closing water supply",
          discoveryDescription: "Metal oxide scaling makes shutoff valve inoperable without snapping.",
          additionalWorkDescription: "Replace brass angle valve and connect braided connector",
          additionalPartsPaise: 45000, // ₹450
          additionalLaborPaise: 35000, // ₹350
          evidenceMedia: [
            {
              url: "https://mock-storage.omniservice.volcanic.world/evidence/corroded_valve.jpg",
              type: "image",
            },
          ],
        }),
      });

      const res = await createChangeOrder(req);
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.success).toBe(true);

      const co = body.changeOrder;
      expect(co).toBeDefined();
      expect(co.status).toBe("submitted");
      expect(co.additionalPartsPaise).toBe(45000);
      expect(co.additionalLaborPaise).toBe(35000);

      // Delta: subtotal = 80000; 12% platform fee = 9600; tax = 18% of 89600 = 16128
      // additionalTotal = 80000 + 9600 + 16128 = 105728 paise
      expect(co.additionalTotalPaise).toBe(105728);
      expect(co.newTotalPaise).toBe(111014 + 105728);

      testChangeOrderId = co._id;
    });

    it("GET /api/change-orders returns change orders for a Scope of Work", async () => {
      const req = new NextRequest(`http://localhost:3000/api/change-orders?scopeOfWorkId=${testSowId}`);
      const res = await getChangeOrders(req);

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.success).toBe(true);
      expect(body.changeOrders.length).toBeGreaterThanOrEqual(1);
    });

    it("POST /api/change-orders/[id]/approve creates immutable revised SOW v2 and updates escrow ceiling", async () => {
      const req = new NextRequest(`http://localhost:3000/api/change-orders/${testChangeOrderId}/approve`, {
        method: "POST",
      });
      const res = await approveChangeOrder(req, { params: Promise.resolve({ id: testChangeOrderId }) });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.success).toBe(true);
      expect(body.revisedSowId).toBeDefined();
      expect(body.newTotalPaise).toBeGreaterThan(111014);
    });

    it("POST /api/change-orders/[id]/decline allows customer to reject additional scope", async () => {
      // First create a new change order to decline
      const createReq = new NextRequest("http://localhost:3000/api/change-orders", {
        method: "POST",
        body: JSON.stringify({
          scopeOfWorkId: testSowId,
          title: "Optional Chrome Escutcheon Plate",
          reason: "Cosmetic upgrade",
          discoveryDescription: "Drywall gap around pipe",
          additionalWorkDescription: "Add decorative plate",
          additionalPartsPaise: 15000,
          additionalLaborPaise: 10000,
        }),
      });
      const createRes = await createChangeOrder(createReq);
      const { changeOrder: newCo } = await createRes.json();

      const declineReq = new NextRequest(`http://localhost:3000/api/change-orders/${newCo._id}/decline`, {
        method: "POST",
        body: JSON.stringify({ reason: "Not needed at this time" }),
      });
      const res = await declineChangeOrder(declineReq, { params: Promise.resolve({ id: newCo._id }) });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.success).toBe(true);
      expect(body.changeOrder.status).toBe("declined");
      expect(body.changeOrder.customerDeclineReason).toBe("Not needed at this time");
    });
  });
});

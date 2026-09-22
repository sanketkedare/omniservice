import { describe, it, expect } from "vitest";
import { homepassService } from "@/lib/homepass/homepass.service";
import { GET as getAppliances, POST as postAppliance } from "@/app/api/homepass/[id]/appliances/route";
import { GET as getRecords, POST as postRecord } from "@/app/api/homepass/[id]/records/route";
import { POST as transferPost } from "@/app/api/homepass/[id]/transfer/route";
import { NextRequest } from "next/server";

describe("OmniService AI — Phase 7 HomePass Digital Property Passport Tests", () => {
  const testPropertyId = "prop_bandra_01";

  describe("1. HomePass Scoring & Predictive AI Engine", () => {
    it("calculates multi-factor health score (0-100) with grade and breakdown", async () => {
      const health = await homepassService.calculateHealthScore(testPropertyId);

      expect(health).toBeDefined();
      expect(health.overallScore).toBeGreaterThanOrEqual(50);
      expect(health.overallScore).toBeLessThanOrEqual(100);
      expect(["A+", "A", "B", "C", "Attention Needed"]).toContain(health.grade);
      expect(health.breakdown.applianceHealth.score).toBeGreaterThan(0);
      expect(health.breakdown.infrastructureMaintenance.score).toBeGreaterThan(0);
      expect(health.breakdown.warrantyCoverage.score).toBeGreaterThan(0);
    });

    it("generates predictive maintenance alerts based on appliance usage and age", async () => {
      const alerts = await homepassService.getPredictiveAlerts(testPropertyId);

      expect(alerts).toBeDefined();
      expect(alerts.length).toBeGreaterThan(0);
      expect(alerts[0]!.title).toBeDefined();
      expect(["urgent", "upcoming", "recommended"]).toContain(alerts[0]!.urgency);
      expect(alerts[0]!.estimatedCostPaise).toBeGreaterThan(0);
    });

    it("generates cryptographic transfer certificate with verifiable hash", async () => {
      const cert = await homepassService.generateTransferCertificate(
        testPropertyId,
        "Prospective Homeowner"
      );

      expect(cert).toBeDefined();
      expect(cert.certificateId).toContain("HP-CERT-");
      expect(cert.transferToken).toContain("TOKEN-");
      expect(cert.cryptographicSignature).toContain("SHA256:OMNISERVICE:HOMEPASS:");
      expect(cert.healthScore).toBeGreaterThan(0);
    });
  });

  describe("2. HomePass API Endpoints", () => {
    it("GET /api/homepass/[id]/appliances returns appliances and health report", async () => {
      const req = new NextRequest(`http://localhost:3012/api/homepass/${testPropertyId}/appliances`);
      const res = await getAppliances(req, { params: Promise.resolve({ id: testPropertyId }) });
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.appliances.length).toBeGreaterThanOrEqual(3);
      expect(data.healthReport).toBeDefined();
      expect(data.predictiveAlerts).toBeDefined();
    });

    it("POST /api/homepass/[id]/appliances registers a new appliance", async () => {
      const body = {
        name: "LG Direct Drive 9kg Washing Machine",
        brand: "LG",
        modelNumber: "FHM1409BDW",
        category: "appliance",
      };

      const req = new NextRequest(`http://localhost:3012/api/homepass/${testPropertyId}/appliances`, {
        method: "POST",
        body: JSON.stringify(body),
      });
      const res = await postAppliance(req, { params: Promise.resolve({ id: testPropertyId }) });
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.appliance.name).toBe(body.name);
      expect(data.appliance.healthScore).toBe(95);
    });

    it("GET /api/homepass/[id]/records returns verified maintenance history", async () => {
      const req = new NextRequest(`http://localhost:3012/api/homepass/${testPropertyId}/records`);
      const res = await getRecords(req, { params: Promise.resolve({ id: testPropertyId }) });
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.records.length).toBeGreaterThanOrEqual(1);
      expect(data.records[0].verifiedBadge).toBe(true);
    });

    it("POST /api/homepass/[id]/records logs a new maintenance event", async () => {
      const body = {
        title: "Main Kitchen Drain Cleanout",
        category: "plumbing",
        performedBy: "Metro Flow Solutions",
        costPaise: 150000,
        summary: "Hydro-jet cleanout of vertical kitchen stack.",
        warrantyMonths: 6,
      };

      const req = new NextRequest(`http://localhost:3012/api/homepass/${testPropertyId}/records`, {
        method: "POST",
        body: JSON.stringify(body),
      });
      const res = await postRecord(req, { params: Promise.resolve({ id: testPropertyId }) });
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.record.title).toBe(body.title);
      expect(data.record.warrantyExpiresAt).toBeDefined();
    });

    it("POST /api/homepass/[id]/transfer issues a transferable certificate via API", async () => {
      const req = new NextRequest(`http://localhost:3012/api/homepass/${testPropertyId}/transfer`, {
        method: "POST",
        body: JSON.stringify({ recipientName: "Vikram Singhania" }),
      });
      const res = await transferPost(req, { params: Promise.resolve({ id: testPropertyId }) });
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.certificate.recipientName).toBe("Vikram Singhania");
      expect(data.certificate.transferToken).toBeDefined();
    });
  });
});

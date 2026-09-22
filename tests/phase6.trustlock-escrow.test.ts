import { describe, it, expect, beforeEach } from "vitest";
import { trustlockService } from "@/ai/trustlock/trustlock.service";
import { escrowService } from "@/lib/escrow/escrow.service";
import { memoryStore } from "@/lib/memory-store";
import { GET as getEvidence, POST as postEvidence } from "@/app/api/evidence/route";
import { POST as verifyPost, GET as verifyGet } from "@/app/api/trustlock/verify/route";
import { POST as releasePost } from "@/app/api/escrow/release/route";
import { POST as disputePost, GET as disputeGet } from "@/app/api/disputes/route";
import { NextRequest } from "next/server";

describe("OmniService AI — Phase 6 TrustLock Evidence & Escrow Tests", () => {
  const testJobId = "job_001";
  const testPaymentId = "pay_001";

  beforeEach(() => {
    // Reset seed payment state for idempotent tests
    if (memoryStore.payments.has(testPaymentId)) {
      const p = memoryStore.payments.get(testPaymentId)!;
      memoryStore.payments.set(testPaymentId, {
        ...p,
        status: "in_escrow",
        releasedAmountPaise: undefined,
        releasedAt: undefined,
      });
    }
  });

  describe("1. TrustLock Visual Verification Service", () => {
    it("evaluates pre vs post work evidence and generates cryptographic proof token", async () => {
      const result = await trustlockService.verifyJob({
        jobId: testJobId,
        professionalId: "pro_plumb_001",
      });

      expect(result).toBeDefined();
      expect(result.jobId).toBe(testJobId);
      expect(result.outcome).toBe("verified");
      expect(result.confidenceScore).toBeGreaterThanOrEqual(0.85);
      expect(result.cryptographicProofToken).toBeDefined();
      expect(result.cryptographicProofToken).toContain("TL-PROOF-");
      expect(result.checklistResults.length).toBe(4);
      expect(result.triggeredPaymentRelease).toBe(true);
    });

    it("requires post-work evidence to certify completion", async () => {
      const emptyJobId = "job_no_post_work";
      const result = await trustlockService.verifyJob({
        jobId: emptyJobId,
      });

      expect(result.outcome).toBe("verification_failed");
      expect(result.triggeredPaymentRelease).toBe(false);
      expect(result.cryptographicProofToken).toBeUndefined();
    });
  });

  describe("2. Evidence API Endpoints", () => {
    it("GET /api/evidence returns evidence records filtered by jobId", async () => {
      const req = new NextRequest(`http://localhost:3012/api/evidence?jobId=${testJobId}`);
      const res = await getEvidence(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.evidence.length).toBeGreaterThanOrEqual(2);
      expect(data.evidence[0].media).toBeDefined();
    });

    it("POST /api/evidence uploads a new evidence checkpoint with geotagging", async () => {
      const body = {
        jobId: testJobId,
        professionalId: "pro_plumb_001",
        type: "functional_test",
        title: "Hydrostatic 15psi pressure hold verification",
        description: "Zero pressure drop observed over 10 min continuous gauge test.",
        media: [
          {
            type: "image",
            url: "/images/OmniService_Icon.png",
            capturedAt: new Date().toISOString(),
            location: { lat: 19.0596, lng: 72.8295 },
          },
        ],
      };

      const req = new NextRequest("http://localhost:3012/api/evidence", {
        method: "POST",
        body: JSON.stringify(body),
      });
      const res = await postEvidence(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.evidence.title).toBe(body.title);
      expect(data.evidence.type).toBe("functional_test");
    });
  });

  describe("3. Escrow State Machine & Release", () => {
    it("POST /api/trustlock/verify runs verification over API", async () => {
      const req = new NextRequest("http://localhost:3012/api/trustlock/verify", {
        method: "POST",
        body: JSON.stringify({ jobId: testJobId }),
      });
      const res = await verifyPost(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.verification.outcome).toBe("verified");
    });

    it("POST /api/escrow/release releases escrow payout with 12% platform fee split", async () => {
      const req = new NextRequest("http://localhost:3012/api/escrow/release", {
        method: "POST",
        body: JSON.stringify({
          jobId: testJobId,
          paymentId: testPaymentId,
          customerId: "user_cust_001",
          rating: 5,
        }),
      });
      const res = await releasePost(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.payment.status).toBe("released");
      expect(data.payment.platformFeePaise).toBe(39360); // 12% of 328000
      expect(data.payment.professionalPayoutPaise).toBe(288640); // 88% of 328000
      expect(data.transaction.type).toBe("funds_released");
    });

    it("POST /api/disputes lodges a dispute and freezes escrow", async () => {
      const req = new NextRequest("http://localhost:3012/api/disputes", {
        method: "POST",
        body: JSON.stringify({
          jobId: "job_dispute_test",
          paymentId: "pay_dispute_test",
          customerId: "user_cust_001",
          reason: "Joint seep still damp",
          description: "Noticed slight moisture around threaded collar after 2 hours.",
        }),
      });
      const res = await disputePost(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.dispute.status).toBe("open");
      expect(data.transaction.type).toBe("dispute_frozen");
    });

    it("GET /api/disputes retrieves active disputes", async () => {
      const req = new NextRequest("http://localhost:3012/api/disputes");
      const res = await disputeGet(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.disputes.length).toBeGreaterThan(0);
    });
  });
});

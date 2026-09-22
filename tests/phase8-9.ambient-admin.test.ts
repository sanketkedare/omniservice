import { describe, it, expect } from "vitest";
import { ambientService } from "@/ai/ambient/ambient.service";
import { memoryStore } from "@/lib/memory-store";
import { POST as chatPost } from "@/app/api/ambient/chat/route";
import { POST as notifPost, GET as notifGet } from "@/app/api/ambient/notifications/route";
import { GET as escrowGet } from "@/app/api/admin/escrow/route";
import { GET as disputesGet, PATCH as disputesPatch } from "@/app/api/admin/disputes/route";
import { GET as inferencesGet } from "@/app/api/admin/ai-inferences/route";
import { GET as logsGet } from "@/app/api/admin/logs/route";
import { GET as settingsGet, PATCH as settingsPatch } from "@/app/api/admin/settings/route";
import { NextRequest } from "next/server";

describe("OmniService AI — Phase 8 & 9 Ambient Services and Admin Governance Tests", () => {
  describe("1. Ambient Services & Conversational AI Intake (Phase 8)", () => {
    it("dispatches transactional multi-channel notifications with templating", async () => {
      const notif = await ambientService.dispatchNotification({
        recipientId: "user_cust_001",
        recipientPhone: "+91 98200 12345",
        channel: "whatsapp",
        template: "job_assigned",
        variables: { proName: "Suresh Kumar", eta: 8 },
      });

      expect(notif).toBeDefined();
      expect(notif._id).toBeDefined();
      expect(notif.channel).toBe("whatsapp");
      expect(notif.body).toContain("Suresh Kumar");
      expect(notif.body).toContain("8 mins");
      expect(notif.status).toBe("delivered");
    });

    it("processes conversational symptoms and pre-fills diagnostic service requests", async () => {
      const plumbingResult = await ambientService.processChatMessage(
        [],
        "My kitchen sink is leaking heavily from the pipe under the counter"
      );

      expect(plumbingResult.detectedCategory).toBe("plumbing");
      expect(plumbingResult.serviceRequestDraft).toBeDefined();
      expect(plumbingResult.serviceRequestDraft?.category).toBe("plumbing");
      expect(plumbingResult.estimatedCostRange).toBeDefined();

      const hvacResult = await ambientService.processChatMessage(
        [],
        "The split AC compressor turns off after 10 minutes and air is not cooling"
      );
      expect(hvacResult.detectedCategory).toBe("hvac");
      expect(hvacResult.detectedUrgency).toBe("high");

      const elecResult = await ambientService.processChatMessage(
        [],
        "MCB switch is sparking and tripping when water heater starts"
      );
      expect(elecResult.detectedCategory).toBe("electrical");
      expect(elecResult.detectedUrgency).toBe("emergency");
    });

    it("POST /api/ambient/chat endpoint processes diagnostic messages", async () => {
      const req = new NextRequest("http://localhost:3012/api/ambient/chat", {
        method: "POST",
        body: JSON.stringify({
          message: "Water purifier is beeping and leaking from bottom filter",
        }),
      });
      const res = await chatPost(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.reply).toBeDefined();
      expect(data.data.detectedCategory).toBe("plumbing");
    });

    it("POST & GET /api/ambient/notifications manages notifications", async () => {
      const postReq = new NextRequest("http://localhost:3012/api/ambient/notifications", {
        method: "POST",
        body: JSON.stringify({
          recipientId: "user_test_notif",
          channel: "sms",
          template: "work_verified",
          variables: { token: "TL-TEST-99" },
        }),
      });
      const postRes = await notifPost(postReq);
      const postData = await postRes.json();

      expect(postRes.status).toBe(200);
      expect(postData.success).toBe(true);

      const getReq = new NextRequest("http://localhost:3012/api/ambient/notifications?recipientId=user_test_notif");
      const getRes = await notifGet(getReq);
      const getData = await getRes.json();

      expect(getRes.status).toBe(200);
      expect(getData.success).toBe(true);
      expect(getData.notifications.length).toBeGreaterThan(0);
    });
  });

  describe("2. Operations & Admin Governance Portal (Phase 9)", () => {
    it("GET /api/admin/escrow returns treasury summary and append-only ledger", async () => {
      const req = new NextRequest("http://localhost:3012/api/admin/escrow");
      const res = await escrowGet(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.summary).toBeDefined();
      expect(data.summary.activeEscrowHoldPaise).toBeGreaterThanOrEqual(0);
      expect(data.ledger.length).toBeGreaterThan(0);
    });

    it("GET & PATCH /api/admin/disputes arbitrates dispute cases", async () => {
      const getReq = new NextRequest("http://localhost:3012/api/admin/disputes");
      const getRes = await disputesGet(getReq);
      const getData = await getRes.json();

      expect(getRes.status).toBe(200);
      expect(getData.success).toBe(true);
      expect(getData.disputes.length).toBeGreaterThan(0);

      const disputeId = getData.disputes[0]._id;
      const patchReq = new NextRequest("http://localhost:3012/api/admin/disputes", {
        method: "PATCH",
        body: JSON.stringify({
          disputeId,
          resolution: "resolved_partial",
          resolutionNote: "Arbitrated 50/50 split settlement.",
          refundAmountPaise: 164000,
        }),
      });
      const patchRes = await disputesPatch(patchReq);
      const patchData = await patchRes.json();

      expect(patchRes.status).toBe(200);
      expect(patchData.success).toBe(true);
      expect(patchData.dispute.status).toBe("resolved_partial");
    });

    it("GET /api/admin/ai-inferences returns model latency and token telemetry", async () => {
      const req = new NextRequest("http://localhost:3012/api/admin/ai-inferences");
      const res = await inferencesGet(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.metrics.totalInferences).toBeGreaterThan(0);
      expect(data.metrics.averageLatencyMs).toBeGreaterThan(0);
      expect(data.recentTelemetry.length).toBeGreaterThan(0);
    });

    it("GET /api/admin/logs returns immutable audit records", async () => {
      const req = new NextRequest("http://localhost:3012/api/admin/logs");
      const res = await logsGet(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.logs.length).toBeGreaterThan(0);
    });

    it("GET & PATCH /api/admin/settings updates marketplace financial parameters", async () => {
      const getReq = new NextRequest("http://localhost:3012/api/admin/settings");
      const getRes = await settingsGet(getReq);
      const getData = await getRes.json();

      expect(getRes.status).toBe(200);
      expect(getData.success).toBe(true);
      expect(getData.settings.platformFeePercent).toBe(12);

      const patchReq = new NextRequest("http://localhost:3012/api/admin/settings", {
        method: "PATCH",
        body: JSON.stringify({
          platformFeePercent: 12,
          gstPercent: 18,
          escrowAutoReleaseHours: 24,
        }),
      });
      const patchRes = await settingsPatch(patchReq);
      const patchData = await patchRes.json();

      expect(patchRes.status).toBe(200);
      expect(patchData.success).toBe(true);
      expect(patchData.settings.platformFeePercent).toBe(12);
    });
  });
});

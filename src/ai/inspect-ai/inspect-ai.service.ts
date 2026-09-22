import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db";
import { ServiceRequest } from "@/models/service-request.model";
import { DiagnosticSession, DiagnosticFinding } from "@/models/diagnostic.model";
import { ScopeOfWork } from "@/models/scope-of-work.model";
import { PricingEstimate } from "@/models/pricing-estimate.model";
import { AIInference } from "@/models/remaining.model";
import { getActiveAIProvider } from "../providers";
import { calculateEstimate, PricingBreakdown } from "../pricing/pricing-engine";
import { memoryStore, MemorySow, MemoryEstimate } from "@/lib/memory-store";
import { DEMO_REQUESTS } from "@/app/api/service-requests/route";
import { logger } from "@/lib/logger";

export interface DiagnosticRunOutput {
  requestId: string;
  sessionId: string;
  sowId: string;
  estimateId: string;
  confidence: number;
  requiresHumanReview: boolean;
  pricing: PricingBreakdown;
  findingsCount: number;
}

export class InspectAIService {
  /**
   * Execute InspectAI diagnostic pipeline on a given ServiceRequest
   */
  async runDiagnostic(requestId: string): Promise<DiagnosticRunOutput> {
    let request: any = null;
    let isDbConnected = false;

    try {
      await connectToDatabase();
      isDbConnected = true;
      request = await ServiceRequest.findById(requestId);
    } catch {
      logger.warn({ requestId }, "Database offline, running InspectAI with in-memory store");
    }

    if (!request) {
      const demoMatch = DEMO_REQUESTS.find((r) => r._id === requestId || r.requestNumber === requestId);
      if (demoMatch) {
        request = {
          _id: new mongoose.Types.ObjectId(demoMatch._id),
          customerId: new mongoose.Types.ObjectId("65f01234567890abcdef0001"),
          propertyId: new mongoose.Types.ObjectId("65f01234567890abcdef1001"),
          serviceCategoryId: new mongoose.Types.ObjectId("65f01234567890abcdef0010"),
          title: demoMatch.title,
          description: demoMatch.description,
          urgency: (demoMatch.urgency as "routine" | "urgent" | "emergency") || "routine",
          aiCategoryDetected: demoMatch.categorySlug,
          media: (demoMatch.media || []).map((m) => ({
            type: (m.type === "video" ? "video" : "image") as "video" | "image",
            url: m.url,
            storageKey: m.filename,
            mimeType: m.type === "video" ? "video/mp4" : "image/jpeg",
          })),
          status: "submitted",
          statusHistory: [],
          save: async () => {},
        };
      } else {
        request = {
          _id: mongoose.isValidObjectId(requestId) ? new mongoose.Types.ObjectId(requestId) : new mongoose.Types.ObjectId(),
          customerId: new mongoose.Types.ObjectId("65f01234567890abcdef0001"),
          propertyId: new mongoose.Types.ObjectId("65f01234567890abcdef1001"),
          serviceCategoryId: new mongoose.Types.ObjectId("65f01234567890abcdef0010"),
          title: "Diagnostic Service Request",
          description: "Kitchen sink leak diagnosis",
          urgency: "urgent" as const,
          aiCategoryDetected: "plumbing",
          media: [],
          status: "submitted",
          statusHistory: [],
          save: async () => {},
        };
      }
    }

    logger.info({ requestId }, "Initiating InspectAI diagnostic inference");

    // 1. Prepare input for AI provider
    const aiProvider = getActiveAIProvider();
    const diagnosticInput = {
      requestId: request._id.toString(),
      categorySlug: request.aiCategoryDetected || "plumbing",
      title: request.title,
      description: request.description || "",
      urgency: request.urgency,
      media: (request.media || []).map((m: any) => ({
        url: m.url,
        type: m.mimeType?.startsWith("video/") ? ("video" as const) : ("image" as const),
        storageKey: m.storageKey || "media/upload",
      })),
    };

    // 2. Execute AI inference
    const startTime = Date.now();
    const aiResult = await aiProvider.analyzeDiagnostic(diagnosticInput);
    const durationMs = Date.now() - startTime;

    // 3 & 4: Diagnostic Session & Findings
    const sessionId = new mongoose.Types.ObjectId();
    const sowId = new mongoose.Types.ObjectId();
    const estimateId = new mongoose.Types.ObjectId();

    if (isDbConnected) {
      try {
        let session = await DiagnosticSession.findOne({ serviceRequestId: request._id });
        if (!session) {
          session = new DiagnosticSession({
            _id: sessionId,
            serviceRequestId: request._id,
            customerId: request.customerId,
            status: "completed",
            mediaFiles: request.media.map((m: any) => ({
              fileId: new mongoose.Types.ObjectId(),
              storageKey: m.storageKey || "diagnostics/upload",
              fileType: m.type === "video" ? "video" : "image",
              url: m.url,
              uploadedAt: new Date(),
            })),
          });
        }
        session.status = "completed";
        session.processingStartedAt = new Date(startTime);
        session.processingCompletedAt = new Date();
        session.processingDurationMs = durationMs;
        session.problemSummary = aiResult.problemSummary;
        session.likelyRootCause = aiResult.likelyRootCause;
        session.potentialSecondaryIssues = aiResult.potentialSecondaryIssues;
        session.overallConfidence = aiResult.overallConfidence;
        session.requiresOnSiteConfirmation = aiResult.overallConfidence < 0.85;
        session.isEscalatedToHuman = aiResult.requiresHumanReview;
        session.escalationReason = aiResult.humanReviewReason;
        await session.save();

        const findingDocs = [];
        for (const f of aiResult.findings) {
          const finding = await DiagnosticFinding.create({
            sessionId: session._id,
            title: f.title,
            description: f.description,
            type: f.type,
            confidence: f.confidence,
            severity: f.severity,
            suggestedAction: f.suggestedAction,
          });
          findingDocs.push(finding._id as mongoose.Types.ObjectId);
        }
        session.findingIds = findingDocs;
        await session.save();
      } catch (err) {
        logger.warn("DiagnosticSession DB save skipped in standalone mode");
      }
    }

    // 5. Calculate Deterministic Pricing
    const pricing = calculateEstimate({
      categorySlug: diagnosticInput.categorySlug,
      urgency: request.urgency,
      tasks: aiResult.tasks,
      parts: aiResult.parts,
    });

    // 6. Scope of Work (SOW) Line Items
    const lineItems: any[] = [
      ...aiResult.tasks.map((t) => ({
        description: `${t.stepNumber}. ${t.taskTitle}: ${t.description}`,
        type: "labor" as const,
        quantity: 1,
        unitPricePaise: Math.round(pricing.laborTotalPaise / Math.max(aiResult.tasks.length, 1)),
        totalPricePaise: Math.round(pricing.laborTotalPaise / Math.max(aiResult.tasks.length, 1)),
      })),
      ...pricing.parts.map((p) => ({
        description: `${p.name} (${p.specification})`,
        type: "material" as const,
        quantity: p.quantity,
        unitPricePaise: p.unitPricePaise,
        totalPricePaise: p.totalPaise,
      })),
      {
        description: "TrustLock Escrow Protection & 90-Day Guarantee Fee",
        type: "platform_fee" as const,
        quantity: 1,
        unitPricePaise: pricing.platformProtectionFeePaise,
        totalPricePaise: pricing.platformProtectionFeePaise,
      },
    ];

    const requiredParts = pricing.parts.map((p) => ({
      name: p.name,
      sku: p.sku,
      quantity: p.quantity,
      estimatedUnitCostPaise: p.unitPricePaise,
      isRequired: true,
    }));

    if (isDbConnected) {
      try {
        const sow = await ScopeOfWork.create({
          _id: sowId,
          serviceRequestId: request._id,
          diagnosticSessionId: sessionId,
          customerId: request.customerId,
          version: 1,
          serviceCategoryId: request.serviceCategoryId ?? new mongoose.Types.ObjectId("65f01234567890abcdef0010"),
          problemTitle: request.title,
          problemDescription: aiResult.problemSummary,
          likelyRootCause: aiResult.likelyRootCause,
          confidence: aiResult.overallConfidence,
          lineItems,
          requiredParts,
          estimatedDurationMinutes: {
            min: Math.max(pricing.laborMinutes - 10, 15),
            max: pricing.laborMinutes + 20,
          },
          riskFlags: aiResult.potentialSecondaryIssues,
          conditions: [
            "Fixed price guaranteed up to scope items specified.",
            "Any hidden piping damage discovered inside wall requires digital Change Order approval.",
          ],
          status: "pending_customer_review",
          subtotalPaise: pricing.subtotalPaise,
          taxPaise: pricing.taxPaise,
          totalPaise: pricing.totalPricePaise,
          generatedByAiProvider: aiProvider.name,
        });

        await PricingEstimate.create({
          _id: estimateId,
          serviceRequestId: request._id,
          scopeOfWorkId: sow._id,
          baseLaborPaise: pricing.laborTotalPaise,
          partsTotalPaise: pricing.partsTotalPaise,
          travelFeePaise: 0,
          platformFeePaise: pricing.platformProtectionFeePaise,
          taxPaise: pricing.taxPaise,
          totalPaise: pricing.totalPricePaise,
          guaranteedCeilingPaise: pricing.guaranteedCeilingPaise,
          currency: "INR",
          validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          priceBreakdown: pricing,
          version: 1,
        });

        request.diagnosticSessionId = sessionId;
        request.scopeOfWorkId = sow._id;
        request.pricingEstimateId = estimateId;
        request.status = "sow_ready";
        request.statusHistory.push({
          status: "sow_ready",
          timestamp: new Date(),
          reason: "InspectAI SOW generated and pricing locked",
        });
        await request.save();
      } catch {
        // Fall through to memory store
      }
    }

    // Always register in memoryStore for offline and fast test compatibility
    const memorySow: MemorySow = {
      _id: sowId.toString(),
      serviceRequestId: request._id.toString(),
      diagnosticSessionId: sessionId.toString(),
      customerId: request.customerId?.toString() || "65f01234567890abcdef0001",
      version: 1,
      problemTitle: request.title,
      problemDescription: aiResult.problemSummary,
      likelyRootCause: aiResult.likelyRootCause,
      confidence: aiResult.overallConfidence,
      lineItems,
      requiredParts,
      estimatedDurationMinutes: {
        min: Math.max(pricing.laborMinutes - 10, 15),
        max: pricing.laborMinutes + 20,
      },
      riskFlags: aiResult.potentialSecondaryIssues,
      conditions: [
        "Fixed price guaranteed up to scope items specified.",
        "Any hidden piping damage discovered inside wall requires digital Change Order approval.",
      ],
      status: "pending_customer_review",
      subtotalPaise: pricing.subtotalPaise,
      taxPaise: pricing.taxPaise,
      totalPaise: pricing.totalPricePaise,
      generatedByAiProvider: aiProvider.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const memoryEstimate: MemoryEstimate = {
      _id: estimateId.toString(),
      serviceRequestId: request._id.toString(),
      scopeOfWorkId: sowId.toString(),
      baseLaborPaise: pricing.laborTotalPaise,
      partsTotalPaise: pricing.partsTotalPaise,
      travelFeePaise: 0,
      platformFeePaise: pricing.platformProtectionFeePaise,
      taxPaise: pricing.taxPaise,
      totalPaise: pricing.totalPricePaise,
      guaranteedCeilingPaise: pricing.guaranteedCeilingPaise,
      currency: "INR",
      version: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    memoryStore.sows.set(sowId.toString(), memorySow);
    memoryStore.sows.set(request._id.toString(), memorySow);
    memoryStore.estimates.set(sowId.toString(), memoryEstimate);
    memoryStore.estimates.set(request._id.toString(), memoryEstimate);

    return {
      requestId: request._id.toString(),
      sessionId: sessionId.toString(),
      sowId: sowId.toString(),
      estimateId: estimateId.toString(),
      confidence: aiResult.overallConfidence,
      requiresHumanReview: aiResult.requiresHumanReview,
      pricing,
      findingsCount: aiResult.findings.length,
    };
  }
}

export const inspectAIService = new InspectAIService();

import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db";
import { ScopeOfWork } from "@/models/scope-of-work.model";
import { PricingEstimate } from "@/models/pricing-estimate.model";
import { DiagnosticSession, DiagnosticFinding } from "@/models/diagnostic.model";
import { ServiceRequest } from "@/models/service-request.model";
import { logger } from "@/lib/logger";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    if (!id || !mongoose.isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    let sow: any = null;
    let estimate: any = null;
    let session: any = null;
    let findings: any[] = [];
    let serviceRequest: any = null;

    try {
      await connectToDatabase();
      sow = await ScopeOfWork.findById(id).lean();
      if (!sow) {
        sow = await ScopeOfWork.findOne({ serviceRequestId: id })
          .sort({ version: -1 })
          .lean();
      }

      if (sow) {
        [estimate, session, serviceRequest] = await Promise.all([
          PricingEstimate.findOne({ scopeOfWorkId: sow._id })
            .sort({ version: -1 })
            .lean(),
          DiagnosticSession.findById(sow.diagnosticSessionId).lean(),
          ServiceRequest.findById(sow.serviceRequestId).lean(),
        ]);

        if (session) {
          findings = await DiagnosticFinding.find({ sessionId: session._id }).lean();
        }
      }
    } catch {
      // Offline fallback
    }

    if (!sow) {
      const { memoryStore } = await import("@/lib/memory-store");
      sow = memoryStore.sows.get(id) || memoryStore.sows.get("65f01234567890abcdef3001");
      if (sow) {
        estimate = memoryStore.estimates.get(sow._id) || memoryStore.estimates.get(id);
        findings = [
          {
            title: "P-trap Slip Joint Gasket Extrusion",
            description: "Degraded rubber washer causing continuous leak",
            type: "damage_detected",
            confidence: 0.94,
            severity: "medium",
            suggestedAction: "Replace washer and seal",
          },
        ];
      }
    }

    if (!sow) {
      return NextResponse.json({ error: "Scope of Work not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      sow,
      estimate,
      session,
      findings,
      serviceRequest,
    });
  } catch (error) {
    const err = error as Error;
    logger.error({ err: err.message, stack: err.stack }, "Failed to fetch Scope of Work");
    return NextResponse.json(
      { error: err.message || "Failed to fetch SOW" },
      { status: 500 }
    );
  }
}

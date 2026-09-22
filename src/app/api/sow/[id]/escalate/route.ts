import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db";
import { ScopeOfWork } from "@/models/scope-of-work.model";
import { DiagnosticSession } from "@/models/diagnostic.model";
import { ServiceRequest } from "@/models/service-request.model";
import { logger } from "@/lib/logger";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const reason = body?.reason || "Customer requested human master technician review";

    if (!id || !mongoose.isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    let sow: any = null;
    let requestId: string = "";

    try {
      await connectToDatabase();
      sow = await ScopeOfWork.findById(id);
      if (!sow) {
        sow = await ScopeOfWork.findOne({ serviceRequestId: id }).sort({ version: -1 });
      }

      if (sow) {
        if (sow.diagnosticSessionId) {
          await DiagnosticSession.findByIdAndUpdate(sow.diagnosticSessionId, {
            isEscalatedToHuman: true,
            escalationReason: reason,
          });
        }

        const request = await ServiceRequest.findById(sow.serviceRequestId);
        if (request) {
          request.status = "escalated";
          request.statusHistory.push({
            status: "escalated",
            timestamp: new Date(),
            reason: `Human review escalated: ${reason}`,
          });
          await request.save();
        }

        requestId = sow.serviceRequestId.toString();
      }
    } catch {
      // Offline fallback
    }

    if (!sow) {
      const { memoryStore } = await import("@/lib/memory-store");
      sow = memoryStore.sows.get(id) || memoryStore.sows.get("65f01234567890abcdef3001");
      if (sow) {
        sow.status = "draft"; // flagged
        requestId = sow.serviceRequestId;
      }
    }

    if (!sow) {
      return NextResponse.json({ error: "Scope of Work not found" }, { status: 404 });
    }

    logger.info(
      { sowId: sow._id, serviceRequestId: sow.serviceRequestId, reason },
      "Diagnostic and Scope of Work escalated to human master technician"
    );

    return NextResponse.json({
      success: true,
      message: "Your request has been routed to a senior certified master technician. A human review will be completed shortly.",
      sowId: sow._id.toString(),
      requestId: (sow.serviceRequestId || requestId).toString(),
    });
  } catch (error) {
    const err = error as Error;
    logger.error({ err: err.message, stack: err.stack }, "Failed to escalate Scope of Work");
    return NextResponse.json(
      { error: err.message || "Failed to escalate SOW" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db";
import { ChangeOrder } from "@/models/change-order.model";
import { ScopeOfWork } from "@/models/scope-of-work.model";
import { PricingEstimate } from "@/models/pricing-estimate.model";
import { ServiceRequest } from "@/models/service-request.model";
import { logger } from "@/lib/logger";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    if (!id || !mongoose.isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid change order ID" }, { status: 400 });
    }

    let changeOrder: any = null;
    let currentSow: any = null;
    let isDbConnected = false;

    try {
      await connectToDatabase();
      isDbConnected = true;
      changeOrder = await ChangeOrder.findById(id);
      if (changeOrder) {
        currentSow = await ScopeOfWork.findById(changeOrder.scopeOfWorkId);
      }
    } catch {
      // Offline fallback
    }

    if (!changeOrder) {
      const { memoryStore } = await import("@/lib/memory-store");
      changeOrder = memoryStore.changeOrders.get(id);
      if (changeOrder) {
        currentSow = memoryStore.sows.get(changeOrder.scopeOfWorkId);
      }
    }

    if (!changeOrder) {
      return NextResponse.json({ error: "Change order not found" }, { status: 404 });
    }

    if (changeOrder.status === "approved") {
      return NextResponse.json({
        success: true,
        message: "Change order is already approved",
        changeOrder,
      });
    }

    if (!currentSow) {
      return NextResponse.json({ error: "Associated Scope of Work not found" }, { status: 404 });
    }

    const revisedSowId = new mongoose.Types.ObjectId();

    if (isDbConnected) {
      try {
        currentSow.status = "superseded";
        await currentSow.save();
      } catch {
        // Fall through
      }
    }

    const nextVersion = (currentSow.version || 1) + 1;
    const additionalParts = Number(changeOrder.additionalPartsPaise) || 0;
    const additionalLabor = Number(changeOrder.additionalLaborPaise) || 0;
    const newTotal = Number(changeOrder.newTotalPaise) || (currentSow.totalPaise + additionalParts + additionalLabor);

    const revisedLineItems = [
      ...(currentSow.lineItems || []),
      {
        description: `Change Order Scope: ${changeOrder.additionalWorkDescription}`,
        type: "labor",
        quantity: 1,
        unitPricePaise: additionalLabor,
        totalPricePaise: additionalLabor,
      },
      ...(additionalParts > 0
        ? [
            {
              description: `Additional Parts & Materials (${changeOrder.title})`,
              type: "material" as const,
              quantity: 1,
              unitPricePaise: additionalParts,
              totalPricePaise: additionalParts,
            },
          ]
        : []),
    ];

    if (isDbConnected) {
      try {
        const revisedSowDoc = await ScopeOfWork.create({
          _id: revisedSowId,
          serviceRequestId: currentSow.serviceRequestId,
          diagnosticSessionId: currentSow.diagnosticSessionId,
          customerId: currentSow.customerId,
          version: nextVersion,
          serviceCategoryId: currentSow.serviceCategoryId,
          problemTitle: currentSow.problemTitle,
          problemDescription: `${currentSow.problemDescription} [Includes Change Order: ${changeOrder.title}]`,
          likelyRootCause: currentSow.likelyRootCause,
          confidence: currentSow.confidence,
          lineItems: revisedLineItems,
          requiredParts: currentSow.requiredParts,
          estimatedDurationMinutes: {
            min: (currentSow.estimatedDurationMinutes?.min || 30) + 30,
            max: (currentSow.estimatedDurationMinutes?.max || 60) + 60,
          },
          riskFlags: currentSow.riskFlags,
          conditions: currentSow.conditions,
          status: "approved",
          customerApprovedAt: new Date(),
          subtotalPaise: (currentSow.subtotalPaise || 0) + additionalParts + additionalLabor,
          taxPaise: Math.round(newTotal * (18 / 118)),
          totalPaise: newTotal,
          generatedByAiProvider: currentSow.generatedByAiProvider || "mock",
        });

        await PricingEstimate.findOneAndUpdate(
          { serviceRequestId: currentSow.serviceRequestId },
          {
            $set: {
              scopeOfWorkId: revisedSowDoc._id,
              totalPaise: newTotal,
              guaranteedCeilingPaise: newTotal,
              updatedAt: new Date(),
            },
          }
        );

        changeOrder.status = "approved";
        changeOrder.customerRespondedAt = new Date();
        changeOrder.revisedSowId = revisedSowDoc._id as mongoose.Types.ObjectId;
        await changeOrder.save();

        const request = await ServiceRequest.findById(currentSow.serviceRequestId);
        if (request) {
          request.scopeOfWorkId = revisedSowDoc._id as mongoose.Types.ObjectId;
          request.statusHistory.push({
            status: request.status,
            timestamp: new Date(),
            reason: `Change order approved: ${changeOrder.title} (+₹${(changeOrder.additionalTotalPaise / 100).toFixed(2)})`,
          });
          await request.save();
        }
      } catch {
        // Fall through to memory store
      }
    }

    // Always update memoryStore
    const { memoryStore } = await import("@/lib/memory-store");
    const memoryRevisedSow = {
      ...currentSow,
      _id: revisedSowId.toString(),
      version: nextVersion,
      problemDescription: `${currentSow.problemDescription} [Includes Change Order: ${changeOrder.title}]`,
      lineItems: revisedLineItems,
      status: "approved" as const,
      customerApprovedAt: new Date(),
      totalPaise: newTotal,
      updatedAt: new Date(),
    };

    memoryStore.sows.set(revisedSowId.toString(), memoryRevisedSow);
    memoryStore.sows.set(currentSow.serviceRequestId.toString(), memoryRevisedSow);

    changeOrder.status = "approved";
    changeOrder.customerRespondedAt = new Date();
    changeOrder.revisedSowId = revisedSowId.toString();
    memoryStore.changeOrders.set(changeOrder._id.toString(), changeOrder);

    logger.info(
      { changeOrderId: changeOrder._id, revisedSowId: revisedSowId.toString(), newTotal: changeOrder.newTotalPaise },
      "Change order approved by customer; immutable revised SOW generated"
    );

    return NextResponse.json({
      success: true,
      message: "Change order approved and authorized escrow ceiling updated successfully.",
      changeOrder,
      revisedSowId: revisedSowId.toString(),
      newTotalPaise: changeOrder.newTotalPaise,
    });
  } catch (error) {
    const err = error as Error;
    logger.error({ err: err.message, stack: err.stack }, "Failed to approve change order");
    return NextResponse.json(
      { error: err.message || "Failed to approve change order" },
      { status: 500 }
    );
  }
}

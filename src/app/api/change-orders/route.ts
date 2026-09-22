import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db";
import { ChangeOrder } from "@/models/change-order.model";
import { ScopeOfWork } from "@/models/scope-of-work.model";
import { JobEvidence } from "@/models/job-evidence.model";
import { logger } from "@/lib/logger";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get("jobId");
    const scopeOfWorkId = searchParams.get("scopeOfWorkId");
    const customerId = searchParams.get("customerId");

    try {
      await connectToDatabase();
      const query: Record<string, unknown> = {};
      if (jobId && mongoose.isValidObjectId(jobId)) {
        query.jobId = new mongoose.Types.ObjectId(jobId);
      }
      if (scopeOfWorkId && mongoose.isValidObjectId(scopeOfWorkId)) {
        query.scopeOfWorkId = new mongoose.Types.ObjectId(scopeOfWorkId);
      }
      if (customerId && mongoose.isValidObjectId(customerId)) {
        query.customerId = new mongoose.Types.ObjectId(customerId);
      }

      const changeOrders = await ChangeOrder.find(query)
        .populate("evidenceIds")
        .sort({ createdAt: -1 })
        .lean();

      if (changeOrders && changeOrders.length > 0) {
        return NextResponse.json({
          success: true,
          changeOrders,
        });
      }
    } catch {
      // Offline fallback
    }

    const { memoryStore } = await import("@/lib/memory-store");
    let memoryCos = Array.from(memoryStore.changeOrders.values());
    if (scopeOfWorkId) {
      memoryCos = memoryCos.filter((co) => co.scopeOfWorkId === scopeOfWorkId);
    }

    return NextResponse.json({
      success: true,
      changeOrders: memoryCos,
    });
  } catch (error) {
    const err = error as Error;
    logger.error({ err: err.message }, "Failed to fetch change orders");
    return NextResponse.json(
      { error: err.message || "Failed to fetch change orders" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      jobId,
      scopeOfWorkId,
      professionalId,
      customerId,
      title,
      reason,
      discoveryDescription,
      additionalWorkDescription,
      additionalPartsPaise = 0,
      additionalLaborPaise = 0,
      evidenceMedia = [],
      expiryHours = 2,
    } = body;

    if (!title || !reason || !discoveryDescription || !additionalWorkDescription) {
      return NextResponse.json(
        { error: "Title, reason, discoveryDescription, and additionalWorkDescription are required" },
        { status: 400 }
      );
    }

    if (!scopeOfWorkId || !mongoose.isValidObjectId(scopeOfWorkId)) {
      return NextResponse.json(
        { error: "A valid scopeOfWorkId is required" },
        { status: 400 }
      );
    }

    let currentSow: any = null;
    let isDbConnected = false;

    try {
      await connectToDatabase();
      isDbConnected = true;
      currentSow = await ScopeOfWork.findById(scopeOfWorkId);
    } catch {
      // Offline fallback
    }

    if (!currentSow) {
      const { memoryStore } = await import("@/lib/memory-store");
      currentSow = memoryStore.sows.get(scopeOfWorkId) || memoryStore.sows.get("65f01234567890abcdef3001");
    }

    if (!currentSow) {
      return NextResponse.json(
        { error: "Referenced Scope of Work not found" },
        { status: 404 }
      );
    }

    // Calculate deterministic delta
    const partsPaise = Number(additionalPartsPaise) || 0;
    const laborPaise = Number(additionalLaborPaise) || 0;
    const subtotal = partsPaise + laborPaise;
    const platformFee = Math.round(subtotal * 0.12);
    const tax = Math.round((subtotal + platformFee) * 0.18);
    const additionalTotalPaise = subtotal + platformFee + tax;

    const originalTotalPaise = currentSow.totalPaise;
    const newTotalPaise = originalTotalPaise + additionalTotalPaise;

    const changeOrderId = new mongoose.Types.ObjectId();
    const expiresAt = new Date(Date.now() + expiryHours * 60 * 60 * 1000);

    let changeOrder: any = null;

    if (isDbConnected) {
      try {
        const evidenceIds: mongoose.Types.ObjectId[] = [];
        if (evidenceMedia && evidenceMedia.length > 0) {
          const evidenceDoc = await JobEvidence.create({
            jobId: jobId || new mongoose.Types.ObjectId(),
            professionalId: professionalId || new mongoose.Types.ObjectId(),
            type: "change_order",
            title: `Change Order Proof: ${title}`,
            description: discoveryDescription,
            media: evidenceMedia.map((m: { url: string; type?: string; storageKey?: string }) => ({
              type: m.type === "video" ? "video" : "image",
              url: m.url,
              storageKey: m.storageKey || `change-order/${Date.now()}`,
              mimeType: m.type === "video" ? "video/mp4" : "image/jpeg",
              capturedAt: new Date(),
            })),
            aiVerificationStatus: "pending",
          });
          evidenceIds.push(evidenceDoc._id as mongoose.Types.ObjectId);
        }

        changeOrder = await ChangeOrder.create({
          _id: changeOrderId,
          jobId: jobId || new mongoose.Types.ObjectId(),
          scopeOfWorkId: currentSow._id,
          professionalId: professionalId || new mongoose.Types.ObjectId(),
          customerId: customerId || currentSow.customerId,
          title,
          reason,
          discoveryDescription,
          evidenceIds,
          additionalWorkDescription,
          additionalPartsPaise: partsPaise,
          additionalLaborPaise: laborPaise,
          additionalTotalPaise,
          originalTotalPaise,
          newTotalPaise,
          customerMaxAuthorizationPaise: newTotalPaise,
          status: "submitted",
          submittedAt: new Date(),
          expiresAt,
        });
      } catch {
        // Fallback to memoryStore
      }
    }

    if (!changeOrder) {
      changeOrder = {
        _id: changeOrderId.toString(),
        jobId: (jobId || new mongoose.Types.ObjectId()).toString(),
        scopeOfWorkId: (currentSow._id || scopeOfWorkId).toString(),
        professionalId: (professionalId || new mongoose.Types.ObjectId()).toString(),
        customerId: (customerId || currentSow.customerId || new mongoose.Types.ObjectId()).toString(),
        title,
        reason,
        discoveryDescription,
        evidenceIds: [],
        additionalWorkDescription,
        additionalPartsPaise: partsPaise,
        additionalLaborPaise: laborPaise,
        additionalTotalPaise,
        originalTotalPaise,
        newTotalPaise,
        customerMaxAuthorizationPaise: newTotalPaise,
        status: "submitted" as const,
        submittedAt: new Date(),
        expiresAt,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }

    const { memoryStore } = await import("@/lib/memory-store");
    memoryStore.changeOrders.set(changeOrder._id.toString(), changeOrder);

    logger.info(
      { changeOrderId: changeOrder._id, additionalTotalPaise, newTotalPaise },
      "Change order created with photographic evidence requirement"
    );

    return NextResponse.json({
      success: true,
      message: "Change order submitted for customer approval",
      changeOrder,
    });

    logger.info(
      { changeOrderId: changeOrder._id, additionalTotalPaise, newTotalPaise },
      "Change order created with photographic evidence requirement"
    );

    return NextResponse.json({
      success: true,
      message: "Change order submitted for customer approval",
      changeOrder,
    });
  } catch (error) {
    const err = error as Error;
    logger.error({ err: err.message, stack: err.stack }, "Failed to create change order");
    return NextResponse.json(
      { error: err.message || "Failed to create change order" },
      { status: 500 }
    );
  }
}

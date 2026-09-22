import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db";
import { ChangeOrder } from "@/models/change-order.model";
import { ServiceRequest } from "@/models/service-request.model";
import { ScopeOfWork } from "@/models/scope-of-work.model";
import { logger } from "@/lib/logger";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const declineReason = body?.reason || "Customer declined additional scope";

    if (!id || !mongoose.isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid change order ID" }, { status: 400 });
    }

    let changeOrder: any = null;
    let isDbConnected = false;

    try {
      await connectToDatabase();
      isDbConnected = true;
      changeOrder = await ChangeOrder.findById(id);
      if (changeOrder) {
        changeOrder.status = "declined";
        changeOrder.customerRespondedAt = new Date();
        changeOrder.customerDeclineReason = declineReason;
        await changeOrder.save();

        const sow = await ScopeOfWork.findById(changeOrder.scopeOfWorkId);
        if (sow) {
          const request = await ServiceRequest.findById(sow.serviceRequestId);
          if (request) {
            request.statusHistory.push({
              status: request.status,
              timestamp: new Date(),
              reason: `Change order declined: ${declineReason}`,
            });
            await request.save();
          }
        }
      }
    } catch {
      // Offline fallback
    }

    if (!changeOrder) {
      const { memoryStore } = await import("@/lib/memory-store");
      changeOrder = memoryStore.changeOrders.get(id);
      if (changeOrder) {
        changeOrder.status = "declined";
        changeOrder.customerRespondedAt = new Date();
        changeOrder.customerDeclineReason = declineReason;
        memoryStore.changeOrders.set(id, changeOrder);
      }
    }

    if (!changeOrder) {
      return NextResponse.json({ error: "Change order not found" }, { status: 404 });
    }

    logger.info(
      { changeOrderId: changeOrder._id, declineReason },
      "Change order declined by customer"
    );

    return NextResponse.json({
      success: true,
      message: "Change order declined. The professional will proceed strictly within the original approved scope.",
      changeOrder,
    });
  } catch (error) {
    const err = error as Error;
    logger.error({ err: err.message, stack: err.stack }, "Failed to decline change order");
    return NextResponse.json(
      { error: err.message || "Failed to decline change order" },
      { status: 500 }
    );
  }
}

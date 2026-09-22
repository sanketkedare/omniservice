import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db";
import { ChangeOrder } from "@/models/change-order.model";
import { ScopeOfWork } from "@/models/scope-of-work.model";
import { logger } from "@/lib/logger";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    if (!id || !mongoose.isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid change order ID" }, { status: 400 });
    }

    await connectToDatabase();

    const changeOrder = await ChangeOrder.findById(id)
      .populate("evidenceIds")
      .lean();

    if (!changeOrder) {
      return NextResponse.json({ error: "Change order not found" }, { status: 404 });
    }

    const sow = await ScopeOfWork.findById(changeOrder.scopeOfWorkId).lean();

    return NextResponse.json({
      success: true,
      changeOrder,
      scopeOfWork: sow,
    });
  } catch (error) {
    const err = error as Error;
    logger.error({ err: err.message }, "Failed to fetch change order");
    return NextResponse.json(
      { error: err.message || "Failed to fetch change order" },
      { status: 500 }
    );
  }
}

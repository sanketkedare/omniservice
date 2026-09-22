import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db";
import { Payment, Job, Professional, User } from "@/models";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    // Determine professional ID from cookie, query param, or fallback to first professional
    const { searchParams } = new URL(req.url);
    let proId = searchParams.get("proId");

    const cookieUser = req.cookies.get("omniservice-user")?.value;
    if (!proId && cookieUser) {
      try {
        const parsed = JSON.parse(decodeURIComponent(cookieUser));
        if (parsed.id) proId = parsed.id;
      } catch {}
    }

    let proObjectId: mongoose.Types.ObjectId | null = null;
    if (proId && mongoose.Types.ObjectId.isValid(proId)) {
      proObjectId = new mongoose.Types.ObjectId(proId);
    } else {
      // Find first professional user in DB if any exists
      const proUser = await User.findOne({ role: "professional" }).lean();
      if (proUser) {
        proObjectId = proUser._id as mongoose.Types.ObjectId;
      }
    }

    let todayRevenuePaise = 0;
    let pendingEscrowPaise = 0;
    let activeJobsCount = 0;
    let completedJobsCount = 0;
    let trustScore = 100;

    if (proObjectId) {
      // 1. Released earnings
      const revenueResult = await Payment.aggregate([
        { $match: { professionalId: proObjectId, status: "released" } },
        { $group: { _id: null, total: { $sum: "$releasedAmountPaise" } } },
      ]);
      todayRevenuePaise = revenueResult[0]?.total || 0;

      // 2. Pending Escrow
      const escrowResult = await Payment.aggregate([
        { $match: { professionalId: proObjectId, status: { $in: ["in_escrow", "authorized"] } } },
        { $group: { _id: null, total: { $sum: "$authorizedAmountPaise" } } },
      ]);
      pendingEscrowPaise = escrowResult[0]?.total || 0;

      // 3. Active Jobs
      activeJobsCount = await Job.countDocuments({
        professionalId: proObjectId,
        status: { $in: ["assigned", "en_route", "in_progress"] },
      });

      // 4. Completed Jobs
      completedJobsCount = await Job.countDocuments({
        professionalId: proObjectId,
        status: "completed",
      });

      // 5. Professional Trust Score from profile if present
      const proProfile = await (Professional as any).findOne({ userId: proObjectId }).lean();
      if (proProfile?.metrics?.completionRate) {
        trustScore = Math.round(proProfile.metrics.completionRate * 100);
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        todayRevenuePaise,
        pendingEscrowPaise,
        activeJobsCount,
        completedJobsCount,
        trustScore,
      },
    });
  } catch (error) {
    console.error("Error fetching pro metrics:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve provider metrics" },
      { status: 500 }
    );
  }
}

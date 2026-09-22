import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db";
import {
  User,
  Professional,
  ServiceRequest,
  Job,
  Payment,
  EscrowTransaction,
  Dispute,
} from "@/models";

export async function GET() {
  try {
    await connectToDatabase();

    // 1. Total Escrow Locked
    const escrowResult = await Payment.aggregate([
      { $match: { status: { $in: ["in_escrow", "authorized"] } } },
      { $group: { _id: null, totalPaise: { $sum: "$authorizedAmountPaise" } } },
    ]);
    const totalEscrowLockedPaise = escrowResult[0]?.totalPaise || 0;

    // 2. InspectAI Inferences (Total Service Requests processed by AI)
    const inspectAiCount = await ServiceRequest.countDocuments({});

    // 3. Active & Verified Professionals
    const [totalPros, verifiedPros] = await Promise.all([
      User.countDocuments({ role: "professional" }),
      Professional.countDocuments({ isVerified: true }),
    ]);

    // 4. Active Dispatched Jobs
    const activeJobsCount = await Job.countDocuments({
      status: { $in: ["assigned", "en_route", "in_progress"] },
    });

    // 5. Open Disputes
    const openDisputesCount = await Dispute.countDocuments({
      status: { $in: ["open", "evidence_collection", "under_review", "escalated"] },
    });

    // 6. Recent Real Platform Events
    const rawTransactions = await (EscrowTransaction as any).find({})
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();

    let recentEvents = rawTransactions.map((tx: any) => {
      const amountPaise = tx.amountPaise || 0;
      const formattedAmount = `₹${(amountPaise / 100).toLocaleString("en-IN")}`;
      let statusBadge = "Processed";
      let variant = "default";

      if (tx.event === "released_to_professional") {
        statusBadge = "Released";
        variant = "success";
      } else if (tx.event === "held" || tx.event === "authorized") {
        statusBadge = "In Escrow";
        variant = "brand";
      } else if (tx.event === "disputed") {
        statusBadge = "Disputed";
        variant = "destructive";
      } else if (tx.event === "refunded_to_customer") {
        statusBadge = "Refunded";
        variant = "warning";
      }

      return {
        id: tx._id ? `TX-${String(tx._id).slice(-4).toUpperCase()}` : "TX-LIVE",
        title: tx.description || `Escrow Event: ${tx.event}`,
        amount: formattedAmount,
        status: statusBadge,
        variant,
        time: tx.createdAt ? new Date(tx.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "Just now",
      };
    });

    // If no escrow transactions yet, check recent payments
    if (recentEvents.length === 0) {
      const rawPayments = await (Payment as any).find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .lean();

      recentEvents = rawPayments.map((p: any) => ({
        id: p._id ? `PAY-${String(p._id).slice(-4).toUpperCase()}` : "PAY-LIVE",
        title: `Payment: ${p.currency || "INR"} ${(p.authorizedAmountPaise / 100).toLocaleString("en-IN")}`,
        amount: `₹${((p.authorizedAmountPaise || 0) / 100).toLocaleString("en-IN")}`,
        status: p.status === "in_escrow" ? "In Escrow" : p.status,
        variant: p.status === "in_escrow" ? "brand" : "default",
        time: p.createdAt ? new Date(p.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "Just now",
      }));
    }

    const isConnected = mongoose.connection.readyState === 1;

    return NextResponse.json({
      success: true,
      data: {
        totalEscrowLockedPaise,
        inspectAiCount,
        activeProsCount: totalPros,
        verifiedProsCount: verifiedPros,
        activeJobsCount,
        openDisputesCount,
        recentEvents,
        subsystems: {
          database: isConnected ? "Healthy" : "Reconnecting",
          objectStorage: "Active",
          aiPipeline: "Nominal",
          trustLockVerifier: "Operational",
        },
      },
    });
  } catch (error) {
    console.error("Error fetching admin metrics:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch platform metrics" },
      { status: 500 }
    );
  }
}

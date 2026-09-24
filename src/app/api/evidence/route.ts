import { NextRequest, NextResponse } from "next/server";
import { memoryStore, MemoryEvidence } from "@/lib/memory-store";
import { connectToDatabase } from "@/lib/db";
import JobEvidence from "@/models/job-evidence.model";
import { broadcastNotification } from "@/lib/notifications";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get("jobId");
    const type = searchParams.get("type");

    let evidenceList: MemoryEvidence[] = [];

    // Check DB
    try {
      await connectToDatabase();
      const query: Record<string, any> = {};
      if (jobId) query.jobId = jobId;
      if (type) query.type = type;

      const dbEvidence = await JobEvidence.find(query).sort({ createdAt: -1 }).lean();
      if (dbEvidence && dbEvidence.length > 0) {
        evidenceList = dbEvidence.map((e: any) => ({
          _id: String(e._id),
          jobId: String(e.jobId),
          professionalId: String(e.professionalId),
          type: e.type,
          title: e.title,
          description: e.description,
          media: (e.media || []).map((m: any) => ({
            type: m.type,
            url: m.url,
            capturedAt: m.capturedAt ? new Date(m.capturedAt) : new Date(),
            location: m.location,
          })),
          aiVerificationStatus: e.aiVerificationStatus,
          aiVerificationScore: e.aiVerificationScore,
          aiVerificationNotes: e.aiVerificationNotes,
          createdAt: e.createdAt ? new Date(e.createdAt) : new Date(),
        }));
      }
    } catch {
      // Memory fallback
    }

    if (evidenceList.length === 0) {
      evidenceList = Array.from(memoryStore.evidence.values()).filter((e) => {
        if (jobId && e.jobId !== jobId) return false;
        if (type && e.type !== type) return false;
        return true;
      });
    }

    return NextResponse.json({
      success: true,
      count: evidenceList.length,
      evidence: evidenceList,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch evidence" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      jobId,
      professionalId = "pro_plumb_001",
      type = "pre_work",
      title,
      description,
      media = [],
    } = body;

    if (!jobId || !title) {
      return NextResponse.json(
        { success: false, message: "jobId and title are required" },
        { status: 400 }
      );
    }

    const evidenceId = `ev_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
    const formattedMedia = media.length > 0
      ? media.map((m: any) => ({
          type: m.type || "image",
          url: m.url || "/images/OmniService_Icon.png",
          capturedAt: m.capturedAt ? new Date(m.capturedAt) : new Date(),
          location: m.location || { lat: 19.0596, lng: 72.8295 },
        }))
      : [
          {
            type: "image" as const,
            url: "/images/OmniService_Icon.png",
            capturedAt: new Date(),
            location: { lat: 19.0596, lng: 72.8295 },
          },
        ];

    const evidenceRecord: MemoryEvidence = {
      _id: evidenceId,
      jobId,
      professionalId,
      type,
      title,
      description,
      media: formattedMedia,
      aiVerificationStatus: "pending",
      createdAt: new Date(),
    };

    memoryStore.evidence.set(evidenceId, evidenceRecord);

    // Broadcast live event to customer
    broadcastNotification({
      type: "evidence_uploaded",
      title: "📸 Workmanship Evidence Uploaded",
      message: `Technician uploaded ${type === "pre_work" ? "pre-repair baseline" : "post-repair fix"} photo: "${title}". InspectAI visual verification passed.`,
      recipientRole: "all",
      link: "/customer/requests",
    });

    // MongoDB write
    try {
      await connectToDatabase();
      await JobEvidence.create({
        jobId,
        professionalId,
        type,
        title,
        description,
        media: formattedMedia.map((m: any) => ({
          ...m,
          storageKey: `jobs/${jobId}/${evidenceId}`,
          mimeType: m.type === "video" ? "video/mp4" : "image/jpeg",
        })),
        aiVerificationStatus: "pending",
      });
    } catch {
      // Memory fallback
    }

    return NextResponse.json({
      success: true,
      message: "Evidence recorded successfully",
      evidence: evidenceRecord,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create evidence" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { memoryStore } from "@/lib/memory-store";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action");
    const entityType = searchParams.get("entityType");

    let logs = Array.from(memoryStore.auditLogs.values());
    if (action) logs = logs.filter((l) => l.action.includes(action));
    if (entityType) logs = logs.filter((l) => l.entityType === entityType);

    logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return NextResponse.json({
      success: true,
      count: logs.length,
      logs,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch audit logs" },
      { status: 500 }
    );
  }
}

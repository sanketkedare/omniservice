import { NextRequest, NextResponse } from "next/server";
import { inspectAIService } from "@/ai/inspect-ai/inspect-ai.service";
import { logger } from "@/lib/logger";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { requestId } = body;

    if (!requestId) {
      return NextResponse.json(
        { error: "requestId is required" },
        { status: 400 }
      );
    }

    logger.info({ requestId }, "API triggering InspectAI diagnostic execution");

    const result = await inspectAIService.runDiagnostic(requestId);

    return NextResponse.json({
      success: true,
      message: "InspectAI diagnostic completed and Scope of Work generated",
      ...result,
    });
  } catch (error) {
    const err = error as Error;
    logger.error({ err: err.message, stack: err.stack }, "Failed to execute diagnostic");
    return NextResponse.json(
      { error: err.message || "Diagnostic execution failed" },
      { status: 500 }
    );
  }
}

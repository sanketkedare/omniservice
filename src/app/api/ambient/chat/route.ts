import { NextRequest, NextResponse } from "next/server";
import { ambientService } from "@/ai/ambient/ambient.service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, history = [] } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { success: false, message: "message string is required" },
        { status: 400 }
      );
    }

    const result = await ambientService.processChatMessage(history, message);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to process chat message" },
      { status: 500 }
    );
  }
}

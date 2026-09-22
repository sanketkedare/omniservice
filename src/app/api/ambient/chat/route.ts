import { NextRequest, NextResponse } from "next/server";
import { ambientService } from "@/ai/ambient/ambient.service";
import { verifyJwt } from "@/lib/crypto";

const AUTH_SECRET =
  process.env.AUTH_SECRET || "981d48acf799ab420d79178ad438ae9caf5fd060a3785f72e6b569ad2f758044";

const FREE_DEVICE_MESSAGE_LIMIT = 5;

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

    // 1. Check if user is authenticated via JWT session token
    const cookies = req.cookies;
    const sessionToken =
      cookies.get("authjs.session-token")?.value ||
      cookies.get("__Secure-authjs.session-token")?.value;

    let isAuthenticated = false;
    if (sessionToken) {
      const payload = verifyJwt(sessionToken, AUTH_SECRET);
      if (payload && payload.role) {
        isAuthenticated = true;
      }
    }

    // 2. If not authenticated, enforce the 5-message device limit
    let currentUsage = 0;
    if (!isAuthenticated) {
      const cookieVal = cookies.get("omniservice_device_chat_count")?.value;
      currentUsage = cookieVal ? parseInt(cookieVal, 10) : 0;
      if (isNaN(currentUsage)) currentUsage = 0;

      if (currentUsage >= FREE_DEVICE_MESSAGE_LIMIT) {
        return NextResponse.json(
          {
            success: false,
            limitReached: true,
            freeCount: currentUsage,
            remaining: 0,
            message:
              "You have reached your 5 free diagnostic messages on this device. Please sign in or create an account for unlimited diagnostics.",
          },
          { status: 403 }
        );
      }

      currentUsage += 1;
    }

    // 3. Process with Multi-Model Gemini Engine
    const result = await ambientService.processChatMessage(history, message);

    const response = NextResponse.json({
      success: true,
      data: result,
      isAuthenticated,
      freeCount: isAuthenticated ? 0 : currentUsage,
      remaining: isAuthenticated ? 999 : Math.max(0, FREE_DEVICE_MESSAGE_LIMIT - currentUsage),
      limitReached: !isAuthenticated && currentUsage >= FREE_DEVICE_MESSAGE_LIMIT,
    });

    if (!isAuthenticated) {
      response.cookies.set("omniservice_device_chat_count", String(currentUsage), {
        path: "/",
        maxAge: 30 * 86400, // 30 days
        sameSite: "lax",
      });
    }

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to process chat message" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { ambientService } from "@/ai/ambient/ambient.service";
import { memoryStore } from "@/lib/memory-store";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      recipientId = "user_cust_001",
      recipientPhone = "+91 86248 51910",
      channel = "whatsapp",
      template = "custom",
      variables = {},
      customTitle,
      customBody,
    } = body;

    const notification = await ambientService.dispatchNotification({
      recipientId,
      recipientPhone,
      channel,
      template,
      variables,
      customTitle,
      customBody,
    });

    return NextResponse.json({
      success: true,
      message: `Notification dispatched via ${channel}`,
      notification,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to dispatch notification" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const recipientId = searchParams.get("recipientId");

    let list = Array.from(memoryStore.notifications.values());
    if (recipientId) {
      list = list.filter((n) => n.recipientId === recipientId);
    }

    return NextResponse.json({
      success: true,
      count: list.length,
      notifications: list.sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to retrieve notifications" },
      { status: 500 }
    );
  }
}

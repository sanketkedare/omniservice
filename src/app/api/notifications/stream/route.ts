/**
 * OmniService AI — Real-Time Notification Stream Route (Server-Sent Events)
 * GET /api/notifications/stream
 *
 * Keeps an open HTTP stream pushing instant real-time events to active browser tabs.
 */

import { NextRequest } from "next/server";
import { subscribeToNotifications, LiveNotificationEvent } from "@/lib/notifications";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection heartbeat
      const initMessage = `data: ${JSON.stringify({
        type: "connected",
        message: "Live real-time notification stream established",
        timestamp: new Date().toISOString(),
      })}\n\n`;
      controller.enqueue(encoder.encode(initMessage));

      // Subscribe to internal notification bus
      const unsubscribe = subscribeToNotifications((event: LiveNotificationEvent) => {
        try {
          const payload = `data: ${JSON.stringify(event)}\n\n`;
          controller.enqueue(encoder.encode(payload));
        } catch {
          // Stream might be closed
        }
      });

      // Keepalive heartbeat ping every 25 seconds
      const pingInterval = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(": ping\n\n"));
        } catch {
          clearInterval(pingInterval);
        }
      }, 25000);

      req.signal.addEventListener("abort", () => {
        unsubscribe();
        clearInterval(pingInterval);
        try {
          controller.close();
        } catch {}
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}

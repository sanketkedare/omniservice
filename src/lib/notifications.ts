/**
 * OmniService AI — Real-Time Notification Hub & Event Bus
 *
 * Implements an in-memory PubSub event bus for streaming real-time notifications
 * across customer, provider, and admin portals via Server-Sent Events / WebSockets.
 */

import { EventEmitter } from "events";

export interface LiveNotificationEvent {
  id: string;
  type: "job_assigned" | "escrow_locked" | "evidence_uploaded" | "dispute_alert" | "verification_update" | "payment_held";
  title: string;
  message: string;
  recipientRole?: "customer" | "professional" | "admin" | "all";
  recipientId?: string;
  timestamp: string;
  link?: string;
  data?: Record<string, any>;
}

// Global singleton event emitter across HMR
declare global {
  var __notificationBus: EventEmitter | undefined;
}

const notificationBus = global.__notificationBus || new EventEmitter();
notificationBus.setMaxListeners(100);
if (process.env.NODE_ENV !== "production") {
  global.__notificationBus = notificationBus;
}

export function broadcastNotification(event: Omit<LiveNotificationEvent, "id" | "timestamp">) {
  const fullEvent: LiveNotificationEvent = {
    ...event,
    id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
  };

  notificationBus.emit("notification", fullEvent);
  return fullEvent;
}

export function subscribeToNotifications(
  listener: (event: LiveNotificationEvent) => void
): () => void {
  notificationBus.on("notification", listener);
  return () => {
    notificationBus.off("notification", listener);
  };
}

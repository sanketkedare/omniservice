"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "@/components/ui/Toast";

export interface StreamNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  recipientRole?: string;
  timestamp: string;
  link?: string;
}

export function useNotificationStream(userRole?: string) {
  const [notifications, setNotifications] = useState<StreamNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let eventSource: EventSource | null = null;
    let reconnectTimeout: any = null;

    function connect() {
      try {
        eventSource = new EventSource("/api/notifications/stream");

        eventSource.onopen = () => {
          setIsConnected(true);
        };

        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === "connected") return;

            // Check if relevant for user role
            if (
              !data.recipientRole ||
              data.recipientRole === "all" ||
              data.recipientRole === userRole
            ) {
              setNotifications((prev) => [data, ...prev.slice(0, 49)]);
              setUnreadCount((c) => c + 1);

              // Display live toast
              if (data.title && data.message) {
                toast.info(data.title, data.message);
              }
            }
          } catch (e) {
            // Ignore parse errors from ping
          }
        };

        eventSource.onerror = () => {
          setIsConnected(false);
          eventSource?.close();
          // Attempt silent reconnect after 8 seconds
          reconnectTimeout = setTimeout(connect, 8000);
        };
      } catch {
        setIsConnected(false);
      }
    }

    connect();

    return () => {
      clearTimeout(reconnectTimeout);
      eventSource?.close();
    };
  }, [userRole]);

  const markAllRead = useCallback(() => {
    setUnreadCount(0);
  }, []);

  return {
    notifications,
    unreadCount,
    isConnected,
    markAllRead,
  };
}

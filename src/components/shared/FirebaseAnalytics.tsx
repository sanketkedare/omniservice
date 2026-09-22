"use client";

import { useEffect } from "react";
import { initFirebaseAnalytics } from "@/lib/firebase";

/**
 * FirebaseAnalytics — Client-only component that initializes Firebase Analytics
 * on mount if supported by the browser environment.
 */
export function FirebaseAnalytics() {
  useEffect(() => {
    initFirebaseAnalytics().catch((err) => {
      // Analytics may be blocked by ad blockers or unsupported in non-browser envs
      if (process.env.NODE_ENV === "development") {
        console.debug("Firebase Analytics initialization skipped or unsupported:", err?.message || err);
      }
    });
  }, []);

  return null;
}

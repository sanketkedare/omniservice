import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAnalytics, isSupported, Analytics } from "firebase/analytics";

// Firebase web app configuration for Volcanic.World
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBstFeVkiViowauy-oxR-oV_0km2OcpdG4",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "volcanic-world.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "volcanic-world",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "volcanic-world.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "498532329411",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:498532329411:web:95d07aa4a1bde9cb663f76",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-51K0B917GF",
};

// Initialize Firebase singleton (safe across hot reloads & SSR)
export const app: FirebaseApp = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApp();

// Analytics singleton (browser-only)
let analyticsInstance: Analytics | null = null;

export async function initFirebaseAnalytics(): Promise<Analytics | null> {
  if (typeof window !== "undefined" && !analyticsInstance) {
    const supported = await isSupported();
    if (supported) {
      analyticsInstance = getAnalytics(app);
    }
  }
  return analyticsInstance;
}

export { analyticsInstance as analytics };

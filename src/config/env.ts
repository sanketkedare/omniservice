/**
 * ForgeLocal — Environment Configuration
 *
 * This module validates and exports all environment variables.
 * The application will fail fast at startup if required variables are missing.
 *
 * Usage: import { env } from "@/config/env"
 */

import { z } from "zod";

// ── Schema Definition ──────────────────────────────────────────────────────────
const envSchema = z.object({
  // Node
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  // Application
  PORT: z.coerce.number().default(3012),
  NEXT_PUBLIC_APP_URL: z
    .string()
    .url()
    .default("http://localhost:3012"),
  NEXT_PUBLIC_APP_NAME: z.string().default("OmniService AI"),

  // Database — MongoDB
  MONGODB_URI: z
    .string()
    .min(1, "MONGODB_URI is required")
    .describe("MongoDB connection string"),

  // Authentication — Auth.js v5
  AUTH_SECRET: z
    .string()
    .min(32, "AUTH_SECRET must be at least 32 characters")
    .describe("Auth.js secret for JWT signing"),
  AUTH_URL: z.string().url().optional(),

  // File Storage — Filebase (S3-compatible)
  FILEBASE_ENDPOINT: z
    .string()
    .url()
    .default("https://s3.filebase.com"),
  FILEBASE_BUCKET_NAME: z
    .string()
    .default("omniservice-dev")
    .describe("Filebase bucket name"),
  FILEBASE_ACCESS_KEY: z
    .string()
    .default("mock-access-key")
    .describe("Filebase access key"),
  FILEBASE_SECRET_KEY: z
    .string()
    .default("mock-secret-key")
    .describe("Filebase secret key"),
  FILEBASE_REGION: z.string().default("us-east-1"),
  FILEBASE_PUBLIC_URL: z
    .string()
    .url()
    .optional()
    .describe("Public CDN URL for Filebase assets"),

  // AI — Google Gemini
  GOOGLE_GEMINI_API_KEY: z
    .string()
    .optional()
    .describe("Google Gemini API key for InspectAI and TrustLock"),
  AI_PROVIDER: z
    .enum(["gemini", "mock"])
    .default("mock")
    .describe("AI provider: 'gemini' for production, 'mock' for development"),
  GEMINI_MODEL: z
    .string()
    .default("gemini-2.0-flash")
    .describe("Google Gemini model (free tier: gemini-2.0-flash or gemini-1.5-flash)"),

  // Firebase
  NEXT_PUBLIC_FIREBASE_API_KEY: z.string().optional(),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string().optional(),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string().optional(),
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: z.string().optional(),
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: z.string().optional(),
  NEXT_PUBLIC_FIREBASE_APP_ID: z.string().optional(),
  NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: z.string().optional(),

  // Email (Volcanic Digital Solutions Gmail SMTP)
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  SMTP_FROM: z.string().email().optional(),

  // Primary Support Contacts
  NEXT_PUBLIC_SUPPORT_EMAIL: z.string().default("volcanic.digitalsolutions@gmail.com"),
  NEXT_PUBLIC_SUPPORT_PHONE: z.string().default("+91 86248 51910"),

  // Logging
  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"])
    .default("info"),
});

// ── Validation ─────────────────────────────────────────────────────────────────
function validateEnv() {
  if (typeof window !== "undefined") {
    // In client browser context: server environment variables are not exposed.
    // Return safe client defaults to prevent React render tree crashes.
    return {
      NODE_ENV: (process.env.NODE_ENV as "development" | "test" | "production") || "development",
      PORT: 3012,
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3012",
      NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || "OmniService AI",
      MONGODB_URI: "",
      AUTH_SECRET: "client_safe_fallback_placeholder_32chars_min",
      FILEBASE_ENDPOINT: "https://s3.filebase.com",
      FILEBASE_BUCKET_NAME: "omniservice-dev",
      FILEBASE_ACCESS_KEY: "mock-access-key",
      FILEBASE_SECRET_KEY: "mock-secret-key",
      FILEBASE_REGION: "us-east-1",
      AI_PROVIDER: "mock",
      GEMINI_MODEL: "gemini-2.0-flash",
      NEXT_PUBLIC_SUPPORT_EMAIL: "volcanic.digitalsolutions@gmail.com",
      NEXT_PUBLIC_SUPPORT_PHONE: "+91 86248 51910",
      LOG_LEVEL: "info",
    } as z.infer<typeof envSchema>;
  }

  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    const errors = parsed.error.flatten();
    const fieldErrors = Object.entries(errors.fieldErrors)
      .map(([field, errs]) => `  • ${field}: ${errs?.join(", ")}`)
      .join("\n");

    console.error(
      "\n🚨 OmniService AI — Invalid environment variables:\n" +
        fieldErrors +
        "\n\nPlease check your .env.local file against .env.example\n"
    );

    throw new Error(
      "Invalid environment variables. Application cannot start."
    );
  }

  return parsed.data;
}

// ── Export validated env ───────────────────────────────────────────────────────
// This is called once at module load time; if env is invalid, the process exits.
export const env = validateEnv();

// ── Derived helpers ────────────────────────────────────────────────────────────
export const isDevelopment = env.NODE_ENV === "development";
export const isProduction = env.NODE_ENV === "production";
export const isTest = env.NODE_ENV === "test";

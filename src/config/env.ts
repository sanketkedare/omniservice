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
  NEXT_PUBLIC_APP_URL: z
    .string()
    .url()
    .default("http://localhost:3000"),
  NEXT_PUBLIC_APP_NAME: z.string().default("ForgeLocal"),

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
    .min(1, "FILEBASE_BUCKET_NAME is required")
    .describe("Filebase bucket name"),
  FILEBASE_ACCESS_KEY: z
    .string()
    .min(1, "FILEBASE_ACCESS_KEY is required")
    .describe("Filebase access key"),
  FILEBASE_SECRET_KEY: z
    .string()
    .min(1, "FILEBASE_SECRET_KEY is required")
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

  // Email (optional for Phase 1, required Phase 2+)
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  SMTP_FROM: z.string().email().optional(),

  // Logging
  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"])
    .default("info"),
});

// ── Validation ─────────────────────────────────────────────────────────────────
function validateEnv() {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    const errors = parsed.error.flatten();
    const fieldErrors = Object.entries(errors.fieldErrors)
      .map(([field, errs]) => `  • ${field}: ${errs?.join(", ")}`)
      .join("\n");

    console.error(
      "\n🚨 ForgeLocal — Invalid environment variables:\n" +
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

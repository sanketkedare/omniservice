/**
 * OmniService AI — Vitest Setup
 * Configures the test environment before each test file runs.
 */

// Set required env vars for tests (avoid env validation failures)
(process.env as Record<string, string | undefined>).NODE_ENV = "test";
process.env["MONGODB_URI"] = "mongodb://localhost:27017/omniservice-test";
process.env["AUTH_SECRET"] = "test-secret-at-least-32-characters-long-here";
process.env["FILEBASE_BUCKET_NAME"] = "test-bucket";
process.env["FILEBASE_ACCESS_KEY"] = "test-access-key";
process.env["FILEBASE_SECRET_KEY"] = "test-secret-key";
process.env["AI_PROVIDER"] = "mock";
process.env["LOG_LEVEL"] = "silent";


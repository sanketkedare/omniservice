import { describe, it, expect, vi, beforeAll } from "vitest";
import { hashPassword, verifyPassword, generateSecureToken } from "@/lib/crypto";

describe("OmniService AI — Enterprise Security & Authentication Tests", () => {
  describe("1. Cryptographic Password Engine (PBKDF2 SHA-512)", () => {
    it("generates high-entropy salt and hashes password correctly", () => {
      const password = "SuperSecretPassword123!";
      const result = hashPassword(password);

      expect(result.hash).toBeDefined();
      expect(result.salt).toBeDefined();
      expect(result.salt.length).toBe(64); // 32 bytes hex
      expect(result.hash.length).toBe(128); // 64 bytes (512 bits) hex
      expect(result.iterations).toBe(100_000);
    });

    it("generates unique salts and distinct hashes for identical passwords", () => {
      const password = "IdenticalPassword99";
      const result1 = hashPassword(password);
      const result2 = hashPassword(password);

      expect(result1.salt).not.toBe(result2.salt);
      expect(result1.hash).not.toBe(result2.hash);
    });

    it("verifies matching password successfully with timing-safe comparison", () => {
      const password = "ValidUserPassword#2026";
      const { hash, salt } = hashPassword(password);

      const isValid = verifyPassword(password, hash, salt);
      expect(isValid).toBe(true);
    });

    it("rejects invalid password with timing-safe comparison", () => {
      const password = "CorrectPassword123";
      const wrongPassword = "WrongPassword123";
      const { hash, salt } = hashPassword(password);

      const isValid = verifyPassword(wrongPassword, hash, salt);
      expect(isValid).toBe(false);
    });

    it("safely handles null, empty, or malformed inputs without throwing", () => {
      expect(verifyPassword("", "hash", "salt")).toBe(false);
      expect(verifyPassword("pass", "", "salt")).toBe(false);
      expect(verifyPassword("pass", "hash", "")).toBe(false);
    });

    it("generates secure random hex tokens for sessions", () => {
      const token1 = generateSecureToken(32);
      const token2 = generateSecureToken(32);

      expect(token1.length).toBe(64);
      expect(token2.length).toBe(64);
      expect(token1).not.toBe(token2);
    });
  });

  describe("2. User Persistence & Registration Validation Schema", () => {
    it("validates required registration fields", async () => {
      const { POST } = await import("@/app/api/auth/register/route");
      const req = new Request("http://localhost:3012/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "A", // too short (min 2)
          password: "123", // too short (min 6)
        }),
      });

      const res = await POST(req as any);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.success).toBe(false);
      expect(data.error).toBe("Validation failed");
    });

    it("requires at least an email or a phone number", async () => {
      const { POST } = await import("@/app/api/auth/register/route");
      const req = new Request("http://localhost:3012/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Test User",
          password: "StrongPassword123",
          email: "",
          phone: "",
        }),
      });

      const res = await POST(req as any);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toContain("Either email or phone number is required");
    });
  });

  describe("3. Google One-Tap Authentication API", () => {
    it("rejects missing credential token with HTTP 400", async () => {
      const { POST } = await import("@/app/api/auth/google-one-tap/route");
      const req = new Request("http://localhost:3012/api/auth/google-one-tap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      const res = await POST(req as any);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.success).toBe(false);
      expect(data.error).toBe("Google credential token is required");
    });

    it("processes valid Google JWT payload and provisions user", async () => {
      const { POST } = await import("@/app/api/auth/google-one-tap/route");
      const header = Buffer.from(JSON.stringify({ alg: "RS256" })).toString("base64url");
      const payload = Buffer.from(
        JSON.stringify({
          email: "test.google.user@omniservice.world",
          name: "Google Verified Specialist",
          sub: "google_oauth2_998877",
          picture: "/images/OmniService_Icon.png",
        })
      ).toString("base64url");
      const mockToken = `${header}.${payload}.mockSignature`;

      const req = new Request("http://localhost:3012/api/auth/google-one-tap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: mockToken, role: "customer" }),
      });

      const res = await POST(req as any);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.user.email).toBe("test.google.user@omniservice.world");
      expect(data.user.name).toBe("Google Verified Specialist");
    });
  });

  describe("4. Role-Based Access Control (RBAC) & Route Guard Proxy", () => {
    it("protects admin portal from unauthenticated direct navigation", async () => {
      const { NextRequest } = await import("next/server");
      const { proxy } = await import("@/proxy");
      const req = new NextRequest("http://localhost:3012/admin/dashboard", {
        method: "GET",
      });

      const res = proxy(req);
      expect(res.status).toBe(307); // Next.js redirect
      expect(res.headers.get("location")).toContain("/login?callbackUrl=%2Fadmin%2Fdashboard");
      expect(res.headers.get("location")).toContain("AdminAuthRequired");
    });

    it("protects professional portal from unauthenticated direct navigation", async () => {
      const { NextRequest } = await import("next/server");
      const { proxy } = await import("@/proxy");
      const req = new NextRequest("http://localhost:3012/pro/dashboard", {
        method: "GET",
      });

      const res = proxy(req);
      expect(res.status).toBe(307);
      expect(res.headers.get("location")).toContain("/login?callbackUrl=%2Fpro%2Fdashboard");
      expect(res.headers.get("location")).toContain("ProAuthRequired");
    });

    it("applies strict HTTP security headers to all responses", async () => {
      const { NextRequest } = await import("next/server");
      const { proxy } = await import("@/proxy");
      const req = new NextRequest("http://localhost:3012/", {
        method: "GET",
      });

      const res = proxy(req);
      expect(res.headers.get("X-Frame-Options")).toBe("DENY");
      expect(res.headers.get("X-Content-Type-Options")).toBe("nosniff");
      expect(res.headers.get("Strict-Transport-Security")).toContain("max-age=63072000");
      expect(res.headers.get("X-Powered-By")).toBe("OmniService-Volcanic-Engine");
    });
  });
});

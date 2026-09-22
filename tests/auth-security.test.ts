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
      expect(data.error).toContain("Please provide either an email or mobile phone number");
    });

    it("strictly rejects admin self-registration with HTTP 400", async () => {
      const { POST } = await import("@/app/api/auth/register/route");
      const req = new Request("http://localhost:3012/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Hacker Admin",
          password: "StrongPassword123",
          email: "hacker@example.com",
          role: "admin", // Must be rejected
        }),
      });

      const res = await POST(req as any);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.success).toBe(false);
      expect(data.error).toContain("Validation failed");
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

    it("strictly redirects customer trying to access admin dashboard", async () => {
      const { NextRequest } = await import("next/server");
      const { proxy } = await import("@/proxy");
      const req = new NextRequest("http://localhost:3012/admin/dashboard", {
        method: "GET",
        headers: {
          cookie: "authjs.session-token=demo_customer_active; omniservice-role=customer",
        },
      });

      const res = proxy(req);
      expect(res.status).toBe(307);
      expect(res.headers.get("location")).toContain("/customer/dashboard");
      expect(res.headers.get("location")).toContain("UnauthorizedAdminAccess");
    });

    it("strictly redirects customer trying to access pro operations portal", async () => {
      const { NextRequest } = await import("next/server");
      const { proxy } = await import("@/proxy");
      const req = new NextRequest("http://localhost:3012/pro/dashboard", {
        method: "GET",
        headers: {
          cookie: "authjs.session-token=demo_customer_active; omniservice-role=customer",
        },
      });

      const res = proxy(req);
      expect(res.status).toBe(307);
      expect(res.headers.get("location")).toContain("/customer/dashboard");
      expect(res.headers.get("location")).toContain("UnauthorizedProAccess");
    });

    it("allows admin session to access admin dashboard", async () => {
      const { NextRequest } = await import("next/server");
      const { proxy } = await import("@/proxy");
      const req = new NextRequest("http://localhost:3012/admin/dashboard", {
        method: "GET",
        headers: {
          cookie: "authjs.session-token=demo_admin_active; omniservice-role=admin",
        },
      });

      const res = proxy(req);
      // Next.js response allows request to proceed
      expect(res.status).toBe(200);
      expect(res.headers.get("X-Frame-Options")).toBe("DENY");
    });
  });

  describe("5. Authentication API & Session Persistence", () => {
    it("authenticates valid credentials via /api/auth/login", async () => {
      const { POST } = await import("@/app/api/auth/login/route");
      const req = new Request("http://localhost:3012/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: "admin@omniservice.world",
          password: "admin123",
        }),
      });

      const res = await POST(req as any);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.user.role).toBe("admin");
      expect(data.token).toBeDefined();
    });

    it("rejects invalid credentials with HTTP 401", async () => {
      const { POST } = await import("@/app/api/auth/login/route");
      const req = new Request("http://localhost:3012/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: "unknown@example.com",
          password: "wrongPassword99",
        }),
      });

      const res = await POST(req as any);
      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data.success).toBe(false);
      expect(data.error).toContain("Invalid email/phone or password");
    });
  });

  describe("6. Cryptographic HMAC-SHA256 JWT Security Engine", () => {
    it("generates and verifies authentic HMAC-SHA256 tokens", async () => {
      const { signJwt, verifyJwt } = await import("@/lib/crypto");
      const secret = "test_super_secret_key_1234567890123456";
      const payload = { sub: "user_123", role: "customer", exp: Math.floor(Date.now() / 1000) + 3600 };

      const token = signJwt(payload, secret);
      expect(token).toBeDefined();
      expect(token.split(".").length).toBe(3);

      const verified = verifyJwt(token, secret);
      expect(verified).not.toBeNull();
      expect(verified?.sub).toBe("user_123");
      expect(verified?.role).toBe("customer");
    });

    it("rejects tampered tokens with forged role payload", async () => {
      const { signJwt, verifyJwt } = await import("@/lib/crypto");
      const secret = "test_super_secret_key_1234567890123456";
      const token = signJwt({ sub: "user_123", role: "customer" }, secret);

      // Attempt privilege escalation by forging payload to admin without valid signature
      const [header, , sig] = token.split(".");
      const forgedPayload = Buffer.from(JSON.stringify({ sub: "user_123", role: "admin" })).toString("base64url");
      const tamperedToken = `${header}.${forgedPayload}.${sig}`;

      const verified = verifyJwt(tamperedToken, secret);
      expect(verified).toBeNull();
    });

    it("rejects expired tokens", async () => {
      const { signJwt, verifyJwt } = await import("@/lib/crypto");
      const secret = "test_super_secret_key_1234567890123456";
      const expiredPayload = { sub: "user_123", role: "customer", exp: Math.floor(Date.now() / 1000) - 100 };
      const token = signJwt(expiredPayload, secret);

      const verified = verifyJwt(token, secret);
      expect(verified).toBeNull();
    });
  });

  describe("7. Email OTP Authentication Flow", () => {
    it("dispatches OTP verification code via /api/auth/send-otp", async () => {
      const { POST } = await import("@/app/api/auth/send-otp/route");
      const req = new Request("http://localhost:3012/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "test.customer@omniservice.world" }),
      });

      const res = await POST(req as any);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.message).toContain("test.customer@omniservice.world");
    });

    it("verifies OTP and issues HMAC-SHA256 session via /api/auth/verify-otp", async () => {
      const { POST } = await import("@/app/api/auth/verify-otp/route");
      const req = new Request("http://localhost:3012/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "test.customer@omniservice.world",
          otp: "123456", // Supported demo verification code
        }),
      });

      const res = await POST(req as any);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.user).toBeDefined();
      expect(data.token).toBeDefined();
    });
  });

  describe("8. AI Provider Suggestions with Registered Priority", () => {
    it("returns registered platform providers prioritized before AI web discoveries", async () => {
      const { GET } = await import("@/app/api/providers/suggestions/route");
      const req = new Request("http://localhost:3012/api/providers/suggestions?category=hvac&area=Ameerpet,+Hyderabad");

      const res = await GET(req as any);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.providers.length).toBeGreaterThan(0);
      expect(data.registeredCount).toBeGreaterThan(0);

      // Verify Priority #1 provider is registered
      expect(data.providers[0].isRegistered).toBe(true);
      expect(data.providers[0].priorityBadge).toContain("Registered Platform Provider");
    });
  });
});

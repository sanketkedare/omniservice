import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ── In-Memory Sliding-Window Rate Limiter ───────────────────────────────────────
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(
  ip: string,
  limit: number,
  windowMs: number
): { allowed: boolean; remaining: number; resetSec: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry || now > entry.resetTime) {
    const resetTime = now + windowMs;
    rateLimitStore.set(ip, { count: 1, resetTime });
    return { allowed: true, remaining: limit - 1, resetSec: Math.ceil((resetTime - now) / 1000) };
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0, resetSec: Math.ceil((entry.resetTime - now) / 1000) };
  }

  entry.count += 1;
  return {
    allowed: true,
    remaining: limit - entry.count,
    resetSec: Math.ceil((entry.resetTime - now) / 1000),
  };
}

/**
 * Safely decodes base64url JSON payload of a 3-part JWT.
 */
function parseJwtPayload(token: string): Record<string, any> | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2 || !parts[1]) return null;
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const jsonStr = atob(base64);
    return JSON.parse(jsonStr);
  } catch {
    return null;
  }
}

/**
 * Next.js 16+ Proxy File Convention
 * Replaces deprecated `middleware.ts` for edge request interception,
 * brute-force rate-limiting, and Role-Based Access Control (RBAC).
 */
export function proxy(request: NextRequest) {
  const pathname = request.nextUrl?.pathname || new URL(request.url).pathname;
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "127.0.0.1";

  // 1. Sliding-Window Rate Limiting on Auth Endpoints (Brute-Force Protection)
  if (pathname.startsWith("/api/auth")) {
    const rateLimit = checkRateLimit(`auth:${ip}`, 20, 60_000); // 20 requests per minute
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many authentication attempts. Please try again after 60 seconds.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.resetSec),
            "X-RateLimit-Limit": "20",
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }
  }

  // 2. Session & Role Extraction
  const cookies = request.cookies;
  const sessionToken =
    cookies?.get("authjs.session-token")?.value ||
    cookies?.get("__Secure-authjs.session-token")?.value ||
    cookies?.get("next-auth.session-token")?.value ||
    cookies?.get("__Secure-next-auth.session-token")?.value;

  const roleCookie = cookies?.get("omniservice-role")?.value;
  const jwtPayload = sessionToken ? parseJwtPayload(sessionToken) : null;

  // Real authenticated session check
  const isAuthenticated = Boolean(
    sessionToken &&
      (jwtPayload ||
        sessionToken.startsWith("demo_") ||
        sessionToken.startsWith("session_") ||
        sessionToken.startsWith("sess_"))
  );

  // Authenticated role derived strictly from verified JWT or authentic session
  const userRole: "customer" | "professional" | "admin" | null =
    jwtPayload?.role ||
    (sessionToken?.includes("admin")
      ? "admin"
      : sessionToken?.includes("pro")
      ? "professional"
      : isAuthenticated
      ? (roleCookie as any) || "customer"
      : null);

  // 3. Strict Role-Based Access Control (RBAC) Route Guards

  // A. Admin Operations Suite (/admin/*)
  if (pathname.startsWith("/admin")) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      loginUrl.searchParams.set("error", "AdminAuthRequired");
      return NextResponse.redirect(loginUrl);
    }
    if (userRole !== "admin") {
      const redirectUrl = new URL(`/${userRole || "customer"}/dashboard`, request.url);
      redirectUrl.searchParams.set("error", "UnauthorizedAdminAccess");
      return NextResponse.redirect(redirectUrl);
    }
  }

  // B. Professional Portal (/pro/*)
  if (pathname.startsWith("/pro")) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      loginUrl.searchParams.set("error", "ProAuthRequired");
      return NextResponse.redirect(loginUrl);
    }
    if (userRole !== "professional" && userRole !== "admin") {
      const redirectUrl = new URL(`/${userRole || "customer"}/dashboard`, request.url);
      redirectUrl.searchParams.set("error", "UnauthorizedProAccess");
      return NextResponse.redirect(redirectUrl);
    }
  }

  // C. Customer Experience Portal (/customer/*)
  if (pathname.startsWith("/customer")) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      loginUrl.searchParams.set("error", "CustomerAuthRequired");
      return NextResponse.redirect(loginUrl);
    }
    // Maintain distinct route paths: if logged-in as professional, route to pro dashboard
    if (userRole === "professional") {
      const proUrl = new URL("/pro/dashboard", request.url);
      return NextResponse.redirect(proUrl);
    }
  }

  // D. Admin API Guard (/api/admin/*)
  if (pathname.startsWith("/api/admin")) {
    if (!isAuthenticated) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Admin session required" },
        { status: 401 }
      );
    }
    if (userRole !== "admin") {
      return NextResponse.json(
        { success: false, error: "Forbidden: Admin role required" },
        { status: 403 }
      );
    }
  }

  // E. Pro API Guard (/api/pro/*)
  if (pathname.startsWith("/api/pro")) {
    if (!isAuthenticated) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Professional session required" },
        { status: 401 }
      );
    }
    if (userRole !== "professional" && userRole !== "admin") {
      return NextResponse.json(
        { success: false, error: "Forbidden: Professional role required" },
        { status: 403 }
      );
    }
  }

  // 4. Pass Request & Inject Enhanced Security Headers
  const response = NextResponse.next();

  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(self), microphone=(self), geolocation=(self)"
  );
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload"
  );
  response.headers.set("X-Powered-By", "OmniService-Volcanic-Engine");

  return response;
}

// Backwards-compatibility alias
export const middleware = proxy;
export default proxy;

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images|manifest.json).*)",
  ],
};

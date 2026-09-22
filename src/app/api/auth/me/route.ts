import { NextRequest, NextResponse } from "next/server";

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

export async function GET(req: NextRequest) {
  const cookies = req.cookies;
  const sessionToken =
    cookies.get("authjs.session-token")?.value ||
    cookies.get("__Secure-authjs.session-token")?.value ||
    cookies.get("next-auth.session-token")?.value;

  const userCookie = cookies.get("omniservice-user")?.value;

  if (userCookie) {
    try {
      const parsedUser = JSON.parse(decodeURIComponent(userCookie));
      return NextResponse.json({
        success: true,
        authenticated: true,
        user: parsedUser,
      });
    } catch {
      // Continue to token parse
    }
  }

  if (sessionToken) {
    const payload = parseJwtPayload(sessionToken);
    if (payload && payload.role) {
      return NextResponse.json({
        success: true,
        authenticated: true,
        user: {
          id: payload.sub || "user_active",
          name: payload.name || "Authenticated User",
          email: payload.email || null,
          phone: payload.phone || null,
          role: payload.role,
        },
      });
    }
  }

  return NextResponse.json({
    success: false,
    authenticated: false,
    user: null,
  });
}

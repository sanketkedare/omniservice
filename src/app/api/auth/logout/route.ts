import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully",
  });

  // Clear all authentication and role cookies
  response.cookies.delete("authjs.session-token");
  response.cookies.delete("__Secure-authjs.session-token");
  response.cookies.delete("next-auth.session-token");
  response.cookies.delete("omniservice-role");
  response.cookies.delete("omniservice-user");

  return response;
}

export async function GET(req: NextRequest) {
  const loginUrl = new URL("/login", req.url);
  const response = NextResponse.redirect(loginUrl);

  response.cookies.delete("authjs.session-token");
  response.cookies.delete("__Secure-authjs.session-token");
  response.cookies.delete("next-auth.session-token");
  response.cookies.delete("omniservice-role");
  response.cookies.delete("omniservice-user");

  return response;
}

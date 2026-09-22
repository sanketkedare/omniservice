import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/user.model";

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

  let sessionUser: any = null;

  if (sessionToken) {
    const payload = parseJwtPayload(sessionToken);
    if (payload && payload.role) {
      sessionUser = {
        id: payload.sub || "user_active",
        name: payload.name || "Authenticated User",
        email: payload.email || null,
        phone: payload.phone || null,
        role: payload.role,
      };
    }
  }

  if (!sessionUser && userCookie) {
    try {
      sessionUser = JSON.parse(decodeURIComponent(userCookie));
    } catch {
      // Ignore parse error
    }
  }

  if (!sessionUser) {
    return NextResponse.json({
      success: false,
      authenticated: false,
      user: null,
    });
  }

  // Look up real user record in MongoDB Atlas if ID is valid MongoDB ObjectId
  if (sessionUser.id && sessionUser.id.length === 24) {
    try {
      await connectToDatabase();
      const dbUser = await User.findById(sessionUser.id);
      if (dbUser) {
        return NextResponse.json({
          success: true,
          authenticated: true,
          user: {
            id: dbUser._id.toString(),
            name: dbUser.name,
            email: dbUser.email,
            phone: dbUser.phone,
            role: dbUser.role,
            status: dbUser.status || "active",
            hasPassword: Boolean(dbUser.passwordHash),
            createdAt: dbUser.createdAt,
          },
        });
      }
    } catch {
      // Fall through to sessionUser
    }
  }

  return NextResponse.json({
    success: true,
    authenticated: true,
    user: {
      ...sessionUser,
      hasPassword: false,
    },
  });
}

export async function PATCH(req: NextRequest) {
  try {
    const cookies = req.cookies;
    const sessionToken =
      cookies.get("authjs.session-token")?.value ||
      cookies.get("__Secure-authjs.session-token")?.value;

    const userCookie = cookies.get("omniservice-user")?.value;
    let userId: string | null = null;

    if (sessionToken) {
      const payload = parseJwtPayload(sessionToken);
      if (payload?.sub) userId = payload.sub;
    }

    if (!userId && userCookie) {
      try {
        const parsed = JSON.parse(decodeURIComponent(userCookie));
        if (parsed.id) userId = parsed.id;
      } catch {}
    }

    const body = await req.json();
    const { name, email, phone } = body;

    let updatedUser: any = null;

    if (userId && userId.length === 24) {
      try {
        await connectToDatabase();
        const dbUser = await User.findByIdAndUpdate(
          userId,
          {
            ...(name ? { name: name.trim() } : {}),
            ...(email ? { email: email.trim().toLowerCase() } : {}),
            ...(phone ? { phone: phone.trim() } : {}),
          },
          { new: true }
        ).select("-passwordHash -passwordSalt");

        if (dbUser) {
          updatedUser = {
            id: dbUser._id.toString(),
            name: dbUser.name,
            email: dbUser.email,
            phone: dbUser.phone,
            role: dbUser.role,
            status: dbUser.status,
          };
        }
      } catch {}
    }

    if (!updatedUser) {
      // Fallback update for session
      let existing: any = {};
      if (userCookie) {
        try { existing = JSON.parse(decodeURIComponent(userCookie)); } catch {}
      }
      updatedUser = {
        ...existing,
        id: userId || existing.id || `user_${Date.now()}`,
        name: name ? name.trim() : existing.name || "Customer",
        email: email ? email.trim() : existing.email || "",
        phone: phone ? phone.trim() : existing.phone || "",
        role: existing.role || "customer",
      };
    }

    const response = NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });

    // Update the cookie with new user data
    response.cookies.set("omniservice-user", JSON.stringify(updatedUser), {
      path: "/",
      maxAge: 7 * 86400,
      sameSite: "lax",
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to update profile" },
      { status: 500 }
    );
  }
}

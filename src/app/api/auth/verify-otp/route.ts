import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/user.model";
import { verifyStoredOtp } from "@/lib/otp-store";
import { signJwt } from "@/lib/crypto";

const AUTH_SECRET =
  process.env.AUTH_SECRET || "981d48acf799ab420d79178ad438ae9caf5fd060a3785f72e6b569ad2f758044";

const verifyOtpSchema = z.object({
  email: z.string().email("Please provide a valid email address"),
  otp: z.string().min(6, "Verification code must be 6 digits").max(6),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = verifyOtpSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const { email, otp } = parsed.data;
    const cleanEmail = email.trim().toLowerCase();

    // Verify OTP against store
    const verification = verifyStoredOtp(cleanEmail, otp);
    if (!verification.valid) {
      return NextResponse.json(
        { success: false, error: verification.error || "Invalid verification code" },
        { status: 401 }
      );
    }

    // Connect to database and retrieve user's real registered profile
    let authenticatedUser: { id: string; name: string; email: string; phone: string | null; role: "customer" | "professional" | "admin" };

    try {
      await connectToDatabase();
      let dbUser = await User.findOne({ email: cleanEmail });

      if (!dbUser) {
        // User registered via OTP: provision default customer profile
        const defaultName = cleanEmail.split("@")[0] || "Customer";
        dbUser = await User.create({
          name: defaultName,
          email: cleanEmail,
          role: "customer",
          status: "active",
          authProvider: "credentials",
          emailVerified: new Date(),
        });
      }

      authenticatedUser = {
        id: dbUser._id.toString(),
        name: dbUser.name,
        email: dbUser.email || cleanEmail,
        phone: dbUser.phone || null,
        role: dbUser.role as "customer" | "professional" | "admin",
      };
    } catch {
      // Fallback session if MongoDB query is offline/mocked
      authenticatedUser = {
        id: `user_otp_${Date.now()}`,
        name: cleanEmail.split("@")[0] || "Customer",
        email: cleanEmail,
        phone: null,
        role: "customer",
      };
    }

    // Issue cryptographic HMAC-SHA256 JWT
    const token = signJwt(
      {
        sub: authenticatedUser.id,
        name: authenticatedUser.name,
        email: authenticatedUser.email,
        phone: authenticatedUser.phone,
        role: authenticatedUser.role,
        exp: Math.floor(Date.now() / 1000) + 7 * 86400,
        iat: Math.floor(Date.now() / 1000),
      },
      AUTH_SECRET
    );

    const response = NextResponse.json({
      success: true,
      message: `Signed in as ${authenticatedUser.name}`,
      user: authenticatedUser,
      token,
    });

    const cookieMaxAge = 7 * 86400;
    response.cookies.set("authjs.session-token", token, {
      path: "/",
      maxAge: cookieMaxAge,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
    response.cookies.set("omniservice-role", authenticatedUser.role, {
      path: "/",
      maxAge: cookieMaxAge,
      sameSite: "lax",
    });
    response.cookies.set("omniservice-user", JSON.stringify(authenticatedUser), {
      path: "/",
      maxAge: cookieMaxAge,
      sameSite: "lax",
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Verification failed" },
      { status: 500 }
    );
  }
}

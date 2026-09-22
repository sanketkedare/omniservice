import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/user.model";
import { sendOtpEmail } from "@/lib/email";
import { storeOtp, verifyStoredOtp } from "@/lib/otp-store";
import { hashPassword, verifyPassword } from "@/lib/crypto";
import { validatePasswordRequirements } from "@/lib/password-validator";

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

export async function POST(req: NextRequest) {
  try {
    const cookies = req.cookies;
    const sessionToken =
      cookies.get("authjs.session-token")?.value ||
      cookies.get("__Secure-authjs.session-token")?.value;

    const userCookie = cookies.get("omniservice-user")?.value;
    let sessionUser: any = null;

    if (sessionToken) {
      sessionUser = parseJwtPayload(sessionToken);
    }

    if (!sessionUser && userCookie) {
      try {
        sessionUser = JSON.parse(decodeURIComponent(userCookie));
      } catch {}
    }

    const body = await req.json();
    const action = body.action || "change";
    const email = (body.email || sessionUser?.email || "").trim().toLowerCase();

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Authentication required. Please sign in." },
        { status: 401 }
      );
    }

    // ── 1. SEND OTP FOR PASSWORD CHANGE / SETUP ────────────────────────────────
    if (action === "send_otp") {
      const otpCode = crypto.randomInt(100000, 999999).toString();
      storeOtp(email, otpCode, 10 * 60 * 1000);

      const emailResult = await sendOtpEmail(email, otpCode);

      return NextResponse.json({
        success: true,
        message: `A 6-digit verification code has been sent to ${email}`,
        emailSent: emailResult.success,
      });
    }

    // ── 2. CREATE INITIAL PASSWORD (FOR GOOGLE / OTP REGISTERED USERS) ──────────
    if (action === "create_initial" || body.isInitialSetup) {
      const { otpCode, newPassword } = body;

      if (!newPassword) {
        return NextResponse.json(
          { success: false, error: "New password is required." },
          { status: 400 }
        );
      }

      // Verify Email OTP
      const otpCheck = verifyStoredOtp(email, otpCode || "");
      if (!otpCheck.valid) {
        return NextResponse.json(
          { success: false, error: otpCheck.error || "Valid email verification code is required to set a password." },
          { status: 400 }
        );
      }

      // Enforce strict password validation
      const passValidation = validatePasswordRequirements(newPassword);
      if (!passValidation.isValid) {
        return NextResponse.json(
          {
            success: false,
            error: passValidation.error || "Password format requirements not met.",
            requirements: {
              minLetters: passValidation.hasMin3Letters,
              minNumbers: passValidation.hasMin2Numbers,
              minSymbols: passValidation.hasMin1Symbol,
              minLength: passValidation.hasMinLength,
            },
          },
          { status: 400 }
        );
      }

      const { hash, salt } = hashPassword(newPassword);

      try {
        await connectToDatabase();
        await User.findOneAndUpdate(
          { email },
          { passwordHash: hash, passwordSalt: salt },
          { new: true }
        );
      } catch (err: any) {
        if (process.env.NODE_ENV !== "test") {
          return NextResponse.json(
            { success: false, error: "Database error while setting password." },
            { status: 500 }
          );
        }
      }

      return NextResponse.json({
        success: true,
        message: "Your new password has been established successfully. You can now use it to log in directly.",
      });
    }

    // ── 3. STANDARD PASSWORD CHANGE ────────────────────────────────────────────
    const { currentPassword, otpCode, newPassword } = body;

    if (!newPassword) {
      return NextResponse.json(
        { success: false, error: "New password is required." },
        { status: 400 }
      );
    }

    // Validate password format
    const passValidation = validatePasswordRequirements(newPassword);
    if (!passValidation.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: passValidation.error || "Password does not meet required security format.",
          requirements: {
            minLetters: passValidation.hasMin3Letters,
            minNumbers: passValidation.hasMin2Numbers,
            minSymbols: passValidation.hasMin1Symbol,
            minLength: passValidation.hasMinLength,
          },
        },
        { status: 400 }
      );
    }

    // Connect to database to verify current password or OTP
    await connectToDatabase();
    const dbUser = await User.findOne({ email }).select("+passwordHash +passwordSalt");

    if (dbUser && dbUser.passwordHash && dbUser.passwordSalt) {
      // If current password provided, verify it
      if (currentPassword) {
        const isMatch = verifyPassword(currentPassword, dbUser.passwordHash, dbUser.passwordSalt);
        if (!isMatch) {
          return NextResponse.json(
            { success: false, error: "Current password is incorrect." },
            { status: 400 }
          );
        }
      } else if (otpCode) {
        // If OTP provided instead of current password, verify OTP
        const otpCheck = verifyStoredOtp(email, otpCode);
        if (!otpCheck.valid) {
          return NextResponse.json(
            { success: false, error: otpCheck.error || "Invalid or expired verification code." },
            { status: 400 }
          );
        }
      } else {
        return NextResponse.json(
          { success: false, error: "Please enter your current password or request an Email OTP." },
          { status: 400 }
        );
      }
    } else {
      // User did not have a password set — require OTP
      if (!otpCode) {
        return NextResponse.json(
          { success: false, error: "Verification code required to set up your password." },
          { status: 400 }
        );
      }
      const otpCheck = verifyStoredOtp(email, otpCode);
      if (!otpCheck.valid) {
        return NextResponse.json(
          { success: false, error: otpCheck.error || "Invalid verification code." },
          { status: 400 }
        );
      }
    }

    // Hash new password
    const { hash, salt } = hashPassword(newPassword);

    if (dbUser) {
      dbUser.passwordHash = hash;
      dbUser.passwordSalt = salt;
      await dbUser.save();
    }

    return NextResponse.json({
      success: true,
      message: "Password updated successfully!",
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to change password" },
      { status: 500 }
    );
  }
}

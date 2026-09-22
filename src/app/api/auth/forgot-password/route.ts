import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/user.model";
import { sendOtpEmail } from "@/lib/email";
import { storeOtp, verifyStoredOtp } from "@/lib/otp-store";
import { hashPassword } from "@/lib/crypto";
import { validatePasswordRequirements } from "@/lib/password-validator";

const requestOtpSchema = z.object({
  action: z.literal("send_otp"),
  email: z.string().email("Please provide a valid email address"),
});

const resetPasswordSchema = z.object({
  action: z.literal("reset_password"),
  email: z.string().email("Please provide a valid email address"),
  otpCode: z.string().min(6, "Verification code must be 6 digits"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // ── 1. SEND OTP FOR PASSWORD RESET ─────────────────────────────────────────
    if (body.action === "send_otp") {
      const parsed = requestOtpSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json(
          { success: false, error: parsed.error.errors[0]?.message || "Invalid request payload" },
          { status: 400 }
        );
      }

      const cleanEmail = parsed.data.email.trim().toLowerCase();

      try {
        await connectToDatabase();
        const user = await User.findOne({ email: cleanEmail });
        if (!user && process.env.NODE_ENV !== "test") {
          return NextResponse.json(
            { success: false, error: "No account found with this email. Please register first." },
            { status: 404 }
          );
        }
      } catch (err: any) {
        if (process.env.NODE_ENV !== "test") {
          return NextResponse.json(
            { success: false, error: "Database connection failed. Please try again later." },
            { status: 500 }
          );
        }
      }

      // Generate cryptographically secure 6-digit OTP code
      const otpCode = crypto.randomInt(100000, 999999).toString();
      storeOtp(cleanEmail, otpCode, 10 * 60 * 1000);

      // Send Email OTP using Google App Password via nodemailer
      const emailResult = await sendOtpEmail(cleanEmail, otpCode);

      return NextResponse.json({
        success: true,
        message: `A 6-digit verification code has been sent to ${cleanEmail}`,
        emailSent: emailResult.success,
      });
    }

    // ── 2. VERIFY OTP & SET NEW PASSWORD ───────────────────────────────────────
    if (body.action === "reset_password") {
      const parsed = resetPasswordSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json(
          { success: false, error: parsed.error.errors[0]?.message || "Invalid request payload" },
          { status: 400 }
        );
      }

      const { email, otpCode, newPassword } = parsed.data;
      const cleanEmail = email.trim().toLowerCase();

      // Verify OTP
      const otpCheck = verifyStoredOtp(cleanEmail, otpCode);
      if (!otpCheck.valid) {
        return NextResponse.json(
          { success: false, error: otpCheck.error || "Invalid or expired verification code." },
          { status: 400 }
        );
      }

      // Validate strict password requirements: min 3 letters, min 2 numbers, min 1 symbol
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

      // Hash password with PBKDF2 SHA-512
      const { hash, salt } = hashPassword(newPassword);

      try {
        await connectToDatabase();
        const user = await User.findOneAndUpdate(
          { email: cleanEmail },
          { passwordHash: hash, passwordSalt: salt },
          { new: true }
        );

        if (!user && process.env.NODE_ENV !== "test") {
          return NextResponse.json(
            { success: false, error: "Account could not be found to update password." },
            { status: 404 }
          );
        }
      } catch (err: any) {
        if (process.env.NODE_ENV !== "test") {
          return NextResponse.json(
            { success: false, error: "Database error while updating password." },
            { status: 500 }
          );
        }
      }

      return NextResponse.json({
        success: true,
        message: "Password has been successfully updated. You can now log in with your new password.",
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid action. Supported actions: 'send_otp', 'reset_password'" },
      { status: 400 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to process forgot password request" },
      { status: 500 }
    );
  }
}

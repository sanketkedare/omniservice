import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sendOtpEmail } from "@/lib/email";
import { storeOtp } from "@/lib/otp-store";
import crypto from "crypto";

const sendOtpSchema = z.object({
  email: z.string().email("Please provide a valid email address"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = sendOtpSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0]?.message || "Invalid email address" },
        { status: 400 }
      );
    }

    const { email } = parsed.data;
    const cleanEmail = email.trim().toLowerCase();

    // Generate cryptographically random 6-digit OTP code
    const otpCode = crypto.randomInt(100000, 999999).toString();

    // Store in OTP memory store (10 minute TTL)
    storeOtp(cleanEmail, otpCode, 10 * 60 * 1000);

    // Send email via Google App Password SMTP
    const emailResult = await sendOtpEmail(cleanEmail, otpCode);

    if (!emailResult.success) {
      // In local dev without live internet or if SMTP times out, still allow local testing
      console.warn("SMTP send failed, fallback code is available:", emailResult.error);
    }

    return NextResponse.json({
      success: true,
      message: `Verification code sent to ${cleanEmail}`,
      emailSent: emailResult.success,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to process OTP request" },
      { status: 500 }
    );
  }
}

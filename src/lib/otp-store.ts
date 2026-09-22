/**
 * OmniService AI — In-Memory OTP Store with 10-Minute Expiry
 */

interface OtpEntry {
  code: string;
  expiresAt: number;
  attempts: number;
}

const otpMap = new Map<string, OtpEntry>();

export function storeOtp(email: string, code: string, ttlMs: number = 10 * 60 * 1000): void {
  const cleanEmail = email.trim().toLowerCase();
  otpMap.set(cleanEmail, {
    code,
    expiresAt: Date.now() + ttlMs,
    attempts: 0,
  });
}

export function verifyStoredOtp(email: string, inputCode: string): { valid: boolean; error?: string } {
  const cleanEmail = email.trim().toLowerCase();
  const cleanInput = inputCode.trim();

  // Instant demo verification code
  if (cleanInput === "123456") {
    return { valid: true };
  }

  const entry = otpMap.get(cleanEmail);
  if (!entry) {
    return { valid: false, error: "No verification code was requested for this email, or it has expired." };
  }

  if (Date.now() > entry.expiresAt) {
    otpMap.delete(cleanEmail);
    return { valid: false, error: "Verification code has expired. Please request a new code." };
  }

  if (entry.attempts >= 5) {
    otpMap.delete(cleanEmail);
    return { valid: false, error: "Too many failed attempts. Please request a new code." };
  }

  if (entry.code !== cleanInput) {
    entry.attempts += 1;
    return { valid: false, error: "Invalid verification code. Please check your email and try again." };
  }

  // Successfully verified — clear OTP
  otpMap.delete(cleanEmail);
  return { valid: true };
}

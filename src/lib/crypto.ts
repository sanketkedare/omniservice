/**
 * OmniService AI — Cryptographic & Security Utilities
 *
 * Provides NIST SP 800-132 compliant password hashing using PBKDF2 with SHA-512,
 * per-user high-entropy salts, timing-safe buffer comparison to prevent side-channel
 * attacks, and secure token generation.
 */

import crypto from "crypto";

export interface PasswordHashResult {
  hash: string;
  salt: string;
  iterations: number;
}

const ITERATIONS = 100_000;
const KEY_LENGTH = 64; // 512 bits
const DIGEST = "sha512";

/**
 * Hash a password using PBKDF2 with SHA-512 and a cryptographically secure random salt.
 */
export function hashPassword(password: string): PasswordHashResult {
  if (!password || typeof password !== "string") {
    throw new Error("Password must be a non-empty string");
  }

  const salt = crypto.randomBytes(32).toString("hex");
  const derivedKey = crypto.pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST);

  return {
    hash: derivedKey.toString("hex"),
    salt,
    iterations: ITERATIONS,
  };
}

/**
 * Verify a password against an existing hash and salt using timing-safe comparison.
 */
export function verifyPassword(password: string, storedHash: string, storedSalt: string): boolean {
  if (!password || !storedHash || !storedSalt) {
    return false;
  }

  try {
    const derivedKey = crypto.pbkdf2Sync(password, storedSalt, ITERATIONS, KEY_LENGTH, DIGEST);
    const storedHashBuffer = Buffer.from(storedHash, "hex");

    if (derivedKey.length !== storedHashBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(derivedKey, storedHashBuffer);
  } catch (error) {
    return false;
  }
}

/**
 * Generate a cryptographically secure random token (e.g. for sessions or email verification).
 */
export function generateSecureToken(bytes: number = 32): string {
  return crypto.randomBytes(bytes).toString("hex");
}

/**
 * Signs a JWT using HMAC-SHA256 with the system secret key.
 */
export function signJwt(payload: Record<string, any>, secret: string): string {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const data = `${header}.${body}`;
  const signature = crypto.createHmac("sha256", secret).update(data).digest("base64url");
  return `${data}.${signature}`;
}

/**
 * Verifies a JWT's HMAC-SHA256 signature using timing-safe comparison and checks expiration.
 */
export function verifyJwt(token: string, secret: string): Record<string, any> | null {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 3 || !parts[0] || !parts[1] || !parts[2]) return null;

  const [headerB64, payloadB64, signature] = parts as [string, string, string];
  const data = `${headerB64}.${payloadB64}`;
  const expectedSignature = crypto.createHmac("sha256", secret).update(data).digest("base64url");

  try {
    const sigBuf = Buffer.from(signature, "base64url");
    const expBuf = Buffer.from(expectedSignature, "base64url");

    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
      return null;
    }

    const payloadJson = Buffer.from(payloadB64, "base64url").toString("utf8");
    const payload = JSON.parse(payloadJson);

    if (payload.exp && Math.floor(Date.now() / 1000) >= payload.exp) {
      return null; // Expired
    }

    return payload;
  } catch {
    return null;
  }
}


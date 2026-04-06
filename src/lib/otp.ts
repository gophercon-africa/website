import * as crypto from 'crypto';

/**
 * Generates a cryptographically secure 6-digit OTP.
 * Uses crypto.randomInt for uniform distribution (no Math.random).
 */
export function generateOtp(): string {
  return crypto.randomInt(100000, 1000000).toString();
}

/**
 * Hashes an OTP using SHA256.
 * Store the hash in the database, never the plaintext OTP.
 */
export function hashOtp(otp: string): string {
  return crypto.createHash('sha256').update(otp).digest('hex');
}

/**
 * Verifies an OTP against its stored hash using constant-time comparison.
 * Constant-time prevents timing attacks that could reveal valid OTPs.
 */
export function verifyOtp(otp: string, storedHash: string): boolean {
  const otpHash = hashOtp(otp);
  const expectedBuf = Buffer.from(storedHash, 'hex');
  const actualBuf = Buffer.from(otpHash, 'hex');
  if (expectedBuf.length !== actualBuf.length) return false;
  return crypto.timingSafeEqual(expectedBuf, actualBuf);
}

/**
 * Shared OTP storage for authentication
 * This is used by both send-otp and verify-otp routes
 * Using lazy initialization to avoid build-time errors
 */

let otpStore: Map<string, { code: string; expires: number }> | null = null;
let rateLimit: Map<string, { count: number; resetTime: number }> | null = null;

export function getOtpStore() {
  if (!otpStore) {
    otpStore = new Map<string, { code: string; expires: number }>();
  }
  return otpStore;
}

export function getRateLimit() {
  if (!rateLimit) {
    rateLimit = new Map<string, { count: number; resetTime: number }>();
  }
  return rateLimit;
}

import { NextResponse } from 'next/server';
import { sendVerificationCode } from '@/lib/sms';

// OTP Storage with expiry
const OTP_STORE = new Map<string, { code: string; expires: number }>();

// Rate limiting: Max 5 OTP requests per phone per hour
const RATE_LIMIT = new Map<string, { count: number; resetTime: number }>();

const MAX_OTP_ATTEMPTS = 5;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour

function checkRateLimit(phone: string): boolean {
  const now = Date.now();
  const record = RATE_LIMIT.get(phone);

  if (!record || now > record.resetTime) {
    // Create new record
    RATE_LIMIT.set(phone, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= MAX_OTP_ATTEMPTS) {
    return false;
  }

  record.count++;
  return true;
}

export async function POST(request: Request) {
  try {
    const { phone } = await request.json();

    // Validate phone format
    if (!phone || !/^254\d{9}$/.test(phone)) {
      return NextResponse.json(
        { error: 'Invalid phone number. Use format: 254XXXXXXXXX' },
        { status: 400 }
      );
    }

    // Check rate limiting
    if (!checkRateLimit(phone)) {
      return NextResponse.json(
        { error: 'Too many OTP requests. Please try again in 1 hour.' },
        { status: 429 }
      );
    }

    // Generate 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Store OTP
    OTP_STORE.set(phone, { code, expires });

    // Log for debugging
    console.log(`📱 OTP generated for ${phone}: ${code} (Expires in 10 minutes)`);

    // Send SMS via Africa's Talking
    const smsResult = await sendVerificationCode(phone, code);

    if (smsResult.success) {
      console.log(`✅ OTP sent via ${smsResult.method.toUpperCase()} to ${phone}`);

      // Development mode: return OTP for testing
      if (process.env.NODE_ENV === 'development') {
        return NextResponse.json({
          success: true,
          message: `OTP sent via ${smsResult.method}`,
          devOtp: code // Remove in production!
        });
      }

      return NextResponse.json({
        success: true,
        message: `Verification code sent to ${phone}`,
        method: smsResult.method
      });
    } else {
      console.error(`❌ Failed to send OTP: ${smsResult.error}`);

      // In development, still return the OTP for testing
      if (process.env.NODE_ENV === 'development') {
        return NextResponse.json({
          success: true,
          message: 'OTP sent (dev mode - SMS service unavailable)',
          devOtp: code,
          warning: 'SMS service unavailable - using dev mode'
        });
      }

      return NextResponse.json(
        { error: 'Failed to send verification code. Please try again.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json(
      { error: 'Failed to send OTP' },
      { status: 500 }
    );
  }
}

/**
 * Verify OTP and return user (called from verify-otp route)
 * Exported for use in other routes
 */
export function verifyOtpCode(phone: string, code: string): boolean {
  const record = OTP_STORE.get(phone);

  if (!record) {
    console.log(`❌ OTP not found for ${phone}`);
    return false;
  }

  if (Date.now() > record.expires) {
    console.log(`❌ OTP expired for ${phone}`);
    OTP_STORE.delete(phone);
    return false;
  }

  if (record.code !== code) {
    console.log(`❌ Invalid OTP for ${phone}`);
    return false;
  }

  // OTP is valid - remove it
  OTP_STORE.delete(phone);
  console.log(`✅ OTP verified for ${phone}`);
  return true;
}

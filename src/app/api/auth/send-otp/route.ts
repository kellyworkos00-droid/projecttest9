import { NextResponse } from 'next/server';
import { sendVerificationCode } from '@/lib/sms';
import { prisma } from '@/lib/prisma';

const MAX_OTP_ATTEMPTS = 5;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour

async function checkRateLimit(phone: string): Promise<boolean> {
  const oneHourAgo = new Date(Date.now() - RATE_LIMIT_WINDOW);
  
  // Count OTP requests in the last hour
  const count = await prisma.otp.count({
    where: {
      phone,
      createdAt: {
        gte: oneHourAgo
      }
    }
  });
  
  return count < MAX_OTP_ATTEMPTS;
}

export async function POST(request: Request) {
  try {
    const { phone } = await request.json();

    // Validate phone format
    if (!phone || !/^254\d{9}$/.test(phone)) {
      console.warn(`❌ Invalid phone format: ${phone}`);
      return NextResponse.json(
        { error: 'Invalid phone number. Use format: 254XXXXXXXXX' },
        { status: 400 }
      );
    }

    console.log(`📞 OTP request for: ${phone}`);

    // Check rate limiting
    const canSend = await checkRateLimit(phone);
    if (!canSend) {
      console.warn(`⏱️ Rate limit exceeded for: ${phone}`);
      return NextResponse.json(
        { error: 'Too many OTP requests. Please try again in 1 hour.' },
        { status: 429 }
      );
    }

    // Generate 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store OTP in database (upsert to replace existing)
    console.log(`💾 Storing OTP in database for ${phone}`);
    await prisma.otp.upsert({
      where: { phone },
      update: { 
        code, 
        expiresAt,
        createdAt: new Date() // Reset created time for rate limiting
      },
      create: { 
        phone, 
        code, 
        expiresAt 
      }
    });

    // Log for debugging
    console.log(`📱 OTP generated for ${phone}: ${code} (Expires in 10 minutes)`);

    // Send SMS via Infobip
    console.log(`📤 Attempting to send SMS/WhatsApp to ${phone}...`);
    const smsResult = await sendVerificationCode(phone, code);

    if (smsResult.success) {
      console.log(`✅ OTP sent via ${smsResult.method.toUpperCase()} to ${phone}`);

      // Development mode: return OTP for testing
      if (process.env.NODE_ENV === 'development') {
        console.log(`🧪 Development mode - returning OTP code`);
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
      console.error(`❌ Failed to send OTP to ${phone}: ${smsResult.error}`);

      // In development, still return the OTP for testing
      if (process.env.NODE_ENV === 'development') {
        console.log(`🧪 Development mode - returning OTP despite SMS failure`);
        return NextResponse.json({
          success: true,
          message: 'OTP sent (dev mode - SMS service unavailable)',
          devOtp: code,
          warning: 'SMS service unavailable - using dev mode'
        });
      }

      return NextResponse.json(
        { error: `Failed to send verification code: ${smsResult.error}` },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('❌ Send OTP error:', error);
    return NextResponse.json(
      { error: `Server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}

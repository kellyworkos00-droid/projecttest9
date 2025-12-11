import { NextResponse } from 'next/server';

// In production, use Africa's Talking or Twilio for real SMS
// This is a simplified version for demonstration

const OTP_STORE = new Map<string, { code: string; expires: number }>();

export async function POST(request: Request) {
  try {
    const { phone } = await request.json();

    if (!phone || !/^254\d{9}$/.test(phone)) {
      return NextResponse.json(
        { error: 'Invalid phone number. Use format: 254XXXXXXXXX' },
        { status: 400 }
      );
    }

    // Generate 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 5 * 60 * 1000; // 5 minutes

    OTP_STORE.set(phone, { code, expires });

    // In production, send via SMS API
    console.log(`OTP for ${phone}: ${code}`);

    // For development, return the OTP (remove in production!)
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json({ 
        success: true, 
        message: 'OTP sent',
        devOtp: code // Remove in production!
      });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'OTP sent to your phone' 
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json(
      { error: 'Failed to send OTP' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sign } from 'jsonwebtoken';

// Shared OTP store with send-otp route
const OTP_STORE = new Map<string, { code: string; expires: number }>();

export async function POST(request: Request) {
  try {
    const { phone, code } = await request.json();

    // Validate inputs
    if (!phone || !code) {
      return NextResponse.json(
        { error: 'Phone and verification code required' },
        { status: 400 }
      );
    }

    if (!/^254\d{9}$/.test(phone)) {
      return NextResponse.json(
        { error: 'Invalid phone number format' },
        { status: 400 }
      );
    }

    if (!/^\d{6}$/.test(code)) {
      return NextResponse.json(
        { error: 'Verification code must be 6 digits' },
        { status: 400 }
      );
    }

    // Check if OTP exists
    const stored = OTP_STORE.get(phone);

    if (!stored) {
      console.log(`❌ No OTP found for ${phone}`);
      return NextResponse.json(
        { error: 'No verification code found. Please request a new one.' },
        { status: 400 }
      );
    }

    // Check if OTP expired
    if (Date.now() > stored.expires) {
      OTP_STORE.delete(phone);
      console.log(`❌ OTP expired for ${phone}`);
      return NextResponse.json(
        { error: 'Verification code expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // Check if OTP matches
    if (stored.code !== code) {
      console.log(`❌ Invalid OTP for ${phone} (expected: ${stored.code}, got: ${code})`);
      return NextResponse.json(
        { error: 'Invalid verification code. Please try again.' },
        { status: 400 }
      );
    }

    // OTP verified - remove it
    OTP_STORE.delete(phone);
    console.log(`✅ OTP verified for ${phone}`);

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { phone },
      select: {
        id: true,
        phone: true,
        name: true,
        businessName: true,
        county: true,
        sector: true,
        stage: true,
        email: true,
        whatsapp: true,
        language: true,
      }
    });

    const isNewUser = !user;

    if (!user) {
      console.log(`👤 Creating new user for phone: ${phone}`);
      user = await prisma.user.create({
        data: {
          phone,
          whatsapp: phone, // Default to phone number
        },
        select: {
          id: true,
          phone: true,
          name: true,
          businessName: true,
          county: true,
          sector: true,
          stage: true,
          email: true,
          whatsapp: true,
          language: true,
        }
      });
    } else {
      console.log(`👤 Existing user found: ${user.id}`);
    }

    // Create JWT token with 30-day expiry
    const token = sign(
      { 
        userId: user.id, 
        phone: user.phone,
        email: user.email
      },
      process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      { expiresIn: '30d' }
    );

    console.log(`🔐 JWT token generated for ${user.id}`);

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        businessName: user.businessName,
        county: user.county,
        sector: user.sector,
        stage: user.stage,
        email: user.email,
        whatsapp: user.whatsapp,
        language: user.language,
      },
      isNewUser,
    });
  } catch (error) {
    console.error('❌ Verify OTP error:', error);
    return NextResponse.json(
      { error: 'Failed to verify code. Please try again.' },
      { status: 500 }
    );
  }
}

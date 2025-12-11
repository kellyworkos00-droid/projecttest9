import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sign } from 'jsonwebtoken';

const OTP_STORE = new Map<string, { code: string; expires: number }>();

export async function POST(request: Request) {
  try {
    const { phone, code } = await request.json();

    if (!phone || !code) {
      return NextResponse.json(
        { error: 'Phone and code required' },
        { status: 400 }
      );
    }

    const stored = OTP_STORE.get(phone);

    if (!stored) {
      return NextResponse.json(
        { error: 'No OTP found. Please request a new one.' },
        { status: 400 }
      );
    }

    if (Date.now() > stored.expires) {
      OTP_STORE.delete(phone);
      return NextResponse.json(
        { error: 'OTP expired. Please request a new one.' },
        { status: 400 }
      );
    }

    if (stored.code !== code) {
      return NextResponse.json(
        { error: 'Invalid OTP' },
        { status: 400 }
      );
    }

    // OTP verified, clear it
    OTP_STORE.delete(phone);

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { phone },
    });

    const isNewUser = !user;

    if (!user) {
      user = await prisma.user.create({
        data: {
          phone,
          whatsapp: phone,
        },
      });
    }

    // Create JWT token
    const token = sign(
      { userId: user.id, phone: user.phone },
      process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      { expiresIn: '30d' }
    );

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        businessName: user.businessName,
      },
      isNewUser,
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json(
      { error: 'Failed to verify OTP' },
      { status: 500 }
    );
  }
}

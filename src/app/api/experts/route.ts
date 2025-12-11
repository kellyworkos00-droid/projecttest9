import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verify } from 'jsonwebtoken';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get('domain');

    const where: any = { verified: true, available: true };
    if (domain) {
      where.domain = { hasSome: [domain] };
    }

    const experts = await prisma.expert.findMany({
      where,
      orderBy: { rating: 'desc' },
      select: {
        id: true,
        name: true,
        domain: true,
        county: true,
        bio: true,
        rateMin: true,
        rateMax: true,
        rating: true,
        reviewCount: true,
        photoUrl: true,
      },
    });

    return NextResponse.json({ experts });
  } catch (error) {
    console.error('Get experts error:', error);
    return NextResponse.json(
      { error: 'Failed to get experts' },
      { status: 500 }
    );
  }
}

// Create a booking request
export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key-change-in-production'
    ) as { userId: string };

    const { expertId, service, message, amount } = await request.json();

    if (!expertId || !service || !amount) {
      return NextResponse.json(
        { error: 'Expert ID, service, and amount required' },
        { status: 400 }
      );
    }

    // Create transaction first
    const transaction = await prisma.transaction.create({
      data: {
        userId: decoded.userId,
        amount,
        provider: 'mpesa',
        status: 'pending',
      },
    });

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        userId: decoded.userId,
        expertId,
        service,
        message,
        amount,
        transactionId: transaction.id,
        status: 'pending',
      },
      include: {
        expert: true,
        user: true,
      },
    });

    return NextResponse.json({
      success: true,
      booking,
      transaction,
    });
  } catch (error) {
    console.error('Create booking error:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}

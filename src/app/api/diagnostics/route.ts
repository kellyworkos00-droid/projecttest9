import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verify } from 'jsonwebtoken';
import { calculateDiagnosticScore, generateActionPlan } from '@/lib/diagnostics';

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

    const { domain, responses } = await request.json();

    if (!domain || !responses) {
      return NextResponse.json(
        { error: 'Domain and responses required' },
        { status: 400 }
      );
    }

    // Calculate score
    const score = calculateDiagnosticScore(responses, domain);

    // Generate action plan
    const actionPlan = generateActionPlan(responses, domain, score);

    // Save diagnostic
    const diagnostic = await prisma.diagnostic.create({
      data: {
        userId: decoded.userId,
        domain,
        responses,
        score,
        actionPlan,
        status: 'completed',
      },
    });

    return NextResponse.json({
      success: true,
      diagnostic: {
        id: diagnostic.id,
        domain,
        score,
        actionPlan,
      },
    });
  } catch (error) {
    console.error('Diagnostic submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit diagnostic' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
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

    const diagnostics = await prisma.diagnostic.findMany({
      where: { userId: decoded.userId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ diagnostics });
  } catch (error) {
    console.error('Get diagnostics error:', error);
    return NextResponse.json(
      { error: 'Failed to get diagnostics' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get('domain');
    const published = searchParams.get('published') !== 'false';

    const where: any = { published };
    if (domain) {
      where.domain = domain;
    }

    const playbooks = await prisma.playbook.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        slug: true,
        title: true,
        titleSw: true,
        description: true,
        descriptionSw: true,
        domain: true,
        sector: true,
        county: true,
        effort: true,
        timeMinutes: true,
        downloads: true,
        views: true,
        published: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ playbooks });
  } catch (error) {
    console.error('Get playbooks error:', error);
    return NextResponse.json(
      { error: 'Failed to get playbooks' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const playbook = await prisma.playbook.create({
      data: {
        slug: data.slug,
        title: data.title,
        titleSw: data.titleSw,
        description: data.description,
        descriptionSw: data.descriptionSw,
        content: data.content,
        contentSw: data.contentSw,
        domain: data.domain,
        sector: data.sector,
        county: data.county,
        effort: data.effort,
        timeMinutes: data.timeMinutes,
        templateUrl: data.templateUrl,
        published: data.published || false,
      },
    });

    return NextResponse.json({ success: true, playbook });
  } catch (error) {
    console.error('Create playbook error:', error);
    return NextResponse.json(
      { error: 'Failed to create playbook' },
      { status: 500 }
    );
  }
}

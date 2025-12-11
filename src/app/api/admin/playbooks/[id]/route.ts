import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const playbook = await prisma.playbook.findUnique({
      where: { id: params.id },
    });

    if (!playbook) {
      return NextResponse.json(
        { error: 'Playbook not found' },
        { status: 404 }
      );
    }

    // Increment views
    await prisma.playbook.update({
      where: { id: params.id },
      data: { views: { increment: 1 } },
    });

    return NextResponse.json({ playbook });
  } catch (error) {
    console.error('Get playbook error:', error);
    return NextResponse.json(
      { error: 'Failed to get playbook' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();

    const playbook = await prisma.playbook.update({
      where: { id: params.id },
      data: {
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
        published: data.published,
      },
    });

    return NextResponse.json({ success: true, playbook });
  } catch (error) {
    console.error('Update playbook error:', error);
    return NextResponse.json(
      { error: 'Failed to update playbook' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.playbook.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete playbook error:', error);
    return NextResponse.json(
      { error: 'Failed to delete playbook' },
      { status: 500 }
    );
  }
}

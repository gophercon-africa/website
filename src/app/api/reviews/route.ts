import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import db from '@/src/db';
import { authConfig } from '@/src/lib/auth';

const reviewSchema = z.object({
  talkId: z.string().cuid(),
  rating: z.number().int().min(1).max(5),
  notes: z.string().max(5000).optional().default(''),
});

export async function GET(request: NextRequest) {
  const session = await getServerSession(authConfig);

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userRole = (session.user as { role?: string }).role;
  if (userRole !== 'reviewer' && userRole !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const currentYear = new Date().getFullYear().toString();
    const talks = await db.talk.findMany({
      where: {
        eventYear: currentYear,
        IsPendingReview: true,
      },
      include: {
        reviews: {
          where: {
            reviewerEmail: session.user.email.toLowerCase(),
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(talks);
  } catch (error) {
    console.error('GET /api/reviews error:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authConfig);

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userRole = (session.user as { role?: string }).role;
  if (userRole !== 'reviewer' && userRole !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const result = reviewSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { talkId, rating, notes } = result.data;
    const reviewerEmail = session.user.email.toLowerCase();

    const review = await db.review.upsert({
      where: {
        talkId_reviewerEmail: {
          talkId,
          reviewerEmail,
        },
      },
      update: {
        rating,
        notes,
        updatedAt: new Date(),
      },
      create: {
        talkId,
        reviewerEmail,
        rating,
        notes,
      },
    });

    return NextResponse.json({ success: true, review });
  } catch (error) {
    console.error('POST /api/reviews error:', error);
    return NextResponse.json({ error: 'Failed to save review' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { z } from 'zod';
import db from '@/src/db';

const reviewSchema = z.object({
  talkId: z.string().cuid(),
  rating: z.number().min(0.5).max(5).multipleOf(0.5),
  notes: z.string().max(5000).optional().default(''),
});

export async function GET(request: NextRequest) {
  const token = await getToken({ req: request });

  if (!token?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userRole = token.role as string | undefined;
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
            reviewerEmail: (token.email as string).toLowerCase(),
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
  const token = await getToken({ req: request });

  if (!token?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userRole = token.role as string | undefined;
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
    const reviewerEmail = (token.email as string).toLowerCase();

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

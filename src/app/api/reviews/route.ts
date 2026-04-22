import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { z } from 'zod';
import db from '@/src/db';

const reviewSchema = z.object({
  talkId: z.string().cuid(),
  rating: z.number().min(0.5).max(5).multipleOf(0.5).nullable().optional(),
  notes: z.string().max(5000).optional().default(''),
  skipped: z.boolean().optional().default(false),
}).refine(
  (data) => data.skipped || (data.rating !== null && data.rating !== undefined),
  { message: 'Rating is required when not skipping', path: ['rating'] }
);

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
      select: {
        id: true,
        talkTitle: true,
        talkDescription: true,
        talkCategory: true,
        talkLevel: true,
        talkDuration: true,
        bio: true,
        previousSpeakingExperience: true,
        additionalNotes: true,
        reviews: {
          where: {
            reviewerEmail: (token.email as string).toLowerCase(),
          },
          select: {
            id: true,
            rating: true,
            notes: true,
            skipped: true,
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

    const { talkId, rating, notes, skipped } = result.data;
    const reviewerEmail = (token.email as string).toLowerCase();
    const currentYear = new Date().getFullYear().toString();

    const talk = await db.talk.findFirst({
      where: { id: talkId, eventYear: currentYear, IsPendingReview: true },
      select: { id: true },
    });

    if (!talk) {
      return NextResponse.json({ error: 'Talk not found or not reviewable' }, { status: 404 });
    }

    const existing = await db.review.findUnique({
      where: { talkId_reviewerEmail: { talkId, reviewerEmail } },
      select: { skipped: true },
    });

    if (existing?.skipped) {
      return NextResponse.json(
        { error: 'This talk has been permanently skipped and cannot be changed' },
        { status: 409 }
      );
    }

    const review = await db.review.upsert({
      where: {
        talkId_reviewerEmail: {
          talkId,
          reviewerEmail,
        },
      },
      update: {
        rating: skipped ? null : rating,
        notes,
        skipped,
        updatedAt: new Date(),
      },
      create: {
        talkId,
        reviewerEmail,
        rating: skipped ? null : rating,
        notes,
        skipped,
      },
    });

    return NextResponse.json({ success: true, review });
  } catch (error) {
    console.error('POST /api/reviews error:', error);
    return NextResponse.json({ error: 'Failed to save review' }, { status: 500 });
  }
}

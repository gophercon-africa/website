import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { z } from 'zod';
import db from '@/src/db';

const reviewSchema = z.object({
  talkId: z.string().cuid(),
  rating: z.number().min(0.5).max(5).multipleOf(0.5).nullable().optional(),
  notes: z.string().max(5000).optional().default(''),
  skipped: z.boolean().optional().default(false),
  skipReason: z.string().max(1000).optional(),
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
  if (userRole !== 'reviewer' && !token.isReviewer) {
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
        email: true,
        talkTitle: true,
        talkDescription: true,
        talkCategory: true,
        talkLevel: true,
        talkDuration: true,
        bio: true,
        additionalNotes: true,
        previousSpeakingExperience: true,
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

    // Same-author detection (by email) across all of this year's talks, not just
    // this reviewer's pending queue, so siblings already decided still surface.
    // The author's name/email itself is never sent to the client — only sibling
    // talk titles — to preserve the existing blind-review anonymization.
    const allTalksThisYear = await db.talk.findMany({
      where: { eventYear: currentYear },
      select: { id: true, email: true, talkTitle: true },
    });

    const talksByEmail = new Map<string, { id: string; talkTitle: string }[]>();
    for (const talk of allTalksThisYear) {
      const key = talk.email.toLowerCase().trim();
      const group = talksByEmail.get(key) ?? [];
      group.push({ id: talk.id, talkTitle: talk.talkTitle });
      talksByEmail.set(key, group);
    }

    const response = talks.map(({ email, ...talk }) => {
      const siblings = (talksByEmail.get(email.toLowerCase().trim()) ?? []).filter(
        (t) => t.id !== talk.id
      );
      return { ...talk, otherSubmissionsByAuthor: siblings };
    });

    return NextResponse.json(response);
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
  if (userRole !== 'reviewer' && !token.isReviewer) {
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

    const { talkId, rating, notes, skipped, skipReason } = result.data;
    const reviewerEmail = (token.email as string).toLowerCase();
    const currentYear = new Date().getFullYear().toString();

    const talk = await db.talk.findFirst({
      where: { id: talkId, eventYear: currentYear, IsPendingReview: true },
      select: { id: true },
    });

    if (!talk) {
      return NextResponse.json({ error: 'Talk not found or not reviewable' }, { status: 404 });
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
        skipReason: skipped ? (skipReason ?? null) : null,
        updatedAt: new Date(),
      },
      create: {
        talkId,
        reviewerEmail,
        rating: skipped ? null : rating,
        notes,
        skipped,
        skipReason: skipped ? (skipReason ?? null) : null,
      },
    });

    return NextResponse.json({ success: true, review });
  } catch (error) {
    console.error('POST /api/reviews error:', error);
    return NextResponse.json({ error: 'Failed to save review' }, { status: 500 });
  }
}

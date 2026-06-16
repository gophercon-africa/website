import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { z } from 'zod';
import { db } from '@/src/db';
import { getTalkStatus, statusToBooleans } from '@/src/lib/talkStatus';
import { computeReviewStats } from '@/src/lib/reviewStats';
import type { AdminSubmissionDetail } from '@/src/types/admin';

const patchSchema = z.object({
  status: z.enum(['pending', 'accepted', 'rejected']),
  decisionNotes: z.string().max(5000).optional().nullable(),
});

async function requireAdmin(request: NextRequest) {
  const token = await getToken({ req: request });

  if (!token?.email) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }

  const userRole = token.role as string | undefined;
  if (userRole !== 'admin') {
    return { error: NextResponse.json({ error: 'Forbidden - Admin only' }, { status: 403 }) };
  }

  return { token };
}

// GET /api/admin/submissions/[id] - Fetch a single submission with all reviews
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(request);
  if (auth.error) return auth.error;

  try {
    const { id } = await params;
    const currentYear = new Date().getFullYear().toString();

    const talk = await db.talk.findFirst({
      where: { id, eventYear: currentYear },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        company: true,
        title: true,
        bio: true,
        talkTitle: true,
        talkDescription: true,
        talkCategory: true,
        talkDuration: true,
        talkLevel: true,
        previousSpeakingExperience: true,
        additionalNotes: true,
        IsAccepted: true,
        IsPendingReview: true,
        decisionNotes: true,
        reviews: {
          select: {
            id: true,
            reviewerEmail: true,
            rating: true,
            notes: true,
            skipped: true,
            skipReason: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!talk) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    const { averageRating, reviewCount } = computeReviewStats(talk.reviews);

    const detail: AdminSubmissionDetail = {
      id: talk.id,
      fullName: talk.fullName,
      email: talk.email,
      phone: talk.phone,
      company: talk.company,
      title: talk.title,
      bio: talk.bio,
      talkTitle: talk.talkTitle,
      talkDescription: talk.talkDescription,
      talkCategory: talk.talkCategory,
      talkDuration: talk.talkDuration,
      talkLevel: talk.talkLevel,
      previousSpeakingExperience: talk.previousSpeakingExperience,
      additionalNotes: talk.additionalNotes,
      status: getTalkStatus(talk),
      decisionNotes: talk.decisionNotes,
      averageRating,
      reviewCount,
      reviews: talk.reviews.map((r) => ({
        ...r,
        updatedAt: r.updatedAt.toISOString(),
      })),
    };

    return NextResponse.json(detail);
  } catch (error) {
    console.error('GET /api/admin/submissions/[id] error:', error);
    return NextResponse.json({ error: 'Failed to fetch submission' }, { status: 500 });
  }
}

// PATCH /api/admin/submissions/[id] - Update a submission's decision status/notes
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(request);
  if (auth.error) return auth.error;

  try {
    const { id } = await params;
    const body = await request.json();
    const result = patchSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { status, decisionNotes } = result.data;
    const currentYear = new Date().getFullYear().toString();

    const existing = await db.talk.findFirst({
      where: { id, eventYear: currentYear },
      select: { id: true },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    const talk = await db.talk.update({
      where: { id },
      data: {
        ...statusToBooleans(status),
        decisionNotes: decisionNotes ?? null,
      },
    });

    return NextResponse.json({ success: true, talk });
  } catch (error) {
    console.error('PATCH /api/admin/submissions/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update submission' }, { status: 500 });
  }
}

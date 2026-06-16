import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { db } from '@/src/db';
import { getTalkStatus } from '@/src/lib/talkStatus';
import { computeReviewStats } from '@/src/lib/reviewStats';
import type { AdminSubmission } from '@/src/types/admin';

// GET /api/admin/submissions - Fetch all submissions with review aggregation
export async function GET(request: NextRequest) {
  const token = await getToken({ req: request });

  if (!token?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userRole = token.role as string | undefined;
  if (userRole !== 'admin') {
    return NextResponse.json({ error: 'Forbidden - Admin only' }, { status: 403 });
  }

  try {
    const currentYear = new Date().getFullYear().toString();

    // Fetch talks with aggregated review stats in a single query
    const talks = await db.talk.findMany({
      where: { eventYear: currentYear },
      select: {
        id: true,
        talkTitle: true,
        fullName: true,
        email: true,
        talkCategory: true,
        IsAccepted: true,
        IsPendingReview: true,
        reviews: { select: { rating: true, skipped: true } },
      },
    });

    // Group talks by case-insensitive email to detect repeat submitters
    const talksByEmail = new Map<string, { id: string; talkTitle: string }[]>();
    for (const talk of talks) {
      const key = talk.email.toLowerCase().trim();
      const group = talksByEmail.get(key) ?? [];
      group.push({ id: talk.id, talkTitle: talk.talkTitle });
      talksByEmail.set(key, group);
    }

    const submissions: AdminSubmission[] = talks.map((talk) => {
      const { averageRating, reviewCount, skippedCount } = computeReviewStats(talk.reviews);
      const group = talksByEmail.get(talk.email.toLowerCase().trim()) ?? [];

      return {
        id: talk.id,
        talkTitle: talk.talkTitle,
        fullName: talk.fullName,
        email: talk.email,
        talkCategory: talk.talkCategory,
        status: getTalkStatus(talk),
        averageRating,
        reviewCount,
        skippedCount,
        duplicateCount: group.length,
        duplicateTalks: group.filter((t) => t.id !== talk.id),
      };
    });

    // Sort by reviewCount desc, then averageRating desc as tiebreaker
    submissions.sort((a, b) =>
      b.reviewCount - a.reviewCount || (b.averageRating ?? 0) - (a.averageRating ?? 0)
    );

    return NextResponse.json(submissions);
  } catch (error) {
    console.error('GET /api/admin/submissions error:', error);
    return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 });
  }
}

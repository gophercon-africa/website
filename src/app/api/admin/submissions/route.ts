import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { db } from '@/src/db';

interface AdminSubmission {
  id: string;
  talkTitle: string;
  fullName: string;
  talkCategory: string;
  averageRating: number | null;
  reviewCount: number;
  skippedCount: number;
}

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
        talkCategory: true,
        _count: { select: { reviews: { where: { skipped: false } } } },
        reviews: { select: { rating: true, skipped: true } },
      },
    });

    const submissions: AdminSubmission[] = talks.map((talk) => {
      const ratedReviews = talk.reviews.filter((r) => !r.skipped && r.rating !== null);
      const skippedCount = talk.reviews.filter((r) => r.skipped).length;
      const reviewCount = ratedReviews.length;
      const averageRating =
        reviewCount > 0
          ? ratedReviews.reduce((sum, r) => sum + (r.rating ?? 0), 0) / reviewCount
          : null;
      return {
        id: talk.id,
        talkTitle: talk.talkTitle,
        fullName: talk.fullName,
        talkCategory: talk.talkCategory,
        averageRating,
        reviewCount,
        skippedCount,
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

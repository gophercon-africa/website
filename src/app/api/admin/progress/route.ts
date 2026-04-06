import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { db } from '@/src/db';
import { REVIEWER_EMAILS, ADMIN_EMAILS } from '@/src/lib/config';
import { AdminProgressResponse } from '@/src/types/admin';

// GET /api/admin/progress - Fetch reviewer progress
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

    // Get total submissions for current year
    const totalSubmissions = await db.talk.count({
      where: {
        eventYear: currentYear,
        IsPendingReview: true,
      },
    });

    // Get all reviewers (combine REVIEWER_EMAILS and ADMIN_EMAILS, deduplicated)
    const allReviewers = [...new Set([...REVIEWER_EMAILS, ...ADMIN_EMAILS])];

    // Single query: count reviews per reviewer for talks in the current year
    const reviewCounts = await db.review.groupBy({
      by: ['reviewerEmail'],
      where: {
        talk: { eventYear: currentYear },
      },
      _count: { id: true },
    });

    const countByEmail = new Map(reviewCounts.map((r) => [r.reviewerEmail, r._count.id]));

    // Build progress for every configured reviewer (including those with 0 reviews)
    const reviewerProgress = allReviewers.map((reviewerEmail) => {
      const reviewsCompleted = countByEmail.get(reviewerEmail) ?? 0;
      const percentageComplete = totalSubmissions > 0
        ? Math.round((reviewsCompleted / totalSubmissions) * 100)
        : 0;

      return {
        reviewerEmail,
        reviewsCompleted,
        totalSubmissions,
        percentageComplete,
      };
    });

    // Sort by completion percentage (highest first)
    reviewerProgress.sort((a, b) => b.percentageComplete - a.percentageComplete);

    const response: AdminProgressResponse = {
      reviewers: reviewerProgress,
      totalSubmissions,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('GET /api/admin/progress error:', error);
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 });
  }
}

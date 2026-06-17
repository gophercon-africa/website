import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { db } from '@/src/db';
import { listAuthorizedUsers } from '@/src/lib/authorizedUsers';
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

    // Get total submissions for current year (independent of decision status,
    // so a talk being accepted/rejected mid-cycle doesn't shrink the denominator
    // below a reviewer's already-recorded review count)
    const totalSubmissions = await db.talk.count({
      where: { eventYear: currentYear },
    });

    // Get all reviewers (anyone with the reviewer or admin flag, from the DB)
    const authorizedUsers = await listAuthorizedUsers();
    const allReviewers = authorizedUsers
      .filter((u) => u.isReviewer || u.isAdmin)
      .map((u) => u.email);

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

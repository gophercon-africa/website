import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { db } from '@/src/db';
import { authConfig } from '@/src/lib/auth';
import { REVIEWER_EMAILS, ADMIN_EMAILS } from '@/src/lib/config';
import { AdminProgressResponse } from '@/src/types/admin';

// GET /api/admin/progress - Fetch reviewer progress
export async function GET(request: NextRequest) {
  const session = await getServerSession(authConfig);

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userRole = (session.user as any).role;
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

    // Get all reviewers (combine REVIEWER_EMAILS and ADMIN_EMAILS)
    const allReviewers = [...REVIEWER_EMAILS, ...ADMIN_EMAILS];

    // For each reviewer, count how many reviews they've submitted
    const reviewerProgress = await Promise.all(
      allReviewers.map(async (reviewerEmail) => {
        const reviewsCompleted = await db.review.count({
          where: {
            reviewerEmail,
            talk: {
              eventYear: currentYear,
            },
          },
        });

        const percentageComplete = totalSubmissions > 0
          ? Math.round((reviewsCompleted / totalSubmissions) * 100)
          : 0;

        return {
          reviewerEmail,
          reviewsCompleted,
          totalSubmissions,
          percentageComplete,
        };
      })
    );

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

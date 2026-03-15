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

    // Fetch all talks with their reviews for the current year
    const talks = await db.talk.findMany({
      where: { eventYear: currentYear },
      include: {
        reviews: {
          select: { rating: true },
        },
      },
    });

    // Compute aggregates in JavaScript
    const submissions: AdminSubmission[] = talks.map(talk => ({
      id: talk.id,
      talkTitle: talk.talkTitle,
      fullName: talk.fullName,
      talkCategory: talk.talkCategory,
      averageRating: talk.reviews.length > 0
        ? talk.reviews.reduce((sum, r) => sum + r.rating, 0) / talk.reviews.length
        : null,
      reviewCount: talk.reviews.length,
    }));

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

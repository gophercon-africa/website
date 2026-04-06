import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { db } from '@/src/db';
import { AdminStats } from '@/src/types/admin';

// GET /api/admin/stats - Fetch submission statistics
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

    // Count total submissions
    const total = await db.talk.count({
      where: { eventYear: currentYear },
    });

    // Count pending (IsPendingReview = true)
    const pending = await db.talk.count({
      where: {
        eventYear: currentYear,
        IsPendingReview: true,
      },
    });

    // Count reviewed (has at least one review) — done directly in the DB
    const reviewed = await db.talk.count({
      where: {
        eventYear: currentYear,
        reviews: { some: {} },
      },
    });

    // Count accepted
    const accepted = await db.talk.count({
      where: {
        eventYear: currentYear,
        IsAccepted: true,
      },
    });

    // Count rejected (not accepted and not pending)
    const rejected = await db.talk.count({
      where: {
        eventYear: currentYear,
        IsAccepted: false,
        IsPendingReview: false,
      },
    });

    const stats: AdminStats = {
      total,
      pending,
      reviewed,
      accepted,
      rejected,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('GET /api/admin/stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}

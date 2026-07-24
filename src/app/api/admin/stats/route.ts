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

    // One count per status in a single query
    const byStatus = await db.talk.groupBy({
      by: ['status'],
      where: { eventYear: currentYear },
      _count: { _all: true },
    });

    const statusCount = (status: string) =>
      byStatus.find((g) => g.status === status)?._count._all ?? 0;

    const total = byStatus.reduce((sum, g) => sum + g._count._all, 0);

    // Count reviewed (has at least one non-skipped review) — done directly in the DB
    const reviewed = await db.talk.count({
      where: {
        eventYear: currentYear,
        reviews: { some: { skipped: false } },
      },
    });

    const stats: AdminStats = {
      total,
      pending: statusCount('pending'),
      shortlisted: statusCount('shortlisted'),
      waitlisted: statusCount('waitlisted'),
      reviewed,
      accepted: statusCount('accepted'),
      rejected: statusCount('rejected'),
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('GET /api/admin/stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}

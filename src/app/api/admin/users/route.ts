import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { z } from 'zod';
import { db } from '@/src/db';
import { listAuthorizedUsers } from '@/src/lib/authorizedUsers';

const createUserSchema = z
  .object({
    email: z.string().email(),
    isAdmin: z.boolean().optional().default(false),
    isReviewer: z.boolean().optional().default(false),
  })
  .refine((data) => data.isAdmin || data.isReviewer, {
    message: 'At least one of isAdmin or isReviewer must be true',
  });

// GET /api/admin/users - List all authorized users
export async function GET(request: NextRequest) {
  const token = await getToken({ req: request });

  if (!token?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (token.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden - Admin only' }, { status: 403 });
  }

  try {
    const users = await listAuthorizedUsers();
    return NextResponse.json(users);
  } catch (error) {
    console.error('GET /api/admin/users error:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

// POST /api/admin/users - Add a new authorized user
export async function POST(request: NextRequest) {
  const token = await getToken({ req: request });

  if (!token?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (token.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden - Admin only' }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const result = createUserSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ error: result.error.issues[0]?.message ?? 'Invalid input' }, { status: 400 });
  }

  const email = result.data.email.toLowerCase().trim();

  try {
    const existing = await db.authorizedUser.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    const user = await db.authorizedUser.create({
      data: { email, isAdmin: result.data.isAdmin, isReviewer: result.data.isReviewer },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error('POST /api/admin/users error:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}

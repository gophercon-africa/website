import { db } from '@/src/db';
import { REVIEWER_EMAILS, ADMIN_EMAILS } from '@/src/lib/config';
import type { AuthorizedUser } from '@/src/generated/prisma';

function getEnvEmailRole(email: string): 'admin' | 'reviewer' | null {
  if (ADMIN_EMAILS.includes(email)) return 'admin';
  if (REVIEWER_EMAILS.includes(email)) return 'reviewer';
  return null;
}

export async function getEmailRole(email: string): Promise<'admin' | 'reviewer' | null> {
  const normalized = email.toLowerCase().trim();
  const user = await db.authorizedUser.findUnique({ where: { email: normalized } });

  if (user) {
    if (user.isAdmin) return 'admin';
    if (user.isReviewer) return 'reviewer';
    return null;
  }

  return getEnvEmailRole(normalized);
}

export async function isAuthorizedEmail(email: string): Promise<boolean> {
  return (await getEmailRole(email)) !== null;
}

async function seedFromEnv(): Promise<void> {
  const emails = new Map<string, { isAdmin: boolean; isReviewer: boolean }>();

  for (const email of ADMIN_EMAILS) {
    emails.set(email, { isAdmin: true, isReviewer: false });
  }
  for (const email of REVIEWER_EMAILS) {
    const existing = emails.get(email);
    emails.set(email, { isAdmin: existing?.isAdmin ?? false, isReviewer: true });
  }

  if (emails.size === 0) return;

  await db.$transaction(
    Array.from(emails.entries()).map(([email, flags]) =>
      db.authorizedUser.upsert({
        where: { email },
        update: {},
        create: { email, ...flags },
      })
    )
  );
}

export async function listAuthorizedUsers(): Promise<AuthorizedUser[]> {
  let users = await db.authorizedUser.findMany({ orderBy: { email: 'asc' } });

  if (users.length === 0 && (ADMIN_EMAILS.length > 0 || REVIEWER_EMAILS.length > 0)) {
    await seedFromEnv();
    users = await db.authorizedUser.findMany({ orderBy: { email: 'asc' } });
  }

  return users;
}

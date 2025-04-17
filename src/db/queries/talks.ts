import db from '@/src/db';
import { Talk } from '@prisma/client';

export type TalkWithData = Talk;

export async function createTalk(talk: Omit<Talk, 'id' | 'createdAt' | 'updatedAt'>): Promise<Talk> {
  const now = new Date();
  return await db.talk.create({
    data: {
      ...talk,
      createdAt: now,
      updatedAt: now,
    },
  });
}

export async function fetchTalksByYear(year: string): Promise<Talk[]> {
  return await db.talk.findMany({
    where: { eventYear: year },
  });
}

export async function fetchTalkById(id: string): Promise<Talk | null> {
  return await db.talk.findUnique({
    where: { id },
  });
}

export async function updateTalk(talk: Talk): Promise<Talk> {
  return await db.talk.update({
    where: { id: talk.id },
    data: talk,
  });
}
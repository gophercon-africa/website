// import type { Talk } from '@prisma/client';
import { db } from '@/src/db';

// export type TalkWithData = Talk & {
//   topic: { slug: string };
//   user: { name: string | null };
//   _count: { comments: number };
// };

// export function fetchTalksByTopicSlug(slug: string): Promise<TalkWithData[]> {
//   return db.talk.findMany({
//     where: { topic: { slug } },
//     include: {
//       topic: { select: { slug: true } },
//       user: { select: { name: true } },
//       _count: { select: { comments: true } },
//     },
//   });
// }

import { PrismaClient } from '../../gophercon-prisma/node_modules/@prisma/client';
// import { PrismaClient } from '../../node_modules/@prisma/client';
// this causes type issues Property 'newsletterSubscriber' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.
// import { PrismaClient } from '@prisma/client';


const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
} 
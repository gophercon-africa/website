import { PrismaClient } from "../generated/prisma";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export const db = prisma;
export default prisma;
import { PrismaClient } from "../generated/prisma";
import { withAccelerate } from "@prisma/extension-accelerate";

// Accelerate is required on Cloudflare Workers, where the client is generated
// with --no-engine and DATABASE_URL is a prisma+postgres:// URL. Against a
// plain postgres:// URL (local dev) the extension is a no-op.
// Typed as the base PrismaClient: the extension changes no model APIs we use,
// and the extended type breaks groupBy/_count inference in Prisma 5.
const createPrisma = () =>
  new PrismaClient().$extends(withAccelerate()) as unknown as PrismaClient;

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || createPrisma();

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export const db = prisma;
export default prisma;

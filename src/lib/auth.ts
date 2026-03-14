import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import db from "@/src/db";
import { verifyOtp as verifyOtpHash } from "@/src/lib/otp";

export const authConfig: NextAuthOptions = {
  adapter: PrismaAdapter(db as never),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        otp: { label: "OTP", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.otp) {
          return null;
        }

        const normalizedEmail = credentials.email.toLowerCase().trim();

        const otpRecord = await db.otpToken.findFirst({
          where: {
            email: normalizedEmail,
            used: true,
            expiresAt: { gte: new Date(Date.now() - 60000) },
          },
          orderBy: { updatedAt: "desc" },
        });

        if (otpRecord && verifyOtpHash(credentials.otp, otpRecord.tokenHash)) {
          return {
            id: normalizedEmail,
            email: normalizedEmail,
            name: normalizedEmail,
            role: otpRecord.role,
          };
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: "/auth/otp-login",
    error: "/error",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = (user as { role?: string }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string; email?: string | null; role?: string }).id = token.id as string;
        session.user.email = token.email as string;
        (session.user as { role?: string }).role = token.role as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};

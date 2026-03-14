import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import db from "@/src/db";
import { verifyOtp as verifyOtpHash } from "@/src/lib/otp";
import { SESSION_EXPIRY_DAYS } from "@/src/lib/config";

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

        // Find the most recent unused, unexpired OTP for this email
        const otpRecord = await db.otpToken.findFirst({
          where: {
            email: normalizedEmail,
            used: false,
            expiresAt: { gte: new Date() },
          },
          orderBy: { createdAt: "desc" },
        });

        if (!otpRecord) {
          return null;
        }

        // Increment attempts BEFORE checking (prevents timing oracle)
        await db.otpToken.update({
          where: { id: otpRecord.id },
          data: { attempts: { increment: 1 } },
        });

        // Check attempt limit (otpRecord.attempts is the value BEFORE increment)
        if (otpRecord.attempts >= 5) {
          await db.otpToken.update({
            where: { id: otpRecord.id },
            data: { used: true },
          });
          return null;
        }

        // Verify OTP using constant-time comparison
        if (!verifyOtpHash(credentials.otp, otpRecord.tokenHash)) {
          return null;
        }

        // Mark OTP as used on successful verification
        await db.otpToken.update({
          where: { id: otpRecord.id },
          data: { used: true },
        });

        return {
          id: normalizedEmail,
          email: normalizedEmail,
          name: normalizedEmail,
          role: otpRecord.role,
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/otp-login",
    error: "/error",
  },
  session: {
    strategy: "jwt",
    maxAge: SESSION_EXPIRY_DAYS * 24 * 60 * 60,
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

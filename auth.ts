import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { Awaitable, User } from "next-auth";
import type { NextAuthOptions } from "next-auth";
import axios from "axios";
import { JWT } from "next-auth/jwt";
import paths from "./src/path";

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers

  providers: [
    // ...add more providers here
    GoogleProvider({
      clientId:
        "",
      clientSecret: "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      // Add the token and user data to the JWT token
      if (user) {
        token.accessToken = user.token;
        token.user = user.data;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      // Add the token and user data to the session
      session.token = token.accessToken;
      session.user = token.user;
      return session;
     },
    async redirect({ url }) {
      return Promise.resolve(url);
    },
    async signIn({ account, profile, user }) {
      return true; // Do different verification for other providers that don't have `email_verified`
    },
  },

  pages: {
    signIn: paths.signin(),
    signOut: paths.signout(),
  },
  secret: process.env.NEXTAUTH_SECRET ?? "supersecret",
  session: {
    strategy: "jwt",
    maxAge: 5 * 60 * 60, // 5 hour
  },
  jwt: {
    // The maximum age of the NextAuth.js issued JWT in seconds.
    // Defaults to `session.maxAge`.
    maxAge: 60 * 60 * 5, // 5 hours
  },
};

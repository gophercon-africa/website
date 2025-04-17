import NextAuth from "next-auth";
import { authConfig } from "@/src/lib/auth";

const handler = NextAuth(authConfig);

// Use named exports for App Router
export const GET = handler;
export const POST = handler; 
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Public routes should never force authentication.
// Keep this list explicit so "startsWith('/')" doesn't accidentally make everything public.
const publicExact = new Set([
  '/',
  '/workshops',
  '/schedule',
  '/speakers',
  '/call-for-speakers',
  '/signin',
  '/signup',
  '/error',
])

const publicPrefixes = [
  '/api/auth', // NextAuth endpoints
]

function isPublicPath(pathname: string) {
  if (publicExact.has(pathname)) return true
  return publicPrefixes.some((prefix) => pathname.startsWith(prefix))
}

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const { pathname } = request.nextUrl

  // Always allow access to NextAuth.js API routes
  if (pathname.startsWith('/api/auth')) {
    return NextResponse.next()
  }

  // Allow access to public paths
  if (isPublicPath(pathname)) {
    // If user is authenticated and tries to access auth pages, redirect home.
    if (token && (pathname === '/signin' || pathname === '/signup')) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    return NextResponse.next()
  }

  // For all other routes, require authentication
  if (!token) {
    const signInUrl = new URL('/signin', request.url)
    signInUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
} 

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Define public paths that should be accessible to everyone
const publicPaths = [
  '/',
  '/signin',
  '/signup',
  '/api/auth',
  '/api/auth/signin',
  '/api/auth/signup',
  '/api/auth/callback',
  '/api/auth/signout',
]

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const { pathname } = request.nextUrl

  // Allow access to public paths
  if (publicPaths.some(path => pathname.startsWith(path))) {
    // If user is authenticated and tries to access auth pages, redirect to dashboard
    if (token && (pathname === '/' ||pathname === '/signin' || pathname === '/signup')) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
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
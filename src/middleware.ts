import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Public routes — never require authentication
const publicExact = new Set([
  '/',
  '/2025',
  '/workshops',
  '/schedule',
  '/speakers',
  '/call-for-speakers',
  '/signin',
  '/signup',
  '/error',
  '/otp-login',
  '/otp-verify',
])

const publicPrefixes = [
  '/api/auth', // NextAuth endpoints
]

// Routes that require reviewer OR admin role
const reviewerPrefixes = [
  '/reviews',
]

// Routes that require admin role only
const adminPrefixes = [
  '/admin',
]

function isPublicPath(pathname: string) {
  if (publicExact.has(pathname)) return true
  return publicPrefixes.some((prefix) => pathname.startsWith(prefix))
}

function isReviewerPath(pathname: string) {
  return reviewerPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(prefix + '/'))
}

function isAdminPath(pathname: string) {
  return adminPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(prefix + '/'))
}

// Kept as middleware.ts (not Next 16's proxy.ts): proxy files are forced onto
// the Node.js runtime, which @opennextjs/cloudflare does not support yet.
// middleware.ts still compiles for the edge runtime, which Workers requires.
// Legacy/alias hostnames served by this Worker; 301 everything to the apex.
const redirectHosts = new Set([
  'gophers.africa',
  'www.gophers.africa',
  'www.gophercon.africa',
])

export async function middleware(request: NextRequest) {
  const host = request.headers.get('host') ?? ''
  if (redirectHosts.has(host)) {
    const { pathname, search } = request.nextUrl
    return NextResponse.redirect(new URL(`https://gophercon.africa${pathname}${search}`), 301)
  }

  const token = await getToken({ req: request })
  const { pathname } = request.nextUrl

  // Always allow NextAuth API routes
  if (pathname.startsWith('/api/auth')) {
    return NextResponse.next()
  }

  // Allow public paths
  if (isPublicPath(pathname)) {
    // Redirect authenticated users away from auth pages
    if (token && (pathname === '/signin' || pathname === '/signup' || pathname === '/otp-login' || pathname === '/otp-verify')) {
      const role = token.role as string | undefined
      return NextResponse.redirect(new URL(role === 'admin' ? '/admin' : '/reviews', request.url))
    }
    return NextResponse.next()
  }

  // Require authentication for all protected routes
  if (!token) {
    const loginUrl = new URL('/otp-login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  const role = token.role as string | undefined

  // Admin routes: require admin role
  if (isAdminPath(pathname)) {
    if (role !== 'admin') {
      return NextResponse.redirect(new URL('/reviews', request.url))
    }
    return NextResponse.next()
  }

  // Reviewer routes: require reviewer role or admin-who-is-also-a-reviewer
  if (isReviewerPath(pathname)) {
    const isReviewer = token.isReviewer as boolean | undefined
    if (role !== 'reviewer' && !isReviewer) {
      const loginUrl = new URL('/otp-login', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
    return NextResponse.next()
  }

  // All other authenticated routes: allow
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Skip Next internals and any static file (paths with a file extension).
    '/((?!_next/static|_next/image|favicon.ico|public|.*\\..*).*)',
  ],
}

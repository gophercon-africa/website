import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Public routes — never require authentication
const publicExact = new Set([
  '/',
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

export async function middleware(request: NextRequest) {
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

  // Reviewer routes: require reviewer or admin role
  if (isReviewerPath(pathname)) {
    if (role !== 'reviewer' && role !== 'admin') {
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
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}

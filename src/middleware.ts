import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Define public paths that should be accessible to everyone
const publicPaths = [
  '/',
  '/signin',
  '/signup',
  '/verify-account',
  '/api/auth',
  '/api/auth/signin',
  '/api/auth/signup',
  '/api/auth/callback',
  '/api/auth/signout',
  '/talks',
  '/talks/create',
  '/talks/:talkId/edit',
]

export async function middleware(request: NextRequest) {
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV === 'production'
  })
  
  const { pathname } = request.nextUrl

  // Check if the path is a public path
  const isPublicPath = publicPaths.some(path => {
    if (path === '/') {
      return pathname === path
    }

    return pathname.startsWith(path)
  })

  // If it's a public path
  if (isPublicPath) {
    // If user is authenticated and tries to access auth pages, redirect to dashboard
    if (token && (pathname === '/' || pathname === '/signin' || pathname === '/signup')) {
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
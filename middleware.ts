import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// List of public paths that don't require authentication
const publicPaths = ['/login', '/register', '/videos', '/']

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')
  const currentPath = request.nextUrl.pathname

  // Allow access to public paths
  if (publicPaths.includes(currentPath)) {
    return NextResponse.next()
  }

  // Check if user is authenticated
  if (!token) {
    // Redirect to login if not authenticated
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}

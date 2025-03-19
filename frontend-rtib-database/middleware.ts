import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This array contains paths that are accessible without authentication
const publicPaths = ['/auth', '/_next', '/api/auth', '/favicon.ico'];

// This array contains paths that require admin authentication
const adminPaths = ['/admin'];

// Check if the request path starts with any of the public paths
const isPublicPath = (path: string) => {
  return publicPaths.some(publicPath => path.startsWith(publicPath));
};

// Check if the path is an admin path
const isAdminPath = (path: string) => {
  return adminPaths.some(adminPath => path.startsWith(adminPath));
};

export function middleware(request: NextRequest) {
  // Get the path of the request
  const path = request.nextUrl.pathname;
  
  // Get auth cookie (this would be set when a user logs in)
  const authCookie = request.cookies.get('authToken');
  const isAuthenticated = !!authCookie;

  // Allow access to public paths regardless of authentication status
  if (isPublicPath(path)) {
    return NextResponse.next();
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    const url = new URL('/auth', request.url);
    return NextResponse.redirect(url);
  }

  // At this point, user is authenticated
  // If trying to access admin paths, don't check admin status in middleware
  // We'll do this check in the component level since we need to fetch Firestore data
  
  // Allow authenticated users to access protected routes
  return NextResponse.next();
}

// Configure which routes the middleware applies to
export const config = {
  matcher: [
    // Apply to all routes except static files and api routes
    '/((?!_next/static|_next/image|assets|api/auth|favicon).*)',
  ],
}; 
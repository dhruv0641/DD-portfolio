import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const host = request.headers.get('host') || '';

  // Detect if the user is visiting via the "admin" subdomain (e.g. admin.dhruvkumar.tech)
  if (host.toLowerCase().startsWith('admin.')) {
    // If they are visiting the root URL (e.g., admin.dhruvkumar.tech/), redirect them to the login panel
    if (url.pathname === '/') {
      url.pathname = '/editor';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// Ensure middleware only intercepts page routes, ignoring static images and assets
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (static public files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};

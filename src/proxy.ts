import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decryptSession, getSessionCookieName } from './lib/auth';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all /admin routes, excluding the login page
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const sessionCookie = request.cookies.get(getSessionCookieName());

    if (!sessionCookie) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    const session = await decryptSession(sessionCookie.value);
    if (!session) {
      // Clear cookie and redirect to login if session verification fails
      const response = NextResponse.redirect(new URL('/admin/login', request.url));
      response.cookies.delete(getSessionCookieName());
      return response;
    }
  }

  return NextResponse.next();
}

export default proxy;

export const config = {
  matcher: ['/admin/:path*'],
};

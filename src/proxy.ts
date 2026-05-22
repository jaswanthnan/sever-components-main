import { auth } from "@/auth";
import { NextResponse } from "next/server";

export const proxy = auth((req) => {
  const { nextUrl } = req;
  const isAuthenticated = !!req.auth;

  // 1. Request Rewriting Example
  // Rewrite '/careers' internally to '/jobs'
  if (nextUrl.pathname === '/careers') {
    return NextResponse.rewrite(new URL('/jobs', req.url));
  }

  // 2. Auth Protection and Redirects
  const isProtectedRoute =
    nextUrl.pathname.startsWith('/dashboard') ||
    nextUrl.pathname.startsWith('/candidates') ||
    nextUrl.pathname.startsWith('/jobs');

  const isAuthRoute =
    nextUrl.pathname.startsWith('/login') ||
    nextUrl.pathname.startsWith('/register');

  if (isProtectedRoute && !isAuthenticated) {
    // Redirect unauthenticated users to login page
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && isAuthenticated) {
    // Redirect authenticated users away from login/register to dashboard
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
});

export const config = {
  /*
   * Match all request paths except for the ones starting with:
   * - api (API routes)
   * - _next/static (static files)
   * - _next/image (image optimization files)
   * - favicon.ico (favicon file)
   */
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
export default proxy;

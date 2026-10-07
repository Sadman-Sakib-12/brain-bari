import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const BACKEND_ORIGIN =
  process.env.BACKEND_INTERNAL_URL ||
  process.env.BACKEND_URL ||
  "http://localhost:5000";

// Public pages that do not require authentication
const PUBLIC_PATHS = ["/login", "/register"];

/**
 * Next.js Network-level Proxy & NextAuth JWT Guard Middleware
 * 1. Allows NextAuth internal routes (/api/auth/*) to be handled by NextAuth
 * 2. Proxies application /api/* requests to Express backend
 * 3. Protects admin panel routes using NextAuth JWT session validation
 */
export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // 1. NextAuth internal authentication endpoints
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // 2. API PROXY: Route backend /api/* requests to Express backend server
  if (pathname.startsWith("/api")) {
    const targetUrl = new URL(pathname + search, BACKEND_ORIGIN);
    return NextResponse.rewrite(targetUrl);
  }

  // 3. AUTH GUARD: Check NextAuth JWT token
  const nextAuthToken = await getToken({
    req: request,
    secret:
      process.env.NEXTAUTH_SECRET ||
      "eiQSVr4Q040K2XfYhxkVf/fVFjUfEWOBaGDyKSnDUD0=",
  });

  const isAuth =
    Boolean(nextAuthToken) ||
    request.cookies.get("brainbari_admin_auth")?.value === "true" ||
    Boolean(request.cookies.get("next-auth.session-token")?.value) ||
    Boolean(request.cookies.get("__Secure-next-auth.session-token")?.value);

  const isPublicPage = PUBLIC_PATHS.some((path) => pathname === path);

  // If user is NOT logged in and trying to access protected admin pages:
  if (!isAuth && !isPublicPage) {
    const loginUrl = new URL("/login", request.url);
    if (pathname !== "/") {
      loginUrl.searchParams.set("callbackUrl", pathname + search);
    }
    return NextResponse.redirect(loginUrl);
  }

  // If user is ALREADY logged in and tries to access /login or /register, redirect to dashboard:
  if (isAuth && isPublicPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, images, icons, robots.txt, etc.
     */
    "/((?!_next/static|_next/image|favicon.ico|images|icons|robots.txt).*)",
  ],
};

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// This middleware ensures that routes are protected
export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Define which paths are protected (require authentication)
  const protectedPaths = ["/dashboard"];

  // Check if the path is protected
  const isProtectedPath = protectedPaths.some(
    (protectedPath) =>
      path === protectedPath || path.startsWith(`${protectedPath}/`)
  );

  // If the path is not protected, allow the request
  if (!isProtectedPath) {
    return NextResponse.next();
  }

  // Get the token from the request
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // If there is no token and the path is protected, redirect to login
  if (!token) {
    // Store the original URL to redirect back after login
    const url = new URL("/login", request.url);

    // Add cache control headers to prevent caching
    const response = NextResponse.redirect(url);
    response.headers.set(
      "Cache-Control",
      "no-store, max-age=0, must-revalidate"
    );

    return response;
  }

  // Add cache control headers to prevent caching of protected pages
  const response = NextResponse.next();
  response.headers.set("Cache-Control", "no-store, max-age=0, must-revalidate");

  return response;
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    // Match all paths except for:
    // - API routes
    // - Static files (images, js, css)
    // - Favicon
    // - Login page
    // - API auth callback routes
    "/((?!api|_next/static|_next/image|favicon.ico|login).*)",
  ],
};

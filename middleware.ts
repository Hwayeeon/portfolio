import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Create response
  const response = NextResponse.next();

  // Security Headers
  const securityHeaders = {
    // Content Security Policy
    "Content-Security-Policy": [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live https://vercel.com https://*.vercel.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: https: blob:",
      "media-src 'self' https:",
      "connect-src 'self' https://vercel.com https://*.vercel.com https://vitals.vercel-insights.com wss:",
      "frame-src 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests",
    ].join("; "),

    // X-Frame-Options (legacy support)
    "X-Frame-Options": "DENY",

    // X-Content-Type-Options
    "X-Content-Type-Options": "nosniff",

    // Referrer Policy
    "Referrer-Policy": "strict-origin-when-cross-origin",

    // X-XSS-Protection (legacy support)
    "X-XSS-Protection": "1; mode=block",

    // Strict Transport Security (HTTPS only)
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",

    // Permissions Policy
    "Permissions-Policy": [
      "camera=()",
      "microphone=()",
      "geolocation=()",
      "interest-cohort=()",
      "payment=()",
    ].join(", "),

    // Cross Origin Embedder Policy
    "Cross-Origin-Embedder-Policy": "credentialless",

    // Cross Origin Opener Policy
    "Cross-Origin-Opener-Policy": "same-origin",

    // Cross Origin Resource Policy
    "Cross-Origin-Resource-Policy": "cross-origin",
  };

  // Apply security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Add cache headers for static assets
  if (
    request.nextUrl.pathname.startsWith("/_next/static/") ||
    request.nextUrl.pathname.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$/)
  ) {
    response.headers.set("Cache-Control", "public, max-age=31536000, immutable");
  }

  // Add cache headers for API routes (feeds)
  if (request.nextUrl.pathname.match(/\/(rss|atom|feed\.json)$/)) {
    response.headers.set("Cache-Control", "s-maxage=3600, stale-while-revalidate=86400");
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};

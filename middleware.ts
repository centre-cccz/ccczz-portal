import { NextRequest, NextResponse } from 'next/server';

// Redirects and rewrites configuration for CCCZ Portal

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redirect old URLs to new ones
  const redirects: Record<string, string> = {
    '/home': '/',
    '/news': '/actualites',
    '/events': '/evenements',
    '/artists': '/artistes',
    '/gallery': '/galerie',
    '/ticketing': '/billetterie',
    '/spaces': '/espaces',
    '/directions': '/directions',
    '/partners': '/partenaires',
    '/projects': '/projets',
    '/contact-us': '/contact',
    '/about-us': '/about'
  };

  // Check for redirects
  if (redirects[pathname]) {
    return NextResponse.redirect(
      new URL(redirects[pathname], request.url),
      { status: 301 }
    );
  }

  // Handle trailing slashes
  if (pathname.endsWith('/') && pathname !== '/') {
    return NextResponse.redirect(
      new URL(pathname.slice(0, -1), request.url),
      { status: 301 }
    );
  }

  // Security headers
  const response = NextResponse.next();

  // Add security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // Add HSTS in production
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains'
    );
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
     * - public files with extensions
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
};
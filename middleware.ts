import { NextRequestWithAuth, withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req: NextRequestWithAuth) {
    if (
      req.nextUrl.pathname.startsWith('/admin') &&
      req.nextauth.token?.role !== 'admin'
    ) {
      return NextResponse.rewrite(new URL('/denied', req.url));
    }

    if (
      req.nextUrl.pathname.startsWith('/user') &&
      req.nextauth.token?.role !== 'user'
    ) {
      return NextResponse.rewrite(new URL('/denied', req.url));
    }

    const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
    const cspHeader = `
    default-src 'self';
    script-src 'self' https: http: ${
      process.env.NODE_ENV === 'development' ? " 'unsafe-eval'" : ''
    } 'nonce-${nonce}' 'strict-dynamic';
    script-src-elem 'self' https: http: ${
      process.env.NODE_ENV === 'development' ? " 'unsafe-eval'" : ''
    } 'nonce-${nonce}';
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: res.cloudinary.com;
    font-src 'self';
    frame-src 'self';
    connect-src 'self' https://vitals.vercel-insights.com/v1/vitals https://api.stripe.com;
`;

    const requestHeaders = new Headers(req.headers);
    // Setting request headers
    requestHeaders.set('x-nonce', nonce);
    requestHeaders.set(
      'Content-Security-Policy',
      // Replace newline characters and spaces
      cspHeader.replace(/\s{2,}/g, ' ').trim()
    );

    return NextResponse.next({
      headers: requestHeaders,
      request: {
        headers: requestHeaders,
      },
    });
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ['/user/:path*', '/admin/:path*'],
  missing: [
    { type: 'header', key: 'next-router-prefetch' },
    { type: 'header', key: 'purpose', value: 'prefetch' },
  ],
};

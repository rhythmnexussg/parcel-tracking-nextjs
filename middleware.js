import { NextResponse } from 'next/server';

export function middleware(request) {
  const { nextUrl } = request;
  const path = nextUrl.pathname || '';

  // Support legacy admin-style path format: /country=AT
  if (path.startsWith('/country=')) {
    const countryPart = path.slice('/country='.length).split('/')[0];
    const countryCode = (countryPart || '').trim().toUpperCase();

    if (/^[A-Z]{2}$/.test(countryCode)) {
      const url = nextUrl.clone();
      url.pathname = '/track-your-item';
      url.searchParams.set('country', countryCode);
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/:path*',
};

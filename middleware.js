import { NextResponse } from 'next/server';

const ACCESS_COOKIE_NAME = 'rnx_access_granted';
const ACCESS_COOKIE_VALUE = '1';

const ADMIN_OVERRIDE_USERNAME = process.env.ADMIN_OVERRIDE_USERNAME || 'admin';
const ADMIN_OVERRIDE_PASSWORD = process.env.ADMIN_OVERRIDE_PASSWORD || 'RhythmN3xu$@dm!n#2026%!';

function applySecurityHeaders(response) {
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  response.headers.set('Cross-Origin-Resource-Policy', 'same-site');
  return response;
}

function isCaptchaExemptPath(path) {
  return (
    path === '/access' ||
    path.startsWith('/api/access/') ||
    path.startsWith('/_next/') ||
    path === '/favicon.ico' ||
    path === '/robots.txt' ||
    path === '/sitemap.xml' ||
    path === '/manifest.json' ||
    path === '/ads.txt'
  );
}

function parseBasicAuthHeader(request) {
  const authHeader = request.headers.get('authorization') || '';
  if (!authHeader.startsWith('Basic ')) return null;

  try {
    const base64Part = authHeader.slice(6).trim();
    const decoded = Buffer.from(base64Part, 'base64').toString('utf-8');
    const separatorIndex = decoded.indexOf(':');
    if (separatorIndex < 0) return null;
    return {
      username: decoded.slice(0, separatorIndex),
      password: decoded.slice(separatorIndex + 1),
    };
  } catch (_) {
    return null;
  }
}

function unauthorizedAdminResponse() {
  return new NextResponse('Admin authentication required.', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Rhythm Nexus Admin Override"',
    },
  });
}

export function middleware(request) {
  const { nextUrl } = request;
  const path = nextUrl.pathname || '';
  const requestedCountry = (nextUrl.searchParams.get('country') || nextUrl.searchParams.get('adminCountry') || '').trim().toUpperCase();
  const hasQueryCountryOverride = /^[A-Z]{2}$/.test(requestedCountry);

  if (!isCaptchaExemptPath(path)) {
    const hasCaptchaCookie = request.cookies.get(ACCESS_COOKIE_NAME)?.value === ACCESS_COOKIE_VALUE;
    if (!hasCaptchaCookie) {
      const accessUrl = nextUrl.clone();
      accessUrl.pathname = '/access';
      accessUrl.searchParams.set('next', `${path}${nextUrl.search || ''}`);
      return applySecurityHeaders(NextResponse.redirect(accessUrl));
    }
  }

  if (hasQueryCountryOverride) {
    const credentials = parseBasicAuthHeader(request);
    const isAdminAuthenticated = credentials &&
      credentials.username === ADMIN_OVERRIDE_USERNAME &&
      credentials.password === ADMIN_OVERRIDE_PASSWORD;

    if (!isAdminAuthenticated) {
      return applySecurityHeaders(unauthorizedAdminResponse());
    }
  }

  // Support legacy admin-style path format: /country=AT
  if (path.startsWith('/country=')) {
    const credentials = parseBasicAuthHeader(request);
    const isAdminAuthenticated = credentials &&
      credentials.username === ADMIN_OVERRIDE_USERNAME &&
      credentials.password === ADMIN_OVERRIDE_PASSWORD;

    if (!isAdminAuthenticated) {
      return applySecurityHeaders(unauthorizedAdminResponse());
    }

    const countryPart = path.slice('/country='.length).split('/')[0];
    const countryCode = (countryPart || '').trim().toUpperCase();

    if (/^[A-Z]{2}$/.test(countryCode)) {
      const url = nextUrl.clone();
      url.pathname = '/track-your-item';
      url.searchParams.set('country', countryCode);
      return applySecurityHeaders(NextResponse.rewrite(url));
    }
  }

  return applySecurityHeaders(NextResponse.next());
}

export const config = {
  matcher: '/:path*',
};

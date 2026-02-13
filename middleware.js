import { NextResponse } from 'next/server';

const ACCESS_COOKIE_NAME = 'rnx_access_granted';
const ACCESS_COOKIE_VALUE = '1';
const ADMIN_SESSION_COOKIE_NAME = 'rnx_admin_session';
const ADMIN_SESSION_DURATION_SECONDS = 60 * 60;

const ADMIN_OVERRIDE_USERNAME = process.env.ADMIN_OVERRIDE_USERNAME || '';
const ADMIN_OVERRIDE_PASSWORD = process.env.ADMIN_OVERRIDE_PASSWORD || '';
const ADMIN_SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || '';

const textEncoder = new TextEncoder();

function isAdminSecurityConfigured() {
  return Boolean(
    ADMIN_OVERRIDE_USERNAME &&
    ADMIN_OVERRIDE_PASSWORD &&
    ADMIN_SESSION_SECRET &&
    ADMIN_SESSION_SECRET.length >= 32
  );
}

function base64UrlEncode(bytes) {
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function constantTimeEqual(a, b) {
  if (!a || !b || a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i += 1) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

async function signAdminSessionPayload(payload) {
  if (!isAdminSecurityConfigured()) {
    throw new Error('Admin security is not configured.');
  }
  const key = await crypto.subtle.importKey(
    'raw',
    textEncoder.encode(ADMIN_SESSION_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', key, textEncoder.encode(payload));
  return base64UrlEncode(new Uint8Array(signature));
}

async function createAdminSessionToken() {
  const issuedAt = Date.now();
  const payload = `${ADMIN_OVERRIDE_USERNAME}:${issuedAt}`;
  const signature = await signAdminSessionPayload(payload);
  return `${payload}.${signature}`;
}

async function isValidAdminSessionToken(token) {
  if (!token || typeof token !== 'string') return false;
  const tokenParts = token.split('.');
  if (tokenParts.length !== 2) return false;

  const [payload, providedSignature] = tokenParts;
  const payloadParts = payload.split(':');
  if (payloadParts.length !== 2) return false;

  const [username, issuedAtRaw] = payloadParts;
  if (username !== ADMIN_OVERRIDE_USERNAME) return false;

  const issuedAt = Number(issuedAtRaw);
  if (!Number.isFinite(issuedAt)) return false;

  const ageMs = Date.now() - issuedAt;
  if (ageMs < 0 || ageMs > ADMIN_SESSION_DURATION_SECONDS * 1000) return false;

  const expectedSignature = await signAdminSessionPayload(payload);
  return constantTimeEqual(providedSignature, expectedSignature);
}

async function isAdminAuthenticated(request) {
  if (!isAdminSecurityConfigured()) {
    return { authenticated: false, setSessionCookie: false };
  }

  const sessionToken = request.cookies.get(ADMIN_SESSION_COOKIE_NAME)?.value;
  if (await isValidAdminSessionToken(sessionToken)) {
    return { authenticated: true, setSessionCookie: false };
  }

  const credentials = parseBasicAuthHeader(request);
  const hasValidCredentials = Boolean(
    credentials &&
    credentials.username === ADMIN_OVERRIDE_USERNAME &&
    credentials.password === ADMIN_OVERRIDE_PASSWORD
  );

  return { authenticated: hasValidCredentials, setSessionCookie: hasValidCredentials };
}

async function applyAdminSessionCookie(response) {
  const token = await createAdminSessionToken();
  response.cookies.set(ADMIN_SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: ADMIN_SESSION_DURATION_SECONDS,
  });
}

function applySecurityHeaders(response) {
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  response.headers.set('Cross-Origin-Resource-Policy', 'same-site');
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }
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
  return new NextResponse('Unauthorized.', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Rhythm Nexus Admin Override"',
    },
  });
}

export async function middleware(request) {
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
    if (!isAdminSecurityConfigured()) {
      return applySecurityHeaders(new NextResponse('Admin override unavailable.', { status: 503 }));
    }
    const adminAuth = await isAdminAuthenticated(request);
    if (!adminAuth.authenticated) {
      return applySecurityHeaders(unauthorizedAdminResponse());
    }

    const response = NextResponse.next();
    if (adminAuth.setSessionCookie) {
      await applyAdminSessionCookie(response);
    }
    return applySecurityHeaders(response);
  }

  // Support legacy admin-style path format: /country=AT
  if (path.startsWith('/country=')) {
    if (!isAdminSecurityConfigured()) {
      return applySecurityHeaders(new NextResponse('Admin override unavailable.', { status: 503 }));
    }
    const adminAuth = await isAdminAuthenticated(request);
    if (!adminAuth.authenticated) {
      return applySecurityHeaders(unauthorizedAdminResponse());
    }

    const countryPart = path.slice('/country='.length).split('/')[0];
    const countryCode = (countryPart || '').trim().toUpperCase();

    if (/^[A-Z]{2}$/.test(countryCode)) {
      const url = nextUrl.clone();
      url.pathname = '/track-your-item';
      url.searchParams.set('country', countryCode);
      const response = NextResponse.rewrite(url);
      if (adminAuth.setSessionCookie) {
        await applyAdminSessionCookie(response);
      }
      return applySecurityHeaders(response);
    }
  }

  return applySecurityHeaders(NextResponse.next());
}

export const config = {
  matcher: '/:path*',
};

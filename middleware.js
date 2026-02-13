import { NextResponse } from 'next/server';

const ACCESS_COOKIE_NAME = 'rnx_access_granted';
const ACCESS_COOKIE_VALUE = '1';
const ADMIN_SESSION_COOKIE_NAME = 'rnx_admin_session';
const ADMIN_SESSION_DURATION_SECONDS = 60 * 60;
const ADMIN_SESSION_TOKEN_VERSION = 'v2';

const ADMIN_OVERRIDE_USERNAME =
  process.env.ADMIN_OVERRIDE_USERNAME ||
  process.env.ADMIN_USERNAME ||
  process.env.BASIC_AUTH_USERNAME ||
  '';
const ADMIN_OVERRIDE_PASSWORD =
  process.env.ADMIN_OVERRIDE_PASSWORD ||
  process.env.ADMIN_PASSWORD ||
  process.env.BASIC_AUTH_PASSWORD ||
  '';
const ADMIN_SESSION_SECRET =
  process.env.ADMIN_SESSION_SECRET ||
  process.env.ADMIN_OVERRIDE_SESSION_SECRET ||
  '';
const DEFAULT_ADMIN_USERNAME_SHA256 = '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918';
const DEFAULT_ADMIN_PASSWORD_SHA256 = 'ff12e04e4fee83fa63e75f010237fcd0a2f0ec670dfaf212b5ce436def365662';

const textEncoder = new TextEncoder();

function hasEnvAdminCredentials() {
  return Boolean(ADMIN_OVERRIDE_USERNAME && ADMIN_OVERRIDE_PASSWORD);
}

function isAdminCredentialsConfigured() {
  return Boolean(hasEnvAdminCredentials() || (DEFAULT_ADMIN_USERNAME_SHA256 && DEFAULT_ADMIN_PASSWORD_SHA256));
}

function isAdminSessionConfigured() {
  if (ADMIN_SESSION_SECRET) {
    return ADMIN_SESSION_SECRET.length >= 32;
  }

  return isAdminCredentialsConfigured();
}

function getAdminSessionSecret() {
  if (ADMIN_SESSION_SECRET && ADMIN_SESSION_SECRET.length >= 32) {
    return ADMIN_SESSION_SECRET;
  }

  if (hasEnvAdminCredentials()) {
    return `rnx-admin-session-v1:${ADMIN_OVERRIDE_USERNAME}:${ADMIN_OVERRIDE_PASSWORD}`;
  }

  if (DEFAULT_ADMIN_USERNAME_SHA256 && DEFAULT_ADMIN_PASSWORD_SHA256) {
    return `rnx-admin-session-v1:${DEFAULT_ADMIN_USERNAME_SHA256}:${DEFAULT_ADMIN_PASSWORD_SHA256}`;
  }

  return '';
}

function isAdminSecurityConfigured() {
  return Boolean(
    isAdminCredentialsConfigured() &&
    isAdminSessionConfigured()
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
  if (!isAdminSessionConfigured()) {
    throw new Error('Admin security is not configured.');
  }
  const sessionSecret = getAdminSessionSecret();
  const key = await crypto.subtle.importKey(
    'raw',
    textEncoder.encode(sessionSecret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', key, textEncoder.encode(payload));
  return base64UrlEncode(new Uint8Array(signature));
}

async function createAdminSessionToken() {
  const issuedAt = Date.now();
  const payload = `${ADMIN_SESSION_TOKEN_VERSION}:${issuedAt}`;
  const signature = await signAdminSessionPayload(payload);
  return `${payload}.${signature}`;
}

async function getAdminSessionTokenStatus(token) {
  if (!token || typeof token !== 'string') {
    return { valid: false, expired: false };
  }
  const tokenParts = token.split('.');
  if (tokenParts.length !== 2) {
    return { valid: false, expired: false };
  }

  const [payload, providedSignature] = tokenParts;
  const payloadParts = payload.split(':');
  if (payloadParts.length !== 2) {
    return { valid: false, expired: false };
  }

  const [tokenVersion, issuedAtRaw] = payloadParts;
  if (tokenVersion !== ADMIN_SESSION_TOKEN_VERSION) {
    return { valid: false, expired: false };
  }

  const issuedAt = Number(issuedAtRaw);
  if (!Number.isFinite(issuedAt)) {
    return { valid: false, expired: false };
  }

  const ageMs = Date.now() - issuedAt;
  if (ageMs < 0) {
    return { valid: false, expired: false };
  }
  if (ageMs > ADMIN_SESSION_DURATION_SECONDS * 1000) {
    return { valid: false, expired: true };
  }

  const expectedSignature = await signAdminSessionPayload(payload);
  return {
    valid: constantTimeEqual(providedSignature, expectedSignature),
    expired: false,
  };
}

async function sha256Hex(value) {
  const digest = await crypto.subtle.digest('SHA-256', textEncoder.encode(value));
  const digestBytes = new Uint8Array(digest);
  return Array.from(digestBytes).map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

async function isDefaultCredentialMatch(credentials) {
  if (!credentials?.username || !credentials?.password) return false;
  const [usernameHash, passwordHash] = await Promise.all([
    sha256Hex(credentials.username),
    sha256Hex(credentials.password),
  ]);
  return (
    constantTimeEqual(usernameHash, DEFAULT_ADMIN_USERNAME_SHA256) &&
    constantTimeEqual(passwordHash, DEFAULT_ADMIN_PASSWORD_SHA256)
  );
}

async function isAdminAuthenticated(request) {
  if (!isAdminSecurityConfigured()) {
    return { authenticated: false, setSessionCookie: false, sessionExpired: false };
  }

  const sessionToken = request.cookies.get(ADMIN_SESSION_COOKIE_NAME)?.value;
  const sessionStatus = await getAdminSessionTokenStatus(sessionToken);
  if (sessionStatus.valid) {
    return { authenticated: true, setSessionCookie: false, sessionExpired: false };
  }

  if (sessionStatus.expired) {
    return { authenticated: false, setSessionCookie: false, sessionExpired: true };
  }

  const credentials = parseBasicAuthHeader(request);
  const hasEnvCredentialMatch = Boolean(
    hasEnvAdminCredentials() &&
    credentials &&
    credentials.username === ADMIN_OVERRIDE_USERNAME &&
    credentials.password === ADMIN_OVERRIDE_PASSWORD
  );
  const hasDefaultCredentialMatch = await isDefaultCredentialMatch(credentials);
  const hasValidCredentials = hasEnvCredentialMatch || hasDefaultCredentialMatch;

  return {
    authenticated: hasValidCredentials,
    setSessionCookie: hasValidCredentials,
    sessionExpired: false,
  };
}

async function applyAdminSessionCookie(response) {
  const token = await createAdminSessionToken();
  response.cookies.set(ADMIN_SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
}

function applySecurityHeaders(response) {
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('Content-Security-Policy', "frame-ancestors 'self'; object-src 'none'; base-uri 'self'");
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
    path === '/api/singpost-announcements' ||
    path === '/api/proxy-singpost' ||
    path === '/api/proxy-dhl' ||
    path === '/api/proxy-destination' ||
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
      if (adminAuth.sessionExpired) {
        return applySecurityHeaders(new NextResponse('Admin session expired. Close and reopen your browser, then authenticate again.', { status: 401 }));
      }
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
      if (adminAuth.sessionExpired) {
        return applySecurityHeaders(new NextResponse('Admin session expired. Close and reopen your browser, then authenticate again.', { status: 401 }));
      }
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

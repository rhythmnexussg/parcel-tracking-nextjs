import { NextResponse } from 'next/server';

const ACCESS_COOKIE_NAME = 'rnx_access_granted';
const ACCESS_COOKIE_VALUE = '1';
const ACCESS_COOKIE_DURATION_SECONDS = 60 * 60;
const ADMIN_SESSION_COOKIE_NAME = 'rnx_admin_session';
const ADMIN_SESSION_DURATION_SECONDS = 60 * 60;
const ADMIN_SESSION_TOKEN_VERSION = 'v2';
const ADMIN_AUTH_PATH = '/admin-auth';
const WINDOWS_SERVER_2016_SUPPORT_END_UTC = Date.UTC(2027, 0, 12, 0, 0, 0);
const WINDOWS_SERVER_2019_SUPPORT_END_UTC = Date.UTC(2029, 0, 9, 0, 0, 0);

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

function isOsPolicyExemptPath(path) {
  return (
    path === '/blocked' ||
    path.startsWith('/_next/') ||
    path === '/favicon.ico' ||
    path === '/robots.txt' ||
    path === '/sitemap.xml' ||
    path === '/manifest.json' ||
    path === '/ads.txt'
  );
}

function extractMacOsVersion(userAgent) {
  const match = userAgent.match(/Mac OS X (\d+)[._](\d+)/i);
  if (!match) return null;
  return {
    major: Number(match[1]),
    minor: Number(match[2]),
  };
}

function extractAndroidVersion(userAgent) {
  const match = userAgent.match(/Android\s+(\d+)(?:[._](\d+))?/i);
  if (!match) return null;
  return {
    major: Number(match[1]),
    minor: Number(match[2] || 0),
  };
}

function extractIphoneOsVersion(userAgent) {
  const match = userAgent.match(/iPhone OS\s+(\d+)[_\.](\d+)/i);
  if (!match) return null;
  return {
    major: Number(match[1]),
    minor: Number(match[2]),
  };
}

function extractAppleMobileOsVersion(userAgent) {
  const match = userAgent.match(/(?:iPhone OS|CPU OS)\s+(\d+)[_\.](\d+)/i);
  if (!match) return null;
  return {
    major: Number(match[1]),
    minor: Number(match[2]),
  };
}

function isIpadUserAgent(userAgent) {
  const ua = (userAgent || '').toLowerCase();
  if (ua.includes('ipad')) return true;
  return ua.includes('macintosh') && ua.includes('mobile/') && ua.includes('safari');
}

function getUnsupportedSystemFromUserAgent(userAgent, nowMs = Date.now()) {
  const ua = (userAgent || '').toLowerCase();
  const isIpad = isIpadUserAgent(userAgent);

  if (!ua) return null;

  if (
    /windows phone|windows mobile|iemobile|wpdesktop|windows ce|windows embedded compact/.test(ua)
  ) {
    return 'Windows Mobile/Embedded (unsupported)';
  }

  const androidVersion = extractAndroidVersion(userAgent || '');
  if (androidVersion && Number.isFinite(androidVersion.major) && androidVersion.major < 13) {
    return `Android ${androidVersion.major}`;
  }

  const appleMobileVersion = extractAppleMobileOsVersion(userAgent || '');
  const iphoneVersion = extractIphoneOsVersion(userAgent || '');
  if (isIpad && appleMobileVersion && Number.isFinite(appleMobileVersion.major) && appleMobileVersion.major < 17) {
    return `iPadOS ${appleMobileVersion.major}`;
  }
  if (iphoneVersion && Number.isFinite(iphoneVersion.major) && iphoneVersion.major < 17) {
    return `iPhone iOS ${iphoneVersion.major}`;
  }

  if (/windows nt 5\.0|windows 2000|windows 95|windows 98|windows me|windows nt 4\.0/.test(ua)) {
    return 'Legacy Windows (95/98/ME/2000/NT)';
  }

  if (/windows nt 5\.1|windows nt 5\.2|windows xp/.test(ua)) {
    return 'Windows XP / Server 2003';
  }

  if (/windows nt 6\.0|windows vista/.test(ua)) {
    return 'Windows Vista / Server 2008';
  }

  if (/windows nt 6\.1|windows 7/.test(ua)) {
    return 'Windows 7 / Server 2008 R2';
  }

  if (/windows nt 6\.2|windows 8/.test(ua)) {
    return 'Windows 8 / Server 2012';
  }

  if (/windows nt 6\.3|windows 8\.1/.test(ua)) {
    return 'Windows 8.1 / Server 2012 R2';
  }

  if (/windows server 2016/.test(ua) && nowMs >= WINDOWS_SERVER_2016_SUPPORT_END_UTC) {
    return 'Windows Server 2016';
  }

  if (/windows server 2019/.test(ua) && nowMs >= WINDOWS_SERVER_2019_SUPPORT_END_UTC) {
    return 'Windows Server 2019';
  }

  const macVersion = extractMacOsVersion(userAgent || '');
  if (!isIpad && macVersion && Number.isFinite(macVersion.major) && macVersion.major <= 11) {
    return `macOS ${macVersion.major}`;
  }

  if (/ubuntu[\s/_-]?(12\.04|14\.04|16\.04|18\.04|20\.04)/.test(ua)) {
    return 'Ubuntu (unsupported release)';
  }

  if (/fedora[\s/_-]?(1[0-7]|[1-9])\b/.test(ua)) {
    return 'Fedora (unsupported release)';
  }

  if (/linux mint[\s/_-]?13\b|mint[\s/_-]?13\b/.test(ua)) {
    return 'Linux Mint 13';
  }

  if (/mandriva|meego|mythbuntu|corel linux|crunchbang|antergos/.test(ua)) {
    return 'Discontinued Linux distribution';
  }

  if (/puppy linux|bodhi linux|antix|q4os|lubuntu|lxle/.test(ua)) {
    return 'Legacy Linux distribution';
  }

  return null;
}

function isCaptchaExemptPath(path) {
  return (
    path === '/access' ||
    path === '/blocked' ||
    path === ADMIN_AUTH_PATH ||
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

function refreshAccessCookie(response) {
  response.cookies.set(ACCESS_COOKIE_NAME, ACCESS_COOKIE_VALUE, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: ACCESS_COOKIE_DURATION_SECONDS,
  });
}

function clearAdminSessionCookie(response) {
  response.cookies.set(ADMIN_SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}

async function getAdminSessionAuth(request) {
  if (!isAdminSecurityConfigured()) {
    return { authenticated: false, sessionExpired: false };
  }

  const sessionToken = request.cookies.get(ADMIN_SESSION_COOKIE_NAME)?.value;
  const sessionStatus = await getAdminSessionTokenStatus(sessionToken);
  return {
    authenticated: sessionStatus.valid,
    sessionExpired: sessionStatus.expired,
  };
}

function getAdminAuthRedirectUrl(nextUrl) {
  const authUrl = nextUrl.clone();
  authUrl.pathname = ADMIN_AUTH_PATH;
  authUrl.searchParams.set('next', `${nextUrl.pathname}${nextUrl.search || ''}`);
  return authUrl;
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

function getAdminAuthRealm() {
  const windowSizeMs = ADMIN_SESSION_DURATION_SECONDS * 1000;
  const currentWindowStart = Math.floor(Date.now() / windowSizeMs) * windowSizeMs;
  return `Rhythm Nexus Admin Override ${new Date(currentWindowStart).toISOString().slice(0, 13)}`;
}

function unauthorizedAdminResponse() {
  return new NextResponse('Unauthorized.', {
    status: 401,
    headers: {
      'WWW-Authenticate': `Basic realm="${getAdminAuthRealm()}"`,
      'Cache-Control': 'no-store',
    },
  });
}

function expiredAdminSessionResponse() {
  const response = new NextResponse('Admin session expired. Please log in again.', {
    status: 401,
    headers: {
      'WWW-Authenticate': `Basic realm="${getAdminAuthRealm()}"`,
      'Cache-Control': 'no-store',
    },
  });
  clearAdminSessionCookie(response);
  return response;
}

export async function middleware(request) {
  const { nextUrl } = request;
  const path = nextUrl.pathname || '';
  const userAgent = request.headers.get('user-agent') || '';
  const requestedCountry = (nextUrl.searchParams.get('country') || nextUrl.searchParams.get('adminCountry') || '').trim().toUpperCase();
  const hasQueryCountryOverride = /^[A-Z]{2}$/.test(requestedCountry);
  const isProtectedPath = !isCaptchaExemptPath(path);
  const hasCaptchaCookie = request.cookies.get(ACCESS_COOKIE_NAME)?.value === ACCESS_COOKIE_VALUE;

  if (!isOsPolicyExemptPath(path)) {
    const unsupportedSystem = getUnsupportedSystemFromUserAgent(userAgent);
    if (unsupportedSystem) {
      const blockedUrl = nextUrl.clone();
      blockedUrl.pathname = '/blocked';
      blockedUrl.searchParams.set('reason', 'unsupported-os');
      blockedUrl.searchParams.set('system', unsupportedSystem);
      return applySecurityHeaders(NextResponse.redirect(blockedUrl));
    }
  }

  if (isProtectedPath && !hasCaptchaCookie) {
    const accessUrl = nextUrl.clone();
    accessUrl.pathname = '/access';
    accessUrl.searchParams.set('next', `${path}${nextUrl.search || ''}`);
    return applySecurityHeaders(NextResponse.redirect(accessUrl));
  }

  if (path === ADMIN_AUTH_PATH) {
    if (!isAdminSecurityConfigured()) {
      return applySecurityHeaders(new NextResponse('Admin override unavailable.', { status: 503 }));
    }

    const adminAuth = await isAdminAuthenticated(request);
    if (!adminAuth.authenticated) {
      if (adminAuth.sessionExpired) {
        return applySecurityHeaders(expiredAdminSessionResponse());
      }
      return applySecurityHeaders(unauthorizedAdminResponse());
    }

    const nextParam = nextUrl.searchParams.get('next') || '/track-your-item';
    const safeNext = nextParam.startsWith('/') ? nextParam : '/track-your-item';
    const redirectUrl = nextUrl.clone();
    redirectUrl.pathname = safeNext.split('?')[0] || '/track-your-item';
    redirectUrl.search = safeNext.includes('?') ? `?${safeNext.split('?').slice(1).join('?')}` : '';

    const response = NextResponse.redirect(redirectUrl);
    if (adminAuth.setSessionCookie) {
      await applyAdminSessionCookie(response);
    }
    return applySecurityHeaders(response);
  }

  if (hasQueryCountryOverride) {
    if (!isAdminSecurityConfigured()) {
      return applySecurityHeaders(new NextResponse('Admin override unavailable.', { status: 503 }));
    }
    const adminSessionAuth = await getAdminSessionAuth(request);
    if (!adminSessionAuth.authenticated) {
      const response = NextResponse.redirect(getAdminAuthRedirectUrl(nextUrl));
      clearAdminSessionCookie(response);
      return applySecurityHeaders(response);
    }

    const response = NextResponse.next();
    if (isProtectedPath && hasCaptchaCookie) {
      refreshAccessCookie(response);
    }
    return applySecurityHeaders(response);
  }

  // Support legacy admin-style path format: /country=AT
  if (path.startsWith('/country=')) {
    if (!isAdminSecurityConfigured()) {
      return applySecurityHeaders(new NextResponse('Admin override unavailable.', { status: 503 }));
    }
    const adminSessionAuth = await getAdminSessionAuth(request);
    if (!adminSessionAuth.authenticated) {
      const response = NextResponse.redirect(getAdminAuthRedirectUrl(nextUrl));
      clearAdminSessionCookie(response);
      return applySecurityHeaders(response);
    }

    const countryPart = path.slice('/country='.length).split('/')[0];
    const countryCode = (countryPart || '').trim().toUpperCase();

    if (/^[A-Z]{2}$/.test(countryCode)) {
      const url = nextUrl.clone();
      url.pathname = '/track-your-item';
      url.searchParams.set('country', countryCode);
      const response = NextResponse.rewrite(url);
      if (isProtectedPath && hasCaptchaCookie) {
        refreshAccessCookie(response);
      }
      return applySecurityHeaders(response);
    }
  }

  const response = NextResponse.next();
  if (isProtectedPath && hasCaptchaCookie) {
    refreshAccessCookie(response);
  }
  return applySecurityHeaders(response);
}

export const config = {
  matcher: '/:path*',
};

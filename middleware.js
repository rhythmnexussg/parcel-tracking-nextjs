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

const textEncoder = new TextEncoder();

function hasEnvAdminCredentials() {
  return Boolean(ADMIN_OVERRIDE_USERNAME && ADMIN_OVERRIDE_PASSWORD);
}

function isAdminCredentialsConfigured() {
  return Boolean(hasEnvAdminCredentials());
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
  const hasValidCredentials = hasEnvCredentialMatch;

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
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://pagead2.googlesyndication.com https://translate.google.com https://translate.googleapis.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data: https://fonts.gstatic.com",
    "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com",
    "frame-src 'self' https://www.google.com https://*.doubleclick.net",
    "frame-ancestors 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    'upgrade-insecure-requests',
  ].join('; ');

  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('Content-Security-Policy', csp);
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  response.headers.set('Cross-Origin-Resource-Policy', 'same-site');
  response.headers.set('X-DNS-Prefetch-Control', 'off');
  response.headers.set('X-Permitted-Cross-Domain-Policies', 'none');
  response.headers.set('Origin-Agent-Cluster', '?1');
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

function extractPlatformVersionMajor(platformVersionHeader) {
  if (!platformVersionHeader || typeof platformVersionHeader !== 'string') return null;
  const cleaned = platformVersionHeader.replace(/"/g, '').trim();
  const match = cleaned.match(/^(\d+)/);
  if (!match) return null;
  const major = Number(match[1]);
  return Number.isFinite(major) ? major : null;
}

function extractFirefoxMajorVersion(userAgent) {
  const match = userAgent.match(/Firefox\/(\d+)/i);
  if (!match) return null;
  const major = Number(match[1]);
  return Number.isFinite(major) ? major : null;
}

function isWindows81OrBelowUserAgent(ua) {
  return /windows nt 6\.3|windows 8\.1|windows nt 6\.2|windows 8|windows nt 6\.1|windows 7|windows nt 6\.0|windows vista|windows nt 5\.2|windows nt 5\.1|windows xp|windows nt 5\.0|windows 2000|windows 98|windows 95|windows me|windows nt 4\.0/.test(ua);
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

function getUnsupportedSystemFromUserAgent(userAgent, nowMs = Date.now(), platformVersionMajor = null) {
  const ua = (userAgent || '').toLowerCase();
  const isIpad = isIpadUserAgent(userAgent);

  if (!ua) return null;

  if (
    /windows phone|windows mobile|iemobile|wpdesktop|windows ce|windows embedded compact/.test(ua)
  ) {
    return 'Windows Mobile/Embedded (unsupported)';
  }

  if (isWindows81OrBelowUserAgent(ua)) {
    const firefoxMajor = extractFirefoxMajorVersion(userAgent || '');
    if (/\bsupermium\b/.test(ua)) {
      return 'Supermium on Windows 8.1 or below';
    }
    if (/\bthorium\b/.test(ua)) {
      return 'Thorium on Windows 8.1 or below';
    }
    if (/\bmypal\b/.test(ua)) {
      return 'Mypal on Windows 8.1 or below';
    }
    if (/\bfirefox\b/.test(ua) && firefoxMajor != null && firefoxMajor >= 115) {
      return `Firefox ESR ${firefoxMajor} on Windows 8.1 or below`;
    }
  }

  const androidVersion = extractAndroidVersion(userAgent || '');
  const isLikelyReducedAndroidUa = Boolean(
    androidVersion &&
    androidVersion.major === 10 &&
    /\bchrome\//.test(ua) &&
    platformVersionMajor == null
  );

  if (platformVersionMajor != null) {
    if (platformVersionMajor < 13) {
      return `Android ${platformVersionMajor}`;
    }
  } else if (
    androidVersion &&
    Number.isFinite(androidVersion.major) &&
    androidVersion.major < 13 &&
    !isLikelyReducedAndroidUa
  ) {
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
  if (
    !isIpad &&
    macVersion &&
    Number.isFinite(macVersion.major) &&
    Number.isFinite(macVersion.minor) &&
    macVersion.major === 10 &&
    macVersion.minor <= 14
  ) {
    return `macOS 10.${macVersion.minor}`;
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

function isCaptchaRequiredPath(path) {
  if (!path || typeof path !== 'string') return false;

  return (
    path === '/' ||
    path === '/about' ||
    path === '/FAQ' ||
    path === '/faq' ||
    path === '/blog' ||
    path.startsWith('/blog/') ||
    path === '/track-your-item'
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
  const hostHeader = (request.headers.get('host') || '').toLowerCase();
  const hostname = (nextUrl.hostname || '').toLowerCase();
  const isLocalhost =
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '::1' ||
    hostHeader.startsWith('localhost:') ||
    hostHeader.startsWith('127.0.0.1:') ||
    hostHeader.startsWith('[::1]:');
  const userAgent = request.headers.get('user-agent') || '';
  const platformVersionHeader = request.headers.get('sec-ch-ua-platform-version') || '';
  const platformVersionMajor = extractPlatformVersionMajor(platformVersionHeader);
  const requestedCountry = (nextUrl.searchParams.get('country') || nextUrl.searchParams.get('adminCountry') || '').trim().toUpperCase();
  const hasQueryCountryOverride = /^[A-Z]{2}$/.test(requestedCountry);
  const isProtectedPath = isCaptchaRequiredPath(path) && !isCaptchaExemptPath(path);
  const hasCaptchaCookie = request.cookies.get(ACCESS_COOKIE_NAME)?.value === ACCESS_COOKIE_VALUE;

  if (!isOsPolicyExemptPath(path)) {
    const unsupportedSystem = getUnsupportedSystemFromUserAgent(userAgent, Date.now(), platformVersionMajor);
    if (unsupportedSystem) {
      const blockedUrl = nextUrl.clone();
      blockedUrl.pathname = '/blocked';
      blockedUrl.searchParams.set('reason', 'unsupported-os');
      blockedUrl.searchParams.set('system', unsupportedSystem);
      return applySecurityHeaders(NextResponse.redirect(blockedUrl));
    }
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

  if (!isLocalhost && isProtectedPath && !hasCaptchaCookie) {
    const accessUrl = nextUrl.clone();
    accessUrl.pathname = '/access';
    accessUrl.searchParams.set('next', `${path}${nextUrl.search || ''}`);
    return applySecurityHeaders(NextResponse.redirect(accessUrl));
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

import { NextResponse } from 'next/server';

const RATE_LIMIT_STORE = globalThis.__rnxRateLimitStore || new Map();
if (!globalThis.__rnxRateLimitStore) {
  globalThis.__rnxRateLimitStore = RATE_LIMIT_STORE;
}

const DEFAULT_WINDOW_MS = 60 * 1000;
const DEFAULT_MAX_REQUESTS = 60;

function getClientIp(request) {
  const xForwardedFor = request.headers.get('x-forwarded-for') || '';
  if (xForwardedFor) {
    const first = xForwardedFor.split(',')[0]?.trim();
    if (first) return first;
  }

  return (
    request.headers.get('x-real-ip') ||
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-vercel-forwarded-for') ||
    'unknown'
  );
}

function nowMs() {
  return Date.now();
}

function cleanupExpiredEntries(currentMs) {
  if (RATE_LIMIT_STORE.size < 5000) return;

  for (const [key, value] of RATE_LIMIT_STORE.entries()) {
    if (!value || value.resetAt <= currentMs) {
      RATE_LIMIT_STORE.delete(key);
    }
  }
}

export function rateLimit(request, options = {}) {
  const windowMs = Number.isFinite(options.windowMs) ? options.windowMs : DEFAULT_WINDOW_MS;
  const maxRequests = Number.isFinite(options.maxRequests) ? options.maxRequests : DEFAULT_MAX_REQUESTS;
  const keyPrefix = options.keyPrefix || 'api';
  const path = new URL(request.url).pathname;
  const ip = getClientIp(request);
  const currentMs = nowMs();

  cleanupExpiredEntries(currentMs);

  const key = `${keyPrefix}:${path}:${ip}`;
  const existing = RATE_LIMIT_STORE.get(key);
  if (!existing || existing.resetAt <= currentMs) {
    RATE_LIMIT_STORE.set(key, { count: 1, resetAt: currentMs + windowMs });
    return null;
  }

  existing.count += 1;
  RATE_LIMIT_STORE.set(key, existing);

  if (existing.count > maxRequests) {
    const retryAfter = Math.max(1, Math.ceil((existing.resetAt - currentMs) / 1000));
    return secureApiResponse(
      NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      ),
      { isHtml: false, retryAfterSeconds: retryAfter }
    );
  }

  return null;
}

export function normalizeLangParam(value) {
  const raw = (value || '').trim();
  if (!raw) return null;
  return /^[a-z]{2,3}(?:-[a-z]{2,4})?$/i.test(raw) ? raw.toLowerCase() : null;
}

export function secureApiResponse(response, options = {}) {
  const isHtml = Boolean(options.isHtml);
  const allowFrameFromSelf = Boolean(options.allowFrameFromSelf);

  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'no-referrer');
  response.headers.set('X-Frame-Options', allowFrameFromSelf ? 'SAMEORIGIN' : 'DENY');
  response.headers.set('Cache-Control', response.headers.get('Cache-Control') || 'no-store');
  response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet');

  if (options.retryAfterSeconds) {
    response.headers.set('Retry-After', String(options.retryAfterSeconds));
  }

  if (isHtml) {
    if (allowFrameFromSelf) {
      response.headers.set(
        'Content-Security-Policy',
        "default-src https: data: blob:; script-src 'unsafe-inline' 'unsafe-eval' https: data: blob:; style-src 'unsafe-inline' https: data:; img-src https: data: blob:; font-src https: data: blob:; connect-src https: data: blob:; frame-src https: data: blob:; object-src 'none'; base-uri 'self'; form-action https: 'self'; frame-ancestors 'self'"
      );
    } else {
      response.headers.set(
        'Content-Security-Policy',
        "default-src 'none'; script-src 'none'; connect-src 'none'; frame-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'; img-src https: data:; style-src 'unsafe-inline' https:; font-src https: data:"
      );
    }
  } else {
    response.headers.set(
      'Content-Security-Policy',
      "default-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'"
    );
  }

  return response;
}

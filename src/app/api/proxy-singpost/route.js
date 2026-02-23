import { NextResponse } from 'next/server';
import { sanitizeAndRewrite } from '../proxy-utils';
import { normalizeLangParam, rateLimit, secureApiResponse } from '../security';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const SINGPOST_HTML_CACHE = globalThis.__rnxSingpostHtmlCache || new Map();
if (!globalThis.__rnxSingpostHtmlCache) {
  globalThis.__rnxSingpostHtmlCache = SINGPOST_HTML_CACHE;
}
const SINGPOST_HTML_CACHE_TTL_MS = 60 * 1000;

export async function GET(request) {
  const limited = rateLimit(request, { keyPrefix: 'proxy-singpost', maxRequests: 25, windowMs: 60 * 1000 });
  if (limited) return limited;

  try {
    const { searchParams } = new URL(request.url);
    const trackingid = (searchParams.get('trackingid') || '').trim();
    const rawLang = (searchParams.get('lang') || '').trim().toLowerCase().replace(/_/g, '-');
    const lang = normalizeLangParam(rawLang);
    if (!trackingid) {
      return secureApiResponse(NextResponse.json({ error: 'Missing trackingid' }, { status: 400 }));
    }
    if (!/^[A-Za-z0-9-]{6,50}$/.test(trackingid)) {
      return secureApiResponse(NextResponse.json({ error: 'Invalid trackingid format' }, { status: 400 }));
    }

    const baseUrl = 'https://www.singpost.com';
    const target = `${baseUrl}/track-items?trackingid=${encodeURIComponent(trackingid)}`;

    const cacheKey = trackingid.toUpperCase();
    const now = Date.now();
    const cached = SINGPOST_HTML_CACHE.get(cacheKey);
    const hasFreshCache = cached && (now - cached.storedAt) < SINGPOST_HTML_CACHE_TTL_MS;

    let html;
    if (hasFreshCache) {
      html = cached.html;
    } else {
      const resp = await fetch(target, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
        },
        cache: 'no-store',
      });
      if (!resp.ok) {
        throw new Error(`Upstream failed: ${resp.status}`);
      }
      html = await resp.text();
      SINGPOST_HTML_CACHE.set(cacheKey, { html, storedAt: now });
    }
    const content = sanitizeAndRewrite(html, baseUrl, {
      translateLang: lang,
      forceFormTargetBlank: true,
    });
    return secureApiResponse(
      new NextResponse(content, {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }),
      { isHtml: true, allowFrameFromSelf: true }
    );
  } catch (err) {
    return secureApiResponse(NextResponse.json({ error: 'Proxy failed' }, { status: 500 }));
  }
}

import { NextResponse } from 'next/server';
import { sanitizeAndRewrite } from '../proxy-utils';
import { normalizeLangParam, rateLimit, secureApiResponse } from '../security';

export async function GET(request) {
  const limited = rateLimit(request, { keyPrefix: 'proxy-destination', maxRequests: 25, windowMs: 60 * 1000 });
  if (limited) return limited;

  try {
    const { searchParams } = new URL(request.url);
    const urlParam = searchParams.get('url');
    const lang = normalizeLangParam(searchParams.get('lang'));
    if (!urlParam) {
      return secureApiResponse(NextResponse.json({ error: 'Missing url' }, { status: 400 }));
    }

    // Only allow http/https and a whitelist of hostnames to reduce abuse.
    let parsed;
    try {
      // Prefer already-decoded value (URLSearchParams decodes), but handle double-encoded inputs
      parsed = new URL(urlParam);
    } catch {
      try {
        parsed = new URL(decodeURIComponent(urlParam));
      } catch (e) {
        return secureApiResponse(NextResponse.json({ error: 'Invalid url parameter' }, { status: 400 }));
      }
    }
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return secureApiResponse(NextResponse.json({ error: 'Invalid protocol' }, { status: 400 }));
    }
    const allowedHosts = [
      'www.usps.com', 'tools.usps.com',
      'www.royalmail.com', 'www.nzpost.co.nz', 'www.canadapost-postescanada.ca',
      'www.singpost.com', 'www.speedpost.com.sg', 'www.dhl.com',
      'jouw.postnl.nl', 'track.bpost.cloud', 'www.deutschepost.de',
      'www.laposte.fr', 'service.post.ch', 'www.postnord.se',
      'auspost.com.au', 'www.post.at', 'www.hongkongpost.hk',
      'emonitoring.poczta-polska.pl', 'www.correos.es',
      'service.epost.go.kr', 'trackings.post.japanpost.jp',
      // Additional destinations requested
      'bn.postglobal.online', 'www.posindonesia.co.id', 'www.anpost.com', 'israelpost.co.il',
      'www.ctt.gov.mo', 'www.pos.com.my', 'sporing.posten.no', 'tracking.phlpost.gov.ph',
      'postserv.post.gov.tw', 'track.thailandpost.com', 'vnpost.vn', 'www.ems.com.cn',
      'www.posti.fi', 'www.postaonline.cz'
    ];
    if (!allowedHosts.includes(parsed.hostname)) {
      return secureApiResponse(NextResponse.json({ error: 'Host not allowed' }, { status: 403 }));
    }

    const baseUrl = `${parsed.protocol}//${parsed.hostname}`;
    const target = parsed.href;
    // Use realistic browser headers to avoid bot detection
    const clientUA = request.headers.get('user-agent') || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';
    
    // Build realistic browser headers
    const fetchHeaders = {
      'User-Agent': clientUA,
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'Referer': baseUrl,
      'Upgrade-Insecure-Requests': '1',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-User': '?1',
      'Cache-Control': 'max-age=0',
      'DNT': '1',
      'Connection': 'keep-alive',
    };
    
    const resp = await fetch(target, {
      headers: fetchHeaders,
      cache: 'no-store',
      redirect: 'follow',
    });
    if (!resp.ok) {
      throw new Error(`Upstream failed: ${resp.status}`);
    }
    const html = await resp.text();
    const content = sanitizeAndRewrite(html, baseUrl, { translateLang: lang });
    
    // Build response without forwarding upstream cookies to this origin
    const responseHeaders = {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    };
    
    return secureApiResponse(
      new NextResponse(content, {
        status: 200,
        headers: responseHeaders,
      }),
      { isHtml: true }
    );
  } catch (err) {
    return secureApiResponse(NextResponse.json({ error: 'Proxy failed' }, { status: 500 }));
  }
}

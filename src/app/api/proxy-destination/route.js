import { NextResponse } from 'next/server';
import { sanitizeAndRewrite } from '../proxy-utils';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const urlParam = searchParams.get('url');
    const lang = searchParams.get('lang');
    if (!urlParam) {
      return NextResponse.json({ error: 'Missing url' }, { status: 400 });
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
        return NextResponse.json({ error: 'Invalid url parameter' }, { status: 400 });
      }
    }
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return NextResponse.json({ error: 'Invalid protocol' }, { status: 400 });
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
      return NextResponse.json({ error: 'Host not allowed' }, { status: 403 });
    }

    const baseUrl = `${parsed.protocol}//${parsed.hostname}`;
    const target = parsed.href;
    // Pin Accept-Language to English to keep base content predictable; Google Translate handles the target language via injection
    const clientUA = request.headers.get('user-agent') || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0 Safari/537.36';

    const resp = await fetch(target, {
      headers: {
        'User-Agent': clientUA,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        // Some trackers (incl. USPS) are friendlier with a referer
        'Referer': baseUrl,
        'Upgrade-Insecure-Requests': '1',
      },
      cache: 'no-store',
    });
    if (!resp.ok) {
      throw new Error(`Upstream failed: ${resp.status}`);
    }
    const html = await resp.text();
    const content = sanitizeAndRewrite(html, baseUrl, { translateLang: lang });
    return new NextResponse(content, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, s-maxage=180, stale-while-revalidate=600',
      },
    });
  } catch (err) {
    return NextResponse.json({ error: 'Proxy failed', message: err.message }, { status: 500 });
  }
}

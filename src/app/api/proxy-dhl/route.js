import { NextResponse } from 'next/server';
import { sanitizeAndRewrite } from '../proxy-utils';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const trackingNumber = (searchParams.get('trackingNumber') || '').trim();
    const lang = searchParams.get('lang');
    if (!trackingNumber) {
      return NextResponse.json({ error: 'Missing trackingNumber' }, { status: 400 });
    }
    if (!/^[A-Za-z0-9-]{6,50}$/.test(trackingNumber)) {
      return NextResponse.json({ error: 'Invalid trackingNumber format' }, { status: 400 });
    }

    const baseUrl = 'https://www.dhl.com';
    // DHL tracking landing (global), supports query params in some locales; we proxy the generic page
    const target = `${baseUrl}/global-en/home/tracking.html?trackingNumber=${encodeURIComponent(trackingNumber)}`;

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
    return NextResponse.json({ error: 'Proxy failed' }, { status: 500 });
  }
}

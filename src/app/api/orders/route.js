import { NextResponse } from 'next/server';
import { rateLimit, secureApiResponse } from '../security';

const SHEET_ID = '1t-1V0WBpuFmRCLgctUZqm4-BXCdyyqG-NBrm8JgULQQ';
const SHEET_RANGE = 'Current!A:J';

export async function GET(request) {
  const limited = rateLimit(request, { keyPrefix: 'orders', maxRequests: 60, windowMs: 60 * 1000 });
  if (limited) return limited;

  try {
    const apiKey = process.env.GOOGLE_SHEETS_API_KEY;
    if (!apiKey) {
      return secureApiResponse(
        NextResponse.json(
          {
            error: 'order_source_unavailable',
            details: 'Server configuration missing GOOGLE_SHEETS_API_KEY.',
          },
          { status: 503 }
        )
      );
    }
    const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(SHEET_RANGE)}?key=${apiKey}`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      cache: 'no-store',
      headers: {
        Accept: 'application/json',
      },
    });

    const payload = await response.json();
    if (!response.ok || !Array.isArray(payload?.values)) {
      return secureApiResponse(
        NextResponse.json(
          {
            error: 'order_source_unavailable',
            details: payload?.error?.message || 'Unable to fetch order data source.',
          },
          { status: 502 }
        )
      );
    }

    const rows = payload.values.slice(1).map((r) => ({
      orderNumber: r[0] || '',
      email: r[1] || '',
      dialingCode: r[2] || '',
      phone: r[3] || '',
      trackingNumber: r[4] || '',
      destinationCountry: r[5] || '',
      postcode: r[6] || '',
      status: r[7] || '',
      postedDate: r[8] || '',
      shippedVia: r[9] || '',
    }));

    return secureApiResponse(
      NextResponse.json(
        { orders: rows },
        {
          status: 200,
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          },
        }
      )
    );
  } catch (_) {
    return secureApiResponse(
      NextResponse.json({ error: 'order_source_unavailable' }, { status: 502 })
    );
  }
}

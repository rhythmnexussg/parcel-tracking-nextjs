import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { getCaptchaSecretOrThrow } from '../captcha-secret';
import { rateLimit, secureApiResponse } from '../../security';

export async function GET(request) {
  const limited = rateLimit(request, { keyPrefix: 'captcha-challenge', maxRequests: 20, windowMs: 60 * 1000 });
  if (limited) return limited;

  try {
    const captchaSecret = getCaptchaSecretOrThrow();
    const a = Math.floor(Math.random() * 8) + 2;
    const b = Math.floor(Math.random() * 8) + 2;
    const exp = Date.now() + 5 * 60 * 1000;

    const payloadBase64 = Buffer.from(JSON.stringify({ a, b, exp }), 'utf-8').toString('base64url');
    const signature = crypto.createHmac('sha256', captchaSecret).update(payloadBase64).digest('base64url');
    const token = `${payloadBase64}.${signature}`;

    return secureApiResponse(
      NextResponse.json(
        {
          question: `What is ${a} + ${b}?`,
          token,
        },
        {
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          },
        }
      )
    );
  } catch (_) {
    return secureApiResponse(
      NextResponse.json(
        { error: 'captcha_unavailable' },
        { status: 503 }
      )
    );
  }
}

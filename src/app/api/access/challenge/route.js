import crypto from 'crypto';
import { NextResponse } from 'next/server';

const CAPTCHA_SECRET = process.env.ACCESS_CAPTCHA_SECRET || 'change-this-access-captcha-secret';

function signPayload(payloadBase64) {
  return crypto.createHmac('sha256', CAPTCHA_SECRET).update(payloadBase64).digest('base64url');
}

export async function GET() {
  if (!CAPTCHA_SECRET || CAPTCHA_SECRET === 'change-this-access-captcha-secret') {
    return NextResponse.json({ error: 'captcha_not_configured' }, { status: 503 });
  }

  const a = Math.floor(Math.random() * 8) + 2;
  const b = Math.floor(Math.random() * 8) + 2;
  const exp = Date.now() + 5 * 60 * 1000;

  const payloadBase64 = Buffer.from(JSON.stringify({ a, b, exp }), 'utf-8').toString('base64url');
  const signature = signPayload(payloadBase64);
  const token = `${payloadBase64}.${signature}`;

  return NextResponse.json(
    {
      question: `What is ${a} + ${b}?`,
      token,
    },
    {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      },
    }
  );
}

import crypto from 'crypto';
import { NextResponse } from 'next/server';

const FALLBACK_CAPTCHA_SECRET = 'rnx-captcha-fallback-v1:6f4b1b6f6cf74ff8bcbf1f8d8a55c6c3';

function getCaptchaSecret() {
  return (
    process.env.ACCESS_CAPTCHA_SECRET ||
    process.env.ADMIN_SESSION_SECRET ||
    process.env.ADMIN_OVERRIDE_SESSION_SECRET ||
    FALLBACK_CAPTCHA_SECRET
  );
}

export async function GET() {
  const captchaSecret = getCaptchaSecret();

  const a = Math.floor(Math.random() * 8) + 2;
  const b = Math.floor(Math.random() * 8) + 2;
  const exp = Date.now() + 5 * 60 * 1000;

  const payloadBase64 = Buffer.from(JSON.stringify({ a, b, exp }), 'utf-8').toString('base64url');
  const signature = crypto.createHmac('sha256', captchaSecret).update(payloadBase64).digest('base64url');
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

import crypto from 'crypto';
import { NextResponse } from 'next/server';

function getCaptchaSecret() {
  return (
    process.env.ACCESS_CAPTCHA_SECRET ||
    process.env.ADMIN_SESSION_SECRET ||
    process.env.ADMIN_OVERRIDE_SESSION_SECRET ||
    ''
  );
}
const ACCESS_COOKIE_NAME = 'rnx_access_granted';
const ACCESS_COOKIE_VALUE = '1';

function signPayload(payloadBase64, captchaSecret) {
  return crypto.createHmac('sha256', captchaSecret).update(payloadBase64).digest('base64url');
}

function getSafeRedirectPath(nextPath) {
  if (!nextPath || typeof nextPath !== 'string') return '/';
  if (!nextPath.startsWith('/')) return '/';
  if (nextPath.startsWith('/access')) return '/';
  return nextPath;
}

export async function POST(request) {
  try {
    const captchaSecret = getCaptchaSecret();
    if (!captchaSecret) {
      return NextResponse.json({ ok: false, error: 'captcha_not_configured' }, { status: 503 });
    }

    const body = await request.json();
    const token = (body?.token || '').toString().trim();
    const answer = Number(body?.answer);
    const nextPath = getSafeRedirectPath(body?.nextPath || '/');

    if (!token || Number.isNaN(answer)) {
      return NextResponse.json({ ok: false, error: 'invalid_request' }, { status: 400 });
    }

    const [payloadBase64, signature] = token.split('.');
    if (!payloadBase64 || !signature) {
      return NextResponse.json({ ok: false, error: 'invalid_token' }, { status: 400 });
    }

    const expectedSignature = signPayload(payloadBase64, captchaSecret);
    const providedSignatureBuffer = Buffer.from(signature, 'utf-8');
    const expectedSignatureBuffer = Buffer.from(expectedSignature, 'utf-8');
    if (providedSignatureBuffer.length !== expectedSignatureBuffer.length) {
      return NextResponse.json({ ok: false, error: 'invalid_signature' }, { status: 401 });
    }
    const signatureMatch = crypto.timingSafeEqual(providedSignatureBuffer, expectedSignatureBuffer);

    if (!signatureMatch) {
      return NextResponse.json({ ok: false, error: 'invalid_signature' }, { status: 401 });
    }

    const payload = JSON.parse(Buffer.from(payloadBase64, 'base64url').toString('utf-8'));
    if (!payload || typeof payload.a !== 'number' || typeof payload.b !== 'number' || typeof payload.exp !== 'number') {
      return NextResponse.json({ ok: false, error: 'invalid_payload' }, { status: 400 });
    }

    if (Date.now() > payload.exp) {
      return NextResponse.json({ ok: false, error: 'expired' }, { status: 401 });
    }

    const expectedAnswer = payload.a + payload.b;
    if (answer !== expectedAnswer) {
      return NextResponse.json({ ok: false, error: 'wrong_answer' }, { status: 401 });
    }

    const response = NextResponse.json({ ok: true, redirectTo: nextPath });
    response.cookies.set(ACCESS_COOKIE_NAME, ACCESS_COOKIE_VALUE, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 12,
    });

    return response;
  } catch (_) {
    return NextResponse.json({ ok: false, error: 'server_error' }, { status: 500 });
  }
}

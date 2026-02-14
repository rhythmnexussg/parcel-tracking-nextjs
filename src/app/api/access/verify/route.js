import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { getCaptchaSecretOrThrow } from '../captcha-secret';
import { rateLimit, secureApiResponse } from '../../security';

const ACCESS_COOKIE_NAME = 'rnx_access_granted';
const ACCESS_COOKIE_VALUE = '1';
const ACCESS_COOKIE_DURATION_SECONDS = 60 * 60;

function signPayload(payloadBase64, captchaSecret) {
  return crypto.createHmac('sha256', captchaSecret).update(payloadBase64).digest('base64url');
}

function getSafeRedirectPath(nextPath) {
  if (!nextPath || typeof nextPath !== 'string') return '/';
  if (!nextPath.startsWith('/')) return '/';
  if (nextPath.startsWith('/access')) return '/';
  return nextPath;
}

function calculateExpectedAnswer(payload) {
  const { a, b, op } = payload;

  if (op === 'add') return a + b;
  if (op === 'sub') return a - b;
  if (op === 'mul') return a * b;
  if (op === 'div') return b === 0 ? NaN : a / b;

  return NaN;
}

export async function POST(request) {
  const limited = rateLimit(request, { keyPrefix: 'captcha-verify', maxRequests: 20, windowMs: 60 * 1000 });
  if (limited) return limited;

  try {
    const captchaSecret = getCaptchaSecretOrThrow();

    const body = await request.json();
    const token = (body?.token || '').toString().trim();
    const answer = Number(body?.answer);
    const nextPath = getSafeRedirectPath(body?.nextPath || '/');

    if (!token || Number.isNaN(answer)) {
      return secureApiResponse(NextResponse.json({ ok: false, error: 'invalid_request' }, { status: 400 }));
    }

    const [payloadBase64, signature] = token.split('.');
    if (!payloadBase64 || !signature) {
      return secureApiResponse(NextResponse.json({ ok: false, error: 'invalid_token' }, { status: 400 }));
    }

    const expectedSignature = signPayload(payloadBase64, captchaSecret);
    const providedSignatureBuffer = Buffer.from(signature, 'utf-8');
    const expectedSignatureBuffer = Buffer.from(expectedSignature, 'utf-8');
    if (providedSignatureBuffer.length !== expectedSignatureBuffer.length) {
      return secureApiResponse(NextResponse.json({ ok: false, error: 'invalid_signature' }, { status: 401 }));
    }
    const signatureMatch = crypto.timingSafeEqual(providedSignatureBuffer, expectedSignatureBuffer);

    if (!signatureMatch) {
      return secureApiResponse(NextResponse.json({ ok: false, error: 'invalid_signature' }, { status: 401 }));
    }

    const payload = JSON.parse(Buffer.from(payloadBase64, 'base64url').toString('utf-8'));
    if (!payload || typeof payload.a !== 'number' || typeof payload.b !== 'number' || typeof payload.exp !== 'number') {
      return secureApiResponse(NextResponse.json({ ok: false, error: 'invalid_payload' }, { status: 400 }));
    }

    if (!['add', 'sub', 'mul', 'div'].includes(payload.op)) {
      return secureApiResponse(NextResponse.json({ ok: false, error: 'invalid_operation' }, { status: 400 }));
    }

    if (Date.now() > payload.exp) {
      return secureApiResponse(NextResponse.json({ ok: false, error: 'expired' }, { status: 401 }));
    }

    const expectedAnswer = calculateExpectedAnswer(payload);
    if (!Number.isFinite(expectedAnswer)) {
      return secureApiResponse(NextResponse.json({ ok: false, error: 'invalid_payload' }, { status: 400 }));
    }

    if (answer !== expectedAnswer) {
      return secureApiResponse(NextResponse.json({ ok: false, error: 'wrong_answer' }, { status: 401 }));
    }

    const response = NextResponse.json({ ok: true, redirectTo: nextPath });
    response.cookies.set(ACCESS_COOKIE_NAME, ACCESS_COOKIE_VALUE, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: ACCESS_COOKIE_DURATION_SECONDS,
    });

    return secureApiResponse(response);
  } catch (_) {
    return secureApiResponse(NextResponse.json({ ok: false, error: 'server_error' }, { status: 500 }));
  }
}

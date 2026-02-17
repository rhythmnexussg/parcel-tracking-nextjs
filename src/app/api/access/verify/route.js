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

function normalizeInputValue(value) {
  return String(value ?? '').trim();
}

export async function POST(request) {
  const limited = rateLimit(request, { keyPrefix: 'captcha-verify', maxRequests: 20, windowMs: 60 * 1000 });
  if (limited) return limited;

  try {
    // Admin bypass logic
    const adminHeader = request.headers.get('x-admin-auth');
    const adminEnv = process.env.ADMIN_OVERRIDE_SESSION_SECRET || process.env.ADMIN_SESSION_SECRET;
    const isAdmin = adminHeader === adminEnv;

    if (isAdmin) {
      const nextPath = getSafeRedirectPath((await request.json())?.nextPath || '/');
      const response = NextResponse.json({ ok: true, redirectTo: nextPath, bypassed: true });
      response.cookies.set(ACCESS_COOKIE_NAME, ACCESS_COOKIE_VALUE, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: ACCESS_COOKIE_DURATION_SECONDS,
      });
      return secureApiResponse(response);
    }

    // ...existing code...
    const captchaSecret = getCaptchaSecretOrThrow();

    const body = await request.json();
    const token = (body?.token || '').toString().trim();
    const rawAnswer = body?.answer;
    const normalizedAnswer = normalizeInputValue(rawAnswer);
    const nextPath = getSafeRedirectPath(body?.nextPath || '/');

    if (!token || !normalizedAnswer) {
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
    if (!payload || typeof payload.exp !== 'number' || !payload.mode) {
      return secureApiResponse(NextResponse.json({ ok: false, error: 'invalid_payload' }, { status: 400 }));
    }

    if (Date.now() > payload.exp) {
      return secureApiResponse(NextResponse.json({ ok: false, error: 'expired' }, { status: 401 }));
    }

    if (payload.mode === 'math') {
      if (typeof payload.a !== 'number' || typeof payload.b !== 'number' || !['add', 'sub', 'mul', 'div'].includes(payload.op)) {
        return secureApiResponse(NextResponse.json({ ok: false, error: 'invalid_operation' }, { status: 400 }));
      }

      const answerNumber = Number(normalizedAnswer);
      if (Number.isNaN(answerNumber)) {
        return secureApiResponse(NextResponse.json({ ok: false, error: 'invalid_request' }, { status: 400 }));
      }

      const expectedAnswer = calculateExpectedAnswer(payload);
      if (!Number.isFinite(expectedAnswer)) {
        return secureApiResponse(NextResponse.json({ ok: false, error: 'invalid_payload' }, { status: 400 }));
      }

      if (answerNumber !== expectedAnswer) {
        return secureApiResponse(NextResponse.json({ ok: false, error: 'wrong_answer' }, { status: 401 }));
      }
    } else if (payload.mode === 'match') {
      const expectedOption = normalizeInputValue(payload.correctOption);
      if (!expectedOption) {
        return secureApiResponse(NextResponse.json({ ok: false, error: 'invalid_payload' }, { status: 400 }));
      }

      if (normalizedAnswer !== expectedOption) {
        return secureApiResponse(NextResponse.json({ ok: false, error: 'wrong_answer' }, { status: 401 }));
      }
    } else {
      return secureApiResponse(NextResponse.json({ ok: false, error: 'invalid_mode' }, { status: 400 }));
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

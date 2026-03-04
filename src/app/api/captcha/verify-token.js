import crypto from 'crypto';
import { getCaptchaSecretOrThrow } from '../access/captcha-secret';

function calculateExpectedAnswer({ a, b, op }) {
  if (op === 'add') return a + b;
  if (op === 'sub') return a - b;
  if (op === 'mul') return a * b;
  if (op === 'div') return b === 0 ? NaN : a / b;
  return NaN;
}

/**
 * Verifies a math captcha token and answer submitted with a form.
 * Returns { ok: true } on success or { ok: false, error: string } on failure.
 */
export function verifyCaptchaToken(token, rawAnswer) {
  const normalizedAnswer = String(rawAnswer ?? '').trim();

  if (!token || !normalizedAnswer) {
    return { ok: false, error: 'captcha_required' };
  }

  try {
    const captchaSecret = getCaptchaSecretOrThrow();
    const [payloadBase64, signature] = String(token).split('.');

    if (!payloadBase64 || !signature) {
      return { ok: false, error: 'invalid_captcha_token' };
    }

    const expectedSignature = crypto
      .createHmac('sha256', captchaSecret)
      .update(payloadBase64)
      .digest('base64url');

    const providedBuf = Buffer.from(signature, 'utf-8');
    const expectedBuf = Buffer.from(expectedSignature, 'utf-8');

    if (
      providedBuf.length !== expectedBuf.length ||
      !crypto.timingSafeEqual(providedBuf, expectedBuf)
    ) {
      return { ok: false, error: 'invalid_captcha_token' };
    }

    const payload = JSON.parse(
      Buffer.from(payloadBase64, 'base64url').toString('utf-8')
    );

    if (!payload?.exp || !payload?.mode) {
      return { ok: false, error: 'invalid_captcha_token' };
    }

    if (Date.now() > payload.exp) {
      return { ok: false, error: 'captcha_expired' };
    }

    if (payload.mode !== 'math') {
      return { ok: false, error: 'invalid_captcha_mode' };
    }

    const answerNumber = Number(normalizedAnswer);
    if (!Number.isFinite(answerNumber)) {
      return { ok: false, error: 'invalid_captcha_answer' };
    }

    const expected = calculateExpectedAnswer(payload);
    if (!Number.isFinite(expected)) {
      return { ok: false, error: 'invalid_captcha_token' };
    }

    if (answerNumber !== expected) {
      return { ok: false, error: 'wrong_captcha_answer' };
    }

    return { ok: true };
  } catch {
    return { ok: false, error: 'captcha_verification_failed' };
  }
}

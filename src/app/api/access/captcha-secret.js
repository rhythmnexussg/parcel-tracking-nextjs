import crypto from 'crypto';

let cachedDevSecret = null;

export function getCaptchaSecretOrThrow() {
  const configuredSecret =
    process.env.ACCESS_CAPTCHA_SECRET ||
    process.env.ADMIN_SESSION_SECRET ||
    process.env.ADMIN_OVERRIDE_SESSION_SECRET;

  if (configuredSecret) {
    return configuredSecret;
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error('ACCESS_CAPTCHA_SECRET must be configured in production.');
  }

  if (!cachedDevSecret) {
    cachedDevSecret = crypto.randomBytes(32).toString('hex');
  }

  return cachedDevSecret;
}

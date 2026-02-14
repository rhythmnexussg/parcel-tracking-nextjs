import crypto from 'crypto';

let cachedDevSecret = null;

function createStableDerivedSecret() {
  const seedParts = [
    process.env.ACCESS_CAPTCHA_SECRET,
    process.env.ADMIN_SESSION_SECRET,
    process.env.ADMIN_OVERRIDE_SESSION_SECRET,
    process.env.ADMIN_OVERRIDE_USERNAME,
    process.env.ADMIN_OVERRIDE_PASSWORD,
    process.env.ADMIN_USERNAME,
    process.env.ADMIN_PASSWORD,
    process.env.BASIC_AUTH_USERNAME,
    process.env.BASIC_AUTH_PASSWORD,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    process.env.VERCEL_URL,
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.SITE_URL,
    process.env.HOST,
    'rnx-captcha-stable-fallback-v1',
  ].filter(Boolean);

  if (seedParts.length === 0) {
    return null;
  }

  return crypto.createHash('sha256').update(seedParts.join('|')).digest('hex');
}

export function getCaptchaSecretOrThrow() {
  const configuredSecret =
    process.env.ACCESS_CAPTCHA_SECRET ||
    process.env.ADMIN_SESSION_SECRET ||
    process.env.ADMIN_OVERRIDE_SESSION_SECRET;

  if (configuredSecret) {
    return configuredSecret;
  }

  const stableFallback = createStableDerivedSecret();
  if (stableFallback) {
    return stableFallback;
  }

  if (!cachedDevSecret) {
    cachedDevSecret = crypto.randomBytes(32).toString('hex');
  }

  return cachedDevSecret;
}

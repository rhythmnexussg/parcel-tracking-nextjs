import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

const fail = (message) => {
  console.error(`❌ ${message}`);
  process.exitCode = 1;
};

const pass = (message) => {
  console.log(`✅ ${message}`);
};

const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');

const adsLoader = read('src/components/AdSenseLoader.js');
const chatbotWidget = read('src/components/ChatbotWidget.js');
const layout = read('src/app/layout.js');
const accessLayout = read('src/app/access/layout.js');
const blockedLayout = read('src/app/blocked/layout.js');
const privacyPolicy = read('src/app/privacy-policy/page.js');
const adsTxt = read('public/ads.txt').trim();

const allowedPathsMatch = adsLoader.match(/const ALLOWED_EXACT_PATHS = new Set\(\[([\s\S]*?)\]\);/);
if (!allowedPathsMatch) {
  fail('Unable to parse ad whitelist in src/components/AdSenseLoader.js');
} else {
  const pathMatches = [...allowedPathsMatch[1].matchAll(/'([^']+)'/g)].map((m) => m[1]);
  if (!pathMatches.length) {
    fail('Ad whitelist is empty.');
  } else {
    const nonBlogPaths = pathMatches.filter((item) => !item.startsWith('/blog/'));
    if (nonBlogPaths.length > 0) {
      fail(`Ad whitelist includes non-blog routes: ${nonBlogPaths.join(', ')}`);
    } else {
      pass(`Ad whitelist route scope is restricted (${pathMatches.length} blog article routes).`);
    }
  }
}

if (!adsLoader.includes('requestNonPersonalizedAds = 1')) {
  fail('Non-personalized ads default is missing in AdSenseLoader.');
} else {
  pass('Non-personalized ads default is configured.');
}

const minimumWordsMatch = adsLoader.match(/const MINIMUM_CONTENT_WORDS = (\d+);/);
if (!minimumWordsMatch) {
  fail('Unable to parse MINIMUM_CONTENT_WORDS in AdSenseLoader.');
} else if (Number(minimumWordsMatch[1]) < 700) {
  fail(`Content word threshold is too low (${minimumWordsMatch[1]}). Use at least 700 words for policy safety.`);
} else {
  pass(`Content word threshold is strict (${minimumWordsMatch[1]} words).`);
}

const minimumCharactersMatch = adsLoader.match(/const MINIMUM_CONTENT_CHARACTERS = (\d+);/);
if (!minimumCharactersMatch) {
  fail('Unable to parse MINIMUM_CONTENT_CHARACTERS in AdSenseLoader.');
} else if (Number(minimumCharactersMatch[1]) < 4200) {
  fail(`Content character threshold is too low (${minimumCharactersMatch[1]}). Use at least 4200 characters for policy safety.`);
} else {
  pass(`Content character threshold is strict (${minimumCharactersMatch[1]} characters).`);
}

if (!adsLoader.includes('setGlobalAdPause(true);')) {
  fail('AdSenseLoader does not explicitly pause ad requests before route/content checks.');
} else {
  pass('AdSenseLoader explicitly pauses ad requests before eligibility checks.');
}

if (!adsLoader.includes('DISALLOWED_SCREEN_PATTERNS') || !adsLoader.includes('hasDisallowedScreenSignals')) {
  fail('AdSenseLoader is missing under-construction/utility screen signal checks.');
} else {
  pass('AdSenseLoader includes disallowed screen signal checks.');
}

if (!adsLoader.includes('hasUtilityLikeLayout') || !adsLoader.includes('MINIMUM_TEXT_TO_LINK_RATIO')) {
  fail('AdSenseLoader is missing utility/navigation-heavy layout checks.');
} else {
  pass('AdSenseLoader includes utility/navigation-heavy layout checks.');
}

if (!chatbotWidget.includes('const ADS_ELIGIBLE_PATHS = new Set([') || !chatbotWidget.includes('isAdEligibleArticlePage')) {
  fail('ChatbotWidget does not enforce suppression on ad-eligible pages.');
} else {
  pass('ChatbotWidget suppression is configured for ad-eligible pages.');
}

if (!adsLoader.includes('pagead2.googlesyndication.com/pagead/js/adsbygoogle.js')) {
  fail('AdSenseLoader is missing the AdSense script snippet.');
} else {
  pass('AdSenseLoader includes the AdSense script snippet.');
}

if (!layout.includes('meta name="google-adsense-account"')) {
  fail('Layout is missing google-adsense-account meta declaration.');
} else {
  pass('Layout includes google-adsense-account meta declaration.');
}

if (!accessLayout.includes('index: false') || !blockedLayout.includes('index: false')) {
  fail('Access/Blocked routes are missing noindex metadata.');
} else {
  pass('Access/Blocked routes are marked noindex.');
}

if (!privacyPolicy.includes('policies.google.com/technologies/partner-sites')) {
  fail('Privacy policy is missing Google partner-sites disclosure link.');
} else {
  pass('Privacy policy includes Google partner-sites disclosure link.');
}

if (!adsTxt.includes('google.com') || !adsTxt.includes('pub-4194808111663749') || !adsTxt.includes('DIRECT')) {
  fail('ads.txt is missing required Google seller declaration format.');
} else {
  pass('ads.txt includes Google seller declaration.');
}

if (process.exitCode) {
  console.error('\nGoogle Publisher policy audit failed. Resolve the issues above before requesting ad review.');
} else {
  console.log('\nGoogle Publisher policy audit passed.');
}

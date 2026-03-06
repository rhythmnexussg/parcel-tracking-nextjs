'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

// Only allow ads on long-form editorial pages with standalone value.
// Utility, support, navigation, legal, and tool workflows are excluded
// per Google AdSense policy (screens without sufficient publisher content).
const ALLOWED_EXACT_PATHS = new Set([
  '/blog/singpost-epac',
  '/blog/speedpost-ems',
  '/blog/speedpost-express',
  '/blog/us-pddp',
  '/blog/eu-vat-ioss',
  '/blog/uk-vat-hmrc',
  '/blog/norway-voec',
  '/blog/swiss-vat',
  '/blog/phone-number-required',
  '/blog/parcel-scams',
  '/blog/usa-section-122',
]);
const MINIMUM_CONTENT_WORDS = 320;
const MINIMUM_CONTENT_CHARACTERS = 1800;
const MINIMUM_PARAGRAPHS = 4;
const MINIMUM_HEADING_COUNT = 1;
const MINIMUM_TYPE_TOKEN_RATIO = 0.28;
const WORDS_PER_ALLOWED_AD_SLOT = 700;
const MINIMUM_CONTENT_LINK_RATIO = 6;
const UNDER_CONSTRUCTION_PATTERNS = [
  /under\s*construction/i,
  /coming\s*soon/i,
  /work\s*in\s*progress/i,
  /maintenance\s*mode/i,
  /page\s*not\s*ready/i,
];

const SUPPORTED_LANGUAGE_PREFIXES = new Set([
  'en', 'de', 'fr', 'es', 'ja', 'zh', 'pt', 'hi', 'th', 'ms', 'nl', 'id', 'cs', 'it', 'he', 'ga', 'pl', 'ko', 'no', 'sv', 'tl', 'vi', 'fi', 'ru', 'cy', 'ta', 'mi',
]);

const NON_WORD_CHARS_REGEX = (() => {
  try {
    return new RegExp("[^\\p{L}\\p{N}\\s'-]", 'gu');
  } catch (_) {
    return /[^A-Za-z0-9\s'-]/g;
  }
})();

const shouldLoadAdsOnPath = (pathname) => {
  if (!pathname) return false;
  return ALLOWED_EXACT_PATHS.has(pathname);
};

const getVisibleTextContent = () => {
  if (typeof document === 'undefined') return '';

  const selectors = ['main', 'article', '.blog-content-card', '.about-content-card', '.faq-content'];
  return selectors
    .map((selector) => Array.from(document.querySelectorAll(selector)).map((node) => node.textContent || '').join(' '))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
};

const hasPublisherContentContainer = () => {
  if (typeof document === 'undefined') return false;
  return Boolean(document.querySelector('main, article, .blog-content-card, .about-content-card, .faq-content'));
};

const isUnderConstructionOrPlaceholder = (text) => UNDER_CONSTRUCTION_PATTERNS.some((pattern) => pattern.test(text));

const hasReasonableContentToLinkRatio = (wordCount) => {
  if (typeof document === 'undefined') return false;
  const linkCount = document.querySelectorAll('main a, article a, .blog-content-card a, .about-content-card a, .faq-content a').length;
  if (linkCount === 0) return true;
  return wordCount / linkCount >= MINIMUM_CONTENT_LINK_RATIO;
};

const getVisibleTextWordCount = (chunks) => {
  if (!chunks) return 0;
  return chunks.split(' ').filter(Boolean).length;
};

const getTypeTokenRatio = (chunks) => {
  if (!chunks) return 0;
  const tokens = chunks
    .toLowerCase()
    .replace(NON_WORD_CHARS_REGEX, ' ')
    .split(/\s+/)
    .filter((token) => token.length > 1);

  if (!tokens.length) return 0;
  const uniqueCount = new Set(tokens).size;
  return uniqueCount / tokens.length;
};

const isSupportedPageLanguage = () => {
  if (typeof document === 'undefined') return false;
  const htmlLang = (document.documentElement?.lang || '').toLowerCase();
  if (!htmlLang) return false;

  const normalized = htmlLang.split('-')[0];
  return SUPPORTED_LANGUAGE_PREFIXES.has(normalized);
};

const isIndexablePage = () => {
  if (typeof document === 'undefined') return false;
  const robotsMeta = document.querySelector('meta[name="robots"]')?.getAttribute('content')?.toLowerCase() || '';
  return !robotsMeta.includes('noindex');
};

const hasMinimumStructuralContent = () => {
  if (typeof document === 'undefined') return false;
  const paragraphCount = document.querySelectorAll('main p, article p, .blog-content-card p, .about-content-card p, .faq-content p').length;
  // Accept h1, h2, or h3 — blog posts canonically use h2, FAQ cards use h3
  const headingCount = document.querySelectorAll(
    'main h1, main h2, main h3,'
    + ' article h1, article h2,'
    + ' .blog-content-card h1, .blog-content-card h2,'
    + ' .about-content-card h1, .about-content-card h2,'
    + ' .faq-content h1'
  ).length;

  return paragraphCount >= MINIMUM_PARAGRAPHS && headingCount >= MINIMUM_HEADING_COUNT;
};

const hasReasonableAdDensity = (wordCount) => {
  if (typeof document === 'undefined') return false;
  const adSlots = document.querySelectorAll('ins.adsbygoogle').length;
  const maxAllowedSlots = Math.max(1, Math.floor(wordCount / WORDS_PER_ALLOWED_AD_SLOT));
  return adSlots <= maxAllowedSlots;
};

const isContentQualityEligible = () => {
  if (typeof document === 'undefined') return false;
  if (!isIndexablePage()) return false;
  if (!isSupportedPageLanguage()) return false;
  if (!hasPublisherContentContainer()) return false;
  if (!hasMinimumStructuralContent()) return false;

  const text = getVisibleTextContent();
  const wordCount = getVisibleTextWordCount(text);
  const characterCount = text.length;
  const tokenRatio = getTypeTokenRatio(text);

  if (isUnderConstructionOrPlaceholder(text)) return false;
  if (wordCount < MINIMUM_CONTENT_WORDS) return false;
  if (characterCount < MINIMUM_CONTENT_CHARACTERS) return false;
  if (tokenRatio < MINIMUM_TYPE_TOKEN_RATIO) return false;
  if (!hasReasonableContentToLinkRatio(wordCount)) return false;
  if (!hasReasonableAdDensity(wordCount)) return false;

  return true;
};

export function AdSenseLoader() {
  const pathname = usePathname();
  const [isContentRich, setIsContentRich] = useState(false);
  const [isVisibleTab, setIsVisibleTab] = useState(true);

  useEffect(() => {
    if (typeof document === 'undefined') return undefined;
    const handleVisibility = () => setIsVisibleTab(document.visibilityState === 'visible');
    handleVisibility();
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  useEffect(() => {
    if (!shouldLoadAdsOnPath(pathname)) {
      setIsContentRich(false);
      return;
    }

    const evaluateContent = () => {
      setIsContentRich(isContentQualityEligible());
    };

    evaluateContent();
    const timer = setTimeout(evaluateContent, 400);
    return () => clearTimeout(timer);
  }, [pathname]);

  if (!shouldLoadAdsOnPath(pathname) || !isContentRich || !isVisibleTab) {
    return null;
  }

  return (
    <>
      <Script id="adsense-npa-default" strategy="beforeInteractive">
        {`window.adsbygoogle = window.adsbygoogle || []; window.adsbygoogle.requestNonPersonalizedAds = 1;`}
      </Script>
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4194808111663749"
        crossOrigin="anonymous"
        strategy="lazyOnload"
      />
    </>
  );
}

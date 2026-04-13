'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

// Only allow ads on long-form editorial pages with standalone value.
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
const MINIMUM_CONTENT_WORDS = 700;
const MINIMUM_CONTENT_CHARACTERS = 4200;
const MINIMUM_PARAGRAPH_COUNT = 6;
const MINIMUM_HEADING_COUNT = 2;
const MINIMUM_TEXT_TO_LINK_RATIO = 10;
const MAXIMUM_FORM_COUNT = 1;

const DISALLOWED_SCREEN_PATTERNS = [
  /\bunder construction\b/i,
  /\bcoming soon\b/i,
  /\bmaintenance\b/i,
  /\baccess blocked\b/i,
  /\bverify you are human\b/i,
  /\bcaptcha\b/i,
  /\bpage not found\b/i,
];

function normalizePath(pathname) {
  if (!pathname || typeof pathname !== 'string') {
    return '/';
  }

  if (pathname === '/') {
    return '/';
  }

  return pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
}

function setGlobalAdPause(shouldPause) {
  if (typeof window === 'undefined') {
    return;
  }

  window.adsbygoogle = window.adsbygoogle || [];
  window.adsbygoogle.pauseAdRequests = shouldPause ? 1 : 0;
}

function hasBlockingOverlay() {
  if (typeof window === 'undefined') {
    return false;
  }

  const candidates = Array.from(
    document.querySelectorAll('[aria-modal="true"], [role="dialog"], .popup-overlay, .language-modal-overlay')
  );

  return candidates.some((node) => {
    const style = window.getComputedStyle(node);
    if (
      style.display === 'none' ||
      style.visibility === 'hidden' ||
      style.pointerEvents === 'none' ||
      Number(style.opacity || 1) === 0
    ) {
      return false;
    }

    if (style.position !== 'fixed' && style.position !== 'sticky') {
      return false;
    }

    const rect = node.getBoundingClientRect();
    return rect.width >= window.innerWidth * 0.6 && rect.height >= window.innerHeight * 0.35;
  });
}

function getPublisherContentStats() {
  const root =
    document.querySelector('.blog-content-card') ||
    document.querySelector('article') ||
    document.querySelector('main');

  if (!root) {
    return {
      root: null,
      wordCount: 0,
      characterCount: 0,
      paragraphCount: 0,
      headingCount: 0,
      linkCount: 0,
      formCount: 0,
    };
  }

  const text = (root.textContent || '').replace(/\s+/g, ' ').trim();
  const wordCount = text.split(' ').filter(Boolean).length;
  const characterCount = text.length;
  const paragraphCount = root.querySelectorAll('p, li').length;
  const headingCount = root.querySelectorAll('h2, h3, h4').length;
  const linkCount = root.querySelectorAll('a').length;
  const formCount = root.querySelectorAll('form').length;

  return {
    root,
    wordCount,
    characterCount,
    paragraphCount,
    headingCount,
    linkCount,
    formCount,
  };
}

function hasDisallowedScreenSignals(root) {
  if (!root) {
    return true;
  }

  const title = document.title || '';
  const headingText = Array.from(root.querySelectorAll('h1, h2'))
    .map((node) => node.textContent || '')
    .join(' ');
  const sampleText = (root.textContent || '').replace(/\s+/g, ' ').slice(0, 2200);
  const signalText = `${title} ${headingText} ${sampleText}`;

  return DISALLOWED_SCREEN_PATTERNS.some((pattern) => pattern.test(signalText));
}

function hasUtilityLikeLayout(stats) {
  const linkBase = Math.max(1, stats.linkCount);
  const textToLinkRatio = stats.wordCount / linkBase;

  return textToLinkRatio < MINIMUM_TEXT_TO_LINK_RATIO || stats.formCount > MAXIMUM_FORM_COUNT;
}

export function AdSenseLoader() {
  const pathname = usePathname();
  const [shouldFireAds, setShouldFireAds] = useState(false);

  useEffect(() => {
    const normalizedPath = normalizePath(pathname);

    // Always pause before evaluating the page so ad requests do not leak to non-content screens.
    setShouldFireAds(false);
    setGlobalAdPause(true);

    // If not a permitted path, disable ads via pauseAdRequests.
    if (!ALLOWED_EXACT_PATHS.has(normalizedPath)) {
      return;
    }

    // Delay evaluation slightly to let DOM render
    const timer = setTimeout(() => {
      const robotsMeta = document.querySelector('meta[name="robots"]')?.getAttribute('content')?.toLowerCase() || '';
      const isIndexable = !robotsMeta.includes('noindex');
      const blockedByOverlay = hasBlockingOverlay();
      const stats = getPublisherContentStats();
      const blockedByScreenSignals = hasDisallowedScreenSignals(stats.root);
      const blockedByUtilityLayout = hasUtilityLikeLayout(stats);

      const hasSubstantialPublisherContent =
        stats.wordCount >= MINIMUM_CONTENT_WORDS &&
        stats.characterCount >= MINIMUM_CONTENT_CHARACTERS &&
        stats.paragraphCount >= MINIMUM_PARAGRAPH_COUNT &&
        stats.headingCount >= MINIMUM_HEADING_COUNT;

      setShouldFireAds(
        isIndexable &&
          !blockedByOverlay &&
          !blockedByScreenSignals &&
          !blockedByUtilityLayout &&
          hasSubstantialPublisherContent
      );
    }, 900);
    
    return () => {
      clearTimeout(timer);
      setGlobalAdPause(true);
    };
  }, [pathname]);

  // Use an effect to sync the pauseAdRequests global state.
  useEffect(() => {
    setGlobalAdPause(!shouldFireAds);
  }, [shouldFireAds]);

  // WE NEVER RETURN NULL HERE ! The user expressly required:
  // "the adsense code snippet, ads.txt and meta tag cannot be removed during review"
  // So the snippet is ALWAYS in the DOM, satisfying Google's "code missing" check.
  // But pauseAdRequests handles the "Google-served ads on screens without publisher content" violation.
  return (
    <>
      <Script id="adsense-init" strategy="beforeInteractive">
        {`
          window.adsbygoogle = window.adsbygoogle || [];
          window.adsbygoogle.requestNonPersonalizedAds = 1;
          window.adsbygoogle.pauseAdRequests = 1; // Start paused to prevent flash of ads on thin content
        `}
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

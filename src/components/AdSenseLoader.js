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
const MINIMUM_CONTENT_WORDS = 320;
const MINIMUM_CONTENT_CHARACTERS = 1800;

export function AdSenseLoader() {
  const pathname = usePathname();
  const [shouldFireAds, setShouldFireAds] = useState(false);

  useEffect(() => {
    // If not a permitted path, disable ads via pauseAdRequests.
    if (!ALLOWED_EXACT_PATHS.has(pathname)) {
      setShouldFireAds(false);
      return;
    }

    // Delay evaluation slightly to let DOM render
    const timer = setTimeout(() => {
      const isIndexable = !document.querySelector('meta[name="robots"]')?.getAttribute('content')?.toLowerCase().includes('noindex');
      
      const selectors = ['main', 'article', '.blog-content-card', '.about-content-card', '.faq-content'];
      const text = selectors
        .map((selector) => Array.from(document.querySelectorAll(selector)).map((node) => node.textContent || '').join(' '))
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();
        
      const wordCount = text.split(' ').filter(Boolean).length;
      
      // If it has enough text and is allowed, we can fire ads
      if (isIndexable && wordCount >= MINIMUM_CONTENT_WORDS && text.length >= MINIMUM_CONTENT_CHARACTERS) {
        setShouldFireAds(true);
      } else {
        setShouldFireAds(false);
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [pathname]);

  // Use an effect to sync the pauseAdRequests global state 
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.adsbygoogle = window.adsbygoogle || [];
      // If we shouldn't fire ads, pause ad requests BEFORE they happen.
      window.adsbygoogle.pauseAdRequests = shouldFireAds ? 0 : 1;
    }
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

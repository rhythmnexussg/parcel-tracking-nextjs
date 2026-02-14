"use client";

import { useEffect, useState } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "../LanguageContext";
import Script from "next/script";
import { usePathname, useRouter } from "next/navigation";
import { detectLanguageFromIPWithRestrictions, isAllowedAccessCountry } from "../ipGeolocation";

const ACCESS_TAB_SESSION_KEY = "rnx_access_tab_verified";

function isCaptchaRequiredPath(pathname) {
  if (!pathname || typeof pathname !== "string") return false;

  return (
    pathname === "/" ||
    pathname === "/about" ||
    pathname === "/FAQ" ||
    pathname === "/faq" ||
    pathname === "/blog" ||
    pathname.startsWith("/blog/") ||
    pathname === "/track-your-item"
  );
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [accessChecked, setAccessChecked] = useState(false);

  useEffect(() => {
    let isActive = true;

    const checkAccess = async () => {
      const isLocalhost = (() => {
        try {
          const host = (window.location.hostname || '').toLowerCase();
          return host === 'localhost' || host === '127.0.0.1' || host === '::1';
        } catch (_) {
          return false;
        }
      })();

      if (isLocalhost) {
        if (isActive) setAccessChecked(true);
        return;
      }

      // Always allow access checks to be bypassed for access and blocked pages
      if (pathname === "/access" || pathname === "/blocked") {
        if (isActive) setAccessChecked(true);
        return;
      }

      if (!isCaptchaRequiredPath(pathname)) {
        if (isActive) setAccessChecked(true);
        return;
      }

      const hasTabCaptcha = sessionStorage.getItem(ACCESS_TAB_SESSION_KEY) === "1";
      if (!hasTabCaptcha) {
        const nextPath = `${pathname}${window.location.search || ""}`;
        router.replace(`/access?next=${encodeURIComponent(nextPath)}`);
        if (isActive) setAccessChecked(true);
        return;
      }

      if (isActive) setAccessChecked(false);

      const fallbackCountryFromUrl = (() => {
        try {
          const params = new URLSearchParams(window.location.search || "");
          return (params.get("country") || params.get("adminCountry") || "").trim().toUpperCase();
        } catch (_) {
          return "";
        }
      })();

      try {
        const geoData = await detectLanguageFromIPWithRestrictions();
        if (!isActive) return;

        const countryCode = geoData?.countryCode;
        const blocked = geoData?.blocked ?? !isAllowedAccessCountry(countryCode);

        if (blocked) {
          const blockedCountry =
            geoData?.countryCode ||
            geoData?.detectedCountryCode ||
            geoData?.secondaryCountryCode ||
            geoData?.blockedSignalCountry ||
            fallbackCountryFromUrl;
          router.replace(blockedCountry ? `/blocked?country=${encodeURIComponent(blockedCountry)}` : "/blocked");
          setAccessChecked(true);
          return;
        }

        setAccessChecked(true);
      } catch (_) {
        if (!isActive) return;
        const fallbackCountry = fallbackCountryFromUrl;
        router.replace(fallbackCountry ? `/blocked?country=${encodeURIComponent(fallbackCountry)}` : "/blocked");
        setAccessChecked(true);
      }
    };

    checkAccess();

    return () => {
      isActive = false;
    };
  }, [pathname, router]);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Track your Rhythm Nexus parcel internationally. Real-time tracking for SingPost ePAC, SpeedPost Priority, SpeedPost Express (DHL), and postal services in 30+ countries including USA, UK, Germany, Australia, Canada, and more." />
        <meta name="keywords" content="parcel tracking, package tracking, international shipping, SingPost tracking, SpeedPost tracking, DHL tracking, postal service, delivery tracking, order tracking, Rhythm Nexus" />
        <meta name="author" content="Rhythm Nexus" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://rhythmnexus.com/" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://rhythmnexus.com/" />
        <meta property="og:title" content="Rhythm Nexus - e-Commerce Store" />
        <meta property="og:description" content="Shop at Rhythm Nexus and track your orders with ease. International shipping via SingPost, SpeedPost, and DHL Express." />
        <meta property="og:image" content="https://rhythmnexus.com/logo512.png" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://rhythmnexus.com/" />
        <meta property="twitter:title" content="Rhythm Nexus - e-Commerce Store" />
        <meta property="twitter:description" content="Shop at Rhythm Nexus and track your orders with ease. International shipping via SingPost, SpeedPost, and DHL Express." />
        <meta property="twitter:image" content="https://rhythmnexus.com/logo512.png" />
        
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <title>Rhythm Nexus - e-Commerce Store</title>
        
        {/* Structured Data - Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Rhythm Nexus",
              "url": "https://rhythmnexus.com",
              "logo": "https://rhythmnexus.com/logo512.png",
              "description": "International parcel tracking and shipping service",
              "sameAs": [
                "https://www.etsy.com/shop/RhythmNexus",
                "https://www.ebay.com/usr/rhythmnexus"
              ]
            })
          }}
        />
        
        {/* Google AdSense */}
        <meta name="google-adsense-account" content="ca-pub-4194808111663749" />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4194808111663749"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <LanguageProvider>
          {pathname === "/blocked" || accessChecked ? children : null}
        </LanguageProvider>
        
        {/* Google Analytics - Add your measurement ID here */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `}
        </Script>
      </body>
    </html>
  );
}

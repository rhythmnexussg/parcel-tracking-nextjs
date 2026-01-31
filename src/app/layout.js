"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "../LanguageContext";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
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
          <script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4194808111663749"
            crossOrigin="anonymous"
          ></script>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6282638141528337"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <LanguageProvider>
          {children}
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

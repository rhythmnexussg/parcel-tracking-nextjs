import { Geist, Geist_Mono, Nunito } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "../LanguageContext";
import Script from "next/script";
import { AccessGuard } from "../components/AccessGuard";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

const GA_MEASUREMENT_ID = "G-XXXXXXXXXX";

export const metadata = {
  metadataBase: new URL("https://rhythmnexus.com"),
  title: "Rhythm Nexus - e-Commerce Store",
  description:
    "Track your Rhythm Nexus parcel internationally. Real-time tracking for SingPost ePAC, SpeedPost Priority, SpeedPost Express (DHL), and postal services in 30+ countries including USA, UK, Germany, Australia, Canada, and more.",
  keywords:
    "parcel tracking, package tracking, international shipping, SingPost tracking, SpeedPost tracking, DHL tracking, postal service, delivery tracking, order tracking, Rhythm Nexus",
  authors: [{ name: "Rhythm Nexus" }],
  robots: "index, follow",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "https://rhythmnexus.com/",
    title: "Rhythm Nexus - e-Commerce Store",
    description:
      "Shop at Rhythm Nexus and track your orders with ease. International shipping via SingPost, SpeedPost, and DHL Express.",
    images: ["/logo512.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rhythm Nexus - e-Commerce Store",
    description:
      "Shop at Rhythm Nexus and track your orders with ease. International shipping via SingPost, SpeedPost, and DHL Express.",
    images: ["/logo512.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        
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
          strategy="lazyOnload"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${nunito.variable}`} suppressHydrationWarning>
        <LanguageProvider>
          <AccessGuard>{children}</AccessGuard>
        </LanguageProvider>
        
        {GA_MEASUREMENT_ID && GA_MEASUREMENT_ID !== "G-XXXXXXXXXX" ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="lazyOnload"
            />
            <Script id="google-analytics" strategy="lazyOnload">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}');
              `}
            </Script>
          </>
        ) : null}
      </body>
    </html>
  );
}

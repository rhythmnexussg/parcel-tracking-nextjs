'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import logo from "../assets/images/logo.jpg";
import { useLanguage } from "../LanguageContext";
import { LanguageSelector } from "../LanguageSelector";
import TimezoneHeader from "./TimezoneHeader";
import HolidayNotification from "./HolidayNotification";
import { detectLanguageFromIPWithRestrictions } from "../ipGeolocation";
import { policyText } from "../lib/policyI18n";

export const Navigation = () => {
  const { t, language } = useLanguage();
  const policy = policyText(language);
  const [userCountry, setUserCountry] = useState(null);
  const [showCnyMessage, setShowCnyMessage] = useState(false);
  const searchParams = useSearchParams();
  const translatedCnyMessage = t('cnyYearOfHorseMessage');
  const cnyMessage = translatedCnyMessage && translatedCnyMessage !== 'cnyYearOfHorseMessage'
    ? translatedCnyMessage
    : '🧧 Happy Chinese New Year! Wishing you prosperity in the Year of the Horse 🐴';

  const overrideCountry =
    (searchParams.get('country') || searchParams.get('adminCountry') || '').trim().toUpperCase();
  const hasOverrideCountry = /^[A-Z]{2}$/.test(overrideCountry);

  const withOverride = (pathname) => {
    if (!hasOverrideCountry) return pathname;
    const separator = pathname.includes('?') ? '&' : '?';
    return `${pathname}${separator}country=${overrideCountry}`;
  };
  
  useEffect(() => {
    const detectUserLocation = async () => {
      try {
        // Use override country if provided, otherwise detect from IP
        if (hasOverrideCountry) {
          setUserCountry(overrideCountry);
          return;
        }
        
        const geoData = await detectLanguageFromIPWithRestrictions();
        if (geoData && geoData.countryCode) {
          setUserCountry(geoData.countryCode);
        }
      } catch (error) {
        console.error('Failed to detect user location:', error);
      }
    };
    
    detectUserLocation();
  }, [hasOverrideCountry, overrideCountry]);

  useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();
    
    // Lunar New Year dates (15-day celebration)
    const cnyDates = {
      2026: { start: new Date(2026, 1, 17, 0, 0, 0, 0), end: new Date(2026, 2, 3, 23, 59, 59, 999) },
      2027: { start: new Date(2027, 1, 6, 0, 0, 0, 0), end: new Date(2027, 1, 20, 23, 59, 59, 999) }
    };
    
    const cnyPeriod = cnyDates[year];
    if (cnyPeriod) {
      setShowCnyMessage(now >= cnyPeriod.start && now <= cnyPeriod.end);
    } else {
      setShowCnyMessage(false);
    }
  }, []);
  
  return (
    <>
    <nav className="navbar">
      <div className="navbar-brand">
        <Link href={withOverride('/')}>
          <Image src={logo} alt="Rhythm Nexus" />
        </Link>
      </div>
      
      <div className="navbar-center">
        {showCnyMessage ? (
          <div className="navbar-cny-message">
            {cnyMessage}
          </div>
        ) : null}
        <HolidayNotification userCountry={userCountry} t={t} currentLanguage={language} />
        <TimezoneHeader userCountry={userCountry} t={t} />
      </div>
      
      <div className="navbar-links">
        <Link href={withOverride('/')} className="nav-link">{t('home')}</Link>
        <Link href={withOverride('/blog')} className="nav-link">{t('blog')}</Link>
        <Link href={withOverride('/about')} className="nav-link">{t('aboutUs')}</Link>
        <Link href={withOverride('/FAQ')} className="nav-link">{t('faq')}</Link>
        <Link href={withOverride('/terms-of-service')} className="nav-link">{policy.navTerms}</Link>
        <Link href={withOverride('/privacy-policy')} className="nav-link">{policy.navPrivacy}</Link>
        <Link href="/contact" className="nav-link">{t('contact')}</Link>
        <Link href={withOverride('/track-your-item')} className="nav-link highlight">{t('trackPackage')}</Link>
        <LanguageSelector />
      </div>
    </nav>
      <div className="navbar-spacer"></div>
    </>
  );
};

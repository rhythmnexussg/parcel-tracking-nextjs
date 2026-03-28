'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '../LanguageContext';
import { policyText } from '../lib/policyI18n';

export const Footer = () => {
  const { t, language } = useLanguage();
  const policy = policyText(language);

  return (
    <footer className="footer-modern">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <h3 className="footer-logo">Rhythm Nexus</h3>
            <p className="footer-desc">
              {t('footerDesc') || 'Your premier destination for arcade amusement cards, rhythm game gloves, and specialized merch. Enjoy global e-commerce with seamless international parcel tracking and reliable shipping data.'}
            </p>
          </div>
          
          <div className="footer-links-group">
            <h4>{t('footerQuickLinks') || 'Quick Links'}</h4>
            <ul>
              <li><Link href="/">{t('home')}</Link></li>
              <li><Link href="/track-your-item">{t('trackPackage')}</Link></li>
              <li><Link href="/delivery-rates-2026">{t('deliveryRates2026')}</Link></li>
              <li><Link href="/blog">{t('blog')}</Link></li>
            </ul>
          </div>
          
          <div className="footer-links-group">
            <h4>{t('footerSupportLegal') || 'Support & Legal'}</h4>
            <ul>
              <li><Link href="/contact">{t('contact')}</Link></li>
              <li><Link href="/FAQ">{t('faq')}</Link></li>
              <li><Link href="/terms-of-service">{policy.navTerms}</Link></li>
              <li><Link href="/privacy-policy">{policy.navPrivacy}</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Rhythm Nexus. {t('copyrightText') || 'All Rights Reserved.'}</p>
        </div>
      </div>
    </footer>
  );
};

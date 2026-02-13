"use client";

import React, { useState, useEffect } from "react"; 
import "../App.css";
import { useLanguage } from "../LanguageContext";
import { detectLanguageFromIPWithRestrictions } from "../ipGeolocation";
import { Navigation } from "../components/Navigation";
import { AdBlock } from "../components/AdBlock";

export default function Home() {
  const { t } = useLanguage();
  const [isChina, setIsChina] = useState(false);

  useEffect(() => {
    const checkLocation = async () => {
      try {
        const data = await detectLanguageFromIPWithRestrictions();
        if (data && data.countryCode === 'CN') {
          setIsChina(true);
        }
      } catch (e) {
        console.error("Location check failed", e);
      }
    };
    checkLocation();
  }, []);
  
  return (
    <>
      <Navigation />

      <div className="container text-center">
        <h1 className="mt-3">{t('welcomeTitle')}</h1>

        <p className="mt-3">
          {isChina ? (
            <>
              {t('purchaseInfoChina') || 'Purchase from us through our official channels, or email us at'} {" "}
              <a href="mailto:rhythmnexusco@gmail.com">rhythmnexusco@gmail.com</a>
              {t('purchaseInfoChinaSuffix') || '.'}
            </>
          ) : (
            <>
              {t('purchaseInfo')} {" "}
              <a href="https://t.me/deltaboxstoresg" target="_blank" rel="noopener noreferrer">
                {t('telegramGroup')}
              </a>{" "}
              {t('forUpdates')}
            </>
          )}
        </p>

        <div className="home-section">
          <h2>{t('ourStores')}</h2>
          <div className="store-links">
            <a href="https://etsy.com/shop/RhythmNexus" className="store-link">
              <div className="store-card">
                <h3>{t('etsyStore')}</h3>
                <p>{t('internationalShipping')}</p>
              </div>
            </a>
            <a href="https://ebay.com/usr/RhythmNexus" className="store-link">
              <div className="store-card">
                <h3>{t('ebayStore')}</h3>
                <p>{t('internationalShipping')}</p>
              </div>
            </a>
            <a href="https://shopee.sg/RhythmNexus" className="store-link">
              <div className="store-card">
                <h3>{t('shopeeStore')}</h3>
                <p>{t('singaporeLocal')}</p>
              </div>
            </a>
            <a href="https://payhip.com/RhythmNexus" className="store-link">
              <div className="store-card">
                <h3>{t('payhipStore')}</h3>
                <p>{t('asiaOnly')}</p>
              </div>
            </a>
          </div>
        </div>

        <div className="home-section">
          <h2>{t('deliveryInfo')}</h2>
          <div className="info-links">
            <a href="https://docs.google.com/spreadsheets/d/1Q08_ePn3d0IEp8FU6hShyZ7ayEFbeh1k3SE1wX_T4TY/edit?gid=947614375#gid=947614375" className="info-link">
              {t('deliveryRates2026')}
            </a>
            <a href="https://docs.google.com/spreadsheets/d/1Q08_ePn3d0IEp8FU6hShyZ7ayEFbeh1k3SE1wX_T4TY/edit?gid=1938431161#gid=1938431161" className="info-link">
              {t('sgDeliveryRates')}
            </a>
            <a href="https://docs.google.com/spreadsheets/d/1Q08_ePn3d0IEp8FU6hShyZ7ayEFbeh1k3SE1wX_T4TY/edit?gid=389317311#gid=389317311" className="info-link">
              {t('speedPostRates')}
            </a>
          </div>
        </div>

        <AdBlock />

        <p className="text-muted">
          © {new Date().getFullYear()} Rhythm Nexus. {t('copyrightText')}
        </p>
      </div>
    </>
  );
}

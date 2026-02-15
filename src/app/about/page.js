'use client';

import React from "react";
import "../../App.css";
import { useLanguage } from "../../LanguageContext";
import { Navigation } from "../../components/Navigation";

export default function About() {
  const { t } = useLanguage();
  
  return (
    <>
      <Navigation />
      
      <div className="container text-center">
        <h1 className="mt-3">{t('aboutTitle')}</h1>

        <div className="about-content-card">
          <p>
            {t('aboutP1')}
          </p>

          <p>
            {t('aboutP2')}
          </p>

          <p>
            {t('aboutP3')}
          </p>

          <p>
            {t('aboutP4')}
          </p>
        </div>
        
        <p className="text-muted">
          © {new Date().getFullYear()} Rhythm Nexus. {t('copyrightText')}
        </p>
      </div>
    </>
  );
}

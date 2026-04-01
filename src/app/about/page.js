'use client';

import React from "react";
import "../../App.css";
import { useLanguage } from "../../LanguageContext";
import { Navigation } from "../../components/Navigation";
import { Footer } from "../../components/Footer";

export default function About() {
  const { t } = useLanguage();
  
  return (
    <>
      <Navigation />

      <main>
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

          <Footer />
        </div>
      </main>
    </>
  );
}

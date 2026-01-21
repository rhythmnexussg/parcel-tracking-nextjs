'use client';

import React, { createContext, useState, useEffect } from 'react';
import { translations } from './translations';
import { detectLanguageFromIP, detectLanguageFromBrowser } from './ipGeolocation';
import LanguageModal from './LanguageModal';

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [detectedCountry, setDetectedCountry] = useState(null);
  const [languageOptions, setLanguageOptions] = useState([]);

  useEffect(() => {
    // Initialize language from localStorage on client side only
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('rhythmNexusLanguage');
      if (saved) {
        setLanguage(saved);
      }
    }
  }, []);

  useEffect(() => {
    const detectInitialLanguage = async () => {
      if (typeof window === 'undefined') return;
      
      const saved = localStorage.getItem('rhythmNexusLanguage');
      const hasVisited = localStorage.getItem('rhythmNexusHasVisited');

      if (!saved && !hasVisited) {
        console.log('First visit detected - showing language selection modal...');
        
        const ipResult = await detectLanguageFromIP();
        
        if (ipResult) {
          setDetectedCountry(ipResult.countryCode);
          setLanguage(ipResult.languageCode);
        } else {
          const browserLang = detectLanguageFromBrowser();
          setLanguage(browserLang);
        }
        
        // Always show language modal on first visit
        setShowLanguageModal(true);
        localStorage.setItem('rhythmNexusHasVisited', 'true');
      }
    };

    detectInitialLanguage();
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('rhythmNexusLanguage', language);
    }
  }, [language]);

  const handleLanguageSelect = (langCode) => {
    setLanguage(langCode);
    setShowLanguageModal(false);
  };

  const t = (key) => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
      <LanguageModal
        isOpen={showLanguageModal}
        onClose={() => setShowLanguageModal(false)}
        onSelectLanguage={handleLanguageSelect}
        availableLanguages={languageOptions}
        country={detectedCountry}
      />
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = React.useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

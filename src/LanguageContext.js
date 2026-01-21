'use client';

import React, { createContext, useState, useEffect } from 'react';
import { translations } from './translations';
import { detectLanguageFromIP, detectLanguageFromBrowser } from './ipGeolocation';
import LanguageModal from './LanguageModal';

// Helper function to get language name
const getLanguageName = (code) => {
  const names = {
    'en': 'English',
    'de': 'Deutsch (German)',
    'fr': 'Français (French)',
    'es': 'Español (Spanish)',
    'ja': '日本語 (Japanese)',
    'zh': '简体中文 (Simplified Chinese)',
    'zh-hant': '繁體中文 (Traditional Chinese)',
    'pt': 'Português (Portuguese)',
    'hi': 'हिन्दी (Hindi)',
    'th': 'ภาษาไทย (Thai)',
    'ms': 'Bahasa Melayu (Malay)',
    'nl': 'Nederlands (Dutch)',
    'id': 'Bahasa Indonesia (Indonesian)',
    'cs': 'Čeština (Czech)',
    'it': 'Italiano (Italian)',
    'he': 'עברית (Hebrew)',
    'ga': 'Gaeilge (Irish)',
    'pl': 'Polski (Polish)',
    'ko': '한국어 (Korean)',
    'no': 'Norsk (Norwegian)',
    'ru': 'Русский (Russian)',
    'sv': 'Svenska (Swedish)',
    'fi': 'Suomi (Finnish)',
    'tl': 'Tagalog',
    'vi': 'Tiếng Việt (Vietnamese)',
    'cy': 'Cymraeg (Welsh)'
  };
  return names[code] || 'English';
};

// Helper function to get country flag
const getCountryFlag = (code) => {
  const flags = {
    'CN': '🇨🇳', 'TW': '🇹🇼', 'HK': '🇭🇰', 'JP': '🇯🇵', 'KR': '🇰🇷',
    'FR': '🇫🇷', 'DE': '🇩🇪', 'ES': '🇪🇸', 'PT': '🇵🇹', 'BR': '🇧🇷',
    'IT': '🇮🇹', 'NL': '🇳🇱', 'NO': '🇳🇴', 'SE': '🇸🇪', 'PL': '🇵🇱',
    'CZ': '🇨🇿', 'IN': '🇮🇳', 'TH': '🇹🇭', 'MY': '🇲🇾', 'ID': '🇮🇩',
    'RU': '🇷🇺', 'PH': '🇵🇭', 'VN': '🇻🇳', 'IE': '🇮🇪', 'IL': '🇮🇱',
    'BN': '🇧🇳', 'MO': '🇲🇴', 'BE': '🇧🇪', 'CH': '🇨🇭', 'US': '🇺🇸',
    'GB': '🇬🇧', 'CA': '🇨🇦', 'AU': '🇦🇺', 'NZ': '🇳🇿', 'SG': '🇸🇬',
    'FI': '🇫🇮'
  };
  return flags[code] || '🇬🇧';
};

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
      
      console.log('Showing language selection modal...');
      
      const ipResult = await detectLanguageFromIP();
      
      if (ipResult) {
        setDetectedCountry(ipResult.countryCode);
        setLanguage(ipResult.languageCode);
        
        // Set language options based on country
        if (ipResult.isMultiLingual && ipResult.languageOptions) {
          setLanguageOptions(ipResult.languageOptions);
        } else {
          // For single-language countries (AU, NZ, etc.), only show English
          if (ipResult.languageCode === 'en') {
            setLanguageOptions([
              { code: 'en', name: 'English', flag: '🇬🇧' }
            ]);
          } else {
            // For other single-language countries, offer English + detected language
            setLanguageOptions([
              { code: 'en', name: 'English', flag: '🇬🇧' },
              { code: ipResult.languageCode, name: getLanguageName(ipResult.languageCode), flag: getCountryFlag(ipResult.countryCode) }
            ]);
          }
        }
      } else {
        const browserLang = detectLanguageFromBrowser();
        setLanguage(browserLang);
        // Default to English only if IP detection fails
        setLanguageOptions([{ code: 'en', name: 'English', flag: '🇬🇧' }]);
      }
      
      // Always show language modal on every visit
      setShowLanguageModal(true);
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

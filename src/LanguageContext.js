'use client';

import React, { createContext, useState, useEffect } from 'react';
import { translations } from './translations';
import { detectLanguageFromIPWithRestrictions, detectLanguageFromBrowser } from './ipGeolocation';
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
    'cy': 'Cymraeg (Welsh)',
    'ta': 'தமிழ் (Tamil)',
    'mi': 'Māori (Te Reo Māori)'
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
  const [isMounted, setIsMounted] = useState(false);

  // Ensure we only run on client side after mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const detectInitialLanguage = async () => {
      if (!isMounted) return;
      
      console.log('=== LANGUAGE DETECTION STARTED ===');
      
      // No localStorage check - always detect and show modal on page load
      console.log('✓ Starting fresh detection (no persistent storage)');
      
      const ipResult = await detectLanguageFromIPWithRestrictions();
      
      console.log('IP Detection Result:', ipResult);
      
      if (ipResult) {
        if (ipResult.blocked) {
          console.log('🚫 Access blocked geolocation detected, skipping language modal');
          const normalizeLang = (code) => {
            const c = (code || 'en').toLowerCase();
            if (c === 'zh-cn' || c === 'zh-hans') return 'zh';
            if (c === 'zh-tw' || c === 'zh-hant' || c === 'zh-hk') return 'zh-hant';
            return c;
          };
          const blockedDefaultLang = ipResult.countryCode === 'SG'
            ? 'en'
            : normalizeLang(ipResult.languageCode || 'en');
          setLanguage(blockedDefaultLang);
          setShowLanguageModal(false);
          setLanguageOptions([]);
          return;
        }

        console.log(`✓ Country: ${ipResult.countryCode}`);
        console.log(`✓ Is Multi-Lingual: ${ipResult.isMultiLingual}`);
        console.log(`✓ Language Code: ${ipResult.languageCode}`);
        console.log('✓ Language Options:', ipResult.languageOptions);
        
        setDetectedCountry(ipResult.countryCode);
        const normalizeLang = (code) => {
          const c = (code || 'en').toLowerCase();
          if (c === 'zh-cn' || c === 'zh-hans') return 'zh';
          if (c === 'zh-tw' || c === 'zh-hant' || c === 'zh-hk') return 'zh-hant';
          return c;
        };
        const detectedDefaultLang = ipResult.countryCode === 'SG'
          ? 'en'
          : normalizeLang(ipResult.languageCode || 'en');
        setLanguage(detectedDefaultLang);
        
        // Show modal for detected countries, except countries where English-only UX is desired
        const noLanguagePopupCountries = new Set(['AU', 'NZ']);
        if (ipResult.countryCode && !noLanguagePopupCountries.has(ipResult.countryCode)) {
          console.log('🎉 SHOWING LANGUAGE MODAL - Detected country, no saved preference');
          console.log(`   Country: ${ipResult.countryCode}`);
          console.log(`   Available languages: ${ipResult.languageOptions?.length || 0}`);
          
          // If there are language options, use them. Otherwise, show all languages.
          if (ipResult.languageOptions && ipResult.languageOptions.length > 0) {
            setLanguageOptions(ipResult.languageOptions);
          } else {
            // For countries without specific language options, show all languages
            setLanguageOptions([]);
          }
          
          setShowLanguageModal(true);
        } else {
          console.log('❌ NOT showing modal - No country detected or popup suppressed for this country');
          setShowLanguageModal(false);
        }
      } else {
        console.warn('❌ IP detection failed, falling back to browser language');
        const browserLang = detectLanguageFromBrowser();
        const normalizeLang = (code) => {
          const c = (code || 'en').toLowerCase();
          if (c === 'zh-cn' || c === 'zh-hans') return 'zh';
          if (c === 'zh-tw' || c === 'zh-hant' || c === 'zh-hk') return 'zh-hant';
          return c;
        };
        setLanguage(normalizeLang(browserLang));
        setShowLanguageModal(false);
      }
      
      console.log('=== LANGUAGE DETECTION COMPLETE ===');
    };

    detectInitialLanguage();
  }, [isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    const langCode = language || 'en';
    if (typeof document !== 'undefined') {
      document.documentElement.lang = langCode;
      if (document.body) {
        document.body.setAttribute('data-language', langCode);
      }
    }
  }, [language, isMounted]);

  const handleLanguageSelect = (langCode) => {
    const normalizeLang = (code) => {
      const c = (code || 'en').toLowerCase();
      if (c === 'zh-cn' || c === 'zh-hans') return 'zh';
      if (c === 'zh-tw' || c === 'zh-hant' || c === 'zh-hk') return 'zh-hant';
      return c;
    };
    setLanguage(normalizeLang(langCode));
    // No localStorage - language only persists during current session
    setShowLanguageModal(false);
  };

  // Simple language change without any storage
  const changeLanguage = (langCode) => {
    const normalizeLang = (code) => {
      const c = (code || 'en').toLowerCase();
      if (c === 'zh-cn' || c === 'zh-hans') return 'zh';
      if (c === 'zh-tw' || c === 'zh-hant' || c === 'zh-hk') return 'zh-hant';
      return c;
    };
    setLanguage(normalizeLang(langCode));
  };

  const hasTranslation = (key) => {
    const langPack = translations[language] || {};
    return Object.prototype.hasOwnProperty.call(langPack, key);
  };

  // Strict translator: returns only current-language value, no English fallback
  const tStrict = (key) => {
    return hasTranslation(key) ? translations[language][key] : undefined;
  };

  const t = (key) => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t, tStrict, hasTranslation }}>
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

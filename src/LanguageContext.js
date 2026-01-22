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
  const [isMounted, setIsMounted] = useState(false);

  // Ensure we only run on client side after mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const detectInitialLanguage = async () => {
      if (!isMounted) return;
      
      console.log('=== LANGUAGE DETECTION STARTED ===');
      
      // Check if user has already set their language preference
      const savedLanguage = localStorage.getItem('rhythmNexusLanguage');
      const hasVisitedBefore = localStorage.getItem('rhythmNexusHasVisited');
      
      console.log('Saved Language:', savedLanguage);
      console.log('Has Visited Before:', hasVisitedBefore);
      
      if (savedLanguage && hasVisitedBefore) {
        console.log('✓ Returning visitor - using saved language:', savedLanguage);
        setLanguage(savedLanguage);
        return; // Skip showing modal for returning visitors
      }
      
      console.log('✓ First-time visitor or no saved preferences - proceeding with detection');
      
      const ipResult = await detectLanguageFromIP();
      
      console.log('IP Detection Result:', ipResult);
      
      if (ipResult) {
        console.log(`✓ Country: ${ipResult.countryCode}`);
        console.log(`✓ Is Multi-Lingual: ${ipResult.isMultiLingual}`);
        console.log(`✓ Language Code: ${ipResult.languageCode}`);
        console.log('✓ Language Options:', ipResult.languageOptions);
        
        setDetectedCountry(ipResult.countryCode);
        setLanguage(ipResult.languageCode);
        
        // Countries to exclude from language selection modal (AU, NZ)
        const excludedCountries = ['AU', 'NZ'];
        
        // Show modal for ALL first-time visitors who have language options
        if (ipResult.languageOptions && 
            ipResult.languageOptions.length > 0 &&
            !hasVisitedBefore) {
          console.log('🎉 SHOWING LANGUAGE MODAL - First visit with language options');
          console.log(`   Country: ${ipResult.countryCode}`);
          console.log(`   Available languages: ${ipResult.languageOptions.length}`);
          setLanguageOptions(ipResult.languageOptions);
          setShowLanguageModal(true);
        } else {
          console.log('❌ NOT showing modal. Reasons:');
          console.log('  - Has options:', ipResult.languageOptions?.length > 0);
          console.log('  - First visit:', !hasVisitedBefore);
          // Mark as visited
          localStorage.setItem('rhythmNexusHasVisited', 'true');
          setShowLanguageModal(false);
        }
      } else {
        console.warn('❌ IP detection failed, falling back to browser language');
        const browserLang = detectLanguageFromBrowser();
        setLanguage(browserLang);
        // Mark as visited even if IP detection fails
        localStorage.setItem('rhythmNexusHasVisited', 'true');
        setShowLanguageModal(false);
      }
      
      console.log('=== LANGUAGE DETECTION COMPLETE ===');
    };

    detectInitialLanguage();
  }, [isMounted]);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('rhythmNexusLanguage', language);
    }
  }, [language, isMounted]);

  const handleLanguageSelect = (langCode) => {
    setLanguage(langCode);
    setShowLanguageModal(false);
    // Mark that user has made a choice and visited
    if (isMounted) {
      localStorage.setItem('rhythmNexusHasVisited', 'true');
    }
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

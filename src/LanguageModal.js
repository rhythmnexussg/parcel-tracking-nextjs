'use client';

import React from "react";
import "./App.css";

/**
 * LanguageModal Component
 * 
 * Displays a modal for users to select their preferred language on first visit
 * Shows all available languages or country-specific languages if available
 * 
 * Props:
 * - isOpen: boolean - controls modal visibility
 * - onClose: function - callback when modal is closed
 * - onSelectLanguage: function(languageCode) - callback when language is selected
 * - availableLanguages: array - list of language objects with code, name, and flag (optional)
 * - country: string - detected country code (optional)
 */

// All available languages
const allLanguages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'de', name: 'Deutsch (German)', flag: '🇩🇪' },
  { code: 'fr', name: 'Français (French)', flag: '🇫🇷' },
  { code: 'es', name: 'Español (Spanish)', flag: '🇪🇸' },
  { code: 'ja', name: '日本語 (Japanese)', flag: '🇯🇵' },
  { code: 'zh', name: '简体中文 (Simplified Chinese)', flag: '🇨🇳' },
  { code: 'zh-hant', name: '繁體中文 (Traditional Chinese)', flag: '🇹🇼' },
  { code: 'pt', name: 'Português (Portuguese)', flag: '🇵🇹' },
  { code: 'hi', name: 'हिन्दी (Hindi)', flag: '🇮🇳' },
  { code: 'th', name: 'ไทย (Thai)', flag: '🇹🇭' },
  { code: 'ms', name: 'Bahasa Melayu (Malay)', flag: '🇲🇾' },
  { code: 'nl', name: 'Nederlands (Dutch)', flag: '🇳🇱' },
  { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'cs', name: 'Čeština (Czech)', flag: '🇨🇿' },
  { code: 'it', name: 'Italiano (Italian)', flag: '🇮🇹' },
  { code: 'he', name: 'עברית (Hebrew)', flag: '🇮🇱' },
  { code: 'ga', name: 'Gaeilge (Irish)', flag: '🇮🇪' },
  { code: 'pl', name: 'Polski (Polish)', flag: '🇵🇱' },
  { code: 'ko', name: '한국어 (Korean)', flag: '🇰🇷' },
  { code: 'no', name: 'Norsk (Norwegian)', flag: '🇳🇴' },
  { code: 'sv', name: 'Svenska (Swedish)', flag: '🇸🇪' },
  { code: 'tl', name: 'Tagalog', flag: '🇵🇭' },
  { code: 'vi', name: 'Tiếng Việt (Vietnamese)', flag: '🇻🇳' },
  { code: 'fi', name: 'Suomi (Finnish)', flag: '🇫🇮' },
  { code: 'ru', name: 'Русский (Russian)', flag: '🇷🇺' },
  { code: 'cy', name: 'Cymraeg (Welsh)', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿' },
];

const LanguageModal = ({ isOpen, onClose, onSelectLanguage, availableLanguages, country }) => {
  if (!isOpen) return null;

  // Use provided languages or show all available languages
  const languagesToShow = availableLanguages && availableLanguages.length > 0 
    ? availableLanguages 
    : allLanguages;

  const countryNames = {
    IN: "India",
    HK: "Hong Kong",
    MY: "Malaysia",
    PH: "Philippines",
    SG: "Singapore",
    BN: "Brunei",
    CA: "Canada",
    BE: "Belgium",
    CH: "Switzerland",
    MO: "Macau",
    GB: "United Kingdom",
    US: "United States"
  };

  const handleLanguageSelect = (langCode) => {
    onSelectLanguage(langCode);
    onClose();
  };

  const headerText = country && countryNames[country]
    ? `We detected you're in ${countryNames[country]}. Please select your preferred language:`
    : "Welcome! Please select your preferred language:";

  return (
    <div className="language-modal-overlay" onClick={onClose}>
      <div className="language-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="language-modal-header">
          <h2>Choose Your Language</h2>
          <p className="language-modal-subtitle">
            {headerText}
          </p>
        </div>
        
        <div className="language-modal-body">
          {languagesToShow.map((lang) => (
            <button
              key={lang.code}
              className="language-option-button"
              onClick={() => handleLanguageSelect(lang.code)}
            >
              <span className="language-flag">{lang.flag}</span>
              <span className="language-name">{lang.name}</span>
            </button>
          ))}
        </div>

        <div className="language-modal-footer">
          <button className="language-modal-close" onClick={onClose}>
            I'll choose later
          </button>
        </div>
      </div>
    </div>
  );
};

export default LanguageModal;

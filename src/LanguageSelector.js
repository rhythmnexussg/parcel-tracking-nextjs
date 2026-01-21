'use client';

import React from 'react';
import { useLanguage } from './LanguageContext';
import { languageMap } from './translations';

// English names for alphabetical sorting
const languageEnglishNames = {
  en: 'English',
  de: 'German',
  fr: 'French',
  es: 'Spanish',
  ja: 'Japanese',
  zh: 'Simplified Chinese',
  'zh-hant': 'Traditional Chinese',
  pt: 'Portuguese',
  hi: 'Hindi',
  th: 'Thai',
  ms: 'Malay',
  nl: 'Dutch',
  id: 'Indonesian',
  cs: 'Czech',
  it: 'Italian',
  he: 'Hebrew',
  ga: 'Irish',
  pl: 'Polish',
  ko: 'Korean',
  no: 'Norwegian',
  ru: 'Russian',
  sv: 'Swedish',
  fi: 'Finnish',
  tl: 'Tagalog',
  vi: 'Vietnamese',
  cy: 'Welsh',
};

export const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();

  // Sort languages alphabetically by English name, but keep English first
  const sortedLanguages = Object.entries(languageMap).sort((a, b) => {
    // Always keep English at the top
    if (a[0] === 'en') return -1;
    if (b[0] === 'en') return 1;
    
    const nameA = languageEnglishNames[a[0]] || a[1];
    const nameB = languageEnglishNames[b[0]] || b[1];
    return nameA.localeCompare(nameB);
  });

  return (
    <select 
      value={language} 
      onChange={(e) => setLanguage(e.target.value)}
      className="language-selector"
      title="Select Language"
    >
      {sortedLanguages.map(([code, name]) => (
        <option key={code} value={code}>
          {name}
        </option>
      ))}
    </select>
  );
};

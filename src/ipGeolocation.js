// IP Geolocation Service
// Maps countries to their appropriate language codes

const countryToLanguageMap = {
  // Major markets
  'CN': 'zh',        // China → Simplified Chinese
  'TW': 'zh-hant',   // Taiwan → Traditional Chinese
  'HK': 'zh-hant',   // Hong Kong → Traditional Chinese (default, can choose English)
  'JP': 'ja',        // Japan → Japanese
  'KR': 'ko',        // South Korea → Korean
  'FR': 'fr',        // France → French
  'DE': 'de',        // Germany → German
  'ES': 'es',        // Spain → Spanish
  'PT': 'pt',        // Portugal → Portuguese
  'BR': 'pt',        // Brazil → Portuguese
  'IT': 'it',        // Italy → Italian
  'NL': 'nl',        // Netherlands → Dutch
  'NO': 'no',        // Norway → Norwegian
  'SE': 'sv',        // Sweden → Swedish
  'PL': 'pl',        // Poland → Polish
  'CZ': 'cs',        // Czech Republic → Czech
  'IN': 'en',        // India → English (default, can choose Hindi)
  'TH': 'th',        // Thailand → Thai
  'MY': 'en',        // Malaysia → English (default, can choose Malay or Chinese)
  'ID': 'id',        // Indonesia → Indonesian
  'RU': 'ru',        // Russia → Russian
  'PH': 'en',        // Philippines → English (default, can choose Tagalog)
  'VN': 'vi',        // Vietnam → Vietnamese
  'IE': 'ga',        // Ireland → Irish
  'IL': 'he',        // Israel → Hebrew
  'BN': 'ms',        // Brunei → Malay (default, can choose English)
  'MO': 'zh-hant',   // Macau → Traditional Chinese (default, can choose English/Portuguese)
  'BE': 'fr',        // Belgium → French (default, can choose Dutch/German/English)
  'CH': 'de',        // Switzerland → German (default, can choose French/Italian/English)
  // Default to English for other countries
  'US': 'en',
  'GB': 'en',
  'CA': 'en',
  'AU': 'en',
  'NZ': 'en',
  'SG': 'en',        // Singapore → English (default, can choose Malay or Chinese)
};

// Countries with multiple official languages
const multiLanguageCountries = {
  'AT': [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'de', name: 'Deutsch (German)', flag: '🇦🇹' }
  ],
  'BE': [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'nl', name: 'Nederlands (Dutch)', flag: '🇳🇱' },
    { code: 'fr', name: 'Français (French)', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch (German)', flag: '🇩🇪' }
  ],
  'BN': [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'ms', name: 'Bahasa Melayu (Malay)', flag: '🇧🇳' }
  ],
  'CA': [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'fr', name: 'Français (French)', flag: '🇫🇷' }
  ],
  'CN': [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'zh', name: '简体中文 (Simplified Chinese)', flag: '🇨🇳' }
  ],
  'CZ': [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'cs', name: 'Čeština (Czech)', flag: '🇨🇿' }
  ],
  'FI': [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'fi', name: 'Suomi (Finnish)', flag: '🇫🇮' },
    { code: 'sv', name: 'Svenska (Swedish)', flag: '🇸🇪' }
  ],
  'FR': [
    { code: 'fr', name: 'Français (French)', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇬🇧' }
  ],
  'DE': [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'de', name: 'Deutsch (German)', flag: '🇩🇪' }
  ],
  'HK': [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'zh-hant', name: '繁體中文 (Traditional Chinese)', flag: '🇭🇰' }
  ],
  'IN': [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'hi', name: 'हिन्दी (Hindi)', flag: '🇮🇳' }
  ],
  'ID': [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'id', name: 'Bahasa Indonesia (Indonesian)', flag: '🇮🇩' }
  ],
  'IE': [
    { code: 'ga', name: 'Gaeilge (Irish)', flag: '🇮🇪' },
    { code: 'en', name: 'English', flag: '🇬🇧' }
  ],
  'IL': [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'he', name: 'עברית (Hebrew)', flag: '🇮🇱' }
  ],
  'IT': [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'it', name: 'Italiano (Italian)', flag: '🇮🇹' }
  ],
  'JP': [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'ja', name: '日本語 (Japanese)', flag: '🇯🇵' }
  ],
  'MO': [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'zh-hant', name: '繁體中文 (Traditional Chinese)', flag: '🇲🇴' },
    { code: 'pt', name: 'Português (Portuguese)', flag: '🇵🇹' }
  ],
  'MY': [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'zh', name: '简体中文 (Simplified Chinese)', flag: '🇨🇳' },
    { code: 'ms', name: 'Bahasa Melayu (Malay)', flag: '🇲🇾' }
  ],
  'NL': [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'nl', name: 'Nederlands (Dutch)', flag: '🇳🇱' }
  ],
  'NO': [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'no', name: 'Norsk (Norwegian)', flag: '🇳🇴' }
  ],
  'PH': [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'tl', name: 'Tagalog', flag: '🇵🇭' }
  ],
  'PL': [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'pl', name: 'Polski (Polish)', flag: '🇵🇱' }
  ],
  'PT': [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'pt', name: 'Português (Portuguese)', flag: '🇵🇹' }
  ],
  'KR': [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'ko', name: '한국어 (Korean)', flag: '🇰🇷' }
  ],
  'ES': [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'es', name: 'Español (Spanish)', flag: '🇪🇸' }
  ],
  'SE': [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'sv', name: 'Svenska (Swedish)', flag: '🇸🇪' }
  ],
  'CH': [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'de', name: 'Deutsch (German)', flag: '🇩🇪' },
    { code: 'fr', name: 'Français (French)', flag: '🇫🇷' },
    { code: 'it', name: 'Italiano (Italian)', flag: '🇮🇹' }
  ],
  'TW': [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'zh-hant', name: '繁體中文 (Traditional Chinese)', flag: '🇹🇼' }
  ],
  'TH': [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'th', name: 'ภาษาไทย (Thai)', flag: '🇹🇭' }
  ],
  'GB': [
    { code: 'en', name: 'English', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
    { code: 'cy', name: 'Cymraeg (Welsh)', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿' }
  ],
  'US': [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español (Spanish)', flag: '🇪🇸' },
    { code: 'zh', name: '简体中文 (Simplified Chinese)', flag: '🇨🇳' }
  ],
  'VN': [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'vi', name: 'Tiếng Việt (Vietnamese)', flag: '🇻🇳' }
  ],
  'SG': [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'zh', name: '简体中文 (Simplified Chinese)', flag: '🇨🇳' },
    { code: 'ms', name: 'Bahasa Melayu (Malay)', flag: '🇸🇬' }
  ]
};

/** 
 * Check if a country has multiple language options
 * @param {string} countryCode - ISO country code
 * @returns {boolean}
 */
export function isMultiLanguageCountry(countryCode) {
  return countryCode && multiLanguageCountries.hasOwnProperty(countryCode);
}

/**
 * Get available languages for a multi-language country
 * @param {string} countryCode - ISO country code
 * @returns {Array|null} Array of language options or null
 */
export function getLanguageOptions(countryCode) {
  return multiLanguageCountries[countryCode] || null;
}

/**
 * Detect user's country and language from IP
 * @returns {Promise<Object>} Object with countryCode, languageCode, and isMultiLingual
 */
export async function detectLanguageFromIP() {
  try {
    // Use ipapi.co free service (no API key required, 1000 requests/day)
    const response = await fetch('https://ipapi.co/json/', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.warn('IP geolocation service unavailable, status:', response.status);
      return null;
    }

    const data = await response.json();
    console.log('IP API Response:', data);
    
    const countryCode = data.country_code; // e.g., 'CN', 'FR', 'US'

    if (!countryCode) {
      console.warn('No country code in IP response');
      return null;
    }

    const isMultiLing = isMultiLanguageCountry(countryCode);
    const langOptions = getLanguageOptions(countryCode);
    
    console.log(`Processing country: ${countryCode}`);
    console.log(`Is multi-lingual check: ${isMultiLing}`);
    console.log(`Language options:`, langOptions);

    const result = {
      countryCode: countryCode,
      languageCode: countryToLanguageMap[countryCode] || 'en',
      isMultiLingual: isMultiLing,
      languageOptions: langOptions
    };

    console.log(`Final detection result:`, result);
    return result;
  } catch (error) {
    console.error('Error detecting IP location:', error);
    return null; // Return null on error, will use default language
  }
}

/**
 * Alternative: detect from browser language settings
 * @returns {string} Language code from browser
 */
export function detectLanguageFromBrowser() {
  const browserLang = navigator.language || navigator.userLanguage;
  
  // Extract primary language code (e.g., 'en' from 'en-US')
  const langCode = browserLang.split('-')[0].toLowerCase();
  
  // Map common browser language codes to our supported languages
  const browserLangMap = {
    'zh': browserLang.includes('TW') || browserLang.includes('HK') ? 'zh-hant' : 'zh',
    'ja': 'ja',
    'ko': 'ko',
    'fr': 'fr',
    'de': 'de',
    'es': 'es',
    'pt': 'pt',
    'it': 'it',
    'nl': 'nl',
    'no': 'no',
    'sv': 'sv',
    'pl': 'pl',
    'cs': 'cs',
    'hi': 'hi',
    'th': 'th',
    'ms': 'ms',
    'id': 'id',
    'tl': 'tl',
    'vi': 'vi',
    'ga': 'ga',
    'he': 'he',
  };
  
  return browserLangMap[langCode] || 'en';
}

// List of 35 allowed countries that can access from China (based on track-your-item.js country list)
const allowedCountriesFromChina = [
  'AU', 'AT', 'BE', 'BN', 'CA', 'CN', 'CZ', 'FI', 'FR', 'DE', 'HK', 'IN', 
  'ID', 'IE', 'IL', 'IT', 'JP', 'MO', 'MY', 'NL', 'NZ', 'NO', 'PH', 'PL', 
  'PT', 'KR', 'SG', 'ES', 'SE', 'CH', 'TW', 'TH', 'GB', 'US', 'VN'
];

/**
 * Check if access from China is allowed for the destination country
 * @param {string} destinationCountry - Destination country code
 * @returns {boolean} True if access is allowed
 */
export function isAccessAllowedFromChina(destinationCountry) {
  return allowedCountriesFromChina.includes(destinationCountry);
}

/**
 * Detect potential VPN usage (basic detection)
 * @param {Object} ipData - IP geolocation data
 * @returns {boolean} True if potential VPN detected
 */
export function isPotentialVPN(ipData) {
  // Basic VPN detection indicators
  if (!ipData) return false;
  
  // Check for common VPN/proxy indicators
  const vpnIndicators = [
    ipData.org && ipData.org.toLowerCase().includes('vpn'),
    ipData.org && ipData.org.toLowerCase().includes('proxy'),
    ipData.org && ipData.org.toLowerCase().includes('hosting'),
    ipData.org && ipData.org.toLowerCase().includes('cloud'),
    ipData.region === 'Unknown' || ipData.city === 'Unknown',
    ipData.timezone === null || ipData.timezone === undefined
  ];
  
  // If multiple indicators are present, likely VPN
  const indicators = vpnIndicators.filter(Boolean).length;
  return indicators >= 2;
}

/**
 * Enhanced geolocation detection with access restrictions
 * @returns {Promise<Object>} Enhanced detection result with access control
 */
export async function detectLanguageFromIPWithRestrictions() {
  try {
    // Add timeout to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const response = await fetch('https://ipapi.co/json/', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      signal: controller.signal,
    }).catch((err) => {
      clearTimeout(timeoutId);
      // Handle fetch failures gracefully
      console.warn('IP geolocation fetch failed:', err.message);
      return null;
    });

    clearTimeout(timeoutId);

    if (!response || !response.ok) {
      console.warn('IP geolocation service unavailable');
      return { error: 'service_unavailable' };
    }

    const data = await response.json();
    const countryCode = data.country_code;

    // Check for potential VPN usage
    const isVPN = isPotentialVPN(data);
    
    // Special handling for China access restrictions
    if (countryCode === 'CN' && isVPN) {
      console.warn('VPN detected from China - access blocked');
      return { 
        error: 'vpn_detected',
        message: 'VPN usage detected. Please disable VPN and try again.',
        blocked: true 
      };
    }

    const result = {
      countryCode: countryCode,
      languageCode: countryToLanguageMap[countryCode] || 'en',
      isMultiLingual: isMultiLanguageCountry(countryCode),
      languageOptions: isMultiLanguageCountry(countryCode) ? getLanguageOptions(countryCode) : null,
      isVPNDetected: isVPN,
      accessRestrictions: countryCode === 'CN' ? { allowedDestinations: allowedCountriesFromChina } : null
    };

    console.log(`Enhanced detection - Country: ${countryCode}, Language: ${result.languageCode}, VPN: ${isVPN}`);
    return result;
  } catch (error) {
    console.error('Error in enhanced IP detection:', error);
    return { error: 'detection_failed' };
  }
}

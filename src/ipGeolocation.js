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
  'IT': 'it',        // Italy → Italian
  'NL': 'nl',        // Netherlands → Dutch
  'NO': 'no',        // Norway → Norwegian
  'SE': 'sv',        // Sweden → Swedish
  'PL': 'pl',        // Poland → Polish
  'CZ': 'cs',        // Czech Republic → Czech
  'IN': 'hi',        // India → Hindi
  'TH': 'th',        // Thailand → Thai
  'MY': 'ms',        // Malaysia → Malay
  'ID': 'id',        // Indonesia → Indonesian
  'RU': 'ru',        // Russia → Russian
  'PH': 'tl',        // Philippines → Tagalog/Filipino
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
  'CA': 'fr',
  'AU': 'en',
  'NZ': 'en',
  'SG': 'ms',        // Singapore → Malay
};

// Countries allowed to access the site (shipping destinations)
export const allowedAccessCountries = [
  'AU', 'AT', 'BE', 'BN', 'CA', 'CN', 'CZ', 'FI', 'FR', 'DE', 'HK', 'IN',
  'ID', 'IE', 'IL', 'IT', 'JP', 'MY', 'MO', 'NL', 'NZ', 'NO', 'PH', 'PL',
  'RU',
  'PT', 'SG', 'KR', 'ES', 'SE', 'CH', 'TW', 'TH', 'GB', 'US', 'VN'
];

// Explicitly blocked countries (cannot access website, VPN or non-VPN)
// NOTE: Do not modify allowedAccessCountries above.
export const blockedAccessCountries = [
  'AF', 'AL', 'DZ', 'AS', 'AD', 'AO', 'AI', 'AG', 'AR', 'AM', 'AW', 'AZ',
  'BS', 'BH', 'BD', 'BB', 'BY', 'BZ', 'BJ', 'BM', 'BT', 'BO', 'BA', 'BW',
  'BV', 'BR', 'VG', 'BG', 'BF', 'BI', 'KH', 'CM', 'CV', 'KY', 'CF', 'TD',
  'CL', 'CO', 'KM', 'CG', 'CK', 'CR', 'CI', 'HR', 'CU', 'CW', 'CY', 'KP',
  'CD', 'DK', 'DJ', 'DM', 'DO', 'EC', 'EG', 'SV', 'GQ', 'ER', 'EE', 'SZ',
  'ET', 'FK', 'FO', 'FJ', 'GF', 'PF', 'TF', 'GA', 'GM', 'GE', 'GH', 'GI',
  'GR', 'GL', 'GD', 'GP', 'GU', 'GT', 'GG', 'GN', 'GW', 'GY', 'HT', 'HN',
  'HU', 'IS', 'IR', 'IQ', 'JM', 'JE', 'JO', 'KZ', 'KE', 'KI', 'XK', 'KW',
  'KG', 'LA', 'LV', 'LB', 'LS', 'LR', 'LY', 'LI', 'LT', 'LU', 'MG', 'MW',
  'MV', 'ML', 'MT', 'MP', 'MH', 'MQ', 'MR', 'MU', 'YT', 'MX', 'FM', 'MD',
  'MC', 'MN', 'ME', 'MS', 'MA', 'MZ', 'MM', 'NA', 'NR', 'NP', 'NC', 'NI',
  'NE', 'NG', 'NU', 'NF', 'MK', 'OM', 'PK', 'PW', 'PS', 'PA', 'PG', 'PY',
  'PE', 'PR', 'QA', 'RE', 'RO', 'RW', 'KN', 'LC', 'MF', 'PM', 'VC', 'WS',
  'SM', 'ST', 'SA', 'SN', 'RS', 'SC', 'SL', 'SX', 'SK', 'SI', 'SB', 'SO',
  'ZA', 'SS', 'LK', 'SD', 'SR', 'SJ', 'SY', 'TJ', 'TZ', 'TL', 'TG', 'TK',
  'TO', 'TT', 'TN', 'TR', 'TM', 'TC', 'TV', 'VI', 'UG', 'UA', 'AE', 'UY',
  'UM', 'UZ', 'VU', 'VA', 'VE', 'YE', 'ZM', 'ZW'
];

const countryCodeAliases = {
  UK: 'GB',
};

export function normalizeCountryCode(countryCode) {
  if (!countryCode) return null;
  const normalized = String(countryCode).trim().toUpperCase();
  return countryCodeAliases[normalized] || normalized;
}

export function isAllowedAccessCountry(countryCode) {
  const normalizedCountryCode = normalizeCountryCode(countryCode);
  if (!normalizedCountryCode) return false;
  return allowedAccessCountries.includes(normalizedCountryCode);
}

export function isBlockedAccessCountry(countryCode) {
  const normalizedCountryCode = normalizeCountryCode(countryCode);
  if (!normalizedCountryCode) return false;
  return blockedAccessCountries.includes(normalizedCountryCode);
}

function getAdminCountryOverride() {
  if (typeof window === 'undefined') return null;

  const params = new URLSearchParams(window.location.search);
  const pathname = window.location.pathname || '';
  const pathCountry = pathname.startsWith('/country=')
    ? normalizeCountryCode(pathname.slice('/country='.length).split('/')[0] || null)
    : null;
  const requestedCountry = normalizeCountryCode(
    params.get('country') || params.get('adminCountry') || pathCountry || null
  );
  if (!requestedCountry) return null;
  // Country override is protected by middleware basic auth on the server.
  return requestedCountry;
}

function getCountryNameFromCode(countryCode) {
  const normalizedCountryCode = normalizeCountryCode(countryCode);
  if (!normalizedCountryCode) return 'Unknown country';
  try {
    if (typeof Intl !== 'undefined' && typeof Intl.DisplayNames === 'function') {
      const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
      return regionNames.of(normalizedCountryCode) || normalizedCountryCode;
    }
  } catch (_) {
    // ignore and fallback to code
  }
  return normalizedCountryCode;
}

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
  ],
  'RU': [
    { code: 'ru', name: 'Русский (Russian)', flag: '🇷🇺' },
    { code: 'en', name: 'English', flag: '🇬🇧' }
  ],
  'AU': [
    { code: 'en', name: 'English', flag: '🇦🇺' }
  ],
  'NZ': [
    { code: 'en', name: 'English', flag: '🇳🇿' }
  ]
};

/** 
 * Check if a country has multiple language options
 * @param {string} countryCode - ISO country code
 * @returns {boolean}
 */
export function isMultiLanguageCountry(countryCode) {
  if (!countryCode) {
    console.warn('isMultiLanguageCountry called with no country code');
    return false;
  }
  const result = multiLanguageCountries.hasOwnProperty(countryCode);
  console.log(`isMultiLanguageCountry(${countryCode}): ${result}`);
  return result;
}

/**
 * Get available languages for a multi-language country
 * @param {string} countryCode - ISO country code
 * @returns {Array|null} Array of language options or null
 */
export function getLanguageOptions(countryCode) {
  if (!countryCode) {
    console.warn('getLanguageOptions called with no country code');
    return null;
  }
  const options = multiLanguageCountries[countryCode] || null;
  const englishFirstCountries = new Set(['US', 'CA', 'SG']);
  const normalizedOptions = Array.isArray(options)
    ? (() => {
        if (englishFirstCountries.has(countryCode)) {
          return options;
        }
        const englishOptions = options.filter((option) => option?.code === 'en');
        const nonEnglishOptions = options.filter((option) => option?.code !== 'en');
        return [...nonEnglishOptions, ...englishOptions];
      })()
    : options;
  console.log(`getLanguageOptions(${countryCode}):`, options);
  if (normalizedOptions && Array.isArray(normalizedOptions)) {
    console.log(`  - Found ${normalizedOptions.length} language(s) for ${countryCode}`);
  }
  return normalizedOptions;
}

/**
 * Detect user's country and language from IP with VPN detection
 * @returns {Promise<Object>} Object with countryCode, languageCode, and isMultiLingual
 */
export async function detectLanguageFromIP() {
  // Only run on client side
  if (typeof window === 'undefined') {
    console.log('detectLanguageFromIP called on server, skipping');
    return null;
  }

  // Only run on client side
  if (typeof window === 'undefined') {
    console.log('Server-side execution detected, skipping IP geolocation');
    return null;
  }

  try {
    // Use ipapi.co with HTTPS (required for HTTPS websites to avoid mixed content blocking)
    // Fallback to other services if this fails
    let response;
    let data;
    let detectedCountryCode;
    let usedPrimaryApi = true;

    try {
      // Primary: ipapi.co (HTTPS, free tier: 1000 requests/day)
      response = await fetch('https://ipapi.co/json/', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        data = await response.json();
        detectedCountryCode = data.country_code;
        console.log('✓ Using ipapi.co');
      } else {
        throw new Error('ipapi.co returned ' + response.status);
      }
    } catch (primaryError) {
      console.warn('Primary API (ipapi.co) failed, trying fallback:', primaryError.message);
      
      // Fallback: geolocation-db.com (HTTPS, free, no rate limit)
      try {
        response = await fetch('https://geolocation-db.com/json/', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Fallback API failed');
        }

        data = await response.json();
        detectedCountryCode = data.country_code;
        console.log('✓ Using geolocation-db.com (fallback)');
      } catch (fallbackError) {
        console.error('All geolocation APIs failed');
        const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const fallback = buildFallbackGeoResult({ browserTimezone });
        if (fallback) {
          console.warn('Using timezone-based fallback geolocation:', fallback);
          return fallback;
        }
        return null;
      }
    }

    console.log('=== IP API Full Response ===');
    console.log(JSON.stringify(data, null, 2));
    console.log('===========================');
    
    // Handle both country_code and countryCode formats
    if (!detectedCountryCode && data.countryCode) {
      detectedCountryCode = data.countryCode;
    }
    detectedCountryCode = normalizeCountryCode(detectedCountryCode);

    if (!detectedCountryCode) {
      console.error('CRITICAL: No country_code in IP response!');
      console.log('Response keys:', Object.keys(data));
      const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const fallback = buildFallbackGeoResult({ browserTimezone });
      if (fallback) {
        console.warn('Using timezone-based fallback geolocation:', fallback);
        return fallback;
      }
      return null;
    }
    
    // Detailed logging for debugging Russia detection
    if (detectedCountryCode === 'RU') {
      console.log('🇷🇺 RUSSIA DETECTED! ✓');
      console.log('Available languages for Russia:', getLanguageOptions('RU'));
    }
    
    console.log(`Detected country code from IP: ${detectedCountryCode}`);

    // Get browser timezone and languages for VPN detection
    const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const browserLanguages = navigator.languages || [navigator.language];
    
    // Enhanced VPN detection
    const vpnDetection = isPotentialVPN(data, browserTimezone, browserLanguages);
    
    console.log(`VPN detected: ${vpnDetection.isVPN}`);
    if (vpnDetection.isVPN) {
      console.log(`Potential actual country: ${vpnDetection.actualCountry}`);
    }

    // Special handling: If VPN detected and actual country is China, use China
    // For other countries, use detected IP country (VPN exit node)
    let finalCountryCode = detectedCountryCode;
    if (vpnDetection.isVPN && vpnDetection.actualCountry === 'CN') {
      finalCountryCode = 'CN';
      console.log('VPN detected from China - using China as country');
    }

    const isMultiLing = isMultiLanguageCountry(finalCountryCode);
    const langOptions = getLanguageOptions(finalCountryCode);
    
    console.log(`Processing country: ${finalCountryCode}`);
    console.log(`Is multi-lingual check: ${isMultiLing}`);
    console.log(`Language options:`, langOptions);

    const result = {
      countryCode: finalCountryCode,
      detectedCountryCode: detectedCountryCode,
      languageCode: countryToLanguageMap[finalCountryCode] || 'en',
      isMultiLingual: isMultiLing,
      languageOptions: langOptions,
      isVPNDetected: vpnDetection.isVPN,
      vpnLikelihood: vpnDetection.likelihood,
      estimatedActualCountry: vpnDetection.actualCountry
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
  // Only run on client side
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return 'en'; // Default to English on server
  }

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

function inferCountryCodeFromBrowserTimezone(browserTimezone) {
  if (!browserTimezone) return null;

  const timezoneToCountry = {
    // China
    'Asia/Shanghai': 'CN',
    'Asia/Chongqing': 'CN',
    'Asia/Urumqi': 'CN',
    'Asia/Harbin': 'CN',

    // Taiwan
    'Asia/Taipei': 'TW',

    // Hong Kong / Macau
    'Asia/Hong_Kong': 'HK',
    'Asia/Macau': 'MO',
    'Asia/Macao': 'MO',

    // Singapore
    'Asia/Singapore': 'SG',

  };

  return timezoneToCountry[browserTimezone] || null;
}

function inferCountryCodeFromBrowserLanguages(browserLanguages = []) {
  if (!Array.isArray(browserLanguages) || browserLanguages.length === 0) return null;

  for (const langTag of browserLanguages) {
    if (!langTag || typeof langTag !== 'string') continue;
    const parts = langTag.split(/[-_]/).filter(Boolean);
    for (let i = parts.length - 1; i >= 0; i -= 1) {
      const part = parts[i];
      if (/^[A-Za-z]{2}$/.test(part)) {
        return normalizeCountryCode(part);
      }
    }
  }

  return null;
}

function buildFallbackGeoResult({ browserTimezone, detectedCountryCode = null }) {
  const browserLanguages = (typeof navigator !== 'undefined' && navigator.languages)
    ? navigator.languages
    : (typeof navigator !== 'undefined' ? [navigator.language] : []);
  const inferredCountryCode =
    inferCountryCodeFromBrowserTimezone(browserTimezone) ||
    inferCountryCodeFromBrowserLanguages(browserLanguages);
  if (!inferredCountryCode) return null;

  const languageCode = countryToLanguageMap[inferredCountryCode] || detectLanguageFromBrowser();
  const blocked = !isAllowedAccessCountry(inferredCountryCode);
  const countryName = getCountryNameFromCode(inferredCountryCode);

  return {
    countryCode: inferredCountryCode,
    detectedCountryCode,
    languageCode,
    isMultiLingual: isMultiLanguageCountry(inferredCountryCode),
    languageOptions: isMultiLanguageCountry(inferredCountryCode) ? getLanguageOptions(inferredCountryCode) : null,
    isVPNDetected: false,
    vpnLikelihood: 0,
    vpnIndicators: [],
    estimatedActualCountry: inferredCountryCode,
    browserTimezone,
    browserLanguages,
    accessRestrictions: inferredCountryCode === 'CN' ? { allowedDestinations: allowedCountriesFromChina } : null,
    blocked,
    message: blocked
      ? `Sorry, you are not authorized to access this page. You are located in ${countryName} that currently Rhythm Nexus does not offer any shipping there.`
      : null,
    detectionMethod: 'timezone_fallback',
  };
}

// List of 35 allowed countries that can access from China (based on track-your-item.js country list)
const allowedCountriesFromChina = [
  'AU', 'AT', 'BE', 'BN', 'CA', 'CN', 'CZ', 'FI', 'FR', 'DE', 'HK', 'IN', 
  'ID', 'IE', 'IL', 'IT', 'JP', 'MO', 'MY', 'NL', 'NZ', 'NO', 'PH', 'PL', 
  'PT', 'RU', 'KR', 'SG', 'ES', 'SE', 'CH', 'TW', 'TH', 'GB', 'US', 'VN'
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
 * Detect potential VPN usage with enhanced detection
 * @param {Object} ipData - IP geolocation data
 * @param {string} browserTimezone - Browser timezone
 * @param {Array} browserLanguages - Browser languages
 * @returns {Object} VPN detection result with likelihood and actual country
 */
export function isPotentialVPN(ipData, browserTimezone = null, browserLanguages = []) {
  // Basic VPN detection indicators
  if (!ipData) return { isVPN: false, likelihood: 0, actualCountry: null };
  
  let vpnScore = 0;
  let actualCountry = null;
  const indicators = [];
  
  // 1. Check organization/ISP for VPN keywords (20 points)
  const org = (ipData.org || ipData.isp || '').toLowerCase();
  const vpnKeywords = ['vpn', 'proxy', 'hosting', 'cloud', 'datacenter', 'digital ocean', 
                        'amazon', 'aws', 'azure', 'google cloud', 'cloudflare'];
  if (vpnKeywords.some(keyword => org.includes(keyword))) {
    vpnScore += 20;
    indicators.push('VPN/proxy organization detected');
  }
  
  // 2. Cross-check timezone mismatch (30 points)
  if (browserTimezone && ipData.timezone && browserTimezone !== ipData.timezone) {
    vpnScore += 30;
    indicators.push(`Timezone mismatch: Browser=${browserTimezone}, IP=${ipData.timezone}`);
    
    // Try to guess actual country from browser timezone
    const timezoneToCountry = {
      'Asia/Shanghai': 'CN',
      'Asia/Chongqing': 'CN',
      'Asia/Urumqi': 'CN',
      'Asia/Harbin': 'CN',
      'Asia/Hong_Kong': 'HK',
      'Asia/Taipei': 'TW',
      'Asia/Macau': 'MO',
      'Asia/Macao': 'MO',
      'Asia/Singapore': 'SG',
      'Asia/Tokyo': 'JP',
      'Asia/Seoul': 'KR',
      'Europe/London': 'GB',
      'America/New_York': 'US',
      'America/Los_Angeles': 'US',
    };
    actualCountry = timezoneToCountry[browserTimezone];
  }
  
  // 3. Check browser language vs detected country (25 points)
  if (browserLanguages.length > 0 && (ipData.country_code || ipData.countryCode)) {
    const primaryLang = browserLanguages[0].split('-')[0].toLowerCase();
    const detectedCountry = normalizeCountryCode(ipData.country_code || ipData.countryCode);
    
    // Chinese language but not in Chinese region
    if ((primaryLang === 'zh' || browserLanguages[0].includes('zh-CN')) && 
        !['CN', 'HK', 'TW', 'SG', 'MO'].includes(detectedCountry)) {
      vpnScore += 25;
      indicators.push('Chinese language but non-Chinese region detected');
      actualCountry = actualCountry || 'CN'; // Likely from China
    }
    
    // Japanese language but not in Japan
    if (primaryLang === 'ja' && detectedCountry !== 'JP') {
      vpnScore += 25;
      indicators.push('Japanese language but non-Japan region');
      actualCountry = actualCountry || 'JP';
    }
    
    // Korean language but not in Korea
    if (primaryLang === 'ko' && detectedCountry !== 'KR') {
      vpnScore += 25;
      indicators.push('Korean language but non-Korea region');
      actualCountry = actualCountry || 'KR';
    }

    // Generic locale-region mismatch support for all countries, not just specific examples
    const localeCountryCode = inferCountryCodeFromBrowserLanguages(browserLanguages);
    if (localeCountryCode && detectedCountry && localeCountryCode !== detectedCountry) {
      vpnScore += 25;
      indicators.push(`Browser locale region mismatch: locale=${localeCountryCode}, IP=${detectedCountry}`);
      actualCountry = actualCountry || localeCountryCode;
    }
  }
  
  // 4. Check for ASN in known VPN ranges (15 points)
  if (ipData.asn) {
    const knownVPNASNs = ['AS13335', 'AS14061', 'AS16509', 'AS15169', 'AS8075']; // Cloudflare, DigitalOcean, AWS, Google, Microsoft
    if (knownVPNASNs.some(asn => ipData.asn.includes(asn))) {
      vpnScore += 15;
      indicators.push('Known VPN/cloud ASN detected');
    }
  }
  
  // 5. Unknown region/city (10 points)
  if (ipData.region === 'Unknown' || ipData.city === 'Unknown' || !ipData.city) {
    vpnScore += 10;
    indicators.push('Unknown location details');
  }
  
  const isVPN = vpnScore >= 30; // Threshold for VPN detection
  
  console.log('=== VPN Detection Analysis ===');
  console.log('VPN Score:', vpnScore);
  console.log('Is VPN:', isVPN);
  console.log('Indicators:', indicators);
  console.log('Actual Country (estimated):', actualCountry);
  console.log('============================');
  
  return { 
    isVPN, 
    likelihood: vpnScore,
    actualCountry: actualCountry || ipData.country_code || ipData.countryCode,
    indicators 
  };
}

/**
 * Enhanced geolocation detection with access restrictions and VPN detection
 * @returns {Promise<Object>} Enhanced detection result with access control
 */
export async function detectLanguageFromIPWithRestrictions() {
  // Only run on client side
  if (typeof window === 'undefined') {
    console.log('detectLanguageFromIPWithRestrictions called on server, skipping');
    return null;
  }

  const adminOverrideCountry = getAdminCountryOverride();
  if (adminOverrideCountry) {
    const blocked = !isAllowedAccessCountry(adminOverrideCountry);
    const countryName = getCountryNameFromCode(adminOverrideCountry);
    return {
      countryCode: adminOverrideCountry,
      detectedCountryCode: adminOverrideCountry,
      languageCode: countryToLanguageMap[adminOverrideCountry] || 'en',
      isMultiLingual: isMultiLanguageCountry(adminOverrideCountry),
      languageOptions: isMultiLanguageCountry(adminOverrideCountry) ? getLanguageOptions(adminOverrideCountry) : null,
      isVPNDetected: false,
      vpnLikelihood: 0,
      vpnIndicators: ['Admin country override applied'],
      estimatedActualCountry: adminOverrideCountry,
      ipCountries: [adminOverrideCountry],
      allowedIpCountry: isAllowedAccessCountry(adminOverrideCountry) ? adminOverrideCountry : null,
      signalCountries: [adminOverrideCountry],
      blockedSignalCountry: isBlockedAccessCountry(adminOverrideCountry) ? adminOverrideCountry : null,
      secondaryCountryCode: null,
      countryMismatchDetected: false,
      browserTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      browserLanguages: navigator.languages || [navigator.language],
      localeCountryCode: null,
      accessRestrictions: adminOverrideCountry === 'CN' ? { allowedDestinations: allowedCountriesFromChina } : null,
      blocked,
      message: blocked
        ? `Sorry, you are not authorized to access this page. You are located in ${countryName} that currently Rhythm Nexus does not offer any shipping there.`
        : null,
      detectionMethod: 'admin_override',
    };
  }

  try {
    // Add timeout to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    let response;
    let data;
    let detectedCountryCode;
    let usedPrimaryApi = true;

    // Try primary API with HTTPS
    try {
      response = await fetch('https://ipapi.co/json/', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        signal: controller.signal,
      });

      if (response.ok) {
        data = await response.json();
        detectedCountryCode = data.country_code;
      } else {
        throw new Error('Primary API failed');
      }
    } catch (err) {
      console.warn('Primary API failed, trying fallback:', err.message);
      usedPrimaryApi = false;
      
      // Fallback API
      response = await fetch('https://geolocation-db.com/json/', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        signal: controller.signal,
      }).catch((err) => {
        clearTimeout(timeoutId);
        console.warn('IP geolocation fetch failed:', err.message);
        return null;
      });

      if (!response || !response.ok) {
        clearTimeout(timeoutId);
        console.warn('IP geolocation service unavailable');
        const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const fallback = buildFallbackGeoResult({ browserTimezone });
        if (fallback) {
          console.warn('Using timezone-based fallback geolocation:', fallback);
          return fallback;
        }
        return { error: 'service_unavailable' };
      }

      data = await response.json();
      detectedCountryCode = data.country_code || data.countryCode;
    }

    clearTimeout(timeoutId);

    if (!detectedCountryCode && data.countryCode) {
      detectedCountryCode = data.countryCode;
    }

    // Detailed logging for debugging Russia detection
    if (detectedCountryCode === 'RU') {
      console.log('🇷🇺 RUSSIA DETECTED in detectLanguageFromIPWithRestrictions! ✓');
    }

    // Get browser timezone and languages for enhanced VPN detection
    const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const browserLanguages = navigator.languages || [navigator.language];
    const localeCountryCode = normalizeCountryCode(inferCountryCodeFromBrowserLanguages(browserLanguages) || null);

    // Secondary provider cross-check to reduce false country classification.
    let secondaryCountryCode = null;
    try {
      const secondaryController = new AbortController();
      const secondaryTimeoutId = setTimeout(() => secondaryController.abort(), 3000);
      const secondaryUrl = usedPrimaryApi ? 'https://geolocation-db.com/json/' : 'https://ipapi.co/json/';
      const secondaryResponse = await fetch(secondaryUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        signal: secondaryController.signal,
      });
      clearTimeout(secondaryTimeoutId);

      if (secondaryResponse.ok) {
        const secondaryData = await secondaryResponse.json();
        secondaryCountryCode = normalizeCountryCode(secondaryData.country_code || secondaryData.countryCode || null);
      }
    } catch (secondaryError) {
      console.warn('Secondary geolocation cross-check failed:', secondaryError.message);
    }
    
    // Check for potential VPN usage with enhanced detection
    let vpnDetection = isPotentialVPN(data, browserTimezone, browserLanguages);

    const countryMismatchDetected = Boolean(
      secondaryCountryCode &&
      detectedCountryCode &&
      secondaryCountryCode !== detectedCountryCode
    );

    if (countryMismatchDetected) {
      vpnDetection = {
        ...vpnDetection,
        isVPN: true,
        likelihood: vpnDetection.likelihood + 35,
        indicators: [
          ...(vpnDetection.indicators || []),
          `Country mismatch across providers: primary=${detectedCountryCode}, secondary=${secondaryCountryCode}`,
        ],
      };
    }
    
    console.log('=== Enhanced Detection Results ===');
    console.log('Detected Country (IP):', detectedCountryCode);
    console.log('Browser Timezone:', browserTimezone);
    console.log('Browser Languages:', browserLanguages);
    console.log('VPN Detected:', vpnDetection.isVPN);
    console.log('VPN Likelihood:', vpnDetection.likelihood);
    if (vpnDetection.isVPN) {
      console.log('Estimated Actual Country:', vpnDetection.actualCountry);
    }
    console.log('=================================');
    
    // Access decision is based on shipping country allowlist.
    // Keep non-VPN decisions strictly IP-based so normal users are not affected by VPN heuristics.
    const ipCountries = [detectedCountryCode, secondaryCountryCode].filter(Boolean);
    const allowedIpCountry = ipCountries.find((code) => isAllowedAccessCountry(code)) || null;
    const timezoneCountryCode = normalizeCountryCode(inferCountryCodeFromBrowserTimezone(browserTimezone) || null);
    const signalCountries = [
      detectedCountryCode,
      secondaryCountryCode,
      normalizeCountryCode(vpnDetection.actualCountry || null),
      timezoneCountryCode,
      localeCountryCode,
    ].filter(Boolean);
    const blockedSignalCountry = signalCountries.find((code) => isBlockedAccessCountry(code)) || null;

    let finalCountryCode;
    let blocked;

    if (vpnDetection.isVPN) {
      // VPN policy: use VPN exit country and allow only if it is in the explicit allowlist.
      finalCountryCode = normalizeCountryCode(allowedIpCountry || detectedCountryCode || secondaryCountryCode || null);
      if (!finalCountryCode) {
        finalCountryCode = normalizeCountryCode(detectedCountryCode || secondaryCountryCode || null);
      }
      blocked = !isAllowedAccessCountry(finalCountryCode);
    } else {
      finalCountryCode = normalizeCountryCode(detectedCountryCode || secondaryCountryCode || null);
      if (!finalCountryCode) {
        finalCountryCode = normalizeCountryCode(timezoneCountryCode || localeCountryCode || null);
      }
      blocked = !isAllowedAccessCountry(finalCountryCode);
    }
    
    const languageCode = countryToLanguageMap[finalCountryCode] || 'en';

    const blockedCountryName = getCountryNameFromCode(finalCountryCode || detectedCountryCode || secondaryCountryCode);

    const result = {
      countryCode: finalCountryCode,
      detectedCountryCode: detectedCountryCode,
      languageCode: languageCode,
      isMultiLingual: isMultiLanguageCountry(finalCountryCode),
      languageOptions: isMultiLanguageCountry(finalCountryCode) ? getLanguageOptions(finalCountryCode) : null,
      isVPNDetected: vpnDetection.isVPN,
      vpnLikelihood: vpnDetection.likelihood,
      vpnIndicators: vpnDetection.indicators,
      estimatedActualCountry: vpnDetection.actualCountry,
      ipCountries,
      allowedIpCountry,
      signalCountries,
      blockedSignalCountry,
      secondaryCountryCode,
      countryMismatchDetected,
      browserTimezone: browserTimezone,
      browserLanguages: browserLanguages,
      localeCountryCode,
      accessRestrictions: finalCountryCode === 'CN' ? { allowedDestinations: allowedCountriesFromChina } : null,
      blocked,
      message: blocked
        ? `Sorry, you are not authorized to access this page. You are located in ${blockedCountryName} that currently Rhythm Nexus does not offer any shipping there.`
        : null
    };

    console.log('Final Result:', result);
    return result;
  } catch (error) {
    console.error('Error in enhanced IP detection:', error);
    try {
      const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const fallback = buildFallbackGeoResult({ browserTimezone });
      if (fallback) {
        console.warn('Using timezone-based fallback geolocation:', fallback);
        return fallback;
      }
    } catch (_) {
      // ignore
    }
    return { error: 'detection_failed' };
  }
}

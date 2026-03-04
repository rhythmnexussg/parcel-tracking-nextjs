// IP Geolocation Service
// Maps countries to their appropriate language codes
import { getBlockedCountryDisplayName } from './blockedCountryNames';

const countryToLanguageMap = {
  // Major markets
  'CN': 'zh',        // China → Simplified Chinese
  'TW': 'zh-hant',   // Taiwan → Traditional Chinese
  'HK': 'yue',      // Hong Kong → Cantonese
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
  'IE': 'en',        // Ireland → English
  'IL': 'he',        // Israel → Hebrew
  'BN': 'ms',        // Brunei → Malay (default, can choose English)
  'MO': 'yue',      // Macau → Cantonese (default, can choose English/Portuguese)
  'BE': 'fr',        // Belgium → French (default, can choose Dutch/German/English)
  'CH': 'de',        // Switzerland → German (default, can choose French/Italian/English)
  // Default to English for other countries
  'US': 'en',
  'GB': 'en',
  'CA': 'en',
  'AU': 'en',
  'NZ': 'en',
  'SG': 'en',        // Singapore → English (default, can choose Chinese/Malay/Tamil)
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

const GEO_CACHE_KEY = 'rnx_geo_cache_v1';
const GEO_CACHE_TTL_MS = 10 * 60 * 1000;
let inMemoryGeoCache = null;

function readGeoCache() {
  if (typeof window === 'undefined') return null;

  const now = Date.now();
  if (inMemoryGeoCache && now - inMemoryGeoCache.timestamp < GEO_CACHE_TTL_MS) {
    return inMemoryGeoCache.value;
  }

  try {
    const raw = sessionStorage.getItem(GEO_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    if (!parsed.timestamp || !parsed.value) return null;
    if (now - parsed.timestamp >= GEO_CACHE_TTL_MS) {
      sessionStorage.removeItem(GEO_CACHE_KEY);
      return null;
    }
    inMemoryGeoCache = parsed;
    return parsed.value;
  } catch (_) {
    return null;
  }
}

function writeGeoCache(value) {
  if (typeof window === 'undefined' || !value || typeof value !== 'object') return;
  if (value.error) return;

  const payload = {
    timestamp: Date.now(),
    value,
  };

  inMemoryGeoCache = payload;

  try {
    sessionStorage.setItem(GEO_CACHE_KEY, JSON.stringify(payload));
  } catch (_) {
    // ignore storage errors
  }
}

function clearGeoCache() {
  inMemoryGeoCache = null;
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem(GEO_CACHE_KEY);
  } catch (_) {
    // ignore storage errors
  }
}

function chooseCountryWithSignals(candidates, options = {}) {
  const {
    preferredCountry = null,
    timezoneCountryCode = null,
    localeCountryCode = null,
  } = options;

  const normalizedCandidates = Array.from(
    new Set(
      (Array.isArray(candidates) ? candidates : [])
        .map((code) => normalizeCountryCode(code || null))
        .filter(Boolean)
    )
  );

  if (!normalizedCandidates.length) return null;
  if (normalizedCandidates.length === 1) return normalizedCandidates[0];

  const normalizedPreferred = normalizeCountryCode(preferredCountry || null);
  const normalizedTimezone = normalizeCountryCode(timezoneCountryCode || null);
  const normalizedLocale = normalizeCountryCode(localeCountryCode || null);

  const scored = normalizedCandidates.map((country) => {
    let score = 0;
    if (normalizedTimezone && country === normalizedTimezone) score += 2;
    if (normalizedLocale && country === normalizedLocale) score += 1;
    return { country, score };
  });

  scored.sort((left, right) => right.score - left.score);

  if (scored[0].score > scored[1].score) {
    return scored[0].country;
  }

  if (normalizedPreferred && normalizedCandidates.includes(normalizedPreferred)) {
    return normalizedPreferred;
  }

  return scored[0].country;
}

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
  const blockedCountryName = getBlockedCountryDisplayName(normalizedCountryCode);
  if (blockedCountryName) return blockedCountryName;
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
    { code: 'de', name: 'Deutsch (German)', flag: '🇦🇹' },
    { code: 'en', name: 'English', flag: '🇬🇧' }
  ],
  'BE': [
    { code: 'nl', name: 'Nederlands (Dutch)', flag: '🇳🇱' },
    { code: 'fr', name: 'Français (French)', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch (German)', flag: '🇩🇪' },
    { code: 'en', name: 'English', flag: '🇬🇧' }
  ],
  'BN': [
    { code: 'ms', name: 'Bahasa Melayu (Malay)', flag: '🇧🇳' },
    { code: 'en', name: 'English', flag: '🇬🇧' }
  ],
  'CA': [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'fr', name: 'Français (French)', flag: '🇫🇷' }
  ],
  'CN': [
    { code: 'zh', name: '简体中文 (Simplified Chinese)', flag: '🇨🇳' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
  ],
  'CZ': [
    { code: 'cs', name: 'Čeština (Czech)', flag: '🇨🇿' },
    { code: 'en', name: 'English', flag: '🇬🇧' }
  ],
  'FI': [
    { code: 'fi', name: 'Suomi (Finnish)', flag: '🇫🇮' },
    { code: 'sv', name: 'Svenska (Swedish)', flag: '🇸🇪' },
    { code: 'en', name: 'English', flag: '🇬🇧' }
  ],
  'FR': [
    { code: 'fr', name: 'Français (French)', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇬🇧' }
  ],
  'DE': [
    { code: 'de', name: 'Deutsch (German)', flag: '🇩🇪' },
    { code: 'en', name: 'English', flag: '🇬🇧' }
  ],
  'HK': [
    { code: 'yue', name: '廣東話（Cantonese）', flag: '🇭🇰' },
    { code: 'zh-hant', name: '繁體中文 (Traditional Chinese)', flag: '🇭🇰' },
    { code: 'en', name: 'English', flag: '🇬🇧' }
  ],
  'IN': [
    { code: 'hi', name: 'हिन्दी (Hindi)', flag: '🇮🇳' },
    { code: 'ta', name: 'தமிழ் (Tamil)', flag: '🇮🇳' },
    { code: 'en', name: 'English', flag: '🇬🇧' }
  ],
  'ID': [
    { code: 'id', name: 'Bahasa Indonesia (Indonesian)', flag: '🇮🇩' },
    { code: 'en', name: 'English', flag: '🇬🇧' }
  ],
  'IE': [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'ga', name: 'Gaeilge (Irish)', flag: '🇮🇪' }
  ],
  'IL': [
    { code: 'he', name: 'עברית (Hebrew)', flag: '🇮🇱' },
    { code: 'en', name: 'English', flag: '🇬🇧' }
  ],
  'IT': [
    { code: 'it', name: 'Italiano (Italian)', flag: '🇮🇹' },
    { code: 'en', name: 'English', flag: '🇬🇧' }
  ],
  'JP': [
    { code: 'ja', name: '日本語 (Japanese)', flag: '🇯🇵' },
    { code: 'en', name: 'English', flag: '🇬🇧' }
  ],
  'MO': [
    { code: 'yue', name: '廣東話（Cantonese）', flag: '🇲🇴' },
    { code: 'zh-hant', name: '繁體中文 (Traditional Chinese)', flag: '🇲🇴' },
    { code: 'pt', name: 'Português (Portuguese)', flag: '🇵🇹' },
    { code: 'en', name: 'English', flag: '🇬🇧' }
  ],
  'MY': [
    { code: 'ms', name: 'Bahasa Melayu (Malay)', flag: '🇲🇾' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'zh', name: '简体中文 (Simplified Chinese)', flag: '🇨🇳' },
    { code: 'ta', name: 'தமிழ் (Tamil)', flag: '🇮🇳' }
  ],
  'NL': [
    { code: 'nl', name: 'Nederlands (Dutch)', flag: '🇳🇱' },
    { code: 'en', name: 'English', flag: '🇬🇧' }
  ],
  'NO': [
    { code: 'no', name: 'Norsk (Norwegian)', flag: '🇳🇴' },
    { code: 'en', name: 'English', flag: '🇬🇧' }
  ],
  'PH': [
    { code: 'tl', name: 'Tagalog', flag: '🇵🇭' },
    { code: 'en', name: 'English', flag: '🇬🇧' }
  ],
  'PL': [
    { code: 'pl', name: 'Polski (Polish)', flag: '🇵🇱' },
    { code: 'en', name: 'English', flag: '🇬🇧' }
  ],
  'PT': [
    { code: 'pt', name: 'Português (Portuguese)', flag: '🇵🇹' },
    { code: 'en', name: 'English', flag: '🇬🇧' }
  ],
  'KR': [
    { code: 'ko', name: '한국어 (Korean)', flag: '🇰🇷' },
    { code: 'en', name: 'English', flag: '🇬🇧' }
  ],
  'ES': [
    { code: 'es', name: 'Español (Spanish)', flag: '🇪🇸' },
    { code: 'en', name: 'English', flag: '🇬🇧' }
  ],
  'SE': [
    { code: 'sv', name: 'Svenska (Swedish)', flag: '🇸🇪' },
    { code: 'en', name: 'English', flag: '🇬🇧' }
  ],
  'CH': [
        { code: 'de', name: 'Deutsch (German)', flag: '🇩🇪' },
    { code: 'fr', name: 'Français (French)', flag: '🇫🇷' },
    { code: 'it', name: 'Italiano (Italian)', flag: '🇮🇹' },
    { code: 'en', name: 'English', flag: '🇬🇧' }
  ],
  'TW': [
    { code: 'zh-hant', name: '繁體中文 (Traditional Chinese)', flag: '🇹🇼' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
  ],
  'TH': [
    { code: 'th', name: 'ภาษาไทย (Thai)', flag: '🇹🇭' },
    { code: 'en', name: 'English', flag: '🇬🇧' }
  ],
  'GB': [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'cy', name: 'Cymraeg (Welsh)', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿' }
  ],
  'US': [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español (Spanish)', flag: '🇪🇸' },
    { code: 'zh', name: '简体中文 (Simplified Chinese)', flag: '🇨🇳' }
  ],
  'VN': [
    { code: 'vi', name: 'Tiếng Việt (Vietnamese)', flag: '🇻🇳' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
  ],
  'SG': [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'zh', name: '简体中文 (Simplified Chinese)', flag: '🇨🇳' },
    { code: 'ms', name: 'Bahasa Melayu (Malay)', flag: '🇸🇬' },
    { code: 'ta', name: 'தமிழ் (Tamil)', flag: '🇮🇳' }
  ],
  'RU': [
    { code: 'ru', name: 'Русский (Russian)', flag: '🇷🇺' },
    { code: 'en', name: 'English', flag: '🇬🇧' }
  ],
  'AU': [
    { code: 'en', name: 'English', flag: '🇦🇺' }
  ],
  'NZ': [
    { code: 'en', name: 'English', flag: '🇳🇿' },
    { code: 'mi', name: 'Māori', flag: '🇳🇿' }
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
  const nativeFirstLanguageByCountry = {
    SG: 'en',
    GB: 'en',
    US: 'en',
    AU: 'en',
    NZ: 'en',
    MY: 'ms',
    BN: 'ms',
    ID: 'id',
  };

  const preferredLanguageCode =
    nativeFirstLanguageByCountry[countryCode] ||
    countryToLanguageMap[countryCode] ||
    'en';

  const normalizedOptions = Array.isArray(options)
    ? (() => {
        const preferredOptions = options.filter((option) => option?.code === preferredLanguageCode);
        const remainingOptions = options.filter((option) => option?.code !== preferredLanguageCode);
        return [...preferredOptions, ...remainingOptions];
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
    detectedCountryCode = normalizeCountryCode(detectedCountryCode || null);
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
    // Keep country decision based on IP/provider country only.
    let finalCountryCode = detectedCountryCode;

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
    'zh': browserLang.includes('TW') ? 'zh-hant' : browserLang.includes('HK') ? 'yue' : 'zh',
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
    // ── China ──────────────────────────────────────────────
    'Asia/Shanghai': 'CN',
    'Asia/Chongqing': 'CN',
    'Asia/Urumqi': 'CN',
    'Asia/Harbin': 'CN',

    // ── Taiwan ─────────────────────────────────────────────
    'Asia/Taipei': 'TW',

    // ── Hong Kong / Macau ──────────────────────────────────
    'Asia/Hong_Kong': 'HK',
    'Asia/Macau': 'MO',
    'Asia/Macao': 'MO',

    // ── Singapore ──────────────────────────────────────────
    'Asia/Singapore': 'SG',

    // ── Japan ──────────────────────────────────────────────
    'Asia/Tokyo': 'JP',

    // ── South Korea ────────────────────────────────────────
    'Asia/Seoul': 'KR',

    // ── Thailand ───────────────────────────────────────────
    'Asia/Bangkok': 'TH',

    // ── Malaysia ───────────────────────────────────────────
    'Asia/Kuala_Lumpur': 'MY',
    'Asia/Kuching': 'MY',

    // ── Indonesia ──────────────────────────────────────────
    'Asia/Jakarta': 'ID',
    'Asia/Makassar': 'ID',
    'Asia/Pontianak': 'ID',
    'Asia/Jayapura': 'ID',

    // ── Philippines ────────────────────────────────────────
    'Asia/Manila': 'PH',

    // ── Vietnam ────────────────────────────────────────────
    'Asia/Ho_Chi_Minh': 'VN',
    'Asia/Saigon': 'VN',

    // ── India ──────────────────────────────────────────────
    'Asia/Kolkata': 'IN',
    'Asia/Calcutta': 'IN',

    // ── Brunei ─────────────────────────────────────────────
    'Asia/Brunei': 'BN',

    // ── Israel ─────────────────────────────────────────────
    'Asia/Jerusalem': 'IL',
    'Asia/Tel_Aviv': 'IL',

    // ── Australia ──────────────────────────────────────────
    'Australia/Sydney': 'AU',
    'Australia/Melbourne': 'AU',
    'Australia/Brisbane': 'AU',
    'Australia/Adelaide': 'AU',
    'Australia/Darwin': 'AU',
    'Australia/Perth': 'AU',
    'Australia/Hobart': 'AU',
    'Australia/Canberra': 'AU',
    'Australia/Currie': 'AU',
    'Australia/Lord_Howe': 'AU',
    'Australia/Lindeman': 'AU',
    'Australia/Broken_Hill': 'AU',
    'Australian/ACT': 'AU',

    // ── New Zealand ────────────────────────────────────────
    'Pacific/Auckland': 'NZ',
    'Pacific/Chatham': 'NZ',

    // ── United States ──────────────────────────────────────
    'America/New_York': 'US',
    'America/Chicago': 'US',
    'America/Denver': 'US',
    'America/Los_Angeles': 'US',
    'America/Phoenix': 'US',
    'America/Anchorage': 'US',
    'America/Adak': 'US',
    'America/Boise': 'US',
    'America/Detroit': 'US',
    'America/Indiana/Indianapolis': 'US',
    'America/Indiana/Knox': 'US',
    'America/Indiana/Marengo': 'US',
    'America/Indiana/Petersburg': 'US',
    'America/Indiana/Tell_City': 'US',
    'America/Indiana/Vevay': 'US',
    'America/Indiana/Vincennes': 'US',
    'America/Indiana/Winamac': 'US',
    'America/Kentucky/Louisville': 'US',
    'America/Kentucky/Monticello': 'US',
    'America/Menominee': 'US',
    'America/North_Dakota/Beulah': 'US',
    'America/North_Dakota/Center': 'US',
    'America/North_Dakota/New_Salem': 'US',
    'Pacific/Honolulu': 'US',
    'Pacific/Johnston': 'US',
    'America/Nome': 'US',
    'America/Sitka': 'US',
    'America/Yakutat': 'US',
    'America/Juneau': 'US',
    'America/Metlakatla': 'US',

    // ── Canada ─────────────────────────────────────────────
    'America/Toronto': 'CA',
    'America/Vancouver': 'CA',
    'America/Edmonton': 'CA',
    'America/Winnipeg': 'CA',
    'America/Halifax': 'CA',
    'America/St_Johns': 'CA',
    'America/Regina': 'CA',
    'America/Glace_Bay': 'CA',
    'America/Goose_Bay': 'CA',
    'America/Moncton': 'CA',
    'America/Whitehorse': 'CA',
    'America/Dawson': 'CA',
    'America/Creston': 'CA',
    'America/Dawson_Creek': 'CA',
    'America/Fort_Nelson': 'CA',
    'America/Cambridge_Bay': 'CA',
    'America/Inuvik': 'CA',
    'America/Yellowknife': 'CA',
    'America/Rankin_Inlet': 'CA',
    'America/Resolute': 'CA',
    'America/Iqaluit': 'CA',
    'America/Pangnirtung': 'CA',
    'America/Nipigon': 'CA',
    'America/Rainy_River': 'CA',
    'America/Thunder_Bay': 'CA',
    'America/Atikokan': 'CA',
    'America/Swift_Current': 'CA',
    'America/Blanc-Sablon': 'CA',

    // ── United Kingdom ─────────────────────────────────────
    'Europe/London': 'GB',

    // ── Ireland ────────────────────────────────────────────
    'Europe/Dublin': 'IE',

    // ── France ─────────────────────────────────────────────
    'Europe/Paris': 'FR',

    // ── Germany ────────────────────────────────────────────
    'Europe/Berlin': 'DE',
    'Europe/Busingen': 'DE',

    // ── Austria ────────────────────────────────────────────
    'Europe/Vienna': 'AT',

    // ── Belgium ────────────────────────────────────────────
    'Europe/Brussels': 'BE',

    // ── Netherlands ────────────────────────────────────────
    'Europe/Amsterdam': 'NL',

    // ── Switzerland ────────────────────────────────────────
    'Europe/Zurich': 'CH',

    // ── Italy ──────────────────────────────────────────────
    'Europe/Rome': 'IT',

    // ── Spain ──────────────────────────────────────────────
    'Europe/Madrid': 'ES',
    'Atlantic/Canary': 'ES',
    'Africa/Ceuta': 'ES',

    // ── Portugal ───────────────────────────────────────────
    'Europe/Lisbon': 'PT',
    'Atlantic/Madeira': 'PT',
    'Atlantic/Azores': 'PT',

    // ── Sweden ─────────────────────────────────────────────
    'Europe/Stockholm': 'SE',

    // ── Norway ─────────────────────────────────────────────
    'Europe/Oslo': 'NO',

    // ── Finland ────────────────────────────────────────────
    'Europe/Helsinki': 'FI',

    // ── Poland ─────────────────────────────────────────────
    'Europe/Warsaw': 'PL',

    // ── Czech Republic ─────────────────────────────────────
    'Europe/Prague': 'CZ',

    // ── Russia (major zones) ───────────────────────────────
    'Europe/Moscow': 'RU',
    'Europe/Kaliningrad': 'RU',
    'Europe/Samara': 'RU',
    'Europe/Volgograd': 'RU',
    'Europe/Saratov': 'RU',
    'Europe/Ulyanovsk': 'RU',
    'Asia/Yekaterinburg': 'RU',
    'Asia/Omsk': 'RU',
    'Asia/Novosibirsk': 'RU',
    'Asia/Barnaul': 'RU',
    'Asia/Tomsk': 'RU',
    'Asia/Novokuznetsk': 'RU',
    'Asia/Krasnoyarsk': 'RU',
    'Asia/Irkutsk': 'RU',
    'Asia/Chita': 'RU',
    'Asia/Yakutsk': 'RU',
    'Asia/Khandyga': 'RU',
    'Asia/Vladivostok': 'RU',
    'Asia/Ust-Nera': 'RU',
    'Asia/Magadan': 'RU',
    'Asia/Sakhalin': 'RU',
    'Asia/Srednekolymsk': 'RU',
    'Asia/Kamchatka': 'RU',
    'Asia/Anadyr': 'RU',
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
 * @returns {Object} VPN detection result with likelihood
 */
export function isPotentialVPN(ipData, browserTimezone = null, browserLanguages = []) {
  // Basic VPN detection indicators
  if (!ipData) return { isVPN: false, likelihood: 0, actualCountry: null };
  
  let vpnScore = 0;
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
    }
    
    // Japanese language but not in Japan
    if (primaryLang === 'ja' && detectedCountry !== 'JP') {
      vpnScore += 25;
      indicators.push('Japanese language but non-Japan region');
    }
    
    // Korean language but not in Korea
    if (primaryLang === 'ko' && detectedCountry !== 'KR') {
      vpnScore += 25;
      indicators.push('Korean language but non-Korea region');
    }

    // Generic locale-region mismatch support for all countries, not just specific examples
    const localeCountryCode = inferCountryCodeFromBrowserLanguages(browserLanguages);
    if (localeCountryCode && detectedCountry && localeCountryCode !== detectedCountry) {
      vpnScore += 25;
      indicators.push(`Browser locale region mismatch: locale=${localeCountryCode}, IP=${detectedCountry}`);
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
  console.log('============================');
  
  return { 
    isVPN, 
    likelihood: vpnScore,
    actualCountry: null,
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

  const cachedResult = readGeoCache();
  if (cachedResult) {
    return cachedResult;
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

    // ── Mobile Roaming Detection ──────────────────────────────────────────
    // When a user is physically abroad on mobile data roaming, their IP is
    // often still routed through the home carrier's network (e.g. Singtel SG,
    // Starhub SG, M1 SG, NTT JP, SK Telecom KR …), so the IP says "home"
    // while the browser timezone reflects the real physical location.
    // In this case we trust the timezone over the IP for country selection.
    const timezoneCountryCodeForRoaming = normalizeCountryCode(
      inferCountryCodeFromBrowserTimezone(browserTimezone) || null
    );
    const isMobileCarrierOrg = (() => {
      const org = (data.org || data.isp || '').toLowerCase();
      const mobileKeywords = [
        'mobile', 'cellular', 'telecom', 'telekom', 'telecommunication',
        'singtel', 'starhub', 'm1 limited', 'optus', 'telstra', 'vodafone',
        'at&t', 'verizon', 't-mobile', 'sprint', 'ntt', 'docomo', 'kddi',
        'softbank', 'sk telecom', 'kt corp', 'lg uplus', 'chunghwa',
        'celcom', 'digi', 'maxis', 'globe telecom', 'smart communications',
        'true move', 'ais ', 'dtac', 'viettel', 'mobifone', 'vinaphone',
        'airtel', 'reliance jio', 'bsnl', 'idea cellular', 'vi mobile',
        'telkomsel', 'indosat', 'xl axiata', 'three ', '3 uk', 'o2',
        'ee limited', 'bt group', 'orange', 'sfr', 'bouygues',
        'deutsche telekom', 'telefonica', 'telenor', 'telia', 'mts '
      ];
      return mobileKeywords.some((kw) => org.includes(kw));
    })();
    const isLikelyMobileRoaming = Boolean(
      timezoneCountryCodeForRoaming &&
      detectedCountryCode &&
      timezoneCountryCodeForRoaming !== detectedCountryCode &&
      isAllowedAccessCountry(timezoneCountryCodeForRoaming) &&
      // Only override if the IP country looks like a home mobile carrier,
      // or if the timezone country is allowed and the IP country is the same as
      // the timezone region origin (typical roaming scenario).
      (isMobileCarrierOrg || !vpnDetection.isVPN)
    );
    if (isLikelyMobileRoaming) {
      console.log(
        `📱 Mobile roaming detected: IP says ${detectedCountryCode}, timezone says ${timezoneCountryCodeForRoaming}. Preferring timezone country.`
      );
    }
    // ─────────────────────────────────────────────────────────────────────
    
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
    const ipCountries = [detectedCountryCode, secondaryCountryCode]
      .map((code) => normalizeCountryCode(code || null))
      .filter(Boolean);
    const timezoneCountryCode = normalizeCountryCode(inferCountryCodeFromBrowserTimezone(browserTimezone) || null);
    const mismatchPreferredCountry = countryMismatchDetected ? secondaryCountryCode : detectedCountryCode;
    const allowedIpCountries = ipCountries.filter((code) => isAllowedAccessCountry(code));
    const allowedIpCountry = chooseCountryWithSignals(allowedIpCountries, {
      preferredCountry: mismatchPreferredCountry,
      timezoneCountryCode,
      localeCountryCode,
    });
    const signalCountries = [
      detectedCountryCode,
      secondaryCountryCode,
      timezoneCountryCode,
      localeCountryCode,
    ].filter(Boolean);
    const blockedSignalCountry = signalCountries.find((code) => isBlockedAccessCountry(code)) || null;

    let finalCountryCode;
    let blocked;

    if (isLikelyMobileRoaming) {
      // Physical location (timezone) takes priority over home-carrier IP for roamers.
      finalCountryCode = timezoneCountryCodeForRoaming;
      blocked = !isAllowedAccessCountry(finalCountryCode);
    } else if (vpnDetection.isVPN) {
      // VPN policy: use VPN exit country and allow only if it is in the explicit allowlist.
      finalCountryCode = normalizeCountryCode(allowedIpCountry || null);
      if (!finalCountryCode) {
        finalCountryCode = chooseCountryWithSignals(ipCountries, {
          preferredCountry: mismatchPreferredCountry,
          timezoneCountryCode,
          localeCountryCode,
        });
      }
      blocked = !isAllowedAccessCountry(finalCountryCode);
    } else {
      finalCountryCode = chooseCountryWithSignals(ipCountries, {
        preferredCountry: mismatchPreferredCountry,
        timezoneCountryCode,
        localeCountryCode,
      });
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
      isMobileRoaming: isLikelyMobileRoaming,
      roamingPhysicalCountry: isLikelyMobileRoaming ? timezoneCountryCodeForRoaming : null,
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
    const shouldCacheResult = !(result.isVPNDetected || result.countryMismatchDetected || result.isMobileRoaming);
    if (shouldCacheResult) {
      writeGeoCache(result);
    } else {
      clearGeoCache();
    }
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

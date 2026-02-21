/**
 * Spam Detection and Email Validation Utilities
 */

// List of blocked email domains (private relays and disposable emails)
const BLOCKED_EMAIL_DOMAINS = [
  'privaterelay.appleid.com',
  'icloud.com.relay', // Apple private relay variations
  'guerrillamail.com',
  'temp-mail.org',
  'throwaway.email',
  '10minutemail.com',
  'mailinator.com',
  'trashmail.com',
  'tempmail.com',
  'yopmail.com',
  'maildrop.cc',
  'getnada.com'
];

// Allowed email providers (major legitimate providers)
const ALLOWED_EMAIL_PROVIDERS = [
  'gmail.com', 'googlemail.com',
  'outlook.com', 'hotmail.com', 'live.com', 'msn.com',
  'yahoo.com', 'yahoo.co.uk', 'yahoo.fr', 'yahoo.de', 'yahoo.it', 'yahoo.es',
  'icloud.com', // Regular iCloud, not private relay
  'protonmail.com', 'proton.me',
  'aol.com',
  'zoho.com',
  'mail.com',
  'gmx.com', 'gmx.net',
  'yandex.com', 'yandex.ru',
  'tutanota.com',
  'fastmail.com',
  'me.com', 'mac.com', // Apple emails (not private relay)
  'qq.com', '163.com', '126.com', 'sina.com', // Chinese providers
  'naver.com', 'daum.net', // Korean providers
  'mail.ru',
  'web.de',
  'orange.fr',
  'free.fr',
  't-online.de',
  'btinternet.com',
  'sky.com',
  'virgin.net',
  'talktalk.net'
];

// Spam/scam keywords - content that typically indicates spam
const SPAM_KEYWORDS = [
  // SEO and website spam
  'seo service', 'search engine optimization', 'improve your ranking',
  'top google ranking', 'rank higher', 'website optimization',
  'increase traffic', 'website design service', 'web design service',
  'redesign your website', 'website redesign', 'web development service',
  'improve your website', 'website improvement', 'digital marketing service',
  'social media marketing', 'guaranteed first page', 'guarantee first page',
  'backlinks', 'link building', 'guest post', 'increase visibility',
  
  // Loan and finance spam
  'loan offer', 'personal loan', 'business loan', 'quick loan',
  'instant loan', 'easy loan', 'loan approval', 'get a loan',
  'credit card offer', 'debt relief', 'refinance', 'mortgage offer',
  'payday loan', 'cash advance', 'financial assistance',
  
  // General e-commerce scams
  'make money online', 'work from home opportunity', 'business opportunity',
  'investment opportunity', 'guaranteed income', 'passive income',
  'dropshipping opportunity', 'become a millionaire', 'get rich quick',
  
  // Other common spam
  'increase sales', 'boost your sales', 'grow your business',
  'we can help you', 'we noticed your website', 'we found your website',
  'we are a company', 'we specialize in', 'we offer services',
  'check out our services', 'visit our website for', 'reply to this email',
  'limited time offer', 'act now', 'special promotion',
  'crypto', 'cryptocurrency', 'bitcoin', 'forex trading',
  'adult content', 'casino', 'gambling',
  
  // Suspicious patterns
  'guarantee', 'guaranteed results', '100% guaranteed',
  'no obligation', 'risk free', 'risk-free', 'free consultation',
  'click here', 'click below', 'unsubscribe',
  
  // Suspicious business patterns
  'outsource', 'offshore', 'cheap labor', 'virtual assistant',
  'lead generation', 'email list', 'bulk email', 'mass email'
];

const SUPPORTED_FORM_LANGUAGES = new Set([
  'en', 'de', 'fr', 'es', 'ja', 'zh', 'zh-hant', 'pt', 'hi', 'th',
  'ms', 'nl', 'id', 'cs', 'it', 'he', 'ga', 'pl', 'ko', 'no',
  'ru', 'sv', 'fi', 'tl', 'vi', 'cy', 'ta', 'mi'
]);

function normalizeLanguageCode(language) {
  const code = (language || 'en').toLowerCase();
  if (code === 'zh-cn' || code === 'zh-hans') return 'zh';
  if (code === 'zh-tw' || code === 'zh-hk' || code === 'zh-hant') return 'zh-hant';
  return code;
}

function normalizeDetectedLanguageCode(language) {
  const code = (language || '').toLowerCase();
  if (!code) return '';

  if (code.startsWith('zh')) {
    if (code.includes('hant') || code.includes('tw') || code.includes('hk')) {
      return 'zh-hant';
    }
    return 'zh';
  }

  if (code === 'fil') return 'tl';
  if (code === 'iw') return 'he';
  if (code === 'nb' || code === 'nn') return 'no';

  return code.split('-')[0];
}

function containsCommonEnglishWords(text) {
  if (!text || typeof text !== 'string') return false;

  const sanitized = text
    .replace(/https?:\/\/\S+/gi, ' ')
    .replace(/\bwww\.\S+/gi, ' ')
    .replace(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi, ' ')
    .replace(/\b[A-Z]{2,}\d+[A-Z0-9-]*\b/g, ' ')
    .toLowerCase();

  const englishWordPattern = /\b(the|and|is|are|you|your|please|help|thanks|thank|order|shipping|delivery|package|parcel|my|i|we|can|could|would|need|want|for|with|from|this|that|to|in|on|of|how|what|when|where|why)\b/g;
  return englishWordPattern.test(sanitized);
}

function doesMessageLanguageMatchSelection(selectedLanguage, detectedLanguage) {
  const selected = normalizeLanguageCode(selectedLanguage || 'en');
  const detected = normalizeDetectedLanguageCode(detectedLanguage || selected);

  return selected === detected;
}

async function translateToEnglish(text) {
  if (!text || !text.trim()) {
    return { translatedText: '', detectedLanguage: '' };
  }

  const endpoint = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(text)}`;
  const response = await fetch(endpoint, { cache: 'no-store' });

  if (!response.ok) {
    throw new Error(`Translation request failed with status ${response.status}`);
  }

  const payload = await response.json();
  if (!Array.isArray(payload) || !Array.isArray(payload[0])) {
    return { translatedText: text, detectedLanguage: '' };
  }

  return {
    translatedText: payload[0].map(part => part?.[0] || '').join('') || text,
    detectedLanguage: normalizeDetectedLanguageCode(payload[2] || '')
  };
}

/**
 * Validates email address format and domain
 * @param {string} email - Email address to validate
 * @returns {Object} - { valid: boolean, reason: string }
 */
export function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return { valid: false, reason: 'Email is required' };
  }

  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, reason: 'Invalid email format' };
  }

  // Extract domain
  const domain = email.toLowerCase().split('@')[1];

  // Check for blocked domains (private relay, etc.)
  if (BLOCKED_EMAIL_DOMAINS.some(blocked => domain.includes(blocked))) {
    return { 
      valid: false, 
      reason: 'Private relay and disposable email addresses are not accepted. Please use a valid email address from a recognized provider (Gmail, Outlook, Yahoo, etc.)' 
    };
  }

  // Check if domain is from allowed providers
  const isAllowed = ALLOWED_EMAIL_PROVIDERS.some(provider => 
    domain === provider || domain.endsWith('.' + provider)
  );

  if (!isAllowed) {
    // Allow some flexibility for corporate/custom domains
    // Check if it looks like a legitimate domain (has proper TLD)
    const validTLD = /\.(com|net|org|edu|gov|co\.uk|co|io|me|us|ca|au|de|fr|it|es|nl|be|ch|at|se|no|dk|fi|jp|cn|kr|sg|my|th|vn|in|br|mx|ar|cl|za|nz|ie|pt|pl|cz|gr|ru|ua|il|ae|sa|hk|tw)$/i;
    
    if (!validTLD.test(domain)) {
      return { 
        valid: false, 
        reason: 'Please use an email from a recognized provider (Gmail, Outlook, Yahoo, etc.) or a legitimate custom domain' 
      };
    }
    
    // Allow it but flag for review
    console.log(`Email from non-standard domain accepted: ${domain}`);
  }

  return { valid: true, reason: '' };
}

/**
 * Detects spam/scam content in message
 * @param {string} message - Message text to check
 * @param {string} name - Name field to check
 * @param {string} email - Email to check
 * @returns {Object} - { isSpam: boolean, reason: string, confidence: string }
 */
export function detectSpam(message, name = '', email = '') {
  if (!message && !name && !email) {
    return { isSpam: false, reason: '', confidence: 'low' };
  }

  const combinedText = `${name} ${email} ${message}`.toLowerCase();
  
  // Check for spam keywords
  const foundKeywords = SPAM_KEYWORDS.filter(keyword => 
    combinedText.includes(keyword.toLowerCase())
  );

  if (foundKeywords.length > 0) {
    const confidence = foundKeywords.length > 2 ? 'high' : foundKeywords.length > 1 ? 'medium' : 'low';
    return {
      isSpam: true,
      reason: `Detected spam keywords: ${foundKeywords.slice(0, 3).join(', ')}`,
      confidence,
      keywords: foundKeywords
    };
  }

  // Check for suspicious patterns
  const suspiciousPatterns = [
    /https?:\/\//gi, // Multiple URLs
    /\b(call|text|whatsapp|telegram)\s+(me|us)?\s*:?\s*\+?\d{10,}/gi, // Phone numbers
    /click\s+here/gi,
    /\b(www\.)[a-z0-9-]+\.[a-z]{2,}/gi, // URLs without http
  ];

  let suspiciousMatches = 0;
  for (const pattern of suspiciousPatterns) {
    const matches = combinedText.match(pattern);
    if (matches) {
      suspiciousMatches += matches.length;
    }
  }

  if (suspiciousMatches >= 3) {
    return {
      isSpam: true,
      reason: 'Message contains suspicious patterns (multiple URLs/phone numbers)',
      confidence: 'medium'
    };
  }

  // Check for all caps (common in spam)
  if (message.length > 50) {
    const capsRatio = (message.match(/[A-Z]/g) || []).length / message.length;
    if (capsRatio > 0.5) {
      return {
        isSpam: true,
        reason: 'Excessive use of capital letters',
        confidence: 'low'
      };
    }
  }

  return { isSpam: false, reason: '', confidence: 'low' };
}

/**
 * Complete validation for contact form submission
 * @param {Object} data - Form data
 * @returns {Object} - { valid: boolean, error: string, translatedMessage?: string, sourceLanguage?: string }
 */
export async function validateContactSubmission(data) {
  const { name, email, message, enquiryType, language } = data;
  const normalizedRequestedLanguage = normalizeLanguageCode(language || 'en');
  const sourceLanguage = SUPPORTED_FORM_LANGUAGES.has(normalizedRequestedLanguage)
    ? normalizedRequestedLanguage
    : 'en';

  // Validate email
  const emailValidation = validateEmail(email);
  if (!emailValidation.valid) {
    return { valid: false, error: emailValidation.reason };
  }

  // Check for spam if message exists
  if (message) {
    let translatedMessage = message;
    let detectedMessageLanguage = sourceLanguage;

    try {
      const translationResult = await translateToEnglish(message);
      translatedMessage = translationResult.translatedText || message;
      detectedMessageLanguage = translationResult.detectedLanguage || sourceLanguage;
    } catch (translationError) {
      console.error('Language verification failed:', translationError);
      return {
        valid: false,
        error: 'Unable to verify message language right now. Please try again shortly.'
      };
    }

    if (!doesMessageLanguageMatchSelection(sourceLanguage, detectedMessageLanguage)) {
      return {
        valid: false,
        error: 'Please write your message only in the language you selected in the form.'
      };
    }

    if (sourceLanguage !== 'en' && containsCommonEnglishWords(message)) {
      return {
        valid: false,
        error: 'Please avoid English words when a non-English language is selected.'
      };
    }

    const spamCheckOriginal = detectSpam(message, name, email);
    const spamCheckTranslated = translatedMessage !== message
      ? detectSpam(translatedMessage, name, email)
      : { isSpam: false, confidence: 'low' };

    const isSpam =
      (spamCheckOriginal.isSpam && spamCheckOriginal.confidence !== 'low') ||
      (spamCheckTranslated.isSpam && spamCheckTranslated.confidence !== 'low');

    if (isSpam) {
      console.log('Spam detected:', {
        original: spamCheckOriginal,
        translated: spamCheckTranslated
      });

      return {
        valid: false,
        error: 'Your submission appears to be spam. If this is a legitimate enquiry, please contact us through alternative channels. We do not accept unsolicited offers for SEO, website design, loans, or similar services.'
      };
    }

    return {
      valid: true,
      error: '',
      translatedMessage,
      sourceLanguage
    };
  }

  return { valid: true, error: '', translatedMessage: '', sourceLanguage };
}

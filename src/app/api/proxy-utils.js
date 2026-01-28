import * as cheerio from 'cheerio';

export function sanitizeAndRewrite(html, baseUrl, options = {}) {
  const $ = cheerio.load(html, { decodeEntities: false });

  // Remove meta-based CSP or frame options that can block resources when proxied
  $('meta[http-equiv="Content-Security-Policy"]').remove();
  $('meta[http-equiv="X-Frame-Options"]').remove();
  $('meta[http-equiv="refresh"]').remove();

  // Preserve inline event handlers; only remove obvious analytics/ad vendor scripts
  $('script').each(function () {
    const $s = $(this);
    const src = ($s.attr('src') || '').toLowerCase();
    if (src && (
      src.includes('googletagmanager') ||
      src.includes('google-analytics') ||
      src.includes('gtag') ||
      src.includes('doubleclick') ||
      src.includes('adsbygoogle') ||
      src.includes('hotjar') ||
      src.includes('optimizely')
    )) {
      $s.remove();
      return;
    }
    // Strip simple frame-busting inline scripts
    const code = $s.html() || '';
    if (!src && /window\.top|top\s*\.|parent\.location|top\.location|document\.domain/.test(code)) {
      $s.remove();
      return;
    }
    if ($s.attr('src') && $s.attr('src').startsWith('/')) {
      // USPS uses shared assets under www.usps.com even when the HTML is from tools.usps.com
      if ($s.attr('src').startsWith('/global-elements/') || $s.attr('src').startsWith('/assets/')) {
        const uspsRoot = new URL(baseUrl).hostname.includes('usps.com') ? 'https://www.usps.com' : baseUrl;
        $s.attr('src', uspsRoot + $s.attr('src'));
      } else {
        $s.attr('src', baseUrl + $s.attr('src'));
      }
    }
  });

  let out = $.html();
  // Rewrite relative href/src/url()
  out = out
    .replace(/href=["']\/(?!\/)([^"'>\s]*)/gi, `href="${baseUrl}/$1"`)
    .replace(/src=["']\/(?!\/)([^"'>\s]*)/gi, `src="${baseUrl}/$1"`)
    .replace(/url\(\/(?!\/)([^)]*)\)/gi, `url(${baseUrl}/$1)`);

  // USPS-specific: rewrite shared asset paths to www.usps.com to avoid 404s from tools.usps.com
  try {
    const host = new URL(baseUrl).hostname.toLowerCase();
    if (host === 'tools.usps.com' || host === 'www.usps.com') {
      out = out
        .replace(/href=["']\/global-elements\//gi, 'href="https://www.usps.com/global-elements/')
        .replace(/src=["']\/global-elements\//gi, 'src="https://www.usps.com/global-elements/')
        .replace(/url\(\/global-elements\//gi, 'url(https://www.usps.com/global-elements/')
        .replace(/href=["']\/assets\//gi, 'href="https://www.usps.com/assets/')
        .replace(/src=["']\/assets\//gi, 'src="https://www.usps.com/assets/')
        .replace(/url\(\/assets\//gi, 'url(https://www.usps.com/assets/')
        ;
    }
  } catch {}

  // Ensure links open in new tab
  out = out.replace(/<a(?![^>]*target=)/gi, '<a target="_blank" rel="noopener noreferrer"');

  // Add base tag & viewport
  if (!/\<base\s/i.test(out)) {
    out = out.replace(/<head>/i, `<head>\n<base href="${baseUrl}/" target="_blank">`);
  }
  if (!out.includes('viewport')) {
    out = out.replace(/<head>/i, '<head>\n<meta name="viewport" content="width=device-width, initial-scale=1">');
  }

  // Inject host-specific CSS to improve rendering within proxy iframe
  try {
    const host = new URL(baseUrl).hostname.toLowerCase();
    const commonCss = `
html, body { height: auto !important; min-height: 600px !important; overflow: auto !important; background: #fff !important; }
#root, #__next, app-root, #app, .content, main { min-height: 600px !important; }
header.sticky, .cookie-banner, .cookie-consent, .consent-banner { position: static !important; }
`;
    let hostCss = '';
    switch (host) {
      case 'tools.usps.com':
      case 'www.usps.com':
        hostCss = `
.usps-header, .usps-footer, .global-navigation, .usps-gateway { display: none !important; }
#tracking, #tracking-results, .article { visibility: visible !important; }
`;
        break;
      case 'www.royalmail.com':
        hostCss = `
.rm-header, .rm-footer, .cookie-banner { display: none !important; }
.track-panel, .content { display: block !important; }
`;
        break;
      case 'www.canadapost-postescanada.ca':
        hostCss = `
/* Hide all headers, footers, navigation, branding */
cp-header, cp-footer, header, footer, .header, .footer, nav, .nav, .navigation, .navbar { display: none !important; }
.cookie-consent, .cookie-banner, .cookie-notice { display: none !important; }
/* Hide Canada Post footer sections */
div[class*="footer"], div[class*="Footer"], section[class*="footer"] { display: none !important; }
/* Hide menu, logo, search in header area */
.menu, .Menu, [class*="menu"], [class*="Menu"] { display: none !important; }
[class*="logo"], [class*="Logo"], img[alt*="Canada Post"] { display: none !important; }
/* Hide "Connect with us", "Support", "Blogs" sections */
h2, h3, h4 { display: none !important; }
/* Hide social media links and footer content */
[class*="social"], [class*="Social"], a[href*="facebook"], a[href*="twitter"], a[href*="instagram"] { display: none !important; }
/* Ensure tracking content is visible */
.track-results, .tracking-content, .tracking, [class*="track"], [class*="Track"] { display: block !important; visibility: visible !important; }
main, #app, #root, [role="main"] { min-height: 600px !important; display: block !important; }
body { padding-top: 0 !important; margin-top: 0 !important; padding-bottom: 0 !important; margin-bottom: 0 !important; }
/* Force white background on tracking area */
body, html, #app, #root { background: white !important; }
`;
        break;
      case 'www.nzpost.co.nz':
        hostCss = `
header, footer, .cookie-consent { display: none !important; }
`;
        break;
      case 'jouw.postnl.nl':
        hostCss = `
header, footer, .consent-banner { display: none !important; }
.track-and-trace { min-height: 600px !important; }
`;
        break;
      case 'track.bpost.cloud':
        hostCss = `
header, footer, .cookie-banner { display: none !important; }
`;
        break;
      case 'www.deutschepost.de':
        hostCss = `
#c-header, #c-footer, .cookie { display: none !important; }
`;
        break;
      case 'www.dhl.com':
        hostCss = `
/* Hide cookie banners */
.cookie-banner, .cookie-consent, [class*="cookie"], [class*="Cookie"], [id*="cookie"] { display: none !important; }
`;
        break;
      case 'www.laposte.fr':
        hostCss = `
header, footer, .sticky-consent { display: none !important; }
`;
        break;
      case 'service.post.ch':
        hostCss = `
header, footer, .cookie-banner { display: none !important; }
`;
        break;
      case 'www.postnord.se':
        hostCss = `
header, footer, .cookie-consent { display: none !important; }
`;
        break;
      case 'auspost.com.au':
        hostCss = `
ap-header, header, footer, .cookie-banner, .ap-cookie-banner { display: none !important; }
.tracking-results, .track-details, main { min-height: 600px !important; display: block !important; }
`;
        break;
      default:
        hostCss = '';
    }

    const finalCss = `${commonCss}\n${hostCss}`.trim();
    if (finalCss && !/proxy-injected-css/.test(out)) {
      out = out.replace(/<head>/i, `<head>\n<style id="proxy-injected-css">${finalCss}</style>`);
    }
  } catch {}

  // Optional: Inject Google Translate to auto-translate proxied HTML to target language
  try {
    const targetLang = (options.translateLang || '').toLowerCase();
    // Skip if no targetLang or English requested
    if (targetLang && targetLang !== 'en') {
      const langCodeMap = {
        'en': 'en', 'de': 'de', 'fr': 'fr', 'es': 'es', 'it': 'it', 'pt': 'pt', 'nl': 'nl', 'sv': 'sv',
        'fi': 'fi', 'no': 'no', 'pl': 'pl', 'cs': 'cs', 'da': 'da', 'el': 'el', 'hu': 'hu', 'ro': 'ro',
        'sk': 'sk', 'sl': 'sl', 'bg': 'bg', 'hr': 'hr', 'lt': 'lt', 'lv': 'lv', 'et': 'et', 'tr': 'tr',
        'ru': 'ru', 'uk': 'uk', 'ar': 'ar', 'he': 'he', 'id': 'id', 'ms': 'ms', 'th': 'th', 'vi': 'vi',
        'ja': 'ja', 'ko': 'ko', 'zh': 'zh-CN', 'zh-cn': 'zh-CN', 'zh-hans': 'zh-CN', 'zh-hant': 'zh-TW', 'zh-tw': 'zh-TW',
        'cy': 'cy'
      };
      const gtLang = langCodeMap[targetLang] || targetLang;
      const translateInjection = `
<script>(function(){
  try { document.cookie = 'googtrans=/auto/${gtLang}; path=/'; } catch(e) {}
})();</script>
<script src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>
<script>
  function googleTranslateElementInit() {
    try { new google.translate.TranslateElement({pageLanguage: 'auto', autoDisplay: true}, 'google_translate_element'); } catch(e) {}
  }
  // Hide default Google toolbar spacing
  try {
    var s = document.createElement('style');
    s.innerHTML = '.skiptranslate{display:none!important} body{top:0!important}';
    document.head.appendChild(s);
  } catch(e){}
</script>
<div id="google_translate_element" style="display:none"></div>
`;
      if (!/google_translate_elementInit/.test(out)) {
        out = out.replace(/<head>/i, `<head>\n<meta name="google" content="translate">`);
        out = out.replace(/<body[^>]*>/i, (m) => `${m}\n${translateInjection}`);
      }
    }
  } catch {}

  return out;
}

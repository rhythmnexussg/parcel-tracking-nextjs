import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { normalizeLangParam, rateLimit, secureApiResponse } from '../security';

export async function GET(request) {
  const limited = rateLimit(request, { keyPrefix: 'singpost-announcements', maxRequests: 20, windowMs: 60 * 1000 });
  if (limited) return limited;

  try {
    // Define the 34 countries you ship to internationally (alphabetical order)
    const shippedCountries = [
      'AT', 'AU', 'BE', 'BN', 'CA', 'CN', 'CZ', 'DE', 'FI', 'FR',
      'GB', 'HK', 'ID', 'IE', 'IL', 'IN', 'IT', 'JP', 'KR', 'MO',
      'MY', 'NL', 'NO', 'NZ', 'PH', 'PL', 'PT', 'RU', 'SE', 'ES', 'CH',
      'TW', 'TH', 'US', 'VN'
    ];
    
    // Get allowed countries from query parameters, or use all shipped countries
    const { searchParams } = new URL(request.url);
    const allowedCountriesParam = searchParams.get('countries');
    const lang = normalizeLangParam(searchParams.get('lang'));
    const allowedCountries = allowedCountriesParam
      ? allowedCountriesParam
          .split(',')
          .map((code) => code.trim().toUpperCase())
          .filter((code) => /^[A-Z]{2}$/.test(code))
          .slice(0, 50)
      : shippedCountries; // Always filter by shipped countries
    
    const response = await fetch('https://www.singpost.com/send-receive/service-announcements', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Cache-Control': 'no-cache',
      },
      cache: 'no-store', // Don't cache to get fresh announcements
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    let html = await response.text();
    
    // Always filter content to show only relevant countries
    if (allowedCountries && allowedCountries.length > 0) {
      const $ = cheerio.load(html);
      
      // Build set of allowed country codes for exact matching
      const allowedCodesSet = new Set(allowedCountries);
      
      // Map country codes to full country names for announcement filtering
      const countryNameMap = {
        AT: 'Austria', AU: 'Australia', BE: 'Belgium', BN: 'Brunei',
        CA: 'Canada', CN: 'China', CZ: 'Czech', DE: 'Germany', FI: 'Finland', FR: 'France',
        GB: 'United Kingdom', HK: 'Hong Kong', ID: 'Indonesia', IE: 'Ireland', IL: 'Israel', 
        IN: 'India', IT: 'Italy', JP: 'Japan', KR: 'Korea', MO: 'Macau',
        MY: 'Malaysia', NL: 'Netherlands', NO: 'Norway', NZ: 'New Zealand', PH: 'Philippines', 
        PL: 'Poland', PT: 'Portugal', RU: 'Russia', SE: 'Sweden', ES: 'Spain', CH: 'Switzerland',
        TW: 'Taiwan', TH: 'Thailand', US: 'United States', VN: 'Vietnam'
      };
      
      const allowedCountryNames = allowedCountries.map(code => countryNameMap[code]).filter(Boolean);
      
      console.log('Filtering for countries:', allowedCountries);
      
      // Remove specific dated announcements
      const datesToRemove = ['16 Dec 2025', '15 Sep 2025'];
      
      // Find and remove announcement tiles
      $('.sgp-tile').each(function() {
        const $tile = $(this);
        const dateText = $tile.find('.sgp-tile__date').text().trim();
        const titleText = $tile.find('h3').text().trim();
        const fullText = dateText + ' ' + titleText;
        
        // Remove the two specific general announcements by date
        if (datesToRemove.includes(dateText)) {
          console.log(`Removing general announcement: ${dateText} - ${titleText}`);
          $tile.remove();
          return;
        }
        
        // For country-specific announcements, check if country is in our list
        let mentionsAllowedCountry = false;
        for (const countryName of allowedCountryNames) {
          if (titleText.toLowerCase().includes(countryName.toLowerCase())) {
            mentionsAllowedCountry = true;
            break;
          }
        }
        
        // If it mentions a country but not one we ship to, remove it
        const mentionsCountry = /([A-Z][a-z]+(\s[A-Z][a-z]+)*)\s*[–—-]/.test(titleText);
        if (mentionsCountry && !mentionsAllowedCountry) {
          console.log(`Removing announcement for non-shipped country: ${titleText}`);
          $tile.remove();
        }
      });
      
      let rowsRemoved = 0;
      
      // Rename headers and center-align
      $('th.sgp-rate-table__main-head').each(function() {
        const $th = $(this);
        const headerText = $th.text().trim();
        
        // Center-align all header cells with !important
        $th.attr('style', 'text-align: center !important;');
        
        if (headerText === 'Mail') {
          $th.text('SpeedPost Saver (ePAC)');
          console.log('Renamed "Mail" to "SpeedPost Saver (ePAC)"');
        } else if (headerText === 'Speedpost Priority') {
          $th.text('SpeedPost Priority (EMS)');
          console.log('Renamed "Speedpost Priority" to "SpeedPost Priority (EMS)"');
        } else if (headerText === 'Speedpost Express') {
          $th.text('SpeedPost Express (last-mile DHL Express)');
          console.log('Renamed "Speedpost Express" to "SpeedPost Express (last-mile DHL Express)"');
        }
      });
      
      // Center-align all body cells in the rate table
      $('.sgp-rate-table__row-list table tbody td').each(function() {
        $(this).css('text-align', 'center');
      });
      
      // Ensure tables use full width and auto layout
      $('.sgp-rate-table__row-list table').css('width', '100%');
      
      // Remove the Speedpost Economy header
      $('th.sgp-rate-table__main-head').each(function() {
        const $th = $(this);
        const headerText = $th.text().trim();
        
        if (headerText === 'Speedpost Economy') {
          $th.remove();
          console.log('Removed "Speedpost Economy" header');
        }
      });
      
      // Remove column 6 (index 5) from all rate tables
      $('.sgp-rate-table__row-list').each(function() {
        const $table = $(this);
        
        // Remove 6th column from all header rows
        $table.find('thead tr').each(function() {
          $(this).find('th').eq(5).remove();
        });
        
        // Remove 6th column from all body rows
        $table.find('tbody tr').each(function() {
          $(this).find('td').eq(5).remove();
        });
        
        console.log('Removed column 6 (index 5) from rate table');
      });
      
      // Fix colspan attributes - change colspan="6" to colspan="5"
      $('td[colspan="6"]').each(function() {
        $(this).attr('colspan', '5');
        console.log('Updated colspan from 6 to 5');
      });
      
      // Target the rate table with class sgp-rate-table__row-list
      $('.sgp-rate-table__row-list tbody tr').each(function() {
        const $row = $(this);
        const cells = $row.find('td');
        
        if (cells.length >= 2) {
          const countryCode = $(cells[1]).text().trim(); // Second column is country code
          const countryName = $(cells[0]).text().trim(); // First column is country name
          
          // Keep row if country code matches
          const isAllowedCountry = allowedCodesSet.has(countryCode);
          
          if (!isAllowedCountry && countryCode) {
            console.log(`Removing table row for: ${countryName} (${countryCode})`);
            $row.remove();
            rowsRemoved++;
          }
          
          // Change "Limited to documents only" to "Available" for United States rows
          if (countryCode === 'US' || countryName.toLowerCase().includes('united states')) {
            cells.each(function() {
              const $cell = $(this);
              const cellText = $cell.text().trim();
              if (cellText.toLowerCase().includes('limited to documents only')) {
                $cell.text('Available');
                console.log(`Changed "Limited to documents only" to "Available" for ${countryName}`);
              }
            });
          }
        }
      });
      
      console.log(`Removed ${rowsRemoved} country rows from rate table. Showing ${allowedCountries.length} countries.`);
      html = $.html();
    }
    
    // Process scripts selectively: remove third-party analytics but keep site JS needed for search
    const $global = cheerio.load(html, { decodeEntities: false });

    // Preserve inline event handlers to keep site interactivity (e.g., search).
    // Do not strip on* attributes here.

    $global('script').each(function () {
      const $s = $global(this);
      const src = ($s.attr('src') || '').toLowerCase();

      // Remove only known analytics/ad vendor scripts
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

      // Convert relative script src to absolute so resource loads correctly
      if ($s.attr('src') && $s.attr('src').startsWith('/')) {
        $s.attr('src', 'https://www.singpost.com' + $s.attr('src'));
      }

      // Keep all other scripts (including inline scripts) so site interactivity works
    });

    // Replace "Read More" tiles for specified announcements with full text
    try {
      const normalize = (s) => (s || '')
        .replace(/[\u2013\u2014]/g, '-') // en/em dash to hyphen
        .replace(/\s+/g, ' ')
        .trim()
        .toLowerCase();

      const removeReadMoreLinks = ($root) => {
        // Remove anchors with text "Read more" (any case) or typical announcement link classes
        $root.find('a').each(function(){
          const $a = $global(this);
          const text = ($a.text() || '').trim().toLowerCase();
          const href = ($a.attr('href') || '').toLowerCase();
          const cls = ($a.attr('class') || '').toLowerCase();
          if (text.includes('read more') || cls.includes('sgp-link') || href.includes('/send-receive/service-announcements')) {
            $a.remove();
          }
        });
      };

      const findContentContainer = ($tile) => {
        let $container = $tile.find('.sgp-tile__cnt-sec');
        if ($container.length === 0) {
          $container = $tile.find('.sgp-tile__cnt');
        }
        return $container.length ? $container : $tile;
      };

      $global('.sgp-tile').each(function(){
        const $tile = $global(this);
        const rawTitle = $tile.find('.sgp-h3, h3').text();
        const titleText = normalize(rawTitle);
        const titleNoDots = titleText.replace(/\./g, '');

        const isIrelandEircode = titleText.includes('ireland') && titleText.includes('eircode');
        const isUSASevereWinter = /\b(usa|u s a|u s|us|united states)\b/.test(titleNoDots) && titleNoDots.includes('severe winter');

        if (isIrelandEircode) {
          removeReadMoreLinks($tile);
          $tile.find('.rn-replaced-readmore').remove();
          findContentContainer($tile).append('<div class="rn-replaced-readmore" style="margin-top:8px;"><p>Ireland introduced a smart postcode system, known as Eircode. It is a 7-digit postcode that is unique and specific to every residential or business postal code address. You may verify the postcode with the recipient or use Ireland Eircode finder tool available at <a href="https://finder.eircode.ie/#/" target="_blank" rel="noopener noreferrer">https://finder.eircode.ie/#/</a>.</p></div>');
        }

        if (isUSASevereWinter) {
          removeReadMoreLinks($tile);
          $tile.find('.rn-replaced-readmore').remove();
          findContentContainer($tile).append('<div class="rn-replaced-readmore" style="margin-top:8px;"><p>USA is experiencing severe winter weather in several areas that will impact package processing, transportation and package delivery. These include Northern Plains, Great Lakes, Ohio Valley, and Northeast regions of the U.S. (Montana, North Dakota, South Dakota, Minnesota, Nebraska, Iowa, Wisconsin, Illinois, Michigan, Indiana, Ohio, Kentucky, West Virginia, Virginia, North Carolina, District of Columbia, Maryland, Delaware, New Jersey, Pennsylvania, New York, Vermont, Connecticut, Rhode Island, Massachusetts, New Hampshire, and Maine), Southwest, Southern Plains, Midwest, Ohio Valley, and Southeast regions of the U.S. (New Mexico, Texas, Oklahoma, Kansas, Missouri, Arkansas, Tennessee, Mississippi, Alabama, Georgia, and South Carolina) etc.</p></div>');
        }
      });
    } catch (e) {
      console.warn('Announcement replacement failed or not applicable:', e);
    }

    // Convert relative URLs to absolute for href/src/url
    let processedHtml = $global.html();
    processedHtml = processedHtml
      .replace(/href=["']?\/(?!\/)([^"'>\s]*)/gi, 'href="https://www.singpost.com/$1"')
      .replace(/src=["']?\/(?!\/)([^"'>\s]*)/gi, 'src="https://www.singpost.com/$1"')
      .replace(/url\(\/(?!\/)([^)]*)\)/gi, 'url(https://www.singpost.com/$1)');

    // Ensure links open in new tab
    processedHtml = processedHtml.replace(/<a(?![^>]*target=)/gi, '<a target="_blank" rel="noopener noreferrer"');

    // Add base and viewport if missing
    if (!/\<base\s/i.test(processedHtml)) {
      processedHtml = processedHtml.replace(/<head>/i, '<head>\n<base href="https://www.singpost.com/" target="_blank">');
    }
    if (!processedHtml.includes('viewport')) {
      processedHtml = processedHtml.replace(/<head>/i, '<head>\n<meta name="viewport" content="width=device-width, initial-scale=1">');
    }

    let content = processedHtml;
    // Inject Google Translate to auto-translate announcements if a target language is provided and not English
    try {
      const targetLang = (lang || '').toLowerCase();
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
        const injection = `
<script>(function(){
  try { document.cookie = 'googtrans=/auto/${gtLang}; path=/'; } catch(e) {}
})();</script>
<script src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>
<script>
  function googleTranslateElementInit() {
    try { new google.translate.TranslateElement({pageLanguage: 'auto', autoDisplay: true}, 'google_translate_element'); } catch(e) {}
  }
  try {
    var s = document.createElement('style');
    s.innerHTML = '.skiptranslate{display:none!important} body{top:0!important}';
    document.head.appendChild(s);
  } catch(e){}
</script>
<div id="google_translate_element" style="display:none"></div>
`;
        if (!/google_translate_elementInit/.test(content)) {
          content = content.replace(/<head>/i, '<head>\n<meta name="google" content="translate">');
          content = content.replace(/<body[^>]*>/i, (m) => `${m}\n${injection}`);
        }
      }
    } catch {}
    
    return secureApiResponse(
      new NextResponse(content, {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600', // Cache for 5 minutes
        },
      }),
      { isHtml: true, allowFrameFromSelf: true }
    );
    
  } catch (error) {
    console.error('Error fetching SingPost announcements:', error);
    
    return secureApiResponse(
      NextResponse.json(
        {
          error: 'Failed to fetch service announcements',
          message: error.message,
        },
        { status: 500 }
      )
    );
  }
}

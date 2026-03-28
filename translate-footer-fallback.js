const fs = require('fs');

const LANGUAGES = {
  'en': 'en', 'fr': 'fr', 'es': 'es', 'ja': 'ja', 'ko': 'ko', 
  'zh-CN': 'zh-CN', 'zh-TW': 'zh-TW', 'de': 'de', 'ru': 'ru', 'pt': 'pt',
  'it': 'it', 'nl': 'nl', 'pl': 'pl', 'tr': 'tr', 'vi': 'vi',
  'th': 'th', 'id': 'id', 'ar': 'ar', 'hi': 'hi', 'bn': 'bn',
  'ms': 'ms', 'tl': 'tl', 'ur': 'ur', 'uz': 'uz', 'uk': 'uk',
  'ro': 'ro', 'hu': 'hu', 'cs': 'cs', 'mi': 'mi'
};

const texts = {
  footerDesc: "Your premier destination for arcade amusement cards, rhythm game gloves, and specialized merch. Enjoy global e-commerce with seamless international parcel tracking and reliable shipping data.",
  footerQuickLinks: "Quick Links",
  footerSupportLegal: "Support & Legal",
  copyrightText: "All Rights Reserved."
};

let fileContent = fs.readFileSync('src/translations.js', 'utf8');

Object.keys(LANGUAGES).forEach(lang => {
  const keysToAdd = Object.entries(texts)
    .map(([k, v]) => `    ${k}: ${JSON.stringify(v)},`)
    .join('\n');
  
  const regex = new RegExp(`('${lang}'|"${lang}"): \\{([^]*?)\\}`, 'g');
  if (fileContent.match(regex)) {
      fileContent = fileContent.replace(regex, (match, p1, p2) => {
          return `${p1}: {\n${keysToAdd}${p2}}`;
      });
  }
});

fs.writeFileSync('src/translations.js', fileContent);
console.log('Fallback translation texts updated.');

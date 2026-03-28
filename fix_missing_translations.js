const fs = require('fs');

const file = 'src/translations.js';
let content = fs.readFileSync(file, 'utf8');

const mapping = {
  "en": { ql: "Quick Links", sl: "Support & Legal" },
  "ms": { ql: "Pautan Pantas", sl: "Sokongan & Perundangan" },
  "id": { ql: "Tautan Cepat", sl: "Dukungan & Hukum" },
  "de": { ql: "Schnelllinks", sl: "Support & Rechtliches" },
  "fr": { ql: "Liens rapides", sl: "Assistance et mentions légales" },
  "es": { ql: "Enlaces rápidos", sl: "Soporte y legal" },
  "ja": { ql: "クイックリンク", sl: "サポートと法的情報" },
  "zh": { ql: "快速链接", sl: "支持与法律" },
  "zh-hant": { ql: "快速連結", sl: "支援與法律" },
  "pt": { ql: "Links rápidos", sl: "Suporte e Legal" },
  "hi": { ql: "त्वरित लिंक", sl: "समर्थन और कानूनी" },
  "th": { ql: "ลิงก์ด่วน", sl: "การสนับสนุนและกฎหมาย" },
  "nl": { ql: "Snelle koppelingen", sl: "Ondersteuning & Juridisch" },
  "cs": { ql: "Rychlé odkazy", sl: "Podpora a právní záležitosti" },
  "it": { ql: "Link rapidi", sl: "Supporto e note legali" },
  "he": { ql: "קישורים מהירים", sl: "תמיכה ומשפטי" },
  "ga": { ql: "Naisc Thapa", sl: "Tacaíocht & Dlíthiúil" },
  "pl": { ql: "Szybkie linki", sl: "Wsparcie i kwestie prawne" },
  "ko": { ql: "빠른 링크", sl: "지원 및 법적 정보" },
  "no": { ql: "Hurtigkoblinger", sl: "Støtte og juridisk" },
  "sv": { ql: "Snabblänkar", sl: "Support och juridik" },
  "tl": { ql: "Mga Mabilisang Link", sl: "Suporta at Legal" },
  "vi": { ql: "Liên kết nhanh", sl: "Hỗ trợ & Pháp lý" },
  "fi": { ql: "Pikalinkit", sl: "Tuki ja oikeudelliset" },
  "ru": { ql: "Быстрые ссылки", sl: "Поддержка и правовая информация" },
  "cy": { ql: "Dolenni Cyflym", sl: "Cefnogaeth a Chyfreithiol" },
  "ta": { ql: "விரைவு இணைப்புகள்", sl: "ஆதரவு மற்றும் சட்டம்" },
  "mi": { ql: "Hononga Tere", sl: "Tautoko me te Ture" },
  "yue": { ql: "快速連結", sl: "支援與法律" }
};

const lines = content.split('\n');
let currentLang = 'en';

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  const langMatch = line.match(/^  "([^"]+)": {/);
  if (langMatch) {
    currentLang = langMatch[1];
  }
  
  if (mapping[currentLang]) {
    if (line.includes('footerQuickLinks:')) {
      lines[i] = line.replace(/footerQuickLinks:\s*".*?"/, `footerQuickLinks: "${mapping[currentLang].ql}"`);
    } else if (line.includes('"footerQuickLinks":')) {
      lines[i] = line.replace(/"footerQuickLinks":\s*".*?"/, `"footerQuickLinks": "${mapping[currentLang].ql}"`);
    }
    
    if (line.includes('footerSupportLegal:')) {
      lines[i] = line.replace(/footerSupportLegal:\s*".*?"/, `footerSupportLegal: "${mapping[currentLang].sl}"`);
    } else if (line.includes('"footerSupportLegal":')) {
      lines[i] = line.replace(/"footerSupportLegal":\s*".*?"/, `"footerSupportLegal": "${mapping[currentLang].sl}"`);
    }
  }
}

fs.writeFileSync(file, lines.join('\n'), 'utf8');
console.log('Fixed translations');

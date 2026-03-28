const fs = require('fs');

const data = fs.readFileSync('src/translations.js', 'utf8');
const amMap = {
  "en": "AM", "ms": "pagi", "id": "pagi", "de": "vormittags", "fr": "AM",
  "es": "a. m.", "ja": "午前", "zh": "上午", "zh-hant": "上午", "pt": "AM",
  "hi": "पूर्वाह्न", "th": "ก่อนเที่ยง", "nl": "v.m.", "cs": "dop.", "it": "AM",
  "he": "לפני הצהריים", "ga": "r.n.", "pl": "AM", "ko": "오전", "no": "a.m.",
  "sv": "fm", "tl": "AM", "vi": "SA", "fi": "ap.", "ru": "ДП", "cy": "yb",
  "ta": "முற்பகல்", "mi": "AM", "yue": "上午"
};

const pmMap = {
  "en": "PM", "ms": "petang", "id": "sore", "de": "nachmittags", "fr": "PM",
  "es": "p. m.", "ja": "午後", "zh": "下午", "zh-hant": "下午", "pt": "PM",
  "hi": "अपराह्न", "th": "หลังเที่ยง", "nl": "n.m.", "cs": "odp.", "it": "PM",
  "he": "אחרי הצהריים", "ga": "i.n.", "pl": "PM", "ko": "오후", "no": "p.m.",
  "sv": "em", "tl": "PM", "vi": "CH", "fi": "ip.", "ru": "ПП", "cy": "yh",
  "ta": "பிற்பகல்", "mi": "PM", "yue": "下午"
};

const lines = data.split('\n');
const results = [];
let currentLang = 'en';

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  results.push(line);
  
  const langMatch = line.match(/^  "([^"]+)": {/);
  if (langMatch) {
    currentLang = langMatch[1];
    
    // Check if the next few lines already have amText, pmText
    let hasIt = false;
    for (let j = i + 1; j < Math.min(i + 15, lines.length); j++) {
      if (lines[j].includes('"amText":')) hasIt = true;
    }
    
    if (!hasIt && amMap[currentLang]) {
      results.push(`    "amText": "${amMap[currentLang]}",`);
      results.push(`    "pmText": "${pmMap[currentLang]}",`);
    } else if (!hasIt) {
      results.push(`    "amText": "AM",`);
      results.push(`    "pmText": "PM",`);
    }
  }
}

fs.writeFileSync('src/translations.js', results.join('\n'));
console.log('Done mapping am/pm translation texts');

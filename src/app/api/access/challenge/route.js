import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { getCaptchaSecretOrThrow } from '../captcha-secret';
import { rateLimit, secureApiResponse } from '../../security';

const SUPPORTED_LANGS = new Set([
  'en', 'cs', 'nl', 'fi', 'fr', 'de', 'he', 'hi', 'id', 'ga', 'it', 'ja',
  'ko', 'ms', 'no', 'pl', 'pt', 'ru', 'zh', 'es', 'sv', 'ta', 'tl', 'th', 'mi', 'zh-hant',
  'vi', 'cy', 'yue',
]);

const OPERATOR_SYMBOLS = {
  add: '+',
  sub: '-',
  mul: '×',
  div: '÷',
};

const LOCALIZED_OPERATOR_WORDS = {
  en: { add: 'plus', sub: 'minus', mul: 'multiplied by', div: 'divided by' },
  cs: { add: 'plus', sub: 'minus', mul: 'krát', div: 'děleno' },
  nl: { add: 'plus', sub: 'min', mul: 'keer', div: 'gedeeld door' },
  fi: { add: 'plus', sub: 'miinus', mul: 'kerrottuna', div: 'jaettuna' },
  fr: { add: 'plus', sub: 'moins', mul: 'multiplié par', div: 'divisé par' },
  de: { add: 'plus', sub: 'minus', mul: 'mal', div: 'geteilt durch' },
  he: { add: 'ועוד', sub: 'פחות', mul: 'כפול', div: 'חלקי' },
  hi: { add: 'जोड़', sub: 'घटाकर', mul: 'गुणा', div: 'भाग' },
  id: { add: 'ditambah', sub: 'dikurangi', mul: 'dikali', div: 'dibagi' },
  ga: { add: 'móide', sub: 'lúide', mul: 'iolraithe faoi', div: 'roinnte ar' },
  it: { add: 'più', sub: 'meno', mul: 'moltiplicato per', div: 'diviso per' },
  ja: { add: '足す', sub: '引く', mul: 'かける', div: '割る' },
  ko: { add: '더하기', sub: '빼기', mul: '곱하기', div: '나누기' },
  ms: { add: 'tambah', sub: 'tolak', mul: 'darab', div: 'bahagi' },
  no: { add: 'pluss', sub: 'minus', mul: 'ganger', div: 'delt på' },
  pl: { add: 'plus', sub: 'minus', mul: 'razy', div: 'podzielone przez' },
  pt: { add: 'mais', sub: 'menos', mul: 'vezes', div: 'dividido por' },
  ru: { add: 'плюс', sub: 'минус', mul: 'умножить на', div: 'разделить на' },
  zh: { add: '加', sub: '减', mul: '乘以', div: '除以' },
  es: { add: 'más', sub: 'menos', mul: 'multiplicado por', div: 'dividido por' },
  sv: { add: 'plus', sub: 'minus', mul: 'gånger', div: 'delat med' },
  ta: { add: 'கூட்டு', sub: 'கழித்தல்', mul: 'பெருக்கல்', div: 'வகுத்தல்' },
  tl: { add: 'plus', sub: 'minus', mul: 'times', div: 'divided by' },
  th: { add: 'บวก', sub: 'ลบ', mul: 'คูณ', div: 'หาร' },
  mi: { add: 'tāpiri', sub: 'tango', mul: 'whakarea', div: 'wehe' },
  'zh-hant': { add: '加', sub: '減', mul: '乘以', div: '除以' },
  vi: { add: 'cộng', sub: 'trừ', mul: 'nhân', div: 'chia' },
  cy: { add: 'plws', sub: 'minws', mul: 'wedi lluosi â', div: 'wedi rhannu â' },
  yue: { add: '加', sub: '減', mul: '乘以', div: '除以' },
};

const NATIVE_QUESTION_START = {
  en: 'What is',
  cs: 'Kolik je',
  nl: 'Hoeveel is',
  fi: 'Paljonko on',
  fr: 'Combien font',
  de: 'Was ist',
  he: 'כמה זה',
  hi: 'क्या है',
  id: 'Berapakah',
  ga: 'Cad é',
  it: 'Quanto fa',
  ja: '次を計算してください',
  ko: '다음은 얼마입니까',
  ms: 'Berapakah',
  no: 'Hva er',
  pl: 'Ile to jest',
  pt: 'Quanto é',
  ru: 'Сколько будет',
  zh: '请计算',
  es: 'Cuánto es',
  sv: 'Vad är',
  ta: 'எவ்வளவு',
  tl: 'Magkano ang',
  th: 'เท่าไหร่',
  mi: 'E hia te',
  'zh-hant': '請計算',
  vi: 'Bằng bao nhiêu',
  cy: 'Beth yw',
  yue: '請計算',
};

// ─── Puzzle Challenge Data (fill-in-the-blank) ───────────────────────────────

const PUZZLE_FILL_BLANK_PROMPT = {
  en: 'Find the missing number:',
  cs: 'Najdi chybějící číslo:',
  nl: 'Vind het ontbrekende getal:',
  fi: 'Löydä puuttuva luku:',
  fr: 'Trouvez le nombre manquant\u00a0:',
  de: 'Finden Sie die fehlende Zahl:',
  he: 'מצא/י את המספר החסר:',
  hi: 'लापता संख्या खोजें:',
  id: 'Temukan angka yang hilang:',
  ga: 'Aimsigh an uimhir atá ar iarraidh:',
  it: 'Trova il numero mancante:',
  ja: '？にあてはまる数を選んでください：',
  ko: '？에 들어갈 숫자를 고르세요:',
  ms: 'Cari nombor yang hilang:',
  no: 'Finn det manglende tallet:',
  pl: 'Znajdź brakującą liczbę:',
  pt: 'Encontre o número que falta:',
  ru: 'Найдите пропущенное число:',
  zh: '找出缺失的数字：',
  es: 'Encuentra el número que falta:',
  sv: 'Hitta det saknade talet:',
  ta: 'காணாத எண்ணைக் கண்டுபிடிக்கவும்:',
  tl: 'Hanapin ang nawawalang numero:',
  th: 'หาตัวเลขที่หายไป:',
  mi: 'Kimihia te tau ngaro:',
  'zh-hant': '找出缺少的數字：',
  vi: 'Tìm số còn thiếu:',
  cy: "Dewch o hyd i'r rhif coll:",
  yue: '找出缺少的數字：',
};

// Common words with translations across all 28 supported languages
// ─── Character Matching Challenge Data ──────────────────────────────────────

const CHAR_MATCH_PROMPT = {
  en: 'Type these characters exactly:',
  cs: 'Zadejte přesně tyto znaky:',
  nl: 'Typ deze tekens precies:',
  fi: 'Kirjoita nämä merkit täsmälleen:',
  fr: 'Saisissez exactement ces caractères\u00a0:',
  de: 'Geben Sie diese Zeichen genau ein:',
  he: 'הקלד/הקלידי תווים אלה בדיוק:',
  hi: 'इन अक्षरों को बिल्कुल इसी तरह टाइप करें:',
  id: 'Ketik karakter berikut dengan tepat:',
  ga: 'Clóscríobh na carachtair seo go díreach:',
  it: 'Digita esattamente questi caratteri:',
  ja: '次の文字をそのまま入力してください：',
  ko: '다음 문자를 정확히 입력하세요:',
  ms: 'Taip aksara ini dengan tepat:',
  no: 'Skriv inn disse tegnene nøyaktig:',
  pl: 'Wpisz dokładnie te znaki:',
  pt: 'Digite exatamente estes caracteres:',
  ru: 'Введите эти символы точно:',
  zh: '请原样输入以下字符：',
  es: 'Escribe exactamente estos caracteres:',
  sv: 'Skriv in dessa tecken exakt:',
  ta: 'இந்த எழுத்துக்களை சரியாக தட்டச்சு செய்யவும்:',
  tl: 'I-type nang eksakto ang mga karakteres na ito:',
  th: 'พิมพ์อักขระเหล่านี้ให้ตรงทุกประการ:',
  mi: 'Patohia ēnei tohu i tika tonu:',
  'zh-hant': '請原樣輸入以下字元：',
  vi: 'Gõ chính xác các ký tự sau:',
  cy: 'Teipiwch y nodau hyn yn union:',
  yue: '請原樣輸入以下字元：',
};

// Unambiguous lowercase letters + digits (no 0/o/1/l/i visual confusion)
const CHAR_POOL = 'abcdefghjkmnpqrstuvwxyz23456789';

const MATCH_PROMPT = {
  en: 'Match puzzle: select the same symbol as',
  cs: 'Párovací úkol: vyberte stejný symbol jako',
  nl: 'Match-puzzel: kies hetzelfde symbool als',
  fi: 'Yhdistämistehtävä: valitse sama symboli kuin',
  fr: 'Puzzle d’association : sélectionnez le même symbole que',
  de: 'Zuordnungsrätsel: Wählen Sie dasselbe Symbol wie',
  he: 'פאזל התאמה: בחר/י את אותו הסמל כמו',
  hi: 'मैच पज़ल: वही चिन्ह चुनें जो',
  id: 'Teka-teki cocokkan: pilih simbol yang sama dengan',
  ga: 'Puzal meaitseála: roghnaigh an tsiombail chéanna le',
  it: 'Puzzle di abbinamento: seleziona lo stesso simbolo di',
  ja: 'マッチパズル：次と同じ記号を選んでください',
  ko: '매칭 퍼즐: 다음과 같은 기호를 선택하세요',
  ms: 'Teka-teki padanan: pilih simbol yang sama seperti',
  no: 'Match-oppgave: velg samme symbol som',
  pl: 'Puzzle dopasowania: wybierz ten sam symbol co',
  pt: 'Quebra-cabeça de correspondência: selecione o mesmo símbolo que',
  ru: 'Головоломка на соответствие: выберите такой же символ, как',
  zh: '配对谜题：请选择与其相同的符号',
  es: 'Rompecabezas de emparejar: selecciona el mismo símbolo que',
  sv: 'Matchningspussel: välj samma symbol som',
  ta: 'பொருத்தும் புதிர்: இதே குறியீட்டைத் தேர்ந்தெடுக்கவும்',
  tl: 'Match puzzle: piliin ang kaparehong simbolo ng',
  th: 'ปริศนาจับคู่: เลือกสัญลักษณ์เดียวกันกับ',
  mi: 'Panga ōrite: tīpakohia te tohu ōrite ki',
  'zh-hant': '配對謎題：請選擇與其相同的符號',
  vi: 'Câu đố ghép cặp: chọn cùng ký hiệu với',
  cy: 'Pos cydweddu: dewiswch yr un symbol â',
  yue: '配對謎題：請選擇與其相同的符號',
};

const MATCH_SYMBOL_POOL = ['★', '◆', '●', '■', '▲', '♥', '♣', '♠', '☀', '☂', '☕', '♫', '⚙', '✈', '⌛', '⚡'];

function normalizeCaptchaLanguage(value) {
  const normalized = (value || '').trim().toLowerCase();
  return SUPPORTED_LANGS.has(normalized) ? normalized : 'en';
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createOperationChallenge() {
  const operations = ['add', 'sub', 'mul', 'div'];
  const op = operations[randomInt(0, operations.length - 1)];

  if (op === 'add') {
    const a = randomInt(2, 25);
    const b = randomInt(2, 25);
    return { a, b, op };
  }

  if (op === 'sub') {
    const a = randomInt(10, 40);
    const b = randomInt(2, 20);
    return { a: Math.max(a, b), b: Math.min(a, b), op };
  }

  if (op === 'mul') {
    return { a: randomInt(2, 12), b: randomInt(2, 12), op };
  }

  const divisor = randomInt(2, 12);
  const quotient = randomInt(2, 12);
  return { a: divisor * quotient, b: divisor, op: 'div' };
}

function buildQuestionText(lang, a, b, op) {
  const start = NATIVE_QUESTION_START[lang];
  const word = LOCALIZED_OPERATOR_WORDS[lang]?.[op];
  const symbol = OPERATOR_SYMBOLS[op] || '?';

  if (lang === 'ja') {
    return `${start}: ${a} ${word} ${b}（${symbol}）?`;
  }

  if (lang === 'zh' || lang === 'zh-hant' || lang === 'yue') {
    return `${start}：${a} ${word} ${b}（${symbol}）？`;
  }

  if (lang === 'he') {
    return `${start}: ${a} ${word} ${b} (${symbol})?`;
  }

  if (lang === 'tl') {
    return `${start} ${a} ${word} ${b}? (${symbol})`;
  }

  return `${start} ${a} ${word} ${b}? (${symbol})`;
}

function shuffleArray(values) {
  const arr = [...values];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function createMatchChallenge(lang) {
  const shuffledPool = shuffleArray(MATCH_SYMBOL_POOL);
  const correctOption = shuffledPool[0];
  const optionSet = shuffleArray([correctOption, shuffledPool[1], shuffledPool[2], shuffledPool[3]]);
  const prompt = MATCH_PROMPT[lang] || MATCH_PROMPT.en;
  const question = `${prompt} ${correctOption}`;

  return {
    question,
    options: optionSet,
    charTarget: null,
    payload: {
      mode: 'match',
      correctOption,
    },
  };
}

// ─── Puzzle Challenge (fill-in-the-blank arithmetic, 25%) ────────────────────

function createPuzzleChallenge(lang) {
  const prompt = PUZZLE_FILL_BLANK_PROMPT[lang] || PUZZLE_FILL_BLANK_PROMPT.en;
  const opType = randomInt(0, 3);

  let answer, knownNum, result, eqStr;

  if (opType === 0) {
    // ? + b = c
    answer = randomInt(3, 20);
    knownNum = randomInt(2, 20);
    result = answer + knownNum;
    eqStr = `? + ${knownNum} = ${result}`;
  } else if (opType === 1) {
    // ? - b = c  (answer always positive)
    knownNum = randomInt(2, 15);
    answer = randomInt(knownNum + 1, knownNum + 20);
    result = answer - knownNum;
    eqStr = `? - ${knownNum} = ${result}`;
  } else if (opType === 2) {
    // ? × b = c
    answer = randomInt(2, 12);
    knownNum = randomInt(2, 12);
    result = answer * knownNum;
    eqStr = `? × ${knownNum} = ${result}`;
  } else {
    // ? ÷ b = c
    knownNum = randomInt(2, 10);
    answer = randomInt(2, 10);
    result = answer * knownNum; // dividend shown, divisor known, quotient = answer
    eqStr = `${result} ÷ ${knownNum} = ?`;
  }

  const correctOptStr = String(answer);

  // 3 plausible distractors
  const offsets = shuffleArray([-3, -2, -1, 1, 2, 3, 4, 5]);
  const distractors = [];
  for (const offset of offsets) {
    const candidate = answer + offset;
    if (candidate > 0 && String(candidate) !== correctOptStr && !distractors.includes(String(candidate))) {
      distractors.push(String(candidate));
      if (distractors.length === 3) break;
    }
  }

  return {
    question: `${prompt}\n${eqStr}`,
    options: shuffleArray([correctOptStr, ...distractors]),
    charTarget: null,
    payload: { mode: 'puzzle', correctOption: correctOptStr },
  };
}

// ─── Character Matching Challenge (type-back string, 25%) ────────────────────

function createCharChallenge(lang) {
  let charStr = '';
  for (let i = 0; i < 7; i++) {
    charStr += CHAR_POOL[randomInt(0, CHAR_POOL.length - 1)];
  }

  const prompt = CHAR_MATCH_PROMPT[lang] || CHAR_MATCH_PROMPT.en;

  return {
    question: prompt,
    options: null,
    charTarget: charStr,
    payload: { mode: 'char', correctAnswer: charStr },
  };
}

export async function GET(request) {
  const limited = rateLimit(request, { keyPrefix: 'captcha-challenge', maxRequests: 20, windowMs: 60 * 1000 });
  if (limited) return limited;

  try {
    const { searchParams } = new URL(request.url);
    const lang = normalizeCaptchaLanguage(searchParams.get('lang'));
    const captchaSecret = getCaptchaSecretOrThrow();
    const exp = Date.now() + 5 * 60 * 1000;

    // 25% math | 25% fill-in-blank puzzle | 25% symbol match | 25% char
    const roll = randomInt(0, 3);
    let challenge;

    if (roll === 0) {
      const { a, b, op } = createOperationChallenge();
      challenge = {
        question: buildQuestionText(lang, a, b, op),
        options: null,
        charTarget: null,
        payload: { mode: 'math', a, b, op },
      };
    } else if (roll === 1) {
      challenge = createPuzzleChallenge(lang);
    } else if (roll === 2) {
      challenge = createMatchChallenge(lang);
    } else {
      challenge = createCharChallenge(lang);
    }

    const payload = { ...challenge.payload, exp };
    const payloadBase64 = Buffer.from(JSON.stringify(payload), 'utf-8').toString('base64url');
    const signature = crypto.createHmac('sha256', captchaSecret).update(payloadBase64).digest('base64url');
    const token = `${payloadBase64}.${signature}`;

    return secureApiResponse(
      NextResponse.json(
        {
          question: challenge.question,
          token,
          language: lang,
          mode: payload.mode,
          options: challenge.options,
          charTarget: challenge.charTarget || null,
          expiresAt: exp,
        },
        {
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          },
        }
      )
    );
  } catch (_) {
    return secureApiResponse(
      NextResponse.json(
        { error: 'captcha_unavailable' },
        { status: 503 }
      )
    );
  }
}

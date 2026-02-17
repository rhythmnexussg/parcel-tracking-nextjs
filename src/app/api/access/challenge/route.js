import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { getCaptchaSecretOrThrow } from '../captcha-secret';
import { rateLimit, secureApiResponse } from '../../security';

const SUPPORTED_LANGS = new Set([
  'en', 'cs', 'nl', 'fi', 'fr', 'de', 'he', 'hi', 'id', 'ga', 'it', 'ja',
  'ko', 'ms', 'no', 'pl', 'pt', 'ru', 'zh', 'es', 'sv', 'tl', 'th', 'zh-hant',
  'vi', 'cy',
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
  tl: { add: 'plus', sub: 'minus', mul: 'times', div: 'divided by' },
  th: { add: 'บวก', sub: 'ลบ', mul: 'คูณ', div: 'หาร' },
  'zh-hant': { add: '加', sub: '減', mul: '乘以', div: '除以' },
  vi: { add: 'cộng', sub: 'trừ', mul: 'nhân', div: 'chia' },
  cy: { add: 'plws', sub: 'minws', mul: 'wedi lluosi â', div: 'wedi rhannu â' },
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
  tl: 'Magkano ang',
  th: 'เท่าไหร่',
  'zh-hant': '請計算',
  vi: 'Bằng bao nhiêu',
  cy: 'Beth yw',
};

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
  tl: 'Match puzzle: piliin ang kaparehong simbolo ng',
  th: 'ปริศนาจับคู่: เลือกสัญลักษณ์เดียวกันกับ',
  'zh-hant': '配對謎題：請選擇與其相同的符號',
  vi: 'Câu đố ghép cặp: chọn cùng ký hiệu với',
  cy: 'Pos cydweddu: dewiswch yr un symbol â',
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

function buildQuestionText(lang, a, b, op, useEnglish) {
  const effectiveLang = useEnglish ? 'en' : lang;
  const start = NATIVE_QUESTION_START[effectiveLang] || NATIVE_QUESTION_START.en;
  const word = LOCALIZED_OPERATOR_WORDS[effectiveLang]?.[op] || LOCALIZED_OPERATOR_WORDS.en[op];
  const symbol = OPERATOR_SYMBOLS[op] || '?';

  if (effectiveLang === 'ja') {
    return `${start}: ${a} ${word} ${b}（${symbol}）?`;
  }

  if (effectiveLang === 'zh' || effectiveLang === 'zh-hant') {
    return `${start}：${a} ${word} ${b}（${symbol}）？`;
  }

  if (effectiveLang === 'he') {
    return `${start}: ${a} ${word} ${b} (${symbol})?`;
  }

  if (effectiveLang === 'tl') {
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
    payload: {
      mode: 'match',
      correctOption,
    },
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

    const useMatchPuzzle = Math.random() < 0.5;
    let question = '';
    let options = null;
    let payload = { mode: 'math' };

    if (useMatchPuzzle) {
      const matchChallenge = createMatchChallenge(lang);
      question = matchChallenge.question;
      options = matchChallenge.options;
      payload = { ...payload, ...matchChallenge.payload, exp };
    } else {
      const { a, b, op } = createOperationChallenge();
      question = buildQuestionText(lang, a, b, op, false);
      payload = { ...payload, a, b, op, exp };
    }

    const payloadBase64 = Buffer.from(JSON.stringify(payload), 'utf-8').toString('base64url');
    const signature = crypto.createHmac('sha256', captchaSecret).update(payloadBase64).digest('base64url');
    const token = `${payloadBase64}.${signature}`;

    return secureApiResponse(
      NextResponse.json(
        {
          question,
          token,
          language: lang,
          mode: payload.mode,
          options,
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

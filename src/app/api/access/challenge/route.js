import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { getCaptchaSecretOrThrow } from '../captcha-secret';
import { rateLimit, secureApiResponse } from '../../security';

const SUPPORTED_LANGS = new Set([
  'en', 'cs', 'nl', 'fi', 'fr', 'de', 'he', 'hi', 'id', 'ga', 'it', 'ja',
  'ko', 'ms', 'no', 'pl', 'pt', 'ru', 'zh', 'es', 'sv', 'ta', 'tl', 'th', 'mi', 'zh-hant',
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
  ta: { add: 'கூட்டு', sub: 'கழித்தல்', mul: 'பெருக்கல்', div: 'வகுத்தல்' },
  tl: { add: 'plus', sub: 'minus', mul: 'times', div: 'divided by' },
  th: { add: 'บวก', sub: 'ลบ', mul: 'คูณ', div: 'หาร' },
  mi: { add: 'tāpiri', sub: 'tango', mul: 'whakarea', div: 'wehe' },
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
  ta: 'எவ்வளவு',
  tl: 'Magkano ang',
  th: 'เท่าไหร่',
  mi: 'E hia te',
  'zh-hant': '請計算',
  vi: 'Bằng bao nhiêu',
  cy: 'Beth yw',
};

// ─── Puzzle Challenge Data ───────────────────────────────────────────────────

const PUZZLE_NEXT_PROMPT = {
  en: 'What number comes next in the sequence?',
  cs: 'Jaké číslo je v posloupnosti další?',
  nl: 'Welk getal komt hierna in de reeks?',
  fi: 'Mikä luku tulee seuraavaksi sarjassa?',
  fr: 'Quel nombre vient ensuite dans la suite\u00a0?',
  de: 'Welche Zahl kommt als Nächstes in der Folge?',
  he: 'איזה מספר בא הבא בסדרה?',
  hi: 'क्रम में अगला अंक क्या है?',
  id: 'Angka apa yang selanjutnya dalam deretan ini?',
  ga: 'Cén uimhir a thagann ina dhiaidh sin san seicheamh?',
  it: 'Che numero viene dopo nella sequenza?',
  ja: 'この数列の次に来る数は何ですか？',
  ko: '수열에서 다음에 올 숫자는 무엇입니까?',
  ms: 'Nombor apakah yang seterusnya dalam urutan ini?',
  no: 'Hvilket tall kommer neste i rekken?',
  pl: 'Jaka liczba jest następna w ciągu?',
  pt: 'Que número vem a seguir na sequência?',
  ru: 'Какое число идёт следующим в последовательности?',
  zh: '这个数列中下一个数字是什么？',
  es: '¿Qué número sigue en la secuencia?',
  sv: 'Vilket tal kommer härnäst i talföljden?',
  ta: 'தொடரில் அடுத்த எண் என்ன?',
  tl: 'Anong numero ang susunod sa pagkakasunud-sunod?',
  th: 'ตัวเลขถัดไปในลำดับคืออะไร?',
  mi: 'He aha te tau e whai ake nei i roto i te raupapa?',
  'zh-hant': '這個數列中下一個數字是什麼？',
  vi: 'Số tiếp theo trong dãy là gì?',
  cy: "Pa rif sy'n dod nesaf yn y dilyniant?",
};

// ─── Keyword Challenge Data ──────────────────────────────────────────────────

const LANGUAGE_NAMES = {
  en: 'English', cs: 'Czech', nl: 'Dutch', fi: 'Finnish', fr: 'French',
  de: 'German', he: 'Hebrew', hi: 'Hindi', id: 'Indonesian', ga: 'Irish',
  it: 'Italian', ja: 'Japanese', ko: 'Korean', ms: 'Malay', no: 'Norwegian',
  pl: 'Polish', pt: 'Portuguese', ru: 'Russian', zh: 'Chinese', es: 'Spanish',
  sv: 'Swedish', ta: 'Tamil', tl: 'Filipino', th: 'Thai', mi: 'Māori',
  'zh-hant': 'Chinese', vi: 'Vietnamese', cy: 'Welsh',
};

// Prompt template: {wordLang} = language name, {word} = foreign word
const KEYWORD_PROMPT = {
  en: 'Select the English meaning of the {wordLang} word "{word}":',
  cs: 'Vyberte anglický překlad {wordLang}ského slova „{word}":',
  nl: 'Kies de Engelse betekenis van het {wordLang}se woord «{word}»:',
  fi: 'Valitse sanan "{word}" ({wordLang}) englanninkielinen merkitys:',
  fr: 'Sélectionnez le sens anglais du mot {wordLang} «\u202f{word}\u202f»\u00a0:',
  de: 'Wählen Sie die englische Bedeutung des {wordLang}en Worts „{word}":',
  he: 'בחר/י את המשמעות באנגלית של מילת ה{wordLang} „{word}":',
  hi: '{wordLang} के शब्द "{word}" का अंग्रेजी अर्थ चुनें:',
  id: 'Pilih arti bahasa Inggris dari kata {wordLang} "{word}":',
  ga: 'Roghnaigh chiall Bhéarla an fhocail {wordLang} «{word}»:',
  it: 'Seleziona il significato inglese della parola {wordLang} «{word}»:',
  ja: '{wordLang}語の「{word}」の英語の意味を選んでください：',
  ko: '{wordLang}어 단어 「{word}」의 영어 의미를 선택하세요:',
  ms: 'Pilih makna Inggeris bagi perkataan {wordLang} "{word}":',
  no: 'Velg den engelske betydningen av det {wordLang}e ordet «{word}»:',
  pl: 'Wybierz angielskie znaczenie słowa {wordLang}skiego „{word}":',
  pt: 'Selecione o significado em inglês da palavra {wordLang} «{word}»:',
  ru: 'Выберите английское значение слова на {wordLang}ском «{word}»:',
  zh: '请选择{wordLang}语单词"{word}"的英语含义：',
  es: 'Selecciona el significado en inglés de la palabra {wordLang} «{word}»:',
  sv: 'Välj den engelska betydelsen av det {wordLang}ska ordet «{word}»:',
  ta: '{wordLang} வார்த்தை "{word}" இன் ஆங்கில அர்த்தத்தைத் தேர்ந்தெடுக்கவும்:',
  tl: 'Piliin ang kahulugan sa Ingles ng salitang {wordLang} "{word}":',
  th: 'เลือกความหมายภาษาอังกฤษของคำ{wordLang} "{word}":',
  mi: 'Tīpakohia te tikanga Ingarihi o te kupu {wordLang} «{word}»:',
  'zh-hant': '請選擇{wordLang}語詞彙「{word}」的英語含義：',
  vi: 'Chọn nghĩa tiếng Anh của từ tiếng {wordLang} "{word}":',
  cy: 'Dewiswch ystyr Saesneg y gair {wordLang} «{word}»:',
};

// Common words with translations across all 28 supported languages
const WORD_POOL = [
  {
    en: 'apple',
    cs: 'jablko', nl: 'appel', fi: 'omena', fr: 'pomme', de: 'Apfel',
    he: 'תפוח', hi: 'सेब', id: 'apel', ga: 'úll', it: 'mela',
    ja: 'りんご', ko: '사과', ms: 'epal', no: 'eple', pl: 'jabłko',
    pt: 'maçã', ru: 'яблоко', zh: '苹果', es: 'manzana', sv: 'äpple',
    ta: 'ஆப்பிள்', tl: 'mansanas', th: 'แอปเปิ้ล', mi: 'āporo',
    'zh-hant': '蘋果', vi: 'táo', cy: 'afal',
  },
  {
    en: 'water',
    cs: 'voda', nl: 'water', fi: 'vesi', fr: 'eau', de: 'Wasser',
    he: 'מים', hi: 'पानी', id: 'air', ga: 'uisce', it: 'acqua',
    ja: '水', ko: '물', ms: 'air', no: 'vann', pl: 'woda',
    pt: 'água', ru: 'вода', zh: '水', es: 'agua', sv: 'vatten',
    ta: 'தண்ணீர்', tl: 'tubig', th: 'น้ำ', mi: 'wai',
    'zh-hant': '水', vi: 'nước', cy: 'dŵr',
  },
  {
    en: 'book',
    cs: 'kniha', nl: 'boek', fi: 'kirja', fr: 'livre', de: 'Buch',
    he: 'ספר', hi: 'किताब', id: 'buku', ga: 'leabhar', it: 'libro',
    ja: '本', ko: '책', ms: 'buku', no: 'bok', pl: 'książka',
    pt: 'livro', ru: 'книга', zh: '书', es: 'libro', sv: 'bok',
    ta: 'புத்தகம்', tl: 'libro', th: 'หนังสือ', mi: 'pukapuka',
    'zh-hant': '書', vi: 'sách', cy: 'llyfr',
  },
  {
    en: 'sun',
    cs: 'slunce', nl: 'zon', fi: 'aurinko', fr: 'soleil', de: 'Sonne',
    he: 'שמש', hi: 'सूरज', id: 'matahari', ga: 'grian', it: 'sole',
    ja: '太陽', ko: '태양', ms: 'matahari', no: 'sol', pl: 'słońce',
    pt: 'sol', ru: 'солнце', zh: '太阳', es: 'sol', sv: 'sol',
    ta: 'சூரியன்', tl: 'araw', th: 'ดวงอาทิตย์', mi: 'rā',
    'zh-hant': '太陽', vi: 'mặt trời', cy: 'haul',
  },
  {
    en: 'cat',
    cs: 'kočka', nl: 'kat', fi: 'kissa', fr: 'chat', de: 'Katze',
    he: 'חתול', hi: 'बिल्ली', id: 'kucing', ga: 'cat', it: 'gatto',
    ja: '猫', ko: '고양이', ms: 'kucing', no: 'katt', pl: 'kot',
    pt: 'gato', ru: 'кошка', zh: '猫', es: 'gato', sv: 'katt',
    ta: 'பூனை', tl: 'pusa', th: 'แมว', mi: 'ngeru',
    'zh-hant': '貓', vi: 'mèo', cy: 'cath',
  },
  {
    en: 'house',
    cs: 'dům', nl: 'huis', fi: 'talo', fr: 'maison', de: 'Haus',
    he: 'בית', hi: 'घर', id: 'rumah', ga: 'teach', it: 'casa',
    ja: '家', ko: '집', ms: 'rumah', no: 'hus', pl: 'dom',
    pt: 'casa', ru: 'дом', zh: '房子', es: 'casa', sv: 'hus',
    ta: 'வீடு', tl: 'bahay', th: 'บ้าน', mi: 'whare',
    'zh-hant': '房子', vi: 'nhà', cy: 'tŷ',
  },
  {
    en: 'tree',
    cs: 'strom', nl: 'boom', fi: 'puu', fr: 'arbre', de: 'Baum',
    he: 'עץ', hi: 'पेड़', id: 'pohon', ga: 'crann', it: 'albero',
    ja: '木', ko: '나무', ms: 'pokok', no: 'tre', pl: 'drzewo',
    pt: 'árvore', ru: 'дерево', zh: '树', es: 'árbol', sv: 'träd',
    ta: 'மரம்', tl: 'puno', th: 'ต้นไม้', mi: 'rākau',
    'zh-hant': '樹', vi: 'cây', cy: 'coeden',
  },
  {
    en: 'fish',
    cs: 'ryba', nl: 'vis', fi: 'kala', fr: 'poisson', de: 'Fisch',
    he: 'דג', hi: 'मछली', id: 'ikan', ga: 'iasc', it: 'pesce',
    ja: '魚', ko: '물고기', ms: 'ikan', no: 'fisk', pl: 'ryba',
    pt: 'peixe', ru: 'рыба', zh: '鱼', es: 'pez', sv: 'fisk',
    ta: 'மீன்', tl: 'isda', th: 'ปลา', mi: 'ika',
    'zh-hant': '魚', vi: 'cá', cy: 'pysgodyn',
  },
  {
    en: 'moon',
    cs: 'měsíc', nl: 'maan', fi: 'kuu', fr: 'lune', de: 'Mond',
    he: 'ירח', hi: 'चाँद', id: 'bulan', ga: 'gealach', it: 'luna',
    ja: '月', ko: '달', ms: 'bulan', no: 'måne', pl: 'księżyc',
    pt: 'lua', ru: 'луна', zh: '月亮', es: 'luna', sv: 'måne',
    ta: 'நிலவு', tl: 'buwan', th: 'พระจันทร์', mi: 'marama',
    'zh-hant': '月亮', vi: 'mặt trăng', cy: 'lleuad',
  },
  {
    en: 'flower',
    cs: 'květ', nl: 'bloem', fi: 'kukka', fr: 'fleur', de: 'Blume',
    he: 'פרח', hi: 'फूल', id: 'bunga', ga: 'bláth', it: 'fiore',
    ja: '花', ko: '꽃', ms: 'bunga', no: 'blomst', pl: 'kwiat',
    pt: 'flor', ru: 'цветок', zh: '花', es: 'flor', sv: 'blomma',
    ta: 'பூ', tl: 'bulaklak', th: 'ดอกไม้', mi: 'putiputi',
    'zh-hant': '花', vi: 'hoa', cy: 'blodyn',
  },
];

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
    charTarget: null,
    payload: {
      mode: 'match',
      correctOption,
    },
  };
}

// ─── Puzzle Challenge (number sequences, 25%) ────────────────────────────────

function createPuzzleChallenge(lang) {
  const prompt = PUZZLE_NEXT_PROMPT[lang] || PUZZLE_NEXT_PROMPT.en;
  const seqType = randomInt(0, 4);

  let sequence;
  let correctNext;

  if (seqType === 0) {
    // Arithmetic: a, a+d, a+2d, a+3d, a+4d → a+5d
    const a = randomInt(1, 10);
    const d = randomInt(2, 8);
    sequence = [a, a + d, a + 2 * d, a + 3 * d, a + 4 * d];
    correctNext = a + 5 * d;
  } else if (seqType === 1) {
    // Geometric ×2: a, 2a, 4a, 8a, 16a → 32a
    const a = randomInt(1, 4);
    sequence = [a, 2 * a, 4 * a, 8 * a, 16 * a];
    correctNext = 32 * a;
  } else if (seqType === 2) {
    // Square numbers: m², (m+1)², ... → (m+5)²
    const m = randomInt(1, 5);
    sequence = [m ** 2, (m + 1) ** 2, (m + 2) ** 2, (m + 3) ** 2, (m + 4) ** 2];
    correctNext = (m + 5) ** 2;
  } else if (seqType === 3) {
    // Triangular: T(m) = m(m+1)/2
    const m = randomInt(1, 6);
    sequence = [
      (m * (m + 1)) / 2, ((m + 1) * (m + 2)) / 2, ((m + 2) * (m + 3)) / 2,
      ((m + 3) * (m + 4)) / 2, ((m + 4) * (m + 5)) / 2,
    ];
    correctNext = ((m + 5) * (m + 6)) / 2;
  } else {
    // Fibonacci-like: f0=a, f1=b, f(n)=f(n-1)+f(n-2)
    const a = randomInt(1, 4);
    const b = randomInt(a + 1, a + 5);
    sequence = [a, b, a + b, a + 2 * b, 2 * a + 3 * b];
    correctNext = 3 * a + 5 * b;
  }

  const correctOptStr = String(correctNext);
  const seqStr = sequence.join(', ') + ', ___';

  // 3 plausible distractors close to the correct answer
  const candidateOffsets = shuffleArray([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7]);
  const distractors = [];
  for (const offset of candidateOffsets) {
    const candidate = correctNext + offset;
    if (candidate > 0 && String(candidate) !== correctOptStr && !distractors.includes(String(candidate))) {
      distractors.push(String(candidate));
      if (distractors.length === 3) break;
    }
  }

  return {
    question: `${prompt}\n${seqStr}`,
    options: shuffleArray([correctOptStr, ...distractors]),
    charTarget: null,
    payload: { mode: 'puzzle', correctOption: correctOptStr },
  };
}

// ─── Keyword Challenge (multilingual word recognition, 25%) ──────────────────

function createKeywordChallenge(lang) {
  // Pick a random non-English language for the foreign word
  const nonEnglishLangs = [...SUPPORTED_LANGS].filter((l) => l !== 'en');
  const wordLangCode = nonEnglishLangs[randomInt(0, nonEnglishLangs.length - 1)];
  const wordLangName = LANGUAGE_NAMES[wordLangCode] || wordLangCode;

  // Pick a random word entry
  const wordEntry = WORD_POOL[randomInt(0, WORD_POOL.length - 1)];
  const foreignWord = wordEntry[wordLangCode] || wordEntry.en;
  const correctAnswer = wordEntry.en;

  // 3 English distractors from the remaining words
  const distPool = shuffleArray(WORD_POOL.filter((w) => w.en !== correctAnswer));
  const distractors = distPool.slice(0, 3).map((w) => w.en);

  const promptTemplate = KEYWORD_PROMPT[lang] || KEYWORD_PROMPT.en;
  const question = promptTemplate
    .replace('{wordLang}', wordLangName)
    .replace('{word}', foreignWord);

  return {
    question,
    options: shuffleArray([correctAnswer, ...distractors]),
    charTarget: null,
    payload: { mode: 'keyword', correctOption: correctAnswer },
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

    // 25% math | 25% puzzle | 25% keyword | 25% char
    const roll = randomInt(0, 3);
    let challenge;

    if (roll === 0) {
      const { a, b, op } = createOperationChallenge();
      challenge = {
        question: buildQuestionText(lang, a, b, op, false),
        options: null,
        charTarget: null,
        payload: { mode: 'math', a, b, op },
      };
    } else if (roll === 1) {
      challenge = createPuzzleChallenge(lang);
    } else if (roll === 2) {
      challenge = createKeywordChallenge(lang);
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

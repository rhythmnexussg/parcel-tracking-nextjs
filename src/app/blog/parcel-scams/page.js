'use client';

import React from "react";
import { useRouter } from "next/navigation";
import "../../../App.css";
import { useLanguage } from "../../../LanguageContext";
import { Navigation } from "../../../components/Navigation";
import i18n from "./i18n.generated.json";

function BackButton() {
  const { t } = useLanguage();
  const router = useRouter();
  return (
    <button onClick={() => router.back()} className="back-button">
      <span>&larr;</span> {t('backButton')}
    </button>
  );
}

const BlogPageLayout = ({ children }) => {
  const { t } = useLanguage();
  return (
    <>
      <Navigation />
      <div className="container mt-5">
        <BackButton />
        <div className="blog-content-card">{children}</div>
        <p className="text-muted">© {new Date().getFullYear()} Rhythm Nexus. {t('copyrightText')}</p>
      </div>
    </>
  );
};

function normalizeLang(input) {
  const lang = String(input || 'en').toLowerCase();
  if (lang === 'zh-hk' || lang === 'zh-tw') return 'zh-hant';
  if (lang === 'yue') return 'yue';
  if (lang.startsWith('zh')) return 'zh';
  const base = lang.split('-')[0];
  return i18n[lang] ? lang : (i18n[base] ? base : 'en');
}

const OUR_FAKE_DOMAINS = [
  { domain: 'rhythmnexus.com', pattern: 'wrongTld' },
  { domain: 'rhythmn3xus.org', pattern: 'letterSubstitution' },
  { domain: 'rhythmn3xus.com', pattern: 'wrongTldAndLetterSubstitution' },
  { domain: 'rhythmnexuss.org', pattern: 'extraLetter' },
  { domain: 'rhythm-nexus.org', pattern: 'hyphenInserted' },
  { domain: 'rhy7hmnexus.org', pattern: 'letterSubstitution' },
];

const SINGPOST = {
  official: ['singpost.com', 'speedpost.com'],
  fake: [
    { domain: 'singp0st.com', pattern: 'letterSubstitution' },
    { domain: 'sing-post.com', pattern: 'hyphenInserted' },
    { domain: 'singpost-delivery.com', pattern: 'extraWord' },
    { domain: 'mysingpost.com', pattern: 'extraPrefix' },
  ],
  warnings: [
    'smallRedeliveryPayment',
    'fullCreditCardDetails',
    'domainNotExactSingpostSpeedpost',
  ],
};

const USPS = {
  official: ['usps.com', 'tools.usps.com'],
  fake: [
    { domain: 'usps-tracking.com', pattern: 'extraWord' },
    { domain: 'usps-delivery.com', pattern: 'extraWord' },
    { domain: 'uspsdelivery.net', pattern: 'wrongTld' },
    { domain: 'usps.com-tracking.info', pattern: 'domainAppendTrick' },
  ],
  warnings: [
    'unexpectedPayToRelease',
    'trackingShouldResolveUspsTools',
    'unusualSensitiveIdentity',
  ],
};

const DHL = {
  official: ['dhl.com'],
  fake: [
    { domain: 'dhl-delivery.com', pattern: 'extraWord' },
    { domain: 'dhl-tracking.net', pattern: 'wrongTld' },
    { domain: 'dhI.com', pattern: 'capitalIInsteadOfL' },
    { domain: 'dhl.com.tracking-id.net', pattern: 'domainAppendTrick' },
  ],
  warnings: [
    'paymentViaUnknownLink',
    'trackingNotOnDhl',
    'brandingLooksRealDomainWrong',
  ],
};

const OTHER_CARRIERS = [
  { carrier: 'Australia Post', official: 'auspost.com.au', fake: 'auspost-tracking.com' },
  { carrier: 'Royal Mail', official: 'royalmail.com', fake: 'royal-mail.com' },
  { carrier: 'Canada Post', official: 'canadapost-postescanada.ca', fake: 'canadapost.com' },
  { carrier: 'Deutsche Post', official: 'deutschepost.de', fake: 'deutschepost-track.com' },
  { carrier: 'La Poste (France)', official: 'laposte.fr', fake: 'laposte-track.com' },
  { carrier: 'Poste Italiane', official: 'poste.it', fake: 'poste-italiane-track.com' },
  { carrier: 'India Post', official: 'indiapost.gov.in', fake: 'india-post-track.com' },
  { carrier: 'Pos Malaysia', official: 'pos.com.my', fake: 'posmalaysia-track.com' },
  { carrier: 'Correos (Spain)', official: 'correos.es', fake: 'correos-tracking.com' },
  { carrier: 'Swiss Post', official: 'post.ch', fake: 'swisspost-track.com' },
  { carrier: 'Japan Post', official: 'post.japanpost.jp', fake: 'japanpost-tracking.com' },
  { carrier: 'An Post', official: 'anpost.com', fake: 'an-post.com' },
  { carrier: 'NZ Post', official: 'nzpost.co.nz', fake: 'nzpost.com' },
];

const PATTERN_I18N = {
  en: {
    wrongTld: 'wrong TLD',
    extraLetter: 'extra letter',
    hyphenInserted: 'hyphen inserted',
    extraPrefix: 'extra prefix',
    domainAppendTrick: 'domain append trick',
    extraWord: 'extra word',
    capitalIInsteadOfL: 'capital I instead of l',
    letterSubstitution: 'letter substitution',
    wrongTldAndLetterSubstitution: 'wrong TLD + letter substitution',
  },
  cs: {
    wrongTld: 'špatná TLD',
    extraLetter: 'přidané písmeno',
    hyphenInserted: 'vložená pomlčka',
    extraPrefix: 'přidaný prefix',
    domainAppendTrick: 'trik s připojenou doménou',
    extraWord: 'přidané slovo',
    capitalIInsteadOfL: 'velké I místo malého l',
    letterSubstitution: 'záměna písmen',
    wrongTldAndLetterSubstitution: 'špatná TLD + záměna písmen',
  },
  nl: {
    wrongTld: 'verkeerde TLD',
    extraLetter: 'extra letter',
    hyphenInserted: 'koppelteken ingevoegd',
    extraPrefix: 'extra voorvoegsel',
    domainAppendTrick: 'domein-toevoegtruc',
    extraWord: 'extra woord',
    capitalIInsteadOfL: 'hoofdletter I in plaats van kleine l',
    letterSubstitution: 'lettervervanging',
    wrongTldAndLetterSubstitution: 'verkeerde TLD + lettervervanging',
  },
  fi: {
    wrongTld: 'väärä TLD',
    extraLetter: 'ylimääräinen kirjain',
    hyphenInserted: 'väliviiva lisätty',
    extraPrefix: 'ylimääräinen etuliite',
    domainAppendTrick: 'domainin liitoskikka',
    extraWord: 'ylimääräinen sana',
    capitalIInsteadOfL: 'iso I pienen l:n sijaan',
    letterSubstitution: 'kirjaimen korvaus',
    wrongTldAndLetterSubstitution: 'väärä TLD + kirjaimen korvaus',
  },
  fr: {
    wrongTld: 'mauvaise TLD',
    extraLetter: 'lettre en plus',
    hyphenInserted: 'tiret ajouté',
    extraPrefix: 'préfixe ajouté',
    domainAppendTrick: 'astuce d’ajout de domaine',
    extraWord: 'mot ajouté',
    capitalIInsteadOfL: 'I majuscule au lieu de l minuscule',
    letterSubstitution: 'substitution de lettre',
    wrongTldAndLetterSubstitution: 'mauvaise TLD + substitution de lettre',
  },
  de: {
    wrongTld: 'falsche TLD',
    extraLetter: 'zusätzlicher Buchstabe',
    hyphenInserted: 'Bindestrich eingefügt',
    extraPrefix: 'zusätzlicher Präfix',
    domainAppendTrick: 'Domain-Anhängtrick',
    extraWord: 'zusätzliches Wort',
    capitalIInsteadOfL: 'großes I statt kleinem l',
    letterSubstitution: 'Buchstabenersetzung',
    wrongTldAndLetterSubstitution: 'falsche TLD + Buchstabenersetzung',
  },
  he: {
    wrongTld: 'סיומת דומיין שגויה (TLD)',
    extraLetter: 'אות נוספת',
    hyphenInserted: 'נוסף מקף',
    extraPrefix: 'קידומת נוספת',
    domainAppendTrick: 'טריק הוספת דומיין',
    extraWord: 'מילה נוספת',
    capitalIInsteadOfL: 'I גדולה במקום l קטנה',
    letterSubstitution: 'החלפת אות',
    wrongTldAndLetterSubstitution: 'סיומת שגויה + החלפת אות',
  },
  hi: {
    wrongTld: 'गलत TLD',
    extraLetter: 'अतिरिक्त अक्षर',
    hyphenInserted: 'हाइफ़न जोड़ा गया',
    extraPrefix: 'अतिरिक्त प्रीफ़िक्स',
    domainAppendTrick: 'डोमेन जोड़ने की ट्रिक',
    extraWord: 'अतिरिक्त शब्द',
    capitalIInsteadOfL: 'छोटे l की जगह बड़ा I',
    letterSubstitution: 'अक्षर प्रतिस्थापन',
    wrongTldAndLetterSubstitution: 'गलत TLD + अक्षर प्रतिस्थापन',
  },
  id: {
    wrongTld: 'TLD salah',
    extraLetter: 'huruf tambahan',
    hyphenInserted: 'tanda hubung ditambahkan',
    extraPrefix: 'prefiks tambahan',
    domainAppendTrick: 'trik menempelkan domain',
    extraWord: 'kata tambahan',
    capitalIInsteadOfL: 'huruf I besar menggantikan l kecil',
    letterSubstitution: 'penggantian huruf',
    wrongTldAndLetterSubstitution: 'TLD salah + penggantian huruf',
  },
  ga: {
    wrongTld: 'TLD mícheart',
    extraLetter: 'litir bhreise',
    hyphenInserted: 'fleiscín curtha isteach',
    extraPrefix: 'réimír bhreise',
    domainAppendTrick: 'cleas iarscríbhinn fearainn',
    extraWord: 'focal breise',
    capitalIInsteadOfL: 'I mór in áit l beag',
    letterSubstitution: 'ionadú litreach',
    wrongTldAndLetterSubstitution: 'TLD mícheart + ionadú litreach',
  },
  it: {
    wrongTld: 'TLD errato',
    extraLetter: 'lettera extra',
    hyphenInserted: 'trattino inserito',
    extraPrefix: 'prefisso extra',
    domainAppendTrick: 'trucco di appendere dominio',
    extraWord: 'parola extra',
    capitalIInsteadOfL: 'I maiuscola al posto di l minuscola',
    letterSubstitution: 'sostituzione di lettera',
    wrongTldAndLetterSubstitution: 'TLD errato + sostituzione di lettera',
  },
  ja: {
    wrongTld: 'TLD が違う',
    extraLetter: '文字が1つ多い',
    hyphenInserted: 'ハイフン挿入',
    extraPrefix: '接頭語が追加',
    domainAppendTrick: 'ドメイン付加トリック',
    extraWord: '余計な単語',
    capitalIInsteadOfL: '小文字 l の代わりに大文字 I',
    letterSubstitution: '文字置換',
    wrongTldAndLetterSubstitution: 'TLD違い + 文字置換',
  },
  ko: {
    wrongTld: '잘못된 TLD',
    extraLetter: '추가 문자',
    hyphenInserted: '하이픈 삽입',
    extraPrefix: '추가 접두사',
    domainAppendTrick: '도메인 덧붙이기 수법',
    extraWord: '추가 단어',
    capitalIInsteadOfL: '소문자 l 대신 대문자 I',
    letterSubstitution: '문자 치환',
    wrongTldAndLetterSubstitution: '잘못된 TLD + 문자 치환',
  },
  ms: {
    wrongTld: 'TLD salah',
    extraLetter: 'huruf tambahan',
    hyphenInserted: 'tanda sempang dimasukkan',
    extraPrefix: 'awalan tambahan',
    domainAppendTrick: 'helah tambah domain',
    extraWord: 'perkataan tambahan',
    capitalIInsteadOfL: 'I besar menggantikan l kecil',
    letterSubstitution: 'penggantian huruf',
    wrongTldAndLetterSubstitution: 'TLD salah + penggantian huruf',
  },
  no: {
    wrongTld: 'feil TLD',
    extraLetter: 'ekstra bokstav',
    hyphenInserted: 'bindestrek satt inn',
    extraPrefix: 'ekstra prefiks',
    domainAppendTrick: 'domene-tilleggstriks',
    extraWord: 'ekstra ord',
    capitalIInsteadOfL: 'stor I i stedet for liten l',
    letterSubstitution: 'bokstavbytte',
    wrongTldAndLetterSubstitution: 'feil TLD + bokstavbytte',
  },
  pl: {
    wrongTld: 'zły TLD',
    extraLetter: 'dodatkowa litera',
    hyphenInserted: 'wstawiony myślnik',
    extraPrefix: 'dodatkowy prefiks',
    domainAppendTrick: 'sztuczka z dopięciem domeny',
    extraWord: 'dodatkowe słowo',
    capitalIInsteadOfL: 'wielkie I zamiast małego l',
    letterSubstitution: 'podmiana litery',
    wrongTldAndLetterSubstitution: 'zły TLD + podmiana litery',
  },
  pt: {
    wrongTld: 'TLD incorreto',
    extraLetter: 'letra extra',
    hyphenInserted: 'hífen inserido',
    extraPrefix: 'prefixo extra',
    domainAppendTrick: 'truque de anexar domínio',
    extraWord: 'palavra extra',
    capitalIInsteadOfL: 'I maiúsculo no lugar de l minúsculo',
    letterSubstitution: 'substituição de letra',
    wrongTldAndLetterSubstitution: 'TLD incorreto + substituição de letra',
  },
  ru: {
    wrongTld: 'неверная TLD',
    extraLetter: 'лишняя буква',
    hyphenInserted: 'вставлен дефис',
    extraPrefix: 'добавлен префикс',
    domainAppendTrick: 'трюк с добавлением домена',
    extraWord: 'лишнее слово',
    capitalIInsteadOfL: 'заглавная I вместо строчной l',
    letterSubstitution: 'подмена буквы',
    wrongTldAndLetterSubstitution: 'неверная TLD + подмена буквы',
  },
  zh: {
    wrongTld: '错误顶级域名（TLD）',
    extraLetter: '多了一个字母',
    hyphenInserted: '插入了连字符',
    extraPrefix: '添加了前缀',
    domainAppendTrick: '域名追加伪装',
    extraWord: '添加了额外单词',
    capitalIInsteadOfL: '用大写 I 代替小写 l',
    letterSubstitution: '字母替换',
    wrongTldAndLetterSubstitution: '错误TLD + 字母替换',
  },
  es: {
    wrongTld: 'TLD incorrecto',
    extraLetter: 'letra extra',
    hyphenInserted: 'guion insertado',
    extraPrefix: 'prefijo extra',
    domainAppendTrick: 'truco de anexar dominio',
    extraWord: 'palabra extra',
    capitalIInsteadOfL: 'I mayúscula en lugar de l minúscula',
    letterSubstitution: 'sustitución de letra',
    wrongTldAndLetterSubstitution: 'TLD incorrecto + sustitución de letra',
  },
  sv: {
    wrongTld: 'fel TLD',
    extraLetter: 'extra bokstav',
    hyphenInserted: 'bindestreck infogat',
    extraPrefix: 'extra prefix',
    domainAppendTrick: 'domänpåhängstrick',
    extraWord: 'extra ord',
    capitalIInsteadOfL: 'stort I i stället för litet l',
    letterSubstitution: 'bokstavsersättning',
    wrongTldAndLetterSubstitution: 'fel TLD + bokstavsersättning',
  },
  ta: {
    wrongTld: 'தவறான TLD',
    extraLetter: 'கூடுதல் எழுத்து',
    hyphenInserted: 'ஹைஃபன் சேர்க்கப்பட்டது',
    extraPrefix: 'கூடுதல் முன்இணைப்பு',
    domainAppendTrick: 'டொமைன் இணைப்பு தந்திரம்',
    extraWord: 'கூடுதல் சொல்',
    capitalIInsteadOfL: 'சிறிய l க்கு பதில் பெரிய I',
    letterSubstitution: 'எழுத்து மாற்றம்',
    wrongTldAndLetterSubstitution: 'தவறான TLD + எழுத்து மாற்றம்',
  },
  tl: {
    wrongTld: 'maling TLD',
    extraLetter: 'sobrang letra',
    hyphenInserted: 'may idinagdag na gitling',
    extraPrefix: 'sobrang prefix',
    domainAppendTrick: 'trick na pagdugtong ng domain',
    extraWord: 'sobrang salita',
    capitalIInsteadOfL: 'malaking I imbes na maliit na l',
    letterSubstitution: 'pagpapalit ng letra',
    wrongTldAndLetterSubstitution: 'maling TLD + pagpapalit ng letra',
  },
  th: {
    wrongTld: 'TLD ไม่ถูกต้อง',
    extraLetter: 'มีตัวอักษรเกิน',
    hyphenInserted: 'แทรกยัติภังค์',
    extraPrefix: 'เพิ่มคำนำหน้า',
    domainAppendTrick: 'กลลวงต่อท้ายโดเมน',
    extraWord: 'มีคำเพิ่ม',
    capitalIInsteadOfL: 'ใช้ I ใหญ่แทน l เล็ก',
    letterSubstitution: 'การแทนตัวอักษร',
    wrongTldAndLetterSubstitution: 'TLD ผิด + การแทนตัวอักษร',
  },
  mi: {
    wrongTld: 'TLD hē',
    extraLetter: 'reta tāpiri',
    hyphenInserted: 'tohu-wehe kua tāpirihia',
    extraPrefix: 'kupu-mua tāpiri',
    domainAppendTrick: 'rautaki tāpiri rohe',
    extraWord: 'kupu tāpiri',
    capitalIInsteadOfL: 'I matua hei utu mō te l iti',
    letterSubstitution: 'whakakapi reta',
    wrongTldAndLetterSubstitution: 'TLD hē + whakakapi reta',
  },
  'zh-hant': {
    wrongTld: '錯誤頂級網域（TLD）',
    extraLetter: '多了一個字母',
    hyphenInserted: '插入了連字符',
    extraPrefix: '加入了前綴',
    domainAppendTrick: '網域追加偽裝',
    extraWord: '加入了額外字詞',
    capitalIInsteadOfL: '以大寫 I 取代小寫 l',
    letterSubstitution: '字母替換',
    wrongTldAndLetterSubstitution: '錯誤TLD + 字母替換',
  },
  vi: {
    wrongTld: 'TLD sai',
    extraLetter: 'thêm ký tự',
    hyphenInserted: 'chèn dấu gạch nối',
    extraPrefix: 'thêm tiền tố',
    domainAppendTrick: 'mẹo nối thêm tên miền',
    extraWord: 'thêm từ',
    capitalIInsteadOfL: 'chữ I hoa thay cho l thường',
    letterSubstitution: 'thay ký tự',
    wrongTldAndLetterSubstitution: 'TLD sai + thay ký tự',
  },
  cy: {
    wrongTld: 'TLD anghywir',
    extraLetter: 'llythyren ychwanegol',
    hyphenInserted: 'cysylltnod wedi’i fewnosod',
    extraPrefix: 'rhagddodiad ychwanegol',
    domainAppendTrick: 'tric atodi parth',
    extraWord: 'gair ychwanegol',
    capitalIInsteadOfL: 'I fawr yn lle l fach',
    letterSubstitution: 'amnewid llythyren',
    wrongTldAndLetterSubstitution: 'TLD anghywir + amnewid llythyren',
  },
  yue: {
    wrongTld: '錯誤頂級網域（TLD）',
    extraLetter: '多咗一個字母',
    hyphenInserted: '加咗連字符',
    extraPrefix: '加咗前綴',
    domainAppendTrick: '網域追加偽裝',
    extraWord: '加咗額外字詞',
    capitalIInsteadOfL: '用大寫 I 代替小寫 l',
    letterSubstitution: '字母替換',
    wrongTldAndLetterSubstitution: '錯誤TLD + 字母替換',
  },
};

const WARNING_I18N = {
  en: {
    smallRedeliveryPayment: 'SMS/email asks for a small redelivery payment',
    fullCreditCardDetails: 'Page requests full credit card details',
    domainNotExactSingpostSpeedpost: 'Domain is not exactly singpost.com or speedpost.com',
    unexpectedPayToRelease: 'Unexpected message asks you to pay to release package',
    trackingShouldResolveUspsTools: 'Tracking should resolve on usps.com or tools.usps.com',
    unusualSensitiveIdentity: 'Unusual forms ask for sensitive identity data',
    paymentViaUnknownLink: 'Payment request via unknown SMS/email link',
    trackingNotOnDhl: 'Tracking URL is not on dhl.com',
    brandingLooksRealDomainWrong: 'Branding looks real but domain is wrong',
  },
  cs: {
    smallRedeliveryPayment: 'SMS/e-mail žádá malý poplatek za opětovné doručení',
    fullCreditCardDetails: 'Stránka požaduje úplné údaje o platební kartě',
    domainNotExactSingpostSpeedpost: 'Doména není přesně singpost.com nebo speedpost.com',
    unexpectedPayToRelease: 'Nečekaná zpráva vás vyzývá k platbě za uvolnění zásilky',
    trackingShouldResolveUspsTools: 'Sledování má vést na usps.com nebo tools.usps.com',
    unusualSensitiveIdentity: 'Neobvyklé formuláře žádají citlivé identifikační údaje',
    paymentViaUnknownLink: 'Požadavek na platbu přes neznámý odkaz v SMS/e-mailu',
    trackingNotOnDhl: 'URL pro sledování není na dhl.com',
    brandingLooksRealDomainWrong: 'Branding vypadá skutečně, ale doména je špatně',
  },
  nl: {
    smallRedeliveryPayment: 'SMS/e-mail vraagt om een kleine herbezorgingsbetaling',
    fullCreditCardDetails: 'Pagina vraagt om volledige creditcardgegevens',
    domainNotExactSingpostSpeedpost: 'Domein is niet exact singpost.com of speedpost.com',
    unexpectedPayToRelease: 'Onverwacht bericht vraagt betaling om pakket vrij te geven',
    trackingShouldResolveUspsTools: 'Tracking moet openen op usps.com of tools.usps.com',
    unusualSensitiveIdentity: 'Ongewone formulieren vragen om gevoelige identiteitsgegevens',
    paymentViaUnknownLink: 'Betalingsverzoek via onbekende SMS/e-maillink',
    trackingNotOnDhl: 'Tracking-URL staat niet op dhl.com',
    brandingLooksRealDomainWrong: 'Branding lijkt echt, maar domein is fout',
  },
  fi: {
    smallRedeliveryPayment: 'SMS/sähköposti pyytää pientä uudelleentoimitusmaksua',
    fullCreditCardDetails: 'Sivu pyytää täydet luottokorttitiedot',
    domainNotExactSingpostSpeedpost: 'Verkkotunnus ei ole täsmälleen singpost.com tai speedpost.com',
    unexpectedPayToRelease: 'Yllättävä viesti pyytää maksamaan paketin vapauttamiseksi',
    trackingShouldResolveUspsTools: 'Seurannan tulisi avautua usps.com- tai tools.usps.com-osoitteessa',
    unusualSensitiveIdentity: 'Poikkeavat lomakkeet pyytävät arkaluonteisia henkilötietoja',
    paymentViaUnknownLink: 'Maksupyyntö tuntemattoman SMS-/sähköpostilinkin kautta',
    trackingNotOnDhl: 'Seuranta-URL ei ole dhl.com-verkkoalueella',
    brandingLooksRealDomainWrong: 'Ulkoasu näyttää aidolta, mutta verkkotunnus on väärä',
  },
  fr: {
    smallRedeliveryPayment: 'Le SMS/e-mail demande un petit paiement de re-livraison',
    fullCreditCardDetails: 'La page demande les informations complètes de carte bancaire',
    domainNotExactSingpostSpeedpost: 'Le domaine n’est pas exactement singpost.com ou speedpost.com',
    unexpectedPayToRelease: 'Message inattendu demandant de payer pour débloquer le colis',
    trackingShouldResolveUspsTools: 'Le suivi doit pointer vers usps.com ou tools.usps.com',
    unusualSensitiveIdentity: 'Des formulaires inhabituels demandent des données d’identité sensibles',
    paymentViaUnknownLink: 'Demande de paiement via un lien SMS/e-mail inconnu',
    trackingNotOnDhl: 'L’URL de suivi n’est pas sur dhl.com',
    brandingLooksRealDomainWrong: 'L’apparence semble réelle, mais le domaine est faux',
  },
  de: {
    smallRedeliveryPayment: 'SMS/E-Mail verlangt eine kleine Nachzustellungsgebühr',
    fullCreditCardDetails: 'Seite fordert vollständige Kreditkartendaten an',
    domainNotExactSingpostSpeedpost: 'Domain ist nicht exakt singpost.com oder speedpost.com',
    unexpectedPayToRelease: 'Unerwartete Nachricht verlangt Zahlung zur Freigabe des Pakets',
    trackingShouldResolveUspsTools: 'Tracking sollte auf usps.com oder tools.usps.com öffnen',
    unusualSensitiveIdentity: 'Ungewöhnliche Formulare verlangen sensible Identitätsdaten',
    paymentViaUnknownLink: 'Zahlungsaufforderung über unbekannten SMS-/E-Mail-Link',
    trackingNotOnDhl: 'Tracking-URL liegt nicht auf dhl.com',
    brandingLooksRealDomainWrong: 'Branding wirkt echt, aber die Domain ist falsch',
  },
  he: {
    smallRedeliveryPayment: 'הודעת SMS/אימייל מבקשת תשלום קטן למסירה מחדש',
    fullCreditCardDetails: 'העמוד מבקש פרטי כרטיס אשראי מלאים',
    domainNotExactSingpostSpeedpost: 'הדומיין אינו בדיוק singpost.com או speedpost.com',
    unexpectedPayToRelease: 'הודעה לא צפויה מבקשת תשלום לשחרור החבילה',
    trackingShouldResolveUspsTools: 'קישור המעקב צריך להיפתח ב-usps.com או tools.usps.com',
    unusualSensitiveIdentity: 'טפסים חריגים מבקשים נתוני זיהוי רגישים',
    paymentViaUnknownLink: 'בקשת תשלום דרך קישור SMS/אימייל לא מוכר',
    trackingNotOnDhl: 'כתובת המעקב אינה ב-dhl.com',
    brandingLooksRealDomainWrong: 'המיתוג נראה אמיתי אך הדומיין שגוי',
  },
  hi: {
    smallRedeliveryPayment: 'SMS/ईमेल में छोटी री-डिलीवरी फीस मांगी जाती है',
    fullCreditCardDetails: 'पेज पूर्ण क्रेडिट कार्ड विवरण मांगता है',
    domainNotExactSingpostSpeedpost: 'डोमेन ठीक singpost.com या speedpost.com नहीं है',
    unexpectedPayToRelease: 'अचानक संदेश पैकेज रिलीज़ करने के लिए भुगतान मांगता है',
    trackingShouldResolveUspsTools: 'ट्रैकिंग usps.com या tools.usps.com पर खुलनी चाहिए',
    unusualSensitiveIdentity: 'असामान्य फॉर्म संवेदनशील पहचान जानकारी मांगते हैं',
    paymentViaUnknownLink: 'अनजान SMS/ईमेल लिंक से भुगतान अनुरोध',
    trackingNotOnDhl: 'ट्रैकिंग URL dhl.com पर नहीं है',
    brandingLooksRealDomainWrong: 'ब्रांडिंग असली लगती है, लेकिन डोमेन गलत है',
  },
  id: {
    smallRedeliveryPayment: 'SMS/email meminta pembayaran kecil untuk pengiriman ulang',
    fullCreditCardDetails: 'Halaman meminta detail kartu kredit lengkap',
    domainNotExactSingpostSpeedpost: 'Domain tidak persis singpost.com atau speedpost.com',
    unexpectedPayToRelease: 'Pesan tak terduga meminta Anda membayar untuk melepas paket',
    trackingShouldResolveUspsTools: 'Pelacakan harus menuju usps.com atau tools.usps.com',
    unusualSensitiveIdentity: 'Formulir tidak biasa meminta data identitas sensitif',
    paymentViaUnknownLink: 'Permintaan pembayaran melalui tautan SMS/email yang tidak dikenal',
    trackingNotOnDhl: 'URL pelacakan tidak berada di dhl.com',
    brandingLooksRealDomainWrong: 'Branding terlihat asli, tetapi domain salah',
  },
  ga: {
    smallRedeliveryPayment: 'Iarrann SMS/r-phost táille bheag athsheachadta',
    fullCreditCardDetails: 'Iarrann an leathanach sonraí iomlána cárta creidmheasa',
    domainNotExactSingpostSpeedpost: 'Níl an fearann go díreach singpost.com ná speedpost.com',
    unexpectedPayToRelease: 'Iarrann teachtaireacht gan choinne íocaíocht chun an beartán a scaoileadh',
    trackingShouldResolveUspsTools: 'Ba chóir don rianú oscailt ar usps.com nó tools.usps.com',
    unusualSensitiveIdentity: 'Iarrann foirmeacha neamhghnácha sonraí íogaire aitheantais',
    paymentViaUnknownLink: 'Iarratas íocaíochta trí nasc SMS/r-phoist anaithnid',
    trackingNotOnDhl: 'Níl URL rianaithe ar dhl.com',
    brandingLooksRealDomainWrong: 'Tá cuma fíor ar an mbrandáil ach tá an fearann mícheart',
  },
  it: {
    smallRedeliveryPayment: 'SMS/e-mail chiede un piccolo pagamento per riconsegna',
    fullCreditCardDetails: 'La pagina richiede i dati completi della carta di credito',
    domainNotExactSingpostSpeedpost: 'Il dominio non è esattamente singpost.com o speedpost.com',
    unexpectedPayToRelease: 'Messaggio inaspettato chiede di pagare per sbloccare il pacco',
    trackingShouldResolveUspsTools: 'Il tracking deve aprirsi su usps.com o tools.usps.com',
    unusualSensitiveIdentity: 'Moduli insoliti chiedono dati identificativi sensibili',
    paymentViaUnknownLink: 'Richiesta di pagamento tramite link SMS/e-mail sconosciuto',
    trackingNotOnDhl: 'L’URL di tracking non è su dhl.com',
    brandingLooksRealDomainWrong: 'Il branding sembra reale ma il dominio è sbagliato',
  },
  ja: {
    smallRedeliveryPayment: 'SMS/メールで少額の再配達料金を要求してくる',
    fullCreditCardDetails: 'ページがクレジットカードの全情報を要求する',
    domainNotExactSingpostSpeedpost: 'ドメインが singpost.com または speedpost.com と完全一致しない',
    unexpectedPayToRelease: '突然のメッセージで荷物解放の支払いを求める',
    trackingShouldResolveUspsTools: '追跡先は usps.com または tools.usps.com であるべき',
    unusualSensitiveIdentity: '不自然なフォームで機密性の高い本人情報を要求する',
    paymentViaUnknownLink: '不明なSMS/メールリンク経由で支払いを要求する',
    trackingNotOnDhl: '追跡URLが dhl.com 上にない',
    brandingLooksRealDomainWrong: '見た目は本物でもドメインが違う',
  },
  ko: {
    smallRedeliveryPayment: 'SMS/이메일로 소액 재배송 결제를 요구함',
    fullCreditCardDetails: '페이지가 신용카드 전체 정보를 요구함',
    domainNotExactSingpostSpeedpost: '도메인이 singpost.com 또는 speedpost.com과 정확히 일치하지 않음',
    unexpectedPayToRelease: '예상치 못한 메시지가 소포 해제를 위해 결제를 요구함',
    trackingShouldResolveUspsTools: '추적은 usps.com 또는 tools.usps.com으로 연결되어야 함',
    unusualSensitiveIdentity: '비정상적인 양식이 민감한 신원 정보를 요구함',
    paymentViaUnknownLink: '알 수 없는 SMS/이메일 링크를 통한 결제 요청',
    trackingNotOnDhl: '추적 URL이 dhl.com에 있지 않음',
    brandingLooksRealDomainWrong: '브랜딩은 진짜 같지만 도메인이 틀림',
  },
  ms: {
    smallRedeliveryPayment: 'SMS/e-mel meminta bayaran kecil penghantaran semula',
    fullCreditCardDetails: 'Halaman meminta butiran kad kredit penuh',
    domainNotExactSingpostSpeedpost: 'Domain bukan tepat singpost.com atau speedpost.com',
    unexpectedPayToRelease: 'Mesej tidak dijangka meminta anda membayar untuk melepaskan bungkusan',
    trackingShouldResolveUspsTools: 'Penjejakan sepatutnya dibuka pada usps.com atau tools.usps.com',
    unusualSensitiveIdentity: 'Borang luar biasa meminta data identiti sensitif',
    paymentViaUnknownLink: 'Permintaan bayaran melalui pautan SMS/e-mel yang tidak dikenali',
    trackingNotOnDhl: 'URL penjejakan bukan pada dhl.com',
    brandingLooksRealDomainWrong: 'Penjenamaan nampak asli tetapi domain salah',
  },
  no: {
    smallRedeliveryPayment: 'SMS/e-post ber om en liten omleveringsbetaling',
    fullCreditCardDetails: 'Siden ber om fullstendige kredittkortopplysninger',
    domainNotExactSingpostSpeedpost: 'Domenet er ikke nøyaktig singpost.com eller speedpost.com',
    unexpectedPayToRelease: 'Uventet melding ber deg betale for å frigjøre pakken',
    trackingShouldResolveUspsTools: 'Sporing skal gå til usps.com eller tools.usps.com',
    unusualSensitiveIdentity: 'Uvanlige skjemaer ber om sensitive identitetsdata',
    paymentViaUnknownLink: 'Betalingsforespørsel via ukjent SMS/e-post-lenke',
    trackingNotOnDhl: 'Sporings-URL er ikke på dhl.com',
    brandingLooksRealDomainWrong: 'Profilering ser ekte ut, men domenet er feil',
  },
  pl: {
    smallRedeliveryPayment: 'SMS/e-mail prosi o małą opłatę za ponowne doręczenie',
    fullCreditCardDetails: 'Strona żąda pełnych danych karty kredytowej',
    domainNotExactSingpostSpeedpost: 'Domena nie jest dokładnie singpost.com ani speedpost.com',
    unexpectedPayToRelease: 'Nieoczekiwana wiadomość prosi o płatność za wydanie paczki',
    trackingShouldResolveUspsTools: 'Śledzenie powinno prowadzić do usps.com lub tools.usps.com',
    unusualSensitiveIdentity: 'Nietypowe formularze proszą o wrażliwe dane tożsamości',
    paymentViaUnknownLink: 'Żądanie płatności przez nieznany link SMS/e-mail',
    trackingNotOnDhl: 'Adres śledzenia nie jest na dhl.com',
    brandingLooksRealDomainWrong: 'Branding wygląda prawdziwie, ale domena jest błędna',
  },
  pt: {
    smallRedeliveryPayment: 'SMS/e-mail pede pequeno pagamento de reentrega',
    fullCreditCardDetails: 'A página solicita dados completos do cartão de crédito',
    domainNotExactSingpostSpeedpost: 'O domínio não é exatamente singpost.com ou speedpost.com',
    unexpectedPayToRelease: 'Mensagem inesperada pede pagamento para liberar o pacote',
    trackingShouldResolveUspsTools: 'O rastreio deve abrir em usps.com ou tools.usps.com',
    unusualSensitiveIdentity: 'Formulários incomuns pedem dados sensíveis de identidade',
    paymentViaUnknownLink: 'Pedido de pagamento por link desconhecido em SMS/e-mail',
    trackingNotOnDhl: 'A URL de rastreio não está em dhl.com',
    brandingLooksRealDomainWrong: 'A marca parece real, mas o domínio está errado',
  },
  ru: {
    smallRedeliveryPayment: 'SMS/письмо просит небольшую оплату за повторную доставку',
    fullCreditCardDetails: 'Страница запрашивает полные данные банковской карты',
    domainNotExactSingpostSpeedpost: 'Домен не совпадает точно с singpost.com или speedpost.com',
    unexpectedPayToRelease: 'Неожиданное сообщение просит оплату за выпуск посылки',
    trackingShouldResolveUspsTools: 'Трекинг должен вести на usps.com или tools.usps.com',
    unusualSensitiveIdentity: 'Необычные формы просят чувствительные данные личности',
    paymentViaUnknownLink: 'Запрос оплаты через неизвестную ссылку SMS/почты',
    trackingNotOnDhl: 'URL отслеживания не на dhl.com',
    brandingLooksRealDomainWrong: 'Оформление выглядит реальным, но домен неверный',
  },
  zh: {
    smallRedeliveryPayment: '短信/邮件要求支付小额重新派送费用',
    fullCreditCardDetails: '页面要求填写完整信用卡信息',
    domainNotExactSingpostSpeedpost: '域名并非完全等于 singpost.com 或 speedpost.com',
    unexpectedPayToRelease: '突发消息要求付费才能放行包裹',
    trackingShouldResolveUspsTools: '追踪链接应指向 usps.com 或 tools.usps.com',
    unusualSensitiveIdentity: '异常表单要求提供敏感身份信息',
    paymentViaUnknownLink: '通过未知短信/邮件链接要求付款',
    trackingNotOnDhl: '追踪网址不在 dhl.com 域名下',
    brandingLooksRealDomainWrong: '品牌样式看似真实，但域名错误',
  },
  es: {
    smallRedeliveryPayment: 'SMS/correo solicita un pequeño pago por reentrega',
    fullCreditCardDetails: 'La página solicita datos completos de tarjeta de crédito',
    domainNotExactSingpostSpeedpost: 'El dominio no es exactamente singpost.com o speedpost.com',
    unexpectedPayToRelease: 'Mensaje inesperado pide pagar para liberar el paquete',
    trackingShouldResolveUspsTools: 'El seguimiento debe abrir en usps.com o tools.usps.com',
    unusualSensitiveIdentity: 'Formularios inusuales piden datos de identidad sensibles',
    paymentViaUnknownLink: 'Solicitud de pago mediante enlace desconocido de SMS/correo',
    trackingNotOnDhl: 'La URL de seguimiento no está en dhl.com',
    brandingLooksRealDomainWrong: 'La imagen parece real, pero el dominio es incorrecto',
  },
  sv: {
    smallRedeliveryPayment: 'SMS/e-post ber om en liten omleveransavgift',
    fullCreditCardDetails: 'Sidan begär fullständiga kreditkortsuppgifter',
    domainNotExactSingpostSpeedpost: 'Domänen är inte exakt singpost.com eller speedpost.com',
    unexpectedPayToRelease: 'Oväntat meddelande ber dig betala för att frigöra paketet',
    trackingShouldResolveUspsTools: 'Spårning ska gå till usps.com eller tools.usps.com',
    unusualSensitiveIdentity: 'Ovanliga formulär begär känsliga identitetsuppgifter',
    paymentViaUnknownLink: 'Betalningsbegäran via okänd SMS-/e-postlänk',
    trackingNotOnDhl: 'Spårnings-URL finns inte på dhl.com',
    brandingLooksRealDomainWrong: 'Utseendet ser äkta ut men domänen är fel',
  },
  ta: {
    smallRedeliveryPayment: 'SMS/மின்னஞ்சல் சிறிய மறுவிநியோக கட்டணம் கேட்கிறது',
    fullCreditCardDetails: 'பக்கம் முழு கிரெடிட் கார்டு விவரங்களை கேட்கிறது',
    domainNotExactSingpostSpeedpost: 'டொமைன் singpost.com அல்லது speedpost.com என்பதுடன் துல்லியமாக பொருந்தவில்லை',
    unexpectedPayToRelease: 'எதிர்பாராத செய்தி பார்சலை விடுவிக்க பணம் கேட்கிறது',
    trackingShouldResolveUspsTools: 'டிராக்கிங் usps.com அல்லது tools.usps.com-இல் திறக்க வேண்டும்',
    unusualSensitiveIdentity: 'அசாதாரண படிவங்கள் நுணுக்கமான அடையாளத் தகவலை கேட்கின்றன',
    paymentViaUnknownLink: 'அறியாத SMS/மின்னஞ்சல் இணைப்பில் கட்டண கோரிக்கை',
    trackingNotOnDhl: 'டிராக்கிங் URL dhl.com-ல் இல்லை',
    brandingLooksRealDomainWrong: 'பிராண்டிங் உண்மையாக தெரிந்தாலும் டொமைன் தவறு',
  },
  tl: {
    smallRedeliveryPayment: 'Humihingi ang SMS/email ng maliit na bayad sa redelivery',
    fullCreditCardDetails: 'Humihingi ang pahina ng buong detalye ng credit card',
    domainNotExactSingpostSpeedpost: 'Hindi eksaktong singpost.com o speedpost.com ang domain',
    unexpectedPayToRelease: 'Hindi inaasahang mensahe na nagpapabayad para ma-release ang package',
    trackingShouldResolveUspsTools: 'Dapat magbukas ang tracking sa usps.com o tools.usps.com',
    unusualSensitiveIdentity: 'Kakaibang form ang humihingi ng sensitibong identity data',
    paymentViaUnknownLink: 'Hiling sa bayad sa pamamagitan ng hindi kilalang SMS/email link',
    trackingNotOnDhl: 'Wala sa dhl.com ang tracking URL',
    brandingLooksRealDomainWrong: 'Mukhang totoo ang branding pero mali ang domain',
  },
  th: {
    smallRedeliveryPayment: 'SMS/อีเมลขอให้จ่ายค่าจัดส่งใหม่เล็กน้อย',
    fullCreditCardDetails: 'หน้าเว็บขอข้อมูลบัตรเครดิตแบบครบถ้วน',
    domainNotExactSingpostSpeedpost: 'โดเมนไม่ตรงกับ singpost.com หรือ speedpost.com แบบเป๊ะ',
    unexpectedPayToRelease: 'ข้อความไม่คาดคิดขอให้คุณจ่ายเงินเพื่อปล่อยพัสดุ',
    trackingShouldResolveUspsTools: 'ลิงก์ติดตามควรไปที่ usps.com หรือ tools.usps.com',
    unusualSensitiveIdentity: 'แบบฟอร์มผิดปกติขอข้อมูลยืนยันตัวตนที่อ่อนไหว',
    paymentViaUnknownLink: 'ขอชำระเงินผ่านลิงก์ SMS/อีเมลที่ไม่รู้จัก',
    trackingNotOnDhl: 'URL ติดตามไม่ได้อยู่บน dhl.com',
    brandingLooksRealDomainWrong: 'หน้าตาแบรนด์เหมือนจริง แต่โดเมนผิด',
  },
  mi: {
    smallRedeliveryPayment: 'Ka tono te SMS/īmēra i tētahi utu iti mō te tuku anō',
    fullCreditCardDetails: 'Ka tono te whārangi i ngā taipitopito kāri nama katoa',
    domainNotExactSingpostSpeedpost: 'Kāore te rohe i te tino singpost.com, speedpost.com rānei',
    unexpectedPayToRelease: 'He karere ohorere e tono utu kia tukuna te pākete',
    trackingShouldResolveUspsTools: 'Me ahu te aroturuki ki usps.com, tools.usps.com rānei',
    unusualSensitiveIdentity: 'Ka tono ngā puka rerekē i ngā raraunga tuakiri tairongo',
    paymentViaUnknownLink: 'Tono utu mā tētahi hononga SMS/īmēra kāore i te mōhiotia',
    trackingNotOnDhl: 'Kāore te URL aroturuki i runga i dhl.com',
    brandingLooksRealDomainWrong: 'He pono te āhua o te waitohu, engari he hē te rohe',
  },
  'zh-hant': {
    smallRedeliveryPayment: 'SMS/電郵要求支付小額重新派送費',
    fullCreditCardDetails: '頁面要求填寫完整信用卡資料',
    domainNotExactSingpostSpeedpost: '網域並非完全等於 singpost.com 或 speedpost.com',
    unexpectedPayToRelease: '突發訊息要求付款才可放行包裹',
    trackingShouldResolveUspsTools: '追蹤連結應指向 usps.com 或 tools.usps.com',
    unusualSensitiveIdentity: '異常表單要求敏感身份資料',
    paymentViaUnknownLink: '透過未知 SMS/電郵連結要求付款',
    trackingNotOnDhl: '追蹤網址不在 dhl.com 網域下',
    brandingLooksRealDomainWrong: '品牌外觀看似真實，但網域錯誤',
  },
  vi: {
    smallRedeliveryPayment: 'SMS/email yêu cầu trả một khoản phí giao lại nhỏ',
    fullCreditCardDetails: 'Trang yêu cầu đầy đủ thông tin thẻ tín dụng',
    domainNotExactSingpostSpeedpost: 'Tên miền không chính xác là singpost.com hoặc speedpost.com',
    unexpectedPayToRelease: 'Tin nhắn bất ngờ yêu cầu bạn trả tiền để giải phóng bưu kiện',
    trackingShouldResolveUspsTools: 'Theo dõi phải mở trên usps.com hoặc tools.usps.com',
    unusualSensitiveIdentity: 'Biểu mẫu bất thường yêu cầu dữ liệu danh tính nhạy cảm',
    paymentViaUnknownLink: 'Yêu cầu thanh toán qua liên kết SMS/email lạ',
    trackingNotOnDhl: 'URL theo dõi không nằm trên dhl.com',
    brandingLooksRealDomainWrong: 'Giao diện thương hiệu có vẻ thật nhưng tên miền sai',
  },
  cy: {
    smallRedeliveryPayment: 'Mae SMS/e-bost yn gofyn am daliad bach ail-ddosbarthu',
    fullCreditCardDetails: 'Mae’r dudalen yn gofyn am fanylion cerdyn credyd llawn',
    domainNotExactSingpostSpeedpost: 'Nid yw’r parth yn union singpost.com na speedpost.com',
    unexpectedPayToRelease: 'Mae neges annisgwyl yn gofyn i chi dalu i ryddhau’r pecyn',
    trackingShouldResolveUspsTools: 'Dylai olrhain agor ar usps.com neu tools.usps.com',
    unusualSensitiveIdentity: 'Mae ffurflenni anarferol yn gofyn am ddata adnabod sensitif',
    paymentViaUnknownLink: 'Cais talu drwy ddolen SMS/e-bost anhysbys',
    trackingNotOnDhl: 'Nid yw URL olrhain ar dhl.com',
    brandingLooksRealDomainWrong: 'Mae’r brandio’n edrych yn real ond mae’r parth yn anghywir',
  },
  yue: {
    smallRedeliveryPayment: 'SMS/電郵要求支付小額重新派送費',
    fullCreditCardDetails: '頁面要求填寫完整信用卡資料',
    domainNotExactSingpostSpeedpost: '網域並非完全等於 singpost.com 或 speedpost.com',
    unexpectedPayToRelease: '突然訊息要求付款先可以放行包裹',
    trackingShouldResolveUspsTools: '追蹤連結應該去 usps.com 或 tools.usps.com',
    unusualSensitiveIdentity: '異常表格要求敏感身份資料',
    paymentViaUnknownLink: '透過未知 SMS/電郵連結要求付款',
    trackingNotOnDhl: '追蹤網址唔喺 dhl.com 網域下',
    brandingLooksRealDomainWrong: '品牌外觀似真，但網域錯誤',
  },
};

const sectionCardStyle = {
  backgroundColor: '#ffffff',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  padding: '1rem 1.1rem',
  marginBottom: '1rem',
};

const infoBannerStyle = {
  backgroundColor: '#fff8e1',
  border: '1px solid #ffe08a',
  borderRadius: '8px',
  padding: '0.7rem 0.9rem',
  marginBottom: '0.8rem',
};

const dangerBannerStyle = {
  backgroundColor: '#fdebec',
  border: '1px solid #f8c7cc',
  borderRadius: '8px',
  padding: '0.7rem 0.9rem',
  marginBottom: '0.8rem',
};

const domainChipStyle = {
  display: 'inline-block',
  fontFamily: 'monospace',
  backgroundColor: '#ecfdf3',
  border: '1px solid #b7efce',
  borderRadius: '6px',
  padding: '0.2rem 0.45rem',
  marginRight: '0.35rem',
  marginBottom: '0.35rem',
};

const borderedTableStyle = {
  backgroundColor: '#fff',
  border: '1px solid #cbd5e1',
};

const borderedCellStyle = {
  border: '1px solid #cbd5e1',
};

function ComparisonTable({ s, officialDomains, fakeDomains, lang }) {
  const patternMap = PATTERN_I18N[lang] || PATTERN_I18N.en;
  return (
    <>
      <div style={{ marginBottom: '0.5rem' }}>
        <strong>✅ {s.officialLabel}: </strong>
        {officialDomains.map((d) => (
          <span key={d} style={domainChipStyle}>{d}</span>
        ))}
      </div>
      <table className="table table-sm table-bordered table-striped table-hover" style={borderedTableStyle}>
      <thead className="table-light">
        <tr>
          <th style={borderedCellStyle}>🚫 {s.fakeLabel}</th>
          <th style={borderedCellStyle}>🧩 {s.patternLabel}</th>
        </tr>
      </thead>
      <tbody>
        {fakeDomains.map((entry) => (
          <tr key={entry.domain}>
            <td style={borderedCellStyle}><code>{entry.domain}</code></td>
            <td style={borderedCellStyle}>{patternMap[entry.pattern] || PATTERN_I18N.en[entry.pattern] || entry.pattern}</td>
          </tr>
        ))}
      </tbody>
    </table>
    </>
  );
}

export default function ParcelScamsBlogPost() {
  const { language } = useLanguage();
  const lang = normalizeLang(language);
  const s = i18n[lang] || i18n.en;
  const warningMap = WARNING_I18N[lang] || WARNING_I18N.en;

  return (
    <BlogPageLayout>
      <h2>⚠️ {s.title}</h2>
      <p>{s.intro}</p>

      <div style={sectionCardStyle}>
        <h3>🌐 {s.sectionOur}</h3>
        <p><strong>{s.officialOnly}</strong></p>
        <div style={infoBannerStyle}>🔍 {s.checkTypos}</div>
        <ComparisonTable s={s} officialDomains={['rhythmnexus.org']} fakeDomains={OUR_FAKE_DOMAINS} lang={lang} />
      </div>

      <div style={sectionCardStyle}>
        <h3>🛑 {s.sectionHow}</h3>
        <p>{s.howText}</p>
      </div>

      <div style={sectionCardStyle}>
        <h3>🇸🇬 {s.sectionSingpost}</h3>
        <ComparisonTable s={s} officialDomains={SINGPOST.official} fakeDomains={SINGPOST.fake} lang={lang} />
        <p><strong>⚠️ {s.warningLabel}:</strong></p>
        <ul>{SINGPOST.warnings.map((w) => <li key={w}>{warningMap[w] || WARNING_I18N.en[w] || w}</li>)}</ul>
      </div>

      <div style={sectionCardStyle}>
        <h3>🇺🇸 {s.sectionUsps}</h3>
        <ComparisonTable s={s} officialDomains={USPS.official} fakeDomains={USPS.fake} lang={lang} />
        <p><strong>⚠️ {s.warningLabel}:</strong></p>
        <ul>{USPS.warnings.map((w) => <li key={w}>{warningMap[w] || WARNING_I18N.en[w] || w}</li>)}</ul>
      </div>

      <div style={sectionCardStyle}>
        <h3>📦 {s.sectionDhl}</h3>
        <ComparisonTable s={s} officialDomains={DHL.official} fakeDomains={DHL.fake} lang={lang} />
        <p><strong>⚠️ {s.warningLabel}:</strong></p>
        <ul>{DHL.warnings.map((w) => <li key={w}>{warningMap[w] || WARNING_I18N.en[w] || w}</li>)}</ul>
      </div>

      <div style={sectionCardStyle}>
      <h3>🗺️ {s.sectionOthers}</h3>
      <p>{s.howText}</p>
      <table className="table table-sm table-bordered table-striped table-hover" style={borderedTableStyle}>
        <thead>
          <tr>
            <th style={borderedCellStyle}>📮 Carrier</th>
            <th style={borderedCellStyle}>✅ {s.officialLabel}</th>
            <th style={borderedCellStyle}>🚫 {s.fakeLabel}</th>
          </tr>
        </thead>
        <tbody>
          {OTHER_CARRIERS.map((row) => (
            <tr key={row.carrier}>
              <td style={borderedCellStyle}>{row.carrier}</td>
              <td style={borderedCellStyle}><code>{row.official}</code></td>
              <td style={borderedCellStyle}><code>{row.fake}</code></td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>

      <div style={sectionCardStyle}>
        <h3>✅ {s.sectionTips}</h3>
        <ul>{s.tips.map((tip) => <li key={tip}>{tip}</li>)}</ul>
      </div>

      <p style={{ ...dangerBannerStyle, fontSize: '0.9rem', color: '#666' }}>
        <strong>{s.disclaimerTitle}:</strong> {s.disclaimer}
      </p>
    </BlogPageLayout>
  );
}

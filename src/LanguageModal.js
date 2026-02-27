'use client';

import React from "react";
import "./App.css";

const WALES_FLAG = '🏴' + String.fromCodePoint(0xE0067, 0xE0062, 0xE0077, 0xE006C, 0xE0073, 0xE007F);

const allLanguages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'de', name: 'Deutsch (German)', flag: '🇩🇪' },
  { code: 'fr', name: 'Français (French)', flag: '🇫🇷' },
  { code: 'es', name: 'Español (Spanish)', flag: '🇪🇸' },
  { code: 'ja', name: '日本語 (Japanese)', flag: '🇯🇵' },
  { code: 'zh', name: '简体中文 (Simplified Chinese)', flag: '🇨🇳' },
  { code: 'zh-hant', name: '繁體中文 (Traditional Chinese)', flag: '🇹🇼' },
  { code: 'yue', name: '廣東話（Cantonese）', flag: '🇭🇰' },
  { code: 'pt', name: 'Português (Portuguese)', flag: '🇵🇹' },
  { code: 'hi', name: 'हिन्दी (Hindi)', flag: '🇮🇳' },
  { code: 'th', name: 'ไทย (Thai)', flag: '🇹🇭' },
  { code: 'ms', name: 'Bahasa Melayu (Malay)', flag: '🇲🇾' },
  { code: 'nl', name: 'Nederlands (Dutch)', flag: '🇳🇱' },
  { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'cs', name: 'Čeština (Czech)', flag: '🇨🇿' },
  { code: 'it', name: 'Italiano (Italian)', flag: '🇮🇹' },
  { code: 'he', name: 'עברית (Hebrew)', flag: '🇮🇱' },
  { code: 'ga', name: 'Gaeilge (Irish)', flag: '🇮🇪' },
  { code: 'pl', name: 'Polski (Polish)', flag: '🇵🇱' },
  { code: 'ko', name: '한국어 (Korean)', flag: '🇰🇷' },
  { code: 'no', name: 'Norsk (Norwegian)', flag: '🇳🇴' },
  { code: 'sv', name: 'Svenska (Swedish)', flag: '🇸🇪' },
  { code: 'tl', name: 'Tagalog', flag: '🇵🇭' },
  { code: 'vi', name: 'Tiếng Việt (Vietnamese)', flag: '🇻🇳' },
  { code: 'fi', name: 'Suomi (Finnish)', flag: '🇫🇮' },
  { code: 'ru', name: 'Русский (Russian)', flag: '🇷🇺' },
  { code: 'cy', name: 'Cymraeg (Welsh)', flag: WALES_FLAG },
  { code: 'ta', name: 'தமிழ் (Tamil)', flag: '🇮🇳' },
  { code: 'mi', name: 'Māori (Te Reo Māori)', flag: '🇳🇿' },
];

const countryNativeLanguage = {
  AU: 'en', AT: 'de', BE: 'fr', BN: 'ms', BR: 'pt', CA: 'en', CN: 'zh', CZ: 'cs',
  FI: 'fi', FR: 'fr', DE: 'de', HK: 'yue', IN: 'hi', ID: 'id', IE: 'ga', IL: 'he',
  IT: 'it', JP: 'ja', MO: 'yue', MY: 'ms', NL: 'nl', NZ: 'en', NO: 'no', PH: 'tl',
  PL: 'pl', PT: 'pt', KR: 'ko', SG: 'en', ES: 'es', SE: 'sv', CH: 'de', TW: 'zh-hant',
  TH: 'th', GB: 'en', US: 'en', VN: 'vi', RU: 'ru'
};

const modalActionText = {
  en: { showAll: 'Show all languages', showRecommended: 'Show recommended languages', chooseLater: "I'll choose later" },
  de: { showAll: 'Alle Sprachen anzeigen', showRecommended: 'Empfohlene Sprachen anzeigen', chooseLater: 'Ich wähle später' },
  fr: { showAll: 'Afficher toutes les langues', showRecommended: 'Afficher les langues recommandées', chooseLater: 'Je choisirai plus tard' },
  es: { showAll: 'Mostrar todos los idiomas', showRecommended: 'Mostrar idiomas recomendados', chooseLater: 'Elegiré más tarde' },
  ja: { showAll: 'すべての言語を表示', showRecommended: 'おすすめ言語を表示', chooseLater: '後で選択します' },
  zh: { showAll: '显示所有语言', showRecommended: '显示推荐语言', chooseLater: '我稍后再选' },
  'zh-hant': { showAll: '顯示所有語言', showRecommended: '顯示建議語言', chooseLater: '我稍後再選' },
  pt: { showAll: 'Mostrar todos os idiomas', showRecommended: 'Mostrar idiomas recomendados', chooseLater: 'Vou escolher mais tarde' },
  hi: { showAll: 'सभी भाषाएँ दिखाएँ', showRecommended: 'अनुशंसित भाषाएँ दिखाएँ', chooseLater: 'मैं बाद में चुनूँगा/चुनूँगी' },
  th: { showAll: 'แสดงภาษาทั้งหมด', showRecommended: 'แสดงภาษาที่แนะนำ', chooseLater: 'ฉันจะเลือกภายหลัง' },
  ms: { showAll: 'Tunjukkan semua bahasa', showRecommended: 'Tunjukkan bahasa disyorkan', chooseLater: 'Saya pilih kemudian' },
  nl: { showAll: 'Alle talen tonen', showRecommended: 'Aanbevolen talen tonen', chooseLater: 'Ik kies later' },
  id: { showAll: 'Tampilkan semua bahasa', showRecommended: 'Tampilkan bahasa rekomendasi', chooseLater: 'Saya pilih nanti' },
  cs: { showAll: 'Zobrazit všechny jazyky', showRecommended: 'Zobrazit doporučené jazyky', chooseLater: 'Vyberu později' },
  it: { showAll: 'Mostra tutte le lingue', showRecommended: 'Mostra lingue consigliate', chooseLater: 'Scelgo più tardi' },
  he: { showAll: 'הצג את כל השפות', showRecommended: 'הצג שפות מומלצות', chooseLater: 'אבחר מאוחר יותר' },
  ga: { showAll: 'Taispeáin gach teanga', showRecommended: 'Taispeáin teangacha molta', chooseLater: 'Roghnóidh mé níos déanaí' },
  pl: { showAll: 'Pokaż wszystkie języki', showRecommended: 'Pokaż zalecane języki', chooseLater: 'Wybiorę później' },
  ko: { showAll: '모든 언어 보기', showRecommended: '추천 언어 보기', chooseLater: '나중에 선택할게요' },
  no: { showAll: 'Vis alle språk', showRecommended: 'Vis anbefalte språk', chooseLater: 'Jeg velger senere' },
  ru: { showAll: 'Показать все языки', showRecommended: 'Показать рекомендуемые языки', chooseLater: 'Я выберу позже' },
  sv: { showAll: 'Visa alla språk', showRecommended: 'Visa rekommenderade språk', chooseLater: 'Jag väljer senare' },
  fi: { showAll: 'Näytä kaikki kielet', showRecommended: 'Näytä suositellut kielet', chooseLater: 'Valitsen myöhemmin' },
  tl: { showAll: 'Ipakita ang lahat ng wika', showRecommended: 'Ipakita ang mga inirerekomendang wika', chooseLater: 'Mamimili ako mamaya' },
  vi: { showAll: 'Hiển thị tất cả ngôn ngữ', showRecommended: 'Hiển thị ngôn ngữ đề xuất', chooseLater: 'Tôi sẽ chọn sau' },
  cy: { showAll: 'Dangos pob iaith', showRecommended: 'Dangos ieithoedd a argymhellir', chooseLater: 'Fe ddewisaf yn nes ymlaen' },
  ta: { showAll: 'அனைத்து மொழிகளையும் காட்டு', showRecommended: 'பரிந்துரைக்கப்பட்ட மொழிகளை காட்டு', chooseLater: 'பிறகு தேர்வு செய்கிறேன்' },
  mi: { showAll: 'Whakaatu ngā reo katoa', showRecommended: 'Whakaatu ngā reo taunaki', chooseLater: 'Ka kōwhiri au ā muri ake' },
  yue: { showAll: '顯示所有語言', showRecommended: '顯示推薦語言', chooseLater: '我稍後唘選' },
};

const modalI18n = {
  en: {
    title: 'Choose Your Language',
    detectedPrefix: "We detected you're in ",
    detectedSuffix: '. Please select your preferred language:',
    welcome: 'Please select your preferred language:',
  },
  de: { title: 'Wählen Sie Ihre Sprache', detectedPrefix: 'Wir haben erkannt, dass Sie in ', detectedSuffix: ' sind. Bitte wählen Sie Ihre bevorzugte Sprache:', welcome: 'Bitte wählen Sie Ihre bevorzugte Sprache:' },
  fr: { title: 'Choisissez votre langue', detectedPrefix: 'Nous avons détecté que vous êtes en ', detectedSuffix: '. Veuillez sélectionner votre langue préférée :', welcome: 'Veuillez sélectionner votre langue préférée :' },
  es: { title: 'Elige tu idioma', detectedPrefix: 'Detectamos que estás en ', detectedSuffix: '. Selecciona tu idioma preferido:', welcome: 'Selecciona tu idioma preferido:' },
  ja: { title: '言語を選択', detectedPrefix: '現在地を ', detectedSuffix: ' と検出しました。希望する言語を選択してください：', welcome: '希望する言語を選択してください：' },
  zh: { title: '选择语言', detectedPrefix: '我们检测到您位于', detectedSuffix: '。请选择您偏好的语言：', welcome: '请选择您偏好的语言：' },
  'zh-hant': { title: '選擇語言', detectedPrefix: '我們偵測到您位於', detectedSuffix: '。請選擇您偏好的語言：', welcome: '請選擇您偏好的語言：' },
  pt: { title: 'Escolha o seu idioma', detectedPrefix: 'Detectámos que está em ', detectedSuffix: '. Selecione o seu idioma preferido:', welcome: 'Selecione o seu idioma preferido:' },
  hi: { title: 'अपनी भाषा चुनें', detectedPrefix: 'हमने पाया कि आप ', detectedSuffix: ' में हैं। कृपया अपनी पसंदीदा भाषा चुनें:', welcome: 'कृपया अपनी पसंदीदा भाषा चुनें:' },
  th: { title: 'เลือกภาษาของคุณ', detectedPrefix: 'เราตรวจพบว่าคุณอยู่ที่', detectedSuffix: ' กรุณาเลือกภาษาที่คุณต้องการ:', welcome: 'กรุณาเลือกภาษาที่คุณต้องการ:' },
  ms: { title: 'Pilih Bahasa Anda', detectedPrefix: 'Kami mengesan anda berada di ', detectedSuffix: '. Sila pilih bahasa pilihan anda:', welcome: 'Sila pilih bahasa pilihan anda:' },
  nl: { title: 'Kies uw taal', detectedPrefix: 'We hebben gedetecteerd dat u in ', detectedSuffix: ' bent. Selecteer uw voorkeurstaal:', welcome: 'Selecteer uw voorkeurstaal:' },
  id: { title: 'Pilih Bahasa Anda', detectedPrefix: 'Kami mendeteksi Anda berada di ', detectedSuffix: '. Silakan pilih bahasa yang Anda inginkan:', welcome: 'Silakan pilih bahasa yang Anda inginkan:' },
  cs: { title: 'Vyberte si jazyk', detectedPrefix: 'Zjistili jsme, že jste v ', detectedSuffix: '. Vyberte prosím preferovaný jazyk:', welcome: 'Vyberte prosím preferovaný jazyk:' },
  it: { title: 'Scegli la tua lingua', detectedPrefix: 'Abbiamo rilevato che ti trovi in ', detectedSuffix: '. Seleziona la tua lingua preferita:', welcome: 'Seleziona la tua lingua preferita:' },
  he: { title: 'בחר את השפה שלך', detectedPrefix: 'זיהינו שאתה נמצא ב־', detectedSuffix: '. נא לבחור את השפה המועדפת עליך:', welcome: 'נא לבחור את השפה המועדפת עליך:' },
  ga: { title: 'Roghnaigh do theanga', detectedPrefix: 'Bhraiteamar go bhfuil tú in ', detectedSuffix: '. Roghnaigh do theanga roghnaithe le do thoil:', welcome: 'Roghnaigh do theanga roghnaithe le do thoil:' },
  pl: { title: 'Wybierz swój język', detectedPrefix: 'Wykryliśmy, że jesteś w ', detectedSuffix: '. Wybierz preferowany język:', welcome: 'Wybierz preferowany język:' },
  ko: { title: '언어를 선택하세요', detectedPrefix: '현재 위치는 ', detectedSuffix: ' 입니다. 선호하는 언어를 선택하세요:', welcome: '선호하는 언어를 선택하세요:' },
  no: { title: 'Velg språket ditt', detectedPrefix: 'Vi oppdaget at du er i ', detectedSuffix: '. Velg ditt foretrukne språk:', welcome: 'Velg ditt foretrukne språk:' },
  ru: { title: 'Выберите язык', detectedPrefix: 'Мы определили, что вы находитесь в ', detectedSuffix: '. Пожалуйста, выберите предпочитаемый язык:', welcome: 'Пожалуйста, выберите предпочитаемый язык:' },
  sv: { title: 'Välj ditt språk', detectedPrefix: 'Vi upptäckte att du är i ', detectedSuffix: '. Välj ditt föredragna språk:', welcome: 'Välj ditt föredragna språk:' },
  fi: { title: 'Valitse kielesi', detectedPrefix: 'Havaitsimme, että olet maassa ', detectedSuffix: '. Valitse haluamasi kieli:', welcome: 'Valitse haluamasi kieli:' },
  tl: { title: 'Piliin ang iyong wika', detectedPrefix: 'Natukoy namin na ikaw ay nasa ', detectedSuffix: '. Pakipili ang gusto mong wika:', welcome: 'Pakipili ang gusto mong wika:' },
  vi: { title: 'Chọn ngôn ngữ của bạn', detectedPrefix: 'Chúng tôi phát hiện bạn đang ở ', detectedSuffix: '. Vui lòng chọn ngôn ngữ bạn muốn:', welcome: 'Vui lòng chọn ngôn ngữ bạn muốn:' },
  cy: { title: 'Dewiswch eich iaith', detectedPrefix: 'Canfuom eich bod yn ', detectedSuffix: '. Dewiswch eich iaith ddewisol:', welcome: 'Dewiswch eich iaith ddewisol:' },
  ta: { title: 'உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்', detectedPrefix: 'நீங்கள் ', detectedSuffix: ' பகுதியில் இருப்பதை கண்டறிந்தோம். தயவுசெய்து உங்கள் விருப்ப மொழியைத் தேர்ந்தெடுக்கவும்:', welcome: 'தயவுசெய்து உங்கள் விருப்ப மொழியைத் தேர்ந்தெடுக்கவும்:' },
  mi: { title: 'Kōwhiria tō reo', detectedPrefix: 'Kua kitea kei ', detectedSuffix: ' koe. Tēnā kōwhiria tō reo pai:', welcome: 'Tēnā kōwhiria tō reo pai:' },
  yue: { title: '選擇你嘘語言', detectedPrefix: '我們檢測到你喺啟', detectedSuffix: '。請選擇你嘘偉好嘘語言：', welcome: '請選擇你嘘偉好嘘語言：' },
};

function getLocaleTag(languageCode) {
  const normalized = String(languageCode || 'en').toLowerCase();
  if (normalized === 'zh-hant') return 'zh-Hant';
  if (normalized === 'yue') return 'zh-HK';
  if (normalized === 'tl') return 'fil';
  return normalized;
}

function getPopupLanguageByCountry(country) {
  return countryNativeLanguage[country] || 'en';
}

function getLocalizedCountryName(countryCode, languageCode) {
  if (!countryCode) return null;
  try {
    if (typeof Intl !== 'undefined' && typeof Intl.DisplayNames === 'function') {
      const regionNames = new Intl.DisplayNames([getLocaleTag(languageCode)], { type: 'region' });
      return regionNames.of(countryCode) || countryCode;
    }
  } catch (_) {
    // ignore
  }
  return countryCode;
}

const LanguageModal = ({ isOpen, onClose, onSelectLanguage, availableLanguages, country }) => {
  const hasRecommendedLanguages = Array.isArray(availableLanguages) && availableLanguages.length > 0;
  const [showAllLanguages, setShowAllLanguages] = React.useState(false);

  React.useEffect(() => {
    setShowAllLanguages(false);
  }, [country, hasRecommendedLanguages]);

  if (!isOpen) return null;

  const popupLanguage = getPopupLanguageByCountry(country);
  const modalText = modalI18n[popupLanguage] || modalI18n.en;
  const actionText = modalActionText[popupLanguage] || modalActionText.en;
  const modalTitle = modalText.title;
  const languagesToShow = hasRecommendedLanguages && !showAllLanguages ? availableLanguages : allLanguages;

  const handleLanguageSelect = (langCode) => {
    onSelectLanguage(langCode);
    onClose();
  };

  const localizedCountryName = getLocalizedCountryName(country, popupLanguage);
  const headerText = localizedCountryName
    ? `${modalText.detectedPrefix}${localizedCountryName}${modalText.detectedSuffix}`
    : modalText.welcome;

  return (
    <div className="language-modal-overlay" onClick={onClose}>
      <div className="language-modal-content" onClick={(event) => event.stopPropagation()}>
        <div className="language-modal-header">
          <h2>{modalTitle}</h2>
          <p className="language-modal-subtitle">{headerText}</p>
        </div>

        <div className="language-modal-body">
          {languagesToShow.map((lang) => (
            <button
              key={lang.code}
              className="language-option-button"
              onClick={() => handleLanguageSelect(lang.code)}
            >
              <span className="language-flag">{lang.flag}</span>
              <span className="language-name">{lang.name}</span>
            </button>
          ))}
        </div>

        <div className="language-modal-footer">
          {hasRecommendedLanguages && (
            <button
              className="language-modal-close"
              onClick={() => setShowAllLanguages((value) => !value)}
            >
              {showAllLanguages ? actionText.showRecommended : actionText.showAll}
            </button>
          )}
          <button className="language-modal-close" onClick={onClose}>
            {actionText.chooseLater}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LanguageModal;

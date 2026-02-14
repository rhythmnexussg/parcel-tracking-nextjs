"use client";

import { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLanguage } from '../../LanguageContext';

const ACCESS_TAB_SESSION_KEY = 'rnx_access_tab_verified';

const CAPTCHA_LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'cs', label: 'Čeština (Czech)' },
  { code: 'nl', label: 'Nederlands (Dutch)' },
  { code: 'fi', label: 'Suomi (Finnish)' },
  { code: 'fr', label: 'Français (French)' },
  { code: 'de', label: 'Deutsch (German)' },
  { code: 'he', label: 'עברית (Hebrew)' },
  { code: 'hi', label: 'हिन्दी (Hindi)' },
  { code: 'id', label: 'Bahasa Indonesia (Indonesian)' },
  { code: 'ga', label: 'Gaeilge (Irish)' },
  { code: 'it', label: 'Italiano (Italian)' },
  { code: 'ja', label: '日本語 (Japanese)' },
  { code: 'ko', label: '한국어 (Korean)' },
  { code: 'ms', label: 'Bahasa Melayu (Malay)' },
  { code: 'no', label: 'Norsk (Norwegian)' },
  { code: 'pl', label: 'Polski (Polish)' },
  { code: 'pt', label: 'Português (Portuguese)' },
  { code: 'ru', label: 'Русский (Russian)' },
  { code: 'zh', label: '简体中文 (Chinese Simplified)' },
  { code: 'es', label: 'Español (Spanish)' },
  { code: 'sv', label: 'Svenska (Swedish)' },
  { code: 'tl', label: 'Tagalog (Filipino)' },
  { code: 'th', label: 'ไทย (Thai)' },
  { code: 'zh-hant', label: '繁體中文 (Chinese Traditional)' },
  { code: 'vi', label: 'Tiếng Việt (Vietnamese)' },
  { code: 'cy', label: 'Cymraeg (Welsh)' },
];

const CAPTCHA_UI_TEXT = {
  en: {
    title: 'Security Check',
    subtitle: 'Select your language first, then complete the captcha to continue.',
    selectLanguage: 'Captcha language',
    selectLanguagePlaceholder: 'Select language',
    chooseLanguageFirst: 'Please select a language before loading captcha.',
    loadingChallenge: 'Loading challenge...',
    answerLabel: 'Your answer',
    answerPlaceholder: 'Enter answer',
    verifyFailed: 'Verification failed. Please try again.',
    loadFailed: 'Unable to load captcha challenge. Please refresh and try again.',
    expiredChallenge: 'Captcha expired after 5 minutes. A new challenge has been generated.',
    verifying: 'Verifying...',
    continueButton: 'Continue',
    refreshButton: 'Refresh',
  },
  cs: { title: 'Bezpečnostní kontrola', subtitle: 'Nejprve vyberte jazyk a potom dokončete captcha.', selectLanguage: 'Jazyk captcha', selectLanguagePlaceholder: 'Vyberte jazyk', chooseLanguageFirst: 'Před načtením captcha nejprve vyberte jazyk.', loadingChallenge: 'Načítání otázky...', answerLabel: 'Vaše odpověď', answerPlaceholder: 'Zadejte odpověď', verifyFailed: 'Ověření se nezdařilo. Zkuste to prosím znovu.', loadFailed: 'Captcha se nepodařilo načíst. Obnovte stránku a zkuste to znovu.', verifying: 'Ověřování...', continueButton: 'Pokračovat', refreshButton: 'Obnovit' },
  nl: { title: 'Beveiligingscontrole', subtitle: 'Kies eerst uw taal en voltooi daarna de captcha.', selectLanguage: 'Captcha-taal', selectLanguagePlaceholder: 'Selecteer taal', chooseLanguageFirst: 'Selecteer eerst een taal voordat captcha wordt geladen.', loadingChallenge: 'Uitdaging laden...', answerLabel: 'Uw antwoord', answerPlaceholder: 'Voer antwoord in', verifyFailed: 'Verificatie mislukt. Probeer het opnieuw.', loadFailed: 'Captcha kon niet worden geladen. Vernieuw en probeer opnieuw.', verifying: 'Verifiëren...', continueButton: 'Doorgaan', refreshButton: 'Vernieuwen' },
  fi: { title: 'Turvatarkistus', subtitle: 'Valitse ensin kieli ja suorita sitten captcha.', selectLanguage: 'Captcha-kieli', selectLanguagePlaceholder: 'Valitse kieli', chooseLanguageFirst: 'Valitse kieli ennen captchan lataamista.', loadingChallenge: 'Ladataan haastetta...', answerLabel: 'Vastauksesi', answerPlaceholder: 'Syötä vastaus', verifyFailed: 'Vahvistus epäonnistui. Yritä uudelleen.', loadFailed: 'Captchan lataus epäonnistui. Päivitä sivu ja yritä uudelleen.', verifying: 'Vahvistetaan...', continueButton: 'Jatka', refreshButton: 'Päivitä' },
  fr: { title: 'Vérification de sécurité', subtitle: 'Sélectionnez d’abord votre langue, puis complétez le captcha.', selectLanguage: 'Langue du captcha', selectLanguagePlaceholder: 'Sélectionnez une langue', chooseLanguageFirst: 'Veuillez sélectionner une langue avant de charger le captcha.', loadingChallenge: 'Chargement du défi...', answerLabel: 'Votre réponse', answerPlaceholder: 'Entrez la réponse', verifyFailed: 'Échec de la vérification. Veuillez réessayer.', loadFailed: 'Impossible de charger le captcha. Actualisez et réessayez.', verifying: 'Vérification...', continueButton: 'Continuer', refreshButton: 'Actualiser' },
  de: { title: 'Sicherheitsprüfung', subtitle: 'Wählen Sie zuerst Ihre Sprache und lösen Sie dann das Captcha.', selectLanguage: 'Captcha-Sprache', selectLanguagePlaceholder: 'Sprache auswählen', chooseLanguageFirst: 'Bitte zuerst eine Sprache auswählen, bevor das Captcha geladen wird.', loadingChallenge: 'Challenge wird geladen...', answerLabel: 'Ihre Antwort', answerPlaceholder: 'Antwort eingeben', verifyFailed: 'Verifizierung fehlgeschlagen. Bitte erneut versuchen.', loadFailed: 'Captcha konnte nicht geladen werden. Bitte aktualisieren und erneut versuchen.', verifying: 'Wird überprüft...', continueButton: 'Weiter', refreshButton: 'Aktualisieren' },
  he: { title: 'בדיקת אבטחה', subtitle: 'בחר/י קודם שפה ואז השלם/י את הקאפצ׳ה.', selectLanguage: 'שפת קאפצ׳ה', selectLanguagePlaceholder: 'בחר/י שפה', chooseLanguageFirst: 'יש לבחור שפה לפני טעינת הקאפצ׳ה.', loadingChallenge: 'טוען אתגר...', answerLabel: 'התשובה שלך', answerPlaceholder: 'הזן/י תשובה', verifyFailed: 'האימות נכשל. נסה/י שוב.', loadFailed: 'לא ניתן לטעון קאפצ׳ה. רענן/י ונסה/י שוב.', verifying: 'מאמת...', continueButton: 'המשך', refreshButton: 'רענון' },
  hi: { title: 'सुरक्षा जांच', subtitle: 'पहले भाषा चुनें, फिर कैप्चा पूरा करें।', selectLanguage: 'कैप्चा भाषा', selectLanguagePlaceholder: 'भाषा चुनें', chooseLanguageFirst: 'कैप्चा लोड करने से पहले भाषा चुनें।', loadingChallenge: 'प्रश्न लोड हो रहा है...', answerLabel: 'आपका उत्तर', answerPlaceholder: 'उत्तर दर्ज करें', verifyFailed: 'सत्यापन विफल हुआ। कृपया पुनः प्रयास करें।', loadFailed: 'कैप्चा लोड नहीं हो पाया। रिफ्रेश करके फिर प्रयास करें।', verifying: 'सत्यापित किया जा रहा है...', continueButton: 'जारी रखें', refreshButton: 'रिफ्रेश' },
  id: { title: 'Pemeriksaan Keamanan', subtitle: 'Pilih bahasa terlebih dahulu, lalu selesaikan captcha.', selectLanguage: 'Bahasa captcha', selectLanguagePlaceholder: 'Pilih bahasa', chooseLanguageFirst: 'Silakan pilih bahasa sebelum memuat captcha.', loadingChallenge: 'Memuat tantangan...', answerLabel: 'Jawaban Anda', answerPlaceholder: 'Masukkan jawaban', verifyFailed: 'Verifikasi gagal. Silakan coba lagi.', loadFailed: 'Tidak dapat memuat captcha. Muat ulang lalu coba lagi.', verifying: 'Memverifikasi...', continueButton: 'Lanjutkan', refreshButton: 'Muat ulang' },
  ga: { title: 'Seiceáil Slándála', subtitle: 'Roghnaigh teanga ar dtús, ansin críochnaigh an captcha.', selectLanguage: 'Teanga captcha', selectLanguagePlaceholder: 'Roghnaigh teanga', chooseLanguageFirst: 'Roghnaigh teanga sula n-ualaítear an captcha.', loadingChallenge: 'Dúshlán á luchtú...', answerLabel: 'Do fhreagra', answerPlaceholder: 'Iontráil freagra', verifyFailed: 'Theip ar an bhfíorú. Bain triail eile as.', loadFailed: 'Níorbh fhéidir captcha a luchtú. Athnuaigh agus bain triail eile as.', verifying: 'Ag fíorú...', continueButton: 'Lean ar aghaidh', refreshButton: 'Athnuaigh' },
  it: { title: 'Controllo di Sicurezza', subtitle: 'Seleziona prima la lingua, poi completa il captcha.', selectLanguage: 'Lingua captcha', selectLanguagePlaceholder: 'Seleziona lingua', chooseLanguageFirst: 'Seleziona una lingua prima di caricare il captcha.', loadingChallenge: 'Caricamento della sfida...', answerLabel: 'La tua risposta', answerPlaceholder: 'Inserisci la risposta', verifyFailed: 'Verifica non riuscita. Riprova.', loadFailed: 'Impossibile caricare il captcha. Aggiorna e riprova.', verifying: 'Verifica in corso...', continueButton: 'Continua', refreshButton: 'Aggiorna' },
  ja: { title: 'セキュリティ確認', subtitle: '先に言語を選択してから、CAPTCHAを完了してください。', selectLanguage: 'CAPTCHAの言語', selectLanguagePlaceholder: '言語を選択', chooseLanguageFirst: 'CAPTCHAを読み込む前に言語を選択してください。', loadingChallenge: '問題を読み込み中...', answerLabel: '回答', answerPlaceholder: '回答を入力', verifyFailed: '認証に失敗しました。もう一度お試しください。', loadFailed: 'CAPTCHAを読み込めませんでした。更新して再試行してください。', verifying: '確認中...', continueButton: '続行', refreshButton: '更新' },
  ko: { title: '보안 확인', subtitle: '먼저 언어를 선택한 후 캡차를 완료하세요.', selectLanguage: '캡차 언어', selectLanguagePlaceholder: '언어 선택', chooseLanguageFirst: '캡차를 불러오기 전에 언어를 먼저 선택하세요.', loadingChallenge: '문제 불러오는 중...', answerLabel: '정답', answerPlaceholder: '정답 입력', verifyFailed: '인증에 실패했습니다. 다시 시도하세요.', loadFailed: '캡차를 불러오지 못했습니다. 새로고침 후 다시 시도하세요.', verifying: '확인 중...', continueButton: '계속', refreshButton: '새로고침' },
  ms: { title: 'Semakan Keselamatan', subtitle: 'Pilih bahasa dahulu, kemudian lengkapkan captcha.', selectLanguage: 'Bahasa captcha', selectLanguagePlaceholder: 'Pilih bahasa', chooseLanguageFirst: 'Sila pilih bahasa sebelum memuatkan captcha.', loadingChallenge: 'Memuatkan cabaran...', answerLabel: 'Jawapan anda', answerPlaceholder: 'Masukkan jawapan', verifyFailed: 'Pengesahan gagal. Sila cuba lagi.', loadFailed: 'Tidak dapat memuat captcha. Muat semula dan cuba lagi.', verifying: 'Mengesahkan...', continueButton: 'Teruskan', refreshButton: 'Muat semula' },
  no: { title: 'Sikkerhetssjekk', subtitle: 'Velg språk først, og fullfør deretter captcha.', selectLanguage: 'Captcha-språk', selectLanguagePlaceholder: 'Velg språk', chooseLanguageFirst: 'Velg språk før captcha lastes inn.', loadingChallenge: 'Laster utfordring...', answerLabel: 'Ditt svar', answerPlaceholder: 'Skriv inn svar', verifyFailed: 'Verifisering mislyktes. Prøv igjen.', loadFailed: 'Kunne ikke laste captcha. Oppdater og prøv igjen.', verifying: 'Verifiserer...', continueButton: 'Fortsett', refreshButton: 'Oppdater' },
  pl: { title: 'Kontrola Bezpieczeństwa', subtitle: 'Najpierw wybierz język, a potem ukończ captcha.', selectLanguage: 'Język captcha', selectLanguagePlaceholder: 'Wybierz język', chooseLanguageFirst: 'Najpierw wybierz język przed załadowaniem captcha.', loadingChallenge: 'Ładowanie zadania...', answerLabel: 'Twoja odpowiedź', answerPlaceholder: 'Wpisz odpowiedź', verifyFailed: 'Weryfikacja nie powiodła się. Spróbuj ponownie.', loadFailed: 'Nie można załadować captcha. Odśwież i spróbuj ponownie.', verifying: 'Weryfikowanie...', continueButton: 'Kontynuuj', refreshButton: 'Odśwież' },
  pt: { title: 'Verificação de Segurança', subtitle: 'Selecione primeiro o idioma e depois conclua o captcha.', selectLanguage: 'Idioma do captcha', selectLanguagePlaceholder: 'Selecione o idioma', chooseLanguageFirst: 'Selecione um idioma antes de carregar o captcha.', loadingChallenge: 'Carregando desafio...', answerLabel: 'Sua resposta', answerPlaceholder: 'Digite a resposta', verifyFailed: 'Falha na verificação. Tente novamente.', loadFailed: 'Não foi possível carregar o captcha. Atualize e tente novamente.', verifying: 'Verificando...', continueButton: 'Continuar', refreshButton: 'Atualizar' },
  ru: { title: 'Проверка Безопасности', subtitle: 'Сначала выберите язык, затем выполните капчу.', selectLanguage: 'Язык капчи', selectLanguagePlaceholder: 'Выберите язык', chooseLanguageFirst: 'Выберите язык перед загрузкой капчи.', loadingChallenge: 'Загрузка задания...', answerLabel: 'Ваш ответ', answerPlaceholder: 'Введите ответ', verifyFailed: 'Проверка не пройдена. Попробуйте снова.', loadFailed: 'Не удалось загрузить капчу. Обновите страницу и попробуйте снова.', verifying: 'Проверка...', continueButton: 'Продолжить', refreshButton: 'Обновить' },
  zh: { title: '安全验证', subtitle: '请先选择语言，然后完成验证码。', selectLanguage: '验证码语言', selectLanguagePlaceholder: '选择语言', chooseLanguageFirst: '加载验证码前请先选择语言。', loadingChallenge: '正在加载题目...', answerLabel: '你的答案', answerPlaceholder: '输入答案', verifyFailed: '验证失败，请重试。', loadFailed: '无法加载验证码，请刷新后重试。', verifying: '验证中...', continueButton: '继续', refreshButton: '刷新' },
  es: { title: 'Verificación de Seguridad', subtitle: 'Primero selecciona el idioma y luego completa el captcha.', selectLanguage: 'Idioma del captcha', selectLanguagePlaceholder: 'Seleccionar idioma', chooseLanguageFirst: 'Selecciona un idioma antes de cargar el captcha.', loadingChallenge: 'Cargando desafío...', answerLabel: 'Tu respuesta', answerPlaceholder: 'Introduce la respuesta', verifyFailed: 'La verificación falló. Inténtalo de nuevo.', loadFailed: 'No se pudo cargar el captcha. Actualiza e inténtalo de nuevo.', verifying: 'Verificando...', continueButton: 'Continuar', refreshButton: 'Actualizar' },
  sv: { title: 'Säkerhetskontroll', subtitle: 'Välj språk först och slutför sedan captcha.', selectLanguage: 'Captcha-språk', selectLanguagePlaceholder: 'Välj språk', chooseLanguageFirst: 'Välj språk innan captcha laddas.', loadingChallenge: 'Laddar utmaning...', answerLabel: 'Ditt svar', answerPlaceholder: 'Ange svar', verifyFailed: 'Verifiering misslyckades. Försök igen.', loadFailed: 'Kunde inte ladda captcha. Uppdatera och försök igen.', verifying: 'Verifierar...', continueButton: 'Fortsätt', refreshButton: 'Uppdatera' },
  tl: { title: 'Security Check', subtitle: 'Pili muna ng language, then complete the captcha para magpatuloy.', selectLanguage: 'Captcha language', selectLanguagePlaceholder: 'Pumili ng language', chooseLanguageFirst: 'Please pumili muna ng language bago i-load ang captcha.', loadingChallenge: 'Loading challenge...', answerLabel: 'Your sagot', answerPlaceholder: 'Ilagay ang answer', verifyFailed: 'Verification failed. Please try ulit.', loadFailed: 'Unable to load captcha challenge. Please refresh at try again.', verifying: 'Verifying...', continueButton: 'Continue', refreshButton: 'Refresh' },
  th: { title: 'การตรวจสอบความปลอดภัย', subtitle: 'โปรดเลือกภาษาก่อน แล้วจึงทำแคปช่าให้เสร็จ', selectLanguage: 'ภาษาแคปช่า', selectLanguagePlaceholder: 'เลือกภาษา', chooseLanguageFirst: 'กรุณาเลือกภาษาก่อนโหลดแคปช่า', loadingChallenge: 'กำลังโหลดคำถาม...', answerLabel: 'คำตอบของคุณ', answerPlaceholder: 'กรอกคำตอบ', verifyFailed: 'ยืนยันไม่สำเร็จ โปรดลองอีกครั้ง', loadFailed: 'ไม่สามารถโหลดแคปช่าได้ กรุณารีเฟรชแล้วลองใหม่', verifying: 'กำลังยืนยัน...', continueButton: 'ดำเนินการต่อ', refreshButton: 'รีเฟรช' },
  'zh-hant': { title: '安全驗證', subtitle: '請先選擇語言，然後完成驗證碼。', selectLanguage: '驗證碼語言', selectLanguagePlaceholder: '選擇語言', chooseLanguageFirst: '載入驗證碼前請先選擇語言。', loadingChallenge: '正在載入題目...', answerLabel: '你的答案', answerPlaceholder: '輸入答案', verifyFailed: '驗證失敗，請再試一次。', loadFailed: '無法載入驗證碼，請重新整理後再試。', verifying: '驗證中...', continueButton: '繼續', refreshButton: '重新整理' },
  vi: { title: 'Kiểm Tra Bảo Mật', subtitle: 'Vui lòng chọn ngôn ngữ trước, sau đó hoàn thành captcha.', selectLanguage: 'Ngôn ngữ captcha', selectLanguagePlaceholder: 'Chọn ngôn ngữ', chooseLanguageFirst: 'Vui lòng chọn ngôn ngữ trước khi tải captcha.', loadingChallenge: 'Đang tải thử thách...', answerLabel: 'Câu trả lời của bạn', answerPlaceholder: 'Nhập câu trả lời', verifyFailed: 'Xác minh thất bại. Vui lòng thử lại.', loadFailed: 'Không thể tải captcha. Hãy làm mới và thử lại.', verifying: 'Đang xác minh...', continueButton: 'Tiếp tục', refreshButton: 'Làm mới' },
  cy: { title: 'Gwiriad Diogelwch', subtitle: 'Dewiswch iaith yn gyntaf, yna cwblhewch y captcha.', selectLanguage: 'Iaith captcha', selectLanguagePlaceholder: 'Dewis iaith', chooseLanguageFirst: 'Dewiswch iaith cyn llwytho captcha.', loadingChallenge: 'Yn llwytho her...', answerLabel: 'Eich ateb', answerPlaceholder: 'Rhowch ateb', verifyFailed: 'Methodd y dilysiad. Rhowch gynnig arall.', loadFailed: 'Methu llwytho captcha. Adnewyddwch a rhowch gynnig arall.', verifying: 'Yn dilysu...', continueButton: 'Parhau', refreshButton: 'Adnewyddu' },
};

export default function AccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language, setLanguage } = useLanguage();
  const nextPath = searchParams.get('next') || '/';

  const [selectedLang, setSelectedLang] = useState('');
  const [question, setQuestion] = useState('');
  const [challengeMode, setChallengeMode] = useState('math');
  const [challengeOptions, setChallengeOptions] = useState([]);
  const [challengeExpiresAt, setChallengeExpiresAt] = useState(null);
  const [token, setToken] = useState('');
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const uiLang = selectedLang || language || 'en';
  const text = CAPTCHA_UI_TEXT[uiLang] || CAPTCHA_UI_TEXT.en;

  const loadChallenge = useCallback(async (langCode = selectedLang) => {
    if (!langCode) {
      setError(text.chooseLanguageFirst);
      return;
    }

    setError('');
    try {
      const challengeUrl = `/api/access/challenge?lang=${encodeURIComponent(langCode)}`;
      const response = await fetch(challengeUrl, { cache: 'no-store' });
      const data = await response.json();
      if (!response.ok || !data?.question || !data?.token) {
        if (data?.error === 'captcha_unavailable') {
          setError('Captcha is temporarily unavailable. Please try again in a moment.');
          return;
        }
        throw new Error('Unable to load challenge');
      }
      setQuestion(data.question);
      setChallengeMode(data?.mode === 'match' ? 'match' : 'math');
      setChallengeOptions(Array.isArray(data?.options) ? data.options : []);
      setChallengeExpiresAt(Number.isFinite(data?.expiresAt) ? data.expiresAt : Date.now() + 5 * 60 * 1000);
      setToken(data.token);
      setAnswer('');
    } catch (_) {
      setError(text.loadFailed);
    }
  }, [selectedLang, text.chooseLanguageFirst, text.loadFailed]);

  useEffect(() => {
    const isSupported = (code) => CAPTCHA_LANGUAGES.some((item) => item.code === code);

    const targetLang = (language && isSupported(language)) ? language : 'en';
    if (selectedLang !== targetLang) {
      setSelectedLang(targetLang);
    }
    if (!language || !isSupported(language)) {
      setLanguage('en');
    }
  }, [language, selectedLang, setLanguage]);

  useEffect(() => {
    if (selectedLang && !token && !loading) {
      loadChallenge(selectedLang);
    }
  }, [loadChallenge, selectedLang, token, loading]);

  useEffect(() => {
    if (!challengeExpiresAt || !token) return;

    const delayMs = Math.max(0, challengeExpiresAt - Date.now());
    const timeoutId = window.setTimeout(async () => {
      setError(text.expiredChallenge || CAPTCHA_UI_TEXT.en.expiredChallenge);
      await loadChallenge(selectedLang);
    }, delayMs);

    return () => window.clearTimeout(timeoutId);
  }, [challengeExpiresAt, token, selectedLang, loadChallenge, text.expiredChallenge]);

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!selectedLang) {
      setError(text.chooseLanguageFirst);
      return;
    }
    if (!token) {
      setError(text.chooseLanguageFirst);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/access/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          answer,
          nextPath,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data?.ok) {
        if (data?.error === 'expired') {
          setError(text.expiredChallenge || CAPTCHA_UI_TEXT.en.expiredChallenge);
          await loadChallenge(selectedLang);
          return;
        }
        setError(text.verifyFailed);
        await loadChallenge(selectedLang);
        return;
      }

      sessionStorage.setItem(ACCESS_TAB_SESSION_KEY, '1');

      router.replace(data.redirectTo || '/');
      router.refresh();
    } catch (_) {
      setError(text.verifyFailed);
      await loadChallenge(selectedLang);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        background: '#f8fafc',
      }}
    >
      <div
        style={{
          maxWidth: '460px',
          width: '100%',
          background: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
        }}
      >
        <h1 style={{ margin: '0 0 8px', fontSize: '1.4rem', color: '#111827' }}>{text.title}</h1>
        <p style={{ marginTop: 0, marginBottom: '16px', color: '#374151' }}>
          {text.subtitle}
        </p>

        <div
          style={{
            marginBottom: '16px',
            padding: '12px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            background: '#f9fafb',
            color: '#374151',
            fontSize: '0.9rem',
            lineHeight: 1.5,
          }}
        >
          <p style={{ margin: '0 0 6px', fontWeight: 600, color: '#1f2937' }}>Minimum supported system versions</p>
          <p style={{ margin: '0 0 4px' }}>Windows: Windows 10 or above</p>
          <p style={{ margin: '0 0 4px' }}>macOS: macOS 12 or above</p>
          <p style={{ margin: '0 0 4px' }}>Android: Android 13 or above</p>
          <p style={{ margin: '0 0 4px' }}>iPhone/iOS: iOS 17 or above</p>
          <p style={{ margin: 0 }}>Linux: A currently supported distribution release with active security updates</p>
        </div>

        <form onSubmit={onSubmit}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#1f2937' }}>
            {text.selectLanguage}
          </label>
          <select
            value={selectedLang}
            onChange={(e) => {
              const nextLang = e.target.value;
              setSelectedLang(nextLang);
              setLanguage(nextLang);
              setQuestion('');
              setChallengeMode('math');
              setChallengeOptions([]);
              setChallengeExpiresAt(null);
              setToken('');
              setAnswer('');
              setError('');
            }}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              marginBottom: '12px',
            }}
            required
          >
            <option value="">{text.selectLanguagePlaceholder}</option>
            {CAPTCHA_LANGUAGES.map((langOption) => (
              <option key={langOption.code} value={langOption.code}>
                {langOption.label}
              </option>
            ))}
          </select>

          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#1f2937' }}>
            {question || text.loadingChallenge}
          </label>
          <label style={{ display: 'block', marginBottom: '8px', color: '#374151' }}>
            {text.answerLabel}
          </label>
          {challengeMode === 'match' ? (
            <div className="access-match-options" style={{ marginBottom: '12px', display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '8px' }}>
              {challengeOptions.map((symbol) => {
                const isSelected = answer === symbol;
                return (
                  <button
                    key={symbol}
                    type="button"
                    disabled={!selectedLang || !token || loading}
                    onClick={() => setAnswer(symbol)}
                    style={{
                      padding: '10px 12px',
                      border: `1px solid ${isSelected ? '#2563eb' : '#d1d5db'}`,
                      borderRadius: '8px',
                      background: isSelected ? '#eff6ff' : '#fff',
                      color: '#111827',
                      fontSize: '1.1rem',
                      cursor: 'pointer',
                    }}
                  >
                    {symbol}
                  </button>
                );
              })}
            </div>
          ) : (
            <input
              type="number"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder={text.answerPlaceholder}
              required
              disabled={!selectedLang || !token || loading}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                marginBottom: '12px',
              }}
            />
          )}

          {error && (
            <p style={{ color: '#b91c1c', marginTop: 0, marginBottom: '12px' }}>{error}</p>
          )}

          <div className="access-action-buttons" style={{ display: 'flex', gap: '8px' }}>
            <button
              type="submit"
              disabled={!selectedLang || !token || loading || !answer}
              style={{
                flex: 1,
                padding: '10px 12px',
                border: 'none',
                borderRadius: '8px',
                background: '#2563eb',
                color: '#fff',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {loading ? text.verifying : text.continueButton}
            </button>

            <button
              type="button"
              onClick={() => loadChallenge(selectedLang)}
              disabled={!selectedLang || loading}
              style={{
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                background: '#fff',
                color: '#111827',
                cursor: 'pointer',
              }}
            >
              {text.refreshButton}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

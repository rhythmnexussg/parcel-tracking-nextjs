"use client";

import { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLanguage } from '../../LanguageContext';
import { translations } from '../../translations';

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

const CAPTCHA_UI_TEXT = {};
for (const lang of Object.keys(translations)) {
  CAPTCHA_UI_TEXT[lang] = {
    ...(CAPTCHA_UI_TEXT[lang] || {}),
    ...(typeof translations[lang] === 'object' ? translations[lang] : {}),
    systemRequirements: translations[lang]?.systemRequirements || translations.en.systemRequirements,
  };
}

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
            whiteSpace: 'pre-line',
          }}
        >
          <p style={{ margin: '0 0 6px', color: '#1f2937' }}>{text.systemRequirementsTitle || 'Minimum supported system versions'}</p>
          <span>{text.systemRequirements}</span>
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

'use client';

import { useCallback, useEffect, useState } from 'react';

/**
 * Inline math (MDAS) captcha widget for use in forms.
 *
 * Props:
 *   lang      – BCP-47 language code passed to the challenge API (default 'en')
 *   onChange  – called with { token, answer } whenever either changes
 */
export function MathCaptcha({ lang = 'en', onChange }) {
  const [question, setQuestion] = useState('');
  const [token, setToken] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');

  const loadChallenge = useCallback(async () => {
    setLoading(true);
    setFetchError('');
    setAnswer('');
    try {
      const res = await fetch(
        `/api/access/challenge?lang=${encodeURIComponent(lang || 'en')}`,
        { cache: 'no-store' }
      );
      const data = await res.json();
      if (!res.ok || !data?.question || !data?.token) {
        throw new Error('bad response');
      }
      setQuestion(data.question);
      setToken(data.token);
      onChange?.({ token: data.token, answer: '' });
    } catch {
      setFetchError('Could not load verification question. Click ↻ to retry.');
    } finally {
      setLoading(false);
    }
  }, [lang, onChange]);

  // Load on mount and whenever lang changes
  useEffect(() => {
    loadChallenge();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  const handleAnswerChange = (e) => {
    const val = e.target.value;
    setAnswer(val);
    onChange?.({ token, answer: val });
  };

  return (
    <div
      style={{
        padding: '1rem',
        backgroundColor: '#f0f8ff',
        border: '1px solid #b8daff',
        borderRadius: '4px',
      }}
    >
      <div
        style={{ fontWeight: 'bold', marginBottom: '0.5rem', color: '#004085' }}
      >
        Math Verification *
      </div>

      {loading && (
        <div style={{ color: '#666', fontSize: '0.9rem' }}>Loading question…</div>
      )}

      {fetchError && (
        <div
          style={{
            color: '#721c24',
            backgroundColor: '#f8d7da',
            border: '1px solid #f5c6cb',
            borderRadius: '4px',
            padding: '0.5rem 0.75rem',
            fontSize: '0.9rem',
            marginBottom: '0.5rem',
          }}
        >
          {fetchError}
        </div>
      )}

      {!loading && question && (
        <>
          <div
            style={{
              marginBottom: '0.6rem',
              fontSize: '1rem',
              color: '#333',
              fontFamily: 'monospace',
            }}
          >
            {question}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <input
              type="number"
              value={answer}
              onChange={handleAnswerChange}
              placeholder="Your answer"
              autoComplete="off"
              style={{
                padding: '0.5rem 0.75rem',
                border: '1px solid #ccc',
                borderRadius: '4px',
                width: '130px',
                fontSize: '1rem',
                backgroundColor: '#fff',
                color: '#000',
              }}
            />
            <button
              type="button"
              onClick={loadChallenge}
              title="Get a new question"
              style={{
                padding: '0.5rem 0.75rem',
                cursor: 'pointer',
                borderRadius: '4px',
                border: '1px solid #ccc',
                backgroundColor: '#fff',
                fontSize: '0.9rem',
                color: '#333',
              }}
            >
              ↻ New question
            </button>
          </div>
        </>
      )}

      {!loading && !question && !fetchError && (
        <button
          type="button"
          onClick={loadChallenge}
          style={{
            padding: '0.5rem 0.75rem',
            cursor: 'pointer',
            borderRadius: '4px',
            border: '1px solid #ccc',
            backgroundColor: '#fff',
            fontSize: '0.9rem',
            color: '#333',
          }}
        >
          ↻ Load question
        </button>
      )}
    </div>
  );
}

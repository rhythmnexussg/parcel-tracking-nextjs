'use client';

import { useCallback, useEffect, useState } from 'react';

/**
 * Captcha widget for use in forms. Supports all 4 challenge types:
 *   math   – MDAS number input
 *   puzzle – fill-in-blank multiple choice
 *   match  – symbol match multiple choice
 *   char   – type-back character string
 *
 * Props:
 *   lang      – BCP-47 language code passed to the challenge API (default 'en')
 *   onChange  – called with { token, answer } whenever either changes
 */
export function MathCaptcha({ lang = 'en', onChange }) {
  const [question, setQuestion] = useState('');
  const [token, setToken] = useState('');
  const [answer, setAnswer] = useState('');
  const [mode, setMode] = useState('math');
  const [options, setOptions] = useState(null);   // string[] for puzzle/match
  const [charTarget, setCharTarget] = useState(null); // string for char
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
      setMode(data.mode || 'math');
      setOptions(data.options || null);
      setCharTarget(data.charTarget || null);
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

  const handleOptionSelect = (val) => {
    setAnswer(val);
    onChange?.({ token, answer: val });
  };

  const refreshButton = (
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
        marginLeft: '0.5rem',
      }}
    >
      ↻ New question
    </button>
  );

  // Multiple-choice UI for puzzle + match modes
  const renderOptions = () => (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
      {(options || []).map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => handleOptionSelect(opt)}
          style={{
            padding: '0.5rem 0.9rem',
            cursor: 'pointer',
            borderRadius: '4px',
            border: answer === opt ? '2px solid #004085' : '1px solid #ccc',
            backgroundColor: answer === opt ? '#cce5ff' : '#fff',
            fontSize: mode === 'match' ? '1.4rem' : '1rem',
            color: '#000',
            fontWeight: answer === opt ? 'bold' : 'normal',
            minWidth: '2.5rem',
          }}
        >
          {opt}
        </button>
      ))}
      {refreshButton}
    </div>
  );

  // Number input for math mode
  const renderMathInput = () => (
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
      {refreshButton}
    </div>
  );

  // Text input for char mode
  const renderCharInput = () => (
    <>
      {charTarget && (
        <div
          style={{
            fontFamily: 'monospace',
            fontSize: '1.4rem',
            letterSpacing: '0.2em',
            color: '#004085',
            marginBottom: '0.5rem',
            userSelect: 'none',
          }}
        >
          {charTarget}
        </div>
      )}
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <input
          type="text"
          value={answer}
          onChange={handleAnswerChange}
          placeholder="Type the characters above"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          style={{
            padding: '0.5rem 0.75rem',
            border: '1px solid #ccc',
            borderRadius: '4px',
            width: '160px',
            fontSize: '1rem',
            backgroundColor: '#fff',
            color: '#000',
            fontFamily: 'monospace',
            letterSpacing: '0.1em',
          }}
        />
        {refreshButton}
      </div>
    </>
  );

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
        Verification *
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
              fontFamily: mode === 'math' ? 'monospace' : 'inherit',
              whiteSpace: 'pre-line',
            }}
          >
            {question}
          </div>

          {(mode === 'puzzle' || mode === 'match') && options && renderOptions()}
          {mode === 'math' && renderMathInput()}
          {mode === 'char' && renderCharInput()}
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

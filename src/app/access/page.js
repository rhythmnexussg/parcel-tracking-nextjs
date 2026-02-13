"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get('next') || '/';

  const [question, setQuestion] = useState('');
  const [token, setToken] = useState('');
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const loadChallenge = async () => {
    setError('');
    try {
      const response = await fetch('/api/access/challenge', { cache: 'no-store' });
      const data = await response.json();
      if (!response.ok || !data?.question || !data?.token) {
        throw new Error('Unable to load challenge');
      }
      setQuestion(data.question);
      setToken(data.token);
      setAnswer('');
    } catch (_) {
      setError('Unable to load captcha challenge. Please refresh and try again.');
    }
  };

  useEffect(() => {
    loadChallenge();
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!token) return;

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
        setError('Verification failed. Please try again.');
        await loadChallenge();
        return;
      }

      router.replace(data.redirectTo || '/');
      router.refresh();
    } catch (_) {
      setError('Verification failed. Please try again.');
      await loadChallenge();
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
        <h1 style={{ margin: '0 0 8px', fontSize: '1.4rem', color: '#111827' }}>Security Check</h1>
        <p style={{ marginTop: 0, marginBottom: '16px', color: '#374151' }}>
          Complete this captcha to continue.
        </p>

        <form onSubmit={onSubmit}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#1f2937' }}>
            {question || 'Loading challenge...'}
          </label>
          <input
            type="number"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            required
            disabled={!token || loading}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              marginBottom: '12px',
            }}
          />

          {error && (
            <p style={{ color: '#b91c1c', marginTop: 0, marginBottom: '12px' }}>{error}</p>
          )}

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="submit"
              disabled={!token || loading}
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
              {loading ? 'Verifying...' : 'Continue'}
            </button>

            <button
              type="button"
              onClick={loadChallenge}
              disabled={loading}
              style={{
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                background: '#fff',
                color: '#111827',
                cursor: 'pointer',
              }}
            >
              Refresh
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

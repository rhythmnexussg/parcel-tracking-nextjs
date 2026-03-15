'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useLanguage } from '../LanguageContext';

const TARGET_PATHS = new Set(['/', '/track-your-item']);
const DISMISS_SESSION_KEY = 'rnx_temp_closure_popup_dismissed_v2';
const NOTICE_START = '2026-03-15T00:00:00+08:00';
const NOTICE_END = '2026-03-27T23:59:59+08:00';

function normalizePath(pathname) {
  if (!pathname || typeof pathname !== 'string') return '/';
  if (pathname === '/') return '/';
  return pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
}

function isWithinNoticeWindow() {
  const now = Date.now();
  const start = new Date(NOTICE_START).getTime();
  const end = new Date(NOTICE_END).getTime();
  return now >= start && now <= end;
}

export function TemporaryClosurePopup() {
  const { t, language } = useLanguage();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const isTargetPath = TARGET_PATHS.has(normalizePath(pathname || ''));
    if (!isTargetPath) {
      setIsOpen(false);
      return;
    }

    if (!isWithinNoticeWindow()) {
      setIsOpen(false);
      return;
    }

    try {
      const dismissed = sessionStorage.getItem(DISMISS_SESSION_KEY) === '1';
      setIsOpen(!dismissed);
    } catch (_) {
      setIsOpen(true);
    }
  }, [pathname, language]);

  const handleClose = () => {
    try {
      sessionStorage.setItem(DISMISS_SESSION_KEY, '1');
    } catch (_) {
      // ignore storage errors
    }
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="temporary-closure-title"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.55)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        zIndex: 1002,
      }}
      onClick={handleClose}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '760px',
          maxHeight: '88vh',
          overflowY: 'auto',
          background: '#ffffff',
          borderRadius: '14px',
          border: '1px solid #e5e7eb',
          padding: '24px',
          boxShadow: '0 16px 40px rgba(0,0,0,0.2)',
        }}
      >
        <h2 id="temporary-closure-title" style={{ margin: '0 0 12px', color: '#111827' }}>
          {t('temporaryClosureNoticeTitle')}
        </h2>

        <p style={{ marginTop: 0, marginBottom: '20px', color: '#374151', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
          {t('temporaryClosureNoticeBody')}
        </p>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={handleClose}
            style={{
              padding: '10px 14px',
              border: 'none',
              borderRadius: '8px',
              background: '#2563eb',
              color: '#fff',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {t('temporaryClosureNoticeClose')}
          </button>
        </div>
      </div>
    </div>
  );
}

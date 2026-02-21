'use client';

import { Navigation } from '../../../components/Navigation';
import { useLanguage } from '../../../LanguageContext';
import Link from 'next/link';

export default function ContactSuccessfulPage() {
  const { t } = useLanguage();

  return (
    <>
      <Navigation />
      <div
        style={{
          width: '100%',
          minHeight: '100vh',
          backgroundColor: '#f5f5f5',
          paddingTop: '160px',
          paddingBottom: '3rem',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start'
        }}
      >
        <div
          style={{
            maxWidth: '850px',
            width: '100%',
            margin: '0 1rem',
            padding: '2rem',
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
        >
          <h1 style={{ textAlign: 'center', marginBottom: '1rem', color: '#333' }}>{t('contactUsTitle')}</h1>
          <div
            style={{
              padding: '1rem',
              backgroundColor: '#d4edda',
              border: '1px solid #c3e6cb',
              borderRadius: '4px',
              color: '#155724',
              marginBottom: '1.25rem'
            }}
          >
            {t('contactSuccessMessage')}
          </div>
          <div style={{ textAlign: 'center' }}>
            <Link
              href="/contact"
              style={{ color: '#0066cc', textDecoration: 'underline', fontWeight: 'bold' }}
            >
              {t('backButton')}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '../../LanguageContext';
import { Navigation } from '../../components/Navigation';
import { rt } from '../../lib/ratesI18n';

export default function SingaporeRatesPage() {
  const { t, language } = useLanguage();
  const router = useRouter();

  const tr = (key) => rt(language, key);

  const rows = [
    {
      service: tr('trackedPrepaidLabel'),
      usd: 'USD $1.92',
      sgd: 'SGD $2.50',
      note: '',
    },
    {
      service: tr('doorstepDeliveryStd'),
      usd: 'USD $5.00',
      sgd: 'SGD $6.50',
      note: '',
    },
  ];

  return (
    <>
      <Navigation />

      <div className="container mt-5 rates-page">
        <button onClick={() => router.back()} className="back-button">
          <span>&larr;</span> {t('backButton')}
        </button>

        <div className="blog-content-card rates-card">
          <h2>{t('sgDeliveryRates')}</h2>
          <p><strong>{tr('postalCourierLocal')}</strong></p>

          <div className="rates-table-wrap">
            <table className="rates-table">
              <thead>
                <tr>
                  <th>{tr('service')}</th>
                  <th>USD</th>
                  <th>SGD</th>
                  <th>{tr('notes')}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.service}>
                    <td>{row.service}</td>
                    <td>{row.usd}</td>
                    <td>{row.sgd}</td>
                    <td>{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p style={{ marginTop: 12 }}>
            <strong>{t('parcelCaseReferenceLink')}:</strong>{' '}
            <Link href="/postal-contacts" style={{ textDecoration: 'underline' }}>{t('postalContactsTitle')}</Link>.
          </p>
        </div>

        <p className="text-muted">© {new Date().getFullYear()} Rhythm Nexus. {t('copyrightText')}</p>
      </div>
    </>
  );
}

'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '../../LanguageContext';
import { Navigation } from '../../components/Navigation';
import { countryName, rt } from '../../lib/ratesI18n';

export default function SpeedpostExpressRatesPage() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const tr = (key) => rt(language, key);
  const zoneLabel = (suffix) => `${tr('zone')} ${suffix}`;

  const zoneRows = [
    ['0.0-2.0kg', '46.92', '83.08', '122.31', '302.31'],
    ['2.0-5.0kg', '70.00', '138.46', '199.23', '484.62'],
  ];

  const zoneMappingRows = [
    [zoneLabel('1'), `${countryName(language, 'MY', 'Malaysia')} 🇲🇾`],
    [zoneLabel('2'), `${tr('asiaPacific')} 🌏`],
    [zoneLabel('3'), `${countryName(language, 'AU', 'Australia')} / ${countryName(language, 'NZ', 'New Zealand')} / ${tr('europe')} / ${countryName(language, 'US', 'United States')} / ${countryName(language, 'CA', 'Canada')} 🇦🇺🇳🇿🇪🇺🇺🇸🇨🇦`],
    [zoneLabel('4'), `${countryName(language, 'IL', 'Israel')} 🇮🇱`],
  ];

  return (
    <>
      <Navigation />
      <div className="container mt-5 rates-page">
        <button onClick={() => router.back()} className="back-button"><span>&larr;</span> {t('backButton')}</button>

        <div className="blog-content-card rates-card">
          <h2>{t('speedPostRates')}</h2>
          <p className="rates-links">
            <strong>{tr('relatedRates')}:</strong>{' '}
            <Link href="/delivery-rates-2026" style={{ textDecoration: 'underline' }}>{t('deliveryRates2026')}</Link>{' | '}
            <Link href="/singapore-rates" style={{ textDecoration: 'underline' }}>{t('sgDeliveryRates')}</Link>
          </p>
          <p><strong>{tr('speedpostExpressRates')}</strong></p>

          <div className="rates-table-wrap">
            <table className="rates-table">
              <thead>
                <tr>
                  <th>{tr('zone')}</th>
                  <th>{tr('countryRegion')}</th>
                </tr>
              </thead>
              <tbody>
                {zoneMappingRows.map(([zone, region]) => (
                  <tr key={zone}>
                    <td>{zone}</td>
                    <td>{region}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="rates-table-wrap">
            <table className="rates-table">
              <thead>
                <tr>
                  {[tr('weight'), zoneLabel('1'), zoneLabel('2'), zoneLabel('3'), zoneLabel('4')].map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {zoneRows.map((row) => (
                  <tr key={row[0]}>
                    {row.map((cell, index) => <td key={`${row[0]}-${index}`}>{cell}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p>{tr('spxPoBoxNotice')}</p>
          <p>{tr('spxUsaDduNote')}</p>
          <p>{tr('spxEtsyZone4Note')}</p>
          <p>{tr('spxNoSaturdayNote')}</p>
          <p><strong>{t('parcelCaseReferenceLink')}:</strong> <Link href="/postal-contacts" style={{ textDecoration: 'underline' }}>{t('postalContactsTitle')}</Link>.</p>
        </div>

        <p className="text-muted">© {new Date().getFullYear()} Rhythm Nexus. {t('copyrightText')}</p>
      </div>
    </>
  );
}

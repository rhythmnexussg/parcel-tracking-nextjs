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

  const zoneRows = [
    ['0.0-2.0kg', '46.92', '83.08', '122.31', '302.31'],
    ['2.0-5.0kg', '70.00', '138.46', '199.23', '484.62'],
  ];

  const zoneMappingRows = [
    ['Zone 1', `${countryName(language, 'MY', 'Malaysia')} 🇲🇾`],
    ['Zone 2', `${tr('asiaPacific')} 🌏`],
    ['Zone 3', `${countryName(language, 'AU', 'Australia')} / ${countryName(language, 'NZ', 'New Zealand')} / ${tr('europe')} / ${countryName(language, 'US', 'United States')} / ${countryName(language, 'CA', 'Canada')} 🇦🇺🇳🇿🇪🇺🇺🇸🇨🇦`],
    ['Zone 4', `${countryName(language, 'IL', 'Israel')} 🇮🇱`],
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
                  {[tr('weight'), 'Zone 1', 'Zone 2', 'Zone 3', 'Zone 4'].map((h) => (
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

          <p><strong>Important:</strong> This service cannot be shipped to PO Box & APO/FPO boxes. Last-mile for this service is DHL; last-mile tracking is viewable on this website.</p>
          <p><strong>USA note:</strong> USA is DDU (Delivery Duty Unpaid) by default; duties and taxes are paid to customs by recipient.</p>
          <p><strong>Etsy note:</strong> Prices on Etsy are fixed to Zone 4. Please kindly contact us for a quote through Etsy messages.</p>
          <p>This service is not posted on Saturdays as shipping is too costly.</p>
          <p><strong>{t('parcelCaseReferenceLink')}:</strong> <Link href="/postal-contacts" style={{ textDecoration: 'underline' }}>{t('postalContactsTitle')}</Link>.</p>
        </div>

        <p className="text-muted">© {new Date().getFullYear()} Rhythm Nexus. {t('copyrightText')}</p>
      </div>
    </>
  );
}

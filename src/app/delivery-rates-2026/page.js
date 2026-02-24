'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '../../LanguageContext';
import { Navigation } from '../../components/Navigation';
import { countryName, makeEmsZoneRegionText, makeSurchargeRegionText, rt } from '../../lib/ratesI18n';

export default function DeliveryRates2026Page() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const tr = (key) => rt(language, key);

  const countries = [
    ['MY', '🇲🇾', 'Malaysia'], ['BN', '🇧🇳', 'Brunei'], ['HK', '🇭🇰', 'Hong Kong SAR China'], ['ID', '🇮🇩', 'Indonesia'], ['PH', '🇵🇭', 'Philippines'],
    ['TH', '🇹🇭', 'Thailand'], ['TW', '🇹🇼', 'Taiwan'], ['CN', '🇨🇳', 'China'], ['IN', '🇮🇳', 'India'], ['KR', '🇰🇷', 'South Korea'],
    ['MO', '🇲🇴', 'Macau SAR China'], ['VN', '🇻🇳', 'Vietnam'], ['AU', '🇦🇺', 'Australia'], ['JP', '🇯🇵', 'Japan'], ['NZ', '🇳🇿', 'New Zealand'],
    ['AT', '🇦🇹', 'Austria'], ['BE', '🇧🇪', 'Belgium'], ['CA', '🇨🇦', 'Canada'], ['CH', '🇨🇭', 'Switzerland'], ['CZ', '🇨🇿', 'Czechia'],
    ['DE', '🇩🇪', 'Germany'], ['ES', '🇪🇸', 'Spain'], ['FI', '🇫🇮', 'Finland'], ['FR', '🇫🇷', 'France'], ['GB', '🇬🇧', 'United Kingdom'],
    ['IE', '🇮🇪', 'Ireland'], ['IT', '🇮🇹', 'Italy'], ['NL', '🇳🇱', 'Netherlands'], ['NO', '🇳🇴', 'Norway'], ['PL', '🇵🇱', 'Poland'],
    ['PT', '🇵🇹', 'Portugal'], ['SE', '🇸🇪', 'Sweden'], ['IL', '🇮🇱', 'Israel'], ['US', '🇺🇸', 'United States'],
  ];

  const epacRows = [
    ['0.00-0.10kg', '$4.40','$4.73','$5.47','$4.73','$5.12','$4.67','$4.90','$5.26','$6.76','$5.83','$6.67','$4.88','$10.81','$7.43','$7.83','$9.33','$11.03','$11.25','$9.43','$8.23','$9.62','$9.92','$11.29','$11.18','$9.82','$11.01','$9.32','$8.44','$9.99','$9.66','$9.91','$10.52','$9.01','$14.61'],
    ['0.10-0.25kg', '$5.83','$6.60','$6.80','$6.00','$6.75','$5.99','$6.90','$7.10','$9.13','$7.74','$8.71','$6.15','$15.29','$11.26','$11.41','$15.93','$14.70','$15.81','$12.96','$13.29','$14.23','$12.78','$14.38','$15.47','$13.11','$14.29','$12.15','$12.43','$12.84','$14.05','$12.93','$14.34','$13.83','$20.13'],
    ['0.25-0.50kg', '$8.22','$9.72','$9.05','$8.13','$9.47','$8.18','$10.24','$10.18','$13.07','$10.91','$12.13','$8.28','$22.75','$17.64','$17.37','$26.93','$20.82','$23.42','$18.82','$21.73','$21.89','$17.55','$19.51','$22.63','$18.59','$19.76','$16.86','$19.09','$17.59','$21.36','$17.96','$20.70','$21.87','$29.33'],
    ['0.50-1.00kg', '$12.99','$15.95','$13.53','$12.37','$14.91','$12.57','$16.91','$16.33','$20.95','$17.26','$18.95','$12.53','$37.67','$30.41','$29.30','$48.93','$33.05','$38.63','$30.55','$38.59','$37.24','$27.09','$29.78','$36.93','$29.55','$30.70','$26.28','$32.39','$27.09','$35.97','$28.01','$33.43','$37.95','$47.73'],
    ['1.00-2.00kg', '$22.53','$28.41','$22.49','$20.87','$25.80','$21.33','$30.26','$28.64','$36.72','$29.95','$32.60','$21.03','$67.52','$55.95','$53.14','$92.93','$57.51','$69.05','$54.01','$72.32','$67.93','$46.16','$50.32','$65.55','$51.47','$52.59','$45.13','$58.99','$46.09','$65.20','$48.13','$58.89','$70.10','$84.54'],
  ];

  const emsRows = [
    ['0.00-0.50kg', '$22.31','$28.08','$29.31','$36.77','$37.77','$36.38','$38.54','$47.38','$53.23','$58.23','$62.85','$63.85'],
    ['0.50-1.00kg', '$25.69','$33.85','$35.15','$46.46','$47.38','$46.27','$47.15','$58.00','$65.77','$71.69','$84.08','$85.08'],
    ['1.00-2.00kg', '$32.54','$45.46','$46.62','$65.77','$66.77','$65.77','$64.38','$79.23','$91.00','$98.69','$126.54','$127.54'],
    ['2.00-5.00kg', '$45.46','$65.85','$69.19','$93.92','$104.38','$107.73','$121.85','$117.85','$136.31','$145.62','$208.85','$205.62'],
  ];

  const surchargeRows = [
    ['US', '$2.50','$2.63','$2.75','$2.88','$3.00','$3.13','$3.25','$3.38'],
    ['CA', '$1.73','$1.82','$1.90','$1.99','$2.08','$2.16','$2.25','$2.34'],
    ['AU', '$1.15','$1.21','$1.27','$1.33','$1.38','$1.44','$1.50','$1.56'],
    ['EU_GB', '$0.96','$1.01','$1.06','$1.11','$1.15','$1.20','$1.25','$1.30'],
    ['APAC_IL', '$0.54','$0.57','$0.59','$0.62','$0.65','$0.67','$0.70','$0.73'],
  ];

  const currentSurchargeRows = [
    ['US', '$2.63'],
    ['CA', '$1.82'],
    ['AU', '$1.21'],
    ['EU_GB', '$1.01'],
    ['APAC_IL', '$0.57'],
  ];

  const countryNames = {
    hk: countryName(language, 'HK', 'Hong Kong SAR China'),
    mo: countryName(language, 'MO', 'Macau SAR China'),
    tw: countryName(language, 'TW', 'Taiwan'),
    jp: countryName(language, 'JP', 'Japan'),
    kr: countryName(language, 'KR', 'South Korea'),
    au: countryName(language, 'AU', 'Australia'),
    nz: countryName(language, 'NZ', 'New Zealand'),
    cz: countryName(language, 'CZ', 'Czechia'),
    ca: countryName(language, 'CA', 'Canada'),
    us: countryName(language, 'US', 'United States'),
    gb: countryName(language, 'GB', 'United Kingdom'),
    il: countryName(language, 'IL', 'Israel'),
  };

  const zoneLabel = (suffix) => `${tr('zone')} ${suffix}`;

  const emsZoneMapRows = [
    [zoneLabel('A'), `${countryName(language, 'MY', 'Malaysia')} 🇲🇾`],
    [zoneLabel('B'), makeEmsZoneRegionText(language, 'southeastAsia', countryNames)],
    [zoneLabel('C'), makeEmsZoneRegionText(language, 'hkMoTw', countryNames)],
    [zoneLabel('D'), `${countryName(language, 'CN', 'China')} 🇨🇳`],
    [zoneLabel('E'), makeEmsZoneRegionText(language, 'jpKr', countryNames)],
    [zoneLabel('F'), `${countryName(language, 'IN', 'India')} 🇮🇳`],
    [zoneLabel('G'), makeEmsZoneRegionText(language, 'auNz', countryNames)],
    [zoneLabel('H'), `${countryName(language, 'GB', 'United Kingdom')} 🇬🇧`],
    [zoneLabel('I'), makeEmsZoneRegionText(language, 'euExceptCz', countryNames)],
    [zoneLabel('J'), makeEmsZoneRegionText(language, 'caUs', countryNames)],
    [zoneLabel('K'), `${countryName(language, 'CZ', 'Czechia')} 🇨🇿`],
    [zoneLabel('L'), `${countryName(language, 'IL', 'Israel')} 🇮🇱`],
  ];

  const epacWeightHeaders = epacRows.map((row) => row[0]);
  const epacCountryRows = countries.map(([code, flag, fallbackName], countryIndex) => ({
    key: code,
    country: `${countryName(language, code, fallbackName)} (${code} ${flag})`,
    rates: epacRows.map((row) => row[countryIndex + 1]),
  }));

  return (
    <>
      <Navigation />
      <div className="container mt-5 rates-page">
        <button onClick={() => router.back()} className="back-button"><span>&larr;</span> {t('backButton')}</button>

        <div className="blog-content-card rates-card">
          <h2>{t('deliveryRates2026')}</h2>
          <p className="rates-links">
            <strong>{tr('relatedRates')}:</strong>{' '}
            <Link href="/speedpost-express-rates" style={{ textDecoration: 'underline' }}>{t('speedPostRates')}</Link>{' | '}
            <Link href="/singapore-rates" style={{ textDecoration: 'underline' }}>{t('sgDeliveryRates')}</Link>
          </p>
          <p><strong>{tr('epacRates2026')}</strong></p>

          <div className="rates-table-wrap">
            <table className="rates-table">
              <thead>
                <tr>
                  <th>{tr('countryFullName')}</th>
                  {epacWeightHeaders.map((weightBand) => <th key={weightBand}>{weightBand}</th>)}
                </tr>
              </thead>
              <tbody>
                {epacCountryRows.map((row) => (
                  <tr key={row.key}>
                    <td className="rates-country-cell">{row.country}</td>
                    {row.rates.map((cell, index) => <td key={`${row.key}-${index}`}>{cell}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p>{tr('epacSaturdayGlobal')}</p>

          <h4>{tr('emsRates2026')}</h4>

          <div className="rates-table-wrap">
            <table className="rates-table">
              <thead>
                <tr>
                  <th>{tr('zone')}</th>
                  <th>{tr('countryRegion')}</th>
                </tr>
              </thead>
              <tbody>
                {emsZoneMapRows.map(([zone, country]) => (
                  <tr key={zone}>
                    <td>{zone}</td>
                    <td>{country}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="rates-table-wrap">
            <table className="rates-table">
              <thead>
                <tr>
                  {[tr('weight'), zoneLabel('A'), zoneLabel('B'), zoneLabel('C'), zoneLabel('D'), zoneLabel('E'), zoneLabel('F'), zoneLabel('G'), zoneLabel('H'), zoneLabel('I'), zoneLabel('J'), zoneLabel('K'), zoneLabel('L')].map((heading) => (
                    <th key={heading}>{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {emsRows.map((row) => (
                  <tr key={row[0]}>
                    {row.map((cell, index) => <td key={`${row[0]}-${index}`}>{cell}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h4 style={{ marginTop: 16 }}>{tr('handlingFeeSurcharge')}</h4>
          <div className="rates-table-wrap">
            <table className="rates-table">
              <thead>
                <tr>
                  {[tr('country'), tr('noSurcharge'), '5%', '10%', '15%', '20%', '25%', '30%', '35%'].map((heading) => (
                    <th key={heading}>{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {surchargeRows.map((row) => (
                  <tr key={row[0]}>
                    {row.map((cell, index) => {
                      if (index !== 0) {
                        return <td key={`${row[0]}-${index}`}>{cell}</td>;
                      }
                      const regionLabel =
                        row[0] === 'US'
                          ? countryName(language, 'US', 'United States')
                          : row[0] === 'CA'
                            ? countryName(language, 'CA', 'Canada')
                            : row[0] === 'AU'
                              ? countryName(language, 'AU', 'Australia')
                              : row[0] === 'EU_GB'
                                ? makeSurchargeRegionText(language, 'europeInclUk', countryNames)
                                : makeSurchargeRegionText(language, 'asiaPacificIsrael', countryNames);
                      return <td key={`${row[0]}-${index}`}>{regionLabel}</td>;
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h4 style={{ marginTop: 16 }}>{tr('currentSurchargeRates')}</h4>
          <div className="rates-table-wrap">
            <table className="rates-table">
              <thead>
                <tr>
                  <th>{tr('region')}</th>
                  <th>{tr('currentPrice')}</th>
                </tr>
              </thead>
              <tbody>
                {currentSurchargeRows.map(([region, price]) => (
                  <tr key={region}>
                    <td>
                      {region === 'US'
                        ? countryName(language, 'US', 'United States')
                        : region === 'CA'
                          ? countryName(language, 'CA', 'Canada')
                          : region === 'AU'
                            ? countryName(language, 'AU', 'Australia')
                            : region === 'EU_GB'
                              ? makeSurchargeRegionText(language, 'europeInclUk', countryNames)
                              : makeSurchargeRegionText(language, 'asiaPacificIsrael', countryNames)}
                    </td>
                    <td>{price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p><strong>{tr('notes')}:</strong> {tr('etsyZoneLNoEmsSaturday')}</p>
          <p><strong>{t('parcelCaseReferenceLink')}:</strong> <Link href="/postal-contacts" style={{ textDecoration: 'underline' }}>{t('postalContactsTitle')}</Link>.</p>
        </div>

        <p className="text-muted">© {new Date().getFullYear()} Rhythm Nexus. {t('copyrightText')}</p>
      </div>
    </>
  );
}

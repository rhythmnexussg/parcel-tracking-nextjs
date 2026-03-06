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
    ['0.00-0.10kg', '$4.38','$4.71','$5.44','$4.70','$5.09','$4.65','$4.88','$5.23','$6.73','$5.81','$6.64','$4.85','$10.75','$7.40','$7.81','$9.28','$10.98','$11.16','$9.38','$8.18','$9.57','$9.87','$11.25','$11.13','$9.77','$10.96','$9.27','$8.39','$9.94','$9.62','$9.86','$10.47','$8.98','$14.47'],
    ['0.10-0.25kg', '$5.81','$6.58','$6.78','$5.97','$6.72','$5.96','$6.88','$7.08','$9.10','$7.72','$8.68','$6.12','$15.23','$11.23','$11.38','$15.88','$14.65','$15.72','$12.91','$13.24','$14.18','$12.73','$14.33','$15.42','$13.06','$14.24','$12.10','$12.38','$12.79','$14.00','$12.88','$14.29','$13.81','$19.99'],
    ['0.25-0.50kg', '$8.19','$9.69','$9.02','$8.10','$9.45','$8.15','$10.22','$10.15','$13.04','$10.88','$12.10','$8.25','$22.69','$17.62','$17.35','$26.88','$20.77','$23.33','$18.77','$21.68','$21.85','$17.50','$19.46','$22.58','$18.54','$19.72','$16.81','$19.04','$17.54','$21.31','$17.91','$20.65','$21.85','$29.19'],
    ['0.50-1.00kg', '$12.96','$15.92','$13.50','$12.35','$14.88','$12.54','$16.88','$16.31','$20.92','$17.23','$18.92','$12.50','$37.62','$30.38','$29.27','$48.88','$33.00','$38.54','$30.50','$38.54','$37.19','$27.04','$29.73','$36.88','$29.50','$30.65','$26.23','$32.34','$27.04','$35.92','$27.96','$33.38','$37.92','$47.60'],
    ['1.00-2.00kg', '$22.50','$28.38','$22.46','$20.85','$25.77','$21.31','$30.23','$28.62','$36.69','$29.92','$32.58','$21.00','$67.46','$55.92','$53.12','$92.88','$57.46','$68.96','$53.96','$72.27','$67.88','$46.12','$50.27','$65.50','$51.42','$52.54','$45.08','$58.95','$46.04','$65.15','$48.08','$58.85','$70.08','$84.40'],
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
    ['US', '$2.50'],
    ['CA', '$1.73'],
    ['AU', '$1.15'],
    ['EU_GB', '$0.96'],
    ['APAC_IL', '$0.54'],
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

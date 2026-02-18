'use client';

import React, { useState, useEffect } from 'react';

const HolidayNotification = ({ userCountry, t, currentLanguage }) => {
  const [currentHoliday, setCurrentHoliday] = useState(null);

  useEffect(() => {
    const checkHolidays = () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth(); // 0-indexed
      const day = now.getDate();

      // Helper function to get first Monday of September (for US/CA Labor Day)
      const getFirstMondayOfSeptember = (year) => {
        const sept1 = new Date(year, 8, 1); // September 1
        const dayOfWeek = sept1.getDay(); // 0 = Sunday, 1 = Monday, etc.
        const daysUntilMonday = dayOfWeek === 0 ? 1 : (8 - dayOfWeek) % 7;
        const firstMonday = 1 + daysUntilMonday;
        return new Date(year, 8, firstMonday);
      };

      const usCanadaLaborDay = getFirstMondayOfSeptember(year);

      // Define holidays with their date ranges and applicable countries/languages
      const holidays = [
        // Hari Raya (Eid Al Fitr) - March 21, 2026
        {
          name: 'hariRaya',
          startDate: new Date(2026, 2, 21, 0, 0, 0), // March 21
          endDate: new Date(2026, 2, 21, 23, 59, 59), // March 21
          countries: ['ID', 'BN', 'MY', 'SG'],
          languages: ['en', 'ms', 'id', 'zh', 'zh-hant']
        },
        // Deepavali - November 8, 2026 (Singapore & Malaysia)
        {
          name: 'deepavali',
          startDate: new Date(2026, 10, 8, 0, 0, 0), // November 8
          endDate: new Date(2026, 10, 8, 23, 59, 59), // November 8
          countries: ['SG', 'MY'],
          languages: ['en', 'zh', 'zh-hant', 'ms']
        },
        // Diwali - November 8, 2026 (India)
        {
          name: 'diwali',
          startDate: new Date(2026, 10, 8, 0, 0, 0), // November 8
          endDate: new Date(2026, 10, 8, 23, 59, 59), // November 8
          countries: ['IN'],
          languages: ['en', 'hi']
        },
        // Vesak - May 11 (Thailand)
        {
          name: 'vesakTH',
          startDate: new Date(2026, 4, 11, 0, 0, 0), // May 11
          endDate: new Date(2026, 4, 11, 23, 59, 59), // May 11
          countries: ['TH'],
          languages: ['en', 'th']
        },
        // Vesak - May 12 (Malaysia, Singapore, Indonesia)
        {
          name: 'vesak',
          startDate: new Date(2026, 4, 12, 0, 0, 0), // May 12
          endDate: new Date(2026, 4, 12, 23, 59, 59), // May 12
          countries: ['MY', 'SG', 'ID'],
          languages: ['en', 'ms', 'id', 'zh', 'zh-hant', 'th']
        },
        // Labor Day - May 1 (International, excluding US and Canada)
        { 
          name: 'laborDay', 
          startDate: new Date(year, 4, 1, 0, 0, 0), // May 1
          endDate: new Date(year, 4, 1, 23, 59, 59), // May 1
          countries: ['AU', 'NZ', 'GB', 'FR', 'DE', 'ES', 'IT', 'PT', 'NL', 'BE', 'AT', 'CH', 'NO', 'SE', 'FI', 'DK', 'IE', 'PL', 'CZ', 'SK', 'HU', 'RO', 'BG', 'GR', 'HR', 'SI', 'LT', 'LV', 'EE', 'MT', 'CY', 'LU', 'IS', 'RU', 'CN', 'HK', 'MO', 'TW', 'JP', 'KR', 'SG', 'MY', 'TH', 'VN', 'PH', 'ID', 'IN', 'BD', 'PK', 'LK', 'MM', 'KH', 'LA', 'BN', 'NP', 'MV', 'BT', 'TL', 'MN', 'KZ', 'UZ', 'TJ', 'KG', 'TM', 'AM', 'GE', 'AZ', 'BY', 'UA', 'MD', 'RS', 'BA', 'ME', 'MK', 'AL', 'XK', 'ZA', 'EG', 'NG', 'KE', 'GH', 'TZ', 'UG', 'AO', 'MZ', 'MG', 'CM', 'CI', 'NE', 'BF', 'ML', 'MW', 'ZM', 'SN', 'SO', 'TD', 'GN', 'RW', 'BJ', 'TN', 'BI', 'SS', 'TG', 'SL', 'LY', 'LR', 'MR', 'CF', 'ER', 'GM', 'BW', 'GA', 'GW', 'GQ', 'MU', 'SZ', 'DJ', 'KM', 'CV', 'ST', 'SC', 'BR', 'MX', 'AR', 'CO', 'PE', 'VE', 'CL', 'EC', 'GT', 'CU', 'BO', 'HT', 'DO', 'HN', 'PY', 'NI', 'SV', 'CR', 'PA', 'UY', 'JM', 'TT', 'GY', 'SR', 'BB', 'BS', 'BZ', 'AG', 'GD', 'LC', 'VC', 'DM', 'KN', 'IL', 'JO', 'LB', 'OM', 'KW', 'QA', 'BH', 'AE', 'SA', 'YE', 'SY', 'IQ'], 
          languages: 'all' 
        },
        // Labor Day - First Monday of September (USA and Canada)
        { 
          name: 'laborDayUSCA', 
          startDate: new Date(usCanadaLaborDay.getFullYear(), usCanadaLaborDay.getMonth(), usCanadaLaborDay.getDate(), 0, 0, 0),
          endDate: new Date(usCanadaLaborDay.getFullYear(), usCanadaLaborDay.getMonth(), usCanadaLaborDay.getDate(), 23, 59, 59),
          countries: ['US', 'CA'], 
          languages: 'all' 
        },
        // National Days - All Countries
        { name: 'singaporeNationalDay', startDate: new Date(year, 7, 9, 0, 0, 0), endDate: new Date(year, 7, 9, 23, 59, 59), countries: ['SG'], languages: 'all' },
        { name: 'indonesiaNationalDay', startDate: new Date(year, 7, 17, 0, 0, 0), endDate: new Date(year, 7, 17, 23, 59, 59), countries: ['ID'], languages: 'all' },
        { name: 'malaysiaNationalDay', startDate: new Date(year, 7, 31, 0, 0, 0), endDate: new Date(year, 7, 31, 23, 59, 59), countries: ['MY'], languages: 'all' },
        { name: 'australiaNationalDay', startDate: new Date(year, 0, 26, 0, 0, 0), endDate: new Date(year, 0, 26, 23, 59, 59), countries: ['AU'], languages: 'all' },
        { name: 'canadaNationalDay', startDate: new Date(year, 6, 1, 0, 0, 0), endDate: new Date(year, 6, 1, 23, 59, 59), countries: ['CA'], languages: 'all' },
        { name: 'hongKongHandoverDay', startDate: new Date(year, 6, 1, 0, 0, 0), endDate: new Date(year, 6, 1, 23, 59, 59), countries: ['HK'], languages: 'all' },
        { name: 'usaNationalDay', startDate: new Date(year, 6, 4, 0, 0, 0), endDate: new Date(year, 6, 4, 23, 59, 59), countries: ['US'], languages: 'all' },
        { name: 'franceBastilleDay', startDate: new Date(year, 6, 14, 0, 0, 0), endDate: new Date(year, 6, 14, 23, 59, 59), countries: ['FR'], languages: 'all' },
        { name: 'germanyUnityDay', startDate: new Date(year, 9, 3, 0, 0, 0), endDate: new Date(year, 9, 3, 23, 59, 59), countries: ['DE'], languages: 'all' },
        { name: 'italyRepublicDay', startDate: new Date(year, 5, 2, 0, 0, 0), endDate: new Date(year, 5, 2, 23, 59, 59), countries: ['IT'], languages: 'all' },
        { name: 'spainNationalDay', startDate: new Date(year, 9, 12, 0, 0, 0), endDate: new Date(year, 9, 12, 23, 59, 59), countries: ['ES'], languages: 'all' },
        { name: 'japanFoundationDay', startDate: new Date(year, 1, 11, 0, 0, 0), endDate: new Date(year, 1, 11, 23, 59, 59), countries: ['JP'], languages: 'all' },
        { name: 'taiwanFoundingDay', startDate: new Date(year, 0, 1, 0, 0, 0), endDate: new Date(year, 0, 1, 23, 59, 59), countries: ['TW'], languages: 'all' },
        { name: 'chinaNationalDay', startDate: new Date(year, 9, 1, 0, 0, 0), endDate: new Date(year, 9, 1, 23, 59, 59), countries: ['CN', 'HK', 'MO'], languages: 'all' },
        { name: 'taiwanNationalDay', startDate: new Date(year, 9, 10, 0, 0, 0), endDate: new Date(year, 9, 10, 23, 59, 59), countries: ['TW'], languages: 'all' },
        { name: 'koreaLiberationDay', startDate: new Date(year, 7, 15, 0, 0, 0), endDate: new Date(year, 7, 15, 23, 59, 59), countries: ['KR'], languages: 'all' },
        { name: 'indiaIndependenceDay', startDate: new Date(year, 7, 15, 0, 0, 0), endDate: new Date(year, 7, 15, 23, 59, 59), countries: ['IN'], languages: 'all' },
        { name: 'thailandNationalDay', startDate: new Date(year, 11, 5, 0, 0, 0), endDate: new Date(year, 11, 5, 23, 59, 59), countries: ['TH'], languages: 'all' },
        { name: 'philippinesIndependenceDay', startDate: new Date(year, 5, 12, 0, 0, 0), endDate: new Date(year, 5, 12, 23, 59, 59), countries: ['PH'], languages: 'all' },
        { name: 'vietnamNationalDay', startDate: new Date(year, 8, 2, 0, 0, 0), endDate: new Date(year, 8, 2, 23, 59, 59), countries: ['VN'], languages: 'all' },
        { name: 'polandNationalDay', startDate: new Date(year, 10, 11, 0, 0, 0), endDate: new Date(year, 10, 11, 23, 59, 59), countries: ['PL'], languages: 'all' },
        { name: 'czechNationalDay', startDate: new Date(year, 9, 28, 0, 0, 0), endDate: new Date(year, 9, 28, 23, 59, 59), countries: ['CZ'], languages: 'all' },
        { name: 'netherlandsKingsDay', startDate: new Date(year, 3, 27, 0, 0, 0), endDate: new Date(year, 3, 27, 23, 59, 59), countries: ['NL'], languages: 'all' },
        { name: 'norwayConstitutionDay', startDate: new Date(year, 4, 17, 0, 0, 0), endDate: new Date(year, 4, 17, 23, 59, 59), countries: ['NO'], languages: 'all' },
        { name: 'swedenNationalDay', startDate: new Date(year, 5, 6, 0, 0, 0), endDate: new Date(year, 5, 6, 23, 59, 59), countries: ['SE'], languages: 'all' },
        { name: 'macauHandoverDay', startDate: new Date(year, 11, 20, 0, 0, 0), endDate: new Date(year, 11, 20, 23, 59, 59), countries: ['MO'], languages: 'all' },
        { name: 'finlandIndependenceDay', startDate: new Date(year, 11, 6, 0, 0, 0), endDate: new Date(year, 11, 6, 23, 59, 59), countries: ['FI'], languages: 'all' },
        { name: 'portugalNationalDay', startDate: new Date(year, 5, 10, 0, 0, 0), endDate: new Date(year, 5, 10, 23, 59, 59), countries: ['PT'], languages: 'all' },
        { name: 'israelIndependenceDay', startDate: new Date(year, 4, 14, 0, 0, 0), endDate: new Date(year, 4, 14, 23, 59, 59), countries: ['IL'], languages: 'all' },
        { name: 'irelandNationalDay', startDate: new Date(year, 2, 17, 0, 0, 0), endDate: new Date(year, 2, 17, 23, 59, 59), countries: ['IE'], languages: 'all' },
        { name: 'bruneiNationalDay', startDate: new Date(year, 1, 23, 0, 0, 0), endDate: new Date(year, 1, 23, 23, 59, 59), countries: ['BN'], languages: 'all' },
        { name: 'newZealandWaitangiDay', startDate: new Date(year, 1, 6, 0, 0, 0), endDate: new Date(year, 1, 6, 23, 59, 59), countries: ['NZ'], languages: 'all' },
        { name: 'switzerlandNationalDay', startDate: new Date(year, 7, 1, 0, 0, 0), endDate: new Date(year, 7, 1, 23, 59, 59), countries: ['CH'], languages: 'all' },
        { name: 'austriaNationalDay', startDate: new Date(year, 9, 26, 0, 0, 0), endDate: new Date(year, 9, 26, 23, 59, 59), countries: ['AT'], languages: 'all' },
        { name: 'belgiumNationalDay', startDate: new Date(year, 6, 21, 0, 0, 0), endDate: new Date(year, 6, 21, 23, 59, 59), countries: ['BE'], languages: 'all' },
        { name: 'russiaDayOfRussia', startDate: new Date(year, 5, 12, 0, 0, 0), endDate: new Date(year, 5, 12, 23, 59, 59), countries: ['RU'], languages: 'all' }
      ];

      // Find active holiday
      for (const holiday of holidays) {
        if (now >= holiday.startDate && now <= holiday.endDate) {
          // Check if user's country matches
          if (holiday.countries.includes(userCountry)) {
            // Check if current language is supported
            if (holiday.languages === 'all' || holiday.languages.includes(currentLanguage)) {
              setCurrentHoliday(holiday.name);
              return;
            }
          }
        }
      }

      setCurrentHoliday(null);
    };

    checkHolidays();
    
    // Check every minute in case date changes
    const interval = setInterval(checkHolidays, 60000);
    
    return () => clearInterval(interval);
  }, [userCountry, currentLanguage]);

  if (!currentHoliday) {
    return null;
  }

  const message = t(currentHoliday + 'Message');
  
  // Only show if translation exists
  if (!message || message === currentHoliday + 'Message') {
    return null;
  }

  return (
    <div className="navbar-holiday-message">
      {message}
    </div>
  );
};

export default HolidayNotification;

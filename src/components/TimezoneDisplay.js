'use client';

import React, { useState, useEffect } from 'react';

// Timezone mappings for each destination country
// Countries with multiple timezones use array format: [{ name, timezone }]
const countryTimezones = {
  SG: 'Asia/Singapore',
  AU: [
    { name: 'AWST', timezone: 'Australia/Perth' },
    { name: 'ACWST', timezone: 'Australia/Eucla' },
    { name: 'ACST', timezone: 'Australia/Adelaide' },
    { name: 'AEST', timezone: 'Australia/Sydney' },
  ],
  AT: 'Europe/Vienna',
  BE: 'Europe/Brussels',
  BN: 'Asia/Brunei',
  CA: [
    { name: 'NST (Nfld)', timezone: 'America/St_Johns' },
    { name: 'AST', timezone: 'America/Halifax' },
    { name: 'EST', timezone: 'America/Toronto' },
    { name: 'CST', timezone: 'America/Winnipeg' },
    { name: 'CST (SK)', timezone: 'America/Regina' },
    { name: 'MST', timezone: 'America/Edmonton' },
    { name: 'PST', timezone: 'America/Vancouver' },
    { name: 'MST (YT)', timezone: 'America/Whitehorse' },
    { name: 'EST (NU)', timezone: 'America/Coral_Harbour' },
  ],
  CN: 'Asia/Shanghai',
  CZ: 'Europe/Prague',
  FI: 'Europe/Helsinki',
  FR: 'Europe/Paris',
  DE: 'Europe/Berlin',
  HK: 'Asia/Hong_Kong',
  IN: 'Asia/Kolkata',
  ID: [
    { name: 'Jakarta (WIB)', timezone: 'Asia/Jakarta' },
    { name: 'Makassar (WITA)', timezone: 'Asia/Makassar' },
    { name: 'Jayapura (WIT)', timezone: 'Asia/Jayapura' },
  ],
  IE: 'Europe/Dublin',
  IL: 'Asia/Jerusalem',
  IT: 'Europe/Rome',
  JP: 'Asia/Tokyo', 
  MO: 'Asia/Macau',
  MY: 'Asia/Kuala_Lumpur',
  NO: 'Europe/Oslo',
  NL: 'Europe/Amsterdam',
  NZ: 'Pacific/Auckland',
  PH: 'Asia/Manila',
  PL: 'Europe/Warsaw',
  PT: 'Europe/Lisbon',
  KR: 'Asia/Seoul',
  ES: 'Europe/Madrid',
  SE: 'Europe/Stockholm',
  CH: 'Europe/Zurich',
  TW: 'Asia/Taipei',
  TH: 'Asia/Bangkok',
  GB: 'Europe/London',
  US: [
    { name: 'Eastern (EST)', timezone: 'America/New_York' },
    { name: 'Central (CST)', timezone: 'America/Chicago' },
    { name: 'Mountain (MST)', timezone: 'America/Denver' },
    { name: 'Pacific (PST)', timezone: 'America/Los_Angeles' },
    { name: 'Alaska (AKST)', timezone: 'America/Anchorage' },
    { name: 'Hawaii (HST)', timezone: 'Pacific/Honolulu' },
  ],
  VN: 'Asia/Ho_Chi_Minh',
};

const countryFlags = {
  SG: '🇸🇬', AU: '🇦🇺', AT: '🇦🇹', BE: '🇧🇪', BN: '🇧🇳', CA: '🇨🇦',
  CN: '🇨🇳', CZ: '🇨🇿', FI: '🇫🇮', FR: '🇫🇷', DE: '🇩🇪', HK: '🇭🇰',
  IN: '🇮🇳', ID: '🇮🇩', IE: '🇮🇪', IL: '🇮🇱', IT: '🇮🇹', JP: '🇯🇵',
  MO: '🇲🇴', MY: '🇲🇾', NO: '🇳🇴', NL: '🇳🇱', NZ: '🇳🇿', PH: '🇵🇭',
  PL: '🇵🇱', PT: '🇵🇹', KR: '🇰🇷', ES: '🇪🇸', SE: '🇸🇪', CH: '🇨🇭',
  TW: '🇹🇼', TH: '🇹🇭', GB: '🇬🇧', US: '🇺🇸', VN: '🇻🇳',
};

const TimezoneDisplay = ({ destinationCountry, userCountry, t, getCountryName }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMobile, setIsMobile] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
    
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // If no destination country selected, don't show anything
  if (!destinationCountry || !isMounted) return null;
  
  // If user is in Singapore, only show Singapore time
  const isUserInSingapore = userCountry === 'SG';
  const BC_PERMANENT_PDT_START_UTC_MS = Date.UTC(2026, 2, 8, 10, 0, 0);

  const isBcPermanentPdtActiveAt = (date) => date.getTime() >= BC_PERMANENT_PDT_START_UTC_MS;

  const getEffectiveTimezoneAt = (timezone, date) => {
    if (timezone === 'America/Vancouver' && isBcPermanentPdtActiveAt(date)) {
      return 'America/Whitehorse';
    }
    return timezone;
  };

  const getUTCOffsetMinutesAt = (timezone, date) => {
    const effectiveTimezone = getEffectiveTimezoneAt(timezone, date);

    try {
      const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: effectiveTimezone,
        timeZoneName: 'shortOffset',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }).formatToParts(date);

      const offsetName = parts.find((part) => part.type === 'timeZoneName')?.value || '';
      const offsetMatch = offsetName.match(/GMT([+-]\d{1,2})(?::?(\d{2}))?/i);
      if (offsetMatch) {
        const signHours = parseInt(offsetMatch[1], 10);
        const minutesPart = parseInt(offsetMatch[2] || '0', 10);
        const sign = signHours < 0 ? -1 : 1;
        return signHours * 60 + sign * minutesPart;
      }
    } catch (_) {
      // Fallback below
    }

    try {
      const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
      const tzDate = new Date(date.toLocaleString('en-US', { timeZone: effectiveTimezone }));
      return Math.round((tzDate - utcDate) / (1000 * 60));
    } catch (_) {
      return 0;
    }
  };
  
  const formatTime = (timezone, countryCode) => {
    const effectiveTimezone = getEffectiveTimezoneAt(timezone, currentTime);

    try {
      const options = {
        timeZone: effectiveTimezone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      };
      
      const timeString = currentTime.toLocaleTimeString('en-US', options);
      const countryName = getCountryName ? getCountryName(countryCode) : countryCode;
      
      return {
        time: timeString,
        country: countryName,
        timezone,
      };
    } catch (error) {
      console.error(`Error formatting time for ${timezone}:`, error);
      return null;
    }
  };
  
  // Check if destination has daylight saving time active
  const isDST = (timezone) => {
    try {
      const january = new Date(Date.UTC(currentTime.getFullYear(), 0, 15, 12, 0, 0));
      const july = new Date(Date.UTC(currentTime.getFullYear(), 6, 15, 12, 0, 0));

      const janOffset = getUTCOffsetMinutesAt(timezone, january);
      const julOffset = getUTCOffsetMinutesAt(timezone, july);
      const currentOffset = getUTCOffsetMinutesAt(timezone, currentTime);

      const maxOffset = Math.max(janOffset, julOffset);
      return currentOffset === maxOffset && janOffset !== julOffset;
    } catch (_) {
      return false;
    }
  };
  
  // Check if it's past 3am in the given timezone (when DST notification should disappear)
  const isPast3AM = (timezone) => {
    try {
      const timeString = currentTime.toLocaleString('en-US', {
        timeZone: timezone,
        hour: 'numeric',
        hour12: false
      });
      const hour = parseInt(timeString.match(/\d+/)?.[0] || '0');
      return hour >= 3;
    } catch (error) {
      return false;
    }
  };
  
  // Get dynamic timezone name with DST-aware abbreviation
  const getTimezoneName = (timezone, baseName) => {
    const inDST = isDST(timezone);
    
    // Australia - Southern Hemisphere DST
    if (timezone === 'Australia/Sydney') {
      const code = inDST ? 'AEDT' : 'AEST';
      return code;
    }
    if (timezone === 'Australia/Adelaide') {
      const code = inDST ? 'ACDT' : 'ACST';
      return code;
    }
    if (timezone === 'Australia/Broken_Hill') {
      const code = inDST ? 'ACDT' : 'ACST';
      return code;
    }
    if (timezone === 'Australia/Darwin') {
      return 'ACST';
    }
    if (timezone === 'Australia/Brisbane') {
      return 'AEST';
    }
    if (timezone === 'Australia/Eucla') {
      return 'ACWST';
    }
    if (timezone === 'Australia/Perth') {
      return 'AWST';
    }
    
    // New Zealand - Southern Hemisphere DST
    if (timezone === 'Pacific/Auckland') {
      const code = inDST ? 'NZDT' : 'NZST';
      return `Auckland (${code})`;
    }
    
    // USA - Northern Hemisphere DST
    if (timezone === 'America/New_York') {
      const code = inDST ? 'EDT' : 'EST';
      return `Eastern (${code})`;
    }
    if (timezone === 'America/Chicago') {
      const code = inDST ? 'CDT' : 'CST';
      return `Central (${code})`;
    }
    if (timezone === 'America/Denver') {
      const code = inDST ? 'MDT' : 'MST';
      return `Mountain (${code})`;
    }
    if (timezone === 'America/Phoenix') {
      return `Arizona (MST)`;
    }
    if (timezone === 'America/Los_Angeles') {
      const code = inDST ? 'PDT' : 'PST';
      return `Pacific (${code})`;
    }
    if (timezone === 'America/Anchorage') {
      const code = inDST ? 'AKDT' : 'AKST';
      return `Alaska (${code})`;
    }
    if (timezone === 'Pacific/Honolulu') {
      return `Hawaii (HST)`;
    }
    
    // Canada - Northern Hemisphere DST
    if (timezone === 'America/St_Johns') {
      const code = inDST ? 'NDT' : 'NST';
      return `Newfoundland (${code})`;
    }
    if (timezone === 'America/Halifax') {
      const code = inDST ? 'ADT' : 'AST';
      return `Atlantic (${code})`;
    }
    if (timezone === 'America/Toronto') {
      const code = inDST ? 'EDT' : 'EST';
      return `Eastern (${code})`;
    }
    if (timezone === 'America/Winnipeg') {
      const code = inDST ? 'CDT' : 'CST';
      return `Central (${code})`;
    }
    if (timezone === 'America/Edmonton') {
      const code = inDST ? 'MDT' : 'MST';
      return `Mountain (${code})`;
    }
    if (timezone === 'America/Vancouver') {
      if (isBcPermanentPdtActiveAt(currentTime)) {
        return 'PDT';
      }
      const code = inDST ? 'PDT' : 'PST';
      return code;
    }
    if (timezone === 'America/Regina') {
      return 'CST (SK)';
    }
    if (timezone === 'America/Whitehorse') {
      return 'MST (YT)';
    }
    if (timezone === 'America/Coral_Harbour') {
      return 'EST (NU)';
    }
    
    return baseName;
  };
  
  const getTimeDifference = (timezone) => {
    const singaporeOffset = getUTCOffsetMinutesAt('Asia/Singapore', currentTime);
    const destinationOffset = getUTCOffsetMinutesAt(timezone, currentTime);
    return (destinationOffset - singaporeOffset) / 60;
  };

  const singaporeTime = formatTime('Asia/Singapore', 'SG');
  const destinationTimezone = countryTimezones[destinationCountry];
  const destinationTimezonesToRender = (() => {
    if (!Array.isArray(destinationTimezone)) return destinationTimezone;
    if (destinationCountry === 'AU') {
      const easternDstActive = isDST('Australia/Sydney');
      const centralDstActive = isDST('Australia/Adelaide') || isDST('Australia/Broken_Hill');
      const isDstSeason = easternDstActive || centralDstActive;

      if (isDstSeason) {
        return [
          { name: `AWST (${t ? t('tzAWST') : 'AWST'}) WA`, timezone: 'Australia/Perth' },
          { name: 'ACWST WA-SA', timezone: 'Australia/Eucla' },
          { name: `ACST (${t ? t('tzACST') : 'ACST'}) NT`, timezone: 'Australia/Darwin' },
          { name: 'ACDT SA/BH', timezone: 'Australia/Adelaide' },
          { name: `AEST (${t ? t('tzAEST') : 'AEST'}) QLD`, timezone: 'Australia/Brisbane' },
          { name: 'AEDT NSW/TAS/VIC/ACT/JBT', timezone: 'Australia/Sydney' },
        ];
      }

      return [
        { name: `AWST (${t ? t('tzAWST') : 'AWST'}) WA`, timezone: 'Australia/Perth' },
        { name: 'ACWST WA-SA', timezone: 'Australia/Eucla' },
        { name: 'ACST SA/NT/BH', timezone: 'Australia/Adelaide' },
        { name: `AEST (${t ? t('tzAEST') : 'AEST'}) NSW/QLD/TAS/VIC/ACT/JBT`, timezone: 'Australia/Sydney' },
      ];
    }
    if (destinationCountry !== 'US') return destinationTimezone;

    const usDstActive = isDST('America/Denver');
    if (!usDstActive) return destinationTimezone;

    const hasArizona = destinationTimezone.some((entry) => entry.timezone === 'America/Phoenix');
    if (hasArizona) return destinationTimezone;

    const mountainIndex = destinationTimezone.findIndex((entry) => entry.timezone === 'America/Denver');
    const arizonaEntry = { name: 'Arizona (MST)', timezone: 'America/Phoenix' };

    if (mountainIndex === -1) {
      return [...destinationTimezone, arizonaEntry];
    }

    return [
      ...destinationTimezone.slice(0, mountainIndex + 1),
      arizonaEntry,
      ...destinationTimezone.slice(mountainIndex + 1),
    ];
  })();

  const isUsDstWithArizona =
    destinationCountry === 'US'
    && Array.isArray(destinationTimezonesToRender)
    && destinationTimezonesToRender.some((entry) => entry.timezone === 'America/Phoenix');
  
  const getTimeDiffText = (diffHours) => {
    if (diffHours === 0) {
      return t ? t('sameTimeAsSingapore') : 'Same time as Singapore';
    }
    const hours = Math.abs(diffHours);
    if (diffHours > 0) {
      const hourText = hours === 1 ? (t ? t('hourAhead') : 'hour ahead of Singapore') : (t ? t('hoursAhead') : 'hours ahead of Singapore');
      return `${hours === Math.floor(hours) ? hours : hours.toFixed(1)} ${hourText}`;
    }
    const hourText = hours === 1 ? (t ? t('hourBehind') : 'hour behind Singapore') : (t ? t('hoursBehind') : 'hours behind Singapore');
    return `${hours === Math.floor(hours) ? hours : hours.toFixed(1)} ${hourText}`;
  };
  
  return (
    <div style={{
      backgroundColor: '#f0f8ff',
      border: '2px solid #4a90e2',
      borderRadius: isMobile ? '6px' : '8px',
      padding: isMobile ? '12px' : '16px',
      marginBottom: '20px',
      textAlign: 'center'
    }}>
      <h4 style={{ 
        marginTop: 0, 
        marginBottom: isMobile ? '10px' : '12px',
        color: '#2c3e50',
        fontSize: isMobile ? '1rem' : '1.1rem'
      }}>
        🕐 {t ? t('currentTime') : 'Current Time'}
      </h4>
      
      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'row' : 'column',
        gap: isMobile ? '8px' : '12px',
        alignItems: 'center',
        justifyContent: 'center',
        overflowX: isMobile ? 'auto' : 'visible',
        flexWrap: isMobile ? 'nowrap' : 'wrap',
        paddingBottom: isMobile ? '4px' : '0',
      }}>
        {isUserInSingapore ? (
          singaporeTime && (
            <div style={{
              fontSize: isMobile ? '1.1rem' : '1.3rem',
              fontWeight: 'bold',
              color: '#2c3e50',
              padding: isMobile ? '8px 16px' : '10px 20px',
              backgroundColor: '#ffffff',
              borderRadius: '6px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'normal',
              textAlign: 'center',
              maxWidth: '100%',
              overflowWrap: 'anywhere',
            }}>
              <span style={{ fontSize: isMobile ? '1rem' : '1.2rem' }}>🇸🇬</span>
              {!isMobile && <span>{singaporeTime.country}:</span>}
              <span>{singaporeTime.time}</span>
            </div>
          )
        ) : Array.isArray(destinationTimezonesToRender) ? (
          <>
            {destinationTimezonesToRender.map((tz, index) => {
              const destTime = formatTime(tz.timezone, destinationCountry);
              const diffHours = getTimeDifference(tz.timezone);
              const timeDiffText = getTimeDiffText(diffHours);
              const displayName = getTimezoneName(tz.timezone, tz.name);
              const mobileDisplayName = displayName
                .match(/[A-Z]{2,6}/)?.[0]
                || displayName.replace(/\(.*?\)/g, '').trim()
                .replace('Arizona', 'AZ')
                .replace('Newfoundland', 'Nfld')
                .replace('Saskatchewan', 'SK')
                .replace('Southampton Island', 'Southampton');
              
              return (
                <div key={index} style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  minWidth: 0,
                  width: isMobile ? (isUsDstWithArizona ? '112px' : '126px') : '100%',
                  maxWidth: isMobile ? (isUsDstWithArizona ? '112px' : '126px') : '100%',
                }}>
                  <div style={{
                    fontSize: isMobile ? '0.9rem' : '1.2rem',
                    fontWeight: 'bold',
                    color: '#2c3e50',
                    padding: isMobile ? (isUsDstWithArizona ? '6px 10px' : '6px 12px') : '10px 20px',
                    backgroundColor: '#ffffff',
                    borderRadius: '6px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: isMobile ? '4px' : '6px',
                    flexDirection: isMobile ? 'column' : 'row',
                    whiteSpace: 'normal',
                    textAlign: 'center',
                    width: '100%',
                    minWidth: 0,
                    maxWidth: '100%',
                    boxSizing: 'border-box',
                  }}>
                    <span style={{ fontSize: isMobile ? '1rem' : '1.2rem' }}>{countryFlags[destinationCountry] || '🌍'}</span>
                    <span style={{
                      fontSize: isMobile ? (isUsDstWithArizona ? '0.55rem' : '0.6rem') : '0.8rem',
                      color: '#5a6c7d',
                      textAlign: 'center',
                      maxWidth: '100%',
                      lineHeight: '1.2',
                      overflowWrap: 'anywhere',
                    }}>
                      {isMobile ? mobileDisplayName : displayName}
                    </span>
                    <span style={{ fontSize: isMobile ? '0.85rem' : '1rem' }}>{destTime?.time}</span>
                  </div>
                  {!isMobile && (
                    <span style={{
                      fontSize: '0.75rem',
                      color: diffHours === 0 ? '#27ae60' : '#7f8c8d',
                      fontWeight: diffHours === 0 ? '600' : '500',
                      fontStyle: 'italic',
                    }}>
                      {timeDiffText}
                    </span>
                  )}
                </div>
              );
            })}
            <div style={{
              fontSize: isMobile ? '0.9rem' : '1.1rem',
              color: '#5a6c7d',
              padding: isMobile ? '6px 12px' : '8px 16px',
              backgroundColor: '#f8f9fa',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: isMobile ? '4px' : '6px',
              whiteSpace: 'normal',
              textAlign: 'center',
              minWidth: 0,
              maxWidth: isMobile ? '110px' : '100%',
              overflowWrap: 'anywhere',
            }}>
              <span style={{ fontSize: isMobile ? '1rem' : '1.2rem' }}>🇸🇬</span>
              {!isMobile && <span>Singapore:</span>}
              <span style={{ fontSize: isMobile ? '0.85rem' : '1rem' }}>{singaporeTime?.time}</span>
            </div>
          </>
        ) : (
          <>
            {destinationCountry === 'SG' ? (
              singaporeTime && (
                <div style={{
                  fontSize: isMobile ? '1.1rem' : '1.3rem',
                  fontWeight: 'bold',
                  color: '#2c3e50',
                  padding: isMobile ? '8px 16px' : '10px 20px',
                  backgroundColor: '#ffffff',
                  borderRadius: '6px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  whiteSpace: 'normal',
                  textAlign: 'center',
                  maxWidth: '100%',
                  overflowWrap: 'anywhere',
                }}>
                  <span style={{ fontSize: isMobile ? '1rem' : '1.2rem' }}>🇸🇬</span>
                  {!isMobile && <span>{singaporeTime.country}:</span>}
                  <span>{singaporeTime.time}</span>
                </div>
              )
            ) : (() => {
              const destTime = formatTime(destinationTimezone, destinationCountry);
              const diffHours = getTimeDifference(destinationTimezone);
              const timeDiffText = getTimeDiffText(diffHours);
              const isSameTime = diffHours === 0;
              
              return (
                <>
                  {destTime && (
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '6px',
                    }}>
                      <div style={{
                        fontSize: isMobile ? '1.1rem' : '1.3rem',
                        fontWeight: 'bold',
                        color: '#2c3e50',
                        padding: isMobile ? '8px 16px' : '10px 20px',
                        backgroundColor: '#ffffff',
                        borderRadius: '6px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        whiteSpace: 'normal',
                        textAlign: 'center',
                        maxWidth: '100%',
                        overflowWrap: 'anywhere',
                      }}>
                        <span style={{ fontSize: isMobile ? '1rem' : '1.2rem' }}>{countryFlags[destinationCountry] || '🌍'}</span>
                        {!isMobile && <span>{destTime.country}:</span>}
                        <span>{destTime.time}</span>
                      </div>
                      {isSameTime && (
                        <div style={{
                          fontSize: isMobile ? '0.8rem' : '0.95rem',
                          color: '#27ae60',
                          padding: isMobile ? '6px 12px' : '8px 16px',
                          backgroundColor: '#e8f8f5',
                          borderRadius: '6px',
                          fontWeight: '500'
                        }}>
                          ✓ {timeDiffText}
                        </div>
                      )}
                    </div>
                  )}
                  {!isSameTime && singaporeTime && (
                    <div style={{
                      fontSize: isMobile ? '0.9rem' : '1.1rem',
                      color: '#5a6c7d',
                      padding: isMobile ? '6px 12px' : '8px 16px',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: isMobile ? '4px' : '6px',
                      whiteSpace: 'normal',
                      textAlign: 'center',
                      maxWidth: '100%',
                      overflowWrap: 'anywhere',
                    }}>
                      <span style={{ fontSize: isMobile ? '1rem' : '1.2rem' }}>🇸🇬</span>
                      {!isMobile && <span>{singaporeTime.country}:</span>}
                      <span style={{ fontSize: isMobile ? '0.85rem' : '1rem' }}>{singaporeTime.time}</span>
                    </div>
                  )}
                  {!isSameTime && !isMobile && (
                    <div style={{
                      fontSize: '0.85rem',
                      color: '#7f8c8d',
                      fontStyle: 'italic',
                      marginTop: '4px',
                    }}>
                      {timeDiffText}
                    </div>
                  )}
                </>
              );
            })()}
          </>
        )}
      </div>
      
      <p style={{
        marginTop: isMobile ? '8px' : '12px',
        marginBottom: 0,
        fontSize: isMobile ? '0.75rem' : '0.85rem',
        color: '#7f8c8d',
        fontStyle: 'italic'
      }}>
        {t ? t('timezoneNote') : 'Time shown in 12-hour format'}
      </p>
    </div>
  );
};

export default TimezoneDisplay;

'use client';

import React, { useState, useEffect } from 'react';

// Timezone mappings for each destination country
// Countries with multiple timezones use array format: [{ name, timezone }]
const countryTimezones = {
  SG: 'Asia/Singapore',
  AU: [
    { name: 'Sydney/Melbourne (AEST)', timezone: 'Australia/Sydney' },
    { name: 'Adelaide (ACST)', timezone: 'Australia/Adelaide' },
    { name: 'Perth (AWST)', timezone: 'Australia/Perth' },
  ],
  AT: 'Europe/Vienna',
  BE: 'Europe/Brussels',
  BN: 'Asia/Brunei',
  CA: [
    { name: 'Newfoundland (NST)', timezone: 'America/St_Johns' },
    { name: 'Atlantic (AST)', timezone: 'America/Halifax' },
    { name: 'Eastern (EST)', timezone: 'America/Toronto' },
    { name: 'Central (CST)', timezone: 'America/Winnipeg' },
    { name: 'Mountain (MST)', timezone: 'America/Edmonton' },
    { name: 'Pacific (PST)', timezone: 'America/Vancouver' },
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
  
  useEffect(() => {
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
  if (!destinationCountry) return null;
  
  // If user is in Singapore, only show Singapore time
  const isUserInSingapore = userCountry === 'SG';
  
  const formatTime = (timezone, countryCode) => {
    try {
      const options = {
        timeZone: timezone,
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
        timezone: timezone,
      };
    } catch (error) {
      console.error(`Error formatting time for ${timezone}:`, error);
      return null;
    }
  };
  
  // Check if destination has daylight saving time active
  const isDST = (timezone) => {
    try {
      const january = new Date(currentTime.getFullYear(), 0, 1);
      const july = new Date(currentTime.getFullYear(), 6, 1);
      
      const janOffset = january.toLocaleString('en-US', { timeZone: timezone, timeZoneName: 'short' });
      const julOffset = july.toLocaleString('en-US', { timeZone: timezone, timeZoneName: 'short' });
      const currentOffset = currentTime.toLocaleString('en-US', { timeZone: timezone, timeZoneName: 'short' });
      
      return janOffset !== julOffset && currentOffset !== janOffset;
    } catch (error) {
      return false;
    }
  };
  
  const getTimeDifference = (timezone) => {
    const singaporeOffset = new Date().toLocaleString('en-US', { timeZone: 'Asia/Singapore', timeZoneName: 'short' }).match(/GMT([+-]\d+)/);
    const destOffset = new Date().toLocaleString('en-US', { timeZone: timezone, timeZoneName: 'short' }).match(/GMT([+-]\d+)/);
    
    if (!singaporeOffset || !destOffset) return 0;
    
    const sgHours = parseInt(singaporeOffset[1]);
    const destHours = parseInt(destOffset[1]);
    
    return destHours - sgHours;
  };

  const singaporeTime = formatTime('Asia/Singapore', 'SG');
  const destinationTimezone = countryTimezones[destinationCountry];
  
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
              whiteSpace: 'nowrap',
            }}>
              <span style={{ fontSize: isMobile ? '1rem' : '1.2rem' }}>🇸🇬</span>
              {!isMobile && <span>{singaporeTime.country}:</span>}
              <span>{singaporeTime.time}</span>
            </div>
          )
        ) : Array.isArray(destinationTimezone) ? (
          <>
            {destinationTimezone.map((tz, index) => {
              const destTime = formatTime(tz.timezone, destinationCountry);
              const diffHours = getTimeDifference(tz.timezone);
              const timeDiffText = getTimeDiffText(diffHours);
              
              return (
                <div key={index} style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  minWidth: isMobile ? '140px' : 'auto',
                }}>
                  <div style={{
                    fontSize: isMobile ? '0.9rem' : '1.2rem',
                    fontWeight: 'bold',
                    color: '#2c3e50',
                    padding: isMobile ? '6px 12px' : '10px 20px',
                    backgroundColor: '#ffffff',
                    borderRadius: '6px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: isMobile ? '4px' : '6px',
                    flexDirection: isMobile ? 'column' : 'row',
                    whiteSpace: 'nowrap',
                  }}>
                    <span style={{ fontSize: isMobile ? '1rem' : '1.2rem' }}>{countryFlags[destinationCountry] || '🌍'}</span>
                    {!isMobile && <span style={{ fontSize: '0.8rem', color: '#5a6c7d' }}>{tz.name}</span>}
                    <span style={{ fontSize: isMobile ? '0.85rem' : '1rem' }}>{destTime?.time}</span>
                  </div>
                  {isMobile && (
                    <span style={{
                      fontSize: '0.6rem',
                      color: '#5a6c7d',
                      textAlign: 'center',
                      maxWidth: '140px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      {tz.name.replace(/\(.*?\)/g, '').trim()}
                    </span>
                  )}
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
              whiteSpace: 'nowrap',
              minWidth: isMobile ? '110px' : 'auto',
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
                  whiteSpace: 'nowrap',
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
                        whiteSpace: 'nowrap',
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
                      whiteSpace: 'nowrap',
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

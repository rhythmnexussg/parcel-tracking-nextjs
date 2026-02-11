'use client';

import React, { useState, useEffect } from 'react';

// Country flag emojis
const countryFlags = {
  SG: '🇸🇬', AU: '🇦🇺', AT: '🇦🇹', BE: '🇧🇪', BN: '🇧🇳', CA: '🇨🇦',
  CN: '🇨🇳', CZ: '🇨🇿', FI: '🇫🇮', FR: '🇫🇷', DE: '🇩🇪', HK: '🇭🇰',
  IN: '🇮🇳', ID: '🇮🇩', IE: '🇮🇪', IL: '🇮🇱', IT: '🇮🇹', JP: '🇯🇵',
  MO: '🇲🇴', MY: '🇲🇾', NO: '🇳🇴', NL: '🇳🇱', NZ: '🇳🇿', PH: '🇵🇭',
  PL: '🇵🇱', PT: '🇵🇹', KR: '🇰🇷', ES: '🇪🇸', SE: '🇸🇪', CH: '🇨🇭',
  TW: '🇹🇼', TH: '🇹🇭', GB: '🇬🇧', US: '🇺🇸', VN: '🇻🇳',
};

// Timezone mappings for each destination country
// Countries with multiple timezones use array format: [{ name, timezone }]
const countryTimezones = {
  SG: 'Asia/Singapore',
  AU: [
    { name: 'AEST (Sydney/Melbourne)', timezone: 'Australia/Sydney' },
    { name: 'ACST (Adelaide)', timezone: 'Australia/Adelaide' },
    { name: 'AWST (Perth)', timezone: 'Australia/Perth' },
  ],
  AT: 'Europe/Vienna',
  BE: 'Europe/Brussels',
  BN: 'Asia/Brunei',
  CA: [
    { name: 'NST (Newfoundland)', timezone: 'America/St_Johns' },
    { name: 'AST (Atlantic)', timezone: 'America/Halifax' },
    { name: 'EST (Eastern)', timezone: 'America/Toronto' },
    { name: 'CST (Central)', timezone: 'America/Winnipeg' },
    { name: 'MST (Mountain)', timezone: 'America/Edmonton' },
    { name: 'PST (Pacific)', timezone: 'America/Vancouver' },
  ],
  CN: 'Asia/Shanghai',
  CZ: 'Europe/Prague',
  FI: 'Europe/Helsinki',
  FR: 'Europe/Paris',
  DE: 'Europe/Berlin',
  HK: 'Asia/Hong_Kong',
  IN: 'Asia/Kolkata',
  ID: 'Asia/Makassar',
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
    { name: 'EST (Eastern)', timezone: 'America/New_York' },
    { name: 'CST (Central)', timezone: 'America/Chicago' },
    { name: 'MST (Mountain)', timezone: 'America/Denver' },
    { name: 'PST (Pacific)', timezone: 'America/Los_Angeles' },
    { name: 'AKST (Alaska)', timezone: 'America/Anchorage' },
    { name: 'HST (Hawaii)', timezone: 'Pacific/Honolulu' },
  ],
  VN: 'Asia/Ho_Chi_Minh',
};

const TimezoneHeader = ({ userCountry, t }) => {
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
  
  const formatTime = (timezone) => {
    try {
      const options = {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      };
      
      return currentTime.toLocaleTimeString('en-US', options);
    } catch (error) {
      return '--:--:--';
    }
  };
  
  // Get UTC offset for a timezone in minutes
  const getUTCOffset = (timezone) => {
    try {
      const date = new Date();
      const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
      const tzDate = new Date(date.toLocaleString('en-US', { timeZone: timezone }));
      return Math.round((tzDate - utcDate) / (1000 * 60)); // difference in minutes
    } catch (error) {
      return 0;
    }
  };
  
  const singaporeTime = formatTime('Asia/Singapore');
  const singaporeOffset = getUTCOffset('Asia/Singapore');
  
  // Get user's local time and time difference
  const getUserLocalInfo = () => {
    if (!userCountry || userCountry === 'SG') return null;
    
    const timezoneData = countryTimezones[userCountry];
    if (!timezoneData) return null;
    
    // Handle countries with multiple timezones
    if (Array.isArray(timezoneData)) {
      return timezoneData.map(({ name, timezone }) => {
        const localTime = formatTime(timezone);
        const localOffset = getUTCOffset(timezone);
        const diffMinutes = localOffset - singaporeOffset;
        const diffHours = diffMinutes / 60;
        
        let timeDiffText = '';
        if (diffHours === 0) {
          timeDiffText = t ? t('sameTimeAsSingapore') : 'Same time as Singapore';
        } else if (diffHours > 0) {
          const hours = Math.abs(diffHours);
          const hourText = hours === 1 ? (t ? t('hourAhead') : 'hour ahead of Singapore') : (t ? t('hoursAhead') : 'hours ahead of Singapore');
          timeDiffText = `${hours === Math.floor(hours) ? hours : hours.toFixed(1)} ${hourText}`;
        } else {
          const hours = Math.abs(diffHours);
          const hourText = hours === 1 ? (t ? t('hourBehind') : 'hour behind Singapore') : (t ? t('hoursBehind') : 'hours behind Singapore');
          timeDiffText = `${hours === Math.floor(hours) ? hours : hours.toFixed(1)} ${hourText}`;
        }
        
        return { name, localTime, timeDiffText, isSameTime: diffHours === 0 };
      });
    }
    
    // Handle countries with single timezone
    const timezone = timezoneData;
    const localTime = formatTime(timezone);
    const localOffset = getUTCOffset(timezone);
    const diffMinutes = localOffset - singaporeOffset;
    const diffHours = diffMinutes / 60;
    
    let timeDiffText = '';
    if (diffHours === 0) {
      timeDiffText = t ? t('sameTimeAsSingapore') : 'Same time as Singapore';
    } else if (diffHours > 0) {
      const hours = Math.abs(diffHours);
      const hourText = hours === 1 ? (t ? t('hourAhead') : 'hour ahead of Singapore') : (t ? t('hoursAhead') : 'hours ahead of Singapore');
      timeDiffText = `${hours === Math.floor(hours) ? hours : hours.toFixed(1)} ${hourText}`;
    } else {
      const hours = Math.abs(diffHours);
      const hourText = hours === 1 ? (t ? t('hourBehind') : 'hour behind Singapore') : (t ? t('hoursBehind') : 'hours behind Singapore');
      timeDiffText = `${hours === Math.floor(hours) ? hours : hours.toFixed(1)} ${hourText}`;
    }
    
    return { localTime, timeDiffText, isSameTime: diffHours === 0 };
  };
  
  const userLocalInfo = getUserLocalInfo();
  
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: isMobile ? '10px' : '20px',
      fontSize: isMobile ? '0.75rem' : '0.9rem',
      fontWeight: '600',
      color: '#2c3e50',
      flexWrap: 'wrap',
      justifyContent: 'center',
    }}>
      {userLocalInfo && (
        Array.isArray(userLocalInfo) ? (
          // Multiple timezones - compact horizontal layout on mobile
          <div style={{
            display: 'flex',
            flexDirection: isMobile ? 'row' : 'column',
            gap: isMobile ? '6px' : '8px',
            overflowX: isMobile ? 'auto' : 'visible',
            maxWidth: isMobile ? '100%' : 'none',
            paddingBottom: isMobile ? '4px' : '0',
          }}>
            {userLocalInfo.map((info, index) => (
              <div key={index} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px',
                minWidth: isMobile ? '110px' : 'auto',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: isMobile ? '3px' : '6px',
                  padding: isMobile ? '4px 8px' : '6px 12px',
                  backgroundColor: '#e8f4f8',
                  borderRadius: '6px',
                  border: '1px solid #b3d9e6',
                  flexDirection: isMobile ? 'column' : 'row',
                  whiteSpace: 'nowrap',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <span style={{ fontSize: isMobile ? '0.9rem' : '1.1rem' }}>{countryFlags[userCountry] || '🌍'}</span>
                    {!isMobile && <span style={{ fontSize: '0.7rem', color: '#5a6c7d' }}>{info.name}</span>}
                  </div>
                  <span style={{ fontSize: isMobile ? '0.7rem' : '0.85rem' }}>{info.localTime}</span>
                </div>
                {isMobile && (
                  <span style={{
                    fontSize: '0.55rem',
                    color: '#5a6c7d',
                    textAlign: 'center',
                    maxWidth: '110px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {info.name.replace(/\(.*?\)/g, '').trim()}
                  </span>
                )}
                {!isMobile && (
                  <span style={{
                    fontSize: '0.7rem',
                    color: info.isSameTime ? '#27ae60' : '#7f8c8d',
                    fontWeight: info.isSameTime ? '600' : '500',
                    fontStyle: 'italic',
                  }}>
                    {info.timeDiffText}
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          // Single timezone
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: isMobile ? '2px' : '4px',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: isMobile ? '4px' : '6px',
              padding: isMobile ? '4px 8px' : '6px 12px',
              backgroundColor: '#e8f4f8',
              borderRadius: isMobile ? '6px' : '8px',
              border: '1px solid #b3d9e6',
            }}>
              <span style={{ fontSize: isMobile ? '0.9rem' : '1.1rem' }}>{countryFlags[userCountry] || '🌍'}</span>
              <span style={{ fontSize: isMobile ? '0.75rem' : '0.9rem' }}>{userLocalInfo.localTime}</span>
            </div>
            {!isMobile && (
              <span style={{
                fontSize: '0.75rem',
                color: userLocalInfo.isSameTime ? '#27ae60' : '#7f8c8d',
                fontWeight: userLocalInfo.isSameTime ? '600' : '500',
                fontStyle: 'italic',
              }}>
                {userLocalInfo.timeDiffText}
              </span>
            )}
          </div>
        )
      )}
      
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: isMobile ? '4px' : '6px',
        padding: isMobile ? '4px 8px' : '6px 12px',
        backgroundColor: '#fff3e0',
        borderRadius: isMobile ? '6px' : '8px',
        border: '1px solid #ffcc80',
      }}>
        <span style={{ fontSize: isMobile ? '0.9rem' : '1.1rem' }}>🇸🇬</span>
        <span style={{ fontSize: isMobile ? '0.75rem' : '0.9rem' }}>{singaporeTime}</span>
      </div>
    </div>
  );
};

export default TimezoneHeader;

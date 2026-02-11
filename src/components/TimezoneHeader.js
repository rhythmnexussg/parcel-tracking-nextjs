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
const countryTimezones = {
  SG: 'Asia/Singapore',
  AU: 'Australia/Sydney',
  AT: 'Europe/Vienna',
  BE: 'Europe/Brussels',
  BN: 'Asia/Brunei',
  CA: 'America/Toronto',
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
  US: 'America/New_York',
  VN: 'Asia/Ho_Chi_Minh',
};

const TimezoneHeader = ({ userCountry }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
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
    
    const timezone = countryTimezones[userCountry];
    if (!timezone) return null;
    
    const localTime = formatTime(timezone);
    const localOffset = getUTCOffset(timezone);
    const diffMinutes = localOffset - singaporeOffset;
    const diffHours = diffMinutes / 60;
    
    let timeDiffText = '';
    if (diffHours === 0) {
      timeDiffText = 'Same time as Singapore';
    } else if (diffHours > 0) {
      const hours = Math.abs(diffHours);
      timeDiffText = `${hours === Math.floor(hours) ? hours : hours.toFixed(1)} hour${hours !== 1 ? 's' : ''} ahead of Singapore`;
    } else {
      const hours = Math.abs(diffHours);
      timeDiffText = `${hours === Math.floor(hours) ? hours : hours.toFixed(1)} hour${hours !== 1 ? 's' : ''} behind Singapore`;
    }
    
    return { localTime, timeDiffText, isSameTime: diffHours === 0 };
  };
  
  const userLocalInfo = getUserLocalInfo();
  
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
      fontSize: '0.9rem',
      fontWeight: '600',
      color: '#2c3e50',
    }}>
      {userLocalInfo && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            backgroundColor: '#e8f4f8',
            borderRadius: '8px',
            border: '1px solid #b3d9e6',
          }}>
            <span style={{ fontSize: '1.1rem' }}>{countryFlags[userCountry] || '🌍'}</span>
            <span>{userLocalInfo.localTime}</span>
          </div>
          <span style={{
            fontSize: '0.75rem',
            color: userLocalInfo.isSameTime ? '#27ae60' : '#7f8c8d',
            fontWeight: userLocalInfo.isSameTime ? '600' : '500',
            fontStyle: 'italic',
          }}>
            {userLocalInfo.timeDiffText}
          </span>
        </div>
      )}
      
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 12px',
        backgroundColor: '#fff3e0',
        borderRadius: '8px',
        border: '1px solid #ffcc80',
      }}>
        <span style={{ fontSize: '1.1rem' }}>🇸🇬</span>
        <span>{singaporeTime}</span>
      </div>
    </div>
  );
};

export default TimezoneHeader;

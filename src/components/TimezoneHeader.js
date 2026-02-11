'use client';

import React, { useState, useEffect } from 'react';

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
  
  const singaporeTime = formatTime('Asia/Singapore');
  
  // Get user's local time if they're not in Singapore
  const getUserLocalTime = () => {
    if (!userCountry || userCountry === 'SG') return null;
    
    const timezone = countryTimezones[userCountry];
    if (!timezone) return null;
    
    const localTime = formatTime(timezone);
    // Check if it's the same as Singapore
    return localTime === singaporeTime ? null : localTime;
  };
  
  const userLocalTime = getUserLocalTime();
  
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
      fontSize: '0.9rem',
      fontWeight: '600',
      color: '#2c3e50',
    }}>
      {userLocalTime && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          backgroundColor: '#e8f4f8',
          borderRadius: '8px',
          border: '1px solid #b3d9e6',
        }}>
          <span style={{ fontSize: '1.1rem' }}>🌍</span>
          <span>{userLocalTime}</span>
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

'use client';

import React, { useState, useEffect } from 'react';

// Timezone mappings for each destination country
// Note: Some countries have multiple timezones - primary/capital timezone shown
const countryTimezones = {
  SG: 'Asia/Singapore',
  AU: 'Australia/Sydney', // Multiple zones: Sydney (UTC+10/+11 DST), Perth (UTC+8, same as SG)
  AT: 'Europe/Vienna',
  BE: 'Europe/Brussels',
  BN: 'Asia/Brunei', // UTC+8, same as Singapore
  CA: 'America/Toronto', // Multiple zones: Toronto (UTC-5/-4 DST), Vancouver (UTC-8/-7 DST)
  CN: 'Asia/Shanghai', // UTC+8, same as Singapore
  CZ: 'Europe/Prague',
  FI: 'Europe/Helsinki',
  FR: 'Europe/Paris',
  DE: 'Europe/Berlin',
  HK: 'Asia/Hong_Kong', // UTC+8, same as Singapore
  IN: 'Asia/Kolkata',
  ID: 'Asia/Makassar', // Central Indonesia UTC+8, same as Singapore (Jakarta is UTC+7)
  IE: 'Europe/Dublin',
  IL: 'Asia/Jerusalem',
  IT: 'Europe/Rome',
  JP: 'Asia/Tokyo',
  MO: 'Asia/Macau', // UTC+8, same as Singapore
  MY: 'Asia/Kuala_Lumpur', // UTC+8, same as Singapore
  NO: 'Europe/Oslo',
  NL: 'Europe/Amsterdam',
  NZ: 'Pacific/Auckland',
  PH: 'Asia/Manila', // UTC+8, same as Singapore
  PL: 'Europe/Warsaw',
  PT: 'Europe/Lisbon',
  KR: 'Asia/Seoul',
  ES: 'Europe/Madrid',
  SE: 'Europe/Stockholm',
  CH: 'Europe/Zurich',
  TW: 'Asia/Taipei', // UTC+8, same as Singapore
  TH: 'Asia/Bangkok',
  GB: 'Europe/London',
  US: 'America/New_York', // Multiple zones: Eastern (UTC-5/-4 DST), Central, Mountain, Pacific, etc.
  VN: 'Asia/Ho_Chi_Minh',
};

// Countries with multiple timezones - show note
const multiTimezoneCountries = {
  US: 'Eastern Time (Multiple timezones across USA)',
  CA: 'Eastern Time (Multiple timezones across Canada)',
  AU: 'Sydney Time (Multiple timezones across Australia)',
};

const TimezoneDisplay = ({ destinationCountry, userCountry, t, getCountryName }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
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
  
  const singaporeTime = formatTime('Asia/Singapore', 'SG');
  const destinationTimezone = countryTimezones[destinationCountry];
  const destinationTime = destinationTimezone ? formatTime(destinationTimezone, destinationCountry) : null;
  
  // Check if times are the same (same UTC offset)
  const isSameTimeAsSingapore = destinationTime && destinationTime.time === singaporeTime.time;
  
  return (
    <div style={{
      backgroundColor: '#f0f8ff',
      border: '2px solid #4a90e2',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '20px',
      textAlign: 'center'
    }}>
      <h4 style={{ 
        marginTop: 0, 
        marginBottom: '12px',
        color: '#2c3e50',
        fontSize: '1.1rem'
      }}>
        🕐 {t ? t('currentTime') : 'Current Time'}
      </h4>
      
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        alignItems: 'center'
      }}>
        {isUserInSingapore ? (
          // Show only Singapore time if user is in Singapore
          singaporeTime && (
            <div style={{
              fontSize: '1.3rem',
              fontWeight: 'bold',
              color: '#2c3e50',
              padding: '10px 20px',
              backgroundColor: '#ffffff',
              borderRadius: '6px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              {singaporeTime.country}: {singaporeTime.time}
            </div>
          )
        ) : (
          // Show destination and/or Singapore time based on whether they're the same
          <>
            {destinationCountry === 'SG' ? (
              // Destination is Singapore
              singaporeTime && (
                <div style={{
                  fontSize: '1.3rem',
                  fontWeight: 'bold',
                  color: '#2c3e50',
                  padding: '10px 20px',
                  backgroundColor: '#ffffff',
                  borderRadius: '6px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                  {singaporeTime.country}: {singaporeTime.time}
                </div>
              )
            ) : isSameTimeAsSingapore ? (
              // Destination has same time as Singapore
              <>
                <div style={{
                  fontSize: '1.3rem',
                  fontWeight: 'bold',
                  color: '#2c3e50',
                  padding: '10px 20px',
                  backgroundColor: '#ffffff',
                  borderRadius: '6px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                  {destinationTime.country}: {destinationTime.time}
                </div>
                <div style={{
                  fontSize: '0.95rem',
                  color: '#27ae60',
                  padding: '8px 16px',
                  backgroundColor: '#e8f8f5',
                  borderRadius: '6px',
                  fontWeight: '500'
                }}>
                  ✓ {t ? t('sameTimeAsSingapore') : 'Same time as Singapore'}
                </div>
              </>
            ) : (
              // Different time zones
              <>
                {destinationTime && (
                  <div style={{
                    fontSize: '1.3rem',
                    fontWeight: 'bold',
                    color: '#2c3e50',
                    padding: '10px 20px',
                    backgroundColor: '#ffffff',
                    borderRadius: '6px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}>
                    {destinationTime.country}: {destinationTime.time}
                    {isDST(destinationTimezone) && (
                      <span style={{ fontSize: '0.75rem', marginLeft: '8px', color: '#e67e22' }}>
                        (DST)
                      </span>
                    )}
                  </div>
                )}
                
                {singaporeTime && (
                  <div style={{
                    fontSize: '1.1rem',
                    color: '#5a6c7d',
                    padding: '8px 16px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '6px'
                  }}>
                    {singaporeTime.country}: {singaporeTime.time}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
      
      {/* Show multi-timezone note if applicable */}
      {multiTimezoneCountries[destinationCountry] && !isSameTimeAsSingapore && (
        <p style={{
          marginTop: '12px',
          marginBottom: '4px',
          fontSize: '0.85rem',
          color: '#7f8c8d',
          fontStyle: 'italic'
        }}>
          📍 {multiTimezoneCountries[destinationCountry]}
        </p>
      )}
      
      <p style={{
        marginTop: multiTimezoneCountries[destinationCountry] && !isSameTimeAsSingapore ? '4px' : '12px',
        marginBottom: 0,
        fontSize: '0.85rem',
        color: '#7f8c8d',
        fontStyle: 'italic'
      }}>
        {t ? t('timezoneNote') : 'Time shown in 24-hour format'}
      </p>
    </div>
  );
};

export default TimezoneDisplay;

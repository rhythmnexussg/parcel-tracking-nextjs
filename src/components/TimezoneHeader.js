'use client';

import React, { useMemo, useState, useEffect } from 'react';

// Country flag emojis
const countryFlags = {
  SG: '🇸🇬', AU: '🇦🇺', AT: '🇦🇹', BE: '🇧🇪', BN: '🇧🇳', CA: '🇨🇦',
  CN: '🇨🇳', CZ: '🇨🇿', FI: '🇫🇮', FR: '🇫🇷', DE: '🇩🇪', HK: '🇭🇰',
  IN: '🇮🇳', ID: '🇮🇩', IE: '🇮🇪', IL: '🇮🇱', IT: '🇮🇹', JP: '🇯🇵',
  MO: '🇲🇴', MY: '🇲🇾', NO: '🇳🇴', NL: '🇳🇱', NZ: '🇳🇿', PH: '🇵🇭',
  PL: '🇵🇱', PT: '🇵🇹', RU: '🇷🇺', KR: '🇰🇷', ES: '🇪🇸', SE: '🇸🇪', CH: '🇨🇭',
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
  RU: [
    { name: 'Kaliningrad Oblast (UTC+2)', timezone: 'Europe/Kaliningrad' },
    { name: 'Moscow/Western Russia (UTC+3)', timezone: 'Europe/Moscow' },
    { name: 'Samara Oblast (UTC+4)', timezone: 'Europe/Samara' },
    { name: 'Ural Region (UTC+5)', timezone: 'Asia/Yekaterinburg' },
    { name: 'Omsk Oblast (UTC+6)', timezone: 'Asia/Omsk' },
    { name: 'Krasnoyarsk Krai (UTC+7)', timezone: 'Asia/Krasnoyarsk' },
    { name: 'Irkutsk Oblast (UTC+8)', timezone: 'Asia/Irkutsk' },
    { name: 'Sakha Republic (UTC+9)', timezone: 'Asia/Yakutsk' },
    { name: 'Primorsky Krai (UTC+10)', timezone: 'Asia/Vladivostok' },
    { name: 'Magadan Oblast (UTC+11)', timezone: 'Asia/Magadan' },
    { name: 'Kamchatka Krai (UTC+12)', timezone: 'Asia/Kamchatka' },
  ],
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
  
  // Helper function to extract region/state name from timezone name
  const getTimezoneLabel = (name) => {
    if (!name) return name;
    
    // Extract text before "(UTC"
    const regionPart = name.split('(')[0].trim();
    
    // For names like "Moscow/Western Russia", take first part before "/"
    if (regionPart.includes('/')) {
      return regionPart.split('/')[0].trim();
    }
    
    // For names like "Ural Region", "Sakha Republic", etc., take the first word
    const words = regionPart.split(/\s+/);
    return words[0]; // Return first word (main city/region name)
  };

  const getBoundedDiffTextStyle = (baseStyle) => ({
    ...baseStyle,
    maxWidth: '100%',
    textAlign: 'center',
    whiteSpace: 'normal',
    lineHeight: '1.15',
    overflowWrap: 'anywhere',
    wordBreak: 'break-word',
  });

  const getUTCOffsetAt = (timezone, date) => {
    try {
      const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
      const tzDate = new Date(date.toLocaleString('en-US', { timeZone: timezone }));
      return Math.round((tzDate - utcDate) / (1000 * 60));
    } catch (error) {
      return 0;
    }
  };

  const getNextDSTTransition = (timezone) => {
    try {
      const now = new Date();

      // Quick check: if offsets don't differ between Jan and Jul, DST is likely not observed.
      const year = now.getUTCFullYear();
      const jan = new Date(Date.UTC(year, 0, 15, 12, 0, 0));
      const jul = new Date(Date.UTC(year, 6, 15, 12, 0, 0));
      const janOffset = getUTCOffsetAt(timezone, jan);
      const julOffset = getUTCOffsetAt(timezone, jul);
      if (janOffset === julOffset) return null;

      // Scan forward up to ~14 months to find the next offset change.
      const scanDays = 430;
      const todayNoonUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 12, 0, 0));
      let prevOffset = getUTCOffsetAt(timezone, todayNoonUTC);

      for (let dayIndex = 1; dayIndex <= scanDays; dayIndex += 1) {
        const candidate = new Date(todayNoonUTC.getTime() + dayIndex * 24 * 60 * 60 * 1000);
        const offset = getUTCOffsetAt(timezone, candidate);
        if (offset !== prevOffset) {
          return {
            type: offset > prevOffset ? 'start' : 'end',
            date: candidate,
          };
        }
        prevOffset = offset;
      }

      return null;
    } catch (_) {
      return null;
    }
  };

  const nextDstTransition = useMemo(() => {
    if (!userCountry || userCountry === 'SG') return null;

    const europeCountries = new Set([
      'AT', 'BE', 'CH', 'CZ', 'DE', 'ES', 'FI', 'FR', 'GB', 'IE',
      'IT', 'NL', 'NO', 'PL', 'PT', 'SE',
    ]);
    const supportsDstNotice = userCountry === 'AU' || userCountry === 'NZ' || userCountry === 'US' || userCountry === 'CA' || europeCountries.has(userCountry);
    if (!supportsDstNotice) return null;

    const timezoneData = countryTimezones[userCountry];
    if (!timezoneData) return null;

    const considerTransition = (transition, best) => {
      if (!transition) return best;
      if (!best || transition.date.getTime() < best.date.getTime()) return transition;
      return best;
    };

    if (Array.isArray(timezoneData)) {
      let best = null;
      for (const { timezone } of timezoneData) {
        const transition = getNextDSTTransition(timezone);
        best = considerTransition(transition, best);
      }
      return best;
    }

    return getNextDSTTransition(timezoneData);
  }, [userCountry]);

  const daylightTimeNotice = useMemo(() => {
    if (!nextDstTransition) return null;

    const formattedDate = new Intl.DateTimeFormat(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(nextDstTransition.date);

    const suffix = (() => {
      if (userCountry === 'AU') return ' (NSW, VIC, SA, TAS, ACT)';
      if (userCountry === 'NZ') return ' (New Zealand)';

      const europeCountries = new Set([
        'AT', 'BE', 'CH', 'CZ', 'DE', 'ES', 'FI', 'FR', 'GB', 'IE',
        'IT', 'NL', 'NO', 'PL', 'PT', 'SE',
      ]);
      if (europeCountries.has(userCountry)) return ' (Europe)';
      return '';
    })();

    if (nextDstTransition.type === 'end') {
      return `Daylight time ends: ${formattedDate} (reverts to standard time)${suffix}`;
    }

    return `Daylight time starts: ${formattedDate}${suffix}`;
  }, [nextDstTransition, userCountry]);
  
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
  
  // If user is in Singapore, show only Singapore time
  if (!userCountry || userCountry === 'SG') {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: 'center',
          gap: isMobile ? '2px' : '4px',
          padding: isMobile ? '6px 10px' : '4px 8px',
          backgroundColor: '#fff3e0',
          borderRadius: '6px',
          border: '1px solid #ffcc80',
          whiteSpace: 'nowrap',
        }}>
          <span style={{ fontSize: isMobile ? '1rem' : '0.9rem' }}>🇸🇬</span>
          <span style={{ fontSize: isMobile ? '0.8rem' : '0.7rem', fontWeight: '700' }}>{singaporeTime}</span>
        </div>
      </div>
    );
  }

  // Check if this is a 6-timezone country (US or CA) or 11-timezone country (RU)
  const isSixTimezoneCountry = Array.isArray(userLocalInfo) && userLocalInfo.length === 6;
  const isElevenTimezoneCountry = Array.isArray(userLocalInfo) && userLocalInfo.length === 11;
  const shouldUseGridLayout = isSixTimezoneCountry || isElevenTimezoneCountry;

  return (
    <div style={{
      display: 'flex',
      flexDirection: shouldUseGridLayout ? 'column' : 'row',
      alignItems: 'center',
      gap: shouldUseGridLayout ? (isMobile ? '8px' : '8px') : (isMobile ? '8px' : '6px'),
      fontSize: isMobile ? '0.8rem' : '0.7rem',
      fontWeight: '500',
      color: '#2c3e50',
      flexWrap: shouldUseGridLayout ? 'wrap' : 'nowrap',
      justifyContent: 'center',
      overflowX: (isMobile && !shouldUseGridLayout) ? 'auto' : 'visible',
      maxWidth: '100%',
      padding: isMobile ? '4px 0' : (isElevenTimezoneCountry ? '8px 0' : '4px 0'),
      minHeight: isElevenTimezoneCountry ? '120px' : 'auto',
    }}>
      {userLocalInfo && (
        Array.isArray(userLocalInfo) ? (
          // Multiple timezones
          shouldUseGridLayout ? (
            isElevenTimezoneCountry ? (
              // Special layout for Russia: 5-5-1 grid (works for both mobile and desktop)
              <>
                <div style={{ display: 'flex', gap: isMobile ? '6px' : '6px', justifyContent: 'center', width: '100%' }}>
                  {userLocalInfo.slice(0, 5).map((info, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: isMobile ? '2px' : '2px',
                      padding: isMobile ? '4px 6px' : '4px 6px',
                      backgroundColor: '#e8f4f8',
                      borderRadius: isMobile ? '4px' : '4px',
                      border: '1px solid #b3d9e6',
                      whiteSpace: 'nowrap',
                      flex: '1',
                      minWidth: '0',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '2px' : '2px' }}>
                        <span style={{ fontSize: isMobile ? '0.8rem' : '0.75rem' }}>{countryFlags[userCountry] || '🌍'}</span>
                        <span style={{ fontSize: isMobile ? '0.6rem' : '0.55rem', color: '#5a6c7d', fontWeight: '600', textAlign: 'center' }}>
                          {getTimezoneLabel(info.name)}
                        </span>
                      </div>
                      <span style={{ fontSize: isMobile ? '0.7rem' : '0.65rem', fontWeight: '700' }}>{info.localTime}</span>
                      <span style={getBoundedDiffTextStyle({ fontSize: isMobile ? '0.5rem' : '0.5rem', color: info.isSameTime ? '#27ae60' : '#7f8c8d', fontStyle: 'italic' })}>
                        {info.timeDiffText.replace('hours', 'h').replace('hour', 'h')}
                      </span>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: isMobile ? '6px' : '6px', justifyContent: 'center', width: '100%' }}>
                  {userLocalInfo.slice(5, 10).map((info, index) => (
                    <div key={index + 5} style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: isMobile ? '2px' : '2px',
                      padding: isMobile ? '4px 6px' : '4px 6px',
                      backgroundColor: '#e8f4f8',
                      borderRadius: isMobile ? '4px' : '4px',
                      border: '1px solid #b3d9e6',
                      whiteSpace: 'nowrap',
                      flex: '1',
                      minWidth: '0',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '2px' : '2px' }}>
                        <span style={{ fontSize: isMobile ? '0.8rem' : '0.75rem' }}>{countryFlags[userCountry] || '🌍'}</span>
                        <span style={{ fontSize: isMobile ? '0.6rem' : '0.55rem', color: '#5a6c7d', fontWeight: '600', textAlign: 'center' }}>
                          {getTimezoneLabel(info.name)}
                        </span>
                      </div>
                      <span style={{ fontSize: isMobile ? '0.7rem' : '0.65rem', fontWeight: '700' }}>{info.localTime}</span>
                      <span style={getBoundedDiffTextStyle({ fontSize: isMobile ? '0.5rem' : '0.5rem', color: info.isSameTime ? '#27ae60' : '#7f8c8d', fontStyle: 'italic' })}>
                        {info.timeDiffText.replace('hours', 'h').replace('hour', 'h')}
                      </span>
                    </div>
                  ))}
                </div>
                {/* Bottom row: 11th timezone + SG time */}
                <div style={{ display: 'flex', gap: isMobile ? '8px' : '8px', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: isMobile ? '2px' : '2px',
                    padding: isMobile ? '4px 6px' : '4px 6px',
                    backgroundColor: '#e8f4f8',
                    borderRadius: isMobile ? '4px' : '4px',
                    border: '1px solid #b3d9e6',
                    whiteSpace: 'nowrap',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '2px' : '2px' }}>
                      <span style={{ fontSize: isMobile ? '0.8rem' : '0.75rem' }}>{countryFlags[userCountry] || '🌍'}</span>
                      <span style={{ fontSize: isMobile ? '0.6rem' : '0.55rem', color: '#5a6c7d', fontWeight: '600', textAlign: 'center' }}>
                        {getTimezoneLabel(userLocalInfo[10].name)}
                      </span>
                    </div>
                    <span style={{ fontSize: isMobile ? '0.7rem' : '0.65rem', fontWeight: '700' }}>{userLocalInfo[10].localTime}</span>
                    <span style={getBoundedDiffTextStyle({ fontSize: isMobile ? '0.5rem' : '0.5rem', color: userLocalInfo[10].isSameTime ? '#27ae60' : '#7f8c8d', fontStyle: 'italic' })}>
                      {userLocalInfo[10].timeDiffText.replace('hours', 'h').replace('hour', 'h')}
                    </span>
                  </div>
                  {/* Singapore time next to it */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: isMobile ? '2px' : '2px',
                    padding: isMobile ? '4px 6px' : '4px 6px',
                    backgroundColor: '#fff3e0',
                    borderRadius: isMobile ? '4px' : '4px',
                    border: '1px solid #ffcc80',
                    whiteSpace: 'nowrap',
                  }}>
                    <span style={{ fontSize: isMobile ? '0.8rem' : '0.75rem' }}>🇸🇬</span>
                    <span style={{ fontSize: isMobile ? '0.7rem' : '0.65rem', fontWeight: '700' }}>{singaporeTime}</span>
                  </div>
                </div>
              </>
            ) : (
              // Grid layout for 6-timezone countries (US/CA) - works for both mobile and desktop
            <>
              <div style={{ display: 'flex', gap: isMobile ? '8px' : '6px', justifyContent: 'center', width: '100%' }}>
                {userLocalInfo.slice(0, 3).map((info, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: isMobile ? '2px' : '1px',
                    padding: isMobile ? '6px 10px' : '4px 6px',
                    backgroundColor: '#e8f4f8',
                    borderRadius: isMobile ? '6px' : '4px',
                    border: '1px solid #b3d9e6',
                    whiteSpace: 'nowrap',
                    flex: '1',
                    minWidth: '0',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '4px' : '2px' }}>
                      <span style={{ fontSize: isMobile ? '1rem' : '0.8rem' }}>{countryFlags[userCountry] || '🌍'}</span>
                      <span style={{ fontSize: isMobile ? '0.7rem' : '0.6rem', color: '#5a6c7d', fontWeight: '600' }}>
                        {getTimezoneLabel(info.name)}
                      </span>
                    </div>
                    <span style={{ fontSize: isMobile ? '0.8rem' : '0.7rem', fontWeight: '700' }}>{info.localTime}</span>
                    <span style={getBoundedDiffTextStyle({ fontSize: isMobile ? '0.6rem' : '0.5rem', color: info.isSameTime ? '#27ae60' : '#7f8c8d', fontStyle: 'italic' })}>
                      {info.timeDiffText.replace('hours', 'h').replace('hour', 'h')}
                    </span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: isMobile ? '8px' : '6px', justifyContent: 'center', width: '100%' }}>
                {userLocalInfo.slice(3, 6).map((info, index) => (
                  <div key={index + 3} style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: isMobile ? '2px' : '1px',
                    padding: isMobile ? '6px 10px' : '4px 6px',
                    backgroundColor: '#e8f4f8',
                    borderRadius: isMobile ? '6px' : '4px',
                    border: '1px solid #b3d9e6',
                    whiteSpace: 'nowrap',
                    flex: '1',
                    minWidth: '0',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '4px' : '2px' }}>
                      <span style={{ fontSize: isMobile ? '1rem' : '0.8rem' }}>{countryFlags[userCountry] || '🌍'}</span>
                      <span style={{ fontSize: isMobile ? '0.7rem' : '0.6rem', color: '#5a6c7d', fontWeight: '600' }}>
                        {getTimezoneLabel(info.name)}
                      </span>
                    </div>
                    <span style={{ fontSize: isMobile ? '0.8rem' : '0.7rem', fontWeight: '700' }}>{info.localTime}</span>
                    <span style={getBoundedDiffTextStyle({ fontSize: isMobile ? '0.6rem' : '0.5rem', color: info.isSameTime ? '#27ae60' : '#7f8c8d', fontStyle: 'italic' })}>
                      {info.timeDiffText.replace('hours', 'h').replace('hour', 'h')}
                    </span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: isMobile ? '2px' : '1px',
                  padding: isMobile ? '6px 10px' : '4px 6px',
                  backgroundColor: '#fff3e0',
                  borderRadius: isMobile ? '6px' : '4px',
                  border: '1px solid #ffcc80',
                  whiteSpace: 'nowrap',
                  minWidth: isMobile ? '90px' : '70px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '4px' : '2px' }}>
                    <span style={{ fontSize: isMobile ? '1rem' : '0.8rem' }}>🇸🇬</span>
                    <span style={{ fontSize: isMobile ? '0.7rem' : '0.6rem', color: '#5a6c7d', fontWeight: '600' }}>SG</span>
                  </div>
                  <span style={{ fontSize: isMobile ? '0.8rem' : '0.7rem', fontWeight: '700' }}>{singaporeTime}</span>
                </div>
              </div>
            </>
            )
          ) : (
            // Standard horizontal layout for countries with multiple but fewer timezones
            <>
              {userLocalInfo.map((info, index) => (
                <div key={index} style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '2px',
                  padding: isMobile ? '6px 10px' : '4px 6px',
                  backgroundColor: '#e8f4f8',
                  borderRadius: isMobile ? '6px' : '4px',
                  border: '1px solid #b3d9e6',
                  whiteSpace: 'nowrap',
                  minWidth: isMobile ? '100px' : '80px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '4px' : '2px' }}>
                    <span style={{ fontSize: isMobile ? '1rem' : '0.8rem' }}>{countryFlags[userCountry] || '🌍'}</span>
                    <span style={{ fontSize: isMobile ? '0.7rem' : '0.6rem', color: '#5a6c7d', fontWeight: '600' }}>
                      {getTimezoneLabel(info.name)}
                    </span>
                  </div>
                  <span style={{ fontSize: isMobile ? '0.8rem' : '0.7rem', fontWeight: '700' }}>{info.localTime}</span>
                  {!isMobile && (
                    <span style={getBoundedDiffTextStyle({ fontSize: '0.5rem', color: info.isSameTime ? '#27ae60' : '#7f8c8d', fontStyle: 'italic' })}>
                      {info.timeDiffText.replace('hours', 'h').replace('hour', 'h')}
                    </span>
                  )}
                </div>
              ))}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px',
                padding: isMobile ? '6px 10px' : '4px 6px',
                backgroundColor: '#fff3e0',
                borderRadius: isMobile ? '6px' : '4px',
                border: '1px solid #ffcc80',
                whiteSpace: 'nowrap',
                minWidth: isMobile ? '90px' : '70px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '4px' : '2px' }}>
                  <span style={{ fontSize: isMobile ? '1rem' : '0.8rem' }}>🇸🇬</span>
                  <span style={{ fontSize: isMobile ? '0.7rem' : '0.6rem', color: '#5a6c7d', fontWeight: '600' }}>SG</span>
                </div>
                <span style={{ fontSize: isMobile ? '0.8rem' : '0.7rem', fontWeight: '700' }}>{singaporeTime}</span>
              </div>
            </>
          )
        ) : (
          // Single timezone for other countries
          <>
            <div style={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: 'center',
              gap: isMobile ? '2px' : '4px',
              padding: isMobile ? '6px 10px' : '4px 6px',
              backgroundColor: '#e8f4f8',
              borderRadius: isMobile ? '6px' : '4px',
              border: '1px solid #b3d9e6',
              whiteSpace: 'nowrap',
            }}>
              <span style={{ fontSize: isMobile ? '1rem' : '0.8rem' }}>{countryFlags[userCountry] || '🌍'}</span>
              <span style={{ fontSize: isMobile ? '0.8rem' : '0.7rem', fontWeight: '700' }}>{userLocalInfo.localTime}</span>
              {!isMobile && (
                <span style={getBoundedDiffTextStyle({ fontSize: '0.5rem', color: userLocalInfo.isSameTime ? '#27ae60' : '#7f8c8d', fontStyle: 'italic', marginLeft: '4px' })}>
                  {userLocalInfo.timeDiffText.replace('hours', 'h').replace('hour', 'h')}
                </span>
              )}
            </div>
            <div style={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: 'center',
              gap: isMobile ? '2px' : '4px',
              padding: isMobile ? '6px 10px' : '4px 6px',
              backgroundColor: '#fff3e0',
              borderRadius: isMobile ? '6px' : '4px',
              border: '1px solid #ffcc80',
              whiteSpace: 'nowrap',
            }}>
              <span style={{ fontSize: isMobile ? '1rem' : '0.8rem' }}>🇸🇬</span>
              <span style={{ fontSize: isMobile ? '0.8rem' : '0.7rem', fontWeight: '700' }}>{singaporeTime}</span>
            </div>
          </>
        )
      )}

      {daylightTimeNotice && (
        <div style={getBoundedDiffTextStyle({
          fontSize: isMobile ? '0.55rem' : '0.5rem',
          color: '#5a6c7d',
          fontWeight: '600',
          fontStyle: 'italic',
          marginTop: shouldUseGridLayout ? (isMobile ? '2px' : '4px') : '0',
        })}>
          {daylightTimeNotice}
        </div>
      )}
    </div>
  );
};

export default TimezoneHeader;

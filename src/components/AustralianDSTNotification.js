'use client';

import React, { useState, useEffect } from 'react';

const AustralianDSTNotification = ({ userCountry, t }) => {
  const [showNotification, setShowNotification] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [dstInfo, setDstInfo] = useState({ acdt: false, aedt: false });
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Update current time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Only show for Australian users
    if (userCountry !== 'AU') {
      return;
    }

    const checkDSTAndNotification = () => {
      const now = new Date();
      
      // Check if AEDT (Sydney/Melbourne) is in DST
      const sydneyDST = isDST('Australia/Sydney');
      // Check if ACDT (Adelaide) is in DST
      const adelaideDST = isDST('Australia/Adelaide');
      
      // Check if it's past 3am in respective timezones
      const past3amSydney = isPast3AM('Australia/Sydney');
      const past3amAdelaide = isPast3AM('Australia/Adelaide');
      
      // Hide AEDT if past 3am in Sydney timezone
      const showAEDT = sydneyDST && !past3amSydney;
      // Hide ACDT if past 3am in Adelaide timezone
      const showACDT = adelaideDST && !past3amAdelaide;
      
      setDstInfo({ acdt: showACDT, aedt: showAEDT });
      
      // If neither timezone should be shown, don't show notification
      if (!showAEDT && !showACDT) {
        setShowNotification(false);
        // Clear the localStorage flag when both are past 3am
        localStorage.removeItem('au_dst_notification_shown');
        return;
      }

      // Check if user has already seen the notification today
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      const lastShown = localStorage.getItem('au_dst_notification_shown');
      
      if (lastShown === today) {
        setShowNotification(false);
        return;
      }

      // Show notification
      setShowNotification(true);
    };

    checkDSTAndNotification();
    
    // Check every minute in case it reaches 3am
    const interval = setInterval(checkDSTAndNotification, 60000);
    
    return () => clearInterval(interval);
  }, [userCountry]);

  // Check if a timezone is currently observing DST
  const isDST = (timezone) => {
    try {
      const now = new Date();
      const january = new Date(now.getFullYear(), 0, 1);
      const july = new Date(now.getFullYear(), 6, 1);
      
      const janOffset = getTimezoneOffset(january, timezone);
      const julOffset = getTimezoneOffset(july, timezone);
      const currentOffset = getTimezoneOffset(now, timezone);
      
      // In Southern Hemisphere, DST is active when offset is greater (July is winter)
      const maxOffset = Math.max(janOffset, julOffset);
      return currentOffset === maxOffset && janOffset !== julOffset;
    } catch (error) {
      console.error(`Error checking DST for ${timezone}:`, error);
      return false;
    }
  };

  // Get timezone offset in minutes
  const getTimezoneOffset = (date, timezone) => {
    const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
    const tzDate = new Date(date.toLocaleString('en-US', { timeZone: timezone }));
    return (tzDate.getTime() - utcDate.getTime()) / 60000;
  };

  // Check if it's past 3am in a specific timezone
  const isPast3AM = (timezone) => {
    try {
      const timeInZone = new Date(currentTime.toLocaleString('en-US', { timeZone: timezone }));
      const hour = timeInZone.getHours();
      return hour >= 3;
    } catch (error) {
      console.error(`Error checking time for ${timezone}:`, error);
      return false;
    }
  };

  // Format time for a specific timezone
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
      console.error(`Error formatting time for ${timezone}:`, error);
      return '';
    }
  };

  const handleDismiss = () => {
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem('au_dst_notification_shown', today);
    setShowNotification(false);
  };

  if (!showNotification) {
    return null;
  }

  return (
    <div style={{
      backgroundColor: '#fff9e6',
      border: '2px solid #ffc107',
      borderRadius: isMobile ? '6px' : '8px',
      padding: isMobile ? '12px' : '16px',
      marginBottom: '20px',
      position: 'relative',
    }}>
      <button
        onClick={handleDismiss}
        style={{
          position: 'absolute',
          top: isMobile ? '8px' : '12px',
          right: isMobile ? '8px' : '12px',
          background: 'none',
          border: 'none',
          fontSize: isMobile ? '1.2rem' : '1.5rem',
          cursor: 'pointer',
          color: '#f57c00',
          padding: '0',
          width: isMobile ? '24px' : '28px',
          height: isMobile ? '24px' : '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          transition: 'background-color 0.2s',
        }}
        onMouseEnter={(e) => e.target.style.backgroundColor = '#fff3cd'}
        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
        aria-label="Dismiss notification"
      >
        ×
      </button>

      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: isMobile ? '8px' : '12px',
        paddingRight: isMobile ? '28px' : '36px',
      }}>
        <span style={{ 
          fontSize: isMobile ? '1.5rem' : '2rem',
          flexShrink: 0,
        }}>
          🇦🇺
        </span>
        
        <div style={{ flex: 1 }}>
          <h4 style={{ 
            marginTop: 0, 
            marginBottom: isMobile ? '6px' : '8px',
            color: '#e65100',
            fontSize: isMobile ? '0.95rem' : '1.05rem',
            fontWeight: '600',
          }}>
            {t?.australianDSTTitle || 'Australian Daylight Saving Time Active'}
          </h4>
          
          <div style={{
            fontSize: isMobile ? '0.85rem' : '0.95rem',
            color: '#5d4037',
            lineHeight: '1.4',
          }}>
            {dstInfo.aedt && dstInfo.acdt ? (
              <p style={{ margin: '0 0 8px 0' }}>
                {t?.australianDSTBothMessage || 
                  'Both AEDT (Australian Eastern Daylight Time) and ACDT (Australian Central Daylight Time) are currently in effect.'}
              </p>
            ) : dstInfo.aedt ? (
              <p style={{ margin: '0 0 8px 0' }}>
                {t?.australianAEDTMessage || 
                  'AEDT (Australian Eastern Daylight Time) is currently in effect for Sydney, Melbourne, and surrounding areas.'}
              </p>
            ) : dstInfo.acdt ? (
              <p style={{ margin: '0 0 8px 0' }}>
                {t?.australianACDTMessage || 
                  'ACDT (Australian Central Daylight Time) is currently in effect for Adelaide and South Australia.'}
              </p>
            ) : null}
            
            {/* Display current times */}
            <div style={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              gap: isMobile ? '6px' : '12px',
              marginBottom: '8px',
              flexWrap: 'wrap',
            }}>
              {dstInfo.aedt && (
                <div style={{
                  backgroundColor: '#fff',
                  padding: isMobile ? '6px 10px' : '8px 14px',
                  borderRadius: '6px',
                  border: '1px solid #ffd54f',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: isMobile ? '0.85rem' : '0.95rem',
                  fontWeight: '600',
                  color: '#e65100',
                }}>
                  <span>🕐</span>
                  <span>AEDT:</span>
                  <span style={{ fontFamily: 'monospace', color: '#2c3e50' }}>
                    {formatTime('Australia/Sydney')}
                  </span>
                </div>
              )}
              
              {dstInfo.acdt && (
                <div style={{
                  backgroundColor: '#fff',
                  padding: isMobile ? '6px 10px' : '8px 14px',
                  borderRadius: '6px',
                  border: '1px solid #ffd54f',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: isMobile ? '0.85rem' : '0.95rem',
                  fontWeight: '600',
                  color: '#e65100',
                }}>
                  <span>🕐</span>
                  <span>ACDT:</span>
                  <span style={{ fontFamily: 'monospace', color: '#2c3e50' }}>
                    {formatTime('Australia/Adelaide')}
                  </span>
                </div>
              )}
            </div>
            
            <p style={{ 
              margin: 0,
              fontSize: isMobile ? '0.75rem' : '0.85rem',
              fontStyle: 'italic',
              color: '#6d4c41',
            }}>
              {t?.australianDSTNote || 
                'Delivery times displayed above reflect the current daylight saving time.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AustralianDSTNotification;

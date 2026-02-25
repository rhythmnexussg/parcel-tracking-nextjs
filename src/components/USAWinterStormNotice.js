'use client';

import React, { useState, useEffect } from 'react';

const USAWinterStormNotice = ({ userCountry, t }) => {
  const [showNotice, setShowNotice] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Only show for USA users
    if (userCountry !== 'US') {
      setShowNotice(false);
      return;
    }

    // Show notice - active from Feb 23, 2026 onwards
    const noticeStartDate = new Date(2026, 1, 23, 0, 0, 0); // Feb 23, 2026
    const now = new Date();
    
    setShowNotice(now >= noticeStartDate);
  }, [userCountry]);

  if (!showNotice) {
    return null;
  }

  return (
    <div style={{
      backgroundColor: '#fff3cd',
      border: '2px solid #ff6b6b',
      borderRadius: '8px',
      padding: isMobile ? '12px 16px' : '16px 20px',
      marginBottom: '20px',
      maxWidth: '100%',
      boxShadow: '0 4px 12px rgba(255, 107, 107, 0.15)',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: isMobile ? '10px' : '12px',
        marginBottom: '12px',
      }}>
        <span style={{
          fontSize: isMobile ? '1.8rem' : '2rem',
          flexShrink: 0,
        }}>
          ⚠️
        </span>
        <div style={{ flex: 1 }}>
          <h3 style={{
            margin: '0 0 6px 0',
            fontSize: isMobile ? '1rem' : '1.2rem',
            color: '#d32f2f',
            fontWeight: '700',
          }}>
            {t('usaWinterStormTitle') || 'URGENT: Severe Winter Storm - Service Disruption'}
          </h3>
          <p style={{
            margin: '0',
            fontSize: isMobile ? '0.85rem' : '0.95rem',
            color: '#666',
            fontWeight: '600',
          }}>
            {t('usaWinterStormSubtitle') || 'United States Postal Service (USPS) Force Majeure Event'}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        fontSize: isMobile ? '0.8rem' : '0.9rem',
        lineHeight: '1.6',
        color: '#333',
        marginBottom: '12px',
      }}>
        <p style={{ margin: '0 0 10px 0' }}>
          <strong>{t('usaWinterStormNotice1') || 'Due to the severe winter storm affecting the New York region since February 23, 2026:'}</strong>
        </p>

        <ul style={{
          margin: '8px 0',
          paddingLeft: '20px',
          listStyleType: 'disc',
        }}>
          <li style={{ marginBottom: '6px' }}>
            {t('usaWinterStormNotice2') || 'International operations at John F. Kennedy International Airport have been effectively halted'}
          </li>
          <li style={{ marginBottom: '6px' }}>
            {t('usaWinterStormNotice3') || 'Widespread flight cancellations and significant disruption to airport services reported'}
          </li>
          <li style={{ marginBottom: '6px' }}>
            {t('usaWinterStormNotice4') || 'These conditions constitute a force majeure event beyond USPS control'}
          </li>
        </ul>

        <p style={{ margin: '10px 0' }}>
          <strong>{t('usaWinterStormNotice5') || 'Service Impact:'}</strong>
        </p>

        <ul style={{
          margin: '8px 0',
          paddingLeft: '20px',
          listStyleType: 'disc',
        }}>
          <li style={{ marginBottom: '6px' }}>
            {t('usaWinterStormNotice6') || 'Dangerous mix of heavy snow, freezing rain, sleet and bitter cold'}
          </li>
          <li style={{ marginBottom: '6px' }}>
            {t('usaWinterStormNotice7') || 'Major disruptions and widespread power outages reported'}
          </li>
          <li style={{ marginBottom: '6px' }}>
            {t('usaWinterStormNotice8') || 'Collection and delivery of domestic and international mail (letter-post, parcel-post and EMS items) affected'}
          </li>
        </ul>

        <p style={{ margin: '10px 0' }}>
          <strong>{t('usaWinterStormNotice9') || 'Affected Postcode Areas:'}</strong>
        </p>

        <div style={{
          backgroundColor: 'rgba(255, 107, 107, 0.05)',
          padding: '8px 12px',
          borderRadius: '4px',
          margin: '8px 0',
          wordBreak: 'break-word',
          fontSize: isMobile ? '0.75rem' : '0.85rem',
        }}>
          {t('usaWinterStormNotice10') || '06000–06999, 01000–02799, 03900–04999, 03000–03899, 07000–08999, 10001–14925, 15000–19699, 02800–02999, 05000–05999, 20001–20020, 20100–24699, 04699, 35000–36999'}
        </div>

        <p style={{ margin: '10px 0 0 0' }}>
          {t('usaWinterStormNotice11') || 'USPS is taking all necessary steps to minimize inconvenience to customers while keeping employees safe. We appreciate your patience and understanding during this force majeure event.'}
        </p>
      </div>

      {/* Footer Note */}
      <div style={{
        marginTop: '10px',
        paddingTop: '10px',
        borderTop: '1px solid rgba(255, 107, 107, 0.3)',
        fontSize: isMobile ? '0.75rem' : '0.85rem',
        color: '#666',
        fontStyle: 'italic',
      }}>
        {t('usaWinterStormNotice12') || 'Last updated: February 25, 2026'}
      </div>
    </div>
  );
};

export default USAWinterStormNotice;

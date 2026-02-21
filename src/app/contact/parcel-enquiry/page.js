'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navigation } from '../../../components/Navigation';
import { useLanguage } from '../../../LanguageContext';
import Link from 'next/link';
import { getSchoolEmailWarningMessage, isSchoolEmailDomain } from '../../../lib/spam-detection';

export default function ParcelEnquiry() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    orderNumber: '',
    email: '',
    shippingMethod: '',
    trackingNumber: '',
    undeliveredLongTime: '',
    deliveredButMissing: '',
    caseReferenceId: '',
    imageEvidence: null,
    agreed: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [showNoDeliveryMessage, setShowNoDeliveryMessage] = useState(false);

  const schoolEmailWarning = getSchoolEmailWarningMessage(language);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (name === 'undeliveredLongTime') {
      if (value === 'No') {
        setShowNoDeliveryMessage(true);
      } else {
        setShowNoDeliveryMessage(false);
      }
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prevent submission if "No" is selected for undelivered question
    if (formData.undeliveredLongTime === 'No') {
      alert(t('parcelAlertWait'));
      return;
    }

    if (!formData.agreed) {
      alert(t('parcelAlertAgree'));
      return;
    }

    // Validate case reference ID for non-Singapore users
    if (formData.caseReferenceId.trim().toUpperCase() !== 'NA' && !formData.caseReferenceId.trim()) {
      alert(t('parcelAlertCaseReference'));
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (key !== 'imageEvidence') {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      if (formData.imageEvidence) {
        formDataToSend.append('imageEvidence', formData.imageEvidence);
      }

      formDataToSend.append('language', language);

      const response = await fetch('/api/parcel-enquiry', {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/contact/successful');
        return;
      } else {
        setSubmitStatus({ type: 'error', message: data.error || t('parcelErrorMessage') });
      }
    } catch (error) {
      setSubmitStatus({ type: 'error', message: t('parcelGeneralError') });
    } finally {
      setIsSubmitting(false);
    }
  };

  const showDeliveredButMissingQuestion = formData.undeliveredLongTime === 'Yes';
  const canSubmit = formData.undeliveredLongTime === 'Yes' && formData.agreed;

  return (
    <>
      <Navigation />
      <div style={{ 
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        paddingTop: '160px',
        paddingBottom: '3rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start'
      }}>
        <div style={{
          maxWidth: '850px',
          width: '100%',
          margin: '0 1rem', 
          padding: '2rem',
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#333' }}>{t('parcelEnquiryTitle')}</h1>
        
        <div style={{
          padding: '1rem 1.25rem',
          backgroundColor: '#d1ecf1',
          border: '1px solid #bee5eb',
          borderRadius: '4px',
          marginBottom: '2rem',
          color: '#0c5460',
          lineHeight: '1.6'
        }}>
          <p style={{ margin: 0 }}>
            {t('parcelInfoText')}{' '}
            <Link href="/contact" style={{ color: '#004085', textDecoration: 'underline', fontWeight: '500' }}>
              {t('parcelInfoLink')}
            </Link>{' '}
            {t('parcelInfoEnd')}
          </p>
        </div>

        {language !== 'en' && (
          <div style={{
            padding: '0.9rem 1rem',
            backgroundColor: '#fff3cd',
            border: '1px solid #ffe69c',
            borderRadius: '4px',
            marginBottom: '1.5rem',
            color: '#664d03',
            lineHeight: '1.5'
          }}>
            {t('englishResponseNotice')}
          </div>
        )}

        {showNoDeliveryMessage && (
          <div style={{
            padding: '1.5rem',
            backgroundColor: '#fff3cd',
            border: '2px solid #ffc107',
            borderRadius: '4px',
            marginBottom: '2rem'
          }}>
            <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>{t('parcelWaitTitle')}</h3>
            <p style={{ marginBottom: '0.75rem' }}>
              {t('parcelWaitText1')}
            </p>
            <p style={{ margin: 0 }}>
              {t('parcelWaitText2')}
            </p>
            <p style={{ marginTop: '1rem', marginBottom: 0, fontWeight: 'bold', color: '#856404' }}>
              {t('parcelCannotSubmit')}
            </p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Name Field */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
              {t('parcelNameLabel')} *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '1rem',
                backgroundColor: '#fff',
                color: '#000',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Order Number Field */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
              {t('parcelOrderNumberLabel')} *
            </label>
            <input
              type="text"
              name="orderNumber"
              value={formData.orderNumber}
              onChange={handleChange}
              required
              placeholder={t('parcelOrderNumberPlaceholder')}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '1rem',
                backgroundColor: '#fff',
                color: '#000',
                boxSizing: 'border-box'
              }}
            />
            <div style={{
              marginTop: '0.5rem',
              padding: '0.75rem',
              backgroundColor: '#f8f9fa',
              border: '1px solid #dee2e6',
              borderRadius: '4px',
              fontSize: '0.9rem'
            }}>
              <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold' }}>
                {t('contactPlatformNote')}
              </p>
              <p style={{ margin: '0.5rem 0', fontWeight: 'bold' }}>{t('contactPlatformInstructions')}</p>
              <ul style={{ margin: '0.5rem 0 0 1.5rem', paddingLeft: 0 }}>
                <li>{t('contactPlatformEtsy')}</li>
                <li>{t('contactPlatformEbay')}</li>
                <li>{t('contactPlatformShopee')}</li>
              </ul>
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
              {t('parcelEmailLabel')} *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '1rem',
                backgroundColor: '#fff',
                color: '#000',
                boxSizing: 'border-box'
              }}
            />
            <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.25rem' }}>
              {t('parcelEmailNote')}
            </div>
            {isSchoolEmailDomain(formData.email.split('@')[1] || '') && (
              <div style={{
                marginTop: '0.5rem',
                padding: '0.75rem',
                backgroundColor: '#fff3cd',
                border: '1px solid #ffe69c',
                borderRadius: '4px',
                color: '#664d03',
                fontSize: '0.9rem'
              }}>
                {schoolEmailWarning}
              </div>
            )}
          </div>

          {/* Shipping Method */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
              {t('parcelShippingMethodLabel')} *
            </label>
            <select
              name="shippingMethod"
              value={formData.shippingMethod}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '1rem',
                backgroundColor: '#fff',
                color: '#000',
                boxSizing: 'border-box'
              }}
            >
              <option value="">{t('parcelSelectShipping')}</option>
              <option value="SingPost ePacket (ePAC)">{t('parcelSingPostEpac')}</option>
              <option value="SingPost Prepaid Tracked Label">{t('parcelSingPostPrepaid')}</option>
              <option value="SpeedPost Standard">{t('parcelSpeedPostStandard')}</option>
              <option value="SpeedPost Priority (EMS)">{t('parcelSpeedPostPriority')}</option>
              <option value="SpeedPost Express">{t('parcelSpeedPostExpress')}</option>
              <option value="DHL Express">{t('parcelDHL')}</option>
            </select>
          </div>

          {/* Tracking Number */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
              {t('parcelTrackingNumberLabel')} *
            </label>
            <input
              type="text"
              name="trackingNumber"
              value={formData.trackingNumber}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '1rem',
                backgroundColor: '#fff',
                color: '#000',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Undelivered Long Time Question */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
              {t('parcelUndeliveredLabel')} *
            </label>
            <select
              name="undeliveredLongTime"
              value={formData.undeliveredLongTime}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '1rem',
                backgroundColor: '#fff',
                color: '#000',
                boxSizing: 'border-box'
              }}
            >
              <option value="">{t('parcelSelectOption')}</option>
              <option value="Yes">{t('parcelYes')}</option>
              <option value="No">{t('parcelNo')}</option>
            </select>
          </div>

          {/* Delivered But Missing Question (conditional) */}
          {showDeliveredButMissingQuestion && (
            <>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
                  {t('parcelDeliveredButMissingLabel')} *
                </label>
                <select
                  name="deliveredButMissing"
                  value={formData.deliveredButMissing}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    fontSize: '1rem',
                    backgroundColor: '#fff',
                    color: '#000',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="">{t('parcelSelectOption')}</option>
                  <option value="Yes">{t('parcelYes')}</option>
                  <option value="No">{t('parcelNo')}</option>
                </select>
              </div>

              {/* Case Reference ID */}
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
                  {t('parcelCaseReferenceLabel')} *
                </label>
                <input
                  type="text"
                  name="caseReferenceId"
                  value={formData.caseReferenceId}
                  onChange={handleChange}
                  required
                  placeholder={t('parcelCaseReferencePlaceholder')}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    fontSize: '1rem',
                    backgroundColor: '#fff',
                    color: '#000',
                    boxSizing: 'border-box'
                  }}
                />
                <div style={{
                  marginTop: '0.5rem',
                  padding: '0.75rem',
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #dee2e6',
                  borderRadius: '4px',
                  fontSize: '0.9rem'
                }}>
                  <p style={{ margin: 0 }}>
                    {t('parcelCaseReferenceNote')}{' '}
                    <Link href="/postal-contacts" style={{ color: '#0066cc', textDecoration: 'underline', fontWeight: 'bold' }}>
                      {t('parcelCaseReferenceLink')}
                    </Link>
                    . <strong>{t('parcelCaseReferenceMandatory')}</strong>
                  </p>
                </div>
              </div>

              {/* Image Evidence Upload */}
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  {t('parcelImageEvidenceLabel')}
                </label>
                <input
                  type="file"
                  name="imageEvidence"
                  onChange={handleChange}
                  accept="image/*"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    fontSize: '1rem'
                  }}
                />
                <div style={{
                  marginTop: '0.5rem',
                  padding: '0.75rem',
                  backgroundColor: '#fff3cd',
                  border: '1px solid #ffc107',
                  borderRadius: '4px',
                  fontSize: '0.9rem'
                }}>
                  <p style={{ margin: 0 }}>
                    {t('parcelImageWarning')}
                  </p>
                  <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', color: '#856404' }}>
                    {t('parcelImageNote')}
                  </p>
                </div>
              </div>

              {/* Agreement Checkbox */}
              <div style={{
                padding: '1rem',
                backgroundColor: '#f8f9fa',
                border: '1px solid #dee2e6',
                borderRadius: '4px'
              }}>
                <p style={{ marginBottom: '1rem', fontSize: '0.95rem' }}>
                  {t('parcelAgreementText')}
                </p>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    name="agreed"
                    checked={formData.agreed}
                    onChange={handleChange}
                    required
                    style={{ marginRight: '0.5rem', width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <span style={{ fontWeight: 'bold' }}>{t('parcelAgreeCheckbox')} *</span>
                </label>
              </div>
            </>
          )}

          {/* Submit Status */}
          {submitStatus && (
            <div style={{
              padding: '1rem',
              backgroundColor: '#f8d7da',
              border: '1px solid #f5c6cb',
              borderRadius: '4px',
              color: '#721c24'
            }}>
              {submitStatus.message}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !canSubmit}
            style={{
              padding: '1rem',
              backgroundColor: (isSubmitting || !canSubmit) ? '#ccc' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: (isSubmitting || !canSubmit) ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => {
              if (!isSubmitting && canSubmit) {
                e.target.style.backgroundColor = '#0056b3';
              }
            }}
            onMouseLeave={(e) => {
              if (!isSubmitting && canSubmit) {
                e.target.style.backgroundColor = '#007bff';
              }
            }}
          >
            {isSubmitting ? t('parcelSubmitting') : t('parcelSubmit')}
          </button>
        </form>
        </div>
      </div>
    </>
  );
}

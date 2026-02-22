'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navigation } from '../../components/Navigation';
import { useLanguage } from '../../LanguageContext';
import Link from 'next/link';
import { getSchoolEmailWarningMessage, isSchoolEmailDomain } from '../../lib/spam-detection';

export default function Contact() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    enquiryType: '',
    orderNumber: '',
    message: '',
    agreed: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const schoolEmailWarning = getSchoolEmailWarningMessage(language);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.agreed) {
      alert(t('contactAlertAgree'));
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          language,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/contact/successful');
        return;
      } else {
        setSubmitStatus({ type: 'error', message: data.error || t('contactErrorMessage') });
      }
    } catch (error) {
      setSubmitStatus({ type: 'error', message: t('contactGeneralError') });
    } finally {
      setIsSubmitting(false);
    }
  };

  const showMessageField = ['General Enquiry / Feedback', 'Business Enquiry', 'Others', 'Order/Shipping Enquiry'].includes(formData.enquiryType);
  const showExchangeRefundInfo = formData.enquiryType === 'Exchange/Refund/Return Enquiry';
  const showOrderShippingFields = formData.enquiryType === 'Order/Shipping Enquiry';
  const showAgreementAndSubmit = formData.enquiryType !== 'Exchange/Refund/Return Enquiry' && formData.enquiryType !== '';

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
          <h1 style={{ textAlign: 'center', marginBottom: '2rem', color: '#333' }}>{t('contactUsTitle')}</h1>

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
        
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Name Field */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
              {t('contactNameLabel')} *
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

          {/* Email Field */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
              {t('contactEmailLabel')} *
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
              {t('contactEmailNote')}
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

          {/* Enquiry Type */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
              {t('contactEnquiryTypeLabel')} *
            </label>
            <select
              name="enquiryType"
              value={formData.enquiryType}
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
              <option value="">{t('contactSelectOption')}</option>
              <option value="General Enquiry / Feedback">{t('contactGeneralEnquiry')}</option>
              <option value="Business Enquiry">{t('contactBusinessEnquiry')}</option>
              <option value="Order/Shipping Enquiry">{t('contactOrderShippingEnquiry')}</option>
              <option value="Exchange/Refund/Return Enquiry">{t('contactExchangeRefundEnquiry')}</option>
              <option value="Others">{t('contactOthers')}</option>
            </select>
          </div>

          {/* Order/Shipping Enquiry Fields */}
          {showOrderShippingFields && (
            <>
              <div style={{
                padding: '1rem',
                backgroundColor: '#d1ecf1',
                border: '1px solid #bee5eb',
                borderRadius: '4px',
                marginTop: '-0.5rem'
              }}>
                <p style={{ margin: 0, color: '#0c5460' }}>
                  {t('contactParcelWarning')}{' '}
                  <Link href="/contact/parcel-enquiry" style={{ color: '#004085', textDecoration: 'underline', fontWeight: 'bold' }}>
                    {t('contactParcelWarningLink')}
                  </Link>{' '}
                  {t('contactParcelWarningEnd')}
                </p>
              </div>
              
              {/* Order Number */}
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
                  {t('contactOrderNumberLabel')} *
                </label>
                <input
                  type="text"
                  name="orderNumber"
                  value={formData.orderNumber}
                  onChange={handleChange}
                  required
                  placeholder={t('contactOrderNumberPlaceholder')}
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
                  fontSize: '0.9rem',
                  color: '#495057'
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
            </>
          )}

          {/* Exchange/Refund Info */}
          {showExchangeRefundInfo && (
            <div style={{
              padding: '1rem',
              backgroundColor: '#f8f9fa',
              border: '1px solid #dee2e6',
              borderRadius: '4px',
              marginTop: '-0.5rem'
            }}>
              <p style={{ marginBottom: '0.75rem' }}>
                {t('contactRefundNote1')}
              </p>
              <p style={{ marginBottom: '0.75rem' }}>
                {t('contactRefundNote2')}
              </p>
              <p style={{ margin: 0 }}>
                {t('contactRefundNote3')}
              </p>
            </div>
          )}

          {/* Message Field (conditional) */}
          {showMessageField && (
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
                {t('contactMessageLabel')} *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                maxLength={1000}
                rows={8}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  resize: 'vertical',
                  backgroundColor: '#fff',
                  color: '#000',
                  boxSizing: 'border-box'
                }}
              />
              <div style={{ textAlign: 'right', fontSize: '0.875rem', color: '#666', marginTop: '0.25rem' }}>
                {formData.message.length}/1000 {t('contactCharacterCount')}
              </div>
            </div>
          )}
          
          {/* Spam Warning */}
          {showMessageField && (
            <div style={{
              padding: '0.75rem',
              backgroundColor: '#fff3cd',
              border: '1px solid #ffc107',
              borderRadius: '4px',
              fontSize: '0.9rem',
              color: '#856404'
            }}>
              <strong>{t('contactSpamWarningNote')}</strong> {t('contactSpamWarning')}
            </div>
          )}

          {/* Agreement Checkbox */}
          {showAgreementAndSubmit && (
          <>
            <div style={{
            padding: '1rem',
            backgroundColor: '#f8f9fa',
            border: '1px solid #dee2e6',
            borderRadius: '4px'
          }}>
            <p style={{ marginBottom: '0.75rem', fontSize: '0.95rem', color: '#333' }}>
              {t('contactAgreementText1')}
            </p>
            <p style={{ marginBottom: '1rem', fontSize: '0.95rem' }}>
              {t('contactAgreementText2')}
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
              <span style={{ fontWeight: 'bold' }}>{t('contactAgreeCheckbox')} *</span>
            </label>
          </div>

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
            disabled={isSubmitting || !formData.agreed || !formData.enquiryType}
            style={{
              padding: '1rem',
              backgroundColor: (isSubmitting || !formData.agreed || !formData.enquiryType) ? '#ccc' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: (isSubmitting || !formData.agreed || !formData.enquiryType) ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => {
              if (!isSubmitting && formData.agreed && formData.enquiryType) {
                e.target.style.backgroundColor = '#0056b3';
              }
            }}
            onMouseLeave={(e) => {
              if (!isSubmitting && formData.agreed && formData.enquiryType) {
                e.target.style.backgroundColor = '#007bff';
              }
            }}
          >
            {isSubmitting ? t('contactSubmitting') : t('contactSubmit')}
          </button>
          </>
          )}
        </form>
        <p className="text-muted" style={{ textAlign: 'center', marginTop: '2rem' }}>
          © {new Date().getFullYear()} Rhythm Nexus. {t('copyrightText')}
        </p>
        </div>
      </div>
    </>
  );
}

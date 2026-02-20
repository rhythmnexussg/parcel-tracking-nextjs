'use client';

import { Navigation } from '../../components/Navigation';
import { useLanguage } from '../../LanguageContext';
import { useRouter } from 'next/navigation';

export default function PostalContacts() {
  const { t } = useLanguage();
  const router = useRouter();

  const postalServices = [
    { countryCode: 'SG', provider: 'SingPost', website: 'https://singpost.com/', contactForm: 'https://crmint.singpost.com/spcontactus', contactNumber: '1605 | +65 6222 5777 - Overseas', contactEmail: '' },
    { countryCode: 'AU', provider: 'Australia Post', website: 'https://auspost.com.au/', contactForm: 'https://auspost.com.au/help-and-support', contactNumber: '13 POST (13 7678) | +61 3 8340 7239 - if overseas', contactEmail: '' },
    { countryCode: 'AT', provider: 'Österreichische Post', website: 'https://post.at/', contactForm: 'https://www.post.at/en/k/f/contact-us', contactNumber: '+43 800 01 01 01', contactEmail: '' },
    { countryCode: 'BE', provider: 'bpost', website: 'https://www.bpost.be/', contactForm: 'https://www.bpost.be/en/contact-bpost', contactNumber: '022785127 | +3222785127 - if overseas', contactEmail: '' },
    { countryCode: 'BN', provider: 'Post Brunei', website: 'https://www.posbru.com.bn/', contactForm: '', contactNumber: '+673 238 0481 (working hours) | +673 871 1002 (WhatsApp)', contactEmail: 'contact@posbru.com.bn' },
    { countryCode: 'CA', provider: 'Canada Post', website: 'https://canadapost-postescanada.ca/', contactForm: 'https://www.canadapost-postescanada.ca/cpc/en/support.page', contactNumber: '+1-866-607-6301 | +1-416-979-3033 - if overseas', contactEmail: '' },
    { countryCode: 'CN', provider: 'China EMS', website: 'https://ems.com.cn/', contactForm: 'http://nmc.ems.com.cn:9096/imcloud/static/unified_page_pc.html?tenantId=1000&channel=1&phoneNumber=', contactNumber: '11185 | +86 10 11185 - if overseas (Airmail) | 11183 | +86 10 11183 - if overseas (EMS)', contactEmail: '' },
    { countryCode: 'CZ', provider: 'Česká pošta', website: 'https://www.ceskaposta.cz/', contactForm: '', contactNumber: '+420 210 123 456', contactEmail: 'info@cpost.cz' },
    { countryCode: 'FI', provider: 'Posti', website: 'https://posti.fi/', contactForm: 'https://www.posti.fi/omaposti', contactNumber: '0100 5577 | +358 100 5577 - if overseas', contactEmail: '' },
    { countryCode: 'FR', provider: 'La Poste', website: 'https://laposte.fr/', contactForm: 'https://aide.laposte.fr/nous-contacter', contactNumber: '+33 810 82 18 21', contactEmail: '' },
    { countryCode: 'DE', provider: 'DHL', website: 'https://www.dhl.com/de-de/', contactForm: '', contactNumber: '+49 228 189-66701', contactEmail: 'complaints.dhl@dhl.com' },
    { countryCode: 'HK', provider: 'Hongkong Post', website: 'https://hongkongpost.hk/', contactForm: '', contactNumber: '(852) 2921 2222 (General) | (852) 2921 2211 or (852) 2921 2560 (Mail Tracing)', contactEmail: 'hkpo@hkpo.gov.hk (General) | mto@hkpo.gov.hk (Mail Tracing)' },
    { countryCode: 'IN', provider: 'India Post', website: 'https://www.indiapost.gov.in/', contactForm: 'https://www.indiapost.gov.in/contactus', contactNumber: '1800 266 6868 | +91 1800 266 6868', contactEmail: '' },
    { countryCode: 'ID', provider: 'Pos Indonesia', website: 'https://posindonesia.co.id/', contactForm: 'https://www.posindonesia.co.id/id/contact', contactNumber: '1500161 | +62 21 855 00 161 | (+62) 1500 225 (Customs)', contactEmail: '' },
    { countryCode: 'IE', provider: 'An Post', website: 'https://anpost.ie/', contactForm: '', contactNumber: '1 705 7600 | +353 1 705 7600 - if overseas', contactEmail: '' },
    { countryCode: 'IL', provider: 'Israel Post', website: 'https://israelpost.co.il/', contactForm: 'https://israelpost.co.il/%D7%A9%D7%99%D7%A8%D7%95%D7%AA%D7%99%D7%9D/%D7%A6%D7%95%D7%A8-%D7%A7%D7%A9%D7%A8/', contactNumber: '171 | +972-73-263-3555 - if overseas | WhatsApp: https://wa.me/972529485145', contactEmail: '' },
    { countryCode: 'IT', provider: 'Poste Italiane', website: 'https://www.poste.it/', contactForm: 'https://www.poste.it/reclami/index.html?ambito=Corrispondenza#!/ambito', contactNumber: '803.160 | +39.02.82.44.33.99 - if overseas', contactEmail: 'servizio.clienti@posteitaliane.it' },
    { countryCode: 'JP', provider: 'Japan Post', website: 'https://www.post.japanpost.jp/', contactForm: '', contactNumber: '0120-5931-55 (Toll Free) | 0570-046-666 (Mobile) | 0570-046-111 (English)', contactEmail: '' },
    { countryCode: 'MO', provider: 'Macau Post', website: 'https://www.ctt.gov.mo/macaupost/', contactForm: '', contactNumber: '2857 4491 | 8396 8514 (Parcel) | 2859 6688 (Pickup) | 8396 8521 (Info) - Add +853 if overseas', contactEmail: 'exp@ctt.gov.mo (Postal) | ems@ctt.gov.mo (EMS)' },
    { countryCode: 'MY', provider: 'Pos Malaysia', website: 'https://www.pos.com.my/', contactForm: 'https://www.pos.com.my/contact-us/#AskPos', contactNumber: '1300 300 300 | +60 3 2705 9900 - if overseas', contactEmail: '' },
    { countryCode: 'NL', provider: 'PostNL', website: 'https://postnl.nl/', contactForm: 'https://www.postnl.nl/klantenservice/', contactNumber: '0800 0143 (Customs Hotline)', contactEmail: '' },
    { countryCode: 'NZ', provider: 'NZ Post', website: 'https://www.nzpost.co.nz/', contactForm: 'https://www.nzpost.co.nz/contact-support/assistance/form', contactNumber: '+64 9 977 0102 | 09 977 0102 (Auckland) | 07 960 0468 (Waikato) | 06 952 8600 (Palmerston North) | 04 897 5675 (Wellington) | 03 983 1425 (South Island)', contactEmail: '' },
    { countryCode: 'NO', provider: 'Posten Norge', website: 'https://posten.no/', contactForm: 'https://www.posten.no/en/customer-service', contactNumber: '22 03 00 00 | +47 22 03 00 00 - if overseas', contactEmail: '' },
    { countryCode: 'PH', provider: 'PHLPost', website: 'https://phlpost.gov.ph/', contactForm: '', contactNumber: '(02) 8288 7678 | +63 2 8288-7678 - if overseas', contactEmail: 'ems.cs@phlpost.gov.ph (EMS) | amed.supportservices@phlpost.gov.ph (Airmail/ePAC) | phlpostcares@phlpost.gov.ph (General)' },
    { countryCode: 'PL', provider: 'Poczta Polska', website: 'https://www.poczta-polska.pl/', contactForm: 'https://www.poczta-polska.pl/kontakt/', contactNumber: '+48 438 420 600', contactEmail: '' },
    { countryCode: 'PT', provider: 'CTT', website: 'https://ctt.pt/', contactForm: 'https://www.ctt.pt/ajuda/contacto', contactNumber: '21 047 16 16 | +351 21 047 16 16 - if overseas | WhatsApp: +351914102787', contactEmail: '' },
    { countryCode: 'KR', provider: 'Korea Post', website: 'https://www.epost.go.kr/', contactForm: '', contactNumber: '1588-1300 | +82-42-609-4295', contactEmail: 'help@posa.or.kr' },
    { countryCode: 'ES', provider: 'Correos', website: 'https://correos.es/', contactForm: 'https://www.correos.es/es/es/atencion-al-cliente', contactNumber: '', contactEmail: '' },
    { countryCode: 'SE', provider: 'PostNord', website: 'https://www.postnord.se/', contactForm: 'https://www.postnord.se/kundservice-faq/', contactNumber: '+46 771 33 33 10', contactEmail: '' },
    { countryCode: 'CH', provider: 'Swiss Post', website: 'https://post.ch/', contactForm: 'https://www.post.ch/de/hilfe-und-kontakt', contactNumber: '+41 848 888 888', contactEmail: '' },
    { countryCode: 'TW', provider: 'Chunghwa Post', website: 'https://www.post.gov.tw/', contactForm: 'https://www.post.gov.tw/post/internet/Customer_service/index.jsp?ID=1603', contactNumber: '0800-700-365 | (04)2354-2030 - if cell phone', contactEmail: '' },
    { countryCode: 'TH', provider: 'Thailand Post', website: 'https://www.thailandpost.co.th/', contactForm: 'https://praisanee.my.salesforce-sites.com/cases', contactNumber: '0 2831 3131 | +66 (0) 2831 3131 - if overseas', contactEmail: 'postalcare@thailandpost.co.th' },
    { countryCode: 'GB', provider: 'Royal Mail / Parcelforce', website: 'https://royalmail.com/', contactForm: 'https://help.royalmail.com/s/contactsupport/', contactNumber: '03457 740 740 | 18001 0344 748 0019 (Hearing Impaired) | 0345 746 8469 (Welsh)', contactEmail: '' },
    { countryCode: 'US', provider: 'USPS', website: 'https://usps.com/', contactForm: 'https://emailus.usps.com/s/', contactNumber: '1-800-ASK-USPS (1-800-275-8777)', contactEmail: '' },
    { countryCode: 'VN', provider: 'Vietnam Post', website: 'https://vietnampost.vn/', contactForm: '', contactNumber: '1900 54 54 81 | +84 24 3768 9411 - if overseas', contactEmail: 'cskh@vnpost.vn' }
  ];

  return (
    <>
      <Navigation />
      <div style={{ 
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        paddingTop: '160px',
        paddingBottom: '3rem'
      }}>
        <div style={{
          maxWidth: '1400px',
          width: '100%',
          margin: '0 auto',
          padding: '2rem'
        }}>
          <h1 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#333' }}>
            {t('postalContactsTitle') || 'Postal Service Contacts'}
          </h1>
          
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <button
              onClick={() => router.push('/contact/parcel-enquiry')}
              style={{
                background: '#007bff',
                color: 'white',
                border: 'none',
                padding: '0.75rem 2rem',
                borderRadius: '6px',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#0056b3';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#007bff';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
              }}
            >
              ← {t('postalContactsBackButton') || 'Back to Parcel Enquiry Form'}
            </button>
          </div>
          
          <div style={{
            padding: '1rem',
            backgroundColor: '#fff3cd',
            border: '1px solid #ffc107',
            borderRadius: '4px',
            marginBottom: '2rem',
            color: '#856404'
          }}>
            <p style={{ margin: 0, marginBottom: '0.5rem' }}>
              <strong>{t('postalContactsNote') || 'Note:'}</strong> {t('postalContactsPolandUKNote') || 'For Poland & UK, all items sent via SpeedPost Priority (EMS) will be handled by Pocztex and Parcelforce.'}
            </p>
            <p style={{ margin: 0 }}>
              {t('postalContactsDHLNote') || 'For SpeedPost Express shipments, please contact DHL through this link:'}{' '}
              <a href="https://www.dhl.com/sg-en/home/customer-service.html?locale=true" target="_blank" rel="noopener noreferrer" style={{ color: '#0066cc', textDecoration: 'underline' }}>
                https://www.dhl.com/sg-en/home/customer-service.html?locale=true
              </a>
            </p>
          </div>

          <div style={{
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            overflow: 'auto'
          }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              minWidth: '800px'
            }}>
              <thead>
                <tr style={{ backgroundColor: '#007bff', color: 'white' }}>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #0056b3' }}>
                    {t('postalContactsCountry') || 'Country'}
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #0056b3' }}>
                    {t('postalContactsWebsite') || 'Website'}
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #0056b3' }}>
                    {t('postalContactsForm') || 'Contact Form'}
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #0056b3' }}>
                    {t('postalContactsPhone') || 'Contact Number'}
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #0056b3' }}>
                    {t('postalContactsEmail') || 'Contact Email'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {postalServices.map((service, index) => {
                  const countryTranslation = t(`country${service.countryCode}`) || `${service.countryCode}`;
                  const flagMatch = countryTranslation.match(/^([\u{1F1E6}-\u{1F1FF}]{2})\s*/u);
                  const flag = flagMatch ? flagMatch[1] : '';
                  const countryName = countryTranslation.replace(/^[\u{1F1E6}-\u{1F1FF}]{2}\s*/u, '').trim();
                  
                  return (
                    <tr key={index} style={{ borderBottom: '1px solid #dee2e6' }}>
                      <td style={{ padding: '0.75rem', verticalAlign: 'top' }}>
                        {flag && <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>{flag}</span>}
                        <strong>{countryName}</strong>
                        <br />
                        <span style={{ fontSize: '0.9rem', color: '#666' }}>({service.provider})</span>
                      </td>
                      <td style={{ padding: '0.75rem', verticalAlign: 'top' }}>
                        <a href={service.website} target="_blank" rel="noopener noreferrer" style={{ color: '#0066cc', wordBreak: 'break-all' }}>
                          {service.website}
                        </a>
                      </td>
                      <td style={{ padding: '0.75rem', verticalAlign: 'top' }}>
                        {service.contactForm ? (
                          <a href={service.contactForm} target="_blank" rel="noopener noreferrer" style={{ color: '#0066cc', wordBreak: 'break-all' }}>
                            {t('postalContactsFormLink') || 'Contact Form'}
                          </a>
                        ) : (
                          <span style={{ color: '#999' }}>-</span>
                        )}
                      </td>
                      <td style={{ padding: '0.75rem', verticalAlign: 'top', fontSize: '0.9rem' }}>
                        {service.contactNumber || <span style={{ color: '#999' }}>-</span>}
                      </td>
                      <td style={{ padding: '0.75rem', verticalAlign: 'top', fontSize: '0.9rem', wordBreak: 'break-all' }}>
                        {service.contactEmail ? service.contactEmail : <span style={{ color: '#999' }}>-</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

'use client';

import React, { useState, useEffect, useCallback, Suspense } from "react";
import "../../App.css";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import logo from "../../assets/images/logo.jpg";
import trackLogo1 from "../../assets/images/17track-logo.jpeg";
import trackLogo2 from "../../assets/images/aftership-logo.png";
import trackLogo3 from "../../assets/images/parcelsapp-logo.png";
import trackLogo4 from "../../assets/images/upu-logo.png";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "../../LanguageContext";
import { LanguageSelector } from "../../LanguageSelector";
import { detectLanguageFromIPWithRestrictions, isAccessAllowedFromChina } from "../../ipGeolocation";
import { Navigation } from "../../components/Navigation";

// --- Service Announcement Component ---
const ServiceAnnouncement = ({ allowedDestinations }) => {
  const { t, tStrict, language: currentLanguage } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
  }, [allowedDestinations, currentLanguage]);

  const iframeSrc = `/api/singpost-announcements${allowedDestinations && allowedDestinations.length > 0 ? '?countries=' + allowedDestinations.join(',') + '&' : '?'}lang=${currentLanguage}`;

  return (
    <div className="service-announcement-container" style={{
      marginBottom: '2rem',
      border: '2px solid #0066cc',
      borderRadius: '8px',
      overflow: 'hidden',
      backgroundColor: '#f8f9fa'
    }}>
      <div style={{
        backgroundColor: '#0066cc',
        color: 'white',
        padding: '12px 20px',
        fontWeight: 'bold',
        fontSize: '1.1rem'
      }}>
        📢 {t('serviceAnnouncement')}
        {allowedDestinations && allowedDestinations.length > 0 && (
          <span style={{ 
            fontSize: '0.85rem', 
            marginLeft: '10px',
            opacity: 0.9,
            fontWeight: 'normal'
          }}>
            {t('filteredAllowedDestinations') || '(Filtered for your allowed destinations)'}
          </span>
        )}
      </div>
      
      {isLoading && (
        <div style={{ 
          padding: '60px 20px',
          textAlign: 'center',
          backgroundColor: 'white'
        }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p style={{ marginTop: '15px', color: '#666' }}>{t('loadingAnnouncements') || 'Loading announcements...'}</p>
        </div>
      )}
      
      {hasError && (
        <div style={{ 
          padding: '30px 20px',
          textAlign: 'center',
          backgroundColor: 'white'
        }}>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            {t('unableToLoadAnnouncements') || 'Unable to load service announcements at this time.'}
          </p>
          <a 
            href="https://www.singpost.com/send-receive/sending-overseas/international-postage-services"
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              backgroundColor: '#0066cc',
              color: 'white',
              padding: '12px 30px',
              borderRadius: '5px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '1rem',
            }}
          >
            {t('viewOnSingPostWebsite') || 'View on SingPost Website →'}
          </a>
        </div>
      )}
      
      {!hasError && (
        <iframe
          className="service-announcement-iframe"
          key={`announcements-${currentLanguage}-${allowedDestinations ? allowedDestinations.join('-') : 'all'}`}
          src={iframeSrc}
          style={{
            width: '100%',
            minHeight: '500px',
            border: 'none',
            backgroundColor: 'white'
          }}
          title="SingPost Service Announcements"
          sandbox="allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation allow-forms allow-scripts"
          onLoad={() => {
            setIsLoading(false);
            setHasError(false);
          }}
          onError={() => {
            setHasError(true);
            setIsLoading(false);
          }}
        />
      )}
    </div>
  );
};

const postalTrackingUrls = {
  // --- Singapore Couriers ---
  SG: "https://www.singpost.com/track-items?trackingid=",
  // --- International Couriers ---
  DHL: 'https://mydhl.express.dhl/sg/en/tracking.html#/results?id=',
  // --- Postal Services by Country Code ---
  AU: 'https://auspost.com.au/mypost/track/details/',
  AT: 'https://www.post.at/s/sendungsdetails?snr=',
  BE: 'https://track.bpost.cloud/btr/web/#/search?lang=fr&itemCode=',
  BN: 'https://bn.postglobal.online/vpo/tracking/',
  CA: 'https://www.canadapost-postescanada.ca/track-reperage/{lang}#/search?searchFor=',
  CN: 'https://www.ems.com.cn/qps/yjcx/',
  CZ: 'https://www.postaonline.cz/trackandtrace/-/zasilka/cislo?parcelNumbers=',
  FI: 'https://www.posti.fi/fi/seuranta#/lahetys/',
  FR: 'https://www.laposte.fr/outils/track-a-parcel?code=',
  DE: 'https://www.dhl.com/{lang}/home/{path}.html?tracking-id=',
  // Hong Kong: language-specific tracking links
  HK: {
    en: 'https://webapp.hongkongpost.hk/en/mail_tracking/index.html?trackcode=',
    zh: 'https://webapp.hongkongpost.hk/tc/mail_tracking/index.html?trackcode=', // Traditional Chinese
    zh_hk: 'https://webapp.hongkongpost.hk/tc/mail_tracking/index.html?trackcode=', // Alias for Traditional Chinese
    zh_cn: 'https://webapp.hongkongpost.hk/sc/mail_tracking/index.html?trackcode=', // Simplified Chinese
  },
  IN: 'https://www.indiapost.gov.in/track-result/article-number/',
  // Indonesia: language-specific tracking links
  ID: {
    id: 'https://www.posindonesia.co.id/id/tracking/',
    en: 'https://www.posindonesia.co.id/en/tracking/',
  },
  // Ireland: language-specific tracking links (no embed, fallback only)
  IE: {
    en: 'https://www.anpost.com/',
    ga: 'https://www.anpost.com/ga-IE',
  },
  // Israel: language-specific tracking links (no embed, fallback only)
  IL: {
    he: 'https://israelpost.co.il/#?itemcode=', // Hebrew
    en: 'https://israelpost.co.il/en/itemtrace?lang=EN&itemcode=', // English
  },
  IT: 'https://www.poste.it/cerca/index.html#/risultati-spedizioni/',
  JP: {
    en: 'https://trackings.post.japanpost.jp/services/srv/search/?requestNo1=',
    ja: 'https://trackings.post.japanpost.jp/services/srv/sequenceNoSearch?requestNo=&count=100&sequenceNoSearch.x=57&sequenceNoSearch.y=15&locale=ja',
  },
  // Macau: language-specific tracking links
  MO: {
    en: 'https://www.ctt.gov.mo/MacauPost/Contents/MailTrack.aspx?lang=en',
    zh: 'https://www.ctt.gov.mo/MacauPost/Contents/MailTrack.aspx?lang=zh', // Traditional Chinese
    zh_hk: 'https://www.ctt.gov.mo/MacauPost/Contents/MailTrack.aspx?lang=zh', // Alias for Traditional Chinese
    zh_cn: 'https://www.ctt.gov.mo/MacauPost/Contents/MailTrack.aspx?lang=zh_cn', // Simplified Chinese (if available, else fallback to zh)
    pt: 'https://www.ctt.gov.mo/MacauPost/Contents/MailTrack.aspx?lang=pt',
  },
  MY: 'http://www.pos.com.my/postaltrack.aspx?code=',
  NO: 'https://sporing.posten.no/sporing/',
  NL: 'https://jouw.postnl.nl/track-and-trace/',
  NZ: 'https://www.nzpost.co.nz/tools/tracking?trackid=',
  PH: 'https://tracking.phlpost.gov.ph/?trackcode=',
  PL: 'https://emonitoring.poczta-polska.pl/?numer=',
  PT: 'https://appserver.ctt.pt/CustomerArea/PublicArea_Detail?ObjectCodeInput=',
  RU: 'https://www.pochta.ru/tracking#',
  KR: 'https://service.epost.go.kr/trace.RetrieveEmsRigiTraceList.comm?POST_CODE=',
  PL: 'https://emonitoring.poczta-polska.pl/?numer=',
  PT: 'https://appserver.ctt.pt/CustomerArea/PublicArea_Detail?ObjectCodeInput=',
  KR: 'https://service.epost.go.kr/trace.RetrieveEmsRigiTraceList.comm?POST_CODE=',
  ES: 'https://www.correos.es/es/es/herramientas/localizador/envios/detalle?tracking-number=',
  SE: 'https://www.postnord.se/en/our-tools/track-and-trace?shipmentId=',
  CH: 'https://service.post.ch/ekp-web/ui/entry/search/',
  TW: 'https://postserv.post.gov.tw/pstmail/main_mail.jsp?MAILNO=',
  TH: 'http://track.thailandpost.com/tracking/default.aspx?lang=en&trackno=',
  GB: 'https://www.royalmail.com/{lang}track-your-item#/tracking-results/',
  US: 'https://tools.usps.com/go/TrackConfirmAction?tLabels=',
  VN: 'https://vnpost.vn/ca-nhan/chuyen-phat/chuyen-phat-trong-nuoc?code=',
  PX: 'https://www.speedpost.com.sg/track-and-trace?tnt=',
};

/// const Popup = ({ title, message, onClose }) => {
///  return (
///    <div className="popup-overlay" onClick={onClose}>
///      {/* stopPropagation prevents closing when clicking inside the white box */}
///      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
///         <h2>{title}</h2>
///         {/* Render message with line breaks support */}
///         <p style={{ whiteSpace: "pre-line" }}>{message}</p>
///         <button 
///           onClick={onClose} 
///           className="btn-primary"
///           style={{ marginTop: "20px", width: "auto", minWidth: "120px" }}
///         >
///           Close
///         </button>
///       </div>
///     </div>
///   );
/// };

function formatPostedDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date)) return dateString; 
  const day = String(date.getDate()).padStart(2, "0");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

async function fetchOrderInfo(query) {
  try {
    const response = await fetch('/api/orders', { cache: 'no-store' });
    if (!response.ok) {
      throw new Error('Order source unavailable');
    }

    const data = await response.json();
    const bodyRows = Array.isArray(data?.orders)
      ? data.orders.map((r) => [
          r.orderNumber,
          r.email,
          r.dialingCode,
          r.phone,
          r.trackingNumber,
          r.destinationCountry,
          r.postcode,
          r.status,
          r.postedDate,
          r.shippedVia,
        ])
      : [];

    if (!query) {
      return bodyRows.map((r) => ({
        orderNumber: r[0],
        email: r[1],
        dialingCode: r[2],
        phone: r[3],
        trackingNumber: r[4],
        destinationCountry: r[5],
        postcode: r[6],
        status: r[7],
        postedDate: formatPostedDate(r[8]),
        shippedVia: r[9] || ""
      }));
    }

    const cleanPhone = (str) => (str || "").replace(/[\s\-()[\]+]/g, "");
    const cleanOrder = (str) => (str || "").toLowerCase().trim();

    const results = bodyRows.filter((row) => {
      const [orderNumberRaw, emailRaw, dialingCodeRaw, phoneRaw, trackingNumberRaw] = row;
      const orderNumber = cleanOrder(orderNumberRaw);
      const email = (emailRaw || "").toLowerCase();
      const dialingCode = cleanPhone(dialingCodeRaw);
      const phone = cleanPhone(phoneRaw);
      const trackingNumber = cleanOrder(trackingNumberRaw);

      if (query.includes("@")) {
        return email === query.toLowerCase();
      }

      const fullPhone = dialingCode + phone;

      return (
        orderNumber === cleanOrder(query) ||
        trackingNumber === cleanOrder(query) ||
        phone === cleanPhone(query) ||      
        fullPhone === cleanPhone(query)   
      );
    });

    return results.map((r) => ({
      orderNumber: r[0],
      email: r[1],
      dialingCode: r[2],
      phone: r[3],
      trackingNumber: r[4],
      destinationCountry: r[5],
      postcode: r[6],
      status: r[7],
      postedDate: formatPostedDate(r[8]),
      shippedVia: r[9] || ""
    }));
  } catch (err) {
    console.error("Error fetching Google Sheet:", err);
    alert('Order database is temporarily unavailable. Please try again in a moment.');
    return [];
  }
}


// Separate component for Ads
const AdBlock = () => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      // ignore
    }
  }, []);

  return (
    <>
      <div className="my-4">
        <ins className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client="ca-pub-4194808111663749"
          data-ad-slot="5003292159"
          data-ad-format="auto">
        </ins>
      </div>
      <div className="my-4">
        <ins className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client="ca-pub-4194808111663749"
          data-ad-slot="8978895256"
          data-ad-format="fluid"
          data-ad-layout-key="+30+qw+o-1s+9a">
        </ins>
      </div>
      <div className="my-4 text-center">
        <ins className="adsbygoogle"
          style={{ display: "block", textAlign: "center" }}
          data-ad-client="ca-pub-4194808111663749"
          data-ad-slot="6134983374"
          data-ad-format="fluid"
          data-ad-layout="in-article">
        </ins>
      </div>
    </>
  );
};

// Helper function to get epac service name by country code using translations
const getEpacName = (countryCode, t) => {
  if (!countryCode || !t) return "";
  const epacKey = `epac${countryCode}`;
  return t(epacKey) || "";
};

// Postal operator display names by destination country code
const postalOperatorNames = {
  US: "USPS",
  GB: "Royal Mail",
  CA: "Canada Post",
  NZ: "NZ Post",
  DE: "Deutsche Post",
  FR: "La Poste",
  CH: "Swiss Post",
  SE: "PostNord",
  FI: "Posti",
  NL: "PostNL",
  BE: "bpost",
  AT: "Österreichische Post",
  HK: "Hongkong Post",
  IN: "India Post",
  ID: "Pos Indonesia",
  IE: "An Post",
  IL: "Israel Post",
  IT: "Poste Italiane",
  JP: "Japan Post",
  MO: "Macau Post",
  MY: "Pos Malaysia",
  NO: "Posten Norge",
  PH: "PHLPost",
  PL: "Poczta Polska",
  PT: "CTT Portugal Post",
  KR: "Korea Post",
  ES: "Correos",
  TW: "Chunghwa Post",
  TH: "Thailand Post",
  VN: "VNPost",
  BN: "PosBru",
};

const EMBED_SUPPORTED_DESTINATIONS = new Set([
  'CZ', 'ID', 'JP', 'KR', 'PL', 'SG',
]);

function App() {
  const { t, tStrict, language: currentLanguage } = useLanguage();

  // Helper function to get translated country name
  const getCountryName = (countryCode) => {
    if (!countryCode) return "";
    const translationKey = `country${countryCode}`;
    const translated = t(translationKey);
    // Remove flag emoji (regional indicator pairs) and any following space
    return translated.replace(/[\u{1F1E6}-\u{1F1FF}]+\s*/gu, '').trim();
  };

  const [trackingNumber, setTrackingNumber] = useState("");
  const [destinationCountry, setDestinationCountry] = useState("");
  const [postcode, setPostcode] = useState("");
  const [trackingUrl, setTrackingUrl] = useState("");
  const [additionalMessage, setAdditionalMessage] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]); 
  const [status, setStatus] = useState("");
  const [postedDate, setPostedDate] = useState("");
 ///  const popupSequence = ["popup1", "popup2", "popup3"];
///  const [activePopup, setActivePopup] = useState(popupSequence[0]); 
  const [shippedVia, setShippedVia] = useState("");
  
  // Use epacKnownAs in JSX now
  const [epacKnownAs, setEpacKnownAs] = useState("");
  const [isTrackParcelMode] = useState(false); 
  const [activeEmbed, setActiveEmbed] = useState('dest');
  
  const searchParams = useSearchParams();
  const [autoSubmit, setAutoSubmit] = useState(false);
  const router = useRouter();
  
  // Track if we're currently loading from URL params to prevent router.push loop
  const [isLoadingFromUrl, setIsLoadingFromUrl] = useState(false);
  
  // Geolocation and access control state
  const [userCountry, setUserCountry] = useState(null);
  const [accessBlocked, setAccessBlocked] = useState(false);
  const [blockMessage, setBlockMessage] = useState("");
  const [allowedDestinations, setAllowedDestinations] = useState(null);
  
///  const handleClosePopup = () => {
///     const currentIndex = popupSequence.indexOf(activePopup);
///     const nextIndex = currentIndex + 1;
///     if (nextIndex < popupSequence.length) {
///       setActivePopup(popupSequence[nextIndex]); 
///     } else {
///       setActivePopup(null); 
///     }
///   };

  const setCountrySpecificMessage = (selectedCountry) => {
    let message = "";
    
    // Check if Russia is selected and show suspension notice
    if (selectedCountry === 'RU') {
      const russiaNotice = t('russiaServiceSuspended');
      if (russiaNotice && russiaNotice !== 'russiaServiceSuspended') {
        message = russiaNotice;
      }
    } else {
      // Regular country-specific messages
      const countryMsgKey = `countryMsg${selectedCountry}`;

      // Prefer only current-language translation; avoid English fallback unless language is 'en'
      const localized = typeof tStrict === 'function' ? tStrict(countryMsgKey) : undefined;
      if (localized) {
        message = localized;
      } else if (currentLanguage === 'en') {
        // Show English only when current language is English
        const fallback = t(countryMsgKey);
        if (fallback && fallback !== countryMsgKey) {
          message = fallback;
        }
      }
    }

    setAdditionalMessage(message);
  };

  const handleSearchOrder = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      alert(t('pleaseEnter'));
      return;
    }

    const results = await fetchOrderInfo(searchQuery); 
    setSearchResults(results); 

    if (results.length === 0) {
      alert(t('noOrdersFound'));
    }
  };


  const handleCountryChange = (e) => {
    const selectedCountry = e.target.value;
    setDestinationCountry(selectedCountry);
    setTrackingNumber("");
    setPostcode("");
    setTrackingUrl("");
    setAdditionalMessage("");
    setOrderNumber("");
    setFromDate("");
    setToDate("");
    setCountrySpecificMessage(selectedCountry);
  };

  // Recompute country-specific important info when language or destination changes
  useEffect(() => {
    if (destinationCountry) {
      setCountrySpecificMessage(destinationCountry);
    }
  }, [currentLanguage, destinationCountry, tStrict, setCountrySpecificMessage]);

  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.log("AdSense error:", e);
    }
  }, []);

  useEffect(() => {
    if (searchResults.length > 0) {
      const firstResult = searchResults[0];
      if (firstResult.shippedVia === "SingPost ePAC (aka SpeedPost Saver International)") {
        setEpacKnownAs(getEpacName(firstResult.destinationCountry, t) || "");
      } else {
        setEpacKnownAs("");
      }
    }
  }, [searchResults, currentLanguage, t]);

  useEffect(() => {
    if (!isTrackParcelMode) {
      setEpacKnownAs("");    
      return;
    }

    if (!destinationCountry) {
      setEpacKnownAs("");
      return;
    }

    const knownName = getEpacName(destinationCountry, t) || "";
    setEpacKnownAs(knownName);
  }, [destinationCountry, isTrackParcelMode, currentLanguage, t]);

  useEffect(() => {
    if (!searchParams) return;
    
    const t = searchParams.get("trackingNumber");
    const c = searchParams.get("destinationCountry");
    const p = searchParams.get("postcode");
    const o = searchParams.get("orderNumber") || searchParams.get("order_number");
    const f = searchParams.get("fromDate");
    const to = searchParams.get("toDate");

    if (t && c && p && o) {
      setTrackingNumber(t);
      setDestinationCountry(c);
      setPostcode(p);
      setOrderNumber(o);
      setIsLoadingFromUrl(true);
      setAutoSubmit(true);
    }

    if (t && /^PX\d{9}SG$/.test(t)) {
      if (f) setFromDate(f);
      if (to) setToDate(to);
    }
  }, [searchParams]);

  useEffect(() => {
    if (autoSubmit) {
      handleSubmit({ preventDefault: () => {} });
      setAutoSubmit(false);
      setIsLoadingFromUrl(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoSubmit]); 

  // Geolocation and access control useEffect
  useEffect(() => {
    const checkLocationAndAccess = async () => {
      try {
        const geoData = await detectLanguageFromIPWithRestrictions();
        
        if (geoData.error) {
          if (geoData.blocked) {
            setAccessBlocked(true);
            setBlockMessage(geoData.message || "Access restricted from your location.");
            return;
          }
          // Continue with default access if just detection failed
          return;
        }

        setUserCountry(geoData.countryCode);
        
        // List of all shipped destination countries
        const shippedDestinations = ['AU', 'AT', 'BE', 'BN', 'CA', 'CN', 'CZ', 'FI', 'FR', 'DE', 'HK', 'IN', 'ID', 'IE', 'IL', 'IT', 'JP', 'MO', 'MY', 'NL', 'NZ', 'NO', 'PH', 'PL', 'PT', 'KR', 'SG', 'ES', 'SE', 'CH', 'TW', 'TH', 'GB', 'US', 'VN'];
        
        // Special handling for China access restrictions
        if (geoData.countryCode === 'CN') {
          // Allow VPN if the actual/estimated country is a valid shipped destination
          if (geoData.isVPNDetected) {
            const estimatedCountry = geoData.estimatedActualCountry || geoData.countryCode;
            if (!shippedDestinations.includes(estimatedCountry)) {
              setAccessBlocked(true);
              setBlockMessage("VPN usage detected. Please disable VPN to access this service.");
              return;
            }
          }
          setAllowedDestinations(geoData.accessRestrictions?.allowedDestinations || []);
        }
        
        // For non-China users with VPN: Allow access if detected country is a shipped destination
        if (geoData.countryCode !== 'CN' && geoData.isVPNDetected && !shippedDestinations.includes(geoData.countryCode)) {
          // VPN detected but not to a shipped destination - could be suspicious
          console.warn('VPN detected to non-shipped destination:', geoData.countryCode);
        }
        
        console.log(`User location: ${geoData.countryCode}, VPN detected: ${geoData.isVPNDetected}`);
      } catch (error) {
        console.error('Location detection failed:', error);
        // Continue with default access on error
      }
    };

    checkLocationAndAccess();
  }, []);

  const formatLabel = useCallback((key) => {
    const label = t(key) || key;
    return /[:：]\s*$/.test(label) ? label : `${label}:`;
  }, [t]);

  const formatLabelNoExample = useCallback((key) => {
    const raw = t(key) || key;
    // Remove examples in both English () and Japanese （） parentheses
    const base = raw.replace(/\s*[\(（].*?[\)）]\s*$/, '').trim();
    return /[:：]\s*$/.test(base) ? base : `${base}:`;
  }, [t]);

  // Translate status values
  const translateStatus = useCallback((statusText) => {
    if (!statusText) return statusText;
    const statusMap = {
      'In Preparation': 'statusInPreparation',
      'In Transit': 'statusInTransit',
      'Delivered': 'statusDelivered',
      'Out for Delivery': 'statusOutForDelivery',
      'Arrived': 'statusArrived',
      'Processing': 'statusProcessing',
      'Dispatched': 'statusDispatched',
      'Returned': 'statusReturned',
      'Failed': 'statusFailed',
      'Cancelled': 'statusCancelled',
      'Held by Customs': 'statusHeldByCustoms',
      'Awaiting Collection': 'statusAwaitingCollection'
    };
    const key = statusMap[statusText];
    return key ? t(key) : statusText;
  }, [t]);

  // Format date according to language
  const formatDate = useCallback((dateStr) => {
    if (!dateStr) return dateStr;
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      const localeByLanguage = {
        en: 'en-US',
        cs: 'cs-CZ',
        nl: 'nl-NL',
        fi: 'fi-FI',
        fr: 'fr-FR',
        de: 'de-DE',
        ru: 'ru-RU',
        hi: 'hi-IN',
        he: 'he-IL',
        id: 'id-ID',
        ms: 'ms-MY',
        ga: 'ga-IE',
        it: 'it-IT',
        ja: 'ja-JP',
        ko: 'ko-KR',
        no: 'nb-NO',
        pl: 'pl-PL',
        pt: 'pt-PT',
        'zh-hant': 'zh-Hant-TW',
        zh_hk: 'zh-Hant-HK',
        zh: 'zh-CN',
        es: 'es-ES',
        sv: 'sv-SE',
        tl: 'fil-PH',
        th: 'th-TH',
        vi: 'vi-VN',
        cy: 'cy-GB',
      };

      const isTaiwanDualYearFormat =
        userCountry === 'TW' && (currentLanguage === 'zh-hant' || currentLanguage === 'en');

      if (isTaiwanDualYearFormat) {
        const gregorianDate = date.toLocaleDateString('zh-Hant-TW', {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
        });
        const rocYear = date.getFullYear() - 1911;
        return `${gregorianDate}（民國${rocYear}年${date.getMonth() + 1}月${date.getDate()}日）`;
      }

      const resolvedLocale = localeByLanguage[currentLanguage] || (currentLanguage === 'en' ? 'en-US' : currentLanguage);
      return date.toLocaleDateString(resolvedLocale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (error) {
      return dateStr;
    }
  }, [currentLanguage, userCountry]);

  // Translate "aka" in service names
  const translateServiceName = useCallback((serviceName) => {
    if (!serviceName) return serviceName;
    if (serviceName.includes('aka')) {
      const akaTranslation = t('aka') || 'aka';
      return serviceName.replace(/\(aka\s/i, `(${akaTranslation} `);
    }
    return serviceName;
  }, [t]);

  const scrollToEmbed = useCallback(() => {
    const el = document.querySelector('.tracking-embed');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);


  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setTrackingUrl(""); 
    setStatus(""); 

    if (!trackingNumber || !destinationCountry || !orderNumber || !postcode) {
      console.warn("Please fill in all required fields.");
      alert(t('fillAllFields'));
      return;
    }

    // Check access restrictions for China users
    if (userCountry === 'CN' && allowedDestinations && !isAccessAllowedFromChina(destinationCountry)) {
      alert(t('destinationNotAllowed'));
      return;
    }

    // Only update URL after validation passes (but skip if we're loading from URL to prevent infinite loop)
    if (!isLoadingFromUrl) {
      const params = new URLSearchParams({
        trackingNumber,
        destinationCountry,
        postcode,
        orderNumber
      });
      
      if (/^PX\d{9}SG$/.test(trackingNumber)) {
        params.append("fromDate", fromDate);
        params.append("toDate", toDate);
      }

      const nextUrl = `/track-your-item?${params.toString()}`;
      const currentUrl = `${window.location.pathname}${window.location.search}`;
      if (currentUrl !== nextUrl) {
        router.push(nextUrl);
      }
    }

    const results = await fetchOrderInfo(""); 

    const normalizePostal = (value) => (value || '').toString().trim().toUpperCase();
    const normalizeUSZipDigits = (value) => (value || '').toString().replace(/\D/g, '');
    const isPostcodeMatch = (orderPostcodeValue, inputPostcodeValue, countryCode) => {
      if (!orderPostcodeValue || !inputPostcodeValue) return false;

      const orderPostal = normalizePostal(orderPostcodeValue);
      const inputPostal = normalizePostal(inputPostcodeValue);

      // USA: allow matching 5-digit ZIP with ZIP+4 from either source.
      if (countryCode === 'US') {
        const orderDigits = normalizeUSZipDigits(orderPostal);
        const inputDigits = normalizeUSZipDigits(inputPostal);
        if (orderDigits.length < 5 || inputDigits.length < 5) return false;
        return orderDigits.slice(0, 5) === inputDigits.slice(0, 5);
      }

      return orderPostal === inputPostal;
    };

    const matchedOrder = results.find(
      (order) =>
        order.trackingNumber && trackingNumber &&
        order.trackingNumber.toUpperCase() === trackingNumber.toUpperCase() &&
        order.destinationCountry === destinationCountry &&
        order.orderNumber && orderNumber &&
        order.orderNumber.toUpperCase() === orderNumber.toUpperCase() &&
        isPostcodeMatch(order.postcode, postcode, destinationCountry)
    );

    if (!matchedOrder) {
      console.warn("No order found matching all fields.");
      alert(t('noOrderMatchingFields'));
      return;
    }

    setStatus(matchedOrder.status);
    setTrackingNumber(matchedOrder.trackingNumber);
    setDestinationCountry(matchedOrder.destinationCountry);
    setPostcode(matchedOrder.postcode);
    setOrderNumber(matchedOrder.orderNumber);
    setPostedDate(matchedOrder.postedDate);
    setShippedVia(matchedOrder.shippedVia);

     setEpacKnownAs(
      matchedOrder.shippedVia === "SingPost ePAC (aka SpeedPost Saver International)"
        ? getEpacName(matchedOrder.destinationCountry, t) || ""
        : ""
    );

    setCountrySpecificMessage(matchedOrder.destinationCountry);

    
    const countryNameDisplay = getCountryName(destinationCountry) || t('thisCountry') || "this country";
    let url = ""; 

    if (destinationCountry === "SG") {
      const ppRegex = /^PP\d{9}SG$/;
      const spnddRegex = /^SPNDD\d{10}$/;

      if (!(ppRegex.test(trackingNumber) || spnddRegex.test(trackingNumber))) {
        alert(t('invalidSingPostFormat'));
        return;
      }
      url = postalTrackingUrls.SG + encodeURIComponent(trackingNumber);
    }
    else {
      if (/^PX\d{9}SG$/.test(trackingNumber)) {
        url = postalTrackingUrls.PX + trackingNumber;
      } else if (/^(LG|LP|LT)\d{9}SG$/.test(trackingNumber)) {
        // Austria: use language-specific tracking URL
        if (destinationCountry === 'AT') {
          if (currentLanguage === 'en') {
            url = `https://www.post.at/en/s/track-and-trace-search?snr=${trackingNumber}`;
          } else {
            url = `https://www.post.at/s/sendungssuche?snr=${trackingNumber}`;
          }
        } else if (destinationCountry === 'CZ') {
          // Czechia: use language-specific tracking URL
          if (currentLanguage === 'en') {
            url = `https://www.postaonline.cz/en/trackandtrace/-/zasilka/cislo?parcelNumbers=${trackingNumber}`;
          } else {
            url = `https://www.postaonline.cz/trackandtrace-/zasilka/cislo?parcelNumbers=${trackingNumber}`;
          }
        } else if (destinationCountry === 'FI') {
          // Finland: use language-specific fallback link, never embed
          if (currentLanguage === 'fi') {
            url = `https://www.posti.fi/seuranta/${trackingNumber}`;
          } else if (currentLanguage === 'sv') {
            url = `https://www.posti.fi/sv/uppfoljning/${trackingNumber}`;
          } else {
            url = `https://www.posti.fi/en/tracking/${trackingNumber}`;
          }
        } else if (destinationCountry === 'JP') {
            // Use language-specific Japan Post URL and append tracking number correctly
            const normalizedLang = (currentLanguage || '').split('-')[0];
            if (normalizedLang === 'ja') {
              // Japanese: https://trackings.post.japanpost.jp/services/srv/sequenceNoSearch?requestNo=LT123456789SG&count=100&sequenceNoSearch.x=54&sequenceNoSearch.y=12&locale=ja
              url = `https://trackings.post.japanpost.jp/services/srv/sequenceNoSearch?requestNo=${encodeURIComponent(trackingNumber)}&count=100&sequenceNoSearch.x=54&sequenceNoSearch.y=12&locale=ja`;
            } else {
              // English: https://trackings.post.japanpost.jp/services/srv/search/direct?reqCodeNo1=LT123456789SG&searchKind=S002&locale=en
              url = `https://trackings.post.japanpost.jp/services/srv/search/direct?reqCodeNo1=${encodeURIComponent(trackingNumber)}&searchKind=S002&locale=en`;
            }
        } else {
          // Special handling for Hong Kong, Macau, Indonesia, and Ireland: choose language-specific link
          if (["HK", "MO", "ID", "IE", "IL"].includes(destinationCountry)) {
            let langKey;
            if (destinationCountry === "ID") {
              langKey = currentLanguage === "id" ? "id" : "en";
            } else if (destinationCountry === "MO") {
              langKey =
                currentLanguage === "zh" || currentLanguage === "zh-hk" ? "zh" :
                currentLanguage === "zh-cn" ? "zh_cn" :
                currentLanguage === "pt" ? "pt" :
                "en";
            } else if (destinationCountry === "HK") {
              langKey =
                currentLanguage === "zh" || currentLanguage === "zh-hk" ? "zh" :
                currentLanguage === "zh-cn" ? "zh_cn" :
                "en";
            } else if (destinationCountry === "IE") {
              langKey = currentLanguage === "ga" ? "ga" : "en";
            } else if (destinationCountry === "IL") {
              langKey = currentLanguage === "he" ? "he" : "en";
            }
            const countryLinks = postalTrackingUrls[destinationCountry];
            // Israel: always append tracking number for both languages
            if (destinationCountry === "IL") {
              url = (countryLinks[langKey] || countryLinks.en) + trackingNumber;
              setTrackingUrl(url);
            } else if (destinationCountry === "IE") {
              url = (countryLinks[langKey] || countryLinks.en);
              setTrackingUrl(url);
            } else {
              url = (countryLinks[langKey] || countryLinks.en) + trackingNumber;
            }
          } else {
            // Don't encode alphanumeric tracking numbers to avoid unnecessary % in URLs
            url = postalTrackingUrls[destinationCountry] + trackingNumber;
          }
        }
        // Canada Post: replace {lang} with current language (en or fr)
        if (destinationCountry === 'CA') {
          const canadaLang = currentLanguage === 'fr' ? 'fr' : 'en';
          url = url.replace('{lang}', canadaLang);
        }
        // Germany DHL: replace {lang} and {path} based on current language
        if (destinationCountry === 'DE') {
          const deLang = currentLanguage === 'de' ? 'de-de' : 'de-en';
          const dePath = currentLanguage === 'de' ? 'sendungsverfolgung' : 'tracking';
          url = url.replace('{lang}', deLang).replace('{path}', dePath) + '&submit=1';
        }
        // Royal Mail GB: replace {lang} (cy/ for Welsh, empty for English)
        if (destinationCountry === 'GB') {
          const gbLang = currentLanguage === 'cy' ? 'cy/' : '';
          url = url.replace('{lang}', gbLang);
        }
      } else if (/^EZ\d{9}SG$/i.test(trackingNumber)) {
        url = postalTrackingUrls[destinationCountry] + trackingNumber;
      } else if ( /^\d{10}$/.test(trackingNumber)) {
        url = postalTrackingUrls.DHL + trackingNumber;
      } else {
        alert(t('trackingValidationSG'));
        return;
      }
    }

    if (["NL", "BE"].includes(destinationCountry)) {
      if (destinationCountry === "NL") {
        if (!postcode) {
          console.warn("Postcode is required.");
          alert(t('postcodeRequired'));
          return;
        }
        url = `https://jouw.postnl.nl/track-and-trace/${encodeURIComponent(trackingNumber)}-NL-${encodeURIComponent(postcode)}`;
      }
      if (destinationCountry === "BE") {
        if (!postcode) {
          console.warn("Postcode is required.");
          alert(t('postcodeRequired'));
          return;
        }
        // Map app language to bpost supported languages
        let bpostLang = 'fr';
        if (currentLanguage === 'en') bpostLang = 'en';
        else if (currentLanguage === 'de') bpostLang = 'de';
        else if (currentLanguage === 'nl') bpostLang = 'nl';
        url = `https://track.bpost.cloud/btr/web/#/home?lang=${bpostLang}&itemCode=${encodeURIComponent(trackingNumber)}&postalCode=${encodeURIComponent(postcode)}`;
      }
      if (destinationCountry === "BN") {
        url = "https://bn.postglobal.online/vpo/tracking";
        // No autofill, user must paste tracking number manually
      }
    }

  const usZipRegex = /^\d{5}(-\d{4})?$/;

    if (destinationCountry === "US") {
      if (!usZipRegex.test(postcode)) {
        alert(t('invalidUSZip'));
        return;
      }
    }

    if (!url) {
      console.warn("Failed to generate tracking URL.");
      alert(t('failedGenerateURL'));
      return;
    }

    setTrackingUrl(url);
  }, [trackingNumber, destinationCountry, postcode, orderNumber, fromDate, toDate, router, setCountrySpecificMessage, userCountry, allowedDestinations, t, isLoadingFromUrl]); 
  
  const operatorName = postalOperatorNames[destinationCountry] || (getCountryName(destinationCountry) ? `${getCountryName(destinationCountry)} Post` : "");
  const canEmbedDestination = EMBED_SUPPORTED_DESTINATIONS.has(destinationCountry);

  return (
    <>
      <Navigation />
      
      <div className="container mt-5">

        {/* Access Block UI for restricted locations */}
        {accessBlocked && (
          <div className="alert alert-danger text-center mb-4">
            <h3>🚫 {t('accessRestricted')}</h3>
            <p>{blockMessage.includes('VPN') ? t('vpnDetectedMessage') : blockMessage}</p>
            <p>{t('contactSupportError')}</p>
          </div>
        )}

        <AdBlock />

        <div className="text-center">
            {/* LOGO REMOVED FROM HERE */}
            
            <h1 className="mt-4">{t('parcelTracking')}</h1>
        </div>

    {/* Service Announcement Section */}
    <ServiceAnnouncement allowedDestinations={allowedDestinations} />

    {/* Wrapped Form in .modern-form-container */}
    <div className="modern-form-container">
      {accessBlocked && (
        <div className="alert alert-warning mb-3">
          <strong>⚠️ Form disabled due to access restrictions</strong>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="trackingNumber" className="form-label">
            {t('trackingNumber')}
          </label>
          <input
            type="text"
            id="trackingNumber"
            className="form-control"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            required
            placeholder={t('trackingNumberExample') || "e.g. LG123456789SG"}
            disabled={accessBlocked}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="destinationCountry" className="form-label">
            {t('destinationCountry')}
          </label>
          <select
            id="destinationCountry"
            className="form-select"
            value={destinationCountry}
            onChange={handleCountryChange}
            required
            disabled={accessBlocked}
          >
            <option value="" disabled>{t('selectCourier')}</option>
            
            {/* Singapore - always show unless restricted */}
            {(!allowedDestinations || allowedDestinations.includes('SG')) && (
              <optgroup label={t('singaporeCouriers')}>
                <option value="SG">{t('optionSingPost')}</option>
              </optgroup>
            )}
            
            {/* Top Countries - filter if restrictions apply */}
            {(() => {
              const topCountries = ['AU', 'CA', 'DE', 'GB', 'US'];
              const filteredTop = allowedDestinations 
                ? topCountries.filter(c => allowedDestinations.includes(c))
                : topCountries;
              
              return filteredTop.length > 0 && (
                <optgroup label={t('topCountries')}>
                  {filteredTop.map(code => (
                    <option key={code} value={code}>{t(`country${code}`)}</option>
                  ))}
                </optgroup>
              );
            })()}
            
            {/* Other Countries - filter if restrictions apply */}
            {(() => {
              const otherCountries = ['AT', 'BE', 'BN', 'CN', 'CZ', 'FI', 'FR', 'HK', 'IN', 'ID', 'IE', 'IL', 'IT', 'JP', 'MO', 'MY', 'NL', 'NZ', 'NO', 'PH', 'PL', 'PT', 'RU', 'KR', 'ES', 'SE', 'CH', 'TW', 'TH', 'VN'];
              const filteredOther = allowedDestinations 
                ? otherCountries.filter(c => allowedDestinations.includes(c))
                : otherCountries;
              
              return filteredOther.length > 0 && (
                <optgroup label={t('otherCountries')}>
                  {filteredOther.map(code => (
                    <option key={code} value={code}>{t(`country${code}`)}</option>
                  ))}
                </optgroup>
              );
            })()}
          </select>
          </div>

        <div className="mb-4">
          <label className="form-label">{t('postcode')}</label>
          <input
            type="text"
            className="form-control"
            value={postcode}
            onChange={(e) => setPostcode(e.target.value)}
            required
            pattern={destinationCountry === 'US' ? '^\\d{5}(-\\d{4})?$' : undefined}
            inputMode={destinationCountry === 'US' ? 'numeric' : undefined}
            maxLength={destinationCountry === 'US' ? 10 : undefined}
            title={destinationCountry === 'US' ? 'Use ZIP format 12345 or 12345-6789' : undefined}
            placeholder={t('enterDestinationPostcode') || "Enter destination postcode"}
            disabled={accessBlocked}
          />
        </div>

        <div className="mb-4">
          <label className="form-label">{t('orderNumber')}</label>
          <input 
            type="text" 
            className="form-control" 
            value={orderNumber} 
            onChange={(e) => setOrderNumber(e.target.value)} 
            required
            placeholder="RTNX1234567890"
            disabled={accessBlocked}
          />
        </div>

        {/* Show date range only for SpeedPost Express (PX) */}
        {/^PX\d{9}SG$/.test(trackingNumber) && (
        <>
          <div className="mb-4">
            <label htmlFor="fromDate" className="form-label">
              {t('fromDate')}
            </label>
            <input
              type="date"
              id="fromDate"
              className="form-control"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="toDate" className="form-label">
              {t('toDate')}
            </label>
            <input
              type="date"
              id="toDate"
              className="form-control"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              required
            />
          </div>
        </>
      )}

        <button type="submit" className="btn-primary" disabled={accessBlocked}>
          {t('trackParcel')}
        </button>
      </form>
      </div>
      {/* End .modern-form-container */}

        {/* 1. NOTE Section (Blue) */}
        <div className="tracking-alert-card alert-info">
          <h4>📌 <strong>{t('note')}</strong></h4>
          <p>
            <strong>{t('trackingCaseSensitive') || "TRACKING LETTERS ARE CASE SENSITIVE AND MUST BE IN CAPITAL LETTERS."}</strong><br/>
            {t('usaPostcodeNote') || 'For countries without postcodes, such as Hong Kong & Macau, please put 999077 (Hong Kong) or 999078 (Macau).'}
          </p>
          <p>
            <strong>{t('epacDeliveryNote') || 'Please KINDLY note that all ePAC items sent to the destination should all be delivered to your mailbox, doorstep, parcel locker or left in a safe place!'}</strong> {t('collectAtPostOffice') || 'However, if your country does not have mailbox as a standard available, you will have to collect it at the post office.'}<br />
            {t('countriesNoMailbox') || 'Countries known to have mailbox/letterbox delivery unavailable: Brunei, China, India, Israel, Macau SAR China, Philippines, Poland and Vietnam.'}
          </p>
        </div>

        {/* 2. DISCLAIMER Section (Yellow) */}
        <div className="tracking-alert-card alert-warning">
          <h4>⚠️ <strong>{t('disclaimer')}</strong></h4>
          <p>
            <strong>{t('rhythmNexusNotResponsible') || 'Rhythm Nexus is NOT RESPONSIBLE for handling the deliveries as it is out of our control and we would kindly prefer for you to track your item status instead.'}</strong><br/>
            {t('issuesAfterDelivery') || 'Any issues with your delivery after 30/45 days (14 days for SpeedPost Express) or status show delivered but you didn\'t receive, please contact us'} <a href="https://docs.google.com/forms/d/e/1FAIpQLSdH1xkzlxYTR-DOZbybKnF2efa2SienCBL78jpflcA_BZAIAA/viewform?usp=preview">{t('here')}</a>.
          </p>
          <p>
            <strong>{t('didNotReceiveEmail')}</strong>
          </p>
          <hr />
          <p>
            {t('reviewShippingRates') || 'Review our current shipping rates'} <a href="https://docs.google.com/spreadsheets/d/1Q08_ePn3d0IEp8FU6hShyZ7ayEFbeh1k3SE1wX_T4TY/edit?usp=sharing">{t('here')}</a><br />
            {t('contactUsForm') || 'Please contact us through this'}{' '}
            {['CN', 'RU'].includes(userCountry) ? (
              <a href="mailto:rhythmnexusco@gmail.com">{t('form') || 'form'}</a>
            ) : (
              <a href="https://docs.google.com/forms/d/e/1FAIpQLSfMZDY_D9gO2JPLYAnIeEqyyYeZI2VXDTnR12L4ihbz5hYwIA/viewform">{t('form') || 'form'}</a>
            )}{' '}
            {t('forEnquiries') || 'for any enquiries you have regarding your order.'}
          </p>
        </div>

      {additionalMessage && (
        <div className="tracking-info-card">
          <h2>{t('importantInformation')}</h2>
          {/* Render message with link detection */}
          <p style={{ whiteSpace: "pre-line" }}>
            {additionalMessage.split("\n").map((line, index) => (
              <React.Fragment key={index}>
                {line.split(" ").map((word, wordIndex) => {
                  const isUrl = word.startsWith("http");
                  return isUrl ? (
                    <a key={wordIndex} href={word} target="_blank" rel="noopener noreferrer" style={{ color: "blue" }}>
                      {word}{" "}
                    </a>
                  ) : (
                    <span key={wordIndex}>{word} </span>
                  );
                })}
                <br />
              </React.Fragment>
            ))}
          </p>
        </div>
      )}

      {trackingUrl && (
        <div className="tracking-results-card">
          <h3>{t('trackingResult')}</h3>
          <div className="tracking-details">
            <p><strong>{formatLabel('trackingNumber')}</strong> {trackingNumber}</p>
            {postcode && <p><strong>{formatLabel('postcode')}</strong> {postcode}</p>}
            <p><strong>{formatLabel('destinationCountry')}</strong> {getCountryName(destinationCountry)}</p>
            <p><strong>{formatLabelNoExample('orderNumber')}</strong> {orderNumber}</p>
            <p><strong>{formatLabel('postedDate')}</strong> {formatDate(postedDate)}</p>
            <p><strong>{formatLabel('status')}</strong> {translateStatus(status)}</p>
            <p><strong>{formatLabel('shippedVia')}</strong> {translateServiceName(shippedVia)}</p>
            
            {/* Show epac service name if it's ePAC */}
            {shippedVia === "SingPost ePAC (aka SpeedPost Saver International)" && (
              <p style={{ marginTop: '10px', padding: '10px', backgroundColor: '#e8f4f8', borderRadius: '5px' }}>
                {t('thisServiceKnownAs')}{" "}
                <strong>{epacKnownAs || getEpacName(destinationCountry, t)}</strong> {t('in')}{" "}
                {getCountryName(destinationCountry)}.
              </p>
            )}
          </div>

          {/* Tracking link buttons (SingPost / SpeedPost / DHL / Destination) */}
          <div className="tracking-links" style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            {/^(\d{10})$/.test(trackingNumber) && (
              <button
                type="button"
                className="btn-secondary"
                style={{ backgroundColor: '#e60000', color: '#fff' }}
                onClick={() => { setActiveEmbed('dhl'); scrollToEmbed(); }}
              >
                {t('viewTrackingDHL')}
              </button>
            )}

            {/^(PX\d{9}SG)$/.test(trackingNumber) && (
              <>
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ backgroundColor: '#ff7f00', color: '#fff' }}
                  onClick={() => { setActiveEmbed('speedpost'); scrollToEmbed(); }}
                >
                  {t('viewTrackingSingPostSpeedPost')}
                </button>
                {fromDate && toDate && (
                  <a
                    href={`https://mydhl.express.dhl/sg/en/tracking.html#/results?shipperReference=${trackingNumber}&fromDate=${fromDate}&toDate=${toDate}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary"
                    style={{ backgroundColor: '#e60000', color: '#fff', }}
                  >
                    {t('viewTrackingDHLShipperRef')}
                  </a>
                )}
              </>
            )}

            {!/^\d{10}$/.test(trackingNumber) && !/^PX\d{9}SG$/.test(trackingNumber) && trackingUrl && (
              <>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => { setActiveEmbed('singpost'); scrollToEmbed(); }}
                >
                  {t('viewTrackingSingPost')}
                </button>

                {destinationCountry !== 'SG' && (
                  <a
                    href={trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary"
                  >
                    {t('viewTrackingDestPost')} {operatorName}
                  </a>
                )}
              </>
            )}
          </div>

          {/* Embedded tracker: mount a single iframe to avoid repeated loads */}
          <div className="tracking-embed" style={{ marginTop: '20px', overflowX: 'auto' }}>

            {/^\d{10}$/.test(trackingNumber) && (
              <div style={{ padding: 12, background: '#fff3cd', border: '1px solid #ffeeba', borderRadius: 6 }}>
                {t('dhlNoEmbed')}{' '}
                <a href={`https://mydhl.express.dhl/sg/en/tracking.html#/results?id=${trackingNumber}`}
                  target="_blank" rel="noopener noreferrer" style={{ color: '#0066cc', fontWeight: 'bold' }}>
                  {t('clickHere')}
                </a>{' '}{t('toTrackNewTab')}
              </div>
            )}

            {/^PX\d{9}SG$/.test(trackingNumber) && (
              <div style={{ padding: 12, background: '#fff3cd', border: '1px solid #ffeeba', borderRadius: 6 }}>
                {destinationCountry !== 'SG' ? (
                  <>
                    {t('speedPostNoEmbed')}{' '}
                    <a href={`https://www.speedpost.com.sg/track-and-trace?tnt=${trackingNumber}`}
                      target="_blank" rel="noopener noreferrer" style={{ color: '#0066cc', fontWeight: 'bold' }}>
                      {t('clickHere')}
                    </a>{' '}{t('toTrackNewTab')}
                  </>
                ) : (
                  <>
                    <a href={`https://www.speedpost.com.sg/track-and-trace?tnt=${trackingNumber}`}
                      target="_blank" rel="noopener noreferrer" style={{ color: '#0066cc', fontWeight: 'bold' }}>
                      {t('clickHere')}
                    </a>{' '}{t('toTrackNewTab')}
                  </>
                )}
              </div>
            )}

            {/* Normal postal: toggle between SingPost and Destination */}
            {!/^\d{10}$/.test(trackingNumber) && !/^PX\d{9}SG$/.test(trackingNumber) && trackingUrl && (
              <>
                <div className="embed-toggle-buttons" style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                  <button
                    className={activeEmbed === 'singpost' ? 'btn-primary' : 'btn-secondary'}
                    onClick={() => setActiveEmbed('singpost')}
                    style={{ padding: '6px 10px' }}
                  >
                    {t('viewTrackingSingPost')}
                  </button>
                  {destinationCountry !== 'SG' && (
                    <button
                      className={activeEmbed === 'dest' ? 'btn-primary' : 'btn-secondary'}
                      onClick={() => setActiveEmbed('dest')}
                      style={{ padding: '6px 10px' }}
                    >
                      {t('viewTrackingDestPost')} {operatorName}
                    </button>
                  )}
                </div>

                {(activeEmbed === 'singpost' || destinationCountry === 'SG') && (
                  <>
                    <iframe
                      key={`singpost-${trackingNumber}-${currentLanguage}`}
                      src={`/api/proxy-singpost?trackingid=${encodeURIComponent(trackingNumber)}&lang=${currentLanguage}`}
                      style={{ width: '100%', minHeight: '600px', border: 'none', backgroundColor: 'white' }}
                      title="SingPost Tracking"
                      sandbox="allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation allow-forms allow-scripts allow-modals"
                    />
                    <div className="singpost-newtab-notice" style={{ marginTop: 10, padding: 12, background: '#fff3cd', border: '1px solid #ffeeba', borderRadius: 6 }}>
                      If reCAPTCHA appears in the embedded SingPost tracker, click “I am not a robot”. Search/verification opens in a new tab automatically.{' '}
                      <a
                        className="singpost-newtab-link"
                        href={`https://www.singpost.com/track-items?trackingid=${encodeURIComponent(trackingNumber)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#0066cc', fontWeight: 'bold' }}
                      >
                        {t('clickHere')}
                      </a>{' '}
                      {t('toTrackNewTab')}
                    </div>
                  </>
                )}

                {activeEmbed === 'dest' && destinationCountry !== 'SG' && (() => {
                  // Ireland: always fallback, never embed
                  if (destinationCountry === 'IE') {
                    // Always use the homepage link, never with tracking number
                    const countryLinks = postalTrackingUrls['IE'];
                    const homepage = currentLanguage === 'ga' ? countryLinks.ga : countryLinks.en;
                    return (
                      <div style={{ padding: 12, background: '#fff3cd', border: '1px solid #ffeeba', borderRadius: 6 }}>
                        {t('anPostNoDirectTracking') /* e.g. 'An Post (Ireland) does not support direct tracking links or embedded tracking.' */}<br />
                        <strong>{t('anPostPasteManually') /* e.g. 'Please paste your tracking number manually on the An Post website.' */}</strong><br />
                        <a href={homepage} target="_blank" rel="noopener noreferrer" style={{ color: '#0066cc', fontWeight: 'bold' }}>
                          {t('goToAnPost') /* e.g. 'Go to An Post' */}
                        </a>
                      </div>
                    );
                  }
                  if (canEmbedDestination) {
                    const proxyUrl = (destinationCountry === 'CA' || destinationCountry === 'DE' || destinationCountry === 'GB')
                      ? `/api/proxy-destination?url=${trackingUrl}`
                      : `/api/proxy-destination?url=${trackingUrl}&lang=${currentLanguage}`;
                    return (
                      <iframe
                        key={`dest-${trackingNumber}-${destinationCountry}-${currentLanguage}`}
                        src={proxyUrl}
                        style={{ width: '100%', minHeight: '600px', border: 'none', backgroundColor: 'white' }}
                        title="Destination Post Tracking"
                        sandbox="allow-popups allow-forms allow-scripts"
                        onError={(e) => { console.warn('Destination tracking embed failed:', e); }}
                      />
                    );
                  }
                  return (
                    <div style={{ padding: 12, background: '#fff3cd', border: '1px solid #ffeeba', borderRadius: 6 }}>
                      {operatorName} {t('operatorNoEmbed')}{' '}
                      <a href={trackingUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#0066cc', fontWeight: 'bold' }}>
                        {t('clickHere')}
                      </a>
                      {' '}{t('toTrackNewTab')}
                    </div>
                  );
                })()}
              </>
            )}
          </div>
        </div>
      )}

      {/* Removed outdated non-embed messaging per request */}
      <p>{t('thirdPartyWebsites') || 'You may also track your parcels on these third-party websites as well:'}</p>

      <div className="logo-container">
        {/* Updated src to use the new placeholder constants */}
         <a href={`https://t.17track.net/en#nums=${trackingNumber}`} target="_blank" rel="noopener noreferrer">
          <Image src={trackLogo1} alt="17track" width={200} height={80} style={{ objectFit: 'contain', height: 'auto', maxHeight: '55px' }} />
        </a>
        <a href={`https://www.aftership.com/track?t=${trackingNumber}`} target="_blank" rel="noopener noreferrer">
          <Image src={trackLogo2} alt="AfterShip" width={200} height={80} style={{ objectFit: 'contain', height: 'auto', maxHeight: '55px' }} />
        </a>
        <a href="https://parcelsapp.com/en/tracking/" target="_blank" rel="noopener noreferrer">
          <Image src={trackLogo3} alt="ParcelsApp" width={200} height={80} style={{ objectFit: 'contain', height: 'auto', maxHeight: '55px' }} />
        </a>
        <a href="https://globaltracktrace.ptc.post/gtt.web/" target="_blank" rel="noopener noreferrer">
          <Image src={trackLogo4} alt="UPU Global Track & Trace" width={200} height={80} style={{ objectFit: 'contain', height: 'auto', maxHeight: '55px' }} />
        </a>
      </div>
      <hr />
      
      {/* Search Order Section */}
      <div className="modern-form-container">
        <h3>{t('searchByEmailOrPhone')}</h3>
        <div className="mb-3">
          <label className="form-label">{t('enterEmailOrPhone')}</label>

          <input
            type="text"
            className="form-control"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('enterEmailOrPhone') || "Enter email or phone"}
          />

          <button onClick={handleSearchOrder} className="btn-secondary mt-3">
            {t('searchOrder')}
          </button>

          <p className="mt-5 text-muted">
        © {new Date().getFullYear()} Rhythm Nexus. {t('copyrightAllRights')}
      </p>
        </div>

        {searchResults.length > 0 && (
          <div className="search-results-card">
            <h3>{t('trackingResult')}</h3>

            {searchResults.map((order, idx) => (
              <div key={idx} className="search-result-item">
                <p><strong>{formatLabelNoExample('orderNumber')}</strong> {order.orderNumber}</p>
                <p><strong>{formatLabel('trackingNumber')}</strong> {order.trackingNumber}</p>
                <p><strong>{formatLabel('destinationCountry')}</strong> {order.destinationCountry}</p>
                <p><strong>{formatLabel('postcode')}</strong> {order.postcode}</p>
                <p><strong>{formatLabel('status')}</strong> {order.status}</p>
                <p><strong>{formatLabel('postedDate')}</strong> {order.postedDate}</p>
                <p><strong>{formatLabel('shippedVia')}</strong> {order.shippedVia}</p>
                {/* For list items, we must use getEpacName to get translated service name */}
                {order.shippedVia === "SingPost ePAC (aka SpeedPost Saver International)" &&
                  getEpacName(order.destinationCountry, t) && (
                    <div className="info-box">
                      <p>
                        {t('thisServiceKnownAs')}{" "}
                        <strong>{getEpacName(order.destinationCountry, t)}</strong> {t('in')}{" "}
                        {getCountryName(order.destinationCountry)}.
                      </p>
                    </div>
                )}
                {/* Note: The following text is part of the search results iteration, which is unusual for a persistent note. */}
                {idx === searchResults.length - 1 && (
                  <div className="mt-3">
                    <h2><b><u>{t('deliveryRecordNote')}</u></b></h2>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </>
  )
}

function TrackYourItemWithSuspense() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <App />
    </Suspense>
  );
}

export default TrackYourItemWithSuspense;
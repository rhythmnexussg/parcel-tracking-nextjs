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

// --- Service Announcement Component ---
const ServiceAnnouncement = ({ allowedDestinations }) => {
  const { t, tStrict, language: currentLanguage } = useLanguage();
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        // Build URL with country filter if restrictions apply
        // Otherwise API will default to all 34 shipped countries
        let url = '/api/singpost-announcements';
        if (allowedDestinations && allowedDestinations.length > 0) {
          url += `?countries=${allowedDestinations.join(',')}`;
        }
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error('Failed to fetch announcements');
        }
        
        const html = await response.text();
        setContent(html);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading announcements:', error);
        setHasError(true);
        setIsLoading(false);
      }
    };

    fetchAnnouncements();
  }, [allowedDestinations]);

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
            href="https://www.singpost.com/send-receive/service-announcements" 
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
      
      {!isLoading && !hasError && content && (
        <iframe
          key={`announcements-${currentLanguage}-${allowedDestinations ? allowedDestinations.join('-') : 'all'}`}
          src={`/api/singpost-announcements${allowedDestinations && allowedDestinations.length > 0 ? '?countries=' + allowedDestinations.join(',') + '&' : '?'}lang=${currentLanguage}`}
          style={{
            width: '100%',
            minHeight: '500px',
            border: 'none',
            backgroundColor: 'white'
          }}
          title="SingPost Service Announcements"
          sandbox="allow-same-origin allow-popups allow-forms allow-scripts"
        />
      )}
    </div>
  );
};

// --- Navigation Component ---
const Navigation = () => {
  const { t } = useLanguage();
  
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link href="/">
          <Image src={logo} alt="Rhythm Nexus" />
        </Link>
      </div>
      <div className="navbar-links">
        <Link href="/" className="nav-link">{t('home')}</Link>
        <Link href="/blog" className="nav-link">{t('blog')}</Link>
        <Link href="/about" className="nav-link">{t('aboutUs')}</Link>
        <Link href="/FAQ" className="nav-link">{t('faq')}</Link>
        <Link href="/contact" className="nav-link">{t('contact')}</Link>
        <Link href="/track-your-item" className="nav-link highlight">{t('trackPackage')}</Link>
        <LanguageSelector />
      </div>
    </nav>
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
  HK: 'https://www.hongkongpost.hk/en/mail_tracking/index.html?trackcode=',
  IN: 'https://www.indiapost.gov.in/track-result/article-number/',
  ID: 'https://www.posindonesia.co.id/id/tracking?key=',
  IE: 'https://www.anpost.com/',
  IL: 'https://israelpost.co.il/en/itemtrace?lang=EN&itemcode=',
  IT: 'https://www.poste.it/cerca/index.html#/risultati-spedizioni/',
  JP: 'https://trackings.post.japanpost.jp/services/srv/search/?requestNo1=',
  MO: 'https://www.ctt.gov.mo/macaupost/contents/MailTrack.aspx/',
  MY: 'http://www.pos.com.my/postaltrack.aspx?code=',
  NO: 'https://sporing.posten.no/sporing/',
  NL: 'https://jouw.postnl.nl/track-and-trace/',
  NZ: 'https://www.nzpost.co.nz/tools/tracking?trackid=',
  PH: 'https://tracking.phlpost.gov.ph/?trackcode=',
  PL: 'https://emonitoring.poczta-polska.pl/?numer=',
  PT: 'https://appserver.ctt.pt/CustomerArea/PublicArea_Detail?ObjectCodeInput=',
  KR: 'https://service.epost.go.kr/iservice/usr/trace/usrtrc001k01.jsp?sid1=',
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
  const url =
    "https://sheets.googleapis.com/v4/spreadsheets/1t-1V0WBpuFmRCLgctUZqm4-BXCdyyqG-NBrm8JgULQQ/values/Current!A:J?key=AIzaSyA-2x10CBEwNEybXB07fN7xBeJLdIltH4M";

  try {
    const response = await fetch(url);
    const data = await response.json();
    const rows = data.values || [];
    const bodyRows = rows.slice(1);

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
    return [];
  }
}


// Separate component for Ads
const AdBlock = () => (
  <>
    <div className="my-4">
      <ins className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-6282638141528337"
        data-ad-slot="5003292159"
        data-ad-format="auto">
      </ins>
    </div>
    <div className="my-4">
      <ins className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-6282638141528337"
        data-ad-slot="8978895256"
        data-ad-format="fluid"
        data-ad-layout-key="+30+qw+o-1s+9a">
      </ins>
    </div>
    <div className="my-4 text-center">
      <ins className="adsbygoogle"
        style={{ display: "block", textAlign: "center" }}
        data-ad-client="ca-pub-6282638141528337"
        data-ad-slot="6134983374"
        data-ad-format="fluid"
        data-ad-layout="in-article">
      </ins>
    </div>
  </>
);

const epacMapping = {
  US: "First-Class Package International Service",
  CH: "Priority Plus",
  GB: "International Tracked",
  MY: "International Tracked/Express",
  CA: "International Inbound Express",
  AU: "Pack and Track International", 
  NZ: "International Economy Tracked",
  DE: "Warenpost International",
  FR: "Lettre internationale avec suivi",
  NL: "International Packet Tracked",
  PL: "GLOBAL Expres",
  BE: "International Prime Inbound",
  AT: "International Verfolgt Paket",
  IN: "International Tracked Packet",
  FI: "International Tracked Letter",
  SE: "International Tracked Letter (PostNord MyPack Home)",
  NO: "PRIME Exprès",
  IT: "Express",
  IL: "Express",
  ES: "Paquete Internacional Light",
  PT: "Correio Azul Internacional",
  CZ: "Sledovaná zásilka do zahraničí",
  BN: "International ePacket",
  CN: "International ePacket",
  HK: "International ePacket",
  ID: "International ePacket",
  MO: "International ePacket",
  PH: "International ePacket",
  TW: "International ePacket",
  TH: "International ePacket",
  VN: "International ePacket (ASEAN Packet)",
  KR: "K-Packet",
  JP: "International ePacket Light",
  IE: "International Express Post"
};

const countryNameMap = {
  AU: "Australia", AT: "Austria", BE: "Belgium", BN: "Brunei", 
  CA: "Canada", CN: "China", CZ: "Czechia", FI: "Finland", FR: "France",
  DE: "Germany", HK: "Hong Kong SAR China", IN: "India", ID: "Indonesia", 
  IE: "Ireland", IL: "Israel", IT: "Italy", JP: "Japan",
  MO: "Macau SAR China", MY: "Malaysia", NO: "Norway",
  NL: "Netherlands", NZ: "New Zealand", PH: "Philippines", PL: "Poland",
  PT: "Portugal", KR: "South Korea", ES: "Spain", SE: "Sweden",
  CH: "Switzerland", TW: "Taiwan", TH: "Thailand", 
  GB: "United Kingdom", US: "United States", VN: "Vietnam",
  SG: "Singapore",
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

function App() {
  const { t, tStrict, language: currentLanguage } = useLanguage();

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
        setEpacKnownAs(epacMapping[firstResult.destinationCountry] || "");
      } else {
        setEpacKnownAs("");
      }
    }
  }, [searchResults]);

  useEffect(() => {
    if (!isTrackParcelMode) {
      setEpacKnownAs("");    
      return;
    }

    if (!destinationCountry) {
      setEpacKnownAs("");
      return;
    }

    const knownName = epacMapping[destinationCountry] || "";
    setEpacKnownAs(knownName);
  }, [destinationCountry, isTrackParcelMode]);

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
        
        // Special handling for China access restrictions
        if (geoData.countryCode === 'CN') {
          if (geoData.isVPNDetected) {
            setAccessBlocked(true);
            setBlockMessage("VPN usage detected. Please disable VPN to access this service.");
            return;
          }
          setAllowedDestinations(geoData.accessRestrictions?.allowedDestinations || []);
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
    const base = raw.replace(/\s*\(.*?\)\s*$/, '').trim();
    return /[:：]\s*$/.test(base) ? base : `${base}:`;
  }, [t]);

  const scrollToEmbed = useCallback(() => {
    const el = document.querySelector('.tracking-embed');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);


  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setTrackingUrl(""); 
    setStatus(""); 

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

    router.push(`/track-your-item?${params.toString()}`);

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

    const results = await fetchOrderInfo(""); 

    const matchedOrder = results.find(
      (order) =>
        order.trackingNumber.toUpperCase() === trackingNumber.toUpperCase() &&
        order.destinationCountry === destinationCountry &&
        order.orderNumber.toUpperCase() === orderNumber.toUpperCase() &&
        order.postcode.toUpperCase() === postcode.toUpperCase()
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
        ? epacMapping[matchedOrder.destinationCountry] || ""
        : ""
    );

    setCountrySpecificMessage(matchedOrder.destinationCountry);

    
    const countryNameDisplay = countryNameMap[destinationCountry] || "this country";
    let url = ""; 

    if (destinationCountry === "SG") {
      const ppRegex = /^PP\d{9}SG$/;
      const spnddRegex = /^SPNDD\d{10}$/;

      if (!(ppRegex.test(trackingNumber) || spnddRegex.test(trackingNumber))) {
        alert(t('invalidSingPostFormat'));
        return;
      }
      url = postalTrackingUrls.PP + encodeURIComponent(trackingNumber);
    }
    else {
      if (/^PX\d{9}SG$/.test(trackingNumber)) {
        url = postalTrackingUrls.PX + trackingNumber;
      } else if (/^(LG|LP|LT)\d{9}SG$/.test(trackingNumber)) {
        // Don't encode alphanumeric tracking numbers to avoid unnecessary % in URLs
        url = postalTrackingUrls[destinationCountry] + trackingNumber;
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
      if (!postcode) {
        console.warn("Postcode is required.");
        alert(t('postcodeRequired'));
        return;
      }
      if (destinationCountry === "NL") {
          url = `https://jouw.postnl.nl/track-and-trace/${encodeURIComponent(trackingNumber)}-NL-${encodeURIComponent(postcode)}`;
      }
      if (destinationCountry === "BE") {
        url = `https://track.bpost.cloud/btr/web/#/search?lang=fr&itemCode=${encodeURIComponent(trackingNumber)}&postalCode=${encodeURIComponent(postcode)}`;
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
  }, [trackingNumber, destinationCountry, postcode, orderNumber, fromDate, toDate, router, setCountrySpecificMessage, userCountry, allowedDestinations, t]); 
  
  const operatorName = postalOperatorNames[destinationCountry] || (countryNameMap[destinationCountry] ? `${countryNameMap[destinationCountry]} Post` : "");

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

        {/* Critical Advisory (Top of Page, not in Service Announcements) */}
        <div
          className="critical-advisory-card"
          style={{
            border: '2px solid #b30000',
            backgroundColor: '#ffe5e5',
            color: '#660000',
            borderRadius: '8px',
            padding: '16px',
            marginTop: '16px',
            marginBottom: '16px'
          }}
        >
          <h3 style={{ marginTop: 0, color: '#b30000' }}>
            {t('usaStormAdvisory') || 'Severe winter storm is affecting several parts of USA. This will affect both postal and express delivery for packages into USA.'}
          </h3>
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
              const otherCountries = ['AT', 'BE', 'BN', 'CN', 'CZ', 'FI', 'FR', 'HK', 'IN', 'ID', 'IE', 'IL', 'IT', 'JP', 'MO', 'MY', 'NL', 'NZ', 'NO', 'PH', 'PL', 'PT', 'KR', 'ES', 'SE', 'CH', 'TW', 'TH', 'VN'];
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
            placeholder="DLTB1234567890"
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
            {t('usaPostcodeNote') || 'For USA Postcode, you may need to provide the full zip code if the error of "No order found matching all fields" is triggered. 5 digit postcode should be fine, but for most eBay orders and some Etsy ones it may require the full ZIP code. For countries without postcodes, such as Hong Kong & Macau, please put 999077 (Hong Kong) or 999078 (Macau).'}
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
            {t('contactUsForm') || 'Please contact us through this'} <a href="https://docs.google.com/forms/d/e/1FAIpQLSfMZDY_D9gO2JPLYAnIeEqyyYeZI2VXDTnR12L4ihbz5hYwIA/viewform">{t('form') || 'form'}</a> {t('forEnquiries') || 'for any enquiries you have regarding your order.'}
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
            <p><strong>{formatLabel('destinationCountry')}</strong> {destinationCountry}</p>
            <p><strong>{formatLabelNoExample('orderNumber')}</strong> {orderNumber}</p>
            <p><strong>{formatLabel('postedDate')}</strong> {postedDate}</p>
            <p><strong>{formatLabel('status')}</strong> {status}</p>
            <p><strong>{formatLabel('shippedVia')}</strong> {shippedVia}</p>
            
            {/* FIXED: Using epacKnownAs instead of calculating it again */}
            {epacKnownAs && (
              <div className="info-box">
                <p>
                  {t('thisServiceKnownAs')} {""}
                  <strong>{epacKnownAs}</strong> {t('in')} {""}
                  {countryNameMap[destinationCountry]}.
                </p>
              </div>
            )}

          {/* Tracking link buttons (SingPost / SpeedPost / DHL / Destination) */}
          <div className="tracking-links" style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            {/^(\d{10})$/.test(trackingNumber) && (
              <button
                type="button"
                className="btn-secondary"
                style={{ backgroundColor: '#e60000', color: '#fff' }}
                onClick={() => { setActiveEmbed('dhl'); scrollToEmbed(); }}
              >
                View Tracking Information from DHL Express
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
                  View Tracking Information from Singapore SpeedPost
                </button>
                {fromDate && toDate && (
                  <button
                    type="button"
                    className="btn-secondary"
                    style={{ backgroundColor: '#e60000', color: '#fff' }}
                    onClick={() => { setActiveEmbed('dhl'); scrollToEmbed(); }}
                  >
                    View Tracking Information from DHL Express (Shipper Reference)
                  </button>
                )}
              </>
            )}
          </div>

          {/* Embedded tracker: mount a single iframe to avoid repeated loads */}
          <div className="tracking-embed" style={{ marginTop: '20px' }}>
            {/^\d{10}$/.test(trackingNumber) && (
              <iframe
                key={`dhl-${trackingNumber}-${currentLanguage}`}
                src={`/api/proxy-dhl?trackingNumber=${encodeURIComponent(trackingNumber)}&lang=${currentLanguage}`}
                style={{ width: '100%', minHeight: '600px', border: 'none', backgroundColor: 'white' }}
                title="DHL Tracking"
                sandbox="allow-same-origin allow-popups allow-forms allow-scripts"
              />
            )}

            {/^PX\d{9}SG$/.test(trackingNumber) && (
              <iframe
                key={`speedpost-${trackingNumber}-${currentLanguage}`}
                src={`/api/proxy-destination?url=${encodeURIComponent(`https://www.speedpost.com.sg/track-and-trace?tnt=${trackingNumber}`)}&lang=${currentLanguage}`}
                style={{ width: '100%', minHeight: '600px', border: 'none', backgroundColor: 'white' }}
                title="SpeedPost Tracking"
                sandbox="allow-same-origin allow-popups allow-forms allow-scripts"
              />
            )}

            {/* Normal postal: toggle between SingPost and Destination */}
            {!/^\d{10}$/.test(trackingNumber) && !/^PX\d{9}SG$/.test(trackingNumber) && trackingUrl && (
              <>
                <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                  <button
                    className={activeEmbed === 'singpost' ? 'btn-primary' : 'btn-secondary'}
                    onClick={() => setActiveEmbed('singpost')}
                    style={{ padding: '6px 10px' }}
                  >
                    View Tracking Information from Singapore Post
                  </button>
                  <button
                    className={activeEmbed === 'dest' ? 'btn-primary' : 'btn-secondary'}
                    onClick={() => setActiveEmbed('dest')}
                    style={{ padding: '6px 10px' }}
                  >
                    View Tracking Information from {operatorName}
                  </button>
                </div>

                {activeEmbed === 'singpost' && (
                  <iframe
                    key={`singpost-${trackingNumber}-${currentLanguage}`}
                    src={`/api/proxy-singpost?trackingid=${encodeURIComponent(trackingNumber)}&lang=${currentLanguage}`}
                    style={{ width: '100%', minHeight: '600px', border: 'none', backgroundColor: 'white' }}
                    title="SingPost Tracking"
                    sandbox="allow-same-origin allow-popups allow-forms allow-scripts"
                  />
                )}

                {activeEmbed === 'dest' && (() => {
                  try {
                    const u = new URL(trackingUrl);
                    const allowed = [
                      'www.usps.com', 'tools.usps.com', 'www.nzpost.co.nz',
                      'jouw.postnl.nl', 'track.bpost.cloud', 'www.dhl.com', 'www.laposte.fr', 'service.post.ch', 'www.postnord.se',
                      'www.post.at', 'www.hongkongpost.hk', 'emonitoring.poczta-polska.pl', 'www.correos.es',
                      'service.epost.go.kr', 'trackings.post.japanpost.jp',
                      // Additional destinations requested
                      'bn.postglobal.online', 'www.posindonesia.co.id', 'www.anpost.com', 'israelpost.co.il',
                      'www.ctt.gov.mo', 'www.pos.com.my', 'sporing.posten.no', 'tracking.phlpost.gov.ph',
                      'postserv.post.gov.tw', 'track.thailandpost.com', 'vnpost.vn', 'www.ems.com.cn',
                      'www.posti.fi', 'www.postaonline.cz'
                    ];
                    if (destinationCountry === 'US') {
                      const usUrl = `https://tools.usps.com/go/TrackConfirmAction?tLabels=${trackingNumber}`;
                      return (
                        <iframe
                          key={`dest-${trackingNumber}-${destinationCountry}-${currentLanguage}`}
                          src={`/api/proxy-destination?url=${encodeURIComponent(usUrl)}&lang=${currentLanguage}`}
                          style={{ width: '100%', minHeight: '600px', border: 'none', backgroundColor: 'white' }}
                          title="USPS Tracking"
                          sandbox="allow-same-origin allow-popups allow-forms allow-scripts"
                          onError={(e) => { console.warn('USPS tracking embed failed:', e); }}
                        />
                      );
                    } else if (allowed.includes(u.hostname)) {
                      // Canada Post, Germany, UK: don't append &lang parameter (already in URL path)
                      const proxyUrl = (destinationCountry === 'CA' || destinationCountry === 'DE' || destinationCountry === 'GB')
                        ? `/api/proxy-destination?url=${trackingUrl}`
                        : `/api/proxy-destination?url=${trackingUrl}&lang=${currentLanguage}`;
                      return (
                        <iframe
                          key={`dest-${trackingNumber}-${destinationCountry}-${currentLanguage}`}
                          src={proxyUrl}
                          style={{ width: '100%', minHeight: '600px', border: 'none', backgroundColor: 'white' }}
                          title="Destination Post Tracking"
                          sandbox="allow-same-origin allow-popups allow-forms allow-scripts"
                          onError={(e) => { console.warn('Destination tracking embed failed:', e); }}
                        />
                      );
                    }
                  } catch {}
                  return (
                    <div style={{ padding: 12, background: '#fff3cd', border: '1px solid #ffeeba', borderRadius: 6 }}>
                      {operatorName} does not support tracking via embed. Please{' '}
                      <a href={trackingUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#0066cc', fontWeight: 'bold' }}>
                        click here
                      </a>
                      {' '}to track (opens in new tab).
                    </div>
                  );
                })()}
              </>
            )}
          </div>
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
                {/* For list items, we must access the map directly as epacKnownAs state is single-value */}
                {order.shippedVia === "SingPost ePAC (aka SpeedPost Saver International)" &&
                  epacMapping[order.destinationCountry] && (
                    <div className="info-box">
                      <p>
                        {t('thisServiceKnownAs')}{" "}
                        <strong>{epacMapping[order.destinationCountry]}</strong> {t('in')}{" "}
                        {countryNameMap[order.destinationCountry]}.
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

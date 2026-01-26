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
  CA: 'https://www.canadapost-postescanada.ca/track-reperage/en#/search?searchFor=',
  CN: 'https://www.ems.com.cn/qps/yjcx/',
  CZ: 'https://www.postaonline.cz/trackandtrace/-/zasilka/cislo?parcelNumbers=',
  FI: 'https://www.posti.fi/fi/seuranta#/lahetys/',
  FR: 'https://www.laposte.fr/outils/track-a-parcel?code=',
  DE: 'https://www.deutschepost.de/sendung/simpleQuery.html?lang=en&extendedSearch=true&locale=en_GB&localesite=glo&consignmentnumber=',
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
  GB: 'https://www.royalmail.com/track-your-item#/tracking-results/',
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

function App() {
  const { t } = useLanguage();

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
  
  const [searchParams] = useSearchParams();
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

  const setCountrySpecificMessage = useCallback((selectedCountry) => {
    let message = "";
    const countryMsgKey = `countryMsg${selectedCountry}`;
    if (t(countryMsgKey) && t(countryMsgKey) !== countryMsgKey) {
      message = t(countryMsgKey);
    }
    setAdditionalMessage(message);
  }, [t]); 

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
        url = postalTrackingUrls.PX + encodeURIComponent(trackingNumber);
      } else if (/^(LG|LP|LT)\d{9}SG$/.test(trackingNumber)) {
        url = postalTrackingUrls[destinationCountry] + encodeURIComponent(trackingNumber);
      } else if (/^EZ\d{9}SG$/i.test(trackingNumber)) {
        url = postalTrackingUrls[destinationCountry] + encodeURIComponent(trackingNumber);
      } else if ( /^\d{10}$/.test(trackingNumber)) {
        url = postalTrackingUrls.DHL + encodeURIComponent(trackingNumber);
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
            <optgroup label={t('singaporeCouriers')}>
              <option value="SG">{t('optionSingPost')}</option>
            </optgroup>
            <optgroup label={t('topCountries')}>
              <option value="AU">{t('countryAU')}</option>
              <option value="CA">{t('countryCA')}</option>
              <option value="DE">{t('countryDE')}</option>
              <option value="GB">{t('countryGB')}</option>
              <option value="US">{t('countryUS')}</option>
            </optgroup>
            <optgroup label={t('otherCountries')}>
              <option value="AT">{t('countryAT')}</option>
              <option value="BE">{t('countryBE')}</option>
              <option value="BN">{t('countryBN')}</option>
              <option value="CN">{t('countryCN')}</option>
              <option value="CZ">{t('countryCZ')}</option>
              <option value="FI">{t('countryFI')}</option>
              <option value="FR">{t('countryFR')}</option>
              <option value="HK">{t('countryHK')}</option>
              <option value="IN">{t('countryIN')}</option>
              <option value="ID">{t('countryID')}</option>
              <option value="IE">{t('countryIE')}</option>
              <option value="IL">{t('countryIL')}</option>
              <option value="IT">{t('countryIT')}</option>
              <option value="JP">{t('countryJP')}</option>
              <option value="MO">{t('countryMO')}</option>
              <option value="MY">{t('countryMY')}</option>
              <option value="NL">{t('countryNL')}</option>
              <option value="NZ">{t('countryNZ')}</option>
              <option value="NO">{t('countryNO')}</option>
              <option value="PH">{t('countryPH')}</option>
              <option value="PL">{t('countryPL')}</option>
              <option value="PT">{t('countryPT')}</option>
              <option value="KR">{t('countryKR')}</option>
              <option value="ES">{t('countryES')}</option>
              <option value="SE">{t('countrySE')}</option>
              <option value="CH">{t('countryCH')}</option>
              <option value="TW">{t('countryTW')}</option>
              <option value="TH">{t('countryTH')}</option>
              <option value="VN">{t('countryVN')}</option>
            </optgroup>
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
            <p><strong>{t('trackingNumber')}</strong> {trackingNumber}</p>
            {postcode && <p><strong>{t('postcode')}</strong> {postcode}</p>}
            <p><strong>{t('destinationCountry')}</strong> {destinationCountry}</p>
            <p><strong>{t('orderNumber')}</strong> {orderNumber}</p>
            <p><strong>{t('postedDate')}</strong> {postedDate}</p>
            <p><strong>{t('status')}</strong> {status}</p>
            <p><strong>{t('shippedVia')}</strong> {shippedVia}</p>
            
            {/* FIXED: Using epacKnownAs instead of calculating it again */}
            {epacKnownAs && (
              <div className="info-box">
                <p>
                  {t('thisServiceKnownAs')}{" "}
                  <strong>{epacKnownAs}</strong> {t('in')}{" "}
                  {countryNameMap[destinationCountry]}.
                </p>
              </div>
            )}
          </div>
          
          <div className="tracking-links">
            {/* 1️⃣ DHL Express ONLY (10-digit number) */}
            {/^\d{10}$/.test(trackingNumber) && (
              <p>
                <a
                  href={`${postalTrackingUrls.DHL}${trackingNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tracking-link"
                >
                  {t('viewTrackingDHL')}
                </a>
              </p>
            )}

            {/* 2️⃣ SpeedPost Express (PX → SingPost + DHL last-mile) */}
            {/^(PX\d{9}SG)$/.test(trackingNumber) && (
              <>
                <p>
                  <a
                    href={`https://www.speedpost.com.sg/track-and-trace?tnt=${trackingNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tracking-link"
                  >
                    {t('viewTrackingSingPostSpeedPost')}
                  </a>
                </p>

                {fromDate && toDate && (
                  <p>
                    <a
                      href={`https://mydhl.express.dhl/sg/en/tracking.html#/results?shipperReference=${trackingNumber}&fromDate=${fromDate}&toDate=${toDate}&destinationCountryCode=${destinationCountry}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="tracking-link"
                    >
                      {t('viewTrackingDHLLastMile')}
                    </a>
                  </p>
                )}
              </>
            )}

            {/* 3️⃣ Normal postal items (NOT DHL / NOT PX) */}
            {!/^\d{10}$/.test(trackingNumber) &&
             !/^PX\d{9}SG$/.test(trackingNumber) && (
              <>
                <p>
                  <a
                    href={`https://www.singpost.com/track-items?trackingid=${trackingNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tracking-link"
                  >
                    {t('viewTrackingSingPost')}
                  </a>
                </p>

                {destinationCountry !== "SG" && (
                  <p>
                    <a
                      href={trackingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="tracking-link"
                    >
                      {t('viewTrackingDestPost')} {countryNameMap[destinationCountry]} {t('post')}
                    </a>
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      )}

      <p className="mt-4">{t('cannotUseEmbed') || 'We are not able to use embed for tracking as most postal service websites do not support it.'}</p>
      <br />
      <p>{t('clickLinkAbove') || 'Please click on the link above to track your parcel.'}</p>
      <h2><u>{t('trackingDetailsNote') || 'Note that tracking details may not show up in search results, so it\'s recommended to paste the tracking number into the system to track the item.'}</u></h2>
      <br />
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
                <p><strong>{t('orderNumberExample')}</strong> {order.orderNumber}</p>
                <p><strong>{t('trackingNumber')}</strong> {order.trackingNumber}</p>
                <p><strong>{t('destinationCountry')}</strong> {order.destinationCountry}</p>
                <p><strong>{t('postcode')}</strong> {order.postcode}</p>
                <p><strong>{t('status')}</strong> {order.status}</p>
                <p><strong>{t('postedDate')}</strong> {order.postedDate}</p>
                <p><strong>{t('shippedVia')}</strong> {order.shippedVia}</p>
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

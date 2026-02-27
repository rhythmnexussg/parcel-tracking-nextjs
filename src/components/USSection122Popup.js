'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { detectLanguageFromIPWithRestrictions, normalizeCountryCode } from '../ipGeolocation';
import { useLanguage } from '../LanguageContext';

const TARGET_PATHS = new Set(['/', '/track-your-item']);
const ACCESS_TAB_SESSION_KEY = 'rnx_access_tab_verified';
const LANGUAGE_SELECTED_SESSION_KEY = 'rnx_language_selected';
const LANGUAGE_SELECTION_EVENT = 'rnx:language-selected';

const POPUP_I18N = {
  en: { title: 'USA Shipping Update: Section 122 Adjustment', intro: 'We are notifying customers shipping to the United States that rates have changed under the latest Section 122 tariff measures effective today.', fee1: 'A 10% handling fee now applies to USA-bound shipments.', fee2: 'An additional 10% tariff-related surcharge is applied to all items.', warning: 'Charges may be updated again if tariff policies change further.', link: 'Read the full USA Section 122 update', cta: 'I understand' },
  de: { title: 'USA Versand-Update: Section 122', intro: 'Wir informieren Kunden mit Versand in die USA, dass sich die Preise gemäß den neuesten Section-122-Tarifmaßnahmen ab heute geändert haben.', fee1: 'Für USA-Sendungen gilt jetzt eine Bearbeitungsgebühr von 10%.', fee2: 'Zusätzlich wird auf alle Artikel ein tarifbezogener Zuschlag von 10% erhoben.', warning: 'Bei weiteren Tarifänderungen können Gebühren erneut angepasst werden.', link: 'Vollständiges USA Section 122 Update lesen', cta: 'Ich verstehe' },
  fr: { title: 'Mise à jour USA : Section 122', intro: 'Nous informons les clients expédiant vers les États-Unis que les tarifs ont changé selon les dernières mesures de la Section 122, effectives aujourd’hui.', fee1: 'Des frais de traitement de 10 % s’appliquent désormais aux envois vers les USA.', fee2: 'Un supplément distinct de 10 % lié aux tarifs s’applique à tous les articles.', warning: 'Les frais peuvent être révisés à nouveau si la politique tarifaire évolue.', link: 'Lire la mise à jour complète USA Section 122', cta: 'Je comprends' },
  es: { title: 'Actualización de envíos a EE. UU.: Sección 122', intro: 'Informamos a los clientes con envíos a Estados Unidos que las tarifas han cambiado por las nuevas medidas arancelarias de la Sección 122, vigentes desde hoy.', fee1: 'Ahora se aplica una tarifa de gestión del 10% a envíos con destino a EE. UU.', fee2: 'Además, se aplica un recargo separado del 10% relacionado con aranceles a todos los artículos.', warning: 'Los cargos pueden volver a ajustarse si cambian las políticas arancelarias.', link: 'Leer la actualización completa de EE. UU. Sección 122', cta: 'Entiendo' },
  ja: { title: '米国配送更新：Section 122', intro: '米国向け発送のお客様へ、Section 122 の最新関税措置により本日から料金が変更されることをお知らせします。', fee1: '米国向け発送には 10% の取扱手数料が適用されます。', fee2: 'すべての商品に関税関連の追加料金 10% が適用されます。', warning: '関税方針の変更により、料金が再度改定される場合があります。', link: 'USA Section 122 の詳細を読む', cta: '確認しました' },
  zh: { title: '美国运输更新：Section 122 调整', intro: '通知寄往美国的客户：根据最新 Section 122 关税措施，费率自今日起已调整。', fee1: '寄往美国的包裹现加收 10% 处理费。', fee2: '所有商品另加收 10% 关税相关附加费。', warning: '若关税政策继续变化，费用可能再次调整。', link: '查看美国 Section 122 完整说明', cta: '我已了解' },
  'zh-hant': { title: '美國運輸更新：Section 122 調整', intro: '通知寄往美國的客戶：依最新 Section 122 關稅措施，費率自今日起已調整。', fee1: '寄往美國的包裹現加收 10% 處理費。', fee2: '所有商品另加收 10% 關稅相關附加費。', warning: '若關稅政策持續變動，費用可能再次調整。', link: '查看美國 Section 122 完整說明', cta: '我已了解' },
  pt: { title: 'Atualização de envio para os EUA: Section 122', intro: 'Estamos notificando clientes com envios para os Estados Unidos de que as tarifas mudaram sob as medidas mais recentes da Section 122, em vigor hoje.', fee1: 'Agora aplica-se uma taxa de manuseio de 10% para envios aos EUA.', fee2: 'Também se aplica um acréscimo separado de 10% relacionado a tarifas em todos os itens.', warning: 'Os encargos poderão ser ajustados novamente se houver novas mudanças tarifárias.', link: 'Ler atualização completa dos EUA Section 122', cta: 'Entendi' },
  hi: { title: 'यूएसए शिपिंग अपडेट: Section 122 समायोजन', intro: 'संयुक्त राज्य अमेरिका के लिए शिपमेंट करने वाले ग्राहकों को सूचित किया जाता है कि नवीनतम Section 122 टैरिफ उपायों के तहत दरें आज से बदल गई हैं।', fee1: 'यूएसए-गंतव्य शिपमेंट पर अब 10% हैंडलिंग शुल्क लागू है।', fee2: 'सभी आइटम्स पर अतिरिक्त 10% टैरिफ-संबंधित अधिभार लागू है।', warning: 'टैरिफ नीति में बदलाव होने पर शुल्क फिर बदल सकते हैं।', link: 'पूरा USA Section 122 अपडेट पढ़ें', cta: 'मैं समझ गया/गई' },
  th: { title: 'อัปเดตการจัดส่งสหรัฐฯ: Section 122', intro: 'แจ้งลูกค้าที่จัดส่งไปสหรัฐอเมริกาว่าอัตราค่าบริการมีการเปลี่ยนแปลงตามมาตรการภาษีล่าสุด Section 122 ซึ่งมีผลตั้งแต่วันนี้', fee1: 'มีค่าดำเนินการ 10% สำหรับพัสดุปลายทางสหรัฐฯ', fee2: 'มีค่าปรับเพิ่มอีก 10% ที่เกี่ยวข้องกับภาษีสำหรับสินค้าทุกรายการ', warning: 'อาจมีการปรับค่าบริการอีก หากนโยบายภาษีเปลี่ยนแปลงเพิ่มเติม', link: 'อ่านอัปเดต USA Section 122 แบบเต็ม', cta: 'ฉันเข้าใจแล้ว' },
  ms: { title: 'Kemas kini penghantaran USA: Seksyen 122', intro: 'Kami memaklumkan pelanggan yang menghantar ke Amerika Syarikat bahawa kadar telah berubah di bawah langkah tarif Seksyen 122 terkini berkuat kuasa hari ini.', fee1: 'Yuran pengendalian 10% kini dikenakan untuk penghantaran ke USA.', fee2: 'Surcaj tambahan 10% berkaitan tarif dikenakan pada semua item.', warning: 'Caj mungkin disemak semula jika dasar tarif berubah lagi.', link: 'Baca kemas kini penuh USA Seksyen 122', cta: 'Saya faham' },
  nl: { title: 'USA verzendupdate: Section 122', intro: 'Wij informeren klanten die naar de Verenigde Staten verzenden dat tarieven zijn gewijzigd onder de nieuwste Section 122-maatregelen, met ingang van vandaag.', fee1: 'Er geldt nu 10% verwerkingskosten voor zendingen naar de VS.', fee2: 'Daarnaast geldt een aparte toeslag van 10% voor alle artikelen in verband met tarieven.', warning: 'Kosten kunnen opnieuw worden aangepast als het tariefbeleid verder verandert.', link: 'Lees de volledige USA Section 122 update', cta: 'Ik begrijp het' },
  id: { title: 'Pembaruan pengiriman USA: Section 122', intro: 'Kami memberitahukan pelanggan yang mengirim ke Amerika Serikat bahwa tarif telah berubah berdasarkan kebijakan tarif terbaru Section 122 yang berlaku hari ini.', fee1: 'Biaya penanganan 10% kini berlaku untuk kiriman tujuan USA.', fee2: 'Tambahan biaya terpisah 10% terkait tarif berlaku untuk semua item.', warning: 'Biaya dapat disesuaikan kembali jika kebijakan tarif berubah lagi.', link: 'Baca pembaruan lengkap USA Section 122', cta: 'Saya mengerti' },
  cs: { title: 'Aktualizace dopravy do USA: Section 122', intro: 'Informujeme zákazníky se zásilkami do USA, že se sazby změnily podle nejnovějších tarifních opatření Section 122 platných od dneška.', fee1: 'Na zásilky do USA se nyní vztahuje manipulační poplatek 10 %.', fee2: 'Na všechny položky se uplatňuje i samostatný 10% příplatek související s tarify.', warning: 'Poplatky mohou být znovu upraveny, pokud se tarifní politika dále změní.', link: 'Přečíst úplnou aktualizaci USA Section 122', cta: 'Rozumím' },
  it: { title: 'Aggiornamento spedizioni USA: Section 122', intro: 'Informiamo i clienti che spediscono negli Stati Uniti che le tariffe sono cambiate secondo le ultime misure tariffarie della Section 122, in vigore da oggi.', fee1: 'Ora si applica una commissione di gestione del 10% alle spedizioni verso gli USA.', fee2: 'Si applica inoltre un sovrapprezzo separato del 10% legato ai dazi su tutti gli articoli.', warning: 'I costi potrebbero essere aggiornati nuovamente in caso di ulteriori cambiamenti tariffari.', link: 'Leggi l’aggiornamento completo USA Section 122', cta: 'Ho capito' },
  he: { title: 'עדכון משלוחים לארה״ב: Section 122', intro: 'אנו מודיעים ללקוחות המשלחים לארצות הברית כי התעריפים השתנו בהתאם לצעדי המכס העדכניים של Section 122 החל מהיום.', fee1: 'כעת חל דמי טיפול של 10% על משלוחים לארה״ב.', fee2: 'בנוסף חל חיוב נפרד של 10% הקשור לתעריפים על כל הפריטים.', warning: 'ייתכנו עדכוני חיוב נוספים אם מדיניות המכסים תמשיך להשתנות.', link: 'לקריאת העדכון המלא USA Section 122', cta: 'הבנתי' },
  ga: { title: 'Nuashonrú loingseoireachta SAM: Section 122', intro: 'Táimid ag cur in iúl do chustaiméirí atá ag seoladh chuig SAM go bhfuil rátaí athraithe faoi na bearta taraife is déanaí de Section 122 atá i bhfeidhm inniu.', fee1: 'Tá táille láimhseála 10% i bhfeidhm anois ar sheoltaí chuig SAM.', fee2: 'Cuirtear forchostas ar leith 10% a bhaineann le taraifí i bhfeidhm ar gach earra.', warning: 'D’fhéadfaí na táillí a choigeartú arís má athraíonn polasaithe taraife a thuilleadh.', link: 'Léigh an nuashonrú iomlán USA Section 122', cta: 'Tuigim' },
  pl: { title: 'Aktualizacja wysyłek do USA: Section 122', intro: 'Informujemy klientów wysyłających do USA, że stawki uległy zmianie zgodnie z najnowszymi środkami taryfowymi Section 122 obowiązującymi od dziś.', fee1: 'Na przesyłki do USA obowiązuje teraz opłata manipulacyjna 10%.', fee2: 'Dodatkowo na wszystkie produkty naliczana jest osobna dopłata 10% związana z taryfami.', warning: 'Opłaty mogą zostać ponownie zaktualizowane, jeśli polityka taryfowa ulegnie dalszym zmianom.', link: 'Przeczytaj pełną aktualizację USA Section 122', cta: 'Rozumiem' },
  ko: { title: '미국 배송 업데이트: Section 122', intro: '미국으로 발송하는 고객께 안내드립니다. 최신 Section 122 관세 조치에 따라 오늘부터 요율이 변경되었습니다.', fee1: '미국행 배송에 10% 취급 수수료가 적용됩니다.', fee2: '모든 상품에 관세 관련 10% 추가 할증이 적용됩니다.', warning: '관세 정책이 추가로 변경되면 요금이 다시 조정될 수 있습니다.', link: 'USA Section 122 전체 업데이트 보기', cta: '이해했습니다' },
  no: { title: 'USA fraktoppdatering: Section 122', intro: 'Vi informerer kunder som sender til USA om at satsene er endret under de nyeste Section 122-tarifftiltakene med virkning fra i dag.', fee1: 'Et håndteringsgebyr på 10 % gjelder nå for forsendelser til USA.', fee2: 'Et separat tariffrelatert tillegg på 10 % gjelder for alle varer.', warning: 'Kostnader kan bli justert igjen dersom tariffpolitikken endres videre.', link: 'Les hele USA Section 122-oppdateringen', cta: 'Jeg forstår' },
  sv: { title: 'USA leveransuppdatering: Section 122', intro: 'Vi informerar kunder som skickar till USA om att priserna har ändrats enligt de senaste tariffåtgärderna i Section 122, gällande från idag.', fee1: 'En hanteringsavgift på 10 % gäller nu för försändelser till USA.', fee2: 'Ett separat tariffrelaterat påslag på 10 % gäller för alla varor.', warning: 'Avgifter kan justeras igen om tariffpolitiken förändras ytterligare.', link: 'Läs hela USA Section 122-uppdateringen', cta: 'Jag förstår' },
  tl: { title: 'USA shipping update: Section 122', intro: 'Inaabisuhan namin ang mga customer na nagpapadala sa United States na nagbago ang rates sa ilalim ng pinakabagong Section 122 tariff measures na epektibo ngayong araw.', fee1: 'May 10% handling fee na ngayon para sa USA-bound shipments.', fee2: 'May dagdag na hiwalay na 10% tariff-related surcharge para sa lahat ng items.', warning: 'Maaaring baguhin muli ang charges kung magbago pa ang tariff policies.', link: 'Basahin ang buong USA Section 122 update', cta: 'Naiintindihan ko' },
  vi: { title: 'Cập nhật vận chuyển Mỹ: Section 122', intro: 'Chúng tôi thông báo tới khách hàng gửi hàng đến Hoa Kỳ rằng mức phí đã thay đổi theo các biện pháp thuế quan mới nhất của Section 122 có hiệu lực từ hôm nay.', fee1: 'Phí xử lý 10% hiện áp dụng cho các lô hàng đi Mỹ.', fee2: 'Phụ phí riêng 10% liên quan đến thuế quan áp dụng cho tất cả mặt hàng.', warning: 'Mức phí có thể được điều chỉnh lại nếu chính sách thuế quan tiếp tục thay đổi.', link: 'Đọc cập nhật đầy đủ USA Section 122', cta: 'Tôi đã hiểu' },
  fi: { title: 'USA toimituspäivitys: Section 122', intro: 'Ilmoitamme Yhdysvaltoihin lähettäville asiakkaille, että hinnat ovat muuttuneet uusimpien Section 122 -tariffitoimien mukaisesti, voimaan tänään.', fee1: 'Yhdysvaltoihin meneville lähetyksille sovelletaan nyt 10 % käsittelymaksua.', fee2: 'Lisäksi kaikkiin tuotteisiin sovelletaan erillinen 10 % tariffiin liittyvä lisämaksu.', warning: 'Maksuja voidaan päivittää uudelleen, jos tariffipolitiikka muuttuu lisää.', link: 'Lue koko USA Section 122 -päivitys', cta: 'Ymmärrän' },
  ru: { title: 'Обновление доставки в США: Section 122', intro: 'Сообщаем клиентам, отправляющим в США, что тарифы изменены в соответствии с последними мерами Section 122, действующими с сегодняшнего дня.', fee1: 'Для отправлений в США теперь применяется сбор за обработку 10%.', fee2: 'На все товары дополнительно применяется отдельная надбавка 10%, связанная с тарифами.', warning: 'Начисления могут быть снова скорректированы при дальнейших изменениях тарифной политики.', link: 'Читать полное обновление USA Section 122', cta: 'Понятно' },
  cy: { title: 'Diweddariad cludo UDA: Section 122', intro: 'Rydym yn hysbysu cwsmeriaid sy’n anfon i’r Unol Daleithiau fod cyfraddau wedi newid o dan y mesurau tariff diweddaraf Section 122 sy’n weithredol heddiw.', fee1: 'Mae ffi trin 10% bellach yn berthnasol i lwythi sy’n mynd i UDA.', fee2: 'Mae gordal tariff ar wahân o 10% yn berthnasol i bob eitem.', warning: 'Gall taliadau gael eu haddasu eto os bydd polisïau tariff yn newid ymhellach.', link: 'Darllenwch y diweddariad llawn USA Section 122', cta: 'Rwy’n deall' },
  ta: { title: 'அமெரிக்கா அனுப்புதல் புதுப்பிப்பு: Section 122', intro: 'அமெரிக்காவுக்கு அனுப்பும் வாடிக்கையாளர்களுக்கு அறிவிப்பு: சமீபத்திய Section 122 சுங்கக் கொள்கை நடவடிக்கைகளின்படி கட்டணங்கள் இன்று முதல் மாற்றப்பட்டுள்ளன.', fee1: 'அமெரிக்கா நோக்கி அனுப்புதல்களுக்கு இப்போது 10% கையாளும் கட்டணம் பொருந்தும்.', fee2: 'அனைத்து பொருட்களுக்கும் கூடுதலாக 10% சுங்கத் தொடர்பான கட்டணம் விதிக்கப்படும்.', warning: 'சுங்கக் கொள்கைகள் மேலும் மாறினால் கட்டணங்கள் மீண்டும் மாற்றப்படலாம்.', link: 'முழு USA Section 122 புதுப்பிப்பைப் படிக்க', cta: 'நான் புரிந்துகொண்டேன்' },
};

function isLocalhostHost() {
  if (typeof window === 'undefined') return false;
  const host = (window.location.hostname || '').toLowerCase();
  return host === 'localhost' || host === '127.0.0.1' || host === '::1';
}

function normalizePath(pathname) {
  if (!pathname || typeof pathname !== 'string') return '/';
  if (pathname === '/') return '/';
  return pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
}

function getCountryOverrideFromUrl() {
  if (typeof window === 'undefined') return '';

  const params = new URLSearchParams(window.location.search);
  const fromQuery = normalizeCountryCode(params.get('country') || params.get('adminCountry') || '');
  if (fromQuery) return fromQuery;

  const pathname = window.location.pathname || '';
  if (pathname.startsWith('/country=')) {
    return normalizeCountryCode(pathname.slice('/country='.length).split('/')[0] || '');
  }

  return '';
}

function detectUSFromGeoData(geoData) {
  if (!geoData || typeof geoData !== 'object') return false;

  const directCandidates = [
    geoData.countryCode,
    geoData.allowedIpCountry,
    geoData.detectedCountryCode,
    geoData.secondaryCountryCode,
    geoData.localeCountryCode,
    geoData.estimatedActualCountry,
  ]
    .map((code) => normalizeCountryCode(code || ''))
    .filter(Boolean);

  const signalCandidates = Array.isArray(geoData.signalCountries)
    ? geoData.signalCountries.map((code) => normalizeCountryCode(code || '')).filter(Boolean)
    : [];

  return [...directCandidates, ...signalCandidates].includes('US');
}

function getPopupText(languageCode) {
  const normalized = String(languageCode || 'en').toLowerCase();
  if (normalized === 'zh-tw' || normalized === 'zh-hk' || normalized === 'zh-hant' || normalized === 'yue') {
    return POPUP_I18N['zh-hant'];
  }
  if (normalized.startsWith('zh')) {
    return POPUP_I18N.zh;
  }
  return POPUP_I18N[normalized] || POPUP_I18N.en;
}

export function USSection122Popup() {
  const { language } = useLanguage();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [selectionTick, setSelectionTick] = useState(0);

  useEffect(() => {
    const onLanguageSelected = () => {
      setSelectionTick((value) => value + 1);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener(LANGUAGE_SELECTION_EVENT, onLanguageSelected);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener(LANGUAGE_SELECTION_EVENT, onLanguageSelected);
      }
    };
  }, []);

  useEffect(() => {
    let isActive = true;

    const shouldCheckPath = TARGET_PATHS.has(normalizePath(pathname || ''));
    if (!shouldCheckPath) {
      setIsOpen(false);
      return () => {
        isActive = false;
      };
    }

    const hasClearedCaptcha = (() => {
      try {
        if (isLocalhostHost()) return true;
        return sessionStorage.getItem(ACCESS_TAB_SESSION_KEY) === '1';
      } catch (_) {
        return false;
      }
    })();

    const hasSelectedLanguage = (() => {
      try {
        return sessionStorage.getItem(LANGUAGE_SELECTED_SESSION_KEY) === '1';
      } catch (_) {
        return false;
      }
    })();

    if (!hasClearedCaptcha || !hasSelectedLanguage) {
      setIsOpen(false);
      return () => {
        isActive = false;
      };
    }

    const detectAndShow = async () => {
      const detectedCountryOverride = getCountryOverrideFromUrl();

      if (!detectedCountryOverride) {
        try {
          const geoData = await detectLanguageFromIPWithRestrictions();
          const shouldShowForUS = detectUSFromGeoData(geoData);
          if (!isActive) return;
          setIsOpen(shouldShowForUS);
          return;
        } catch (_) {
          if (!isActive) return;
          setIsOpen(false);
          return;
        }
      }

      if (!isActive) return;
      setIsOpen(detectedCountryOverride === 'US');
    };

    detectAndShow();

    return () => {
      isActive = false;
    };
  }, [pathname, language, selectionTick]);

  if (!isOpen) return null;

  const popupText = getPopupText(language);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="us-section-122-title"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.55)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        zIndex: 1001,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '700px',
          maxHeight: '88vh',
          overflowY: 'auto',
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          padding: '20px',
          boxShadow: '0 16px 40px rgba(0,0,0,0.2)',
        }}
      >
        <h2 id="us-section-122-title" style={{ margin: '0 0 10px', color: '#111827' }}>
          {popupText.title}
        </h2>

        <p style={{ marginTop: 0, marginBottom: '10px', color: '#374151', lineHeight: 1.5 }}>
          {popupText.intro}
        </p>

        <div style={{ marginBottom: '12px', padding: '12px', borderRadius: '8px', background: '#f3f4f6', color: '#1f2937' }}>
          <ul style={{ margin: 0, paddingLeft: '18px', lineHeight: 1.5 }}>
            <li>{popupText.fee1}</li>
            <li>{popupText.fee2}</li>
          </ul>
        </div>

        <p style={{ marginTop: 0, marginBottom: '16px', color: '#b91c1c', fontWeight: 700 }}>
          {popupText.warning}
        </p>

        <p style={{ marginTop: 0, marginBottom: '16px' }}>
          <Link href="/blog/usa-section-122">{popupText.link}</Link>
        </p>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
            }}
            style={{
              padding: '10px 14px',
              border: 'none',
              borderRadius: '8px',
              background: '#2563eb',
              color: '#fff',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {popupText.cta}
          </button>
        </div>
      </div>
    </div>
  );
}

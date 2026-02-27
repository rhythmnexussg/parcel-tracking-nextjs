"use client";

import { useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import { detectLanguageFromIPWithRestrictions, normalizeCountryCode } from '../ipGeolocation';
import { useLanguage } from '../LanguageContext';

const PHONE_POPUP_LANGUAGE_TRIGGER_KEY = 'rnx_language_selection_event';

const TARGET_PATHS = new Set(['/', '/track-your-item']);

function normalizePath(pathname) {
  if (!pathname || typeof pathname !== 'string') return '/';
  if (pathname === '/') return '/';
  return pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
}

const EU_PHONE_REQUIRED_COUNTRIES = new Set([
  'AT', 'BE', 'CZ', 'FI', 'FR', 'DE', 'IE', 'IT', 'NL', 'PL', 'PT', 'ES', 'SE',
]);

const OTHER_PHONE_REQUIRED_COUNTRIES = new Set([
  'US', 'GB', 'NO', 'CH', 'CN', 'IN', 'ID', 'PH', 'KR', 'TW', 'VN',
]);

const STRICT_CUSTOMS_PHONE_REQUIRED_COUNTRIES = new Set(['CN', 'IN', 'ID', 'PH', 'KR', 'TW', 'VN']);

function normalizeLanguageCode(languageCode) {
  const lang = String(languageCode || 'en').toLowerCase();
  if (lang.startsWith('zh-hant') || lang === 'zh-tw' || lang === 'zh-hk' || lang === 'yue') return 'zh-hant';
  if (lang.startsWith('zh')) return 'zh';
  return lang;
}

const POPUP_UI_TEXT = {
  en: {
    title: 'Important: Phone number required for Etsy orders',
    detectedPrefix: 'We detected access from',
    detectedSuffix: 'For orders shipped to this destination, Etsy buyers must provide a valid recipient phone number.',
    whyTitle: 'Why this is required',
    detailsTitle: 'Full reason details',
    warning: 'Missing recipient phone number may cause customs/delivery delays or order cancellation.',
    acknowledge: 'I understand',
  },
  zh: {
    title: '重要提示：Etsy 订单发货需提供电话号码',
    detectedPrefix: '我们检测到您从',
    detectedSuffix: '访问。发往该目的地的 Etsy 订单必须提供有效收件人电话号码。',
    whyTitle: '为何需要提供',
    detailsTitle: '完整原因说明',
    warning: '若未提供收件人电话号码，可能导致清关/派送延误或订单被取消。',
    acknowledge: '我已了解',
  },
  'zh-hant': {
    title: '重要提示：Etsy 訂單出貨需提供電話號碼',
    detectedPrefix: '我們偵測到您從',
    detectedSuffix: '存取。寄送至此目的地的 Etsy 訂單必須提供有效收件人電話號碼。',
    whyTitle: '為何需要提供',
    detailsTitle: '完整原因說明',
    warning: '若未提供收件人電話，可能造成清關/配送延誤或訂單取消。',
    acknowledge: '我已了解',
  },
  cs: {
    title: 'Důležité: Telefonní číslo je pro objednávky Etsy povinné',
    detectedPrefix: 'Zjistili jsme přístup z',
    detectedSuffix: 'Pro zásilky do této destinace musí kupující na Etsy uvést platné telefonní číslo příjemce.',
    whyTitle: 'Proč je to vyžadováno',
    detailsTitle: 'Úplné důvody',
    warning: 'Neuvedení telefonního čísla příjemce může způsobit zpoždění celního/doručovacího procesu nebo zrušení objednávky.',
    acknowledge: 'Rozumím',
  },
  nl: {
    title: 'Belangrijk: Telefoonnummer vereist voor Etsy-bestellingen',
    detectedPrefix: 'We hebben toegang gedetecteerd vanuit',
    detectedSuffix: 'Voor verzending naar deze bestemming moeten Etsy-kopers een geldig telefoonnummer van de ontvanger opgeven.',
    whyTitle: 'Waarom dit vereist is',
    detailsTitle: 'Volledige redenen',
    warning: 'Ontbrekend telefoonnummer van de ontvanger kan leiden tot douane-/bezorgvertragingen of annulering van de bestelling.',
    acknowledge: 'Ik begrijp het',
  },
  fi: {
    title: 'Tärkeää: Puhelinnumero vaaditaan Etsy-tilauksille',
    detectedPrefix: 'Havaitsimme käytön maasta',
    detectedSuffix: 'Tähän kohteeseen lähetettävissä Etsy-tilauksissa on annettava vastaanottajan voimassa oleva puhelinnumero.',
    whyTitle: 'Miksi tätä vaaditaan',
    detailsTitle: 'Täydelliset perustelut',
    warning: 'Vastaanottajan puhelinnumeron puuttuminen voi aiheuttaa tulli-/toimitusviiveitä tai tilauksen peruuntumisen.',
    acknowledge: 'Ymmärrän',
  },
  fr: {
    title: 'Important : Numéro de téléphone requis pour les commandes Etsy',
    detectedPrefix: 'Nous avons détecté un accès depuis',
    detectedSuffix: 'Pour les expéditions vers cette destination, les acheteurs Etsy doivent fournir un numéro de téléphone valide du destinataire.',
    whyTitle: 'Pourquoi cela est requis',
    detailsTitle: 'Détails complets des raisons',
    warning: 'L’absence de numéro de téléphone du destinataire peut entraîner des retards douaniers/de livraison ou l’annulation de la commande.',
    acknowledge: 'Je comprends',
  },
  de: {
    title: 'Wichtig: Telefonnummer für Etsy-Bestellungen erforderlich',
    detectedPrefix: 'Wir haben einen Zugriff aus',
    detectedSuffix: 'erkannt. Für Sendungen an dieses Ziel müssen Etsy-Käufer eine gültige Telefonnummer des Empfängers angeben.',
    whyTitle: 'Warum dies erforderlich ist',
    detailsTitle: 'Vollständige Begründung',
    warning: 'Fehlt die Telefonnummer des Empfängers, kann es zu Zoll-/Lieferverzögerungen oder zur Stornierung der Bestellung kommen.',
    acknowledge: 'Ich verstehe',
  },
  he: {
    title: 'חשוב: נדרש מספר טלפון להזמנות Etsy',
    detectedPrefix: 'זוהתה גישה מ-',
    detectedSuffix: '. למשלוחים ליעד זה, קוני Etsy חייבים לספק מספר טלפון תקין של הנמען.',
    whyTitle: 'למה זה נדרש',
    detailsTitle: 'פירוט מלא של הסיבות',
    warning: 'אי מסירת מספר טלפון של הנמען עלולה לגרום לעיכובי מכס/משלוח או לביטול ההזמנה.',
    acknowledge: 'הבנתי',
  },
  hi: {
    title: 'महत्वपूर्ण: Etsy ऑर्डर के लिए फोन नंबर आवश्यक है',
    detectedPrefix: 'हमने पहुँच का देश पहचाना:',
    detectedSuffix: 'इस गंतव्य पर भेजे जाने वाले Etsy ऑर्डर के लिए प्राप्तकर्ता का वैध फोन नंबर देना आवश्यक है।',
    whyTitle: 'यह क्यों आवश्यक है',
    detailsTitle: 'पूर्ण कारण विवरण',
    warning: 'प्राप्तकर्ता का फोन नंबर न देने पर कस्टम/डिलीवरी में देरी या ऑर्डर रद्द हो सकता है।',
    acknowledge: 'मैं समझ गया/गई',
  },
  id: {
    title: 'Penting: Nomor telepon wajib untuk pesanan Etsy',
    detectedPrefix: 'Kami mendeteksi akses dari',
    detectedSuffix: 'Untuk pesanan Etsy yang dikirim ke tujuan ini, pembeli harus memberikan nomor telepon penerima yang valid.',
    whyTitle: 'Mengapa ini diperlukan',
    detailsTitle: 'Rincian alasan lengkap',
    warning: 'Tidak adanya nomor telepon penerima dapat menyebabkan keterlambatan bea cukai/pengiriman atau pembatalan pesanan.',
    acknowledge: 'Saya mengerti',
  },
  ga: {
    title: 'Tábhachtach: Tá uimhir fóin riachtanach d’orduithe Etsy',
    detectedPrefix: 'Bhraiteamar rochtain ó',
    detectedSuffix: 'Le haghaidh seachadta chuig an gceann scríbe seo, caithfidh ceannaitheoirí Etsy uimhir bhailí faighteora a sholáthar.',
    whyTitle: 'Cén fáth a bhfuil sé seo riachtanach',
    detailsTitle: 'Sonraí iomlána ar na cúiseanna',
    warning: 'Mura soláthraítear uimhir an fhaighteora, d’fhéadfadh moilleanna custaim/seachadta nó cealú ordaithe tarlú.',
    acknowledge: 'Tuigim',
  },
  it: {
    title: 'Importante: Numero di telefono richiesto per ordini Etsy',
    detectedPrefix: 'Abbiamo rilevato l’accesso da',
    detectedSuffix: 'Per le spedizioni verso questa destinazione, gli acquirenti Etsy devono fornire un numero valido del destinatario.',
    whyTitle: 'Perché è richiesto',
    detailsTitle: 'Dettagli completi dei motivi',
    warning: 'La mancanza del numero del destinatario può causare ritardi doganali/di consegna o annullamento dell’ordine.',
    acknowledge: 'Ho capito',
  },
  mi: {
    title: 'He mea nui: Me tuku nama waea mō ngā ota Etsy',
    detectedPrefix: 'Kua kitea te urunga mai i',
    detectedSuffix: 'Mō ngā ota Etsy ka tukuna ki tēnei wāhi, me tuku he nama waea tika a te kaiwhiwhi.',
    whyTitle: 'He aha i hiahiatia ai tēnei',
    detailsTitle: 'Ngā taipitopito katoa o ngā take',
    warning: 'Ki te kore e tukuna te nama waea a te kaiwhiwhi, ka roa pea te tuku/mana kāwana, ka whakakorea rānei te ota.',
    acknowledge: 'Kua mārama',
  },
  ja: {
    title: '重要：Etsy注文には電話番号が必要です',
    detectedPrefix: 'アクセス元を確認しました：',
    detectedSuffix: 'この配送先への Etsy 注文では、受取人の有効な電話番号が必要です。',
    whyTitle: '必要な理由',
    detailsTitle: '詳細な理由',
    warning: '受取人の電話番号がない場合、通関/配達の遅延や注文キャンセルの原因となる可能性があります。',
    acknowledge: '理解しました',
  },
  ko: {
    title: '중요: Etsy 주문에는 전화번호가 필요합니다',
    detectedPrefix: '접속 국가가 확인되었습니다:',
    detectedSuffix: '이 목적지로 배송되는 Etsy 주문에는 수취인의 유효한 전화번호가 필요합니다.',
    whyTitle: '필요한 이유',
    detailsTitle: '상세 사유',
    warning: '수취인 전화번호가 없으면 통관/배송 지연 또는 주문 취소가 발생할 수 있습니다.',
    acknowledge: '확인했습니다',
  },
  ms: {
    title: 'Penting: Nombor telefon diperlukan untuk pesanan Etsy',
    detectedPrefix: 'Kami mengesan akses dari',
    detectedSuffix: 'Bagi pesanan Etsy ke destinasi ini, pembeli mesti memberikan nombor telefon penerima yang sah.',
    whyTitle: 'Mengapa ini diperlukan',
    detailsTitle: 'Butiran sebab penuh',
    warning: 'Ketiadaan nombor telefon penerima boleh menyebabkan kelewatan kastam/penghantaran atau pembatalan pesanan.',
    acknowledge: 'Saya faham',
  },
  no: {
    title: 'Viktig: Telefonnummer kreves for Etsy-bestillinger',
    detectedPrefix: 'Vi oppdaget tilgang fra',
    detectedSuffix: 'For Etsy-bestillinger til denne destinasjonen må kjøper oppgi gyldig telefonnummer til mottaker.',
    whyTitle: 'Hvorfor dette kreves',
    detailsTitle: 'Fullstendige årsaksdetaljer',
    warning: 'Manglende telefonnummer kan føre til toll-/leveringsforsinkelser eller kansellering av bestilling.',
    acknowledge: 'Jeg forstår',
  },
  pl: {
    title: 'Ważne: Numer telefonu wymagany dla zamówień Etsy',
    detectedPrefix: 'Wykryliśmy dostęp z',
    detectedSuffix: 'W przypadku wysyłek do tego kraju kupujący Etsy muszą podać ważny numer odbiorcy.',
    whyTitle: 'Dlaczego jest to wymagane',
    detailsTitle: 'Pełne szczegóły powodów',
    warning: 'Brak numeru telefonu odbiorcy może spowodować opóźnienia celne/dostawy lub anulowanie zamówienia.',
    acknowledge: 'Rozumiem',
  },
  pt: {
    title: 'Importante: Número de telefone obrigatório para pedidos Etsy',
    detectedPrefix: 'Detectámos acesso a partir de',
    detectedSuffix: 'Para envios para este destino, compradores Etsy devem fornecer um número válido do destinatário.',
    whyTitle: 'Porque isto é necessário',
    detailsTitle: 'Detalhes completos dos motivos',
    warning: 'A falta do número do destinatário pode causar atrasos alfandegários/de entrega ou cancelamento do pedido.',
    acknowledge: 'Compreendi',
  },
  ru: {
    title: 'Важно: для заказов Etsy требуется номер телефона',
    detectedPrefix: 'Обнаружен доступ из',
    detectedSuffix: 'Для отправки в эту страну покупатели Etsy должны указать действующий номер получателя.',
    whyTitle: 'Почему это требуется',
    detailsTitle: 'Полные причины',
    warning: 'Отсутствие номера получателя может привести к задержкам таможни/доставки или отмене заказа.',
    acknowledge: 'Понятно',
  },
  es: {
    title: 'Importante: Teléfono requerido para pedidos de Etsy',
    detectedPrefix: 'Hemos detectado acceso desde',
    detectedSuffix: 'Para envíos a este destino, los compradores de Etsy deben proporcionar un teléfono válido del destinatario.',
    whyTitle: 'Por qué se requiere',
    detailsTitle: 'Detalles completos de los motivos',
    warning: 'La falta del teléfono del destinatario puede causar retrasos de aduana/entrega o cancelación del pedido.',
    acknowledge: 'Entiendo',
  },
  sv: {
    title: 'Viktigt: Telefonnummer krävs för Etsy-beställningar',
    detectedPrefix: 'Vi har upptäckt åtkomst från',
    detectedSuffix: 'För beställningar till denna destination måste Etsy-köpare ange ett giltigt mottagarnummer.',
    whyTitle: 'Varför detta krävs',
    detailsTitle: 'Fullständiga skäl',
    warning: 'Saknat telefonnummer kan orsaka tull-/leveransförseningar eller annullering av beställningen.',
    acknowledge: 'Jag förstår',
  },
  ta: {
    title: 'முக்கியம்: Etsy ஆர்டர்களுக்கு தொலைபேசி எண் அவசியம்',
    detectedPrefix: 'அணுகல் கண்டறியப்பட்டது:',
    detectedSuffix: 'இந்த இடத்திற்கான Etsy ஆர்டர்களுக்கு பெறுநரின் செல்லுபடியாகும் தொலைபேசி எண் அவசியம்.',
    whyTitle: 'ஏன் இது தேவைப்படுகிறது',
    detailsTitle: 'முழு காரண விவரங்கள்',
    warning: 'பெறுநர் தொலைபேசி எண் இல்லையெனில் சுங்க/விநியோக தாமதம் அல்லது ஆர்டர் ரத்து ஏற்படலாம்.',
    acknowledge: 'நான் புரிந்துகொண்டேன்',
  },
  tl: {
    title: 'Mahalaga: Kailangan ang phone number para sa Etsy orders',
    detectedPrefix: 'Natukoy ang access mula sa',
    detectedSuffix: 'Para sa orders na ipapadala sa destinasyong ito, kailangang magbigay ng valid na numero ng recipient ang Etsy buyers.',
    whyTitle: 'Bakit ito kailangan',
    detailsTitle: 'Buong detalye ng mga dahilan',
    warning: 'Ang kawalan ng numero ng recipient ay maaaring magdulot ng customs/delivery delay o pagkansela ng order.',
    acknowledge: 'Naiintindihan ko',
  },
  th: {
    title: 'สำคัญ: คำสั่งซื้อ Etsy ต้องมีหมายเลขโทรศัพท์',
    detectedPrefix: 'ตรวจพบการเข้าถึงจาก',
    detectedSuffix: 'สำหรับการจัดส่งไปปลายทางนี้ ผู้ซื้อ Etsy ต้องระบุหมายเลขผู้รับที่ถูกต้อง',
    whyTitle: 'เหตุผลที่ต้องใช้',
    detailsTitle: 'รายละเอียดเหตุผลทั้งหมด',
    warning: 'หากไม่มีหมายเลขผู้รับ อาจทำให้ล่าช้าด้านศุลกากร/การจัดส่ง หรืออาจถูกยกเลิกคำสั่งซื้อ',
    acknowledge: 'รับทราบ',
  },
  vi: {
    title: 'Quan trọng: Đơn Etsy bắt buộc có số điện thoại',
    detectedPrefix: 'Chúng tôi phát hiện truy cập từ',
    detectedSuffix: 'Với đơn Etsy gửi đến điểm đến này, người mua phải cung cấp số điện thoại người nhận hợp lệ.',
    whyTitle: 'Vì sao cần thông tin này',
    detailsTitle: 'Chi tiết đầy đủ lý do',
    warning: 'Thiếu số điện thoại người nhận có thể gây chậm trễ hải quan/giao hàng hoặc hủy đơn hàng.',
    acknowledge: 'Tôi đã hiểu',
  },
  cy: {
    title: 'Pwysig: Mae rhif ffôn yn ofynnol ar gyfer archebion Etsy',
    detectedPrefix: 'Canfuwyd mynediad o',
    detectedSuffix: 'Ar gyfer cludo i’r gyrchfan hon, rhaid i brynwyr Etsy ddarparu rhif dilys y derbynnydd.',
    whyTitle: 'Pam mae hyn yn ofynnol',
    detailsTitle: 'Manylion llawn y rhesymau',
    warning: 'Gall diffyg rhif derbynnydd achosi oedi tollau/dosbarthu neu ganslo archeb.',
    acknowledge: 'Rwy’n deall',
  },
};

const FULL_PHONE_REQUIREMENT_REASONS = {
  en: [
    'For countries where a phone number is mandatory, this helps ensure parcels can be processed and delivered without delays.',
    'United States: Due to tariff rules requiring Delivery Duty Paid (DDP) handling for postal shipments, carriers may require a recipient phone number to keep the recipient reachable for customs clearance and delivery.',
    'European Union: Under IOSS VAT requirements, a valid recipient phone number supports VAT processing, customs clearance, and delivery coordination.',
    'UK, Switzerland, and Norway: VAT/customs collection procedures may require buyer contact details if clarification is needed during processing.',
    'China, India, Indonesia, Philippines, South Korea, Taiwan, and Vietnam: These are strict customs jurisdictions where authorities may request a recipient phone number to verify declarations or resolve shipment issues.',
    'Providing a valid number helps prevent delays, failed delivery attempts, and parcel returns. Customs or local courier/postal services may contact the recipient to clarify declaration details, import information, duties/taxes, required documents, delivery address, or delivery timing.'
  ],
  zh: [
    '在要求提供电话号码的国家，这有助于包裹顺利清关并减少延误。',
    '美国：由于邮政运输的DDP（完税后交货）规则，承运商可能要求收件人电话号码用于清关与派送联系。',
    '欧盟：根据IOSS增值税要求，收件人有效电话号码可支持VAT处理、清关与末端配送协调。',
    '英国、瑞士、挪威：在VAT/海关征收流程中，如需补充说明，可能需要联系买家。',
    '中国、印度、印尼、菲律宾、韩国、台湾、越南：这些地区海关要求较严格，可能要求收件人电话以核实申报或处理异常。',
    '提供有效电话号码可减少延误、派送失败和退件风险。海关或当地邮政/快递可能会联系收件人确认申报、税费、文件、地址或派送时间。'
  ],
  'zh-hant': [
    '在需要提供電話號碼的國家，這有助於包裹順利清關並減少延誤。',
    '美國：因郵政運輸DDP（完稅後交貨）規定，承運商可能需要收件人電話以便清關與派送聯絡。',
    '歐盟：依IOSS增值稅規定，收件人有效電話可支援VAT處理、清關與配送協調。',
    '英國、瑞士、挪威：在VAT/海關徵收流程中，如需補充說明，可能需要聯絡買家。',
    '中國、印度、印尼、菲律賓、韓國、台灣、越南：這些地區海關規範較嚴格，可能要求收件人電話以核實申報或處理異常。',
    '提供有效電話可降低延誤、派送失敗與退件風險。海關或當地郵政/快遞可能聯絡收件人確認申報、稅費、文件、地址或配送時段。'
  ],
  ru: [
    'Для стран, где номер телефона обязателен, это помогает обработке и доставке без задержек.',
    'США: из-за правил DDP для почтовых отправлений перевозчики могут требовать номер получателя для таможенного оформления и доставки.',
    'ЕС: по требованиям IOSS VAT действующий номер получателя нужен для обработки НДС, таможни и координации доставки.',
    'Великобритания, Швейцария и Норвегия: при процедурах VAT/таможни может потребоваться связь с покупателем для уточнений.',
    'Китай, Индия, Индонезия, Филиппины, Южная Корея, Тайвань и Вьетнам: в этих юрисдикциях таможня может запрашивать номер получателя для проверки деклараций.',
    'Действующий номер снижает риск задержек, неудачных попыток вручения и возвратов. Таможня или локальный перевозчик могут связаться для уточнения данных и документов.'
  ],
  fr: [
    'Dans les pays où le numéro de téléphone est obligatoire, cela facilite le traitement et la livraison sans retard.',
    'États-Unis : en raison des règles DDP pour les envois postaux, un numéro du destinataire peut être exigé pour le dédouanement et la livraison.',
    'Union européenne : selon les règles IOSS TVA, un numéro valide aide au traitement de la TVA, au dédouanement et à la coordination de livraison.',
    'Royaume-Uni, Suisse et Norvège : les procédures TVA/douanes peuvent nécessiter un contact acheteur pour clarification.',
    'Chine, Inde, Indonésie, Philippines, Corée du Sud, Taïwan et Vietnam : les autorités douanières peuvent demander un numéro pour vérifier les déclarations.',
    'Un numéro valide réduit les retards, échecs de livraison et retours. Les douanes ou le transporteur local peuvent vous contacter pour des informations supplémentaires.'
  ],
  de: [
    'In Ländern mit Telefonnummernpflicht hilft dies bei einer reibungslosen Abfertigung und Zustellung ohne Verzögerungen.',
    'USA: Aufgrund von DDP-Regeln für Postsendungen kann eine Empfängernummer für Zollabfertigung und Zustellung erforderlich sein.',
    'EU: Nach IOSS-Mehrwertsteuerregeln unterstützt eine gültige Empfängernummer die MwSt.-Bearbeitung, Zollabfertigung und Zustellkoordination.',
    'Vereinigtes Königreich, Schweiz und Norwegen: Bei VAT-/Zollverfahren kann zur Klärung ein Käuferkontakt erforderlich sein.',
    'China, Indien, Indonesien, Philippinen, Südkorea, Taiwan und Vietnam: In diesen Ländern können Zollbehörden eine Empfängernummer zur Verifikation verlangen.',
    'Eine gültige Nummer reduziert Verzögerungen, fehlgeschlagene Zustellungen und Rücksendungen. Zoll oder lokaler Zusteller kann Sie zur Klärung kontaktieren.'
  ],
  es: [
    'En los países donde el teléfono es obligatorio, esto ayuda a procesar y entregar los envíos sin demoras.',
    'Estados Unidos: por normas DDP en envíos postales, los transportistas pueden exigir el teléfono del destinatario para aduana y entrega.',
    'Unión Europea: según IOSS IVA, un teléfono válido del destinatario facilita el procesamiento de IVA, aduanas y coordinación de entrega.',
    'Reino Unido, Suiza y Noruega: los procesos de IVA/aduanas pueden requerir contacto del comprador para aclaraciones.',
    'China, India, Indonesia, Filipinas, Corea del Sur, Taiwán y Vietnam: las autoridades aduaneras pueden solicitar teléfono para verificar declaraciones.',
    'Un número válido ayuda a evitar retrasos, intentos fallidos y devoluciones. Aduanas o mensajería local pueden contactar para confirmar datos y documentación.'
  ],
  pt: [
    'Nos países onde o telefone é obrigatório, isso ajuda no processamento e entrega sem atrasos.',
    'Estados Unidos: devido às regras DDP para remessas postais, as transportadoras podem exigir telefone do destinatário para alfândega e entrega.',
    'União Europeia: sob regras IOSS IVA, um telefone válido do destinatário apoia processamento de IVA, alfândega e coordenação da entrega.',
    'Reino Unido, Suíça e Noruega: procedimentos de IVA/alfândega podem exigir contato do comprador para esclarecimentos.',
    'China, Índia, Indonésia, Filipinas, Coreia do Sul, Taiwan e Vietname: autoridades aduaneiras podem pedir telefone para verificar declarações.',
    'Um número válido reduz atrasos, falhas de entrega e devoluções. Alfândega ou correio local pode contactar para confirmar dados e documentação.'
  ],
  it: [
    'Nei Paesi in cui il numero è obbligatorio, questo aiuta la lavorazione e la consegna senza ritardi.',
    'Stati Uniti: per le regole DDP sulle spedizioni postali, i corrieri possono richiedere il numero del destinatario per dogana e consegna.',
    'Unione Europea: secondo IOSS IVA, un numero valido del destinatario supporta IVA, sdoganamento e coordinamento consegna.',
    'Regno Unito, Svizzera e Norvegia: le procedure IVA/doganali possono richiedere il contatto dell’acquirente per chiarimenti.',
    'Cina, India, Indonesia, Filippine, Corea del Sud, Taiwan e Vietnam: le autorità doganali possono richiedere un numero per verificare le dichiarazioni.',
    'Un numero valido riduce ritardi, consegne fallite e resi. Dogana o corriere locale possono contattare il destinatario per conferme e documenti.'
  ],
  ja: [
    '電話番号が必須の国では、通関・配達を円滑にし遅延を減らすために必要です。',
    '米国：郵便発送におけるDDP規則により、通関や配達連絡のため受取人電話番号が必要になる場合があります。',
    'EU：IOSS VAT規則に基づき、受取人の有効な電話番号はVAT処理・通関・配達調整に必要です。',
    '英国・スイス・ノルウェー：VAT/通関手続きで確認が必要な場合、購入者への連絡先が求められることがあります。',
    '中国・インド・インドネシア・フィリピン・韓国・台湾・ベトナム：申告確認や問題解決のため受取人電話番号を求められる場合があります。',
    '有効な電話番号は遅延・配達失敗・返送の防止に役立ちます。税関や現地配送業者が詳細確認のため連絡する場合があります。'
  ],
  ko: [
    '전화번호가 의무인 국가에서는 통관 및 배송 지연을 줄이기 위해 필요합니다.',
    '미국: 우편 발송 DDP 규정으로 인해 통관 및 배송 연락을 위해 수취인 전화번호가 요구될 수 있습니다.',
    '유럽연합: IOSS VAT 규정에 따라 유효한 수취인 전화번호가 VAT 처리, 통관 및 배송 조정에 필요합니다.',
    '영국·스위스·노르웨이: VAT/통관 절차에서 확인이 필요한 경우 구매자 연락처가 필요할 수 있습니다.',
    '중국·인도·인도네시아·필리핀·대한민국·대만·베트남: 엄격한 통관 지역으로 신고 확인을 위해 전화번호를 요구할 수 있습니다.',
    '유효한 번호는 지연, 배송 실패, 반송을 줄여줍니다. 세관 또는 현지 배송사가 세부 확인을 위해 연락할 수 있습니다.'
  ],
  hi: [
    'जिन देशों में फोन नंबर अनिवार्य है, वहाँ यह पार्सल की प्रोसेसिंग और डिलीवरी बिना देरी सुनिश्चित करने में मदद करता है।',
    'संयुक्त राज्य अमेरिका: पोस्टल शिपमेंट के DDP नियमों के कारण कस्टम क्लियरेंस और डिलीवरी संपर्क हेतु प्राप्तकर्ता का फोन नंबर आवश्यक हो सकता है।',
    'यूरोपीय संघ: IOSS VAT नियमों के तहत वैध प्राप्तकर्ता फोन नंबर VAT प्रोसेसिंग, कस्टम क्लियरेंस और डिलीवरी समन्वय में मदद करता है।',
    'यूके, स्विट्ज़रलैंड और नॉर्वे: VAT/कस्टम प्रक्रियाओं में स्पष्टीकरण के लिए खरीदार से संपर्क आवश्यक हो सकता है।',
    'चीन, भारत, इंडोनेशिया, फिलीपींस, दक्षिण कोरिया, ताइवान और वियतनाम: इन क्षेत्रों में कस्टम अधिकारी घोषणा सत्यापन हेतु फोन नंबर मांग सकते हैं।',
    'वैध नंबर देरी, असफल डिलीवरी और रिटर्न कम करता है। कस्टम या स्थानीय कूरियर विवरण/दस्तावेज़ सत्यापन के लिए संपर्क कर सकते हैं।'
  ],
  id: [
    'Di negara yang mewajibkan nomor telepon, ini membantu pemrosesan dan pengiriman paket tanpa keterlambatan.',
    'Amerika Serikat: karena aturan DDP untuk kiriman pos, kurir dapat meminta nomor penerima untuk bea cukai dan pengantaran.',
    'Uni Eropa: sesuai aturan IOSS VAT, nomor penerima yang valid mendukung pemrosesan VAT, bea cukai, dan koordinasi pengiriman.',
    'Inggris, Swiss, dan Norwegia: prosedur VAT/bea cukai dapat memerlukan kontak pembeli untuk klarifikasi.',
    'Tiongkok, India, Indonesia, Filipina, Korea Selatan, Taiwan, dan Vietnam: otoritas bea cukai dapat meminta nomor penerima untuk verifikasi deklarasi.',
    'Nomor valid membantu mencegah keterlambatan, gagal kirim, dan retur. Bea cukai/kurir lokal dapat menghubungi penerima untuk klarifikasi detail.'
  ],
  ms: [
    'Bagi negara yang mewajibkan nombor telefon, ini membantu pemprosesan dan penghantaran tanpa kelewatan.',
    'Amerika Syarikat: disebabkan peraturan DDP untuk penghantaran pos, pembawa mungkin memerlukan nombor penerima untuk kastam dan penghantaran.',
    'Kesatuan Eropah: di bawah peraturan IOSS VAT, nombor penerima yang sah menyokong pemprosesan VAT, kastam dan koordinasi penghantaran.',
    'UK, Switzerland dan Norway: prosedur VAT/kastam mungkin memerlukan hubungan pembeli untuk penjelasan.',
    'China, India, Indonesia, Filipina, Korea Selatan, Taiwan dan Vietnam: pihak kastam mungkin meminta nombor penerima untuk semakan deklarasi.',
    'Nombor yang sah membantu mengurangkan kelewatan, kegagalan penghantaran dan pemulangan. Kastam/kurier tempatan boleh menghubungi penerima untuk pengesahan maklumat.'
  ],
  th: [
    'สำหรับประเทศที่ต้องใช้หมายเลขโทรศัพท์ ข้อมูลนี้ช่วยให้พัสดุผ่านพิธีการและจัดส่งได้โดยลดความล่าช้า',
    'สหรัฐอเมริกา: ตามข้อกำหนด DDP สำหรับการส่งทางไปรษณีย์ ผู้ขนส่งอาจต้องใช้หมายเลขผู้รับเพื่อเคลียร์ศุลกากรและติดต่อการจัดส่ง',
    'สหภาพยุโรป: ภายใต้ข้อกำหนด IOSS VAT จำเป็นต้องมีหมายเลขโทรศัพท์ผู้รับที่ถูกต้องเพื่อรองรับ VAT ศุลกากร และการประสานงานจัดส่ง',
    'สหราชอาณาจักร สวิตเซอร์แลนด์ และนอร์เวย์: ขั้นตอน VAT/ศุลกากรอาจต้องติดต่อผู้ซื้อเพื่อยืนยันข้อมูล',
    'จีน อินเดีย อินโดนีเซีย ฟิลิปปินส์ เกาหลีใต้ ไต้หวัน และเวียดนาม: ศุลกากรอาจขอหมายเลขผู้รับเพื่อยืนยันเอกสารสำแดงหรือแก้ไขปัญหาพัสดุ',
    'หมายเลขที่ถูกต้องช่วยลดความล่าช้า การส่งไม่สำเร็จ และการตีกลับ ศุลกากรหรือผู้ให้บริการขนส่งท้องถิ่นอาจติดต่อผู้รับเพื่อยืนยันรายละเอียดเพิ่มเติม'
  ],
  vi: [
    'Tại các quốc gia bắt buộc số điện thoại, thông tin này giúp xử lý và giao hàng nhanh hơn, giảm chậm trễ.',
    'Hoa Kỳ: do quy định DDP với bưu gửi quốc tế, đơn vị vận chuyển có thể yêu cầu số điện thoại người nhận để thông quan và giao hàng.',
    'Liên minh Châu Âu: theo quy định IOSS VAT, số điện thoại hợp lệ hỗ trợ xử lý VAT, thông quan và điều phối giao hàng.',
    'Vương quốc Anh, Thụy Sĩ và Na Uy: quy trình VAT/hải quan có thể cần liên hệ người mua để làm rõ thông tin.',
    'Trung Quốc, Ấn Độ, Indonesia, Philippines, Hàn Quốc, Đài Loan và Việt Nam: hải quan có thể yêu cầu số người nhận để xác minh khai báo.',
    'Số hợp lệ giúp giảm chậm trễ, giao thất bại và hoàn hàng. Hải quan/đơn vị chuyển phát địa phương có thể liên hệ để xác nhận chi tiết hồ sơ.'
  ],
  nl: [
    'In landen waar een telefoonnummer verplicht is, helpt dit bij snelle verwerking en levering zonder vertraging.',
    'Verenigde Staten: door DDP-regels voor postzendingen kan een ontvangersnummer nodig zijn voor douane en bezorging.',
    'Europese Unie: onder IOSS-btwregels ondersteunt een geldig nummer btw-verwerking, douane en bezorgcoördinatie.',
    'Verenigd Koninkrijk, Zwitserland en Noorwegen: btw-/douaneprocedures kunnen contact met de koper vereisen voor verduidelijking.',
    'China, India, Indonesië, Filipijnen, Zuid-Korea, Taiwan en Vietnam: douane kan een nummer vragen om aangiften te verifiëren.',
    'Een geldig nummer helpt vertragingen, mislukte bezorgingen en retouren te voorkomen. Douane of lokale vervoerder kan contact opnemen voor aanvullende gegevens.'
  ],
  pl: [
    'W krajach, gdzie numer telefonu jest obowiązkowy, pomaga to w sprawnej odprawie i dostawie bez opóźnień.',
    'USA: ze względu na zasady DDP dla przesyłek pocztowych przewoźnik może wymagać numeru odbiorcy do odprawy celnej i doręczenia.',
    'Unia Europejska: zgodnie z zasadami IOSS VAT ważny numer wspiera rozliczenie VAT, odprawę celną i koordynację dostawy.',
    'Wielka Brytania, Szwajcaria i Norwegia: procedury VAT/celne mogą wymagać kontaktu z kupującym w celu wyjaśnień.',
    'Chiny, Indie, Indonezja, Filipiny, Korea Południowa, Tajwan i Wietnam: organy celne mogą wymagać numeru odbiorcy do weryfikacji deklaracji.',
    'Ważny numer ogranicza opóźnienia, nieudane doręczenia i zwroty. Urząd celny lub lokalny przewoźnik może kontaktować się w sprawie danych i dokumentów.'
  ],
  sv: [
    'I länder där telefonnummer är obligatoriskt hjälper detta till att undvika förseningar i tull och leverans.',
    'USA: på grund av DDP-regler för postförsändelser kan transportörer kräva mottagarens telefonnummer för tullklarering och leveranskontakt.',
    'EU: enligt IOSS-momsregler krävs ett giltigt mottagarnummer för momsbehandling, tull och leveranssamordning.',
    'Storbritannien, Schweiz och Norge: VAT-/tullprocesser kan kräva kontakt med köparen för förtydliganden.',
    'Kina, Indien, Indonesien, Filippinerna, Sydkorea, Taiwan och Vietnam: tullmyndigheter kan kräva mottagarnummer för att verifiera deklarationer.',
    'Ett giltigt nummer minskar förseningar, misslyckade leveranser och returer. Tull eller lokal transportör kan kontakta mottagaren för ytterligare uppgifter.'
  ],
  fi: [
    'Maissa, joissa puhelinnumero on pakollinen, tämä auttaa käsittelyä ja toimitusta ilman viivästyksiä.',
    'Yhdysvallat: postilähetysten DDP-sääntöjen vuoksi kuljetusyhtiö voi vaatia vastaanottajan puhelinnumeron tulliselvitystä ja toimitusta varten.',
    'Euroopan unioni: IOSS-ALV-sääntöjen mukaan vastaanottajan voimassa oleva numero tukee ALV-käsittelyä, tullia ja toimituksen koordinointia.',
    'Yhdistynyt kuningaskunta, Sveitsi ja Norja: ALV-/tullimenettelyt voivat edellyttää ostajan yhteystietoja tarkennuksia varten.',
    'Kiina, Intia, Indonesia, Filippiinit, Etelä-Korea, Taiwan ja Vietnam: tulliviranomaiset voivat pyytää numeroa ilmoitusten varmistamiseksi.',
    'Voimassa oleva numero vähentää viiveitä, epäonnistuneita toimituksia ja palautuksia. Tulli tai paikallinen jakelija voi ottaa yhteyttä lisätietoja varten.'
  ],
  no: [
    'I land der telefonnummer er påkrevd, bidrar dette til raskere behandling og levering uten forsinkelser.',
    'USA: på grunn av DDP-regler for postsendinger kan transportører kreve mottakers telefonnummer for tollklarering og levering.',
    'EU: under IOSS-mva-regler kreves gyldig mottakernummer for mva-behandling, toll og leveringskoordinering.',
    'Storbritannia, Sveits og Norge: VAT-/tollprosedyrer kan kreve kontakt med kjøper for avklaringer.',
    'Kina, India, Indonesia, Filippinene, Sør-Korea, Taiwan og Vietnam: tollmyndigheter kan be om mottakernummer for å verifisere deklarasjoner.',
    'Et gyldig nummer reduserer forsinkelser, mislykkede leveringer og returer. Toll eller lokal transportør kan kontakte mottakeren for bekreftelser.'
  ],
  cs: [
    'V zemích, kde je telefonní číslo povinné, to pomáhá zpracování a doručení bez zpoždění.',
    'USA: kvůli pravidlům DDP pro poštovní zásilky může dopravce požadovat číslo příjemce pro celní odbavení a doručení.',
    'Evropská unie: podle pravidel IOSS DPH je platné číslo příjemce důležité pro zpracování DPH, clo a koordinaci doručení.',
    'Spojené království, Švýcarsko a Norsko: postupy DPH/cel mohou vyžadovat kontakt kupujícího pro upřesnění.',
    'Čína, Indie, Indonésie, Filipíny, Jižní Korea, Tchaj-wan a Vietnam: celní orgány mohou požadovat číslo příjemce k ověření deklarací.',
    'Platné číslo pomáhá předcházet zpožděním, neúspěšnému doručení a vrácení. Celní úřad nebo místní dopravce může kontaktovat příjemce kvůli doplnění údajů.'
  ],
  he: [
    'במדינות שבהן מספר טלפון הוא חובה, הדבר מסייע לעיבוד ולמסירה ללא עיכובים.',
    'ארצות הברית: עקב כללי DDP למשלוחים בדואר, מובילים עשויים לדרוש מספר טלפון של הנמען לצורך שחרור ממכס ותיאום מסירה.',
    'האיחוד האירופי: לפי כללי IOSS VAT, נדרש מספר טלפון תקין של הנמען לעיבוד מע״מ, מכס ותיאום מסירה.',
    'בריטניה, שווייץ ונורווגיה: תהליכי VAT/מכס עשויים לדרוש יצירת קשר עם הקונה לצורך הבהרות.',
    'סין, הודו, אינדונזיה, הפיליפינים, דרום קוריאה, טאיוואן ווייטנאם: רשויות המכס עשויות לבקש מספר טלפון לאימות הצהרות.',
    'מספר תקין מסייע לצמצם עיכובים, כשלי מסירה והחזרות. המכס או חברת משלוחים מקומית עשויים ליצור קשר להשלמת פרטים ומסמכים.'
  ],
  ta: [
    'தொலைபேசி எண் கட்டாயமான நாடுகளில், இது பார்சல் செயலாக்கம் மற்றும் விநியோக தாமதங்களை குறைக்க உதவுகிறது.',
    'அமெரிக்கா: அஞ்சல் அனுப்புதலுக்கான DDP விதிகளால், சுங்க அனுமதி மற்றும் விநியோக தொடர்புக்கு பெறுநரின் தொலைபேசி எண் தேவையாக இருக்கலாம்.',
    'ஐரோப்பிய ஒன்றியம்: IOSS VAT விதிகளின் கீழ், VAT செயலாக்கம், சுங்க அனுமதி மற்றும் விநியோக ஒருங்கிணைப்பிற்கு செல்லுபடியாகும் எண் தேவைப்படுகிறது.',
    'இங்கிலாந்து, சுவிட்சர்லாந்து, நார்வே: VAT/சுங்க செயல்முறைகளில் விளக்கம் தேவைப்பட்டால் வாங்குபவரை தொடர்பு கொள்ள வேண்டி இருக்கலாம்.',
    'சீனா, இந்தியா, இந்தோனேசியா, பிலிப்பைன்ஸ், தென் கொரியா, தைவான், வியட்நாம்: அறிவிப்புகளை சரிபார்க்க சுங்க அதிகாரிகள் பெறுநர் எண்ணை கோரலாம்.',
    'செல்லுபடியாகும் எண் தாமதம், விநியோக தோல்வி, திரும்பி வருதல் ஆகியவற்றை குறைக்க உதவும். சுங்கம் அல்லது உள்ளூர் குரியர் கூடுதல் தகவல்களுக்கு தொடர்பு கொள்ளலாம்.'
  ],
  tl: [
    'Sa mga bansang mandatory ang phone number, nakakatulong ito para maiwasan ang delay sa processing at delivery.',
    'United States: dahil sa DDP rules para sa postal shipments, maaaring hingin ng carrier ang phone number ng recipient para sa customs at delivery contact.',
    'European Union: sa ilalim ng IOSS VAT rules, kailangan ang valid na numero para sa VAT processing, customs clearance, at delivery coordination.',
    'UK, Switzerland, at Norway: maaaring kailanganin ang contact ng buyer para sa paglilinaw sa VAT/customs procedures.',
    'China, India, Indonesia, Philippines, South Korea, Taiwan, at Vietnam: maaaring hingin ng customs authority ang numero para sa verification ng declarations.',
    'Ang valid na numero ay nakakatulong maiwasan ang delay, failed delivery, at returns. Maaaring makipag-ugnayan ang customs o local courier para sa karagdagang detalye.'
  ],
  cy: [
    'Mewn gwledydd lle mae rhif ffôn yn orfodol, mae hyn yn helpu i brosesu a danfon pecynnau heb oedi.',
    'Unol Daleithiau: oherwydd rheolau DDP ar gyfer cludiant post, gall cludwyr ofyn am rif derbynnydd ar gyfer tollau a danfon.',
    'Undeb Ewropeaidd: dan reolau TAW IOSS, mae rhif derbynnydd dilys yn cefnogi prosesu TAW, tollau a chydlynu danfon.',
    'Y Deyrnas Unedig, y Swistir a Norwy: gall prosesau TAW/tollau ofyn am gyswllt prynwr i egluro manylion.',
    'Tsieina, India, Indonesia, Ynysoedd y Philipinau, De Corea, Taiwan a Fietnam: gall awdurdodau tollau ofyn am rif derbynnydd i wirio datganiadau.',
    'Mae rhif dilys yn helpu i leihau oedi, methiannau danfon a dychweliadau. Gall tollau neu gludwr lleol gysylltu am wybodaeth ychwanegol.'
  ],
  ga: [
    'I dtíortha ina bhfuil uimhir theileafóin éigeantach, cabhraíonn sé seo le próiseáil agus seachadadh gan mhoill.',
    'Stáit Aontaithe: mar gheall ar rialacha DDP do sheoltaí poist, féadfaidh iompróirí uimhir an fhaighteora a éileamh le haghaidh custaim agus seachadta.',
    'Aontas Eorpach: faoi rialacha CBL IOSS, tacaíonn uimhir bhailí leis an bpróiseáil CBL, custaim agus comhordú seachadta.',
    'An Ríocht Aontaithe, an Eilvéis agus an Iorua: d’fhéadfadh nósanna imeachta CBL/custaim teagmháil leis an gceannaitheoir a éileamh le haghaidh soiléiriú.',
    'An tSín, an India, an Indinéis, na hOileáin Fhilipíneacha, an Chóiré Theas, an Téaváin agus Vítneam: d’fhéadfadh údaráis chustaim uimhir an fhaighteora a iarraidh chun dearbhuithe a fhíorú.',
    'Laghdaíonn uimhir bhailí moilleanna, teipeanna seachadta agus fillteáin. Féadfaidh custaim nó iompróir áitiúil teagmháil a dhéanamh chun sonraí breise a dheimhniú.'
  ],
  mi: [
    'Mō ngā whenua e herea ana te nama waea, ka āwhina tēnei kia tere ake te tukatuka me te tuku me te iti o ngā whakaroanga.',
    'United States: nā ngā ture DDP mō ngā tuku mēra, ka tono pea ngā kaikawe i te nama waea o te kaiwhiwhi mō te tikanga kāwana me te tuku.',
    'European Union: i raro i ngā ture IOSS VAT, me whai nama waea tika te kaiwhiwhi mō te tukatuka VAT, te kāwana, me te whakarite tuku.',
    'UK, Switzerland, me Norway: i ngā tukanga VAT/kāwana, tērā pea ka hiahiatia te whakapā atu ki te kaihoko mō te whakamārama.',
    'Haina, Inia, Inōnehia, Piripīni, Korea ki te Tonga, Taiwan, me Vietnam: ka tono pea ngā mana kāwana i te nama waea hei manatoko i ngā tauākī.',
    'Ka āwhina te nama tika ki te whakaiti i ngā whakaroanga, ngā tuku rahua, me ngā whakahokinga. Ka whakapā mai pea te kāwana, te kaikawe ā-rohe rānei mō ngā taipitopito anō.'
  ]
};

function isPhoneRequiredCountry(countryCode) {
  return EU_PHONE_REQUIRED_COUNTRIES.has(countryCode) || OTHER_PHONE_REQUIRED_COUNTRIES.has(countryCode);
}

function getReasonIndexesForCountry(countryCode) {
  const normalized = normalizeCountryCode(countryCode || '') || '';

  if (normalized === 'US') {
    return [0, 1, 5];
  }

  if (EU_PHONE_REQUIRED_COUNTRIES.has(normalized)) {
    return [0, 2, 5];
  }

  if (normalized === 'GB' || normalized === 'CH' || normalized === 'NO') {
    return [0, 3, 5];
  }

  if (STRICT_CUSTOMS_PHONE_REQUIRED_COUNTRIES.has(normalized)) {
    return [0, 4, 5];
  }

  return [0, 5];
}

function getCountryName(countryCode, languageCode) {
  if (!countryCode) return 'your country';
  const normalizedLanguage = normalizeLanguageCode(languageCode || 'en');

  try {
    if (typeof Intl !== 'undefined' && typeof Intl.DisplayNames === 'function') {
      const localeTag = normalizedLanguage === 'zh-hant' ? 'zh-Hant' : normalizedLanguage;
      const regionNames = new Intl.DisplayNames([localeTag], { type: 'region' });
      const localizedName = regionNames.of(countryCode);
      if (localizedName) {
        if (countryCode === 'GB' && normalizedLanguage === 'cy') {
          return 'Deyrnas Unedig';
        }
        if (countryCode === 'GB' && normalizedLanguage === 'en') {
          return 'United Kingdom';
        }
        if (countryCode === 'KR' && normalizedLanguage === 'en' && /republic\s+of\s+korea/i.test(localizedName)) {
          return 'South Korea';
        }
        return localizedName;
      }
    }
  } catch (_) {
    // fallback to code
  }

  const fallbackCountryNames = {
    US: 'United States',
    GB: 'United Kingdom',
    KR: 'South Korea',
    CH: 'Switzerland',
    NO: 'Norway',
    CN: 'China',
    IN: 'India',
    ID: 'Indonesia',
    PH: 'Philippines',
    TW: 'Taiwan',
    VN: 'Vietnam',
  };

  return fallbackCountryNames[countryCode] || countryCode;
}

function replaceGroupedReasonWithDetectedCountry(reasonText, countryCode, languageCode) {
  if (typeof reasonText !== 'string' || !reasonText.length) return reasonText;

  const hasFullWidthColon = reasonText.includes('：');
  const delimiter = hasFullWidthColon ? '：' : (reasonText.includes(':') ? ':' : null);
  if (!delimiter) return reasonText;

  const delimiterIndex = reasonText.indexOf(delimiter);
  if (delimiterIndex <= 0) return reasonText;

  const suffix = reasonText.slice(delimiterIndex + 1).trim();
  const countryName = getCountryName(countryCode, languageCode);
  if (!countryName || !suffix) return reasonText;

  return hasFullWidthColon
    ? `${countryName}：${suffix}`
    : `${countryName}: ${suffix}`;
}

function extractCountryOverrideFromCurrentLocation() {
  if (typeof window === 'undefined') return '';

  try {
    const params = new URLSearchParams(window.location.search || '');
    const searchCountry = normalizeCountryCode(params.get('country') || params.get('adminCountry') || '');
    if (searchCountry) return searchCountry;

    const pathname = window.location.pathname || '';
    if (pathname.startsWith('/country=')) {
      const inlineCountry = pathname.slice('/country='.length).split('/')[0] || '';
      return normalizeCountryCode(inlineCountry) || '';
    }
  } catch (_) {
    // ignore malformed location
  }

  return '';
}

function pickMandatoryCountryFromGeo(geoData) {
  if (!geoData || typeof geoData !== 'object') return '';

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

  const allCandidates = [...directCandidates, ...signalCandidates];
  return allCandidates.find((code) => isPhoneRequiredCountry(code)) || '';
}

export function PhoneRequirementPopup() {
  const pathname = usePathname();
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [countryCode, setCountryCode] = useState('');
  const [triggerToken, setTriggerToken] = useState('');
  const [selectionTick, setSelectionTick] = useState(0);

  const localizedReasons = useMemo(() => {
    const normalizedLang = normalizeLanguageCode(language);
    const reasonPool = FULL_PHONE_REQUIREMENT_REASONS[normalizedLang] || FULL_PHONE_REQUIREMENT_REASONS.en;
    const normalizedCountry = normalizeCountryCode(countryCode || '') || '';
    const indexes = getReasonIndexesForCountry(normalizedCountry);

    return indexes
      .map((index) => {
        const reason = reasonPool[index];
        if (typeof reason !== 'string' || !reason.length) return reason;

        const isUkSwissNorwayReason = index === 3 && ['GB', 'CH', 'NO'].includes(normalizedCountry);
        const isStrictCustomsReason = index === 4 && STRICT_CUSTOMS_PHONE_REQUIRED_COUNTRIES.has(normalizedCountry);

        if (isUkSwissNorwayReason || isStrictCustomsReason) {
          return replaceGroupedReasonWithDetectedCountry(reason, normalizedCountry, normalizedLang);
        }

        return reason;
      })
      .filter((value) => typeof value === 'string' && value.length > 0);
  }, [language, countryCode]);

  const popupText = useMemo(() => {
    const normalizedLang = normalizeLanguageCode(language);
    return POPUP_UI_TEXT[normalizedLang] || POPUP_UI_TEXT.en;
  }, [language]);

  const primaryReason = localizedReasons[1] || localizedReasons[0] || '';

  useEffect(() => {
    const onLanguageSelected = () => {
      setSelectionTick((value) => value + 1);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('rnx:language-selected', onLanguageSelected);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('rnx:language-selected', onLanguageSelected);
      }
    };
  }, []);

  useEffect(() => {
    let isActive = true;

    const shouldCheckPath = TARGET_PATHS.has(normalizePath(pathname || ''));
    if (!shouldCheckPath) {
      if (isActive) setIsOpen(false);
      return () => {
        isActive = false;
      };
    }

    const languageSelectionEvent = sessionStorage.getItem(PHONE_POPUP_LANGUAGE_TRIGGER_KEY) || '';
    if (!languageSelectionEvent || languageSelectionEvent === triggerToken) {
      return () => {
        isActive = false;
      };
    }

    setTriggerToken(languageSelectionEvent);

    const checkCountryAndShow = async () => {
      let detectedCountry = extractCountryOverrideFromCurrentLocation();

      if (!detectedCountry) {
        try {
          const geoData = await detectLanguageFromIPWithRestrictions();
          detectedCountry = normalizeCountryCode(
            geoData?.countryCode ||
            geoData?.detectedCountryCode ||
            geoData?.secondaryCountryCode ||
            geoData?.localeCountryCode ||
            ''
          ) || pickMandatoryCountryFromGeo(geoData);
        } catch (_) {
          detectedCountry = '';
        }
      }

      if (!isActive) return;

      const normalizedDetectedCountry = normalizeCountryCode(detectedCountry || '') || '';
      const shouldOpenPopup = isPhoneRequiredCountry(normalizedDetectedCountry);

      setCountryCode(shouldOpenPopup ? normalizedDetectedCountry : '');
      setIsOpen(shouldOpenPopup);

      try {
        sessionStorage.removeItem(PHONE_POPUP_LANGUAGE_TRIGGER_KEY);
      } catch (_) {
        // ignore storage errors
      }
    };

    checkCountryAndShow();

    return () => {
      isActive = false;
    };
  }, [pathname, language, triggerToken, selectionTick]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="etsy-phone-required-title"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.55)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '720px',
          maxHeight: '88vh',
          overflowY: 'auto',
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          padding: '20px',
          boxShadow: '0 16px 40px rgba(0,0,0,0.2)',
        }}
      >
        <h2 id="etsy-phone-required-title" style={{ margin: '0 0 10px', color: '#111827' }}>
          {popupText.title}
        </h2>
        <p style={{ marginTop: 0, marginBottom: '12px', color: '#374151', lineHeight: 1.5 }}>
          {popupText.detectedPrefix} <strong>{getCountryName(countryCode, language)}</strong>. {popupText.detectedSuffix}
        </p>

        <div style={{ marginBottom: '12px', padding: '12px', borderRadius: '8px', background: '#f3f4f6', color: '#1f2937' }}>
          <p style={{ margin: '0 0 8px', fontWeight: 700 }}>{popupText.whyTitle}</p>
          <p style={{ margin: 0, lineHeight: 1.5 }}>{primaryReason}</p>
        </div>

        <div style={{ marginBottom: '12px', padding: '12px', borderRadius: '8px', background: '#eef2ff', color: '#1f2937' }}>
          <p style={{ margin: '0 0 8px', fontWeight: 700 }}>{popupText.detailsTitle}</p>
          <ul style={{ margin: 0, paddingLeft: '18px', lineHeight: 1.5 }}>
            {localizedReasons.map((reason) => (
              <li key={reason} style={{ marginBottom: '6px' }}>{reason}</li>
            ))}
          </ul>
        </div>

        <p style={{ marginTop: 0, marginBottom: '16px', color: '#b91c1c', fontWeight: 700 }}>
          {popupText.warning}
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
            {popupText.acknowledge}
          </button>
        </div>
      </div>
    </div>
  );
}

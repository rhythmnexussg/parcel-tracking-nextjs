'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

const normalizeLang = (language) => {
  const code = (language || 'en').toLowerCase();
  if (code === 'iw') return 'he';
  if (code === 'fil') return 'tl';
  if (code === 'zh-cn' || code === 'zh-hans') return 'zh';
  if (code === 'zh-tw' || code === 'zh-hant') return 'zh-hant';
  if (code === 'zh-hk' || code === 'yue') return 'zh-hant';
  if (code.startsWith('nb') || code.startsWith('nn')) return 'no';
  return code;
};

const ITALY_OLYMPICS_NOTICE_TRANSLATIONS = {
  "en": {
    "title": "Italy Service Notice: Milano Cortina Winter Olympics & Paralympics 2026",
    "subtitle": "Potential postal service delays for shipments to Italy",
    "intro": "Postal operations in Italy may experience delays during the Milano Cortina 2026 event periods:",
    "period1": "6 February 2026 to 22 February 2026 (Winter Olympics)",
    "period2": "6 March 2026 to 15 March 2026 (Winter Paralympics)",
    "impact": "Delivery and tracking updates may take longer than usual during these periods. Thank you for your patience and understanding.",
    "updated": "Notice period: February to March 2026"
  },
  "de": {
    "title": "Servicehinweis für Italien: Olympische Winterspiele und Paralympics 2026 in Mailand, Cortina",
    "subtitle": "Mögliche Verzögerungen beim Postdienst für Sendungen nach Italien",
    "intro": "Beim Postbetrieb in Italien kann es während der Veranstaltungszeiträume Milano Cortina 2026 zu Verzögerungen kommen:",
    "period1": "6. Februar 2026 bis 22. Februar 2026 (Olympische Winterspiele)",
    "period2": "6. März 2026 bis 15. März 2026 (Winterparalympics)",
    "impact": "Zustellungs- und Sendungsverfolgungsaktualisierungen können in diesen Zeiträumen länger als gewöhnlich dauern. Vielen Dank für Ihre Geduld und Ihr Verständnis.",
    "updated": "Kündigungsfrist: Februar bis März 2026"
  },
  "fr": {
    "title": "Avis de service en Italie : Jeux olympiques et paralympiques d'hiver de Milan Cortina 2026",
    "subtitle": "Retards potentiels du service postal pour les envois vers l’Italie",
    "intro": "Les opérations postales en Italie peuvent connaître des retards pendant les périodes de l'événement Milano Cortina 2026 :",
    "period1": "6 février 2026 au 22 février 2026 (Jeux olympiques d'hiver)",
    "period2": "6 mars 2026 au 15 mars 2026 (Jeux paralympiques d'hiver)",
    "impact": "Les mises à jour de livraison et de suivi peuvent prendre plus de temps que d'habitude pendant ces périodes. Merci pour votre patience et votre compréhension.",
    "updated": "Période de préavis : février à mars 2026"
  },
  "es": {
    "title": "Aviso de servicio de Italia: Juegos Olímpicos y Paralímpicos de Invierno de Milán Cortina 2026",
    "subtitle": "Posibles retrasos en el servicio postal para envíos a Italia",
    "intro": "Las operaciones postales en Italia pueden sufrir retrasos durante los períodos del evento Milano Cortina 2026:",
    "period1": "6 de febrero de 2026 al 22 de febrero de 2026 (Juegos Olímpicos de Invierno)",
    "period2": "6 de marzo de 2026 al 15 de marzo de 2026 (Juegos Paralímpicos de Invierno)",
    "impact": "Las actualizaciones de entrega y seguimiento pueden tardar más de lo habitual durante estos períodos. Gracias por su paciencia y comprensión.",
    "updated": "Plazo de aviso: febrero a marzo de 2026"
  },
  "ja": {
    "title": "イタリアサービスに関するお知らせ: 2026 年ミラノ コルティナ冬季オリンピックおよびパラリンピック",
    "subtitle": "イタリアへの発送で郵便サービスが遅延する可能性があります",
    "intro": "ミラノ コルティナ 2026 イベント期間中、イタリアの郵便業務に遅延が発生する可能性があります。",
    "period1": "2026年2月6日～2026年2月22日（冬季オリンピック）",
    "period2": "2026年3月6日～2026年3月15日（冬季パラリンピック）",
    "impact": "この期間中は、配信と追跡の更新に通常よりも時間がかかる場合があります。ご理解いただきありがとうございます。",
    "updated": "告示期間：2026年2月～3月"
  },
  "zh": {
    "title": "意大利服务通知：2026 年米兰科尔蒂纳冬奥会和残奥会",
    "subtitle": "寄往意大利的邮政服务可能会出现延误",
    "intro": "在 Milano Cortina 2026 活动期间，意大利的邮政业务可能会出现延误：",
    "period1": "2026年2月6日至22日（冬季奥运会）",
    "period2": "2026年3月6日至2026年3月15日（冬季残奥会）",
    "impact": "在此期间，交付和跟踪更新可能需要比平时更长的时间。感谢您的耐心和理解。",
    "updated": "通知期限：2026年2月至3月"
  },
  "zh-hant": {
    "title": "義大利服務通知：2026 年米蘭科爾蒂納冬奧會和殘奧會",
    "subtitle": "寄往義大利的郵政服務可能會延誤",
    "intro": "在 Milano Cortina 2026 活動期間，義大利的郵政業務可能會出現延誤：",
    "period1": "2026年2月6日至22日（冬季奧運）",
    "period2": "2026年3月6日至2026年3月15日（冬季殘障奧運）",
    "impact": "在此期間，交付和追蹤更新可能需要比平常更長的時間。感謝您的耐心與理解。",
    "updated": "通知期限：2026年2月至3月"
  },
  "pt": {
    "title": "Aviso de serviço na Itália: Jogos Olímpicos e Paralímpicos de Inverno de Milano Cortina 2026",
    "subtitle": "Potenciais atrasos nos serviços postais para remessas para a Itália",
    "intro": "As operações postais na Itália podem sofrer atrasos durante os períodos do evento Milano Cortina 2026:",
    "period1": "6 de fevereiro de 2026 a 22 de fevereiro de 2026 (Jogos Olímpicos de Inverno)",
    "period2": "6 de março de 2026 a 15 de março de 2026 (Paraolimpíadas de Inverno)",
    "impact": "As atualizações de entrega e rastreamento podem demorar mais do que o normal durante esses períodos. Obrigado pela sua paciência e compreensão.",
    "updated": "Período de aviso: fevereiro a março de 2026"
  },
  "hi": {
    "title": "इटली सेवा सूचना: मिलानो कॉर्टिना शीतकालीन ओलंपिक और पैरालिंपिक 2026",
    "subtitle": "इटली को शिपमेंट के लिए संभावित डाक सेवा में देरी",
    "intro": "मिलानो कॉर्टिना 2026 इवेंट अवधि के दौरान इटली में डाक परिचालन में देरी हो सकती है:",
    "period1": "6 फरवरी 2026 से 22 फरवरी 2026 (शीतकालीन ओलंपिक)",
    "period2": "6 मार्च 2026 से 15 मार्च 2026 (शीतकालीन पैरालिंपिक)",
    "impact": "इन अवधियों के दौरान डिलीवरी और ट्रैकिंग अपडेट में सामान्य से अधिक समय लग सकता है। धैर्य और समझदारी के लिए धन्यवाद।",
    "updated": "नोटिस अवधि: फरवरी से मार्च 2026"
  },
  "th": {
    "title": "ประกาศเกี่ยวกับบริการของอิตาลี: Milano Cortina Winter Olympics & Paralympics 2026",
    "subtitle": "บริการไปรษณีย์ที่อาจเกิดขึ้นมีความล่าช้าสำหรับการจัดส่งไปยังอิตาลี",
    "intro": "การดำเนินการไปรษณีย์ในอิตาลีอาจมีความล่าช้าในช่วงระยะเวลากิจกรรม Milano Cortina 2026:",
    "period1": "6 กุมภาพันธ์ 2569 ถึง 22 กุมภาพันธ์ 2569 (โอลิมปิกฤดูหนาว)",
    "period2": "6 มีนาคม 2569 ถึง 15 มีนาคม 2569 (พาราลิมปิกฤดูหนาว)",
    "impact": "การอัปเดตการจัดส่งและการติดตามอาจใช้เวลานานกว่าปกติในช่วงเวลาเหล่านี้ ขอบคุณสำหรับความอดทนและความเข้าใจของคุณ",
    "updated": "ระยะเวลาแจ้งให้ทราบ: กุมภาพันธ์ถึงมีนาคม 2026"
  },
  "ms": {
    "title": "Notis Perkhidmatan Itali: Olimpik Musim Sejuk & Paralimpik Milano Cortina 2026",
    "subtitle": "Kemungkinan kelewatan perkhidmatan pos untuk penghantaran ke Itali",
    "intro": "Operasi pos di Itali mungkin mengalami kelewatan semasa tempoh acara Milano Cortina 2026:",
    "period1": "6 Februari 2026 hingga 22 Februari 2026 (Olimpik Musim Sejuk)",
    "period2": "6 Mac 2026 hingga 15 Mac 2026 (Paralimpik Musim Sejuk)",
    "impact": "Kemas kini penghantaran dan penjejakan mungkin mengambil masa lebih lama daripada biasa dalam tempoh ini. Terima kasih atas kesabaran dan pemahaman anda.",
    "updated": "Tempoh notis: Februari hingga Mac 2026"
  },
  "nl": {
    "title": "Servicemelding Italië: Olympische en Paralympische Winterspelen Milano Cortina 2026",
    "subtitle": "Mogelijke vertragingen bij de postdienst voor zendingen naar Italië",
    "intro": "Postoperaties in Italië kunnen vertraging oplopen tijdens de evenementperiodes van Milano Cortina 2026:",
    "period1": "6 februari 2026 t/m 22 februari 2026 (Olympische Winterspelen)",
    "period2": "6 maart 2026 t/m 15 maart 2026 (Paralympische Winterspelen)",
    "impact": "Leverings- en trackingupdates kunnen tijdens deze perioden langer duren dan normaal. Bedankt voor uw geduld en begrip.",
    "updated": "Opzegtermijn: februari t/m maart 2026"
  },
  "id": {
    "title": "Pemberitahuan Layanan Italia: Olimpiade & Paralimpiade Musim Dingin Milano Cortina 2026",
    "subtitle": "Potensi penundaan layanan pos untuk pengiriman ke Italia",
    "intro": "Operasi pos di Italia mungkin mengalami penundaan selama periode acara Milano Cortina 2026:",
    "period1": "6 Februari 2026 hingga 22 Februari 2026 (Olimpiade Musim Dingin)",
    "period2": "6 Maret 2026 hingga 15 Maret 2026 (Paralimpiade Musim Dingin)",
    "impact": "Pembaruan pengiriman dan pelacakan mungkin memerlukan waktu lebih lama dari biasanya selama periode ini. Terima kasih atas kesabaran dan pengertian Anda.",
    "updated": "Periode pemberitahuan: Februari hingga Maret 2026"
  },
  "cs": {
    "title": "Servisní oznámení Itálie: Zimní olympijské hry a paralympiády v Miláně Cortina 2026",
    "subtitle": "Možná zpoždění poštovních služeb u zásilek do Itálie",
    "intro": "Poštovní provoz v Itálii může zaznamenat zpoždění během období akcí Milano Cortina 2026:",
    "period1": "6. února 2026 až 22. února 2026 (zimní olympijské hry)",
    "period2": "6. března 2026 až 15. března 2026 (zimní paralympiáda)",
    "impact": "Aktualizace doručení a sledování mohou během těchto období trvat déle než obvykle. Děkujeme za trpělivost a pochopení.",
    "updated": "Výpovědní lhůta: únor až březen 2026"
  },
  "it": {
    "title": "Avviso di servizio per l'Italia: Olimpiadi e Paralimpiadi invernali Milano Cortina 2026",
    "subtitle": "Potenziali ritardi del servizio postale per spedizioni in Italia",
    "intro": "Le operazioni postali in Italia potrebbero subire ritardi durante i periodi degli eventi Milano Cortina 2026:",
    "period1": "Dal 6 febbraio 2026 al 22 febbraio 2026 (Olimpiadi invernali)",
    "period2": "Dal 6 marzo 2026 al 15 marzo 2026 (Paralimpiadi invernali)",
    "impact": "Gli aggiornamenti sulla consegna e sul monitoraggio potrebbero richiedere più tempo del solito durante questi periodi. Grazie per la pazienza e la comprensione.",
    "updated": "Periodo di preavviso: da febbraio a marzo 2026"
  },
  "he": {
    "title": "הודעת שירות באיטליה: אולימפיאדת החורף והפראלימפית במילאנו קורטינה 2026",
    "subtitle": "עיכובים פוטנציאליים בשירות הדואר למשלוחים לאיטליה",
    "intro": "פעילות הדואר באיטליה עשויה לחוות עיכובים במהלך תקופות האירועים של מילאנו קורטינה 2026:",
    "period1": "6 בפברואר 2026 עד 22 בפברואר 2026 (אולימפיאדת החורף)",
    "period2": "6 במרץ 2026 עד 15 במרץ 2026 (פראלימפי החורף)",
    "impact": "עדכוני מסירה ומעקב עשויים להימשך זמן רב מהרגיל בתקופות אלו. תודה על הסבלנות וההבנה.",
    "updated": "תקופת הודעה מוקדמת: פברואר עד מרץ 2026"
  },
  "ga": {
    "title": "An Iodáil Fógra Seirbhíse: Cluichí Oilimpeacha agus Parailimpeacha an Gheimhridh Milano Cortina 2026",
    "subtitle": "Moilleanna féideartha seirbhíse poist do lastais go dtí an Iodáil",
    "intro": "D’fhéadfadh moill a bheith ar oibríochtaí poist san Iodáil le linn tréimhsí imeachta Milano Cortina 2026:",
    "period1": "6 Feabhra 2026 go 22 Feabhra 2026 (Cluichí Oilimpeacha an Gheimhridh)",
    "period2": "6 Márta 2026 go 15 Márta 2026 (Parailimpeacha an Gheimhridh)",
    "impact": "D’fhéadfadh go dtógfadh sé níos faide ná mar is gnách nuashonruithe seachadta agus rianaithe le linn na dtréimhsí seo. Go raibh maith agat as do chuid foighne agus tuisceana.",
    "updated": "Tréimhse fógra: Feabhra go Márta 2026"
  },
  "pl": {
    "title": "Informacja serwisowa dla Włoch: Zimowe Igrzyska Olimpijskie i Paraolimpijskie w Mediolanie Cortina 2026",
    "subtitle": "Potencjalne opóźnienia w usługach pocztowych w przypadku przesyłek do Włoch",
    "intro": "Operacje pocztowe we Włoszech mogą wystąpić opóźnienia w okresach wydarzeń Milano Cortina 2026:",
    "period1": "6 lutego 2026 r. do 22 lutego 2026 r. (Zimowe Igrzyska Olimpijskie)",
    "period2": "6 marca 2026 r. do 15 marca 2026 r. (Zimowe Igrzyska Paraolimpijskie)",
    "impact": "W tych okresach aktualizacje dostaw i śledzenia mogą trwać dłużej niż zwykle. Dziękujemy za cierpliwość i zrozumienie.",
    "updated": "Okres wypowiedzenia: od lutego do marca 2026 r"
  },
  "ko": {
    "title": "이탈리아 서비스 공지: 2026년 밀라노 코르티나 동계 올림픽 및 패럴림픽",
    "subtitle": "이탈리아로 배송되는 배송에 대한 우편 서비스 지연 가능성",
    "intro": "Milano Cortina 2026 이벤트 기간 동안 이탈리아의 우편 운영이 지연될 수 있습니다.",
    "period1": "2026년 2월 6일 ~ 2026년 2월 22일(동계 올림픽)",
    "period2": "2026년 3월 6일 ~ 2026년 3월 15일(동계 패럴림픽)",
    "impact": "이 기간 동안 배송 및 추적 업데이트가 평소보다 오래 걸릴 수 있습니다. 귀하의 인내와 이해에 감사드립니다.",
    "updated": "공지기간 : 2026년 2월 ~ 3월"
  },
  "no": {
    "title": "Italia Servicemelding: Milano Cortina vinter-OL og Paralympics 2026",
    "subtitle": "Potensielle posttjenesteforsinkelser for forsendelser til Italia",
    "intro": "Postvirksomhet i Italia kan oppleve forsinkelser under arrangementsperioder i Milano Cortina 2026:",
    "period1": "6. februar 2026 til 22. februar 2026 (Vinter-OL)",
    "period2": "6. mars 2026 til 15. mars 2026 (paralympiske vinterleker)",
    "impact": "Leverings- og sporingsoppdateringer kan ta lengre tid enn vanlig i disse periodene. Takk for din tålmodighet og forståelse.",
    "updated": "Oppsigelsesperiode: februar til mars 2026"
  },
  "ru": {
    "title": "Уведомление службы Италии: Зимние Олимпийские и Паралимпийские игры в Милане, Кортина, 2026 г.",
    "subtitle": "Возможные задержки почтовых отправлений в Италию.",
    "intro": "Почтовые операции в Италии могут испытывать задержки во время проведения соревнований Milano Cortina 2026:",
    "period1": "6 февраля 2026 г. - 22 февраля 2026 г. (Зимние Олимпийские игры)",
    "period2": "6 марта 2026 г. - 15 марта 2026 г. (Зимние Паралимпийские игры)",
    "impact": "В эти периоды доставка и отслеживание обновлений могут занять больше времени, чем обычно. Спасибо за ваше терпение и понимание.",
    "updated": "Период уведомления: с февраля по март 2026 г."
  },
  "sv": {
    "title": "Italien Servicemeddelande: Milano Cortina vinter-OS & Paralympics 2026",
    "subtitle": "Potentiella posttjänstförseningar för sändningar till Italien",
    "intro": "Postverksamhet i Italien kan uppleva förseningar under evenemangsperioderna i Milano Cortina 2026:",
    "period1": "6 februari 2026 till 22 februari 2026 (olympiska vinterspelen)",
    "period2": "6 mars 2026 till 15 mars 2026 (Vinter Paralympics)",
    "impact": "Leverans- och spårningsuppdateringar kan ta längre tid än vanligt under dessa perioder. Tack för ditt tålamod och din förståelse.",
    "updated": "Uppsägningstid: februari till mars 2026"
  },
  "fi": {
    "title": "Italia Palveluilmoitus: Milano Cortinan talviolympialaiset ja paralympialaiset 2026",
    "subtitle": "Mahdolliset postipalveluiden viivästykset toimituksissa Italiaan",
    "intro": "Italian postitoiminnassa saattaa ilmetä viiveitä Milano Cortina 2026 -tapahtumajaksojen aikana:",
    "period1": "6. helmikuuta 2026 - 22. helmikuuta 2026 (talviolympialaiset)",
    "period2": "6. maaliskuuta 2026–15. maaliskuuta 2026 (talviparalympialaiset)",
    "impact": "Toimitus- ja seurantapäivitysten toimittaminen voi kestää tavallista kauemmin näinä aikoina. Kiitos kärsivällisyydestäsi ja ymmärryksestäsi.",
    "updated": "Irtisanomisaika: Helmi-maaliskuu 2026"
  },
  "tl": {
    "title": "Paunawa sa Serbisyo ng Italya: Milano Cortina Winter Olympics at Paralympics 2026",
    "subtitle": "Posibleng pagkaantala ng serbisyo sa koreo para sa mga pagpapadala sa Italya",
    "intro": "Ang mga pagpapatakbo ng koreo sa Italy ay maaaring makaranas ng mga pagkaantala sa panahon ng kaganapan sa Milano Cortina 2026:",
    "period1": "6 Pebrero 2026 hanggang 22 Pebrero 2026 (Winter Olympics)",
    "period2": "6 Marso 2026 hanggang 15 Marso 2026 (Winter Paralympics)",
    "impact": "Maaaring magtagal ang mga update sa paghahatid at pagsubaybay kaysa karaniwan sa mga panahong ito. Salamat sa iyong pasensya at pag-unawa.",
    "updated": "Panahon ng paunawa: Pebrero hanggang Marso 2026"
  },
  "vi": {
    "title": "Thông báo dịch vụ của Ý: Thế vận hội mùa đông và Paralympic Milano Cortina 2026",
    "subtitle": "Sự chậm trễ tiềm ẩn của dịch vụ bưu chính đối với các chuyến hàng đến Ý",
    "intro": "Các hoạt động bưu chính ở Ý có thể gặp phải sự chậm trễ trong thời gian diễn ra sự kiện Milano Cortina 2026:",
    "period1": "6 tháng 2 năm 2026 đến 22 tháng 2 năm 2026 (Thế vận hội mùa đông)",
    "period2": "6 tháng 3 năm 2026 đến 15 tháng 3 năm 2026 (Paralympic Mùa đông)",
    "impact": "Các cập nhật về việc phân phối và theo dõi có thể mất nhiều thời gian hơn bình thường trong những khoảng thời gian này. Cảm ơn sự kiên nhẫn và hiểu biết của bạn.",
    "updated": "Thời gian thông báo: tháng 2 đến tháng 3 năm 2026"
  },
  "cy": {
    "title": "Hysbysiad Gwasanaeth yr Eidal: Gemau Olympaidd a Pharalympaidd y Gaeaf Milano Cortina 2026",
    "subtitle": "Oedi gwasanaeth post posibl ar gyfer cludo nwyddau i'r Eidal",
    "intro": "Gall gweithrediadau post yn yr Eidal brofi oedi yn ystod cyfnodau digwyddiad Milano Cortina 2026:",
    "period1": "6 Chwefror 2026 i 22 Chwefror 2026 (Gemau Olympaidd y Gaeaf)",
    "period2": "6 Mawrth 2026 i 15 Mawrth 2026 (Paralympaidd y Gaeaf)",
    "impact": "Gall diweddariadau dosbarthu ac olrhain gymryd mwy o amser nag arfer yn ystod y cyfnodau hyn. Diolch am eich amynedd a'ch dealltwriaeth.",
    "updated": "Cyfnod rhybudd: Chwefror i Fawrth 2026"
  },
  "ta": {
    "title": "இத்தாலி சேவை அறிவிப்பு: மிலானோ கோர்டினா குளிர்கால ஒலிம்பிக் & பாராலிம்பிக்ஸ் 2026",
    "subtitle": "இத்தாலிக்கு அனுப்புவதற்கான சாத்தியமான அஞ்சல் சேவை தாமதங்கள்",
    "intro": "மிலானோ கோர்டினா 2026 நிகழ்வுக் காலங்களில் இத்தாலியில் தபால் நடவடிக்கைகள் தாமதமாகலாம்:",
    "period1": "6 பிப்ரவரி 2026 முதல் 22 பிப்ரவரி 2026 வரை (குளிர்கால ஒலிம்பிக்ஸ்)",
    "period2": "6 மார்ச் 2026 முதல் 15 மார்ச் 2026 வரை (குளிர்கால பாராலிம்பிக்ஸ்)",
    "impact": "இந்தக் காலகட்டங்களில் டெலிவரி மற்றும் கண்காணிப்பு புதுப்பிப்புகளுக்கு வழக்கத்தை விட அதிக நேரம் ஆகலாம். உங்கள் பொறுமைக்கும் புரிதலுக்கும் நன்றி.",
    "updated": "அறிவிப்பு காலம்: பிப்ரவரி முதல் மார்ச் 2026 வரை"
  },
  "mi": {
    "title": "Panui Ratonga Itari: Milano Cortina Winter Olympics & Paralympics 2026",
    "subtitle": "Ka roa pea nga mahi poutapeta mo nga tuku ki Itari",
    "intro": "Ka roa pea nga mahi poutapeta i Itari i nga wa huihuinga Milano Cortina 2026:",
    "period1": "6 Hui-tanguru 2026 ki te 22 Hui-tanguru 2026 (Tauru Olympics)",
    "period2": "6 Poutū-te-rangi 2026 ki te 15 o Poutū-te-rangi 2026 (Winter Paralympics)",
    "impact": "He roa ake pea te tukunga me te whai i nga whakahoutanga i enei waa. Mauruuru koe mo to manawanui me to mohio.",
    "updated": "Waa panui: Hui-tanguru ki Maehe 2026"
  }
};

const getNoticeText = (language) => {
  const lang = normalizeLang(language);
  return ITALY_OLYMPICS_NOTICE_TRANSLATIONS[lang] || ITALY_OLYMPICS_NOTICE_TRANSLATIONS.en;
};

const ItalyOlympicsNotice = ({ language }) => {
  const searchParams = useSearchParams();
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
    const urlCountry = searchParams?.get('destinationCountry') || searchParams?.get('country');
    if (urlCountry !== 'IT') {
      setShowNotice(false);
      return;
    }
    const now = new Date();
    const start = new Date(2026, 1, 6, 0, 0, 0);  // Feb 6, 2026
    const end = new Date(2026, 2, 15, 23, 59, 59); // Mar 15, 2026
    setShowNotice(now >= start && now <= end);
  }, [searchParams]);

  if (!showNotice) return null;

  const text = getNoticeText(language);

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
            {text.title}
          </h3>
          <p style={{
            margin: '0',
            fontSize: isMobile ? '0.85rem' : '0.95rem',
            color: '#666',
            fontWeight: '600',
          }}>
            {text.subtitle}
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
          <strong>{text.intro}</strong>
        </p>

        <ul style={{
          margin: '8px 0',
          paddingLeft: '20px',
          listStyleType: 'disc',
        }}>
          <li style={{ marginBottom: '6px' }}>{text.period1}</li>
          <li style={{ marginBottom: '6px' }}>{text.period2}</li>
        </ul>

        <p style={{ margin: '10px 0 0 0' }}>
          {text.impact}
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
        {text.updated}
      </div>
    </div>
  );
};

export default ItalyOlympicsNotice;

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

const MIDDLE_EAST_AIRSPACE_TRANSLATIONS = {
  "en": {
    "title": "Middle East Airspace Notice: Service Disruption Affecting Israel",
    "subtitle": "All shipments to Israel are suspended until further notice",
    "intro": "Due to the ongoing situation in the Middle East, as of 28 February 2026:",
    "bullet1": "Israeli airspace is currently closed",
    "bullet2": "All flights to and from Israel have been suspended",
    "impact": "All shipments to Israel are suspended until further notice. We apologise for any inconvenience caused and thank you for your patience and understanding.",
    "updated": "Notice effective: 28 February 2026"
  },
  "de": {
    "title": "Nahostflugverbots-Hinweis: Serviceunterbrechung für Israel",
    "subtitle": "Alle Sendungen nach Israel sind bis auf Weiteres ausgesetzt",
    "intro": "Aufgrund der anhaltenden Lage im Nahen Osten, seit dem 28. Februar 2026:",
    "bullet1": "Der israelische Luftraum ist derzeit geschlossen",
    "bullet2": "Alle Flüge nach und von Israel wurden ausgesetzt",
    "impact": "Alle Sendungen nach Israel sind bis auf Weiteres ausgesetzt. Wir entschuldigen uns für etwaige Unannehmlichkeiten und danken Ihnen für Ihre Geduld und Ihr Verständnis.",
    "updated": "Hinweis gültig ab: 28. Februar 2026"
  },
  "fr": {
    "title": "Avis d'espace aérien Moyen-Orient : Perturbation du service affectant Israël",
    "subtitle": "Tous les envois à destination d'Israël sont suspendus jusqu'à nouvel ordre",
    "intro": "En raison de la situation en cours au Moyen-Orient, depuis le 28 février 2026 :",
    "bullet1": "L'espace aérien israélien est actuellement fermé",
    "bullet2": "Tous les vols à destination et en provenance d'Israël ont été suspendus",
    "impact": "Tous les envois à destination d'Israël sont suspendus jusqu'à nouvel ordre. Nous nous excusons pour tout inconvénient causé et vous remercions de votre patience et compréhension.",
    "updated": "Avis en vigueur depuis le : 28 février 2026"
  },
  "es": {
    "title": "Aviso de espacio aéreo de Oriente Medio: Interrupción del servicio que afecta a Israel",
    "subtitle": "Todos los envíos a Israel están suspendidos hasta nuevo aviso",
    "intro": "Debido a la situación en curso en Oriente Medio, a partir del 28 de febrero de 2026:",
    "bullet1": "El espacio aéreo israelí está actualmente cerrado",
    "bullet2": "Todos los vuelos hacia y desde Israel han sido suspendidos",
    "impact": "Todos los envíos a Israel están suspendidos hasta nuevo aviso. Nos disculpamos por cualquier inconveniente causado y le agradecemos su paciencia y comprensión.",
    "updated": "Aviso en vigor desde el: 28 de febrero de 2026"
  },
  "ja": {
    "title": "中東空域通知：イスラエルに影響するサービス障害",
    "subtitle": "イスラエルへのすべての荷物は追って通知があるまで停止されています",
    "intro": "中東における継続的な状況により、2026年2月28日以降：",
    "bullet1": "イスラエルの空域は現在閉鎖されています",
    "bullet2": "イスラエルへの全便およびイスラエルからの全便が停止されています",
    "impact": "イスラエルへのすべての荷物は追って通知があるまで停止されています。ご不便をおかけして申し訳ありません。ご理解とご協力をお願いいたします。",
    "updated": "通知発効日：2026年2月28日"
  },
  "zh": {
    "title": "中东空域通知：影响以色列的服务中断",
    "subtitle": "所有发往以色列的货物均已暂停，直至另行通知",
    "intro": "由于中东持续局势，自2026年2月28日起：",
    "bullet1": "以色列空域目前关闭",
    "bullet2": "所有往返以色列的航班已暂停",
    "impact": "所有发往以色列的货物均已暂停，直至另行通知。对于由此带来的不便，我们深表歉意，感谢您的耐心与理解。",
    "updated": "通知生效日期：2026年2月28日"
  },
  "zh-hant": {
    "title": "中東空域通知：影響以色列的服務中斷",
    "subtitle": "所有寄往以色列的貨件均已暫停，直至另行通知",
    "intro": "由於中東持續局勢，自2026年2月28日起：",
    "bullet1": "以色列空域目前關閉",
    "bullet2": "所有往返以色列的航班已暫停",
    "impact": "所有寄往以色列的貨件均已暫停，直至另行通知。對於由此造成的不便，我們深表歉意，感謝您的耐心與理解。",
    "updated": "通知生效日期：2026年2月28日"
  },
  "pt": {
    "title": "Aviso de espaço aéreo do Médio Oriente: Interrupção do serviço que afeta Israel",
    "subtitle": "Todos os envios para Israel estão suspensos até ulterior aviso",
    "intro": "Devido à situação em curso no Médio Oriente, desde 28 de fevereiro de 2026:",
    "bullet1": "O espaço aéreo israelita está atualmente encerrado",
    "bullet2": "Todos os voos com destino e provenientes de Israel foram suspensos",
    "impact": "Todos os envios para Israel estão suspensos até ulterior aviso. Pedimos desculpa por qualquer inconveniente causado e agradecemos a sua paciência e compreensão.",
    "updated": "Aviso em vigor desde: 28 de fevereiro de 2026"
  },
  "hi": {
    "title": "मध्य पूर्व हवाई क्षेत्र सूचना: इज़राइल को प्रभावित करने वाली सेवा बाधा",
    "subtitle": "इज़राइल के लिए सभी शिपमेंट अगली सूचना तक निलंबित हैं",
    "intro": "मध्य पूर्व में जारी स्थिति के कारण, 28 फरवरी 2026 से:",
    "bullet1": "इज़राइली हवाई क्षेत्र वर्तमान में बंद है",
    "bullet2": "इज़राइल से और इज़राइल के लिए सभी उड़ानें निलंबित कर दी गई हैं",
    "impact": "इज़राइल के लिए सभी शिपमेंट अगली सूचना तक निलंबित हैं। किसी भी असुविधा के लिए हम क्षमा चाहते हैं और आपकी सहनशीलता और समझ के लिए धन्यवाद।",
    "updated": "सूचना प्रभावी: 28 फरवरी 2026"
  },
  "th": {
    "title": "ประกาศน่านฟ้าตะวันออกกลาง: การหยุดชะงักของบริการที่ส่งผลกระทบต่ออิสราเอล",
    "subtitle": "การจัดส่งทั้งหมดไปยังอิสราเอลถูกระงับจนกว่าจะมีประกาศเพิ่มเติม",
    "intro": "เนื่องจากสถานการณ์ที่เกิดขึ้นอย่างต่อเนื่องในตะวันออกกลาง ตั้งแต่วันที่ 28 กุมภาพันธ์ 2026:",
    "bullet1": "น่านฟ้าของอิสราเอลปิดอยู่ในขณะนี้",
    "bullet2": "เที่ยวบินทั้งหมดไปและมาจากอิสราเอลถูกระงับ",
    "impact": "การจัดส่งทั้งหมดไปยังอิสราเอลถูกระงับจนกว่าจะมีประกาศเพิ่มเติม เราขออภัยสำหรับความไม่สะดวกที่เกิดขึ้นและขอบคุณสำหรับความอดทนและความเข้าใจของคุณ",
    "updated": "ประกาศมีผลตั้งแต่: 28 กุมภาพันธ์ 2026"
  },
  "ms": {
    "title": "Notis Ruang Udara Timur Tengah: Gangguan Perkhidmatan yang Mempengaruhi Israel",
    "subtitle": "Semua penghantaran ke Israel digantung sehingga notis selanjutnya",
    "intro": "Disebabkan situasi berterusan di Timur Tengah, mulai 28 Februari 2026:",
    "bullet1": "Ruang udara Israel kini ditutup",
    "bullet2": "Semua penerbangan ke dan dari Israel telah digantung",
    "impact": "Semua penghantaran ke Israel digantung sehingga notis selanjutnya. Kami memohon maaf atas sebarang kesulitan yang berlaku dan terima kasih atas kesabaran dan pemahaman anda.",
    "updated": "Notis berkuat kuasa: 28 Februari 2026"
  },
  "nl": {
    "title": "Melding Midden-Oosten luchtruim: Serviceonderbreking die Israël treft",
    "subtitle": "Alle zendingen naar Israël zijn opgeschort tot nader order",
    "intro": "Vanwege de aanhoudende situatie in het Midden-Oosten, met ingang van 28 februari 2026:",
    "bullet1": "Het Israëlische luchtruim is momenteel gesloten",
    "bullet2": "Alle vluchten van en naar Israël zijn opgeschort",
    "impact": "Alle zendingen naar Israël zijn opgeschort tot nader order. Wij bieden onze excuses aan voor eventueel veroorzaakte ongemakken en danken u voor uw geduld en begrip.",
    "updated": "Melding van kracht per: 28 februari 2026"
  },
  "id": {
    "title": "Pemberitahuan Wilayah Udara Timur Tengah: Gangguan Layanan yang Mempengaruhi Israel",
    "subtitle": "Semua pengiriman ke Israel ditangguhkan hingga pemberitahuan lebih lanjut",
    "intro": "Karena situasi yang sedang berlangsung di Timur Tengah, mulai 28 Februari 2026:",
    "bullet1": "Wilayah udara Israel saat ini ditutup",
    "bullet2": "Semua penerbangan ke dan dari Israel telah dihentikan",
    "impact": "Semua pengiriman ke Israel ditangguhkan hingga pemberitahuan lebih lanjut. Kami memohon maaf atas ketidaknyamanan yang ditimbulkan dan berterima kasih atas kesabaran serta pengertian Anda.",
    "updated": "Pemberitahuan berlaku mulai: 28 Februari 2026"
  },
  "cs": {
    "title": "Oznámení o vzdušném prostoru Blízkého východu: Přerušení služeb ovlivňující Izrael",
    "subtitle": "Všechny zásilky do Izraele jsou pozastaveny až do dalšího oznámení",
    "intro": "V důsledku probíhající situace na Blízkém východě, od 28. února 2026:",
    "bullet1": "Izraelský vzdušný prostor je v současné době uzavřen",
    "bullet2": "Všechny lety do a z Izraele byly pozastaveny",
    "impact": "Všechny zásilky do Izraele jsou pozastaveny až do dalšího oznámení. Omlouváme se za způsobené nepříjemnosti a děkujeme vám za trpělivost a pochopení.",
    "updated": "Oznámení platné od: 28. února 2026"
  },
  "it": {
    "title": "Avviso spazio aereo Medio Oriente: Interruzione del servizio che interessa Israele",
    "subtitle": "Tutte le spedizioni verso Israele sono sospese fino a nuovo avviso",
    "intro": "A causa della situazione in corso in Medio Oriente, a partire dal 28 febbraio 2026:",
    "bullet1": "Lo spazio aereo israeliano è attualmente chiuso",
    "bullet2": "Tutti i voli da e per Israele sono stati sospesi",
    "impact": "Tutte le spedizioni verso Israele sono sospese fino a nuovo avviso. Ci scusiamo per gli eventuali disagi causati e vi ringraziamo per la vostra pazienza e comprensione.",
    "updated": "Avviso in vigore dal: 28 febbraio 2026"
  },
  "he": {
    "title": "הודעת מרחב אווירי למזרח התיכון: שיבוש שירות המשפיע על ישראל",
    "subtitle": "כל המשלוחים לישראל הושעו עד להודעה נוספת",
    "intro": "עקב המצב המתמשך במזרח התיכון, החל מ-28 בפברואר 2026:",
    "bullet1": "המרחב האווירי של ישראל סגור כעת",
    "bullet2": "כל הטיסות אל ישראל וממנה הושעו",
    "impact": "כל המשלוחים לישראל הושעו עד להודעה נוספת. אנו מתנצלים על אי הנוחות שנגרמה ומודים לכם על סבלנותכם והבנתכם.",
    "updated": "הודעה בתוקף מ: 28 בפברואר 2026"
  },
  "ga": {
    "title": "Fógra Spás Aeir an Mheánoirthear: Cur Isteach ar Sheirbhís a Dhéanann Difear d'Iosrael",
    "subtitle": "Tá gach seoltán chuig Iosrael ar fionraí go dtí fógra eile",
    "intro": "Mar gheall ar an staid leanúnach sa Mheánoirthear, ó 28 Feabhra 2026:",
    "bullet1": "Tá spás aeir Iosrael dúnta faoi láthair",
    "bullet2": "Cuireadh gach eitilt chuig agus ó Iosrael ar fionraí",
    "impact": "Tá gach seoltán chuig Iosrael ar fionraí go dtí fógra eile. Gabhamid leithscéal as aon mhíchaoithiúlacht a chruthaítear agus táimid buíoch díot as do chuid foighne agus tuisceana.",
    "updated": "Fógra i bhfeidhm ó: 28 Feabhra 2026"
  },
  "pl": {
    "title": "Powiadomienie o przestrzeni powietrznej Bliskiego Wschodu: zakłócenie usług wpływające na Izrael",
    "subtitle": "Wszystkie przesyłki do Izraela są zawieszone do odwołania",
    "intro": "W związku z trwającą sytuacją na Bliskim Wschodzie, od 28 lutego 2026 r.:",
    "bullet1": "Izraelska przestrzeń powietrzna jest obecnie zamknięta",
    "bullet2": "Wszystkie loty do i z Izraela zostały zawieszone",
    "impact": "Wszystkie przesyłki do Izraela są zawieszone do odwołania. Przepraszamy za wszelkie niedogodności i dziękujemy za cierpliwość i zrozumienie.",
    "updated": "Powiadomienie obowiązuje od: 28 lutego 2026 r."
  },
  "ko": {
    "title": "중동 영공 공지: 이스라엘에 영향을 미치는 서비스 중단",
    "subtitle": "이스라엘로 향하는 모든 화물은 추후 통보가 있을 때까지 중단됩니다",
    "intro": "중동의 지속적인 상황으로 인해, 2026년 2월 28일부터:",
    "bullet1": "이스라엘 영공이 현재 폐쇄되어 있습니다",
    "bullet2": "이스라엘을 오가는 모든 항공편이 중단되었습니다",
    "impact": "이스라엘로 향하는 모든 화물은 추후 통보가 있을 때까지 중단됩니다. 불편을 드려 죄송하며, 인내와 이해에 감사드립니다.",
    "updated": "공지 발효일: 2026년 2월 28일"
  },
  "no": {
    "title": "Varsel om Midtøstens luftrom: Serviceavbrudd som berører Israel",
    "subtitle": "Alle forsendelser til Israel er suspendert inntil videre",
    "intro": "På grunn av den pågående situasjonen i Midtøsten, fra 28. februar 2026:",
    "bullet1": "Israels luftrom er for øyeblikket stengt",
    "bullet2": "Alle flyavganger til og fra Israel er innstilt",
    "impact": "Alle forsendelser til Israel er suspendert inntil videre. Vi beklager eventuelle ulemper dette måtte medføre og takker for din tålmodighet og forståelse.",
    "updated": "Varsel gjelder fra: 28. februar 2026"
  },
  "ru": {
    "title": "Уведомление о воздушном пространстве Ближнего Востока: нарушение работы сервиса, затрагивающее Израиль",
    "subtitle": "Все отправления в Израиль приостановлены до дальнейшего уведомления",
    "intro": "В связи с продолжающейся ситуацией на Ближнем Востоке, с 28 февраля 2026 года:",
    "bullet1": "Воздушное пространство Израиля в настоящее время закрыто",
    "bullet2": "Все рейсы в Израиль и из Израиля приостановлены",
    "impact": "Все отправления в Израиль приостановлены до дальнейшего уведомления. Приносим извинения за причинённые неудобства и благодарим вас за терпение и понимание.",
    "updated": "Уведомление действует с: 28 февраля 2026 г."
  },
  "sv": {
    "title": "Varning för Mellanösterns luftrum: Tjänststörning som drabbar Israel",
    "subtitle": "Alla försändelser till Israel är inställda tills vidare",
    "intro": "På grund av den pågående situationen i Mellanöstern, från och med 28 februari 2026:",
    "bullet1": "Israels luftrum är för närvarande stängt",
    "bullet2": "Alla flygningar till och från Israel har ställts in",
    "impact": "Alla försändelser till Israel är inställda tills vidare. Vi ber om ursäkt för eventuella besvär och tackar dig för ditt tålamod och din förståelse.",
    "updated": "Varning gäller from: 28 februari 2026"
  },
  "fi": {
    "title": "Lähi-idän ilmatila-ilmoitus: Palveluhäiriö Israelissa",
    "subtitle": "Kaikki Israeliin suuntautuvat lähetykset on keskeytetty toistaiseksi",
    "intro": "Lähi-idässä jatkuvan tilanteen vuoksi 28. helmikuuta 2026 alkaen:",
    "bullet1": "Israelin ilmatila on tällä hetkellä suljettu",
    "bullet2": "Kaikki lennot Israeliin ja Israelista on keskeytetty",
    "impact": "Kaikki Israeliin suuntautuvat lähetykset on keskeytetty toistaiseksi. Pyydämme anteeksi aiheutuneita haittoja ja kiitämme kärsivällisyydestäsi ja ymmärryksestäsi.",
    "updated": "Ilmoitus voimassa: 28. helmikuuta 2026 alkaen"
  },
  "tl": {
    "title": "Abiso sa Airspace ng Middle East: Pagkaantala ng Serbisyo na Nakakaapekto sa Israel",
    "subtitle": "Lahat ng mga padala sa Israel ay nasuspinde hanggang sa susunod na abiso",
    "intro": "Dahil sa patuloy na sitwasyon sa Gitnang Silangan, mula 28 Pebrero 2026:",
    "bullet1": "Ang airspace ng Israel ay kasalukuyang sarado",
    "bullet2": "Lahat ng lipad papunta at mula sa Israel ay nasuspinde",
    "impact": "Lahat ng mga padala sa Israel ay nasuspinde hanggang sa susunod na abiso. Humihingi kami ng paumanhin para sa anumang abala at nagpapasalamat sa inyong pasensya at pag-unawa.",
    "updated": "Abiso epektibo: 28 Pebrero 2026"
  },
  "vi": {
    "title": "Thông báo không phận Trung Đông: Gián đoạn dịch vụ ảnh hưởng đến Israel",
    "subtitle": "Tất cả các lô hàng đến Israel đã bị tạm dừng cho đến khi có thông báo tiếp theo",
    "intro": "Do tình hình đang diễn ra ở Trung Đông, kể từ ngày 28 tháng 2 năm 2026:",
    "bullet1": "Không phận Israel hiện đang đóng cửa",
    "bullet2": "Tất cả các chuyến bay đến và đi từ Israel đã bị đình chỉ",
    "impact": "Tất cả các lô hàng đến Israel đã bị tạm dừng cho đến khi có thông báo tiếp theo. Chúng tôi xin lỗi vì mọi sự bất tiện gây ra và cảm ơn sự kiên nhẫn và thông cảm của bạn.",
    "updated": "Thông báo có hiệu lực: 28 tháng 2 năm 2026"
  },
  "cy": {
    "title": "Hysbysiad Awyrofod y Dwyrain Canol: Aflonyddwch Gwasanaeth sy'n Effeithio ar Israel",
    "subtitle": "Mae pob llwythiad i Israel wedi'i atal hyd nes y rhoddir rhybudd pellach",
    "intro": "Oherwydd y sefyllfa barhaus yn y Dwyrain Canol, o 28 Chwefror 2026:",
    "bullet1": "Mae awyrofod Israel ar gau ar hyn o bryd",
    "bullet2": "Mae pob hediad i ac o Israel wedi'i atal",
    "impact": "Mae pob llwythiad i Israel wedi'i atal hyd nes y rhoddir rhybudd pellach. Ymddiheurwn am unrhyw anghyfleustra a achosir a diolchwn i chi am eich amynedd a'ch dealltwriaeth.",
    "updated": "Hysbysiad mewn grym o: 28 Chwefror 2026"
  },
  "ta": {
    "title": "மத்திய கிழக்கு வான்வெளி அறிவிப்பு: இஸ்ரேலை பாதிக்கும் சேவை இடையூறு",
    "subtitle": "இஸ்ரேலுக்கு அனைத்து ஏற்றுமதிகளும் மேலும் அறிவிக்கும் வரை நிறுத்தப்பட்டுள்ளன",
    "intro": "மத்திய கிழக்கில் நடந்துகொண்டிருக்கும் நிலைமையின் காரணமாக, 28 பிப்ரவரி 2026 முதல்:",
    "bullet1": "இஸ்ரேல் வான்வெளி தற்போது மூடப்பட்டுள்ளது",
    "bullet2": "இஸ்ரேலுக்கு மற்றும் அங்கிருந்து செல்லும் அனைத்து விமானங்களும் நிறுத்தப்பட்டுள்ளன",
    "impact": "இஸ்ரேலுக்கு அனைத்து ஏற்றுமதிகளும் மேலும் அறிவிக்கும் வரை நிறுத்தப்பட்டுள்ளன. ஏற்பட்ட எந்த சிரமத்திற்கும் மன்னிப்பு கேட்கிறோம் மற்றும் உங்கள் பொறுமைக்கும் புரிதலுக்கும் நன்றி கூறுகிறோம்.",
    "updated": "அறிவிப்பு நடைமுறையில்: 28 பிப்ரவரி 2026"
  },
  "mi": {
    "title": "Panui Moana Rangi o te Rawhiti Roto: Whakararuraru Ratonga e Pā Ana ki Iharaira",
    "subtitle": "Kua whakamutua ngā tukumate katoa ki Iharaira kia tae ki tētahi pānuitanga",
    "intro": "Nā te āhuatanga haere tonu o te Rawhiti Roto, mai i te 28 o Pepuere 2026:",
    "bullet1": "Kua katia te moana rangi o Iharaira ināianei",
    "bullet2": "Kua whakamutua ngā rerenga katoa ki Iharaira me ētehi atu",
    "impact": "Kua whakamutua ngā tukumate katoa ki Iharaira kia tae ki tētahi pānuitanga. E tuku ana mātou i ō mātou pouri mō tērā raru ka puta, ā, ka whakamōhio ana mātou ki ō manawanui me tō māramatanga.",
    "updated": "Panui mana: 28 Pepuere 2026"
  }
};

const getNoticeText = (language) => {
  const lang = normalizeLang(language);
  return MIDDLE_EAST_AIRSPACE_TRANSLATIONS[lang] || MIDDLE_EAST_AIRSPACE_TRANSLATIONS.en;
};

const MiddleEastAirspaceNotice = ({ language }) => {
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
    if (urlCountry !== 'IL') {
      setShowNotice(false);
      return;
    }
    // Show notice from 28 Feb 2026 onwards (no set end date)
    const noticeStartDate = new Date(2026, 1, 28, 0, 0, 0); // Feb 28, 2026
    const now = new Date();
    setShowNotice(now >= noticeStartDate);
  }, [searchParams]);

  if (!showNotice) return null;

  const text = getNoticeText(language);

  return (
    <div style={{
      backgroundColor: '#fff8f0',
      border: '2px solid #e65c00',
      borderRadius: '8px',
      padding: isMobile ? '12px 16px' : '16px 20px',
      marginBottom: '20px',
      maxWidth: '100%',
      boxShadow: '0 4px 12px rgba(230, 92, 0, 0.15)',
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
          🚨
        </span>
        <div style={{ flex: 1 }}>
          <h3 style={{
            margin: '0 0 6px 0',
            fontSize: isMobile ? '1rem' : '1.2rem',
            color: '#b03000',
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
          <li style={{ marginBottom: '6px' }}>{text.bullet1}</li>
          <li style={{ marginBottom: '6px' }}>{text.bullet2}</li>
        </ul>

        <p style={{ margin: '10px 0 0 0' }}>
          {text.impact}
        </p>
      </div>

      {/* Footer Note */}
      <div style={{
        marginTop: '10px',
        paddingTop: '10px',
        borderTop: '1px solid rgba(230, 92, 0, 0.3)',
        fontSize: isMobile ? '0.75rem' : '0.85rem',
        color: '#666',
        fontStyle: 'italic',
      }}>
        {text.updated}
      </div>
    </div>
  );
};

export default MiddleEastAirspaceNotice;

// ---------------------------------------------------------------------------
// Europe Airspace Delay Notice
// Shows for European destination countries when Middle East airspace is closed
// ---------------------------------------------------------------------------

const EUROPEAN_COUNTRIES = ['AT', 'BE', 'CZ', 'DE', 'FI', 'FR', 'GB', 'IE', 'IT', 'NL', 'NO', 'PL', 'PT', 'ES', 'SE', 'CH'];

const EUROPE_AIRSPACE_TRANSLATIONS = {
  "en": {
    "title": "Middle East Airspace Notice: Possible Delays for Shipments to Europe",
    "subtitle": "Airlines rerouting flights — your parcel may arrive slightly later than usual",
    "intro": "Due to the ongoing closure of Middle East airspace as of 28 February 2026:",
    "bullet1": "Airlines are required to reroute flights to avoid the affected airspace",
    "bullet2": "Extended flight paths may result in slightly longer delivery times for parcels to European destinations",
    "impact": "Your parcel may arrive slightly later than usual while airlines take longer alternative routes to ensure flight safety. We are working to minimise any disruption and will keep you updated. We apologise for any inconvenience and thank you for your patience and understanding.",
    "updated": "Notice effective: 28 February 2026"
  },
  "de": {
    "title": "Mittlerer Osten – Luftraum: Mögliche Verzögerungen bei Lieferungen nach Europa",
    "subtitle": "Airlines weichen auf Alternativrouten aus – Ihr Paket kann etwas länger unterwegs sein",
    "intro": "Aufgrund der anhaltenden Schließung des Luftraums im Nahen Osten seit dem 28. Februar 2026:",
    "bullet1": "Fluggesellschaften müssen ihre Routen ändern, um den betroffenen Luftraum zu meiden",
    "bullet2": "Verlängerte Flugrouten können zu etwas längeren Lieferzeiten für Pakete nach Europa führen",
    "impact": "Ihr Paket kann etwas später als gewöhnlich ankommen, da Fluggesellschaften längere Alternativrouten nehmen, um die Flugsicherheit zu gewährleisten. Wir arbeiten daran, Beeinträchtigungen zu minimieren, und halten Sie auf dem Laufenden. Wir entschuldigen uns für etwaige Unannehmlichkeiten und danken Ihnen für Ihre Geduld und Ihr Verständnis.",
    "updated": "Hinweis gültig ab: 28. Februar 2026"
  },
  "fr": {
    "title": "Espace aérien du Moyen-Orient : Retards possibles pour les envois vers l'Europe",
    "subtitle": "Les compagnies aériennes déroutent les vols — votre colis peut arriver un peu plus tard que prévu",
    "intro": "En raison de la fermeture continue de l'espace aérien au Moyen-Orient depuis le 28 février 2026 :",
    "bullet1": "Les compagnies aériennes sont tenues de dérouter les vols pour éviter l'espace aérien concerné",
    "bullet2": "Des itinéraires de vol prolongés peuvent entraîner des délais de livraison légèrement plus longs pour les colis à destination de l'Europe",
    "impact": "Votre colis peut arriver légèrement plus tard que d'habitude pendant que les compagnies aériennes empruntent des routes alternatives plus longues pour garantir la sécurité des vols. Nous travaillons à minimiser toute perturbation. Nous nous excusons pour tout inconvénient et vous remercions de votre patience et compréhension.",
    "updated": "Avis en vigueur depuis le : 28 février 2026"
  },
  "es": {
    "title": "Espacio aéreo del Oriente Medio: Posibles retrasos en envíos a Europa",
    "subtitle": "Las aerolíneas están reimponiendo rutas de vuelo — su paquete puede tardar un poco más de lo habitual",
    "intro": "Debido al cierre continuo del espacio aéreo en Oriente Medio desde el 28 de febrero de 2026:",
    "bullet1": "Las aerolíneas deben desviar los vuelos para evitar el espacio aéreo afectado",
    "bullet2": "Las rutas de vuelo ampliadas pueden ocasionar tiempos de entrega ligeramente más largos para paquetes con destino a Europa",
    "impact": "Su paquete puede llegar un poco más tarde de lo habitual mientras las aerolíneas utilizan rutas alternativas más largas para garantizar la seguridad del vuelo. Trabajamos para minimizar cualquier perturbación. Nos disculpamos por los inconvenientes y le agradecemos su paciencia y comprensión.",
    "updated": "Aviso en vigor desde el: 28 de febrero de 2026"
  },
  "ja": {
    "title": "中東空域通知：欧州向け荷物の配送遅延の可能性",
    "subtitle": "航空会社が航路を変更しています — お荷物のお届けが通常より少し遅れる場合があります",
    "intro": "2026年2月28日以降、中東における空域の閉鎖が続いていることにより：",
    "bullet1": "航空会社は影響を受けた空域を避けるため、飛行ルートを変更する必要があります",
    "bullet2": "飛行ルートの延長により、欧州向けの荷物の配送時間が若干長くなる場合があります",
    "impact": "航空会社が飛行安全確保のために長い迂回ルートを取っているため、お荷物が通常より少し遅れて届く場合があります。混乱を最小限に抑えるよう努めており、最新情報をお知らせします。ご不便をおかけして申し訳ありません。ご理解とご協力をお願いいたします。",
    "updated": "通知発効日：2026年2月28日"
  },
  "zh": {
    "title": "中东空域通知：欧洲货物可能出现延误",
    "subtitle": "航空公司正在改变航线——您的包裹可能比平时稍晚抵达",
    "intro": "由于中东空域自2026年2月28日起持续关闭：",
    "bullet1": "航空公司必须改变飞行路线以避开受影响的空域",
    "bullet2": "延长的飞行路线可能导致发往欧洲的包裹配送时间略有延长",
    "impact": "在航空公司为确保飞行安全而选择更长替代路线期间，您的包裹到达时间可能比平时稍晚。我们正在努力将影响降至最低，并将持续为您更新信息。对于由此带来的不便，我们深表歉意，感谢您的耐心与理解。",
    "updated": "通知生效日期：2026年2月28日"
  },
  "zh-hant": {
    "title": "中東空域通知：歐洲貨件可能出現延誤",
    "subtitle": "航空公司正在改變航線——您的包裹可能比平時稍晚抵達",
    "intro": "由於中東空域自2026年2月28日起持續關閉：",
    "bullet1": "航空公司必須改變飛行路線以避開受影響的空域",
    "bullet2": "延長的飛行路線可能導致發往歐洲的包裹配送時間略有延長",
    "impact": "在航空公司為確保飛行安全而選擇更長替代路線期間，您的包裹到達時間可能比平時稍晚。我們正在努力將影響降至最低，並將持續為您更新信息。對於由此造成的不便，我們深表歉意，感謝您的耐心與理解。",
    "updated": "通知生效日期：2026年2月28日"
  },
  "pt": {
    "title": "Aviso de espaço aéreo do Médio Oriente: Possíveis atrasos em envios para a Europa",
    "subtitle": "Companhias aéreas a fazer desvios de voo — o seu pacote pode demorar um pouco mais do que o habitual",
    "intro": "Devido ao encerramento contínuo do espaço aéreo no Médio Oriente desde 28 de fevereiro de 2026:",
    "bullet1": "As companhias aéreas são obrigadas a redirecionar os voos para evitar o espaço aéreo afetado",
    "bullet2": "Rotas de voo prolongadas podem resultar em tempos de entrega ligeiramente mais longos para encomendas com destino à Europa",
    "impact": "A sua encomenda pode chegar um pouco mais tarde do que o normal enquanto as companhias aéreas utilizam rotas alternativas mais longas para garantir a segurança dos voos. Estamos a trabalhar para minimizar qualquer perturbação e mantê-lo informado. Pedimos desculpa por qualquer inconveniente e agradecemos a sua paciência e compreensão.",
    "updated": "Aviso em vigor desde: 28 de fevereiro de 2026"
  },
  "hi": {
    "title": "मध्य पूर्व हवाई क्षेत्र सूचना: यूरोप को शिपमेंट में संभावित देरी",
    "subtitle": "एयरलाइंस उड़ानों को फिर से रूट कर रही हैं — आपका पार्सल सामान्य से थोड़ा देर से पहुंच सकता है",
    "intro": "28 फरवरी 2026 से मध्य पूर्व में हवाई क्षेत्र के निरंतर बंद होने के कारण:",
    "bullet1": "एयरलाइंस को प्रभावित हवाई क्षेत्र से बचने के लिए उड़ानों का रास्ता बदलना आवश्यक है",
    "bullet2": "विस्तारित उड़ान मार्गों के कारण यूरोपीय गंतव्यों तक पार्सल की डिलीवरी में थोड़ा अधिक समय लग सकता है",
    "impact": "जब तक एयरलाइंस उड़ान सुरक्षा सुनिश्चित करने के लिए लंबे वैकल्पिक मार्ग लेती हैं, आपका पार्सल सामान्य से थोड़ा देर से पहुंच सकता है। हम किसी भी व्यवधान को कम करने के लिए काम कर रहे हैं। किसी भी असुविधा के लिए हम क्षमा चाहते हैं और आपकी सहनशीलता और समझ के लिए धन्यवाद।",
    "updated": "सूचना प्रभावी: 28 फरवरी 2026"
  },
  "th": {
    "title": "ประกาศน่านฟ้าตะวันออกกลาง: อาจเกิดความล่าช้าสำหรับพัสดุที่ส่งไปยังยุโรป",
    "subtitle": "สายการบินกำลังเปลี่ยนเส้นทางบิน — พัสดุของคุณอาจมาถึงช้ากว่าปกติเล็กน้อย",
    "intro": "เนื่องจากการปิดน่านฟ้าในตะวันออกกลางอย่างต่อเนื่องตั้งแต่วันที่ 28 กุมภาพันธ์ 2026:",
    "bullet1": "สายการบินจำเป็นต้องเปลี่ยนเส้นทางบินเพื่อหลีกเลี่ยงน่านฟ้าที่ได้รับผลกระทบ",
    "bullet2": "เส้นทางบินที่ยาวขึ้นอาจทำให้พัสดุที่มุ่งหน้าไปยังยุโรปมีเวลาจัดส่งนานขึ้นเล็กน้อย",
    "impact": "พัสดุของคุณอาจมาถึงช้ากว่าปกติเล็กน้อยขณะที่สายการบินใช้เส้นทางทางเลือกที่ยาวขึ้นเพื่อความปลอดภัยของเที่ยวบิน เรากำลังดำเนินการเพื่อลดการหยุดชะงักและจะอัปเดตให้คุณทราบ เราขออภัยสำหรับความไม่สะดวกที่เกิดขึ้นและขอบคุณสำหรับความอดทนและความเข้าใจของคุณ",
    "updated": "ประกาศมีผลตั้งแต่: 28 กุมภาพันธ์ 2026"
  },
  "ms": {
    "title": "Notis Ruang Udara Timur Tengah: Kemungkinan Kelewatan untuk Penghantaran ke Eropah",
    "subtitle": "Syarikat penerbangan mengubah laluan penerbangan — bungkusan anda mungkin tiba sedikit lewat dari biasa",
    "intro": "Disebabkan penutupan berterusan ruang udara di Timur Tengah mulai 28 Februari 2026:",
    "bullet1": "Syarikat penerbangan dikehendaki mengubah hala penerbangan untuk mengelakkan ruang udara yang terjejas",
    "bullet2": "Laluan penerbangan yang lebih panjang boleh mengakibatkan masa penghantaran yang sedikit lebih lama untuk bungkusan ke destinasi Eropah",
    "impact": "Bungkusan anda mungkin tiba sedikit lewat dari biasa semasa syarikat penerbangan mengambil laluan alternatif yang lebih panjang untuk memastikan keselamatan penerbangan. Kami sedang berusaha untuk meminimumkan sebarang gangguan dan akan memastikan anda dikemas kini. Kami memohon maaf atas sebarang kesulitan dan terima kasih atas kesabaran serta pemahaman anda.",
    "updated": "Notis berkuat kuasa: 28 Februari 2026"
  },
  "nl": {
    "title": "Melding Midden-Oosten luchtruim: Mogelijke vertragingen voor zendingen naar Europa",
    "subtitle": "Luchtvaartmaatschappijen wijzigen vluchroutes — uw pakket kan iets later dan gebruikelijk aankomen",
    "intro": "Vanwege de aanhoudende sluiting van het luchtruim in het Midden-Oosten met ingang van 28 februari 2026:",
    "bullet1": "Luchtvaartmaatschappijen moeten hun vluchten omleiden om het getroffen luchtruim te vermijden",
    "bullet2": "Verlengde vluchroutes kunnen leiden tot iets langere levertijden voor pakketten naar Europese bestemmingen",
    "impact": "Uw pakket kan iets later dan gewoonlijk aankomen terwijl luchtvaartmaatschappijen langere alternatieve routes nemen om de vliegveiligheid te waarborgen. Wij werken eraan om eventuele verstoringen tot een minimum te beperken en houden u op de hoogte. Wij bieden onze excuses aan voor eventuele ongemakken en danken u voor uw geduld en begrip.",
    "updated": "Melding van kracht per: 28 februari 2026"
  },
  "id": {
    "title": "Pemberitahuan Wilayah Udara Timur Tengah: Kemungkinan Keterlambatan Pengiriman ke Eropa",
    "subtitle": "Maskapai penerbangan mengubah rute penerbangan — paket Anda mungkin tiba sedikit lebih lambat dari biasanya",
    "intro": "Karena penutupan wilayah udara di Timur Tengah yang terus berlanjut sejak 28 Februari 2026:",
    "bullet1": "Maskapai penerbangan diwajibkan untuk mengubah rute penerbangan guna menghindari wilayah udara yang terdampak",
    "bullet2": "Jalur penerbangan yang lebih panjang dapat mengakibatkan waktu pengiriman yang sedikit lebih lama untuk paket ke tujuan Eropa",
    "impact": "Paket Anda mungkin tiba sedikit lebih lambat dari biasanya sementara maskapai penerbangan mengambil rute alternatif yang lebih panjang untuk memastikan keselamatan penerbangan. Kami berupaya meminimalkan gangguan dan akan terus memberikan informasi terkini. Kami memohon maaf atas ketidaknyamanan yang ditimbulkan dan berterima kasih atas kesabaran serta pengertian Anda.",
    "updated": "Pemberitahuan berlaku mulai: 28 Februari 2026"
  },
  "cs": {
    "title": "Oznámení o vzdušném prostoru Blízkého východu: Možné zpoždění zásilek do Evropy",
    "subtitle": "Letecké společnosti přesměrovávají lety — váš balík může dorazit o něco později než obvykle",
    "intro": "V důsledku probíhajícího uzavření vzdušného prostoru na Blízkém východě od 28. února 2026:",
    "bullet1": "Letecké společnosti musí změnit trasy letů, aby se vyhnuly dotčenému vzdušnému prostoru",
    "bullet2": "Prodloužené letové trasy mohou vést k o něco delším dobám doručení zásilek do evropských destinací",
    "impact": "Váš balík může dorazit o něco později než obvykle, zatímco letecké společnosti volí delší alternativní trasy k zajištění bezpečnosti letů. Pracujeme na minimalizaci případných narušení a budeme vás informovat. Omlouváme se za způsobené nepříjemnosti a děkujeme vám za trpělivost a pochopení.",
    "updated": "Oznámení platné od: 28. února 2026"
  },
  "it": {
    "title": "Avviso spazio aereo Medio Oriente: Possibili ritardi per le spedizioni verso l'Europa",
    "subtitle": "Le compagnie aeree stanno deviando i voli — il tuo pacco potrebbe arrivare leggermente in ritardo",
    "intro": "A causa della chiusura continuata dello spazio aereo in Medio Oriente dal 28 febbraio 2026:",
    "bullet1": "Le compagnie aeree devono deviare i voli per evitare lo spazio aereo interessato",
    "bullet2": "Le rotte di volo prolungate possono comportare tempi di consegna leggermente più lunghi per i pacchi diretti a destinazioni europee",
    "impact": "Il tuo pacco potrebbe arrivare leggermente più tardi del solito mentre le compagnie aeree percorrono rotte alternative più lunghe per garantire la sicurezza dei voli. Stiamo lavorando per ridurre al minimo le interruzioni e ti terremo aggiornato. Ci scusiamo per gli eventuali disagi e ti ringraziamo per la tua pazienza e comprensione.",
    "updated": "Avviso in vigore dal: 28 febbraio 2026"
  },
  "he": {
    "title": "הודעת מרחב אווירי מזרח תיכון: עיכובים אפשריים במשלוחים לאירופה",
    "subtitle": "חברות התעופה מנתבות מחדש את הטיסות — החבילה שלך עשויה להגיע מאוחר מעט מהרגיל",
    "intro": "עקב סגירת המרחב האווירי הנמשכת במזרח התיכון החל מ-28 בפברואר 2026:",
    "bullet1": "חברות התעופה נדרשות לשנות מסלולים כדי להימנע מהמרחב האווירי המושפע",
    "bullet2": "מסלולי טיסה מוארכים עלולים להביא לזמני מסירה ארוכים מעט יותר לחבילות המיועדות ליעדים אירופיים",
    "impact": "החבילה שלך עשויה להגיע מעט מאוחר יותר מהרגיל בזמן שחברות התעופה לוקחות מסלולים חלופיים ארוכים יותר להבטחת בטיחות הטיסה. אנו עובדים למזעור כל שיבוש ונעדכן אותך. אנו מתנצלים על אי הנוחות ומודים לך על סבלנותך והבנתך.",
    "updated": "הודעה בתוקף מ: 28 בפברואר 2026"
  },
  "ga": {
    "title": "Fógra Spás Aeir an Mheánoirthear: Moilleanna Féideartha d'Earraí go dtí an Eoraip",
    "subtitle": "Tá cuideachtaí eitlíochta ag athrú bealaí eitilte — d'fhéadfadh do pharsail teacht beagán níos déanaí ná mar is gnách",
    "intro": "Mar gheall ar dhúnadh leanúnach spás aeir sa Mheánoirthear ó 28 Feabhra 2026:",
    "bullet1": "Caithfidh cuideachtaí eitlíochta eitiltí a atreorú chun an spás aeir atá buailte a sheachaint",
    "bullet2": "D'fhéadfadh bealaí eitilte sínte moilleanna éadroma a bheith mar thoradh orthu do pharsail a sheoltar chuig ceann scríbe Eorpach",
    "impact": "D'fhéadfadh do pharsail teacht beagán níos déanaí ná mar is gnách fad is atá cuideachtaí eitlíochta ag glacadh le bealaí eile níos faide chun sábháilteacht eitiltí a chinntiú. Táimid ag obair chun aon chur isteach a laghdú agus coinnéalfaimid ar an eolas thú. Gabhamid leithscéal as aon mhíchaoithiúlacht agus táimid buíoch díot as do chuid foighne agus tuisceana.",
    "updated": "Fógra i bhfeidhm ó: 28 Feabhra 2026"
  },
  "pl": {
    "title": "Powiadomienie o przestrzeni powietrznej Bliskiego Wschodu: Możliwe opóźnienia przesyłek do Europy",
    "subtitle": "Linie lotnicze zmieniają trasy lotów — paczka może dotrzeć nieco później niż zwykle",
    "intro": "W związku z trwającym zamknięciem przestrzeni powietrznej na Bliskim Wschodzie od 28 lutego 2026 r.:",
    "bullet1": "Linie lotnicze muszą zmieniać trasy, aby omijać dotkniętą przestrzeń powietrzną",
    "bullet2": "Wydłużone trasy lotów mogą skutkować nieco dłuższymi czasami dostawy paczek do europejskich miejsc docelowych",
    "impact": "Paczka może dotrzeć nieco później niż zwykle, podczas gdy linie lotnicze korzystają z dłuższych tras alternatywnych, aby zapewnić bezpieczeństwo lotów. Pracujemy nad zminimalizowaniem wszelkich zakłóceń i będziemy Cię na bieżąco informować. Przepraszamy za wszelkie niedogodności i dziękujemy za cierpliwość i zrozumienie.",
    "updated": "Powiadomienie obowiązuje od: 28 lutego 2026 r."
  },
  "ko": {
    "title": "중동 영공 공지: 유럽행 화물 지연 가능성",
    "subtitle": "항공사들이 비행 경로를 변경하고 있습니다 — 소포가 평소보다 약간 늦게 도착할 수 있습니다",
    "intro": "2026년 2월 28일부터 중동 영공이 지속적으로 폐쇄됨에 따라:",
    "bullet1": "항공사들은 영향을 받은 영공을 피하기 위해 비행 경로를 변경해야 합니다",
    "bullet2": "비행 경로가 길어지면서 유럽 목적지로 향하는 소포의 배송 시간이 약간 더 길어질 수 있습니다",
    "impact": "항공사들이 비행 안전 확보를 위해 더 긴 대체 경로를 이용하는 동안 소포가 평소보다 약간 늦게 도착할 수 있습니다. 당사는 불편을 최소화하기 위해 노력하고 있으며 최신 정보를 계속 제공하겠습니다. 불편을 드려 죄송하며 인내와 이해에 감사드립니다.",
    "updated": "공지 발효일: 2026년 2월 28일"
  },
  "no": {
    "title": "Varsel om Midtøstens luftrom: Mulige forsinkelser for forsendelser til Europa",
    "subtitle": "Flyselskaper endrer flyveier — pakken din kan ankomme litt senere enn vanlig",
    "intro": "På grunn av den pågående stengingen av luftrommet i Midtøsten fra 28. februar 2026:",
    "bullet1": "Flyselskaper er nødt til å omrute fly for å unngå det berørte luftrommet",
    "bullet2": "Forlengede flyveier kan gi noe lengre leveringstider for pakker til europeiske destinasjoner",
    "impact": "Pakken din kan ankomme litt senere enn vanlig mens flyselskaper tar lengre alternative ruter for å sikre flysikkerhet. Vi jobber for å minimere eventuelle forstyrrelser og vil holde deg oppdatert. Vi beklager eventuelle ulemper og takker for din tålmodighet og forståelse.",
    "updated": "Varsel gjelder fra: 28. februar 2026"
  },
  "ru": {
    "title": "Уведомление о воздушном пространстве Ближнего Востока: возможные задержки отправлений в Европу",
    "subtitle": "Авиакомпании изменяют маршруты рейсов — ваше отправление может прибыть немного позже обычного",
    "intro": "В связи с продолжающимся закрытием воздушного пространства на Ближнем Востоке с 28 февраля 2026 года:",
    "bullet1": "Авиакомпании вынуждены менять маршруты рейсов, чтобы обойти затронутое воздушное пространство",
    "bullet2": "Удлинённые маршруты полётов могут привести к незначительному увеличению сроков доставки посылок в европейские пункты назначения",
    "impact": "Ваша посылка может прибыть немного позже обычного, пока авиакомпании используют более длинные альтернативные маршруты для обеспечения безопасности полётов. Мы работаем над минимизацией любых перебоев и будем держать вас в курсе. Приносим извинения за возможные неудобства и благодарим вас за терпение и понимание.",
    "updated": "Уведомление действует с: 28 февраля 2026 г."
  },
  "sv": {
    "title": "Varning för Mellanösterns luftrum: Möjliga förseningar för försändelser till Europa",
    "subtitle": "Flygbolag omdirigerar flygningar — ditt paket kan anlända lite senare än vanligt",
    "intro": "På grund av den pågående stängningen av luftrummet i Mellanöstern från och med 28 februari 2026:",
    "bullet1": "Flygbolag måste omdirigera flygningar för att undvika det drabbade luftrummet",
    "bullet2": "Förlängda flygvägar kan resultera i något längre leveranstider för paket till europeiska destinationer",
    "impact": "Ditt paket kan anlända lite senare än vanligt medan flygbolag tar längre alternativa rutter för att säkerställa flygsäkerheten. Vi arbetar för att minimera eventuella störningar och kommer att hålla dig uppdaterad. Vi ber om ursäkt för eventuella besvär och tackar för ditt tålamod och din förståelse.",
    "updated": "Varning gäller from: 28 februari 2026"
  },
  "fi": {
    "title": "Lähi-idän ilmatila-ilmoitus: Mahdollisia viivästyksiä Eurooppaan suuntautuville lähetyksille",
    "subtitle": "Lentoyhtiöt muuttavat reittejä — pakettisi saattaa saapua hieman tavallista myöhemmin",
    "intro": "Lähi-idän ilmatilan jatkuvan sulkemisen vuoksi 28. helmikuuta 2026 alkaen:",
    "bullet1": "Lentoyhtiöiden on muutettava reittejä välttääkseen suljetun ilmatilan",
    "bullet2": "Pidennetyt lentoreitit voivat aiheuttaa hieman pidempiä toimitusaikoja Euroopan kohteisiin suuntautuville paketeille",
    "impact": "Pakettisi saattaa saapua hieman tavallista myöhemmin, kun lentoyhtiöt käyttävät pidempiä vaihtoehtoisia reittejä lentoliikenteen turvallisuuden varmistamiseksi. Työskentelemme mahdollisten häiriöiden minimoimiseksi ja pidämme sinut ajan tasalla. Pyydämme anteeksi aiheutuneita haittoja ja kiitämme kärsivällisyydestäsi ja ymmärryksestäsi.",
    "updated": "Ilmoitus voimassa: 28. helmikuuta 2026 alkaen"
  },
  "tl": {
    "title": "Abiso sa Airspace ng Middle East: Posibleng Pagkaantala ng mga Padala sa Europa",
    "subtitle": "Ang mga airline ay nagbabago ng ruta ng paglipad — ang iyong parsela ay maaaring dumating nang kaunti nang mas huli kaysa karaniwan",
    "intro": "Dahil sa patuloy na pagsasara ng airspace sa Gitnang Silangan mula 28 Pebrero 2026:",
    "bullet1": "Ang mga airline ay kailangang mag-reroute ng mga paglipad upang maiwasan ang apektadong airspace",
    "bullet2": "Ang mga pinahabang ruta ng paglipad ay maaaring magresulta sa bahagyang mas mahabang oras ng paghahatid para sa mga parsela na pupunta sa mga destinasyong Europeo",
    "impact": "Ang iyong parsela ay maaaring dumating nang kaunti nang mas huli kaysa karaniwan habang ang mga airline ay gumagamit ng mas mahabang alternatibong ruta upang matiyak ang kaligtasan ng paglipad. Nagtatrabaho kami upang mabawasan ang anumang abala at patuloy kaming magbibigay ng mga update. Humihingi kami ng paumanhin para sa anumang inkonvenyensya at nagpapasalamat sa inyong pasensya at pag-unawa.",
    "updated": "Abiso epektibo: 28 Pebrero 2026"
  },
  "vi": {
    "title": "Thông báo không phận Trung Đông: Khả năng chậm trễ cho các lô hàng đến Châu Âu",
    "subtitle": "Các hãng hàng không đang thay đổi tuyến đường bay — bưu kiện của bạn có thể đến muộn hơn bình thường một chút",
    "intro": "Do việc đóng cửa liên tục của không phận Trung Đông kể từ ngày 28 tháng 2 năm 2026:",
    "bullet1": "Các hãng hàng không phải thay đổi tuyến đường bay để tránh không phận bị ảnh hưởng",
    "bullet2": "Các tuyến đường bay kéo dài có thể dẫn đến thời gian giao hàng lâu hơn một chút đối với các bưu kiện đến các điểm đến ở Châu Âu",
    "impact": "Bưu kiện của bạn có thể đến muộn hơn bình thường một chút trong khi các hãng hàng không sử dụng các tuyến đường thay thế dài hơn để đảm bảo an toàn bay. Chúng tôi đang nỗ lực giảm thiểu gián đoạn và sẽ tiếp tục cập nhật cho bạn. Chúng tôi xin lỗi vì mọi bất tiện gây ra và cảm ơn sự kiên nhẫn và thông cảm của bạn.",
    "updated": "Thông báo có hiệu lực: 28 tháng 2 năm 2026"
  },
  "cy": {
    "title": "Hysbysiad Awyrofod y Dwyrain Canol: Oedi Posibl i Lwythi i Ewrop",
    "subtitle": "Mae cwmnïau hedfan yn ailgyfeirio hediadau — efallai y bydd eich parseli yn cyrraedd ychydig yn hwyrach nag arfer",
    "intro": "Oherwydd cau parhaus awyrofod yn y Dwyrain Canol o 28 Chwefror 2026:",
    "bullet1": "Mae'n rhaid i gwmnïau hedfan ailgyfeirio hediadau er mwyn osgoi'r awyrofod yr effeithiwyd arno",
    "bullet2": "Gall llwybrau hedfan estynedig arwain at amseroedd dosbarthu ychydig yn hirach ar gyfer parseli i gyrchfannau Ewropeaidd",
    "impact": "Efallai y bydd eich parseli yn cyrraedd ychydig yn hwyrach nag arfer tra bo cwmnïau hedfan yn cymryd llwybrau amgen hirach i sicrhau diogelwch hedfan. Rydym yn gweithio i leihau unrhyw amhariad ac yn cadw chi'n hysbys. Ymddiheurwn am unrhyw anghyfleustra a achosir a diolchwn i chi am eich amynedd a'ch dealltwriaeth.",
    "updated": "Hysbysiad mewn grym o: 28 Chwefror 2026"
  },
  "ta": {
    "title": "மத்திய கிழக்கு வான்வெளி அறிவிப்பு: ஐரோப்பாவிற்கான ஏற்றுமதிகளில் சாத்தியமான தாமதம்",
    "subtitle": "விமான நிறுவனங்கள் பாதையை மாற்றுகின்றன — உங்கள் பார்சல் வழக்கத்தை விட சற்று தாமதமாக வரலாம்",
    "intro": "28 பிப்ரவரி 2026 முதல் மத்திய கிழக்கில் வான்வெளி தொடர்ந்து மூடப்பட்டிருப்பதால்:",
    "bullet1": "பாதிக்கப்பட்ட வான்வெளியை தவிர்க்க விமான நிறுவனங்கள் விமான பாதைகளை மாற்ற வேண்டும்",
    "bullet2": "நீட்டிக்கப்பட்ட விமான பாதைகள் ஐரோப்பிய இலக்குகளுக்கான பார்சல்களுக்கு சற்று அதிக டெலிவரி நேரத்திற்கு வழிவகுக்கலாம்",
    "impact": "விமான நிறுவனங்கள் விமான பாதுகாப்பை உறுதிசெய்ய நீண்ட மாற்று பாதைகளை எடுக்கும் போது உங்கள் பார்சல் வழக்கத்தை விட சற்று தாமதமாக வரலாம். எந்த இடையூறையும் குறைக்க நாங்கள் பணியாற்றுகிறோம். ஏற்பட்ட எந்த சிரமத்திற்கும் மன்னிப்பு கேட்கிறோம் மற்றும் உங்கள் பொறுமைக்கும் புரிதலுக்கும் நன்றி கூறுகிறோம்.",
    "updated": "அறிவிப்பு நடைமுறையில்: 28 பிப்ரவரி 2026"
  },
  "mi": {
    "title": "Panui Moana Rangi o te Rawhiti Roto: Ngā Whakatakariri Tūmanakohia mō ngā Tukumate ki Ūropi",
    "subtitle": "Kei te huri ngā kamupene rererangi i ngā ara — ka taea e tō tukumate te tae mai i muri ake i te tikanga",
    "intro": "Nā te katinga haere tonu o te moana rangi o te Rawhiti Roto mai i te 28 o Pepuere 2026:",
    "bullet1": "Me huri ngā kamupene rererangi i ngā rerenga kia karo i te moana rangi e pāngia ana",
    "bullet2": "Ngā ara rererangi roa ake ka taea te arahi ki ngā wā tukumate roa ake mō ngā tukumate ki ngā wāhi o Ūropi",
    "impact": "Ka taea e tō tukumate te tae mai i muri ake i te tikanga i a ngā kamupene rererangi e whakamahi ana i ngā ara whakaaro hou roa ake hei tiaki i te haumaru rererangi. E mahi ana mātou kia whakaitihia ngā raruraru, ā, ka whakaaturia koe mō ngā whakahoutanga. E tuku ana mātou i ō mātou pouri mō tērā raru ka puta, ā, ka whakamōhio ana mātou ki ō manawanui me tō māramatanga.",
    "updated": "Panui mana: 28 Pepuere 2026"
  }
};

const getEuropeNoticeText = (language) => {
  const lang = normalizeLang(language);
  return EUROPE_AIRSPACE_TRANSLATIONS[lang] || EUROPE_AIRSPACE_TRANSLATIONS.en;
};

export const EuropeAirspaceNotice = ({ language }) => {
  const searchParams = useSearchParams();
  const [showNotice, setShowNotice] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const urlCountry = searchParams?.get('destinationCountry') || searchParams?.get('country');
    if (!urlCountry || !EUROPEAN_COUNTRIES.includes(urlCountry.toUpperCase())) {
      setShowNotice(false);
      return;
    }
    const noticeStartDate = new Date(2026, 1, 28, 0, 0, 0); // Feb 28, 2026
    const now = new Date();
    setShowNotice(now >= noticeStartDate);
  }, [searchParams]);

  if (!showNotice) return null;

  const text = getEuropeNoticeText(language);

  return (
    <div style={{
      backgroundColor: '#fffbf0',
      border: '2px solid #cc8800',
      borderRadius: '8px',
      padding: isMobile ? '12px 16px' : '16px 20px',
      marginBottom: '20px',
      maxWidth: '100%',
      boxShadow: '0 4px 12px rgba(204, 136, 0, 0.15)',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: isMobile ? '10px' : '12px',
        marginBottom: '12px',
      }}>
        <span style={{ fontSize: isMobile ? '1.8rem' : '2rem', flexShrink: 0 }}>✈️</span>
        <div style={{ flex: 1 }}>
          <h3 style={{
            margin: '0 0 6px 0',
            fontSize: isMobile ? '1rem' : '1.2rem',
            color: '#7a5000',
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
        <ul style={{ margin: '8px 0', paddingLeft: '20px', listStyleType: 'disc' }}>
          <li style={{ marginBottom: '6px' }}>{text.bullet1}</li>
          <li style={{ marginBottom: '6px' }}>{text.bullet2}</li>
        </ul>
        <p style={{ margin: '10px 0 0 0' }}>{text.impact}</p>
      </div>

      {/* Footer Note */}
      <div style={{
        marginTop: '10px',
        paddingTop: '10px',
        borderTop: '1px solid rgba(204, 136, 0, 0.3)',
        fontSize: isMobile ? '0.75rem' : '0.85rem',
        color: '#666',
        fontStyle: 'italic',
      }}>
        {text.updated}
      </div>
    </div>
  );
};

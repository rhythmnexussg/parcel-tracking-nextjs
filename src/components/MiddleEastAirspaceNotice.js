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
    "subtitle": "Shipment delays expected due to airspace closure and flight suspension",
    "intro": "Due to the ongoing situation in the Middle East, as of 28 February 2026:",
    "bullet1": "Israeli airspace is currently closed",
    "bullet2": "All flights to and from Israel have been suspended",
    "impact": "International mail and parcel shipments to and from Israel are subject to significant delays. Delivery and tracking updates may take considerably longer than usual. We apologise for any inconvenience caused and thank you for your patience and understanding.",
    "updated": "Notice effective: 28 February 2026"
  },
  "de": {
    "title": "Nahostflugverbots-Hinweis: Serviceunterbrechung für Israel",
    "subtitle": "Sendungsverzögerungen aufgrund der Luftraumsperrung und Flugaussetzung erwartet",
    "intro": "Aufgrund der anhaltenden Lage im Nahen Osten, seit dem 28. Februar 2026:",
    "bullet1": "Der israelische Luftraum ist derzeit geschlossen",
    "bullet2": "Alle Flüge nach und von Israel wurden ausgesetzt",
    "impact": "Internationale Brief- und Paketsendungen nach und aus Israel unterliegen erheblichen Verzögerungen. Zustellungs- und Sendungsverfolgungsaktualisierungen können deutlich länger als gewöhnlich dauern. Wir entschuldigen uns für etwaige Unannehmlichkeiten und danken Ihnen für Ihre Geduld und Ihr Verständnis.",
    "updated": "Hinweis gültig ab: 28. Februar 2026"
  },
  "fr": {
    "title": "Avis d'espace aérien Moyen-Orient : Perturbation du service affectant Israël",
    "subtitle": "Des retards d'expédition sont attendus en raison de la fermeture de l'espace aérien et de la suspension des vols",
    "intro": "En raison de la situation en cours au Moyen-Orient, depuis le 28 février 2026 :",
    "bullet1": "L'espace aérien israélien est actuellement fermé",
    "bullet2": "Tous les vols à destination et en provenance d'Israël ont été suspendus",
    "impact": "Les envois postaux et colis internationaux à destination et en provenance d'Israël sont soumis à des retards importants. Les mises à jour de livraison et de suivi peuvent prendre considérablement plus de temps que d'habitude. Nous nous excusons pour tout inconvénient causé et vous remercions de votre patience et compréhension.",
    "updated": "Avis en vigueur depuis le : 28 février 2026"
  },
  "es": {
    "title": "Aviso de espacio aéreo de Oriente Medio: Interrupción del servicio que afecta a Israel",
    "subtitle": "Se esperan retrasos en los envíos debido al cierre del espacio aéreo y la suspensión de vuelos",
    "intro": "Debido a la situación en curso en Oriente Medio, a partir del 28 de febrero de 2026:",
    "bullet1": "El espacio aéreo israelí está actualmente cerrado",
    "bullet2": "Todos los vuelos hacia y desde Israel han sido suspendidos",
    "impact": "Los envíos postales y de paquetes internacionales hacia y desde Israel están sujetos a retrasos significativos. Las actualizaciones de entrega y seguimiento pueden tardar considerablemente más de lo habitual. Nos disculpamos por cualquier inconveniente causado y le agradecemos su paciencia y comprensión.",
    "updated": "Aviso en vigor desde el: 28 de febrero de 2026"
  },
  "ja": {
    "title": "中東空域通知：イスラエルに影響するサービス障害",
    "subtitle": "空域閉鎖および航空便停止による荷物の遅延が予想されます",
    "intro": "中東における継続的な状況により、2026年2月28日以降：",
    "bullet1": "イスラエルの空域は現在閉鎖されています",
    "bullet2": "イスラエルへの全便およびイスラエルからの全便が停止されています",
    "impact": "イスラエルへの、またはイスラエルからの国際郵便および小包の配送は大幅な遅延が生じる見込みです。配達およびトラッキングの更新には、通常よりもかなりの時間がかかる場合があります。ご不便をおかけして申し訳ありません。ご理解とご協力をお願いいたします。",
    "updated": "通知発効日：2026年2月28日"
  },
  "zh": {
    "title": "中东空域通知：影响以色列的服务中断",
    "subtitle": "由于空域关闭和航班暂停，预计货物将出现延误",
    "intro": "由于中东持续局势，自2026年2月28日起：",
    "bullet1": "以色列空域目前关闭",
    "bullet2": "所有往返以色列的航班已暂停",
    "impact": "往返以色列的国际邮件和包裹将受到严重延误。递送和追踪更新可能需要比平常长得多的时间。对于由此带来的不便，我们深表歉意，感谢您的耐心与理解。",
    "updated": "通知生效日期：2026年2月28日"
  },
  "zh-hant": {
    "title": "中東空域通知：影響以色列的服務中斷",
    "subtitle": "由於空域關閉及航班暫停，預計貨件將出現延誤",
    "intro": "由於中東持續局勢，自2026年2月28日起：",
    "bullet1": "以色列空域目前關閉",
    "bullet2": "所有往返以色列的航班已暫停",
    "impact": "往返以色列的國際郵件和包裹將面臨嚴重延誤。送遞及追蹤更新所需時間可能遠超平常。對於由此造成的不便，我們深表歉意，感謝您的耐心與理解。",
    "updated": "通知生效日期：2026年2月28日"
  },
  "pt": {
    "title": "Aviso de espaço aéreo do Médio Oriente: Interrupção do serviço que afeta Israel",
    "subtitle": "Atrasos nas remessas esperados devido ao encerramento do espaço aéreo e suspensão de voos",
    "intro": "Devido à situação em curso no Médio Oriente, desde 28 de fevereiro de 2026:",
    "bullet1": "O espaço aéreo israelita está atualmente encerrado",
    "bullet2": "Todos os voos com destino e provenientes de Israel foram suspensos",
    "impact": "Os envios postais e de encomendas internacionais para e de Israel estão sujeitos a atrasos significativos. As atualizações de entrega e rastreamento podem demorar consideravelmente mais do que o habitual. Pedimos desculpa por qualquer inconveniente causado e agradecemos a sua paciência e compreensão.",
    "updated": "Aviso em vigor desde: 28 de fevereiro de 2026"
  },
  "hi": {
    "title": "मध्य पूर्व हवाई क्षेत्र सूचना: इज़राइल को प्रभावित करने वाली सेवा बाधा",
    "subtitle": "हवाई क्षेत्र बंद होने और उड़ान निलंबन के कारण शिपमेंट में देरी की उम्मीद है",
    "intro": "मध्य पूर्व में जारी स्थिति के कारण, 28 फरवरी 2026 से:",
    "bullet1": "इज़राइली हवाई क्षेत्र वर्तमान में बंद है",
    "bullet2": "इज़राइल से और इज़राइल के लिए सभी उड़ानें निलंबित कर दी गई हैं",
    "impact": "इज़राइल से और इज़राइल के लिए अंतरराष्ट्रीय मेल और पार्सल शिपमेंट में महत्वपूर्ण देरी हो रही है। डिलीवरी और ट्रैकिंग अपडेट में सामान्य से काफी अधिक समय लग सकता है। किसी भी असुविधा के लिए हम क्षमा चाहते हैं और आपकी सहनशीलता और समझ के लिए धन्यवाद।",
    "updated": "सूचना प्रभावी: 28 फरवरी 2026"
  },
  "th": {
    "title": "ประกาศน่านฟ้าตะวันออกกลาง: การหยุดชะงักของบริการที่ส่งผลกระทบต่ออิสราเอล",
    "subtitle": "คาดว่าจะเกิดความล่าช้าของการจัดส่งเนื่องจากการปิดน่านฟ้าและการระงับเที่ยวบิน",
    "intro": "เนื่องจากสถานการณ์ที่เกิดขึ้นอย่างต่อเนื่องในตะวันออกกลาง ตั้งแต่วันที่ 28 กุมภาพันธ์ 2026:",
    "bullet1": "น่านฟ้าของอิสราเอลปิดอยู่ในขณะนี้",
    "bullet2": "เที่ยวบินทั้งหมดไปและมาจากอิสราเอลถูกระงับ",
    "impact": "การจัดส่งทางไปรษณีย์และพัสดุระหว่างประเทศไปและมาจากอิสราเอลมีความล่าช้าอย่างมาก การอัปเดตการจัดส่งและการติดตามอาจใช้เวลานานกว่าปกติมาก เราขออภัยสำหรับความไม่สะดวกที่เกิดขึ้นและขอบคุณสำหรับความอดทนและความเข้าใจของคุณ",
    "updated": "ประกาศมีผลตั้งแต่: 28 กุมภาพันธ์ 2026"
  },
  "ms": {
    "title": "Notis Ruang Udara Timur Tengah: Gangguan Perkhidmatan yang Mempengaruhi Israel",
    "subtitle": "Kelewatan penghantaran dijangka akibat penutupan ruang udara dan penggantungan penerbangan",
    "intro": "Disebabkan situasi berterusan di Timur Tengah, mulai 28 Februari 2026:",
    "bullet1": "Ruang udara Israel kini ditutup",
    "bullet2": "Semua penerbangan ke dan dari Israel telah digantung",
    "impact": "Penghantaran mel dan bungkusan antarabangsa ke dan dari Israel mengalami kelewatan yang ketara. Kemas kini penghantaran dan penjejakan mungkin mengambil masa yang jauh lebih lama daripada biasa. Kami memohon maaf atas sebarang kesulitan yang berlaku dan terima kasih atas kesabaran dan pemahaman anda.",
    "updated": "Notis berkuat kuasa: 28 Februari 2026"
  },
  "nl": {
    "title": "Melding Midden-Oosten luchtruim: Serviceonderbreking die Israël treft",
    "subtitle": "Vertragingen in zendingen verwacht door sluiting van het luchtruim en opschorting van vluchten",
    "intro": "Vanwege de aanhoudende situatie in het Midden-Oosten, met ingang van 28 februari 2026:",
    "bullet1": "Het Israëlische luchtruim is momenteel gesloten",
    "bullet2": "Alle vluchten van en naar Israël zijn opgeschort",
    "impact": "Internationale post- en pakketverzendingen van en naar Israël ondervinden aanzienlijke vertragingen. Leverings- en trackingupdates kunnen aanzienlijk langer duren dan normaal. Wij bieden onze excuses aan voor eventueel veroorzaakte ongemakken en danken u voor uw geduld en begrip.",
    "updated": "Melding van kracht per: 28 februari 2026"
  },
  "id": {
    "title": "Pemberitahuan Wilayah Udara Timur Tengah: Gangguan Layanan yang Mempengaruhi Israel",
    "subtitle": "Penundaan pengiriman diperkirakan akibat penutupan wilayah udara dan penghentian penerbangan",
    "intro": "Karena situasi yang sedang berlangsung di Timur Tengah, mulai 28 Februari 2026:",
    "bullet1": "Wilayah udara Israel saat ini ditutup",
    "bullet2": "Semua penerbangan ke dan dari Israel telah dihentikan",
    "impact": "Pengiriman surat dan paket internasional ke dan dari Israel mengalami keterlambatan yang signifikan. Pembaruan pengiriman dan pelacakan mungkin memerlukan waktu jauh lebih lama dari biasanya. Kami memohon maaf atas ketidaknyamanan yang ditimbulkan dan berterima kasih atas kesabaran serta pengertian Anda.",
    "updated": "Pemberitahuan berlaku mulai: 28 Februari 2026"
  },
  "cs": {
    "title": "Oznámení o vzdušném prostoru Blízkého východu: Přerušení služeb ovlivňující Izrael",
    "subtitle": "Zpoždění zásilek se očekávají v důsledku uzavření vzdušného prostoru a pozastavení letů",
    "intro": "V důsledku probíhající situace na Blízkém východě, od 28. února 2026:",
    "bullet1": "Izraelský vzdušný prostor je v současné době uzavřen",
    "bullet2": "Všechny lety do a z Izraele byly pozastaveny",
    "impact": "Mezinárodní zásilky pošty a balíků do a z Izraele jsou vystaveny výrazným zpožděním. Aktualizace doručení a sledování mohou trvat podstatně déle než obvykle. Omlouváme se za způsobené nepříjemnosti a děkujeme vám za trpělivost a pochopení.",
    "updated": "Oznámení platné od: 28. února 2026"
  },
  "it": {
    "title": "Avviso spazio aereo Medio Oriente: Interruzione del servizio che interessa Israele",
    "subtitle": "Ritardi nelle spedizioni previsti a causa della chiusura dello spazio aereo e della sospensione dei voli",
    "intro": "A causa della situazione in corso in Medio Oriente, a partire dal 28 febbraio 2026:",
    "bullet1": "Lo spazio aereo israeliano è attualmente chiuso",
    "bullet2": "Tutti i voli da e per Israele sono stati sospesi",
    "impact": "Le spedizioni postali e pacchi internazionali da e per Israele sono soggette a notevoli ritardi. Gli aggiornamenti sulla consegna e sul monitoraggio potrebbero richiedere molto più tempo del solito. Ci scusiamo per gli eventuali disagi causati e vi ringraziamo per la vostra pazienza e comprensione.",
    "updated": "Avviso in vigore dal: 28 febbraio 2026"
  },
  "he": {
    "title": "הודעת מרחב אווירי למזרח התיכון: שיבוש שירות המשפיע על ישראל",
    "subtitle": "עיכובים במשלוחים צפויים עקב סגירת המרחב האווירי והשעיית הטיסות",
    "intro": "עקב המצב המתמשך במזרח התיכון, החל מ-28 בפברואר 2026:",
    "bullet1": "המרחב האווירי של ישראל סגור כעת",
    "bullet2": "כל הטיסות אל ישראל וממנה הושעו",
    "impact": "משלוחי דואר ו חבילות בינלאומיות אל ומישראל כפופים לעיכובים משמעותיים. עדכונים על מסירה ומעקב עשויים לקחת זמן רב יותר מהרגיל. אנו מתנצלים על אי הנוחות שנגרמה ומודים לכם על סבלנותכם והבנתכם.",
    "updated": "הודעה בתוקף מ: 28 בפברואר 2026"
  },
  "ga": {
    "title": "Fógra Spás Aeir an Mheánoirthear: Cur Isteach ar Sheirbhís a Dhéanann Difear d'Iosrael",
    "subtitle": "Moilleanna ar sheoladh ann a bheith mar thoradh ar dhúnadh an spáis aeir agus crochta eitiltí",
    "intro": "Mar gheall ar an staid leanúnach sa Mheánoirthear, ó 28 Feabhra 2026:",
    "bullet1": "Tá spás aeir Iosrael dúnta faoi láthair",
    "bullet2": "Cuireadh gach eitilt chuig agus ó Iosrael ar fionraí",
    "impact": "Tá moill shuntasach ar sheoltáin poist agus paraisil idirnáisiúnta chuig agus ó Iosrael. D'fhéadfadh nuashonruithe seachadta agus rianaithe tógáil i bhfad níos faide ná mar is gnách. Gabhamid leithscéal as aon mhíchaoithiúlacht a chruthaítear agus táimid buíoch díot as do chuid foighne agus tuisceana.",
    "updated": "Fógra i bhfeidhm ó: 28 Feabhra 2026"
  },
  "pl": {
    "title": "Powiadomienie o przestrzeni powietrznej Bliskiego Wschodu: zakłócenie usług wpływające na Izrael",
    "subtitle": "Spodziewane opóźnienia w przesyłkach z powodu zamknięcia przestrzeni powietrznej i zawieszenia lotów",
    "intro": "W związku z trwającą sytuacją na Bliskim Wschodzie, od 28 lutego 2026 r.:",
    "bullet1": "Izraelska przestrzeń powietrzna jest obecnie zamknięta",
    "bullet2": "Wszystkie loty do i z Izraela zostały zawieszone",
    "impact": "Międzynarodowe przesyłki pocztowe i paczki do i z Izraela podlegają znacznym opóźnieniom. Aktualizacje dostarczenia i śledzenia mogą trwać znacznie dłużej niż zwykle. Przepraszamy za wszelkie niedogodności i dziękujemy za cierpliwość i zrozumienie.",
    "updated": "Powiadomienie obowiązuje od: 28 lutego 2026 r."
  },
  "ko": {
    "title": "중동 영공 공지: 이스라엘에 영향을 미치는 서비스 중단",
    "subtitle": "영공 폐쇄 및 항공편 운항 중단으로 인한 배송 지연 예상",
    "intro": "중동의 지속적인 상황으로 인해, 2026년 2월 28일부터:",
    "bullet1": "이스라엘 영공이 현재 폐쇄되어 있습니다",
    "bullet2": "이스라엘을 오가는 모든 항공편이 중단되었습니다",
    "impact": "이스라엘을 오가는 국제 우편 및 소포 배송은 상당한 지연이 예상됩니다. 배송 및 추적 업데이트가 평소보다 훨씬 오래 걸릴 수 있습니다. 불편을 드려 죄송하며, 인내와 이해에 감사드립니다.",
    "updated": "공지 발효일: 2026년 2월 28일"
  },
  "no": {
    "title": "Varsel om Midtøstens luftrom: Serviceavbrudd som berører Israel",
    "subtitle": "Forsinkelser i forsendelser forventes på grunn av stengt luftrom og innstilte fly",
    "intro": "På grunn av den pågående situasjonen i Midtøsten, fra 28. februar 2026:",
    "bullet1": "Israels luftrom er for øyeblikket stengt",
    "bullet2": "Alle flyavganger til og fra Israel er innstilt",
    "impact": "Internasjonale post- og pakkeleveranser til og fra Israel er gjenstand for betydelige forsinkelser. Leverings- og sporingsoppdateringer kan ta mye lenger tid enn vanlig. Vi beklager eventuelle ulemper dette måtte medføre og takker for din tålmodighet og forståelse.",
    "updated": "Varsel gjelder fra: 28. februar 2026"
  },
  "ru": {
    "title": "Уведомление о воздушном пространстве Ближнего Востока: нарушение работы сервиса, затрагивающее Израиль",
    "subtitle": "Ожидаются задержки отправлений в связи с закрытием воздушного пространства и приостановкой рейсов",
    "intro": "В связи с продолжающейся ситуацией на Ближнем Востоке, с 28 февраля 2026 года:",
    "bullet1": "Воздушное пространство Израиля в настоящее время закрыто",
    "bullet2": "Все рейсы в Израиль и из Израиля приостановлены",
    "impact": "Международная почтовая корреспонденция и посылки, направляемые в Израиль и из него, задерживаются значительно. Обновления статуса доставки и отслеживания могут занимать значительно больше времени, чем обычно. Приносим извинения за причинённые неудобства и благодарим вас за терпение и понимание.",
    "updated": "Уведомление действует с: 28 февраля 2026 г."
  },
  "sv": {
    "title": "Varning för Mellanösterns luftrum: Tjänststörning som drabbar Israel",
    "subtitle": "Förseningar i leveranser förväntas på grund av stängning av luftrummet och inställda flygningar",
    "intro": "På grund av den pågående situationen i Mellanöstern, från och med 28 februari 2026:",
    "bullet1": "Israels luftrum är för närvarande stängt",
    "bullet2": "Alla flygningar till och från Israel har ställts in",
    "impact": "Internationella post- och paketsändningar till och från Israel är föremål för betydande förseningar. Leverans- och spårningsuppdateringar kan ta avsevärt längre tid än vanligt. Vi ber om ursäkt för eventuella besvär och tackar dig för ditt tålamod och din förståelse.",
    "updated": "Varning gäller from: 28 februari 2026"
  },
  "fi": {
    "title": "Lähi-idän ilmatila-ilmoitus: Palveluhäiriö Israelissa",
    "subtitle": "Lähetysten viivästyksiä odotetaan ilmatilan sulkemisen ja lentojen keskeytymisen vuoksi",
    "intro": "Lähi-idässä jatkuvan tilanteen vuoksi 28. helmikuuta 2026 alkaen:",
    "bullet1": "Israelin ilmatila on tällä hetkellä suljettu",
    "bullet2": "Kaikki lennot Israeliin ja Israelista on keskeytetty",
    "impact": "Kansainvälisten kirjeiden ja pakettien toimitukset Israeliin ja Israelista viivästyvät merkittävästi. Toimitus- ja seurantapäivitysten saaminen voi kestää huomattavasti tavallista kauemmin. Pyydämme anteeksi aiheutuneita haittoja ja kiitämme kärsivällisyydestäsi ja ymmärryksestäsi.",
    "updated": "Ilmoitus voimassa: 28. helmikuuta 2026 alkaen"
  },
  "tl": {
    "title": "Abiso sa Airspace ng Middle East: Pagkaantala ng Serbisyo na Nakakaapekto sa Israel",
    "subtitle": "Inaasahang pagkaantala ng mga padala dahil sa pagsasara ng airspace at pagsuspinde ng mga lipad",
    "intro": "Dahil sa patuloy na sitwasyon sa Gitnang Silangan, mula 28 Pebrero 2026:",
    "bullet1": "Ang airspace ng Israel ay kasalukuyang sarado",
    "bullet2": "Lahat ng lipad papunta at mula sa Israel ay nasuspinde",
    "impact": "Ang mga internasyonal na koreo at parsela na padala papunta at mula sa Israel ay napapailalim sa malaking pagkaantala. Ang mga update sa paghahatid at pagsubaybay ay maaaring tumagal ng mas matagal kaysa karaniwan. Humihingi kami ng paumanhin para sa anumang abala at nagpapasalamat sa inyong pasensya at pag-unawa.",
    "updated": "Abiso epektibo: 28 Pebrero 2026"
  },
  "vi": {
    "title": "Thông báo không phận Trung Đông: Gián đoạn dịch vụ ảnh hưởng đến Israel",
    "subtitle": "Dự kiến sẽ có sự chậm trễ trong việc giao hàng do đóng cửa không phận và đình chỉ các chuyến bay",
    "intro": "Do tình hình đang diễn ra ở Trung Đông, kể từ ngày 28 tháng 2 năm 2026:",
    "bullet1": "Không phận Israel hiện đang đóng cửa",
    "bullet2": "Tất cả các chuyến bay đến và đi từ Israel đã bị đình chỉ",
    "impact": "Các lô hàng bưu chính và bưu kiện quốc tế đến và đi từ Israel đang bị trì hoãn đáng kể. Các cập nhật về việc giao hàng và theo dõi có thể mất thời gian lâu hơn đáng kể so với thông thường. Chúng tôi xin lỗi vì mọi sự bất tiện gây ra và cảm ơn sự kiên nhẫn và thông cảm của bạn.",
    "updated": "Thông báo có hiệu lực: 28 tháng 2 năm 2026"
  },
  "cy": {
    "title": "Hysbysiad Awyrofod y Dwyrain Canol: Aflonyddwch Gwasanaeth sy'n Effeithio ar Israel",
    "subtitle": "Disgwylir oedi mewn llwythi oherwydd cau awyrofod ac atal hediadau",
    "intro": "Oherwydd y sefyllfa barhaus yn y Dwyrain Canol, o 28 Chwefror 2026:",
    "bullet1": "Mae awyrofod Israel ar gau ar hyn o bryd",
    "bullet2": "Mae pob hediad i ac o Israel wedi'i atal",
    "impact": "Mae llwythi post a pharseli rhyngwladol i ac o Israel yn destun oedi sylweddol. Gall diweddariadau dosbarthu ac olrhain gymryd amser llawer hirach na'r arfer. Ymddiheurwn am unrhyw anghyfleustra a achosir a diolchwn i chi am eich amynedd a'ch dealltwriaeth.",
    "updated": "Hysbysiad mewn grym o: 28 Chwefror 2026"
  },
  "ta": {
    "title": "மத்திய கிழக்கு வான்வெளி அறிவிப்பு: இஸ்ரேலை பாதிக்கும் சேவை இடையூறு",
    "subtitle": "வான்வெளி மூடல் மற்றும் விமான நிறுத்தத்தால் சரக்கு அனுப்புவதில் தாமதம் எதிர்பார்க்கப்படுகிறது",
    "intro": "மத்திய கிழக்கில் நடந்துகொண்டிருக்கும் நிலைமையின் காரணமாக, 28 பிப்ரவரி 2026 முதல்:",
    "bullet1": "இஸ்ரேல் வான்வெளி தற்போது மூடப்பட்டுள்ளது",
    "bullet2": "இஸ்ரேலுக்கு மற்றும் அங்கிருந்து செல்லும் அனைத்து விமானங்களும் நிறுத்தப்பட்டுள்ளன",
    "impact": "இஸ்ரேலுக்கு மற்றும் அங்கிருந்து வரும் சர்வதேச அஞ்சல் மற்றும் சரக்கு அனுப்புதல்கள் கணிசமான தாமதங்களுக்கு உட்பட்டுள்ளன. டெலிவரி மற்றும் கண்காணிப்பு புதுப்பிப்புகள் வழக்கத்தை விட மிகவும் அதிக நேரம் ஆகலாம். ஏற்பட்ட எந்த சிரமத்திற்கும் மன்னிப்பு கேட்கிறோம் மற்றும் உங்கள் பொறுமைக்கும் புரிதலுக்கும் நன்றி கூறுகிறோம்.",
    "updated": "அறிவிப்பு நடைமுறையில்: 28 பிப்ரவரி 2026"
  },
  "mi": {
    "title": "Panui Moana Rangi o te Rawhiti Roto: Whakararuraru Ratonga e Pā Ana ki Iharaira",
    "subtitle": "E tūmanakohia ana ngā whakatakariri o ngā tukumate nā te katinga o te rangi moana me te whakamutuhanga o ngā rerenga",
    "intro": "Nā te āhuatanga haere tonu o te Rawhiti Roto, mai i te 28 o Pepuere 2026:",
    "bullet1": "Kua katia te moana rangi o Iharaira ināianei",
    "bullet2": "Kua whakamutua ngā rerenga katoa ki Iharaira me ētehi atu",
    "impact": "Ko ngā tukumate poutāpeta me ngā pākete ā-ao ki Iharaira me ōna tukumate e raro ana i ngā whakatakariri nui. Ka taea e ngā whakahoutanga tuku me te whai te mau roa ake i te tikanga. E tuku ana mātou i ō mātou pouri mō tērā raru ka puta, ā, ka whakamōhio ana mātou ki ō manawanui me tō māramatanga.",
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

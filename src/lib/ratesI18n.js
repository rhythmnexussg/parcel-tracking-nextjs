const TERMS = {
  en: {
    relatedRates: 'Related rates',
    postalCourierLocal: 'Postal & Courier Rates (Local)',
    service: 'Service',
    notes: 'Notes',
    zone: 'Zone',
    countryRegion: 'Country / Region',
    country: 'Country',
    countryFullName: 'Country (Full Name)',
    weight: 'Weight',
    region: 'Region',
    currentPrice: 'Current Price',
    noSurcharge: 'No Surcharge',
    handlingFeeSurcharge: 'Handling Fee Surcharge (applies to ePAC ONLY)',
    currentSurchargeRates: 'Current Surcharge Rates (applies to ePAC only)',
    epacRates2026: 'SingPost ePAC International Postal Rates 2026',
    emsRates2026: 'SpeedPost International Priority (EMS) Rates 2026',
    speedpostExpressRates: 'SpeedPost International Express Rates',
    trackedPrepaidLabel: 'SingPost Tracked Prepaid Label',
    doorstepDeliveryStd: '0.00 - 5.00kg (Shipped via SpeedPost Standard) - Doorstep Delivery (1-3 business days)',
    southeastAsia: 'Southeast Asia',
    europe: 'Europe',
    includes: 'incl.',
    except: 'except',
    asiaPacific: 'Asia Pacific'
  },
  de: {
    relatedRates: 'Verwandte Tarife', postalCourierLocal: 'Post- & Kuriergebühren (lokal)', service: 'Dienst', notes: 'Hinweise', zone: 'Zone', countryRegion: 'Land / Region', country: 'Land', countryFullName: 'Land (vollständiger Name)', weight: 'Gewicht', region: 'Region', currentPrice: 'Aktueller Preis', noSurcharge: 'Kein Zuschlag', handlingFeeSurcharge: 'Bearbeitungszuschlag (gilt nur für ePAC)', currentSurchargeRates: 'Aktuelle Zuschlagssätze (gilt nur für ePAC)', epacRates2026: 'SingPost ePAC Internationale Posttarife 2026', emsRates2026: 'SpeedPost International Priority (EMS) Tarife 2026', speedpostExpressRates: 'SpeedPost Internationale Express-Tarife', trackedPrepaidLabel: 'SingPost verfolgtes Prepaid-Etikett', doorstepDeliveryStd: '0,00 - 5,00kg (Versand per SpeedPost Standard) - Zustellung an die Haustür (1-3 Werktage)', southeastAsia: 'Südostasien', europe: 'Europa', includes: 'inkl.', except: 'außer', asiaPacific: 'Asien-Pazifik'
  },
  fr: {
    relatedRates: 'Tarifs liés', postalCourierLocal: 'Tarifs postaux & coursier (local)', service: 'Service', notes: 'Notes', zone: 'Zone', countryRegion: 'Pays / Région', country: 'Pays', countryFullName: 'Pays (nom complet)', weight: 'Poids', region: 'Région', currentPrice: 'Prix actuel', noSurcharge: 'Sans surcharge', handlingFeeSurcharge: 'Supplément de frais de traitement (s’applique uniquement à ePAC)', currentSurchargeRates: 'Taux de surcharge actuels (s’applique uniquement à ePAC)', epacRates2026: 'Tarifs postaux internationaux SingPost ePAC 2026', emsRates2026: 'Tarifs SpeedPost International Priority (EMS) 2026', speedpostExpressRates: 'Tarifs SpeedPost International Express', trackedPrepaidLabel: 'Étiquette prépayée suivie SingPost', doorstepDeliveryStd: '0,00 - 5,00kg (Expédié via SpeedPost Standard) - Livraison à domicile (1-3 jours ouvrés)', southeastAsia: 'Asie du Sud-Est', europe: 'Europe', includes: 'incl.', except: 'sauf', asiaPacific: 'Asie-Pacifique'
  },
  es: {
    relatedRates: 'Tarifas relacionadas', postalCourierLocal: 'Tarifas postales y de mensajería (local)', service: 'Servicio', notes: 'Notas', zone: 'Zona', countryRegion: 'País / Región', country: 'País', countryFullName: 'País (nombre completo)', weight: 'Peso', region: 'Región', currentPrice: 'Precio actual', noSurcharge: 'Sin recargo', handlingFeeSurcharge: 'Recargo por gestión (se aplica solo a ePAC)', currentSurchargeRates: 'Tarifas de recargo actuales (se aplica solo a ePAC)', epacRates2026: 'Tarifas postales internacionales SingPost ePAC 2026', emsRates2026: 'Tarifas SpeedPost International Priority (EMS) 2026', speedpostExpressRates: 'Tarifas SpeedPost International Express', trackedPrepaidLabel: 'Etiqueta prepagada con seguimiento de SingPost', doorstepDeliveryStd: '0.00 - 5.00kg (Enviado por SpeedPost Standard) - Entrega a domicilio (1-3 días hábiles)', southeastAsia: 'Sudeste Asiático', europe: 'Europa', includes: 'incl.', except: 'excepto', asiaPacific: 'Asia Pacífico'
  },
  ja: {
    relatedRates: '関連料金', postalCourierLocal: '郵便・宅配料金（国内）', service: 'サービス', notes: '備考', zone: 'ゾーン', countryRegion: '国 / 地域', country: '国', countryFullName: '国（正式名称）', weight: '重量', region: '地域', currentPrice: '現在価格', noSurcharge: '追加料金なし', handlingFeeSurcharge: '取扱手数料サーチャージ（ePACのみ適用）', currentSurchargeRates: '現在のサーチャージ率（ePACのみ適用）', epacRates2026: 'SingPost ePAC 国際郵便料金 2026', emsRates2026: 'SpeedPost International Priority（EMS）料金 2026', speedpostExpressRates: 'SpeedPost International Express 料金', trackedPrepaidLabel: 'SingPost 追跡付き前払いラベル', doorstepDeliveryStd: '0.00 - 5.00kg（SpeedPost Standard発送）- 玄関先配達（1〜3営業日）', southeastAsia: '東南アジア', europe: 'ヨーロッパ', includes: '含む', except: '除く', asiaPacific: 'アジア太平洋'
  },
  zh: {
    relatedRates: '相关运费', postalCourierLocal: '邮政与快递费（本地）', service: '服务', notes: '备注', zone: '分区', countryRegion: '国家 / 地区', country: '国家', countryFullName: '国家（全称）', weight: '重量', region: '地区', currentPrice: '当前价格', noSurcharge: '无附加费', handlingFeeSurcharge: '手续费附加费（仅适用于 ePAC）', currentSurchargeRates: '当前附加费率（仅适用于 ePAC）', epacRates2026: 'SingPost ePAC 国际邮政费率 2026', emsRates2026: 'SpeedPost 国际优先（EMS）费率 2026', speedpostExpressRates: 'SpeedPost 国际特快费率', trackedPrepaidLabel: 'SingPost 可追踪预付标签', doorstepDeliveryStd: '0.00 - 5.00kg（通过 SpeedPost Standard 发货）- 送货上门（1-3个工作日）', southeastAsia: '东南亚', europe: '欧洲', includes: '含', except: '除', asiaPacific: '亚太'
  },
  'zh-hant': {
    relatedRates: '相關運費', postalCourierLocal: '郵政與快遞費（本地）', service: '服務', notes: '備註', zone: '分區', countryRegion: '國家 / 地區', country: '國家', countryFullName: '國家（全名）', weight: '重量', region: '地區', currentPrice: '目前價格', noSurcharge: '無附加費', handlingFeeSurcharge: '處理費附加費（僅適用 ePAC）', currentSurchargeRates: '目前附加費率（僅適用 ePAC）', epacRates2026: 'SingPost ePAC 國際郵政費率 2026', emsRates2026: 'SpeedPost 國際優先（EMS）費率 2026', speedpostExpressRates: 'SpeedPost 國際快遞費率', trackedPrepaidLabel: 'SingPost 可追蹤預付標籤', doorstepDeliveryStd: '0.00 - 5.00kg（透過 SpeedPost Standard 寄送）- 送到府（1-3 個工作天）', southeastAsia: '東南亞', europe: '歐洲', includes: '含', except: '不含', asiaPacific: '亞太'
  },
  pt: {
    relatedRates: 'Tarifas relacionadas', postalCourierLocal: 'Tarifas postais e de correio (local)', service: 'Serviço', notes: 'Notas', zone: 'Zona', countryRegion: 'País / Região', country: 'País', countryFullName: 'País (nome completo)', weight: 'Peso', region: 'Região', currentPrice: 'Preço atual', noSurcharge: 'Sem sobretaxa', handlingFeeSurcharge: 'Sobretaxa de manuseio (aplica-se apenas ao ePAC)', currentSurchargeRates: 'Taxas de sobretaxa atuais (aplica-se apenas ao ePAC)', epacRates2026: 'Tarifas postais internacionais SingPost ePAC 2026', emsRates2026: 'Tarifas SpeedPost International Priority (EMS) 2026', speedpostExpressRates: 'Tarifas SpeedPost International Express', trackedPrepaidLabel: 'Etiqueta pré-paga rastreada SingPost', doorstepDeliveryStd: '0.00 - 5.00kg (Enviado via SpeedPost Standard) - Entrega na porta (1-3 dias úteis)', southeastAsia: 'Sudeste Asiático', europe: 'Europa', includes: 'incl.', except: 'exceto', asiaPacific: 'Ásia-Pacífico'
  },
  hi: {
    relatedRates: 'संबंधित दरें', postalCourierLocal: 'डाक और कूरियर दरें (स्थानीय)', service: 'सेवा', notes: 'टिप्पणियाँ', zone: 'ज़ोन', countryRegion: 'देश / क्षेत्र', country: 'देश', countryFullName: 'देश (पूरा नाम)', weight: 'वज़न', region: 'क्षेत्र', currentPrice: 'वर्तमान मूल्य', noSurcharge: 'कोई अधिभार नहीं', handlingFeeSurcharge: 'हैंडलिंग शुल्क अधिभार (केवल ePAC पर लागू)', currentSurchargeRates: 'वर्तमान अधिभार दरें (केवल ePAC पर लागू)', epacRates2026: 'SingPost ePAC अंतरराष्ट्रीय डाक दरें 2026', emsRates2026: 'SpeedPost इंटरनेशनल प्रायोरिटी (EMS) दरें 2026', speedpostExpressRates: 'SpeedPost इंटरनेशनल एक्सप्रेस दरें', trackedPrepaidLabel: 'SingPost ट्रैक्ड प्रीपेड लेबल', doorstepDeliveryStd: '0.00 - 5.00kg (SpeedPost Standard से भेजा गया) - घर तक डिलीवरी (1-3 कार्यदिवस)', southeastAsia: 'दक्षिण-पूर्व एशिया', europe: 'यूरोप', includes: 'शामिल', except: 'को छोड़कर', asiaPacific: 'एशिया प्रशांत'
  },
  th: {
    relatedRates: 'อัตราค่าจัดส่งที่เกี่ยวข้อง', postalCourierLocal: 'อัตราไปรษณีย์และขนส่ง (ภายในประเทศ)', service: 'บริการ', notes: 'หมายเหตุ', zone: 'โซน', countryRegion: 'ประเทศ / ภูมิภาค', country: 'ประเทศ', countryFullName: 'ประเทศ (ชื่อเต็ม)', weight: 'น้ำหนัก', region: 'ภูมิภาค', currentPrice: 'ราคาปัจจุบัน', noSurcharge: 'ไม่มีค่าธรรมเนียมเพิ่ม', handlingFeeSurcharge: 'ค่าธรรมเนียมการจัดการเพิ่มเติม (ใช้กับ ePAC เท่านั้น)', currentSurchargeRates: 'อัตราค่าธรรมเนียมปัจจุบัน (ใช้กับ ePAC เท่านั้น)', epacRates2026: 'อัตราไปรษณีย์ระหว่างประเทศ SingPost ePAC ปี 2026', emsRates2026: 'อัตรา SpeedPost International Priority (EMS) ปี 2026', speedpostExpressRates: 'อัตรา SpeedPost International Express', trackedPrepaidLabel: 'ฉลากชำระเงินล่วงหน้าแบบติดตาม SingPost', doorstepDeliveryStd: '0.00 - 5.00kg (จัดส่งผ่าน SpeedPost Standard) - ส่งถึงหน้าบ้าน (1-3 วันทำการ)', southeastAsia: 'เอเชียตะวันออกเฉียงใต้', europe: 'ยุโรป', includes: 'รวม', except: 'ยกเว้น', asiaPacific: 'เอเชียแปซิฟิก'
  },
  ms: {
    relatedRates: 'Kadar berkaitan', postalCourierLocal: 'Kadar Pos & Kurier (Tempatan)', service: 'Perkhidmatan', notes: 'Nota', zone: 'Zon', countryRegion: 'Negara / Wilayah', country: 'Negara', countryFullName: 'Negara (nama penuh)', weight: 'Berat', region: 'Wilayah', currentPrice: 'Harga semasa', noSurcharge: 'Tiada surcaj', handlingFeeSurcharge: 'Surcaj yuran pengendalian (terpakai untuk ePAC sahaja)', currentSurchargeRates: 'Kadar surcaj semasa (terpakai untuk ePAC sahaja)', epacRates2026: 'Kadar Pos Antarabangsa SingPost ePAC 2026', emsRates2026: 'Kadar SpeedPost International Priority (EMS) 2026', speedpostExpressRates: 'Kadar SpeedPost International Express', trackedPrepaidLabel: 'Label Prabayar Berjejak SingPost', doorstepDeliveryStd: '0.00 - 5.00kg (Dihantar melalui SpeedPost Standard) - Hantar ke pintu (1-3 hari bekerja)', southeastAsia: 'Asia Tenggara', europe: 'Eropah', includes: 'termasuk', except: 'kecuali', asiaPacific: 'Asia Pasifik'
  },
  nl: {
    relatedRates: 'Gerelateerde tarieven', postalCourierLocal: 'Post- en koerierstarieven (lokaal)', service: 'Service', notes: 'Notities', zone: 'Zone', countryRegion: 'Land / Regio', country: 'Land', countryFullName: 'Land (volledige naam)', weight: 'Gewicht', region: 'Regio', currentPrice: 'Huidige prijs', noSurcharge: 'Geen toeslag', handlingFeeSurcharge: 'Behandelingskostentoeslag (alleen van toepassing op ePAC)', currentSurchargeRates: 'Huidige toeslagtarieven (alleen van toepassing op ePAC)', epacRates2026: 'SingPost ePAC Internationale posttarieven 2026', emsRates2026: 'SpeedPost International Priority (EMS) tarieven 2026', speedpostExpressRates: 'SpeedPost International Express tarieven', trackedPrepaidLabel: 'SingPost gevolgd prepaid label', doorstepDeliveryStd: '0.00 - 5.00kg (Verzonden via SpeedPost Standard) - Levering aan de deur (1-3 werkdagen)', southeastAsia: 'Zuidoost-Azië', europe: 'Europa', includes: 'incl.', except: 'behalve', asiaPacific: 'Azië-Pacific'
  },
  id: {
    relatedRates: 'Tarif terkait', postalCourierLocal: 'Tarif Pos & Kurir (Lokal)', service: 'Layanan', notes: 'Catatan', zone: 'Zona', countryRegion: 'Negara / Wilayah', country: 'Negara', countryFullName: 'Negara (nama lengkap)', weight: 'Berat', region: 'Wilayah', currentPrice: 'Harga saat ini', noSurcharge: 'Tanpa biaya tambahan', handlingFeeSurcharge: 'Biaya tambahan penanganan (hanya berlaku untuk ePAC)', currentSurchargeRates: 'Tarif biaya tambahan saat ini (hanya berlaku untuk ePAC)', epacRates2026: 'Tarif Pos Internasional SingPost ePAC 2026', emsRates2026: 'Tarif SpeedPost International Priority (EMS) 2026', speedpostExpressRates: 'Tarif SpeedPost International Express', trackedPrepaidLabel: 'Label prabayar terlacak SingPost', doorstepDeliveryStd: '0.00 - 5.00kg (Dikirim via SpeedPost Standard) - Antar ke depan pintu (1-3 hari kerja)', southeastAsia: 'Asia Tenggara', europe: 'Eropa', includes: 'termasuk', except: 'kecuali', asiaPacific: 'Asia Pasifik'
  },
  cs: {
    relatedRates: 'Související sazby', postalCourierLocal: 'Poštovní a kurýrní sazby (místní)', service: 'Služba', notes: 'Poznámky', zone: 'Zóna', countryRegion: 'Země / Region', country: 'Země', countryFullName: 'Země (celý název)', weight: 'Hmotnost', region: 'Region', currentPrice: 'Aktuální cena', noSurcharge: 'Bez příplatku', handlingFeeSurcharge: 'Příplatek za manipulaci (platí pouze pro ePAC)', currentSurchargeRates: 'Aktuální sazby příplatku (platí pouze pro ePAC)', epacRates2026: 'Mezinárodní poštovní sazby SingPost ePAC 2026', emsRates2026: 'Sazby SpeedPost International Priority (EMS) 2026', speedpostExpressRates: 'Sazby SpeedPost International Express', trackedPrepaidLabel: 'Předplacený sledovaný štítek SingPost', doorstepDeliveryStd: '0.00 - 5.00kg (Odesláno přes SpeedPost Standard) - Doručení ke dveřím (1-3 pracovní dny)', southeastAsia: 'Jihovýchodní Asie', europe: 'Evropa', includes: 'vč.', except: 'kromě', asiaPacific: 'Asie a Tichomoří'
  },
  it: {
    relatedRates: 'Tariffe correlate', postalCourierLocal: 'Tariffe postali e corriere (locale)', service: 'Servizio', notes: 'Note', zone: 'Zona', countryRegion: 'Paese / Regione', country: 'Paese', countryFullName: 'Paese (nome completo)', weight: 'Peso', region: 'Regione', currentPrice: 'Prezzo attuale', noSurcharge: 'Nessun sovrapprezzo', handlingFeeSurcharge: 'Sovrapprezzo di gestione (si applica solo a ePAC)', currentSurchargeRates: 'Tariffe sovrapprezzo attuali (si applica solo a ePAC)', epacRates2026: 'Tariffe postali internazionali SingPost ePAC 2026', emsRates2026: 'Tariffe SpeedPost International Priority (EMS) 2026', speedpostExpressRates: 'Tariffe SpeedPost International Express', trackedPrepaidLabel: 'Etichetta prepagata tracciata SingPost', doorstepDeliveryStd: '0.00 - 5.00kg (Spedito tramite SpeedPost Standard) - Consegna a domicilio (1-3 giorni lavorativi)', southeastAsia: 'Sud-est asiatico', europe: 'Europa', includes: 'incl.', except: 'tranne', asiaPacific: 'Asia Pacifico'
  },
  he: {
    relatedRates: 'תעריפים קשורים', postalCourierLocal: 'תעריפי דואר ושליחויות (מקומי)', service: 'שירות', notes: 'הערות', zone: 'אזור', countryRegion: 'מדינה / אזור', country: 'מדינה', countryFullName: 'מדינה (שם מלא)', weight: 'משקל', region: 'אזור', currentPrice: 'מחיר נוכחי', noSurcharge: 'ללא תוספת', handlingFeeSurcharge: 'תוספת דמי טיפול (חל רק על ePAC)', currentSurchargeRates: 'שיעורי תוספת נוכחיים (חל רק על ePAC)', epacRates2026: 'תעריפי דואר בינלאומיים SingPost ePAC לשנת 2026', emsRates2026: 'תעריפי SpeedPost International Priority (EMS) לשנת 2026', speedpostExpressRates: 'תעריפי SpeedPost International Express', trackedPrepaidLabel: 'תווית משולמת מראש עם מעקב של SingPost', doorstepDeliveryStd: '0.00 - 5.00kg (נשלח דרך SpeedPost Standard) - מסירה עד הדלת (1-3 ימי עסקים)', southeastAsia: 'דרום־מזרח אסיה', europe: 'אירופה', includes: 'כולל', except: 'למעט', asiaPacific: 'אסיה פסיפיק'
  },
  ga: {
    relatedRates: 'Rátaí gaolmhara', postalCourierLocal: 'Rátaí Poist & Cúiréireachta (Áitiúil)', service: 'Seirbhís', notes: 'Nótaí', zone: 'Crios', countryRegion: 'Tír / Réigiún', country: 'Tír', countryFullName: 'Tír (ainm iomlán)', weight: 'Meáchan', region: 'Réigiún', currentPrice: 'Praghas reatha', noSurcharge: 'Gan formhuirear', handlingFeeSurcharge: 'Formhuirear táille láimhseála (baineann le ePAC amháin)', currentSurchargeRates: 'Rátaí formhuirir reatha (baineann le ePAC amháin)', epacRates2026: 'Rátaí Poist Idirnáisiúnta SingPost ePAC 2026', emsRates2026: 'Rátaí SpeedPost International Priority (EMS) 2026', speedpostExpressRates: 'Rátaí SpeedPost International Express', trackedPrepaidLabel: 'Lipéad réamhíoctha le rianú SingPost', doorstepDeliveryStd: '0.00 - 5.00kg (Seolta via SpeedPost Standard) - Seachadadh go doras (1-3 lá oibre)', southeastAsia: 'Oirdheisceart na hÁise', europe: 'An Eoraip', includes: 'san áireamh', except: 'seachas', asiaPacific: 'Áise an Aigéin Chiúin'
  },
  pl: {
    relatedRates: 'Powiązane stawki', postalCourierLocal: 'Stawki pocztowe i kurierskie (lokalne)', service: 'Usługa', notes: 'Uwagi', zone: 'Strefa', countryRegion: 'Kraj / Region', country: 'Kraj', countryFullName: 'Kraj (pełna nazwa)', weight: 'Waga', region: 'Region', currentPrice: 'Aktualna cena', noSurcharge: 'Bez dopłaty', handlingFeeSurcharge: 'Dopłata manipulacyjna (dotyczy tylko ePAC)', currentSurchargeRates: 'Aktualne stawki dopłat (dotyczy tylko ePAC)', epacRates2026: 'Międzynarodowe stawki pocztowe SingPost ePAC 2026', emsRates2026: 'Stawki SpeedPost International Priority (EMS) 2026', speedpostExpressRates: 'Stawki SpeedPost International Express', trackedPrepaidLabel: 'Przedpłacona etykieta śledzona SingPost', doorstepDeliveryStd: '0.00 - 5.00kg (Wysyłka przez SpeedPost Standard) - Dostawa pod drzwi (1-3 dni robocze)', southeastAsia: 'Azja Południowo-Wschodnia', europe: 'Europa', includes: 'w tym', except: 'z wyjątkiem', asiaPacific: 'Azja i Pacyfik'
  },
  ko: {
    relatedRates: '관련 요금', postalCourierLocal: '우편 및 택배 요금(국내)', service: '서비스', notes: '비고', zone: '구역', countryRegion: '국가 / 지역', country: '국가', countryFullName: '국가(전체 이름)', weight: '중량', region: '지역', currentPrice: '현재 가격', noSurcharge: '추가요금 없음', handlingFeeSurcharge: '취급 수수료 할증(ePAC에만 적용)', currentSurchargeRates: '현재 할증 요율(ePAC에만 적용)', epacRates2026: 'SingPost ePAC 국제 우편 요금 2026', emsRates2026: 'SpeedPost International Priority (EMS) 요금 2026', speedpostExpressRates: 'SpeedPost International Express 요금', trackedPrepaidLabel: 'SingPost 추적 선불 라벨', doorstepDeliveryStd: '0.00 - 5.00kg (SpeedPost Standard 발송) - 문앞 배송(영업일 1-3일)', southeastAsia: '동남아시아', europe: '유럽', includes: '포함', except: '제외', asiaPacific: '아시아 태평양'
  },
  no: {
    relatedRates: 'Relaterte satser', postalCourierLocal: 'Post- og budsatser (lokalt)', service: 'Tjeneste', notes: 'Merknader', zone: 'Sone', countryRegion: 'Land / Region', country: 'Land', countryFullName: 'Land (fullt navn)', weight: 'Vekt', region: 'Region', currentPrice: 'Nåværende pris', noSurcharge: 'Ingen tillegg', handlingFeeSurcharge: 'Håndteringsgebyrtillegg (gjelder kun ePAC)', currentSurchargeRates: 'Gjeldende tilleggssatser (gjelder kun ePAC)', epacRates2026: 'SingPost ePAC internasjonale postpriser 2026', emsRates2026: 'SpeedPost International Priority (EMS) satser 2026', speedpostExpressRates: 'SpeedPost International Express satser', trackedPrepaidLabel: 'SingPost sporet forhåndsbetalt etikett', doorstepDeliveryStd: '0.00 - 5.00kg (Sendt via SpeedPost Standard) - Levering på dørstokken (1-3 virkedager)', southeastAsia: 'Sørøst-Asia', europe: 'Europa', includes: 'inkl.', except: 'unntatt', asiaPacific: 'Asia-Stillehavet'
  },
  ru: {
    relatedRates: 'Связанные тарифы', postalCourierLocal: 'Почтовые и курьерские тарифы (местные)', service: 'Услуга', notes: 'Примечания', zone: 'Зона', countryRegion: 'Страна / Регион', country: 'Страна', countryFullName: 'Страна (полное название)', weight: 'Вес', region: 'Регион', currentPrice: 'Текущая цена', noSurcharge: 'Без надбавки', handlingFeeSurcharge: 'Надбавка за обработку (только для ePAC)', currentSurchargeRates: 'Текущие ставки надбавки (только для ePAC)', epacRates2026: 'Международные почтовые тарифы SingPost ePAC 2026', emsRates2026: 'Тарифы SpeedPost International Priority (EMS) 2026', speedpostExpressRates: 'Тарифы SpeedPost International Express', trackedPrepaidLabel: 'Отслеживаемая предоплаченная наклейка SingPost', doorstepDeliveryStd: '0.00 - 5.00kg (Отправка через SpeedPost Standard) - Доставка до двери (1-3 рабочих дня)', southeastAsia: 'Юго-Восточная Азия', europe: 'Европа', includes: 'вкл.', except: 'кроме', asiaPacific: 'Азиатско-Тихоокеанский регион'
  },
  sv: {
    relatedRates: 'Relaterade priser', postalCourierLocal: 'Post- och budpriser (lokalt)', service: 'Tjänst', notes: 'Anteckningar', zone: 'Zon', countryRegion: 'Land / Region', country: 'Land', countryFullName: 'Land (fullständigt namn)', weight: 'Vikt', region: 'Region', currentPrice: 'Nuvarande pris', noSurcharge: 'Ingen tilläggsavgift', handlingFeeSurcharge: 'Hanteringsavgiftstillägg (gäller endast ePAC)', currentSurchargeRates: 'Nuvarande tilläggsavgifter (gäller endast ePAC)', epacRates2026: 'SingPost ePAC internationella postpriser 2026', emsRates2026: 'SpeedPost International Priority (EMS) priser 2026', speedpostExpressRates: 'SpeedPost International Express priser', trackedPrepaidLabel: 'SingPost spårad förbetald etikett', doorstepDeliveryStd: '0.00 - 5.00kg (Skickas via SpeedPost Standard) - Leverans till dörren (1-3 arbetsdagar)', southeastAsia: 'Sydostasien', europe: 'Europa', includes: 'inkl.', except: 'förutom', asiaPacific: 'Asien och Stillahavsområdet'
  },
  fi: {
    relatedRates: 'Liittyvät hinnat', postalCourierLocal: 'Posti- ja kuriirihinnat (paikallinen)', service: 'Palvelu', notes: 'Huomautukset', zone: 'Vyöhyke', countryRegion: 'Maa / Alue', country: 'Maa', countryFullName: 'Maa (koko nimi)', weight: 'Paino', region: 'Alue', currentPrice: 'Nykyinen hinta', noSurcharge: 'Ei lisämaksua', handlingFeeSurcharge: 'Käsittelymaksulisä (koskee vain ePACia)', currentSurchargeRates: 'Nykyiset lisämaksuprosentit (koskee vain ePACia)', epacRates2026: 'SingPost ePAC kansainväliset postihinnat 2026', emsRates2026: 'SpeedPost International Priority (EMS) hinnat 2026', speedpostExpressRates: 'SpeedPost International Express hinnat', trackedPrepaidLabel: 'SingPost seurattu ennakkomaksutarra', doorstepDeliveryStd: '0.00 - 5.00kg (Lähetetään SpeedPost Standardilla) - Toimitus ovelle (1-3 arkipäivää)', southeastAsia: 'Kaakkois-Aasia', europe: 'Eurooppa', includes: 'sis.', except: 'paitsi', asiaPacific: 'Aasian ja Tyynenmeren alue'
  },
  tl: {
    relatedRates: 'Kaugnay na mga rate', postalCourierLocal: 'Mga Rate ng Koreo at Courier (Lokal)', service: 'Serbisyo', notes: 'Mga Tala', zone: 'Zone', countryRegion: 'Bansa / Rehiyon', country: 'Bansa', countryFullName: 'Bansa (buong pangalan)', weight: 'Bigat', region: 'Rehiyon', currentPrice: 'Kasalukuyang presyo', noSurcharge: 'Walang dagdag singil', handlingFeeSurcharge: 'Dagdag na bayad sa paghawak (para sa ePAC lamang)', currentSurchargeRates: 'Kasalukuyang surcharge rates (para sa ePAC lamang)', epacRates2026: 'SingPost ePAC International Postal Rates 2026', emsRates2026: 'SpeedPost International Priority (EMS) Rates 2026', speedpostExpressRates: 'SpeedPost International Express Rates', trackedPrepaidLabel: 'SingPost Tracked Prepaid Label', doorstepDeliveryStd: '0.00 - 5.00kg (Ipinapadala via SpeedPost Standard) - Doorstep Delivery (1-3 business days)', southeastAsia: 'Timog-Silangang Asya', europe: 'Europa', includes: 'kabilang', except: 'maliban', asiaPacific: 'Asya Pasipiko'
  },
  vi: {
    relatedRates: 'Mức phí liên quan', postalCourierLocal: 'Cước bưu chính & chuyển phát (nội địa)', service: 'Dịch vụ', notes: 'Ghi chú', zone: 'Vùng', countryRegion: 'Quốc gia / Khu vực', country: 'Quốc gia', countryFullName: 'Quốc gia (tên đầy đủ)', weight: 'Khối lượng', region: 'Khu vực', currentPrice: 'Giá hiện tại', noSurcharge: 'Không phụ phí', handlingFeeSurcharge: 'Phụ phí xử lý (chỉ áp dụng cho ePAC)', currentSurchargeRates: 'Mức phụ phí hiện tại (chỉ áp dụng cho ePAC)', epacRates2026: 'Biểu phí bưu chính quốc tế SingPost ePAC 2026', emsRates2026: 'Biểu phí SpeedPost International Priority (EMS) 2026', speedpostExpressRates: 'Biểu phí SpeedPost International Express', trackedPrepaidLabel: 'Nhãn trả trước có theo dõi SingPost', doorstepDeliveryStd: '0.00 - 5.00kg (Gửi qua SpeedPost Standard) - Giao tận cửa (1-3 ngày làm việc)', southeastAsia: 'Đông Nam Á', europe: 'Châu Âu', includes: 'bao gồm', except: 'ngoại trừ', asiaPacific: 'Châu Á - Thái Bình Dương'
  },
  cy: {
    relatedRates: 'Cyfraddau cysylltiedig', postalCourierLocal: 'Cyfraddau Post a Chourier (Lleol)', service: 'Gwasanaeth', notes: 'Nodiadau', zone: 'Parth', countryRegion: 'Gwlad / Rhanbarth', country: 'Gwlad', countryFullName: 'Gwlad (enw llawn)', weight: 'Pwysau', region: 'Rhanbarth', currentPrice: 'Pris cyfredol', noSurcharge: 'Dim gordal', handlingFeeSurcharge: 'Gordal ffi trin (yn berthnasol i ePAC yn unig)', currentSurchargeRates: 'Cyfraddau gordal cyfredol (yn berthnasol i ePAC yn unig)', epacRates2026: 'Cyfraddau Post Rhyngwladol SingPost ePAC 2026', emsRates2026: 'Cyfraddau SpeedPost International Priority (EMS) 2026', speedpostExpressRates: 'Cyfraddau SpeedPost International Express', trackedPrepaidLabel: 'Label Rhagdaledig wedi’i Olrhain SingPost', doorstepDeliveryStd: '0.00 - 5.00kg (Wedi’i anfon trwy SpeedPost Standard) - Dosbarthu i’r drws (1-3 diwrnod busnes)', southeastAsia: 'De-ddwyrain Asia', europe: 'Ewrop', includes: 'gan gynnwys', except: 'heblaw', asiaPacific: 'Asia a’r Môr Tawel'
  },
  ta: {
    relatedRates: 'தொடர்புடைய கட்டணங்கள்', postalCourierLocal: 'அஞ்சல் மற்றும் கூரியர் கட்டணங்கள் (உள்ளூர்)', service: 'சேவை', notes: 'குறிப்புகள்', zone: 'மண்டலம்', countryRegion: 'நாடு / பகுதி', country: 'நாடு', countryFullName: 'நாடு (முழுப்பெயர்)', weight: 'எடை', region: 'பகுதி', currentPrice: 'தற்போதைய விலை', noSurcharge: 'கூடுதல் கட்டணம் இல்லை', handlingFeeSurcharge: 'கையாளும் கட்டண கூடுதல் (ePAC-க்கு மட்டும் பொருந்தும்)', currentSurchargeRates: 'தற்போதைய கூடுதல் கட்டண விகிதங்கள் (ePAC-க்கு மட்டும் பொருந்தும்)', epacRates2026: 'SingPost ePAC சர்வதேச அஞ்சல் கட்டணங்கள் 2026', emsRates2026: 'SpeedPost International Priority (EMS) கட்டணங்கள் 2026', speedpostExpressRates: 'SpeedPost International Express கட்டணங்கள்', trackedPrepaidLabel: 'SingPost கண்காணிப்பு முன்பணம் லேபிள்', doorstepDeliveryStd: '0.00 - 5.00kg (SpeedPost Standard மூலம் அனுப்பப்படுகிறது) - வீட்டு வாசல் விநியோகம் (1-3 வேலை நாட்கள்)', southeastAsia: 'தென் கிழக்கு ஆசியா', europe: 'ஐரோப்பா', includes: 'உட்பட', except: 'தவிர', asiaPacific: 'ஆசியா பசிபிக்'
  },
  mi: {
    relatedRates: 'Ngā utu e pā ana', postalCourierLocal: 'Ngā Utu Poutāpeta me te Kaikawe (Ā-rohe)', service: 'Ratonga', notes: 'Ngā tuhipoka', zone: 'Rohe', countryRegion: 'Whenua / Rohe', country: 'Whenua', countryFullName: 'Whenua (ingoa katoa)', weight: 'Taumaha', region: 'Rohe', currentPrice: 'Utu onāianei', noSurcharge: 'Kāore he utu tāpiri', handlingFeeSurcharge: 'Utu tāpiri whakahaere (mō te ePAC anake)', currentSurchargeRates: 'Ngā reiti utu tāpiri onāianei (mō te ePAC anake)', epacRates2026: 'Ngā Utu Poutāpeta ā-ao SingPost ePAC 2026', emsRates2026: 'Ngā Utu SpeedPost International Priority (EMS) 2026', speedpostExpressRates: 'Ngā Utu SpeedPost International Express', trackedPrepaidLabel: 'Tapanga Utu-Mua Aroturuki SingPost', doorstepDeliveryStd: '0.00 - 5.00kg (Ka tukuna mā SpeedPost Standard) - Tukunga ki te kūwaha (1-3 rā mahi)', southeastAsia: 'Āhia ki te Tonga mā Rāwhiti', europe: 'Ūropi', includes: 'kei roto', except: 'haunga', asiaPacific: 'Āhia-Kiwa'
  }
};

const EXTRA_TERMS = {
  en: {
    epacSaturdayGlobal: 'ePAC will also now be posted on Saturdays for the rest of the world.',
    etsyZoneLNoEmsSaturday: 'Note: Prices on Etsy will be fixed to Zone L. Please kindly contact us for a quote through Etsy messages. No posting for EMS on Saturdays as shipping is too costly.'
  },
  de: {
    epacSaturdayGlobal: 'ePAC wird nun auch samstags für den Rest der Welt versendet.',
    etsyZoneLNoEmsSaturday: 'Hinweis: Preise auf Etsy sind auf Zone L festgelegt. Bitte kontaktieren Sie uns freundlich für ein Angebot über Etsy-Nachrichten. EMS wird samstags nicht versendet, da der Versand zu teuer ist.'
  },
  fr: {
    epacSaturdayGlobal: 'ePAC sera désormais également expédié le samedi pour le reste du monde.',
    etsyZoneLNoEmsSaturday: 'Remarque : Les prix sur Etsy seront fixés à la zone L. Veuillez nous contacter pour un devis via les messages Etsy. Aucun envoi EMS le samedi car l’expédition est trop coûteuse.'
  },
  es: {
    epacSaturdayGlobal: 'ePAC ahora también se enviará los sábados para el resto del mundo.',
    etsyZoneLNoEmsSaturday: 'Nota: Los precios en Etsy estarán fijados en la Zona L. Por favor contáctanos para una cotización por mensajes de Etsy. No hay envíos EMS los sábados porque el envío es demasiado costoso.'
  },
  ja: {
    epacSaturdayGlobal: 'ePACは、世界のその他地域向けにも土曜日に発送されます。',
    etsyZoneLNoEmsSaturday: '注: Etsyでの価格はゾーンLで固定されます。Etsyメッセージでお見積もりをご連絡ください。EMSは送料が高すぎるため土曜日の発送はありません。'
  },
  zh: {
    epacSaturdayGlobal: 'ePAC 现在也会在周六寄往世界其他地区。',
    etsyZoneLNoEmsSaturday: '注意：Etsy 上的价格将固定为 Zone L。请通过 Etsy 消息联系我们获取报价。由于运费过高，EMS 周六不寄送。'
  },
  'zh-hant': {
    epacSaturdayGlobal: 'ePAC 現在也會於星期六寄往世界其他地區。',
    etsyZoneLNoEmsSaturday: '注意：Etsy 上的價格將固定為 Zone L。請透過 Etsy 訊息聯絡我們索取報價。由於運費過高，EMS 週六不寄送。'
  },
  pt: {
    epacSaturdayGlobal: 'O ePAC agora também será enviado aos sábados para o resto do mundo.',
    etsyZoneLNoEmsSaturday: 'Nota: Os preços no Etsy serão fixados na Zona L. Entre em contato conosco para um orçamento via mensagens do Etsy. Não há postagem EMS aos sábados, pois o frete é muito caro.'
  },
  hi: {
    epacSaturdayGlobal: 'अब ePAC दुनिया के बाकी हिस्सों के लिए शनिवार को भी पोस्ट किया जाएगा।',
    etsyZoneLNoEmsSaturday: 'नोट: Etsy पर कीमतें Zone L पर तय रहेंगी। कृपया कोटेशन के लिए Etsy संदेशों के माध्यम से हमसे संपर्क करें। शिपिंग बहुत महंगी होने के कारण शनिवार को EMS पोस्टिंग नहीं है।'
  },
  th: {
    epacSaturdayGlobal: 'ขณะนี้ ePAC จะจัดส่งในวันเสาร์สำหรับประเทศอื่น ๆ ทั่วโลกด้วย',
    etsyZoneLNoEmsSaturday: 'หมายเหตุ: ราคาบน Etsy จะถูกกำหนดเป็นโซน L กรุณาติดต่อเราผ่านข้อความ Etsy เพื่อขอใบเสนอราคา ไม่มีการส่ง EMS ในวันเสาร์เนื่องจากค่าขนส่งสูงเกินไป'
  },
  ms: {
    epacSaturdayGlobal: 'ePAC kini juga akan dipos pada hari Sabtu untuk seluruh dunia.',
    etsyZoneLNoEmsSaturday: 'Nota: Harga di Etsy akan ditetapkan kepada Zon L. Sila hubungi kami untuk sebut harga melalui mesej Etsy. Tiada pengeposan EMS pada hari Sabtu kerana kos penghantaran terlalu tinggi.'
  },
  nl: {
    epacSaturdayGlobal: 'ePAC wordt nu ook op zaterdag verzonden voor de rest van de wereld.',
    etsyZoneLNoEmsSaturday: 'Opmerking: Prijzen op Etsy worden vastgesteld op Zone L. Neem vriendelijk contact met ons op voor een offerte via Etsy-berichten. Er is geen EMS-verzending op zaterdag omdat de verzendkosten te hoog zijn.'
  },
  id: {
    epacSaturdayGlobal: 'ePAC sekarang juga akan dikirim pada hari Sabtu untuk seluruh dunia.',
    etsyZoneLNoEmsSaturday: 'Catatan: Harga di Etsy akan tetap di Zona L. Silakan hubungi kami untuk penawaran melalui pesan Etsy. Tidak ada pengiriman EMS pada hari Sabtu karena biaya kirim terlalu mahal.'
  },
  cs: {
    epacSaturdayGlobal: 'ePAC bude nyní odesílán také v sobotu do zbytku světa.',
    etsyZoneLNoEmsSaturday: 'Poznámka: Ceny na Etsy budou pevně nastaveny na zónu L. Kontaktujte nás prosím pro cenovou nabídku přes zprávy na Etsy. EMS se v sobotu neodesílá, protože doprava je příliš drahá.'
  },
  it: {
    epacSaturdayGlobal: 'ePAC sarà ora spedito anche il sabato per il resto del mondo.',
    etsyZoneLNoEmsSaturday: 'Nota: I prezzi su Etsy saranno fissati alla Zona L. Ti preghiamo di contattarci per un preventivo tramite i messaggi Etsy. Nessuna spedizione EMS il sabato perché i costi di spedizione sono troppo elevati.'
  },
  he: {
    epacSaturdayGlobal: 'ePAC יישלח כעת גם בימי שבת לשאר העולם.',
    etsyZoneLNoEmsSaturday: 'הערה: המחירים ב-Etsy יקובעו לאזור L. אנא צרו איתנו קשר להצעת מחיר דרך הודעות Etsy. אין משלוח EMS בימי שבת משום שעלויות המשלוח גבוהות מדי.'
  },
  ga: {
    epacSaturdayGlobal: 'Cuirfear ePAC sa phost anois ar an Satharn freisin don chuid eile den domhan.',
    etsyZoneLNoEmsSaturday: 'Nóta: Socrófar praghsanna ar Etsy do Chrios L. Déan teagmháil linn le haghaidh luachan trí theachtaireachtaí Etsy. Ní sheoltar EMS ar an Satharn mar tá an loingseoireacht róchostasach.'
  },
  pl: {
    epacSaturdayGlobal: 'ePAC będzie teraz wysyłany także w soboty do reszty świata.',
    etsyZoneLNoEmsSaturday: 'Uwaga: Ceny na Etsy będą ustawione na strefę L. Prosimy o kontakt w celu wyceny przez wiadomości Etsy. EMS nie jest nadawany w soboty, ponieważ wysyłka jest zbyt kosztowna.'
  },
  ko: {
    epacSaturdayGlobal: 'ePAC은 이제 전 세계 나머지 지역으로도 토요일에 발송됩니다.',
    etsyZoneLNoEmsSaturday: '참고: Etsy 가격은 Zone L로 고정됩니다. Etsy 메시지로 견적을 문의해 주세요. 배송비가 너무 비싸서 토요일에는 EMS 발송이 없습니다.'
  },
  no: {
    epacSaturdayGlobal: 'ePAC vil nå også bli postet på lørdager for resten av verden.',
    etsyZoneLNoEmsSaturday: 'Merk: Prisene på Etsy vil være fastsatt til sone L. Vennligst kontakt oss for et pristilbud via Etsy-meldinger. Ingen EMS-posting på lørdager fordi frakten er for kostbar.'
  },
  ru: {
    epacSaturdayGlobal: 'Теперь ePAC также будет отправляться по субботам в остальные страны мира.',
    etsyZoneLNoEmsSaturday: 'Примечание: цены на Etsy будут фиксированы для зоны L. Пожалуйста, свяжитесь с нами для расчёта через сообщения Etsy. По субботам отправка EMS не осуществляется, так как доставка слишком дорогая.'
  },
  sv: {
    epacSaturdayGlobal: 'ePAC kommer nu även att skickas på lördagar till resten av världen.',
    etsyZoneLNoEmsSaturday: 'Obs: Priser på Etsy kommer att vara fasta till zon L. Kontakta oss gärna för offert via Etsy-meddelanden. Ingen EMS-postning på lördagar eftersom frakten är för dyr.'
  },
  fi: {
    epacSaturdayGlobal: 'ePAC lähetetään nyt myös lauantaisin muualle maailmaan.',
    etsyZoneLNoEmsSaturday: 'Huom: Etsy-hinnat kiinnitetään vyöhykkeeseen L. Ota ystävällisesti yhteyttä tarjouspyyntöä varten Etsy-viesteillä. EMS-lähetyksiä ei postiteta lauantaisin, koska toimitus on liian kallista.'
  },
  tl: {
    epacSaturdayGlobal: 'Ang ePAC ay ipo-post na rin tuwing Sabado para sa natitirang bahagi ng mundo.',
    etsyZoneLNoEmsSaturday: 'Tandaan: Ang mga presyo sa Etsy ay naka-fix sa Zone L. Pakiusap makipag-ugnayan sa amin para sa quote sa pamamagitan ng Etsy messages. Walang EMS posting tuwing Sabado dahil masyadong mahal ang shipping.'
  },
  vi: {
    epacSaturdayGlobal: 'ePAC hiện cũng sẽ được gửi vào thứ Bảy cho phần còn lại của thế giới.',
    etsyZoneLNoEmsSaturday: 'Lưu ý: Giá trên Etsy sẽ được cố định theo Vùng L. Vui lòng liên hệ chúng tôi để nhận báo giá qua tin nhắn Etsy. Không gửi EMS vào thứ Bảy vì chi phí vận chuyển quá cao.'
  },
  cy: {
    epacSaturdayGlobal: 'Bydd ePAC nawr hefyd yn cael ei bostio ar ddydd Sadwrn ar gyfer gweddill y byd.',
    etsyZoneLNoEmsSaturday: 'Nodyn: Bydd prisiau ar Etsy yn sefydlog i Barth L. Cysylltwch â ni am ddyfynbris drwy negeseuon Etsy. Nid oes postio EMS ar ddydd Sadwrn gan fod y cludo yn rhy gostus.'
  },
  ta: {
    epacSaturdayGlobal: 'ePAC இப்போது உலகின் மற்ற பகுதிகளுக்காக சனிக்கிழமைகளிலும் அனுப்பப்படும்.',
    etsyZoneLNoEmsSaturday: 'குறிப்பு: Etsy-இல் விலைகள் Zone L ஆக நிர்ணயமாக இருக்கும். விலை மேற்கோள் பெற Etsy செய்திகளின் மூலம் எங்களை தொடர்புகொள்ளவும். கப்பல் செலவு மிக அதிகமாக இருப்பதால் சனிக்கிழமைகளில் EMS அனுப்புதல் இல்லை.'
  },
  mi: {
    epacSaturdayGlobal: 'Ka tukuna hoki te ePAC i ngā Rāhoroi mō te toenga o te ao.',
    etsyZoneLNoEmsSaturday: 'Tuhipoka: Ka pūmau ngā utu ki Etsy ki te Rohe L. Tēnā whakapā mai mō tētahi kōrero utu mā ngā karere Etsy. Kāore he tuku EMS i ngā Rāhoroi nā te nui rawa o te utu tuku.'
  }
};

const SPEEDPOST_NOTES = {
  en: {
    spxPoBoxNotice: 'Important: This service cannot be shipped to PO Box or APO/FPO addresses. Last-mile delivery is handled by DHL, and last-mile tracking is available on this website.',
    spxUsaDduNote: 'USA note: Shipments to the United States are DDU (Delivery Duty Unpaid) by default; duties and taxes are paid by the recipient to customs.',
    spxEtsyZone4Note: 'Etsy note: Prices on Etsy are fixed to Zone 4. Please contact us through Etsy messages for a quote.',
    spxNoSaturdayNote: 'This service is not posted on Saturdays because shipping costs are too high.'
  },
  de: {
    spxPoBoxNotice: 'Wichtig: Dieser Service kann nicht an PO-Box- oder APO/FPO-Adressen versendet werden. Die letzte Meile wird von DHL zugestellt, und die Sendungsverfolgung der letzten Meile ist auf dieser Website verfügbar.',
    spxUsaDduNote: 'Hinweis USA: Sendungen in die USA sind standardmäßig DDU (Delivery Duty Unpaid); Zölle und Steuern werden vom Empfänger an den Zoll gezahlt.',
    spxEtsyZone4Note: 'Hinweis Etsy: Preise auf Etsy sind auf Zone 4 festgelegt. Bitte kontaktieren Sie uns für ein Angebot über Etsy-Nachrichten.',
    spxNoSaturdayNote: 'Dieser Service wird samstags nicht aufgegeben, da die Versandkosten zu hoch sind.'
  },
  fr: {
    spxPoBoxNotice: 'Important : Ce service ne peut pas être expédié vers des adresses PO Box ou APO/FPO. La livraison du dernier kilomètre est assurée par DHL, et le suivi du dernier kilomètre est disponible sur ce site.',
    spxUsaDduNote: 'Note USA : Les envois vers les États-Unis sont en DDU (Delivery Duty Unpaid) par défaut ; les droits et taxes sont payés par le destinataire aux douanes.',
    spxEtsyZone4Note: 'Note Etsy : Les prix sur Etsy sont fixés à la zone 4. Veuillez nous contacter via les messages Etsy pour un devis.',
    spxNoSaturdayNote: 'Ce service n’est pas expédié le samedi car les frais d’expédition sont trop élevés.'
  },
  es: {
    spxPoBoxNotice: 'Importante: Este servicio no puede enviarse a direcciones PO Box ni APO/FPO. La última milla la gestiona DHL y el seguimiento de última milla está disponible en este sitio web.',
    spxUsaDduNote: 'Nota para EE. UU.: Los envíos a Estados Unidos son DDU (Delivery Duty Unpaid) por defecto; los aranceles e impuestos los paga el destinatario a aduanas.',
    spxEtsyZone4Note: 'Nota de Etsy: Los precios en Etsy están fijados en la Zona 4. Contáctanos por mensajes de Etsy para una cotización.',
    spxNoSaturdayNote: 'Este servicio no se despacha los sábados porque el costo de envío es demasiado alto.'
  },
  ja: {
    spxPoBoxNotice: '重要: このサービスは PO Box および APO/FPO 宛てには発送できません。ラストマイル配送は DHL が担当し、ラストマイル追跡はこのウェブサイトで確認できます。',
    spxUsaDduNote: '米国向け注意: 米国向け発送はデフォルトで DDU（関税・税金受取人払い）です。関税・税金は受取人が税関へ支払います。',
    spxEtsyZone4Note: 'Etsy 注意: Etsy 上の価格は Zone 4 固定です。お見積りは Etsy メッセージでご連絡ください。',
    spxNoSaturdayNote: '送料が高すぎるため、このサービスは土曜日の発送を行っていません。'
  },
  zh: {
    spxPoBoxNotice: '重要：此服务无法寄送至邮政信箱（PO Box）或 APO/FPO 地址。末端派送由 DHL 负责，末端追踪可在本网站查看。',
    spxUsaDduNote: '美国说明：寄往美国的货件默认采用 DDU（关税未付）；关税与税费由收件人向海关支付。',
    spxEtsyZone4Note: 'Etsy 说明：Etsy 上价格固定为 Zone 4。请通过 Etsy 讯息联系我们获取报价。',
    spxNoSaturdayNote: '由于运费过高，此服务周六不出货。'
  },
  'zh-hant': {
    spxPoBoxNotice: '重要：此服務無法寄送至郵政信箱（PO Box）或 APO/FPO 地址。末端派送由 DHL 負責，末端追蹤可在本網站查看。',
    spxUsaDduNote: '美國說明：寄往美國的貨件預設為 DDU（關稅未付）；關稅與稅費由收件人向海關支付。',
    spxEtsyZone4Note: 'Etsy 說明：Etsy 上價格固定為 Zone 4。請透過 Etsy 訊息聯絡我們取得報價。',
    spxNoSaturdayNote: '由於運費過高，此服務週六不寄送。'
  },
  pt: {
    spxPoBoxNotice: 'Importante: Este serviço não pode ser enviado para caixas postais (PO Box) ou endereços APO/FPO. A entrega de última milha é feita pela DHL, e o rastreamento da última milha está disponível neste site.',
    spxUsaDduNote: 'Nota dos EUA: Envios para os Estados Unidos são DDU (Delivery Duty Unpaid) por padrão; taxas e impostos são pagos pelo destinatário à alfândega.',
    spxEtsyZone4Note: 'Nota Etsy: Os preços no Etsy são fixos para a Zona 4. Entre em contato conosco por mensagens no Etsy para cotação.',
    spxNoSaturdayNote: 'Este serviço não é postado aos sábados porque o custo de envio é muito alto.'
  },
  hi: {
    spxPoBoxNotice: 'महत्वपूर्ण: यह सेवा PO Box या APO/FPO पते पर नहीं भेजी जा सकती। अंतिम-मील डिलीवरी DHL द्वारा की जाती है और अंतिम-मील ट्रैकिंग इस वेबसाइट पर उपलब्ध है।',
    spxUsaDduNote: 'यूएसए नोट: संयुक्त राज्य अमेरिका के लिए शिपमेंट डिफ़ॉल्ट रूप से DDU (Delivery Duty Unpaid) है; शुल्क और कर प्राप्तकर्ता द्वारा कस्टम्स को भुगतान किए जाते हैं।',
    spxEtsyZone4Note: 'Etsy नोट: Etsy पर कीमतें Zone 4 पर निश्चित हैं। कृपया कोटेशन के लिए Etsy संदेशों के माध्यम से हमसे संपर्क करें।',
    spxNoSaturdayNote: 'शिपिंग लागत बहुत अधिक होने के कारण यह सेवा शनिवार को पोस्ट नहीं की जाती।'
  },
  th: {
    spxPoBoxNotice: 'สำคัญ: บริการนี้ไม่สามารถจัดส่งไปยัง PO Box หรือที่อยู่ APO/FPO ได้ การจัดส่งช่วงสุดท้ายดำเนินการโดย DHL และสามารถติดตามช่วงสุดท้ายได้บนเว็บไซต์นี้',
    spxUsaDduNote: 'หมายเหตุสหรัฐฯ: การส่งไปสหรัฐอเมริกาเป็นแบบ DDU (Delivery Duty Unpaid) โดยค่าเริ่มต้น โดยผู้รับต้องชำระภาษีและอากรให้ศุลกากร',
    spxEtsyZone4Note: 'หมายเหตุ Etsy: ราคาบน Etsy ถูกกำหนดคงที่ที่โซน 4 กรุณาติดต่อเราผ่านข้อความ Etsy เพื่อขอใบเสนอราคา',
    spxNoSaturdayNote: 'บริการนี้ไม่ลงส่งในวันเสาร์เนื่องจากค่าจัดส่งสูงเกินไป'
  },
  ms: {
    spxPoBoxNotice: 'Penting: Perkhidmatan ini tidak boleh dihantar ke alamat PO Box atau APO/FPO. Penghantaran last-mile dikendalikan oleh DHL dan penjejakan last-mile tersedia di laman web ini.',
    spxUsaDduNote: 'Nota USA: Penghantaran ke Amerika Syarikat adalah DDU (Delivery Duty Unpaid) secara lalai; duti dan cukai dibayar oleh penerima kepada kastam.',
    spxEtsyZone4Note: 'Nota Etsy: Harga di Etsy ditetapkan pada Zon 4. Sila hubungi kami melalui mesej Etsy untuk sebut harga.',
    spxNoSaturdayNote: 'Perkhidmatan ini tidak dipos pada hari Sabtu kerana kos penghantaran terlalu tinggi.'
  },
  nl: {
    spxPoBoxNotice: 'Belangrijk: Deze service kan niet worden verzonden naar PO Box- of APO/FPO-adressen. De last-mile levering wordt uitgevoerd door DHL en last-mile tracking is beschikbaar op deze website.',
    spxUsaDduNote: 'VS-opmerking: Zendingen naar de Verenigde Staten zijn standaard DDU (Delivery Duty Unpaid); invoerrechten en belastingen worden door de ontvanger aan de douane betaald.',
    spxEtsyZone4Note: 'Etsy-opmerking: Prijzen op Etsy staan vast op Zone 4. Neem via Etsy-berichten contact met ons op voor een offerte.',
    spxNoSaturdayNote: 'Deze service wordt niet op zaterdag gepost omdat de verzendkosten te hoog zijn.'
  },
  id: {
    spxPoBoxNotice: 'Penting: Layanan ini tidak dapat dikirim ke alamat PO Box atau APO/FPO. Pengantaran last-mile ditangani oleh DHL, dan pelacakan last-mile tersedia di situs web ini.',
    spxUsaDduNote: 'Catatan USA: Pengiriman ke Amerika Serikat secara default adalah DDU (Delivery Duty Unpaid); bea dan pajak dibayar oleh penerima ke bea cukai.',
    spxEtsyZone4Note: 'Catatan Etsy: Harga di Etsy ditetapkan pada Zona 4. Silakan hubungi kami melalui pesan Etsy untuk penawaran harga.',
    spxNoSaturdayNote: 'Layanan ini tidak diposkan pada hari Sabtu karena biaya pengiriman terlalu tinggi.'
  },
  cs: {
    spxPoBoxNotice: 'Důležité: Tuto službu nelze odeslat na PO Box ani APO/FPO adresy. Doručení poslední míle zajišťuje DHL a sledování poslední míle je dostupné na tomto webu.',
    spxUsaDduNote: 'Poznámka USA: Zásilky do USA jsou ve výchozím stavu DDU (Delivery Duty Unpaid); cla a daně hradí příjemce celnímu úřadu.',
    spxEtsyZone4Note: 'Poznámka Etsy: Ceny na Etsy jsou pevně nastaveny na zónu 4. Pro cenovou nabídku nás kontaktujte přes zprávy na Etsy.',
    spxNoSaturdayNote: 'Tato služba se v sobotu nepodává, protože náklady na dopravu jsou příliš vysoké.'
  },
  it: {
    spxPoBoxNotice: 'Importante: Questo servizio non può essere spedito a indirizzi PO Box o APO/FPO. La consegna dell’ultimo miglio è gestita da DHL e il tracciamento dell’ultimo miglio è disponibile su questo sito.',
    spxUsaDduNote: 'Nota USA: Le spedizioni verso gli Stati Uniti sono DDU (Delivery Duty Unpaid) per impostazione predefinita; dazi e tasse sono pagati dal destinatario alla dogana.',
    spxEtsyZone4Note: 'Nota Etsy: I prezzi su Etsy sono fissi per la Zona 4. Contattaci tramite i messaggi Etsy per un preventivo.',
    spxNoSaturdayNote: 'Questo servizio non viene spedito il sabato perché i costi di spedizione sono troppo elevati.'
  },
  he: {
    spxPoBoxNotice: 'חשוב: שירות זה לא ניתן למשלוח לכתובות PO Box או APO/FPO. המסירה במייל האחרון מתבצעת על ידי DHL, ומעקב המייל האחרון זמין באתר זה.',
    spxUsaDduNote: 'הערת ארה״ב: משלוחים לארצות הברית הם DDU (Delivery Duty Unpaid) כברירת מחדל; מכסים ומסים משולמים על ידי הנמען לרשויות המכס.',
    spxEtsyZone4Note: 'הערת Etsy: המחירים ב-Etsy קבועים לאזור 4. אנא צרו איתנו קשר דרך הודעות Etsy לקבלת הצעת מחיר.',
    spxNoSaturdayNote: 'שירות זה אינו נשלח בשבת משום שעלויות המשלוח גבוהות מדי.'
  },
  ga: {
    spxPoBoxNotice: 'Tábhachtach: Ní féidir an tseirbhís seo a sheoladh chuig seoltaí PO Box ná APO/FPO. Is DHL a láimhseálann seachadadh an mhíle dheireanaigh, agus tá rianú an mhíle dheireanaigh ar fáil ar an suíomh seo.',
    spxUsaDduNote: 'Nóta SAM: Tá lastais chuig na Stáit Aontaithe mar DDU (Delivery Duty Unpaid) de réir réamhshocraithe; íocann an faighteoir dleachtanna agus cánacha leis an gcustam.',
    spxEtsyZone4Note: 'Nóta Etsy: Tá praghsanna Etsy socraithe do Chrios 4. Déan teagmháil linn trí theachtaireachtaí Etsy le haghaidh luachan.',
    spxNoSaturdayNote: 'Ní phostáiltear an tseirbhís seo ar an Satharn mar tá costas an loingseoireachta ró-ard.'
  },
  pl: {
    spxPoBoxNotice: 'Ważne: Ta usługa nie może być wysyłana na adresy PO Box ani APO/FPO. Dostawę ostatniej mili realizuje DHL, a śledzenie ostatniej mili jest dostępne na tej stronie.',
    spxUsaDduNote: 'Uwaga USA: Przesyłki do Stanów Zjednoczonych są domyślnie DDU (Delivery Duty Unpaid); cła i podatki opłaca odbiorca w urzędzie celnym.',
    spxEtsyZone4Note: 'Uwaga Etsy: Ceny na Etsy są stałe dla strefy 4. Skontaktuj się z nami przez wiadomości Etsy, aby otrzymać wycenę.',
    spxNoSaturdayNote: 'Ta usługa nie jest nadawana w soboty, ponieważ koszty wysyłki są zbyt wysokie.'
  },
  ko: {
    spxPoBoxNotice: '중요: 이 서비스는 PO Box 및 APO/FPO 주소로 발송할 수 없습니다. 라스트마일 배송은 DHL이 담당하며, 라스트마일 추적은 이 웹사이트에서 확인할 수 있습니다.',
    spxUsaDduNote: '미국 안내: 미국행 배송은 기본적으로 DDU(Delivery Duty Unpaid)이며, 관세 및 세금은 수취인이 세관에 납부합니다.',
    spxEtsyZone4Note: 'Etsy 안내: Etsy 가격은 Zone 4로 고정됩니다. 견적은 Etsy 메시지로 문의해 주세요.',
    spxNoSaturdayNote: '배송비가 너무 높아 이 서비스는 토요일에 접수되지 않습니다.'
  },
  no: {
    spxPoBoxNotice: 'Viktig: Denne tjenesten kan ikke sendes til PO Box- eller APO/FPO-adresser. Last-mile levering håndteres av DHL, og last-mile sporing er tilgjengelig på dette nettstedet.',
    spxUsaDduNote: 'USA-merknad: Forsendelser til USA er som standard DDU (Delivery Duty Unpaid); toll og avgifter betales av mottakeren til tollmyndighetene.',
    spxEtsyZone4Note: 'Etsy-merknad: Prisene på Etsy er fastsatt til sone 4. Kontakt oss via Etsy-meldinger for pristilbud.',
    spxNoSaturdayNote: 'Denne tjenesten postes ikke på lørdager fordi fraktkostnaden er for høy.'
  },
  ru: {
    spxPoBoxNotice: 'Важно: Эта услуга не отправляется на адреса PO Box и APO/FPO. Доставку последней мили выполняет DHL, а отслеживание последней мили доступно на этом сайте.',
    spxUsaDduNote: 'Примечание для США: Отправления в США по умолчанию идут как DDU (Delivery Duty Unpaid); пошлины и налоги оплачивает получатель таможне.',
    spxEtsyZone4Note: 'Примечание Etsy: Цены на Etsy фиксированы для зоны 4. Свяжитесь с нами через сообщения Etsy для расчёта.',
    spxNoSaturdayNote: 'Эта услуга не отправляется по субботам, так как стоимость доставки слишком высокая.'
  },
  sv: {
    spxPoBoxNotice: 'Viktigt: Den här tjänsten kan inte skickas till PO Box- eller APO/FPO-adresser. Last-mile leverans hanteras av DHL, och last-mile spårning finns på denna webbplats.',
    spxUsaDduNote: 'USA-notis: Försändelser till USA är som standard DDU (Delivery Duty Unpaid); tull och skatter betalas av mottagaren till tullen.',
    spxEtsyZone4Note: 'Etsy-notis: Priser på Etsy är fasta för zon 4. Kontakta oss via Etsy-meddelanden för offert.',
    spxNoSaturdayNote: 'Den här tjänsten postas inte på lördagar eftersom fraktkostnaden är för hög.'
  },
  fi: {
    spxPoBoxNotice: 'Tärkeää: Tätä palvelua ei voi lähettää PO Box- tai APO/FPO-osoitteisiin. Viimeisen mailin toimituksen hoitaa DHL, ja viimeisen mailin seuranta on saatavilla tällä sivustolla.',
    spxUsaDduNote: 'USA-huomio: Lähetykset Yhdysvaltoihin ovat oletuksena DDU (Delivery Duty Unpaid); tullit ja verot maksaa vastaanottaja tullille.',
    spxEtsyZone4Note: 'Etsy-huomio: Etsy-hinnat on kiinnitetty vyöhykkeeseen 4. Ota yhteyttä Etsy-viesteillä saadaksesi tarjouksen.',
    spxNoSaturdayNote: 'Tätä palvelua ei postiteta lauantaisin, koska toimituskustannukset ovat liian korkeat.'
  },
  tl: {
    spxPoBoxNotice: 'Mahalaga: Ang serbisyong ito ay hindi maaaring ipadala sa PO Box o APO/FPO na address. Ang last-mile delivery ay pinamamahalaan ng DHL at ang last-mile tracking ay available sa website na ito.',
    spxUsaDduNote: 'Paalala sa USA: Ang mga shipment papuntang United States ay DDU (Delivery Duty Unpaid) bilang default; ang duties at taxes ay binabayaran ng recipient sa customs.',
    spxEtsyZone4Note: 'Paalala sa Etsy: Ang presyo sa Etsy ay naka-fix sa Zone 4. Makipag-ugnayan sa amin sa Etsy messages para sa quote.',
    spxNoSaturdayNote: 'Hindi ito ipinopost tuwing Sabado dahil masyadong mataas ang shipping cost.'
  },
  vi: {
    spxPoBoxNotice: 'Quan trọng: Dịch vụ này không thể gửi đến địa chỉ PO Box hoặc APO/FPO. Giao hàng chặng cuối do DHL thực hiện và theo dõi chặng cuối có sẵn trên website này.',
    spxUsaDduNote: 'Lưu ý Mỹ: Lô hàng đến Hoa Kỳ mặc định là DDU (Delivery Duty Unpaid); thuế và phí do người nhận thanh toán cho hải quan.',
    spxEtsyZone4Note: 'Lưu ý Etsy: Giá trên Etsy được cố định ở Zone 4. Vui lòng liên hệ chúng tôi qua tin nhắn Etsy để nhận báo giá.',
    spxNoSaturdayNote: 'Dịch vụ này không gửi vào thứ Bảy vì chi phí vận chuyển quá cao.'
  },
  cy: {
    spxPoBoxNotice: 'Pwysig: Ni ellir anfon y gwasanaeth hwn i gyfeiriadau PO Box nac APO/FPO. Mae danfon y filltir olaf yn cael ei drin gan DHL, ac mae olrhain y filltir olaf ar gael ar y wefan hon.',
    spxUsaDduNote: 'Nodyn UDA: Mae cludo i’r Unol Daleithiau yn DDU (Delivery Duty Unpaid) yn ddiofyn; telir tollau a threthi gan y derbynnydd i’r tollau.',
    spxEtsyZone4Note: 'Nodyn Etsy: Mae prisiau ar Etsy yn sefydlog i Barth 4. Cysylltwch â ni drwy negeseuon Etsy am ddyfynbris.',
    spxNoSaturdayNote: 'Nid yw’r gwasanaeth hwn yn cael ei bostio ar ddydd Sadwrn gan fod cost cludo yn rhy uchel.'
  },
  ta: {
    spxPoBoxNotice: 'முக்கியம்: இந்த சேவையை PO Box அல்லது APO/FPO முகவரிகளுக்கு அனுப்ப முடியாது. இறுதி-மைல் விநியோகம் DHL மூலம் நடைபெறும்; இறுதி-மைல் கண்காணிப்பு இந்த இணையதளத்தில் கிடைக்கும்.',
    spxUsaDduNote: 'அமெரிக்க குறிப்பு: அமெரிக்காவுக்கான அனுப்புதல்கள் இயல்பாக DDU (Delivery Duty Unpaid) ஆகும்; சுங்கவரி மற்றும் வரிகளை பெறுநர் சுங்கத்துறைக்கு செலுத்த வேண்டும்.',
    spxEtsyZone4Note: 'Etsy குறிப்பு: Etsy விலைகள் Zone 4-க்கு நிலைநிறுத்தப்பட்டுள்ளன. விலை மேற்கோள் பெற Etsy செய்திகளின் மூலம் எங்களை தொடர்புகொள்ளவும்.',
    spxNoSaturdayNote: 'அனுப்பும் செலவு அதிகமாக இருப்பதால் இந்த சேவை சனிக்கிழமைகளில் அனுப்பப்படாது.'
  },
  mi: {
    spxPoBoxNotice: 'He mea nui: Kāore tēnei ratonga e taea te tuku ki ngā wāhitau PO Box, APO/FPO rānei. Ko DHL te kaiwhakahaere o te tuku mile whakamutunga, ā, kei tēnei paetukutuku te aroturuki mile whakamutunga.',
    spxUsaDduNote: 'Tuhipoka USA: Ko ngā tukunga ki te United States he DDU (Delivery Duty Unpaid) mā te taunoa; mā te kaiwhiwhi ngā taake me ngā utu ka utu ki ngā tikanga.',
    spxEtsyZone4Note: 'Tuhipoka Etsy: Ka pūmau ngā utu Etsy ki te Rohe 4. Tēnā whakapā mai mā ngā karere Etsy mō tētahi kōrero utu.',
    spxNoSaturdayNote: 'Kāore tēnei ratonga e whakairia i ngā Rāhoroi nā te nui rawa o te utu tuku.'
  }
};

const normalizeLanguage = (language) => {
  const code = (language || 'en').toLowerCase();
  if (code === 'iw') return 'he';
  if (code === 'fil') return 'tl';
  if (code === 'zh-cn' || code === 'zh-hans') return 'zh';
  if (code === 'zh-tw' || code === 'zh-hant') return 'zh-hant';
  if (code === 'zh-hk' || code === 'yue') return 'zh-hant';
  if (code.startsWith('nb') || code.startsWith('nn')) return 'no';
  return code;
};

export const rt = (language, key) => {
  const lang = normalizeLanguage(language);
  return SPEEDPOST_NOTES[lang]?.[key]
    || EXTRA_TERMS[lang]?.[key]
    || TERMS[lang]?.[key]
    || SPEEDPOST_NOTES.en[key]
    || EXTRA_TERMS.en[key]
    || TERMS.en[key]
    || key;
};

export const countryName = (language, countryCode, fallbackName) => {
  const lang = normalizeLanguage(language);
  const locale = lang === 'zh-hant' ? 'zh-Hant' : lang;
  try {
    const displayNames = new Intl.DisplayNames([locale], { type: 'region' });
    return displayNames.of(countryCode) || fallbackName || countryCode;
  } catch (_) {
    return fallbackName || countryCode;
  }
};

export const makeEmsZoneRegionText = (language, kind, names) => {
  const term = (key) => rt(language, key);
  if (kind === 'southeastAsia') return `${term('southeastAsia')} 🌏`;
  if (kind === 'hkMoTw') return `${names.hk}, ${names.mo} & ${names.tw} 🇭🇰🇲🇴🇹🇼`;
  if (kind === 'jpKr') return `${names.jp} & ${names.kr} 🇯🇵🇰🇷`;
  if (kind === 'auNz') return `${names.au} & ${names.nz} 🇦🇺🇳🇿`;
  if (kind === 'euExceptCz') return `${term('europe')} (${term('except')} ${names.cz}) 🇪🇺`;
  if (kind === 'caUs') return `${names.ca} & ${names.us} 🇨🇦🇺🇸`;
  return '';
};

export const makeSurchargeRegionText = (language, kind, names) => {
  const term = (key) => rt(language, key);
  if (kind === 'europeInclUk') return `${term('europe')} (${term('includes')} ${names.gb})`;
  if (kind === 'asiaPacificIsrael') return `${term('asiaPacific')} & ${names.il}`;
  return '';
};

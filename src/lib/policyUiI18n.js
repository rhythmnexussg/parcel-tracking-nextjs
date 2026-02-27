const normalizeLang = (language) => {
  const code = (language || 'en').toLowerCase();
  if (code === 'iw') return 'he';
  if (code === 'fil') return 'tl';
  if (code === 'zh-cn' || code === 'zh-hans') return 'zh';
  if (code === 'zh-tw' || code === 'zh-hant') return 'zh-hant';
  if (code === 'zh-hk' || code === 'yue') return 'zh-hant'; // Cantonese falls back to zh-hant for policy
  if (code.startsWith('nb') || code.startsWith('nn')) return 'no';
  return code;
};

const TERMS_TITLES = {
  "en": [
    "Eligibility",
    "Account Creation",
    "Products, Pricing & Orders",
    "Payment Terms",
    "Shipping, Delivery & Risk of Loss",
    "Returns, Refunds & Exchanges",
    "Digital Products",
    "Intellectual Property",
    "Limitation of Liability",
    "Governing Law & Jurisdiction",
    "Dispute Resolution",
    "Changes to Terms"
  ],
  "de": [
    "Teilnahmeberechtigung",
    "Kontoerstellung",
    "Produkte, Preise und Bestellungen",
    "Zahlungsbedingungen",
    "Versand, Lieferung und Verlustrisiko",
    "Rückgaben, Rückerstattungen und Umtausch",
    "Digitale Produkte",
    "Geistiges Eigentum",
    "Haftungsbeschränkung",
    "Anwendbares Recht und Gerichtsstand",
    "Streitbeilegung",
    "Änderungen der Bedingungen"
  ],
  "fr": [
    "Admissibilité",
    "Création de compte",
    "Produits, prix et commandes",
    "Conditions de paiement",
    "Expédition, livraison et risque de perte",
    "Retours, remboursements et échanges",
    "Produits numériques",
    "Propriété intellectuelle",
    "Limitation de responsabilité",
    "Loi applicable et juridiction",
    "Résolution des litiges",
    "Modifications des conditions"
  ],
  "es": [
    "Elegibilidad",
    "Creación de cuenta",
    "Productos, precios y pedidos",
    "Condiciones de pago",
    "Envío, entrega y riesgo de pérdida",
    "Devoluciones, reembolsos y cambios",
    "Productos digitales",
    "Propiedad Intelectual",
    "Limitación de responsabilidad",
    "Ley aplicable y jurisdicción",
    "Resolución de disputas",
    "Cambios a los términos"
  ],
  "ja": [
    "資格",
    "アカウントの作成",
    "製品、価格、注文",
    "支払い条件",
    "発送、配達、紛失のリスク",
    "返品、返金、交換",
    "デジタル製品",
    "知的財産",
    "責任の制限",
    "準拠法と裁判管轄",
    "紛争解決",
    "規約の変更"
  ],
  "zh": [
    "合格",
    "创建账户",
    "产品、定价和订单",
    "付款条件",
    "运输、交付和损失风险",
    "退货、退款和换货",
    "数码产品",
    "知识产权",
    "责任限制",
    "适用法律和管辖权",
    "争议解决",
    "条款变更"
  ],
  "zh-hant": [
    "合格",
    "建立帳戶",
    "產品、定價和訂單",
    "付款條件",
    "運輸、交付和損失風險",
    "退貨、退款和換貨",
    "數位產品",
    "智慧財產",
    "責任限制",
    "適用法律和管轄權",
    "爭議解決",
    "條款變更"
  ],
  "pt": [
    "Elegibilidade",
    "Criação de conta",
    "Produtos, preços e pedidos",
    "Condições de pagamento",
    "Envio, Entrega e Risco de Perda",
    "Devoluções, reembolsos e trocas",
    "Produtos Digitais",
    "Propriedade intelectual",
    "Limitação de responsabilidade",
    "Lei Aplicável e Jurisdição",
    "Resolução de disputas",
    "Mudanças nos Termos"
  ],
  "hi": [
    "पात्रता",
    "खाता निर्माण",
    "उत्पाद, मूल्य निर्धारण और ऑर्डर",
    "भुगतान की शर्तें",
    "शिपिंग, डिलिवरी और हानि का जोखिम",
    "रिटर्न, रिफंड और एक्सचेंज",
    "डिजिटल उत्पाद",
    "बौद्धिक संपदा",
    "दायित्व की सीमा",
    "शासी कानून एवं क्षेत्राधिकार",
    "विवाद समाधान",
    "शर्तों में परिवर्तन"
  ],
  "th": [
    "คุณสมบัติ",
    "การสร้างบัญชี",
    "สินค้า ราคา และการสั่งซื้อ",
    "เงื่อนไขการชำระเงิน",
    "การจัดส่ง การส่งมอบ และความเสี่ยงของการสูญหาย",
    "การคืนสินค้า การคืนเงิน และการแลกเปลี่ยน",
    "ผลิตภัณฑ์ดิจิทัล",
    "ทรัพย์สินทางปัญญา",
    "ข้อจำกัดความรับผิด",
    "กฎหมายที่ใช้บังคับและเขตอำนาจศาล",
    "การระงับข้อพิพาท",
    "การเปลี่ยนแปลงข้อกำหนด"
  ],
  "ms": [
    "Kelayakan",
    "Penciptaan Akaun",
    "Produk, Harga & Pesanan",
    "Syarat Pembayaran",
    "Penghantaran, Penghantaran & Risiko Kehilangan",
    "Pemulangan, Bayaran Balik & Pertukaran",
    "Produk Digital",
    "Harta Intelek",
    "Had Liabiliti",
    "Undang-undang & Bidang Kuasa yang Mentadbir",
    "Penyelesaian Pertikaian",
    "Perubahan kepada Syarat"
  ],
  "nl": [
    "Geschiktheid",
    "Account aanmaken",
    "Producten, prijzen en bestellingen",
    "Betalingsvoorwaarden",
    "Verzending, levering en risico op verlies",
    "Retouren, terugbetalingen en uitwisselingen",
    "Digitale producten",
    "Intellectueel eigendom",
    "Beperking van aansprakelijkheid",
    "Toepasselijk recht en jurisdictie",
    "Geschillenbeslechting",
    "Wijzigingen in de voorwaarden"
  ],
  "id": [
    "Kelayakan",
    "Pembuatan Akun",
    "Produk, Harga & Pesanan",
    "Ketentuan Pembayaran",
    "Pengiriman, Pengiriman & Resiko Kehilangan",
    "Pengembalian, Pengembalian Dana & Penukaran",
    "Produk Digital",
    "Kekayaan Intelektual",
    "Batasan Tanggung Jawab",
    "Hukum & Yurisdiksi yang Mengatur",
    "Penyelesaian Sengketa",
    "Perubahan Ketentuan"
  ],
  "cs": [
    "Způsobilost",
    "Vytvoření účtu",
    "Produkty, ceny a objednávky",
    "Platební podmínky",
    "Doprava, doručení a riziko ztráty",
    "Vrácení, refundace a výměny",
    "Digitální produkty",
    "Duševní vlastnictví",
    "Omezení odpovědnosti",
    "Rozhodné právo a jurisdikce",
    "Řešení sporů",
    "Změny podmínek"
  ],
  "it": [
    "Idoneità",
    "Creazione dell'account",
    "Prodotti, prezzi e ordini",
    "Termini di pagamento",
    "Spedizione, consegna e rischio di perdita",
    "Resi, rimborsi e cambi",
    "Prodotti digitali",
    "Proprietà intellettuale",
    "Limitazione di responsabilità",
    "Legge applicabile e giurisdizione",
    "Risoluzione delle controversie",
    "Modifiche ai Termini"
  ],
  "he": [
    "זכאות",
    "יצירת חשבון",
    "מוצרים, תמחור והזמנות",
    "תנאי תשלום",
    "משלוח, משלוח וסיכון לאובדן",
    "החזרות, החזרים והחלפות",
    "מוצרים דיגיטליים",
    "קניין רוחני",
    "הגבלת אחריות",
    "חוק וסמכות שיפוט",
    "יישוב מחלוקות",
    "שינויים בתנאים"
  ],
  "ga": [
    "Incháilitheacht",
    "Cruthú Cuntas",
    "Táirgí, Praghsáil & Orduithe",
    "Téarmaí Íocaíochta",
    "Loingseoireacht, Seachadadh & Riosca Caillteanais",
    "Tuairisceáin, Aisíocaíochtaí & Malartuithe",
    "Táirgí Digiteacha",
    "Maoin Intleachtúil",
    "Teorainn le Dliteanas",
    "Dlí agus Dlínse Rialaithe",
    "Réiteach Díospóide",
    "Athruithe ar Théarmaí"
  ],
  "pl": [
    "Uprawnienia",
    "Tworzenie konta",
    "Produkty, ceny i zamówienia",
    "Warunki płatności",
    "Wysyłka, dostawa i ryzyko utraty",
    "Zwroty, zwroty pieniędzy i wymiany",
    "Produkty cyfrowe",
    "Własność intelektualna",
    "Ograniczenie odpowiedzialności",
    "Obowiązujące prawo i jurysdykcja",
    "Rozstrzyganie sporów",
    "Zmiany Warunków"
  ],
  "ko": [
    "적임",
    "계정 생성",
    "제품, 가격 및 주문",
    "지불 조건",
    "배송, 배송 및 분실 위험",
    "반품, 환불 및 교환",
    "디지털 제품",
    "지적재산권",
    "책임의 제한",
    "준거법 및 관할권",
    "분쟁 해결",
    "약관 변경"
  ],
  "no": [
    "Kvalifisering",
    "Kontoopprettelse",
    "Produkter, priser og bestillinger",
    "Betalingsbetingelser",
    "Frakt, levering og risiko for tap",
    "Returer, refusjoner og bytte",
    "Digitale produkter",
    "Immaterielle rettigheter",
    "Ansvarsbegrensning",
    "Gjeldende lov og jurisdiksjon",
    "Tvisteløsning",
    "Endringer i vilkårene"
  ],
  "ru": [
    "Право на участие",
    "Создание учетной записи",
    "Продукты, цены и заказы",
    "Условия оплаты",
    "Доставка, доставка и риск потери",
    "Возврат, возврат и обмен",
    "Цифровые продукты",
    "Интеллектуальная собственность",
    "Ограничение ответственности",
    "Применимое право и юрисдикция",
    "Разрешение споров",
    "Изменения в Условиях"
  ],
  "sv": [
    "Behörighet",
    "Skapa konto",
    "Produkter, priser och beställningar",
    "Betalningsvillkor",
    "Frakt, leverans & risk för förlust",
    "Returer, Återbetalningar & Byten",
    "Digitala produkter",
    "Immateriella rättigheter",
    "Ansvarsbegränsning",
    "Gällande lag och jurisdiktion",
    "Tvistlösning",
    "Ändringar av villkor"
  ],
  "fi": [
    "Kelpoisuus",
    "Tilin luominen",
    "Tuotteet, hinnoittelu ja tilaukset",
    "Maksuehdot",
    "Toimitus, toimitus ja menetysriski",
    "Palautukset, palautukset ja vaihdot",
    "Digitaaliset tuotteet",
    "Immateriaaliomaisuus",
    "Vastuun rajoitus",
    "Sovellettava laki ja toimivalta",
    "Riitojen ratkaisu",
    "Muutokset ehtoihin"
  ],
  "tl": [
    "Pagiging karapat-dapat",
    "Paggawa ng Account",
    "Mga Produkto, Pagpepresyo at Mga Order",
    "Mga Tuntunin sa Pagbabayad",
    "Pagpapadala, Paghahatid at Panganib ng Pagkawala",
    "Mga Pagbabalik, Pagbabalik at Pagpapalitan",
    "Mga Produktong Digital",
    "Intelektwal na Ari-arian",
    "Limitasyon ng Pananagutan",
    "Namamahala sa Batas at Jurisdiction",
    "Resolusyon sa Di-pagkakasundo",
    "Mga Pagbabago sa Mga Tuntunin"
  ],
  "vi": [
    "Đủ điều kiện",
    "Tạo tài khoản",
    "Sản phẩm, giá cả và đơn đặt hàng",
    "Điều khoản thanh toán",
    "Vận chuyển, giao hàng và rủi ro mất mát",
    "Trả lại, Hoàn tiền & Trao đổi",
    "Sản phẩm kỹ thuật số",
    "Sở hữu trí tuệ",
    "Giới hạn trách nhiệm pháp lý",
    "Luật điều chỉnh và thẩm quyền",
    "Giải quyết tranh chấp",
    "Thay đổi điều khoản"
  ],
  "cy": [
    "Cymhwysedd",
    "Creu Cyfrif",
    "Cynhyrchion, Prisiau ac Archebion",
    "Telerau Talu",
    "Cludo, Cyflenwi a Risg o Golled",
    "Dychwelyd, Ad-daliadau a Chyfnewid",
    "Cynhyrchion Digidol",
    "Eiddo Deallusol",
    "Cyfyngiad Atebolrwydd",
    "Llywodraethol Cyfraith ac Awdurdodaeth",
    "Datrys Anghydfod",
    "Newidiadau i Dermau"
  ],
  "ta": [
    "தகுதி",
    "கணக்கு உருவாக்கம்",
    "தயாரிப்புகள், விலை மற்றும் ஆர்டர்கள்",
    "கட்டண விதிமுறைகள்",
    "ஷிப்பிங், டெலிவரி & இழப்பு ஆபத்து",
    "திரும்பப் பெறுதல், திரும்பப் பெறுதல் & பரிமாற்றங்கள்",
    "டிஜிட்டல் தயாரிப்புகள்",
    "அறிவுசார் சொத்து",
    "பொறுப்பு வரம்பு",
    "ஆளும் சட்டம் & அதிகார வரம்பு",
    "தகராறு தீர்வு",
    "விதிமுறைகளில் மாற்றங்கள்"
  ],
  "mi": [
    "Tikanga",
    "Waihanga Kaute",
    "Hua, Utu me nga Ota",
    "Nga tikanga utu",
    "Te Tukunga, Te Tukunga me te Morearea o te Ngaronga",
    "Whakahoki, Whakahoki me nga Whakawhiti",
    "Hua Mamati",
    "Taonga Hinengaro",
    "Te herenga o te taunahatanga",
    "Ture Whakahaere me te Mana Whakahaere",
    "Whakatau Tautohetohe",
    "Nga Huringa ki nga Ture"
  ]
};

const PRIVACY_TITLES = {
  "en": [
    "Data We Collect",
    "Legal Bases for Processing (GDPR)",
    "How We Use Your Personal Data",
    "Cookies & Tracking",
    "Data Sharing",
    "Your Rights",
    "Data Retention",
    "International Data Transfers",
    "Security",
    "Children's Privacy",
    "Third-Party Websites",
    "Changes to This Policy",
    "Contact Information"
  ],
  "de": [
    "Von uns erfasste Daten",
    "Rechtliche Grundlagen der Verarbeitung (DSGVO)",
    "Wie wir Ihre personenbezogenen Daten verwenden",
    "Cookies und Tracking",
    "Datenaustausch",
    "Ihre Rechte",
    "Datenaufbewahrung",
    "Internationale Datenübertragungen",
    "Sicherheit",
    "Privatsphäre von Kindern",
    "Websites Dritter",
    "Änderungen an dieser Richtlinie",
    "Kontaktinformationen"
  ],
  "fr": [
    "Données que nous collectons",
    "Bases juridiques du traitement (RGPD)",
    "Comment nous utilisons vos données personnelles",
    "Cookies et suivi",
    "Partage de données",
    "Vos droits",
    "Conservation des données",
    "Transferts de données internationaux",
    "Sécurité",
    "Confidentialité des enfants",
    "Sites Web tiers",
    "Modifications de cette politique",
    "Coordonnées"
  ],
  "es": [
    "Datos que recopilamos",
    "Bases Legales para el Tratamiento (GDPR)",
    "Cómo utilizamos sus datos personales",
    "Cookies y seguimiento",
    "Compartir datos",
    "Tus derechos",
    "Retención de datos",
    "Transferencias Internacionales de Datos",
    "Seguridad",
    "Privacidad de los niños",
    "Sitios web de terceros",
    "Cambios a esta política",
    "Información del contacto"
  ],
  "ja": [
    "当社が収集するデータ",
    "処理の法的根拠 (GDPR)",
    "お客様の個人データの使用方法",
    "クッキーと追跡",
    "データ共有",
    "あなたの権利",
    "データの保持",
    "国際的なデータ転送",
    "安全",
    "子供のプライバシー",
    "サードパーティの Web サイト",
    "このポリシーの変更",
    "連絡先"
  ],
  "zh": [
    "我们收集的数据",
    "处理的法律依据 (GDPR)",
    "我们如何使用您的个人数据",
    "Cookie 和跟踪",
    "数据共享",
    "您的权利",
    "数据保留",
    "国际数据传输",
    "安全",
    "儿童隐私",
    "第三方网站",
    "本政策的变更",
    "联系信息"
  ],
  "zh-hant": [
    "我們收集的數據",
    "處理的法律依據 (GDPR)",
    "我們如何使用您的個人數據",
    "Cookie 和追蹤",
    "數據共享",
    "您的權利",
    "資料保留",
    "國際資料傳輸",
    "安全",
    "兒童隱私",
    "第三方網站",
    "本政策的變更",
    "聯絡資訊"
  ],
  "pt": [
    "Dados que coletamos",
    "Bases Legais para Processamento (GDPR)",
    "Como usamos seus dados pessoais",
    "Cookies e rastreamento",
    "Compartilhamento de dados",
    "Seus direitos",
    "Retenção de dados",
    "Transferências Internacionais de Dados",
    "Segurança",
    "Privacidade infantil",
    "Sites de terceiros",
    "Mudanças nesta política",
    "Informações de contato"
  ],
  "hi": [
    "डेटा हम एकत्र करते हैं",
    "प्रसंस्करण के लिए कानूनी आधार (जीडीपीआर)",
    "हम आपके व्यक्तिगत डेटा का उपयोग कैसे करते हैं",
    "कुकीज़ और ट्रैकिंग",
    "डेटा शेयरिंग",
    "आपके हक",
    "डेटा प्रतिधारण",
    "अंतर्राष्ट्रीय डेटा स्थानांतरण",
    "सुरक्षा",
    "बच्चों की गोपनीयता",
    "तृतीय-पक्ष वेबसाइटें",
    "इस नीति में परिवर्तन",
    "संपर्क जानकारी"
  ],
  "th": [
    "ข้อมูลที่เรารวบรวม",
    "ฐานกฎหมายสำหรับการประมวลผล (GDPR)",
    "วิธีที่เราใช้ข้อมูลส่วนบุคคลของคุณ",
    "คุกกี้และการติดตาม",
    "การแบ่งปันข้อมูล",
    "สิทธิของคุณ",
    "การเก็บรักษาข้อมูล",
    "การถ่ายโอนข้อมูลระหว่างประเทศ",
    "ความปลอดภัย",
    "ความเป็นส่วนตัวของเด็ก",
    "เว็บไซต์บุคคลที่สาม",
    "การเปลี่ยนแปลงนโยบายนี้",
    "ข้อมูลการติดต่อ"
  ],
  "ms": [
    "Data yang Kami Kumpul",
    "Asas Undang-undang untuk Pemprosesan (GDPR)",
    "Cara Kami Menggunakan Data Peribadi Anda",
    "Kuki & Penjejakan",
    "Perkongsian Data",
    "Hak Anda",
    "Pengekalan Data",
    "Pemindahan Data Antarabangsa",
    "Keselamatan",
    "Privasi Kanak-kanak",
    "Laman Web Pihak Ketiga",
    "Perubahan kepada Dasar Ini",
    "Maklumat Hubungan"
  ],
  "nl": [
    "Gegevens die we verzamelen",
    "Rechtsgrondslagen voor verwerking (AVG)",
    "Hoe wij uw persoonlijke gegevens gebruiken",
    "Cookies en tracking",
    "Gegevens delen",
    "Uw rechten",
    "Gegevensretentie",
    "Internationale gegevensoverdrachten",
    "Beveiliging",
    "Privacy van kinderen",
    "Websites van derden",
    "Wijzigingen in dit beleid",
    "Contactgegevens"
  ],
  "id": [
    "Data yang Kami Kumpulkan",
    "Dasar Hukum untuk Pemrosesan (GDPR)",
    "Bagaimana Kami Menggunakan Data Pribadi Anda",
    "Cookie & Pelacakan",
    "Berbagi Data",
    "Hak Anda",
    "Retensi Data",
    "Transfer Data Internasional",
    "Keamanan",
    "Privasi Anak",
    "Situs Web Pihak Ketiga",
    "Perubahan pada Kebijakan Ini",
    "Informasi Kontak"
  ],
  "cs": [
    "Údaje, které shromažďujeme",
    "Právní základy pro zpracování (GDPR)",
    "Jak používáme vaše osobní údaje",
    "Soubory cookie a sledování",
    "Sdílení dat",
    "Vaše práva",
    "Uchovávání dat",
    "Mezinárodní přenosy dat",
    "Zabezpečení",
    "Soukromí dětí",
    "Webové stránky třetích stran",
    "Změny těchto zásad",
    "Kontaktní informace"
  ],
  "it": [
    "Dati che raccogliamo",
    "Basi giuridiche del trattamento (GDPR)",
    "Come utilizziamo i tuoi dati personali",
    "Cookie e tracciamento",
    "Condivisione dei dati",
    "I tuoi diritti",
    "Conservazione dei dati",
    "Trasferimenti internazionali di dati",
    "Sicurezza",
    "Privacy dei bambini",
    "Siti Web di terze parti",
    "Modifiche a questa politica",
    "Informazioni sui contatti"
  ],
  "he": [
    "נתונים שאנו אוספים",
    "בסיסים משפטיים לעיבוד (GDPR)",
    "כיצד אנו משתמשים בנתונים האישיים שלך",
    "עוגיות ומעקב",
    "שיתוף נתונים",
    "הזכויות שלך",
    "שמירת נתונים",
    "העברות נתונים בינלאומיות",
    "בִּטָחוֹן",
    "פרטיות ילדים",
    "אתרי צד שלישי",
    "שינויים במדיניות זו",
    "מידע ליצירת קשר"
  ],
  "ga": [
    "Sonraí a Bhailimid",
    "Bunús Dlí le Próiseáil (GDPR)",
    "Conas a Úsáidimid Do Shonraí Pearsanta",
    "Fianáin & Rianú",
    "Comhroinnt Sonraí",
    "Do Chearta",
    "Coinneáil Sonraí",
    "Aistrithe Idirnáisiúnta Sonraí",
    "Slándáil",
    "Príobháideacht Leanaí",
    "Láithreáin Ghréasáin Tríú Páirtí",
    "Athruithe ar an mBeartas seo",
    "Eolas Teagmhála"
  ],
  "pl": [
    "Dane, które zbieramy",
    "Podstawy prawne przetwarzania (RODO)",
    "Jak wykorzystujemy Twoje dane osobowe",
    "Pliki cookie i śledzenie",
    "Udostępnianie danych",
    "Twoje prawa",
    "Przechowywanie danych",
    "Międzynarodowe przesyłanie danych",
    "Bezpieczeństwo",
    "Prywatność dzieci",
    "Witryny stron trzecich",
    "Zmiany w niniejszej Polityce",
    "Informacje kontaktowe"
  ],
  "ko": [
    "우리가 수집하는 데이터",
    "처리에 대한 법적 근거(GDPR)",
    "당사가 귀하의 개인 데이터를 사용하는 방법",
    "쿠키 및 추적",
    "데이터 공유",
    "귀하의 권리",
    "데이터 보존",
    "국제 데이터 전송",
    "보안",
    "아동의 개인정보 보호",
    "제3자 웹사이트",
    "본 정책의 변경 사항",
    "연락처 정보"
  ],
  "no": [
    "Data vi samler inn",
    "Juridisk grunnlag for behandling (GDPR)",
    "Hvordan vi bruker dine personopplysninger",
    "Informasjonskapsler og sporing",
    "Datadeling",
    "Dine rettigheter",
    "Oppbevaring av data",
    "Internasjonale dataoverføringer",
    "Sikkerhet",
    "Barns personvern",
    "Tredjeparts nettsteder",
    "Endringer i denne policyen",
    "Kontaktinformasjon"
  ],
  "ru": [
    "Данные, которые мы собираем",
    "Правовые основы обработки данных (GDPR)",
    "Как мы используем ваши персональные данные",
    "Файлы cookie и отслеживание",
    "Обмен данными",
    "Ваши права",
    "Хранение данных",
    "Международная передача данных",
    "Безопасность",
    "Конфиденциальность детей",
    "Сторонние веб-сайты",
    "Изменения в этой политике",
    "Контактная информация"
  ],
  "sv": [
    "Data vi samlar in",
    "Rättslig grund för behandling (GDPR)",
    "Hur vi använder dina personuppgifter",
    "Cookies och spårning",
    "Datadelning",
    "Dina rättigheter",
    "Datalagring",
    "Internationella dataöverföringar",
    "Säkerhet",
    "Barns integritet",
    "Tredje parts webbplatser",
    "Ändringar av denna policy",
    "Kontaktinformation"
  ],
  "fi": [
    "Keräämämme tiedot",
    "Käsittelyn oikeusperusta (GDPR)",
    "Kuinka käytämme henkilötietojasi",
    "Evästeet ja seuranta",
    "Tietojen jakaminen",
    "Sinun oikeutesi",
    "Tietojen säilyttäminen",
    "Kansainväliset tiedonsiirrot",
    "Turvallisuus",
    "Lasten yksityisyys",
    "Kolmannen osapuolen verkkosivustot",
    "Muutokset tähän käytäntöön",
    "Yhteystiedot"
  ],
  "tl": [
    "Data na Kinokolekta Namin",
    "Mga Legal na Base para sa Pagproseso (GDPR)",
    "Paano Namin Ginagamit ang Iyong Personal na Data",
    "Cookies at Pagsubaybay",
    "Pagbabahagi ng Data",
    "Ang iyong mga Karapatan",
    "Pagpapanatili ng Data",
    "International Data Transfers",
    "Seguridad",
    "Privacy ng mga Bata",
    "Mga Website ng Third-Party",
    "Mga Pagbabago sa Patakarang Ito",
    "Impormasyon sa Pakikipag-ugnayan"
  ],
  "vi": [
    "Dữ liệu chúng tôi thu thập",
    "Cơ sở pháp lý để xử lý (GDPR)",
    "Cách chúng tôi sử dụng dữ liệu cá nhân của bạn",
    "Cookie & Theo dõi",
    "Chia sẻ dữ liệu",
    "Quyền của bạn",
    "Lưu giữ dữ liệu",
    "Chuyển dữ liệu quốc tế",
    "Bảo vệ",
    "Quyền riêng tư của trẻ em",
    "Trang web của bên thứ ba",
    "Những thay đổi đối với Chính sách này",
    "Thông tin liên hệ"
  ],
  "cy": [
    "Data a Gasglwn",
    "Seiliau Cyfreithiol ar gyfer Prosesu (GDPR)",
    "Sut Rydym yn Defnyddio Eich Data Personol",
    "Cwcis ac Olrhain",
    "Rhannu Data",
    "Eich Hawliau",
    "Cadw Data",
    "Trosglwyddiadau Data Rhyngwladol",
    "Diogelwch",
    "Preifatrwydd Plant",
    "Gwefannau Trydydd Parti",
    "Newidiadau i'r Polisi Hwn",
    "Gwybodaeth Gyswllt"
  ],
  "ta": [
    "நாங்கள் சேகரிக்கும் தரவு",
    "செயலாக்கத்திற்கான சட்ட அடிப்படைகள் (GDPR)",
    "உங்கள் தனிப்பட்ட தரவை நாங்கள் எவ்வாறு பயன்படுத்துகிறோம்",
    "குக்கீகள் & கண்காணிப்பு",
    "தரவு பகிர்வு",
    "உங்கள் உரிமைகள்",
    "தரவு வைத்திருத்தல்",
    "சர்வதேச தரவு பரிமாற்றங்கள்",
    "பாதுகாப்பு",
    "குழந்தைகளின் தனியுரிமை",
    "மூன்றாம் தரப்பு இணையதளங்கள்",
    "இந்தக் கொள்கையில் மாற்றங்கள்",
    "தொடர்பு தகவல்"
  ],
  "mi": [
    "Raraunga Ka Kohia e Tatou",
    "Kaupapa Ture mo te Tukatuka (GDPR)",
    "Me pehea matou e whakamahi ai i o Raraunga Whaiaro",
    "Pihikete & Aroturuki",
    "Tiri Raraunga",
    "To Tika",
    "Pupuri Raraunga",
    "Whakawhiti Raraunga Ao",
    "Haumarutanga",
    "Matatapu a nga tamariki",
    "Paetukutuku Tuatoru",
    "Nga Huringa ki tenei Kaupapahere",
    "Nga korero Whakapā"
  ]
};

const TERMS_SUBSECTION_TITLES = {
  "en": {
    "productInformation": "Product Information",
    "pricing": "Pricing",
    "orderAcceptance": "Order Acceptance",
    "euWithdrawal": "EU / EEA / Swiss Customers: Right of Withdrawal",
    "usaCustomers": "USA Customers",
    "euUsers": "EU/EEA/Swiss Users",
    "usaUsers": "USA Users"
  },
  "de": {
    "productInformation": "Produktinformationen",
    "pricing": "Preise",
    "orderAcceptance": "Auftragsannahme",
    "euWithdrawal": "EU-/EWR-/Schweizer Kunden: Widerrufsrecht",
    "usaCustomers": "Kunden aus den USA",
    "euUsers": "Benutzer aus der EU, dem EWR und der Schweiz",
    "usaUsers": "USA-Benutzer"
  },
  "fr": {
    "productInformation": "Informations sur le produit",
    "pricing": "Tarifs",
    "orderAcceptance": "Acceptation de la commande",
    "euWithdrawal": "Clients UE / EEE / Suisse: droit de rétractation",
    "usaCustomers": "Clients américains",
    "euUsers": "Utilisateurs UE/EEE/Suisse",
    "usaUsers": "Utilisateurs américains"
  },
  "es": {
    "productInformation": "Información del producto",
    "pricing": "Precios",
    "orderAcceptance": "Aceptación de pedido",
    "euWithdrawal": "Clientes UE / EEE / Suiza: Derecho de desistimiento",
    "usaCustomers": "Clientes de EE. UU.",
    "euUsers": "Usuarios de la UE/EEE/Suiza",
    "usaUsers": "Usuarios de EE. UU."
  },
  "ja": {
    "productInformation": "製品情報",
    "pricing": "価格設定",
    "orderAcceptance": "注文受付",
    "euWithdrawal": "EU / EEA / スイスの顧客: 撤回の権利",
    "usaCustomers": "米国の顧客",
    "euUsers": "EU/EEA/スイスのユーザー",
    "usaUsers": "米国のユーザー"
  },
  "zh": {
    "productInformation": "产品信息",
    "pricing": "定价",
    "orderAcceptance": "订单接受",
    "euWithdrawal": "欧盟/欧洲经济区/瑞士客户：撤回权",
    "usaCustomers": "美国客户",
    "euUsers": "欧盟/欧洲经济区/瑞士用户",
    "usaUsers": "美国用户"
  },
  "zh-hant": {
    "productInformation": "產品資訊",
    "pricing": "定價",
    "orderAcceptance": "訂單接受",
    "euWithdrawal": "歐盟/歐洲經濟區/瑞士客戶：撤回權",
    "usaCustomers": "美國客戶",
    "euUsers": "歐盟/歐洲經濟區/瑞士用戶",
    "usaUsers": "美國用戶"
  },
  "pt": {
    "productInformation": "Informações do produto",
    "pricing": "Preços",
    "orderAcceptance": "Aceitação de pedido",
    "euWithdrawal": "Clientes da UE/EEE/Suíça: Direito de Retirada",
    "usaCustomers": "Clientes dos EUA",
    "euUsers": "Usuários da UE/EEE/Suíça",
    "usaUsers": "Usuários dos EUA"
  },
  "hi": {
    "productInformation": "उत्पाद की जानकारी",
    "pricing": "मूल्य निर्धारण",
    "orderAcceptance": "आदेश स्वीकृति",
    "euWithdrawal": "ईयू/ईईए/स्विस ग्राहक: निकासी का अधिकार",
    "usaCustomers": "यूएसए ग्राहक",
    "euUsers": "ईयू/ईईए/स्विस उपयोगकर्ता",
    "usaUsers": "यूएसए उपयोगकर्ता"
  },
  "th": {
    "productInformation": "ข้อมูลผลิตภัณฑ์",
    "pricing": "ราคา",
    "orderAcceptance": "การยอมรับคำสั่งซื้อ",
    "euWithdrawal": "ลูกค้า EU / EEA / Swiss: สิทธิในการถอนตัว",
    "usaCustomers": "ลูกค้าสหรัฐอเมริกา",
    "euUsers": "ผู้ใช้ EU/EEA/สวิส",
    "usaUsers": "ผู้ใช้ในสหรัฐอเมริกา"
  },
  "ms": {
    "productInformation": "Maklumat Produk",
    "pricing": "penentuan harga",
    "orderAcceptance": "Penerimaan Pesanan",
    "euWithdrawal": "Pelanggan EU / EEA / Switzerland: Hak Pengeluaran",
    "usaCustomers": "Pelanggan USA",
    "euUsers": "Pengguna EU/EEA/Swiss",
    "usaUsers": "Pengguna Amerika Syarikat"
  },
  "nl": {
    "productInformation": "Productinformatie",
    "pricing": "Prijzen",
    "orderAcceptance": "Acceptatie van bestellingen",
    "euWithdrawal": "Klanten uit de EU/EER/Zwitserland: Herroepingsrecht",
    "usaCustomers": "Amerikaanse klanten",
    "euUsers": "EU/EER/Zwitserse gebruikers",
    "usaUsers": "Amerikaanse gebruikers"
  },
  "id": {
    "productInformation": "Informasi Produk",
    "pricing": "Harga",
    "orderAcceptance": "Penerimaan Pesanan",
    "euWithdrawal": "Pelanggan UE / EEA / Swiss: Hak Penarikan",
    "usaCustomers": "Pelanggan AS",
    "euUsers": "Pengguna UE/EEA/Swiss",
    "usaUsers": "Pengguna AS"
  },
  "cs": {
    "productInformation": "Informace o produktu",
    "pricing": "Ceny",
    "orderAcceptance": "Přijetí objednávky",
    "euWithdrawal": "Zákazníci z EU / EHP / Švýcarska: Právo na odstoupení od smlouvy",
    "usaCustomers": "Zákazníci z USA",
    "euUsers": "Uživatelé EU/EHP/Švýcarsko",
    "usaUsers": "Uživatelé USA"
  },
  "it": {
    "productInformation": "Informazioni sul prodotto",
    "pricing": "Prezzi",
    "orderAcceptance": "Accettazione dell'ordine",
    "euWithdrawal": "Clienti UE/SEE/Svizzera: diritto di recesso",
    "usaCustomers": "Clienti statunitensi",
    "euUsers": "Utenti UE/SEE/Svizzera",
    "usaUsers": "Utenti statunitensi"
  },
  "he": {
    "productInformation": "מידע על המוצר",
    "pricing": "תמחור",
    "orderAcceptance": "קבלת הזמנה",
    "euWithdrawal": "לקוחות האיחוד האירופי / EEA / שווייץ: זכות משיכה",
    "usaCustomers": "לקוחות ארה\"ב",
    "euUsers": "משתמשים באיחוד האירופי/EEA/שוויץ",
    "usaUsers": "משתמשים בארה\"ב"
  },
  "ga": {
    "productInformation": "Eolas Táirge",
    "pricing": "Praghsáil",
    "orderAcceptance": "Glacadh le hOrdú",
    "euWithdrawal": "Custaiméirí AE/LEE/Eilvéise: Ceart Aistarraingthe",
    "usaCustomers": "Custaiméirí SAM",
    "euUsers": "Úsáideoirí AE/LEE/Eilvéise",
    "usaUsers": "Úsáideoirí Stáit Aontaithe Mheiriceá"
  },
  "pl": {
    "productInformation": "Informacje o produkcie",
    "pricing": "Wycena",
    "orderAcceptance": "Akceptacja zamówienia",
    "euWithdrawal": "Klienci z UE/EOG/Szwajcarii: Prawo do odstąpienia od umowy",
    "usaCustomers": "Klienci z USA",
    "euUsers": "Użytkownicy z UE/EOG/Szwajcarii",
    "usaUsers": "Użytkownicy z USA"
  },
  "ko": {
    "productInformation": "제품정보",
    "pricing": "가격",
    "orderAcceptance": "주문 수락",
    "euWithdrawal": "EU/EEA/스위스 고객: 철회 권리",
    "usaCustomers": "미국 고객",
    "euUsers": "EU/EEA/스위스 사용자",
    "usaUsers": "미국 사용자"
  },
  "no": {
    "productInformation": "Produktinformasjon",
    "pricing": "Prissetting",
    "orderAcceptance": "Ordre aksept",
    "euWithdrawal": "EU / EØS / Sveitsiske kunder: Angrerett",
    "usaCustomers": "USA-kunder",
    "euUsers": "EU/EØS/Sveits-brukere",
    "usaUsers": "USA-brukere"
  },
  "ru": {
    "productInformation": "Информация о продукте",
    "pricing": "Цены",
    "orderAcceptance": "Прием заказа",
    "euWithdrawal": "Клиенты из ЕС/ЕЭЗ/Швейцарии: право на отказ",
    "usaCustomers": "Клиенты из США",
    "euUsers": "Пользователи из ЕС/ЕЭЗ/Швейцарии",
    "usaUsers": "Пользователи из США"
  },
  "sv": {
    "productInformation": "Produktinformation",
    "pricing": "Prissättning",
    "orderAcceptance": "Beställningsacceptans",
    "euWithdrawal": "EU/EES/Schweiziska kunder: Ångerrätt",
    "usaCustomers": "USA-kunder",
    "euUsers": "EU/EES/Schweiziska användare",
    "usaUsers": "USA-användare"
  },
  "fi": {
    "productInformation": "Tuotetiedot",
    "pricing": "Hinnoittelu",
    "orderAcceptance": "Tilauksen hyväksyminen",
    "euWithdrawal": "EU / ETA / Sveitsin asiakkaat: Peruuttamisoikeus",
    "usaCustomers": "USA:n asiakkaat",
    "euUsers": "EU/ETA/Sveitsin käyttäjät",
    "usaUsers": "USA:n käyttäjät"
  },
  "tl": {
    "productInformation": "Impormasyon ng Produkto",
    "pricing": "Pagpepresyo",
    "orderAcceptance": "Pagtanggap ng Order",
    "euWithdrawal": "Mga Customer ng EU / EEA / Swiss: Karapatan sa Pag-withdraw",
    "usaCustomers": "Mga Customer ng USA",
    "euUsers": "Mga User ng EU/EEA/Swiss",
    "usaUsers": "Mga Gumagamit ng USA"
  },
  "vi": {
    "productInformation": "Thông tin sản phẩm",
    "pricing": "Định giá",
    "orderAcceptance": "Chấp nhận đơn hàng",
    "euWithdrawal": "Khách hàng EU / EEA / Thụy Sĩ: Quyền rút tiền",
    "usaCustomers": "Khách hàng Hoa Kỳ",
    "euUsers": "Người dùng ở EU/EEA/Thụy Sĩ",
    "usaUsers": "Người dùng Hoa Kỳ"
  },
  "cy": {
    "productInformation": "Gwybodaeth Cynnyrch",
    "pricing": "Prisio",
    "orderAcceptance": "Derbyn Gorchymyn",
    "euWithdrawal": "Cwsmeriaid yr UE / AEE / Swistir: Hawl Tynnu'n Ôl",
    "usaCustomers": "Cwsmeriaid UDA",
    "euUsers": "Defnyddwyr yr UE/AEE/Swistir",
    "usaUsers": "Defnyddwyr UDA"
  },
  "ta": {
    "productInformation": "தயாரிப்பு தகவல்",
    "pricing": "விலை நிர்ணயம்",
    "orderAcceptance": "ஆர்டர் ஏற்பு",
    "euWithdrawal": "EU / EEA / சுவிஸ் வாடிக்கையாளர்கள்: திரும்பப் பெறுவதற்கான உரிமை",
    "usaCustomers": "USA வாடிக்கையாளர்கள்",
    "euUsers": "EU/EEA/சுவிஸ் பயனர்கள்",
    "usaUsers": "USA பயனர்கள்"
  },
  "mi": {
    "productInformation": "Nga korero hua",
    "pricing": "Te utu",
    "orderAcceptance": "Whakaaetanga Whakatau",
    "euWithdrawal": "EU / EEA / Swiss Kiritaki: Tika mo te Tango",
    "usaCustomers": "Nga Kaihoko USA",
    "euUsers": "EU/EEA/Swiss Kaiwhakamahi",
    "usaUsers": "USA Kaiwhakamahi"
  }
};

const PRIVACY_SUBSECTION_TITLES = {
  "en": {
    "personalDataProvided": "Personal Data You Provide",
    "automaticData": "Automatically Collected Data",
    "euRights": "EU/EEA/Swiss Users (GDPR Rights)",
    "usaRights": "USA Users (CCPA/CPRA, Where Applicable)"
  },
  "de": {
    "personalDataProvided": "Persönliche Daten, die Sie bereitstellen",
    "automaticData": "Automatisch erfasste Daten",
    "euRights": "EU-/EWR-/Schweiz-Benutzer (DSGVO-Rechte)",
    "usaRights": "Benutzer in den USA (CCPA/CPRA, sofern zutreffend)"
  },
  "fr": {
    "personalDataProvided": "Données personnelles que vous fournissez",
    "automaticData": "Données collectées automatiquement",
    "euRights": "Utilisateurs UE/EEE/Suisse (Droits RGPD)",
    "usaRights": "Utilisateurs américains (CCPA/CPRA, le cas échéant)"
  },
  "es": {
    "personalDataProvided": "Datos personales que usted proporciona",
    "automaticData": "Datos recopilados automáticamente",
    "euRights": "Usuarios de la UE/EEE/Suiza (Derechos GDPR)",
    "usaRights": "Usuarios de EE. UU. (CCPA/CPRA, cuando corresponda)"
  },
  "ja": {
    "personalDataProvided": "あなたが提供する個人データ",
    "automaticData": "自動的に収集されるデータ",
    "euRights": "EU/EEA/スイスのユーザー (GDPR 権利)",
    "usaRights": "米国ユーザー (CCPA/CPRA、該当する場合)"
  },
  "zh": {
    "personalDataProvided": "您提供的个人数据",
    "automaticData": "自动收集的数据",
    "euRights": "欧盟/欧洲经济区/瑞士用户（GDPR 权利）",
    "usaRights": "美国用户（CCPA/CPRA，如适用）"
  },
  "zh-hant": {
    "personalDataProvided": "您提供的個人數據",
    "automaticData": "自動收集的數據",
    "euRights": "歐盟/歐洲經濟區/瑞士用戶（GDPR 權利）",
    "usaRights": "美國用戶（CCPA/CPRA，如適用）"
  },
  "pt": {
    "personalDataProvided": "Dados pessoais que você fornece",
    "automaticData": "Dados coletados automaticamente",
    "euRights": "Usuários da UE/EEE/Suíça (Direitos GDPR)",
    "usaRights": "Usuários dos EUA (CCPA/CPRA, quando aplicável)"
  },
  "hi": {
    "personalDataProvided": "आपके द्वारा प्रदान किया गया व्यक्तिगत डेटा",
    "automaticData": "स्वचालित रूप से एकत्रित डेटा",
    "euRights": "ईयू/ईईए/स्विस उपयोगकर्ता (जीडीपीआर अधिकार)",
    "usaRights": "यूएसए उपयोगकर्ता (सीसीपीए/सीपीआरए, जहां लागू हो)"
  },
  "th": {
    "personalDataProvided": "ข้อมูลส่วนบุคคลที่คุณให้",
    "automaticData": "ข้อมูลที่รวบรวมโดยอัตโนมัติ",
    "euRights": "ผู้ใช้ EU/EEA/สวิส (สิทธิ์ GDPR)",
    "usaRights": "ผู้ใช้ในสหรัฐอเมริกา (CCPA/CPRA หากมี)"
  },
  "ms": {
    "personalDataProvided": "Data Peribadi yang Anda Berikan",
    "automaticData": "Data Dikumpul Secara Automatik",
    "euRights": "Pengguna EU/EEA/Swiss (Hak GDPR)",
    "usaRights": "Pengguna Amerika Syarikat (CCPA/CPRA, Jika Berkenaan)"
  },
  "nl": {
    "personalDataProvided": "Persoonlijke gegevens die u verstrekt",
    "automaticData": "Automatisch verzamelde gegevens",
    "euRights": "EU/EER/Zwitserse gebruikers (AVG-rechten)",
    "usaRights": "Gebruikers in de VS (CCPA/CPRA, indien van toepassing)"
  },
  "id": {
    "personalDataProvided": "Data Pribadi yang Anda Berikan",
    "automaticData": "Data yang Dikumpulkan Secara Otomatis",
    "euRights": "Pengguna UE/EEA/Swiss (Hak GDPR)",
    "usaRights": "Pengguna AS (CCPA/CPRA, Jika Berlaku)"
  },
  "cs": {
    "personalDataProvided": "Osobní údaje, které poskytnete",
    "automaticData": "Automaticky shromažďovaná data",
    "euRights": "Uživatelé EU/EHP/Švýcarsko (práva GDPR)",
    "usaRights": "Uživatelé z USA (CCPA/CPRA, pokud je to možné)"
  },
  "it": {
    "personalDataProvided": "Dati personali forniti",
    "automaticData": "Dati raccolti automaticamente",
    "euRights": "Utenti UE/SEE/Svizzera (Diritti GDPR)",
    "usaRights": "Utenti USA (CCPA/CPRA, ove applicabile)"
  },
  "he": {
    "personalDataProvided": "נתונים אישיים שאתה מספק",
    "automaticData": "נתונים שנאספו אוטומטית",
    "euRights": "משתמשים באיחוד האירופי/EEA/שוויץ (זכויות GDPR)",
    "usaRights": "משתמשים בארה\"ב (CCPA/CPRA, היכן שניתן)"
  },
  "ga": {
    "personalDataProvided": "Sonraí Pearsanta a Sholáthróidh tú",
    "automaticData": "Sonraí a Bailítear go huathoibríoch",
    "euRights": "Úsáideoirí AE/LEE/na hEilvéise (Cearta GDPR)",
    "usaRights": "Úsáideoirí SAM (CCPA/CPRA, Nuair is Infheidhme)"
  },
  "pl": {
    "personalDataProvided": "Dane osobowe, które podajesz",
    "automaticData": "Dane zbierane automatycznie",
    "euRights": "Użytkownicy z UE/EOG/Szwajcarii (prawa RODO)",
    "usaRights": "Użytkownicy z USA (CCPA/CPRA, tam gdzie ma to zastosowanie)"
  },
  "ko": {
    "personalDataProvided": "귀하가 제공하는 개인 데이터",
    "automaticData": "자동으로 수집되는 데이터",
    "euRights": "EU/EEA/스위스 사용자(GDPR 권리)",
    "usaRights": "미국 사용자(해당되는 경우 CCPA/CPRA)"
  },
  "no": {
    "personalDataProvided": "Personopplysninger du oppgir",
    "automaticData": "Automatisk innsamlede data",
    "euRights": "EU/EØS/Sveits-brukere (GDPR-rettigheter)",
    "usaRights": "USA-brukere (CCPA/CPRA, der det er aktuelt)"
  },
  "ru": {
    "personalDataProvided": "Персональные данные, которые вы предоставляете",
    "automaticData": "Автоматически собираемые данные",
    "euRights": "Пользователи из ЕС/ЕЭЗ/Швейцарии (права GDPR)",
    "usaRights": "Пользователи из США (CCPA/CPRA, где применимо)"
  },
  "sv": {
    "personalDataProvided": "Personuppgifter du tillhandahåller",
    "automaticData": "Automatiskt insamlade data",
    "euRights": "EU/EES/Schweiziska användare (GDPR-rättigheter)",
    "usaRights": "Användare i USA (CCPA/CPRA, där så är tillämpligt)"
  },
  "fi": {
    "personalDataProvided": "Antamasi henkilötiedot",
    "automaticData": "Automaattisesti kerätyt tiedot",
    "euRights": "EU/ETA/Sveitsin käyttäjät (GDPR-oikeudet)",
    "usaRights": "USA:n käyttäjät (CCPA/CPRA, soveltuvin osin)"
  },
  "tl": {
    "personalDataProvided": "Personal na Data na Ibinibigay Mo",
    "automaticData": "Awtomatikong Kinokolektang Data",
    "euRights": "Mga User ng EU/EEA/Swiss (GDPR Rights)",
    "usaRights": "Mga User ng USA (CCPA/CPRA, Kung Saan Naaangkop)"
  },
  "vi": {
    "personalDataProvided": "Dữ liệu cá nhân bạn cung cấp",
    "automaticData": "Dữ liệu được thu thập tự động",
    "euRights": "Người dùng ở EU/EEA/Thụy Sĩ (Quyền GDPR)",
    "usaRights": "Người dùng Hoa Kỳ (CCPA/CPRA, nếu có)"
  },
  "cy": {
    "personalDataProvided": "Data Personol a Ddarperwch",
    "automaticData": "Data a Gasglwyd yn Awtomatig",
    "euRights": "Defnyddwyr yr UE/AEE/Swiss (Hawliau GDPR)",
    "usaRights": "Defnyddwyr UDA (CCPA/CPRA, Lle bo hynny'n berthnasol)"
  },
  "ta": {
    "personalDataProvided": "நீங்கள் வழங்கும் தனிப்பட்ட தரவு",
    "automaticData": "தானாக சேகரிக்கப்பட்ட தரவு",
    "euRights": "EU/EEA/சுவிஸ் பயனர்கள் (GDPR உரிமைகள்)",
    "usaRights": "USA பயனர்கள் (CCPA/CPRA, பொருந்தக்கூடிய இடங்களில்)"
  },
  "mi": {
    "personalDataProvided": "Raraunga Whaiaro Ka whakaratohia e koe",
    "automaticData": "Raraunga Kohia Aunoa",
    "euRights": "EU/EEA/Swiss Kaiwhakamahi (GDPR Rights)",
    "usaRights": "Nga Kaiwhakamahi USA (CCPA/CPRA, Ki Te Wahi E Pa ana)"
  }
};

const DATE_LABELS = {
  en: { effectiveDate: 'Effective Date', lastUpdated: 'Last Updated' },
  de: { effectiveDate: 'Datum des Inkrafttretens', lastUpdated: 'Letzte Aktualisierung' },
  fr: { effectiveDate: 'Date d\'entrée en vigueur', lastUpdated: 'Dernière mise à jour' },
  es: { effectiveDate: 'Fecha de vigencia', lastUpdated: 'Última actualización' },
  ja: { effectiveDate: '発効日', lastUpdated: '最終更新日' },
  zh: { effectiveDate: '生效日期', lastUpdated: '最后更新' },
  'zh-hant': { effectiveDate: '生效日期', lastUpdated: '最後更新' },
  pt: { effectiveDate: 'Data de vigência', lastUpdated: 'Última atualização' },
  hi: { effectiveDate: 'प्रभावी तिथि', lastUpdated: 'आखरी अपडेट' },
  th: { effectiveDate: 'วันที่มีผลบังคับใช้', lastUpdated: 'อัปเดตล่าสุด' },
  ms: { effectiveDate: 'Tarikh Berkuatkuasa', lastUpdated: 'Kemas Kini Terakhir' },
  nl: { effectiveDate: 'Ingangsdatum', lastUpdated: 'Laatst bijgewerkt' },
  id: { effectiveDate: 'Tanggal Berlaku', lastUpdated: 'Terakhir Diperbarui' },
  cs: { effectiveDate: 'Datum účinnosti', lastUpdated: 'Poslední aktualizace' },
  it: { effectiveDate: 'Data di entrata in vigore', lastUpdated: 'Ultimo aggiornamento' },
  he: { effectiveDate: 'תאריך תוקף', lastUpdated: 'עדכון אחרון' },
  ga: { effectiveDate: 'Dáta Éifeachtach', lastUpdated: 'An Nuashonrú Deiridh' },
  pl: { effectiveDate: 'Data wejścia w życie', lastUpdated: 'Ostatnia aktualizacja' },
  ko: { effectiveDate: '유효 날짜', lastUpdated: '마지막 업데이트' },
  no: { effectiveDate: 'Ikrafttredelsesdato', lastUpdated: 'Sist oppdatert' },
  sv: { effectiveDate: 'Ikraftträdandedatum', lastUpdated: 'Senast uppdaterad' },
  tl: { effectiveDate: 'Petsa ng Bisa', lastUpdated: 'Huling Na-update' },
  vi: { effectiveDate: 'Ngày có hiệu lực', lastUpdated: 'Cập nhật lần cuối' },
  fi: { effectiveDate: 'Voimaantulopäivä', lastUpdated: 'Päivitetty viimeksi' },
  ru: { effectiveDate: 'Дата вступления в силу', lastUpdated: 'Последнее обновление' },
  cy: { effectiveDate: 'Dyddiad Dod i rym', lastUpdated: 'Diweddarwyd Diwethaf' },
  ta: { effectiveDate: 'நடைமுறைக்கு வரும் தேதி', lastUpdated: 'கடைசியாக புதுப்பிக்கப்பட்டது' },
  mi: { effectiveDate: 'Te Ra Whai Mana', lastUpdated: 'Whakahoutanga Mutunga' },
};

const DATE_LOCALES = {
  en: 'en-GB',
  de: 'de-DE',
  fr: 'fr-FR',
  es: 'es-ES',
  ja: 'ja-JP',
  zh: 'zh-CN',
  'zh-hant': 'zh-Hant',
  pt: 'pt-PT',
  hi: 'hi-IN',
  th: 'th-TH',
  ms: 'ms-MY',
  nl: 'nl-NL',
  id: 'id-ID',
  cs: 'cs-CZ',
  it: 'it-IT',
  he: 'he-IL',
  ga: 'ga-IE',
  pl: 'pl-PL',
  ko: 'ko-KR',
  no: 'nb-NO',
  sv: 'sv-SE',
  tl: 'fil-PH',
  vi: 'vi-VN',
  fi: 'fi-FI',
  ru: 'ru-RU',
  cy: 'cy-GB',
  ta: 'ta-IN',
  mi: 'mi-NZ'
};

export const getLocalizedPolicyDate = (language) => {
  const lang = normalizeLang(language);
  const locale = DATE_LOCALES[lang];

  if (!locale) {
    throw new Error(`Missing policy date locale for language: ${lang}`);
  }

  const fixedDate = new Date(Date.UTC(2026, 1, 24));
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(fixedDate);
};

export const getTermsUiLabels = (language) => {
  const lang = normalizeLang(language);
  const date = DATE_LABELS[lang];
  const sectionTitles = TERMS_TITLES[lang];
  const subsectionTitles = TERMS_SUBSECTION_TITLES[lang];

  if (!date || !sectionTitles || !subsectionTitles) {
    throw new Error(`Missing Terms UI translations for language: ${lang}`);
  }

  return {
    effectiveDate: date.effectiveDate,
    lastUpdated: date.lastUpdated,
    sectionTitles,
    subsectionTitles,
  };
};

export const getPrivacyUiLabels = (language) => {
  const lang = normalizeLang(language);
  const date = DATE_LABELS[lang];
  const sectionTitles = PRIVACY_TITLES[lang];
  const subsectionTitles = PRIVACY_SUBSECTION_TITLES[lang];

  if (!date || !sectionTitles || !subsectionTitles) {
    throw new Error(`Missing Privacy UI translations for language: ${lang}`);
  }

  return {
    effectiveDate: date.effectiveDate,
    lastUpdated: date.lastUpdated,
    sectionTitles,
    subsectionTitles,
  };
};

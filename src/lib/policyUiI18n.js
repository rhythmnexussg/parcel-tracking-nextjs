const normalizeLang = (language) => {
  const code = (language || 'en').toLowerCase();
  if (code === 'iw') return 'he';
  if (code === 'fil') return 'tl';
  if (code === 'zh-cn' || code === 'zh-hans') return 'zh';
  if (code === 'zh-tw' || code === 'zh-hk' || code === 'zh-hant') return 'zh-hant';
  if (code.startsWith('nb') || code.startsWith('nn')) return 'no';
  return code;
};

const TERMS_TITLES = {
  en: ['Eligibility', 'Account Creation', 'Products, Pricing & Orders', 'Payment Terms', 'Shipping, Delivery & Risk of Loss', 'Returns, Refunds & Exchanges', 'Digital Products', 'Intellectual Property', 'Limitation of Liability', 'Governing Law & Jurisdiction', 'Dispute Resolution', 'Changes to Terms'],
  de: ['Berechtigung', 'Kontoerstellung', 'Produkte, Preise & Bestellungen', 'Zahlungsbedingungen', 'Versand, Lieferung & Gefahrübergang', 'Rückgaben, Erstattungen & Umtausch', 'Digitale Produkte', 'Geistiges Eigentum', 'Haftungsbeschränkung', 'Anwendbares Recht & Gerichtsstand', 'Streitbeilegung', 'Änderungen der Bedingungen'],
  fr: ['Éligibilité', 'Création de compte', 'Produits, prix et commandes', 'Conditions de paiement', 'Expédition, livraison et transfert des risques', 'Retours, remboursements et échanges', 'Produits numériques', 'Propriété intellectuelle', 'Limitation de responsabilité', 'Droit applicable et juridiction', 'Résolution des litiges', 'Modifications des conditions'],
  es: ['Elegibilidad', 'Creación de cuenta', 'Productos, precios y pedidos', 'Condiciones de pago', 'Envío, entrega y riesgo de pérdida', 'Devoluciones, reembolsos y cambios', 'Productos digitales', 'Propiedad intelectual', 'Limitación de responsabilidad', 'Ley aplicable y jurisdicción', 'Resolución de disputas', 'Cambios en los términos'],
  ja: ['利用資格', 'アカウント作成', '商品・価格・注文', '支払い条件', '配送・配達・危険負担', '返品・返金・交換', 'デジタル製品', '知的財産', '責任の制限', '準拠法および裁判管轄', '紛争解決', '利用規約の変更'],
  zh: ['资格', '账户创建', '产品、价格与订单', '付款条款', '运输、交付与风险转移', '退货、退款与换货', '数字产品', '知识产权', '责任限制', '适用法律与管辖', '争议解决', '条款变更'],
  'zh-hant': ['資格', '帳戶建立', '產品、價格與訂單', '付款條款', '運送、交付與風險移轉', '退貨、退款與換貨', '數位產品', '智慧財產權', '責任限制', '準據法與管轄', '爭議解決', '條款變更'],
  pt: ['Elegibilidade', 'Criação de conta', 'Produtos, preços e pedidos', 'Termos de pagamento', 'Envio, entrega e risco de perda', 'Devoluções, reembolsos e trocas', 'Produtos digitais', 'Propriedade intelectual', 'Limitação de responsabilidade', 'Lei aplicável e jurisdição', 'Resolução de disputas', 'Alterações dos termos'],
  hi: ['पात्रता', 'खाता निर्माण', 'उत्पाद, मूल्य और आदेश', 'भुगतान शर्तें', 'शिपिंग, डिलीवरी और जोखिम हस्तांतरण', 'वापसी, रिफंड और एक्सचेंज', 'डिजिटल उत्पाद', 'बौद्धिक संपदा', 'दायित्व की सीमा', 'शासी कानून और अधिकार-क्षेत्र', 'विवाद समाधान', 'शर्तों में परिवर्तन'],
  th: ['คุณสมบัติผู้ใช้', 'การสร้างบัญชี', 'สินค้า ราคา และคำสั่งซื้อ', 'เงื่อนไขการชำระเงิน', 'การจัดส่ง การส่งมอบ และความเสี่ยง', 'การคืนสินค้า การคืนเงิน และการเปลี่ยนสินค้า', 'ผลิตภัณฑ์ดิจิทัล', 'ทรัพย์สินทางปัญญา', 'ข้อจำกัดความรับผิด', 'กฎหมายที่ใช้บังคับและเขตอำนาจศาล', 'การระงับข้อพิพาท', 'การเปลี่ยนแปลงข้อกำหนด'],
  ms: ['Kelayakan', 'Penciptaan akaun', 'Produk, harga & pesanan', 'Terma pembayaran', 'Penghantaran, penyerahan & risiko kehilangan', 'Pemulangan, bayaran balik & pertukaran', 'Produk digital', 'Harta intelek', 'Had liabiliti', 'Undang-undang mentadbir & bidang kuasa', 'Penyelesaian pertikaian', 'Perubahan terma'],
  nl: ['Geschiktheid', 'Account aanmaken', 'Producten, prijzen en bestellingen', 'Betalingsvoorwaarden', 'Verzending, levering en risico-overgang', 'Retouren, terugbetalingen en omruilingen', 'Digitale producten', 'Intellectueel eigendom', 'Beperking van aansprakelijkheid', 'Toepasselijk recht en jurisdictie', 'Geschillenbeslechting', 'Wijzigingen in de voorwaarden'],
  id: ['Kelayakan', 'Pembuatan akun', 'Produk, harga & pesanan', 'Ketentuan pembayaran', 'Pengiriman, penyerahan & risiko kehilangan', 'Pengembalian, refund & penukaran', 'Produk digital', 'Kekayaan intelektual', 'Batasan tanggung jawab', 'Hukum yang berlaku & yurisdiksi', 'Penyelesaian sengketa', 'Perubahan ketentuan'],
  cs: ['Způsobilost', 'Vytvoření účtu', 'Produkty, ceny a objednávky', 'Platební podmínky', 'Doprava, doručení a přechod rizika', 'Vrácení, refundace a výměny', 'Digitální produkty', 'Duševní vlastnictví', 'Omezení odpovědnosti', 'Rozhodné právo a jurisdikce', 'Řešení sporů', 'Změny podmínek'],
  it: ['Idoneità', 'Creazione account', 'Prodotti, prezzi e ordini', 'Termini di pagamento', 'Spedizione, consegna e rischio di perdita', 'Resi, rimborsi e cambi', 'Prodotti digitali', 'Proprietà intellettuale', 'Limitazione di responsabilità', 'Legge applicabile e giurisdizione', 'Risoluzione delle controversie', 'Modifiche ai termini'],
  he: ['זכאות', 'יצירת חשבון', 'מוצרים, מחירים והזמנות', 'תנאי תשלום', 'משלוח, מסירה והעברת סיכון', 'החזרות, זיכויים והחלפות', 'מוצרים דיגיטליים', 'קניין רוחני', 'הגבלת אחריות', 'דין חל וסמכות שיפוט', 'יישוב סכסוכים', 'שינויים בתנאים'],
  ga: ['Incháilitheacht', 'Cruthú cuntais', 'Táirgí, praghsáil & orduithe', 'Téarmaí íocaíochta', 'Loingseoireacht, seachadadh & riosca caillteanais', 'Aischuir, aisíocaíochtaí & malartuithe', 'Táirgí digiteacha', 'Maoin intleachtúil', 'Teorainn dliteanais', 'Dlí rialaithe & dlínse', 'Réiteach díospóide', 'Athruithe ar théarmaí'],
  pl: ['Uprawnienia', 'Tworzenie konta', 'Produkty, ceny i zamówienia', 'Warunki płatności', 'Wysyłka, dostawa i ryzyko utraty', 'Zwroty, refundacje i wymiany', 'Produkty cyfrowe', 'Własność intelektualna', 'Ograniczenie odpowiedzialności', 'Prawo właściwe i jurysdykcja', 'Rozwiązywanie sporów', 'Zmiany warunków'],
  ko: ['자격 요건', '계정 생성', '상품, 가격 및 주문', '결제 조건', '배송, 인도 및 위험 이전', '반품, 환불 및 교환', '디지털 상품', '지식재산권', '책임의 제한', '준거법 및 관할', '분쟁 해결', '약관 변경'],
  no: ['Kvalifikasjon', 'Kontoopprettelse', 'Produkter, priser og bestillinger', 'Betalingsvilkår', 'Frakt, levering og risiko for tap', 'Returer, refusjoner og bytter', 'Digitale produkter', 'Immaterielle rettigheter', 'Ansvarsbegrensning', 'Lovvalg og jurisdiksjon', 'Tvisteløsning', 'Endringer i vilkårene'],
  sv: ['Behörighet', 'Skapa konto', 'Produkter, priser och beställningar', 'Betalningsvillkor', 'Frakt, leverans och riskövergång', 'Returer, återbetalningar och byten', 'Digitala produkter', 'Immateriella rättigheter', 'Ansvarsbegränsning', 'Tillämplig lag och jurisdiktion', 'Tvistlösning', 'Ändringar av villkoren'],
  tl: ['Pagiging kwalipikado', 'Paglikha ng account', 'Mga produkto, presyo at order', 'Mga tuntunin sa pagbabayad', 'Pagpapadala, paghahatid at panganib ng pagkawala', 'Mga balik, refund at palitan', 'Digital na produkto', 'Intelektwal na ari-arian', 'Limitasyon ng pananagutan', 'Namamahalang batas at hurisdiksiyon', 'Resolusyon ng alitan', 'Mga pagbabago sa mga tuntunin'],
  vi: ['Điều kiện đủ', 'Tạo tài khoản', 'Sản phẩm, giá và đơn hàng', 'Điều khoản thanh toán', 'Vận chuyển, giao hàng và rủi ro mất mát', 'Trả hàng, hoàn tiền và đổi hàng', 'Sản phẩm kỹ thuật số', 'Sở hữu trí tuệ', 'Giới hạn trách nhiệm', 'Luật điều chỉnh và thẩm quyền', 'Giải quyết tranh chấp', 'Thay đổi điều khoản'],
  fi: ['Kelpoisuus', 'Tilin luominen', 'Tuotteet, hinnat ja tilaukset', 'Maksuehdot', 'Toimitus, luovutus ja riskin siirtyminen', 'Palautukset, hyvitykset ja vaihdot', 'Digitaaliset tuotteet', 'Immateriaalioikeudet', 'Vastuunrajoitus', 'Sovellettava laki ja toimivalta', 'Riitojen ratkaisu', 'Ehtojen muutokset'],
  ru: ['Право на использование', 'Создание аккаунта', 'Товары, цены и заказы', 'Условия оплаты', 'Доставка, передача и риск утраты', 'Возвраты, возмещения и обмен', 'Цифровые товары', 'Интеллектуальная собственность', 'Ограничение ответственности', 'Применимое право и юрисдикция', 'Разрешение споров', 'Изменения условий'],
  cy: ['Cymhwystra', 'Creu cyfrif', 'Cynhyrchion, prisio ac archebion', 'Telerau talu', 'Cludo, danfon a risg colled', 'Dychweliadau, ad-daliadau a chyfnewidiadau', 'Cynhyrchion digidol', 'Eiddo deallusol', 'Cyfyngu atebolrwydd', 'Cyfraith lywodraethol ac awdurdodaeth', 'Datrys anghydfodau', 'Newidiadau i’r telerau'],
  ta: ['தகுதி', 'கணக்கு உருவாக்கம்', 'தயாரிப்புகள், விலை மற்றும் ஆர்டர்கள்', 'கட்டண விதிமுறைகள்', 'அனுப்புதல், விநியோகம் மற்றும் இழப்பு அபாயம்', 'திருப்பி அனுப்பல், பணம் திரும்புதல் மற்றும் மாற்றம்', 'டிஜிட்டல் தயாரிப்புகள்', 'அறிவுசார் சொத்து', 'பொறுப்புக் குறைவு', 'பொருந்தும் சட்டம் மற்றும் அதிகார வரம்பு', 'தகராறு தீர்வு', 'விதிமுறைகளில் மாற்றங்கள்'],
  mi: ['Te āheinga', 'Hanga pūkete', 'Ngā hua, ngā utu me ngā ota', 'Ngā tikanga utu', 'Te tuku, te whakawhiti me te mōrea ngaromanga', 'Ngā whakahokinga, ngā moni whakahoki me ngā whakawhitinga', 'Ngā hua matihiko', 'Taonga hinengaro', 'Te herenga taunahatanga', 'Ture whakahaere me te mana whakawa', 'Whakataunga tautohe', 'Ngā panoni ki ngā tikanga']
};

const PRIVACY_TITLES = {
  en: ['Data We Collect', 'Legal Bases for Processing (GDPR)', 'How We Use Your Personal Data', 'Cookies & Tracking', 'Data Sharing', 'Your Rights', 'Data Retention', 'International Data Transfers', 'Security', 'Children’s Privacy', 'Third-Party Websites', 'Changes to This Policy', 'Contact Information'],
  de: ['Von uns erhobene Daten', 'Rechtsgrundlagen der Verarbeitung (DSGVO)', 'Wie wir Ihre personenbezogenen Daten verwenden', 'Cookies und Tracking', 'Datenweitergabe', 'Ihre Rechte', 'Datenspeicherung', 'Internationale Datenübermittlungen', 'Sicherheit', 'Datenschutz von Kindern', 'Websites Dritter', 'Änderungen dieser Richtlinie', 'Kontaktinformationen'],
  fr: ['Données que nous collectons', 'Bases légales du traitement (RGPD)', 'Comment nous utilisons vos données personnelles', 'Cookies et suivi', 'Partage des données', 'Vos droits', 'Conservation des données', 'Transferts internationaux de données', 'Sécurité', 'Vie privée des enfants', 'Sites tiers', 'Modifications de cette politique', 'Informations de contact'],
  es: ['Datos que recopilamos', 'Bases legales del tratamiento (RGPD)', 'Cómo usamos tus datos personales', 'Cookies y seguimiento', 'Intercambio de datos', 'Tus derechos', 'Retención de datos', 'Transferencias internacionales de datos', 'Seguridad', 'Privacidad de menores', 'Sitios web de terceros', 'Cambios en esta política', 'Información de contacto'],
  ja: ['収集するデータ', '処理の法的根拠（GDPR）', '個人データの利用方法', 'Cookieとトラッキング', 'データ共有', 'お客様の権利', 'データ保持', '国際的なデータ移転', 'セキュリティ', '子どものプライバシー', '第三者ウェブサイト', '本ポリシーの変更', '連絡先情報'],
  zh: ['我们收集的数据', '处理的法律依据（GDPR）', '我们如何使用您的个人数据', 'Cookie 与追踪', '数据共享', '您的权利', '数据保留', '国际数据传输', '安全', '儿童隐私', '第三方网站', '本政策的变更', '联系信息'],
  'zh-hant': ['我們蒐集的資料', '處理的法律依據（GDPR）', '我們如何使用您的個人資料', 'Cookie 與追蹤', '資料共享', '您的權利', '資料保留', '國際資料傳輸', '安全性', '兒童隱私', '第三方網站', '本政策之變更', '聯絡資訊'],
  pt: ['Dados que coletamos', 'Bases legais para o tratamento (RGPD)', 'Como usamos seus dados pessoais', 'Cookies e rastreamento', 'Compartilhamento de dados', 'Seus direitos', 'Retenção de dados', 'Transferências internacionais de dados', 'Segurança', 'Privacidade infantil', 'Sites de terceiros', 'Alterações nesta política', 'Informações de contato'],
  hi: ['हम जो डेटा एकत्र करते हैं', 'प्रसंस्करण के कानूनी आधार (GDPR)', 'हम आपके व्यक्तिगत डेटा का उपयोग कैसे करते हैं', 'कुकीज़ और ट्रैकिंग', 'डेटा साझा करना', 'आपके अधिकार', 'डेटा प्रतिधारण', 'अंतर्राष्ट्रीय डेटा स्थानांतरण', 'सुरक्षा', 'बच्चों की गोपनीयता', 'तृतीय-पक्ष वेबसाइटें', 'इस नीति में परिवर्तन', 'संपर्क जानकारी'],
  th: ['ข้อมูลที่เราเก็บรวบรวม', 'ฐานทางกฎหมายในการประมวลผล (GDPR)', 'เราใช้ข้อมูลส่วนบุคคลของคุณอย่างไร', 'คุกกี้และการติดตาม', 'การแบ่งปันข้อมูล', 'สิทธิของคุณ', 'การเก็บรักษาข้อมูล', 'การโอนข้อมูลระหว่างประเทศ', 'ความปลอดภัย', 'ความเป็นส่วนตัวของเด็ก', 'เว็บไซต์บุคคลที่สาม', 'การเปลี่ยนแปลงนโยบายนี้', 'ข้อมูลติดต่อ'],
  ms: ['Data yang kami kumpul', 'Asas undang-undang pemprosesan (GDPR)', 'Cara kami menggunakan data peribadi anda', 'Kuki dan penjejakan', 'Perkongsian data', 'Hak anda', 'Penyimpanan data', 'Pemindahan data antarabangsa', 'Keselamatan', 'Privasi kanak-kanak', 'Laman web pihak ketiga', 'Perubahan kepada dasar ini', 'Maklumat hubungan'],
  nl: ['Gegevens die we verzamelen', 'Rechtsgrondslagen voor verwerking (AVG)', 'Hoe we uw persoonsgegevens gebruiken', 'Cookies en tracking', 'Gegevensdeling', 'Uw rechten', 'Gegevensbewaring', 'Internationale gegevensoverdrachten', 'Beveiliging', 'Privacy van kinderen', 'Websites van derden', 'Wijzigingen in dit beleid', 'Contactinformatie'],
  id: ['Data yang kami kumpulkan', 'Dasar hukum pemrosesan (GDPR)', 'Bagaimana kami menggunakan data pribadi Anda', 'Cookie dan pelacakan', 'Berbagi data', 'Hak Anda', 'Retensi data', 'Transfer data internasional', 'Keamanan', 'Privasi anak', 'Situs pihak ketiga', 'Perubahan pada kebijakan ini', 'Informasi kontak'],
  cs: ['Údaje, které shromažďujeme', 'Právní základy zpracování (GDPR)', 'Jak používáme vaše osobní údaje', 'Cookies a sledování', 'Sdílení údajů', 'Vaše práva', 'Uchovávání údajů', 'Mezinárodní předávání údajů', 'Bezpečnost', 'Soukromí dětí', 'Webové stránky třetích stran', 'Změny těchto zásad', 'Kontaktní informace'],
  it: ['Dati che raccogliamo', 'Basi giuridiche del trattamento (GDPR)', 'Come utilizziamo i tuoi dati personali', 'Cookie e tracciamento', 'Condivisione dei dati', 'I tuoi diritti', 'Conservazione dei dati', 'Trasferimenti internazionali di dati', 'Sicurezza', 'Privacy dei minori', 'Siti web di terze parti', 'Modifiche a questa informativa', 'Informazioni di contatto'],
  he: ['הנתונים שאנו אוספים', 'בסיסים משפטיים לעיבוד (GDPR)', 'כיצד אנו משתמשים בנתונים האישיים שלך', 'עוגיות ומעקב', 'שיתוף נתונים', 'הזכויות שלך', 'שמירת נתונים', 'העברות נתונים בינלאומיות', 'אבטחה', 'פרטיות ילדים', 'אתרי צד שלישי', 'שינויים במדיניות זו', 'פרטי התקשרות'],
  ga: ['Na sonraí a bhailímid', 'Bunúis dhlíthiúla próiseála (GDPR)', 'Conas a úsáidimid do shonraí pearsanta', 'Fianáin agus rianú', 'Comhroinnt sonraí', 'Do chearta', 'Coinneáil sonraí', 'Aistrithe sonraí idirnáisiúnta', 'Slándáil', 'Príobháideachas leanaí', 'Suíomhanna gréasáin tríú páirtí', 'Athruithe ar an bpolasaí seo', 'Faisnéis teagmhála'],
  pl: ['Dane, które zbieramy', 'Podstawy prawne przetwarzania (RODO)', 'Jak wykorzystujemy Twoje dane osobowe', 'Pliki cookie i śledzenie', 'Udostępnianie danych', 'Twoje prawa', 'Przechowywanie danych', 'Międzynarodowe transfery danych', 'Bezpieczeństwo', 'Prywatność dzieci', 'Witryny stron trzecich', 'Zmiany niniejszej polityki', 'Informacje kontaktowe'],
  ko: ['수집하는 데이터', '처리의 법적 근거 (GDPR)', '개인정보 사용 방법', '쿠키 및 추적', '데이터 공유', '귀하의 권리', '데이터 보존', '국제 데이터 이전', '보안', '아동 개인정보', '제3자 웹사이트', '본 정책의 변경', '연락처 정보'],
  no: ['Data vi samler inn', 'Rettslig grunnlag for behandling (GDPR)', 'Hvordan vi bruker dine personopplysninger', 'Informasjonskapsler og sporing', 'Datadeling', 'Dine rettigheter', 'Datalagring', 'Internasjonale dataoverføringer', 'Sikkerhet', 'Barns personvern', 'Tredjeparts nettsteder', 'Endringer i denne policyen', 'Kontaktinformasjon'],
  sv: ['Data vi samlar in', 'Rättsliga grunder för behandling (GDPR)', 'Hur vi använder dina personuppgifter', 'Cookies och spårning', 'Datadelning', 'Dina rättigheter', 'Datalagring', 'Internationella dataöverföringar', 'Säkerhet', 'Barns integritet', 'Tredjepartswebbplatser', 'Ändringar av denna policy', 'Kontaktinformation'],
  tl: ['Data na kinokolekta namin', 'Mga legal na batayan ng pagproseso (GDPR)', 'Paano namin ginagamit ang iyong personal na data', 'Cookies at pagsubaybay', 'Pagbabahagi ng data', 'Iyong mga karapatan', 'Pagpapanatili ng data', 'Internasyonal na paglilipat ng data', 'Seguridad', 'Pribasiya ng mga bata', 'Mga website ng third-party', 'Mga pagbabago sa patakarang ito', 'Impormasyon sa pakikipag-ugnayan'],
  vi: ['Dữ liệu chúng tôi thu thập', 'Cơ sở pháp lý cho xử lý (GDPR)', 'Cách chúng tôi sử dụng dữ liệu cá nhân của bạn', 'Cookie và theo dõi', 'Chia sẻ dữ liệu', 'Quyền của bạn', 'Lưu giữ dữ liệu', 'Chuyển dữ liệu quốc tế', 'Bảo mật', 'Quyền riêng tư của trẻ em', 'Trang web bên thứ ba', 'Thay đổi đối với chính sách này', 'Thông tin liên hệ'],
  fi: ['Keräämämme tiedot', 'Käsittelyn oikeusperusteet (GDPR)', 'Miten käytämme henkilötietojasi', 'Evästeet ja seuranta', 'Tietojen jakaminen', 'Oikeutesi', 'Tietojen säilytys', 'Kansainväliset tiedonsiirrot', 'Turvallisuus', 'Lasten tietosuoja', 'Kolmannen osapuolen verkkosivustot', 'Muutokset tähän käytäntöön', 'Yhteystiedot'],
  ru: ['Какие данные мы собираем', 'Правовые основания обработки (GDPR)', 'Как мы используем ваши персональные данные', 'Файлы cookie и отслеживание', 'Передача данных', 'Ваши права', 'Хранение данных', 'Международная передача данных', 'Безопасность', 'Конфиденциальность детей', 'Сайты третьих лиц', 'Изменения в настоящей политике', 'Контактная информация'],
  cy: ['Data rydym yn ei gasglu', 'Sail gyfreithiol prosesu (GDPR)', 'Sut rydym yn defnyddio eich data personol', 'Cwcis ac olrhain', 'Rhannu data', 'Eich hawliau', 'Cadw data', 'Trosglwyddiadau data rhyngwladol', 'Diogelwch', 'Preifatrwydd plant', 'Gwefannau trydydd parti', 'Newidiadau i’r polisi hwn', 'Gwybodaeth gyswllt'],
  ta: ['நாங்கள் சேகரிக்கும் தரவு', 'செயலாக்கத்தின் சட்ட அடிப்படைகள் (GDPR)', 'உங்கள் தனிப்பட்ட தரவை எவ்வாறு பயன்படுத்துகிறோம்', 'குக்கீகள் மற்றும் கண்காணிப்பு', 'தரவு பகிர்வு', 'உங்கள் உரிமைகள்', 'தரவு வைத்திருத்தல்', 'சர்வதேச தரவு பரிமாற்றம்', 'பாதுகாப்பு', 'குழந்தைகளின் தனியுரிமை', 'மூன்றாம் தரப்பு வலைத்தளங்கள்', 'இந்தக் கொள்கையில் மாற்றங்கள்', 'தொடர்பு தகவல்'],
  mi: ['Ngā raraunga ka kohia e mātou', 'Ngā pūtake ture mō te tukatuka (GDPR)', 'Me pēhea te whakamahi i ō raraunga whaiaro', 'Pihikete me te aroturuki', 'Tiritiri raraunga', 'Ō motika', 'Pupuri raraunga', 'Whakawhitinga raraunga ā-ao', 'Haumarutanga', 'Tūmataitinga tamariki', 'Ngā paetukutuku rōpū tuatoru', 'Ngā panoni ki tēnei kaupapa here', 'Mōhiohio whakapā']
};

const DATE_LABELS = {
  en: { effectiveDate: 'Effective Date', lastUpdated: 'Last Updated' },
  de: { effectiveDate: 'Wirksamkeitsdatum', lastUpdated: 'Zuletzt aktualisiert' },
  fr: { effectiveDate: 'Date d’entrée en vigueur', lastUpdated: 'Dernière mise à jour' },
  es: { effectiveDate: 'Fecha de entrada en vigor', lastUpdated: 'Última actualización' },
  ja: { effectiveDate: '施行日', lastUpdated: '最終更新日' },
  zh: { effectiveDate: '生效日期', lastUpdated: '最后更新' },
  'zh-hant': { effectiveDate: '生效日期', lastUpdated: '最後更新' },
  pt: { effectiveDate: 'Data de vigência', lastUpdated: 'Última atualização' },
  hi: { effectiveDate: 'प्रभावी तिथि', lastUpdated: 'अंतिम अद्यतन' },
  th: { effectiveDate: 'วันที่มีผลบังคับใช้', lastUpdated: 'อัปเดตล่าสุด' },
  ms: { effectiveDate: 'Tarikh berkuat kuasa', lastUpdated: 'Terakhir dikemas kini' },
  nl: { effectiveDate: 'Ingangsdatum', lastUpdated: 'Laatst bijgewerkt' },
  id: { effectiveDate: 'Tanggal berlaku', lastUpdated: 'Terakhir diperbarui' },
  cs: { effectiveDate: 'Datum účinnosti', lastUpdated: 'Naposledy aktualizováno' },
  it: { effectiveDate: 'Data di efficacia', lastUpdated: 'Ultimo aggiornamento' },
  he: { effectiveDate: 'תאריך תחילה', lastUpdated: 'עודכן לאחרונה' },
  ga: { effectiveDate: 'Dáta éifeachta', lastUpdated: 'Nuashonraithe deireanach' },
  pl: { effectiveDate: 'Data wejścia w życie', lastUpdated: 'Ostatnia aktualizacja' },
  ko: { effectiveDate: '시행일', lastUpdated: '최종 업데이트' },
  no: { effectiveDate: 'Ikrafttredelsesdato', lastUpdated: 'Sist oppdatert' },
  sv: { effectiveDate: 'Ikraftträdandedatum', lastUpdated: 'Senast uppdaterad' },
  tl: { effectiveDate: 'Petsa ng Pagkabisa', lastUpdated: 'Huling na-update' },
  vi: { effectiveDate: 'Ngày hiệu lực', lastUpdated: 'Cập nhật lần cuối' },
  fi: { effectiveDate: 'Voimaantulopäivä', lastUpdated: 'Viimeksi päivitetty' },
  ru: { effectiveDate: 'Дата вступления в силу', lastUpdated: 'Последнее обновление' },
  cy: { effectiveDate: 'Dyddiad Dod i Rym', lastUpdated: 'Diweddarwyd ddiwethaf' },
  ta: { effectiveDate: 'அமல்படுத்தும் தேதி', lastUpdated: 'கடைசியாக புதுப்பிக்கப்பட்டது' },
  mi: { effectiveDate: 'Rā mana', lastUpdated: 'Whakahoutanga whakamutunga' }
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

  if (!date || !sectionTitles) {
    throw new Error(`Missing Terms UI translations for language: ${lang}`);
  }

  return {
    effectiveDate: date.effectiveDate,
    lastUpdated: date.lastUpdated,
    sectionTitles,
  };
};

export const getPrivacyUiLabels = (language) => {
  const lang = normalizeLang(language);
  const date = DATE_LABELS[lang];
  const sectionTitles = PRIVACY_TITLES[lang];

  if (!date || !sectionTitles) {
    throw new Error(`Missing Privacy UI translations for language: ${lang}`);
  }

  return {
    effectiveDate: date.effectiveDate,
    lastUpdated: date.lastUpdated,
    sectionTitles,
  };
};

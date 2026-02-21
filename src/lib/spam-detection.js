/**
 * Spam Detection and Email Validation Utilities
 */

// List of blocked email domains (private relays and disposable emails)
const BLOCKED_EMAIL_DOMAINS = [
  'privaterelay.appleid.com',
  'icloud.com.relay', // Apple private relay variations
  'guerrillamail.com',
  'temp-mail.org',
  'throwaway.email',
  '10minutemail.com',
  'mailinator.com',
  'trashmail.com',
  'tempmail.com',
  'yopmail.com',
  'maildrop.cc',
  'getnada.com'
];

// Allowed email providers (major legitimate providers)
const ALLOWED_EMAIL_PROVIDERS = [
  'gmail.com', 'googlemail.com',
  'outlook.com', 'hotmail.com', 'live.com', 'msn.com',
  'yahoo.com', 'yahoo.co.uk', 'yahoo.fr', 'yahoo.de', 'yahoo.it', 'yahoo.es',
  'icloud.com', // Regular iCloud, not private relay
  'protonmail.com', 'proton.me',
  'aol.com',
  'zoho.com',
  'mail.com',
  'gmx.com', 'gmx.net',
  'yandex.com', 'yandex.ru',
  'tutanota.com',
  'fastmail.com',
  'me.com', 'mac.com', // Apple emails (not private relay)
  'qq.com', '163.com', '126.com', 'sina.com', // Chinese providers
  'naver.com', 'daum.net', // Korean providers
  'mail.ru',
  'web.de',
  'orange.fr',
  'free.fr',
  't-online.de',
  'btinternet.com',
  'sky.com',
  'virgin.net',
  'talktalk.net'
];

// Spam/scam keywords - content that typically indicates spam
const SPAM_KEYWORDS = [
  // SEO and website spam
  'seo service', 'search engine optimization', 'improve your ranking',
  'top google ranking', 'rank higher', 'website optimization',
  'increase traffic', 'website design service', 'web design service',
  'redesign your website', 'website redesign', 'web development service',
  'improve your website', 'website improvement', 'digital marketing service',
  'social media marketing', 'guaranteed first page', 'guarantee first page',
  'backlinks', 'link building', 'guest post', 'increase visibility',
  
  // Loan and finance spam
  'loan offer', 'personal loan', 'business loan', 'quick loan',
  'instant loan', 'easy loan', 'loan approval', 'get a loan',
  'credit card offer', 'debt relief', 'refinance', 'mortgage offer',
  'payday loan', 'cash advance', 'financial assistance',
  
  // General e-commerce scams
  'make money online', 'work from home opportunity', 'business opportunity',
  'investment opportunity', 'guaranteed income', 'passive income',
  'dropshipping opportunity', 'become a millionaire', 'get rich quick',
  
  // Other common spam
  'increase sales', 'boost your sales', 'grow your business',
  'we can help you', 'we noticed your website', 'we found your website',
  'we are a company', 'we specialize in', 'we offer services',
  'check out our services', 'visit our website for', 'reply to this email',
  'limited time offer', 'act now', 'special promotion',
  'crypto', 'cryptocurrency', 'bitcoin', 'forex trading',
  'adult content', 'casino', 'gambling',
  
  // Suspicious patterns
  'guarantee', 'guaranteed results', '100% guaranteed',
  'no obligation', 'risk free', 'risk-free', 'free consultation',
  'click here', 'click below', 'unsubscribe',
  
  // Suspicious business patterns
  'outsource', 'offshore', 'cheap labor', 'virtual assistant',
  'lead generation', 'email list', 'bulk email', 'mass email'
];

const SUPPORTED_FORM_LANGUAGES = new Set([
  'en', 'de', 'fr', 'es', 'ja', 'zh', 'zh-hant', 'pt', 'hi', 'th',
  'ms', 'nl', 'id', 'cs', 'it', 'he', 'ga', 'pl', 'ko', 'no',
  'ru', 'sv', 'fi', 'tl', 'vi', 'cy', 'ta', 'mi'
]);

const CAPS_LOCK_UNSUPPORTED_LANGUAGES = new Set([
  'ja', 'ko', 'th', 'zh', 'zh-hant', 'hi', 'he', 'ta'
]);

const SPAM_REJECTION_MESSAGES = {
  en: 'Your submission appears to be spam. If this is a legitimate enquiry, please contact us through alternative channels. We do not accept unsolicited offers for SEO, website design, loans, or similar services.',
  de: 'Ihre Anfrage scheint Spam zu sein. Wenn es sich um eine berechtigte Anfrage handelt, kontaktieren Sie uns bitte über alternative Kanäle. Unaufgeforderte Angebote für SEO, Webdesign, Darlehen oder ähnliche Dienstleistungen akzeptieren wir nicht.',
  fr: 'Votre demande semble être du spam. S\'il s\'agit d\'une demande légitime, veuillez nous contacter via d\'autres canaux. Nous n\'acceptons pas les offres non sollicitées de SEO, de conception de site web, de prêts ou de services similaires.',
  es: 'Su envío parece ser spam. Si se trata de una consulta legítima, póngase en contacto con nosotros a través de canales alternativos. No aceptamos ofertas no solicitadas de SEO, diseño web, préstamos o servicios similares.',
  ja: '送信内容はスパムの可能性があります。正当なお問い合わせの場合は、別の連絡手段でご連絡ください。SEO、Webサイト制作、融資、または類似サービスの営業提案は受け付けておりません。',
  zh: '您的提交内容似乎是垃圾信息。如果这是合法咨询，请通过其他渠道联系我们。我们不接受未经请求的 SEO、网站设计、贷款或类似服务报价。',
  'zh-hant': '您的提交內容似乎是垃圾訊息。如果這是合法查詢，請透過其他渠道聯絡我們。我們不接受未經請求的 SEO、網站設計、貸款或類似服務報價。',
  pt: 'A sua submissão parece ser spam. Se esta for uma consulta legítima, entre em contacto connosco através de canais alternativos. Não aceitamos ofertas não solicitadas de SEO, design de websites, empréstimos ou serviços semelhantes.',
  hi: 'आपका सबमिशन स्पैम प्रतीत होता है। यदि यह एक वैध पूछताछ है, तो कृपया वैकल्पिक माध्यमों से हमसे संपर्क करें। हम SEO, वेबसाइट डिज़ाइन, ऋण या समान सेवाओं के अनचाहे प्रस्ताव स्वीकार नहीं करते हैं।',
  th: 'ข้อความที่คุณส่งดูเหมือนเป็นสแปม หากเป็นคำสอบถามที่ถูกต้อง กรุณาติดต่อเราผ่านช่องทางอื่น เราไม่รับข้อเสนอที่ไม่ได้ร้องขอเกี่ยวกับ SEO การออกแบบเว็บไซต์ เงินกู้ หรือบริการที่คล้ายกัน',
  ms: 'Penghantaran anda kelihatan seperti spam. Jika ini ialah pertanyaan yang sah, sila hubungi kami melalui saluran alternatif. Kami tidak menerima tawaran tanpa diminta untuk SEO, reka bentuk laman web, pinjaman atau perkhidmatan yang serupa.',
  nl: 'Uw inzending lijkt spam te zijn. Als dit een legitieme aanvraag is, neem dan via alternatieve kanalen contact met ons op. Wij accepteren geen ongevraagde aanbiedingen voor SEO, webdesign, leningen of vergelijkbare diensten.',
  id: 'Pengiriman Anda tampaknya merupakan spam. Jika ini adalah pertanyaan yang sah, silakan hubungi kami melalui saluran alternatif. Kami tidak menerima penawaran tanpa diminta untuk SEO, desain situs web, pinjaman, atau layanan serupa.',
  cs: 'Vaše odeslání se jeví jako spam. Pokud jde o legitimní dotaz, kontaktujte nás prosím prostřednictvím alternativních kanálů. Nepřijímáme nevyžádané nabídky SEO, návrhu webu, půjček ani podobných služeb.',
  it: 'La tua richiesta sembra essere spam. Se si tratta di una richiesta legittima, contattaci tramite canali alternativi. Non accettiamo offerte non richieste di SEO, progettazione di siti web, prestiti o servizi simili.',
  he: 'נראה שהפנייה שלך היא ספאם. אם זו פנייה לגיטימית, אנא צור איתנו קשר דרך ערוצים חלופיים. איננו מקבלים הצעות לא רצויות ל-SEO, עיצוב אתרים, הלוואות או שירותים דומים.',
  ga: 'Is cosúil gur turscar atá i d’aighneacht. Más fiosrúchán dlisteanach é seo, déan teagmháil linn trí bhealaí eile. Ní ghlacaimid le tairiscintí gan iarraidh do SEO, dearadh gréasáin, iasachtaí ná seirbhísí comhchosúla.',
  pl: 'Twoje zgłoszenie wygląda na spam. Jeśli jest to legalne zapytanie, skontaktuj się z nami innymi kanałami. Nie akceptujemy niezamówionych ofert SEO, projektowania stron internetowych, pożyczek ani podobnych usług.',
  ko: '제출하신 내용은 스팸으로 보입니다. 정상적인 문의라면 다른 채널을 통해 문의해 주세요. SEO, 웹사이트 디자인, 대출 또는 유사 서비스에 대한 사전 요청 없는 제안은 받지 않습니다.',
  no: 'Innsendingen din ser ut til å være spam. Hvis dette er en legitim forespørsel, vennligst kontakt oss via alternative kanaler. Vi godtar ikke uoppfordrede tilbud om SEO, nettsidedesign, lån eller lignende tjenester.',
  ru: 'Ваше сообщение похоже на спам. Если это законный запрос, пожалуйста, свяжитесь с нами через альтернативные каналы. Мы не принимаем нежелательные предложения по SEO, веб-дизайну, займам или аналогичным услугам.',
  sv: 'Ditt meddelande verkar vara spam. Om detta är en legitim förfrågan, vänligen kontakta oss via alternativa kanaler. Vi accepterar inte oombedda erbjudanden om SEO, webbdesign, lån eller liknande tjänster.',
  fi: 'Lähetyksesi vaikuttaa roskapostilta. Jos kyseessä on oikeutettu tiedustelu, ota meihin yhteyttä vaihtoehtoisten kanavien kautta. Emme hyväksy pyytämättömiä tarjouksia SEO:sta, verkkosivusuunnittelusta, lainoista tai vastaavista palveluista.',
  tl: 'Mukhang spam ang iyong isinumite. Kung lehitimong katanungan ito, mangyaring makipag-ugnayan sa amin sa ibang mga channel. Hindi kami tumatanggap ng hindi hinihinging alok para sa SEO, web design, pautang, o katulad na serbisyo.',
  vi: 'Nội dung bạn gửi có vẻ là thư rác. Nếu đây là yêu cầu hợp lệ, vui lòng liên hệ với chúng tôi qua các kênh khác. Chúng tôi không chấp nhận các đề nghị không được yêu cầu về SEO, thiết kế website, khoản vay hoặc các dịch vụ tương tự.',
  cy: 'Mae eich cyflwyniad yn ymddangos fel sbam. Os yw hwn yn ymholiad dilys, cysylltwch â ni drwy sianeli amgen. Nid ydym yn derbyn cynigion diwahoddiad ar gyfer SEO, dylunio gwefan, benthyciadau na gwasanaethau tebyg.',
  ta: 'உங்கள் சமர்ப்பிப்பு ஸ்பாம் போல தெரிகிறது. இது ஒரு செல்லத்தக்க விசாரணையாக இருந்தால், மாற்று வழிகள் மூலம் எங்களை தொடர்பு கொள்ளவும். SEO, இணையதள வடிவமைப்பு, கடன் அல்லது இதே போன்ற சேவைகளுக்கான கோரப்படாத சலுகைகளை நாம் ஏற்கவில்லை.',
  mi: 'E āhua pāme ana tō tukunga. Mēnā he pātai tika tēnei, tēnā whakapā mai mā ētahi atu ara. Kāore mātou e whakaae ki ngā tuku kāore i tonoa mō te SEO, hoahoa paetukutuku, pūtea taurewa, ratonga ōrite rānei.'
};

const CAPS_LOCK_WARNING_MESSAGES = {
  en: 'Please be respectful when talking to us and do not type in all caps lock. Kindly rewrite your message in a polite tone using normal sentence case.',
  de: 'Bitte bleiben Sie respektvoll, wenn Sie mit uns sprechen, und schreiben Sie nicht durchgehend in GROSSBUCHSTABEN. Formulieren Sie Ihre Nachricht bitte höflich und in normaler Groß- und Kleinschreibung neu.',
  fr: 'Merci de rester respectueux lorsque vous nous contactez et de ne pas écrire entièrement en MAJUSCULES. Veuillez reformuler votre message poliment avec une casse normale.',
  es: 'Por favor, sea respetuoso al hablar con nosotros y no escriba todo en MAYÚSCULAS. Reescriba su mensaje con un tono educado y con uso normal de mayúsculas y minúsculas.',
  ja: 'お問い合わせの際は敬意をもってご連絡ください。すべて大文字での入力はお控えいただき、通常の文章表記で丁寧に書き直してください。',
  zh: '请在与我们沟通时保持尊重，不要全部使用大写字母输入。请使用礼貌语气并按正常书写格式重新填写您的信息。',
  'zh-hant': '請在與我們溝通時保持尊重，不要全部使用大寫字母輸入。請使用禮貌語氣並以正常書寫格式重新填寫您的訊息。',
  pt: 'Por favor, seja respeitoso ao falar connosco e não escreva tudo em MAIÚSCULAS. Reescreva a sua mensagem com um tom educado e com capitalização normal.',
  hi: 'कृपया हमसे बात करते समय सम्मानजनक रहें और पूरा संदेश कैप्स लॉक में न लिखें। कृपया अपना संदेश विनम्र भाषा और सामान्य वाक्य लेखन में दोबारा लिखें।',
  th: 'โปรดให้เกียรติเมื่อสื่อสารกับเรา และอย่าพิมพ์ข้อความทั้งหมดเป็นตัวพิมพ์ใหญ่ กรุณาเขียนข้อความใหม่ด้วยถ้อยคำสุภาพและรูปแบบประโยคปกติ',
  ms: 'Sila hormati kami semasa berkomunikasi dan jangan menaip semuanya dalam HURUF BESAR. Sila tulis semula mesej anda dengan nada sopan dan penggunaan huruf biasa.',
  nl: 'Wees respectvol wanneer u met ons communiceert en schrijf niet alles in HOOFDLETTERS. Schrijf uw bericht opnieuw in een beleefde toon met normale hoofdletters en kleine letters.',
  id: 'Harap bersikap sopan saat berbicara dengan kami dan jangan mengetik seluruh pesan dengan HURUF KAPITAL. Mohon tulis ulang pesan Anda dengan nada yang santun dan penulisan huruf normal.',
  cs: 'Prosíme, buďte při komunikaci s námi uctiví a nepište vše VELKÝMI PÍSMENY. Přepište prosím zprávu zdvořile a s běžným použitím velkých a malých písmen.',
  it: 'Ti preghiamo di essere rispettoso quando ci contatti e di non scrivere tutto in MAIUSCOLO. Riscrivi il messaggio con un tono cortese e con la normale combinazione di maiuscole e minuscole.',
  he: 'אנא שמרו על כבוד בעת הפנייה אלינו ואל תכתבו את כל ההודעה באותיות גדולות. אנא נסחו מחדש את ההודעה בניסוח מנומס ובכתיבה רגילה.',
  ga: 'Bí measúil, le do thoil, agus tú ag labhairt linn agus ná clóscríobh gach rud i gCEANNLITREACHA. Athscríobh do theachtaireacht go béasach i ngnáthfhormáid litreacha, le do thoil.',
  pl: 'Prosimy o zachowanie szacunku podczas kontaktu z nami i niepisanie całej wiadomości WIELKIMI LITERAMI. Prosimy przepisać wiadomość uprzejmym tonem, używając normalnej pisowni.',
  ko: '문의 시에는 존중하는 표현을 사용해 주시고 전체를 대문자로 입력하지 말아 주세요. 정중한 어조와 일반적인 문장 형태로 다시 작성해 주세요.',
  no: 'Vennligst vær respektfull når du snakker med oss, og ikke skriv hele meldingen med STORE BOKSTAVER. Skriv meldingen på nytt i en høflig tone med normal bruk av store og små bokstaver.',
  ru: 'Пожалуйста, проявляйте уважение при обращении к нам и не пишите всё ЗАГЛАВНЫМИ БУКВАМИ. Перепишите сообщение в вежливом тоне с обычным регистром.',
  sv: 'Var vänlig och respektfull när du skriver till oss och skriv inte hela meddelandet med VERSALER. Skriv om meddelandet i en artig ton med normal användning av stora och små bokstäver.',
  fi: 'Olethan kunnioittava viestiessäsi kanssamme etkä kirjoita koko viestiä SUURAAKKOSILLA. Kirjoita viesti uudelleen kohteliaalla sävyllä normaalilla kirjainkoolla.',
  tl: 'Pakiusap, maging magalang sa pakikipag-usap sa amin at huwag i-type ang buong mensahe sa ALL CAPS. Pakisulat muli ang iyong mensahe sa magalang na tono gamit ang normal na malaking at maliit na titik.',
  vi: 'Vui lòng tôn trọng khi liên hệ với chúng tôi và không nhập toàn bộ bằng CHỮ IN HOA. Hãy viết lại nội dung với giọng điệu lịch sự và cách viết hoa/thường bình thường.',
  cy: 'Byddwch yn barchus wrth siarad â ni a pheidiwch â theipio popeth mewn PRIFLYTHRENNAU. Ailysgrifennwch eich neges mewn naws gwrtais gan ddefnyddio priflythrennau a llythrennau bach arferol.',
  ta: 'எங்களுடன் தொடர்பு கொள்ளும் போது மரியாதையாக இருங்கள்; முழு செய்தியையும் பெரிய எழுத்துகளில் டைப் செய்ய வேண்டாம். தயவுசெய்து உங்கள் செய்தியை மரியாதையான சொற்களுடன் சாதாரண எழுத்து முறையில் மீண்டும் எழுதுங்கள்.',
  mi: 'Tēnā, kia whakaute mai i a koe e kōrero ana ki a mātou, ā, kaua e pato katoa i ngā pūmatua. Tuhia anō tō karere i runga i te reo ngākau pai me te whakamahi i te pūmatua me te pūriki i te āhua noa.'
};

const SCHOOL_EMAIL_WARNING_MESSAGES = {
  en: 'You appear to be using a school email address. If you graduate or lose access later, you may not receive our future emails. Please switch to a long-term personal email when possible.',
  de: 'Sie verwenden offenbar eine Schul- oder Hochschul-E-Mail-Adresse. Wenn Sie Ihren Abschluss machen oder später den Zugriff verlieren, erhalten Sie unsere künftigen E-Mails möglicherweise nicht. Bitte wechseln Sie nach Möglichkeit zu einer langfristig genutzten persönlichen E-Mail-Adresse.',
  fr: 'Vous semblez utiliser une adresse e-mail scolaire. Si vous êtes diplômé(e) ou perdez l’accès plus tard, vous pourriez ne plus recevoir nos futurs e-mails. Veuillez utiliser, si possible, une adresse e-mail personnelle à long terme.',
  es: 'Parece que está usando un correo electrónico escolar. Si se gradúa o pierde el acceso más adelante, es posible que no reciba nuestros correos futuros. Cuando sea posible, cambie a un correo personal de uso a largo plazo.',
  ja: '学校のメールアドレスを使用しているようです。卒業したり後でアクセスできなくなったりすると、今後の当社メールを受信できない可能性があります。可能であれば、長期的に使える個人メールアドレスへの変更をご検討ください。',
  zh: '您似乎正在使用学校邮箱。如果您毕业或之后失去该邮箱访问权限，可能无法收到我们后续邮件。建议您尽量改用可长期使用的个人邮箱。',
  'zh-hant': '您似乎正在使用學校郵箱。如果您畢業或之後失去該郵箱存取權限，可能無法收到我們後續郵件。建議您盡量改用可長期使用的個人郵箱。',
  pt: 'Parece que está a usar um e-mail escolar. Se concluir os estudos ou perder o acesso mais tarde, poderá deixar de receber os nossos e-mails futuros. Sempre que possível, mude para um e-mail pessoal de utilização a longo prazo.',
  hi: 'लगता है आप स्कूल/कॉलेज का ईमेल पता उपयोग कर रहे हैं। यदि आप स्नातक हो जाते हैं या बाद में इस ईमेल का एक्सेस खो देते हैं, तो हो सकता है कि आपको हमारे भविष्य के ईमेल न मिलें। कृपया संभव हो तो लंबे समय तक उपयोग होने वाला व्यक्तिगत ईमेल इस्तेमाल करें।',
  th: 'ดูเหมือนว่าคุณกำลังใช้อีเมลของสถาบันการศึกษา หากคุณเรียนจบหรือสูญเสียสิทธิ์การเข้าถึงในภายหลัง คุณอาจไม่ได้รับอีเมลจากเราในอนาคต กรุณาเปลี่ยนเป็นอีเมลส่วนตัวที่ใช้งานระยะยาวเมื่อเป็นไปได้',
  ms: 'Anda nampaknya menggunakan alamat e-mel sekolah. Jika anda tamat pengajian atau kehilangan akses kemudian, anda mungkin tidak menerima e-mel kami pada masa hadapan. Sila tukar kepada e-mel peribadi jangka panjang jika boleh.',
  nl: 'U lijkt een school-e-mailadres te gebruiken. Als u afstudeert of later de toegang verliest, ontvangt u mogelijk onze toekomstige e-mails niet. Gebruik indien mogelijk een persoonlijk e-mailadres voor langdurig gebruik.',
  id: 'Anda tampaknya menggunakan alamat email sekolah. Jika Anda lulus atau kehilangan akses nanti, Anda mungkin tidak akan menerima email kami di masa mendatang. Jika memungkinkan, gunakan email pribadi untuk jangka panjang.',
  cs: 'Zdá se, že používáte školní e-mailovou adresu. Pokud absolvujete nebo později ztratíte přístup, nemusíte od nás v budoucnu dostávat e-maily. Pokud je to možné, použijte prosím dlouhodobou osobní e-mailovou adresu.',
  it: 'Sembra che tu stia usando un indirizzo e-mail scolastico. Se ti diplomi o perdi l’accesso in futuro, potresti non ricevere le nostre e-mail successive. Se possibile, passa a un indirizzo e-mail personale a lungo termine.',
  he: 'נראה שאתה משתמש בכתובת דוא"ל של מוסד לימודים. אם תסיים לימודים או תאבד גישה בהמשך, ייתכן שלא תקבל את המיילים העתידיים שלנו. אם אפשר, מומלץ לעבור לכתובת דוא"ל אישית לטווח ארוך.',
  ga: 'Is cosúil go bhfuil tú ag úsáid seoladh ríomhphoist scoile. Má bhainfidh tú céim amach nó má chailleann tú rochtain níos déanaí, seans nach bhfaighidh tú ár ríomhphoist amach anseo. Más féidir, úsáid seoladh ríomhphoist pearsanta fadtéarmach.',
  pl: 'Wygląda na to, że używasz szkolnego adresu e-mail. Jeśli ukończysz szkołę lub później utracisz dostęp, możesz nie otrzymywać naszych przyszłych wiadomości. W miarę możliwości używaj długoterminowego prywatnego adresu e-mail.',
  ko: '학교 이메일 주소를 사용 중인 것으로 보입니다. 졸업하거나 나중에 접근 권한을 잃으면 향후 저희 이메일을 받지 못할 수 있습니다. 가능하면 장기간 사용할 수 있는 개인 이메일로 변경해 주세요.',
  no: 'Det ser ut til at du bruker en skole-e-postadresse. Hvis du fullfører studiene eller mister tilgang senere, kan det hende du ikke mottar våre fremtidige e-poster. Bytt om mulig til en personlig e-postadresse for langsiktig bruk.',
  ru: 'Похоже, вы используете учебный адрес электронной почты. Если вы окончите учебное заведение или позже потеряете доступ, вы можете не получать наши будущие письма. По возможности используйте личный e-mail для долгосрочного использования.',
  sv: 'Det verkar som att du använder en skol-e-postadress. Om du tar examen eller förlorar åtkomst senare kan du missa våra framtida e-postmeddelanden. Byt gärna till en personlig e-postadress för långsiktig användning när det är möjligt.',
  fi: 'Näyttää siltä, että käytät oppilaitoksen sähköpostiosoitetta. Jos valmistut tai menetät pääsyn myöhemmin, et välttämättä saa tulevia sähköpostejamme. Vaihda mahdollisuuksien mukaan pitkäaikaisesti käytettävään henkilökohtaiseen sähköpostiin.',
  tl: 'Mukhang gumagamit ka ng school email address. Kapag nakapagtapos ka o nawalan ka ng access sa hinaharap, maaaring hindi mo matanggap ang aming mga susunod na email. Kung maaari, gumamit ng pangmatagalang personal na email address.',
  vi: 'Bạn có vẻ đang sử dụng email của trường học. Nếu bạn tốt nghiệp hoặc mất quyền truy cập sau này, bạn có thể không nhận được email của chúng tôi trong tương lai. Khi có thể, vui lòng chuyển sang email cá nhân dùng lâu dài.',
  cy: 'Mae’n ymddangos eich bod yn defnyddio cyfeiriad e-bost ysgol. Os byddwch yn graddio neu’n colli mynediad yn nes ymlaen, efallai na fyddwch yn derbyn ein negeseuon e-bost yn y dyfodol. Pan fo’n bosibl, defnyddiwch gyfeiriad e-bost personol hirdymor.',
  ta: 'நீங்கள் கல்வி நிறுவன மின்னஞ்சல் முகவரியை பயன்படுத்துகிறீர்கள் போல தெரிகிறது. நீங்கள் படிப்பு முடித்துவிட்டால் அல்லது பின்னர் அணுகலை இழந்தால், எங்கள் எதிர்கால மின்னஞ்சல்கள் உங்களுக்கு வராமல் போகலாம். முடிந்தால் நீண்டகாலம் பயன்படுத்தக்கூடிய தனிப்பட்ட மின்னஞ்சல் முகவரிக்கு மாற்றவும்.',
  mi: 'Te āhua nei kei te whakamahi koe i tētahi wāhitau īmēra kura. Mēnā ka puta koe i te kura, ka ngaro rānei tō urunga ā muri ake, tērā pea kāore koe e whiwhi i ā mātou īmēra a muri ake nei. Mēnā ka taea, whakamahia he wāhitau īmēra whaiaro mō te wā roa.'
};

function getSpamRejectionMessage(language) {
  const normalized = normalizeLanguageCode(language || 'en');
  return SPAM_REJECTION_MESSAGES[normalized] || SPAM_REJECTION_MESSAGES.en;
}

function getCapsLockWarningMessage(language) {
  const normalized = normalizeLanguageCode(language || 'en');
  return CAPS_LOCK_WARNING_MESSAGES[normalized] || CAPS_LOCK_WARNING_MESSAGES.en;
}

export function getSchoolEmailWarningMessage(language) {
  const normalized = normalizeLanguageCode(language || 'en');
  return SCHOOL_EMAIL_WARNING_MESSAGES[normalized] || SCHOOL_EMAIL_WARNING_MESSAGES.en;
}

export function isSchoolEmailDomain(domain) {
  const value = (domain || '').toLowerCase();
  return /(^|\.)edu(\.[a-z]{2})?$/.test(value) || /(^|\.)ac\.[a-z]{2}$/.test(value);
}

function detectExcessiveCapsLockMessage(message, language) {
  const normalizedLanguage = normalizeLanguageCode(language || 'en');

  if (CAPS_LOCK_UNSUPPORTED_LANGUAGES.has(normalizedLanguage)) {
    return { triggered: false };
  }

  const text = typeof message === 'string' ? message : '';
  const letters = text.match(/[A-Za-z]/g) || [];
  const uppercase = text.match(/[A-Z]/g) || [];

  if (uppercase.length < 50) {
    return { triggered: false };
  }

  if (letters.length === 0) {
    return { triggered: false };
  }

  const uppercaseRatio = uppercase.length / letters.length;
  if (uppercaseRatio >= 0.9) {
    return { triggered: true, uppercaseCount: uppercase.length, uppercaseRatio };
  }

  return { triggered: false };
}

function normalizeLanguageCode(language) {
  const code = (language || 'en').toLowerCase();
  if (code === 'zh-cn' || code === 'zh-hans') return 'zh';
  if (code === 'zh-tw' || code === 'zh-hk' || code === 'zh-hant') return 'zh-hant';
  return code;
}

function normalizeDetectedLanguageCode(language) {
  const code = (language || '').toLowerCase();
  if (!code) return '';

  if (code.startsWith('zh')) {
    if (code.includes('hant') || code.includes('tw') || code.includes('hk')) {
      return 'zh-hant';
    }
    return 'zh';
  }

  if (code === 'fil') return 'tl';
  if (code === 'iw') return 'he';
  if (code === 'nb' || code === 'nn') return 'no';

  return code.split('-')[0];
}

function containsCommonEnglishWords(text) {
  if (!text || typeof text !== 'string') return false;

  const sanitized = text
    .replace(/https?:\/\/\S+/gi, ' ')
    .replace(/\bwww\.\S+/gi, ' ')
    .replace(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi, ' ')
    .replace(/\b[A-Z]{2,}\d+[A-Z0-9-]*\b/g, ' ')
    .toLowerCase();

  const englishWordPattern = /\b(please|thanks|thank\s+you|website|seo|keyword|keywords|ranking|google|search\s+engine|loan|loans|shipping|delivery|parcel|package|contact\s+us|reply|audit|backlinks|web\s+design|service|services)\b/gi;
  return englishWordPattern.test(sanitized);
}

function doesMessageLanguageMatchSelection(selectedLanguage, detectedLanguage) {
  const selected = normalizeLanguageCode(selectedLanguage || 'en');
  const detected = normalizeDetectedLanguageCode(detectedLanguage || selected);

  return selected === detected;
}

async function translateToEnglish(text) {
  if (!text || !text.trim()) {
    return { translatedText: '', detectedLanguage: '' };
  }

  const endpoint = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(text)}`;
  const response = await fetch(endpoint, { cache: 'no-store' });

  if (!response.ok) {
    throw new Error(`Translation request failed with status ${response.status}`);
  }

  const payload = await response.json();
  if (!Array.isArray(payload) || !Array.isArray(payload[0])) {
    return { translatedText: text, detectedLanguage: '' };
  }

  return {
    translatedText: payload[0].map(part => part?.[0] || '').join('') || text,
    detectedLanguage: normalizeDetectedLanguageCode(payload[2] || '')
  };
}

/**
 * Validates email address format and domain
 * @param {string} email - Email address to validate
 * @param {string} language - Selected language code for warning localization
 * @returns {Object} - { valid: boolean, reason: string, warning: string }
 */
export function validateEmail(email, language = 'en') {
  if (!email || typeof email !== 'string') {
    return { valid: false, reason: 'Email is required', warning: '' };
  }

  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, reason: 'Invalid email format', warning: '' };
  }

  // Extract domain
  const domain = email.toLowerCase().split('@')[1];

  // Check for blocked domains (private relay, etc.)
  if (BLOCKED_EMAIL_DOMAINS.some(blocked => domain.includes(blocked))) {
    return { 
      valid: false, 
      reason: 'Private relay and disposable email addresses are not accepted. Please use a valid email address from a recognized provider (Gmail, Outlook, Yahoo, etc.)',
      warning: ''
    };
  }

  // Check if domain is from allowed providers
  const isAllowed = ALLOWED_EMAIL_PROVIDERS.some(provider => 
    domain === provider || domain.endsWith('.' + provider)
  );

  if (!isAllowed) {
    // Allow some flexibility for corporate/custom domains
    // Check if it looks like a legitimate domain (has proper TLD)
    const validTLD = /\.(com|net|org|edu|gov|co\.uk|co|io|me|us|ca|au|de|fr|it|es|nl|be|ch|at|se|no|dk|fi|jp|cn|kr|sg|my|th|vn|in|br|mx|ar|cl|za|nz|ie|pt|pl|cz|gr|ru|ua|il|ae|sa|hk|tw)$/i;
    
    if (!validTLD.test(domain)) {
      return { 
        valid: false, 
        reason: 'Please use an email from a recognized provider (Gmail, Outlook, Yahoo, etc.) or a legitimate custom domain',
        warning: ''
      };
    }
    
    // Allow non-standard but valid custom domains
  }

  const warning = isSchoolEmailDomain(domain)
    ? getSchoolEmailWarningMessage(language)
    : '';

  return { valid: true, reason: '', warning };
}

/**
 * Detects spam/scam content in message
 * @param {string} message - Message text to check
 * @param {string} name - Name field to check
 * @param {string} email - Email to check
 * @returns {Object} - { isSpam: boolean, reason: string, confidence: string }
 */
export function detectSpam(message, name = '', email = '') {
  if (!message && !name && !email) {
    return { isSpam: false, reason: '', confidence: 'low' };
  }

  const combinedText = `${name} ${email} ${message}`.toLowerCase();
  
  // Check for spam keywords
  const foundKeywords = SPAM_KEYWORDS.filter(keyword => 
    combinedText.includes(keyword.toLowerCase())
  );

  if (foundKeywords.length > 0) {
    const confidence = foundKeywords.length > 2 ? 'high' : foundKeywords.length > 1 ? 'medium' : 'low';
    return {
      isSpam: true,
      reason: `Detected spam keywords: ${foundKeywords.slice(0, 3).join(', ')}`,
      confidence,
      keywords: foundKeywords
    };
  }

  const seoScamPatterns = [
    /\bseo\b/gi,
    /\b(google|search engine)\b[^.!?\n]{0,80}\b(first page|top\s*\d+|top three|ranking)\b/gi,
    /\b(backlink|link building|high[-\s]?authority links?|external links?)\b/gi,
    /\b(website audit|free audit|keyword analysis|ranking gaps?)\b/gi,
    /\bsubmit\b[^.!?\n]{0,80}\b(director(?:y|ies))\b/gi,
    /\b(reply with|send us)\b[^.!?\n]{0,80}\b(website|url|target keywords?)\b/gi,
    /\blimited time\b/gi
  ];

  const matchedSeoPatterns = seoScamPatterns.reduce((count, pattern) => {
    const matches = combinedText.match(pattern);
    return matches ? count + 1 : count;
  }, 0);

  if (matchedSeoPatterns >= 2) {
    return {
      isSpam: true,
      reason: 'Detected suspicious SEO outreach pattern',
      confidence: matchedSeoPatterns >= 4 ? 'high' : 'medium'
    };
  }

  // Check for suspicious patterns
  const suspiciousPatterns = [
    /https?:\/\//gi, // Multiple URLs
    /\b(call|text|whatsapp|telegram)\s+(me|us)?\s*:?\s*\+?\d{10,}/gi, // Phone numbers
    /click\s+here/gi,
    /\b(www\.)[a-z0-9-]+\.[a-z]{2,}/gi, // URLs without http
  ];

  let suspiciousMatches = 0;
  for (const pattern of suspiciousPatterns) {
    const matches = combinedText.match(pattern);
    if (matches) {
      suspiciousMatches += matches.length;
    }
  }

  if (suspiciousMatches >= 3) {
    return {
      isSpam: true,
      reason: 'Message contains suspicious patterns (multiple URLs/phone numbers)',
      confidence: 'medium'
    };
  }

  // Check for all caps (common in spam)
  if (message.length > 50) {
    const capsRatio = (message.match(/[A-Z]/g) || []).length / message.length;
    if (capsRatio > 0.5) {
      return {
        isSpam: true,
        reason: 'Excessive use of capital letters',
        confidence: 'low'
      };
    }
  }

  return { isSpam: false, reason: '', confidence: 'low' };
}

/**
 * Complete validation for contact form submission
 * @param {Object} data - Form data
 * @returns {Object} - { valid: boolean, error: string, translatedMessage?: string, sourceLanguage?: string, warning?: string }
 */
export async function validateContactSubmission(data) {
  const { name, email, message, enquiryType, language } = data;
  const normalizedRequestedLanguage = normalizeLanguageCode(language || 'en');
  const sourceLanguage = SUPPORTED_FORM_LANGUAGES.has(normalizedRequestedLanguage)
    ? normalizedRequestedLanguage
    : 'en';

  // Validate email
  const emailValidation = validateEmail(email, sourceLanguage);
  if (!emailValidation.valid) {
    return { valid: false, error: emailValidation.reason };
  }

  const warning = emailValidation.warning || '';

  // Check for spam if message exists
  if (message) {
    let translatedMessage = message;
    let detectedMessageLanguage = sourceLanguage;

    try {
      const translationResult = await translateToEnglish(message);
      translatedMessage = translationResult.translatedText || message;
      detectedMessageLanguage = translationResult.detectedLanguage || sourceLanguage;
    } catch (translationError) {
      console.error('Language verification failed:', translationError);
      return {
        valid: false,
        error: 'Unable to verify message language right now. Please try again shortly.'
      };
    }

    if (!doesMessageLanguageMatchSelection(sourceLanguage, detectedMessageLanguage)) {
      return {
        valid: false,
        error: 'Please write your message only in the language you selected in the form.'
      };
    }

    const capsLockCheck = detectExcessiveCapsLockMessage(message, sourceLanguage);
    if (capsLockCheck.triggered) {
      return {
        valid: false,
        error: getCapsLockWarningMessage(sourceLanguage)
      };
    }

    if (sourceLanguage !== 'en' && containsCommonEnglishWords(message)) {
      return {
        valid: false,
        error: 'Please avoid English words when a non-English language is selected.'
      };
    }

    const spamCheckOriginal = detectSpam(message, name, email);
    const spamCheckTranslated = translatedMessage !== message
      ? detectSpam(translatedMessage, name, email)
      : { isSpam: false, confidence: 'low' };

    const isSpam =
      (spamCheckOriginal.isSpam && spamCheckOriginal.confidence !== 'low') ||
      (spamCheckTranslated.isSpam && spamCheckTranslated.confidence !== 'low') ||
      (translatedMessage !== message && spamCheckTranslated.isSpam);

    if (isSpam) {
      return {
        valid: false,
        error: getSpamRejectionMessage(sourceLanguage)
      };
    }

    return {
      valid: true,
      error: '',
      translatedMessage,
      sourceLanguage,
      warning
    };
  }

  return { valid: true, error: '', translatedMessage: '', sourceLanguage, warning };
}

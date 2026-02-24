'use client';

import React from "react";
import "../../App.css";
import { useLanguage } from "../../LanguageContext";
import { Navigation } from "../../components/Navigation";

const confirmationFaqTranslations = {
  en: {
    question: "What if I didn't receive my confirmation email?",
    answer: "1. Check your spam/junk folder — automated messages are sometimes filtered.\n2. Verify the email address you used at checkout; a typo can prevent delivery.\n3. If the address is correct and the email is still missing, contact us with your order number and the email address (or phone number) you used. We can resend the confirmation or provide the order details manually.\n\nYou can also go to https://rhythmnexus.org/track-your-item and use Search by Email or Phone to find your order from the confirmation email."
  },
  de: {
    question: "Was ist, wenn ich meine Bestätigungs-E-Mail nicht erhalten habe?",
    answer: "1. Prüfen Sie Ihren Spam-/Junk-Ordner — automatisierte Nachrichten werden manchmal gefiltert.\n2. Prüfen Sie die E-Mail-Adresse, die Sie beim Checkout verwendet haben; ein Tippfehler kann die Zustellung verhindern.\n3. Wenn die Adresse korrekt ist und die E-Mail weiterhin fehlt, kontaktieren Sie uns mit Ihrer Bestellnummer und der verwendeten E-Mail-Adresse (oder Telefonnummer). Wir können die Bestätigung erneut senden oder die Bestelldaten manuell bereitstellen.\n\nSie können auch https://rhythmnexus.org/track-your-item aufrufen und unter Search by Email or Phone nach Ihrer Bestellung suchen."
  },
  fr: {
    question: "Que faire si je n'ai pas reçu mon e-mail de confirmation ?",
    answer: "1. Vérifiez votre dossier spam/indésirables — les messages automatiques sont parfois filtrés.\n2. Vérifiez l'adresse e-mail utilisée lors du paiement ; une faute de frappe peut empêcher la livraison.\n3. Si l'adresse est correcte et que l'e-mail manque toujours, contactez-nous avec votre numéro de commande et l'adresse e-mail (ou le numéro de téléphone) utilisée. Nous pouvons renvoyer la confirmation ou fournir manuellement les détails de la commande.\n\nVous pouvez aussi aller sur https://rhythmnexus.org/track-your-item et utiliser Search by Email or Phone pour retrouver votre commande."
  },
  es: {
    question: "¿Qué pasa si no recibí mi correo de confirmación?",
    answer: "1. Revisa tu carpeta de spam/correo no deseado — los mensajes automáticos a veces se filtran.\n2. Verifica el correo electrónico que usaste al pagar; un error tipográfico puede impedir la entrega.\n3. Si la dirección es correcta y el correo sigue sin aparecer, contáctanos con tu número de pedido y el correo (o número de teléfono) que usaste. Podemos reenviar la confirmación o proporcionarte los detalles del pedido manualmente.\n\nTambién puedes ir a https://rhythmnexus.org/track-your-item y usar Search by Email or Phone para encontrar tu pedido."
  },
  ja: {
    question: "確認メールが届かない場合はどうすればよいですか？",
    answer: "1. 迷惑メールフォルダを確認してください — 自動送信メールはフィルタされることがあります。\n2. チェックアウト時に入力したメールアドレスを確認してください。入力ミスがあると配信されません。\n3. アドレスが正しく、メールが見つからない場合は、注文番号と使用したメールアドレス（または電話番号）を添えてご連絡ください。確認メールの再送、または注文情報を手動でご案内できます。\n\nhttps://rhythmnexus.org/track-your-item にアクセスし、Search by Email or Phone を使って注文を検索することもできます。"
  },
  zh: {
    question: "如果我没有收到确认邮件怎么办？",
    answer: "1. 请检查垃圾邮件/广告邮件文件夹——自动邮件有时会被过滤。\n2. 请核对您结账时填写的邮箱地址；拼写错误可能导致无法送达。\n3. 如果地址正确但仍未收到邮件，请提供订单号以及您使用的邮箱地址（或电话号码）联系我们。我们可以重新发送确认邮件，或手动提供订单详情。\n\n您也可以前往 https://rhythmnexus.org/track-your-item ，使用 Search by Email or Phone 来查找您的订单。"
  },
  "zh-hant": {
    question: "如果我沒有收到確認電子郵件怎麼辦？",
    answer: "1. 請先檢查垃圾郵件/垃圾信件資料夾——自動郵件有時會被過濾。\n2. 請確認您結帳時使用的電子郵件地址；拼字錯誤可能導致無法送達。\n3. 若地址正確但仍未收到郵件，請提供訂單編號以及您使用的電子郵件地址（或電話號碼）聯絡我們。我們可重新寄送確認信，或手動提供訂單資訊。\n\n您也可以前往 https://rhythmnexus.org/track-your-item ，使用 Search by Email or Phone 來查詢您的訂單。"
  },
  pt: {
    question: "E se eu não recebi meu e-mail de confirmação?",
    answer: "1. Verifique sua pasta de spam/lixo eletrônico — mensagens automáticas às vezes são filtradas.\n2. Verifique o endereço de e-mail usado no checkout; um erro de digitação pode impedir a entrega.\n3. Se o endereço estiver correto e o e-mail ainda não aparecer, entre em contato conosco com seu número do pedido e o e-mail (ou telefone) usado. Podemos reenviar a confirmação ou fornecer os detalhes manualmente.\n\nVocê também pode acessar https://rhythmnexus.org/track-your-item e usar Search by Email or Phone para localizar seu pedido."
  },
  hi: {
    question: "अगर मुझे पुष्टि ईमेल नहीं मिला तो क्या करूं?",
    answer: "1. अपना स्पैम/जंक फ़ोल्डर जांचें — स्वचालित संदेश कभी-कभी फ़िल्टर हो जाते हैं।\n2. चेकआउट पर इस्तेमाल किया गया ईमेल पता सत्यापित करें; टाइपो होने पर डिलीवरी नहीं हो सकती।\n3. अगर पता सही है और ईमेल फिर भी नहीं मिला, तो अपना ऑर्डर नंबर और उपयोग किया गया ईमेल पता (या फोन नंबर) देकर हमसे संपर्क करें। हम पुष्टि ईमेल दोबारा भेज सकते हैं या ऑर्डर विवरण मैन्युअली दे सकते हैं।\n\nआप https://rhythmnexus.org/track-your-item पर जाकर Search by Email or Phone से अपना ऑर्डर भी खोज सकते हैं।"
  },
  th: {
    question: "หากฉันไม่ได้รับอีเมลยืนยันคำสั่งซื้อ ต้องทำอย่างไร?",
    answer: "1. ตรวจสอบโฟลเดอร์สแปม/ขยะ — ข้อความอัตโนมัติอาจถูกกรองได้\n2. ตรวจสอบอีเมลที่ใช้ตอนชำระเงินให้ถูกต้อง; หากพิมพ์ผิดอาจทำให้ไม่ได้รับอีเมล\n3. หากอีเมลถูกต้องแต่ยังไม่พบ ให้ติดต่อเราพร้อมเลขคำสั่งซื้อและอีเมล (หรือเบอร์โทร) ที่ใช้ เราสามารถส่งอีเมลยืนยันใหม่หรือให้รายละเอียดคำสั่งซื้อด้วยตนเองได้\n\nคุณยังสามารถไปที่ https://rhythmnexus.org/track-your-item และใช้ Search by Email or Phone เพื่อค้นหาคำสั่งซื้อได้"
  },
  ms: {
    question: "Bagaimana jika saya tidak menerima e-mel pengesahan saya?",
    answer: "1. Semak folder spam/junk anda — mesej automatik kadangkala ditapis.\n2. Sahkan alamat e-mel yang anda gunakan semasa checkout; kesilapan taip boleh menghalang penghantaran.\n3. Jika alamat betul tetapi e-mel masih tiada, hubungi kami dengan nombor pesanan dan alamat e-mel (atau nombor telefon) yang digunakan. Kami boleh hantar semula pengesahan atau berikan butiran pesanan secara manual.\n\nAnda juga boleh pergi ke https://rhythmnexus.org/track-your-item dan gunakan Search by Email or Phone untuk mencari pesanan anda."
  },
  nl: {
    question: "Wat als ik mijn bevestigingsmail niet heb ontvangen?",
    answer: "1. Controleer je spam-/ongewenste map — automatische berichten worden soms gefilterd.\n2. Controleer het e-mailadres dat je bij het afrekenen hebt gebruikt; een typefout kan bezorging voorkomen.\n3. Als het adres correct is en de e-mail nog steeds ontbreekt, neem contact met ons op met je bestelnummer en het gebruikte e-mailadres (of telefoonnummer). We kunnen de bevestiging opnieuw verzenden of de bestelgegevens handmatig geven.\n\nJe kunt ook naar https://rhythmnexus.org/track-your-item gaan en Search by Email or Phone gebruiken om je bestelling te vinden."
  },
  id: {
    question: "Bagaimana jika saya tidak menerima email konfirmasi?",
    answer: "1. Periksa folder spam/junk Anda — pesan otomatis terkadang difilter.\n2. Verifikasi alamat email yang Anda gunakan saat checkout; salah ketik dapat mencegah pengiriman.\n3. Jika alamat sudah benar tetapi email masih tidak ada, hubungi kami dengan nomor pesanan dan alamat email (atau nomor telepon) yang digunakan. Kami dapat mengirim ulang konfirmasi atau memberikan detail pesanan secara manual.\n\nAnda juga dapat membuka https://rhythmnexus.org/track-your-item dan menggunakan Search by Email or Phone untuk mencari pesanan Anda."
  },
  cs: {
    question: "Co když jsem neobdržel/a potvrzovací e-mail?",
    answer: "1. Zkontrolujte složku spam/nevyžádaná pošta — automatické zprávy se někdy filtrují.\n2. Ověřte e-mailovou adresu použitou při objednávce; překlep může doručení zablokovat.\n3. Pokud je adresa správná a e-mail stále chybí, kontaktujte nás s číslem objednávky a použitou e-mailovou adresou (nebo telefonním číslem). Potvrzení můžeme poslat znovu nebo ručně poskytnout detaily objednávky.\n\nMůžete také jít na https://rhythmnexus.org/track-your-item a použít Search by Email or Phone k vyhledání objednávky."
  },
  it: {
    question: "Cosa devo fare se non ho ricevuto l'email di conferma?",
    answer: "1. Controlla la cartella spam/posta indesiderata — i messaggi automatici a volte vengono filtrati.\n2. Verifica l'indirizzo email usato al checkout; un errore di battitura può impedire la consegna.\n3. Se l'indirizzo è corretto ma l'email manca ancora, contattaci con il numero d'ordine e l'indirizzo email (o numero di telefono) usato. Possiamo reinviare la conferma o fornire manualmente i dettagli dell'ordine.\n\nPuoi anche andare su https://rhythmnexus.org/track-your-item e usare Search by Email or Phone per trovare il tuo ordine."
  },
  he: {
    question: "מה אם לא קיבלתי את אימייל האישור שלי?",
    answer: "1. בדקו את תיקיית הספאם/דואר זבל — הודעות אוטומטיות לפעמים מסוננות.\n2. ודאו את כתובת האימייל שהזנתם בקופה; טעות הקלדה יכולה למנוע מסירה.\n3. אם הכתובת נכונה והאימייל עדיין חסר, צרו קשר עם מספר ההזמנה וכתובת האימייל (או מספר הטלפון) שבה השתמשתם. נוכל לשלוח שוב את האישור או לספק את פרטי ההזמנה ידנית.\n\nאפשר גם להיכנס ל-https://rhythmnexus.org/track-your-item ולהשתמש ב-Search by Email or Phone כדי לאתר את ההזמנה."
  },
  ga: {
    question: "Cad má nár fuair mé mo ríomhphost deimhnithe?",
    answer: "1. Seiceáil do fhillteán turscair/junk — scagtar teachtaireachtaí uathoibríocha uaireanta.\n2. Deimhnigh an seoladh ríomhphoist a d'úsáid tú ag checkout; d'fhéadfadh botún clóscríofa seachadadh a stopadh.\n3. Má tá an seoladh ceart agus má tá an ríomhphost fós ar iarraidh, déan teagmháil linn le d'uimhir ordaithe agus an seoladh ríomhphoist (nó uimhir ghutháin) a d'úsáid tú. Is féidir linn an deimhniú a athsheoladh nó sonraí an ordaithe a sholáthar de láimh.\n\nIs féidir leat dul freisin chuig https://rhythmnexus.org/track-your-item agus Search by Email or Phone a úsáid chun d'ordú a aimsiú."
  },
  pl: {
    question: "Co zrobić, jeśli nie otrzymałem/am e-maila z potwierdzeniem?",
    answer: "1. Sprawdź folder spam/wiadomości-śmieci — automatyczne wiadomości bywają filtrowane.\n2. Zweryfikuj adres e-mail użyty przy zakupie; literówka może uniemożliwić dostarczenie.\n3. Jeśli adres jest poprawny, a e-mail nadal nie dotarł, skontaktuj się z nami, podając numer zamówienia oraz użyty adres e-mail (lub numer telefonu). Możemy ponownie wysłać potwierdzenie albo przekazać szczegóły zamówienia ręcznie.\n\nMożesz też wejść na https://rhythmnexus.org/track-your-item i użyć Search by Email or Phone, aby znaleźć swoje zamówienie."
  },
  ko: {
    question: "주문 확인 이메일을 받지 못하면 어떻게 하나요?",
    answer: "1. 스팸/정크 메일함을 확인하세요 — 자동 발송 메일이 필터링될 수 있습니다.\n2. 결제 시 입력한 이메일 주소를 확인하세요. 오타가 있으면 수신되지 않을 수 있습니다.\n3. 주소가 정확한데도 메일이 없으면 주문번호와 사용한 이메일 주소(또는 전화번호)를 포함해 문의해 주세요. 확인 메일을 재발송하거나 주문 정보를 수동으로 안내해 드릴 수 있습니다.\n\n또는 https://rhythmnexus.org/track-your-item 에서 Search by Email or Phone을 사용해 주문을 찾을 수 있습니다."
  },
  mi: {
    question: "Me aha mēnā kāore au i whiwhi i taku īmēra whakaū?",
    answer: "1. Tirohia tō kōpaki spam/junk — ka tātarihia ētahi karere aunoa i ētahi wā.\n2. Whakauhia te wāhitau īmēra i whakamahia e koe i te utu; ka aukatia te tuku mēnā he hapa tā.\n3. Mēnā he tika te wāhitau engari kāore tonu te īmēra, whakapā mai me tō nama ota me te wāhitau īmēra (rānei tau waea) i whakamahia e koe. Ka taea e mātou te tuku anō i te whakaū, te tuku ā-ringa rānei i ngā taipitopito ota.\n\nKa taea hoki te haere ki https://rhythmnexus.org/track-your-item me te whakamahi i Search by Email or Phone hei kimi i tō ota."
  },
  no: {
    question: "Hva om jeg ikke mottok bekreftelses-e-posten min?",
    answer: "1. Sjekk spam-/søppelpostmappen — automatiske meldinger blir noen ganger filtrert.\n2. Bekreft e-postadressen du brukte i kassen; en skrivefeil kan hindre levering.\n3. Hvis adressen er riktig og e-posten fortsatt mangler, kontakt oss med ordrenummeret ditt og e-postadressen (eller telefonnummeret) du brukte. Vi kan sende bekreftelsen på nytt eller gi ordredetaljer manuelt.\n\nDu kan også gå til https://rhythmnexus.org/track-your-item og bruke Search by Email or Phone for å finne bestillingen din."
  },
  ru: {
    question: "Что делать, если я не получил(а) письмо-подтверждение?",
    answer: "1. Проверьте папку спам/нежелательная почта — автоматические письма иногда фильтруются.\n2. Проверьте адрес электронной почты, указанный при оформлении заказа; опечатка может помешать доставке.\n3. Если адрес верный, но письма всё ещё нет, свяжитесь с нами, указав номер заказа и использованный адрес электронной почты (или номер телефона). Мы можем повторно отправить подтверждение или вручную предоставить детали заказа.\n\nВы также можете перейти на https://rhythmnexus.org/track-your-item и использовать Search by Email or Phone, чтобы найти ваш заказ."
  },
  sv: {
    question: "Vad händer om jag inte fick mitt bekräftelsemail?",
    answer: "1. Kontrollera din skräppost/junk-mapp — automatiska meddelanden filtreras ibland.\n2. Verifiera e-postadressen du använde i kassan; ett stavfel kan förhindra leverans.\n3. Om adressen är korrekt men e-postmeddelandet fortfarande saknas, kontakta oss med ditt ordernummer och den e-postadress (eller det telefonnummer) du använde. Vi kan skicka bekräftelsen igen eller ge orderuppgifter manuellt.\n\nDu kan också gå till https://rhythmnexus.org/track-your-item och använda Search by Email or Phone för att hitta din beställning."
  },
  fi: {
    question: "Entä jos en saanut vahvistussähköpostia?",
    answer: "1. Tarkista roskaposti-/junk-kansio — automaattiset viestit suodattuvat joskus.\n2. Varmista kassalla käyttämäsi sähköpostiosoite; kirjoitusvirhe voi estää toimituksen.\n3. Jos osoite on oikein mutta sähköposti puuttuu edelleen, ota meihin yhteyttä ja ilmoita tilausnumero sekä käyttämäsi sähköpostiosoite (tai puhelinnumero). Voimme lähettää vahvistuksen uudelleen tai antaa tilaustiedot manuaalisesti.\n\nVoit myös mennä osoitteeseen https://rhythmnexus.org/track-your-item ja käyttää Search by Email or Phone -toimintoa löytääksesi tilauksesi."
  },
  tl: {
    question: "Paano kung hindi ko natanggap ang aking confirmation email?",
    answer: "1. Tingnan ang spam/junk folder — minsan nafi-filter ang automated messages.\n2. I-verify ang email address na ginamit mo sa checkout; puwedeng humarang sa delivery ang typo.\n3. Kung tama ang address pero wala pa rin ang email, makipag-ugnayan sa amin gamit ang iyong order number at email address (o phone number) na ginamit mo. Maaari naming i-resend ang confirmation o ibigay nang mano-mano ang order details.\n\nMaaari ka ring pumunta sa https://rhythmnexus.org/track-your-item at gamitin ang Search by Email or Phone para hanapin ang iyong order."
  },
  vi: {
    question: "Nếu tôi không nhận được email xác nhận thì sao?",
    answer: "1. Hãy kiểm tra thư mục spam/rác — thư tự động đôi khi bị lọc.\n2. Xác minh địa chỉ email bạn đã dùng khi thanh toán; lỗi gõ có thể khiến email không được gửi đến.\n3. Nếu địa chỉ đúng nhưng vẫn không thấy email, hãy liên hệ chúng tôi kèm mã đơn hàng và địa chỉ email (hoặc số điện thoại) bạn đã dùng. Chúng tôi có thể gửi lại xác nhận hoặc cung cấp chi tiết đơn hàng thủ công.\n\nBạn cũng có thể vào https://rhythmnexus.org/track-your-item và dùng Search by Email or Phone để tìm đơn hàng của mình."
  },
  cy: {
    question: "Beth os na chefais fy e-bost cadarnhau?",
    answer: "1. Gwiriwch eich ffolder sbam/jync — mae negeseuon awtomataidd weithiau'n cael eu hidlo.\n2. Gwiriwch y cyfeiriad e-bost a ddefnyddiwyd gennych wrth dalu; gall camgymeriad teipio atal danfon.\n3. Os yw'r cyfeiriad yn gywir ond mae'r e-bost yn dal ar goll, cysylltwch â ni gyda'ch rhif archeb a'r cyfeiriad e-bost (neu rif ffôn) a ddefnyddiwyd. Gallwn ail-anfon y cadarnhad neu ddarparu manylion yr archeb â llaw.\n\nGallwch hefyd fynd i https://rhythmnexus.org/track-your-item a defnyddio Search by Email or Phone i ddod o hyd i'ch archeb."
  },
  ta: {
    question: "எனக்கு உறுதிப்படுத்தல் மின்னஞ்சல் வராவிட்டால் என்ன செய்ய வேண்டும்?",
    answer: "1. உங்கள் spam/junk கோப்புறையைச் சரிபார்க்கவும் — தானியங்கி செய்திகள் சில நேரங்களில் வடிகட்டப்படலாம்.\n2. checkout போது பயன்படுத்திய மின்னஞ்சல் முகவரியை உறுதிப்படுத்தவும்; தட்டச்சுப் பிழை இருந்தால் அனுப்புதல் தடுக்கப்படலாம்.\n3. முகவரி சரியாக இருந்தும் மின்னஞ்சல் வரவில்லை என்றால், உங்கள் order number மற்றும் பயன்படுத்திய மின்னஞ்சல் முகவரி (அல்லது தொலைபேசி எண்) உடன் எங்களைத் தொடர்பு கொள்ளுங்கள். நாங்கள் உறுதிப்படுத்தல் மின்னஞ்சலை மீண்டும் அனுப்பலாம் அல்லது ஆர்டர் விவரங்களை கைமுறையாக வழங்கலாம்.\n\nநீங்கள் https://rhythmnexus.org/track-your-item சென்று Search by Email or Phone ஐ பயன்படுத்தி உங்கள் ஆர்டரைத் தேடலாம்."
  }
};

const usaPhoneFaqTranslations = {
  en: {
    question: "Phone Number Required for Shipping (Important)",
    answer: `For certain destinations, a valid recipient phone number is mandatory for Etsy shipments. This helps customs clearance, VAT/tax coordination, and final-mile delivery communication.

Required Countries:
United States
European Union countries (Austria, Belgium, Czechia, Finland, France, Germany, Ireland, Italy, Netherlands, Poland, Portugal, Spain, Sweden)
United Kingdom
Norway
Switzerland
China
India
Indonesia
Philippines
South Korea
Taiwan
Vietnam

Recommended (but not required): Australia, New Zealand, Canada.

Important: Missing recipient phone number may result in shipment delays, return-to-sender outcomes, or order cancellation depending on destination-country processing rules. Rhythm Nexus will cancel the order after 24 hours and issue a full refund if the required phone number is not provided.`
  },
  de: { question: "Telefonnummer für den Versand erforderlich (Wichtig)", answer: `Für bestimmte Ziele ist bei Etsy-Sendungen eine gültige Telefonnummer des Empfängers verpflichtend. Das unterstützt Zollabfertigung, VAT/Steuer-Abstimmung und die Kommunikation bei der Zustellung. Wichtige Zielländer: USA, EU-Länder, Vereinigtes Königreich, Norwegen, Schweiz, China, Indien, Indonesien, Philippinen, Südkorea, Taiwan und Vietnam. Empfohlen (nicht verpflichtend): Australien, Neuseeland, Kanada. Fehlt die Nummer, kann es zu Verzögerungen, Rücksendung oder Stornierung kommen. Rhythm Nexus storniert nach 24 Stunden und erstattet vollständig, wenn die erforderliche Nummer nicht bereitgestellt wird.` },
  fr: { question: "Numéro de téléphone requis pour l'expédition (Important)", answer: `Pour certaines destinations, un numéro de téléphone valide du destinataire est obligatoire pour les envois Etsy. Cela aide le dédouanement, la coordination TVA/taxes et la communication de livraison finale. Destinations principales: États-Unis, pays de l'UE, Royaume-Uni, Norvège, Suisse, Chine, Inde, Indonésie, Philippines, Corée du Sud, Taïwan et Vietnam. Recommandé (non obligatoire): Australie, Nouvelle-Zélande, Canada. Sans numéro, il peut y avoir retard, retour à l'expéditeur ou annulation. Rhythm Nexus annule après 24 heures et rembourse intégralement si le numéro requis n'est pas fourni.` },
  es: { question: "Número de teléfono requerido para el envío (Importante)", answer: `Para ciertos destinos, es obligatorio un número de teléfono válido del destinatario en envíos de Etsy. Esto ayuda al despacho aduanero, la coordinación de IVA/impuestos y la comunicación de última milla. Destinos principales: Estados Unidos, países de la UE, Reino Unido, Noruega, Suiza, China, India, Indonesia, Filipinas, Corea del Sur, Taiwán y Vietnam. Recomendado (no obligatorio): Australia, Nueva Zelanda, Canadá. Sin número, puede haber retrasos, devolución al remitente o cancelación. Rhythm Nexus cancelará tras 24 horas y emitirá reembolso completo si no se proporciona el número requerido.` },
  ja: { question: "配送に電話番号が必要です（重要）", answer: `一部の配送先では、Etsy発送に受取人の有効な電話番号が必須です。これは通関、VAT/税対応、最終区間配送の連絡に必要です。主な対象国は、米国、EU諸国、英国、ノルウェー、スイス、中国、インド、インドネシア、フィリピン、韓国、台湾、ベトナムです。推奨（必須ではない）: オーストラリア、ニュージーランド、カナダ。番号がない場合、遅延・返送・キャンセルの可能性があります。必要な番号が24時間以内に提供されない場合、Rhythm Nexusは注文をキャンセルし全額返金します。` },
  zh: { question: "发货需提供电话号码（重要）", answer: `对于部分目的地，Etsy 发货必须提供有效收件人电话号码。这有助于清关、VAT/税务协同及末端派送沟通。主要适用国家/地区包括：美国、欧盟国家、英国、挪威、瑞士、中国、印度、印尼、菲律宾、韩国、台湾和越南。建议提供（非强制）：澳大利亚、新西兰、加拿大。若缺少号码，可能导致延误、退回或取消。如 24 小时内未提供所需号码，Rhythm Nexus 将取消订单并全额退款。` },
  'zh-hant': { question: "出貨需提供電話號碼（重要）", answer: `對於部分目的地，Etsy 出貨必須提供有效收件人電話號碼。這有助於清關、VAT/稅務協調及末端配送溝通。主要適用國家/地區包括：美國、歐盟國家、英國、挪威、瑞士、中國、印度、印尼、菲律賓、南韓、台灣與越南。建議提供（非強制）：澳洲、紐西蘭、加拿大。若缺少號碼，可能造成延誤、退回或取消。若 24 小時內未提供所需號碼，Rhythm Nexus 將取消訂單並全額退款。` },
  pt: { question: "Número de telefone obrigatório para envio (Importante)", answer: `Para certos destinos, um número de telefone válido do destinatário é obrigatório para envios da Etsy. Isso ajuda no desembaraço aduaneiro, coordenação de IVA/impostos e comunicação de entrega final. Destinos principais: Estados Unidos, países da UE, Reino Unido, Noruega, Suíça, China, Índia, Indonésia, Filipinas, Coreia do Sul, Taiwan e Vietnã. Recomendado (não obrigatório): Austrália, Nova Zelândia, Canadá. Sem número, pode haver atraso, devolução ao remetente ou cancelamento. A Rhythm Nexus cancelará após 24 horas e fará reembolso total se o número obrigatório não for fornecido.` },
  hi: { question: "शिपिंग के लिए फोन नंबर आवश्यक (महत्वपूर्ण)", answer: `कुछ गंतव्यों के लिए Etsy शिपमेंट में प्राप्तकर्ता का वैध फोन नंबर अनिवार्य है। इससे कस्टम क्लियरेंस, VAT/टैक्स समन्वय और अंतिम डिलीवरी संचार में मदद मिलती है। मुख्य देश: USA, EU देश, यूनाइटेड किंगडम, नॉर्वे, स्विट्ज़रलैंड, चीन, भारत, इंडोनेशिया, फ़िलिपींस, दक्षिण कोरिया, ताइवान और वियतनाम। सुझावित (अनिवार्य नहीं): ऑस्ट्रेलिया, न्यूज़ीलैंड, कनाडा। नंबर न होने पर देरी, रिटर्न या ऑर्डर रद्द हो सकता है। 24 घंटे में नंबर न देने पर Rhythm Nexus ऑर्डर रद्द करेगा और पूरा रिफंड देगा।` },
  th: { question: "ต้องมีหมายเลขโทรศัพท์สำหรับการจัดส่ง (สำคัญ)", answer: `สำหรับบางปลายทาง การจัดส่งผ่าน Etsy จำเป็นต้องมีหมายเลขโทรศัพท์ผู้รับที่ใช้งานได้ เพื่อช่วยด้านศุลกากร การประสานงาน VAT/ภาษี และการสื่อสารช่วงส่งปลายทาง ปลายทางหลักได้แก่ สหรัฐอเมริกา ประเทศสหภาพยุโรป สหราชอาณาจักร นอร์เวย์ สวิตเซอร์แลนด์ จีน อินเดีย อินโดนีเซีย ฟิลิปปินส์ เกาหลีใต้ ไต้หวัน และเวียดนาม แนะนำ (ไม่บังคับ): ออสเตรเลีย นิวซีแลนด์ แคนาดา หากไม่มีหมายเลข อาจเกิดความล่าช้า ตีกลับ หรือยกเลิกคำสั่งซื้อ หากไม่ให้หมายเลขที่จำเป็นภายใน 24 ชั่วโมง Rhythm Nexus จะยกเลิกคำสั่งซื้อและคืนเงินเต็มจำนวน` },
  ms: { question: "Nombor telefon diperlukan untuk penghantaran (Penting)", answer: `Bagi destinasi tertentu, nombor telefon penerima yang sah adalah wajib untuk penghantaran Etsy. Ini membantu pelepasan kastam, penyelarasan VAT/cukai, dan komunikasi penghantaran akhir. Destinasi utama: Amerika Syarikat, negara EU, United Kingdom, Norway, Switzerland, China, India, Indonesia, Filipina, Korea Selatan, Taiwan dan Vietnam. Disyorkan (tidak wajib): Australia, New Zealand, Kanada. Tanpa nombor, penghantaran boleh lewat, dipulangkan, atau pesanan dibatalkan. Rhythm Nexus akan membatalkan selepas 24 jam dan memberi bayaran balik penuh jika nombor wajib tidak diberikan.` },
  nl: { question: "Telefoonnummer vereist voor verzending (Belangrijk)", answer: `Voor bepaalde bestemmingen is een geldig telefoonnummer van de ontvanger verplicht voor Etsy-zendingen. Dit helpt bij douane-afhandeling, btw/belastingcoördinatie en communicatie bij de laatste bezorgstap. Belangrijke bestemmingen: Verenigde Staten, EU-landen, Verenigd Koninkrijk, Noorwegen, Zwitserland, China, India, Indonesië, Filipijnen, Zuid-Korea, Taiwan en Vietnam. Aanbevolen (niet verplicht): Australië, Nieuw-Zeeland, Canada. Zonder nummer kan er vertraging, retour of annulering plaatsvinden. Rhythm Nexus annuleert na 24 uur en restitueert volledig als het vereiste nummer niet is opgegeven.` },
  id: { question: "Nomor telepon wajib untuk pengiriman (Penting)", answer: `Untuk tujuan tertentu, nomor telepon penerima yang valid wajib untuk pengiriman Etsy. Ini membantu proses bea cukai, koordinasi VAT/pajak, dan komunikasi pengantaran last-mile. Destinasi utama: Amerika Serikat, negara Uni Eropa, Inggris Raya, Norwegia, Swiss, Tiongkok, India, Indonesia, Filipina, Korea Selatan, Taiwan, dan Vietnam. Disarankan (tidak wajib): Australia, Selandia Baru, Kanada. Tanpa nomor, pengiriman dapat terlambat, dikembalikan, atau dibatalkan. Rhythm Nexus akan membatalkan setelah 24 jam dan memberi refund penuh jika nomor wajib tidak diberikan.` },
  cs: { question: "Telefonní číslo je pro odeslání povinné (Důležité)", answer: `Pro některé destinace je u zásilek Etsy povinné platné telefonní číslo příjemce. Pomáhá to s celním odbavením, koordinací DPH/daní a komunikací při doručení. Hlavní destinace: USA, země EU, Spojené království, Norsko, Švýcarsko, Čína, Indie, Indonésie, Filipíny, Jižní Korea, Tchaj-wan a Vietnam. Doporučeno (není povinné): Austrálie, Nový Zéland, Kanada. Bez čísla může dojít ke zpoždění, vrácení nebo zrušení objednávky. Rhythm Nexus po 24 hodinách objednávku zruší a vrátí plnou částku, pokud číslo nebude dodáno.` },
  it: { question: "Numero di telefono richiesto per la spedizione (Importante)", answer: `Per alcune destinazioni, un numero di telefono valido del destinatario è obbligatorio per le spedizioni Etsy. Questo aiuta con sdoganamento, coordinamento IVA/tasse e comunicazione dell'ultimo miglio. Destinazioni principali: Stati Uniti, paesi UE, Regno Unito, Norvegia, Svizzera, Cina, India, Indonesia, Filippine, Corea del Sud, Taiwan e Vietnam. Consigliato (non obbligatorio): Australia, Nuova Zelanda, Canada. Senza numero possono verificarsi ritardi, resi o annullamenti. Rhythm Nexus annullerà dopo 24 ore ed emetterà rimborso completo se il numero richiesto non viene fornito.` },
  he: { question: "נדרש מספר טלפון למשלוח (חשוב)", answer: `עבור יעדים מסוימים, מספר טלפון תקין של הנמען הוא חובה למשלוחי Etsy. זה מסייע בשחרור ממכס, תיאום VAT/מסים ותקשורת במסירה הסופית. יעדים עיקריים: ארצות הברית, מדינות האיחוד האירופי, בריטניה, נורווגיה, שווייץ, סין, הודו, אינדונזיה, הפיליפינים, דרום קוריאה, טאיוואן ווייטנאם. מומלץ (לא חובה): אוסטרליה, ניו זילנד, קנדה. ללא מספר עלולים להיות עיכובים, החזרה לשולח או ביטול. Rhythm Nexus תבטל לאחר 24 שעות ותנפיק החזר מלא אם המספר הנדרש לא יסופק.` },
  ga: { question: "Uimhir theileafóin riachtanach don seoladh (Tábhachtach)", answer: `I gcás cinn scríbe áirithe, tá uimhir theileafóin bhailí an fhaighteora éigeantach do sheoltaí Etsy. Cabhraíonn sé sin le himréiteach custam, comhordú VAT/cánach, agus cumarsáid seachadta deiridh. Príomhchinn scríbe: SAM, tíortha an Aontais Eorpaigh, an Ríocht Aontaithe, an Iorua, an Eilvéis, an tSín, an India, an Indinéis, na hOileáin Fhilipíneacha, an Chóiré Theas, an Téaváin agus Vítneam. Molta (ní éigeantach): an Astráil, an Nua-Shéalainn, Ceanada. Gan uimhir, d'fhéadfadh moill, filleadh nó cealú tarlú. Cealóidh Rhythm Nexus tar éis 24 uair agus tabharfaidh aisíocaíocht iomlán mura soláthraítear an uimhir riachtanach.` },
  pl: { question: "Numer telefonu wymagany do wysyłki (Ważne)", answer: `W przypadku niektórych kierunków ważny numer telefonu odbiorcy jest obowiązkowy dla przesyłek Etsy. Pomaga to w odprawie celnej, koordynacji VAT/podatków i komunikacji doręczeniowej. Główne kierunki: USA, kraje UE, Wielka Brytania, Norwegia, Szwajcaria, Chiny, Indie, Indonezja, Filipiny, Korea Południowa, Tajwan i Wietnam. Zalecane (niewymagane): Australia, Nowa Zelandia, Kanada. Brak numeru może powodować opóźnienia, zwrot lub anulowanie. Rhythm Nexus anuluje po 24 godzinach i zwróci pełną kwotę, jeśli wymagany numer nie zostanie podany.` },
  ko: { question: "배송에 전화번호 필요 (중요)", answer: `일부 도착국의 Etsy 발송에는 수취인의 유효한 전화번호가 필수입니다. 이는 통관, VAT/세금 조정, 최종 배송 커뮤니케이션에 필요합니다. 주요 대상: 미국, EU 국가, 영국, 노르웨이, 스위스, 중국, 인도, 인도네시아, 필리핀, 대한민국, 대만, 베트남. 권장(필수 아님): 호주, 뉴질랜드, 캐나다. 번호가 없으면 지연, 반송 또는 취소가 발생할 수 있습니다. 24시간 내 번호 미제공 시 Rhythm Nexus는 주문을 취소하고 전액 환불합니다.` },
  mi: { question: "Me tuku nama waea mō te tuku (He mea nui)", answer: `Mō ētahi ūnga, he here te nama waea whaimana o te kaiwhiwhi mō ngā tuku Etsy. Ka āwhina tēnei i te whakaaetanga tikanga, te whakarite VAT/tāke, me te kōrero tuku whakamutunga. Ngā ūnga matua: USA, ngā whenua o te Kotahitanga Ūropi, United Kingdom, Nōwei, Huiterangi, Haina, Inia, Initonīhia, Piripīni, Korea ki te Tonga, Taiwana, Wētinamu. E taunaki ana (ehara i te here): Ahitereiria, Aotearoa, Kanata. Ki te kore te nama, ka roa, ka whakahokia, ka whakakorea rānei te ota. Ka whakakore a Rhythm Nexus i muri i te 24 hāora, ā, ka whakahoki katoa i te moni mēnā kāore te nama e tukuna.` },
  no: { question: "Telefonnummer kreves for frakt (Viktig)", answer: `For enkelte destinasjoner er gyldig mottakertelefonnummer obligatorisk for Etsy-forsendelser. Dette hjelper med tollklarering, VAT/skatt-koordinering og kommunikasjon ved siste leveringsledd. Hoveddestinasjoner: USA, EU-land, Storbritannia, Norge, Sveits, Kina, India, Indonesia, Filippinene, Sør-Korea, Taiwan og Vietnam. Anbefalt (ikke obligatorisk): Australia, New Zealand, Canada. Manglende nummer kan føre til forsinkelser, retur eller kansellering. Rhythm Nexus kansellerer etter 24 timer og gir full refusjon hvis nummeret ikke oppgis.` },
  ru: { question: "Номер телефона обязателен для отправки (Важно)", answer: `Для некоторых направлений действующий номер телефона получателя обязателен для отправлений Etsy. Это помогает при таможенном оформлении, координации VAT/налогов и коммуникации на последнем этапе доставки. Основные направления: США, страны ЕС, Великобритания, Норвегия, Швейцария, Китай, Индия, Индонезия, Филиппины, Южная Корея, Тайвань и Вьетнам. Рекомендуется (не обязательно): Австралия, Новая Зеландия, Канада. Отсутствие номера может привести к задержке, возврату или отмене. Rhythm Nexus отменит заказ через 24 часа и оформит полный возврат, если номер не предоставлен.` },
  sv: { question: "Telefonnummer krävs för frakt (Viktigt)", answer: `För vissa destinationer är ett giltigt mottagartelefonnummer obligatoriskt för Etsy-försändelser. Det hjälper vid tullklarering, VAT/skattekoordinering och kommunikation i sista leveransledet. Huvuddestinationer: USA, EU-länder, Storbritannien, Norge, Schweiz, Kina, Indien, Indonesien, Filippinerna, Sydkorea, Taiwan och Vietnam. Rekommenderat (ej obligatoriskt): Australien, Nya Zeeland, Kanada. Saknat nummer kan leda till försening, retur eller annullering. Rhythm Nexus annullerar efter 24 timmar och återbetalar fullt om nummer inte lämnas.` },
  fi: { question: "Puhelinnumero vaaditaan toimitukseen (Tärkeää)", answer: `Tietyissä kohteissa Etsy-lähetyksiin vaaditaan vastaanottajan voimassa oleva puhelinnumero. Tämä auttaa tullauksessa, VAT/verokoordinoinnissa ja viimeisen jakeluvaiheen viestinnässä. Pääkohteet: Yhdysvallat, EU-maat, Yhdistynyt kuningaskunta, Norja, Sveitsi, Kiina, Intia, Indonesia, Filippiinit, Etelä-Korea, Taiwan ja Vietnam. Suositeltu (ei pakollinen): Australia, Uusi-Seelanti, Kanada. Numeron puuttuminen voi aiheuttaa viiveen, palautuksen tai peruutuksen. Rhythm Nexus peruuttaa 24 tunnin jälkeen ja palauttaa maksun kokonaan, jos numeroa ei toimiteta.` },
  tl: { question: "Kailangan ang phone number para sa shipping (Mahalaga)", answer: `Para sa ilang destinasyon, mandatory ang valid na phone number ng recipient para sa Etsy shipments. Nakakatulong ito sa customs clearance, VAT/buwis coordination, at final-mile delivery communication. Pangunahing destinasyon: United States, EU countries, United Kingdom, Norway, Switzerland, China, India, Indonesia, Philippines, South Korea, Taiwan, at Vietnam. Recommended (hindi required): Australia, New Zealand, Canada. Kapag walang number, puwedeng ma-delay, ma-return, o ma-cancel ang order. Ika-cancel ng Rhythm Nexus pagkalipas ng 24 oras at magbibigay ng full refund kung hindi maibigay ang required number.` },
  vi: { question: "Yêu cầu số điện thoại khi vận chuyển (Quan trọng)", answer: `Với một số điểm đến, đơn Etsy bắt buộc phải có số điện thoại người nhận hợp lệ. Điều này giúp thông quan, phối hợp VAT/thuế và liên lạc giao hàng chặng cuối. Điểm đến chính: Hoa Kỳ, các nước EU, Vương quốc Anh, Na Uy, Thụy Sĩ, Trung Quốc, Ấn Độ, Indonesia, Philippines, Hàn Quốc, Đài Loan và Việt Nam. Khuyến nghị (không bắt buộc): Úc, New Zealand, Canada. Thiếu số có thể gây chậm, hoàn trả hoặc hủy đơn. Rhythm Nexus sẽ hủy sau 24 giờ và hoàn tiền toàn bộ nếu không cung cấp số bắt buộc.` },
  cy: { question: "Mae rhif ffôn yn ofynnol ar gyfer cludo (Pwysig)", answer: `Ar gyfer rhai cyrchfannau, mae rhif ffôn derbynnydd dilys yn orfodol ar gyfer anfoniadau Etsy. Mae hyn yn helpu gyda chlirio tollau, cydlynu TAW/treth, a chyfathrebu danfoniad olaf. Prif gyrchfannau: Unol Daleithiau, gwledydd yr Undeb Ewropeaidd, y Deyrnas Unedig, Norwy, y Swistir, Tsieina, India, Indonesia, Ynysoedd y Philipinau, De Korea, Taiwan a Fietnam. Argymhellir (nid yw'n orfodol): Awstralia, Seland Newydd, Canada. Gall diffyg rhif arwain at oedi, dychwelyd neu ganslo. Bydd Rhythm Nexus yn canslo ar ôl 24 awr ac yn ad-dalu'n llawn os na ddarperir y rhif gofynnol.` },
  ta: { question: "அனுப்புவதற்கு தொலைபேசி எண் அவசியம் (முக்கியம்)", answer: `சில இலக்குகளுக்கு Etsy அனுப்புதல்களில் பெறுநரின் செல்லுபடியான தொலைபேசி எண் கட்டாயம். இது சுங்க அனுமதி, VAT/வரி ஒருங்கிணைப்பு மற்றும் இறுதி டெலிவரி தொடர்புக்கு உதவுகிறது. முக்கிய இலக்குகள்: அமெரிக்கா, ஐரோப்பிய ஒன்றிய நாடுகள், ஐக்கிய இராச்சியம், நார்வே, சுவிட்சர்லாந்து, சீனா, இந்தியா, இந்தோனேஷியா, பிலிப்பைன்ஸ், தென் கொரியா, தைவான் மற்றும் வியட்நாம். பரிந்துரை (கட்டாயமில்லை): ஆஸ்திரேலியா, நியூசிலாந்து, கனடா. எண் இல்லையெனில் தாமதம், திரும்புதல் அல்லது ரத்து ஏற்படலாம். 24 மணிநேரத்தில் தேவையான எண் தரப்படாவிட்டால் Rhythm Nexus ஆர்டரை ரத்து செய்து முழு பணத்தீர்வை வழங்கும்.` }
};

export default function FAQ() {
  const { t, language } = useLanguage();
  const confirmationFaq = confirmationFaqTranslations[language] || confirmationFaqTranslations.en;
  const usaPhoneFaq = usaPhoneFaqTranslations[language] || usaPhoneFaqTranslations.en;
  const localizedSearchByEmailOrPhone = t('searchByEmailOrPhone') || 'Search by Email or Phone';
  const localizedConfirmationAnswer = confirmationFaq.answer.replaceAll('Search by Email or Phone', localizedSearchByEmailOrPhone);
  
  const faqData = [
    {
      question: t('faqQ1'),
      answer: t('faqA1')
    },
    {
      question: t('faqQ2'),
      answer: t('faqA2')
    },
    {
      question: t('faqQ3'),
      answer: t('faqA3')
    },
    {
      question: t('faqQ4'),
      answer: t('faqA4')
    },
    {
      question: t('faqQ5'),
      answer: t('faqA5')
    },
    {
      question: t('faqQ6'),
      answer: t('faqA6')
    },
    {
      question: t('faqQ7'),
      answer: t('faqA7')
    },
    {
      question: t('faqQ8'),
      answer: t('faqA8')
    },
    {
      question: usaPhoneFaq.question,
      answer: usaPhoneFaq.answer
    },
    {
      question: confirmationFaq.question,
      answer: localizedConfirmationAnswer
    }
  ];

  const renderAnswerWithLinks = (text) => {
    const value = typeof text === 'string' ? text : '';
    const segments = value.split(/(https?:\/\/[^\s]+)/g);

    return segments.map((segment, index) => {
      const isUrl = /^https?:\/\//.test(segment);
      if (!isUrl) return <React.Fragment key={`text-${index}`}>{segment}</React.Fragment>;

      return (
        <a
          key={`link-${index}`}
          href={segment}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#0d6efd', textDecoration: 'underline' }}
        >
          {segment}
        </a>
      );
    });
  };
  
  return (
    <>
      <Navigation />
      
      <div className="container mt-5 text-center">
        <h1 className="text-center">{t('faqTitle')}</h1>

        <div className="faq-grid">
          {faqData.map((faq, index) => (
            <div key={index} className="faq-card">
              <h3>{faq.question}</h3>
              <p style={{ whiteSpace: "pre-line" }}>{renderAnswerWithLinks(faq.answer)}</p>
            </div>
          ))}
        </div>
        
        <p className="text-muted">
          © {new Date().getFullYear()} Rhythm Nexus. {t('copyrightText')}
        </p>
      </div>
    </>
  );
}

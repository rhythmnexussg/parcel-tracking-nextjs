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

export default function FAQ() {
  const { t, language } = useLanguage();
  const confirmationFaq = confirmationFaqTranslations[language] || confirmationFaqTranslations.en;
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

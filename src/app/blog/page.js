'use client';

import React from "react";
import Link from "next/link";
import "../../App.css";
import { useLanguage } from "../../LanguageContext";
import { Navigation } from "../../components/Navigation";

const BLOG_CARD_I18N = {
  en: {
    phoneTitle: 'Phone Number Required for Shipping',
    phoneDesc: 'Important destination-country requirements and reasons why recipient phone numbers are mandatory for certain Etsy shipments.',
    usa122Title: 'USA Section 122 Shipping Update',
    usa122Desc: 'Important notice for U.S.-bound shipments: current handling and tariff-related rate adjustments now in effect.',
  },
  de: {
    phoneTitle: 'Telefonnummer für den Versand erforderlich',
    phoneDesc: 'Wichtige länderspezifische Anforderungen und Gründe, warum für bestimmte Etsy-Sendungen eine Empfänger-Telefonnummer verpflichtend ist.',
    usa122Title: 'USA Section 122 Versand-Update',
    usa122Desc: 'Wichtiger Hinweis für Sendungen in die USA: Aktuelle Bearbeitungs- und tarifbezogene Preisanpassungen sind jetzt in Kraft.',
  },
  fr: {
    phoneTitle: 'Numéro de téléphone requis pour l’expédition',
    phoneDesc: 'Exigences importantes selon le pays de destination et raisons pour lesquelles le numéro du destinataire est obligatoire pour certains envois Etsy.',
    usa122Title: 'Mise à jour USA Section 122',
    usa122Desc: 'Avis important pour les envois à destination des États-Unis : les ajustements actuels de traitement et liés aux tarifs sont désormais en vigueur.',
  },
  es: {
    phoneTitle: 'Número de teléfono obligatorio para envíos',
    phoneDesc: 'Requisitos importantes por país de destino y motivos por los que el teléfono del destinatario es obligatorio para ciertos envíos de Etsy.',
    usa122Title: 'Actualización de envíos EE. UU. Sección 122',
    usa122Desc: 'Aviso importante para envíos a EE. UU.: los ajustes actuales de gestión y tarifas ya están en vigor.',
  },
  ja: {
    phoneTitle: '発送には電話番号が必要です',
    phoneDesc: '一部の Etsy 配送で受取人電話番号が必須となる、配送先国ごとの重要要件と理由を説明します。',
    usa122Title: '米国 Section 122 配送更新',
    usa122Desc: '米国向け発送に関する重要なお知らせ：現在の取扱手数料および関税関連の料金調整はすでに適用されています。',
  },
  zh: {
    phoneTitle: '发货需提供电话号码',
    phoneDesc: '说明不同目的地国家的重要要求，以及为何部分 Etsy 订单必须提供收件人电话号码。',
    usa122Title: '美国 Section 122 运输更新',
    usa122Desc: '美国目的地包裹重要通知：当前处理费及关税相关费率调整已正式生效。',
  },
  'zh-hant': {
    phoneTitle: '出貨需提供電話號碼',
    phoneDesc: '說明不同目的地國家的重要要求，以及為何部分 Etsy 訂單必須提供收件人電話號碼。',
    usa122Title: '美國 Section 122 運輸更新',
    usa122Desc: '美國目的地包裹重要通知：目前處理費與關稅相關費率調整已正式生效。',
  },
  pt: {
    phoneTitle: 'Número de telefone obrigatório para envio',
    phoneDesc: 'Requisitos importantes por país de destino e motivos pelos quais o telefone do destinatário é obrigatório para certas remessas Etsy.',
    usa122Title: 'Atualização de envio EUA Section 122',
    usa122Desc: 'Aviso importante para envios aos EUA: ajustes atuais de manuseio e tarifas já estão em vigor.',
  },
  hi: {
    phoneTitle: 'शिपिंग के लिए फोन नंबर आवश्यक',
    phoneDesc: 'महत्वपूर्ण गंतव्य-देश आवश्यकताएँ और कारण कि कुछ Etsy शिपमेंट्स में प्राप्तकर्ता का फोन नंबर अनिवार्य क्यों है।',
    usa122Title: 'यूएसए Section 122 शिपिंग अपडेट',
    usa122Desc: 'यूएसए-गंतव्य शिपमेंट्स के लिए महत्वपूर्ण सूचना: वर्तमान हैंडलिंग और टैरिफ-संबंधित दर समायोजन अब लागू हैं।',
  },
  th: {
    phoneTitle: 'จำเป็นต้องมีหมายเลขโทรศัพท์สำหรับการจัดส่ง',
    phoneDesc: 'ข้อกำหนดสำคัญตามประเทศปลายทาง และเหตุผลที่หมายเลขผู้รับเป็นข้อบังคับสำหรับการจัดส่ง Etsy บางรายการ',
    usa122Title: 'อัปเดตการจัดส่งสหรัฐฯ Section 122',
    usa122Desc: 'ประกาศสำคัญสำหรับพัสดุปลายทางสหรัฐฯ: การปรับค่าดำเนินการและอัตราที่เกี่ยวข้องกับภาษีมีผลแล้ว',
  },
  ms: {
    phoneTitle: 'Nombor telefon diperlukan untuk penghantaran',
    phoneDesc: 'Keperluan penting mengikut negara destinasi dan sebab nombor telefon penerima diwajibkan untuk penghantaran Etsy tertentu.',
    usa122Title: 'Kemas kini penghantaran USA Seksyen 122',
    usa122Desc: 'Notis penting untuk penghantaran ke USA: pelarasan semasa bagi pengendalian dan kadar berkaitan tarif kini berkuat kuasa.',
  },
  nl: {
    phoneTitle: 'Telefoonnummer vereist voor verzending',
    phoneDesc: 'Belangrijke vereisten per bestemmingsland en redenen waarom een ontvangersnummer verplicht is voor bepaalde Etsy-zendingen.',
    usa122Title: 'USA Section 122 verzendupdate',
    usa122Desc: 'Belangrijke melding voor VS-zendingen: huidige verwerkings- en tariefgerelateerde aanpassingen zijn nu van kracht.',
  },
  id: {
    phoneTitle: 'Nomor telepon wajib untuk pengiriman',
    phoneDesc: 'Persyaratan penting berdasarkan negara tujuan dan alasan mengapa nomor penerima wajib untuk pengiriman Etsy tertentu.',
    usa122Title: 'Pembaruan pengiriman USA Section 122',
    usa122Desc: 'Pemberitahuan penting untuk kiriman tujuan USA: penyesuaian biaya penanganan dan tarif terkait kini berlaku.',
  },
  cs: {
    phoneTitle: 'Telefonní číslo je pro dopravu povinné',
    phoneDesc: 'Důležité požadavky podle cílové země a důvody, proč je telefon příjemce u některých zásilek Etsy povinný.',
    usa122Title: 'Aktualizace dopravy do USA – Section 122',
    usa122Desc: 'Důležité upozornění pro zásilky do USA: aktuální manipulační a tarifní úpravy cen jsou nyní účinné.',
  },
  it: {
    phoneTitle: 'Numero di telefono obbligatorio per la spedizione',
    phoneDesc: 'Requisiti importanti per paese di destinazione e motivi per cui il numero del destinatario è obbligatorio per alcune spedizioni Etsy.',
    usa122Title: 'Aggiornamento spedizioni USA Section 122',
    usa122Desc: 'Avviso importante per spedizioni dirette negli USA: gli attuali adeguamenti di gestione e tariffari sono ora in vigore.',
  },
  he: {
    phoneTitle: 'נדרש מספר טלפון למשלוח',
    phoneDesc: 'דרישות חשובות לפי מדינת יעד והסיבות לכך שמספר טלפון של הנמען חובה בחלק ממשלוחי Etsy.',
    usa122Title: 'עדכון משלוחים לארה״ב Section 122',
    usa122Desc: 'הודעה חשובה למשלוחים לארה״ב: התאמות תעריף ודמי טיפול נוכחיות נכנסו לתוקף.',
  },
  ga: {
    phoneTitle: 'Uimhir theileafóin riachtanach don loingseoireacht',
    phoneDesc: 'Riachtanais thábhachtacha de réir tíre cinn scríbe agus cúiseanna go bhfuil uimhir an fhaighteora éigeantach do roinnt seoltaí Etsy.',
    usa122Title: 'Nuashonrú loingseoireachta SAM Section 122',
    usa122Desc: 'Fógra tábhachtach do sheoltaí chuig SAM: tá na coigeartuithe reatha láimhseála agus taraife i bhfeidhm anois.',
  },
  pl: {
    phoneTitle: 'Numer telefonu wymagany do wysyłki',
    phoneDesc: 'Ważne wymagania zależne od kraju docelowego oraz powody, dla których numer odbiorcy jest obowiązkowy dla niektórych przesyłek Etsy.',
    usa122Title: 'Aktualizacja wysyłek do USA – Section 122',
    usa122Desc: 'Ważna informacja dla przesyłek do USA: obecne korekty opłat manipulacyjnych i taryfowych już obowiązują.',
  },
  ko: {
    phoneTitle: '배송 시 전화번호 필수',
    phoneDesc: '일부 Etsy 배송에서 수취인 전화번호가 의무인 이유와 목적지 국가별 중요 요건을 안내합니다.',
    usa122Title: '미국 Section 122 배송 업데이트',
    usa122Desc: '미국행 배송 중요 안내: 현재 취급 수수료 및 관세 관련 요율 조정이 적용 중입니다.',
  },
  no: {
    phoneTitle: 'Telefonnummer kreves for frakt',
    phoneDesc: 'Viktige krav per destinasjonsland og hvorfor mottakers telefonnummer er obligatorisk for enkelte Etsy-forsendelser.',
    usa122Title: 'USA Section 122 fraktoppdatering',
    usa122Desc: 'Viktig melding for USA-forsendelser: gjeldende håndterings- og tariffrelaterte justeringer er nå i kraft.',
  },
  sv: {
    phoneTitle: 'Telefonnummer krävs för frakt',
    phoneDesc: 'Viktiga krav per destinationsland och varför mottagarens telefonnummer är obligatoriskt för vissa Etsy-försändelser.',
    usa122Title: 'USA Section 122 leveransuppdatering',
    usa122Desc: 'Viktig information för USA-försändelser: nuvarande hanterings- och tariffrelaterade prisjusteringar gäller nu.',
  },
  tl: {
    phoneTitle: 'Kailangan ang phone number para sa shipping',
    phoneDesc: 'Mahahalagang requirement ayon sa destination country at mga dahilan kung bakit mandatory ang recipient phone number para sa ilang Etsy shipments.',
    usa122Title: 'USA Section 122 shipping update',
    usa122Desc: 'Mahalagang abiso para sa U.S.-bound shipments: kasalukuyang handling at tariff-related rate adjustments ay epektibo na.',
  },
  vi: {
    phoneTitle: 'Bắt buộc số điện thoại khi gửi hàng',
    phoneDesc: 'Các yêu cầu quan trọng theo quốc gia đích và lý do vì sao số điện thoại người nhận là bắt buộc cho một số đơn Etsy.',
    usa122Title: 'Cập nhật vận chuyển USA Section 122',
    usa122Desc: 'Thông báo quan trọng cho lô hàng đi Mỹ: điều chỉnh hiện tại về xử lý và mức phí liên quan thuế quan đã có hiệu lực.',
  },
  fi: {
    phoneTitle: 'Puhelinnumero vaaditaan toimitukseen',
    phoneDesc: 'Tärkeät kohdemaakohtaiset vaatimukset ja syyt, miksi vastaanottajan puhelinnumero on pakollinen tietyissä Etsy-lähetyksissä.',
    usa122Title: 'USA Section 122 -toimituspäivitys',
    usa122Desc: 'Tärkeä ilmoitus USA:han meneville lähetyksille: nykyiset käsittely- ja tariffiin liittyvät hintamuutokset ovat nyt voimassa.',
  },
  ru: {
    phoneTitle: 'Телефон обязателен для доставки',
    phoneDesc: 'Важные требования по странам назначения и причины, по которым номер получателя обязателен для некоторых отправлений Etsy.',
    usa122Title: 'Обновление доставки в США по Section 122',
    usa122Desc: 'Важное уведомление для отправлений в США: текущие корректировки по обработке и тарифам уже вступили в силу.',
  },
  cy: {
    phoneTitle: 'Mae rhif ffôn yn ofynnol ar gyfer cludo',
    phoneDesc: 'Gofynion pwysig yn ôl gwlad gyrchfan a rhesymau pam mae rhif ffôn y derbynnydd yn orfodol ar gyfer rhai llwythi Etsy.',
    usa122Title: 'Diweddariad cludo UDA Section 122',
    usa122Desc: 'Hysbysiad pwysig ar gyfer llwythi i UDA: mae’r addasiadau presennol i drin a thariffau bellach mewn grym.',
  },
  ta: {
    phoneTitle: 'அனுப்புதலுக்கு தொலைபேசி எண் அவசியம்',
    phoneDesc: 'சில Etsy அனுப்புதல்களுக்கு பெறுநர் தொலைபேசி எண் கட்டாயமாக இருப்பதற்கான இலக்கு நாடு சார்ந்த முக்கிய தேவைகள் மற்றும் காரணங்கள்.',
    usa122Title: 'அமெரிக்கா Section 122 அனுப்புதல் புதுப்பிப்பு',
    usa122Desc: 'அமெரிக்காவுக்கு செல்லும் அனுப்புதல்களுக்கு முக்கிய அறிவிப்பு: தற்போதைய கையாளுதல் மற்றும் சுங்கக் கட்டண தொடர்பான விகித மாற்றங்கள் அமலில் உள்ளன.',
  },
  mi: {
    phoneTitle: 'Me tuku nama waea mō te tuku',
    phoneDesc: 'Ngā whakaritenga nui ā-whenua mō te ūnga me ngā take e herea ai te nama waea o te kaiwhiwhi mō ētahi tukunga Etsy.',
    usa122Title: 'Whakahōunga tuku USA Section 122',
    usa122Desc: 'Pānui nui mō ngā tukunga ki USA: kua mana ināianei ngā whakatikatika utu mō te whakahaere me ngā utu tāke e pā ana.',
  },
};

const BLOG_CARD_LANGUAGE_ALIASES = {
  'zh-tw': 'zh-hant',
  'zh-hk': 'zh-hant',
  'zh-hans': 'zh',
  'fil': 'tl',
  'iw': 'he',
  'nb': 'no',
  'nn': 'no',
};

function normalizeBlogCardLanguageCode(languageCode) {
  const normalized = String(languageCode || 'en').toLowerCase();
  const aliased = BLOG_CARD_LANGUAGE_ALIASES[normalized] || normalized;
  if (aliased.startsWith('zh')) {
    return aliased === 'zh-hant' ? 'zh-hant' : 'zh';
  }
  if (BLOG_CARD_I18N[aliased]) {
    return aliased;
  }
  const baseLanguage = aliased.split('-')[0];
  return BLOG_CARD_I18N[baseLanguage] ? baseLanguage : 'en';
}

function getLocalizedBlogCards(languageCode) {
  return BLOG_CARD_I18N[normalizeBlogCardLanguageCode(languageCode)] || BLOG_CARD_I18N.en;
}

function BlogIndex() {
  const { t, language } = useLanguage();
  const localizedCards = getLocalizedBlogCards(language);
  
  const blogPosts = [
    {
      path: "singpost-epac",
      title: t('blogPost1Title'),
      description: t('blogPost1Desc')
    },
    {
      path: "speedpost-ems",
      title: t('blogPost2Title'),
      description: t('blogPost2Desc')
    },
    {
      path: "speedpost-express",
      title: t('blogPost3Title'),
      description: t('blogPost3Desc')
    },
    {
      path: "us-pddp",
      title: t('blogPost4Title'),
      description: t('blogPost4Desc')
    },
    {
      path: "eu-vat-ioss",
      title: t('blogPost5Title'),
      description: t('blogPost5Desc')
    },
    {
      path: "uk-vat-hmrc",
      title: t('blogPost6Title'),
      description: t('blogPost6Desc')
    },
    {
      path: "norway-voec",
      title: t('blogPost7Title'),
      description: t('blogPost7Desc')
    },
    {
      path: "swiss-vat",
      title: t('blogPost8Title'),
      description: t('blogPost8Desc')
    },
    {
      path: "phone-number-required",
      title: localizedCards.phoneTitle,
      description: localizedCards.phoneDesc
    },
    {
      path: "usa-section-122",
      title: localizedCards.usa122Title,
      description: localizedCards.usa122Desc
    }
  ];

  return (
    <>
      <Navigation />
      <div className="container text-center">
        <h1 className="mt-3">{t('blogTitle')}</h1>
        <p className="text-muted mb-5">
          {t('blogSubtitle')}
        </p>

        <div className="blog-grid">
          {blogPosts.map((post, index) => (
            <div key={index} className="blog-card">
              <h3>{post.title}</h3>
              <p>{post.description}</p>
              <Link href={`/blog/${post.path}`} className="blog-link">{t('readMore')} →</Link>
            </div>
          ))}
        </div>

        <p className="text-muted">© {new Date().getFullYear()} Rhythm Nexus. {t('copyrightText')}</p>
      </div>
    </>
  );
}

export default BlogIndex;

'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { useLanguage } from '../LanguageContext';

const CHATBOT_NAME = 'Rhythm Bot';
const BOTPRESS_BOOTSTRAP = {
  botId: 'e33f9565-900e-474f-b40a-da6c35d6b7ea',
  clientId: 'd92ef0b3-3ae9-4997-a4ac-1189142551bb',
  configuration: {
    version: 'v2',
    botName: CHATBOT_NAME,
    botAvatar: 'https://files.bpcontent.cloud/2026/02/22/04/20260222041448-ZF5K2EEA.jpeg',
    botDescription: 'Provide support for our website, such as questions about FAQ, Blogs, order status and etc.',
    fabImage: 'https://files.bpcontent.cloud/2026/02/22/04/20260222041448-ZF5K2EEA.jpeg',
    website: {},
    email: {},
    phone: {},
    termsOfService: {},
    privacyPolicy: {},
    color: '#525252',
    variant: 'solid',
    headerVariant: 'glass',
    themeMode: 'light',
    fontFamily: 'inter',
    radius: 2.5,
    feedbackEnabled: false,
    footer: '[⚡ by Botpress](https://botpress.com/?from=webchat)',
    storageLocation: 'sessionStorage',
    soundEnabled: false,
    showFab: true,
    proactiveMessageEnabled: false,
    proactiveBubbleMessage: 'Hi! 👋 Need help?',
    proactiveBubbleTriggerType: 'afterDelay',
    proactiveBubbleDelayTime: 10,
    conversationHistory: false
  }
};

const LANGUAGE_COPY = {
  en: {
    composerPlaceholder: 'Type your message...',
    proactiveBubbleMessage: 'Hi! 👋 Need help?',
    botDescription: 'Provide support for our website, such as questions about FAQ, Blogs, order status and etc.'
  },
  de: {
    composerPlaceholder: 'Geben Sie Ihre Nachricht ein...',
    proactiveBubbleMessage: 'Hallo! 👋 Brauchen Sie Hilfe?',
    botDescription: 'Bietet Unterstützung für unsere Website, z. B. bei Fragen zu FAQ, Blogs, Bestellstatus usw.'
  },
  fr: {
    composerPlaceholder: 'Saisissez votre message...',
    proactiveBubbleMessage: 'Bonjour ! 👋 Besoin d’aide ?',
    botDescription: 'Fournit une assistance pour notre site web, notamment pour les questions sur la FAQ, les blogs, le statut des commandes, etc.'
  },
  es: {
    composerPlaceholder: 'Escribe tu mensaje...',
    proactiveBubbleMessage: '¡Hola! 👋 ¿Necesitas ayuda?',
    botDescription: 'Brinda soporte para nuestro sitio web, como preguntas sobre FAQ, blogs, estado del pedido, etc.'
  },
  ja: {
    composerPlaceholder: 'メッセージを入力してください...',
    proactiveBubbleMessage: 'こんにちは！👋 お困りですか？',
    botDescription: '当サイトのサポートを提供します。FAQ、ブログ、注文状況などに関するご質問に対応します。'
  },
  zh: {
    composerPlaceholder: '请输入您的消息...',
    proactiveBubbleMessage: '您好！👋 需要帮助吗？',
    botDescription: '为我们的网站提供支持，例如解答常见问题、博客、订单状态等相关问题。'
  },
  'zh-hant': {
    composerPlaceholder: '請輸入您的訊息...',
    proactiveBubbleMessage: '您好！👋 需要協助嗎？',
    botDescription: '為我們的網站提供支援，例如解答常見問題、部落格、訂單狀態等相關問題。'
  },
  pt: {
    composerPlaceholder: 'Digite sua mensagem...',
    proactiveBubbleMessage: 'Olá! 👋 Precisa de ajuda?',
    botDescription: 'Fornece suporte para o nosso site, como dúvidas sobre FAQ, blogs, estado do pedido, etc.'
  },
  hi: {
    composerPlaceholder: 'अपना संदेश लिखें...',
    proactiveBubbleMessage: 'नमस्ते! 👋 मदद चाहिए?',
    botDescription: 'हमारी वेबसाइट के लिए सहायता प्रदान करता है, जैसे FAQ, ब्लॉग, ऑर्डर स्थिति आदि से जुड़े प्रश्न।'
  },
  th: {
    composerPlaceholder: 'พิมพ์ข้อความของคุณ...',
    proactiveBubbleMessage: 'สวัสดี! 👋 ต้องการความช่วยเหลือไหม?',
    botDescription: 'ให้การสนับสนุนเว็บไซต์ของเรา เช่น คำถามเกี่ยวกับ FAQ บล็อก สถานะคำสั่งซื้อ เป็นต้น'
  },
  ms: {
    composerPlaceholder: 'Taip mesej anda...',
    proactiveBubbleMessage: 'Hai! 👋 Perlukan bantuan?',
    botDescription: 'Memberi sokongan untuk laman web kami, seperti soalan tentang FAQ, blog, status pesanan dan sebagainya.'
  },
  nl: {
    composerPlaceholder: 'Typ je bericht...',
    proactiveBubbleMessage: 'Hoi! 👋 Hulp nodig?',
    botDescription: 'Biedt ondersteuning voor onze website, zoals vragen over FAQ, blogs, bestelstatus enzovoort.'
  },
  id: {
    composerPlaceholder: 'Ketik pesan Anda...',
    proactiveBubbleMessage: 'Hai! 👋 Butuh bantuan?',
    botDescription: 'Memberikan dukungan untuk situs web kami, seperti pertanyaan tentang FAQ, blog, status pesanan, dan lain-lain.'
  },
  cs: {
    composerPlaceholder: 'Napište svou zprávu...',
    proactiveBubbleMessage: 'Ahoj! 👋 Potřebujete pomoc?',
    botDescription: 'Poskytuje podporu pro náš web, například dotazy ohledně FAQ, blogů, stavu objednávky atd.'
  },
  it: {
    composerPlaceholder: 'Scrivi il tuo messaggio...',
    proactiveBubbleMessage: 'Ciao! 👋 Hai bisogno di aiuto?',
    botDescription: 'Fornisce supporto per il nostro sito web, ad esempio per domande su FAQ, blog, stato dell’ordine, ecc.'
  },
  he: {
    composerPlaceholder: 'הקלד את ההודעה שלך...',
    proactiveBubbleMessage: 'היי! 👋 צריך עזרה?',
    botDescription: 'מספק תמיכה לאתר שלנו, כגון שאלות על שאלות נפוצות, בלוגים, מצב הזמנה ועוד.'
  },
  ga: {
    composerPlaceholder: 'Clóscríobh do theachtaireacht...',
    proactiveBubbleMessage: 'Dia duit! 👋 Cabhair uait?',
    botDescription: 'Soláthraíonn sé tacaíocht dár suíomh gréasáin, amhail ceisteanna faoi CCanna, blaganna, stádas ordaithe agus araile.'
  },
  pl: {
    composerPlaceholder: 'Wpisz swoją wiadomość...',
    proactiveBubbleMessage: 'Cześć! 👋 Potrzebujesz pomocy?',
    botDescription: 'Zapewnia wsparcie dla naszej strony internetowej, np. w pytaniach dotyczących FAQ, blogów, statusu zamówienia itp.'
  },
  ko: {
    composerPlaceholder: '메시지를 입력하세요...',
    proactiveBubbleMessage: '안녕하세요! 👋 도움이 필요하신가요?',
    botDescription: 'FAQ, 블로그, 주문 상태 등 웹사이트 관련 문의를 지원합니다.'
  },
  mi: {
    composerPlaceholder: 'Tāurua tō karere...',
    proactiveBubbleMessage: 'Kia ora! 👋 Me āwhina koe?',
    botDescription: 'Ka tautoko i tō mātou paetukutuku, pērā i ngā pātai mō ngā FAQ, ngā rangitaki, te tūnga ota, me ērā atu mea.'
  },
  no: {
    composerPlaceholder: 'Skriv meldingen din...',
    proactiveBubbleMessage: 'Hei! 👋 Trenger du hjelp?',
    botDescription: 'Gir støtte for nettstedet vårt, for eksempel spørsmål om FAQ, blogger, ordrestatus osv.'
  },
  ru: {
    composerPlaceholder: 'Введите ваше сообщение...',
    proactiveBubbleMessage: 'Здравствуйте! 👋 Нужна помощь?',
    botDescription: 'Оказывает поддержку по нашему сайту, включая вопросы по FAQ, блогам, статусу заказа и т. д.'
  },
  sv: {
    composerPlaceholder: 'Skriv ditt meddelande...',
    proactiveBubbleMessage: 'Hej! 👋 Behöver du hjälp?',
    botDescription: 'Ger support för vår webbplats, till exempel frågor om FAQ, bloggar, orderstatus och så vidare.'
  },
  fi: {
    composerPlaceholder: 'Kirjoita viestisi...',
    proactiveBubbleMessage: 'Hei! 👋 Tarvitsetko apua?',
    botDescription: 'Tarjoaa tukea verkkosivustollemme, kuten kysymyksiä FAQ:sta, blogeista, tilauksen tilasta jne.'
  },
  tl: {
    composerPlaceholder: 'I-type ang iyong mensahe...',
    proactiveBubbleMessage: 'Hi! 👋 Kailangan mo ng tulong?',
    botDescription: 'Nagbibigay ng suporta para sa aming website, tulad ng mga tanong tungkol sa FAQ, blogs, status ng order, atbp.'
  },
  vi: {
    composerPlaceholder: 'Nhập tin nhắn của bạn...',
    proactiveBubbleMessage: 'Xin chào! 👋 Bạn cần trợ giúp không?',
    botDescription: 'Cung cấp hỗ trợ cho trang web của chúng tôi, chẳng hạn như các câu hỏi về FAQ, blog, trạng thái đơn hàng, v.v.'
  },
  cy: {
    composerPlaceholder: 'Teipiwch eich neges...',
    proactiveBubbleMessage: 'Helo! 👋 Oes angen help arnoch?',
    botDescription: 'Mae’n darparu cymorth i’n gwefan, megis cwestiynau am Cwestiynau Cyffredin, blogiau, statws archeb, ac ati.'
  },
  ta: {
    composerPlaceholder: 'உங்கள் செய்தியை உள்ளிடவும்...',
    proactiveBubbleMessage: 'வணக்கம்! 👋 உதவி வேண்டுமா?',
    botDescription: 'எங்கள் வலைத்தளத்திற்கான ஆதரவை வழங்குகிறது; உதாரணமாக FAQ, வலைப்பதிவுகள், ஆர்டர் நிலை போன்ற கேள்விகள்.'
  }
};

const LANGUAGE_TO_BOTPRESS_LOCALE = {
  en: 'en',
  de: 'de-DE',
  fr: 'fr-FR',
  es: 'es-ES',
  ja: 'ja',
  zh: 'zh-CN',
  'zh-hant': 'zh-TW',
  pt: 'pt-PT',
  hi: 'hi',
  th: 'th',
  ms: 'ms',
  nl: 'nl-NL',
  id: 'id',
  cs: 'cs',
  it: 'it-IT',
  he: 'he',
  ga: 'ga',
  pl: 'pl-PL',
  ko: 'ko',
  mi: 'mi',
  no: 'nb-NO',
  ru: 'ru-RU',
  sv: 'sv-SE',
  fi: 'fi-FI',
  tl: 'tl',
  vi: 'vi',
  cy: 'cy',
  ta: 'ta'
};

const getBotpressLocale = (languageCode) => LANGUAGE_TO_BOTPRESS_LOCALE[languageCode] || 'en';
const getLanguageCopy = (languageCode) => LANGUAGE_COPY[languageCode] || LANGUAGE_COPY.en;

export function ChatbotWidget() {
  const enabled = process.env.NEXT_PUBLIC_CHATBOT_ENABLED !== 'false';
  const [injectLoaded, setInjectLoaded] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    if (!injectLoaded) {
      return;
    }

    const nextLocale = getBotpressLocale(language);
    const nextCopy = getLanguageCopy(language);
    const applyLanguageToBotpress = () => {
      if (typeof window === 'undefined' || !window.botpress) {
        return;
      }

      if (!window.__rhythmBotpressInitialized && typeof window.botpress.init === 'function') {
        window.botpress.init({
          ...BOTPRESS_BOOTSTRAP,
          configuration: {
            ...BOTPRESS_BOOTSTRAP.configuration,
            botName: CHATBOT_NAME,
            locale: nextLocale,
            language: nextLocale,
            showFab: true,
            botDescription: nextCopy.botDescription,
            composerPlaceholder: nextCopy.composerPlaceholder,
            proactiveBubbleMessage: nextCopy.proactiveBubbleMessage
          }
        });
        window.__rhythmBotpressInitialized = true;
      }

      if (typeof window.botpress.config === 'function') {
        window.botpress.config({
          configuration: {
            botName: CHATBOT_NAME,
            locale: nextLocale,
            language: nextLocale,
            showFab: true,
            botDescription: nextCopy.botDescription,
            composerPlaceholder: nextCopy.composerPlaceholder,
            proactiveBubbleMessage: nextCopy.proactiveBubbleMessage
          }
        });
      }

      if (typeof window.botpress.updateUser === 'function') {
        window.botpress.updateUser({
          data: {
            preferredLanguage: language,
            preferredLocale: nextLocale
          }
        }).catch(() => {});
      }

      if (typeof window.botpress.sendEvent === 'function') {
        window.botpress.sendEvent({
          type: 'language_changed',
          language,
          locale: nextLocale
        }).catch(() => {});
      }
    };

    let removeInitializedListener;
    if (typeof window !== 'undefined' && window.botpress && typeof window.botpress.on === 'function') {
      removeInitializedListener = window.botpress.on('webchat:initialized', applyLanguageToBotpress);
    }

    applyLanguageToBotpress();

    const syncChatbotName = () => {
      const targets = document.querySelectorAll('.bpFabWrapper *, .bpWebchat *');

      targets.forEach((node) => {
        if (!(node instanceof HTMLElement)) {
          return;
        }

        if (node.children.length === 0) {
          const text = (node.textContent || '').trim();
          if (/^24\/7\s*chatbot$/i.test(text)) {
            node.textContent = CHATBOT_NAME;
          }
        }

        const aria = node.getAttribute('aria-label');
        if (aria && /24\/7\s*chatbot/i.test(aria)) {
          node.setAttribute('aria-label', aria.replace(/24\/7\s*chatbot/gi, CHATBOT_NAME));
        }
      });
    };

    syncChatbotName();
    const observer = new MutationObserver(syncChatbotName);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      if (typeof removeInitializedListener === 'function') {
        removeInitializedListener();
      }
    };
  }, [injectLoaded, language]);

  if (!enabled) {
    return null;
  }

  return (
    <>
      <Script
        src="https://cdn.botpress.cloud/webchat/v3.6/inject.js"
        strategy="afterInteractive"
        onLoad={() => setInjectLoaded(true)}
      />
    </>
  );
}

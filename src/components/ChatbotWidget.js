'use client';

import { useEffect, useMemo, useState } from 'react';
import styles from './ChatbotWidget.module.css';
import { useLanguage } from '../LanguageContext';

const CHATBOT_NAME = 'Rhythm Bot';

const CHATBOT_WELCOME_TRANSLATIONS = {
  en: 'Hi, I am Rhythm Bot, your 24/7 AI virtual assistant. How can I assist you?',
  de: 'Hallo, ich bin Rhythm Bot, Ihr 24/7 KI-virtueller Assistent. Wie kann ich Ihnen helfen?',
  fr: 'Bonjour, je suis Rhythm Bot, votre assistant virtuel IA 24h/24 et 7j/7. Comment puis-je vous aider ?',
  es: 'Hola, soy Rhythm Bot, tu asistente virtual de IA 24/7. ¿Cómo puedo ayudarte?',
  ja: 'こんにちは。私は Rhythm Bot、24時間年中無休のAIバーチャルアシスタントです。どのようにお手伝いできますか？',
  zh: '您好，我是 Rhythm Bot，您的 24/7 AI 虚拟助手。请问我可以如何帮助您？',
  'zh-hant': '您好，我是 Rhythm Bot，您的 24/7 AI 虛擬助理。請問我可以如何協助您？',
  pt: 'Olá, sou o Rhythm Bot, seu assistente virtual de IA 24/7. Como posso ajudar você?',
  hi: 'नमस्ते, मैं Rhythm Bot हूँ, आपका 24/7 AI वर्चुअल असिस्टेंट। मैं आपकी कैसे सहायता कर सकता हूँ?',
  th: 'สวัสดี ฉันคือ Rhythm Bot ผู้ช่วยเสมือน AI ของคุณตลอด 24/7 ฉันช่วยอะไรคุณได้บ้าง?',
  ms: 'Hai, saya Rhythm Bot, pembantu maya AI anda 24/7. Bagaimana saya boleh membantu anda?',
  nl: 'Hoi, ik ben Rhythm Bot, je 24/7 AI-virtuele assistent. Hoe kan ik je helpen?',
  id: 'Hai, saya Rhythm Bot, asisten virtual AI Anda 24/7. Bagaimana saya dapat membantu Anda?',
  cs: 'Dobrý den, jsem Rhythm Bot, váš 24/7 AI virtuální asistent. Jak vám mohu pomoci?',
  it: 'Ciao, sono Rhythm Bot, il tuo assistente virtuale AI 24/7. Come posso aiutarti?',
  he: 'היי, אני Rhythm Bot, העוזר הווירטואלי מבוסס AI שלך 24/7. איך אפשר לעזור לך?',
  ga: 'Dia dhuit, is mise Rhythm Bot, do chúntóir fíorúil AI 24/7. Conas is féidir liom cabhrú leat?',
  pl: 'Cześć, jestem Rhythm Bot, Twoim wirtualnym asystentem AI 24/7. Jak mogę Ci pomóc?',
  ko: '안녕하세요, 저는 24/7 AI 가상 비서 Rhythm Bot입니다. 무엇을 도와드릴까요?',
  mi: 'Kia ora, ko Rhythm Bot ahau, tō kaiāwhina mariko AI 24/7. Me pēhea ahau e āwhina ai i a koe?',
  no: 'Hei, jeg er Rhythm Bot, din 24/7 AI-virtuelle assistent. Hvordan kan jeg hjelpe deg?',
  ru: 'Здравствуйте, я Rhythm Bot, ваш виртуальный ИИ-помощник 24/7. Чем я могу помочь?',
  sv: 'Hej, jag är Rhythm Bot, din AI-virtuella assistent 24/7. Hur kan jag hjälpa dig?',
  fi: 'Hei, olen Rhythm Bot, 24/7 AI-virtuaaliavustajasi. Kuinka voin auttaa sinua?',
  tl: 'Hi, ako si Rhythm Bot, ang iyong 24/7 AI virtual assistant. Paano kita matutulungan?',
  vi: 'Xin chào, tôi là Rhythm Bot, trợ lý ảo AI 24/7 của bạn. Tôi có thể hỗ trợ bạn như thế nào?',
  cy: 'Helo, fi yw Rhythm Bot, eich cynorthwyydd rhithwir AI 24/7. Sut alla i eich helpu?',
  ta: 'வணக்கம், நான் Rhythm Bot, உங்கள் 24/7 AI மெய்நிகர் உதவியாளர். நான் உங்களுக்கு எப்படி உதவலாம்?'
};

const CHATBOT_UI_TRANSLATIONS = {
  en: { placeholder: 'Type your message...', send: 'Send', thinking: 'Thinking…', subtitle: '24/7 AI virtual assistant' },
  de: { placeholder: 'Geben Sie Ihre Nachricht ein...', send: 'Senden', thinking: 'Denkt nach…', subtitle: '24/7 KI-virtueller Assistent' },
  fr: { placeholder: 'Saisissez votre message...', send: 'Envoyer', thinking: 'Réflexion…', subtitle: 'Assistant virtuel IA 24h/24 et 7j/7' },
  es: { placeholder: 'Escribe tu mensaje...', send: 'Enviar', thinking: 'Pensando…', subtitle: 'Asistente virtual de IA 24/7' },
  ja: { placeholder: 'メッセージを入力してください...', send: '送信', thinking: '考え中…', subtitle: '24時間年中無休のAIバーチャルアシスタント' },
  zh: { placeholder: '请输入您的消息...', send: '发送', thinking: '思考中…', subtitle: '24/7 AI 虚拟助手' },
  'zh-hant': { placeholder: '請輸入您的訊息...', send: '傳送', thinking: '思考中…', subtitle: '24/7 AI 虛擬助理' },
  pt: { placeholder: 'Digite sua mensagem...', send: 'Enviar', thinking: 'Pensando…', subtitle: 'Assistente virtual de IA 24/7' },
  hi: { placeholder: 'अपना संदेश लिखें...', send: 'भेजें', thinking: 'सोच रहा है…', subtitle: '24/7 AI वर्चुअल असिस्टेंट' },
  th: { placeholder: 'พิมพ์ข้อความของคุณ...', send: 'ส่ง', thinking: 'กำลังคิด…', subtitle: 'ผู้ช่วยเสมือน AI ตลอด 24/7' },
  ms: { placeholder: 'Taip mesej anda...', send: 'Hantar', thinking: 'Sedang berfikir…', subtitle: 'Pembantu maya AI 24/7' },
  nl: { placeholder: 'Typ je bericht...', send: 'Verzenden', thinking: 'Denkt na…', subtitle: '24/7 AI-virtuele assistent' },
  id: { placeholder: 'Ketik pesan Anda...', send: 'Kirim', thinking: 'Sedang berpikir…', subtitle: 'Asisten virtual AI 24/7' },
  cs: { placeholder: 'Napište svou zprávu...', send: 'Odeslat', thinking: 'Přemýšlím…', subtitle: '24/7 AI virtuální asistent' },
  it: { placeholder: 'Scrivi il tuo messaggio...', send: 'Invia', thinking: 'Sto pensando…', subtitle: 'Assistente virtuale AI 24/7' },
  he: { placeholder: 'הקלד את ההודעה שלך...', send: 'שלח', thinking: 'חושב…', subtitle: 'עוזר וירטואלי AI זמין 24/7' },
  ga: { placeholder: 'Clóscríobh do theachtaireacht...', send: 'Seol', thinking: 'Ag smaoineamh…', subtitle: 'Cúntóir fíorúil AI 24/7' },
  pl: { placeholder: 'Wpisz swoją wiadomość...', send: 'Wyślij', thinking: 'Myślę…', subtitle: 'Wirtualny asystent AI 24/7' },
  ko: { placeholder: '메시지를 입력하세요...', send: '보내기', thinking: '생각 중…', subtitle: '24/7 AI 가상 비서' },
  mi: { placeholder: 'Tāurua tō karere...', send: 'Tuku', thinking: 'Kei te whakaaro…', subtitle: 'Kaiāwhina mariko AI 24/7' },
  no: { placeholder: 'Skriv meldingen din...', send: 'Send', thinking: 'Tenker…', subtitle: '24/7 AI-virtuell assistent' },
  ru: { placeholder: 'Введите ваше сообщение...', send: 'Отправить', thinking: 'Думаю…', subtitle: 'Виртуальный ИИ-помощник 24/7' },
  sv: { placeholder: 'Skriv ditt meddelande...', send: 'Skicka', thinking: 'Tänker…', subtitle: 'AI-virtuell assistent 24/7' },
  fi: { placeholder: 'Kirjoita viestisi...', send: 'Lähetä', thinking: 'Mietin…', subtitle: '24/7 AI-virtuaaliavustaja' },
  tl: { placeholder: 'I-type ang iyong mensahe...', send: 'Ipadala', thinking: 'Nag-iisip…', subtitle: '24/7 AI virtual assistant' },
  vi: { placeholder: 'Nhập tin nhắn của bạn...', send: 'Gửi', thinking: 'Đang suy nghĩ…', subtitle: 'Trợ lý ảo AI 24/7' },
  cy: { placeholder: 'Teipiwch eich neges...', send: 'Anfon', thinking: 'Yn meddwl…', subtitle: 'Cynorthwyydd rhithwir AI 24/7' },
  ta: { placeholder: 'உங்கள் செய்தியை உள்ளிடவும்...', send: 'அனுப்பு', thinking: 'சிந்திக்கிறது…', subtitle: '24/7 AI மெய்நிகர் உதவியாளர்' }
};

const normalizeChatText = (value) => {
  if (typeof value !== 'string') return '';

  return value
    .replace(/\\n/g, '\n')
    .replace(/\\"/g, '"')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/`{1,3}([^`]+)`{1,3}/g, '$1');
};

export function ChatbotWidget() {
  const enabled = process.env.NEXT_PUBLIC_CHATBOT_ENABLED !== 'false';
  const title = process.env.NEXT_PUBLIC_CHATBOT_TITLE || CHATBOT_NAME;
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: CHATBOT_WELCOME_TRANSLATIONS[language] || CHATBOT_WELCOME_TRANSLATIONS.en
    }
  ]);

  const history = useMemo(
    () => messages.map((item) => ({ role: item.role, content: item.content })),
    [messages]
  );
  const uiText = CHATBOT_UI_TRANSLATIONS[language] || CHATBOT_UI_TRANSLATIONS.en;

  useEffect(() => {
    const localizedWelcome = CHATBOT_WELCOME_TRANSLATIONS[language] || CHATBOT_WELCOME_TRANSLATIONS.en;
    setMessages((prev) => {
      if (!prev.length) {
        return [{ role: 'assistant', content: localizedWelcome }];
      }

      if (prev.length === 1 && prev[0].role === 'assistant') {
        return [{ role: 'assistant', content: localizedWelcome }];
      }

      return prev;
    });
  }, [language]);

  if (!enabled) {
    return null;
  }

  const submitMessage = async (event) => {
    event.preventDefault();
    const nextMessage = input.trim();
    if (!nextMessage || isLoading) return;

    const userMessage = { role: 'user', content: nextMessage };
    const nextHistory = [...history, userMessage];

    setError('');
    setInput('');
    setIsLoading(true);
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: nextMessage, history: nextHistory.slice(-12) })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || 'Unable to reach assistant.');
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: normalizeChatText(data.reply) }]);
    } catch (submitError) {
      setError(submitError.message || 'Unable to reach assistant.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isOpen ? (
        <div className={styles.panel} role="dialog" aria-label={title}>
          <div className={styles.header}>
            <div className={styles.headerTitleWrap}>
              <img src="/logo.jpg" alt="Rhythm Bot logo" className={styles.headerLogo} />
              <div className={styles.headerTitle}>{title}</div>
            </div>
            <div className={styles.headerSubtitle}>{uiText.subtitle}</div>
          </div>
          <div className={styles.messages}>
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`${styles.messageRow} ${message.role === 'user' ? styles.messageRowUser : ''}`}
              >
                {message.role === 'assistant' ? <img src="/logo.jpg" alt="Rhythm Bot logo" className={styles.avatar} /> : null}
                <div className={`${styles.bubble} ${message.role === 'user' ? styles.user : styles.assistant}`}>
                  {normalizeChatText(message.content)}
                </div>
              </div>
            ))}
            {isLoading ? (
              <div className={styles.messageRow}>
                <img src="/logo.jpg" alt="Rhythm Bot logo" className={styles.avatar} />
                <div className={`${styles.bubble} ${styles.assistant}`}>{uiText.thinking}</div>
              </div>
            ) : null}
          </div>
          {error ? <div className={styles.error}>{error}</div> : null}
          <form className={styles.form} onSubmit={submitMessage}>
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              className={styles.input}
              placeholder={uiText.placeholder}
              disabled={isLoading}
              maxLength={2000}
            />
            <button type="submit" className={styles.send} disabled={isLoading || !input.trim()}>
              {uiText.send}
            </button>
          </form>
        </div>
      ) : null}

      <button
        type="button"
        className={styles.launcher}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? 'Close chatbot' : 'Open chatbot'}
      >
        {isOpen ? (
          '×'
        ) : (
          <span className={styles.launcherInner}>
            <img src="/logo.jpg" alt="Rhythm Bot logo" className={styles.launcherLogo} />
            <span>Rhythm Bot</span>
          </span>
        )}
      </button>
    </>
  );
}

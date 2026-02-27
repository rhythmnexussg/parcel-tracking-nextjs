'use client';

import React from "react";
import { useRouter } from "next/navigation";
import "../../../App.css";
import { useLanguage } from "../../../LanguageContext";
import { Navigation } from "../../../components/Navigation";

function BackButton() {
  const { t } = useLanguage();
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className="back-button"
    >
      <span>&larr;</span> {t('backButton')}
    </button>
  );
}

const BlogPageLayout = ({ children }) => {
  const { t } = useLanguage();
  return (
    <>
      <Navigation />
      <div className="container mt-5">
        <BackButton />
        <div className="blog-content-card">
          {children}
        </div>
        <p className="text-muted">© {new Date().getFullYear()} Rhythm Nexus. {t('copyrightText')}</p>
      </div>
    </>
  );
};

const BLOG_USA_SECTION_122_I18N = {
  en: {
    title: 'USA Section 122 Shipping Update',
    intro: 'We are issuing an operational update for shipments to the United States following new tariff policy changes under Section 122.',
    changesTitle: 'What changes now',
    change1: 'A 10% handling fee applies to shipments addressed to the USA.',
    change2: 'A separate 10% tariff-related surcharge applies to all items.',
    effectiveTitle: 'Effective date',
    effectiveText: 'These adjustments are effective immediately and are aligned with Section 122 implementation from today.',
    nextTitle: 'What to expect next',
    nextText: 'If policy conditions continue to change, shipping costs to the USA may be revised again. We will keep pricing updates transparent so service can continue without unsustainable losses.',
    thanks: 'Thank you for your continued support.',
  },
  de: {
    title: 'USA Versand-Update zu Section 122',
    intro: 'Wir veröffentlichen ein Betriebs-Update für Sendungen in die USA aufgrund neuer Zollrichtlinien gemäß Section 122.',
    changesTitle: 'Was sich jetzt ändert',
    change1: 'Für Sendungen in die USA gilt eine Bearbeitungsgebühr von 10%.',
    change2: 'Zusätzlich gilt ein separater tarifbezogener Zuschlag von 10% auf alle Artikel.',
    effectiveTitle: 'Gültigkeitsdatum',
    effectiveText: 'Diese Anpassungen gelten ab sofort und entsprechen der heutigen Umsetzung von Section 122.',
    nextTitle: 'Was als Nächstes zu erwarten ist',
    nextText: 'Wenn sich die Richtlinien weiter ändern, können die Versandkosten in die USA erneut angepasst werden. Wir halten Preisänderungen transparent, damit der Service ohne nicht tragbare Verluste fortgeführt werden kann.',
    thanks: 'Vielen Dank für Ihre fortlaufende Unterstützung.',
  },
  fr: {
    title: 'Mise à jour USA Section 122',
    intro: 'Nous publions une mise à jour opérationnelle pour les envois vers les États-Unis suite aux nouvelles politiques tarifaires liées à la Section 122.',
    changesTitle: 'Ce qui change maintenant',
    change1: 'Des frais de traitement de 10 % s’appliquent aux envois à destination des États-Unis.',
    change2: 'Un supplément distinct de 10 % lié aux tarifs s’applique à tous les articles.',
    effectiveTitle: 'Date d’effet',
    effectiveText: 'Ces ajustements prennent effet immédiatement et sont alignés sur l’entrée en vigueur de la Section 122 à compter d’aujourd’hui.',
    nextTitle: 'À quoi s’attendre ensuite',
    nextText: 'Si les politiques continuent d’évoluer, les coûts d’expédition vers les États-Unis pourront être révisés à nouveau. Nous maintiendrons des mises à jour tarifaires transparentes afin de poursuivre le service sans pertes non durables.',
    thanks: 'Merci pour votre soutien continu.',
  },
  es: {
    title: 'Actualización de envíos a EE. UU. – Sección 122',
    intro: 'Publicamos una actualización operativa para envíos a Estados Unidos tras nuevos cambios arancelarios bajo la Sección 122.',
    changesTitle: 'Qué cambia ahora',
    change1: 'Se aplica una tarifa de gestión del 10% a los envíos con destino a EE. UU.',
    change2: 'Además, se aplica un recargo separado del 10% relacionado con aranceles a todos los artículos.',
    effectiveTitle: 'Fecha de entrada en vigor',
    effectiveText: 'Estos ajustes entran en vigor de inmediato y están alineados con la implementación de la Sección 122 desde hoy.',
    nextTitle: 'Qué esperar a continuación',
    nextText: 'Si las políticas siguen cambiando, los costos de envío a EE. UU. pueden volver a ajustarse. Mantendremos las actualizaciones de tarifas de forma transparente para continuar operando sin pérdidas insostenibles.',
    thanks: 'Gracias por su apoyo continuo.',
  },
  ja: {
    title: '米国向け配送：Section 122 更新',
    intro: 'Section 122 に基づく新しい関税方針の変更に伴い、米国向け配送の運用更新をお知らせします。',
    changesTitle: '現在の変更点',
    change1: '米国宛ての発送には 10% の取扱手数料が適用されます。',
    change2: 'すべての商品に対して、関税関連の追加料金 10% が別途適用されます。',
    effectiveTitle: '適用開始日',
    effectiveText: 'これらの調整は本日より直ちに有効で、Section 122 の実施に準拠しています。',
    nextTitle: '今後の見通し',
    nextText: '政策条件がさらに変化した場合、米国向け送料が再度改定される可能性があります。運営を持続可能に保つため、料金更新は透明性をもってご案内します。',
    thanks: '引き続きご支援いただきありがとうございます。',
  },
  zh: {
    title: '美国 Section 122 运输更新',
    intro: '根据 Section 122 最新关税政策变化，我们发布针对美国目的地运输的运营更新。',
    changesTitle: '当前变更内容',
    change1: '发往美国的包裹将收取 10% 处理费。',
    change2: '所有商品将额外收取 10% 关税相关附加费。',
    effectiveTitle: '生效日期',
    effectiveText: '以上调整即日起生效，并与今日实施的 Section 122 保持一致。',
    nextTitle: '后续可能情况',
    nextText: '若政策继续变化，发往美国的运费可能再次调整。我们将保持价格更新透明，以便在不产生不可持续亏损的前提下继续运营。',
    thanks: '感谢您的持续支持。',
  },
  'zh-hant': {
    title: '美國 Section 122 運輸更新',
    intro: '因應 Section 122 最新關稅政策變更，我們發布美國目的地出貨的營運更新。',
    changesTitle: '目前變更內容',
    change1: '寄往美國的包裹將收取 10% 處理費。',
    change2: '所有商品另加 10% 關稅相關附加費。',
    effectiveTitle: '生效日期',
    effectiveText: '上述調整即日起生效，並與今日開始實施的 Section 122 一致。',
    nextTitle: '後續可能變動',
    nextText: '若政策持續變動，寄往美國的運費可能再次調整。我們將維持透明的價格更新，以確保服務可持續運作。',
    thanks: '感謝您持續支持。',
  },
  pt: {
    title: 'Atualização de envio para os EUA – Seção 122',
    intro: 'Estamos emitindo uma atualização operacional para envios aos Estados Unidos após novas alterações tarifárias sob a Seção 122.',
    changesTitle: 'O que muda agora',
    change1: 'Aplica-se uma taxa de manuseio de 10% aos envios destinados aos EUA.',
    change2: 'Aplica-se também um acréscimo separado de 10% relacionado a tarifas em todos os itens.',
    effectiveTitle: 'Data de vigência',
    effectiveText: 'Esses ajustes entram em vigor imediatamente e estão alinhados com a implementação da Seção 122 a partir de hoje.',
    nextTitle: 'O que esperar em seguida',
    nextText: 'Se as condições de política continuarem mudando, os custos de envio para os EUA poderão ser revisados novamente. Manteremos as atualizações de preços transparentes para continuar operando sem perdas insustentáveis.',
    thanks: 'Obrigado pelo seu apoio contínuo.',
  },
  hi: {
    title: 'यूएसए Section 122 शिपिंग अपडेट',
    intro: 'Section 122 के तहत नए टैरिफ नीति बदलावों के बाद, हम संयुक्त राज्य अमेरिका के लिए शिपमेंट पर एक परिचालन अपडेट जारी कर रहे हैं।',
    changesTitle: 'अब क्या बदलाव हैं',
    change1: 'यूएसए गंतव्य वाले शिपमेंट पर 10% हैंडलिंग शुल्क लागू होगा।',
    change2: 'सभी आइटम्स पर अलग से 10% टैरिफ-संबंधित अधिभार लागू होगा।',
    effectiveTitle: 'प्रभावी तिथि',
    effectiveText: 'ये समायोजन तुरंत प्रभाव से लागू हैं और आज से लागू Section 122 के अनुरूप हैं।',
    nextTitle: 'आगे क्या अपेक्षा करें',
    nextText: 'यदि नीतिगत स्थिति बदलती रहती है, तो यूएसए शिपिंग लागत फिर से संशोधित हो सकती है। हम मूल्य अपडेट पारदर्शी रखेंगे ताकि सेवा बिना अस्थिर घाटे के जारी रह सके।',
    thanks: 'आपके निरंतर सहयोग के लिए धन्यवाद।',
  },
  th: {
    title: 'อัปเดตการจัดส่งไปสหรัฐฯ ตาม Section 122',
    intro: 'เราขอแจ้งอัปเดตด้านการดำเนินงานสำหรับการจัดส่งไปยังสหรัฐอเมริกา หลังมีการเปลี่ยนแปลงนโยบายภาษีภายใต้ Section 122',
    changesTitle: 'สิ่งที่เปลี่ยนแปลงตอนนี้',
    change1: 'มีค่าดำเนินการ 10% สำหรับพัสดุปลายทางสหรัฐอเมริกา',
    change2: 'มีค่าปรับเพิ่มที่เกี่ยวข้องกับภาษีอีก 10% สำหรับสินค้าทุกรายการ',
    effectiveTitle: 'วันที่มีผลบังคับใช้',
    effectiveText: 'การปรับดังกล่าวมีผลทันที และสอดคล้องกับการบังคับใช้ Section 122 ตั้งแต่วันนี้',
    nextTitle: 'สิ่งที่คาดว่าจะเกิดขึ้นต่อไป',
    nextText: 'หากเงื่อนไขนโยบายยังเปลี่ยนแปลงต่อเนื่อง ค่าจัดส่งไปสหรัฐฯ อาจมีการปรับอีกครั้ง เราจะสื่อสารการปรับราคาอย่างโปร่งใสเพื่อให้บริการดำเนินต่อได้อย่างยั่งยืน',
    thanks: 'ขอบคุณสำหรับการสนับสนุนอย่างต่อเนื่อง',
  },
  ms: {
    title: 'Kemas kini penghantaran USA Seksyen 122',
    intro: 'Kami mengeluarkan kemas kini operasi untuk penghantaran ke Amerika Syarikat susulan perubahan dasar tarif baharu di bawah Seksyen 122.',
    changesTitle: 'Perubahan semasa',
    change1: 'Yuran pengendalian 10% dikenakan untuk penghantaran ke USA.',
    change2: 'Satu lagi surcaj berasingan 10% berkaitan tarif dikenakan pada semua item.',
    effectiveTitle: 'Tarikh berkuat kuasa',
    effectiveText: 'Pelarasan ini berkuat kuasa serta-merta dan sejajar dengan pelaksanaan Seksyen 122 bermula hari ini.',
    nextTitle: 'Jangkaan seterusnya',
    nextText: 'Jika keadaan dasar terus berubah, kos penghantaran ke USA mungkin disemak semula. Kami akan mengekalkan kemas kini harga secara telus supaya perkhidmatan dapat diteruskan tanpa kerugian yang tidak mampan.',
    thanks: 'Terima kasih atas sokongan berterusan anda.',
  },
  nl: {
    title: 'USA Section 122 verzendupdate',
    intro: 'Wij delen een operationele update voor zendingen naar de Verenigde Staten na nieuwe tariefwijzigingen onder Section 122.',
    changesTitle: 'Wat er nu verandert',
    change1: 'Er geldt een verwerkingskosten van 10% voor zendingen naar de VS.',
    change2: 'Daarnaast geldt een aparte toeslag van 10% in verband met tarieven voor alle artikelen.',
    effectiveTitle: 'Ingangsdatum',
    effectiveText: 'Deze aanpassingen gaan direct in en zijn afgestemd op de invoering van Section 122 vanaf vandaag.',
    nextTitle: 'Wat u hierna kunt verwachten',
    nextText: 'Als beleidsvoorwaarden blijven veranderen, kunnen de verzendkosten naar de VS opnieuw worden aangepast. We houden prijsupdates transparant zodat de dienstverlening zonder onhoudbare verliezen kan doorgaan.',
    thanks: 'Dank u voor uw voortdurende steun.',
  },
  id: {
    title: 'Pembaruan pengiriman USA Section 122',
    intro: 'Kami mengeluarkan pembaruan operasional untuk pengiriman ke Amerika Serikat setelah perubahan kebijakan tarif terbaru berdasarkan Section 122.',
    changesTitle: 'Perubahan saat ini',
    change1: 'Biaya penanganan 10% berlaku untuk pengiriman tujuan USA.',
    change2: 'Biaya tambahan terpisah 10% terkait tarif berlaku untuk semua item.',
    effectiveTitle: 'Tanggal berlaku',
    effectiveText: 'Penyesuaian ini berlaku segera dan selaras dengan penerapan Section 122 mulai hari ini.',
    nextTitle: 'Perkiraan selanjutnya',
    nextText: 'Jika kondisi kebijakan terus berubah, biaya pengiriman ke USA dapat direvisi kembali. Kami akan menjaga pembaruan harga tetap transparan agar layanan dapat terus berjalan tanpa kerugian yang tidak berkelanjutan.',
    thanks: 'Terima kasih atas dukungan Anda yang berkelanjutan.',
  },
  cs: {
    title: 'Aktualizace dopravy do USA – Section 122',
    intro: 'Vydáváme provozní aktualizaci pro zásilky do Spojených států po nových změnách celní politiky podle Section 122.',
    changesTitle: 'Co se nyní mění',
    change1: 'Na zásilky do USA se vztahuje manipulační poplatek 10 %.',
    change2: 'Na všechny položky se navíc vztahuje samostatný 10% příplatek související s tarify.',
    effectiveTitle: 'Datum účinnosti',
    effectiveText: 'Tyto úpravy platí okamžitě a jsou v souladu s dnešním zavedením Section 122.',
    nextTitle: 'Co očekávat dál',
    nextText: 'Pokud se podmínky politiky budou dále měnit, náklady na dopravu do USA mohou být znovu upraveny. Aktualizace cen budeme zveřejňovat transparentně, aby bylo možné službu poskytovat bez neudržitelných ztrát.',
    thanks: 'Děkujeme za vaši trvalou podporu.',
  },
  it: {
    title: 'Aggiornamento spedizioni USA Section 122',
    intro: 'Stiamo pubblicando un aggiornamento operativo per le spedizioni verso gli Stati Uniti a seguito delle nuove modifiche tariffarie previste dalla Section 122.',
    changesTitle: 'Cosa cambia ora',
    change1: 'Si applica una commissione di gestione del 10% alle spedizioni dirette negli USA.',
    change2: 'Si applica inoltre un sovrapprezzo separato del 10% legato ai dazi su tutti gli articoli.',
    effectiveTitle: 'Data di entrata in vigore',
    effectiveText: 'Questi adeguamenti sono immediatamente effettivi e allineati all’implementazione della Section 122 a partire da oggi.',
    nextTitle: 'Cosa aspettarsi dopo',
    nextText: 'Se le condizioni normative continueranno a cambiare, i costi di spedizione verso gli USA potrebbero essere nuovamente rivisti. Manterremo trasparenti gli aggiornamenti dei prezzi per continuare il servizio senza perdite non sostenibili.',
    thanks: 'Grazie per il continuo supporto.',
  },
  he: {
    title: 'עדכון משלוחים לארה״ב – Section 122',
    intro: 'אנו מפרסמים עדכון תפעולי למשלוחים לארצות הברית בעקבות שינויי מדיניות מכסים חדשים לפי Section 122.',
    changesTitle: 'מה משתנה כעת',
    change1: 'עמלת טיפול של 10% תחול על משלוחים ליעד ארה״ב.',
    change2: 'בנוסף יחול חיוב נפרד של 10% הקשור למכסים על כל הפריטים.',
    effectiveTitle: 'תאריך תחילה',
    effectiveText: 'התאמות אלה נכנסות לתוקף באופן מיידי ומיושרות עם יישום Section 122 החל מהיום.',
    nextTitle: 'למה לצפות בהמשך',
    nextText: 'אם תנאי המדיניות ימשיכו להשתנות, עלויות המשלוח לארה״ב עשויות להתעדכן שוב. נמשיך לפרסם עדכוני מחיר באופן שקוף כדי להפעיל את השירות ללא הפסדים שאינם בני קיימא.',
    thanks: 'תודה על התמיכה המתמשכת שלכם.',
  },
  ga: {
    title: 'Nuashonrú loingseoireachta SAM Section 122',
    intro: 'Táimid ag eisiúint nuashonrú oibríochtúil do sheoltaí chuig Stáit Aontaithe Mheiriceá tar éis athruithe nua taraife faoi Section 122.',
    changesTitle: 'Cad atá ag athrú anois',
    change1: 'Cuirtear táille láimhseála 10% i bhfeidhm ar sheoltaí chuig SAM.',
    change2: 'Cuirtear forchostas ar leith 10% a bhaineann le taraifí i bhfeidhm ar gach mír.',
    effectiveTitle: 'Dáta éifeachtach',
    effectiveText: 'Tá na coigeartuithe seo i bhfeidhm láithreach agus ailínithe le cur i bhfeidhm Section 122 ón lá inniu.',
    nextTitle: 'Cad is féidir a bheith ag súil leis ina dhiaidh seo',
    nextText: 'Má leanann coinníollacha beartais ag athrú, d’fhéadfaí costais loingseoireachta chuig SAM a athbhreithniú arís. Coinneoimid nuashonruithe praghsála trédhearcach chun leanúint den tseirbhís gan caillteanais neamh-inbhuanaithe.',
    thanks: 'Go raibh maith agat as do thacaíocht leanúnach.',
  },
  pl: {
    title: 'Aktualizacja wysyłek do USA – Section 122',
    intro: 'Publikujemy aktualizację operacyjną dla przesyłek do Stanów Zjednoczonych po nowych zmianach taryfowych wynikających z Section 122.',
    changesTitle: 'Co zmienia się teraz',
    change1: 'Do przesyłek kierowanych do USA doliczana jest opłata manipulacyjna 10%.',
    change2: 'Dodatkowo na wszystkie produkty naliczana jest osobna dopłata 10% związana z taryfami.',
    effectiveTitle: 'Data wejścia w życie',
    effectiveText: 'Te zmiany obowiązują natychmiast i są zgodne z wdrożeniem Section 122 od dziś.',
    nextTitle: 'Czego spodziewać się dalej',
    nextText: 'Jeśli warunki polityczne będą się dalej zmieniać, koszty wysyłki do USA mogą zostać ponownie zaktualizowane. Będziemy transparentnie komunikować aktualizacje cen, aby utrzymać usługę bez nieuzasadnionych strat.',
    thanks: 'Dziękujemy za stałe wsparcie.',
  },
  ko: {
    title: '미국 Section 122 배송 업데이트',
    intro: 'Section 122에 따른 새로운 관세 정책 변경에 따라 미국행 배송에 대한 운영 업데이트를 안내드립니다.',
    changesTitle: '현재 변경 사항',
    change1: '미국 목적지 배송에는 10% 취급 수수료가 적용됩니다.',
    change2: '모든 상품에 대해 관세 관련 10% 추가 할증이 별도로 적용됩니다.',
    effectiveTitle: '시행일',
    effectiveText: '해당 조정은 즉시 시행되며, 오늘부터 적용되는 Section 122 시행에 맞춰 반영됩니다.',
    nextTitle: '향후 예상 사항',
    nextText: '정책 환경이 계속 변경될 경우 미국행 배송비가 다시 조정될 수 있습니다. 서비스가 지속 가능하도록 가격 업데이트를 투명하게 안내하겠습니다.',
    thanks: '지속적인 성원에 감사드립니다.',
  },
  no: {
    title: 'USA Section 122 fraktoppdatering',
    intro: 'Vi publiserer en driftsoppdatering for forsendelser til USA etter nye tariffendringer under Section 122.',
    changesTitle: 'Hva som endres nå',
    change1: 'Et håndteringsgebyr på 10 % gjelder for forsendelser til USA.',
    change2: 'Et separat tariffrelatert tillegg på 10 % gjelder for alle varer.',
    effectiveTitle: 'Ikrafttredelsesdato',
    effectiveText: 'Disse justeringene gjelder umiddelbart og er i tråd med implementeringen av Section 122 fra i dag.',
    nextTitle: 'Hva du kan forvente videre',
    nextText: 'Hvis policyforholdene fortsetter å endre seg, kan fraktkostnader til USA bli justert igjen. Vi holder prisoppdateringer transparente slik at tjenesten kan fortsette uten uholdbare tap.',
    thanks: 'Takk for din fortsatte støtte.',
  },
  sv: {
    title: 'USA Section 122 leveransuppdatering',
    intro: 'Vi publicerar en operativ uppdatering för försändelser till USA efter nya tariffändringar enligt Section 122.',
    changesTitle: 'Vad som ändras nu',
    change1: 'En hanteringsavgift på 10 % gäller för försändelser till USA.',
    change2: 'Ett separat tariffrelaterat påslag på 10 % gäller för alla varor.',
    effectiveTitle: 'Ikraftträdandedatum',
    effectiveText: 'Dessa justeringar gäller omedelbart och är i linje med införandet av Section 122 från och med idag.',
    nextTitle: 'Vad du kan förvänta dig härnäst',
    nextText: 'Om policyförhållandena fortsätter att ändras kan fraktkostnader till USA justeras igen. Vi håller prisuppdateringar transparenta så att tjänsten kan fortsätta utan ohållbara förluster.',
    thanks: 'Tack för ditt fortsatta stöd.',
  },
  tl: {
    title: 'USA Section 122 shipping update',
    intro: 'Naglalabas kami ng operational update para sa shipments papuntang United States matapos ang bagong tariff policy changes sa ilalim ng Section 122.',
    changesTitle: 'Ano ang nagbago ngayon',
    change1: 'May 10% handling fee para sa mga shipment na papuntang USA.',
    change2: 'May hiwalay na 10% tariff-related surcharge para sa lahat ng items.',
    effectiveTitle: 'Petsa ng bisa',
    effectiveText: 'Epektibo agad ang mga adjustment na ito at nakaayon sa pagpapatupad ng Section 122 simula ngayon.',
    nextTitle: 'Ano ang aasahan sa susunod',
    nextText: 'Kung patuloy na magbabago ang policy conditions, maaaring ma-revise ulit ang shipping costs papuntang USA. Pananatilihin naming transparent ang price updates para maipagpatuloy ang serbisyo nang hindi nagkakaroon ng hindi napapanatiling pagkalugi.',
    thanks: 'Salamat sa inyong patuloy na suporta.',
  },
  vi: {
    title: 'Cập nhật vận chuyển USA Section 122',
    intro: 'Chúng tôi đưa ra cập nhật vận hành cho các lô hàng đến Hoa Kỳ sau các thay đổi chính sách thuế quan mới theo Section 122.',
    changesTitle: 'Các thay đổi hiện tại',
    change1: 'Phí xử lý 10% áp dụng cho các lô hàng gửi đến Mỹ.',
    change2: 'Phụ phí riêng 10% liên quan đến thuế quan áp dụng cho tất cả mặt hàng.',
    effectiveTitle: 'Ngày hiệu lực',
    effectiveText: 'Các điều chỉnh này có hiệu lực ngay lập tức và phù hợp với việc triển khai Section 122 từ hôm nay.',
    nextTitle: 'Dự kiến tiếp theo',
    nextText: 'Nếu điều kiện chính sách tiếp tục thay đổi, chi phí vận chuyển đến Mỹ có thể được điều chỉnh lần nữa. Chúng tôi sẽ giữ việc cập nhật giá minh bạch để duy trì dịch vụ mà không phát sinh thua lỗ không bền vững.',
    thanks: 'Cảm ơn sự ủng hộ liên tục của bạn.',
  },
  fi: {
    title: 'USA Section 122 -toimituspäivitys',
    intro: 'Julkaisemme operatiivisen päivityksen Yhdysvaltoihin meneville lähetyksille uusien Section 122 -tariffimuutosten jälkeen.',
    changesTitle: 'Mikä muuttuu nyt',
    change1: 'Yhdysvaltoihin osoitettuihin lähetyksiin sovelletaan 10 % käsittelymaksua.',
    change2: 'Kaikkiin tuotteisiin sovelletaan lisäksi erillinen 10 % tariffiin liittyvä lisämaksu.',
    effectiveTitle: 'Voimaantulopäivä',
    effectiveText: 'Nämä muutokset tulevat voimaan välittömästi ja ovat linjassa tänään alkaneen Section 122 -käyttöönoton kanssa.',
    nextTitle: 'Mitä odottaa seuraavaksi',
    nextText: 'Jos politiikkaehdot muuttuvat edelleen, Yhdysvaltoihin suuntautuvia toimituskuluja voidaan tarkistaa uudelleen. Pidämme hintapäivitykset läpinäkyvinä, jotta palvelu voi jatkua ilman kestämättömiä tappioita.',
    thanks: 'Kiitos jatkuvasta tuestasi.',
  },
  ru: {
    title: 'Обновление доставки в США по Section 122',
    intro: 'Мы публикуем операционное обновление для отправлений в США после новых изменений тарифной политики в рамках Section 122.',
    changesTitle: 'Что меняется сейчас',
    change1: 'Для отправлений в США применяется сбор за обработку 10%.',
    change2: 'Дополнительно на все товары применяется отдельная надбавка 10%, связанная с тарифами.',
    effectiveTitle: 'Дата вступления в силу',
    effectiveText: 'Эти изменения вступают в силу немедленно и соответствуют внедрению Section 122 с сегодняшнего дня.',
    nextTitle: 'Чего ожидать дальше',
    nextText: 'Если условия политики будут продолжать меняться, стоимость доставки в США может быть пересмотрена снова. Мы будем прозрачно публиковать обновления цен, чтобы продолжать работу без неустойчивых убытков.',
    thanks: 'Спасибо за вашу постоянную поддержку.',
  },
  cy: {
    title: 'Diweddariad cludo UDA Section 122',
    intro: 'Rydym yn cyhoeddi diweddariad gweithredol ar gyfer llwythi i’r Unol Daleithiau yn dilyn newidiadau tariff newydd o dan Section 122.',
    changesTitle: 'Beth sy’n newid nawr',
    change1: 'Mae ffi trin 10% yn berthnasol i lwythi sy’n mynd i UDA.',
    change2: 'Mae gordal ar wahân o 10% sy’n gysylltiedig â thariffau yn berthnasol i bob eitem.',
    effectiveTitle: 'Dyddiad dod i rym',
    effectiveText: 'Mae’r addasiadau hyn yn dod i rym ar unwaith ac yn cyd-fynd â gweithrediad Section 122 o heddiw ymlaen.',
    nextTitle: 'Beth i’w ddisgwyl nesaf',
    nextText: 'Os bydd amodau polisi yn parhau i newid, gall costau cludo i UDA gael eu hadolygu eto. Byddwn yn cadw diweddariadau prisio’n dryloyw er mwyn parhau â’r gwasanaeth heb golledion anghynaliadwy.',
    thanks: 'Diolch am eich cefnogaeth barhaus.',
  },
  yue: {
    title: '美國 Section 122 運輸更新',
    intro: '因應 Section 122 最新關稅政策變更，我哋發布寄往美國貨物嘅運營更新。',
    changesTitle: '目前變更內容',
    change1: '寄往美國嘅包裹將收取 10% 處理費。',
    change2: '所有商品另加 10% 關稅相關附加費。',
    effectiveTitle: '生效日期',
    effectiveText: '以上調整即日起生效，並與今日開始實施嘅 Section 122 一致。',
    nextTitle: '後續可能變動',
    nextText: '若政策持續變動，寄往美國嘅運費可能再次調整。我哋會保持透明嘅價格更新，確保服務可持續運作。',
    thanks: '多謝你持續支持。',
  },
};

function getBlogContentByLanguage(languageCode) {
  const normalized = String(languageCode || 'en').toLowerCase();
  if (normalized === 'zh-tw' || normalized === 'zh-hant') {
    return BLOG_USA_SECTION_122_I18N['zh-hant'];
  }
  if (normalized === 'zh-hk' || normalized === 'yue') {
    return BLOG_USA_SECTION_122_I18N['yue'];
  }
  if (normalized.startsWith('zh')) {
    return BLOG_USA_SECTION_122_I18N.zh;
  }
  return BLOG_USA_SECTION_122_I18N[normalized] || BLOG_USA_SECTION_122_I18N.en;
}

export default function USASection122Blog() {
  const { language } = useLanguage();
  const content = getBlogContentByLanguage(language);

  return (
    <BlogPageLayout>
      <h2>{content.title}</h2>

      <p>{content.intro}</p>

      <h4>{content.changesTitle}</h4>
      <ul>
        <li>{content.change1}</li>
        <li>{content.change2}</li>
      </ul>

      <h4>{content.effectiveTitle}</h4>
      <p>{content.effectiveText}</p>

      <h4>{content.nextTitle}</h4>
      <p>{content.nextText}</p>

      <p>{content.thanks}</p>
    </BlogPageLayout>
  );
}

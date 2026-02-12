import re

# Define all the Russian translations for the remaining languages
russian_translations = {
    'hi': {
        'country': 'countryRU: "🇷🇺 रूस",',
        'message': 'russiaServiceSuspended: "⚠️ महत्वपूर्ण सूचना: 2022 में यूक्रेन पर रूसी आक्रमण के कारण, SingPost ने DHL के साथ रूस के लिए सभी शिपमेंट निलंबित कर दिया है। देश में सेवाओं की बहाली की घोषणा होने तक हम वर्तमान में रूस की सेवा नहीं कर रहे हैं।",'
    },
    'th': {
        'country': 'countryRU: "🇷🇺 รัสเซีย",',
        'message': 'russiaServiceSuspended: "⚠️ ประกาศสำคัญ: เนื่องจากการรุกรานยูเครนของรัสเซียในปี 2022 SingPost ได้ระงับการจัดส่งทั้งหมดไปยังรัสเซียพร้อมกับ DHL ขณะนี้เราไม่ให้บริการรัสเซียจนกว่าจะมีการประกาศการกลับมาให้บริการในประเทศดังกล่าว",'
    },
    'ms': {
        'country': 'countryRU: "🇷🇺 Rusia",',
        'message': 'russiaServiceSuspended: "⚠️ NOTIS PENTING: Berikutan pencerobohan Rusia ke atas Ukraine pada tahun 2022, SingPost telah menggantung semua penghantaran ke Rusia bersama dengan DHL. Kami pada masa ini tidak melayani Rusia sehingga terdapat pengumuman pemulihan perkhidmatan ke negara tersebut.",'
    },
    'nl': {
        'country': 'countryRU: "🇷🇺 Rusland",',
        'message': 'russiaServiceSuspended: "⚠️ BELANGRIJKE KENNISGEVING: Gezien de Russische invasie van Oekraïne in 2022 heeft SingPost alle zendingen naar Rusland samen met DHL opgeschort. We bedienen momenteel geen Rusland tot er een aankondiging is van hervatting van diensten naar het land.",'
    },
    'id': {
        'country': 'countryRU: "🇷🇺 Rusia",',
        'message': 'russiaServiceSuspended: "⚠️ PEMBERITAHUAN PENTING: Mengingat invasi Rusia ke Ukraina pada tahun 2022, SingPost telah menangguhkan semua pengiriman ke Rusia bersama dengan DHL. Kami saat ini tidak melayani Rusia sampai ada pengumuman pemulihan layanan ke negara tersebut.",'
    },
    'cs': {
        'country': 'countryRU: "🇷🇺 Rusko",',
        'message': 'russiaServiceSuspended: "⚠️ DŮLEŽITÉ UPOZORNĚNÍ: S ohledem na ruskou invazi na Ukrajinu v roce 2022 SingPost pozastavila všechny zásilky do Ruska spolu s DHL. V současné době neposkytujeme služby do Ruska, dokud nebude oznámeno obnovení služeb do této země.",'
    },
    'it': {
        'country': 'countryRU: "🇷🇺 Russia",',
        'message': 'russiaServiceSuspended: "⚠️ AVVISO IMPORTANTE: In vista dell\'invasione russa dell\'Ucraina nel 2022, SingPost ha sospeso tutte le spedizioni verso la Russia insieme a DHL. Attualmente non serviamo la Russia fino a quando non ci sarà un annuncio di ripresa dei servizi nel paese.",'
    },
    'he': {
        'country': 'countryRU: "🇷🇺 רוסיה",',
        'message': 'russiaServiceSuspended: "⚠️ הודעה חשובה: לאור הפלישה הרוסית לאוקראינה ב-2022, SingPost השעתה את כל המשלוחים לרוסיה יחד עם DHL. אנחנו לא משרתים כיום את רוסיה עד שיהיה הכרזה על חידוש השירותים למדינה.",'
    },
    'ga': {
        'country': 'countryRU: "🇷🇺 An Rúis",',
        'message': 'russiaServiceSuspended: "⚠️ FÓGRA TÁBHACHTACH: I bhfianaise ionsaí na Rúise ar an Úcráin in 2022, tá SingPost tar éis gach seachadadh chuig an Rúis a chur ar fionraí in éineacht le DHL. Níl muid ag freastal ar an Rúis faoi láthair go dtí go mbeidh fógra faoi athchúrsáil seirbhísí chuig an tír.",'
    },
    'pl': {
        'country': 'countryRU: "🇷🇺 Rosja",',
        'message': 'russiaServiceSuspended: "⚠️ WAŻNE POWIADOMIENIE: W związku z rosyjską inwazją na Ukrainę w 2022 roku, SingPost zawiesiła wszystkie przesyłki do Rosji wraz z DHL. Obecnie nie obsługujemy Rosji do czasu ogłoszenia wznowienia usług do tego kraju.",'
    },
    'ko': {
        'country': 'countryRU: "🇷🇺 러시아",',
        'message': 'russiaServiceSuspended: "⚠️ 중요 공지: 2022년 러시아의 우크라이나 침공에 따라 SingPost는 DHL과 함께 러시아로의 모든 배송을 중단했습니다. 해당 국가로의 서비스 재개가 발표될 때까지 현재 러시아 서비스를 제공하지 않습니다.",'
    },
    'no': {
        'country': 'countryRU: "🇷🇺 Russland",',
        'message': 'russiaServiceSuspended: "⚠️ VIKTIG MELDING: På grunn av den russiske invasjonen av Ukraina i 2022 har SingPost suspendert alle forsendelser til Russland sammen med DHL. Vi betjener for øyeblikket ikke Russland inntil det er kunngjort gjenopptagelse av tjenester til landet.",'
    },
    'ru': {
        'country': 'countryRU: "🇷🇺 Россия",',
        'message': 'russiaServiceSuspended: "⚠️ ВАЖНОЕ УВЕДОМЛЕНИЕ: В связи с российским вторжением в Украину в 2022 году, SingPost приостановила все отправления в Россию вместе с DHL. В настоящее время мы не обслуживаем Россию до объявления о возобновлении услуг в страну.",'
    },
    'sv': {
        'country': 'countryRU: "🇷🇺 Ryssland",',
        'message': 'russiaServiceSuspended: "⚠️ VIKTIGT MEDDELANDE: Med anledning av den ryska invasionen av Ukraina 2022 har SingPost suspenderat alla försändelser till Ryssland tillsammans med DHL. Vi betjänar för närvarande inte Ryssland tills det finns ett tillkännagivande om återupptande av tjänster till landet.",'
    },
    'fi': {
        'country': 'countryRU: "🇷🇺 Venäjä",',
        'message': 'russiaServiceSuspended: "⚠️ TÄRKEÄ ILMOITUS: Venäjän Ukrainaan vuonna 2022 tekemän hyökkäyksen vuoksi SingPost on keskeyttänyt kaikki lähetykset Venäjälle yhdessä DHL:n kanssa. Emme tällä hetkellä palvele Venäjää, kunnes maahan palvelujen jatkamisesta ilmoitetaan.",'
    },
    'tl': {
        'country': 'countryRU: "🇷🇺 Russia",',
        'message': 'russiaServiceSuspended: "⚠️ MAHALAGANG PAUNAWA: Sa pagkilala sa Russian invasion ng Ukraine noong 2022, na-suspend ng SingPost ang lahat ng shipment papunta sa Russia kasama ang DHL. Hindi namin ginagawa ang Russia sa ngayon hanggang may anunsyo ng pagbabalik ng mga serbisyo sa bansa.",'
    },
    'vi': {
        'country': 'countryRU: "🇷🇺 Nga",',
        'message': 'russiaServiceSuspended: "⚠️ THÔNG BÁO QUAN TRỌNG: Trước cuộc xâm lược của Nga vào Ukraine năm 2022, SingPost đã tạm ngừng tất cả các lô hàng đến Nga cùng với DHL. Chúng tôi hiện không phục vụ Nga cho đến khi có thông báo về việc khôi phục dịch vụ đến quốc gia này.",'
    },
    'cy': {
        'country': 'countryRU: "🇷🇺 Rwsia",',
        'message': 'russiaServiceSuspended: "⚠️ HYSBYSIAD PWYSIG: Yng ngoleuni ymosodiad Rwsieg ar Wcráin yn 2022, mae SingPost wedi atal pob llwyth i Rwsia ynghyd â DHL. Nid ydym ar hyn o bryd yn gwasanaethu Rwsia hyd nes y bydd cyhoeddiad am ailgychwyn gwasanaethau i\'r wlad.",'
    }
}

print("Generated Python dictionary with Russian translations for all remaining languages")
print("Languages included:", list(russian_translations.keys()))
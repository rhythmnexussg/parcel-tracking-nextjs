import os

# Russian invasion message in different languages
translations = {
    'de': '⚠️ WICHTIGER HINWEIS: Angesichts der russischen Invasion in der Ukraine im Jahr 2022 hat SingPost zusammen mit DHL alle Sendungen nach Russland eingestellt. Wir bedienen Russland derzeit nicht, bis die Wiederaufnahme der Dienste in das Land angekündigt wird.',
    'fr': '⚠️ AVIS IMPORTANT: En raison de l\'invasion russe de l\'Ukraine en 2022, SingPost a suspendu tous les envois vers la Russie ainsi que DHL. Nous ne desservons actuellement pas la Russie jusqu\'à ce qu\'il y ait une annonce de reprise des services vers le pays.',
    'es': '⚠️ AVISO IMPORTANTE: En vista de la invasión rusa de Ucrania en 2022, SingPost ha suspendido todos los envíos a Rusia junto con DHL. Actualmente no servimos a Rusia hasta que se anuncie la reanudación de servicios al país.',
    'ja': '⚠️ 重要なお知らせ：2022年のロシアのウクライナ侵攻を受けて、SingPostはDHLと共にロシアへのすべての配送を停止しました。同国へのサービス再開が発表されるまで、現在ロシアにはサービスを提供していません。',
    'zh': '⚠️ 重要通知：鉴于2022年俄罗斯入侵乌克兰，新加坡邮政已与DHL一起暂停所有运往俄罗斯的货物。在宣布恢复对该国的服务之前，我们目前不为俄罗斯提供服务。',
    'zh-hant': '⚠️ 重要通知：鑑於2022年俄羅斯入侵烏克蘭，新加坡郵政已與DHL一起暫停所有運往俄羅斯的貨物。在宣佈恢復對該國的服務之前，我們目前不為俄羅斯提供服務。',
    'pt': '⚠️ AVISO IMPORTANTE: Tendo em vista a invasão russa da Ucrânia em 2022, a SingPost suspendeu todas as remessas para a Rússia junto com a DHL. Atualmente não servimos a Rússia até que haja anúncio de retomada dos serviços para o país.',
    'hi': '⚠️ महत्वपूर्ण सूचना: 2022 में यूक्रेन पर रूसी आक्रमण के कारण, SingPost ने DHL के साथ रूस के लिए सभी शिपमेंट निलंबित कर दिया है। देश में सेवाओं की बहाली की घोषणा होने तक हम वर्तमान में रूस की सेवा नहीं कर रहे हैं।',
    'th': '⚠️ ประกาศสำคัญ: เนื่องจากการรุกรานยูเครนของรัสเซียในปี 2022 SingPost ได้ระงับการจัดส่งทั้งหมดไปยังรัสเซียพร้อมกับ DHL ขณะนี้เราไม่ให้บริการรัสเซียจนกว่าจะมีการประกาศการกลับมาให้บริการในประเทศดังกล่าว',
    'ms': '⚠️ NOTIS PENTING: Berikutan pencerobohan Rusia ke atas Ukraine pada tahun 2022, SingPost telah menggantung semua penghantaran ke Rusia bersama dengan DHL. Kami pada masa ini tidak melayani Rusia sehingga terdapat pengumuman pemulihan perkhidmatan ke negara tersebut.',
    'nl': '⚠️ BELANGRIJKE KENNISGEVING: Gezien de Russische invasie van Oekraïne in 2022 heeft SingPost alle zendingen naar Rusland samen met DHL opgeschort. We bedienen momenteel geen Rusland tot er een aankondiging is van hervatting van diensten naar het land.',
    'id': '⚠️ PEMBERITAHUAN PENTING: Mengingat invasi Rusia ke Ukraina pada tahun 2022, SingPost telah menangguhkan semua pengiriman ke Rusia bersama dengan DHL. Kami saat ini tidak melayani Rusia sampai ada pengumuman pemulihan layanan ke negara tersebut.',
    'cs': '⚠️ DŮLEŽITÉ UPOZORNĚNÍ: S ohledem na ruskou invazi na Ukrajinu v roce 2022 SingPost pozastavila všechny zásilky do Ruska spolu s DHL. V současné době neposkytujeme služby do Ruska, dokud nebude oznámeno obnovení služeb do této země.',
    'it': '⚠️ AVVISO IMPORTANTE: In vista dell\'invasione russa dell\'Ucraina nel 2022, SingPost ha sospeso tutte le spedizioni verso la Russia insieme a DHL. Attualmente non serviamo la Russia fino a quando non ci sarà un annuncio di ripresa dei servizi nel paese.',
    'he': '⚠️ הודעה חשובה: לאור הפלישה הרוסית לאוקראינה ב-2022, SingPost השעתה את כל המשלוחים לרוסיה יחד עם DHL. אנחנו לא משרתים כיום את רוסיה עד שיהיה הכרזה על חידוש השירותים למדינה.',
    'ga': '⚠️ FÓGRA TÁBHACHTACH: I bhfianaise ionsaí na Rúise ar an Úcráin in 2022, tá SingPost tar éis gach seachadadh chuig an Rúis a chur ar fionraí in éineacht le DHL. Níl muid ag freastal ar an Rúis faoi láthair go dtí go mbeidh fógra faoi athchúrsáil seirbhísí chuig an tír.',
    'pl': '⚠️ WAŻNE POWIADOMIENIE: W związku z rosyjską inwazją na Ukrainę w 2022 roku, SingPost zawiesiła wszystkie przesyłki do Rosji wraz z DHL. Obecnie nie obsługujemy Rosji do czasu ogłoszenia wznowienia usług do tego kraju.',
    'ko': '⚠️ 중요 공지: 2022년 러시아의 우크라이나 침공에 따라 SingPost는 DHL과 함께 러시아로의 모든 배송을 중단했습니다. 해당 국가로의 서비스 재개가 발표될 때까지 현재 러시아 서비스를 제공하지 않습니다.',
    'no': '⚠️ VIKTIG MELDING: På grunn av den russiske invasjonen av Ukraina i 2022 har SingPost suspendert alle forsendelser til Russland sammen med DHL. Vi betjener for øyeblikket ikke Russland inntil det er kunngjort gjenopptagelse av tjenester til landet.',
    'ru': '⚠️ ВАЖНОЕ УВЕДОМЛЕНИЕ: В связи с российским вторжением в Украину в 2022 году, SingPost приостановила все отправления в Россию вместе с DHL. В настоящее время мы не обслуживаем Россию до объявления о возобновлении услуг в страну.',
    'sv': '⚠️ VIKTIGT MEDDELANDE: Med anledning av den ryska invasionen av Ukraina 2022 har SingPost suspenderat alla försändelser till Ryssland tillsammans med DHL. Vi betjänar för närvarande inte Ryssland tills det finns ett tillkännagivande om återupptande av tjänster till landet.',
    'fi': '⚠️ TÄRKEÄ ILMOITUS: Venäjän Ukrainaan vuonna 2022 tekemän hyökkäyksen vuoksi SingPost on keskeyttänyt kaikki lähetykset Venäjälle yhdessä DHL:n kanssa. Emme tällä hetkellä palvele Venäjää, kunnes maahan palvelujen jatkamisesta ilmoitetaan.',
    'tl': '⚠️ MAHALAGANG PAUNAWA: Sa pagkilala sa Russian invasion ng Ukraine noong 2022, na-suspend ng SingPost ang lahat ng shipment papunta sa Russia kasama ang DHL. Hindi namin ginagawa ang Russia sa ngayon hanggang may anunsyo ng pagbabalik ng mga serbisyo sa bansa.',
    'vi': '⚠️ THÔNG BÁO QUAN TRỌNG: Trước cuộc xâm lược của Nga vào Ukraine năm 2022, SingPost đã tạm ngừng tất cả các lô hàng đến Nga cùng với DHL. Chúng tôi hiện không phục vụ Nga cho đến khi có thông báo về việc khôi phục dịch vụ đến quốc gia này.',
    'cy': '⚠️ HYSBYSIAD PWYSIG: Yng ngoleuni ymosodiad Rwsieg ar Wcráin yn 2022, mae SingPost wedi atal pob llwyth i Rwsia ynghyd â DHL. Nid ydym ar hyn o bryd yn gwasanaethu Rwsia hyd nes y bydd cyhoeddiad am ailgychwyn gwasanaethau i\'r wlad.'
}

# Country names in different languages  
country_names = {
    'de': 'countryRU: "🇷🇺 Russland",',
    'fr': 'countryRU: "🇷🇺 Russie",', 
    'es': 'countryRU: "🇷🇺 Rusia",',
    'ja': 'countryRU: "🇷🇺 ロシア",',
    'zh': 'countryRU: "🇷🇺 俄罗斯",',
    'zh-hant': 'countryRU: "🇷🇺 俄羅斯",',
    'pt': 'countryRU: "🇷🇺 Rússia",',
    'hi': 'countryRU: "🇷🇺 रूस",',
    'th': 'countryRU: "🇷🇺 รัสเซีย",',
    'ms': 'countryRU: "🇷🇺 Rusia",',
    'nl': 'countryRU: "🇷🇺 Rusland",', 
    'id': 'countryRU: "🇷🇺 Rusia",',
    'cs': 'countryRU: "🇷🇺 Rusko",',
    'it': 'countryRU: "🇷🇺 Russia",',
    'he': 'countryRU: "🇷🇺 רוסיה",',
    'ga': 'countryRU: "🇷🇺 An Rúis",',
    'pl': 'countryRU: "🇷🇺 Rosja",',
    'ko': 'countryRU: "🇷🇺 러시아",',
    'no': 'countryRU: "🇷🇺 Russland",',
    'ru': 'countryRU: "🇷🇺 Россия",',
    'sv': 'countryRU: "🇷🇺 Ryssland",',
    'fi': 'countryRU: "🇷🇺 Venäjä",',
    'tl': 'countryRU: "🇷🇺 Russia",',
    'vi': 'countryRU: "🇷🇺 Nga",', 
    'cy': 'countryRU: "🇷🇺 Rwsia",'
}

print("// Russian service suspension translations to add to each language section:")
print()

for lang, message in translations.items():
    print(f"// {lang.upper()}")
    print(f'russiaServiceSuspended: "{message}",')
    if lang in country_names:
        print(country_names[lang])
    print()
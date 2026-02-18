#!/usr/bin/env python3
# Add all missing holiday messages to translations.js

import re

# Read the file
with open('src/translations.js', 'r', encoding='utf-8-sig') as f:
    content = f.read()

# Define all holiday messages for each language
# For languages that already have national day messages, we'll only add religious holidays
# For others, we'll add all messages

# Religious/cultural holiday messages that go FIRST
religious_holidays = {
    'fr': '''    // Holiday Messages
    hariRayaMessage: "🌙 Selamat Hari Raya Aidilfitri ! Nous vous souhaitons, à vous et votre famille, paix, joie et bénédictions ! 🌟",
    deepavaliMessage: "🪔 Joyeuse Deepavali ! Que la fête des lumières vous apporte joie, prospérité et succès ! ✨",
    diwaliMessage: "🪔 Joyeux Diwali ! Que la fête des lumières vous apporte joie, prospérité et succès ! ✨",
    vesakMessage: "☸️ Joyeux jour de Vesak ! Nous vous souhaitons paix, sagesse et illumination en ce jour sacré ! 🙏",
    vesakTHMessage: "☸️ Joyeux jour de Visakha Bucha ! Nous vous souhaitons paix, sagesse et illumination en ce jour sacré ! 🙏",
''',
    'es': '''    // Holiday Messages
    hariRayaMessage: "🌙 ¡Selamat Hari Raya Aidilfitri! ¡Les deseamos a usted y su familia paz, alegría y bendiciones! 🌟",
    deepavaliMessage: "🪔 ¡Feliz Deepavali! ¡Que el festival de las luces te traiga alegría, prosperidad y éxito! ✨",
    diwaliMessage: "🪔 ¡Feliz Diwali! ¡Que el festival de las luces te traiga alegría, prosperidad y éxito! ✨",
    vesakMessage: "☸️ ¡Feliz Día de Vesak! ¡Le deseamos paz, sabiduría e iluminación en este día sagrado! 🙏",
    vesakTHMessage: "☸️ ¡Feliz Día de Visakha Bucha! ¡Le deseamos paz, sabiduría e iluminación en este día sagrado! 🙏",
''',
    'ja': '''    // Holiday Messages
    hariRayaMessage: "🌙 Selamat Hari Raya Aidilfitri！家族の皆様に平和と喜びと祝福がありますように！🌟",
    deepavaliMessage: "🪔 ディーパバリおめでとうございます！光の祭りがあなたに喜びと繁栄と成功をもたらしますように！✨",
    diwaliMessage: "🪔 ディワリおめでとうございます！光の祭りがあなたに喜びと繁栄と成功をもたらしますように！✨",
    vesakMessage: "☸️ ウェーサーカ祭おめでとうございます！この神聖な日に平和と知恵と悟りがありますように！🙏",
    vesakTHMessage: "☸️ ビサカブチャの日おめでとうございます！この神聖な日に平和と知恵と悟りがありますように！🙏",
''',
    'pt': '''    // Holiday Messages
    hariRayaMessage: "🌙 Selamat Hari Raya Aidilfitri! Desejamos a você e sua família paz, alegria e bênçãos! 🌟",
    deepavaliMessage: "🪔 Feliz Deepavali! Que o festival das luzes traga alegria, prosperidade e sucesso! ✨",
    diwaliMessage: "🪔 Feliz Diwali! Que o festival das luzes traga alegria, prosperidade e sucesso! ✨",
    vesakMessage: "☸️ Feliz Dia de Vesak! Desejamos paz, sabedoria e iluminação neste dia sagrado! 🙏",
    vesakTHMessage: "☸️ Feliz Dia de Visakha Bucha! Desejamos paz, sabedoria e iluminação neste dia sagrado! 🙏",
''',
    'hi': '''    // Holiday Messages
    hariRayaMessage: "🌙 सलामत हरि राया ऐदिलफ़ित्री! आपको और आपके परिवार को शांति, खुशी और आशीर्வाद की शुभकामनाएँ! 🌟",
    deepavaliMessage: "🪔 दीपावली की शुभकामनाएँ! रोशनी का त्योहार आपको खुशी, समृद्धि और सफलता लाए! ✨",
    diwaliMessage: "🪔 दिवाली की शुभकामनाएँ! रोशनी का त्योहार आपको खुशी, समृद्धि और सफलता लाए! ✨",
    vesakMessage: "☸️ वेसाक दिवस की शुभकामनाएँ! इस पवित्र दिन आपको शांति, ज्ञान और ज्ञानोदय की कामना है! 🙏",
    vesakTHMessage: "☸️ विशाखा बुचा दिवस की शुभकामनाएँ! इस पवित्र दिन आपको शांति, ज्ञान और ज्ञानोदय की कामना है! 🙏",
''',
    'th': '''    // Holiday Messages
    hariRayaMessage: "🌙 สลามัต ฮารี รายา ไอดิลฟิตรี! ขออวยพรให้คุณและครอบครัวมีความสุข สันติสุข และพรจากพระเจ้า! 🌟",
    deepavaliMessage: "🪔 สุขสันต์วันดีปาวลี! ขอให้เทศกาลแห่งแสงสว่างนำมาซึ่งความสุข ความเจริญรุ่งเรือง และความสำเร็จ! ✨",
    diwaliMessage: "🪔 สุขสันต์วันดิวาลี! ขอให้เทศกาลแห่งแสงสว่างนำมาซึ่งความสุข ความเจริญรุ่งเรือง และความสำเร็จ! ✨",
    vesakMessage: "☸️ สุขสันต์วันวิสาขบูชา! ขออวยพรให้มีความสงบ ปัญญา และการตรัสรู้ในวันศักดิ์สิทธิ์นี้! 🙏",
    vesakTHMessage: "☸️ สุขสันต์วันวิสาขบูชา! ขออวยพรให้มีความสงบ ปัญญา และการตรัสรู้ในวันศักดิ์สิทธิ์นี้! 🙏",
''',
    'nl': '''    // Holiday Messages
    hariRayaMessage: "🌙 Selamat Hari Raya Aidilfitri! Wij wensen u en uw familie vrede, vreugde en zegeningen! 🌟",
    deepavaliMessage: "🪔 Gelukkig Deepavali! Moge het lichtfestival je vreugde, voorspoed en succes brengen! ✨",
    diwaliMessage: "🪔 Gelukkig Diwali! Moge het lichtfestival je vreugde, voorspoed en succes brengen! ✨",
    vesakMessage: "☸️ Gelukkige Vesak Dag! Wij wensen je vrede, wijsheid en verlichting op deze heilige dag! 🙏",
    vesakTHMessage: "☸️ Gelukkige Visakha Bucha Dag! Wij wensen je vrede, wijsheid en verlichting op deze heilige dag! 🙏",
''',
    'cs': '''    // Holiday Messages
    hariRayaMessage: "🌙 Selamat Hari Raya Aidilfitri! Přejeme vám a vaší rodině mír, radost a požehnání! 🌟",
    deepavaliMessage: "🪔 Šťastný Deepavali! Ať vám festival světel přinese radost, prosperitu a úspěch! ✨",
    diwaliMessage: "🪔 Šťastný Diwali! Ať vám festival světel přinese radost, prosperitu a úspěch! ✨",
    vesakMessage: "☸️ Šťastný Vesak! Přejeme vám mír, moudrost a osvícení v tento svatý den! 🙏",
    vesakTHMessage: "☸️ Šťastný Visakha Bucha! Přejeme vám mír, moudrost a osvícení v tento svatý den! 🙏",
''',
    'it': '''    // Holiday Messages
    hariRayaMessage: "🌙 Selamat Hari Raya Aidilfitri! Auguriamo a te e alla tua famiglia pace, gioia e benedizioni! 🌟",
    deepavaliMessage: "🪔 Felice Deepavali! Che la festa delle luci ti porti gioia, prosperità e successo! ✨",
    diwaliMessage: "🪔 Felice Diwali! Che la festa delle luci ti porti gioia, prosperità e successo! ✨",
    vesakMessage: "☸️ Felice Giorno di Vesak! Ti auguriamo pace, saggezza e illuminazione in questo giorno sacro! 🙏",
    vesakTHMessage: "☸️ Felice Giorno di Visakha Bucha! Ti auguriamo pace, saggezza e illuminazione in questo giorno sacro! 🙏",
''',
    'he': '''    // Holiday Messages
    hariRayaMessage: "🌙 !Selamat Hari Raya Aidilfitri אנו מאחלים לך ולמשפחתך שלום, שמחה וברכות! 🌟",
    deepavaliMessage: "🪔 !דיפאבאלי שמח שחג האורות יביא לך שמחה, שגשוג והצלחה! ✨",
    diwaliMessage: "🪔 !דיוואלי שמח שחג האורות יביא לך שמחה, שגשוג והצלחה! ✨",
    vesakMessage: "☸️ !יום וסאק שמח אנו מאחלים לך שלום, חוכמה והארה ביום קדוש זה! 🙏",
    vesakTHMessage: "☸️ !יום ווישאקהה בוצ'ה שמח אנו מאחלים לך שלום, חוכמה והארה ביום קדוש זה! 🙏",
''',
    'ga': '''    // Holiday Messages
    hariRayaMessage: "🌙 Selamat Hari Raya Aidilfitri! Guímid síocháin, áthas agus beannachtaí duit féin agus do theaghlach! 🌟",
    deepavaliMessage: "🪔 Deepavali Shona! Go dtuga féile na soilse áthas, rathúnas agus rath duit! ✨",
    diwaliMessage: "🪔 Diwali Shona! Go dtuga féile na soilse áthas, rathúnas agus rath duit! ✨",
    vesakMessage: "☸️ Lá Vesak Shona! Guímid síocháin, eagna agus soilsiú duit ar an lá naofa seo! 🙏",
    vesakTHMessage: "☸️ Lá Visakha Bucha Shona! Guímid síocháin, eagna agus soilsiú duit ar an lá naofa seo! 🙏",
''',
    'pl': '''    // Holiday Messages
    hariRayaMessage: "🌙 Selamat Hari Raya Aidilfitri! Życzymy Tobie i Twojej rodzinie pokoju, radości i błogosławieństw! 🌟",
    deepavaliMessage: "🪔 Szczęśliwego Deepavali! Niech święto świateł przyniesie Ci radość, dobrobyt i sukces! ✨",
    diwaliMessage: "🪔 Szczęśliwego Diwali! Niech święto świateł przyniesie Ci radość, dobrobyt i sukces! ✨",
    vesakMessage: "☸️ Szczęśliwego Dnia Vesak! Życzymy pokoju, mądrości i oświecenia w ten święty dzień! 🙏",
    vesakTHMessage: "☸️ Szczęśliwego Dnia Visakha Bucha! Życzymy pokoju, mądrości i oświecenia w ten święty dzień! 🙏",
''',
    'ko': '''    // Holiday Messages
    hariRayaMessage: "🌙 Selamat Hari Raya Aidilfitri! 여러분과 가족에게 평화, 기쁨, 축복이 있기를 기원합니다! 🌟",
    deepavaliMessage: "🪔 디파발리 축하합니다! 빛의 축제가 기쁨, 번영, 성공을 가져다주기를 바랍니다! ✨",
    diwaliMessage: "🪔 디왈리 축하합니다! 빛의 축제가 기쁨, 번영, 성공을 가져다주기를 바랍니다! ✨",
    vesakMessage: "☸️ 부처님 오신 날을 축하합니다! 이 신성한 날에 평화, 지혜, 깨달음을 기원합니다! 🙏",
    vesakTHMessage: "☸️ 위사카 부차의 날을 축하합니다! 이 신성한 날에 평화, 지혜, 깨달음을 기원합니다! 🙏",
''',
    'no': '''    // Holiday Messages
    hariRayaMessage: "🌙 Selamat Hari Raya Aidilfitri! Vi ønsker deg og din familie fred, glede og velsignelser! 🌟",
    deepavaliMessage: "🪔 Glad Deepavali! Måtte lysfestivalen bringe deg glede, velstand og suksess! ✨",
    diwaliMessage: "🪔 Glad Diwali! Måtte lysfestivalen bringe deg glede, velstand og suksess! ✨",
    vesakMessage: "☸️ Glad Vesak-dag! Vi ønsker deg fred, visdom og opplysning på denne hellige dagen! 🙏",
    vesakTHMessage: "☸️ Glad Visakha Bucha-dag! Vi ønsker deg fred, visdom og opplysning på denne hellige dagen! 🙏",
''',
    'sv': '''    // Holiday Messages
    hariRayaMessage: "🌙 Selamat Hari Raya Aidilfitri! Vi önskar dig och din familj fred, glädje och välsignelser! 🌟",
    deepavaliMessage: "🪔 Glad Deepavali! Må ljusets festival bringa dig glädje, välstånd och framgång! ✨",
    diwaliMessage: "🪔 Glad Diwali! Må ljusets festival bringa dig glädje, välstånd och framgång! ✨",
    vesakMessage: "☸️ Glad Vesakdag! Vi önskar dig fred, visdom och upplysning på denna heliga dag! 🙏",
    vesakTHMessage: "☸️ Glad Visakha Bucha-dag! Vi önskar dig fred, visdom och upplysning på denna heliga dag! 🙏",
''',
    'tl': '''    // Holiday Messages
    hariRayaMessage: "🌙 Selamat Hari Raya Aidilfitri! Nawa'y makaranas kayo at ang inyong pamilya ng kapayapaan, kagalakan at pagpapala! 🌟",
    deepavaliMessage: "🪔 Maligayang Deepavali! Nawa'y dalhin sa iyo ng pista ng mga ilaw ang kagalakan, kasaganaan at tagumpay! ✨",
    diwaliMessage: "🪔 Maligayang Diwali! Nawa'y dalhin sa iyo ng pista ng mga ilaw ang kagalakan, kasaganaan at tagumpay! ✨",
    vesakMessage: "☸️ Maligayang Araw ng Vesak! Nawa'y makaranas ka ng kapayapaan, karunungan at pag-liwanag sa banal na araw na ito! 🙏",
    vesakTHMessage: "☸️ Maligayang Araw ng Visakha Bucha! Nawa'y makaranas ka ng kapayapaan, karunungan at pag-liwanag sa banal na araw na ito! 🙏",
''',
    'vi': '''    // Holiday Messages
    hariRayaMessage: "🌙 Selamat Hari Raya Aidilfitri! Chúc bạn và gia đình bình an, vui vẻ và nhiều phước lành! 🌟",
    deepavaliMessage: "🪔 Chúc mừng lễ Deepavali! Cầu mong lễ hội ánh sáng mang đến cho bạn niềm vui, thịnh vượng và thành công! ✨",
    diwaliMessage: "🪔 Chúc mừng lễ Diwali! Cầu mong lễ hội ánh sáng mang đến cho bạn niềm vui, thịnh vượng và thành công! ✨",
    vesakMessage: "☸️ Chúc mừng Đại lễ Phật Đản! Chúc bạn bình an, trí tuệ và giác ngộ trong ngày thiêng liêng này! 🙏",
    vesakTHMessage: "☸️ Chúc mừng ngày Visakha Bucha! Chúc bạn bình an, trí tuệ và giác ngộ trong ngày thiêng liêng này! 🙏",
''',
    'fi': '''    // Holiday Messages
    hariRayaMessage: "🌙 Selamat Hari Raya Aidilfitri! Toivotamme sinulle ja perheellesi rauhaa, iloa ja siunausta! 🌟",
    deepavaliMessage: "🪔 Hyvää Deepavalia! Toivomme, että valojen juhla tuo sinulle iloa, vaurautta ja menestystä! ✨",
    diwaliMessage: "🪔 Hyvää Diwalia! Toivomme, että valojen juhla tuo sinulle iloa, vaurautta ja menestystä! ✨",
    vesakMessage: "☸️ Hyvää Vesakpäivää! Toivotamme sinulle rauhaa, viisautta ja valaistumista tänä pyhänä päivänä! 🙏",
    vesakTHMessage: "☸️ Hyvää Visakha Bucha -päivää! Toivotamme sinulle rauhaa, viisautta ja valaistumista tänä pyhänä päivänä! 🙏",
''',
    'ru': '''    // Holiday Messages
    hariRayaMessage: "🌙 Selamat Hari Raya Aidilfitri! Желаем вам и вашей семье мира, радости и благословений! 🌟",
    deepavaliMessage: "🪔 Счастливого Дипавали! Пусть праздник огней принесет вам радость, процветание и успех! ✨",
    diwaliMessage: "🪔 Счастливого Дивали! Пусть праздник огней принесет вам радость, процветание и успех! ✨",
    vesakMessage: "☸️ Счастливого дня Весак! Желаем вам мира, мудрости и просветления в этот священный день! 🙏",
    vesakTHMessage: "☸️ Счастливого дня Висакха Буча! Желаем вам мира, мудрости и просветления в этот священный день! 🙏",
''',
    'cy': '''    // Holiday Messages
    hariRayaMessage: "🌙 Selamat Hari Raya Aidilfitri! Dymuniadau gorau i chi a'ch teulu am heddwch, llawenydd a bendithion! 🌟",
    deepavaliMessage: "🪔 Deepavali Hapus! Boed i'r ŵyl goleuadau ddod â llawenydd, ffyniant a llwyddiant i chi! ✨",
    diwaliMessage: "🪔 Diwali Hapus! Boed i'r ŵyl goleuadau ddod â llawenydd, ffyniant a llwyddiant i chi! ✨",
    vesakMessage: "☸️ Diwrnod Vesak Hapus! Dymunwn heddwch, doethineb a goleedigaeth i chi ar y diwrnod sanctaidd hwn! 🙏",
    vesakTHMessage: "☸️ Diwrnod Visakha Bucha Hapus! Dymunwn heddwch, doethineb a goleedigaeth i chi ar y diwrnod sanctaidd hwn! 🙏",
''',
}

print("Starting to add holiday messages to translations.js...")
print(f"Processing {len(religious_holidays)} languages...\n")

# For each language, find the cnyYearOfHorseMessage line and insert after it
for lang, messages in religious_holidays.items():
    # Pattern to find: language code, then find cnyYearOfHorseMessage line
    # We'll look for the line ending and insert our messages
    
    # Search for the pattern: lang code, followed by cnyYearOfHorseMessage
    pattern = rf'(\s+{re.escape(lang)}:\s*\{{[^}}]*?cnyYearOfHorseMessage:\s*"[^"]*",)\r?\n(\s+(?:order|singapore))'
    
    def replacer(match):
        return match.group(1) + '\n' + messages + match.group(2)
    
    new_content = re.sub(pattern, replacer, content, count=1)
    
    if new_content != content:
        content = new_content
        print(f"✓ Added holiday messages to {lang}")
    else:
        print(f"✗ Failed to add messages to {lang} - pattern not found")

# Write back the modified content
with open('src/translations.js', 'w', encoding='utf-8-sig', newline='') as f:
    f.write(content)

print("\n✓ All updates completed! Check the file for syntax errors.")

#!/usr/bin/env python3
# Add national day messages to French, Italian, and Tagalog

import re

# Read the file
with open('src/translations.js', 'r', encoding='utf-8-sig') as f:
    content = f.read()

# National day messages for each language
national_days = {
    'fr': '''    singaporeNationalDayMessage: "🇸🇬 Joyeuse fête nationale, Singapour ! Célébrons 61 ans d'indépendance ! 🎉",
    indonesiaNationalDayMessage: "🇮🇩 Selamat Hari Kemerdekaan Indonesia ! Dirgahayu Republik Indonesia ! 🎊",
    malaysiaNationalDayMessage: "🇲🇾 Selamat Hari Merdeka, Malaisie ! Célébrons l'indépendance de notre nation ! 🎊",
    australiaNationalDayMessage: "🇦🇺 Joyeux jour de l'Australie ! Célébrons notre nation ! 🎉",
    canadaNationalDayMessage: "🇨🇦 Joyeux jour du Canada ! Célébrons notre grande nation ! 🍁",
    usaNationalDayMessage: "🇺🇸 Joyeux jour de l'indépendance, Amérique ! Célébrons la liberté ! 🎆",
    franceBastilleDayMessage: "🇫🇷 Joyeux 14 Juillet ! Vive la France ! 🎊",
    germanyUnityDayMessage: "🇩🇪 Joyeux jour de l'unité allemande ! Tag der Deutschen Einheit ! 🎉",
    italyRepublicDayMessage: "🇮🇹 Buona Festa della Repubblica ! 🇮🇹",
    spainNationalDayMessage: "🇪🇸 ¡Feliz Día de la Hispanidad ! 🎊",
    japanFoundationDayMessage: "🇯🇵 Joyeux jour de la fondation, Japon ! 建国記念の日おめでとうございます！🎌",
    chinaNationalDayMessage: "🇨🇳 Joyeuse fête nationale, Chine ! 国庆节快乐！🎉",
    koreaLiberationDayMessage: "🇰🇷 Joyeux jour de la libération, Corée ! 광복절 축하합니다! 🎊",
    indiaIndependenceDayMessage: "🇮🇳 Joyeux jour de l'indépendance, Inde ! Jai Hind ! 🇮🇳",
    thailandNationalDayMessage: "🇹🇭 Joyeuse fête nationale, Thaïlande ! สุขสันต์วันชาติไทย! 🎉",
    philippinesIndependenceDayMessage: "🇵🇭 Joyeux jour de l'indépendance, Philippines ! Mabuhay ! 🇵🇭",
    vietnamNationalDayMessage: "🇻🇳 Joyeuse fête nationale, Vietnam ! Quốc khánh Việt Nam ! 🎊",
    polandNationalDayMessage: "🇵🇱 Joyeux jour de l'indépendance, Pologne ! Święto Niepodległości ! 🎉",
    czechNationalDayMessage: "🇨🇿 Joyeux jour de l'indépendance, République tchèque ! Den nezávislosti ! 🎊",
    netherlandsKingsDayMessage: "🇳🇱 Fijne Koningsdag ! Vive le Roi ! 🧡",
    norwayConstitutionDayMessage: "🇳🇴 Gratulerer med dagen, Norge ! 🇳🇴",
    swedenNationalDayMessage: "🇸🇪 Glad Sveriges nationaldag ! 🇸🇪",
    finlandIndependenceDayMessage: "🇫🇮 Hyvää itsenäisyyspäivää, Suomi ! 🇫🇮",
    portugalNationalDayMessage: "🇵🇹 Feliz Dia de Portugal ! 🇵🇹",
    israelIndependenceDayMessage: "🇮🇱 יום עצמאות שמח! Joyeux jour de l'indépendance, Israël ! 🎉",
    irelandNationalDayMessage: "🇮🇪 Joyeuse Saint-Patrick, Irlande ! Lá Fhéile Pádraig sona duit ! 🍀",
    bruneiNationalDayMessage: "🇧🇳 Selamat Hari Kebangsaan Brunei ! 🎊",
    newZealandWaitangiDayMessage: "🇳🇿 Joyeux jour de Waitangi, Nouvelle-Zélande ! 🎉",
    switzerlandNationalDayMessage: "🇨🇭 Joyeuse fête nationale suisse ! Fête nationale suisse ! 🎊",
    austriaNationalDayMessage: "🇦🇹 Froher Nationalfeiertag, Österreich ! 🎉",
    belgiumNationalDayMessage: "🇧🇪 Joyeuse Fête Nationale, Belgique ! Fijne Nationale Feestdag ! 🎊",
    russiaDayOfRussiaMessage: "🇷🇺 С Днём России ! Joyeux jour de la Russie ! 🎉",
''',
    'it': '''    singaporeNationalDayMessage: "🇸🇬 Buon giorno nazionale, Singapore! Festeggiamo 61 anni di indipendenza! 🎉",
    indonesiaNationalDayMessage: "🇮🇩 Selamat Hari Kemerdekaan Indonesia! Dirgahayu Republik Indonesia! 🎊",
    malaysiaNationalDayMessage: "🇲🇾 Selamat Hari Merdeka, Malaysia! Festeggiamo l'indipendenza della nostra nazione! 🎊",
    australiaNationalDayMessage: "🇦🇺 Buon giorno dell'Australia! Festeggiamo la nostra nazione! 🎉",
    canadaNationalDayMessage: "🇨🇦 Buon giorno del Canada! Festeggiamo la nostra grande nazione! 🍁",
    usaNationalDayMessage: "🇺🇸 Buon giorno dell'indipendenza, America! Festeggiamo la libertà! 🎆",
    franceBastilleDayMessage: "🇫🇷 Buon 14 luglio! Viva la Francia! 🎊",
    germanyUnityDayMessage: "🇩🇪 Buon giorno dell'unità tedesca! Tag der Deutschen Einheit! 🎉",
    italyRepublicDayMessage: "🇮🇹 Buona Festa della Repubblica! 🇮🇹",
    spainNationalDayMessage: "🇪🇸 ¡Feliz Día de la Hispanidad! 🎊",
    japanFoundationDayMessage: "🇯🇵 Buon giorno della fondazione, Giappone! 建国記念の日おめでとうございます！🎌",
    chinaNationalDayMessage: "🇨🇳 Buon giorno nazionale, Cina! 国庆节快乐！🎉",
    koreaLiberationDayMessage: "🇰🇷 Buon giorno della liberazione, Corea! 광복절 축하합니다! 🎊",
    indiaIndependenceDayMessage: "🇮🇳 Buon giorno dell'indipendenza, India! Jai Hind! 🇮🇳",
    thailandNationalDayMessage: "🇹🇭 Buon giorno nazionale, Thailandia! สุขสันต์วันชาติไทย! 🎉",
    philippinesIndependenceDayMessage: "🇵🇭 Buon giorno dell'indipendenza, Filippine! Mabuhay! 🇵🇭",
    vietnamNationalDayMessage: "🇻🇳 Buon giorno nazionale, Vietnam! Quốc khánh Việt Nam! 🎊",
    polandNationalDayMessage: "🇵🇱 Buon giorno dell'indipendenza, Polonia! Święto Niepodległości! 🎉",
    czechNationalDayMessage: "🇨🇿 Buon giorno dell'indipendenza, Repubblica Ceca! Den nezávislosti! 🎊",
    netherlandsKingsDayMessage: "🇳🇱 Fijne Koningsdag! Lunga vita al Re! 🧡",
    norwayConstitutionDayMessage: "🇳🇴 Gratulerer med dagen, Norge! 🇳🇴",
    swedenNationalDayMessage: "🇸🇪 Glad Sveriges nationaldag! 🇸🇪",
    finlandIndependenceDayMessage: "🇫🇮 Hyvää itsenäisyyspäivää, Suomi! 🇫🇮",
    portugalNationalDayMessage: "🇵🇹 Feliz Dia de Portugal! 🇵🇹",
    israelIndependenceDayMessage: "🇮🇱 יום עצמאות שמח! Buon giorno dell'indipendenza, Israele! 🎉",
    irelandNationalDayMessage: "🇮🇪 Buon giorno di San Patrizio, Irlanda! Lá Fhéile Pádraig sona duit! 🍀",
    bruneiNationalDayMessage: "🇧🇳 Selamat Hari Kebangsaan Brunei! 🎊",
    newZealandWaitangiDayMessage: "🇳🇿 Buon giorno di Waitangi, Nuova Zelanda! 🎉",
    switzerlandNationalDayMessage: "🇨🇭 Buon giorno nazionale svizzero! Fête nationale suisse! 🎊",
    austriaNationalDayMessage: "🇦🇹 Froher Nationalfeiertag, Österreich! 🎉",
    belgiumNationalDayMessage: "🇧🇪 Buon giorno nazionale, Belgio! Fijne Nationale Feestdag! 🎊",
    russiaDayOfRussiaMessage: "🇷🇺 С Днём России! Buon giorno della Russia! 🎉",
''',
    'tl': '''    singaporeNationalDayMessage: "🇸🇬 Maligayang Araw ng Kalayaan, Singapore! Ipinagdiriwang ang 61 taon ng kalayaan! 🎉",
    indonesiaNationalDayMessage: "🇮🇩 Selamat Hari Kemerdekaan Indonesia! Dirgahayu Republik Indonesia! 🎊",
    malaysiaNationalDayMessage: "🇲🇾 Selamat Hari Merdeka, Malaysia! Ipinagdiriwang ang kalayaan ng ating bansa! 🎊",
    australiaNationalDayMessage: "🇦🇺 Maligayang Araw ng Australia! Ipinagdiriwang ang ating bansa! 🎉",
    canadaNationalDayMessage: "🇨🇦 Maligayang Araw ng Canada! Ipinagdiriwang ang ating dakilang bansa! 🍁",
    usaNationalDayMessage: "🇺🇸 Maligayang Araw ng Kalayaan, America! Ipinagdiriwang ang kalayaan! 🎆",
    franceBastilleDayMessage: "🇫🇷 Maligayang ika-14 ng Hulyo! Mabuhay ang France! 🎊",
    germanyUnityDayMessage: "🇩🇪 Maligayang Araw ng Pagkakaisa ng Germany! Tag der Deutschen Einheit! 🎉",
    italyRepublicDayMessage: "🇮🇹 Buona Festa della Repubblica! 🇮🇹",
    spainNationalDayMessage: "🇪🇸 ¡Feliz Día de la Hispanidad! 🎊",
    japanFoundationDayMessage: "🇯🇵 Maligayang Araw ng Pagtatag, Japan! 建国記念の日おめでとうございます！🎌",
    chinaNationalDayMessage: "🇨🇳 Maligayang Araw ng Bansa, China! 国庆节快乐！🎉",
    koreaLiberationDayMessage: "🇰🇷 Maligayang Araw ng Kalayaan, Korea! 광복절 축하합니다! 🎊",
    indiaIndependenceDayMessage: "🇮🇳 Maligayang Araw ng Kalayaan, India! Jai Hind! 🇮🇳",
    thailandNationalDayMessage: "🇹🇭 Maligayang Araw ng Bansa, Thailand! สุขสันต์วันชาติไทย! 🎉",
    philippinesIndependenceDayMessage: "🇵🇭 Maligayang Araw ng Kalayaan, Pilipinas! Mabuhay! 🇵🇭",
    vietnamNationalDayMessage: "🇻🇳 Maligayang Araw ng Bansa, Vietnam! Quốc khánh Việt Nam! 🎊",
    polandNationalDayMessage: "🇵🇱 Maligayang Araw ng Kalayaan, Poland! Święto Niepodległości! 🎉",
    czechNationalDayMessage: "🇨🇿 Maligayang Araw ng Kalayaan, Czech Republic! Den nezávislosti! 🎊",
    netherlandsKingsDayMessage: "🇳🇱 Fijne Koningsdag! Mabuhay ang Hari! 🧡",
    norwayConstitutionDayMessage: "🇳🇴 Gratulerer med dagen, Norge! 🇳🇴",
    swedenNationalDayMessage: "🇸🇪 Glad Sveriges nationaldag! 🇸🇪",
    finlandIndependenceDayMessage: "🇫🇮 Hyvää itsenäisyyspäivää, Suomi! 🇫🇮",
    portugalNationalDayMessage: "🇵🇹 Feliz Dia de Portugal! 🇵🇹",
    israelIndependenceDayMessage: "🇮🇱 יום עצמאות שמח! Maligayang Araw ng Kalayaan, Israel! 🎉",
    irelandNationalDayMessage: "🇮🇪 Maligayang Araw ni San Patricio, Ireland! Lá Fhéile Pádraig sona duit! 🍀",
    bruneiNationalDayMessage: "🇧🇳 Selamat Hari Kebangsaan Brunei! 🎊",
    newZealandWaitangiDayMessage: "🇳🇿 Maligayang Araw ng Waitangi, New Zealand! 🎉",
    switzerlandNationalDayMessage: "🇨🇭 Maligayang Araw ng Switzerland! Fête nationale suisse! 🎊",
    austriaNationalDayMessage: "🇦🇹 Froher Nationalfeiertag, Österreich! 🎉",
    belgiumNationalDayMessage: "🇧🇪 Maligayang Araw ng Bansa, Belgium! Fijne Nationale Feestdag! 🎊",
    russiaDayOfRussiaMessage: "🇷🇺 С Днём России! Maligayang Araw ng Russia! 🎉",
''',
}

print("Adding national day messages...")
for lang, messages in national_days.items():
    # Find: vesakTHMessage line, then insert national days before orderNumber
    pattern = rf'(\s+vesakTHMessage:\s*"[^"]*",)\r?\n(\s+orderNumber:)'
    
    def replacer(match):
        return match.group(1) + '\n' + messages + match.group(2)
    
    new_content = re.sub(pattern, replacer, content, count=1)
    
    if new_content != content:
        content = new_content
        print(f"✓ Added national day messages to {lang}")
    else:
        print(f"✗ Failed to add to {lang}")

# Write back
with open('src/translations.js', 'w', encoding='utf-8-sig', newline='') as f:
    f.write(content)

print("\n✓ National day messages added!")

#!/usr/bin/env python3
# Script to add holiday messages to translations.js

import re

# Read the file
with open('src/translations.js', 'r', encoding='utf-8-sig') as f:
    content = f.read()

# Define the holiday messages for each language
holiday_messages = {
    'fr': '''    // Holiday Messages
    hariRayaMessage: "🌙 Selamat Hari Raya Aidilfitri ! Nous vous souhaitons, à vous et votre famille, paix, joie et bénédictions ! 🌟",
    deepavaliMessage: "🪔 Joyeuse Deepavali ! Que la fête des lumières vous apporte joie, prospérité et succès ! ✨",
    diwaliMessage: "🪔 Joyeux Diwali ! Que la fête des lumières vous apporte joie, prospérité et succès ! ✨",
    vesakMessage: "☸️ Joyeux jour de Vesak ! Nous vous souhaitons paix, sagesse et illumination en ce jour sacré ! 🙏",
    vesakTHMessage: "☸️ Joyeux jour de Visakha Bucha ! Nous vous souhaitons paix, sagesse et illumination en ce jour sacré ! 🙏",
    singaporeNationalDayMessage: "🇸🇬 Joyeuse fête nationale, Singapour ! Célébrons 61 ans d'indépendance ! 🎉",
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
}

# Find and replace for French
pattern = r'(fr: \{[^\}]*?cnyYearOfHorseMessage: "[^"]*🐴",)\r?\n(\s+orderNumber:)'
replacement = r'\1\n' + holiday_messages['fr'] + r'\2'
 content = re.sub(pattern, replacement, content, count=1)

# Write the modified content back
with open('src/translations.js', 'w', encoding='utf-8-sig', newline='') as f:
    f.write(content)

print("French holiday messages added successfully!")

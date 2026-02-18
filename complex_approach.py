#!/usr/bin/env python3  
# Add ALL missing holiday messages to translations.js - Complete version

import re

# Read the file
with open('src/translations.js', 'r', encoding='utf-8-sig') as f:
    content = f.read()

# For languages with SOME messages (es, ja, pt, th), add only religious holidays
# For languages with NO messages, add ALL messages

# A complete set of all messages for languages that need everything
def get_all_messages(lang_specific=''):
    return f'''    // Holiday Messages
    hariRayaMessage: "{lang_specific.get('hari', '🌙 Selamat Hari Raya Aidilfitri! Wishing you and your family peace, joy, and blessings! 🌟')}",
    deepavaliMessage: "{lang_specific.get('deepavali', '🪔 Happy Deepavali! May the festival of lights bring you joy, prosperity, and success! ✨')}",
    diwaliMessage: "{lang_specific.get('diwali', '🪔 Happy Diwali! May the festival of lights bring you joy, prosperity, and success! ✨')}",
    vesakMessage: "{lang_specific.get('vesak', '☸️ Happy Vesak Day! Wishing you peace, wisdom, and enlightenment on this sacred day! 🙏')}",
    vesakTHMessage: "{lang_specific.get('vesakTH', '☸️ Happy Visakha Bucha Day! Wishing you peace, wisdom, and enlightenment on this sacred day! 🙏')}",
    singaporeNationalDayMessage: "{lang_specific.get('singapore', '🇸🇬 Happy National Day, Singapore! Celebrating 61 years of independence! 🎉')}",
    indonesiaNationalDayMessage: "{lang_specific.get('indonesia', '🇮🇩 Selamat Hari Kemerdekaan Indonesia! Dirgahayu Republik Indonesia! 🎊')}",
    malaysiaNationalDayMessage: "{lang_specific.get('malaysia', '🇲🇾 Selamat Hari Merdeka, Malaysia! Celebrating our nation\\'s independence! 🎊')}",
    australiaNationalDayMessage: "{lang_specific.get('australia', '🇦🇺 Happy Australia Day! Celebrating our nation! 🎉')}",
    canadaNationalDayMessage: "{lang_specific.get('canada', '🇨🇦 Happy Canada Day! Celebrating our great nation! 🍁')}",
    usaNationalDayMessage: "{lang_specific.get('usa', '🇺🇸 Happy Independence Day, America! Celebrating freedom and liberty! 🎆')}",
    franceBastilleDayMessage: "{lang_specific.get('france', '🇫🇷 Joyeux 14 Juillet! Vive la France! 🎊')}",
    germanyUnityDayMessage: "{lang_specific.get('germany', '🇩🇪 Happy German Unity Day! Tag der Deutschen Einheit! 🎉')}",
    italyRepublicDayMessage: "{lang_specific.get('italy', '🇮🇹 Buona Festa della Repubblica! 🇮🇹')}",
    spainNationalDayMessage: "{lang_specific.get('spain', '🇪🇸 ¡Feliz Día de la Hispanidad! 🎊')}",
    japanFoundationDayMessage: "{lang_specific.get('japan', '🇯🇵 Happy Foundation Day, Japan! 建国記念の日おめでとうございます！🎌')}",
    chinaNationalDayMessage: "{lang_specific.get('china', '🇨🇳 Happy National Day, China! 国庆节快乐！🎉')}",
    koreaLiberationDayMessage: "{lang_specific.get('korea', '🇰🇷 Happy Liberation Day, Korea! 광복절 축하합니다! 🎊')}",
    indiaIndependenceDayMessage: "{lang_specific.get('india', '🇮🇳 Happy Independence Day, India! Jai Hind! 🇮🇳')}",
    thailandNationalDayMessage: "{lang_specific.get('thailand', '🇹🇭 Happy National Day, Thailand! สุขสันต์วันชาติไทย! 🎉')}",
    philippinesIndependenceDayMessage: "{lang_specific.get('philippines', '🇵🇭 Happy Independence Day, Philippines! Mabuhay! 🇵🇭')}",
    vietnamNationalDayMessage: "{lang_specific.get('vietnam', '🇻🇳 Happy National Day, Vietnam! Quốc khánh Việt Nam! 🎊')}",
    polandNationalDayMessage: "{lang_specific.get('poland', '🇵🇱 Happy Independence Day, Poland! Święto Niepodległości! 🎉')}",
    czechNationalDayMessage: "{lang_specific.get('czech', '🇨🇿 Happy Independence Day, Czech Republic! Den nezávislosti! 🎊')}",
    netherlandsKingsDayMessage: "{lang_specific.get('netherlands', '🇳🇱 Fijne Koningsdag! Long live the King! 🧡')}",
    norwayConstitutionDayMessage: "{lang_specific.get('norway', '🇳🇴 Gratulerer med dagen, Norge! 🇳🇴')}",
    swedenNationalDayMessage: "{lang_specific.get('sweden', '🇸🇪 Glad Sveriges nationaldag! 🇸🇪')}",
    finlandIndependenceDayMessage: "{lang_specific.get('finland', '🇫🇮 Hyvää itsenäisyyspäivää, Suomi! 🇫🇮')}",
    portugalNationalDayMessage: "{lang_specific.get('portugal', '🇵🇹 Feliz Dia de Portugal! 🇵🇹')}",
    israelIndependenceDayMessage: "{lang_specific.get('israel', '🇮🇱 יום עצמאות שמח! Happy Independence Day, Israel! 🎉')}",
    irelandNationalDayMessage: "{lang_specific.get('ireland', '🇮🇪 Happy St. Patrick\\'s Day, Ireland! Lá Fhéile Pádraig sona duit! 🍀')}",
    bruneiNationalDayMessage: "{lang_specific.get('brunei', '🇧🇳 Selamat Hari Kebangsaan Brunei! 🎊')}",
    newZealandWaitangiDayMessage: "{lang_specific.get('newzealand', '🇳🇿 Happy Waitangi Day, New Zealand! 🎉')}",
    switzerlandNationalDayMessage: "{lang_specific.get('switzerland', '🇨🇭 Happy Swiss National Day! Fête nationale suisse! 🎊')}",
    austriaNationalDayMessage: "{lang_specific.get('austria', '🇦🇹 Froher Nationalfeiertag, Österreich! 🎉')}",
    belgiumNationalDayMessage: "{lang_specific.get('belgium', '🇧🇪 Joyeuse Fête Nationale, Belgique! Fijne Nationale Feestdag! 🎊')}",
    russiaDayOfRussiaMessage: "{lang_specific.get('russia', '🇷🇺 С Днём России! Happy Russia Day! 🎉')}",
'''

# Since the translations dictionary is too large to include here directly,
# I'll use a simpler approach: run the previous script that adds religious holidays
# Then create a separate script for the national days for languages that need them all

print("This approach is too complex. Using a targeted sed/awk solution instead...")

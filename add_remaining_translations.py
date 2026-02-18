#!/usr/bin/env python3
"""
Add 6 new holiday message translations to remaining languages in translations.js
"""

import re

# Translations for each language
translations = {
    "hi": {
        "russiaDayOfRussiaMessage": '🇷🇺 С Днём России! रूस दिवस की शुभकामनाएँ! 🎉',
        "taiwanFoundingDayMessage": '🇹🇼 ताइवान स्थापना दिवस की शुभकामनाएँ! 中華民國開國紀念日快樂！🎊',
        "taiwanNationalDayMessage": '🇹🇼 ताइवान दोहरा दस दिवस की शुभकामनाएँ! 國慶日快樂！🎉',
        "hongKongHandoverDayMessage": '🇭🇰 हांगकांग विशेष प्रशासनिक क्षेत्र स्थापना दिवस की शुभकामनाएँ! 香港特別行政區成立紀念日快樂！🎊',
        "macauHandoverDayMessage": '🇲🇴 मकाउ विशेष प्रशासनिक क्षेत्र स्थापना दिवस की शुभकामनाएँ! 澳門特別行政區成立紀念日快樂！🎉',
        "laborDayMessage": '⚒️ अंतर्राष्ट्रीय श्रमिक दिवस की शुभकामनाएँ! श्रम और श्रमिकों के अधिकारों का जश्न! 🎊',
        "laborDayUSCAMessage": '⚒️ श्रम दिवस की शुभकामनाएँ! श्रमिकों के योगदान का सम्मान! 🎉'
    },
    "nl": {
        "russiaDayOfRussiaMessage": '🇷🇺 С Днём России! Fijne Rusland Dag! 🎉',
        "taiwanFoundingDayMessage": '🇹🇼 Fijne Stichtingsdag, Taiwan! 中華民國開國紀念日快樂！🎊',
        "taiwanNationalDayMessage": '🇹🇼 Fijne Dubbel Tien Dag, Taiwan! 國慶日快樂！🎉',
        "hongKongHandoverDayMessage": '🇭🇰 Fijne SAR Hong Kong Oprichtingsdag! 香港特別行政區成立紀念日快樂！🎊',
        "macauHandoverDayMessage": '🇲🇴 Fijne SAR Macau Oprichtingsdag! 澳門特別行政區成立紀念日快樂！🎉',
        "laborDayMessage": '⚒️ Fijne Internationale Dag van de Arbeid! Vieren van arbeid en werknemersrechten! 🎊',
        "laborDayUSCAMessage": '⚒️ Fijne Dag van de Arbeid! Hulde aan de bijdragen van arbeiders! 🎉'
    },
    "cs": {
        "russiaDayOfRussiaMessage": '🇷🇺 С Днём России! Šťastný Den Ruska! 🎉',
        "taiwanFoundingDayMessage": '🇹🇼 Šťastný Den založení, Tchaj-wan! 中華民國開國紀念日快樂！🎊',
        "taiwanNationalDayMessage": '🇹🇼 Šťastný Den dvojité desítky, Tchaj-wan! 國慶日快樂！🎉',
        "hongKongHandoverDayMessage": '🇭🇰 Š ťastný Den založení SAR Hongkong! 香港特別行政區成立紀念日快樂！🎊',
        "macauHandoverDayMessage": '🇲🇴 Šťastný Den založení SAR Macao! 澳門特別行政區成立紀念日快樂！🎉',
        "laborDayMessage": '⚒️ Šťastný Mezinárodní den práce! Oslavujeme práci a práva pracujících! 🎊',
        "laborDayUSCAMessage": '⚒️ Šťastný Den práce! Ctíme přínos pracujících! 🎉'
    },
    "he": {
        "russiaDayOfRussiaMessage": '🇷🇺 С Днём России! יום רוסיה שמח! 🎉',
        "taiwanFoundingDayMessage": '🇹🇼 יום ייסוד שמח, טייוואן! 中華民國開國紀念日快樂！🎊',
        "taiwanNationalDayMessage": '🇹🇼 יום עשר כפול שמח, טייוואן! 國慶日快樂！🎉',
        "hongKongHandoverDayMessage": '🇭🇰 יום הקמת אזור מנהלי מיוחד הונג קונג שמח! 香港特別行政區成立紀念日快樂！🎊',
        "macauHandoverDayMessage": '🇲🇴 יום הקמת אזור מנהלי מיוחד מקאו שמח! 澳門特別行政區成立紀念日快樂！🎉',
        "laborDayMessage": '⚒️ יום העובדים הבינלאומי שמח! חוגגים עבודה וזכויות עובדים! 🎊',
        "laborDayUSCAMessage": '⚒️ יום העבודה שמח! מכבדים את תרומות העובדים! 🎉'
    },
    "ga": {
        "russiaDayOfRussiaMessage": '🇷🇺 С Днём России! Lá Rúise faoi mhaise duit! 🎉',
        "taiwanFoundingDayMessage": '🇹🇼 Lá Bunaithe faoi mhaise duit, an Téaváin! 中華民國開國紀念日快樂！🎊',
        "taiwanNationalDayMessage": '🇹🇼 Lá Dúbailte Deich faoi mhaise duit, an Téaváin! 國慶日快樂！🎉',
        "hongKongHandoverDayMessage": '🇭🇰 Lá Bunaithe SAR Hong Cong faoi mhaise duit! 香港特別行政區成立紀念日快樂！🎊',
        "macauHandoverDayMessage": '🇲🇴 Lá Bunaithe SAR Macao faoi mhaise duit! 澳門特別行政區成立紀念日快樂！🎉',
        "laborDayMessage": '⚒️ Lá Oibrithe Idirnáisiunta faoi mhaise duit! Ag ceiliúradh saotha ir agus cearta oibrithe! 🎊',
        "laborDayUSCAMessage": '⚒️ Lá Saothair faoi mhaise duit! Ag tabhairt onóra do ranníocaíochtaí oibrithe! 🎉'
    },
    "pl": {
        "russiaDayOfRussiaMessage": '🇷🇺 С Днём России! Szczęśliwego Dnia Rosji! 🎉',
        "taiwanFoundingDayMessage": '🇹🇼 Szczęśliwego Dnia Założenia, Tajwan! 中華民國開國紀念日快樂！🎊',
        "taiwanNationalDayMessage": '🇹🇼 Szczęśliwego Dnia Podwójnej Dziesiątki, Tajwan! 國慶日快樂！🎉',
        "hongKongHandoverDayMessage": '🇭🇰 Szczęśliwego Dnia Ustanowienia SAR Hongkong! 香港特別行政區成立紀念日快樂！🎊',
        "macauHandoverDayMessage": '🇲🇴 Szczęśliwego Dnia Ustanowienia SAR Makau! 澳門特別行政區成立紀念日快樂！🎉',
        "laborDayMessage": '⚒️ Szczęśliwego Międzynarodowego Dnia Pracy! Świętujemy pracę i prawa pracowników! 🎊',
        "laborDayUSCAMessage": '⚒️ Szczęśliwego Dnia Pracy! Uczcimy wkład pracowników! 🎉'
    },
    "ko": {
        "russiaDayOfRussiaMessage": '🇷🇺 С Днём России! 러시아의 날을 축하합니다! 🎉',
        "taiwanFoundingDayMessage": '🇹🇼 대만 건국 기념일을 축하합니다! 中華民國開國紀念日快樂！🎊',
        "taiwanNationalDayMessage": '🇹🇼 대만 쌍십절을 축하합니다! 國慶日快樂！🎉',
        "hongKongHandoverDayMessage": '🇭🇰 홍콩 특별행정구 설립 기념일을 축하합니다! 香港特別行政區成立紀念日快樂！🎊',
        "macauHandoverDayMessage": '🇲🇴 마카오 특별행정구 설립 기념일을 축하합니다! 澳門特別行政區成立紀念日快樂！🎉',
        "laborDayMessage": '⚒️ 세계 노동절을 축하합니다! 노동과 노동자 권리를 기념합니다! 🎊',
        "laborDayUSCAMessage": '⚒️ 노동절을 축하합니다! 노동자의 공헌을 기립니다! 🎉'
    },
    "no": {
        "russiaDayOfRussiaMessage": '🇷🇺 С Днём России! Gratulerer med Russlands dag! 🎉',
        "taiwanFoundingDayMessage": '🇹🇼 Gratulerer med grunnleggelsesdagen, Taiwan! 中華民國開國紀念日快樂！🎊',
        "taiwanNationalDayMessage": '🇹🇼 Gratulerer med dobbel ti-dagen, Taiwan! 國慶日快樂！🎉',
        "hongKongHandoverDayMessage": '🇭🇰 Gratulerer med SAR Hong Kongs grunnleggelsesdag! 香港特別行政區成立紀念日快樂！🎊',
        "macauHandoverDayMessage": '🇲🇴 Gratulerer med SAR Macaus grunnleggelsesdag! 澳門特別行政區成立紀念日快樂！🎉',
        "laborDayMessage": '⚒️ Gratulerer med den internasjonale arbeiderdagen! Feirer arbeid og arbeidstakernes rettigheter! 🎊',
        "laborDayUSCAMessage": '⚒️ Gratulerer med arbeidsdagen! Ærer arbeidernes bidrag! 🎉'
    },
    "sv": {
        "russiaDayOfRussiaMessage": '🇷🇺 С Днём России! Grattis på Rysslands dag! 🎉',
        "taiwanFoundingDayMessage": '🇹🇼 Grattis på grundläggelsedagen, Taiwan! 中華民國開國紀念日快樂！🎊',
        "taiwanNationalDayMessage": '🇹🇼 Grattis på dubbel tio-dagen, Taiwan! 國慶日快樂！🎉',
        "hongKongHandoverDayMessage": '🇭🇰 Grattis på SAR Hong Kongs grundläggalsedag! 香港特別行政區成立紀念日快樂！🎊',
        "macauHandoverDayMessage": '🇲🇴 Grattis på SAR Macaus grundläggalsedag! 澳門特別行政區成立紀念日快樂！🎉',
        "laborDayMessage": '⚒️ Grattis på den internationella arbetardagen! Firar arbete och arbetares rättigheter! 🎊',
        "laborDayUSCAMessage": '⚒️ Grattis på arbetsdagen! Hedrar arbetarnas bidrag! 🎉'
    },
    "vi": {
        "russiaDayOfRussiaMessage": '🇷🇺 С Днём России! Chúc mừng Ngày Nga! 🎉',
        "taiwanFoundingDayMessage": '🇹🇼 Chúc mừng Ngày Thành lập, Đài Loan! 中華民國開國紀念日快樂！🎊',
        "taiwanNationalDayMessage": '🇹🇼 Chúc mừng Ngày Quốc khánh Đài Loan! 國慶日快樂！🎉',
        "hongKongHandoverDayMessage": '🇭🇰 Chúc mừng Ngày Thành lập Đặc khu Hành chính Hồng Kông! 香港特別行政區成立紀念日快樂！🎊',
        "macauHandoverDayMessage": '🇲🇴 Chúc mừng Ngày Thành lập Đặc khu Hành chính Ma Cao! 澳門特別行政區成立紀念日快樂！🎉',
        "laborDayMessage": '⚒️ Chúc mừng Ngày Quốc tế Lao động! Kỷ niệm lao động và quyền của người lao động! 🎊',
        "laborDayUSCAMessage": '⚒️ Chúc mừng Ngày Lao động! Tôn vinh những đóng góp của người lao động! 🎉'
    },
    "fi": {
        "russiaDayOfRussiaMessage": '🇷🇺 С Днём России! Hyvää Venäjän päivää! 🎉',
        "taiwanFoundingDayMessage": '🇹🇼 Hyvää perustamispäivää, Taiwan! 中華民國開國紀念日快樂！🎊',
        "taiwanNationalDayMessage": '🇹🇼 Hyvää kaksoiskymmenen päivää, Taiwan! 國慶日快樂！🎉',
        "hongKongHandoverDayMessage": '🇭🇰 Hyvää SAR Hongkongin perustamispäivää! 香港特別行政區成立紀念日快樂！🎊',
        "macauHandoverDayMessage": '🇲🇴 Hyvää SAR Macaun perustamispäivää! 澳門特別行政區成立紀念日快樂！🎉',
        "laborDayMessage": '⚒️ Hyvää kansainvälistä työväenpäivää! Juhlimme työtä ja työntekijöiden oikeuksia! 🎊',
        "laborDayUSCAMessage": '⚒️ Hyvää työväenpäivää! Kunnioitamme työntekijöiden panosta! 🎉'
    },
    "ru": {
        "russiaDayOfRussiaMessage": '🇷🇺 С Днём России! 🎉',
        "taiwanFoundingDayMessage": '🇹🇼 С Днём основания, Тайвань! 中華民國開國紀念日快樂！🎊',
        "taiwanNationalDayMessage": '🇹🇼 С Днём двойной десятки, Тайвань! 國慶日快樂！🎉',
        "hongKongHandoverDayMessage": '🇭🇰 С Днём образования САР Гонконг! 香港特別行政區成立紀念日快樂！🎊',
        "macauHandoverDayMessage": '🇲🇴 С Днём образования САР Макао! 澳門特別行政區成立紀念日快樂！🎉',
        "laborDayMessage": '⚒️ С Международным днём труда! Празднуем труд и права трудящихся! 🎊',
        "laborDayUSCAMessage": '⚒️ С Днём труда! Чтим вклад трудящихся! 🎉'
    },
    "cy": {
        "russiaDayOfRussiaMessage": '🇷🇺 С Днём России! Diwrnod Rwsia hapus! 🎉',
        "taiwanFoundingDayMessage": '🇹🇼 Diwrnod Sefydlu hapus, Taiwan! 中華民國開國紀念日快樂！🎊',
        "taiwanNationalDayMessage": '🇹🇼 Diwrnod Dwbl Deg hapus, Taiwan! 國慶日快樂！🎉',
        "hongKongHandoverDayMessage": '🇭🇰 Diwrnod Sefydlu SAR Hong Kong hapus! 香港特別行政區成立紀念日快樂！🎊',
        "macauHandoverDayMessage": '🇲🇴 Diwrnod Sefydlu SAR Macau hapus! 澳門特別行政區成立紀念日快樂！🎉',
        "laborDayMessage": '⚒️ Diwrnod Gweithwyr Rhyngwladol hapus! Dathlu llafur a hawliau gweithwyr! 🎊',
        "laborDayUSCAMessage": '⚒️ Diwrnod Llafur hapus! Anrhydeddu cyfraniadau gweithwyr! 🎉'
    }
}

# Read the file
with open('src/translations.js', 'r', encoding='utf-8') as f:
    content = f.read()

# For each language, find where to insert and add the translations
for lang, trans in translations.items():
    # Find the language section
    pattern = rf'^(  {lang}: \{{.*?)(    orderNumber:)'
    
    # Build the translation string
    trans_str = ''
    for key, value in trans.items():
        trans_str +=f'    {key}: "{value}",\n'
    
    # Insert the translations
    content = re.sub(
        pattern,
        rf'\1{trans_str}\2',
        content,
        flags=re.MULTILINE | re.DOTALL,
        count=1
    )

# Write the updated content
with open('src/translations.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("✓ Successfully added translations to all remaining languages!")
print("Languages updated: hi, nl, cs, he, ga, pl, ko, no, sv, vi, fi, ru, cy")

#!/bin/bash
# Add postalContactsBackButton to all language sections

FILE="src/translations.js"

# Translations for "Back to Parcel Enquiry Form" in different languages
declare -A TRANSLATIONS
TRANSLATIONS["de"]="Zurück zum Paket-Anfr ageformular"
TRANSLATIONS["fr"]="Retour au formulaire d'enquête sur le colis"
TRANSLATIONS["es"]="Volver al formulario de consulta de paquetes"
TRANSLATIONS["ja"]="荷物お問い合わせフォームに戻る"
TRANSLATIONS["zh"]="返回包裹查詢表"
TRANSLATIONS["pt"]="Voltar aoformulário de consulta de encomendas"
TRANSLATIONS["hi"]="पार्सल जांच फ़ॉर्म पर वापस जाएं"
TRANSLATIONS["th"]="กลับไปที่แบบฟอร์มสอบถามพัสดุ"
TRANSLATIONS["ms"]="Kembali ke Borang Pertanyaan Bungkusan"
TRANSLATIONS["nl"]="Terug naar het pakketonderzoeksformulier"
TRANSLATIONS["id"]="Kembali ke Formulir Pertanyaan Paket"
TRANSLATIONS["it"]="Torna al modulo di richiesta informazioni sul pacco"
TRANSLATIONS["he"]="חזרה לטופס בירור חבילה"
TRANSLATIONS["ga"]="Ar ais chuig an bhFoirm Fiosrúcháin Beirte"
TRANSLATIONS["pl"]="Powrót do formularza zapytania o przesyłkę"
TRANSLATIONS["ko"]="소포 문의 양식으로 돌아가기"
TRANSLATIONS["no"]="Tilbake til pakkeskjema"
TRANSLATIONS["sv"]="Tillbaka till paketförfrågningsformuläret"
TRANSLATIONS["tl"]="Bumalik sa Parcel Enquiry Form"
TRANSLATIONS["vi"]="Quay lại biểu mẫu yêu cầu gói hàng"
TRANSLATIONS["fi"]="Takaisin lähetyskyselyn lomakkeeseen"
TRANSLATIONS["ru"]="Вернуться к форме запроса о посылке"
TRANSLATIONS["cy"]="Yn ôl i'r Ffurflen Ymholiad Parsel"
TRANSLATIONS["ta"]="பார்சல் விசாரணை படிவத்திற்கு திரும்பு"
TRANSLATIONS["mi"]="Hoki ki te Puka Pātai Pāka"
TRANSLATIONS["cs"]="Zpět na formulář dotazu na balík"

# Function to add the key after postalContactsFormLink
add_key() {
    local lang=$1
    local translation=$2
    
    # Find the line with postalContactsFormLink for this language section
    # and add the new key after it
    sed -i "/\"$lang\": {/,/},/{
        /\"postalContactsFormLink\":/a\\    \"postalContactsBackButton\": \"$translation\",
}" "$FILE"
}

# Add to each language
for lang in "${!TRANSLATIONS[@]}"; do
    echo "Adding postalContactsBackButton to $lang..."
    add_key "$lang" "${TRANSLATIONS[$lang]}"
done

echo "✅ Done! Added postalContactsBackButton to all language sections."

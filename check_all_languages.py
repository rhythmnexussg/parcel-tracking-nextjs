#!/usr/bin/env python3
# Check which languages are missing which messages

import re

# Read the file
with open('src/translations.js', 'r', encoding='utf-8-sig') as f:
    content = f.read()

# List of languages that need checking (from user's requirements)
langs_to_check = ['fr', 'es', 'ja', 'pt', 'hi', 'th', 'nl', 'cs', 'it', 'he', 'ga', 'pl', 'ko', 'no', 'sv', 'tl', 'vi', 'fi', 'ru', 'cy']

# Messages that should exist
required_messages = [
    'hariRayaMessage',
    'deepavaliMessage',
    'diwaliMessage',
    'vesakMessage',
    'vesakTHMessage',
    'singaporeNationalDayMessage',
    'indonesiaNationalDayMessage',
    'malaysiaNationalDayMessage',
    'australiaNationalDayMessage',
    'canadaNationalDayMessage',
    'usaNationalDayMessage', 
    'franceBastilleDayMessage',
    'germanyUnityDayMessage',
    'italyRepublicDayMessage',
    'spainNationalDayMessage',
    'japanFoundationDayMessage',
    'chinaNationalDayMessage',
    'koreaLiberationDayMessage',
    'indiaIndependenceDayMessage',
    'thailandNationalDayMessage',
    'philippinesIndependenceDayMessage',
    'vietnamNationalDayMessage',
    'polandNationalDayMessage',
    'czechNationalDayMessage',
    'netherlandsKingsDayMessage',
    'norwayConstitutionDayMessage',
    'swedenNationalDayMessage',
    'finlandIndependenceDayMessage',
    'portugalNationalDayMessage',
    'israelIndependenceDayMessage',
    'irelandNationalDayMessage',
    'bruneiNationalDayMessage',
    'newZealandWaitangiDayMessage',
    'switzerlandNationalDayMessage',
    'austriaNationalDayMessage',
    'belgiumNationalDayMessage',
    'russiaDayOfRussiaMessage'
]

for lang in langs_to_check:
    # Find the language section
    pattern = rf'\s+{lang}:\s*\{{.*?\n\s+\}},?\s*\n'
    match = re.search(pattern, content, re.DOTALL)
    
    if match:
        lang_section = match.group(0)
        missing_messages = []
        for msg in required_messages:
            if msg not in lang_section:
                missing_messages.append(msg)
        
        if missing_messages:
            print(f"\n{lang} - Missing {len(missing_messages)} messages:")
            if 'hariRayaMessage' in missing_messages:
                print(f"  - Missing ALL holiday messages")
            else:
                print(f"  - Has some messages, missing: {', '.join(missing_messages[:5])}")
                if len(missing_messages) > 5:
                    print(f"    ... and {len(missing_messages) - 5} more")
        else:
            print(f"\n{lang} - ✓ All messages present")
    else:
        print(f"\n{lang} - Language section not found!")

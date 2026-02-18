#!/usr/bin/env python3
# Script to add missing holiday messages to all languages in translations.js

import re

# Read the file
with open('src/translations.js', 'r', encoding='utf-8-sig') as f:
    lines = f.readlines()

# Find where to insert for each language by finding cnyYearOfHorseMessage lines
insertions = []

for i, line in enumerate(lines):
    if 'cnyYearOfHorseMessage:' in line:
        # Get the language part to identify which lang this is
        # Look backwards to find the language code
        for j in range(i-1, max(0, i-50), -1):
            if re.search(r'^\s+(fr|es|nl|cs|it|he|ga|pl|ko|no|sv|tl|vi|fi|ru|cy|th|hi|pt):\s*\{', lines[j]):
                lang = re.search(r'^\s+(fr|es|nl|cs|it|he|ga|pl|ko|no|sv|tl|vi|fi|ru|cy|th|hi|pt):\s*\{', lines[j]).group(1)
                # Check if next line already has hariRayaMessage or other holiday messages
                if i+1 < len(lines) and ('hariRayaMessage' not in lines[i+1] and 'Holiday Messages' not in lines[i+1] and 'singaporeNationalDayMessage' not in lines[i+1]):
                    insertions.append((i+1, lang))
                elif i+1 < len(lines) and 'singaporeNationalDayMessage' in lines[i+1]:
                    # Has national day messages but missing religious holiday messages
                    insertions.append((i+1, lang, 'partial'))
                break

print(f"Found {len(insertions)} languages that need updates:")
for item in insertions:
    if len(item) == 3:
        print(f"  Line {item[0]}: {item[1]} (partial - needs religious holidays)")
    else:
        print(f"  Line {item[0]}: {item[1]} (needs all messages)")

# Keep only unique lang codes for confirmation
updated_langs = set()
for item in insertions:
    lang = item[1]
    updated_langs.add(lang)

print(f"\nLanguages to update: {sorted(updated_langs)}")

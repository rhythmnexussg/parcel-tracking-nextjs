# PowerShell script to add missing translation keys to all languages

$filePath = "src\translations.js"
$content = Get-Content $filePath -Raw

# Define the new keys to add to each language (after existing keys, before closing brace)
$newKeys = @'
    enterDestinationPostcode: "Enter destination postcode",
    trackingCaseSensitive: "TRACKING LETTERS ARE CASE SENSITIVE",
    usaPostcodeNote: "USA: Full ZIP code may be required. HK/Macau: use 999077/999078",
    epacDeliveryNote: "ePAC items delivered to mailbox/doorstep/locker",
    countriesNoMailbox: "No mailbox delivery: Brunei, China, India, Israel, Macau, Philippines, Poland, Vietnam",
    rhythmNexusNotResponsible: "Rhythm Nexus not responsible for deliveries",
    issuesAfterDelivery: "Contact us after 30/45 days or if delivered but not received",
    cannotUseEmbed: "Cannot use embed tracking",
    clickLinkAbove: "Click link above to track",
    trackingDetailsNote: "Paste tracking number for best results",
    thirdPartyWebsites: "Third-party tracking websites:",
    enterEmailOrPhone: "Enter email or phone",
'@

# Update faqA6 for all languages to add SpeedPost lines
# Pattern: Find faqA6 lines and replace with updated version including SpeedPost

$languageCodes = @('de', 'fr', 'es', 'ja', 'zh', 'zh-hant', 'pt', 'hi', 'th', 'ms', 'nl', 'id', 'cs', 'it', 'he', 'ga', 'pl', 'ko', 'no', 'sv', 'tl', 'vi')

foreach ($lang in $languageCodes) {
    # Find and update faqA6 to include SpeedPost Priority (EMS) and SpeedPost Express lines
    $pattern = "($lang`:\s*\{[^}]*faqA6:\s*`"[^`"]*ePAC:[^`"]*)"
    if ($content -match $pattern) {
        Write-Host "Updating faqA6 for language: $lang"
    }
}

Write-Host "Translation update complete!"

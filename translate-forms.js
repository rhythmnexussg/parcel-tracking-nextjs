#!/usr/bin/env node
/**
 * Translate contact form keys to all 27 languages using @vitalets/google-translate-api
 */

const fs = require('fs');

// Check if translation package is available
let translate;
try {
  translate = require('@vitalets/google-translate-api');
} catch (e) {
  console.log('Installing @vitalets/google-translate-api...');
  require('child_process').execSync('npm install @vitalets/google-translate-api', { stdio: 'inherit' });
  translate = require('@vitalets/google-translate-api');
}

const { translate: googleTranslate } = translate;

// Language mapping
const LANGUAGES = {
  'fr': 'fr',
  'es': 'es',
  'ja': 'ja',
  'zh-TW': 'zh-TW',
  'pt': 'pt',
  'hi': 'hi',
  'th': 'th',
  'ms': 'ms',
  'nl': 'nl',
  'id': 'id',
  'it': 'it',
  'he': 'he',
  'ga': 'ga',
  'pl': 'pl',
  'ko': 'ko',
  'no': 'no',
  'sv': 'sv',
  'tl': 'tl',
  'vi': 'vi',
  'fi': 'fi',
  'ru': 'ru',
  'cy': 'cy',
  'ta': 'ta',
  'mi': 'mi'
};

// Contact form keys - all the keys that need translation
const CONTACT_KEYS = {
  "contactUsTitle": "Contact Us",
  "contactNameLabel": "Name (NO NICKNAMES NOR PHONE NUMBER)",
  "contactEmailLabel": "Email address (where we will respond to you)",
  "contactEmailNote": "Private relay emails (e.g., @privaterelay.appleid.com) are not accepted. Please use a valid email address.",
  "contactEnquiryTypeLabel": "Is this a?",
  "contactSelectOption": "Select an option",
  "contactGeneralEnquiry": "General Enquiry / Feedback",
  "contactBusinessEnquiry": "Business Enquiry",
  "contactOrderShippingEnquiry": "Order/Shipping Enquiry",
  "contactExchangeRefundEnquiry": "Exchange/Refund/Return Enquiry",
  "contactOthers": "Others",
  "contactParcelWarning": "If your parcel is not delivered for more than 18/30/45 days (14 days for FedEx), or status shows delivered but it is not with you, please fill in",
  "contactParcelWarningLink": "THIS FORM",
  "contactParcelWarningEnd": "instead.",
  "contactOrderNumberLabel": "Order Number",
  "contactOrderNumberPlaceholder": "Example: RTNX1234567890",
  "contactPlatformNote": "Etsy, eBay & Shopee order number here. We have ZERO control of refunds from these platforms. Please contact their customer service respectively.",
  "contactPlatformInstructions": "Please use the app to look into your order number, as it is saved in the app:",
  "contactPlatformEtsy": "Etsy - Top right on your profile → Purchases",
  "contactPlatformEbay": "eBay - My eBay → Purchases",
  "contactPlatformShopee": "Shopee - Me → View Purchase History (or you can click on To Ship/To Receive)",
  "contactRefundNote1": "If you are enquiring for Return/Refund for the platforms you purchased from, please note that we have ZERO control of refunds from these platforms. Please contact their customer service respectively.",
  "contactRefundNote2": "For Returns or Exchanges, we do not allow it for maimai gloves if they have been used already when opened (visible stains or washed in washing machine/manual wash), and no returns or exchanges are allowed for amusement cards. Thank you.",
  "contactRefundNote3": "Please note that for refunds through Payhip, contact your bank or Payhip support at support@payhip.com for information if you haven't received the refund as we have no control over the process.",
  "contactMessageLabel": "Your Message (up to 1000 characters)",
  "contactCharacterCount": "characters",
  "contactSpamWarningNote": "Note:",
  "contactSpamWarning": "Unsolicited offers for SEO, website design, loans, or similar services will be automatically rejected.",
  "contactAgreementText1": "Please click on \"I Agree\", if you agree to your email address being used for Rhythm Nexus to respond to you, as this is required by us to read your response and reply to you once we come out with a solution for your enquiry.",
  "contactAgreementText2": "Do note that our response will take between 3-5 business days, or longer during high volume of emails on our end.",
  "contactAgreeCheckbox": "I Agree",
  "contactSuccessMessage": "Your message has been sent successfully! We will respond within 3-5 business days.",
  "contactErrorMessage": "Failed to send message. Please try again.",
  "contactGeneralError": "An error occurred. Please try again later.",
  "contactSubmitting": "Submitting...",
  "contactSubmit": "Submit",  
  "contactAlertAgree": "Please agree to the terms to submit the form.",
  "parcelEnquiryTitle": "Parcel Enquiry",
  "parcelInfoText": "This form is for parcels that are undelivered for more than 18/30/45 days (14 days for FedEx/DHL), or have shown delivered status but are not with you.",
  "parcelInfoLink": "Click here",
  "parcelInfoEnd": "for other enquiries.",
  "parcelWaitTitle": "Please Wait for Your Parcel",
  "parcelWaitText1": "Please await for your parcel to deliver. Do note International deliveries are NOT the same as local deliveries as they need to take time. Thanks!",
  "parcelWaitText2": "If no status shows after 18 days (7 days for Singapore) or more, you can let us know directly.",
  "parcelDeliveryWindowText": "Estimated Delivery Times (from date of posting)",
  "parcelDeliveryEMS": "SpeedPost Priority International (EMS): 18-30 days",
  "parcelDeliveryePAC": "SingPost ePAC: 30-45 days",
  "parcelDeliveryExpress": "SpeedPost Express: 7-14 days",
  "parcelDeliveryFedEx": "FedEx International Priority: 7-14 days",
  "parcelStillWaitText": "Are you still willing to wait?",
  "parcelYesWait": "Yes, I will wait",
  "parcelNoInvestigate": "No, please investigate",
  "parcelFormTitle": "Parcel Investigation Form",
  "parcelCannotSubmit": "You cannot submit this form if you selected \"No\".",
  "parcelNameLabel": "Name",
  "parcelOrderNumberLabel": "Order Number (Example: RTNX1234567890)",
  "parcelOrderNumberPlaceholder": "RTNX1234567890",
  "parcelEmailLabel": "Email Address (We will respond to you through here)",
  "parcelEmailNote": "Private relay emails are not accepted. Please use a valid email address.",
  "parcelShippingMethodLabel": "Shipping Method Chosen?",
  "parcelSelectShipping": "Select a shipping method",
  "parcelSingPostEpac": "SingPost ePacket (or ePAC) - aka SpeedPost Saver International (Tracking: LG/LP/LT123456789SG)",
  "parcelSingPostPrepaid": "SingPost Prepaid Tracked Label (Tracking: PP123456789SG)",
  "parcelSpeedPostStandard": "SpeedPost Standard (Tracking: SPNDD0000001234)",
  "parcelSpeedPostPriority": "SpeedPost Priority (EMS) (Tracking: EZ123456789SG)",
  "parcelSpeedPostExpress": "SpeedPost Express (Tracking: PX123456789SG)",
  "parcelDHL": "DHL Express (EU Countries Only) (Tracking: 1234567890)",
  "parcelTrackingNumberLabel": "Tracking number of your parcel?",
  "parcelUndeliveredLabel": "Has your parcel been undelivered for more than 18/30/45 days? (Singapore Local services >7 days, >14 days for SpeedPost Express/DHL)",
  "parcelSelectOption": "Select an option",
  "parcelYes": "Yes",
  "parcelNo": "No",
  "parcelDeliveredButMissingLabel": "Has your parcel showed status delivered, but it isn't present in your mailbox/safe place/doorstep?",
  "parcelCaseReferenceLabel": "Case Reference ID from Local Post Office",
  "parcelCaseReferencePlaceholder": "Put NA if you are from Singapore",
  "parcelCaseReferenceNote": "Before submitting this form, please contact your local post office through telephone or email and get a case reference ID from them. Then, put your case reference ID here.",
  "parcelCaseReferenceLink": "Refer to this link for Postal Service contacts",
  "parcelCaseReferenceMandatory": "PUT NA ONLY IF YOU ARE FROM SINGAPORE. For other countries it is MANDATORY to provide. Required for SpeedPost Express too, for DHL's case ID.",
  "parcelImageEvidenceLabel": "Image Evidence (for delivered but missing parcels)",
  "parcelImageWarning": "For additional verification, we need image evidence to prove that you are not making false claims about parcel non-delivery. (Only for parcels that are delivered already, but are not present in mailbox/outside doorstep. We may reject your claim if no photo evidence is given for delivered items. Ignore this if your item has NOT shown delivered status.)",
  "parcelImageNote": "Upload 1 supported file: image. Max 1 GB.",
  "parcelAgreementText": "Please Click on \"I agree\" if you ensure that what has happened to your parcel was true.",
  "parcelAgreeCheckbox": "I agree",
  "parcelSuccessMessage": "Your parcel enquiry has been submitted successfully! We will respond within 3-5 business days.",
  "parcelErrorMessage": "Failed to submit enquiry. Please try again.",
  "parcelGeneralError": "An error occurred. Please try again later.",
  "parcelAlertWait": "Please await for your parcel to deliver. You can submit this form after the specified waiting period.",
  "parcelAlertAgree": "Please agree to the terms to submit the form.",
  "parcelAlertCaseReference": "Please provide a case reference ID from your local post office, or put NA if you are from Singapore.",
  "parcelSubmitting": "Submitting...",
  "parcelSubmit": "Submit"
};

async function translateText(text, targetLang) {
  try {
    // Keep certain special strings as-is
    if (text === '→' || text === 'RTNX1234567890' || text === 'NA' || text.includes('@')) {
      return text;
    }
    
    const result = await googleTranslate(text, { to: targetLang });
    return result.text;
  } catch (error) {
    console.error(`Error translating to ${targetLang}: ${error.message}`);
    return text; // Return original on error
  }
}

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function translateAllForms() {
  const allTranslations = {};
  
  for (const [langCode, targetLang] of Object.entries(LANGUAGES)) {
    console.log(`\nTranslating to ${langCode}...`);
    allTranslations[langCode] = {};
    
    let count = 0;
    for (const [key, englishText] of Object.entries(CONTACT_KEYS)) {
      count++;
      console.log(`  ${count}/${Object.keys(CONTACT_KEYS).length} - ${key}`);
      const translated = await translateText(englishText, targetLang);
      allTranslations[langCode][key] = translated;
      
      // Add delay to avoid rate limiting
      await delay(100);
    }
  }
  
  // Save to JSON file
  fs.writeFileSync(
    'contact_translations.json',
    JSON.stringify(allTranslations, null, 2),
    'utf-8'
  );
  
  console.log(`\n✅ Translations saved to contact_translations.json`);
  console.log(`Total: ${Object.keys(LANGUAGES).length} languages × ${Object.keys(CONTACT_KEYS).length} keys = ${Object.keys(LANGUAGES).length * Object.keys(CONTACT_KEYS).length} translations`);
}

translateAllForms().catch(console.error);

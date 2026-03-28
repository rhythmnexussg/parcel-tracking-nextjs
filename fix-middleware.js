const fs = require('fs');

let fileContent = fs.readFileSync('middleware.js', 'utf8');

// The call site is:
// const platformVersionHeader = request.headers.get('sec-ch-ua-platform-version') || '';
// We also need:
// const platformHeader = request.headers.get('sec-ch-ua-platform') || '';

fileContent = fileContent.replace(
  "const platformVersionHeader = request.headers.get('sec-ch-ua-platform-version') || '';",
  "const platformHeader = (request.headers.get('sec-ch-ua-platform') || '').replace(/\"/g, '');\n  const platformVersionHeader = request.headers.get('sec-ch-ua-platform-version') || '';"
);

// We need to pass platformHeader to getUnsupportedSystemFromUserAgent
fileContent = fileContent.replace(
  "const unsupportedSystem = getUnsupportedSystemFromUserAgent(userAgent, nowMs, platformVersionMajor, platformVersionParts);",
  "const unsupportedSystem = getUnsupportedSystemFromUserAgent(userAgent, nowMs, platformVersionMajor, platformVersionParts, platformHeader);"
);

// And update the signature
fileContent = fileContent.replace(
  "function getUnsupportedSystemFromUserAgent(userAgent, nowMs = Date.now(), platformVersionMajor = null, platformVersionParts = null) {",
  "function getUnsupportedSystemFromUserAgent(userAgent, nowMs = Date.now(), platformVersionMajor = null, platformVersionParts = null, platformName = '') {"
);

// And fix the Android check
fileContent = fileContent.replace(
  "if (platformVersionMajor != null) {\n    if (platformVersionMajor < 13) {\n      return `Android ${platformVersionMajor}`;\n    }\n  }",
  "if (platformVersionMajor != null && /^Android$/i.test(platformName)) {\n    if (platformVersionMajor < 13) {\n      return `Android ${platformVersionMajor}`;\n    }\n  }"
);

fs.writeFileSync('middleware.js', fileContent);
console.log('Fixed middleware!');

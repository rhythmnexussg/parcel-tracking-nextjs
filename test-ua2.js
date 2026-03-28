const fs = require('fs');

const uaChromeWin7 = 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36';
const uaFirefoxWin7 = 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:115.0) Gecko/20100101 Firefox/115.0';
const uaChromeWin81 = 'Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36';
const uaFirefoxWin81 = 'Mozilla/5.0 (Windows NT 6.3; Win64; x64; rv:115.0) Gecko/20100101 Firefox/115.0';
const uaChromeVista = 'Mozilla/5.0 (Windows NT 6.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.0.0 Safari/537.36';

const src = fs.readFileSync('middleware.js', 'utf8');

// We need to evaluate the function in isolation to test it.
const evalContext = {};
const fnCode = src.match(/function getUnsupportedSystemFromUserAgent[^}]+}\s*}/)[0];

eval(`
function WINDOWS_SERVER_2016_SUPPORT_END_UTC() {}
function WINDOWS_SERVER_2019_SUPPORT_END_UTC() {}
const nowMs = Date.now();
function extractFirefoxMajorVersion(userAgent) {
  const match = userAgent.match(/Firefox\\/(\\d+)/i);
  if (!match) return null;
  return Number(match[1]);
}
function extractAndroidVersion(userAgent) {
  const match = userAgent.match(/Android\\s+(\\d+)/i);
  if (!match) return null;
  return { major: Number(match[1]) };
}
function extractAppleMobileOsVersion(userAgent) { return null; }
function extractIphoneOsVersion(userAgent) { return null; }
function isIpadUserAgent(userAgent) { return false; }
function extractMacOsVersion(userAgent) { return null; }
function isWindowsVistaOrBelowUserAgent(ua) {
  return /windows nt 6\\.0|windows vista|windows nt 5\\.2|windows nt 5\\.1|windows xp|windows nt 5\\.0|windows 2000|windows 98|windows 95|windows me|windows nt 4\\.0/.test(ua);
}

${fnCode}
evalContext.getUnsupportedSystemFromUserAgent = getUnsupportedSystemFromUserAgent;
`);

console.log('Win7 Chrome:', evalContext.getUnsupportedSystemFromUserAgent(uaChromeWin7, Date.now(), null, null, 'Windows'));
console.log('Win7 Chrome ClientHints:', evalContext.getUnsupportedSystemFromUserAgent(uaChromeWin7, Date.now(), 0, null, 'Windows'));
console.log('Win7 Firefox:', evalContext.getUnsupportedSystemFromUserAgent(uaFirefoxWin7));
console.log('Win8.1 Chrome:', evalContext.getUnsupportedSystemFromUserAgent(uaChromeWin81));
console.log('Win8.1 Firefox:', evalContext.getUnsupportedSystemFromUserAgent(uaFirefoxWin81));
console.log('Vista Chrome:', evalContext.getUnsupportedSystemFromUserAgent(uaChromeVista));


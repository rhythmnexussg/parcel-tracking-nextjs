// Test IP geolocation services to diagnose Russia detection issues
async function testGeolocationAPIs() {
  console.log('=== Testing Geolocation APIs ===\n');

  // Test 1: ipapi.co
  console.log('Test 1: ipapi.co');
  try {
    const response = await fetch('https://ipapi.co/json/', {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Country Code:', data.country_code);
    console.log('Country Name:', data.country_name);
    console.log('Full response:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('❌ Failed:', error.message);
  }

  console.log('\n---\n');

  // Test 2: geolocation-db.com
  console.log('Test 2: geolocation-db.com');
  try {
    const response = await fetch('https://geolocation-db.com/json/', {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Country Code:', data.country_code || data.countryCode);
    console.log('Country Name:', data.country_name);
    console.log('Full response:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('❌ Failed:', error.message);
  }

  console.log('\n---\n');

  // Test 3: Browser info
  console.log('Test 3: Browser Information');
  console.log('Browser Languages:', navigator.languages || [navigator.language]);
  console.log('Browser Timezone:', Intl.DateTimeFormat().resolvedOptions().timeZone);
  console.log('IP:', 'Check browser dev tools - Network tab for ipapi.co request');
}

// Run tests
if (typeof window !== 'undefined') {
  testGeolocationAPIs();
}

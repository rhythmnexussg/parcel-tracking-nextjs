// Test script to verify Russia timezone configuration
const russiaTimezones = [
  { name: 'Kaliningrad Oblast (UTC+2)', timezone: 'Europe/Kaliningrad' },
  { name: 'Moscow/Western Russia (UTC+3)', timezone: 'Europe/Moscow' },
  { name: 'Samara Oblast (UTC+4)', timezone: 'Europe/Samara' },
  { name: 'Ural Region (UTC+5)', timezone: 'Asia/Yekaterinburg' },
  { name: 'Omsk Oblast (UTC+6)', timezone: 'Asia/Omsk' },
  { name: 'Krasnoyarsk Krai (UTC+7)', timezone: 'Asia/Krasnoyarsk' },
  { name: 'Irkutsk Oblast (UTC+8)', timezone: 'Asia/Irkutsk' },
  { name: 'Sakha Republic (UTC+9)', timezone: 'Asia/Yakutsk' },
  { name: 'Primorsky Krai (UTC+10)', timezone: 'Asia/Vladivostok' },
  { name: 'Magadan Oblast (UTC+11)', timezone: 'Asia/Magadan' },
  { name: 'Kamchatka Krai (UTC+12)', timezone: 'Asia/Kamchatka' },
];

console.log('Russia timezone count:', russiaTimezones.length);
console.log('Expected: 11');
console.log('Match:', russiaTimezones.length === 11 ? '✓' : '✗');

console.log('\nTesting time formatting for each timezone:');
const date = new Date();

russiaTimezones.forEach((tz, index) => {
  try {
    const time = date.toLocaleTimeString('en-US', {
      timeZone: tz.timezone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
    
    // Calculate offset
    const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
    const tzDate = new Date(date.toLocaleString('en-US', { timeZone: tz.timezone }));
    const offsetMinutes = Math.round((tzDate - utcDate) / (1000 * 60));
    const offsetHours = offsetMinutes / 60;
    
    console.log(`${index + 1}. ${tz.name}`);
    console.log(`   Time: ${time}`);
    console.log(`   Offset: UTC${offsetHours >= 0 ? '+' : ''}${offsetHours}`);
  } catch (error) {
    console.log(`${index + 1}. ${tz.name} - ERROR:`, error.message);
  }
});

// Test Singapore time reference
try {
  const sgTime = date.toLocaleTimeString('en-US', {
    timeZone: 'Asia/Singapore',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
  console.log('\nSingapore Reference Time:', sgTime);
} catch (error) {
  console.log('Singapore time error:', error.message);
}

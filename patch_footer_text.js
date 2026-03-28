const fs = require('fs');

let content = fs.readFileSync('src/components/Footer.js', 'utf8');

const oldText = `Your trusted partner for global e-commerce and international parcel tracking. 
              Delivering seamless international shipping data.`;

const newText = `Your premier destination for arcade amusement cards, rhythm game gloves, and specialized merch. Enjoy global e-commerce with seamless international parcel tracking and reliable shipping data.`;

content = content.replace(oldText, newText);

fs.writeFileSync('src/components/Footer.js', content, 'utf8');
console.log('patched footer text');

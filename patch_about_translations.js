const fs = require('fs');

let content = fs.readFileSync('src/translations.js', 'utf8');

// We are only safely substituting the EN strings to keep the system robust, we'll replace the en ones with the newly requested branding.
const oldP1 = `"aboutP1": "We started our store in 2022 and have sold on platforms such as Etsy, eBay, and Shopee over the years without fail.",`;
const newP1 = `"aboutP1": "We started our store in 2022, specializing in arcade amusement cards and high-performance gloves for rhythm game enthusiasts. We have sold on platforms such as Etsy, eBay, and Shopee over the years without fail.",`;

const oldP2 = `"aboutP2": "Over time, we have built a strong reputation by focusing on reliable fulfillment, transparent communication, and accurate tracking for every order we ship.",`;
const newP2 = `"aboutP2": "As part of our commitment to the global rhythm gaming community, we have built a strong reputation by focusing on premium arcade merch, reliable fulfillment, transparent communication, and accurate tracking for every order we ship.",`;

content = content.replace(oldP1, newP1);
content = content.replace(oldP2, newP2);

fs.writeFileSync('src/translations.js', content, 'utf8');
console.log('patched english translations for about');

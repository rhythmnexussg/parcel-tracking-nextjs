const fs = require('fs');

let content = fs.readFileSync('src/app/page.js', 'utf8');

const regex = /\s*<div className="home-section mt-5">\s*<div className="text-center mb-4">[\s\S]*?<\/div>\s*<\/div>\n\n/g;

content = content.replace(regex, '\n');

fs.writeFileSync('src/app/page.js', content, 'utf8');
console.log('Removed section');

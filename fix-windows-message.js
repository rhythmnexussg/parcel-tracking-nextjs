const fs = require('fs');

let fileContent = fs.readFileSync('src/app/blocked/page.js', 'utf8');

fileContent = fileContent.replace(
  'return "Please use Windows 11 25H2 or above (OS build 26200+) or Windows 11 Enterprise LTSC / IoT Enterprise LTSC 2024 (build 26100).";',
  'return "Please use Windows 7 (with patches installed) or above.";'
);


fs.writeFileSync('src/app/blocked/page.js', fileContent);
console.log('Fixed blocked message!');

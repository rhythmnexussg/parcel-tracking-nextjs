const fs = require('fs');

let fileContent = fs.readFileSync('src/app/access/page.js', 'utf8');

fileContent = fileContent.replace(
  'Security notice: Windows 10 22H2 (OS build 19045) support ends on 1 Jan 2027. Starting 1 Jan 2027, this website will no longer be accessible on that version. Please upgrade to Windows 11 25H2 or above (OS build 26200+).',
  'Security notice: Windows 10 22H2 (OS build 19045) support ends on 1 Jan 2027 without ESU. Please use Windows 7 (with patches installed) or above.'
);


fs.writeFileSync('src/app/access/page.js', fileContent);
console.log('Fixed access message!');

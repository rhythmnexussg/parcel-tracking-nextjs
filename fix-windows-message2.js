const fs = require('fs');

let fileContent = fs.readFileSync('src/app/blocked/page.js', 'utf8');

fileContent = fileContent.replace(
  'return "Windows 10 22H2 (build 19045) is no longer supported after 1 Jan 2027. Please upgrade to Windows 11 25H2 or above (OS build 26200+).";',
  'return "Windows 10 22H2 (build 19045) is no longer supported without ESU. Please use Windows 7 (with patches installed) or above.";'
);

fileContent = fileContent.replace(
  'return "Windows 10 21H2 Enterprise LTSC / IoT Enterprise LTSC (build 19044) is supported only until 1 Feb 2032. Please plan to upgrade before support ends.";',
  'return "Windows 10 21H2 Enterprise LTSC / IoT Enterprise LTSC (build 19044) is supported only until 1 Feb 2032. Please use Windows 7 (with patches installed) or above.";'
);

fileContent = fileContent.replace(
  'return "Please use Windows 11 25H2 or above (OS build 26200+) or Windows 11 Enterprise LTSC / IoT Enterprise LTSC 2024 (build 26100) to continue accessing this website.";',
  'return "Please use Windows 7 (with patches installed) or above.";'
);

fs.writeFileSync('src/app/blocked/page.js', fileContent);
console.log('Fixed more blocked messages!');

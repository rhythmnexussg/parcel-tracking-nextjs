const fs = require('fs');

let fileContent = fs.readFileSync('middleware.js', 'utf8');

if (!fileContent.includes("windows nt 6\\.2|windows 8")) {
  console.log("WAIT, windows 8 check is MISSING");
} else {
  console.log("Windows 8 block is STILL IN THERE.");
}


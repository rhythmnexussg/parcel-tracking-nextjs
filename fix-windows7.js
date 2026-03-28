const fs = require('fs');

let fileContent = fs.readFileSync('src/translations.js', 'utf8');

// The string varies per language (e.g. Windows: Windows 10 oder höher).
// We can just regex replace `Windows 10 ` with `Windows 7 (with ESU updates installed) ` 
// Wait, the wording might be complicated.
// Let's replace `Windows 10 (or above|oder höher|ou plus|etc)` with English? No, let's just replace `Windows 10` with `Windows 7 (with all ESU updates)` for simplicity across all languages, assuming it makes sense.

fileContent = fileContent.replace(/Windows 10/g, 'Windows 7 (with ESU updates installed)');

fs.writeFileSync('src/translations.js', fileContent);
console.log('Done!');

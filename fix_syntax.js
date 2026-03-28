const fs = require('fs');

const file1 = 'src/app/page.js';
let content1 = fs.readFileSync(file1, 'utf8');
content1 = content1.replace('        </div>\n        </div>\n\n        <p className="text-muted">', '        </div>\n\n        <p className="text-muted">');
fs.writeFileSync(file1, content1, 'utf8');

const file2 = 'src/app/track-your-item/page.js';
let content2 = fs.readFileSync(file2, 'utf8');
content2 = content2.replace('        </div>\n        </div>\n\n        <p className="mt-5 text-muted">', '        </div>\n\n        <p className="mt-5 text-muted">');
fs.writeFileSync(file2, content2, 'utf8');

console.log('Fixed syntax errors');

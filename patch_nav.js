const fs = require('fs');

let content = fs.readFileSync('src/components/Navigation.js', 'utf8');

content = content.replace(
  /<nav className="navbar">/g,
  '<>\n    <nav className="navbar">'
);

content = content.replace(
  /<\/nav>\s*\);\s*};/g,
  '</nav>\n      <div className="navbar-spacer"></div>\n    </>\n  );\n};'
);

fs.writeFileSync('src/components/Navigation.js', content, 'utf8');
console.log('patched navigation');

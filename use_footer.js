const fs = require('fs');

const filesToUpdate = [
  'src/app/page.js',
  'src/app/track-your-item/page.js',
  'src/app/about/page.js',
  'src/app/FAQ/page.js',
  'src/app/terms-of-service/page.js',
  'src/app/privacy-policy/page.js',
  'src/app/blog/page.js',
];

for (const file of filesToUpdate) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Auto-import Footer if not present
    if (!content.includes('import { Footer }')) {
       // Find the last import and insert Footer import there
       content = content.replace(/(import .*?;?\n)(?!import )/, '$1import { Footer } from "../../components/Footer";\n');
       // Adjust path for page.js and track-your-item
       if (file === 'src/app/page.js') {
         content = content.replace('../../components/Footer', '../components/Footer');
       }
    }

    // Replace old copyright with Footer
    const copyrightRegex1 = /<p className="text-muted">[\s\S]*?<\/p>/g;
    const copyrightRegex2 = /<p className="mt-5 text-muted">[\s\S]*?<\/p>/g;
    
    content = content.replace(copyrightRegex1, '<Footer />');
    content = content.replace(copyrightRegex2, '<Footer />');
    
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated', file);
  } else {
    console.log('Not found', file);
  }
}

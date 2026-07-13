const fs = require('fs');
const glob = require('glob');
const files = glob.sync('src/**/*.tsx');
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  let original = content;
  
  content = content.replace(/,\s*backgroundColor:\s*\"var\(--bg-page\)\"/g, '');
  content = content.replace(/backgroundColor:\s*\"var\(--bg-page\)\"\s*,?/g, '');
  content = content.replace(/,\s*background:\s*\"var\(--bg-page\)\"/g, '');
  content = content.replace(/background:\s*\"var\(--bg-page\)\"\s*,?/g, '');
  content = content.replace(/style=\{\{\s*\}\}/g, '');

  if (content !== original) {
    fs.writeFileSync(f, content);
    console.log('Updated ' + f);
  }
});

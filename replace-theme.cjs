const fs = require('fs');
const path = require('path');

function getFiles(dir, files = []) {
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const name = path.join(dir, file);
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, files);
    } else {
      if (name.endsWith('.tsx')) {
        files.push(name);
      }
    }
  }
  return files;
}

const files = getFiles('src/components/admin');

const replacements = [
  { regex: /bg-brand-bg/g, replacement: "bg-slate-50" },
  { regex: /text-brand-navy/g, replacement: "text-slate-900" },
  { regex: /text-brand-muted/g, replacement: "text-slate-500" },
  { regex: /border-brand-border(\/\d+)?/g, replacement: "border-slate-200" },
  { regex: /bg-brand-primary(\/\d+)?/g, replacement: "bg-indigo-600" },
  { regex: /text-brand-primary/g, replacement: "text-indigo-600" },
  { regex: /shadow-premium(-lg|-xl)?/g, replacement: "shadow-sm" },
  { regex: /rounded-3xl/g, replacement: "rounded-2xl" },
  { regex: /font-\[900\]/g, replacement: "font-bold" },
  { regex: /font-\[800\]/g, replacement: "font-semibold" }
];

files.forEach(file => {
  if (file.includes('Overview.tsx') || file.includes('SettingsPage.tsx') || file.includes('AdminHeader.tsx')) return;
  
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  replacements.forEach(r => {
    content = content.replace(r.regex, r.replacement);
  });
  
  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
});

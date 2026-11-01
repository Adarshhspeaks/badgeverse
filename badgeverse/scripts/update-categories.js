const fs = require('fs');
const path = require('path');

const templatesPath = path.join(__dirname, '..', 'src', 'lib', 'templates.json');
const templates = JSON.parse(fs.readFileSync(templatesPath, 'utf8'));

templates.forEach(t => {
  if (t.id.startsWith('f1')) {
    t.cat = 'F1';
  } else if (t.id.startsWith('spiderman')) {
    t.cat = 'Spider-Man';
  } else if (t.id.startsWith('batman')) {
    t.cat = 'Batman';
  }
});

fs.writeFileSync(templatesPath, JSON.stringify(templates, null, 2), 'utf8');
console.log('Updated categories for F1, Spider-Man, and Batman in templates.json!');


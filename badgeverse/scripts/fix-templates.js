const fs = require('fs');
const path = require('path');

const templatesPath = path.join(__dirname, '..', 'src', 'lib', 'templates.json');
const templates = JSON.parse(fs.readFileSync(templatesPath, 'utf8'));

templates.forEach(t => {
  if (t.id === 'spiderman') {
    t.front.forEach(el => {
      if (el.id === 'sp_f03') {
        el.text = '🕷️ SPIDER-VERSE // HERO PASS';
        el.size = 14;
        el.w = 340;
      }
      if (el.id === 'sp_f26') {
        el.type = 'bar';
        el.color = '#ffffff';
      }
    });
  }
  if (t.id === 'f1') {
    t.front.forEach(el => {
      if (el.id === 'f1_f26') {
        el.type = 'bar';
        el.color = '#ffffff';
      }
    });
  }
});

fs.writeFileSync(templatesPath, JSON.stringify(templates, null, 2), 'utf8');
console.log('Fixed barcode types and header text!');


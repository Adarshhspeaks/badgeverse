const puppeteer = require('puppeteer-core');
const path = require('path');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const targets = [
  { id: 'velocity', url: 'http://localhost:3000/preview/velocity' },
  { id: 'noir', url: 'http://localhost:3000/preview/noir' },
  { id: 'y2k', url: 'http://localhost:3000/preview/y2k' },
  { id: 'travel', url: 'http://localhost:3000/preview/travel' },
  { id: 'gallery', url: 'http://localhost:3000/templates' },
];

async function main() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1300, deviceScaleFactor: 1 });

  for (const item of targets) {
    const outPath = `c:\\Imp-Projects\\badgeverse-pack\\screenshots\\batch1-${item.id}.png`;
    console.log(`Navigating to ${item.url}...`);
    await page.goto(item.url, { waitUntil: 'networkidle2' });
    // Wait for animations and card elements to settle
    await new Promise((r) => setTimeout(r, 1200));

    console.log(`Taking screenshot for ${item.id}...`);
    await page.screenshot({ path: outPath, fullPage: false });
    console.log(`Saved ${outPath}`);
  }

  await browser.close();
  console.log('All screenshots captured successfully with puppeteer!');
}

main().catch((err) => {
  console.error('Error during capture:', err);
  process.exit(1);
});


const puppeteer = require('puppeteer-core');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function main() {
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
  await page.setViewport({ width: 1440, height: 1300, deviceScaleFactor: 1 });

  const url = 'http://localhost:3000/preview/travel';
  console.log(`Navigating to ${url}...`);
  await page.goto(url, { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 2000));

  await page.screenshot({ path: 'c:\\Imp-Projects\\badgeverse-pack\\screenshots\\batch1-travel.png' });
  console.log('Saved batch1-travel.png');

  await page.goto('http://localhost:3000/templates', { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 2000));
  await page.screenshot({ path: 'c:\\Imp-Projects\\badgeverse-pack\\screenshots\\batch1-gallery.png' });
  console.log('Saved batch1-gallery.png');

  await browser.close();
}

main().catch(console.error);


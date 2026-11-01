const puppeteer = require('puppeteer-core');
const path = require('path');
const os = require('os');
const fs = require('fs');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const outDir = 'C:\\Users\\adars\\.gemini\\antigravity\\brain\\c0584739-f6b5-4d3b-ba1d-124edf766b07\\screenshots';
const userDataDir = path.join(os.tmpdir(), 'puppeteer_clean_export_' + Date.now());

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    userDataDir,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1100, deviceScaleFactor: 1 });

  // 1. Export Page
  const exportUrl = 'http://localhost:3000/export';
  console.log(`Navigating to ${exportUrl}...`);
  await page.goto(exportUrl, { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 2000));

  const exportPath = path.join(outDir, 'export-page-clean.png');
  await page.screenshot({ path: exportPath, fullPage: true });
  console.log(`Saved screenshot to ${exportPath}`);

  // 2. Home Page
  const homeUrl = 'http://localhost:3000/';
  console.log(`Navigating to ${homeUrl}...`);
  await page.goto(homeUrl, { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 2000));

  const homePath = path.join(outDir, 'home-page-clean.png');
  await page.screenshot({ path: homePath, fullPage: true });
  console.log(`Saved screenshot to ${homePath}`);

  await browser.close();
  console.log('Done!');
}

main().catch((err) => {
  console.error('Error during capture:', err);
  process.exit(1);
});

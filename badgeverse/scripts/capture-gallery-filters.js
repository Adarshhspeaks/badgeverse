const puppeteer = require('puppeteer-core');
const path = require('path');
const os = require('os');
const fs = require('fs');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const outDir = 'C:\\Users\\adars\\.gemini\\antigravity\\brain\\c0584739-f6b5-4d3b-ba1d-124edf766b07\\screenshots';
const userDataDir = path.join(os.tmpdir(), 'puppeteer_chips_capture_' + Date.now());

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

  const url = 'http://localhost:3000/templates';
  console.log(`Navigating to ${url}...`);
  await page.goto(url, { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 2000));

  const outPath = path.join(outDir, 'gallery-chips.png');
  await page.screenshot({ path: outPath, fullPage: false });
  console.log(`Saved screenshot to ${outPath}`);

  await browser.close();
  console.log('Done!');
}

main().catch((err) => {
  console.error('Error during capture:', err);
  process.exit(1);
});


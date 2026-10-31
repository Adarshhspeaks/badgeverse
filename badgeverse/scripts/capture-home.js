const puppeteer = require('puppeteer-core');
const path = require('path');
const os = require('os');
const fs = require('fs');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const outDir = 'C:\\Users\\adars\\.gemini\\antigravity\\brain\\c0584739-f6b5-4d3b-ba1d-124edf766b07\\screenshots';
const userDataDir = path.join(os.tmpdir(), 'puppeteer_home_capture_' + Date.now());

const targets = [
  { id: 'home-hero-1440', url: 'http://localhost:3000', width: 1440 },
  { id: 'home-hero-360',  url: 'http://localhost:3000', width: 360 },
];

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

  for (const item of targets) {
    await page.setViewport({ width: item.width, height: 860, deviceScaleFactor: 1 });
    const outPath = path.join(outDir, `${item.id}.png`);
    console.log(`Navigating to ${item.url} at ${item.width}px...`);
    await page.goto(item.url, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1400));
    await page.screenshot({ path: outPath, fullPage: false });
    console.log(`Saved ${outPath}`);
  }

  await browser.close();
  console.log('Done!');
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});


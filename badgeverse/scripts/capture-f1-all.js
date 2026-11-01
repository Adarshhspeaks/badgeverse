const puppeteer = require('puppeteer-core');
const path = require('path');
const os = require('os');
const fs = require('fs');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const outDir = 'C:\\Users\\adars\\.gemini\\antigravity\\brain\\c0584739-f6b5-4d3b-ba1d-124edf766b07\\screenshots';
const userDataDir = path.join(os.tmpdir(), 'puppeteer_f1_all_' + Date.now());

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    userDataDir,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const targets = ['f1-ferrari', 'f1-champion-vert', 'f1-fire-trail'];

  for (const id of targets) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 1400, deviceScaleFactor: 1 });
    const url = `http://localhost:3000/preview/${id}`;
    console.log(`Navigating to ${url}...`);
    await page.goto(url, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 2000));

    const outPath = path.join(outDir, `preview-${id}.png`);
    await page.screenshot({ path: outPath, fullPage: true });
    console.log(`Saved screenshot to ${outPath}`);

    const publicOutPath = `c:\\Imp-Projects\\badgeverse-pack\\badgeverse\\public\\previews\\preview-${id}.png`;
    fs.copyFileSync(outPath, publicOutPath);
    console.log(`Copied to ${publicOutPath}`);
    await page.close();
  }

  await browser.close();
  console.log('Done capturing all new F1 templates!');
}

main().catch((err) => {
  console.error('Error during capture:', err);
  process.exit(1);
});


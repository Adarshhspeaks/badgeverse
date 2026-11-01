const puppeteer = require('puppeteer-core');
const path = require('path');
const os = require('os');
const fs = require('fs');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const outDir = 'C:\\Users\\adars\\.gemini\\antigravity\\brain\\c0584739-f6b5-4d3b-ba1d-124edf766b07\\screenshots';
const userDataDir = path.join(os.tmpdir(), 'puppeteer_export_' + Date.now());

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

  const url = 'http://localhost:3000/export';
  console.log(`Navigating to ${url}...`);
  await page.goto(url, { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 2000));

  // 1. Screenshot of the export page
  const exportPath = path.join(outDir, 'export-page.png');
  await page.screenshot({ path: exportPath, fullPage: true });
  console.log(`Saved screenshot to ${exportPath}`);

  // 2. Click "Save as PDF (Front + Back)" via evaluate
  console.log('Clicking Save as PDF button...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const btn = buttons.find((b) => b.textContent.includes('Save as PDF'));
    if (btn) btn.click();
  });

  await new Promise((r) => setTimeout(r, 1200));
  const modalPath = path.join(outDir, 'export-modal-pricing.png');
  await page.screenshot({ path: modalPath, fullPage: false });
  console.log(`Saved modal pricing screenshot to ${modalPath}`);

  // 3. Click "Pay ₹30 (No Watermark)" to open UPI screen
  console.log('Clicking Pay ₹30 (No Watermark)...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const btn = buttons.find((b) => b.textContent.includes('Pay ₹30'));
    if (btn) btn.click();
  });

  await new Promise((r) => setTimeout(r, 1200));
  const upiPath = path.join(outDir, 'export-modal-upi.png');
  await page.screenshot({ path: upiPath, fullPage: false });
  console.log(`Saved modal upi screenshot to ${upiPath}`);

  await browser.close();
  console.log('Done!');
}

main().catch((err) => {
  console.error('Error during capture:', err);
  process.exit(1);
});

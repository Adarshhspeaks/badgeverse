const { execSync } = require('child_process');

const chrome = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const targets = ['velocity', 'noir', 'y2k', 'travel'];

async function run() {
  for (const id of targets) {
    const out = `c:\\Imp-Projects\\badgeverse-pack\\screenshots\\batch1-${id}.png`;
    const url = `http://localhost:3000/preview/${id}`;
    console.log(`Warming up ${id}...`);
    try {
      await fetch(url);
    } catch (e) {}
    await new Promise(r => setTimeout(r, 2000));

    console.log(`Capturing ${id}...`);
    execSync(`"${chrome}" --headless --disable-gpu --window-size=1440,1400 --screenshot="${out}" "${url}"`, { stdio: 'inherit' });
  }

  const galleryOut = 'c:\\Imp-Projects\\badgeverse-pack\\screenshots\\batch1-gallery.png';
  console.log('Capturing gallery...');
  execSync(`"${chrome}" --headless --disable-gpu --window-size=1440,1200 --screenshot="${galleryOut}" "http://localhost:3000/templates"`, { stdio: 'inherit' });

  console.log('Done!');
}

run();

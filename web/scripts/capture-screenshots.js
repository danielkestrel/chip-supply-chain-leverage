const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const OUT_DIR = process.env.OUT_DIR || path.join(__dirname, '../screenshots');

fs.mkdirSync(OUT_DIR, { recursive: true });

async function run() {
  console.log('Launching headless Chrome...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });

  // 1. Desktop captures (1440 x 900)
  console.log('Capturing Desktop screenshots (1440px)...');
  const desktopPage = await browser.newPage();
  await desktopPage.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await desktopPage.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

  // A. Overview + Map Desktop
  await desktopPage.evaluate(() => window.scrollTo(0, 0));
  await new Promise((r) => setTimeout(r, 400));
  await desktopPage.screenshot({
    path: path.join(OUT_DIR, 'overview-map-desktop.png'),
    clip: { x: 0, y: 0, width: 1440, height: 1100 },
  });
  console.log('Captured overview-map-desktop.png');

  // B. Database Desktop
  const dbEl = await desktopPage.$('#database');
  if (dbEl) {
    await dbEl.screenshot({ path: path.join(OUT_DIR, 'database-desktop.png') });
    console.log('Captured database-desktop.png');
  }

  // C. Simulator Desktop
  const simEl = await desktopPage.$('#simulator');
  if (simEl) {
    await simEl.screenshot({ path: path.join(OUT_DIR, 'simulator-desktop.png') });
    console.log('Captured simulator-desktop.png');
  }

  // D. Precedents Desktop
  const precEl = await desktopPage.$('#precedents');
  if (precEl) {
    await precEl.screenshot({ path: path.join(OUT_DIR, 'precedents-desktop.png') });
    console.log('Captured precedents-desktop.png');
  }

  // E. Policy Desktop
  const polEl = await desktopPage.$('#policy');
  if (polEl) {
    await polEl.screenshot({ path: path.join(OUT_DIR, 'policy-desktop.png') });
    console.log('Captured policy-desktop.png');
  }

  // F. Drawer Desktop
  const firstRow = await desktopPage.$('#database table tbody tr:first-child');
  if (firstRow) {
    await firstRow.click();
    await new Promise((r) => setTimeout(r, 400));
    await desktopPage.screenshot({
      path: path.join(OUT_DIR, 'database-drawer-desktop.png'),
      clip: { x: 0, y: 0, width: 1440, height: 900 },
    });
    console.log('Captured database-drawer-desktop.png');
  }

  await desktopPage.close();

  // 2. Mobile captures (390 x 844)
  console.log('Capturing Mobile screenshots (390px)...');
  const mobilePage = await browser.newPage();
  await mobilePage.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  await mobilePage.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

  // A. Mobile Overview + Map
  await mobilePage.evaluate(() => window.scrollTo(0, 0));
  await new Promise((r) => setTimeout(r, 400));
  await mobilePage.screenshot({
    path: path.join(OUT_DIR, 'overview-map-mobile.png'),
    clip: { x: 0, y: 0, width: 390, height: 900 },
  });
  console.log('Captured overview-map-mobile.png');

  // B. Mobile Database
  const mDbEl = await mobilePage.$('#database');
  if (mDbEl) {
    await mDbEl.screenshot({ path: path.join(OUT_DIR, 'database-mobile.png') });
    console.log('Captured database-mobile.png');
  }

  // C. Mobile Simulator
  const mSimEl = await mobilePage.$('#simulator');
  if (mSimEl) {
    await mSimEl.screenshot({ path: path.join(OUT_DIR, 'simulator-mobile.png') });
    console.log('Captured simulator-mobile.png');
  }

  // D. Mobile Precedents
  const mPrecEl = await mobilePage.$('#precedents');
  if (mPrecEl) {
    await mPrecEl.screenshot({ path: path.join(OUT_DIR, 'precedents-mobile.png') });
    console.log('Captured precedents-mobile.png');
  }

  // E. Mobile Policy
  const mPolEl = await mobilePage.$('#policy');
  if (mPolEl) {
    await mPolEl.screenshot({ path: path.join(OUT_DIR, 'policy-mobile.png') });
    console.log('Captured policy-mobile.png');
  }

  await mobilePage.close();
  await browser.close();
  console.log('ALL SCREENSHOTS CAPTURED PERFECTLY!');
}

run().catch((err) => {
  console.error('Error during screenshot capture:', err);
  process.exit(1);
});

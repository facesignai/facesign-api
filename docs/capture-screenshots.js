const puppeteer = require('puppeteer');

async function captureScreenshots() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  // Set viewport
  await page.setViewport({ width: 1440, height: 900 });

  // Capture docs page
  console.log('Capturing docs page...');
  await page.goto('http://localhost:4002/docs', { waitUntil: 'networkidle2' });
  await page.waitForTimeout(2000); // Wait for any animations
  await page.screenshot({ path: '/tmp/docs-page.png', fullPage: false });

  // Capture API page
  console.log('Capturing API page...');
  await page.goto('http://localhost:4002/api', { waitUntil: 'networkidle2' });
  await page.waitForTimeout(2000); // Wait for any animations
  await page.screenshot({ path: '/tmp/api-page.png', fullPage: false });

  await browser.close();
  console.log('Screenshots saved to /tmp/docs-page.png and /tmp/api-page.png');
}

captureScreenshots().catch(console.error);
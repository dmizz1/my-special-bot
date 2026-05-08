const puppeteer = require('puppeteer');

const SITE_URL = process.env.SITE_URL || 'https://feds.lol/shlumped'; // 🔁 change this

async function runBot() {
  console.log('Opening browser...');

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage'
    ]
  });

  const page = await browser.newPage();

  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36'
  );

  try {
    await page.goto(SITE_URL, { waitUntil: 'networkidle2', timeout: 30000 });
    console.log('Page loaded:', await page.title());

    await new Promise(r => setTimeout(r, 1000));

    const dimensions = await page.evaluate(() => ({
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight
    }));

    await page.mouse.click(dimensions.width / 2, dimensions.height / 2);
    console.log('Clicked center of page');

  } catch (err) {
    console.error('Error during visit:', err.message);
  } finally {
    await browser.close();
    console.log('Browser closed.');
  }
}

// Run immediately, then every 5 minutes
runBot();
setInterval(runBot, 5 * 60 * 1000);
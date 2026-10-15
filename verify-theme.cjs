const { chromium } = require('/opt/premierbet/node_modules/playwright');
const assert = require('node:assert/strict');

(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  for (const domain of ['blessing.it-sefako.com', 'couture.it-sefako.com']) {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(String(error)));
    for (const width of [1440, 1024, 390]) {
      await page.setViewportSize({ width, height: 950 });
      await page.goto('https://' + domain, { waitUntil: 'networkidle' });
      await page.locator('.theme-toggle').click();
      await page.locator('[data-theme-choice="logo"]').click();
      assert.equal(await page.locator('html').getAttribute('data-theme'), 'logo');
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('.theme-drawer').isVisible(), false);
      assert.equal(await page.locator('.theme-toggle').getAttribute('aria-expanded'), 'false');
      await page.reload();
      assert.equal(await page.locator('html').getAttribute('data-theme'), 'logo');
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      if (domain.startsWith('blessing.')) {
        assert.equal(await page.locator('.price-card').count(), 3);
        assert.match(await page.locator('.business-price').innerText(), /Tarif fictif de démonstration/);
        assert.match(await page.locator('.business-price').innerText(), /32 €/);
        await page.locator('#tarifs').scrollIntoViewIfNeeded();
        if (width !== 1024) await page.screenshot({ path: '/tmp/pricing-logo-' + width + '.png' });
      }
      await page.locator('.theme-toggle').click();
      await page.locator('[data-theme-choice="current"]').click();
      await page.locator('.theme-close').click();
      assert.equal(await page.locator('html').getAttribute('data-theme'), 'current');
    }
    if (domain.startsWith('blessing.')) {
      for (const file of ['tarifs.html', 'services.html', 'bureaux.html', 'domicile.html', 'faq.html']) {
        const response = await page.goto('https://' + domain + '/' + file);
        assert.equal(response.status(), 200);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      }
    }
    assert.deepEqual(errors, []);
    console.log(domain + ': theme selection, persistence, keyboard, responsive layout and pricing OK');
    await page.close();
  }
  await browser.close();
})().catch(error => { console.error(error); process.exit(1); });

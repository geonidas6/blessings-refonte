const { chromium } = require('/opt/premierbet/node_modules/playwright');
const fs = require('node:fs');
const assert = require('node:assert/strict');

(async () => {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const errors = [];
  for (const [site, domain] of [['cleaning', 'blessing.it-sefako.com'], ['couture', 'couture.it-sefako.com']]) {
    const page = await browser.newPage();
    page.on('pageerror', error => errors.push(String(error)));
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 950 });
      for (const file of fs.readdirSync(site).filter(name => name.endsWith('.html'))) {
        const response = await page.goto('https://' + domain + '/' + file, { waitUntil: 'networkidle' });
        assert.equal(response.status(), 200, file);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
        assert.equal(overflow, false, site + '/' + file + ' overflow at ' + width);
        const broken = await page.locator('img').evaluateAll(images => images.filter(image => !image.complete || image.naturalWidth === 0).map(image => image.src));
        assert.deepEqual(broken, [], site + '/' + file + ' broken images');
      }
      await page.goto('https://' + domain + '/', { waitUntil: 'networkidle' });
      if (site === 'cleaning') await page.locator('.slider-pause').click();
      await page.screenshot({ path: '/tmp/' + site + '-' + width + '.png', fullPage: true });
      if (width === 390) {
        await page.locator('.menu').click();
        assert.equal(await page.locator('.menu').getAttribute('aria-expanded'), 'true');
        await page.keyboard.press('Escape');
        assert.equal(await page.locator('.menu').getAttribute('aria-expanded'), 'false');
      }
    }
    await page.goto('https://' + domain + '/faq.html');
    await page.locator('summary').first().click();
    assert.equal(await page.locator('details').first().getAttribute('open'), '');
    await page.goto('https://' + domain + '/contact.html');
    await page.locator('[name="Nom"]').fill('Test de vérification');
    await page.locator('[name="Téléphone"]').fill('+32000000000');
    await page.locator('[name="Service"]').selectOption({ index: 1 });
    if (site === 'cleaning') await page.locator('[name="Commune"]').fill('Bruxelles');
    await page.locator('[name="Message"]').fill('Test local du formulaire, ne pas envoyer.');
    await page.locator('[name="Accord"]').check();
    await page.locator('button[type="submit"]').click();
    assert.match(await page.locator('.send-link').getAttribute('href'), /^https:\/\/wa.me\/32496973174\?text=/);
    assert.equal(await page.locator('.send-link').isVisible(), true);
    if (site === 'cleaning') {
      await page.goto('https://' + domain + '/services.html');
      await page.locator('[data-filter="professionnels"]').click();
      assert.equal(await page.locator('[data-category]:visible').count(), 7);
      await page.goto('https://' + domain + '/');
      await page.locator('.slider-next').click();
      assert.equal(await page.locator('[data-slide="1"]').getAttribute('aria-pressed'), 'true');
      assert.equal(await page.locator('.slide').nth(0).getAttribute('aria-hidden'), 'true');
      await page.locator('.slider-prev').click();
      assert.equal(await page.locator('[data-slide="0"]').getAttribute('aria-pressed'), 'true');
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.reload();
      assert.equal(await page.locator('.slider-pause').getAttribute('aria-pressed'), 'true');
      await page.goto('https://' + domain + '/inscription.html');
      assert.deepEqual(await page.locator('[name="Disponibilités"]').evaluateAll(inputs => inputs.map(input => input.value)), ['Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']);
      await page.goto('https://' + domain + '/emploi.html');
      assert.deepEqual(await page.locator('[name="Disponibilités"]').evaluateAll(inputs => inputs.map(input => input.value)), ['Mardi', 'Mercredi', 'Jeudi', 'Vendredi']);
    }
    const missing = await page.goto('https://' + domain + '/page-absente');
    assert.equal(missing.status(), 404);
    console.log(site + ': pages desktop/mobile, images, navigation, forms and interactions OK');
    await page.close();
  }
  assert.deepEqual(errors, []);
  await browser.close();
})().catch(error => { console.error(error); process.exit(1); });

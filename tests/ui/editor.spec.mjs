import {test, expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const KEY = 'jd-phonetics-draft-v1';
const pointed = 'שִׁירוּ לַיְיָ שִׁיר חָדָשׁ\nהַלְלוּ עֶזְרְךָ';

for (const width of [320, 390, 768, 1366]) {
  test(`Editor accessible and fits ${width}px`, async ({page}, testInfo) => {
    await page.setViewportSize({width, height: 900});
    await page.goto('/');
    await page.getByRole('textbox', {name: '1. Hebreo', exact: true}).fill(pointed);
    await expect(page.getByRole('textbox', {name: '2. Fonética', exact: true})).toHaveValue(/Halelú 'ezrejá/);
    if (width > 800) {
      const actions = await page.locator('#copyHebrew').boundingBox();
      const copy = await page.locator('#copy').boundingBox();
      expect(Math.abs(actions.y - copy.y)).toBeLessThanOrEqual(1);
    }
    await page.getByRole('button', {name: 'אָ Teclado de nikud', exact: true}).click();
    const keyboard = await page.locator('#nikudKbd').boundingBox();
    const editors = await page.locator('.grid').boundingBox();
    expect(Math.abs(keyboard.width - editors.width)).toBeLessThanOrEqual(1);
    expect(keyboard.y).toBeGreaterThanOrEqual(editors.y + editors.height);
    const outside = await page.locator('button:visible,select:visible,textarea:visible').evaluateAll(elements =>
      elements.filter(element => {
        const r = element.getBoundingClientRect();
        return r.left < -1 || r.right > innerWidth + 1;
      }).map(element => element.id || element.textContent));
    expect(outside).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const results = await new AxeBuilder({page}).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
    expect(results.violations).toEqual([]);
    await page.screenshot({path: testInfo.outputPath(`editor-${width}.png`), fullPage: true});
  });
}

test('Recovery retains manual reading, provisional origins and controls without network', async ({page}) => {
  let requests = 0;
  await page.route('**/nakdan-2-0.loadbalancer.dicta.org.il/api', route => {
    requests++;
    return route.fulfill({json: [{word: 'שלום', options: [['שָׁלוֹם'], ['שְׁלוֹם']], fconfident: false}]});
  });
  await page.goto('/');
  await page.locator('#hebrew').fill('שלום');
  await expect(page.locator('#hebrew')).toHaveValue('שָׁלוֹם');
  await expect.poll(() => page.evaluate(key => JSON.parse(localStorage.getItem(key))?.words[0].origin, KEY)).toBe('nakdan');
  await page.reload();
  await expect(page.locator('#draftStatus')).toContainText('recuperado');
  expect(requests).toBe(1);
  await expect(page.locator('#nakdanWords button')).toHaveCount(1);
  await page.locator('#nakdanWords button').first().click();
  await page.locator('#nakdanChoices').getByRole('button', {name: 'שְׁלוֹם', exact: true}).click();
  await expect.poll(() => page.evaluate(key => JSON.parse(localStorage.getItem(key))?.words[0].origin, KEY)).toBe('manual');
  const expected = await page.locator('#output').inputValue();
  await page.reload();
  await expect(page.locator('#draftStatus')).toContainText('recuperado');
  await expect(page.locator('#hebrew')).toHaveValue('שְׁלוֹם');
  await expect(page.locator('#output')).toHaveValue(expected);
  expect(requests).toBe(1);
  await page.getByRole('button', {name: 'Limpiar', exact: true}).click();
  await expect.poll(() => page.evaluate(key => localStorage.getItem(key), KEY)).toBeNull();
  await page.reload();
  await expect(page.locator('#hebrew')).toHaveValue('');
});

test('Copy acknowledgement preserves partial-output warning', async ({page, context}) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/');
  await page.getByRole('checkbox', {name: 'Nikud automático', exact: true}).uncheck();
  await page.locator('#hebrew').fill('שלום');
  await expect(page.locator('#motorStatus')).toContainText('Fonética parcial');
  await page.getByRole('button', {name: 'Copiar fonética', exact: true}).click();
  await expect(page.locator('#phoneticCopyNotice')).toContainText('Texto copiado');
  await expect(page.locator('#motorStatus')).toContainText('Fonética parcial');
  await page.reload();
  await expect(page.locator('#draftStatus')).toContainText('recuperado');
  await expect(page.locator('#hebrew')).toHaveValue('שלום');
  await expect(page.getByRole('checkbox', {name: 'Nikud automático', exact: true})).not.toBeChecked();
});

test('Storage failure leaves the editor usable and explains recovery', async ({page}) => {
  await page.addInitScript(() => { Storage.prototype.setItem = () => { throw new DOMException('Quota exceeded', 'QuotaExceededError'); }; });
  await page.goto('/');
  await page.locator('#hebrew').fill(pointed);
  await expect(page.locator('#output')).not.toHaveValue('');
  await expect(page.locator('#draftStatus')).toContainText('No se pudo guardar');
  await expect(page.locator('#hebrew')).toHaveValue(pointed);
});

test('Conflicting tabs do not silently overwrite a newer draft', async ({page, context}) => {
  await page.goto('/');
  await page.locator('#hebrew').fill('שָׁלוֹם');
  await expect(page.locator('#draftStatus')).toContainText('guardado');
  const second = await context.newPage();
  await second.goto('/');
  await expect(second.locator('#draftStatus')).toContainText('recuperado');
  await second.locator('#hebrew').fill(pointed);
  await expect.poll(() => second.evaluate(key => JSON.parse(localStorage.getItem(key))?.hebrew, KEY)).toBe(pointed);
  await expect(page.locator('#draftOverwrite')).toBeVisible();
  await expect(page.locator('#hebrew')).toHaveValue('שָׁלוֹם');
  expect(await page.evaluate(key => JSON.parse(localStorage.getItem(key)).hebrew, KEY)).toBe(pointed);
});

test('Keyboard skip link and expanded text layout', async ({page}) => {
  await page.setViewportSize({width: 390, height: 844});
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', {name: 'Ir al editor'})).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('main')).toBeFocused();
  // Double the inherited interface text, preserving the Hebrew editor font size.
  await page.addStyleTag({content: 'body{font-size:200%}button,select,.sub,.nikud-toggle,.status,.field-help,.control-help,.draft-status{font-size:1em}'});
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});


test('Recovery preserves visual-mark preferences and their generated text', async ({page}) => {
  let requests = 0;
  await page.route('**/nakdan-2-0.loadbalancer.dicta.org.il/api', route => { requests++; return route.abort(); });
  await page.goto('/');
  await page.locator('#hebrew').fill(pointed);
  await expect(page.locator('#output')).not.toHaveValue('');
  await page.getByRole('checkbox', {name: 'Meteg', exact: true}).check();
  await page.getByRole('checkbox', {name: 'Rafé', exact: true}).check();
  await expect.poll(() => page.evaluate(key => JSON.parse(localStorage.getItem(key))?.preferences.showRafe, KEY)).toBe(true);
  const hebrew = await page.locator('#hebrew').inputValue();
  const phonetic = await page.locator('#output').inputValue();
  await page.reload();
  await expect(page.locator('#draftStatus')).toContainText('recuperado');
  await expect(page.getByRole('checkbox', {name: 'Meteg', exact: true})).toBeChecked();
  await expect(page.getByRole('checkbox', {name: 'Rafé', exact: true})).toBeChecked();
  await expect(page.locator('#hebrew')).toHaveValue(hebrew);
  await expect(page.locator('#output')).toHaveValue(phonetic);
  expect(requests).toBe(0);
});


test('Shared keyboard inserts at the editor caret after moving outside the column', async ({page}) => {
  await page.goto('/');
  await page.getByRole('checkbox', {name: 'Nikud automático', exact: true}).uncheck();
  await page.locator('#hebrew').fill('אב');
  await page.locator('#hebrew').press('Control+End');
  await page.getByRole('button', {name: 'אָ Teclado de nikud', exact: true}).click();
  await page.locator('#nikudKbd').getByRole('button', {name: 'אַ Pataj Sonido: A', exact: true}).click();
  await expect(page.locator('#hebrew')).toHaveValue('אבַ');
});

// Boot engine wiring: the staged BootEngine from the boot lab replaces the
// old bootConfig overlay, switchTheme delegates to it, INIT boots once per tab.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const html = readFileSync(join(root, 'index.html'), 'utf8');

test('BootEngine is present and the old boot config is gone', () => {
  assert.ok(html.includes('var BootEngine = (function () {'), 'BootEngine IIFE');
  for (const sym of ['var bootConfig', 'var mac9Extensions', 'extensions-strip', 'mac9-bg.jpg', '.ext-chip']) {
    assert.ok(!html.includes(sym), `${sym} still present`);
  }
  assert.ok(!existsSync(join(root, 'mac9-bg.jpg')), 'mac9-bg.jpg removed (nothing references it)');
});

test('switchTheme delegates to BootEngine and ends in setTheme', () => {
  assert.match(html, /function switchTheme\(os\) \{\s*BootEngine\.run\(os, function \(\) \{ setTheme\(os\); \}\);\s*\}/);
});

test('INIT gives the parade real icons and boots once per tab', () => {
  const init = html.slice(html.indexOf('/* ===== INIT ===== */'), html.indexOf('// AFTER DARK: CYBERHACKER'));
  assert.match(init, /BootEngine\.setIcons\(osIcons\.mac9\)/);
  assert.match(init, /BootEngine\.bootOnLoad\(activeOs\)/);
  assert.match(html, /sessionStorage\.getItem\('booted'\)/);
});

test('every theme has a boot sequence and reduced motion is honored', () => {
  for (const os of ['mac7', 'mac9', 'win31', 'winxp', 'aqua', 'beos']) {
    assert.match(html, new RegExp(`\\n\\s+${os}: \\{ duration: \\d+,`), `boot theme ${os}`);
  }
  assert.match(html, /@media \(prefers-reduced-motion: reduce\) \{ \.boot-overlay/);
  assert.ok(!/\n\s*\.boot-overlay \{ display: none !important; \}/.test(html), 'phones boot too; the stage scales down (print may still hide it)');
});

test('a key pressed to skip a boot never reaches the window and easter-egg handlers', () => {
  assert.match(html, /document\.addEventListener\('keydown', skipKey, \{ capture: true \}\)/);
  assert.match(html, /function skipKey\(e\) \{[^}]*stopImmediatePropagation\(\)/);
  assert.match(html, /document\.removeEventListener\('keydown', skipKey, \{ capture: true \}\)/);
});

test('INIT applies the theme on every first visit, light mode included', () => {
  const init = html.slice(html.indexOf('/* ===== INIT ===== */'), html.indexOf('// AFTER DARK: CYBERHACKER'));
  assert.match(init, /var activeOs = saved \|\| \(prefersDark \? 'aqua' : 'mac7'\);\s*setTheme\(activeOs\);/);
  assert.ok(!/if \(saved\) \{ setTheme\(saved\); \}/.test(init), 'conditional setTheme is gone');
});


// Real menu bars per system, with working Special menus and shutdown screens;
// opt-in sound with real Platinum UI sounds and synthesized boot chimes.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const html = readFileSync(join(root, 'index.html'), 'utf8');

test('menus are rendered per system from one definition, and the static File/Theme bar is gone', () => {
  assert.match(html, /function menusFor\(os\)/);
  assert.match(html, /function renderMenus\(os\)/);
  assert.ok(!html.includes('<div class="menu-item">File\n'), 'static File menu markup removed');
  assert.ok(!html.includes('<div class="menu-item">Theme\n'), 'static Theme menu markup removed');
  assert.ok(html.includes('id="menu-items"'), 'menu container');
  const def = html.slice(html.indexOf('// MENUS - '), html.indexOf('function renderMenus(os)'));
  for (const title of ["'Special'", "'Label'", "'Go'", "'Options'", "'Window'", "'Help'"]) assert.ok(def.includes(title), `menu title ${title}`);
  for (const label of ["'Restart'", "'Shut Down'", "'Empty Trash...'", "'Clean Up Windows'", "'Exit Windows...'", "'Turn Off Computer'"]) assert.ok(def.includes(label), `menu item ${label}`);
});

test('shutdown and restart exist for every system with the right screens', () => {
  assert.match(html, /function shutDown\(\)/);
  assert.match(html, /function restart\(\)/);
  for (const f of ['winxp-shutting-down', 'winxp-off', 'beos-off']) assert.ok(existsSync(join(root, 'assets', 'boot', `${f}.png`)), `${f}.png present`);
  assert.ok(html.includes('You may now switch off your Macintosh safely.'), 'classic Mac power-off text');
  assert.ok(html.includes('This will end your Windows session.'), 'Exit Windows dialog');
  assert.ok(html.includes('Seconds until shut down:'), 'Mac OS 9 countdown dialog');
});

test('XP has a start menu with a taskbar of open windows; BeOS Deskbar lists them', () => {
  assert.ok(html.includes('id="start-menu"'), 'XP start menu');
  assert.ok(html.includes('id="taskbar-windows"'), 'XP taskbar buttons');
  assert.match(html, /function refreshWindowLists\(\)/);
});

test('sound is opt-in, remembered, and uses the real Platinum sounds plus synthesized chimes', () => {
  assert.match(html, /var Sound = \(function \(\) \{/);
  assert.match(html, /localStorage\.getItem\('sound'\)/);
  assert.match(html, /function chime\(os\)/);
  assert.match(html, /if \(!enabled\) return;/);
  for (const f of ['menu-open', 'menu-close', 'menu-select', 'window-open', 'window-close', 'button-press', 'trash-empty', 'simple-beep']) {
    assert.ok(existsSync(join(root, 'assets', 'sound', `${f}.wav`)), `${f}.wav present`);
    assert.ok(html.includes(`'${f}'`), `${f} referenced`);
  }
  assert.ok(html.includes('class="menu-sound"'), 'sound toggle in the menu bar');
});

// Accessibility: icons and controls reachable by keyboard, windows announced
// as dialogs, visible focus rings per system, the page language follows the
// toggle, decorative boot art hidden from readers.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const html = readFileSync(join(here, '..', 'index.html'), 'utf8');

test('desktop icons are keyboard buttons that open on Enter or Space', () => {
  assert.match(html, /function a11yInit\(\)/);
  const init = html.slice(html.indexOf('function a11yInit()'), html.indexOf('function a11yInit()') + 3000);
  assert.match(init, /\.desktop-icon/);
  assert.match(init, /tabindex/);
  assert.match(init, /role', 'button'/);
  assert.match(html, /\.desktop-icon:focus-visible/);
});

test('windows are dialogs with an accessible name, and the close box is a labelled button', () => {
  const init = html.slice(html.indexOf('function a11yInit()'), html.indexOf('function a11yInit()') + 3000);
  assert.match(init, /'role', 'dialog'/);
  assert.match(init, /aria-labelledby/);
  assert.match(init, /Close window/);
  assert.match(html, /\.closebox:focus-visible/);
});

test('menus, rows, taskbar buttons, and dropdown items take focus and act on Enter', () => {
  assert.match(html, /data-activate/);
  assert.match(html, /e\.key === 'Enter' \|\| e\.key === ' '/);
  const dd = html.slice(html.indexOf('function ddHTML(items)'), html.indexOf('function renderMenus(os)'));
  assert.match(dd, /role="menuitem"/);
  assert.match(dd, /tabindex="0"/);
  assert.match(html, /\.menu-item:focus-within \.menu-dropdown/);
});

test('focus rings are visible in every system', () => {
  for (const os of ['mac7', 'mac9', 'win31', 'winxp', 'aqua', 'beos']) assert.match(html, new RegExp(`\\[data-os="${os}"\\] :focus-visible`), `focus ring for ${os}`);
});

test('the language toggle updates the document language and boot art is hidden from readers', () => {
  assert.match(html, /document\.documentElement\.lang = currentLang/);
  assert.match(html, /overlay\.setAttribute\('aria-hidden', 'true'\)/);
});

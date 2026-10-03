// Theme truthfulness: the CSS and data for each OS carry the period facts
// the spec pins (desktop colors, bar placement, pinstripes, era clock, icons).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const html = readFileSync(join(here, '..', 'index.html'), 'utf8');

function themeBlock(os) {
  const start = html.indexOf(`[data-os="${os}"] {`);
  assert.ok(start > -1, `no variable block for ${os}`);
  return html.slice(start, html.indexOf('}', start));
}
function rule(selector) {
  const i = html.indexOf(selector + ' {');
  return i === -1 ? '' : html.slice(i, html.indexOf('}', i));
}
function era(os) {
  const m = html.match(new RegExp(`${os}:\\s*\\{ year: (\\d{4}), monAbbr: '(\\w{3})' \\}`));
  assert.ok(m, `no era for ${os}`);
  return `${m[2]} ${m[1]}`;
}
function iconKeys(os) {
  const i = html.indexOf(`\n      ${os}: {`);
  const rest = html.slice(i + 8);
  const end = rest.search(/\n      [a-z0-9]+: \{|\n    \};/);
  const block = rest.slice(0, end);
  return ['about', 'career', 'projects', 'contact', 'ask', 'trash'].filter((k) => new RegExp(`[\\s{,]${k}: '`).test(block));
}

test('Windows 3.1: gray desktop, black labels, control box on the left, no brand mark', () => {
  const vars = themeBlock('win31');
  assert.match(vars, /--desktop-bg: #c0c0c0;/);
  assert.match(vars, /--icon-text: #000;/);
  assert.match(rule('[data-os="win31"] .closebox'), /left: 3px; right: auto/);
  assert.match(rule('[data-os="win31"] .menu-os-label'), /display: none/);
  assert.equal(era('win31'), 'Apr 1992');
  assert.equal(iconKeys('win31').length, 6, 'six period icons for Windows 3.1');
});

test('Windows XP: taskbar at the bottom with a start button and upward menus', () => {
  assert.match(rule('[data-os="winxp"] #menubar'), /top: auto; bottom: 0/);
  assert.match(rule('[data-os="winxp"] .menu-dropdown'), /bottom: 100%/);
  assert.match(html, /<span class="start-label">start<\/span>/);
  assert.match(rule('[data-os="winxp"] .icon-column'), /bottom: 54px/);
});

test('Mac OS X: horizontal pinstripes, Jaguar era, glossy icons, one label', () => {
  assert.match(rule('[data-os="aqua"] .titlebar'), /repeating-linear-gradient\(to bottom/);
  assert.match(rule('[data-os="aqua"] .window'), /repeating-linear-gradient\(to bottom/);
  assert.equal(era('aqua'), 'Sep 2001');
  assert.equal(iconKeys('aqua').length, 6, 'six glossy icons for Mac OS X');
  assert.ok(!html.includes('Mac OS X Aqua<'), 'Theme menu says Mac OS X, not Mac OS X Aqua');
});

test('BeOS: Deskbar in the top-right corner, icons on the left', () => {
  assert.match(rule('[data-os="beos"] #menubar'), /left: auto; right: 0/);
  assert.match(rule('[data-os="beos"] .icon-column'), /right: auto; left: 20px/);
  assert.match(themeBlock('beos'), /--menubar-bg: #d8d8d8;/);
});

test('Mac OS 9: shipped desktop picture by default, 9.1 era; Mac OS 7 era unchanged', () => {
  assert.match(themeBlock('mac9'), /--desktop-bg: #336666 url\(assets\/wallpapers\/mac9\/mac-os-background\.jpg\)/);
  assert.equal(era('mac9'), 'Jan 2001');
  assert.equal(era('mac7'), 'Mar 1993');
  assert.match(html, /d\.style\.backgroundImage = '';/, "'none' wallpaper clears the inline image so the theme default shows");
});

test('phones keep the XP and BeOS menus reachable', () => {
  const mobile = html.slice(html.indexOf('@media (max-width: 640px) {'), html.indexOf('SCREENSAVER OVERLAY'));
  assert.match(mobile, /\[data-os="winxp"\] \.menu-dropdown \{ top: 100%; bottom: auto; \}/);
  assert.match(mobile, /\[data-os="beos"\] #menubar \{ width: 100%; \}/);
  assert.match(mobile, /\[data-os="beos"\] \.menu-dropdown \{ left: 0; right: auto; \}/);
});

test('phones show only open windows and a tapped window scrolls into view', () => {
  const mobile = html.slice(html.indexOf('@media (max-width: 640px) {'), html.indexOf('SCREENSAVER OVERLAY'));
  assert.ok(!/\.window \{[^}]*display: block !important/.test(mobile), 'closed windows stay hidden on phones');
  assert.match(mobile, /\.window\.open \{ display: block !important; \}/);
  const open = html.slice(html.indexOf('function openWin(id)'), html.indexOf('function closeWin(id)'));
  assert.match(open, /if \(window\.innerWidth <= 640\) el\.scrollIntoView/);
});


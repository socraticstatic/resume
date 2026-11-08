// Phone layout, from the breakpoint gate's renders of all six systems at
// 320 to 430 (2026-11-08). Each rule here fixed something a visitor saw.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const html = readFileSync(join(dirname(fileURLToPath(import.meta.url)), '..', 'index.html'), 'utf8');
const css = (q) => { const i = html.indexOf(`@media (max-width: ${q}px) {`); assert.ok(i > 0, `@media ${q}`); return html.slice(i, html.indexOf('\n}\n', i)); };
const phone = html.slice(html.indexOf('/* ===== MOBILE RESPONSIVE ===== */'));
const p640 = phone.slice(0, phone.indexOf('\n}\n'));

test('the menu bar holds one line: the period date steps aside, menus tighten, the smallest phones drop the clock', () => {
  assert.match(html, /e\.className = 'menu-clock-era'/, 'the era is its own span');
  assert.match(p640, /\.menu-clock-era \{ display: none; \}/);
  assert.match(css(400), /\.menu-item \{ padding: 2px 4px; \}/);
  assert.match(css(360), /\.menu-clock \{ display: none; \}/);
});

test('impact rows and career heads say everything on a phone: they wrap, never end in ...', () => {
  assert.match(p640, /\.ab-row-name \{ white-space: normal; overflow: visible; text-overflow: clip; \}/);
  assert.match(p640, /\.career-head span \{ white-space: normal; margin-left: 0; flex-basis: 100%; \}/);
});

test('the About wordmark fits the phone and Mac OS X keeps its lights off the title', () => {
  assert.match(html, /\.ab-mark \{ display: none; image-rendering: pixelated; flex-shrink: 0; max-width: 100%; height: auto; \}/);
  assert.match(p640, /\[data-os="aqua"\] \.titlebar::after \{ display: none; \}/);
});

test('the phone rules for XP and BeOS stay inside the phone block', () => {
  for (const r of ['[data-os="winxp"] #menubar { top: 0; bottom: auto; }', '[data-os="beos"] .menu-dropdown { left: 0; right: auto; }']) assert.ok(p640.includes(r), r);
});

test('Mac desktop icon names are black on a white label, legible on any picture', () => {
  assert.match(html, /\[data-os="mac7"\] \.icon-label, \[data-os="mac9"\] \.icon-label \{ color: #000; background: #fff; text-shadow: none; \}/);
});

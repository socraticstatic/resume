// The analytics beacon: the hub's own page-view file, declared for this site,
// with the resume's events riding on it. Nothing personal leaves the browser.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const beaconPath = fileURLToPath(new URL('../analytics-pageview.js', import.meta.url));
const hubPath = join(fileURLToPath(new URL('../..', import.meta.url)), 'conscious-shell', 'public', 'analytics-pageview.js');

test('the page loads the shared page-view beacon, declared for this site and its live host', () => {
  assert.match(html, /window\.__ANALYTICS_SITE__ = 'resume';/);
  assert.match(html, /window\.__ANALYTICS_HOST__ = 'socraticstatic\.github\.io';/);
  assert.match(html, /<script defer src="analytics-pageview\.js"><\/script>/);
});

test('the beacon honors Do Not Track and Global Privacy Control before anything else', () => {
  assert.ok(existsSync(beaconPath), 'analytics-pageview.js is missing');
  const js = readFileSync(beaconPath, 'utf8');
  const gate = js.indexOf("navigator.doNotTrack === '1'");
  assert.ok(gate > 0, 'no Do Not Track gate');
  assert.match(js, /navigator\.globalPrivacyControl/);
  assert.ok(gate < js.indexOf("post('page_views'"), 'the gate comes before any post');
  assert.match(js, /window\.ppTrack = function \(name\)/);
});

test('the beacon is the hub\'s file, line for line, apart from the Do Not Track lines', { skip: !existsSync(hubPath) && 'conscious-shell is not checked out beside this repo' }, () => {
  const strip = (s) => s.split('\n').filter((l) => !/doNotTrack/.test(l)).join('\n');
  assert.equal(strip(readFileSync(beaconPath, 'utf8')), readFileSync(hubPath, 'utf8'));
});

test('events ride on the beacon: boot, theme switch, first window open, PDF download, email', () => {
  assert.match(html, /function track\(name\) \{ if \(typeof window\.ppTrack === 'function'\) window\.ppTrack\(name\); \}/);
  assert.match(html, /track\('boot_' \+ /);
  assert.match(html, /track\('theme_' \+ os\)/);
  assert.match(html, /if \(!wasOpen\) track\('window_' \+ id\);/);
  const pdf = html.slice(html.indexOf('function downloadPDF()'), html.indexOf('function downloadPDF()') + 600);
  assert.match(pdf, /track\('pdf_download'\)/);
  assert.match(html, /closest\('a\[href\^="mailto:"\]'\)/);
  assert.match(html, /track\('contact_email'\)/);
});

test('the first open of a window counts as an open: wasOpen is read before placement adds the class', () => {
  const fn = html.slice(html.indexOf('function openWin(id)'), html.indexOf('function closeWin(id)'));
  const read = fn.indexOf("var wasOpen = el.classList.contains('open');");
  assert.ok(read > 0, 'wasOpen is not read');
  assert.ok(read < fn.indexOf('if (!wins[id])'), 'wasOpen is read after the placement branch, which already added .open');
});

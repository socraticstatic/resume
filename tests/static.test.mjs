// Static consistency checks on index.html: every inline handler resolves,
// dead symbols stay dead, one version string, status bars are filled at
// runtime, and every OS id is wired through the theme menu and theme boxes.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const html = readFileSync(join(here, '..', 'index.html'), 'utf8');
const script = html.slice(html.indexOf('<script>'), html.lastIndexOf('</script>'));

const defined = new Set();
for (const m of script.matchAll(/(?:^|\n)\s*(?:async\s+)?function\s+([A-Za-z_$][\w$]*)\s*\(/g)) defined.add(m[1]);
for (const m of script.matchAll(/(?:^|\n)\s*(?:var|let|const)\s+([A-Za-z_$][\w$]*)\s*=/g)) defined.add(m[1]);

test('every inline handler calls a defined function', () => {
  const missing = new Set();
  for (const m of html.matchAll(/on(?:click|dblclick|mousedown)="([^"]*)"/g)) {
    for (const call of m[1].matchAll(/(?<![\w.$])([A-Za-z_$][\w$]*)\s*\(/g)) {
      const name = call[1];
      if (name === 'event' || name === 'if') continue;
      if (!defined.has(name)) missing.add(name);
    }
  }
  assert.deepEqual([...missing], [], 'handlers without a definition');
});

test('dead symbols are gone', () => {
  for (const sym of ['osLogos', 'hideCtx', 'alert(', 'easterBuf', 'id="context-menu"']) {
    assert.ok(!html.includes(sym), `${sym} still present`);
  }
});

test('one version string feeds every version label', () => {
  const decl = html.match(/var SITE_VERSION = '[^']+';/g) || [];
  assert.equal(decl.length, 1, 'SITE_VERSION declared exactly once');
  assert.ok(!/Version 1\.0|v1\.0|system v2\.0|resume-os v2\.0/.test(html), 'hardcoded version label found');
});

test('status bars are filled at init, not in markup', () => {
  const bars = [...html.matchAll(/<div class="win-status"([^>]*)>([^<]*)<\/div>/g)];
  assert.ok(bars.length >= 2, 'expected the career and projects status bars');
  for (const [, attrs, text] of bars) {
    assert.ok(/data-count="/.test(attrs), `status bar lacks data-count: ${attrs}`);
    assert.equal(text.trim(), '', `status bar has hardcoded text: ${text}`);
  }
});

test('theme ids agree across shortcuts, menu, and theme boxes', () => {
  const keys = [...html.match(/var themeKeys = \{([^}]*)\}/)[1].matchAll(/:\s*'([a-z0-9]+)'/g)].map((m) => m[1]);
  const boxes = [...html.matchAll(/id="theme-([a-z0-9]+)"/g)].map((m) => m[1]);
  const menu = [...html.matchAll(/class="menu-dd-item" onclick="switchTheme\('([a-z0-9]+)'\)"/g)].map((m) => m[1]);
  assert.deepEqual([...boxes].sort(), [...keys].sort(), 'theme boxes vs Cmd shortcuts');
  assert.deepEqual([...menu].sort(), [...keys].sort(), 'Theme menu vs Cmd shortcuts');
});

test('new windows are placed in free desktop space, not cascaded from a corner', () => {
  assert.match(html, /function placeWindow\(el\)/);
  assert.match(html, /function desktopBounds\(\)/);
  assert.ok(!/var nextX = 80, nextY = 60;/.test(html), 'the corner cascade is gone');
  const open = html.slice(html.indexOf('function openWin(id)'), html.indexOf('function closeWin(id)'));
  assert.match(open, /placeWindow\(el\)/);
});


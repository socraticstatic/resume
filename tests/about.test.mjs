// The About window is each system's own About This Computer dialog: a mark
// from the real dialog, a few key/value lines, the thesis, and the headline
// numbers as memory-allocation rows with bars. The long sections live in a
// Read Me window.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const html = readFileSync(join(here, '..', 'index.html'), 'utf8');
const about = html.slice(html.indexOf('id="win-about"'), html.indexOf('id="win-career"'));
const OS = ['mac7', 'mac9', 'win31', 'winxp', 'aqua', 'beos'];

test('About is a dialog with a per-system mark, key/value lines, and metric rows', () => {
  assert.ok(about.includes('class="win-body about-dialog"'), 'about-dialog body');
  for (const os of OS) assert.ok(about.includes(`class="ab-mark ab-mark-${os}"`), `mark for ${os}`);
  const rows = about.match(/class="ab-row"/g) || [];
  assert.ok(rows.length >= 5, `at least five metric rows, found ${rows.length}`);
  assert.ok(about.includes('class="ab-kv"'), 'key/value block');
  assert.ok(about.includes('class="about-thesis"'), 'thesis stays, it is what the Chooser and the language toggle rewrite');
  assert.ok(!about.includes('about-section-title'), 'no long sections in the About dialog');
});

test('each system styles the dialog after its own About box', () => {
  for (const os of OS) {
    assert.ok(html.includes(`[data-os="${os}"] .about-dialog`), `About CSS for ${os}`);
    assert.ok(html.includes(`[data-os="${os}"] .ab-mark-${os} { display: block`), `mark shown for ${os}`);
  }
});

test('the long sections moved to a Read Me window that the menu, the dialog, print, and mobile all reach', () => {
  const readme = html.slice(html.indexOf('id="win-readme"'), html.indexOf('id="win-contact"'));
  for (const sec of ['Capabilities', 'Background', 'Awards', 'Publications']) assert.ok(readme.includes(sec), `Read Me has ${sec}`);
  assert.ok(readme.includes('id="site-version-footer"'), 'version footer rides with Read Me');
  assert.ok(html.includes("dd('Read Me', function () { openWin('readme'); })"), 'menu entry for Read Me');
  assert.ok(about.includes(`openWin('readme')`), 'About dialog opens Read Me');
  assert.match(html, /\['about','readme','career','projects','contact'\]\.forEach\(function\(id\) \{\s*document\.getElementById\('win-' \+ id\)\.classList\.add\('open'\);/, 'print opens Read Me too');
  assert.match(html, /\['about','readme','career','projects','contact','ask','themes'\]\.forEach/, 'mobile opens Read Me too');
});

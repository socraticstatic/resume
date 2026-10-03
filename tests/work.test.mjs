// Show the work: every project on the retro site opens its own window, with a
// real screenshot when one exists; the resume PDF is a real download; wide
// screens open Career beside About on load.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const html = readFileSync(join(root, 'index.html'), 'utf8');
const dataDir = join(root, '..', 'job-hunter', 'data');
const hasData = existsSync(join(dataDir, 'projects.json'));

test('every project row opens its own window, and every window exists', () => {
  const rows = [...html.matchAll(/class="project-item" onclick="openWin\('proj-([a-z0-9-]+)'\)"/g)].map((m) => m[1]);
  assert.ok(rows.length >= 15, `project rows found: ${rows.length}`);
  for (const id of rows) assert.ok(html.includes(`id="win-proj-${id}"`), `window for ${id}`);
  assert.ok(!html.includes('onclick="toggleProject(this)"'), 'the accordion is gone');
});

test('project windows carry the screenshot that exists on disk, and nothing else', () => {
  const wins = [...html.matchAll(/id="win-proj-([a-z0-9-]+)"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/g)];
  for (const [block, id] of wins) {
    const onDisk = existsSync(join(root, 'assets', 'work', `${id}.webp`));
    const inHtml = block.includes(`assets/work/${id}.webp`);
    assert.equal(inHtml, onDisk, `${id}: image reference ${inHtml} vs file on disk ${onDisk}`);
  }
  for (const id of ['roots', 'insight-engine', 'ge-fortran']) assert.ok(html.includes(`assets/work/${id}.webp`), `${id} shows its screenshot`);
});

test('the registry drives the project rows and windows', { skip: !hasData && 'job-hunter data not present' }, () => {
  const registry = JSON.parse(readFileSync(join(dataDir, 'projects.json'), 'utf8'));
  for (const p of registry.projects) {
    assert.equal(html.includes(`id="win-proj-${p.id}"`), !!p.surfaces.retro, `${p.id} window presence matches surfaces.retro`);
  }
  assert.ok(!html.includes('Job-application agent'), 'the job-application agent is off the site');
});

test('the resume PDF is a real download, and Save as Resume.sit ends in it', () => {
  assert.ok(existsSync(join(root, 'Micah_Boswell_Resume.pdf')), 'PDF in the repo');
  assert.match(html, /<a[^>]+href="Micah_Boswell_Resume\.pdf"[^>]+download/);
  assert.match(html, /function downloadPDF\(\)/);
  const sit = html.slice(html.indexOf('function saveAsSit()'), html.indexOf('/* Chooser:'));
  assert.ok(sit.includes('downloadPDF()'), 'StuffIt dialog hands off to the download');
  assert.ok(html.includes("dd('Print...', exportPDF"), 'Print stays its own menu item');
});

test('a wide first load opens Career beside About', () => {
  const init = html.slice(html.indexOf('/* ===== INIT ===== */'), html.indexOf('// AFTER DARK: CYBERHACKER'));
  assert.match(init, /openWin\('about'\);\s*if \(window\.innerWidth >= 1280\) openWin\('career'\);/);
});

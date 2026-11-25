// The published site is built by scripts/build-site.mjs, and what it builds
// depends on the date. From December 1 to January 1 (midnight Dallas time each
// way) the resume is unreachable: one pause page, no resume text, no PDF, and
// every other path falls to the same page. Outside that window the site is the
// resume as committed. Micah 2026-11-25: "we can make the resumes be
// unreachable during december."
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

function build(nowIso) {
  const out = mkdtempSync(join(tmpdir(), 'resume-site-'));
  const log = execFileSync('node', ['scripts/build-site.mjs', out], {
    cwd: root, env: { ...process.env, SITE_NOW: nowIso }, encoding: 'utf8',
  });
  return { out, log };
}

function files(dir, base = dir) {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? files(p, base) : [p.slice(base.length + 1)];
  });
}

test('the last minute of November publishes the resume and its PDF', () => {
  const { out, log } = build('2026-12-01T05:59:59Z');
  assert.match(log, /full/);
  assert.ok(existsSync(join(out, 'Micah_Boswell_Resume.pdf')));
  assert.equal(readFileSync(join(out, 'index.html'), 'utf8'), readFileSync(join(root, 'index.html'), 'utf8'));
  assert.ok(existsSync(join(out, 'analytics-pageview.js')));
  assert.ok(existsSync(join(out, 'assets/fonts/Charcoal.ttf')));
});

test('the full site leaves out the workshop: tests, scripts, plans, dotfiles', () => {
  const { out } = build('2026-11-25T12:00:00Z');
  const list = files(out);
  for (const f of list) assert.doesNotMatch(f, /^(tests|scripts|docs)\/|^\.|\/\.|^CLAUDE\.md$|^package\.json$/, f);
});

for (const when of ['2026-12-01T06:00:00Z', '2026-12-15T18:00:00Z', '2027-01-01T05:59:59Z']) {
  test(`at ${when} only the pause page is published`, () => {
    const { out, log } = build(when);
    assert.match(log, /paused/);
    const list = files(out);
    assert.ok(!list.some((f) => /\.pdf$/i.test(f)), 'no PDF');
    assert.ok(!list.some((f) => /\.(md|js|json|mjs)$/i.test(f)), `no text but the pause page: ${list.filter((f) => /\.(md|js|json|mjs)$/i.test(f))}`);
    const page = readFileSync(join(out, 'index.html'), 'utf8');
    assert.equal(readFileSync(join(out, '404.html'), 'utf8'), page, 'every other path lands on the pause');
    assert.match(page, /Paused for December/);
    assert.match(page, /href="mailto:micah@conscious-shell\.com"/);
    assert.match(page, /<meta name="robots" content="noindex">/);
    for (const word of ['AT&amp;T', 'AT&T', 'NetBond', 'DNI', 'Business Hub', 'Lead Product Designer']) {
      assert.ok(!page.includes(word), `pause page carries "${word}"`);
    }
    const body = page.slice(page.indexOf('<body'));
    assert.doesNotMatch(body, /career-role|data-role=|win-career/, 'no resume markup in the body');
    assert.doesNotMatch(page, /<script/i, 'nothing runs: no triggers');
  });
}

test('January 1 at midnight Dallas time the resume comes back', () => {
  const { out, log } = build('2027-01-01T06:00:00Z');
  assert.match(log, /full/);
  assert.ok(existsSync(join(out, 'Micah_Boswell_Resume.pdf')));
  assert.ok(!existsSync(join(out, '404.html')));
});

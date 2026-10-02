// Truth tests: the site's career and project copy must not drift from the
// shared source of truth in ../job-hunter/data (facts.md, resume.json,
// projects.json). When that checkout is absent (CI, a stranger's clone) the
// cross-checks skip and only the forbidden-claims test runs.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const html = readFileSync(join(here, '..', 'index.html'), 'utf8');
const dataDir = join(here, '..', '..', 'job-hunter', 'data');
const hasData = existsSync(join(dataDir, 'resume.json')) && existsSync(join(dataDir, 'projects.json'));

const unescape = (s) => s.replace(/&amp;/g, '&').replace(/&#8239;/g, ' ').replace(/&nbsp;/g, ' ');
const text = unescape(html);

test('forbidden claims are absent', () => {
  const forbidden = [
    [/architected/i, 'AT&T agent work is prototyped, never architected'],
    [/126 products/i, '"126 products" has no line in facts.md'],
    [/agents that manage/i, 'agents do not manage infrastructure; they are prototypes'],
    [/\bNortel\b/, 'Nortel is not in facts.md'],
    [/36 products/, '"36 products" has no line in facts.md'],
    [/22\+ emerging/, 'CareerFoundry count is 47'],
    [/—/, 'no em dashes'],
  ];
  for (const [re, why] of forbidden) {
    const m = text.match(re);
    assert.equal(m, null, `${why}: found "${m && m[0]}"`);
  }
});

test('role and employer dates match resume.json', { skip: !hasData && 'job-hunter data not present' }, () => {
  const resume = JSON.parse(readFileSync(join(dataDir, 'resume.json'), 'utf8'));
  const rows = [...resume.roles, ...resume.earlier];
  for (const r of rows) {
    const needle = `${unescape(r.company)}, ${r.dates}`;
    assert.ok(text.includes(needle), `missing "${needle}" in index.html`);
  }
});

test('every registry project marked for the retro site appears', { skip: !hasData && 'job-hunter data not present' }, () => {
  const registry = JSON.parse(readFileSync(join(dataDir, 'projects.json'), 'utf8'));
  for (const p of registry.projects.filter((p) => p.surfaces.retro)) {
    assert.ok(text.includes(`<strong>${p.name}</strong>`), `project "${p.name}" (${p.id}) missing from the Projects window`);
  }
});

#!/usr/bin/env node
// Regenerate the role heads and the education block in index.html from the
// career canon (../job-hunter/data/career.json, or $CAREER_JSON). Each role's
// description stays hand-written. Run after any career.json change:
//   node scripts/sync-career.mjs
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { applyCareer } from './lib/career-format.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const canonPath = process.env.CAREER_JSON || join(root, '..', 'job-hunter', 'data', 'career.json');
if (!existsSync(canonPath)) {
  console.error(`career.json not found: ${canonPath}`);
  process.exit(2);
}

const file = join(root, 'index.html');
const html = readFileSync(file, 'utf8');
const { html: out, missing, hidden, headless, unknown } = applyCareer(html, JSON.parse(readFileSync(canonPath, 'utf8')));
if (missing.length || headless.length) {
  if (missing.length) console.error(`role on the canon but not on the page: ${missing.join(', ')}. Write its block (with data-role) first.`);
  if (headless.length) console.error(`block with no career-head line: ${headless.join(', ')}. Add the head line inside the block.`);
  process.exit(1);
}
if (hidden.length) console.warn(`hidden on the canon, still on the page: ${hidden.join(', ')}`);
if (unknown.length) console.warn(`on the page but not in the canon: ${unknown.join(', ')}`);
if (out !== html) writeFileSync(file, out);
console.log(`index.html: ${out === html ? 'unchanged' : 'changed'}`);

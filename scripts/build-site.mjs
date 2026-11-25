#!/usr/bin/env node
// Builds what GitHub Pages publishes, into the folder named on the command line.
//
// From December 1 to January 1 (midnight Dallas time each way) the resume is
// unreachable: the folder holds one pause page, as index.html and 404.html, and
// the assets it draws with. No resume text, no PDF. Micah 2026-11-25: "we can
// make the resumes be unreachable during december." Outside that window the
// folder is the resume as committed, minus the workshop (tests, scripts, plans).
//
// SITE_NOW=<ISO date> builds as of that moment (tests use it).
// Remove the pause half of this file after January 1.
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = process.argv[2];
if (!out) { console.error('usage: node scripts/build-site.mjs <out-dir>'); process.exit(2); }

const START = Date.UTC(2026, 11, 1, 6);
const END = Date.UTC(2027, 0, 1, 6);
const MAIL = 'micah@conscious-shell.com';
const now = process.env.SITE_NOW ? Date.parse(process.env.SITE_NOW) : Date.now();
if (Number.isNaN(now)) { console.error(`SITE_NOW is not a date: ${process.env.SITE_NOW}`); process.exit(2); }
const paused = now >= START && now < END;

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
cpSync(join(root, 'assets'), join(out, 'assets'), { recursive: true });

if (!paused) {
  for (const f of ['index.html', 'Micah_Boswell_Resume.pdf', 'analytics-pageview.js', 'README.md', 'LICENSE']) {
    cpSync(join(root, f), join(out, f));
  }
  console.log(`full site (${new Date(now).toISOString()})`);
} else {
  writeFileSync(join(out, 'index.html'), pausePage());
  writeFileSync(join(out, '404.html'), pausePage());
  console.log(`paused site (${new Date(now).toISOString()})`);
}

// The resume's own Mac OS 9 chrome (its stylesheet, comments stripped) around
// the same alert the resume shows in December, on an empty desktop. Nothing
// runs on it: the one live thing is the mailto button.
function pausePage() {
  const html = readFileSync(join(root, 'index.html'), 'utf8');
  const head = html.slice(0, html.indexOf('</style>') + '</style>'.length);
  const fonts = [...head.matchAll(/<link href="https:\/\/fonts\.cdnfonts\.com[^>]*>/g)].map((m) => m[0]);
  const icon = head.match(/<link rel="icon"[^>]*>/)[0];
  const css = head.slice(head.indexOf('<style>') + '<style>'.length, head.lastIndexOf('</style>'))
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\n\s*\n+/g, '\n');
  return `<!DOCTYPE html>
<html lang="en" data-os="mac9" class="rp-lock">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex">
  <title>Micah Boswell - Paused for December</title>
  ${icon}
  ${fonts.join('\n  ')}
  <style>${css}
    html.rp-lock body > #desktop { filter: none; }
    .rp-paused .sd-btn { cursor: pointer; }
    @media (max-width: 640px) {
      .rp-paused .window.sys-dialog.rp-dialog { border-left: 1px solid #999 !important; border-right: 1px solid #999 !important; }
    }
  </style>
</head>
<body class="rp-paused">
  <div id="desktop" aria-hidden="true"></div>
  <div class="window sys-dialog open rp-dialog" role="alertdialog" aria-modal="true" aria-labelledby="rp-title" aria-describedby="rp-text">
    <div class="win-body sd-body">
      <div class="sd-icon" aria-hidden="true">!</div>
      <div class="sd-text"><b id="rp-title">Paused for December.</b><span id="rp-text">I&rsquo;m stepping away for the month. Back in January.</span></div>
      <div class="sd-buttons"><a class="sd-btn primary" id="rp-mail" href="mailto:${MAIL}" autofocus>Email Micah</a></div>
    </div>
  </div>
</body>
</html>
`;
}

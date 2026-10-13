// Pure formatters for the career facts on index.html: each role's head line
// and the education block. No I/O; scripts/sync-career.mjs does the reading
// and writing. Descriptions under each head stay hand-written.

const STATES = { Texas: 'TX', Alabama: 'AL' };
const esc = (t) => String(t).replace(/&(?!amp;|lt;|gt;|quot;|#)/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function years(role) {
  const start = String(role.start).slice(0, 4);
  const end = role.end == null ? 'Present' : String(role.end).slice(0, 4);
  return start === end ? start : `${start} - ${end}`;
}

function place(location) {
  const [city, state] = location.split(', ');
  if (!STATES[state]) throw new Error(`no abbreviation for ${state}`);
  return `${city}, ${STATES[state]}`;
}

export function headLine(role) {
  const when = role.section === 'experience' ? `, ${years(role)}` : '';
  return `<div class="career-head"><strong>${esc(role.title)}</strong><span>${esc(role.company)}${when}</span></div>`;
}

export function educationBlock(career) {
  const ed = career.education;
  const earlier = (career.earlier_education || []).map((e) => `${e.label} at ${e.school} (${place(e.location)})`);
  const education = `Education: ${ed.degree.replace(/\./g, '')} ${ed.school.replace(/ University$/, '')} (${place(ed.location)}).`
    + earlier.map((e) => ` ${e}.`).join('');
  const certs = career.certifications;
  const issuers = new Set(certs.map((c) => c.issuer));
  const spans = new Set(certs.map((c) => c.years));
  if (issuers.size !== 1 || spans.size !== 1) throw new Error('certificates differ in issuer or years');
  const issuer = /\(([^)]+)\)/.exec([...issuers][0])?.[1] || [...issuers][0];
  const certLine = `${issuer} AI certificates ${[...spans][0]}: ${certs.map((c) => c.name).join(', ')}.`;
  return [education, certLine].map((t) => `          <p>${esc(t)}</p>`).join('\n');
}

const FACTS = /(<!-- CAREER FACTS \(generated[^\n]*-->\n)[\s\S]*?(\n[ \t]*<!-- \/CAREER FACTS -->)/;
const HEAD = '<div class="career-head">';

export function applyCareer(html, career) {
  if (!FACTS.test(html)) throw new Error('marker not found: CAREER FACTS');
  let out = html.replace(FACTS, (_, start, end) => `${start}${educationBlock(career)}${end}`);
  const missing = [];
  const hidden = [];
  for (const role of career.roles) {
    const shown = role.surfaces?.retro !== false;
    const at = out.indexOf(`data-role="${role.id}"`);
    if (at < 0) { if (shown) missing.push(role.id); continue; }
    if (!shown) { hidden.push(role.id); continue; }
    const head = out.indexOf(HEAD, at);
    const eol = out.indexOf('\n', head);
    out = out.slice(0, head) + headLine(role) + out.slice(eol < 0 ? out.length : eol);
  }
  return { html: out, missing, hidden };
}

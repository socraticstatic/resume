# Resume OS Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the retro-OS resume as a public, historically truthful, internally consistent site, with its career and project facts drawn from one shared source of truth that job-hunter and conscious-shell.com also use.

**Architecture:** The site stays one `index.html` with a `data-os` theme engine and a boot timeline engine. Truth lives in `~/Developer/job-hunter/data/` (`facts.md` claims bank, `resume.json` master resume, new `projects.json` registry); the site and conscious-shell copy from it and a test fails when they drift. Boot screens are built by the "Resume updates" session in `.claude/boot-lab/boot-lab.html` and ported here as a block replacement.

**Tech Stack:** Vanilla HTML/CSS/JS, Node 20 `node:test` for static checks, Supabase migrations for conscious-shell, gh CLI for release.

**Spec:** `docs/superpowers/specs/2026-10-02-resume-os-polish-design.md`

## Global Constraints

- No em dashes anywhere in prose, copy, commit messages, or README. Contractions in first-person copy.
- No claim on any surface that is absent from `job-hunter/data/facts.md`, except items in `projects.json` marked `"status": "needs_confirmation"`, which must read as prototypes and carry no outcome numbers.
- AT&T agent work is prototyped, never "architected", "shipped", or "managing" infrastructure.
- `bootConfig`, `switchTheme`, `mac9Extensions`, and the `.boot-*` / `.extensions-strip` / `.ext-chip` CSS stay contiguous and untouched until Task 5.
- Culture comments in CSS and JS stay.
- `tailored/` never enters git.

## Review Focus

1. A visitor with `prefers-reduced-motion` must still reach the desktop in under a second on first load (Task 5 test: boot duration 300ms with the media query emulated).
2. Pressing `Cmd+1..6` while a boot overlay is already running must not stack two overlays (Task 5 test: second call removes the first overlay before starting).
3. The XP taskbar at the bottom must not cover the Trash icon or the last desktop icon on a 768px-tall viewport (Task 4 check at 1024x768).
4. The BeOS Deskbar must still expose the File and Theme menus and the clock (Task 4 check: both dropdowns open from the corner panel).
5. `npm test` must pass when `../job-hunter` is absent (CI, a stranger's clone) and must fail when a date in index.html contradicts `resume.json` (Task 2 tests both branches).

---

### Task 1: Projects registry in job-hunter

**Files:**
- Create: `~/Developer/job-hunter/data/projects.json`
- Create: `~/Developer/job-hunter/bin/registry-check.mjs`
- Modify: `~/Developer/job-hunter/CLAUDE.md` (add the registry line and the consumers)

**Interfaces:**
- Produces `projects.json`: `{ "version": 1, "updated": "YYYY-MM-DD", "projects": Project[] }` where `Project = { id, name, kind: "employer" | "independent" | "open-source" | "site", org, dates, status: "facts" | "needs_confirmation", facts_ref: string (a heading or bullet id in facts.md, "" when needs_confirmation), one_line, summary, tags: string[], links: { repo?: string, live?: string }, visibility: "public" | "private" | "internal", surfaces: { job_hunter: boolean, retro: boolean, conscious_shell: boolean } }`.
- Later tasks read it by path `../job-hunter/data/projects.json` relative to each consumer repo.

- [ ] **Step 1: Write `registry-check.mjs`** that loads `projects.json`, `facts.md`, `resume.json` and exits 1 when: an id repeats; a required field is missing; `status: "facts"` but `facts_ref` is not a substring of facts.md; a `needs_confirmation` summary contains a digit followed by `%`, `$`, or the words "shipped" or "production". Prints `registry ok: N projects` on success.
- [ ] **Step 2: Run it before the registry exists.** Expected: exits 1, "projects.json not found".
- [ ] **Step 3: Write `projects.json`** with these ids, in this order: `netbond-sdci`, `cloud-assistant`, `cloud-designer`, `film-pipeline`, `insight-engine`, `dni-diagnostics`, `helen-vault-daemon`, `roots`, `pen-and-paper`, `chart-color-audit`, `chart-color-system`, `gpsail`, `job-hunter`, `conscious-shell`, `resume-os`, `product-value-engine`, `ai-concierge`, `service-assurance`, `treverity-harvey`, `ge-fortran`, `mint-ecommerce`, `citi-tap-to-pay`. The last three of the first group that lack facts (`product-value-engine`, `ai-concierge`, `service-assurance`) are `needs_confirmation` with README-accurate prototype copy. Summaries for facts-backed items are lifted from facts.md.
- [ ] **Step 4: Run `node bin/registry-check.mjs`.** Expected: `registry ok: 22 projects`.
- [ ] **Step 5: Add to job-hunter `CLAUDE.md`:** "`data/projects.json`: the project registry shared by this pipeline, ~/Developer/resume, and conscious-shell.com. `bin/registry-check.mjs` validates it. LinkedIn is reconciled by hand against `facts.md`." Commit in job-hunter: `feat: projects registry shared by resume surfaces`.

### Task 2: Reconcile the retro site's facts

**Files:**
- Modify: `index.html` (About window, Career window, Projects window, `QA`, `askAnswers`, `roleData`, `translations`, `og:description`)
- Create: `tests/truth.test.mjs`
- Modify: `package.json` (`"test": "node --test tests/"`, name `resume-os`, license MIT, description, repository)

**Interfaces:**
- Consumes `../job-hunter/data/resume.json` and `facts.md` when present.
- Produces nothing other tasks call.

- [ ] **Step 1: Write `tests/truth.test.mjs`** with: `test('forbidden claims absent')` asserting index.html contains none of `/architected/i`, `/126 products/i`, `/agents that manage/i`, `/Nortel/`, `/36 products/`, `/22\+ emerging/`; `test('dates match resume.json')` that skips with a message when `../job-hunter/data/resume.json` is missing, else for each role and earlier entry asserts `index.html` contains `${company}, ${dates}` after HTML-entity normalisation (`&amp;` to `&`); `test('every registry project marked retro appears')` likewise skipping when absent.
- [ ] **Step 2: Run `npm test`.** Expected: 3 failures (forbidden phrases present, dates mismatch for GE Nuclear and U.S. Mint, registry projects missing).
- [ ] **Step 3: Edit index.html copy.** About thesis and `translations.en.thesis` become `resume.json.profile`; metrics row becomes `$300K+ Hardware Savings`, `48% Error Drop`, `47 Designers Mentored`; `og:description` loses "126 products shipped". Career list reorders to resume.json order with the new "Founder and Designer, AI Products / Own products, 2025 - Present" role inserted after AT&T, dates and titles copied verbatim from resume.json (`GE Nuclear, 2013 - 2016`, `U.S. Mint (via PFSweb), 2013 - 2014`, `Dell (via Possible Worldwide), 2011 - 2012`, `Mentor and Instructor Advisory Board`), AT&T body rewritten from the eight resume.json bullets, Treverity metrics row drops "36 products", CareerFoundry says 47. `QA.att[0]`, `askAnswers[0]`, `askAnswers[3]`, `roleData.lead.thesis`, `roleData.builder.thesis`, `QA.early[0]` rewritten to facts.md framing (prototype, own-site agents live, 71 tools, no Nortel). Projects window rebuilt from `projects.json` entries with `surfaces.retro`, in registry order, `needs_confirmation` items labelled "Prototype".
- [ ] **Step 4: Run `npm test`.** Expected: all pass. Temporarily change one date and confirm the dates test fails, then revert (pins Review Focus 5).
- [ ] **Step 5: Commit** `fix: align career and project copy with job-hunter facts`.

### Task 3: Code consistency

**Files:**
- Modify: `index.html` (remove `osLogos`, static `#context-menu` markup and CSS, `easterBuf` handler; add `about` to `EasterEggEngine.SEQUENCES`; rewrite the dynamic context menu; replace `alert()` in Get Info; add `SITE_VERSION`; compute status counts)
- Create: `tests/static.test.mjs`

**Interfaces:**
- Produces `var SITE_VERSION = '2.1';` used by the About footer, the easter window, and the rebuild lines.
- Produces `function buildContextMenu(x, y)` returning the menu element with class `ctx-menu` and items using classes `ctx-item` / `ctx-sep` styled by theme variables.

- [ ] **Step 1: Write `tests/static.test.mjs`:** every `onclick="name(` resolves to a `function name(` or `var name =` in the file; no `osLogos`, `hideCtx`, `alert(`, or `easterBuf`; `SITE_VERSION` appears once as a declaration and the literal `v1.0`/`Version 1.0` never; the `win-status` text for career and projects is empty in the markup (filled at init); `themeKeys` ids equal the `theme-box` ids and the `switchTheme('…')` menu ids.
- [ ] **Step 2: Run `npm test`.** Expected: failures on each dead symbol and on the status text.
- [ ] **Step 3: Implement the removals and additions.** Status bars get `data-count="career-role"` / `data-count="project-item"` and INIT fills `N roles` / `N projects`. The context menu lists Change Wallpaper, Appearance..., Flying Toasters, Cyberhacker, About This Resume, Save as PDF.
- [ ] **Step 4: Run `npm test`.** Expected: pass. Browser: right-click the desktop in Mac OS 7 and Windows XP and confirm the menu takes each theme's colors; type `about` and `rebuild` once each and confirm one window and one terminal appear.
- [ ] **Step 5: Commit** `refactor: remove dead code, one key handler, theme-aware context menu, single version`.

### Task 4: Chrome truthfulness

**Files:**
- Modify: `index.html` theme CSS blocks for `win31`, `winxp`, `aqua`, `beos`, `mac9`; `osIcons.win31`, `osIcons.aqua`; `themeEra`; theme labels.

**Interfaces:**
- Consumes nothing new. Produces CSS only; the Deskbar and taskbar reuse `#menubar` with theme-scoped overrides so Task 5's port is unaffected.

- [ ] **Step 1: Windows 3.1.** `--desktop-bg: #c0c0c0`, `--icon-text: #000` and no label shadow, close box moved to `left: 3px` as a control-menu box with a dash, title centered, `.titlebar::after` draws ▼▲ on the right, `menu-os-label` hidden, six 32px 16-color pixel SVG icons in `osIcons.win31`. Era `Apr 1992`. Browser check at 1024x768.
- [ ] **Step 2: Windows XP.** `#menubar` becomes the bottom Luna taskbar (height 30px, blue gradient), `menu-os-label` renders the green "start" button with the flag SVG, dropdowns open upward (`top: auto; bottom: 100%`), clock sits in a lighter blue tray. `.icon-column` bottom padding grows by 34px so nothing hides behind the bar (Review Focus 3).
- [ ] **Step 3: Mac OS X.** Horizontal pinstripes on `.titlebar` and `.window`, lighter Aqua Blue desktop gradient, six glossy SVG icons in `osIcons.aqua`, label "Mac OS X" in the Theme menu, era `Aug 2002`.
- [ ] **Step 4: BeOS.** `#menubar` becomes a top-right Deskbar panel (gray #d8d8d8, 1px #888 border, two rows: Be logo + clock, then File and Theme), icons move to the left column, `menu-os-label` renders the red-square-blue-"Be" logo SVG. Dropdowns still open (Review Focus 4).
- [ ] **Step 5: Mac OS 9.** `--desktop-bg` becomes `#336666 url(assets/wallpapers/mac9/mac-os-background.jpg) center/cover`, era `Jan 2001`. Mac OS 7 era stays `Mar 1993`.
- [ ] **Step 6: Screenshot all six themes with About, Career, and Appearance open; compare against the GUIdebook empty-desktop references.** Commit one commit per theme: `feat(win31): ...`, `feat(winxp): ...`, `feat(aqua): ...`, `feat(beos): ...`, `feat(mac9): ...`.

### Task 5: Boot engine port

**Files:**
- Modify: `index.html` (`bootConfig` through `switchTheme` JS block, `.boot-*` CSS block, INIT)
- Source: `.claude/boot-lab/boot-lab.html` from the "Resume updates" session

**Interfaces:**
- Consumes the lab file's `switchTheme(os)` and `bootOnLoad()`; keeps `setTheme(os)` as the terminal call.

- [ ] **Step 1: Wait for the "Resume updates" idle notice; read the lab file whole.** Confirm it matches the spec's boot table and the research sent at 15:52. Reject and message back anything that contradicts it.
- [ ] **Step 2: Replace the three blocks.** Add `bootOnLoad()` to INIT guarded by `sessionStorage.getItem('booted')`.
- [ ] **Step 3: Browser checks:** each theme's boot frozen mid-sequence and compared to its reference; `Cmd+2` pressed twice quickly leaves one overlay (Review Focus 2); reduced-motion emulation reaches the desktop in under 1s (Review Focus 1); first load boots once per tab.
- [ ] **Step 4: Commit** `feat: period-accurate boot sequences for all six systems` crediting the lab session, and message "Resume updates" that the port landed.

### Task 6: Public release

**Files:**
- Modify: `.gitignore` (+`tailored/`), `README.md`, `package.json`
- Create: `LICENSE` (MIT)

- [ ] **Step 1:** `git check-ignore tailored` passes after the edit. `git log -p | grep -iE "api[_-]?key|secret|token|password" | grep -v "placeholder"` returns nothing.
- [ ] **Step 2: README** sections: What this is; Themes (six rows with correct years: System 7 1991, Mac OS 9 1999, Windows 3.1 1992, Windows XP 2001, Mac OS X Jaguar 2002, BeOS R5 2000); Navigation; Easter eggs; How I built it (one file, the `data-os` engine, the boot timeline engine, the facts pipeline from job-hunter, asset provenance: ChicagoFLF via cdnfonts, Charcoal and Monaco TTFs and Mac OS 9 pictures from grassmunk/Platinum9, NineIcons and SevenIcons, After Dark tribute; built in Claude Code with Micah directing); Running locally (`python3 -m http.server`); Tests; Credits and trademark note; License.
- [ ] **Step 3:** Commit `docs: public README, MIT license, ignore tailored variants`. Then `gh repo edit socraticstatic/resume --visibility public --accept-visibility-change-consequences`, `gh api -X POST repos/socraticstatic/resume/pages -f 'source[branch]=main' -f 'source[path]=/'`, and open `https://socraticstatic.github.io/resume/` in the browser: boot plays, About opens, fonts load.

### Task 7: conscious-shell mirror

**Files:**
- Create: `~/Developer/conscious-shell/scripts/sync-projects-from-registry.mjs`
- Create: `~/Developer/conscious-shell/supabase/migrations/20261002200000_projects_from_registry.sql` (generated)

**Interfaces:**
- Consumes `../job-hunter/data/projects.json` entries with `surfaces.conscious_shell`.
- Produces SQL: `insert into portfolio_projects (title, role, client, summary, tags, image_url, order_index, featured) ... on conflict do nothing` for each new entry at order_index 11 upward, plus `update portfolio_projects set summary = ... where title = 'AT&T Product Design'` with the facts.md framing.

- [ ] **Step 1:** Write the generator; run it; read the SQL by eye for the no-em-dash and prototype rules.
- [ ] **Step 2:** Apply with `supabase db push` from the linked project; if it prompts for a password, apply through the Management API query endpoint the way `scripts/insert-diploma-article.mjs` does.
- [ ] **Step 3:** Verify with the anon REST read that the rows exist, then open `https://conscious-shell.com/#work` in the browser and confirm the new rows render and `/work/vault-daemon` opens.
- [ ] **Step 4:** Commit and push conscious-shell: `feat: project rows generated from the shared registry`.

### Task 8: Source-of-truth pointers

**Files:**
- Modify: `~/Developer/resume/CLAUDE.md`, `~/CLAUDE.md` (the one line naming index.html as source of truth), `~/Developer/conscious-shell/CLAUDE.md` if present, `~/Documents/CreativeAssistant/_memory.md`

- [ ] **Step 1:** Each file names `~/Developer/job-hunter/data/facts.md` + `resume.json` + `projects.json` as canonical and the three surfaces as consumers; the resume CLAUDE.md line "index.html is the source of truth" becomes "index.html is derived from job-hunter data; `npm test` enforces it".
- [ ] **Step 2:** Append the session summary to `_memory.md`. Commit the resume change; the global CLAUDE.md edit is reported in the final message.

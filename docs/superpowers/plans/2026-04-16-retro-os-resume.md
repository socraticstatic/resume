# Retro OS Desktop Resume - Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Micah Boswell's resume as a retro desktop OS interface with 6 switchable themes (Mac OS 7, Mac OS 9, Windows XP, Windows 3.1, Mac OS Aqua, BeOS), draggable windows containing career content, and an AI chat window.

**Architecture:** Single self-contained HTML file (no build step, no framework, no dependencies). CSS custom properties drive all theme switching. Window management via vanilla JS. Career data from the existing drawer system carries forward. Each OS theme is a CSS class on the root element that overrides custom properties (colors, borders, fonts, shadows, title bar chrome).

**Tech Stack:** Vanilla HTML/CSS/JS. Chicago font (OS 7/9), Tahoma (XP/3.1), Lucida Grande (Aqua), Swis721 BT (BeOS) via @font-face or web-safe fallbacks. No npm, no build, no CDN dependencies beyond fonts.

**Reference:** wesdieleman.com for interaction patterns. Each OS's actual visual language for theme accuracy.

---

## File Structure

```
resume/
  index.html          -- The entire application (single file, self-contained)
  CLAUDE.md            -- Project context (already exists, update with new direction)
  .impeccable.md       -- Design context (update)
```

Everything lives in `index.html`. The file is organized internally as:
1. `<style>` - CSS custom properties per theme, window chrome, desktop, taskbar
2. `<body>` - Desktop with icons, windows, taskbar/menu bar
3. `<script>` - Window management, theme switching, AI chat, career data

---

### Task 1: Desktop Shell + Mac OS 7 Theme (Default)

**Files:**
- Modify: `/Users/micahbos/resume/index.html` (full rewrite)

This is the foundation. Mac OS 7 is the default theme. Everything else builds on this.

- [ ] **Step 1: Write the HTML shell**

Desktop background, menu bar (Apple menu, File, Edit, View, Special, Theme), desktop icons (Career, Projects, About, Contact, Ask Micah), and one window (About) open by default.

```html
<!DOCTYPE html>
<html lang="en" data-os="mac7">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Micah Boswell</title>
  <!-- styles go here -->
</head>
<body>
  <div class="menubar">
    <span class="menu-apple">&#63743;</span>
    <span class="menu-item" data-menu="file">File</span>
    <span class="menu-item" data-menu="theme">Theme</span>
  </div>
  <div class="desktop" id="desktop">
    <!-- Desktop icons -->
    <div class="icon" ondblclick="openWin('about')">
      <div class="icon-img">&#128196;</div>
      <div class="icon-label">About Micah</div>
    </div>
    <div class="icon" ondblclick="openWin('career')">
      <div class="icon-img">&#128188;</div>
      <div class="icon-label">Career</div>
    </div>
    <div class="icon" ondblclick="openWin('projects')">
      <div class="icon-img">&#128187;</div>
      <div class="icon-label">Projects</div>
    </div>
    <div class="icon" ondblclick="openWin('contact')">
      <div class="icon-img">&#128231;</div>
      <div class="icon-label">Contact</div>
    </div>
    <div class="icon" ondblclick="openWin('ai')">
      <div class="icon-img">&#129302;</div>
      <div class="icon-label">Ask Micah</div>
    </div>
    <div class="icon" ondblclick="openWin('theme')">
      <div class="icon-img">&#127912;</div>
      <div class="icon-label">Themes</div>
    </div>
  </div>
  <!-- Windows rendered here by JS -->
</body>
</html>
```

NOTE: Icons above use Unicode placeholders. Replace with proper pixel-art SVGs or CSS-drawn icons that match each OS theme. Do NOT use emoji (per taste-skill anti-emoji rule). Design simple monochrome icons in the style of the active OS.

- [ ] **Step 2: Write the Mac OS 7 CSS theme**

CSS custom properties on `[data-os="mac7"]` for:
- Desktop: solid gray (#666688 era-appropriate)
- Window chrome: white title bar, horizontal lines pattern, close box (square, not circle), 1px black border, no rounded corners
- Font: Chicago 12px (or Geneva as fallback) - use system-ui as safe fallback with appropriate sizing
- Menu bar: white background, black text, top of screen
- Icons: black text below icon, highlighted on select
- Scrollbars: gray with arrows, classic Mac style

```css
[data-os="mac7"] {
  --desktop-bg: #667;
  --win-bg: #fff;
  --win-border: 1px solid #000;
  --win-radius: 0;
  --win-shadow: 2px 2px 0 rgba(0,0,0,0.5);
  --titlebar-bg: #fff;
  --titlebar-text: #000;
  --titlebar-height: 20px;
  --titlebar-font: 'Chicago', 'Geneva', 'Charcoal', system-ui;
  --titlebar-size: 12px;
  --titlebar-lines: repeating-linear-gradient(0deg, #000 0px, #000 1px, transparent 1px, transparent 3px);
  --body-font: 'Geneva', 'Charcoal', system-ui;
  --body-size: 12px;
  --close-style: square; /* square box with inner border */
  --menubar-bg: #fff;
  --menubar-border: 1px solid #000;
  --icon-text: #000;
  --icon-highlight: #000;
  --icon-highlight-text: #fff;
}
```

- [ ] **Step 3: Write window management JS**

Core functions:
- `openWin(id)` - creates/shows a window, positions it with slight offset from last opened
- `closeWin(id)` - hides the window
- `bringToFront(id)` - z-index management
- Drag by title bar (mousedown/mousemove/mouseup on titlebar element)
- Windows store position in a JS object

```javascript
const wins = {};
let topZ = 10;
let offsetX = 40, offsetY = 40;

function openWin(id) {
  if (wins[id] && wins[id].el) {
    wins[id].el.style.display = 'flex';
    bringToFront(id);
    return;
  }
  // Create window element, populate with content from CONTENT[id]
  // Append to desktop, make draggable, store reference
}

function closeWin(id) {
  if (wins[id] && wins[id].el) wins[id].el.style.display = 'none';
}

function bringToFront(id) {
  topZ++;
  if (wins[id] && wins[id].el) wins[id].el.style.zIndex = topZ;
}
```

- [ ] **Step 4: Write window content data**

Carry forward from existing resume. Each window ID maps to title + HTML content:

- `about`: Name, thesis, metrics, contact info
- `career`: Full career timeline with clickable roles (open sub-windows or expand inline)
- `projects`: AI Projects list
- `contact`: Contact info, links
- `ai`: The AI chat interface (suggested questions, free text, keyword-matched responses)
- `theme`: Theme picker (6 OS options as clickable icons/buttons)

Career roles within the career window should be clickable to expand details inline (accordion style) rather than opening sub-windows. The AI chat Q&A data carries forward exactly from the current implementation.

- [ ] **Step 5: Test Mac OS 7 theme**

Open in browser. Verify:
- Desktop background renders
- Menu bar at top
- Icons on desktop, double-click opens windows
- Windows are draggable by title bar
- Close box closes window
- Z-index stacking works (click window brings to front)
- Content renders in all windows
- AI chat works in Ask Micah window

- [ ] **Step 6: Commit**

```bash
cd /Users/micahbos/resume
git add index.html
git commit -m "feat: retro OS desktop resume with Mac OS 7 theme and window management"
```

---

### Task 2: Theme Engine + 5 Additional Themes

**Files:**
- Modify: `/Users/micahbos/resume/index.html` (add CSS themes + theme switcher)

Each theme is a CSS block on `[data-os="<name>"]` that overrides custom properties. The theme switcher window shows 6 options. Clicking one sets `document.documentElement.dataset.os` and saves to localStorage.

- [ ] **Step 1: Write Mac OS 9 theme CSS**

Platinum appearance. Key differences from OS 7:
- Window chrome: gray gradient titlebar with subtle 3D emboss
- Close/minimize/zoom buttons: small squares, left side
- Rounded corners: none (still square)
- Font: Charcoal (or system-ui fallback)
- Desktop: teal/blue-gray pattern
- Scrollbars: more refined gray with proportional thumb

```css
[data-os="mac9"] {
  --desktop-bg: #466;
  --win-bg: #ececec;
  --win-border: 1px solid #888;
  --win-radius: 0;
  --win-shadow: 1px 1px 4px rgba(0,0,0,0.3);
  --titlebar-bg: linear-gradient(180deg, #ddd 0%, #bbb 100%);
  --titlebar-text: #000;
  --titlebar-height: 22px;
  --titlebar-font: 'Charcoal', system-ui;
  --titlebar-size: 12px;
  --titlebar-lines: none;
  --body-font: 'Charcoal', system-ui;
  --body-size: 12px;
  --close-style: square-3d;
  --menubar-bg: linear-gradient(180deg, #eee 0%, #ccc 100%);
  --menubar-border: 1px solid #999;
}
```

- [ ] **Step 2: Write Windows 3.1 theme CSS**

Program Manager style:
- Desktop: solid teal (#008080)
- Windows: white with dark blue title bar, white title text
- Font: Fixedsys or MS Sans Serif (use monospace/system-ui fallback)
- Hard pixel borders, no shadows
- Minimize/maximize/close boxes on right side of titlebar
- Menu bar inside each window (not global)

```css
[data-os="win31"] {
  --desktop-bg: #008080;
  --win-bg: #c0c0c0;
  --win-border: 2px outset #fff;
  --win-radius: 0;
  --win-shadow: none;
  --titlebar-bg: #000080;
  --titlebar-text: #fff;
  --titlebar-height: 20px;
  --titlebar-font: 'Fixedsys', 'Courier New', monospace;
  --titlebar-size: 12px;
  --titlebar-lines: none;
  --body-font: 'MS Sans Serif', 'Tahoma', system-ui;
  --body-size: 12px;
  --close-style: win-3d;
  --menubar-bg: #c0c0c0;
  --menubar-border: 1px solid #808080;
}
```

- [ ] **Step 3: Write Windows XP theme CSS**

Luna theme:
- Desktop: bliss-inspired gradient (blue sky)
- Windows: blue title bar gradient, rounded top corners, silver body
- Font: Tahoma 11px
- Close/min/max buttons: colored circles (red/yellow/green... no, that's Mac. XP has colored rectangles: red X, gray squares)
- Drop shadow on windows
- Start button style element in taskbar

```css
[data-os="winxp"] {
  --desktop-bg: linear-gradient(180deg, #235ade 0%, #4a9ade 40%, #7bc67b 70%, #4a9a4a 100%);
  --win-bg: #ece9d8;
  --win-border: 1px solid #0054e3;
  --win-radius: 8px 8px 0 0;
  --win-shadow: 2px 2px 10px rgba(0,0,0,0.3);
  --titlebar-bg: linear-gradient(180deg, #0058e6 0%, #3a8cf2 45%, #0058e6 100%);
  --titlebar-text: #fff;
  --titlebar-height: 26px;
  --titlebar-font: 'Tahoma', 'Segoe UI', system-ui;
  --titlebar-size: 11px;
  --titlebar-lines: none;
  --body-font: 'Tahoma', 'Segoe UI', system-ui;
  --body-size: 11px;
  --close-style: xp-buttons;
  --menubar-bg: #ece9d8;
  --menubar-border: 1px solid #aca899;
}
```

- [ ] **Step 4: Write Mac OS Aqua theme CSS**

Mac OS X (Tiger/Leopard era):
- Desktop: space/aurora gradient
- Windows: brushed metal or unified gray, rounded corners, red/yellow/green traffic lights
- Font: Lucida Grande 13px (use system-ui on non-Mac)
- Subtle shadows, refined spacing
- Menu bar: translucent white at top

```css
[data-os="aqua"] {
  --desktop-bg: linear-gradient(180deg, #1a1a3e 0%, #2d1b69 30%, #6b3fa0 60%, #3a7bd5 100%);
  --win-bg: #f5f5f5;
  --win-border: 1px solid rgba(0,0,0,0.2);
  --win-radius: 10px;
  --win-shadow: 0 8px 32px rgba(0,0,0,0.25);
  --titlebar-bg: linear-gradient(180deg, #e8e8e8 0%, #d0d0d0 100%);
  --titlebar-text: #333;
  --titlebar-height: 28px;
  --titlebar-font: 'Lucida Grande', system-ui;
  --titlebar-size: 13px;
  --titlebar-lines: none;
  --body-font: 'Lucida Grande', system-ui;
  --body-size: 13px;
  --close-style: traffic-lights;
  --menubar-bg: rgba(255,255,255,0.8);
  --menubar-border: 1px solid rgba(0,0,0,0.1);
}
```

- [ ] **Step 5: Write BeOS theme CSS**

BeOS R5:
- Desktop: gray-blue
- Windows: yellow title bar tabs (!), gray body
- Font: Swis721 BT (use sans-serif fallback)
- Title bar is a tab shape, not full width
- Distinctive close button (small square, right side)
- Clean, utilitarian spacing

```css
[data-os="beos"] {
  --desktop-bg: #336;
  --win-bg: #d8d8d8;
  --win-border: 1px solid #888;
  --win-radius: 0;
  --win-shadow: 1px 1px 3px rgba(0,0,0,0.3);
  --titlebar-bg: #ffcb00;
  --titlebar-text: #000;
  --titlebar-height: 22px;
  --titlebar-font: 'Swis721 BT', 'Helvetica Neue', sans-serif;
  --titlebar-size: 12px;
  --titlebar-lines: none;
  --titlebar-style: tab; /* tab-shaped, not full width */
  --body-font: 'Swis721 BT', 'Helvetica Neue', sans-serif;
  --body-size: 12px;
  --close-style: beos-square;
  --menubar-bg: #d8d8d8;
  --menubar-border: 1px solid #999;
}
```

- [ ] **Step 6: Write the theme switcher window**

The "Themes" window shows 6 clickable options. Each is a small preview (colored rectangle with a title bar sample). Clicking sets `document.documentElement.dataset.os` and saves to `localStorage.setItem('os-theme', name)`. On page load, check localStorage and apply.

```javascript
function setTheme(os) {
  document.documentElement.dataset.os = os;
  localStorage.setItem('os-theme', os);
}

// On load:
const saved = localStorage.getItem('os-theme');
if (saved) document.documentElement.dataset.os = saved;
```

- [ ] **Step 7: Test all 6 themes**

Cycle through each theme. Verify:
- Desktop background changes
- Window chrome matches the OS
- Title bar style is correct (lines for OS 7, gradient for OS 9, blue for XP, etc.)
- Font changes per theme
- Close button style changes
- Menu bar style changes
- Theme persists on reload (localStorage)

- [ ] **Step 8: Commit**

```bash
cd /Users/micahbos/resume
git add index.html
git commit -m "feat: add 5 OS themes (Mac OS 9, Win 3.1, Win XP, Aqua, BeOS) + theme switcher"
```

---

### Task 3: Career Window with Expandable Roles

**Files:**
- Modify: `/Users/micahbos/resume/index.html` (career window content)

The Career window shows the role list. Clicking a role expands it inline (accordion) to show the full detail + AI chat questions, rather than opening sub-windows.

- [ ] **Step 1: Write the career window content structure**

Roles listed as clickable rows. Each row shows: Title, Company, Year (on one line). Clicking expands to show the description, metrics, and "Ask about this role" pills.

```html
<!-- Inside career window content -->
<div class="role-row" onclick="toggleRole(this)">
  <div class="role-head">
    <strong>Lead Product Designer</strong>
    <span>AT&T, 2021 - Present</span>
  </div>
  <div class="role-body" style="display:none">
    <p>Built the AI agent framework that manages AT&T's network infrastructure lifecycle...</p>
    <div class="role-metrics">
      <strong>$300K+</strong> hardware savings
      <strong>26 tasks</strong> automated
    </div>
    <div class="role-ask">
      <button onclick="askRole('att',0)">What was the agentic framework?</button>
      <button onclick="askRole('att',1)">How did you save $300K?</button>
    </div>
    <div class="role-answer" id="att-answer"></div>
  </div>
</div>
```

- [ ] **Step 2: Write the toggleRole function**

```javascript
function toggleRole(el) {
  const body = el.querySelector('.role-body');
  const isOpen = body.style.display !== 'none';
  // Close all other open roles first
  document.querySelectorAll('.role-body').forEach(b => b.style.display = 'none');
  body.style.display = isOpen ? 'none' : 'block';
}
```

- [ ] **Step 3: Write all role content**

Port every role from the current `D` object in the existing index.html. Each role gets: title, company+year, one-sentence description, key metrics, and 2-4 AI chat questions.

Roles to include (from Career Master):
- AT&T (Lead Product Designer, 2021-Present)
- Wells Fargo (CX/UX Design Lead, 2020-2021)
- Treverity (VP Experience Design, 2016-2020)
- Citi (Senior UX Architect, 2016)
- GE Nuclear (UX Consultant, 2012-2016)
- U.S. Mint (Director, UX Strategy, 2013)
- Dell (UX Architect, 2011-2012)
- Broadlane (Creative Director, 2005-2010)
- Foundation roles (Hitachi, Richards Group, Perot, NCH, IMC2, GSK, Nortel - 1996-2005)

- [ ] **Step 4: Test career window**

- Open Career window
- Click each role - expands with details
- Click again - collapses
- Click a different role - previous collapses, new one opens
- AI question pills work - show answer inline
- Free text input works

- [ ] **Step 5: Commit**

```bash
cd /Users/micahbos/resume
git add index.html
git commit -m "feat: career window with expandable roles and inline AI chat"
```

---

### Task 4: About, Projects, Contact, and AI Windows

**Files:**
- Modify: `/Users/micahbos/resume/index.html`

- [ ] **Step 1: Write About window content**

Name, thesis statement, the three big metrics, capabilities list, Also section (Spanish, mentoring, published, education), Creative & Awards. This is the "resume at a glance" - the surface content from the current design.

- [ ] **Step 2: Write Projects window content**

AI Projects: vault-daemon, Agentic Infrastructure, GPSail, eCornell AI. Each with name and one-sentence description. Optionally link to GitHub.

- [ ] **Step 3: Write Contact window content**

Phone, email, website, GitHub, LinkedIn. Simple, clean. Style matches OS theme.

- [ ] **Step 4: Write AI Chat window**

Full-screen version of the AI chat. Not tied to a specific role. Suggested questions about the overall career. Free text input. Uses the same keyword-matching engine but searches across ALL roles' Q&A data.

- [ ] **Step 5: Test all windows**

Open each window. Verify content renders. Verify AI chat works in standalone mode. Verify windows are draggable and stackable.

- [ ] **Step 6: Commit**

```bash
cd /Users/micahbos/resume
git add index.html
git commit -m "feat: about, projects, contact, and AI chat windows"
```

---

### Task 5: Polish and Print Fallback

**Files:**
- Modify: `/Users/micahbos/resume/index.html`

- [ ] **Step 1: Add print stylesheet**

`@media print` strips the desktop chrome entirely and renders content as a clean single-column document. No windows, no desktop, no menu bar. Just: name, thesis, metrics, career, projects, capabilities, contact. The resume content should print as a professional document regardless of which OS theme is active.

- [ ] **Step 2: Add startup animation**

On first load, a brief "booting" sequence appropriate to the active OS:
- Mac OS 7: Happy Mac icon, then desktop appears
- Windows XP: Blue loading bar
- BeOS: "Be" logo flash
Keep it under 2 seconds. Skip on return visit (sessionStorage flag).

- [ ] **Step 3: Add keyboard shortcuts**

- `Cmd/Ctrl + 1-6` to switch themes
- `Cmd/Ctrl + W` to close frontmost window
- `Escape` to close frontmost window

- [ ] **Step 4: Test everything**

Full pass through all 6 themes. Open/close/drag all windows. Print preview. Keyboard shortcuts. AI chat. Theme persistence.

- [ ] **Step 5: Commit**

```bash
cd /Users/micahbos/resume
git add index.html
git commit -m "feat: print fallback, boot animation, keyboard shortcuts"
```

---

### Task 6: Update Project Files

**Files:**
- Modify: `/Users/micahbos/resume/CLAUDE.md`
- Modify: `/Users/micahbos/resume/.impeccable.md`
- Modify: `/Users/micahbos/.claude/projects/-Users-micahbos-vault-daemon/memory/session_handoff.md`

- [ ] **Step 1: Update CLAUDE.md**

Replace the current content with the new project context: retro OS desktop resume, 6 themes, window management, AI chat.

- [ ] **Step 2: Update .impeccable.md**

Update design context to reflect the OS desktop metaphor, the themes, and the interaction patterns.

- [ ] **Step 3: Update session handoff**

Record completion status.

- [ ] **Step 4: Commit**

```bash
cd /Users/micahbos/resume
git add CLAUDE.md .impeccable.md
git commit -m "docs: update project context for retro OS desktop resume"
```

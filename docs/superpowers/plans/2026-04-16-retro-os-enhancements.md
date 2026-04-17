# Retro OS Resume Enhancements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 20 delight-and-polish enhancements to the retro OS desktop resume, turning it from a functional demo into something people share.

**Architecture:** All changes go into the single `index.html` file. CSS additions go in the `<style>` block, HTML additions in the `<body>`, JS additions in the `<script>` block. No external dependencies. Audio uses base64 data URIs. Preview server at port 8765 via `.claude/launch.json`.

**Tech Stack:** Vanilla HTML/CSS/JS, inline SVG, base64 audio, CSS animations, Web Audio API

---

## File Structure

All changes target one file:
- **Modify:** `/Users/micahbos/resume/index.html`

Changes organized by section within the file:
- CSS: Lines ~8-755 (inside `<style>`)
- HTML: Lines ~756-1185 (inside `<body>`)
- JS: Lines ~1188-1517 (inside `<script>`)

---

### Task 1: Window Resize + Shadow Lift on Drag

Adds a resize grippy in the bottom-right corner of each window and lifts the shadow while dragging.

**Files:**
- Modify: `/Users/micahbos/resume/index.html` (CSS + JS sections)

- [ ] **Step 1: Add resize grip CSS**

Insert before the `</style>` closing tag, before the print stylesheet:

```css
/* ===== WINDOW RESIZE ===== */
.win-resize {
  position: absolute; bottom: 0; right: 0; width: 16px; height: 16px;
  cursor: nwse-resize; z-index: 2;
}
.win-resize::after {
  content: ''; position: absolute; bottom: 3px; right: 3px;
  width: 8px; height: 8px;
  border-right: 2px solid var(--divider); border-bottom: 2px solid var(--divider);
  opacity: 0.4;
}
.window.dragging { filter: brightness(1.02); }
[data-os="mac7"] .window.dragging { box-shadow: 2px 2px 0 #000; }
[data-os="mac9"] .window.dragging { box-shadow: 2px 2px 6px rgba(0,0,0,0.3); }
[data-os="win31"] .window.dragging { box-shadow: 2px 2px 0 #000; }
[data-os="winxp"] .window.dragging { box-shadow: 4px 4px 16px rgba(0,0,0,0.45); }
[data-os="aqua"] .window.dragging { box-shadow: 0 8px 24px rgba(0,0,0,0.35); }
[data-os="beos"] .window.dragging { box-shadow: 2px 2px 4px rgba(0,0,0,0.3); }
```

- [ ] **Step 2: Add resize grip HTML to each window**

After each `<div class="win-body">...</div>` closing tag but before the window's closing `</div>`, add:

```html
<div class="win-resize" onmousedown="startResize(event, 'WINDOWID')"></div>
```

Replace WINDOWID with: about, career, projects, contact, ask, themes (6 windows total).

- [ ] **Step 3: Add resize JS + drag shadow lift**

In the `<script>` section, after the existing drag system code, add:

```javascript
/* ===== RESIZE SYSTEM ===== */
var resizeState = null;
function startResize(e, id) {
  var el = document.getElementById('win-' + id);
  if (!el) return;
  bringToFront(id);
  resizeState = { el: el, startX: e.clientX, startY: e.clientY,
    origW: el.offsetWidth, origH: el.offsetHeight };
  e.preventDefault(); e.stopPropagation();
}
document.addEventListener('mousemove', function(e) {
  if (resizeState) {
    var w = Math.max(250, resizeState.origW + e.clientX - resizeState.startX);
    var h = Math.max(120, resizeState.origH + e.clientY - resizeState.startY);
    resizeState.el.style.width = w + 'px';
    resizeState.el.style.height = h + 'px';
    resizeState.el.style.maxHeight = 'none';
  }
});
document.addEventListener('mouseup', function() { resizeState = null; });
```

Modify the existing `startDrag` function to add the `.dragging` class:

```javascript
// Add at end of startDrag, before e.preventDefault():
el.classList.add('dragging');

// In the mouseup handler, add:
document.querySelectorAll('.window.dragging').forEach(function(w) { w.classList.remove('dragging'); });
```

- [ ] **Step 4: Verify in preview**

Run: reload preview, drag a window title bar (shadow should lift), drag bottom-right corner (window should resize).

---

### Task 2: Window Open Animation + Icon Bounce

Windows zoom in from their icon position when opened. Icons bounce on double-click.

**Files:**
- Modify: `/Users/micahbos/resume/index.html` (CSS + JS sections)

- [ ] **Step 1: Add animation CSS**

```css
/* ===== WINDOW OPEN ANIMATION ===== */
@keyframes winOpen {
  from { transform: scale(0.3); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
.window.open { animation: winOpen 0.2s ease-out; }

/* ===== ICON BOUNCE ===== */
@keyframes iconBounce {
  0%, 100% { transform: translateY(0); }
  30% { transform: translateY(-6px); }
  60% { transform: translateY(-2px); }
}
.desktop-icon.bouncing .icon-graphic {
  animation: iconBounce 0.4s ease-out;
}
```

- [ ] **Step 2: Add icon bounce JS**

Modify the existing `ondblclick` handlers on desktop icons. In JS, add a helper:

```javascript
function bounceAndOpen(iconEl, winId) {
  iconEl.classList.add('bouncing');
  setTimeout(function() { iconEl.classList.remove('bouncing'); }, 400);
  openWin(winId);
}
```

Then update each desktop icon's `ondblclick` to use `bounceAndOpen(this, 'id')` instead of `openWin('id')`.

- [ ] **Step 3: Verify**

Double-click an icon - it should bounce briefly, then the window zooms in from small to full size.

---

### Task 3: CRT Scanline Filter Toggle

Adds an optional CRT effect overlay and a toggle in the Appearance window.

**Files:**
- Modify: `/Users/micahbos/resume/index.html`

- [ ] **Step 1: Add CRT CSS**

```css
/* ===== CRT FILTER ===== */
#crt-overlay {
  display: none; position: fixed; inset: 0; z-index: 9999; pointer-events: none;
  background: repeating-linear-gradient(
    to bottom,
    transparent 0px, transparent 2px,
    rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px
  );
}
#crt-overlay.active { display: block; }
#crt-overlay.active::after {
  content: ''; position: absolute; inset: 0;
  background: radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.15) 100%);
}
```

- [ ] **Step 2: Add CRT overlay element to HTML**

Right after `<div id="desktop">`, add:

```html
<div id="crt-overlay"></div>
```

- [ ] **Step 3: Add CRT toggle in Appearance window**

After the wallpaper section in the themes window, add:

```html
<div class="about-section-title" style="margin-top:14px; margin-bottom:8px;">Effects</div>
<div class="theme-grid" style="grid-template-columns: 1fr 1fr;">
  <div class="wp-box" onclick="toggleCRT()" id="crt-toggle">CRT Scanlines</div>
  <div class="wp-box" onclick="toggleStartupSound()" id="sound-toggle">Startup Sound</div>
</div>
```

- [ ] **Step 4: Add CRT toggle JS**

```javascript
function toggleCRT() {
  var el = document.getElementById('crt-overlay');
  el.classList.toggle('active');
  var btn = document.getElementById('crt-toggle');
  btn.style.fontWeight = el.classList.contains('active') ? 'bold' : 'normal';
  localStorage.setItem('crt', el.classList.contains('active') ? '1' : '');
}
```

In the init function, add: `if (localStorage.getItem('crt')) toggleCRT();`

- [ ] **Step 5: Verify**

Open Appearance, click CRT Scanlines. Faint horizontal lines and vignette should appear over the entire desktop.

---

### Task 4: Startup Chime

Plays a short chime on page load (optional, toggleable).

**Files:**
- Modify: `/Users/micahbos/resume/index.html`

- [ ] **Step 1: Generate a short chime using Web Audio API**

Instead of base64 audio (large), synthesize a short chime programmatically:

```javascript
/* ===== STARTUP CHIME ===== */
var startupSoundEnabled = false;
function toggleStartupSound() {
  startupSoundEnabled = !startupSoundEnabled;
  localStorage.setItem('startup-sound', startupSoundEnabled ? '1' : '');
  var btn = document.getElementById('sound-toggle');
  if (btn) btn.style.fontWeight = startupSoundEnabled ? 'bold' : 'normal';
  if (startupSoundEnabled) playChime();
}
function playChime() {
  try {
    var ctx = new (window.AudioContext || window.webkitAudioContext)();
    var notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach(function(freq, i) {
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.8);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.12);
      osc.stop(ctx.currentTime + i * 0.12 + 0.8);
    });
  } catch(e) {}
}
```

In init, add: `startupSoundEnabled = !!localStorage.getItem('startup-sound'); if (startupSoundEnabled) { document.addEventListener('click', function ch() { playChime(); document.removeEventListener('click', ch); }, {once:true}); }`

- [ ] **Step 2: Verify**

Toggle startup sound in Appearance. On next page load, after first click (required by browser autoplay policy), a short ascending chime plays.

---

### Task 5: Theme-Specific Boot Screens

Boot animation uses OS-appropriate colors and logos instead of always-black.

**Files:**
- Modify: `/Users/micahbos/resume/index.html` (JS section)

- [ ] **Step 1: Update bootLabels and switchTheme**

Replace the `bootLabels` object and update the `switchTheme` function:

```javascript
var bootConfig = {
  mac7: { bg: '#c0c0c0', fg: '#000', logo: 'Macintosh', sub: '' },
  mac9: { bg: '#e0e0e0', fg: '#000', logo: 'Mac OS 9', sub: '' },
  win31: { bg: '#000080', fg: '#fff', logo: 'Microsoft Windows', sub: 'Version 3.1' },
  winxp: { bg: '#000', fg: '#fff', logo: 'Windows XP', sub: 'Professional' },
  aqua: { bg: '#333', fg: '#fff', logo: '\uF8FF', sub: 'Mac OS X' },
  beos: { bg: '#336698', fg: '#fff', logo: 'Be', sub: 'Preparing the desktop' }
};
```

In `switchTheme`, set `overlay.style.background = cfg.bg; overlay.style.color = cfg.fg;` and use `cfg.logo` / `cfg.sub` for the content.

- [ ] **Step 2: Verify**

Switch to Windows XP - boot screen should be black with white text. Switch to Mac 7 - gray with black text. Switch to Win 3.1 - navy blue with white.

---

### Task 6: Right-Click Context Menu

Right-clicking the desktop shows a context menu with "Change Wallpaper", "About this Resume", "View Source".

**Files:**
- Modify: `/Users/micahbos/resume/index.html`

- [ ] **Step 1: Add context menu CSS**

```css
/* ===== CONTEXT MENU ===== */
#context-menu {
  display: none; position: fixed; z-index: 10002;
  background: var(--menubar-bg, #fff); border: 1px solid var(--menubar-border, #000);
  box-shadow: 2px 2px 6px rgba(0,0,0,0.3); padding: 2px 0; min-width: 180px;
}
#context-menu.visible { display: block; }
.ctx-item { padding: 3px 16px; font-size: 12px; cursor: default; }
.ctx-item:hover { background: var(--selection-bg); color: var(--selection-text); }
.ctx-sep { border-top: 1px solid var(--divider); margin: 2px 0; }
```

- [ ] **Step 2: Add context menu HTML**

After `<div id="crt-overlay"></div>`, add:

```html
<div id="context-menu">
  <div class="ctx-item" onclick="randomWallpaper(); hideCtx();">Change Wallpaper</div>
  <div class="ctx-item" onclick="openWin('themes'); hideCtx();">Appearance...</div>
  <div class="ctx-sep"></div>
  <div class="ctx-item" onclick="showEasterEgg(); hideCtx();">About This Resume</div>
  <div class="ctx-sep"></div>
  <div class="ctx-item" onclick="window.open('view-source:' + location.href); hideCtx();">View Source</div>
</div>
```

- [ ] **Step 3: Add context menu JS**

```javascript
document.getElementById('desktop').addEventListener('contextmenu', function(e) {
  if (e.target.closest('.window') || e.target.closest('.icon-column') || e.target.closest('#menubar')) return;
  e.preventDefault();
  var menu = document.getElementById('context-menu');
  menu.style.left = e.clientX + 'px'; menu.style.top = e.clientY + 'px';
  menu.classList.add('visible');
});
document.addEventListener('click', function() { hideCtx(); });
function hideCtx() { document.getElementById('context-menu').classList.remove('visible'); }
```

- [ ] **Step 4: Verify**

Right-click on empty desktop area. Context menu appears at cursor with correct theme styling.

---

### Task 7: Easter Egg - "About This Resume"

A hidden dialog accessible via right-click or typing "about" on the desktop.

**Files:**
- Modify: `/Users/micahbos/resume/index.html`

- [ ] **Step 1: Add Easter egg window HTML**

Add a new window after the Themes window:

```html
<div class="window" id="win-easter" style="width:380px; height:auto;">
  <div class="titlebar" onmousedown="startDrag(event, 'easter')">
    <div class="closebox" onclick="closeWin('easter')"></div>
    <div class="titlebar-lines"></div>
    <div class="titlebar-title">About This Resume</div>
  </div>
  <div class="win-body" style="text-align:center;">
    <div style="font-size:18px;font-weight:bold;margin-bottom:4px;">Retro OS Resume</div>
    <div style="font-size:12px;margin-bottom:12px;opacity:0.7;">Version 1.0</div>
    <div style="font-size:12px;line-height:1.6;margin-bottom:12px;">
      Built entirely in a single HTML file.<br>
      6 authentic OS themes. 20 Unsplash wallpapers.<br>
      No frameworks. No build tools. Just markup.
    </div>
    <div style="font-size:11px;opacity:0.6;">
      Designed by Micah Boswell<br>
      Built with Claude Code<br>
      conscious-shell.com
    </div>
  </div>
  <div class="win-resize" onmousedown="startResize(event, 'easter')"></div>
</div>
```

- [ ] **Step 2: Add Easter egg JS triggers**

```javascript
function showEasterEgg() { openWin('easter'); }
var easterBuf = '';
document.addEventListener('keydown', function(e) {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
  if (document.querySelector('.window.open:focus-within')) return;
  easterBuf += e.key.toLowerCase();
  if (easterBuf.length > 10) easterBuf = easterBuf.slice(-10);
  if (easterBuf.endsWith('about')) { showEasterEgg(); easterBuf = ''; }
});
```

- [ ] **Step 3: Verify**

Type "about" on the desktop (no window focused). Easter egg dialog should appear. Also accessible via right-click > "About This Resume".

---

### Task 8: Typing Animation in Ask Micah

Answers type out character by character instead of appearing instantly.

**Files:**
- Modify: `/Users/micahbos/resume/index.html` (JS section)

- [ ] **Step 1: Replace askMicah and askRole response rendering**

```javascript
function typeText(el, text, speed) {
  el.innerHTML = '';
  el.style.display = 'block';
  var i = 0;
  function tick() {
    if (i < text.length) {
      el.textContent += text[i]; i++;
      setTimeout(tick, speed || 12);
    }
  }
  tick();
}
```

Modify `askMicah`:
```javascript
function askMicah(idx) {
  var el = document.getElementById('ask-answer');
  if (!el || !askAnswers[idx]) return;
  el.innerHTML = '';
  el.style.display = 'block';
  setTimeout(function() { typeText(el, askAnswers[idx], 15); }, 200);
}
```

Modify `askRole`:
```javascript
function askRole(key, idx) {
  var qa = QA[key]; if (!qa || !qa[idx]) return;
  var el = document.getElementById('ans-' + key); if (!el) return;
  el.innerHTML = '';
  setTimeout(function() { typeText(el, qa[idx].a, 12); }, 200);
}
```

- [ ] **Step 2: Verify**

Click an Ask Micah pill. Text should type out character by character at ~12ms per character.

---

### Task 9: Status Bar in Career + Projects Windows

Shows item count at the bottom of list windows, like a real file browser.

**Files:**
- Modify: `/Users/micahbos/resume/index.html`

- [ ] **Step 1: Add status bar CSS**

```css
/* ===== STATUS BAR ===== */
.win-status {
  height: 18px; border-top: 1px solid var(--divider);
  padding: 0 8px; font-size: 11px; display: flex; align-items: center;
  opacity: 0.7; flex-shrink: 0;
  background: var(--win-bg);
}
```

- [ ] **Step 2: Add status bar HTML**

In the Career window, after `</div><!-- .win-body -->` and before the resize grip, add:

```html
<div class="win-status">9 roles</div>
```

In the Projects window:

```html
<div class="win-status">6 projects</div>
```

- [ ] **Step 3: Verify**

Open Career and Projects windows. Each should show a thin status bar at the bottom with item count.

---

### Task 10: Keyboard Shortcut Tooltips in Theme Menu

Show keyboard shortcuts next to menu items.

**Files:**
- Modify: `/Users/micahbos/resume/index.html`

- [ ] **Step 1: Add tooltip CSS**

```css
.menu-dd-shortcut { float: right; opacity: 0.5; margin-left: 24px; font-size: 11px; }
```

- [ ] **Step 2: Update Theme dropdown HTML**

Add shortcut spans to each theme menu item:

```html
<div class="menu-dd-item" onclick="switchTheme('mac7')">Mac OS 7<span class="menu-dd-shortcut">Cmd+1</span></div>
<!-- ... through Cmd+6 for BeOS -->
```

Add to File dropdown items:
```html
<div class="menu-dd-item" onclick="window.print()">Print...<span class="menu-dd-shortcut">Cmd+P</span></div>
```

- [ ] **Step 3: Verify**

Open Theme dropdown. Each item should show its keyboard shortcut right-aligned in lighter text.

---

### Task 11: Trash Can Icon + Visited Icon State

Adds a Trash icon to the desktop and dims icons of windows that have been opened.

**Files:**
- Modify: `/Users/micahbos/resume/index.html`

- [ ] **Step 1: Add visited CSS**

```css
.desktop-icon.visited .icon-graphic { opacity: 0.75; }
```

- [ ] **Step 2: Add Trash icon SVG to icon column**

At the bottom of the icon column, add:

```html
<div class="desktop-icon icon-trash" style="margin-top:auto;">
  <div class="icon-graphic">
    <svg viewBox="0 0 48 48">
      <path d="M14 14h20v28H14z" fill="var(--ic-win)" stroke="var(--ic-win-stroke)" stroke-width="2"/>
      <rect x="10" y="10" width="28" height="4" rx="1" fill="var(--ic-win)" stroke="var(--ic-win-stroke)" stroke-width="2"/>
      <rect x="18" y="6" width="12" height="5" rx="1" fill="var(--ic-win)" stroke="var(--ic-win-stroke)" stroke-width="1.5"/>
      <line x1="20" y1="18" x2="20" y2="38" stroke="var(--ic-win-stroke)" stroke-width="1.5" opacity="0.4"/>
      <line x1="24" y1="18" x2="24" y2="38" stroke="var(--ic-win-stroke)" stroke-width="1.5" opacity="0.4"/>
      <line x1="28" y1="18" x2="28" y2="38" stroke="var(--ic-win-stroke)" stroke-width="1.5" opacity="0.4"/>
    </svg>
  </div>
  <div class="icon-label">Trash</div>
</div>
```

- [ ] **Step 3: Add visited state to openWin**

In the `openWin` function, add after `el.classList.add('open')`:

```javascript
var icon = document.querySelector('.icon-' + id);
if (icon) icon.classList.add('visited');
```

- [ ] **Step 4: Adjust icon column for trash at bottom**

Change `.icon-column` CSS to add `height: calc(100vh - 36px);` so the trash icon can use `margin-top: auto` to stick to the bottom.

- [ ] **Step 5: Verify**

Trash appears at bottom-right of desktop. After opening About, the About icon dims slightly.

---

### Task 12: Mobile Responsive

On narrow screens, show a simplified list view instead of the desktop.

**Files:**
- Modify: `/Users/micahbos/resume/index.html`

- [ ] **Step 1: Add mobile CSS inside the print media query section**

```css
@media (max-width: 640px) {
  #desktop { overflow-y: auto; overflow-x: hidden; }
  .icon-column { display: none; }
  #menubar { position: sticky; }
  .window {
    position: static !important; display: block !important;
    width: 100% !important; max-height: none !important;
    border-radius: 0 !important; margin: 0; box-shadow: none !important;
    border-left: none !important; border-right: none !important;
  }
  .window + .window { border-top: none; }
  .titlebar { cursor: pointer; border-radius: 0 !important; }
  .closebox { display: none; }
  .win-body { padding: 12px 16px; }
  .boot-overlay { display: none !important; }
  #crt-overlay { display: none !important; }
  #context-menu { display: none !important; }
  .titlebar-title { position: static; transform: none; background: transparent !important; }
  [data-os="beos"] .window { margin-top: 0; }
  [data-os="beos"] .titlebar { width: 100%; margin: 0; }
}
```

- [ ] **Step 2: Add mobile JS to show all windows**

In init, add:

```javascript
if (window.innerWidth <= 640) {
  ['about','career','projects','contact','ask'].forEach(function(id) {
    document.getElementById('win-' + id).classList.add('open');
  });
}
```

- [ ] **Step 3: Verify**

Resize preview to narrow width. All windows should stack vertically like a single-column document.

---

### Task 13: prefers-color-scheme Auto-Theme

Auto-selects Aqua (dark desktop) or Mac OS 7 (light desktop) based on system preference.

**Files:**
- Modify: `/Users/micahbos/resume/index.html` (JS init section)

- [ ] **Step 1: Add auto-theme detection in init**

Before `openWin('about')` in the init block:

```javascript
if (!saved) {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    setTheme('aqua');
  }
}
```

- [ ] **Step 2: Verify**

Clear localStorage, set system to dark mode, reload. Should default to Aqua instead of Mac 7.

---

### Task 14: Spanish Version Toggle

Adds "Espanol" to the menu bar that swaps all visible text to Spanish.

**Files:**
- Modify: `/Users/micahbos/resume/index.html`

- [ ] **Step 1: Add translations object in JS**

```javascript
var translations = {
  en: { title: 'Lead Product Designer', thesis: 'I turn complex systems into things people can actually use. Right now that means AI agents that manage AT&T\'s network infrastructure.',
    contact: 'CONTACT', capabilities: 'CAPABILITIES', background: 'BACKGROUND',
    also1: 'Spanish fluent (raised in Lima, Peru).', also2: 'Mentored 47 designers.',
    also3: 'Author of Data-Driven Design.', also4: 'Education: Hardin-Simmons BA, Samford.' },
  es: { title: 'Disenador Principal de Producto', thesis: 'Convierto sistemas complejos en cosas que la gente puede usar. Ahora mismo eso significa agentes de IA que gestionan la infraestructura de red de AT&T.',
    contact: 'CONTACTO', capabilities: 'COMPETENCIAS', background: 'FORMACION',
    also1: 'Espanol fluido (criado en Lima, Peru).', also2: '47 disenadores mentoreados.',
    also3: 'Autor de Data-Driven Design.', also4: 'Educacion: Hardin-Simmons BA, Samford.' }
};
var currentLang = 'en';
function toggleLang() {
  currentLang = currentLang === 'en' ? 'es' : 'en';
  var t = translations[currentLang];
  document.querySelector('.about-title').textContent = t.title;
  document.querySelector('.about-thesis').textContent = t.thesis;
  var sections = document.querySelectorAll('.about-section-title');
  if (sections[0]) sections[0].textContent = t.contact;
  if (sections[1]) sections[1].textContent = t.capabilities;
  if (sections[2]) sections[2].textContent = t.background;
  var ps = document.querySelectorAll('#win-about .about-section:last-child p');
  if (ps[0]) ps[0].textContent = t.also1;
  if (ps[1]) ps[1].textContent = t.also2;
  if (ps[2]) ps[2].textContent = t.also3;
  if (ps[3]) ps[3].textContent = t.also4;
  document.getElementById('lang-toggle').textContent = currentLang === 'en' ? 'ES' : 'EN';
}
```

- [ ] **Step 2: Add language toggle to menu bar**

After the clock div in the menubar HTML, add:

```html
<div class="menu-item" onclick="toggleLang()" id="lang-toggle" style="font-size:11px;">ES</div>
```

- [ ] **Step 3: Verify**

Click "ES" in menu bar. About window text switches to Spanish. Click again to switch back to "EN".

---

### Task 15: PDF Export in File Menu

Adds "Download PDF" to the File dropdown that triggers print-to-PDF.

**Files:**
- Modify: `/Users/micahbos/resume/index.html`

- [ ] **Step 1: Already have Print in File menu**

Just rename the existing "Print..." item and add PDF context:

```html
<div class="menu-dd-item" onclick="exportPDF()">Save as PDF...<span class="menu-dd-shortcut">Cmd+P</span></div>
```

- [ ] **Step 2: Add exportPDF function**

```javascript
function exportPDF() {
  var allWins = ['about','career','projects','contact'];
  allWins.forEach(function(id) { document.getElementById('win-' + id).classList.add('open'); });
  setTimeout(function() { window.print(); }, 100);
}
```

- [ ] **Step 3: Verify**

File > Save as PDF opens print dialog with all content windows visible.

---

### Task 16: "Rebuild Desktop" Easter Egg

Accessible by typing "rebuild" on the desktop. Shows a fake progress dialog.

**Files:**
- Modify: `/Users/micahbos/resume/index.html`

- [ ] **Step 1: Add to the easter egg key buffer handler**

Extend the existing keydown easter egg handler:

```javascript
if (easterBuf.endsWith('rebuild')) {
  easterBuf = '';
  var overlay = document.createElement('div');
  overlay.className = 'boot-overlay';
  overlay.innerHTML = '<div style="font-size:14px;margin-bottom:12px;">Rebuilding Desktop...</div>' +
    '<div class="boot-bar"><div class="boot-fill"></div></div>' +
    '<div style="margin-top:8px;font-size:11px;opacity:0.5;">Indexing 126 products...</div>';
  document.body.appendChild(overlay);
  requestAnimationFrame(function() { overlay.querySelector('.boot-fill').style.width = '100%'; });
  setTimeout(function() { overlay.classList.add('fade'); setTimeout(function() { overlay.remove(); }, 400); }, 2500);
}
```

- [ ] **Step 2: Verify**

Type "rebuild" on the desktop. Fake progress bar appears for ~2.5 seconds then fades.

---

### Task 17: Final Polish Pass

Verify all 20 features work together, fix any conflicts, commit.

- [ ] **Step 1: Reload and test each feature**

1. Page loads with clock in menu bar
2. Theme switch shows boot animation with correct OS colors
3. CRT toggle works in Appearance
4. Sound toggle works
5. Window resize from corner
6. Shadow lifts on drag
7. Window zoom animation on open
8. Icon bounces on double-click
9. Accordion indicators rotate
10. Typing animation in Ask Micah
11. Status bars in Career/Projects
12. Right-click context menu on desktop
13. Easter egg via "about" typing
14. "Rebuild" easter egg
15. Trash icon at bottom of column
16. Visited icon dimming
17. Keyboard shortcuts + tooltips
18. Spanish toggle
19. PDF export
20. Mobile responsive (narrow viewport)
21. Dark mode auto-theme

- [ ] **Step 2: Save session handoff**

Update `/Users/micahbos/.claude/projects/-Users-micahbos-vault-daemon/memory/session_handoff.md` with current state.

---

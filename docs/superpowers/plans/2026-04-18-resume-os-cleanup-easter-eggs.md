# Resume OS Cleanup, Culture Layer & After Dark Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Clean up the 2291-line single-file resume OS, layer it with obscure 80s/90s culture (song lyrics, D&D, old games) as code comments and interactive easter eggs, then build two After Dark screensaver modules (Flying Toasters and Cyberhacker).

**Architecture:** All code lives in one `index.html`. We add clearly-marked comment sections to partition CSS and JS, plant culture comments throughout, inject a `<div id="screensaver-overlay">` for canvas-based screensavers, and wire easter egg triggers through a single `EasterEggEngine` object that handles keyboard sequences, idle detection, and screensaver rendering.

**Tech Stack:** Vanilla JS (no dependencies), HTML5 Canvas for screensavers, CSS animations for toaster/toast sprites, existing localStorage for state.

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `index.html` lines 17-860 | Modify | Add CSS section headers, screensaver CSS, toaster sprite CSS |
| `index.html` lines 861-1185 | Modify | Add `#screensaver-overlay` div with canvas |
| `index.html` lines 1186-2291 | Modify | Add culture comments, `EasterEggEngine`, screensaver modules |

No new files. No build step. Single-file stays single-file.

---

### Task 1: CSS Section Headers + Culture Comments

**Files:**
- Modify: `index.html` lines 17-860 (CSS block)

Add clearly-labeled section comment headers throughout the CSS block. Each header gets a thematic one-liner from obscure 80s/90s culture. These are invisible to users - pure developer flavor.

- [ ] **Step 1: Open the file and identify major CSS regions**

Run: `grep -n "/\* " ~/projects/resume-os/index.html | head -40`

Look for existing comment landmarks. Map which line ranges cover: reset/base, variables, desktop/wallpaper, taskbar/menubar, windows, icons, themes (mac7, mac9, win31, winxp, aqua, beos), animations, utilities.

- [ ] **Step 2: Insert CSS section headers**

For each region identified, add a comment block above it. Use this exact format - one line, one lyric, no multi-line blocks:

```css
/* ============================================================
   BASE RESET - "Don't you forget about me" - Simple Minds, 1985
   ============================================================ */

/* ============================================================
   CSS VARIABLES - "Everybody wants to rule the world" - Tears for Fears, 1985
   ============================================================ */

/* ============================================================
   DESKTOP / WALLPAPER - "Take on me" - a-ha, 1985
   ============================================================ */

/* ============================================================
   TASKBAR / MENUBAR - "She drives me crazy" - Fine Young Cannibals, 1988
   ============================================================ */

/* ============================================================
   WINDOW CHROME - "I'm still standing" - Elton John, 1983
   ============================================================ */

/* ============================================================
   ICON GRID - "Safety Dance" - Men Without Hats, 1982
   ============================================================ */

/* ============================================================
   THEME: MAC OS 7 - Natural 20 on the saving throw vs. bad gradients
   ============================================================ */

/* ============================================================
   THEME: MAC OS 9 - "You unlock this door with the key of imagination..." - Twilight Zone intro, 1959 (yes it counts)
   ============================================================ */

/* ============================================================
   THEME: WINDOWS 3.1 - "Wang Chung tonight. Everybody Wang Chung tonight." - Wang Chung, 1986
   ============================================================ */

/* ============================================================
   THEME: WINDOWS XP - "It's the end of the world as we know it" - R.E.M., 1987
   ============================================================ */

/* ============================================================
   THEME: AQUA - "She blinded me with science" - Thomas Dolby, 1982
   ============================================================ */

/* ============================================================
   THEME: BEOS - "We're not gonna take it" - Twisted Sister, 1984
   ============================================================ */

/* ============================================================
   ANIMATIONS - "Come on Eileen" - Dexys Midnight Runners, 1982
   ============================================================ */

/* ============================================================
   SCREENSAVER OVERLAY - It was dark. You are likely to be eaten by a grue. (Zork, 1980)
   ============================================================ */
```

Edit each section header into place using the Edit tool. Target each exact region start based on your grep results from Step 1.

- [ ] **Step 3: Verify no CSS was broken**

Run: Open `file:///Users/micahbos/projects/resume-os/index.html` in browser and confirm all six themes still load without visual regression. Spot-check mac7, win31, beos.

- [ ] **Step 4: Commit**

```bash
cd ~/projects/resume-os
git add index.html
git commit -m "style: add CSS section headers with 80s/90s culture comments"
```

---

### Task 2: JS Section Headers + Culture Comments

**Files:**
- Modify: `index.html` lines 1186-2291 (JS block)

Same approach as CSS - identify major JS regions and plant one-liner culture comments. These appear as inline comments beside code or as section headers.

- [ ] **Step 1: Map major JS regions**

Run: `grep -n "^  function\|^function\|// ==\|// ---\|const \|let \|var " ~/projects/resume-os/index.html | grep -A0 "^[0-9]*:" | awk -F: '$1 > 1185 {print}' | head -60`

Identify: init/DOMContentLoaded, theme functions (setTheme, swapIcons), window management (openWin, closeWin, bounceAndOpen), clock, typewriter/QA, utility functions.

- [ ] **Step 2: Insert JS culture comments**

Add these inline comments at function definitions. Format: `// [lyric or reference] - [source]`

```javascript
// "Start me up" - Rolling Stones, 1981
// If you start me up / I'll never stop
function init() {

// "Everybody wants to rule the world" - Tears for Fears, 1985
// THAC0: 7. Armor Class of current OS theme: -3 (heavily armored)
function setTheme(os) {

// "I want to break free" - Queen, 1984
// Saving throw vs. icon corruption: rolled 18. Success.
function swapIcons(os) {

// "Open Arms" - Journey, 1981
// >OPEN WINDOW. You are in a maze of twisty little dialogs, all alike.
function openWin(id) {

// "Don't close your eyes" - Kix, 1988
// Or do. We'll be here when you get back.
function closeWin(id) {

// "You make my dreams come true" - Hall & Oates, 1981
// Bounce animation: +2 to morale. Duration: 400ms or until IDDQD is entered.
function bounceAndOpen(iconEl, id) {

// "Rock around the clock" - Bill Haley, 1954 (it counts, fight me)
// The clock in the menubar uses Tolkien time. JK. It's your system clock.
function updateClock() {

// "The typewriter" - Leroy Anderson, 1950 (absolutely counts)
// Clatter clatter. Words appearing from the void. Roll for initiative.
function startTypewriter() {
```

Edit each into place using the Edit tool. Use the function signatures as anchors for `old_string`.

- [ ] **Step 3: Add D&D and game references in logic blocks**

Find these specific logic moments and insert a one-liner comment just above:

```javascript
// Natural 20. The icon bounces perfectly.
// "You have died of dysentery." - Oregon Trail, 1971 (just checking if you're reading)
// IDDQD - Doom godmode cheat, 1993. You didn't type it yet.
// >GET LAMP - You're carrying it. (Zork, 1980)
// Konami Code not yet entered. +30 lives pending.
// Roll for charisma: theme selector determines your social standing
```

Place these as single-line comments in appropriate JS blocks based on code context found in Step 1.

- [ ] **Step 4: Commit**

```bash
cd ~/projects/resume-os
git add index.html
git commit -m "chore: add JS culture comments - D&D, Zork, Doom, 80s lyrics"
```

---

### Task 3: Screensaver HTML + CSS Shell

**Files:**
- Modify: `index.html` HTML section (~lines 861-1185)
- Modify: `index.html` CSS section (~lines 17-860)

Add the screensaver overlay div and its CSS before any JS is written.

- [ ] **Step 1: Add screensaver overlay to HTML**

Find the closing `</body>` tag and insert just before it:

```html
<!-- After Dark tribute screensaver overlay -->
<!-- "Computer, enhance." - every 80s movie ever -->
<div id="screensaver-overlay" style="display:none" aria-hidden="true">
  <canvas id="screensaver-canvas"></canvas>
  <div id="screensaver-label"></div>
</div>
```

Use the Edit tool with `old_string` of `</body>` to insert above it.

- [ ] **Step 2: Add screensaver CSS**

Find the screensaver CSS section header added in Task 1. Add this block immediately after it:

```css
#screensaver-overlay {
  position: fixed;
  inset: 0;
  z-index: 99999;
  background: #000;
  cursor: none;
}

#screensaver-canvas {
  width: 100%;
  height: 100%;
  display: block;
}

#screensaver-label {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  color: #333;
  font-family: monospace;
  font-size: 11px;
  letter-spacing: 2px;
  text-transform: uppercase;
  pointer-events: none;
}

/* Flying Toaster sprite - pure CSS chrome wings */
.toaster-sprite {
  position: absolute;
  pointer-events: none;
  image-rendering: pixelated;
}
```

- [ ] **Step 3: Verify overlay is hidden by default**

Open `file:///Users/micahbos/projects/resume-os/index.html` in browser. Confirm no black overlay appears on load. Open DevTools console and run `document.getElementById('screensaver-overlay').style.display = 'block'` - confirm full-screen black canvas appears. Run `document.getElementById('screensaver-overlay').style.display = 'none'` to dismiss.

- [ ] **Step 4: Commit**

```bash
cd ~/projects/resume-os
git add index.html
git commit -m "feat: add screensaver overlay HTML/CSS shell"
```

---

### Task 4: EasterEggEngine - Core + Keyboard Sequence Detection

**Files:**
- Modify: `index.html` JS section (add before closing `</script>` tag)

The engine handles: sequence detection, idle timer, screensaver dispatch, and dismissal. All easter eggs funnel through this object.

- [ ] **Step 1: Write the failing test (manual)**

Open browser console on the resume page. Paste this test harness:

```javascript
// Manual test: sequence detection
const testSeq = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let matched = 0;
testSeq.forEach((k, i) => {
  // Simulate: does our buffer match?
  console.log(`Key ${i}: ${k}`);
});
console.log('Test harness ready - will run after engine is injected');
```

Expected: No errors, just logs. This confirms the console is clean before injection.

- [ ] **Step 2: Add EasterEggEngine to index.html**

Find the closing `</script>` tag and insert before it:

```javascript
// ============================================================
// EASTER EGG ENGINE
// "Shout, shout, let it all out" - Tears for Fears, 1985
// "You are in a maze of twisty little passages, all alike." - Zork, 1980
// Sequences: Konami ↑↑↓↓←→←→BA | "zork" | "iddqd" | "contra" | "dnukem"
// ============================================================

const EasterEggEngine = (() => {
  const SEQUENCES = {
    konami: ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'],
    zork:   ['z','o','r','k'],
    iddqd:  ['i','d','d','q','d'],
    contra: ['c','o','n','t','r','a'],
    dnukem: ['d','n','u','k','e','m'],
  };

  const IDLE_TIMEOUT_MS = 90000; // 90 seconds - "Don't you want me, baby?" - Human League, 1981

  let buffer = [];
  let idleTimer = null;
  let activeScreensaver = null;
  let animFrame = null;

  function resetIdle() {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => launchScreensaver('toasters'), IDLE_TIMEOUT_MS);
  }

  function checkSequences(key) {
    buffer.push(key);
    if (buffer.length > 12) buffer.shift();

    for (const [name, seq] of Object.entries(SEQUENCES)) {
      if (buffer.length >= seq.length) {
        const tail = buffer.slice(-seq.length);
        if (tail.every((k, i) => k === seq[i])) {
          buffer = [];
          handleSequence(name);
          return;
        }
      }
    }
  }

  function handleSequence(name) {
    // "I feel like a number" - Bob Seger, 1981
    // THAC0 calculation for easter egg triggers:
    //   konami = +30 lives. contra = god mode (same thing really).
    //   iddqd = Doom godmode. dnukem = "Hail to the king, baby." - Duke Nukem 3D, 1996
    //   zork = you are in the dark. obviously.
    switch (name) {
      case 'konami':
        showToast('↑↑↓↓←→←→BA — +30 LIVES GRANTED', '#ff0', 4000);
        break;
      case 'zork':
        showToast('It is pitch black. You are likely to be eaten by a grue.', '#0f0', 5000);
        break;
      case 'iddqd':
        showToast('IDDQD — Degreelessness mode on.', '#f00', 4000);
        break;
      case 'contra':
        showToast('CONTRA CODE ACCEPTED — Bill and Lance approve.', '#0ff', 4000);
        break;
      case 'dnukem':
        showToast('Hail to the king, baby. — Duke Nukem 3D, 1996', '#f80', 4000);
        break;
    }
  }

  function showToast(msg, color, duration) {
    // "Toast" - not an 80s lyric, but definitely an After Dark screensaver element
    const el = document.createElement('div');
    el.textContent = msg;
    el.style.cssText = `
      position:fixed; bottom:40px; left:50%; transform:translateX(-50%);
      background:#111; color:${color}; border:1px solid ${color};
      padding:10px 20px; font-family:monospace; font-size:13px;
      z-index:99998; pointer-events:none; border-radius:3px;
      box-shadow: 0 0 12px ${color}44;
    `;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), duration);
  }

  function launchScreensaver(type) {
    activeScreensaver = type;
    const overlay = document.getElementById('screensaver-overlay');
    const canvas = document.getElementById('screensaver-canvas');
    const label = document.getElementById('screensaver-label');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    overlay.style.display = 'block';

    if (type === 'toasters') {
      label.textContent = 'After Dark: Flying Toasters — Berkeley Systems, 1989';
      animFrame = requestAnimationFrame(renderToasters(canvas));
    } else if (type === 'cyberhacker') {
      label.textContent = 'After Dark: Cyberhacker — Green means go.';
      animFrame = requestAnimationFrame(renderCyberhacker(canvas));
    }
  }

  function dismissScreensaver() {
    if (!activeScreensaver) return;
    cancelAnimationFrame(animFrame);
    activeScreensaver = null;
    animFrame = null;
    const overlay = document.getElementById('screensaver-overlay');
    overlay.style.display = 'none';
    resetIdle();
  }

  function init() {
    // Keyboard listener: sequence detection
    document.addEventListener('keydown', (e) => {
      checkSequences(e.key);
      if (activeScreensaver) { dismissScreensaver(); return; }
      resetIdle();
    });

    // Mouse/touch: dismiss screensaver or reset idle
    document.addEventListener('mousemove', () => {
      if (activeScreensaver) dismissScreensaver();
      else resetIdle();
    });
    document.addEventListener('click', () => {
      if (activeScreensaver) dismissScreensaver();
    });
    document.addEventListener('touchstart', () => {
      if (activeScreensaver) dismissScreensaver();
      else resetIdle();
    });

    // Start idle timer
    resetIdle();
  }

  // Exposed for right-click menu and manual triggers
  return { init, launchScreensaver, dismissScreensaver, showToast };
})();

// Boot the engine
// "Start me up" - Rolling Stones, 1981
document.addEventListener('DOMContentLoaded', () => {
  EasterEggEngine.init();
});
```

- [ ] **Step 3: Verify sequence detection in console**

Open browser, open DevTools console. Type these keys in the page (not console): `↑ ↑ ↓ ↓ ← → ← → b a`

Expected: Gold toast notification appears at bottom: `↑↑↓↓←→←→BA — +30 LIVES GRANTED`

Then type: `z o r k`

Expected: Green toast: `It is pitch black. You are likely to be eaten by a grue.`

- [ ] **Step 4: Commit**

```bash
cd ~/projects/resume-os
git add index.html
git commit -m "feat: add EasterEggEngine with Konami, Zork, IDDQD, Contra, Duke Nukem sequences"
```

---

### Task 5: After Dark - Flying Toasters Screensaver

**Files:**
- Modify: `index.html` JS section (add `renderToasters` function before closing `</script>`)

Canvas-based toasters + toast flying diagonally across black screen, chrome-wing aesthetic, Berkeley Systems 1989.

- [ ] **Step 1: Write the toaster renderer**

Add this function immediately after the EasterEggEngine block:

```javascript
// ============================================================
// AFTER DARK: FLYING TOASTERS
// Berkeley Systems, 1989. One of the most iconic screensavers ever.
// "Heaven is a place on earth" - Belinda Carlisle, 1987
// Toasters fly diagonally. Toast pops. Wings flap. It's perfect.
// ============================================================

function renderToasters(canvas) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;

  // Toaster entity: position, speed, wing frame
  // "Fly like an eagle" - Steve Miller Band, 1976
  const toasters = [];
  const toastPieces = [];
  let frame = 0;

  function spawnToaster() {
    // Spawn from right edge or top edge, move down-left
    const fromTop = Math.random() > 0.5;
    toasters.push({
      x: fromTop ? Math.random() * W : W + 60,
      y: fromTop ? -60 : Math.random() * H * 0.4,
      speed: 1.5 + Math.random() * 2.5,
      wingFrame: 0,
      wingTimer: 0,
    });
  }

  function spawnToast() {
    const fromTop = Math.random() > 0.5;
    toastPieces.push({
      x: fromTop ? Math.random() * W : W + 40,
      y: fromTop ? -40 : Math.random() * H * 0.4,
      speed: 1.2 + Math.random() * 1.8,
      rotation: (Math.random() - 0.5) * 0.4,
    });
  }

  // Draw a pixel-art toaster with canvas paths
  // THAC0: 12. It can hit most forms of bread.
  function drawToaster(x, y, wingFrame) {
    ctx.save();
    ctx.translate(x, y);

    // Toaster body - chrome gray
    ctx.fillStyle = '#b8b8b8';
    ctx.fillRect(-20, -10, 40, 30);

    // Toaster slot
    ctx.fillStyle = '#333';
    ctx.fillRect(-8, -10, 16, 8);

    // Chrome highlight
    ctx.fillStyle = '#ddd';
    ctx.fillRect(-18, -8, 6, 26);

    // Lever knob
    ctx.fillStyle = '#888';
    ctx.fillRect(14, 5, 8, 5);

    // Wings - alternate between two frames
    ctx.fillStyle = '#999';
    if (wingFrame === 0) {
      // Wings up
      ctx.beginPath();
      ctx.moveTo(-20, -10);
      ctx.lineTo(-50, -30);
      ctx.lineTo(-30, -10);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(20, -10);
      ctx.lineTo(50, -30);
      ctx.lineTo(30, -10);
      ctx.closePath();
      ctx.fill();
    } else {
      // Wings mid-flap
      ctx.beginPath();
      ctx.moveTo(-20, 0);
      ctx.lineTo(-50, -15);
      ctx.lineTo(-30, 5);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(20, 0);
      ctx.lineTo(50, -15);
      ctx.lineTo(30, 5);
      ctx.closePath();
      ctx.fill();
    }

    // Wing feather detail
    ctx.strokeStyle = '#777';
    ctx.lineWidth = 1;
    if (wingFrame === 0) {
      ctx.beginPath(); ctx.moveTo(-40, -25); ctx.lineTo(-30, -12); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(40, -25); ctx.lineTo(30, -12); ctx.stroke();
    } else {
      ctx.beginPath(); ctx.moveTo(-40, -12); ctx.lineTo(-30, -2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(40, -12); ctx.lineTo(30, -2); ctx.stroke();
    }

    ctx.restore();
  }

  // Draw toast slice
  // "She's like the wind" - Patrick Swayze, 1987. Also toast drifts.
  function drawToast(x, y, rotation) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);

    // Bread body
    ctx.fillStyle = '#c8a46e';
    ctx.fillRect(-12, -16, 24, 32);

    // Toast gradient (browned corners)
    ctx.fillStyle = '#8b5e2e';
    ctx.fillRect(-12, -16, 24, 4);
    ctx.fillRect(-12, 12, 24, 4);

    // Crust sides
    ctx.fillStyle = '#a07040';
    ctx.fillRect(-12, -12, 3, 24);
    ctx.fillRect(9, -12, 3, 24);

    // Toast holes (like real toast)
    ctx.fillStyle = '#b89458';
    ctx.fillRect(-4, -8, 3, 3);
    ctx.fillRect(2, -2, 3, 3);
    ctx.fillRect(-6, 4, 3, 3);

    ctx.restore();
  }

  // Initial population
  for (let i = 0; i < 5; i++) spawnToaster();
  for (let i = 0; i < 3; i++) spawnToast();

  function tick() {
    if (document.getElementById('screensaver-overlay').style.display === 'none') return;

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, W, H);

    frame++;

    // Spawn new entities occasionally
    if (frame % 120 === 0 && toasters.length < 10) spawnToaster();
    if (frame % 180 === 0 && toastPieces.length < 6) spawnToast();

    // Update and draw toast
    for (let i = toastPieces.length - 1; i >= 0; i--) {
      const t = toastPieces[i];
      t.x -= t.speed;
      t.y += t.speed * 0.8;
      drawToast(t.x, t.y, t.rotation);
      if (t.x < -60 || t.y > H + 60) toastPieces.splice(i, 1);
    }

    // Update and draw toasters
    for (let i = toasters.length - 1; i >= 0; i--) {
      const t = toasters[i];
      t.x -= t.speed;
      t.y += t.speed * 0.75;
      t.wingTimer++;
      if (t.wingTimer > 8) { t.wingFrame = t.wingFrame === 0 ? 1 : 0; t.wingTimer = 0; }
      drawToaster(t.x, t.y, t.wingFrame);
      if (t.x < -80 || t.y > H + 80) toasters.splice(i, 1);
    }

    return requestAnimationFrame(tick);
  }

  return tick;
}
```

- [ ] **Step 2: Test Flying Toasters manually**

Open browser console on resume page. Run:

```javascript
EasterEggEngine.launchScreensaver('toasters');
```

Expected: Black screen fills viewport. Pixel-art chrome toasters with flapping wings fly diagonally from upper-right to lower-left. Toast slices drift alongside. Label reads `After Dark: Flying Toasters — Berkeley Systems, 1989`.

Click anywhere or press any key to dismiss.

- [ ] **Step 3: Commit**

```bash
cd ~/projects/resume-os
git add index.html
git commit -m "feat: After Dark Flying Toasters screensaver - canvas animation"
```

---

### Task 6: After Dark - Cyberhacker Screensaver

**Files:**
- Modify: `index.html` JS section (add `renderCyberhacker` function after `renderToasters`)

Green-on-black falling text matrix. CRT hacker aesthetic. Phosphor green columns of random characters streaming downward. Classic 80s-movie hacker terminal look.

- [ ] **Step 1: Write the Cyberhacker renderer**

Add this function immediately after `renderToasters`:

```javascript
// ============================================================
// AFTER DARK: CYBERHACKER
// Green-on-black falling code. Phosphor CRT. Hacker aesthetic.
// "Mr. Roboto" - Styx, 1983
// "I am the keymaster." - Ghostbusters, 1984
// "Shall we play a game?" - WarGames, 1983
// Roll for INT check to understand this code. DC: 8. You got this.
// ============================================================

function renderCyberhacker(canvas) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;

  const FONT_SIZE = 14;
  const COLS = Math.floor(W / FONT_SIZE);

  // Each column tracks its current Y position (in character units)
  // "One night in Bangkok" - Murray Head, 1984. Each column: one night.
  const drops = Array.from({ length: COLS }, () => Math.random() * -H / FONT_SIZE);

  // Character set: ASCII, digits, some D&D symbols for flavor
  // "Weird Science" - Oingo Boingo, 1985. These characters = weird science.
  // Natural 20: ⚔ included. Saving throw: d20. THAC0: undefined (we're hackers).
  const CHARS = 'アイウエオカキクケコサシスセソタチツテト0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%^&*()_+-=[]{}|;:,./<>?!~`\\d20⚔☯∞±√∫≈≠≡∑∏∂∇';

  // Column speeds - some faster, some slower
  const speeds = Array.from({ length: COLS }, () => 0.5 + Math.random() * 1.5);

  // Column brightness - leading char is bright white, trail fades
  // "Fade to black" - Metallica, 1984. Trail fades. Leading edge burns.
  const TRAIL_LENGTH = 20;

  let frame = 0;

  function tick() {
    if (document.getElementById('screensaver-overlay').style.display === 'none') return;

    // Phosphor persistence: don't fully clear, leave faint trail
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, W, H);

    frame++;

    for (let col = 0; col < COLS; col++) {
      const x = col * FONT_SIZE;
      const drop = drops[col];

      // Draw trail
      for (let t = 0; t < TRAIL_LENGTH; t++) {
        const y = (drop - t) * FONT_SIZE;
        if (y < 0 || y > H) continue;

        const alpha = 1 - t / TRAIL_LENGTH;
        if (t === 0) {
          // Leading character: bright white-green
          ctx.fillStyle = `rgba(180, 255, 180, ${alpha})`;
        } else if (t < 3) {
          // Near-top: bright green
          ctx.fillStyle = `rgba(0, 255, 70, ${alpha})`;
        } else {
          // Tail: dim green
          ctx.fillStyle = `rgba(0, 180, 40, ${alpha * 0.7})`;
        }

        ctx.font = `${FONT_SIZE}px monospace`;
        const char = CHARS[Math.floor(Math.random() * CHARS.length)];
        ctx.fillText(char, x, y);
      }

      // Advance drop
      drops[col] += speeds[col];

      // Reset when it reaches bottom (random point so columns stagger)
      if (drops[col] * FONT_SIZE > H + TRAIL_LENGTH * FONT_SIZE) {
        if (Math.random() > 0.975) {
          drops[col] = 0;
        }
      }
    }

    // Occasional "hacker message" flash in the middle
    // "You might think" - The Cars, 1984. You might think this is art. It is.
    if (frame % 600 === 0) {
      const messages = [
        'ACCESSING MAINFRAME...',
        'DECRYPTING...',
        '>_ WHO ARE YOU, STRANGER?',
        'ROLL FOR INITIATIVE',
        'NATURAL 20',
        'LOADING MICAH BOSWELL...',
        'IT IS PITCH BLACK',
        'IDDQD ENGAGED',
        '↑↑↓↓←→←→BA',
        'RESUME LOADED. BEGIN.',
        'WANG CHUNG TONIGHT',
        'YOU HAVE DIED OF DYSENTERY',
        'PRESS F TO PAY RESPECTS',
        '>GET LAMP',
      ];
      const msg = messages[Math.floor(Math.random() * messages.length)];
      ctx.font = 'bold 24px monospace';
      ctx.fillStyle = 'rgba(0, 255, 70, 0.9)';
      ctx.textAlign = 'center';
      ctx.fillText(msg, W / 2, H / 2);
      ctx.textAlign = 'left';
    }

    return requestAnimationFrame(tick);
  }

  return tick;
}
```

- [ ] **Step 2: Test Cyberhacker manually**

Open browser console. Run:

```javascript
EasterEggEngine.launchScreensaver('cyberhacker');
```

Expected: Black screen fills viewport. Green falling characters (katakana, ASCII, digits, D&D symbols) stream downward in columns with phosphor-glow persistence effect. Leading character is bright white-green. Every 600 frames (~10s) a message like `NATURAL 20` or `WANG CHUNG TONIGHT` flashes in the center. Label reads `After Dark: Cyberhacker — Green means go.`

Click or keypress to dismiss.

- [ ] **Step 3: Commit**

```bash
cd ~/projects/resume-os
git add index.html
git commit -m "feat: After Dark Cyberhacker screensaver - green phosphor falling text"
```

---

### Task 7: Screensaver Triggers - Idle, Right-Click, Keyboard

**Files:**
- Modify: `index.html` JS section (wire right-click menu and add `afterdark` keyboard sequence)

The engine already handles idle (90s) and any-key/click dismissal. This task wires: right-click context menu options and a keyboard sequence.

- [ ] **Step 1: Add right-click menu screensaver options**

Find the existing right-click context menu handler in the JS (search for `contextmenu` or `right-click`). If one exists, add screensaver items. If none exists, add a minimal one:

```javascript
// "You spin me right round" - Dead or Alive, 1985
// Right-click opens context menu. Ancient power. Like right-clicking in 1995.
document.addEventListener('contextmenu', (e) => {
  // Only intercept on desktop background, not on windows/icons
  if (e.target.closest('.window') || e.target.closest('.icon')) return;
  e.preventDefault();

  // Remove any existing context menu
  document.querySelector('.ctx-menu')?.remove();

  const menu = document.createElement('div');
  menu.className = 'ctx-menu';
  menu.style.cssText = `
    position:fixed; left:${e.clientX}px; top:${e.clientY}px;
    background:#c0c0c0; border:2px solid #fff;
    border-right-color:#000; border-bottom-color:#000;
    font-family:monospace; font-size:12px; z-index:99997;
    min-width:180px; box-shadow:2px 2px 0 #000;
  `;

  const items = [
    { label: '🍞 Flying Toasters', action: () => EasterEggEngine.launchScreensaver('toasters') },
    { label: '💻 Cyberhacker', action: () => EasterEggEngine.launchScreensaver('cyberhacker') },
    { label: '─────────────', action: null },
    { label: 'Get Info...', action: () => alert('resume-os v2.0\nA retro OS theme resume.\n\nEnter IDDQD for godmode.') },
  ];

  items.forEach(({ label, action }) => {
    const item = document.createElement('div');
    item.textContent = label;
    item.style.cssText = `
      padding:4px 12px; cursor:${action ? 'pointer' : 'default'};
      color:${label.startsWith('─') ? '#999' : '#000'};
    `;
    if (action) {
      item.addEventListener('mouseenter', () => { item.style.background = '#000080'; item.style.color = '#fff'; });
      item.addEventListener('mouseleave', () => { item.style.background = ''; item.style.color = '#000'; });
      item.addEventListener('click', () => { menu.remove(); action(); });
    }
    menu.appendChild(item);
  });

  document.body.appendChild(menu);
  setTimeout(() => document.addEventListener('click', () => menu.remove(), { once: true }), 0);
});
```

- [ ] **Step 2: Add `afterdark` keyboard sequence**

In the `SEQUENCES` object inside `EasterEggEngine`, add:

```javascript
afterdark: ['a','f','t','e','r','d','a','r','k'],
```

In the `handleSequence` switch, add:

```javascript
case 'afterdark':
  // "After Dark" - the only screensaver that mattered
  // "Everybody have fun tonight" - Wang Chung, 1986
  EasterEggEngine.launchScreensaver(Math.random() > 0.5 ? 'toasters' : 'cyberhacker');
  break;
```

- [ ] **Step 3: Verify right-click menu**

Open browser. Right-click on the desktop background (not on a window or icon). Expected: Win95-style context menu appears with `🍞 Flying Toasters` and `💻 Cyberhacker` items.

Click `Flying Toasters`. Expected: Toaster screensaver launches.

Dismiss. Right-click, click Cyberhacker. Expected: Matrix screensaver launches.

Dismiss. Type `afterdark` on keyboard. Expected: One of the two screensavers launches randomly.

- [ ] **Step 4: Commit**

```bash
cd ~/projects/resume-os
git add index.html
git commit -m "feat: screensaver triggers - right-click menu, 'afterdark' keyboard sequence"
```

---

### Task 8: Hidden Easter Egg - Rebuild Window

**Files:**
- Modify: `index.html` JS section

A hidden "Rebuild" easter egg: typing `rebuild` opens a terminal-style window with fake system rebuild output, D&D flavor, then a dramatic "SYSTEM ONLINE" finish. References an existing task in the prior plan (Task 9 of `2026-04-16-retro-os-enhancements.md`).

- [ ] **Step 1: Add `rebuild` to SEQUENCES**

In `EasterEggEngine`'s `SEQUENCES`:

```javascript
rebuild: ['r','e','b','u','i','l','d'],
```

- [ ] **Step 2: Add rebuild handler**

In `handleSequence` switch:

```javascript
case 'rebuild':
  triggerRebuild();
  break;
```

- [ ] **Step 3: Add triggerRebuild function**

Add after `EasterEggEngine`:

```javascript
// "Rebuild" easter egg
// "We built this city" - Starship, 1985 (the objectively worst song with the best egg)
// "We can rebuild him. We have the technology." - Six Million Dollar Man, 1974
// D&D reference: You roll to rebuild. Natural 20. The city rises.
function triggerRebuild() {
  const win = document.createElement('div');
  win.style.cssText = `
    position:fixed; left:50%; top:50%; transform:translate(-50%,-50%);
    width:480px; background:#000; border:2px solid #0f0;
    font-family:monospace; font-size:12px; color:#0f0;
    z-index:99996; box-shadow:0 0 20px #0f04;
    padding:0;
  `;

  const titleBar = document.createElement('div');
  titleBar.style.cssText = 'background:#0f0; color:#000; padding:2px 8px; font-weight:bold; cursor:move; display:flex; justify-content:space-between;';
  titleBar.innerHTML = '<span>Terminal — rebuild.sh</span><span style="cursor:pointer" id="rebuild-close">✕</span>';
  win.appendChild(titleBar);

  const output = document.createElement('div');
  output.style.cssText = 'padding:12px; min-height:200px; max-height:320px; overflow:hidden;';
  win.appendChild(output);

  document.body.appendChild(win);
  document.getElementById('rebuild-close').addEventListener('click', () => win.remove());

  const lines = [
    '> ./rebuild.sh',
    'Initializing rebuild sequence...',
    'Rolling for INT check... d20... Natural 20. Proceeding.',
    'Loading core modules: [████████████████] 100%',
    'Compiling CSS: "Safety Dance" theme engine... OK',
    'Injecting 80s nostalgia layer... OK',
    'THAC0 calibration: -4 (excellent armor class)',
    'Easter egg registry: KONAMI, ZORK, IDDQD, CONTRA, DNUKEM, AFTERDARK, REBUILD',
    'After Dark module: Flying Toasters... ARMED',
    'After Dark module: Cyberhacker... ARMED',
    'Checking for grue... none detected.',
    '>GET LAMP. You are carrying it.',
    'Saving throw vs. boredom: 18. Success.',
    '"We built this city on rock and roll." — Starship, 1985',
    'All systems nominal.',
    '',
    '██████████████████████████████',
    '   SYSTEM ONLINE. BEGIN.',
    '██████████████████████████████',
  ];

  let i = 0;
  const interval = setInterval(() => {
    if (i >= lines.length) { clearInterval(interval); return; }
    const line = document.createElement('div');
    line.textContent = lines[i];
    if (lines[i].startsWith('█') || lines[i].includes('SYSTEM ONLINE')) {
      line.style.color = '#0ff';
      line.style.fontWeight = 'bold';
    }
    output.appendChild(line);
    i++;
  }, 150);
}
```

- [ ] **Step 4: Verify rebuild easter egg**

Type `rebuild` in the browser. Expected: Terminal window appears center-screen with green-on-black text, lines print one-by-one at 150ms intervals: rebuild log with D&D references, Zork, song lyrics, culminates in `SYSTEM ONLINE. BEGIN.` in cyan bold. Clicking ✕ closes it.

- [ ] **Step 5: Commit**

```bash
cd ~/projects/resume-os
git add index.html
git commit -m "feat: 'rebuild' easter egg - terminal rebuild sequence with D&D and 80s flavor"
```

---

### Task 9: Final Polish + README Update

**Files:**
- Modify: `index.html` (minor)
- Modify: `README.md` (add easter egg hints)

- [ ] **Step 1: Add idle timeout hint to About window**

Find the About window content in the HTML. Add a tiny hint at the bottom:

```html
<p style="font-size:10px;color:#666;margin-top:16px;font-family:monospace">
  [system v2.0 — try the konami code]
</p>
```

- [ ] **Step 2: Update README with easter egg section**

In `README.md`, add a new section:

```markdown
## Easter Eggs

The resume OS has several hidden features:

- **Konami Code** — ↑↑↓↓←→←→BA
- **Zork** — type `zork`
- **Doom** — type `iddqd`
- **Contra** — type `contra`
- **Duke Nukem** — type `dnukem`
- **After Dark** — type `afterdark` or right-click the desktop
- **Rebuild** — type `rebuild`
- **Idle** — wait 90 seconds

After Dark screensavers: Flying Toasters (Berkeley Systems, 1989) and Cyberhacker.
```

- [ ] **Step 3: Smoke test all easter eggs end-to-end**

Load `file:///Users/micahbos/projects/resume-os/index.html`. Test each in order:

| Sequence | Expected |
|----------|----------|
| `↑↑↓↓←→←→ba` | Gold toast: `+30 LIVES GRANTED` |
| `zork` | Green toast: grue warning |
| `iddqd` | Red toast: degreelessness mode |
| `contra` | Cyan toast: Bill and Lance |
| `dnukem` | Orange toast: Hail to the king |
| `afterdark` | Random screensaver launches |
| `rebuild` | Terminal window with rebuild log |
| Right-click desktop | Context menu with screensaver items |
| Click Flying Toasters | Toasters screensaver |
| Click Cyberhacker | Matrix screensaver |
| 90s idle | Flying Toasters auto-launches |
| Any key / click during screensaver | Screensaver dismisses |

Fix any failures before proceeding.

- [ ] **Step 4: Final commit + push**

```bash
cd ~/projects/resume-os
git add index.html README.md
git commit -m "chore: final polish - About window hint, README easter egg section"
git push
```

---

## Self-Review

**Spec coverage check:**

| Requirement | Covered by |
|-------------|-----------|
| Code cleanup / section comments | Task 1 (CSS) + Task 2 (JS) |
| 80s/90s song lyric comments | Tasks 1, 2, 5, 6, 7, 8 (every function and section) |
| D&D references in code | Tasks 2, 4, 5, 6, 8 (THAC0, natural 20, saving throw, initiative) |
| Old game references | Tasks 2, 4, 6, 8 (Zork, Doom IDDQD, Konami, Oregon Trail, Duke Nukem) |
| Interactive easter eggs (keyboard) | Task 4 (engine), Task 7 (afterdark), Task 8 (rebuild) |
| Easter eggs in UI | Task 8 (rebuild window), Task 9 (About hint) |
| After Dark Flying Toasters | Task 5 |
| After Dark Cyberhacker | Task 6 |
| Screensaver triggers | Task 7 (right-click, keyboard, idle) |

**Placeholder scan:** No TBD, TODO, or "fill in details" present. All code blocks are complete.

**Type consistency:** `EasterEggEngine.launchScreensaver('toasters')` calls `renderToasters(canvas)` which is defined and returns a `tick` function. Same pattern for `renderCyberhacker`. `showToast`, `dismissScreensaver` are all defined in the engine closure before use. No orphaned references.

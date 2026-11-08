// The boot fills the whole screen at any size, the way the machine's own screen
// did. Micah, 2026-11-08, on the Mac OS 9 startup: "absolute crap". The 640x480
// screenshots were scaled into the window whole, so their CRT corners floated
// in the middle of a wide desktop, System 7's dither stopped at a hard edge, and
// on a phone the 4:3 picture shrank to a band with a speck of a Happy Mac and
// the extension icons parading mid-screen.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { inflateSync } from 'node:zlib';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const html = readFileSync(join(root, 'index.html'), 'utf8');
const engine = html.slice(html.indexOf('var BootEngine = (function () {'), html.indexOf('function switchTheme(os)'));

// Minimal PNG reader: RGBA 8-bit, non-interlaced (what PIL writes).
function png(file) {
  const b = readFileSync(file);
  let o = 8, w, h, ct, idat = [];
  while (o < b.length) {
    const len = b.readUInt32BE(o), type = b.toString('ascii', o + 4, o + 8), d = b.subarray(o + 8, o + 8 + len);
    if (type === 'IHDR') { w = d.readUInt32BE(0); h = d.readUInt32BE(4); ct = d[9]; }
    if (type === 'IDAT') idat.push(d);
    o += 12 + len;
  }
  assert.equal(ct, 6, `${file} must be RGBA so its background can be clear`);
  const raw = inflateSync(Buffer.concat(idat)), bpp = 4, stride = w * bpp, px = Buffer.alloc(h * stride);
  for (let y = 0; y < h; y++) {
    const f = raw[y * (stride + 1)], line = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1));
    for (let x = 0; x < stride; x++) {
      const a = x >= bpp ? px[y * stride + x - bpp] : 0, up = y ? px[(y - 1) * stride + x] : 0, ul = y && x >= bpp ? px[(y - 1) * stride + x - bpp] : 0;
      let v = line[x];
      if (f === 1) v += a; else if (f === 2) v += up; else if (f === 3) v += (a + up) >> 1;
      else if (f === 4) { const p = a + up - ul, pa = Math.abs(p - a), pb = Math.abs(p - up), pc = Math.abs(p - ul); v += pa <= pb && pa <= pc ? a : pb <= pc ? up : ul; }
      px[y * stride + x] = v & 255;
    }
  }
  return { w, h, alpha: (x, y) => px[y * stride + x * 4 + 3] };
}

test('the Mac boot bitmaps carry only their art: no CRT corners, no screen behind it', () => {
  for (const [name, inside] of [['mac7-happy', [319, 240]], ['mac7-welcome', [320, 150]], ['mac9-happy', [319, 240]], ['mac9-welcome', [320, 200]]]) {
    const p = png(join(root, 'assets/boot', name + '.png'));
    assert.equal(p.w, 640); assert.equal(p.h, 480);
    for (const [x, y] of [[0, 0], [3, 3], [639, 0], [0, 479], [639, 479], [40, 240], [600, 400]]) assert.equal(p.alpha(x, y), 0, `${name} (${x},${y}) is clear`);
    assert.equal(p.alpha(...inside), 255, `${name} art is opaque`);
  }
});

test('the screen behind each Mac boot is the machine\'s own: System 7 dithered, Mac OS 9 flat #888', () => {
  assert.match(html, /\.boot-overlay\.boot-mac7 \{[^}]*background-size: 2px 2px/);
  assert.match(html, /\.boot-overlay\.boot-mac9 \{ background: #888; \}/);
});

test('each boot names the box its art fills, and narrow screens scale to that box, not to 640x480', () => {
  for (const os of ['mac7', 'mac9', 'win31', 'winxp', 'aqua', 'beos']) {
    assert.match(engine, new RegExp(`\\n\\s+${os}: \\{ duration: \\d+, box: \\[\\d+, \\d+\\],`), `${os} declares its box`);
  }
  assert.match(engine, /function fit\(\) \{[\s\S]*?t\.box[\s\S]*?\}/, 'fit() reads the box');
});

test('the extension parade runs along the bottom of the screen, not of the 4:3 picture', () => {
  assert.match(engine, /overlay\.appendChild\(strip\)/, 'the strip is lifted out of the stage');
  assert.match(engine, /ctx\.overlay\.querySelector\('\.boot-ext-strip'\)/);
  assert.match(html, /\.boot-ext-strip \{[^}]*position: absolute;[^}]*flex-wrap: wrap-reverse;/);
});

test('the boot cuts to the desktop the way the machines did, with no crossfade ghosting over it', () => {
  assert.match(html, /\.boot-overlay \{[^}]*transition: none;/);
});

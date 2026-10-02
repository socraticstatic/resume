# resume-os

Micah Boswell's resume as a retro operating system. One HTML file, no framework, no build step. Six systems, each with its own boot sequence, chrome, icons, and clock.

Live: https://socraticstatic.github.io/resume/

## Systems

| Theme | Year | What you get |
|---|---|---|
| System 7 | 1991 | Happy Mac, then "Welcome to Macintosh." on halftone gray. Chicago, 1-bit icons, striped title bars. |
| Mac OS 9 | 1999 | The gray startup panel with the two-face Mac OS logo and the extension parade. Platinum chrome, Charcoal, six-color Apple, iMac flavors. |
| Windows 3.1 | 1992 | `C:\>win`, then the turquoise splash with the trailing flag. Gray desktop, navy title bars, control-menu box on the left. |
| Windows XP | 2001 | The flag wordmark and the crawling blue blocks. Luna taskbar at the bottom with the green start button. |
| Mac OS X 10.1 | 2001 | The blue splash with the Aqua apple and the pinstripe panel. Pinstriped windows, traffic lights, gel scrollbars. |
| BeOS R5 | 2000 | The purple wordmark and seven icons lighting up in order. Yellow title tabs, the Deskbar in the corner. |

The boot screens are the GUIdebook startup screenshots themselves, scaled on a 640x480 stage, with only the moving parts (progress bars, the crawling XP blocks, the BeOS icons lighting up, the extension parade) layered on top. Where the old version had a silver Apple on dark gray, a Be logo in colors Be never used, and a DOS prompt standing in for the Windows 3.1 splash, each system now boots the way it did.

## Using it

- Double-click an icon to open a window. Drag the title bar. Resize from the bottom-right corner.
- `Cmd/Ctrl+1` to `6` switches systems and reboots. `Cmd/Ctrl+W` or `Esc` closes the front window.
- Click, `Esc`, `Space`, or `Enter` skips a boot. Hold `Shift` while switching to a Mac for Extensions Off.
- Right-click the desktop for wallpaper, appearance, screensavers, and Save as PDF.
- File menu: the Chooser picks which Micah you are hiring. Save as Resume.sit runs a StuffIt dialog, then prints.
- Right-click a project for its Get Info dialog.
- Theme menu: wallpapers, CRT scanlines, English or Spanish.

## Easter eggs

| Sequence | What happens |
|---|---|
| Up Up Down Down Left Right Left Right B A | +30 lives |
| `zork` | You are likely to be eaten by a grue |
| `iddqd` | Degreelessness mode on |
| `contra` | Bill and Lance approve |
| `dnukem` | Hail to the king, baby |
| `afterdark` | A random After Dark screensaver |
| `rebuild` | A terminal runs rebuild.sh |
| `about` or double-click Trash | About This Resume |
| 90 seconds idle | Flying Toasters |

After Dark tributes: Flying Toasters (Berkeley Systems, 1989) and Cyberhacker, both drawn on a canvas.

## How I built it

**One file.** `index.html` holds the CSS, the markup, and the JavaScript, about 3,000 lines. The source carries section headers with 80s song titles and D&D asides. They are part of the design and they stay.

**The theme engine.** `<html data-os="mac9">` is the whole switch. Each system defines a block of CSS custom properties (desktop, window, title bar, fonts, selection colors, pill shapes) and a handful of scoped overrides for the things variables cannot express: the Platinum pinstripes, the XP taskbar moving to the bottom, the BeOS Deskbar folding into the corner, the Windows 3.1 control-menu box. Icon sets are swapped in JavaScript from a per-system map. The menu bar wears the Apple mark of its era: 1-bit, six-color, or blue gel.

**The boot engine.** `BootEngine` renders every startup on a 640x480 stage scaled to the viewport, so the proportions match the machines. The base of each screen is the real period bitmap; the engine only animates what moved. Each system is a timeline of steps; the engine fast-forwards unfired steps when a throttled tab reaches the end, honors `prefers-reduced-motion` by capping at 700ms, boots once per tab on first load, and lets any click or key skip. The Mac OS 9 parade uses the real desktop icons.

**Windows.** Absolutely positioned divs with drag, resize, and z-order in about sixty lines. Nothing is a library.

**Facts.** The Career and Projects windows are kept in step with a shared registry in a sibling repo (`job-hunter/data`: a claims bank, the master resume, and a project registry). `npm test` fails if a date, a project, or a forbidden claim drifts from that source, and skips those checks when the sibling is absent so a stranger's clone still passes.

**Pairing.** Built in Claude Code with me directing. The sessions researched each startup screen against GUIdebook, drew the SVG marks, wrote the tests, and argued with me about what Windows 3.1's desktop color actually was. It was gray.

## Running locally

```bash
npm start
```

Then open http://127.0.0.1:8123. Any static server works; there is nothing to build.

```bash
npm test
```

Node 20 or newer. The tests are static checks on `index.html`.

## Credits

- Startup screens: the period bitmaps in `assets/boot/` are the [GUIdebook Gallery](https://guidebookgallery.org) startup screenshots of System 7.0, Mac OS 9.0, Windows 3.1, Windows XP Professional, Mac OS X 10.1, and BeOS R5, used as the base of each boot; only the moving parts are drawn on top.
- Charcoal and Monaco fonts, the Mac OS 9 desktop pictures, and the Platinum scroll slider: [grassmunk/Platinum9](https://github.com/grassmunk/Platinum9).
- System 7 and Mac OS 9 desktop icons: the SevenIcons and NineIcons sets. Other systems use period icon sets.
- ChicagoFLF, Geneva, Tahoma, and Lucida Grande served by cdnfonts.
- Wallpaper photography by Micah Boswell on Unsplash.
- After Dark was Berkeley Systems. Apple, Macintosh, Mac OS, Windows, and BeOS are trademarks of their owners. This is a portfolio tribute with no affiliation.

## License

The code in this repository is MIT licensed (see `LICENSE`). The fonts, wallpapers, icons, and trademarks named above belong to their owners and are not covered by that license.

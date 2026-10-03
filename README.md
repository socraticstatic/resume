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
- File menu: the Chooser picks which Micah you are hiring.
- Click a project to open its own window: a real screenshot where one exists, the summary, the stack, and GitHub or Live links. Right-click a project for its Get Info dialog.
- File menu: Download Resume (PDF) is the real two-page resume. Save as Resume.sit runs the StuffIt dialog first and then hands you the same PDF. Print is the print stylesheet.
- The first visit boots Mac OS 9. Your last system is remembered for the next visit.
- On screens 1280px and wider the first load opens About and Career side by side. Windows open into free desktop space, never under the menu bar, the Deskbar, or each other's title bars when there is room.
- Keyboard: `Tab` reaches every icon, menu, window, row, and close box. `Enter` or `Space` opens what is focused. Each system draws its own focus ring. Windows are dialogs with their title as the accessible name, and the boot art is hidden from screen readers.
- The About window is each system's own About box: About This Macintosh, About This Computer, About Program Manager, About Windows, About This Mac, About BeOS. The marks come from the real dialogs; the memory rows carry the headline numbers. Read Me holds the long sections.
- Each system has its own menu bar, and the extras work. System 7: Apple, File, Edit, View, Label, Special. Mac OS 9 adds Window and Help. Mac OS X has Go and the Apple menu's Sleep, Restart, and Shut Down. Program Manager has File, Options, Window, Help, with Exit Windows under File. XP has the start menu and a taskbar of open windows. BeOS has the Be menu and the Deskbar's running list.
- View > Clean Up Windows re-places every open window. Label colors the selected icon the way System 7 did. Window menus, the XP taskbar, and the Deskbar list what is open.
- Special > Shut Down shows each system's real shutdown prompt (the Mac OS 9 countdown, Exit Windows, Turn off computer, the BeOS shutdown status) and then its power-off screen: "You may now switch off your Macintosh safely", the DOS prompt, "It is now safe to turn off your computer", "System is Shut Down". Click to start up again. Restart reboots.
- Sound is off until you turn it on with the speaker in the menu bar (remembered). Mac OS 9 then uses its real Platinum sound set for menus, windows, buttons, and Empty Trash. Mac boots play a synthesized chime in the right chord: C major for the Quadra era, F sharp major for 1999 and later. The real chimes live in ROM code, not in resources, so they are not sampled. Windows and BeOS stay silent; the XP startup sound is Brian Eno's and is not imitated.

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

**Menus and power.** One definition per system (`menusFor`) renders the bar, the Apple and Be menus, the XP start menu, and the window lists. Shut Down runs each system's prompt, then a power-off screen, then a click boots it again through the same BootEngine.

**Sound.** A small `Sound` module: opt-in, remembered, theme-aware. Real samples for Mac OS 9, Web Audio chords for the boot chimes, nothing fabricated for the systems whose sounds are someone's composition.

**About boxes.** One dialog structure (mark, key/value lines, thesis, memory-allocation rows, contact, OK and Read Me buttons) styled six ways after the GUIdebook About dialogs, with the marks cropped from those dialogs into `assets/about/`.

**Facts.** The Projects window and the twenty project windows are generated by `scripts/sync-projects.mjs` from a shared registry in a sibling repo (`job-hunter/data`: a claims bank, the master resume, and a project registry). `npm test` fails if a date, a project, or a forbidden claim drifts from that source, and skips those checks when the sibling is absent so a stranger's clone still passes.

**Accessibility.** One pass at init gives every icon, row, close box, menu, and taskbar entry a role, a tab stop, and a single activation rule (`Enter` or `Space` clicks it). Windows are `role=dialog` named by their title bar, focus moves into a window when it opens, and a focused menu shows its dropdown through `:focus-within`. The focus ring is drawn per system: dotted black for System 7 and Windows, a Platinum blue for Mac OS 9, the Aqua glow for 10.1, Be blue for BeOS. The language toggle updates the document language.

**Analytics.** The page loads the same `analytics-pageview.js` that conscious-shell.com and the other sites use, declared as `site: resume` so it lands in the same weekly readout. It records a page view (path, external referrer, language, coarse device and browser family, a per-tab session id that dies with the tab) and five named events: boot, theme switch, first open of each window, PDF download, and an email click. The page view counts today; the events count once the hub's events table accepts names beyond its four conversion names (a one-line migration on the hub, pending). No IP, no fingerprint, no cookie for visitors, and nothing at all from a dev server, a preview, a `webdriver` browser, the owner's own browser, or a browser sending Do Not Track or Global Privacy Control. The resume's copy is the hub's file plus that one gate, and a test holds the two files to the same text.

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

- Sounds: `assets/sound/` holds the Platinum sound set (menu, window, button, trash) and SimpleBeep and Sosumi, read out of a Mac OS 9 System Folder as `snd ` resources and converted to 22 kHz mono WAV. The chimes are synthesized in the browser.
- Shutdown screens: the XP and BeOS power-off bitmaps are GUIdebook screenshots; the Mac and DOS screens are text.
- Extension parade: the icons that march along the bottom of the Mac boots are the real `icl8` and `ICN#` resources of Mac OS 9's Extensions and Control Panels (QuickTime, AppleScript, AppleShare, Open Transport, Appearance and the rest), read out of a Mac OS 9 System Folder and rendered through the standard 256-color table; System 7 marches the 1-bit versions.
- Startup screens: the period bitmaps in `assets/boot/` are the [GUIdebook Gallery](https://guidebookgallery.org) startup screenshots of System 7.0, Mac OS 9.0, Windows 3.1, Windows XP Professional, Mac OS X 10.1, and BeOS R5, used as the base of each boot; only the moving parts are drawn on top.
- Charcoal and Monaco fonts, the Mac OS 9 desktop pictures, and the Platinum scroll slider: [grassmunk/Platinum9](https://github.com/grassmunk/Platinum9).
- System 7 and Mac OS 9 desktop icons: the SevenIcons and NineIcons sets. Other systems use period icon sets.
- ChicagoFLF, Geneva, Tahoma, and Lucida Grande served by cdnfonts.
- Project screenshots in `assets/work/` are of Micah's own sites and prototypes, plus the case-study images already published on conscious-shell.com.
- Wallpaper photography by Micah Boswell on Unsplash.
- After Dark was Berkeley Systems. Apple, Macintosh, Mac OS, Windows, and BeOS are trademarks of their owners. This is a portfolio tribute with no affiliation.

## License

The code in this repository is MIT licensed (see `LICENSE`). The fonts, wallpapers, icons, and trademarks named above belong to their owners and are not covered by that license.

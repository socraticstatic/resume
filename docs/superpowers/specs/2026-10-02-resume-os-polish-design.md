# Resume OS Polish: Design

Date: 2026-10-02. Approved in chat by Micah ("Proceed"). Recommendations accepted: keep Apple fonts and wallpapers with a tribute credit, keep the phone number, host on GitHub Pages.

## Goal

Take the single-file retro-OS resume from "solid start" to public-ready: period-accurate boot sequences, truthful chrome per OS, one consistent code style, a README that explains how it was built, and the AI project list mirrored to conscious-shell.com.

## Non-goals

No framework, no build step, no new files for the site itself beyond tests and docs. The culture comments stay. Resume facts stay as written (index.html is the source of truth); only ordering and counts are corrected.

## Boot sequences (verified against GUIdebook screenshots and avid.wiki, 2026-10-02)

| OS | Background | Sequence | Duration |
|---|---|---|---|
| Mac OS 7 | 50% halftone gray (1-bit checker) | Happy Mac, then a white "Welcome to Macintosh." box with black border and 1px offset shadow, Mac-with-mouse icon top-left | 2.2s |
| Mac OS 9 | gray + Happy Mac prelude, then the blue Finder-face picture (`mac9-bg.jpg`, the 9.1+ variant) | White welcome panel inside a gray frame: blue two-face Mac OS logo, "Mac OS 9" wordmark, "Welcome to Mac OS", "Starting up..." with a progress bar. Extension icons march left to right along the bottom. | 2.6s |
| Windows 3.1 | black | 0.5s `C:\WINDOWS>win` prompt, then a turquoise beveled box: waving four-pane flag with dotted trails, "Microsoft Windows" in a bold serif, "Version 3.1", copyright line. No progress bar. | 2.0s |
| Windows XP | black | Waving flag, "Microsoft Windows XP Professional" wordmark with orange "xp", three blue blocks crawling in a bordered trough, copyright bottom-left, "Microsoft" bottom-right | 2.2s |
| Mac OS X (Jaguar) | light gray #bfbfbf | Dark gray Apple, then a spinning 12-spoke gear beneath it. No bar. | 2.0s |
| BeOS R5 | black | Purple "BeOS" wordmark with "BE OPERATING SYSTEM" to the right and a purple "5", seven purple circles that light up in order (atom, I/O card, bolt, oscilloscope, disks, magnifier, BeBox), Be logo at the bottom (red rounded square, blue "Be") | 2.6s |

Engine rules: one overlay element, one timeline format, click or key skips to the end, `prefers-reduced-motion` collapses every sequence to a 300ms still, first visit in a tab boots the active theme (sessionStorage flag), theme switches boot the target theme.

## Chrome truthfulness

- Windows 3.1: desktop #C0C0C0, black icon labels, control-menu box on the left with a dash, centered title text, minimize and maximize arrows on the right, no brand mark in the menu bar, period 16-color pixel icons.
- Windows XP: the bar moves to the bottom as a Luna taskbar with a green "start" button carrying the flag, dropdowns open upward, clock in the blue tray on the right.
- Mac OS X: horizontal pinstripes on title bar and window body (no brushed metal), lighter Aqua Blue desktop gradient, glossy period icons.
- BeOS: the bar becomes the Deskbar, a compact gray panel in the top-right corner with the Be logo and clock; desktop icons sit top-left.
- Mac OS 9: the default desktop is the shipped "Mac OS Background" picture instead of flat teal.
- Era clock: mac7 Mar 1993, mac9 Jan 2001, win31 Apr 1992, winxp Jul 2002, aqua Aug 2002, beos Jun 2000.
- Labels: the theme is "Mac OS X" in every menu, box, and README line.

## Code consistency

- Delete the unused `osLogos` blob, the dead static `#context-menu`, the orphan `hideCtx` calls, and the second `keydown` easter handler. `about` joins the EasterEggEngine sequences.
- The live context menu uses the theme variables and offers: Change Wallpaper, Appearance..., Flying Toasters, Cyberhacker, About This Resume, Save as PDF.
- Get Info opens the About This Resume window instead of `alert()`.
- One `SITE_VERSION` constant feeds every version string.
- Status bars count their own items at init.
- Career list in reverse chronological order.
- `npm test` runs static checks against index.html (handler references resolve, no dead symbols, counts match, every OS has a boot and a theme box).

## Public release

- `.gitignore` adds `tailored/`.
- README: what it is, theme gallery with correct dates, navigation, easter eggs, "How I built it" (single file, data-os theme engine, boot timeline engine, asset provenance, Claude Code pairing), credits and a trademark note, license line.
- LICENSE: MIT for the code; fonts, wallpapers, icons and OS marks belong to their owners and are used as tribute.
- package.json carries the real name, description, test script, license and repository.
- History is scanned for secrets before the visibility flip. GitHub Pages serves `main` at the root.

## conscious-shell

Six rows join `portfolio_projects` through a dated migration, with summaries and tags copied from the resume Projects window: vault-daemon, NetBond Advanced, Cloud Designer, AI Concierge / API Concierge, Product Value Engine, Service Assurance (Revised). order_index 11 to 16 so they follow the AT&T row. Role "AI Engineering", client "Independent", empty image_url (tolerated, per the GE Nuclear precedent in `20260814150000_case_studies_carry_numbers.sql`). Applied through the linked Supabase project and verified on the live site.

## References

- GUIdebook: https://guidebookgallery.org/pics/gui/startupshutdown/splash/{beos5-1-1,macos90-1-1,macos90-2-1,win31,winxppro,macosx102-1-1}.png
- Windows 3.1 startup: https://www.avid.wiki/Windows_3.1/Startup_Screens
- BeOS boot icons: http://birdhouse.org/beos/bible/R4.5/install_boot.html
- Mac OS X Jaguar replaced Happy Mac with the gray Apple: https://en.wikipedia.org/wiki/Mac_OS_X_Jaguar
- Windows 3.1 default desktop #C0C0C0: https://windowswallpaper.miraheze.org/wiki/Windows_3.1x
- BeOS Deskbar upper-right: https://asleson.org/public/mirrors/www.be.com/documentation/User's%20Guide/01_basics/Basics03_Deskbar.html

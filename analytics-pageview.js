// Resume copy of the hub's file: one added gate, navigator.doNotTrack / globalPrivacyControl (the visitor asked not to be counted).
// Privacy-friendly page-view tracker for the shared analytics hub.
// Records site + path + referrer + locale, plus (since 2026-09-12) session
// journeys, coarse device facts, time-on-page, scroll depth, and outbound
// clicks. Still no IP and no fingerprint: the raw UA never leaves the
// browser; only parsed families (device/browser/os) are reported. No visitor
// gets a cookie: the one cookie, pp_owner=1, exists only in a browser Micah
// marks with ?owner=1 (the edge middleware reads it too).
// Fire-and-forget; never throws.
//
// SPA-aware, and deliberately at-most-once per path: the only thing that
// counts as a new view is landing on a path this document has not already
// reported. A navigation back to the page you are already on, a re-render
// that re-pushes the same URL, a query-string or hash change, a second copy
// of this script in the document — none of those are views.
//
// Session identity: a random per-tab id (sessionStorage `_pv_sid`) + a view
// counter (`_pv_seq`). Not a cookie, dies with the tab, identifies a visit —
// never a person. is_entry is simply seq === 1.
//
// Engagement rows are DELTAS: each send reports only seconds accrued since
// the last send (visibility-aware — a backgrounded tab accrues nothing).
// Total time on a page = sum(seconds) per session + path.
//
// Three ways to be silent, in the order they are checked:
//   1. navigator.webdriver — Playwright/Selenium.
//   2. window.__ANALYTICS_DISABLED__ — an opt-out any harness can set before
//      this script runs (page.evaluateOnNewDocument, an injected <script>).
//   3. anything that is not the declared production host.
//   4. the owner's own browser (the pp_owner cookie, set by ?owner=1).
// (2) and (3) exist because scripts/style-snapshot.mjs drives the real
// browser over a CDP attach, where navigator.webdriver is FALSE. On
// 2026-07-26 it ran twelve navigations per capture against localhost:5185
// for four hours and put 725 machine page views into the production table —
// 564 of them on '/', spaced at the harness's ~7s per-scenario cadence.
(function () {
  if (typeof window === 'undefined') return;
  window.ppTrack = function () {}; // callers never check; replaced below once this browser counts
  if (!window.fetch) return;
  if (navigator.webdriver) return; // headless automation / E2E
  if (window.__ANALYTICS_DISABLED__) return; // harness opt-out
  if (navigator.doNotTrack === '1' || navigator.globalPrivacyControl) return; // Do Not Track / Global Privacy Control
  if (!isProductionSurface()) return; // dev server, preview, file://
  if (ownerBrowser()) return; // Micah's own browser

  var SB_URL = 'https://uunehrczooesuganzujg.supabase.co';
  var KEY = 'sb_publishable_kO5HEhc0V68L5psarh4pfw_8vte_8JO';
  var SITE = window.__ANALYTICS_SITE__ || 'unknown';

  // The live site reports. Nothing else does. The host is declared next to the
  // site name in index.html so the domain lives in one place; when a page
  // declares one, only that host counts. The local-host rejection stands on
  // its own so a copy of this file that has not declared its host yet still
  // cannot report a dev server as an audience.
  function isProductionSurface() {
    try {
      if (location.protocol !== 'https:' && location.protocol !== 'http:') return false;
      var here = strip(location.hostname);
      if (isLocalHost(here)) return false;
      var declared = window.__ANALYTICS_HOST__;
      return declared ? here === strip(declared) : true;
    } catch (_) {
      return false; // unknowable surface -> not production
    }
  }

  function strip(h) {
    return String(h || '')
      .toLowerCase()
      .replace(/^\[|\]$/g, '') // location.hostname wraps IPv6 in brackets
      .replace(/^www\./, '');
  }

  function isLocalHost(h) {
    return (
      h === 'localhost' ||
      h === '0.0.0.0' ||
      h === '::1' ||
      /^127\./.test(h) ||
      /\.localhost$/.test(h) ||
      /\.local$/.test(h)
    );
  }

  // Owner switch: ?owner=1 on any page marks this browser as the owner's (one
  // first-party cookie, pp_owner=1); ?owner=0 clears it. The cookie spans the
  // apex and www; on a vercel.app host it stays host-only. Browsers cap a
  // script-set cookie's life (Safari 7 days), so a marked browser renews the
  // mark on every visit; and ?owner= leaves the address bar at once, so a
  // copied link cannot mark whoever opens it.
  function ownerBrowser() {
    try {
      var params = new URLSearchParams(location.search);
      var q = params.get('owner');
      var host = String(location.hostname || '').toLowerCase();
      var domain = /\.vercel\.app$/.test(host) ? '' : '; Domain=' + host.replace(/^www\./, '');
      var attrs = '; Path=/; SameSite=Lax' + domain + (location.protocol === 'https:' ? '; Secure' : '');
      if (q === '0') document.cookie = 'pp_owner=; Max-Age=0' + attrs;
      var owner = q === '1' || (q !== '0' && /(?:^|;\s*)pp_owner=1(?:;|$)/.test(document.cookie || ''));
      if (owner) document.cookie = 'pp_owner=1; Max-Age=157680000' + attrs;
      if (q !== null) {
        params.delete('owner');
        var rest = params.toString();
        history.replaceState(history.state, '', location.pathname + (rest ? '?' + rest : '') + (location.hash || ''));
      }
      return owner;
    } catch (_) {
      return false;
    }
  }

  function post(table, row) {
    fetch(SB_URL + '/rest/v1/' + table, {
      method: 'POST',
      headers: {
        apikey: KEY,
        Authorization: 'Bearer ' + KEY,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(row),
      keepalive: true,
    }).catch(function () {});
  }

  // Coarse client facts: device class, browser family, OS family, viewport
  // band. Parsed here so the raw UA never lands in page_views.
  function uaBits() {
    try {
      var ua = navigator.userAgent;
      var device = /ipad|tablet/i.test(ua) ? 'tablet'
        : /mobi|iphone|android/i.test(ua) ? 'mobile' : 'desktop';
      var browser = /edg\//i.test(ua) ? 'edge'
        : /opr\//i.test(ua) ? 'opera'
        : /samsungbrowser/i.test(ua) ? 'samsung'
        : /firefox|fxios/i.test(ua) ? 'firefox'
        : /chrome|crios/i.test(ua) ? 'chrome'
        : /safari/i.test(ua) ? 'safari' : 'other';
      var os = /windows/i.test(ua) ? 'windows'
        : /iphone|ipad|ipod/i.test(ua) ? 'ios'
        : /mac os x/i.test(ua) ? 'macos'
        : /android/i.test(ua) ? 'android'
        : /linux/i.test(ua) ? 'linux' : 'other';
      var w = window.innerWidth || 0;
      var viewport = w < 768 ? 'narrow' : w < 1200 ? 'medium' : 'wide';
      return { device: device, browser: browser, os: os, viewport: viewport };
    } catch (_) { return { device: null, browser: null, os: null, viewport: null }; }
  }

  // Session identity survives in sessionStorage; both counters fail closed
  // (storage blocked -> anonymous single view).
  function session() {
    var sid = null, seq = 1;
    try {
      sid = sessionStorage.getItem('_pv_sid');
      if (!sid) {
        sid = (window.crypto && crypto.randomUUID)
          ? crypto.randomUUID()
          : Date.now().toString(16) + '-' + Math.random().toString(16).slice(2);
        sessionStorage.setItem('_pv_sid', sid);
        sessionStorage.setItem('_pv_seq', '0');
      }
      seq = parseInt(sessionStorage.getItem('_pv_seq') || '0', 10) + 1;
      sessionStorage.setItem('_pv_seq', String(seq));
    } catch (_) { /* keep defaults */ }
    return { sid: sid, seq: seq };
  }

  // The path this document has already reported. Parked on `window` rather
  // than in this closure so a second evaluation of this file cannot report a
  // view the first one already sent.
  function alreadyReported(path) {
    return window.__pvPath === path;
  }

  // ── Engagement ────────────────────────────────────────────────────────────
  var engPath = null;      // the path currently being timed
  var engActive = 0;       // visible ms accrued since last flush
  var engLast = Date.now();
  var engScroll = 0;       // max scroll depth for engPath

  function engTick() {
    if (document.visibilityState === 'visible') engActive += Date.now() - engLast;
    engLast = Date.now();
  }

  function engOnScroll() {
    try {
      var el = document.documentElement;
      var denom = (el.scrollHeight - el.clientHeight) || 1;
      var pct = Math.round(Math.min(1, Math.max(0, (window.scrollY || el.scrollTop || 0) / denom)) * 100);
      if (pct > engScroll) engScroll = pct;
    } catch (_) {}
  }

  function engFlush() {
    try {
      engTick();
      var seconds = Math.round(engActive / 1000);
      engActive = 0; // delta rows: next flush reports only new time
      if (!engPath || seconds < 1) return;
      var sid = null;
      try { sid = sessionStorage.getItem('_pv_sid'); } catch (_) {}
      post('page_engagement', {
        site: SITE,
        session_id: sid,
        path: engPath.slice(0, 300),
        seconds: Math.min(seconds, 36000),
        scroll_pct: engScroll,
      });
    } catch (_) { /* engagement must never break the page */ }
  }

  // Listener installation is best-effort: a page view must still be recorded
  // on a document that lacks these hooks (the unit-test sandbox is one; an
  // exotic embed is another). Engagement and clicks are extras, never gates.
  try {
    document.addEventListener('visibilitychange', engTick);
    window.addEventListener('scroll', engOnScroll, { passive: true });
    window.addEventListener('pagehide', engFlush);
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'hidden') engFlush();
    });
  } catch (_) { /* no engagement on this document */ }

  // ── Outbound clicks ───────────────────────────────────────────────────────
  // Which external links get taken. Affiliate links (rel~sponsored or
  // data-affiliate) are distinguished from plain outbound.
  try {
    document.addEventListener('click', function (e) {
      try {
        var a = e.target && e.target.closest && e.target.closest('a[href]');
        if (!a) return;
        var href;
        try { href = new URL(a.href, location.href); } catch (_) { return; }
        if (href.protocol !== 'http:' && href.protocol !== 'https:') return;
        if (href.host === location.host) return; // internal nav isn't a click-out
        var kind = (/\bsponsored\b/.test(a.rel || '') || a.hasAttribute('data-affiliate'))
          ? 'affiliate' : 'outbound';
        post('link_clicks', {
          site: SITE,
          path: location.pathname.slice(0, 300),
          href: (href.host + href.pathname).slice(0, 300),
          kind: kind,
        });
      } catch (_) { /* never break a click */ }
    }, { capture: true, passive: true });
  } catch (_) { /* no click capture on this document */ }

  // ── Page views ────────────────────────────────────────────────────────────
  function send() {
    try {
      var path = location.pathname;
      if (alreadyReported(path)) return;
      window.__pvPath = path;

      // A new path closes the previous one's engagement window.
      engFlush();
      engPath = path;
      engScroll = 0;

      var ref = document.referrer || null;
      var externalRef = ref && ref.indexOf(location.host) === -1 ? ref.slice(0, 500) : null;
      var s = session();
      var isEntry = s.seq === 1;
      var qp;
      try { qp = new URLSearchParams(location.search); } catch (_) { qp = null; }
      function utm(k) { return (qp && qp.get('utm_' + k)) || null; }
      var bits = uaBits();
      post('page_views', {
        site: SITE,
        path: path,
        referrer: externalRef,
        locale: document.documentElement.lang || null,
        is_entry: isEntry,
        entry_referrer: isEntry ? externalRef : null,
        utm_source: utm('source'),
        utm_medium: utm('medium'),
        utm_campaign: utm('campaign'),
        session_id: s.sid,
        seq: s.seq,
        device: bits.device,
        browser: bits.browser,
        os: bits.os,
        viewport: bits.viewport,
      });
    } catch (_) { /* analytics must never break the page */ }
  }

  // Outcome events: window.ppTrack('contact_submitted'). Same gates as a view.
  window.ppTrack = function (name) {
    try {
      var sid = null;
      try { sid = sessionStorage.getItem('_pv_sid'); } catch (_) {}
      post('site_events', { site: SITE, name: String(name).slice(0, 40), path: location.pathname.slice(0, 300), session_id: sid });
    } catch (_) { /* analytics must never break the page */ }
  };

  send();
  // pushState only. replaceState rewrites the current entry — a filter, a
  // scroll restore, a canonicalised query — and is not a new view.
  var push = history.pushState;
  history.pushState = function () { push.apply(this, arguments); send(); };
  window.addEventListener('popstate', send);
})();

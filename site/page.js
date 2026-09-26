/* site/page.js: theme toggle, lamp dial and hero render, page-only. */
(function () {
  var root = document.documentElement;
  function set(t) {
    if (t === 'system') root.removeAttribute('data-theme'); else root.dataset.theme = t;
    /* when following the OS, show the effective theme as pressed */
    var eff = t === 'system' ? (window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : t;
    document.querySelectorAll('[data-set-theme]').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.setTheme === eff ? 'true' : 'false'); });
    try { localStorage.setItem('divot-theme', t); } catch (e) {}
  }
  document.querySelectorAll('[data-set-theme]').forEach(function (b) { b.addEventListener('click', function () { set(b.dataset.setTheme); }); });
  var saved = null; try { saved = localStorage.getItem('divot-theme'); } catch (e) {}
  set(saved || root.dataset.theme || 'system');
  var lf = document.getElementById('lframe'); if (lf && window.divotLight) window.divotLight(lf);
  /* 2x / 1x toggle for the dial's button */
  var sc = document.getElementById('lScale');
  if (sc && lf) sc.addEventListener('click', function () {
    var one = lf.classList.toggle('x1');
    sc.textContent = one ? '1\u00d7' : '2\u00d7';
    sc.setAttribute('aria-label', one ? 'Scale 1\u00d7, switch to 2\u00d7' : 'Scale 2\u00d7, switch to 1\u00d7');
  });
  document.querySelectorAll('canvas.ascii').forEach(function (c) {
    var o = JSON.parse(c.dataset.press || '{}');
    if (window.asciiPress) { try { window.asciiPress(c, o); } catch (e) {} }
  });
})();

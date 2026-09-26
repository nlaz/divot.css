/* site/page.js: the landing page's own script (page-only)
   Theme toggle in the masthead, the lamp dial, and the hero render. Deferred,
   after three.js and the two scene scripts, so it runs once they exist. */
(function () {
  var root = document.documentElement;
  function set(t) {
    if (t === 'system') root.removeAttribute('data-theme'); else root.dataset.theme = t;
    document.querySelectorAll('[data-set-theme]').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.setTheme === t ? 'true' : 'false'); });
    try { localStorage.setItem('divot-theme', t); } catch (e) {}
  }
  document.querySelectorAll('[data-set-theme]').forEach(function (b) { b.addEventListener('click', function () { set(b.dataset.setTheme); }); });
  var saved = null; try { saved = localStorage.getItem('divot-theme'); } catch (e) {}
  set(saved || root.dataset.theme || 'system');
  var lf = document.getElementById('lframe'); if (lf && window.divotLight) window.divotLight(lf);
  document.querySelectorAll('canvas.ascii').forEach(function (c) {
    var o = JSON.parse(c.dataset.press || '{}');
    if (window.asciiPress) { try { window.asciiPress(c, o); } catch (e) {} }
  });
})();

/* site/light.js: the lamp pin in the Customize section (page-only)
   Drag anywhere inside the frame and the lamp takes that bearing; the value
   lands on :root as --divot-light, so every divot on the page re-lights.
   The pin itself is the slider for keyboards and screen readers. */
window.divotLight = function (frame) {
  var root = document.documentElement;
  var DEFAULT = 315;
  var DIRS = ['top', 'top-right', 'right', 'bottom-right', 'bottom', 'bottom-left', 'left', 'top-left'];
  var v = DEFAULT;
  var $ = function (sel) { return document.querySelector(sel); };
  var lamp = frame.querySelector('[role="slider"]');
  var mag = frame.querySelector('.mag');

  function norm(x) { return ((x % 360) + 360) % 360; }
  /* shortest signed turn, so the value never jumps a whole revolution */
  function wrap(x) { return ((x % 360) + 540) % 360 - 180; }
  /* the same share the CSS computes, for the readout */
  function share(t) { return Math.max(0, Math.min(1, 0.5 + 0.7072 * t)); }

  function render() {
    root.style.setProperty('--divot-light', v + 'deg');
    var n = Math.round(norm(v)) % 360;
    var dir = DIRS[Math.round(norm(v) / 45) % 8];
    lamp.setAttribute('aria-valuenow', n);
    lamp.setAttribute('aria-valuetext', n + ' degrees, light from the ' + dir);
    $('#lDeg').textContent = n + '°';
    $('#lDir').textContent = dir;
    $('#lCss').textContent = ':root { --divot-light: ' + n + 'deg; }';
    $('#lReset').disabled = n === DEFAULT;
    var r = v * Math.PI / 180, c = Math.cos(r), s = Math.sin(r);
    var sh = { t: share(c), r: share(s), b: share(-c), l: share(-s) };
    Object.keys(sh).forEach(function (k) { $('#lS' + k).textContent = Math.round(sh[k] * 100) + '%'; });
  }
  function set(x) { v = x; render(); }

  frame.addEventListener('pointerdown', function (e) {
    /* the magnified button is a button: let it press instead of dragging */
    if (e.button !== 0 || e.target === mag) return;
    e.preventDefault();
    lamp.focus({ preventScroll: true });
    frame.setPointerCapture(e.pointerId);
    frame.classList.add('grab');
    function to(p) {
      var b = frame.getBoundingClientRect();
      var a = Math.atan2(p.clientX - (b.left + b.width / 2), (b.top + b.height / 2) - p.clientY) * 180 / Math.PI;
      if (p.shiftKey) a = Math.round(a / 15) * 15;
      set(v + wrap(a - v));
    }
    function up() {
      frame.classList.remove('grab');
      frame.removeEventListener('pointermove', to);
      frame.removeEventListener('pointerup', up);
      frame.removeEventListener('pointercancel', up);
    }
    to(e);
    frame.addEventListener('pointermove', to);
    frame.addEventListener('pointerup', up);
    frame.addEventListener('pointercancel', up);
  });

  lamp.addEventListener('keydown', function (e) {
    var k = e.key, d = e.shiftKey ? 1 : 5;
    if (k === 'ArrowRight' || k === 'ArrowUp') set(v + d);
    else if (k === 'ArrowLeft' || k === 'ArrowDown') set(v - d);
    else if (k === 'PageUp') set(v + 45);
    else if (k === 'PageDown') set(v - 45);
    else if (k === 'Home') set(v + wrap(DEFAULT - v));
    else return;
    e.preventDefault();
  });

  $('#lReset').addEventListener('click', function () {
    set(v + wrap(DEFAULT - v));
    lamp.focus({ preventScroll: true });
  });

  $('#lCopy').addEventListener('click', function () {
    var btn = this, pre = $('#lCss');
    function done(label) { btn.textContent = label; setTimeout(function () { btn.textContent = 'Copy CSS'; }, 1400); }
    function select() {
      var range = document.createRange(); range.selectNodeContents(pre);
      var sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(range);
      done('Selected');
    }
    if (navigator.clipboard) navigator.clipboard.writeText(pre.textContent).then(function () { done('Copied'); }, select);
    else select();
  });

  render();
};

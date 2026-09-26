/* site/light.js: the lamp dial. Page-only.
   Dragging inside the frame sets --divot-light on :root. The pin is a slider
   for keyboards and screen readers. */
window.divotLight = (frame) => {
  const DEFAULT = 315;
  const STEP = 5;
  const FINE_STEP = 1;
  const PAGE_STEP = 45;
  const SNAP = 15;
  const DIRECTIONS = ['top', 'top-right', 'right', 'bottom-right', 'bottom', 'bottom-left', 'left', 'top-left'];

  const root = document.documentElement;
  const pin = frame.querySelector('[role="slider"]');
  const magnified = frame.querySelector('.mag');
  const code = document.getElementById('lCss');
  const reset = document.getElementById('lReset');
  const copy = document.getElementById('lCopy');

  let angle = DEFAULT;

  // --- geometry ----------------------------------------------------------
  const normalize = (deg) => ((deg % 360) + 360) % 360;

  // The shortest signed turn from one bearing to another, so the dial never
  // spins a full revolution to reach a nearby angle.
  const shortestTurn = (deg) => ((deg % 360) + 540) % 360 - 180;

  const bearingOf = (event) => {
    const box = frame.getBoundingClientRect();
    const dx = event.clientX - (box.left + box.width / 2);
    const dy = (box.top + box.height / 2) - event.clientY;
    const deg = Math.atan2(dx, dy) * 180 / Math.PI;
    return event.shiftKey ? Math.round(deg / SNAP) * SNAP : deg;
  };

  // --- state -------------------------------------------------------------
  const highlight = (deg) =>
    `<span class="t">:root</span> <span class="p">{</span> ` +
    `<span class="a">--divot-light</span><span class="p">:</span> ` +
    `<span class="s">${deg}deg</span><span class="p">; }</span>`;

  const render = () => {
    const deg = Math.round(normalize(angle)) % 360;
    const direction = DIRECTIONS[Math.round(normalize(angle) / 45) % 8];

    root.style.setProperty('--divot-light', `${angle}deg`);
    pin.setAttribute('aria-valuenow', deg);
    pin.setAttribute('aria-valuetext', `${deg} degrees, light from the ${direction}`);
    code.innerHTML = highlight(deg);
    reset.disabled = deg === DEFAULT;
  };

  const setAngle = (deg) => { angle = deg; render(); };
  const turnTo = (deg) => setAngle(angle + shortestTurn(deg - angle));
  const focusPin = () => pin.focus({ preventScroll: true });

  // --- pointer -----------------------------------------------------------
  frame.addEventListener('pointerdown', (event) => {
    // The magnified button is a real button: let it press instead of dragging.
    if (event.button !== 0 || event.target === magnified) return;
    event.preventDefault();
    focusPin();
    frame.setPointerCapture(event.pointerId);
    frame.classList.add('grab');

    const move = (e) => turnTo(bearingOf(e));
    const release = () => {
      frame.classList.remove('grab');
      frame.removeEventListener('pointermove', move);
      frame.removeEventListener('pointerup', release);
      frame.removeEventListener('pointercancel', release);
    };

    move(event);
    frame.addEventListener('pointermove', move);
    frame.addEventListener('pointerup', release);
    frame.addEventListener('pointercancel', release);
  });

  // --- keyboard ----------------------------------------------------------
  pin.addEventListener('keydown', (event) => {
    const step = event.shiftKey ? FINE_STEP : STEP;
    const moves = {
      ArrowRight: step, ArrowUp: step,
      ArrowLeft: -step, ArrowDown: -step,
      PageUp: PAGE_STEP, PageDown: -PAGE_STEP,
    };

    if (event.key === 'Home') turnTo(DEFAULT);
    else if (event.key in moves) setAngle(angle + moves[event.key]);
    else return;
    event.preventDefault();
  });

  // --- buttons -----------------------------------------------------------
  reset.addEventListener('click', () => { turnTo(DEFAULT); focusPin(); });

  copy.addEventListener('click', async () => {
    const flash = (label) => {
      copy.textContent = label;
      setTimeout(() => { copy.textContent = 'Copy'; }, 1400);
    };
    const selectCode = () => {
      const range = document.createRange();
      range.selectNodeContents(code);
      const selection = getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      flash('Selected');
    };

    try {
      await navigator.clipboard.writeText(code.textContent);
      flash('Copied');
    } catch {
      selectCode();
    }
  });

  render();
};

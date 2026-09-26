/* site/page.js: theme toggle, lamp dial and hero render. Page-only. */
(() => {
  const root = document.documentElement;

  // --- theme -------------------------------------------------------------
  const STORAGE_KEY = 'divot-theme';
  const themeButtons = [...document.querySelectorAll('[data-set-theme]')];

  const osTheme = () =>
    matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

  const readSaved = () => {
    try { return localStorage.getItem(STORAGE_KEY); } catch { return null; }
  };

  const save = (theme) => {
    try { localStorage.setItem(STORAGE_KEY, theme); } catch { /* private mode */ }
  };

  const setTheme = (theme) => {
    if (theme === 'system') root.removeAttribute('data-theme');
    else root.dataset.theme = theme;

    // When following the OS, the button for the effective theme reads as pressed.
    const effective = theme === 'system' ? osTheme() : theme;
    for (const button of themeButtons) {
      button.setAttribute('aria-pressed', String(button.dataset.setTheme === effective));
    }
    save(theme);
  };

  for (const button of themeButtons) {
    button.addEventListener('click', () => setTheme(button.dataset.setTheme));
  }
  setTheme(readSaved() || root.dataset.theme || 'system');

  // --- lamp dial ---------------------------------------------------------
  const frame = document.getElementById('lframe');
  const scale = document.getElementById('lScale');

  if (frame && window.divotLight) window.divotLight(frame);

  if (frame && scale) {
    scale.addEventListener('click', () => {
      const isOneX = frame.classList.toggle('x1');
      scale.textContent = isOneX ? '1×' : '2×';
      scale.setAttribute('aria-label', isOneX ? 'Scale 1×, switch to 2×' : 'Scale 2×, switch to 1×');
    });
  }

  // --- hero render -------------------------------------------------------
  if (window.asciiPress) {
    for (const canvas of document.querySelectorAll('canvas.ascii')) {
      const options = JSON.parse(canvas.dataset.press || '{}');
      try { window.asciiPress(canvas, options); } catch { /* no WebGL: the canvas stays blank */ }
    }
  }
})();

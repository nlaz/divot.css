/* site/ascii-button.js: the hero render. Page-only.
   A three.js power button in a recess, read back as pixels and drawn as text
   in the page's own ink so it follows the theme. It behaves as a button:
   hover depresses it, a press latches it in, a second press releases it.
   Needs window.THREE (r128) loaded first. */
(() => {
  const DEFAULTS = {
    cols: 96,
    rows: 48,
    cell: 8,               // px per column; rows are 1.7× taller
    weight: 500,
    ramp: ' .:-=+*#%@',    // dark to light
    fov: 28,
    dist: 5.4,
    look: [0, 0, 0],
    radius: 1.2,
    hoverDepth: 0.35,
    latchDepth: 0.5,
    vignette: 0.14,        // how much the edges darken
    vignetteStart: 0.7,    // radius (0–1.41) where the darkening begins
    fadeMs: 600,           // theme crossfade
    bgVar: '--bg',
    inkVar: '--ink',
    tones: false,          // colour glyphs by brightness with the ink ramp
    label: 'Power button. Press to latch it in, press again to release.',
    onPress: null,
    onFrame: null,
  };

  const SINK = 0.09;       // world units the button travels at full pressure
  const EASE = 0.14;       // per-frame approach toward the target pressure
  const CAMERA_DIR = [-2.4, 3.3, 3.3];
  const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);

  const clamp01 = (x) => Math.min(1, Math.max(0, x));
  const smoothstep = (x) => x * x * (3 - 2 * x);
  const cssVar = (name, fallback) =>
    getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;

  // --- renderer ------------------------------------------------------------
  // One WebGL context shared by every button on the page; each draw resizes it.
  let shared = null;
  const sharedRenderer = () => {
    if (shared) return shared;
    try {
      shared = new THREE.WebGLRenderer({ antialias: false, preserveDrawingBuffer: true });
    } catch {
      return null;
    }
    shared.setPixelRatio(1);
    shared.shadowMap.enabled = true;
    shared.shadowMap.type = THREE.PCFSoftShadowMap;
    return shared;
  };

  // --- scene ---------------------------------------------------------------
  const buildScene = (o) => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(o.fov, (o.cols / o.rows) * 0.6, 0.1, 50);
    camera.position.copy(new THREE.Vector3(...CAMERA_DIR).normalize().multiplyScalar(o.dist));
    camera.lookAt(...o.look);

    // A hard overhead key that casts into the recess, plus a little ambient.
    const key = new THREE.DirectionalLight(0xffffff, 1.3);
    key.position.set(-1, 6, 1);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.radius = 1;
    key.shadow.bias = -0.0008;
    Object.assign(key.shadow.camera, { left: -3, right: 3, top: 3, bottom: -3, near: 0.5, far: 20 });
    scene.add(key, new THREE.AmbientLight(0xffffff, 0.22));

    const materials = {
      ground: new THREE.MeshLambertMaterial({ color: 0x4e4e4e }),
      well: new THREE.MeshLambertMaterial({ color: 0x0a0a0a }),
      face: new THREE.MeshLambertMaterial({ color: 0x626262 }), // a step lighter than the ground
      mark: new THREE.MeshLambertMaterial({ color: 0x888888 }), // a step lighter than the face
    };

    const R = o.radius;
    const gap = (0.14 * R) / 1.35;

    // The ground: a slab with a round hole for the well.
    const slab = new THREE.Shape();
    slab.moveTo(-60, -60); slab.lineTo(60, -60); slab.lineTo(60, 60); slab.lineTo(-60, 60);
    slab.closePath();
    const hole = new THREE.Path();
    hole.absarc(0, 0, R + gap, 0, Math.PI * 2, true);
    slab.holes.push(hole);
    const ground = new THREE.Mesh(
      new THREE.ExtrudeGeometry(slab, { depth: 0.5, bevelEnabled: false, curveSegments: 64 }),
      materials.ground,
    );
    ground.rotation.x = Math.PI / 2;
    ground.receiveShadow = true;
    ground.castShadow = true;

    const well = new THREE.Mesh(new THREE.CylinderGeometry(R + gap, R + gap, 0.3, 64), materials.well);
    well.position.y = -0.35;
    well.receiveShadow = true;

    // The button: a slightly tapered face carrying the power glyph.
    const button = new THREE.Group();
    const face = new THREE.Mesh(new THREE.CylinderGeometry(R - 0.06 * R, R, 0.6, 64), materials.face);
    face.position.y = -0.3;
    face.castShadow = true;
    face.receiveShadow = true;

    // The glyph's gap points toward the camera's near-right corner.
    const forward = new THREE.Vector2(o.look[0] - camera.position.x, o.look[2] - camera.position.z).normalize();
    const right = new THREE.Vector2(-forward.y, forward.x);
    const toward = forward.clone().add(right).normalize();
    const ringGap = 0.55;
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.58 * R, 0.074 * R, 14, 80, Math.PI * 2 - 2 * ringGap),
      materials.mark,
    );
    ring.rotation.set(Math.PI / 2, 0, Math.atan2(toward.y, toward.x) + ringGap);
    ring.position.y = -0.01;
    ring.castShadow = true;

    const bar = new THREE.Mesh(new THREE.BoxGeometry(0.15 * R, 0.06, 0.7 * R), materials.mark);
    bar.rotation.y = Math.atan2(toward.x, toward.y);
    bar.position.set(toward.x * 0.37 * R, 0, toward.y * 0.37 * R);
    bar.castShadow = true;

    button.add(face, ring, bar);
    scene.add(ground, well, button);

    return { scene, camera, face, button };
  };

  // --- the button ----------------------------------------------------------
  window.asciiPress = (canvas, options = {}) => {
    if (!window.THREE) return null;
    const renderer = sharedRenderer();
    if (!renderer) return null;

    const o = { ...DEFAULTS, ...options };
    const { cols, rows, ramp } = o;
    const { scene, camera, face, button } = buildScene(o);

    const cellW = o.cell;
    const cellH = Math.round(cellW * 1.7);
    canvas.width = cols * cellW;
    canvas.height = rows * cellH;
    const ctx = canvas.getContext('2d');
    const font = `${o.weight} ${Math.round(cellH * 0.95)}px "IBM Plex Mono", ui-monospace, monospace`;
    const pixels = new Uint8Array(cols * rows * 4);

    const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Interaction state. `pressure` eases toward `target`; the rest is what
    // the pointer and keyboard are doing right now.
    const state = { phase: 'rest', pressure: 0, latched: false };
    let over = false;
    let down = false;
    let focused = false;
    let target = 0;
    let dirty = true;
    let fade = null;

    const raycaster = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    const hitsFace = (event) => {
      const box = canvas.getBoundingClientRect();
      ndc.set(
        ((event.clientX - box.left) / box.width) * 2 - 1,
        -((event.clientY - box.top) / box.height) * 2 + 1,
      );
      raycaster.setFromCamera(ndc, camera);
      return raycaster.intersectObject(face).length > 0;
    };

    const retarget = () => {
      const hovering = over || focused;
      target = down ? 1 : state.latched ? o.latchDepth : hovering ? o.hoverDepth : 0;
      state.phase = down ? 'pressed' : state.latched ? 'latched' : hovering ? 'hover' : 'rest';
      canvas.setAttribute('aria-pressed', String(state.latched));
      canvas.style.cursor = over ? 'pointer' : '';
    };

    const toggle = () => {
      state.latched = !state.latched;
      retarget();
      if (o.onPress) {
        try { o.onPress(state); } catch { /* the page's problem, not the button's */ }
      }
    };

    // Pointer.
    canvas.addEventListener('pointermove', (event) => {
      const hit = hitsFace(event);
      if (hit !== over) { over = hit; retarget(); }
    });
    canvas.addEventListener('pointerleave', () => { over = false; retarget(); });
    canvas.addEventListener('pointerdown', (event) => {
      if (!hitsFace(event)) return;
      down = true;
      try { canvas.setPointerCapture(event.pointerId); } catch { /* unsupported */ }
      retarget();
      event.preventDefault();
    });
    const release = (event) => {
      if (!down) return;
      down = false;
      over = hitsFace(event);
      retarget();
      if (over) toggle();
    };
    canvas.addEventListener('pointerup', release);
    canvas.addEventListener('pointercancel', release);

    // Keyboard and focus.
    canvas.tabIndex = 0;
    canvas.setAttribute('role', 'button');
    canvas.setAttribute('aria-pressed', 'false');
    canvas.setAttribute('aria-label', o.label);
    canvas.addEventListener('focus', () => { focused = true; retarget(); });
    canvas.addEventListener('blur', () => { focused = false; down = false; retarget(); });

    const isActivation = (event) => event.key === ' ' || event.key === 'Enter';
    canvas.addEventListener('keydown', (event) => {
      if (!isActivation(event)) return;
      if (!down) { down = true; retarget(); }
      event.preventDefault();
    });
    canvas.addEventListener('keyup', (event) => {
      if (!isActivation(event)) return;
      if (down) { down = false; retarget(); toggle(); }
      event.preventDefault();
    });

    // A theme change crossfades the last frame into the new one.
    const onThemeChange = () => {
      dirty = true;
      if (reduceMotion) return;
      const snapshot = document.createElement('canvas');
      snapshot.width = canvas.width;
      snapshot.height = canvas.height;
      snapshot.getContext('2d').drawImage(canvas, 0, 0);
      fade = { image: snapshot, start: performance.now() };
    };
    matchMedia('(prefers-color-scheme: dark)').addEventListener('change', onThemeChange);
    new MutationObserver(onThemeChange).observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    // --- drawing -----------------------------------------------------------
    const drawGlyphs = () => {
      const ink = cssVar(o.inkVar, '#1e1c16');
      const dim = cssVar('--ink-dim', '#605c4b');
      const faint = cssVar('--ink-faint', '#97917c');
      const n = ramp.length;
      const vignetteSpan = Math.SQRT2 - o.vignetteStart;

      ctx.font = font;
      ctx.textBaseline = 'top';
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = ((rows - 1 - y) * cols + x) * 4;
          let lum = (pixels[i] * 0.3 + pixels[i + 1] * 0.59 + pixels[i + 2] * 0.11) / 255;

          // Vignette: a radial falloff outside the well. Where it acts, an
          // ordered dither spreads the step between ramp characters so the
          // fade reads as a gradient rather than a contour line.
          const dx = (x / cols - 0.5) * 2;
          const dy = (y / rows - 0.5) * 2;
          const r = Math.hypot(dx, dy);
          const f = smoothstep(clamp01((r - o.vignetteStart) / vignetteSpan));
          lum *= 1 - o.vignette * f;
          lum += ((BAYER[(y & 3) * 4 + (x & 3)] - 0.5) / n) * f * 0.75;

          const glyph = ramp[Math.max(0, Math.min(n - 1, Math.floor(lum * n)))];
          if (glyph === ' ') continue;
          ctx.fillStyle = o.tones ? (lum > 0.66 ? ink : lum > 0.33 ? dim : faint) : ink;
          ctx.fillText(glyph, x * cellW, y * cellH);
        }
      }
    };

    const drawFade = () => {
      if (!fade) return;
      const k = (performance.now() - fade.start) / o.fadeMs;
      if (k >= 1) { fade = null; return; }
      ctx.globalAlpha = 1 - smoothstep(k);
      ctx.drawImage(fade.image, 0, 0);
      ctx.globalAlpha = 1;
      dirty = true;
    };

    const draw = () => {
      button.position.y = -SINK * state.pressure;
      renderer.setSize(cols, rows, false);
      renderer.render(scene, camera);
      const gl = renderer.getContext();
      gl.readPixels(0, 0, cols, rows, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

      ctx.fillStyle = cssVar(o.bgVar, '#e8e4d9');
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      drawGlyphs();
      drawFade();
    };

    // Re-renders only when the pressure moves or something marked it dirty.
    const tick = () => {
      let next = reduceMotion ? target : state.pressure + (target - state.pressure) * EASE;
      if (Math.abs(next - target) < 0.002) next = target;
      if (next !== state.pressure || dirty) {
        state.pressure = clamp01(next);
        dirty = false;
        draw();
        if (o.onFrame) o.onFrame(state);
      }
      requestAnimationFrame(tick);
    };
    tick();

    return state;
  };
})();

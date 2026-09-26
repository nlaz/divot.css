/* ==========================================================================
   site/ascii-button.js — the landing page's hero render
   --------------------------------------------------------------------------
   Page-only. Not part of the divot.css package (package.json "files" ships
   css/ alone). A three.js scene of a round power button in a recess, seen
   in three-quarter view, read back as pixels and drawn as text in the
   page's own ink on the page's own ground, so it follows the theme.

   It is a button: hover depresses it a little, a press pushes it fully in
   and it LATCHES at half depth; the next press releases it. It takes focus and
   works from Space or Enter. Every move eases. A completed press calls
   opts.onPress with the state, whose .latched says which way it went.
   It only re-renders when something changed, so it idles at no cost.

   Needs window.THREE (r128) loaded first. Call asciiPress(canvas, opts);
   the defaults below are the chosen composition.
   ========================================================================== */
window.asciiPress = function(canvas, o){
  if (!window.THREE) return null;
  o = o || {};
  var cols = o.cols || 96, rows = o.rows || 48, ramp = o.ramp || ' .:-=+*#%@';
  // one shared WebGL renderer for every button on the page; each draw resizes it to its own grid
  var ren = window.__asciiRen;
  if (!ren) { try { ren = new THREE.WebGLRenderer({antialias:false, preserveDrawingBuffer:true}); } catch(e) { return null; }
    ren.setPixelRatio(1); ren.shadowMap.enabled = true; ren.shadowMap.type = THREE.PCFSoftShadowMap; window.__asciiRen = ren; }
  var scene = new THREE.Scene(); scene.background = new THREE.Color(0x000000);
  var aspect = cols/rows*0.6;
  var cam = new THREE.PerspectiveCamera(o.fov || 28, aspect, 0.1, 50);
  var dir = new THREE.Vector3(-2.4, 3.3, 3.3).normalize(), dist = o.dist || 5.4;
  var la = o.look || [0, 0, 0]; cam.position.copy(dir.multiplyScalar(dist)); cam.lookAt(la[0], la[1], la[2]);
  var cp = [cam.position.x, cam.position.y, cam.position.z];

  // lighting: a hard overhead key that casts into the recess and off the glyph.
  function keyLight(pos, intensity, radius, amb, fillI, fillPos){
    var key = new THREE.DirectionalLight(0xffffff, intensity); key.position.set(pos[0], pos[1], pos[2]);
    key.castShadow = true; key.shadow.mapSize.set(1024, 1024); key.shadow.radius = radius; key.shadow.bias = -0.0008;
    var sc = key.shadow.camera; sc.left = -3; sc.right = 3; sc.top = 3; sc.bottom = -3; sc.near = 0.5; sc.far = 20;
    scene.add(key); scene.add(new THREE.AmbientLight(0xffffff, amb));
    if (fillI) { var f = new THREE.DirectionalLight(0xffffff, fillI); f.position.set(fillPos[0], fillPos[1], fillPos[2]); scene.add(f); }
  }
  keyLight([-1, 6, 1], 1.3, 1, 0.22, 0.0, null);

  var mGround = new THREE.MeshLambertMaterial({color: 0x4e4e4e});
  var mWell = new THREE.MeshLambertMaterial({color: 0x0a0a0a});
  var mFace = new THREE.MeshLambertMaterial({color: 0x626262}); // a step lighter than the ground: the face reads as its own surface
  var mMark = new THREE.MeshLambertMaterial({color: 0x888888}); // a step lighter than the face: inks darker, but softly
  var BR = o.radius || 1.2, G = 0.14*BR/1.35;
  var slab = new THREE.Shape(); slab.moveTo(-60, -60); slab.lineTo(60, -60); slab.lineTo(60, 60); slab.lineTo(-60, 60); slab.closePath();
  var hole = new THREE.Path(); hole.absarc(0, 0, BR+G, 0, Math.PI*2, true); slab.holes.push(hole);
  var ground = new THREE.Mesh(new THREE.ExtrudeGeometry(slab, {depth: 0.5, bevelEnabled: false, curveSegments: 64}), mGround); ground.rotation.x = Math.PI/2; ground.receiveShadow = true; ground.castShadow = true; scene.add(ground);
  var well = new THREE.Mesh(new THREE.CylinderGeometry(BR+G, BR+G, 0.3, 64), mWell); well.position.y = -0.35; well.receiveShadow = true; scene.add(well);
  var button = new THREE.Group();
  var face = new THREE.Mesh(new THREE.CylinderGeometry(BR-0.06*BR, BR, 0.6, 64), mFace); face.position.y = -0.3; face.castShadow = true; face.receiveShadow = true; button.add(face);
  var fwd = new THREE.Vector2(la[0]-cp[0], la[2]-cp[2]).normalize();
  var rgt = new THREE.Vector2(-fwd.y, fwd.x);
  var d = fwd.clone().add(rgt).normalize();
  var GR = 0.58*BR, GT = 0.074*BR, GAP = 0.55;
  var ring = new THREE.Mesh(new THREE.TorusGeometry(GR, GT, 14, 80, Math.PI*2 - 2*GAP), mMark);
  ring.rotation.set(Math.PI/2, 0, Math.atan2(d.y, d.x) + GAP); ring.position.y = -0.01; ring.castShadow = true; button.add(ring);
  var bar = new THREE.Mesh(new THREE.BoxGeometry(0.15*BR, 0.06, 0.7*BR), mMark);
  bar.rotation.y = Math.atan2(d.x, d.y); bar.position.set(d.x*0.37*BR, 0.0, d.y*0.37*BR); bar.castShadow = true; button.add(bar);
  scene.add(button);

  var px = new Uint8Array(cols*rows*4);
  var BAYER = [0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5].map(function(v){ return (v + 0.5)/16; });
  var ctx = canvas.getContext('2d');
  var cw = o.cell || 8, ch = Math.round(cw*1.7);
  canvas.width = cols*cw; canvas.height = rows*ch;
  var font = (o.weight || 500) + ' ' + Math.round(ch*0.95) + 'px "IBM Plex Mono", ui-monospace, monospace';
  function css(v, dflt){ var s = getComputedStyle(document.documentElement).getPropertyValue(v).trim(); return s || dflt; }
  function clamp(x){ return x<0?0:x>1?1:x; }

  var HOVER = o.hoverDepth != null ? o.hoverDepth : 0.35, LATCH = o.latchDepth != null ? o.latchDepth : 0.5, SINK = 0.09, VIG = o.vignette != null ? o.vignette : 0.14;
  var over = false, down = false, focused = false, latched = false, target = 0, pr = 0, dirty = true;
  var state = { phase: 'rest', pressure: 0, latched: false };
  var ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  function hit(ev){
    var r = canvas.getBoundingClientRect();
    ndc.set(((ev.clientX - r.left)/r.width)*2 - 1, -((ev.clientY - r.top)/r.height)*2 + 1);
    ray.setFromCamera(ndc, cam);
    return ray.intersectObject(face).length > 0;
  }
  function retarget(){
    target = down ? 1 : latched ? LATCH : (over || focused) ? HOVER : 0;
    state.phase = down ? 'pressed' : latched ? 'latched' : (over || focused) ? 'hover' : 'rest';
    canvas.setAttribute('aria-pressed', latched ? 'true' : 'false');
    canvas.style.cursor = over ? 'pointer' : '';
  }
  canvas.addEventListener('pointermove', function(ev){ var h = hit(ev); if (h !== over) { over = h; retarget(); } });
  canvas.addEventListener('pointerleave', function(){ over = false; retarget(); });
  canvas.addEventListener('pointerdown', function(ev){ if (!hit(ev)) return; down = true; try { canvas.setPointerCapture(ev.pointerId); } catch(e){} retarget(); ev.preventDefault(); });
  function fire(){ latched = !latched; state.latched = latched; retarget(); if (o.onPress) { try { o.onPress(state); } catch(e){} } }
  function up(ev){ if (!down) return; down = false; if (ev && ev.clientX != null) over = hit(ev); retarget(); if (over || ev.clientX == null) fire(); }
  canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', up);
  canvas.tabIndex = 0; canvas.setAttribute('role', 'button'); canvas.setAttribute('aria-pressed', 'false'); canvas.setAttribute('aria-label', o.label || 'Power button. Press to latch it in, press again to release.');
  canvas.addEventListener('focus', function(){ focused = true; retarget(); });
  canvas.addEventListener('blur', function(){ focused = false; down = false; retarget(); });
  canvas.addEventListener('keydown', function(ev){ if (ev.key === ' ' || ev.key === 'Enter') { if (!down) { down = true; retarget(); } ev.preventDefault(); } });
  canvas.addEventListener('keyup', function(ev){ if (ev.key === ' ' || ev.key === 'Enter') { if (down) { down = false; retarget(); fire(); } ev.preventDefault(); } });
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // a theme change crossfades the last frame into the new one instead of cutting
  var fade = null, FADE_MS = o.fadeMs != null ? o.fadeMs : 600;
  function themeChanged(){ if (reduce) { dirty = true; return; } var snap = document.createElement('canvas'); snap.width = canvas.width; snap.height = canvas.height; snap.getContext('2d').drawImage(canvas, 0, 0); fade = { img: snap, t0: performance.now() }; dirty = true; }
  try { window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', themeChanged); } catch(e){}
  try { new MutationObserver(themeChanged).observe(document.documentElement, {attributes: true, attributeFilter: ['data-theme']}); } catch(e){}

  function draw(){
    button.position.y = -SINK*pr;
    ren.setSize(cols, rows, false);
    ren.render(scene, cam);
    var gl = ren.getContext();
    gl.readPixels(0, 0, cols, rows, gl.RGBA, gl.UNSIGNED_BYTE, px);
    var bg = css(o.bgVar || '--bg', '#e8e4d9'), ink = css(o.inkVar || '--ink', '#1e1c16'), dim = css('--ink-dim', '#605c4b'), faint = css('--ink-faint', '#97917c');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = font; ctx.textBaseline = 'top';
    var n = ramp.length;
    for (var y=0; y<rows; y++) for (var x=0; x<cols; x++) {
      var i = ((rows-1-y)*cols + x)*4;
      var l = (px[i]*0.3 + px[i+1]*0.59 + px[i+2]*0.11)/255;
      // lens vignette: a smooth radial falloff (cos^4-like) that starts near the centre and
      // wraps all four edges, not just the corners. Where it acts, an ordered dither spreads
      // the step between ramp characters so the fade reads as a gradient, not a contour line.
      var dx = (x/cols - 0.5)*2, dy = (y/rows - 0.5)*2, r = Math.sqrt(dx*dx + dy*dy)/1.4142;
      var f = Math.min(1, Math.max(0, (r - 0.2)/0.8)); f = f*f*(3 - 2*f);
      l *= 1 - VIG*f;
      l += (BAYER[(y&3)*4 + (x&3)] - 0.5)/n*f*0.75;
      var k = Math.max(0, Math.min(n-1, Math.floor(l*n)));
      var c = ramp[k]; if (c === ' ') continue;
      ctx.fillStyle = o.tones ? (l>0.66 ? ink : l>0.33 ? dim : faint) : ink;
      ctx.fillText(c, x*cw, y*ch);
    }
    if (fade) { var k = (performance.now() - fade.t0)/FADE_MS; if (k >= 1) fade = null; else { ctx.globalAlpha = 1 - k*k*(3-2*k); ctx.drawImage(fade.img, 0, 0); ctx.globalAlpha = 1; dirty = true; } }
  }
  function frame(){
    var next = reduce ? target : pr + (target - pr)*0.14;
    if (Math.abs(next - target) < 0.002) next = target;
    if (next !== pr || dirty) { pr = clamp(next); dirty = false; state.pressure = pr; draw(); if (o.onFrame) o.onFrame(state); }
    requestAnimationFrame(frame);
  }
  frame();
  return state;
};

# divot.css

A button whose face **is** the plane it sits in.

Nothing raised, nothing filled differently, nothing translating on press. A
divot is legible because a groove is cut around it: one wall down, one wall
back up, light from the top-left. The tactility is value, not displacement —
at zero height there is nothing to fall from.

The whole system is two derived colours, and the one idea worth stealing is
where they come from. **The walls are mixed from the ground the button is cut
into, never hardcoded.** That is what lets a single recipe survive a surface
change, a theme flip, and a white-paper special case without one override:

```css
--_hi: color-mix(in oklab, var(--divot-src-hi) var(--_str), var(--divot-ground));
--_lo: color-mix(in oklab, var(--divot-src-lo) var(--_str), var(--divot-ground));

border-color: var(--_lo) var(--_hi) var(--_hi) var(--_lo);
box-shadow: inset 1px 1px 0 var(--_hi), inset -1px -1px 0 var(--_lo);
```

The asymmetry is the whole illusion. Descending into the channel, the wall
turns away from the light — shadow. Climbing back out to the face, it turns
toward it — highlight. On the bottom-right you meet the same two walls in the
opposite order, so the pair flips. A symmetric ring would read as a printed
outline rather than a cut.

Extracted from [The Library](https://github.com/nlaz/library), where it is the
button primitive.

**[Specimen sheet →](index.html)**  ·  **[The build-out →](system.html)**

## Install

```html
<link rel="stylesheet" href="css/divot.css">
<button class="divot">Read</button>
```

That is the whole setup — the package ships its own palette, so a bare `<link>`
renders a working button in both light and dark.

```sh
npm install divot.css
```

```css
@import "divot.css";          /* the button, and nothing else */
@import "divot.css/system";   /* + wells, tabs, cards, popovers, menus, forms */
```

Needs `color-mix()`: Safari 16.2+, Chrome 111+, Firefox 113+.

## Two entry points

| | |
|---|---|
| `css/divot.css` | Tokens + the core primitive. The button. ~230 lines. |
| `css/divot.system.css` | The above + the build-out layered on top. ~1350 lines. |

They are separate because they are not equally proven. The core has years of
production use behind it; the build-out has a specimen sheet. Order matters if
you link the parts yourself — `system.css` re-cuts the core's walls from a
border into inset box-shadow bands, so it has to come last.

À la carte: `css/tokens.css`, `css/core.css`, `css/system.css`.

## The button

One class plus a role. Nothing here changes the 2px profile — depth is
contrast, not size, so a `ghost` and a `firm` are the same box.

| Class | |
|---|---|
| `.divot` | The primitive. Default strength, `--divot-n: 45`. |
| `.divot.quiet` | Silent at rest, cut on hover. Toolbars, rows of peers. |
| `.divot.ghost` | Lighter cut, `25`. Inside a group that already frames it. |
| `.divot.firm` | Heavier cut, `70`. Over images and busy grounds. |
| `.divot.bare` | No walls at all. Full-width list and rail rows. |
| `.divot.icon` | Squares the box up around a glyph. |
| `.divot.raise` | The inverse: the face lifts one band and the chisel flips. |
| `.divot.accent` | A highlighter wash. Rides in `background-image` so the press does not wipe it. |
| `.divot.danger` | Severity by inversion, on hover. |
| `.divot:disabled` | Groove flat, ink faded, box unchanged. |

Latched state — a toggle that stays on is a button still being held down — is
any of `.on`, `.active`, `.sel`, `[aria-pressed="true"]`, `[aria-expanded="true"]`.

```html
<button class="divot">Read</button>
<button class="divot quiet">file away</button>
<button class="divot raise accent">Add to collection</button>
<button class="divot icon" aria-pressed="true">☾</button>
```

## Grounds

House rule number one: **declare the ground on the container.** A button that
has to know where it is has already lost.

```html
<div class="ground-surface">
  <button class="divot">Read</button>
</div>
```

`.ground-bg`, `.ground-surface`, `.ground-well`, `.ground-paper` — or set
`--divot-ground` yourself on whatever surface you already have. The helpers
write their `background` and their `--divot-ground` from the same variable so
the two cannot drift apart.

`.ground-paper` is the instructive one. Nothing is lighter than a white scan,
so the light source collapses to the paper itself and the cut becomes
shadow-only — which is what a groove in white paper actually looks like.

## Tokens

| Token | Default | |
|---|---|---|
| `--divot-n` | `45` | Strength, 0–100. The only knob you should normally touch. |
| `--divot-ground` | `var(--bg)` | The plane being cut. Must equal what is actually behind the button. |
| `--divot-src-hi` | `var(--edge-hi)` | Light source, the up-slope. Collapse it to the ground where nothing can be lighter. |
| `--divot-src-lo` | `var(--edge-lo)` | Shadow source, the down-slope. |
| `--raise-n` | `20` | How far `.raise` lifts off the plane. |
| `--divot-bump` | `0` | Internal. Lets `:hover` deepen the cut without a cyclic reference. Don't set it at call sites. |

The build-out adds `--divot-w` (wall width in bands), `--divot-rest`
(elevation, −2 sunk to +2 proud), `--lift-step`, `--well-n`, and
`--r-sm/-md/-lg/-pill`.

### Bringing your own palette

The primitive has no colours of its own. Link `css/core.css` without
`css/tokens.css` and define the tokens it reads: `--bg`, `--edge-hi`,
`--edge-lo`, `--ink`, `--ink-dim`, `--ink-faint`, `--hl-wash`, `--r`. Only the
two `--edge` tokens are load-bearing — they are the light and shadow the cut is
made of.

The bundled theme is a warm paper-gray in the light and bister brown in the
dark, with one brass highlighter for an accent. It follows
`prefers-color-scheme`, and `[data-theme="light"]` / `[data-theme="dark"]` on
any element forces it — on `<html>` to beat the OS, or on a container to show
both themes on one page.

## The rules

1. **Set the ground on the container.** Every surface that is not `--bg`
   declares its own `--divot-ground` once, and writes its own `background` from
   that same variable so the two cannot drift.
2. **Never hardcode the wall colours.** The moment a hex goes into a border,
   the button stops surviving theme flips — and that failure ships silently to
   half your sessions.
3. **Don't scale the profile.** It is a physical cut, not a proportion. The
   same 2px on a 22px icon toggle and a 44px primary.
4. **`ghost` and `quiet` only where context implies a target** — inside a
   toolbar, a group, a row of peers.
5. **Inversion is for severity, not emphasis.** Re-point `--divot-ground` to
   `--ink` rather than setting a background, so the walls re-derive.
6. **Keep the focus ring.** A flush button has no value contrast against its
   ground; the outline is the one element permitted to break the plane.
7. **A button is a groove, a field is a well.** Never let the two share a
   treatment — the inversion is the whole reason the language reads.

## License

Apache-2.0

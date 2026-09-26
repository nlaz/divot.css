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
box-shadow: inset  1px  1px 0 var(--_hi),
            inset -1px -1px 0 var(--_lo);
```

The asymmetry is the whole illusion. Descending into the channel, the wall
turns away from the light — shadow. Climbing back out to the face, it turns
toward it — highlight. On the bottom-right you meet the same two walls in the
opposite order, so the pair flips. A symmetric ring would read as a printed
outline rather than a cut.

The tool was a chisel, not a gouge: two hard 1px bands a side, the outer one
the hairline border and the inner one an unblurred inset shadow. Nothing is
anti-aliased — the cut is exactly as sharp as the pixel grid.

Extracted from [The Library](https://github.com/nlaz/library), where it is the
button primitive.

**[The page →](index.html)** — every control on it is live.

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
@import "divot.css";
```

Needs `color-mix()`: Safari 16.2+, Chrome 111+, Firefox 113+.

This is the button and nothing else — one class, on purpose. Wells, tabs,
cards, menus and the rest are the host page's business; the principle here is
small enough to apply yourself.

À la carte: `css/tokens.css` and `css/core.css`.

## The button

One class plus a role. Nothing here changes the profile — depth is contrast,
not size, so a `ghost` and a `firm` are the same box.

| Class | |
|---|---|
| `.divot` | The primitive. Default strength, `--divot-n: 45`. |
| `.divot.quiet` | Silent at rest, cut on hover. Toolbars, rows of peers. |
| `.divot.ghost` | Lighter cut, `25`. Inside a group that already frames it. |
| `.divot.firm` | Heavier cut, `70`. Over images and busy grounds. |
| `.divot.bare` | No walls at all. Full-width list and rail rows. |
| `.divot.icon` | Squares the box up around a glyph. |
| `.divot.raise` | One storey up: the face lifts one band and the walls flip. The primary action. |
| `.divot.eased` | 3px corners. |
| `.divot.pill` | Full-round corners. Chips, filters, switches. |
| `.divot.danger` | Severity by inversion, on hover. |
| `.divot:disabled` | Groove flat, ink faded, box unchanged. |

Latched state — a toggle that stays on is a button still being held down — is
any of `.on`, `.active`, `[aria-pressed="true"]`, `[aria-expanded="true"]`.

```html
<button class="divot">Read</button>
<button class="divot quiet">file away</button>
<button class="divot raise">Add to collection</button>
<button class="divot pill" aria-pressed="true">filter</button>
<button class="divot icon" aria-pressed="true">☾</button>
```

### The press

The face sinks to the floor of the groove: the inner wall is deleted — there
is no wall climbing back up to a face that has sunk — and the top-left wall
throws its shadow across the floor. The face does not move. The **label**
does, a quarter of a pixel toward the shadow, because a sunk face is further from the eye
under an off-axis lamp. It is done by shifting the padding, not the box, which
is why the box is declared as `--divot-pad-y` / `--divot-pad-x` rather than
`padding` — override those per call site and the nudge still works.

### The ladder

Three storeys: sunk, flush, raised. Flush is the divot at rest; sunk is where
every press lands; raised is the inverse at one band, with no drop shadow.
Every button travels exactly one step down on press — a default goes flush →
sunk, a raise goes raised → flush.

That is the whole emphasis system. **There is no accent colour.** The
important button is the raised one; a brass wash on top of it is the kind of
thing this material exists to not need.

### The corner

Radius is an axis, and the material's rest position on it is square — a cut
has corners because the tool does, and at zero radius the bands render with
nothing anti-aliased. `.eased` and `.pill` move one button along the axis; set
`--divot-r` on a container to move a region. The walls follow the corner.

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
| `--divot-reach` / `--divot-soft` | `1px` / `0px` | The tool: how far the inner band falls onto the face, and how blurred its edge is. soft `0` is the chisel; `3px` is a gouge. |
| `--divot-inner` | `100%` | How much of the wall colour the inner band carries. |
| `--divot-r` | `0px` | Corner radius. Square at rest. |
| `--divot-pad-y` / `--divot-pad-x` | `5px` / `12px` | The box. Override these, not `padding`. |
| `--divot-nudge` | `0.25px` | How far the label slides toward the shadow on press. |
| `--raise-n` | `20` | How far `.raise` lifts off the plane. |
| `--divot-bump` | `0` | Internal. Lets `:hover` deepen the cut without a cyclic reference. Don't set it at call sites. |

### Bringing your own palette

The primitive has no colours of its own. Link `css/core.css` without
`css/tokens.css` and define the tokens it reads: `--bg`, `--edge-hi`,
`--edge-lo`, `--ink`, `--ink-dim`, `--ink-faint`. Only the two `--edge` tokens
are load-bearing — they are the light and shadow the cut is made of.

The bundled theme is a warm paper-gray in the light and bister brown in the
dark. It follows `prefers-color-scheme`, and `[data-theme="light"]` /
`[data-theme="dark"]` on any element forces it — on `<html>` to beat the OS,
or on a container to show both themes on one page.

## The rules

1. **Set the ground on the container.** Every surface that is not `--bg`
   declares its own `--divot-ground` once, and writes its own `background` from
   that same variable so the two cannot drift.
2. **Never hardcode the wall colours.** The moment a hex goes into a border,
   the button stops surviving theme flips — and that failure ships silently to
   half your sessions.
3. **Don't scale the profile.** It is a physical cut, not a proportion. The
   same walls on a 22px icon toggle and a 44px primary.
4. **Emphasis is a storey, not a colour.** The important button is the raised
   one. There is no accent to reach for, on purpose.
5. **`ghost` and `quiet` only where context implies a target** — inside a
   toolbar, a group, a row of peers.
6. **Inversion is for severity, not emphasis.** Re-point `--divot-ground` to
   `--ink` rather than setting a background, so the walls re-derive.
7. **Keep the focus ring.** A flush button has no value contrast against its
   ground; the outline is the one element permitted to break the plane.

## License

MIT

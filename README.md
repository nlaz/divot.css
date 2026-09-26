# divot.css

A simple skeuomorphic button style for a satisfying button experience.

v0.2.0 · MIT · **[nlaz.github.io/divot.css](https://nlaz.github.io/divot.css/)**

![divot.css](https://nlaz.github.io/divot.css/site/og.png)

## Buttons should be satisfying to press.

Physical buttons are satisfying to press, and I wanted to bring that feeling
to the screen. The key feature is a soft divot around the button that keeps
its face flush with the surface.

It's a simple, no-frills skeuomorphic style that mimics light catching the
edges of the cut. The result is a page that feels tangible and makes you want
to click things.

### How it works

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

One wall goes down into the groove and turns away from the light, so it is
shadow. The next climbs back out to the face and turns toward the light, so it
is highlight. On the far side the same two walls meet in the opposite order,
so the pair flips. The asymmetry is what reads as a cut rather than an
outline.

Extracted from [The Library](https://github.com/nlaz/library), where it is the
button primitive.

## Add it to your project.

**[Download divot.css](https://nlaz.github.io/divot.css/divot.css)**, one file
with the palette and the button in it, and link it:

```html
<link rel="stylesheet" href="divot.css">
<button class="divot">Edit</button>
```

That is the whole setup. The stylesheet ships its own palette, so a bare
`<link>` renders a working button in both light and dark.

On a surface that isn't the page, set the ground on the container:

```html
<div class="ground-surface">
  <button class="divot">Edit</button>
</div>
```

Or link it straight from this repo:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/nlaz/divot.css@main/divot.css">
```

À la carte: `css/tokens.css` is the palette and `css/core.css` is the button.
`css/divot.css` is the two-`@import` entry that pulls both.

Needs `color-mix()`: Safari 16.2+, Chrome 111+, Firefox 113+. The light
control below also uses CSS trigonometry, which shipped earlier in all three,
so wherever the button renders, the lamp works too.

## Every divot button type.

Add one modifier to `.divot` to change its style. Every variant keeps the same
size, so they line up in any layout.

| Class | |
|---|---|
| `.divot` | The default, flush with the page. |
| `.divot.on` | A toggle held down while on. |
| `.divot.raise` | The primary action, raised. |
| `.divot.quiet` | Borderless until hovered. |
| `.divot.ghost` | A lighter cut, for grouped buttons. |
| `.divot.firm` | A deeper cut, for busy backgrounds. |
| `.divot.bare` | No border, for list and menu rows. |
| `.divot.icon` | A square box for a single icon. |
| `.divot.eased` | Softly rounded 3px corners. |
| `.divot.pill` | Fully rounded, for chips and filters. |
| `.divot.danger` | Inverts on hover, for deletes. |
| `.divot:disabled` | Faded, but keeps its size. |

```html
<button class="divot">Read</button>
<button class="divot quiet">file away</button>
<button class="divot raise">Add to collection</button>
<button class="divot pill" aria-pressed="true">filter</button>
<button class="divot icon" aria-label="Dark mode">☾</button>
```

### States

Latched state, a toggle that stays on, is a button still being held down. It
is any of `.on`, `.active`, `[aria-pressed="true"]` or
`[aria-expanded="true"]`. Prefer the attributes: they tell assistive
technology the same thing they tell the stylesheet.

On press the face sinks to the floor of the groove. The inner wall is deleted,
because there is no wall climbing back up to a face that has sunk, and the wall
on the lamp side throws its shadow across the floor. The face does not move.
The label does, a quarter of a pixel toward the shadow. That nudge is done by
shifting the padding, which is why the box is declared as `--divot-pad-y` and
`--divot-pad-x` rather than `padding`. Override those per call site and the
nudge still works.

### Elevation

Three storeys, and every button travels exactly one step down on press.

| | | |
|---|---|---|
| `+1` | `.raise` | Raised, for the primary action. A press lands it flush. |
| `0` | `.divot` | Flush, the default resting state. A press sinks it. |
| `−1` | `.on` | Pressed in, where every click lands. |

That is the whole emphasis system. **There is no accent colour.** The
important button is the raised one.

## Grounds

House rule number one: **declare the ground on the container.** A button that
has to know where it is has already lost.

```html
<div class="ground-surface">
  <button class="divot">Read</button>
</div>
```

`.ground-bg`, `.ground-surface`, `.ground-well`, `.ground-paper`, or set
`--divot-ground` yourself on whatever surface you already have. The helpers
write their `background` and their `--divot-ground` from the same variable so
the two cannot drift apart.

`.ground-paper` is the instructive one. Nothing is lighter than a white scan,
so the light source collapses to the paper itself and the cut becomes
shadow-only, which is what a groove in white paper actually looks like.

## Change your light source.

Every wall on the page takes its light from one value. `--divot-light` is the
bearing the lamp sits at, clockwise from 12 o'clock. The default, `315deg`, is
the top-left and draws exactly the cut you see everywhere else in this README.

```css
:root { --divot-light: 135deg; }
```

Set it on `:root` to relight the whole page, or on a container to relight a
region. [Drag the lamp on the site](https://nlaz.github.io/divot.css/#customize)
to find a bearing you like; the CSS line under the dial is ready to copy.
Browsers without CSS trigonometry keep the fixed top-left cut.

## Tokens

Set these on a container, or on `:root` for the whole page.

| Token | Default | |
|---|---|---|
| `--divot-n` | `45` | Strength, 0–100. The only knob you should normally touch. |
| `--divot-ground` | `var(--bg)` | The plane being cut. Must equal what is actually behind the button. |
| `--divot-light` | `315deg` | Lamp bearing, clockwise from 12. |
| `--divot-r` | `0px` | Corner radius. Square at rest. |
| `--divot-pad-y` / `--divot-pad-x` | `5px` / `12px` | The box. Override these, not `padding`. |
| `--raise-n` | `20` | How far `.raise` lifts off the plane. |

Advanced. These change the tool, not the button, and most pages never touch
them.

| Token | Default | |
|---|---|---|
| `--divot-src-hi` | `var(--edge-hi)` | Light source, the up-slope. Collapse it to the ground where nothing can be lighter. |
| `--divot-src-lo` | `var(--edge-lo)` | Shadow source, the down-slope. |
| `--divot-reach` / `--divot-soft` | `1px` / `0px` | How far the inner band falls onto the face, and how blurred its edge is. soft `0` is the chisel; `3px` is a gouge. |
| `--divot-inner` | `100%` | How much of the wall colour the inner band carries. |
| `--divot-nudge` | `0.25px` | How far the label slides toward the shadow on press. |
| `--divot-bump` | `0` | Internal. Lets `:hover` deepen the cut without a cyclic reference. Don't set it at call sites. |

### Bringing your own palette

The primitive has no colours of its own. Link `css/core.css` without
`css/tokens.css` and define the tokens it reads: `--bg`, `--edge-hi`,
`--edge-lo`, `--ink`, `--ink-dim`, `--ink-faint`. Only the two `--edge` tokens
are load-bearing: they are the light and shadow the cut is made of.

The bundled theme is a warm paper-gray in the light and bister brown in the
dark. It follows `prefers-color-scheme`, and `[data-theme="light"]` /
`[data-theme="dark"]` on any element forces it: on `<html>` to beat the OS,
or on a container to show both themes on one page.

## The rules

1. **Set the ground on the container.** Every surface that is not `--bg`
   declares its own `--divot-ground` once, and writes its own `background`
   from that same variable so the two cannot drift.
2. **Never hardcode the wall colours.** The moment a hex goes into a border,
   the button stops surviving theme flips, and that failure ships silently to
   half your users.
3. **Don't scale the profile.** It is a physical cut, not a proportion. The
   same walls on a 22px icon toggle and a 44px primary.
4. **Emphasis is a storey, not a colour.** The important button is the raised
   one. There is no accent to reach for, on purpose.
5. **Keep the focus ring.** A flush button has no value contrast against its
   ground; the outline is the one element permitted to break the plane.

## Development and contributing

```sh
git clone https://github.com/nlaz/divot.css.git
cd divot.css
python3 -m http.server 8000
```

Open http://localhost:8000/ and you are looking at the site with the real
stylesheet. There is no build step for the page.

What lives where:

- `css/tokens.css` is the palette, `css/core.css` is the button, and
  `css/divot.css` imports both. This is the whole package.
- `divot.css` at the root is the single-file download: the banner plus the two
  files above, concatenated. It is generated, never edited by hand.
- `index.html` is the site. It links `css/` directly rather than copying it,
  so the page cannot drift from what the package ships. If the page looks
  wrong, the library is wrong.
- `site/` is page-only: the ASCII hero render (`ascii-button.js`, which needs
  three.js from a CDN), the lamp dial (`light.js`), the theme toggle
  (`page.js`), the favicon and the social card. None of it is in the package.

After editing anything in `css/`, regenerate the download and commit it:

```sh
npm run build   # writes divot.css from package.json + css/tokens.css + css/core.css
npm run check   # exits 1 if the committed divot.css is stale
```

Before opening a pull request, load the site and check the reference sheet
in light and dark, with the lamp at a few bearings, and once with
forced-colors on (Windows high contrast, or the Playwright emulation). Include
before-and-after screenshots for any visual change.

What a good change looks like here:

- It keeps the one-class contract. A new look is a modifier on `.divot`, not
  a new component.
- It adds no colours. The walls come from the ground; there is no accent and
  there won't be one.
- It adds no dependencies, no build tooling and no JavaScript to the package.
  Plain CSS, readable without a compiler.
- It keeps the profile fixed. Strength is contrast, not size.

What this project is not going to grow: wells, tabs, cards, menus, or a
framework around the button. Those are the host page's business, and the
principle here is small enough to apply yourself.

Bugs and ideas go in [issues](https://github.com/nlaz/divot.css/issues). If
you are unsure whether a change fits, open one first.

## License

[MIT](LICENSE) © 2026 Niko Lazaris

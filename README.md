# divot.css

A simple skeuomorphic button style for a satisfying button experience.

v0.2.0 · MIT · **[nlaz.github.io/divot.css](https://nlaz.github.io/divot.css/)**

![divot.css](https://nlaz.github.io/divot.css/site/og.png)

Physical buttons are satisfying to press, and I wanted to bring that feeling
to the screen. The key feature is a soft divot around the button that keeps
its face flush with the surface. It's a simple, no-frills skeuomorphic style
that mimics light catching the edges of the cut.

The walls are mixed from the ground the button sits on, never hardcoded, so
one recipe survives any surface, a theme flip, and white paper.

## Add it to your project

**[Download divot.css](https://nlaz.github.io/divot.css/divot.css)** and link it.
The file ships its own palette, light and dark.

```html
<link rel="stylesheet" href="divot.css">
<button class="divot">Edit</button>
```

On a surface that isn't the page, set the ground on the container:

```html
<div class="ground-surface">
  <button class="divot">Edit</button>
</div>
```

Helpers: `.ground-bg`, `.ground-surface`, `.ground-well`, `.ground-paper`, or
set `--divot-ground` yourself. À la carte: `css/tokens.css` is the palette,
`css/core.css` is the button. Needs `color-mix()`: Safari 16.2+, Chrome 111+,
Firefox 113+.

## Every divot button type

Add one modifier to `.divot`. Every variant keeps the same size.

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

A latched toggle is `.on`, `.active`, `[aria-pressed="true"]` or
`[aria-expanded="true"]`; prefer the attributes. Three storeys, raised, flush
and sunk, and every press travels exactly one step down. There is no accent
colour: the important button is the raised one.

## Change your light source

`--divot-light` is the lamp bearing, clockwise from 12 o'clock. The default,
`315deg`, is the top-left. Set it on `:root` for the page or on a container
for a region. [Drag the lamp on the site](https://nlaz.github.io/divot.css/#customize)
to find one you like.

```css
:root { --divot-light: 135deg; }
```

## Tokens

| Token | Default | |
|---|---|---|
| `--divot-n` | `45` | Strength, 0–100. The only knob you should normally touch. |
| `--divot-ground` | `var(--bg)` | The plane being cut. Must match what is behind the button. |
| `--divot-light` | `315deg` | Lamp bearing, clockwise from 12. |
| `--divot-r` | `0px` | Corner radius. Square at rest. |
| `--divot-pad-y` / `--divot-pad-x` | `5px` / `12px` | The box. Override these, not `padding`, so the press nudge keeps working. |
| `--raise-n` | `20` | How far `.raise` lifts off the plane. |

The tool itself (`--divot-reach`, `--divot-soft`, `--divot-inner`,
`--divot-nudge`, the two `--divot-src-*` light sources) is documented in
`css/core.css`. To bring your own palette, link `css/core.css` alone and
define `--bg`, `--edge-hi`, `--edge-lo`, `--ink`, `--ink-dim`, `--ink-faint`.

## The rules

1. Set the ground on the container.
2. Never hardcode the wall colours.
3. Don't scale the profile; strength is contrast, not size.
4. Emphasis is a storey, not a colour.
5. Keep the focus ring.

## Development

```sh
git clone https://github.com/nlaz/divot.css.git && cd divot.css
python3 -m http.server 8000   # the site, with the real stylesheet
npm run build                 # regenerate divot.css after editing css/
```

`css/` is the package. `site/` is page-only and never shipped. The root
`divot.css` is generated; commit it after `npm run build` (`npm run check`
fails when it is stale). Pull requests should keep the one-class contract,
add no colours, no dependencies and no JavaScript, and include screenshots
in light, dark and forced-colors for visual changes. Wells, tabs, cards and
menus are the host page's business. Unsure? Open an
[issue](https://github.com/nlaz/divot.css/issues) first.

## License

[MIT](LICENSE) © 2026 Niko Lazaris

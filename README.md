# divot.css - A simple skeuomorphic button style

v0.2.0 · **[nlaz.github.io/divot.css](https://nlaz.github.io/divot.css)**

Real physical buttons are so satisfying to press, and I wanted to try to bring that feeling to the web. The key feature of this stylesheet is a soft divot around the button that keeps its face flush with the surface.

It’s a simple, no-frills skeuomorphic style that mimics light catching the edges of the cut. The result is a page that feels tangible and makes you want to click things.

## How to use it

To use this style, just add the `divot` class name plus any modifier class.

| Class | |
|---|---|
| `.divot` | The default, flush with the page. |
| `.divot[aria-pressed="true"]` | A toggle held down while on. |
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

## Customize your light source

`--divot-light-angle` is the light source variable. The default,
`315deg`, is the top-left. You can set it on `:root` to customize
the light for thepage.

```css
:root { --divot-light-angle: 135deg; }
```

## Other tokens

| Token | Default | |
|---|---|---|
| `--divot-strength` | `45` | 0–100. The only knob you should normally touch. |
| `--divot-ground` | `var(--background)` | The plane being cut. Should match what is behind the button. |
| `--divot-light-angle` | `315deg` | Light source variable, clockwise from 12. |
| `--divot-radius` | `0px` | Corner radius. Square at rest. |
| `--divot-padding-y` / `--divot-padding-x` | `5px` / `12px` | The box. Override these, not `padding`, so the press offset keeps working. |
| `--divot-raise-strength` | `20` | How far `.raise` lifts off the plane. |

The tool itself (`--divot-inner-width`, `--divot-inner-blur`, `--divot-inner-strength`,
`--divot-press-offset`, the two `--divot-highlight` / `--divot-shadow` light sources) is documented in
`src/core.css`. To bring your own palette, link `src/core.css` alone and
define `--background`, `--edge-high`, `--edge-low`, `--ink`, `--ink-dim`, `--ink-faint`.

## Repository layout

| Path | |
|---|---|
| `divot.css` | The library, bundled into one file. This is the download. Built by `npm run build`; don't edit it by hand. |
| `src/` | The library source: `tokens.css` (the default palette and `.ground-*` classes), `core.css` (the button) and `divot.css` (an entry that imports both). |
| `index.html`, `site/` | The landing page at nlaz.github.io/divot.css. Page-only; none of it ships with the library. |
| `scripts/build.mjs` | Writes `divot.css` from `src/`. `npm run check` fails if the bundle is stale. |

# divot.css - A simple skeuomorphic button style

v0.2.0 · MIT · **[nlaz.github.io/divot.css](https://nlaz.github.io/divot.css)**

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

`--divot-light` is the light source variable. The default,
`315deg`, is the top-left. You can set it on `:root` to customize
the light for thepage.

```css
:root { --divot-light: 135deg; }
```

## Other tokens

| Token | Default | |
|---|---|---|
| `--divot-n` | `45` | Strength, 0–100. The only knob you should normally touch. |
| `--divot-ground` | `var(--bg)` | The plane being cut. Should match what is behind the button. |
| `--divot-light` | `315deg` | Light source variable, clockwise from 12. |
| `--divot-r` | `0px` | Corner radius. Square at rest. |
| `--divot-pad-y` / `--divot-pad-x` | `5px` / `12px` | The box. Override these, not `padding`, so the press nudge keeps working. |
| `--raise-n` | `20` | How far `.raise` lifts off the plane. |

The tool itself (`--divot-reach`, `--divot-soft`, `--divot-inner`,
`--divot-nudge`, the two `--divot-src-*` light sources) is documented in
`css/core.css`. To bring your own palette, link `css/core.css` alone and
define `--bg`, `--edge-hi`, `--edge-lo`, `--ink`, `--ink-dim`, `--ink-faint`.

## License

[MIT](LICENSE) © 2026 Niko Lazaris

# divot.css

A simple skeuomorphic button style for a satisfying button experience.

v0.2.0 · MIT · **[nlaz.github.io/divot.css](https://nlaz.github.io/divot.css)**

![divot.css](https://nlaz.github.io/divot.css/site/og.png)

Physical buttons are fantastic to press, and I wanted to bring that feeling
to the screen. The key feature of this stylesheet is a soft divot around the 
button that keeps its face flush with the surface. It's a simple, no-frills 
skeuomorphic style that mimics light catching the edges of the cut.

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

## Change your light source

`--divot-light` is the light source bearing, clockwise from 12 o'clock. The default,
`315deg`, is the top-left. Set it on `:root` for the page or on a container
for a region.

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

## License

[MIT](LICENSE) © 2026 Niko Lazaris

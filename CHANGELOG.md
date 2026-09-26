# Changelog

## 0.2.0

The chisel release, and the first one with a site: https://nlaz.github.io/divot.css/

- The cut is a chisel by default: two hard 1px bands a side, no blur.
  `--divot-reach` and `--divot-soft` remain for the gouge.
- Three storeys. `.raise` lifts one band; every press travels exactly one
  step down. There is no accent colour.
- Radius is an axis with a square rest position: `.eased` (3px) and `.pill`.
- The label nudges a quarter pixel toward the shadow on press, done through
  `--divot-pad-y` / `--divot-pad-x` rather than `padding`.
- New: `--divot-light`, the lamp bearing clockwise from 12 o'clock. The
  default `315deg` is pixel-identical to the fixed top-left cut, which stays
  as the fallback where CSS trigonometry is unavailable.
- Fixed: `.danger:hover` mixes both wall sources from the ink itself, so the
  cut reads as a cut on an ink ground in both themes and a press still sinks
  darker.
- Removed: the `.sel` state alias. Use `.on`, `.active` or
  `[aria-pressed="true"]`.
- Removed: the build-out. The package is the button and nothing else.
- Single-file bundle `divot.css` at the repo root, regenerated with
  `npm run build`.
- Licence changed to MIT.

## 0.1.0

First extraction from The Library: the gouge cut, tokens, grounds and the
specimen page.

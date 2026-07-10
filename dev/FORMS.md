# Forms

Flavor: two-column dialog table; sunken white wells on the gray canvas; every control
crisp-edged. Empty never looks disabled; dimming is the only unavailable signal.

## Wells and controls

- Text wells: depth from a tight inset shadow (1px, no dispersion), soft gray 1px
  border, square corners, 1.9rem. Placeholder-gray (#878787) for all passive glyphs.
- Select: OS9 popup button - flat face, `--button-edge` border, inset divider stopping
  short of top/bottom, black double-chevron, hard 1px shadow.
- Checkbox/radio: 1rem empty wells, crisp border, hard shadow; bold black overshooting
  check / black dot. Ref dev/img/os9-checkboxes.png.
- Switch (no OS9 ancestor - styled as family member): 40x18px track, 14px thumb,
  integer-pixel geometry for exact 1px gaps (rem fractions round unevenly), 5px radius
  both, flat `--primary` on. Checkbox check suppressed via `content: none`.
- Slider: thin sunken groove + "home plate" SVG thumb (grip bars, drop-shadow filter,
  sits 2px low). clip-path rejected: clips borders off the point.
- File: `::file-selector-button` gets button chrome. Color: square swatch, hard shadow.
- Progress/meter: sunken 0.7rem well, blue gradient fill, barber-pole indeterminate;
  meter zones green/yellow/red. Gotcha: `appearance:none` on meter breaks WebKit value
  pseudos - draw the well on `::-webkit-meter-bar`; FF branch via
  `@supports selector(::-moz-meter-bar)` (FF can't color zones).

## Type icons

- Right-edge glyphs identify types: search magnifier/x, number #, email @, tel handset,
  url globe, password key, calendar (date-likes), clock (time), triangle (datalist).
  Inline SVG, ink to the same viewBox edge so they align; placeholder gray.
- Search swaps magnifier to x when it has content: needs `placeholder`, gated by
  `@supports selector(::-webkit-search-cancel-button)` so FF never shows a dead x.
  No JS auto-placeholder (skipped; documented instead).
- Datalist native arrow is content, not background: hide indicator + `::-webkit-list-button`
  (!important; arrow only appears on hover/focus - headless verification misses it),
  triangle on the input. Suggestion popup is browser chrome, unstyleable - accepted.
- Sub-parts are WebKit-only; FF degrades to functional native parts.

## Validation and structure

- Tokens `--invalid` #c62828 / `--valid` #2e7d32, brighter than text `--danger`/`--success`;
  full 2px border, no halo.
- `:user-invalid` gets the red border (native constraints, post-interaction; separate
  rule so old engines keep the aria rule). No `:user-valid` auto-green: noise.
- Messages: `small[data-variant]` colors via the `--variant` map + `aria-describedby` -
  state is never color-only.
- Focus band: 3px at 78% opacity, offset 0 - hugs the frame like platinum. All
  focusables including buttons (deliberate modernization; OS9 had no button focus).
- Legend: sans, 1rem, left. Labels right-aligned in the left column.
- Action rows: explicit `<div class="cluster">`, right-aligned, default action rightmost
  (HIG dialog layout); markup order = visual order (no flex reordering: tab order).
  Multi-submit caveat: Enter fires the first DOM submit. No JS auto-wrapping; no
  Tailwind-style utility layer - conventions become defaults.

# Design Decisions

A log of settled design decisions and the reasoning behind them. Newest at the bottom.

## Button press timing (2026-07-09)

Interactive controls (buttons, menu items, pagination, tabs, nav links) share one transition rule.

- Press: 15ms
- Release (transform/box-shadow): 50ms
- Background fades: 80ms

Why: the original 120-150ms transition also ran on `:active`, so presses animated in slowly and
felt heavy. OS9 controls inverted essentially instantly on mousedown. A fast-but-present
transition was preferred over `transition: none` to keep the pixel shift from feeling raw.

Committed in fef5214.

## OS9 platinum button chrome (2026-07-09)

Buttons (`button`, button-like inputs, `[role="button"]`, `.button`) use:

- 1px uniform `--button-groove` border instead of the 2px light/dark bevel border
- Vertical platinum gradient face (light top, mid, darker bottom); shading lives inside the
  outline via soft inset highlights/shadows
- Pressed/`aria-pressed`: dark-to-light gradient with soft inset, no border flip
- min-height 1.9rem, line-height 1.2, padding 0.18/0.8/0.22rem
- Variants keep the same border; secondary/outline are tinted gradients, contrast is dark with
  its own inner shading

Why: reference screenshots (dev/img/os9-keyboard-ui.png) show OS9 buttons as short, with a thin
uniform outline and gradient shading, not the high-contrast Win95-style bevel. Label should
nearly fill the face. 1.9rem was picked over a more faithful 1.75rem for legibility/touch.

Scope: buttons only for now. Pagination links, sidebar nav buttons, and command palette items
still use the old bevel and need a matching consistency pass.

Not yet committed.

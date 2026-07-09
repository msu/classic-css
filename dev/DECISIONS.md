# Design Decisions

- **Button press timing** (2026-07-09, fef5214): press 15ms, release 50ms, background 80ms. Fast-but-present beats none; slow `:active` felt heavy. See usability/tog.md (latency) and usability/apple-hig-1992.md (instant inversion).
- **OS9 platinum button chrome** (2026-07-09): 1px `--button-groove` border, gradient face, soft insets; pressed = darker gradient, no border flip; 1.9rem min-height, line-height 1.2. Ref dev/img/os9-keyboard-ui.png. Buttons only; pagination/sidebar/palette still on old bevel.
- **Toolbar buttons** (2026-07-09): no size override; inherit standard button size.

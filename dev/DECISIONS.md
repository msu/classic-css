# Design Decisions

- **Button press timing** (2026-07-09, fef5214): press 15ms, release 50ms, background 80ms. Fast-but-present beats none; slow `:active` felt heavy. See usability/tog.md (latency) and usability/apple-hig-1992.md (instant inversion).
- **OS9 platinum button chrome** (2026-07-09): 1px `--button-groove` border, gradient face, soft insets; pressed = darker gradient, no border flip; 1.9rem min-height, line-height 1.2. Ref dev/img/os9-keyboard-ui.png. Buttons only; pagination/sidebar/palette still on old bevel.
- **Toolbar buttons** (2026-07-09): no size override; inherit standard button size.
- **OS9 form controls** (2026-07-09): text wells get depth from a tight inset shadow (1px, no dispersion), soft gray 1px border, square corners, 1.9rem. Select = popup button (flat face, `--button-edge` border, platinum arrow block, hard 1px shadow). Checkbox/radio = 1rem empty wells, crisp `--button-edge` border, hard shadow, bold black overshooting check / black dot (empty is not disabled). Legend sans/1rem/left. Refs dev/img/os9-forms.png, os9-checkboxes.png.
- **Validation tokens** (2026-07-09): `--invalid` #c62828 / `--valid` #2e7d32, brighter than `--danger`/`--success` text colors; full 2px border, no halo. Themeable independently.
- **Focus band** (2026-07-09): 3px at 78% opacity, `outline-offset: 0` — hugs the control frame like the platinum focus band. Applies to all focusables including buttons (OS9 had no button focus; keeping it is deliberate modernization).

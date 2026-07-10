# Buttons

Flavor: short platinum buttons with thin uniform outlines; shading lives inside the
border, never a hard Win95 bevel. Label nearly fills the face.

- Chrome: 1px `--button-groove` border, vertical platinum gradient face, soft inset
  highlight/shade, hard 1px drop shadow. Ref dev/img/os9-keyboard-ui.png.
- Size: min-height 1.9rem, line-height 1.2, padding 0.18/0.8/0.22rem. Toolbars inherit
  (no size override).
- Press: darker gradient + soft inset, no border flip. Timing: press 15ms, release 50ms,
  background 80ms - fast-but-present beats none; slow `:active` felt heavy.
- Variants: secondary/outline are tinted gradients, contrast is dark with its own inner
  shading, ghost is link-like.
- Default ring: 2px `--button-edge` outline, 1px offset, via
  `:is(button, input[type="submit"]):default` - only the true Enter-default gets it.
  Recolors to focus blue when focused. No ring when the likely action is dangerous:
  use `type="button"` (HIG). Ref dev/img/os9-button-ring.png.

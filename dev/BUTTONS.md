# Buttons

Flavor: short glossy buttons based on the CleanShot login-button reference: white
resting face, lavender hover, soft gray outline, and a crisp bottom shadow. Label
nearly fills the face.

- Chrome: 1px `--button-groove` border, white-to-gray gradient face, soft inset
  highlight/deeper bottom shade, and a short, tighter drop shadow.
- Size: min-height 1.9rem, line-height 1.2, padding 0.18/0.8/0.22rem. Toolbars inherit
  (no size override).
- Hover: lavender-blue fill with a subtle glow, matching the CleanShot GIF behavior.
- Press: larger 2px translation with a deeper lavender inset, intentionally more
  physical than the old 1px tap. Timing: press 15ms, release 50ms, background 80ms.
- Variants: secondary is cool graphite gray through hover/press so it separates from
  the lavender primary/outline path without becoming another primary action; contrast
  is dark with its own inner shading, ghost is link-like.
- Default ring: 2px `--button-edge` outline, 1px offset, via
  `:is(button, input[type="submit"]):default` - only the true Enter-default gets it.
  Recolors to focus blue when focused. No ring when the likely action is dangerous:
  use `type="button"` (HIG). Ref dev/img/os9-button-ring.png.

# Design Decisions

Global principles; category detail lives in the per-category files.

## Principles

- **Gray canvas**: the gray page background deliberately keeps both white elements
  (wells, cards) and dark elements (terminal pre) in play. Deviation from literal
  platinum is fine: platinum-inspired, not a pixel copy.
- **Empty is not disabled**: empty controls are white wells; dimming is the only
  unavailable signal.
- **Conventions become defaults**: when a classic convention exists (right-aligned
  action rows), it is the zero-markup default, not a helper class. Gaps get
  intent-named helpers, never property utilities.
- **Explicit over magic**: JS is for markup repair and behavior, never layout.
  Honest affordances only - no control advertises a click it cannot honor.
- **ARIA roles over custom classes**: whenever a standard role exists, it is the
  styling hook (tabs were first: class hooks removed). Corollary: roles are
  behavioral contracts, so docs must teach the script/keyboard obligations that
  come with them; link-navigation keeps link semantics (`nav` + `aria-current`).

## Categories

- [TYPOGRAPHY.md](TYPOGRAPHY.md) - stack, scale, links, code blocks
- [BUTTONS.md](BUTTONS.md) - chrome, timing, variants, default ring
- [FORMS.md](FORMS.md) - wells, controls, type icons, validation, action rows
- [NAVIGATION.md](NAVIGATION.md) - tabs (more as the nav pass continues)
- COMPONENTS.md, etc. as those passes happen (see tmp/ROADMAP.md)

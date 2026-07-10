# Navigation

Flavor: platinum folder tabs, flat menu bars, quiet chrome that shows where you are.

## Tabs

- Specificity gotcha: the button rules use `:is(button, input[type=...], ...)` which
  scores 0,1,1 - a bare `[role="tab"]` (0,1,0) loses to them silently when tabs are
  <button> elements. Scope role rules under their required container
  (`[role="tablist"] [role="tab"]`, 0,2,0). Applies to any future role styled onto
  buttons (menus, toolbars).
- ARIA roles are the ONLY hook: `[role="tablist"]`, `[role="tab"]` + `aria-selected`,
  `[role="tabpanel"]`. Class hooks (.tabs/.tab) removed. Roles are a behavioral
  contract: docs must say a paired script owns selection + arrow keys.
  `aria-selected="false"` optional for styling, kept in examples per APG.
- Folder shape: rounded-top rectangles (8px), flat sides - trapezoids rejected as too
  radical / out of family. Button-height (padding 0.2rem 0.85rem, line-height 1.2).
  Inactive: platinum gradient, weight 400. Selected: white, bold, 2px taller upward,
  no bottom border - connects through to the panel.
- Baseline technique: the strip paints its line as a background gradient inside the
  padding box; inactive tabs carry a matching 1px bottom border. Anything hanging
  below the strip gets clipped by `overflow-x: auto` - box-shadow/negative-margin
  merge tricks DO NOT survive it.
- Overflow: none - tabs must fit their container (docs: modest counts, short labels,
  select for long lists). Rejected: scroll w/ hidden bar (knife-cut tabs, invisible
  state; macOS always-on scrollbars also wedge between tabs and baseline - headless
  verification can't see that), ellipsis compression (clipped labels), wrapping
  (connect-through + wrapping are mutually exclusive in pure CSS: a selected tab in an
  upper row "connects" to the row below; Win95 property-sheet failure mode).
- Tabs touch (margin-right -1px, shared borders) like real OS9 strips; uniform height,
  no selected-tab rise (it kept causing baseline misalignment).
- Panel: regular-panel chrome (border-strong, radius, 2px raised drop) but flat white
  face; `[role="tablist"] + [role="tabpanel"]` fuses (no top border/radii/margin).
  Fancy surfaces are deliberately not fusable - fusion is a contract with known
  geometry.

## To do

- Menu bar hamburger panel, sidebar flattening, pagination consistency pass,
  breadcrumbs review, command palette affordance.

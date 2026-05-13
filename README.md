# classic.css

`classic.css` is a single-file CSS library for semantic HTML with an old desktop interface feel. It aims for a fixed-light, OS 9 / Windows 95 inspired style: platinum surfaces, visible bevels, sunken inputs, simple physical buttons, and page layouts that work without a build step.

## Goals

- Style semantic HTML reasonably well by default.
- Keep the core library to one CSS file.
- Make forms, buttons, panels, tables, nav, and common document elements usable without heavy class markup.
- Provide ARIA-friendly state hooks such as `aria-current`, `aria-invalid`, `aria-pressed`, and `aria-busy`.
- Support three page shells: topbar, sidebar, and mobile-style vertical scroll.

## Files

- `classic.css`: the library stylesheet.
- `demo/index.html`: topbar layout specimen for prose, tables, figures, lists, code, and document structure.
- `demo/forms.html`: form fixture for bare text/input pairs, label/input pairs, fieldsets, validation states, and native controls.
- `demo/components.html`: sidebar layout fixture for buttons, tabs, notices, menus, stats, dialogs, disclosure, progress, and pagination.
- `PROJECT-BRIEF.md`: the original project brief.

## Usage

Link the stylesheet directly:

```html
<link rel="stylesheet" href="classic.css">
```

The stylesheet is designed to work with normal HTML:

```html
<form>
  Name
  <input name="name">
</form>
```

Bare form text is visually placed in the left column and controls land in the right column. For actual click-to-focus label behavior, use real labels:

```html
<label for="name">Name</label>
<input id="name" name="name">
```

## Layouts

Apply one of these classes to `body`:

- `layout-topbar`: top navigation with a centered main content area.
- `layout-sidebar`: top navigation, left sidebar, and main content area.
- `layout-scroll`: narrow vertical scrolling layout for mobile-style forms and focused flows.

On narrow screens, topbar and sidebar layouts collapse into a vertical scroll flow.

## Class Reference

Most plain HTML elements are styled directly. These classes are available when you need a specific layout, variant, or component.

### Button Variants

Buttons style automatically on `button`, button-like inputs, `[role="button"]`, and `.button`.

- `secondary`: muted gray command button.
- `outline`: pale blue alternate button.
- `contrast`: dark high-contrast button.
- `ghost`: link-like button without bevel chrome.

Useful states:

- `aria-pressed="true"`: pressed/toggled button state.
- `aria-busy="true"`: busy state with spinner.
- `disabled` or `aria-disabled="true"`: disabled styling.

```html
<button>Default</button>
<button class="secondary">Save Draft</button>
<button class="outline" aria-pressed="true">Pinned</button>
<a href="#" role="button" class="ghost">Cancel</a>
```

### Layout Helpers

- `container`, `narrow`, `wide`: constrain content width.
- `grid`: responsive card/content grid.
- `grid-tight`: tighter grid gap.
- `stack`: vertical flow with consistent spacing.
- `stack-sm`: smaller stack spacing.
- `cluster`: horizontal wrapping group.
- `split`: two-sided row that wraps on small screens.
- `with-sidebar`: local two-column content/sidebar layout.
- `surface`: bordered raised panel.
- `band`: full-width horizontal section band.
- `bleed`: let an element escape the centered page width.

### Forms

Forms default to a two-column table layout. The left column is right-aligned and the right column holds controls.

- `field`: explicit label/control row.
- `field-row`: compatibility helper for grouping field markup; currently behaves as contents so rows align with the form table.
- `check`: checkbox/radio label row.
- `switch`: custom switch row.

Validation states are driven with ARIA:

```html
<input aria-invalid="true">
<input aria-invalid="false">
```

### Components

- `notice`: inset message block. Use `data-variant="info|success|warning|danger"`.
- `badge` / `tag`: small inline status labels. Use `data-variant` for color.
- `status`: inline status with a dot. Use `data-variant` for color.
- `toolbar`: compact command group.
- `menu`: command list.
- `pagination`: pagination list.
- `avatar`: circular initials marker.
- `stat`: compact metric panel.
- `dialog-preview`: displays a `dialog` inline for demos.

### Text Utilities

- `lead`: larger introductory paragraph.
- `muted`: subdued text.
- `compact`: reduce bottom margin.
- `text-center`: center text.
- `nowrap`: prevent wrapping.
- `visually-hidden`: accessible hidden text.

## Demo

Open `demo/index.html` in a browser, or serve the folder from the repository root:

```sh
python -m http.server
```

Then visit `http://localhost:8000/demo/`.

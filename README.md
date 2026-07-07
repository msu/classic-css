# classic.css

`classic.css` is a single-file CSS library for semantic HTML with an old desktop interface feel. It aims for a fixed-light, OS 9 / Windows 95 inspired style: platinum surfaces, visible bevels, sunken inputs, simple physical buttons, and page layouts that work without a build step.

## Goals

- Style semantic HTML reasonably well by default.
- Keep the core visual library to one CSS file.
- Make forms, buttons, panels, tables, nav, and common document elements usable without heavy class markup.
- Provide ARIA-friendly state hooks such as `aria-current`, `aria-invalid`, `aria-pressed`, and `aria-busy`.
- Support three-page shells: topbar, sidebar, and mobile-style vertical scroll.

## Markup Philosophy

Start with semantic HTML. Reach for classes only when HTML does not already have the concept you need, or when you are choosing a visual variant.

Good default markup:

```html
<article>
  <header>
    <h2>Lesson Notes</h2>
  </header>
  <p>Classic CSS styles the document structure directly.</p>
</article>

<form>
  <label for="name">Name</label>
  <input id="name" name="name">
</form>
```

Opt-in classes are for extras:

```html
<div class="notice" data-variant="warning">Check the required fields.</div>
<button class="secondary">Save Draft</button>
```

## Files

- `classic.css`: the library stylesheet.
- `classic.enhance.js`: optional progressive-enhancement helpers for semantic markup.
- `classic.commands.js`: optional command palette for semantic landmark navigation.
- `demo/index.html`: topbar layout specimen for prose, tables, figures, lists, code, and document structure.
- `demo/forms.html`: form fixture for bare text/input pairs, label/input pairs, fieldsets, validation states, and native controls.
- `demo/components.html`: sidebar layout fixture for buttons, tabs, notices, menus, stats, dialogs, disclosure, progress, and pagination.

## Usage

Link the stylesheet directly. This is the whole visual baseline:

```html
<link rel="stylesheet" href="classic.css">
```

Optional scripts add behavior, not the core look:

```html
<script src="classic.enhance.js"></script>
<script src="classic.commands.js"></script>
```

## CSS and JS Boundary

`classic.css` owns presentation:

- semantic element styling
- layouts and responsive collapse
- form table alignment
- button/input/panel chrome
- ARIA and data-attribute visual states

`classic.enhance.js` owns optional markup repair:

- converts bare form text before controls into real labels
- gives generated labels a matching input `id`
- adds a hamburger toggle to layout header navigation on narrow screens
- can be disabled per form with `data-classic-no-autolabels`

`classic.commands.js` owns optional command-palette behavior:

- opens with `Ctrl+K` or `Cmd+K`
- jumps to semantic landmarks such as `nav`, `main`, `forms`, `search`, `footer`, and `top`
- adds explicit section jumps from `data-jumpable`
- accepts custom commands through `window.ClassicCommands.register(...)`

The CSS should still be useful if neither script is loaded.

## Forms and Labels

The stylesheet can visually place bare form text in the left column:

```html
<form>
  Name
  <input name="name">
</form>
```

For actual click-to-focus label behavior, use real labels:

```html
<label for="name">Name</label>
<input id="name" name="name">
```

Or load `classic.enhance.js`, which converts bare text/control pairs into labels by default:

```html
<script src="classic.enhance.js"></script>
<form>
  Name
  <input name="name">
</form>
```

To opt out for a specific form, use `data-classic-no-autolabels`:

```html
<form data-classic-no-autolabels>
  Name
  <input name="name">
</form>
```

## Command Palette

The command palette opens with `Ctrl+K` or `Cmd+K`. Type commands like `nav`, `main`, `forms`, `search`, `footer`, or `top` to jump to semantic landmarks.

Command palette section jumps are explicit. Mark a destination with `data-jumpable`.

```html
<section
  id="billing"
  data-jumpable
  data-jump-label="Billing"
  data-jump-aliases="invoices payments"
  data-jump-description="Jump to billing section">
  ...
</section>
```

Jump attributes:

- `data-jumpable`: opt this element into the command palette.
- `data-jump-label`: command text shown in the palette.
- `data-jump-aliases`: extra search terms.
- `data-jump-description`: right-side context text in the palette.

If `data-jump-label` is omitted, the command palette falls back to `aria-label`, then `aria-labelledby`, then `id`. Unlabeled jump targets are skipped.

You can also register custom commands in script:

```html
<script>
  window.ClassicCommands.register({
    name: "billing",
    aliases: ["invoice", "payments"],
    description: "Jump to billing section",
    run() {
      document.querySelector("#billing")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
</script>
```

## Accessibility Notes

- Prefer real labels for forms. Bare form text is only visual until `classic.enhance.js` upgrades it.
- Keep visible focus states intact. The stylesheet uses `:focus-visible` for keyboard navigation.
- Use ARIA states only for state, not decoration: `aria-current`, `aria-invalid`, `aria-pressed`, and `aria-busy` should reflect real UI state.
- Use `data-jumpable` only on meaningful destinations with a label, ARIA label, or stable `id`.
- The command palette restores focus to the element that opened it and exposes results as a combobox/listbox pair.
- Motion is reduced when the user has `prefers-reduced-motion: reduce`.

## Layouts

Apply one of these classes to `body`:

- `layout-topbar`: top navigation with a centered main content area.
- `layout-sidebar`: top navigation, left sidebar, and main content area.
- `layout-scroll`: narrow vertical scrolling layout for mobile-style forms and focused flows.

All three layouts use a menu-bar header. On narrow screens, topbar and sidebar layouts collapse into a vertical scroll flow; with `classic.enhance.js` loaded, header navigation collapses behind a hamburger toggle.

## Class Reference

Most plain HTML elements are styled directly. These classes are available when you need a specific layout, variant, or component.

### Navigation

Header navigation links in topbar, sidebar, and scroll layouts render as compact menu-bar items. Use `brand` on the site or package identity link to keep it visually separate from page navigation. Load `classic.enhance.js` to collapse layout header navigation into a hamburger menu on narrow screens.

### Button Variants

Buttons style automatically on `button`, button-like inputs, `[role="button"]`, and `.button`.

- `secondary`: cool-gray command button.
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

- `grid`: responsive card/content grid.
- `grid-tight`: tighter grid gap.
- `stack`: vertical flow with consistent spacing.
- `stack-sm`: smaller stack spacing.
- `cluster`: horizontal wrapping group.
- `split`: two-sided row that wraps on small screens.
- `with-sidebar`: local two-column content/sidebar layout.
- `surface`: bordered raised panel.

### Forms

Forms default to a two-column table layout. The left column is right-aligned and the right column holds controls.

- `field`: explicit label/control row.
- `field-row`: compatibility helper for grouping field markup; currently behaves as contents so rows align with the form table.
- `check`: checkbox/radio label row.
- `switch`: custom switch row.

Validation states support both ARIA and native HTML validity:

```html
<input aria-invalid="true">
<input aria-invalid="false">
<input type="email" required>
<input pattern="[a-z0-9-]+" required>
```

### Optional Component Classes

These are not automatic semantic defaults. Add the class when you want the component treatment.

- `notice`: inset message block. Use `data-variant="info|success|warning|danger"`.
- `badge`: small inline status label. Use `data-variant` for color.
- `status`: inline status with a dot. Use `data-variant` for color.
- `toolbar`: compact command group.
- `menu`: command list.
- `pagination`: pagination list.
- `avatar`: circular-initials marker.
- `stat`: compact metric panel.
- `window`: window chrome container.
- `window-titlebar`: title row for window containers.
- `window-pane`: padded body pane for window containers.
- `window-statusbar`: status/footer row for window containers.
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

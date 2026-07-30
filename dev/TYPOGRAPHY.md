# Typography

Flavor: document, not landing page. Type is set once and does not scale with the window,
like a classic Mac app.

- Body stack: `Helvetica, Arial, sans-serif`.
- Heading stack: `Chicago, "ChicagoFLF", Charcoal, Helvetica, Arial, sans-serif`.
  The Chicago faces carry the classic Mac headline shape; Helvetica keeps body copy
  neutral and legible when the system does not have Chicago.
- Scale (all widths): h1 2.9 / h2 2.1 / h3 1.6 / h4 1.25rem; h5/h6 1rem uppercase.
  No viewport-based bumps.
- Headings: 700, heavy is intentional.
- Links: `--primary` blue; visited is `--visited` (#551a8b) early-web purple, unmistakable.
- Code: dark terminal `pre` is the default (gray-canvas principle); `pre.light` is the
  opt-in sunken listing for light contexts. Inline code/kbd/samp/mark/blockquote: as-is.
- Serif (`--font-serif`, Palatino) reserved for accents: stat numerals.
- Flow spacing: `pre` and headings carry top margins (space-4 / space-5) with
  `:first-child` guards - sibling margin collapsing keeps prose rhythm unchanged,
  but margin-less demo `div`s no longer stack flush against what follows.

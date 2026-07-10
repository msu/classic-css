# Typography

Flavor: document, not landing page. Type is set once and does not scale with the window,
like a classic Mac app.

- Stack: `Verdana, Geneva, Tahoma, sans-serif`. Real bold faces, identical Mac/Windows,
  peak early-web. Geneva-first rejected: synthetic bold made headings mushy.
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

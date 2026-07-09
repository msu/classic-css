# Krug: Don't Make Me Think (Revisited)

Summary from general knowledge of the book (3rd edition); page-level claims not verified
against the linked PDF.

## Core ideas

- **The first law**: a page should be self-evident. Every question mark in the user's head ("is that clickable?", "where am I?") adds cognitive load and erodes goodwill.
- **How people actually use pages**: they scan, they don't read; they satisfice (pick the first reasonable option, not the best); they muddle through without understanding how things work.
- **Design for scanning**: clear visual hierarchy (importance = prominence, related = grouped/nested), conventions over cleverness, obvious clickability, minimal noise, break pages into clearly defined areas.
- **Mindless choices**: users don't mind clicks, they mind thinking. Three effortless choices beat one hard one.
- **Omit needless words**: cut half the words, then cut half again. Happy talk and instructions are the first to go; instructions should be replaced by making the thing self-explanatory.
- **Navigation**: persistent nav answers "what's here, where am I, how do I get around". Page names matching what the user clicked, you-are-here indicators, breadcrumbs, and a clear home/site identity.
- **The trunk test**: dropped onto any page, you should instantly identify site name, page name, sections, local nav, where you are, and how to search.
- **Usability testing**: one morning a month with three users beats arguments about what "most people" like. Test early with rough versions.
- **Goodwill reservoir**: every friction (hidden info, punishing forms, decoration over utility) drains it; courtesy and honesty refill it.
- **Accessibility**: what's merely annoying for most users can be a hard blocker for others; the basics (semantics, labels, contrast, keyboard) are cheap.

## How this applies to classic.css

- Self-evident is the whole pitch of the bevel language: raised = press me, sunken = type here, flat = read me. Guard that vocabulary; never spend it decoratively.
- Conventions over cleverness endorses the library's semantic-HTML-first stance: standard elements behaving in standard ways.
- Visual hierarchy: the type scale, panel headers, and spacing scale exist so that markup order alone produces a scannable page. Everything shouting equally (e.g. a sidebar of identical heavy buttons) violates this.
- You-are-here: `aria-current` treatments on nav/tabs/pagination are the trunk test made real; keep them clearly distinct from hover states.
- Omit needless words: docs and demo copy should model terse labels; button names are verbs.
- Mindless choices supports the command palette and clear nav both existing: multiple easy routes to the same place is fine.

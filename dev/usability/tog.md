# Tog: First Principles of Interaction Design

Source: https://asktog.com/atc/principles-of-interaction-design/ (verified 2026-07-09)

## Core principles

- **Aesthetics**: visual design matters, but never trade usability for fashion.
- **Anticipation**: bring the user everything they need for the current step; don't make them hunt.
- **Autonomy**: users stay in charge, inside boundaries that prevent serious damage.
- **Color**: never use color as the only carrier of information.
- **Consistency**: user expectations beat internal logic; be most consistent where it matters most (behavior of standard controls).
- **Defaults**: sensible, visible, easy to change.
- **Discoverability**: don't hide functionality; visible controls beat memorized ones.
- **Efficiency of the user**: optimize for human time, not machine time.
- **Explorable interfaces**: clear paths, reversible actions, always an exit.
- **Fitts's Law**: bigger and closer targets are faster; size targets by importance.
- **Human-interface objects**: controls should look, behave, and respond in standard predictable ways.
- **Latency reduction**: acknowledge input within ~50ms; keep users informed during waits.
- **Learnability**: for tools used habitually, prioritize ease of use over ease of first learning.
- **Metaphors**: use familiar metaphors, but let the computer exceed the real-world original.
- **Protect users' work**: never lose work to errors or failures.
- **Readability**: high contrast, adequate sizes; data matters more than labels.
- **Simplicity**: progressive revelation, not hidden capability.
- **State**: remember where the user was; resume cleanly.
- **Visible navigation**: show where the user is and where they can go.

## How this applies to classic.css

- Latency reduction is why button press feedback must be near-instant (see DECISIONS.md, press timing).
- Fitts's Law argues for generous control heights and full-width mobile buttons; watch touch-target sizes (44px guidance) when tightening chrome.
- Discoverability is the standing critique of the Ctrl+K command palette: keyboard-only invisible features need a visible affordance.
- Color: `data-variant` colors must always pair with text or an icon (badges/status/notices carry text; keep it that way).
- Visible navigation: `aria-current` styling on nav, breadcrumbs, and tabs is core, not decoration.
- Human-interface objects: bevels must mean "pressable"; sunken means "editable". Don't spend the bevel language on non-interactive panels.

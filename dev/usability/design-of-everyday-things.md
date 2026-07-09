# Norman: The Design of Everyday Things

Summary from general knowledge of the book (revised edition); page-level claims not
verified against the linked PDF.

## Core ideas

- **Affordances**: what an object's properties allow (a flat plate affords pushing). In screen design what matters is *perceived* affordance.
- **Signifiers**: the perceivable cues that communicate the affordance (the bevel, the label, the underline). Most "affordance" problems are missing signifiers.
- **Mapping**: controls should relate spatially/logically to their effects (label next to its field, knob next to its burner).
- **Feedback**: every action needs an immediate, informative response, proportionate to the action.
- **Conceptual models**: people act on the model the design projects; a good design tells a coherent story about how it works.
- **Constraints**: physical, logical, semantic, and cultural constraints prevent errors before they happen (a plug that only fits one way).
- **Discoverability**: from signifiers + constraints + mappings + feedback, a user can figure out what actions are possible and how.
- **Gulfs of execution and evaluation**: the gap between intent and knowing how to act, and between acting and knowing what happened. Good design bridges both.
- **Seven stages of action**: goal, plan, specify, perform / perceive, interpret, compare. Design questions map to each stage.
- **Knowledge in the world vs. in the head**: visible options, labels, and conventions beat memorization; don't require recall where recognition works.
- **Errors: slips vs. mistakes**: slips are right intention, wrong execution (prevent with constraints and confirmation of destructive acts); mistakes are wrong intention (prevent with better models and feedback). Design assumes errors will happen and makes them cheap to undo.
- **Forcing functions**: interlocks and lockouts that physically prevent the wrong action at the critical moment.
- **Norman's own maxim**: when a design needs a sign or an instruction, the design has failed.

## How this applies to classic.css

- Signifiers are the library's currency: bevel = clickable, well = editable, ring = default action, dimmed = unavailable. Every control state should be a deliberate signifier, and no signifier should lie (gray-filled unchecked checkboxes read "disabled" - a lying signifier).
- Feedback: instant press inversion, focus outlines, `aria-busy` spinners, validation states. Feedback must be immediate (see press-timing decision) and proportionate.
- Mapping: the two-column form table puts labels physically adjacent to their controls; keep label-control proximity tighter than row-to-row spacing.
- Constraints and slips: destructive actions should never sit where muscle memory expects safe ones (HIG alert layout); default-button ring marks the safe expected action.
- Knowledge in the world: visible nav and labeled controls over memorized shortcuts; the command palette is head-knowledge and needs a world-knowledge affordance.
- Gulf of evaluation: after submit/toggle/expand, state changes must be visible (aria-expanded hamburger, aria-pressed depression, aria-current highlight).

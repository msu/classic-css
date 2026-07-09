# Apple Human Interface Guidelines (1992)

Source: https://vintageapple.org/inside_r/pdf/Human_Interface_Guidelines_1992.pdf
(Chapter 1 and the dialog/controls chapters read directly, 2026-07-09)

The authoritative spec for the look this library emulates. Part 1 is philosophy;
Part 2 is concrete element-by-element guidance (menus, windows, dialogs, controls,
icons, color, behaviors, language).

## The eleven design principles (Chapter 1)

- **Metaphors**: concrete, familiar metaphors set expectations; don't let the metaphor's real-world limits cap the computer's abilities.
- **Direct manipulation**: objects stay visible; effects of actions on them are immediately visible.
- **See-and-point**: noun-then-verb; users choose from what they can see rather than recall commands.
- **Consistency**: within the product, with earlier versions, with platform standards, with metaphors, with expectations. Expectations are the hardest and most important.
- **WYSIWYG**: no hidden features behind abstract commands; if you stage complexity, show where the rest lives.
- **User control**: the user initiates actions; warn rather than forbid.
- **Feedback and dialog**: acknowledge every action immediately; report status in plain human language, never raw codes.
- **Forgiveness**: actions are reversible; warn before irretrievable loss. Frequent alerts indicate a design problem.
- **Perceived stability**: consistent graphic elements and a finite set of objects/actions; unavailable actions dim, they don't disappear.
- **Aesthetic integrity**: simple graphics, no arbitrary symbols, never change the meaning of a standard element (e.g. checkboxes are always multiple-choice, radios exclusive).
- **Modelessness**: avoid modes; acceptable ones are long-term, spring-loaded, or alerts, and any mode needs a clear visual indicator near the affected object.

Plus two "additional issues": know your audience, and accessibility (varied abilities, input devices, languages).

## Concrete specs worth honoring (Chapters 6-7)

- **Buttons**: rounded rectangles named with text, sized to fit the name; standard OK/Cancel width 59px, standard height 20px (i.e. short). Press inverts the button; keyboard activation flashes the inversion (~8 ticks) so the user sees it took effect.
- **Default button**: an extra 3px black ring separated by 1px of white around the button for the action the user most likely wants. Return/Enter activate it. No default button when the likely action is dangerous; then Return does nothing. Don't draw a default ring at all if Return is used for text entry.
- **Cancel**: always mapped to Escape and Cmd-period; means "return to the prior state, no side effects". Use Done/Stop/Revert etc. when the semantics differ.
- **Button names**: a verb describing the action, one word if possible, never more than three; caps/lowercase; ellipsis when the button opens a dialog that gathers more input. Specific verbs (Save, Don't Save, Revert) beat OK/Yes/No.
- **Alert layout**: action button lower-right, Cancel to its left; the icon upper-left; destructive options (Don't Save) placed away from the safe ones. Eye moves upper-left to lower-right.
- **Alert severity**: note (info, one OK), caution (proceed/cancel), stop (can't proceed). Message text says what happened and how to fix it, in the user's vocabulary, naming the document/app concerned.
- **Radio buttons**: 2 to ~7 exclusive options, always at least two visible; never initiate an action; never change contents dynamically; label the group.
- **Checkboxes**: independent on/off options; label must imply both states clearly; the box is empty when off (an empty control is not a disabled control).
- **Disabled**: dimming, and dimmed items remain visible (perceived stability).
- **Dialog spacing**: consistent white space; the 1992 numbers are 13px margins and 23px left text inset - the point is one consistent spacing system.
- **Keyboard navigation in dialogs**: Tab/Shift-Tab cycle fields; exactly one active area with exactly one focus indicator at a time.

## How this applies to classic.css

- The default-button ring (outline + offset on `[type="submit"]`) is straight from this spec and is on the SUGGESTIONS list.
- Button proportions: HIG buttons are short with the label filling the face - the rationale behind the 1.9rem button height decision.
- Instant press inversion is the rationale behind the press-timing decision.
- Unchecked checkboxes/radios should read as empty wells, not gray spheres (empty != disabled).
- `aria-disabled`/`:disabled` dimming at 0.58 opacity matches the dimming convention; keep disabled controls visible.
- Notice variants map loosely to note/caution/stop severity; docs should encourage message text that names the thing and the remedy.
- Form button conventions (primary action rightmost in a row, specific verbs) belong in the docs even where CSS can't enforce them.

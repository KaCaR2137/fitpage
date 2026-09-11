---
name: FitPage
description: Dark, single-accent visual system for one-page personal-trainer websites — "The Late-Night Session"
colors:
  stadium-amber: "#f5c518"
  stadium-amber-bright: "#ffd23f"
  ink: "#1a1a1a"
  pure-black: "#000000"
  near-black: "#0a0a0a"
  text-primary: "#f2f2f2"
  text-invert: "#f6f6f6"
  text-muted: "#d6d6d6"
  surface-card: "rgba(255, 255, 255, 0.05)"
  hairline: "rgba(255, 255, 255, 0.14)"
  hairline-faint: "rgba(255, 255, 255, 0.08)"
  nav-scrim: "rgba(0, 0, 0, 0.72)"
  error: "#d64545"
typography:
  display:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif"
    fontSize: "clamp(1.9rem, 6vw, 3.1rem)"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif"
    fontSize: "clamp(1.6rem, 4vw, 2rem)"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  title:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif"
    fontSize: "1.15rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "normal"
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "normal"
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif"
    fontSize: "0.9rem"
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: "normal"
rounded:
  xs: "6px"
  sm: "10px"
  md: "14px"
  pill: "999px"
  circle: "50%"
spacing:
  xs: "6px"
  sm: "12px"
  md: "20px"
  lg: "24px"
  xl: "28px"
  section-y: "52px"
  section-y-lg: "88px"
components:
  button-primary:
    backgroundColor: "{colors.stadium-amber}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "14px 28px"
  button-primary-hover:
    backgroundColor: "{colors.stadium-amber-bright}"
  nav-cta:
    backgroundColor: "{colors.stadium-amber}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "9px 18px"
  card:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.text-muted}"
    rounded: "{rounded.md}"
    padding: "24px"
  step-card:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.text-muted}"
    rounded: "{rounded.md}"
    padding: "28px 24px"
  input:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.sm}"
    padding: "12px 14px"
---

# Design System: FitPage

## Overview

**Creative North Star: "The Late-Night Session"**

FitPage looks like a training studio after hours: the room is black, and a single
warm lamp picks out only what matters. That lamp is **Stadium Amber** (`#f5c518`) —
floodlight yellow, light rather than paint — and it touches almost nothing: the
button to press, the link to follow, the number of the step you are on, the glow
under the phone. Everything else is dark glass. The register is focused and
disciplined, never loud — discipline shown, not shouted.

The page itself carries the only real drama: one vertical gradient from pure black
at the top, through ember, to full gold at the very bottom, spanning the whole
document rather than any single section. Content sits directly on it — no card,
no panel, nothing between the words and the light. Section rhythm comes entirely
from padding, not boxes: the room has no furniture, just distance. Depth is
almost entirely absent at rest; shadows appear only when something lifts — a
button on hover, the phone mockup drifting in "O nas," a handful of small
component cards (portfolio, steps, form fields) that keep their own faint fill.

Type is deliberately un-styled: the native system font stack, no web fonts,
hierarchy built from weight (700–800) and tight tracking. The restraint is the
point — the interface should feel engineered and calm so the trainer's own words
and image are the loudest thing on screen.

**Key Characteristics:**
- One accent (Stadium Amber), on roughly 10% or less of any screen.
- A single document-length black→gold gradient; sections never repaint it, and
  none of them carry a background of their own — content sits directly on it.
- Section rhythm is padding/margin only; no card, border, or box ever separates
  one section from the next.
- Full 999px pills for actions; a 6 / 10 / 14px radius ladder for everything else.
- System-font typography; weight and tracking do the work.
- Dark-only; no light theme exists or is planned.
- Motion gated behind `.js` and `prefers-reduced-motion`, always with a static fallback.

## Colors

A near-monochrome dark field with one saturated amber accent and a single
document-wide black→gold gradient behind everything.

### Primary
- **Stadium Amber** (`#f5c518`): the only accent. Primary button fill, nav CTA
  fill, step-number badges, the `req` asterisk, focus outlines, and the radial
  glow behind the phone mockup. Reads as a light source, not a surface color.
- **Stadium Amber Bright** (`#ffd23f`): the hover/active shift of the accent, and
  the resting color of every text link (card links, footer link, "back" links,
  "Więcej" toggles, FAQ `+`/`–` marker, success status text).

### Neutral
- **Pure Black** (`#000000`): the `html` background and the top of the page
  gradient. The floor the whole system sits on.
- **Near Black** (`#0a0a0a`): the one opaque surface — the footer.
- **Surface Card** (`rgba(255,255,255,0.05)`): cards, step cards, inputs, the RODO
  box, FAQ items — small component-level surfaces. The only "lift" left in the
  system now that sections themselves carry no background at all.
- **Hairline** (`rgba(255,255,255,0.14)`) / **Hairline Faint**
  (`rgba(255,255,255,0.08)`): borders and dividers. Because fills are nearly
  invisible, the border is what defines a shape.
- **Nav Scrim** (`rgba(0,0,0,0.72)`): the sticky nav background, over an 8px blur.
- **Text Primary** (`#f2f2f2`): default body and heading text; also the emphasis
  color for `<strong>` inside muted copy.
- **Text Invert** (`#f6f6f6`): hero and nav text (functionally identical to Text
  Primary; kept as a separate token for hero/nav context).
- **Text Muted** (`#d6d6d6`): body copy inside sections, card and step text, form
  hints, FAQ answers — most running prose. Lifted from `#c4c4c4` to clear WCAG AA
  (4.5:1) against the gradient itself — the gradient's bright stops are now
  compressed to the very bottom (see The Single Gradient Rule) precisely so this
  token stays legible with no panel behind it to dim the background first.

### State
- **Error** (`#d64545`): invalid input borders after a submit attempt and the
  error status line. A state color only — never an accent.

### Named Rules
**The One Lamp Rule.** Stadium Amber appears on ~10% or less of any screen. It is
for the single next action, links, focus, step numbers, and the phone glow — never
a large fill and never a run of text. Its scarcity is the signal.

**The Single Gradient Rule.** The black→gold gradient
(`linear-gradient(180deg, #000 0%, #050505 25%, #1c1700 45%, #2e2400 62%,
#3d3000 78%, #523f00 96%, #f5c518 100%)`) is painted once, on `body`, across the
full document height. No section carries a background of its own — content sits
directly on the gradient, separated from its neighbours by padding alone. Never
repaint a section opaque (the footer is the sole deliberate exception). The bright
stops are compressed into the final ~4% on purpose: body text now sits straight on
the gradient with nothing dimming it, so the ramp must stay dark everywhere real
content can reach and only bloom into full gold in the margin the opaque footer
covers.

## Typography

**Display / Body / Label Font:** the native system UI stack —
`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial,
sans-serif`. No web fonts load. No distinct display or monospace face.

**Character:** neutral and highly legible by design. All personality comes from
weight (700–800), negative tracking on headings, and generous body leading (1.65).
The type should feel engineered, not expressive.

### Hierarchy
- **Display** (700, `clamp(1.9rem, 6vw, 3.1rem)`, line-height 1.2, tracking
  -0.02em): the hero headline only — one per page.
- **Headline** (700, `1.6rem`, rising to `2rem` at ≥700px, line-height 1.2,
  tracking -0.02em): section titles (`.section__title`). One per section.
- **Logo** (800, `1.25rem`, tracking -0.03em): "Fit" in Stadium Amber, "Page" in
  white. Repeated in the footer as a plain 800-weight wordmark.
- **Title** (600–700, `1.1rem`–`1.15rem`, line-height 1.2): card titles, step
  titles, FAQ and "Więcej" summaries.
- **Body** (400, `1rem`, line-height 1.65): running copy in Text Muted, with
  `<strong>` promoted to Text Primary. Prose blocks capped near 680px wide.
- **Label / Micro** (600 for field labels at `0.9rem`; 400 for hints, required
  notes and captions at `0.8rem`; 600 for "Więcej" toggles at `0.82rem`): Text
  Muted, except labels and legends which use Text Primary.

### Named Rules
**The System-Font Rule.** Do not load a web font to "improve" the type. Hierarchy
is built from weight and tracking on the system stack; a custom face would fight
the engineered, get-out-of-the-way character of the system.

## Layout

- **Container:** `max-width: 1080px`, centered, `20px` inline padding. One width
  for all content.
- **Section rhythm:** `52px` vertical padding per section on mobile, `88px` from
  700px up. The container adds a further `40px` / `44px` internal top / bottom
  padding — no panel wraps it, this is pure spacing.
- **Breakpoints:** `480px` (footer switches to a justified row), `700px` (mobile
  hamburger menu boundary; section rhythm and section-title size step up; process
  steps go 1-col → 3-col), `900px` (hero gains more vertical air; "O nas" flips
  from a stacked column to a `text | phone` row).
- **Grids:** portfolio is `repeat(auto-fill, minmax(280px, 400px))`; process steps
  are `1fr` → `repeat(3, 1fr)` at 700px, aligned to `start` so an expanded step
  grows without stretching its neighbours; "O nas" is a centered flex column
  (phone capped at 220px) → row at 900px (phone capped at 250px).
- **Anchor offset:** `[id] { scroll-margin-top: 84px }` clears the sticky nav on
  in-page jumps. `scroll-behavior: smooth`, reset to `auto` under reduced motion.
- **Nav:** sticky, `z-index: 50`, `min-height: 64px`, Nav Scrim background over an
  8px blur, hairline-faint bottom border. Below 700px it collapses to a hamburger
  that opens a full-width stacked dropdown on `rgba(0,0,0,0.96)` with hairline
  dividers between links.
- **Density:** roomy. Body line-height 1.65, generous section padding, 12–28px
  gaps between siblings.

## Elevation & Depth

Flat ground with shadow-on-lift. Sections carry no surface at all — no fill, no
blur, no border — so there is no "ground" to speak of below the small component
cards. Those cards (portfolio, steps, FAQ, form fields) are the only remaining
surfaces, and they stay flat at rest too: faint fill, hairline border, nothing
else. There is one deliberate exception: portfolio cards carry a single soft
ambient shadow at rest to anchor them on the bare gradient. Every other shadow on
screen means the element is being hovered, is `:target`, or is the animated
phone. The nav keeps its own scrim + blur — that one surface predates and sits
outside this rule, since it exists to stay legible while sticky over scrolling
content.

### Shadow Vocabulary
- **Card rest** (`box-shadow: 0 14px 40px rgba(0,0,0,0.45)` — the `--shadow`
  token): the only resting shadow. Portfolio cards only.
- **Button lift** (`box-shadow: 0 12px 28px rgba(245,197,24,0.35)` on `:hover`,
  with `translateY(-2px)`): an amber-tinted rise — the accent color spilling as
  light.
- **Phone drop** (`filter: drop-shadow(0 22px 46px rgba(0,0,0,0.5))`) plus a
  radial amber glow (`radial-gradient(closest-side, rgba(245,197,24,0.16),
  transparent 72%)`) on the figure's `::before`.
- **Step target** (`box-shadow: 0 0 0 1px var(--accent)` with an amber border):
  the `:target` step when linked from the process nav.
- **Focus ring** (`outline: 2px solid #f5c518`, `outline-offset: 1–2px`): every
  interactive element. Not a shadow, but the primary depth-cue for keyboard state.

### Named Rules
**The Lift-Means-Interactive Rule.** With the single exception of the portfolio
card's resting shadow, a shadow means the element is hovered, targeted, or the
animated phone. Resting surfaces read as flat glass.

## Shapes

- **Radius ladder:** `6px` (consent checkbox) · `10px` (inputs, FAQ items, RODO
  box) · `14px` (`--radius`; portfolio and step cards) · `999px` pills (primary
  button, nav CTA) · `50%` (the 40px circular step-number badge, the 44px atuty
  icon circles). Corners are always soft; no sharp edges anywhere. Sections
  themselves have no radius — nothing to round, there's no box.
- **Borders:** a `1px` hairline (`rgba(255,255,255,0.08–0.14)`) on nearly every
  surface. Since fills are near-transparent, the border is the shape.
- **Custom-drawn controls:** native form chrome is never shown. The checkbox is a
  22px rounded square with an inline SVG tick that scales `0 → 14px` on check;
  `<details>` markers are replaced with a `+` / `–` (or `+` / `\2013`) glyph.
- **Icons:** inline stroke SVGs, ~16px, `stroke-width: 2`, `currentColor`, round
  caps and joins (e.g. the card "open in new tab" arrow).

### Named Rules
**The Full Pill Rule.** Action elements (buttons, nav CTA) are full `999px` pills.
Everything else uses the 6 / 10 / 14px ladder. Do not mix radii within one
component and do not give an action a boxy radius.

## Components

### Buttons
- **Character:** tactile and confident — pills that lift and glow on hover, no bounce.
- **Shape:** full pill (`999px`).
- **Primary:** Stadium Amber fill, Ink (`#1a1a1a`) text, `14px 28px` padding,
  weight 600.
- **Hover / Focus:** background → Stadium Amber Bright, `translateY(-2px)`,
  amber-tinted shadow `0 12px 28px rgba(245,197,24,0.35)`; transition `0.18s`
  on the `cubic-bezier(0.22, 1, 0.36, 1)` ease. Transition removed under reduced
  motion.
- **Nav CTA:** same fill and text, smaller pill (`9px 18px`), always full opacity
  among the dimmed (0.85) nav links.
- **Secondary / Ghost:** none. Amber-bright text links fill that role.

### Cards / Containers
- **Sections themselves are not containers.** `.section > .container` carries no
  fill, border, blur, or radius — only the internal padding that spaces its
  content from the section edge. It is a spacing wrapper, not a surface.
- **Portfolio card:** Surface Card fill, hairline border, `14px` radius, resting
  shadow `0 14px 40px rgba(0,0,0,0.45)`, `overflow: hidden`, `24px` body padding.
- **Step card (`.krok`):** Surface Card fill, hairline border, `14px` radius,
  `28px 24px` padding, no resting shadow. A `40px` circular Stadium Amber badge
  with Ink text numbers it. On `:target`: amber border + `0 0 0 1px` amber ring.

### Inputs / Fields
- **Style:** Surface Card fill, hairline border, `10px` radius, `12px 14px`
  padding, inherits body font at Text Primary.
- **Focus:** `outline: 2px solid #f5c518`, `outline-offset: 1px`, border goes
  transparent.
- **Error / Disabled:** after a submit attempt, `.is-touched:invalid` borders in
  Error red; the `aria-live` status line turns Error red with a message.
- **Autofill:** forced dark — `-webkit-box-shadow: 0 0 0 1000px #1c1c1c inset`,
  text fill Text Primary.
- **Custom consent checkbox:** native input hidden but focusable and hit-testable;
  a drawn `22px` box (`6px` radius, hairline border). Checked = amber fill + Ink
  SVG tick scaling in + a `consent-pop` scale keyframe (1 → 1.22 → 0.94 → 1).
  Hover = amber border. `:focus-visible` = 2px amber outline. Animations drop
  under reduced motion.

### Navigation
- **Style:** sticky, `64px` min-height, Nav Scrim + `blur(8px)`, hairline-faint
  bottom border.
- **Links:** Text Invert at `0.85` opacity → `1` on hover, `0.95rem`. The CTA is a
  solid amber pill at opacity 1.
- **Mobile (< 700px):** a hamburger of three `2px` white bars toggles `.is-open`
  and `aria-expanded`; links become a full-width stacked dropdown on
  `rgba(0,0,0,0.96)` with hairline dividers; the menu closes on link click.

### Trust icons (atuty)
Four short facts in a row — Bezpłatna konsultacja / Cała Polska, zdalnie / 2 rundy
poprawek w cenie / Wyłącznie trenerzy personalni — near the bottom of the
homepage, after Kontakt and before FAQ. No panel; the block sits directly on the
gradient, like the hero.
- **Icon:** `44px` circle, `1px` hairline border, a custom-drawn `24px`-viewBox
  stroke SVG (same stroke system as the portfolio card's arrow) rendered at
  `22px`, centered.
- **Color:** neutral (Text Invert) on three of four icons; exactly one — the most
  action-adjacent fact — gets Stadium Amber on both border and stroke. The One
  Lamp Rule applied at component scale: amber marks a single item, never all four
  at once.
- **Label:** `0.9rem`, weight 600, `rgba(246,246,246,0.78)` — the same treatment
  as the hero subtitle.
- **Grid:** 2 columns on mobile, 4 from 700px.

### Floating phone (signature)
The "O nas" mockup (`mockup1.png`, 500×833) is the one showpiece and the only place
motion is decorative rather than functional. Three independent layers:
- The `<figure>` carries the scroll reveal — slides in from the lower-right with a
  `3.5deg` rotate and `0.92` scale over `1s` (a longer glide than the standard
  `0.6s` `.reveal`).
- The `<img>` runs a `4s` infinite `phone-float` (`translateY(-14px)` + `-1.4deg`).
- The `::before` radial amber glow runs `phone-glow` on the same `4s` beat
  (opacity `0.7 → 1`, scale `1 → 1.07`).
- Grounded by `drop-shadow(0 22px 46px rgba(0,0,0,0.5))`. All three layers freeze
  static under `prefers-reduced-motion`.

## Do's and Don'ts

### Do:
- **Do** let the page gradient show fully — no section carries a background of
  its own; separate sections with padding/margin only, never a box.
- **Do** verify body and secondary text clears 4.5:1 *against the bare gradient*
  at every scroll position — there is no panel dimming it anymore, so the
  gradient's own stops are the only thing keeping contrast safe. Check at the
  FAQ, the atuty strip, and the footer approach, where the gradient is warmest.
- **Do** keep Stadium Amber rare: the next action, links, focus rings, step
  numbers, the phone glow. Running copy stays Text Muted / Text Primary.
- **Do** use full `999px` pills for actions and the `6 / 10 / 14px` ladder
  for every other corner.
- **Do** gate every animation behind the `.js` class and `prefers-reduced-motion`,
  with the content fully visible and usable when both are off.
- **Do** put a `2px` Stadium Amber focus outline (`outline-offset: 1–2px`) on
  every interactive element.
- **Do** draw custom controls (checkbox, `<details>` markers, icons) from scratch
  in the dark palette instead of styling native chrome.
- **Do** define shapes with the hairline border — fills are almost invisible on
  their own.

### Don't:
- **Don't** ship the template look: no stock hero photo, no grid of identical
  rounded cards, no gradient-filled buttons. This is the one confirmed
  anti-reference.
- **Don't** give a section its own background, border, blur, or radius of any
  kind — no panel, no card, no translucent fill. Sections are pure spacing.
  (The footer, `#0a0a0a`, is the sole opaque exception, and the small
  component-level cards — portfolio, steps, FAQ, form fields — keep their own
  faint fill; neither is a section-level panel.)
- **Don't** use amber for large fills or runs of text; its scarcity is the point.
- **Don't** add a second accent hue. Amber + neutral only; Error red (`#d64545`)
  is a state color, not an accent.
- **Don't** introduce or assume a light theme. The system is dark-only — `html`
  is `#000` and only dark tokens exist.
- **Don't** load a web font to "fix" the typography; weight and tracking carry the
  hierarchy.
- **Don't** let a shadow sit on a resting surface (portfolio card excepted) —
  shadows mean hover, `:target`, or the animated phone.

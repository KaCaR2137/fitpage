---
name: FitPage
description: Light, single-accent visual system for one-page personal-trainer websites — "The Morning Session"
colors:
  bottle-green: "#1F3D2B"
  leaf-green: "#2C6B47"
  ivory: "#FBF8F0"
  canvas: "#F7F3EA"
  pine-black: "#16211B"
  text-primary: "#202821"
  text-muted: "#52594F"
  surface-card: "rgba(31, 61, 43, 0.05)"
  hairline: "rgba(31, 61, 43, 0.16)"
  hairline-faint: "rgba(31, 61, 43, 0.10)"
  nav-scrim: "rgba(247, 243, 234, 0.85)"
  error: "#A13333"
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
    backgroundColor: "{colors.bottle-green}"
    textColor: "{colors.ivory}"
    rounded: "{rounded.pill}"
    padding: "14px 28px"
  button-primary-hover:
    backgroundColor: "{colors.leaf-green}"
  nav-cta:
    backgroundColor: "{colors.bottle-green}"
    textColor: "{colors.ivory}"
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

**Creative North Star: "The Morning Session"**

FitPage now looks like a training space at first light: pale cream walls, the
calm of early morning before the noise starts. The one deep note is
**Bottle Green** (`#1F3D2B`) — not a light source anymore, but a mark: ink, a
stamp, the color of a well-kept mat — and it touches almost nothing: the button
to press, the link to follow, the number of the step you're on. Everything else
is quiet, warm off-white. The register is exactly what it always was — focused
and disciplined, never loud — just relit.

The page itself is one flat canvas (`#F7F3EA`), painted once on `body`. No
gradient, no variation by scroll position — the same tone from the first pixel
to the last. There is no card, no panel: content sits directly on the canvas,
section rhythm built entirely from padding, not boxes. Depth is almost entirely
absent at rest; shadows appear only when something lifts — a button on hover,
the phone mockup drifting in "O nas," a handful of small component cards
(portfolio, steps, form fields) that keep their own faint tinted fill. The one
deliberately dark note left anywhere in the system is the footer — a near-black
forest green, the single anchor at the bottom of an otherwise light page.

Type is unchanged: the native system font stack, no web fonts, hierarchy built
from weight (700–800) and tight tracking. The restraint is still the point —
the interface should feel engineered and calm so the trainer's own words and
image are the loudest thing on screen.

**Key Characteristics:**
- One accent (Bottle Green), on roughly 10% or less of any screen.
- A flat cream canvas (`#F7F3EA`), painted once on `body` — no gradient, no
  per-section repaint.
- Section rhythm is padding/margin only; no card, border, or box ever separates
  one section from the next.
- Full 999px pills for actions; a 6 / 10 / 14px radius ladder for everything else.
- System-font typography; weight and tracking do the work.
- Light-only, by deliberate choice — not a default light/dark pairing, a single
  committed direction. No dark theme exists or is planned.
- Motion gated behind `.js` and `prefers-reduced-motion`, always with a static fallback.

## Colors

A warm, near-monochrome light field with one saturated deep-green accent and a
single dark anchor at the very bottom of the page.

### Primary
- **Bottle Green** (`#1F3D2B`): the only accent. Primary button fill, nav CTA
  fill, step-number badges, the `req` asterisk, focus outlines. Reads as a
  mark — ink, a stamp — not a wash of color.
- **Leaf Green** (`#2C6B47`): the hover/active shift of the accent, and the
  resting color of every text link (card links, "back" links, "Więcej"
  toggles, FAQ `+`/`–` marker, success status text) *outside the footer*.
  Inside the footer, links use Ivory instead — Leaf Green doesn't clear
  contrast against Pine Black (see Footer, under Components).

### Neutral
- **Canvas** (`#F7F3EA`): the `html` / `body` background — one flat color, the
  floor the whole system sits on. No gradient.
- **Pine Black** (`#16211B`): the one deliberately dark surface — the footer.
  The same structural role the old near-black footer always had, carried into
  the new palette family. It is not the accent, so this dark anchor doesn't
  spend the accent's scarcity on a large fill.
- **Ivory** (`#FBF8F0`): text and marks that sit *on* the accent fill — button
  labels, the nav CTA, step-number digits, the checkbox tick, footer text and
  links. The inverse of the old dark-theme "Ink" token: the accent used to be
  light (so it carried dark text); now the accent is dark, so it carries light
  text instead.
- **Surface Card** (`rgba(31,61,43,0.05)`): cards, step cards, inputs, the RODO
  box, FAQ items — small component-level surfaces, tinted from the accent hue
  for cohesion rather than plain gray.
- **Hairline** (`rgba(31,61,43,0.16)`) / **Hairline Faint**
  (`rgba(31,61,43,0.10)`): borders and dividers. Because fills are nearly
  invisible, the border is what defines a shape.
- **Nav Scrim** (`rgba(247,243,234,0.85)`): the sticky nav background, over an
  8px blur — canvas-tinted, not a separate color.
- **Text Primary** (`#202821`): default body and heading text; also the
  emphasis color for `<strong>` inside muted copy.
- **Text Muted** (`#52594F`): body copy inside sections, card and step text,
  form hints, FAQ answers — most running prose. ~6.5:1 on Canvas.

### State
- **Error** (`#A13333`): invalid input borders after a submit attempt and the
  error status line. Deepened from the old dark-theme `#d64545` — that value
  reads ~4:1 on Canvas (below AA); this one holds ~6.3:1. A state color only —
  never an accent.

### Named Rules
**The One Mark Rule.** Bottle Green appears on ~10% or less of any screen. It
is for the single next action, links, focus, and step numbers — never a large
fill and never a run of text. Its scarcity is the signal; it reads as ink, not
illumination. (Renamed from "The One Lamp Rule" — the old dark world's accent
was a light source, this one is a mark.)

**The Flat Canvas Rule.** One solid color (`#F7F3EA`) is painted once, on
`body`, and never varies by scroll position. No section carries a background
of its own; content sits directly on the canvas, separated from its neighbours
by padding alone. Never repaint a section opaque — the footer (Pine Black) is
the sole deliberate exception. (Replaces "The Single Gradient Rule": the
gradient is gone, but the underlying discipline — one background, painted
once, sections never repaint it — survives intact.)

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
- **Logo:** in the nav, the wordmark is now the image logo (`images/logo-fitpage.png`,
  a rounded-square "FP" badge, `36px` tall, alt text "FitPage"), not styled text.
  The footer keeps a plain 800-weight text wordmark ("FitPage", tracking -0.03em)
  in Ivory — the two don't need to match, since one is a mark and the other a
  small label.
- **Title** (600–700, `1.1rem`–`1.15rem`, line-height 1.2): card titles, step
  titles, FAQ and "Więcej" summaries.
- **Body** (400, `1rem`, line-height 1.65): running copy in Text Muted, with
  `<strong>` promoted to Text Primary. Prose blocks capped near 680px wide.
- **Label / Micro** (600 for field labels at `0.9rem`; 400 for hints, required
  notes and captions at `0.8rem`; 600 for "Więcej" toggles at `0.82rem`): Text
  Muted, except labels and legends which use Text Primary.

**Depth:** headings (`.hero__title`, `.section__title`, `.krok__title` — H1/H2
only, H3 titles like `.card__title` stay flat) plus the body text in the hero,
"O nas," and the on-page Kontakt blurb (`.hero__subtitle`, `.o-nas p`,
`.kontakt p`, `.kontakt__direct`) carry a subtle `text-shadow: 0 1px 3px
rgba(31,45,36,0.14)` — neutral, green-tinted like the rest of the system's
shadows, not the accent hue. A quiet lift, not a decorative glow. Elsewhere
(FAQ, portfolio cards, process steps, the form) body text stays flat; this is
a first pass scoped to the top of the page, not a blanket rule yet.

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
  that opens a full-width stacked dropdown on `rgba(247,243,234,0.98)` with
  hairline dividers between links.
- **Density:** roomy. Body line-height 1.65, generous section padding, 12–28px
  gaps between siblings.

## Elevation & Depth

Flat ground with shadow-on-lift. Sections carry no surface at all — no fill, no
blur, no border — so there is no "ground" to speak of below the small component
cards. Those cards (portfolio, steps, FAQ, form fields) are the only remaining
surfaces, and they stay flat at rest too: faint tinted fill, hairline border,
nothing else. There is one deliberate exception: portfolio cards carry a single
soft ambient shadow at rest to anchor them on the canvas. Every other shadow on
screen means the element is being hovered, is `:target`, or is the animated
phone. The nav keeps its own scrim + blur — that one surface predates and sits
outside this rule, since it exists to stay legible while sticky over scrolling
content.

### Shadow Vocabulary
- **Card rest** (`box-shadow: 0 14px 40px rgba(31,45,36,0.16)` — the `--shadow`
  token): the only resting shadow. Portfolio cards only. Green-tinted and soft
  rather than a flat black — a heavy black shadow reads harsh on a light,
  paper-like canvas.
- **Button lift** (`box-shadow: 0 12px 28px rgba(31,61,43,0.28)` on `:hover`,
  with `translateY(-2px)`): a green-tinted rise, echoing the accent.
- **Phone drop** (`filter: drop-shadow(0 22px 46px rgba(31,45,36,0.22))`) plus a
  soft green vignette (`radial-gradient(closest-side, rgba(31,61,43,0.10),
  transparent 72%)`) on the figure's `::before`. On the dark canvas this was a
  glow — light emanating in a dark room. On the light canvas the same layer
  reads as a quiet shadow/vignette instead; the mechanism didn't change, only
  what it now means visually.
- **Step target** (`box-shadow: 0 0 0 1px var(--accent)` with a Bottle Green
  border): the `:target` step when linked from the process nav.
- **Focus ring** (`outline: 2px solid #1F3D2B`, `outline-offset: 1–2px`): every
  interactive element. Not a shadow, but the primary depth-cue for keyboard state.

### Named Rules
**The Lift-Means-Interactive Rule.** With the single exception of the portfolio
card's resting shadow, a shadow means the element is hovered, targeted, or the
animated phone. Resting surfaces read as flat, tinted paper.

## Shapes

- **Radius ladder:** `6px` (consent checkbox) · `10px` (inputs, FAQ items, RODO
  box) · `14px` (`--radius`; portfolio and step cards) · `999px` pills (primary
  button, nav CTA) · `50%` (the 40px circular step-number badge, the 44px atuty
  icon circles). Corners are always soft; no sharp edges anywhere. Sections
  themselves have no radius — nothing to round, there's no box.
- **Borders:** a `1px` hairline (`rgba(31,61,43,0.10–0.16)`) on nearly every
  surface. Since fills are near-transparent, the border is the shape.
- **Custom-drawn controls:** native form chrome is never shown. The checkbox is a
  22px rounded square with an inline SVG tick that scales `0 → 14px` on check;
  `<details>` markers are replaced with a `+` / `–` (or `+` / `\2013`) glyph.
- **Icons:** inline stroke SVGs, ~16–22px, `stroke-width: 2`, `currentColor`,
  round caps and joins (e.g. the card "open in new tab" arrow, the atuty icons).

### Named Rules
**The Full Pill Rule.** Action elements (buttons, nav CTA) are full `999px` pills.
Everything else uses the 6 / 10 / 14px ladder. Do not mix radii within one
component and do not give an action a boxy radius.

## Components

### Buttons
- **Character:** tactile and confident — pills that lift on hover, no bounce.
- **Shape:** full pill (`999px`).
- **Primary:** Bottle Green fill, Ivory (`#FBF8F0`) text, `14px 28px` padding,
  weight 600.
- **Hover / Focus:** background → Leaf Green, `translateY(-2px)`, green-tinted
  shadow `0 12px 28px rgba(31,61,43,0.28)`; transition `0.18s` on the
  `cubic-bezier(0.22, 1, 0.36, 1)` ease. Transition removed under reduced
  motion.
- **Nav CTA:** same fill and text, smaller pill (`9px 18px`), always full opacity
  among the dimmed (0.85) nav links.
- **Secondary / Ghost:** none. Leaf Green text links fill that role.

### Cards / Containers
- **Sections themselves are not containers.** `.section > .container` carries no
  fill, border, blur, or radius — only the internal padding that spaces its
  content from the section edge. It is a spacing wrapper, not a surface.
- **Portfolio card:** Surface Card fill, hairline border, `14px` radius, resting
  shadow `0 14px 40px rgba(31,45,36,0.16)`, `overflow: hidden`, `24px` body padding.
- **Step card (`.krok`):** Surface Card fill, hairline border, `14px` radius,
  `28px 24px` padding, no resting shadow. A `40px` circular Bottle Green badge
  with Ivory text numbers it. On `:target`: Bottle Green border + `0 0 0 1px` ring.

### Inputs / Fields
- **Style:** Surface Card fill, hairline border, `10px` radius, `12px 14px`
  padding, inherits body font at Text Primary.
- **Focus:** `outline: 2px solid #1F3D2B`, `outline-offset: 1px`, border goes
  transparent.
- **Error / Disabled:** after a submit attempt, `.is-touched:invalid` borders in
  Error red; the `aria-live` status line turns Error red with a message.
- **Autofill:** forced to match the field's own light fill —
  `-webkit-box-shadow: 0 0 0 1000px #F1EEE2 inset` — instead of the browser's
  native (usually yellowish) autofill highlight; text fill stays Text Primary.
- **Custom consent checkbox:** native input hidden but focusable and hit-testable;
  a drawn `22px` box (`6px` radius, hairline border). Checked = Bottle Green fill
  + Ivory SVG tick scaling in + a `consent-pop` scale keyframe (1 → 1.22 → 0.94 → 1).
  Hover = Bottle Green border. `:focus-visible` = 2px Bottle Green outline.
  Animations drop under reduced motion.

### Navigation
- **Logo:** `images/logo-fitpage.png` (rounded-square "FP" mark), `50px` tall,
  `height: auto` width, `alt="FitPage"` — the accessible name, not decorative.
- **Style:** sticky, `64px` min-height, Nav Scrim (canvas-tinted) + `blur(8px)`,
  hairline-faint bottom border.
- **Links:** Text Primary at `0.85` opacity → `1` on hover, `0.95rem`. The CTA is
  a solid Bottle Green pill at opacity 1.
- **Mobile (< 700px):** a hamburger of three `2px` Text-Primary bars toggles
  `.is-open` and `aria-expanded`; links become a full-width stacked dropdown on
  `rgba(247,243,234,0.98)` with hairline dividers; the menu closes on link click.

### Trainings marquee
A horizontal, infinitely-looping strip of 8 training-type icons + labels
(wyciskanie na ławce, bieganie, pilates, balet, joga, boks, kolarstwo,
pływanie), between the hero and "O nas" on the homepage. Two identical
`<ul>` copies sit side by side in a flex track; the track animates
`translateX(0) → translateX(-50%)` on a `32s linear infinite` loop — exactly
one copy's width, so the wrap is seamless. The second copy is `aria-hidden`
so screen readers hear each label once. Icons are neutral (Text Primary,
same stroke system as elsewhere); a small Bottle Green dot after each label
is the only accent — a full row of solid-green icons would spend the One
Mark Rule's scarcity on decoration. `prefers-reduced-motion` stops the
animation and drops the hidden duplicate; the strip becomes a static row.
This is the one exception to "reserve motion for content that changes" —
kept deliberately, on explicit direction, modeled on a named reference site.

### Trust icons (atuty)
Four short facts in a row — Bezpłatna konsultacja / Cała Polska, zdalnie / 2 rundy
poprawek w cenie / Wyłącznie trenerzy personalni — near the bottom of the
homepage, after Kontakt and before FAQ. No panel; the block sits directly on the
canvas, like the hero.
- **Icon:** `44px` circle, `1px` hairline border, a custom-drawn `24px`-viewBox
  stroke SVG (same stroke system as the portfolio card's arrow) rendered at
  `22px`, centered.
- **Color:** neutral (Text Primary) on three of four icons; exactly one — the
  most action-adjacent fact — gets Bottle Green on both border and stroke. The
  One Mark Rule applied at component scale: the accent marks a single item,
  never all four at once.
- **Label:** `0.9rem`, weight 600, Text Muted — the same token as the hero
  subtitle.
- **Grid:** 2 columns on mobile, 4 from 700px.

### Floating phone (signature)
The "O nas" mockup (`mockup1.png`, 500×833) is the one showpiece and the only place
motion is decorative rather than functional. Three independent layers:
- The `<figure>` carries the scroll reveal — slides in from the lower-right with a
  `3.5deg` rotate and `0.92` scale over `1s` (a longer glide than the standard
  `0.6s` `.reveal`).
- The `<img>` runs a `4s` infinite `phone-float` (`translateY(-14px)` + `-1.4deg`).
- The `::before` soft green vignette runs `phone-glow` on the same `4s` beat
  (opacity `0.7 → 1`, scale `1 → 1.07`) — a quiet pulse now, not a glow.
- Grounded by `drop-shadow(0 22px 46px rgba(31,45,36,0.22))`. All three layers
  freeze static under `prefers-reduced-motion`.

### Splash intro
A full-screen overlay, first thing in `<body>` on every page, that plays once
per page load: the logo (`images/logo-fitpage.png`, `125px`) fades and scales
in (`0.6 → 1`), grows a little further (`→ 1.15`), then fades and scales out
(`→ 1.4`) as the overlay itself becomes invisible and non-interactive
(`visibility: hidden`, `pointer-events: none`) — `1.44s` total, pure CSS
(`animation-fill-mode: forwards`), no JS required for it to disappear, so it
degrades safely with JavaScript off. `prefers-reduced-motion` removes the
overlay outright (`display: none`) rather than freezing it mid-animation —
the content is instantly available, never gated behind a decorative intro.

### Footer (the one dark surface)
The footer is Pine Black (`#16211B`) — opaque, the single deliberately dark note
on an otherwise light page. Text is Ivory at `0.72` opacity. The footer carries a
`.footer__links` row (O nas / Proces tworzenia strony / FAQ / Kontakt) — every
link there is full-opacity Ivory, **not** Leaf Green — Leaf Green's contrast
against Pine Black falls to ~2.6:1, well under AA, so the footer is the one
place that does not reuse the standard link color.

## Do's and Don'ts

### Do:
- **Do** keep the canvas flat — one solid color on `body`, no gradient, no
  per-section repaint.
- **Do** separate sections with padding/margin only, never a box.
- **Do** verify body and secondary text clears 4.5:1 on Canvas — and re-check
  independently anywhere a color sits on a *different* surface (the footer,
  the accent fill, a hover state); a pair that passes on Canvas can still fail
  elsewhere, and light and dark canvases carry different risks; see The Error
  and Ivory entries above for two places this already mattered.
- **Do** keep Bottle Green rare: the next action, links, focus rings, step
  numbers. Running copy stays Text Muted / Text Primary.
- **Do** use full `999px` pills for actions and the `6 / 10 / 14px` ladder
  for every other corner.
- **Do** gate every animation behind the `.js` class and `prefers-reduced-motion`,
  with the content fully visible and usable when both are off.
- **Do** put a `2px` Bottle Green focus outline (`outline-offset: 1–2px`) on
  every interactive element.
- **Do** draw custom controls (checkbox, `<details>` markers, icons) from scratch
  in the light palette instead of styling native chrome.
- **Do** define shapes with the hairline border — fills are almost invisible on
  their own.

### Don't:
- **Don't** ship the template look: no stock hero photo, no grid of identical
  rounded cards, no gradient-filled buttons. This is the one confirmed
  anti-reference.
- **Don't** give a section its own background, border, blur, or radius of any
  kind — no panel, no card, no translucent fill. Sections are pure spacing.
  (The footer, `#16211B`, is the sole opaque exception, and the small
  component-level cards — portfolio, steps, FAQ, form fields — keep their own
  faint fill; neither is a section-level panel.)
- **Don't** use Bottle Green for large fills or runs of text; its scarcity is
  the point.
- **Don't** add a second accent hue. Green + neutral only; Error red (`#A13333`)
  is a state color, not an accent.
- **Don't** introduce or assume a dark theme. The system is light-only, by
  deliberate choice — this is not a default awaiting a dark variant.
- **Don't** load a web font to "fix" the typography; weight and tracking carry the
  hierarchy.
- **Don't** let a shadow sit on a resting surface (portfolio card excepted) —
  shadows mean hover, `:target`, or the animated phone.
- **Don't** reuse the standard Leaf Green link color inside the footer — it
  fails contrast there. Use Ivory.

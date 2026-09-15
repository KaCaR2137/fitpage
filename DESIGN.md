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

**Heading Font:** Fraunces (600–700), a webfont from Google Fonts. **Body /
Label Font:** Inter (400/500 for running copy, 600/700 for UI chrome —
buttons, nav, form labels), also from Google Fonts. Both load via a
`<link>` in every page's `<head>` — a `preconnect` pair for
`fonts.googleapis.com`/`fonts.gstatic.com` plus the stylesheet link itself
(`family=Fraunces:wght@600;700&family=Inter:wght@400;500;600;700&display=swap`) —
never `@import` inside `style.css`, which blocks parallel downloading and
delays first paint. `display=swap` in the URL means the browser paints the
fallback stack immediately and swaps to the webfont once it arrives, so
there's no invisible-text flash on a slow connection. Superseded the
System-Font Rule below (kept, struck through, for the record — see Named
Rules).

**Character:** the two families are chosen to contrast on purpose — Fraunces
is a wonky, characterful serif built for display sizes, Inter a neutral,
highly legible grotesque built for UI text at small sizes. Personality now
comes from the heading face itself, not just weight/tracking; body copy
keeps the previous engineered, get-out-of-the-way character. Verified live
across every heading size actually in use, from the H1 clamp (`30px` mobile
→ `50px` desktop) down to the smallest H3 (`16px`, mobile article cards) —
Fraunces stays crisp and readable at all of them, so no size changed.

### Hierarchy
- **Display** (700, `clamp(1.9rem, 6vw, 3.1rem)`, line-height 1.2, tracking
  -0.02em): the hero headline only — one per page.
- **Headline** (700, `1.6rem`, rising to `2rem` at ≥700px, line-height 1.2,
  tracking -0.02em): section titles (`.section__title`). One per section.
- **Logo:** the nav now pairs the image mark with a text wordmark —
  `images/logo-fitpage.png` (rounded-square "FP" badge, `44px` tall) plus
  `.nav__logo-text` ("FitPage", 800 weight, `1.3rem`, tracking -0.03em, Text
  Primary) — sized so the whole lockup's height (`44px`) matches `.nav__cta`'s
  rendered height (`~43px`), for visual parity between the two ends of the
  nav bar. Since the wordmark is now visible next to it, the image's `alt`
  is empty (decorative) — the visible text carries the accessible name, so a
  screen reader doesn't announce "FitPage" twice. The footer keeps its own
  plain 800-weight text wordmark in Ivory, unchanged and independent of this.
- **Title** (600–700, `1.1rem`–`1.15rem`, line-height 1.2): card titles, step
  titles, article-card titles, FAQ and "Więcej" summaries.
- **Body** (400, `1rem`, line-height 1.65): running copy in Text Muted, with
  `<strong>` promoted to Text Primary. Prose blocks capped near 680px wide,
  except long-form "Read" mode content (`.polityka`, `.artykul__body`), which
  narrows to ~65ch — measured against the site's own line-length findings
  rather than the general 680px figure. On an article page the narrowed
  column (`.artykul`, wrapping heading/body/CTA/back-link together) is
  centered (`margin-inline: auto`) inside the wider `.container`, not left-
  pinned to it — a left-pinned narrow column inside a much wider container
  reads as a lopsided gap on the right at desktop widths, not intentional
  whitespace. `.polityka` still left-pins its column the same way; it hasn't
  been revisited since this was caught on the article template.
- **Label / Micro** (600 for field labels at `0.9rem`; 400 for hints, required
  notes and captions at `0.8rem`; 600 for "Więcej" toggles at `0.82rem`): Text
  Muted, except labels and legends which use Text Primary.

**Depth:** headings (`.hero__title`, `.section__title`, `.krok__title` — H1/H2
only, H3 titles like `.card__title` stay flat) plus the body text in the hero
and "O nas" (`.hero__subtitle`, `.o-nas p`) carry a subtle `text-shadow: 0 1px
3px rgba(31,45,36,0.14)` — neutral, green-tinted like the rest of the system's
shadows, not the accent hue. A quiet lift, not a decorative glow. Elsewhere
(FAQ, portfolio cards, process steps, article cards, the form) body text stays
flat; this is a first pass scoped to the top of the page, not a blanket rule
yet. (The on-page Kontakt blurb this rule originally covered was removed from
`index.html` — replaced by an Artykuły preview — so its two selectors are
gone too.)

### Named Rules
**The System-Font Rule (superseded).** Originally: do not load a web font to
"improve" the type — hierarchy comes from weight/tracking on the system
stack, a custom face would fight its engineered character. Explicitly
overturned by direct instruction: load Fraunces for headings and Inter for
body. Kept here, not deleted, so the earlier reasoning and the fact that a
real decision reversed it both stay on record — a future "should we load a
web font" question shouldn't rediscover this from git blame.

**Resolved tradeoff — synthetic bold on Inter UI chrome.** Initially only
Inter 400/500 were loaded (matching the first "waga 400-500" instruction
for body text), which left several non-heading UI elements rendering with
browser-faked bold — buttons (`.btn`, 600), form labels (`.form__row
label`, 600), and others already styled at weights the loaded font file
didn't contain. Fixed by widening the query to `Inter:wght@400;500;600;700`
— those elements now render a real drawn weight instead of a
geometrically-thickened 400. **Still synthetic:** the nav/footer wordmark
(`.nav__logo-text`/`.footer__logo`, 800) — nobody has asked to add 800 yet,
and it's a single short "FitPage" string rather than body-length text, so
the faux-bold there is the least noticeable instance if it needs revisiting.

## Layout

- **Container:** `max-width: 1080px`, centered, `20px` inline padding. One width
  for all content.
- **Section rhythm:** `40px` vertical padding per section on mobile, `56px` from
  700px up. The container adds a further `16px` / `20px` internal top / bottom
  padding — no panel wraps it, this is pure spacing. (Lowered from the
  original `52px`/`88px` + `40px`/`44px` — that combination stacked to
  ~260-284px of empty space between one section's content and the next
  section's heading at desktop widths, reported as looking too sparse on
  the O nas → Portfolio → Artykuły run on the homepage. New total: ~148px
  desktop / ~116px mobile, measured content-edge to content-edge — still a
  clear break between sections, not cramped. Global change, not scoped to
  those three sections: the same two-layer padding was identical on every
  page, so narrowing it only on index.html would have made that page's
  rhythm inconsistent with the rest of the site.)
- **Breakpoints:** `480px` (footer switches to a justified row), `700px` (mobile
  hamburger menu boundary; section rhythm and section-title size step up; process
  steps go 1-col → 3-col), `900px` (hero gains more vertical air; "O nas" flips
  from a stacked column to a `text | phone` row).
- **Grids:** portfolio stays `repeat(auto-fill, minmax(280px, 400px))`. The
  articles grid (`.artykuly__grid`, shared by the homepage preview and the
  full list) uses `repeat(auto-fit, minmax(280px, 1fr))` instead —
  **`auto-fit`, not `auto-fill`**, and `1fr` as the upper bound, not a fixed
  px: empty "phantom" tracks collapse to zero instead of leaving a visible
  gap, and real cards stretch to fill the row. At 2 cards each renders
  ~508px (the `.container`'s full 1080px, minus padding and gap, split
  evenly); at 3 it settles to ~331px each without any layout change —
  built to seat 3 side by side without a fourth ever standing alone.
  Portfolio was deliberately left on the fixed-max version — it holds a
  single demo project by design (see PRODUCT.md), not a growing list.
  Process steps
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
  token): the only *resting* shadow. Portfolio cards only. Green-tinted and soft
  rather than a flat black — a heavy black shadow reads harsh on a light,
  paper-like canvas. The same token is reused as a *hover*-only lift on article
  cards (paired with `translateY(-2px)` and a Bottle Green border) — the token
  stays singular, only its trigger changes.
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
- **Photo-overlay text shadow** (`text-shadow: 0 1px 4px rgba(0,0,0,0.35)` on
  `.hero--cover .artykul__meta`/`.hero__title`): the one flat-black shadow in
  the system, and a deliberate exception to the green-tinted rule above — it
  sits on Ivory text laid directly over an article's own header photo (see
  Components → Article cover header), not on the flat canvas, so it isn't
  competing with the accent hue the rest of the vocabulary is tuned for.
  `0.35` opacity was picked by computing worst-case contrast against that
  photo's brightest regions, not chosen on sight.
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
- **Article card (`.artykul-card`):** Surface Card fill, hairline border, `14px`
  radius — flat at rest like the step card, *not* the portfolio card's
  resting-shadow exception. On hover/focus-within: `translateY(-2px)` + the
  card-rest shadow token (`--shadow`) as a lift, border shifts to Bottle
  Green — shadow-on-interaction only, per The Lift-Means-Interactive Rule. The
  whole card is a click target (an `::after` on the title stretches over it)
  without nesting a second `<a>`; the title links, and **the whole lead
  paragraph is now its own separate link too** (not a plain `<p>`), ending
  inline with a `→` arrow (plain horizontal, same-site — not the portfolio
  card's diagonal "opens elsewhere" arrow). No standalone "Czytaj dalej"
  label exists any more — the teaser sentence itself is the visible action,
  Leaf Green on hover, `position: relative; z-index: 1` so it wins over the
  title's full-card `::after` instead of being swallowed by it. Deliberately
  **not** a filled `.btn` pill: with 2-3 of these sitting side by side, three
  solid Bottle Green buttons in one glance would spend the accent's whole
  scarcity budget on a single row — the text-link-as-action treatment is the
  same one every other secondary link on the site already uses (`Zobacz
  wszystkie artykuły`, `Wróć do listy artykułów`, the portfolio card's own
  link), not a new pattern invented for this component.
  **Below 480px** the card is deliberately tighter — `14px` padding (vs
  `24px`), `4px` internal gap (vs `10px`), a `1rem` title (vs `1.15rem`),
  and the lead text clamped to 3 lines (`-webkit-line-clamp`, ellipsis on
  overflow) at a smaller `0.875rem`/`1.45` line-height — a single card was
  measured taking up to 37% of a 390px-wide phone's viewport height before
  this, leaving no hint that more articles followed below. The 3-line clamp
  and its tighter type only apply under 480px; at and above that breakpoint
  the lead reverts to unclamped, natural flow at the original `0.95rem`/
  `1.65` — nothing about the desktop/tablet card changed.

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
- **Logo:** `images/logo-fitpage.png` (rounded-square "FP" mark) at `44px`
  tall (`height: auto` width) plus a `.nav__logo-text` "FitPage" wordmark
  (800 weight, `1.3rem`, -0.03em tracking, Text Primary), `10px` gap between
  them — sized as a pair to match `.nav__cta`'s rendered height. `alt=""` on
  the image now that the visible text carries the accessible name.
- **Style:** sticky, `64px` min-height, Nav Scrim (canvas-tinted) + `blur(8px)`,
  hairline-faint bottom border.
- **Links:** Text Primary at `0.85` opacity → `1` on hover, `0.95rem`. The CTA is
  a solid Bottle Green pill at opacity 1.
- **Mobile (< 700px):** a hamburger of three `2px` Text-Primary bars toggles
  `.is-open` and `aria-expanded`; text links become a full-width stacked
  dropdown on `rgba(247,243,234,0.98)` with hairline dividers; the menu
  closes on link click. **The CTA pill does not collapse into the
  dropdown** — `.nav__right` wraps links + CTA + hamburger as one group so
  `.nav__inner` always has exactly two flex children (logo, `.nav__right`)
  regardless of breakpoint; only `.nav__links` inside that group hides.
  The CTA stays visible in the always-sticky nav bar at every width, sized
  down slightly (`10px 14px` padding, `0.85rem`) to sit beside the `44px`
  hamburger without wrapping. Fixed via `/impeccable adapt` after a critique
  flagged that hiding the primary conversion action behind a hamburger tap
  was a real cost on a mostly-mobile audience (PRODUCT.md).

### Trainings marquee
A horizontal, infinitely-looping strip of 8 training-type icons + labels
(trening siłowy, bieganie, pilates, balet, joga, boks, kolarstwo,
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
poprawek w cenie / Trenerzy, instruktorzy, coache — near the bottom of the
homepage, the last section before the footer. No panel; the block sits directly on the
canvas, like the hero.
- **Icon:** `44px` circle, `1px` hairline border, a `24px`-viewBox stroke SVG
  (same stroke system as the portfolio card's arrow) rendered at `22px`,
  centered. Three of the four are custom-drawn; the fourth ("Trenerzy,
  instruktorzy, coache") uses Lucide's `brain` icon verbatim (ISC license) —
  its stroke attributes already matched the site's system exactly, so it
  was dropped in rather than redrawn from scratch.
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

### Article cover header (`.hero--cover`)
An optional modifier on `.hero.hero--compact`, for an article whose draft
comes with a dedicated header photo (not every article needs one). The photo
itself is set inline (`style="background-image: url(...)"`) on that one
page's `<section>` — it's the article's own content, not a design decision,
so it doesn't live in `style.css`; everything else about the treatment does,
so the same modifier class works for the next article with a photo without
repeating CSS. `background-size: cover` + `background-position: center`
guarantee the photo fills the whole header at any viewport width — no empty
canvas-colored bars at the sides, ever, regardless of the source image's
aspect ratio. A Pine Black scrim (`rgba(22,33,27,0.65)` on a full-bleed
`::before`) sits between photo and text; both the date (`.artykul__meta`)
and the title switch to Ivory with a small black `text-shadow` for
legibility against a busy photo — this is the one place Ivory text appears
outside the accent fill and the footer, because a photo backdrop is,
functionally, another dark surface. `0.65` opacity was picked by computing
worst-case contrast against the specific photo's brightest regions (a lit
wall, white t-shirts), not chosen on sight — comfortably over 4.5:1 even
there. `min-height: 260px` keeps the header from looking clipped on short
mobile content; wider/taller viewports are already governed by the existing
`.hero--compact` padding tiers, unchanged.

### Review card (`.opinia-card`) and star rating
Live component on `opinie.html` — linked in nav/footer on every page, `noindex`
removed. Went live intentionally before any real review existed (client's own
call: reveal the page now, the first review gets added later — see
CLAUDE.md), so the empty state had to be genuinely empty rather than a
scaffolding placeholder; see the Named Rule below. Same grid as the article list —
`repeat(auto-fit, minmax(280px, 1fr))` — and the same flat-at-rest,
shadow-only-on-hover card as `.artykul-card`/`.krok`, per The
Lift-Means-Interactive Rule. Stars are drawn SVGs (a five-point star path,
`fill: currentColor`), never Unicode `★` glyphs — the craft floor bans
character glyphs standing in for an icon system, and a rating widget is the
one place on this site where five same-colored accent marks in a row is the
correct call: a star rating reads as broken if it isn't uniform, unlike a
generic icon row where the accent should stay sparse. Both the page-level
summary (`.opinie__stars`, `20px`) and each card's own rating
(`.opinia-card__stars`, `18px`) use Bottle Green, not a separate gold/yellow
— staying inside the established palette rather than importing a category
color. Each stars wrapper carries `role="img"` and a numeric `aria-label`
("Ocena 5 na 5 gwiazdek"); the SVGs themselves are `aria-hidden`, so a
screen reader hears the rating once, spoken plainly, not five unlabeled
icons in a row.

**Named Rule — no invented statistics.** The aggregate summary must never
show a rating number unmatched by a real review count behind it. With zero
real reviews live, the summary shows outline (unfilled) stars and "0
opinii" — no numeric average at all, since a rating with nothing behind it
is a fabricated statistic. An HTML comment above the summary in
`opinie.html` documents exactly how to flip it to filled stars + a real
average once the first genuine review is pasted in. This mirrors
PRODUCT.md's "no invented prices, timelines, testimonials" rule applied to
ratings specifically.

### Star rating input (`.form__rating`, opinie-dodaj.html)
The interactive counterpart to the display-only stars above — collects the
rating on the private review-submission form. Same drawn-SVG star (never a
Unicode glyph), but as a real form control: 5 native radio inputs
(`name="ocena"`), visually hidden with the same "clip-path visually-hidden"
technique as `.form__consent > input` (not `display:none`, so it stays
keyboard-focusable and in the accessibility tree), each paired with a
`44×44px` label — a touch target, not a decorative icon, so it gets the same
WCAG 2.5.5/2.5.8 minimum already used for `.nav__toggle`, larger than the
passive `.opinie__stars`/`.opinia-card__stars`. The fill-on-hover/select
behavior is the standard CSS-only radio-star trick: DOM order reversed
(5,4,3,2,1) + `flex-direction: row-reverse` restores the visual 1→5 order,
so the general sibling combinator (`~`) from the checked/hovered star
correctly lights up every "lower" star too. Every radio carries the `required`
attribute — not just one of the five. HTML5 only needs it on one member for
the group's native validity, but the site's own JS validation selects fields
by `input[required]`; with `required` on a single radio, only that one
radio gets a live `change` listener, so picking any other star wouldn't
clear the error message until the next full submit attempt (caught and
fixed while building this page, verified in-browser). The shared error
message (`#ocena-error`) is looked up by `name`, not `id`, since the five
radios don't share one — see `errorIdFor()` in `script.js`.

### Footer (the one dark surface)
The footer is Pine Black (`#16211B`) — opaque, the single deliberately dark note
on an otherwise light page. Text is Ivory at `0.72` opacity. The footer carries a
`.footer__links` row (O nas / Proces tworzenia strony / FAQ / Artykuły /
Opinie / Kontakt) — every
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

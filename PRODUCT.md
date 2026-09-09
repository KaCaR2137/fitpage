# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Buyer / client:** personal trainers and fitness instructors in Poland running their
own activity, who need a web presence to attract training clients. Typically solo,
often without ready copy or photos at the start, and aware their own visitors arrive
mostly on phones.

**End visitors of the delivered sites:** people looking for a trainer — evaluating
offer, credibility and how to make contact — predominantly on mobile.

**Operator of FitPage:** a single person (solo). Sells, designs, builds and deploys
every project. The plural voice on the site is a deliberate narrative choice, not a
description of a team.

## Product Purpose

FitPage designs and builds one-page "business-card" websites for personal trainers —
clear, fast, mobile-first, with a GDPR-compliant contact form — so the trainer can
present their offer and turn visitors into inquiries. Success: the trainer gets a
published site under their own domain that generates contact; FitPage earns
repeatable paid commissions from the trainer niche.

## Positioning

Not a generic "cheap website" shop: a **repeatable standard for one niche**. A fixed
section structure, trainer-specific copy patterns, and a GDPR checklist derived from
analysis of ~20 real trainer websites, plus a defined six-step delivery process
(Analiza → Struktura → Projekt → Development → Testy → Wdrożenie). The standard is
modular and adapts to the trainer's sub-niche. A neighbouring freelancer competing on
price alone could not truthfully claim the same niche-specific standard and process.

## Operating Context

- Fully remote; works with trainers across Poland.
- Sales flow: visitor fills a short brief form on `kontakt.html` → FitPage replies
  with a scope proposal and quote → free, non-binding consultation.
- The client supplies texts and photos **during** the project; they do not need
  everything up front. FitPage helps structure the content.
- Two rounds of design revisions by default.
- Delivery under the client's own domain, with SSL and a short self-edit guide;
  optional post-launch care (updates, minor changes) agreed separately.
- Optional integrations added on request: contact form with e-mail notifications,
  click-to-call, map, Google Analytics, Meta Pixel, booking calendar.

## Capabilities and Constraints

- **Stack (fixed):** plain HTML / CSS / JS, no framework, no build step. Current
  files: `index.html`, `kontakt.html`, `proces.html`, `style.css`, `script.js`
  (CSS and JS shared across all pages). Deliverables are static sites — no CMS,
  no plugins — with load speed and small-screen behaviour as hard requirements.
- Basic SEO per page: `<title>`, meta description, structured data.
- Every form ships with a GDPR information clause plus a required consent and an
  optional marketing consent; the data-retention period is set explicitly before
  launch (never left blank).
- Content must not overstate: no public pricing, no fixed timeline promises —
  both are quoted per scope after the brief.

**Explicitly undecided (do not invent):**
- Pricing model — individual quote after the brief; no price shown publicly.
- Delivery timeline — depends on scope and how fast the client supplies content.
- Business-registration status — whether FitPage operates as a registered
  działalność gospodarcza or as a private individual is not yet decided. This
  blocks the RODO data-controller identity in `kontakt.html` and the footer.
- Whether the contact details in the code are live: domain `fitpage.pl`, phone
  `535 721 592`, e-mail `kontakt@fitpage.pl` are all currently placeholders.

## Brand Commitments

- **Name:** FitPage. Logo renders it with "Fit" visually emphasised.
- **Voice:** Polish, first-person plural ("projektujemy", "odezwiemy się") — FitPage
  speaks as a team despite being one person; this is intentional. Exceptions: consent
  text speaks in the visitor's voice ("wyrażam zgodę"); direct address to the visitor
  stays second-person singular ("Twojej", "możesz").
- The "about" section is **"O nas"**, not "O mnie".
- Process-page reference model: `leadpage.pl/strony-internetowe/`.
- The universal build standard lives in the `strona-wizytowka-trenera` skill;
  `CLAUDE.md` in this repo holds this project's specifics and its pre-launch TODO.

## Evidence on Hand

- `mockup1.png` — phone mockup of a trainer site, used in "O nas". In-repo copy
  500×833 (~307 KB); the 1857×3096 original is kept outside the repo.
- Portfolio, one item: **"Marta Dominikowska — trener personalny"**, live at
  `https://marta-strona-trener.netlify.app`. This is a **showcase / demo project,
  not a paid commission.** Portfolio copy and any future marketing must not present
  it as commissioned client work or imply a history of paying clients.
- No testimonials, no client statistics, no "X sites delivered" numbers, no pricing
  benchmarks — none exist yet. Future work must not fabricate them.

## Product Principles

1. **One niche, done to a standard.** Every deliverable follows the trainer-site
   section structure and GDPR checklist, adapted to the client's sub-niche — never
   a random template.
2. **The visitor's next step is the point.** Each page drives toward one primary
   action (brief form / call / trial booking).
3. **Mobile-first and fast.** Most visitors are on a phone; no plugins, minimal
   weight, tested on small screens.
4. **Honest claims only.** No invented prices, timelines, testimonials or client
   counts; undecided facts stay written down as undecided.
5. **Legally clean forms.** Information clause + consents + an explicit retention
   period before any site goes live.

## Accessibility & Inclusion

No formal standard set by the client. The existing code shows baseline intent:
semantic landmarks, `aria-*` on the nav toggle, `prefers-reduced-motion` respected,
content readable without JavaScript. Target: keyboard-operable, reduced-motion-safe,
JS-optional pages. No specific WCAG level committed.

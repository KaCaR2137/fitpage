# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Buyer / client:** people in Poland who run their own activity in sport and
nutrition: personal trainers, fitness and sport instructors, coaches and dietitians
(including those working online), who need a web presence to attract clients.
Typically solo, often without ready copy or photos at the start, and aware their
own visitors arrive mostly on phones.

**End visitors of the delivered sites:** people looking for a trainer, instructor
or dietitian, evaluating offer, credibility and how to make contact, predominantly
on mobile.

**Operator of FitPage:** a single person (Kacper Barczak), who sells, designs,
builds, deploys and looks after every project personally. The site says so openly
and speaks in the first person singular (since 15.10.2026).

## Product Purpose

FitPage designs and builds websites for trainers, instructors and dietitians:
clear, fast, mobile-first, with a GDPR-compliant contact form, so the client can
present their offer and turn visitors into inquiries. Scope ranges from a one-page
site to multi-page sites and online-sales sites (see the price list). Success: the
client gets a published site under their own domain that generates contact;
FitPage earns repeatable paid commissions from the sport and nutrition niche.

## Positioning

Not a generic "cheap website" shop: a **repeatable standard for one niche**. A fixed
section structure, trainer-specific copy patterns, and a GDPR checklist derived from
analysis of ~20 real trainer websites, plus a defined five-step delivery process in about 7-21 days (by package)
(Bezpłatna rozmowa → Plan i materiały → Projekt → Budowa i testy → Publikacja),
described on `proces.html` and in the "Jak pracuję" strip on the home page. The standard is
modular and adapts to the client's sub-niche (e.g. seniors, motor preparation,
online coaching, dietetics). A neighbouring freelancer competing on
price alone could not truthfully claim the same niche-specific standard and process.

## Operating Context

- Based in Poznań, works remotely with clients across Poland.
- Sales flow: visitor fills the brief form on `kontakt.html` (four steps; optional
  package via `?pakiet=` and style via `?styl=`) → FitPage replies with a scope
  proposal and quote → free, non-binding consultation.
- Before the brief, a visitor can pick a visual direction on `szablony.html`
  (four sample styles on fictional brands: Mocny, Jasny, Dynamiczny, Minimalny).
  Every site is still designed individually.
- The client supplies texts and photos **during** the project; they do not need
  everything up front. FitPage helps structure the content.
- Two rounds of design revisions by default.
- Delivery under the client's own domain, with SSL and a short self-edit guide;
  optional post-launch care as a monthly plan (Opieka, Opieka Plus).
- Optional integrations added on request: contact form with e-mail notifications,
  click-to-call, map, Google Analytics, Meta Pixel, booking calendar.

## Capabilities and Constraints

- **Stack (fixed):** plain HTML / CSS / JS, no framework, no build step. Pages:
  `index.html`, `cennik.html`, `proces.html`, `faq.html`, `artykuly.html` +
  `artykuly/*.html`, `opinie.html`, `szablony.html` + `szablony/*.html`,
  `kontakt.html`, `polityka-prywatnosci.html` and thank-you pages; one shared
  `style.css` and `script.js`. Hosted on Cloudflare, deployed on push to `main`.
  Deliverables are static sites (no CMS, no plugins), with load speed and
  small-screen behaviour as hard requirements.
- Basic SEO per page: `<title>`, meta description, structured data.
- Every form ships with a GDPR information clause plus a required consent and an
  optional marketing consent; the data-retention period is set explicitly before
  launch (never left blank).
- **Public price list ("od", net, VAT 23% added on the invoice):** packages Start
  from 990 zł, Trener from 1890 zł, Online from 2990 zł; post-launch care Opieka
  79 zł/month and Opieka Plus 149 zł/month. The exact amount is quoted after the
  brief, once the scope is known. Do not invent other prices, discounts or
  promotions.
- **Indicative timelines:** Start about 7 days, Trener about 14 days, Online about
  21 days; the real date depends on scope and on how fast the client supplies
  content. Always "about", never a guarantee.

**Settled facts:**
- Data controller: Kacper Barczak, a private individual without a registered
  business (as stated in `polityka-prywatnosci.html`).
- Live contact: domain `fitpage.pl`, e-mail `kontakt@fitpage.pl`, phone
  `535 721 592` (shown as a fallback on the brief form).

## Brand Commitments

- **Name:** FitPage. Logo renders it with "Fit" visually emphasised.
- **Voice:** Polish, first-person singular, masculine ("projektuję", "pomagam",
  "odezwę się"); the "O mnie" section opens with "FitPage prowadzę sam". "We" stays
  only where it means the client and FitPage together ("umówimy się na rozmowę",
  "Zaczynamy?"). Exceptions: consent text speaks in the visitor's voice ("wyrażam
  zgodę"); direct address to the visitor stays second-person singular ("Twojej",
  "możesz").
- The "about" section is **"O mnie"** (`#o-mnie`); internal CSS classes keep the
  old `.o-nas*` names.
- No em or en dashes in visitor-facing copy.
- Process-page reference model: `leadpage.pl/strony-internetowe/`.
- The universal build standard lives in the `strona-wizytowka-trenera` skill;
  `CLAUDE.md` in this repo holds this project's specifics and its pre-launch TODO.

## Evidence on Hand

- `mockup1.png`: phone mockup of a trainer site, used in "Co dostajesz" (no caption since
  19.10.2026). In-repo copy 500×833; the 1857×3096 original is kept
  outside the repo.
- Portfolio (section hidden for now), one item: **"Marta Dominikowska, trener
  personalny"**, live at `https://marta-strona-trener.netlify.app`. This is a
  **showcase / demo project, not a paid commission.** Copy must not present it as
  commissioned client work or imply a history of paying clients.
- Four sample style templates in `szablony/` (Atlas, Lumi, Puls, Rytm): fictional
  brands, each labelled "Przykładowy projekt FitPage · marka fikcyjna", `noindex`.
  They must never be presented as real clients.
- `opinie.html` is live with an honest empty state (0 reviews). No testimonials,
  no client statistics, no "X sites delivered" numbers exist yet. Future work must
  not fabricate them.

## Product Principles

1. **One niche, done to a standard.** Every deliverable follows the trainer-site
   section structure and GDPR checklist, adapted to the client's sub-niche in sport
   or nutrition. Sample styles are a starting direction, never a template sold as is.
2. **The visitor's next step is the point.** Each page drives toward one primary
   action (brief form / call / trial booking).
3. **Mobile-first and fast.** Most visitors are on a phone; no plugins, minimal
   weight, tested on small screens.
4. **Honest claims only.** Only the published "od" prices and "about" timelines;
   no invented discounts, testimonials or client counts; undecided facts stay
   written down as undecided.
5. **Legally clean forms.** Information clause + consents + an explicit retention
   period before any site goes live.

## Accessibility & Inclusion

No formal standard set by the client. The existing code shows baseline intent:
semantic landmarks, `aria-*` on the nav toggle, `prefers-reduced-motion` respected,
content readable without JavaScript. Target: keyboard-operable, reduced-motion-safe,
JS-optional pages. No specific WCAG level committed.

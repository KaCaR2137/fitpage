# FitPage — strona wizytówka (projekt własny)

Jednostronicowa strona wizytówkowa działalności **FitPage** — tworzenie stron
internetowych dla trenerów personalnych. Klient = właściciel FitPage.

Uniwersalny standard: skill `strona-wizytowka-trenera`. Ten plik = specyfika
tego zlecenia.

## Ton / narracja
Wszystkie teksty w **1. os. liczby mnogiej** („projektujemy”, „pomagamy”,
„odezwiemy się”) — FitPage występuje jako zespół, nie pojedyncza osoba.
Sekcja „O nas”. Wyjątek: treść zgód w formularzu (mówi w nich odwiedzający —
„wyrażam zgodę”) oraz zwroty do odwiedzającego pozostają w 2. os. („Twojej”, „możesz”).

## Stack
Czysty HTML/CSS/JS, bez frameworków i build stepu. Pliki: `index.html`,
`kontakt.html`, `proces.html`, `dziekujemy.html`, `style.css`, `script.js`
(CSS i JS współdzielone przez wszystkie strony).

## Deploy
Cloudflare Workers & Pages, projekt podłączony bezpośrednio do repo GitHub
(`KaCaR2137/fitpage`, branch `main`) — Workers & Pages → Create → Pages →
Import an existing Git repository. Automatyczny build/deploy przy każdym
pushu na `main`, bez lokalnego `wrangler.toml` ani CLI — cała konfiguracja
żyje po stronie dashboardu Cloudflare. Żywy adres:
`https://fitpage.kacperbarczak11.workers.dev`.

Cały root repo trafia jako publiczne assety (brak build stepu), stąd
`.assetsignore` w korzeniu repo — bez niego `PRODUCT.md`, `DESIGN.md`,
`CLAUDE.md`, `.impeccable/`, `.git/` byłyby publicznie dostępne pod swoimi
ścieżkami. Format identyczny jak `.gitignore`, podejście „domyślnie ukryj
wszystko” (`*`) + jawne odsłonięcie plików strony (`!*.html`, `!style.css`
itd.) — nie rosnąca lista zakazów.

## Logo, favicon, splash
`images/logo-fitpage.png` — dostarczony przez klienta, 2000×2000, kanał alfa
zachowany, oryginalny rozmiar (~90 KB), NIE pomniejszony (użyty wprost w nav
i splashu, skalowany przez CSS). Z niego wygenerowane (`sips`) dwa favicony:
`images/favicon-32.png` i `images/favicon-512.png` — podpięte na wszystkich
5 stronach (`<link rel="icon">` ×2 + `apple-touch-icon`).

Splash: `.splash` — pełnoekranowa nakładka z logo (96px), pierwsza rzecz w
`<body>` na każdej stronie, odtwarza się przy każdym wejściu (nie zapamiętuje
sesji). Czysty CSS, `animation-fill-mode: forwards` — nie wymaga JS do
zniknięcia, więc działa też bez niego. `prefers-reduced-motion`: nakładka
w ogóle się nie renderuje (`display:none`), zero opóźnienia w dostępie do treści.

## Strony
**`index.html`** — sekcje w kolejności:
1. Nav — logo-obrazek `images/logo-fitpage.png` (`.nav__logo-img`, 36px,
   `alt="FitPage"`) + linki do sekcji + CTA „Umów konsultację” → `kontakt.html`
   (sticky, menu mobilne < 700px)
2. Hero — „Niech Twoja forma nie będzie jedyną wizytówką” + podtytuł + CTA „Umów konsultację”
3. Treningi (pasek) — poziomy, zapętlony marquee (`.trainings`) z 8 ikonami+etykietami
   rodzajów treningu (wyciskanie na ławce, bieganie, pilates, balet, joga, boks,
   kolarstwo, pływanie), wzorowany na sekcji „Dla kogo” z marta-strona-trener.netlify.app.
   CSS-owa pętla bez JS: dwie kopie listy w jednym torze, `translateX(0 → -50%)`,
   `32s linear infinite`; druga kopia `aria-hidden`. Zatrzymuje się pod
   `prefers-reduced-motion`. Ikony neutralne, zielona kropka-separator jako jedyny akcent.
4. O nas — tekst + grafika `mockup1.png` (telefon z ekranem strony) obok, po prawej.
   Układ `.o-nas__grid` (flex): mobile = kolumna (telefon pod tekstem, max 220px),
   od 900px = wiersz tekst | telefon (max 250px). id `#o-nas`, klasa `.o-nas`.
   `mockup1.png` zmniejszony do 500×833 (~307 KB, alpha zachowana) — oryginał
   1857×3096 (~2,3 MB) w kopii poza repo. `<img>` ma `width/height` 500×833, bez `loading="lazy"`.
5. Portfolio — karty realizacji (na start: Marta Dominikowska → marta-strona-trener.netlify.app)
6. Kontakt (skrót) — CTA „Umów konsultację” + telefon **535 721 592**
   (`tel:+48535721592`; bezpośredni e-mail — patrz TODO)
7. Atuty (`.atuty`) — pasek 4 punktów (Bezpłatna konsultacja / Cała Polska, zdalnie /
   2 rundy poprawek w cenie / Wyłącznie trenerzy personalni), bez panelu, akcent
   punktowo tylko na pierwszej ikonie.
8. Footer — rząd skrótów „O nas” / „Proces tworzenia strony” / „FAQ” / „Kontakt”
   (`.footer__links`), pod nim logo + copyright. Ten sam footer (z tymi samymi
   4 linkami) na wszystkich stronach.

**`faq.html`** — najczęściej zadawane pytania, wydzielone z `index.html` na osobną
podstronę (dawniej sekcja `#faq` na stronie głównej). Kompaktowy hero + ten sam
akordeon `<details>`/`<summary>` (bez JS) co wcześniej + CTA „Umów konsultację” +
link „Wróć na stronę główną”. Wejście: „FAQ” w nav i w stopce (obie → `faq.html`).

**`polityka-prywatnosci.html`** — DRAFT, `<meta name="robots" content="noindex">`,
**celowo niepodlinkowana** z nav/stopki. Treść wklejona z `polityka-prywatnosci-DRAFT.md`
(sam plik roboczy zostaje w repo, nie jest częścią strony). Miejsca, których nie
dało się ustalić samodzielnie (tożsamość administratora, e-mail kontaktowy, okres
przechowywania danych w pozostałych przypadkach, odbiorca danych z formularza,
data publikacji) zostały w kodzie jako `<!-- TODO: ... -->` — usuń `noindex` i
dodaj link dopiero po ich uzupełnieniu. **Uwaga:** pkt 3 (odbiorcy danych) ma
już wpisanego realnego odbiorcę — Formspree (mechanizm wysyłki formularza
z `kontakt.html`, potwierdzony i podłączony) — pozostałe TODO w tym punkcie
dotyczą już tylko treści niezależnej od mechanizmu.

**`kontakt.html`** — podstrona z briefem (wg standardu ze skilla: formularz na
osobnej podstronie, nie w modalu). Pola: imię i nazwisko, e-mail, telefon,
opis wizji strony (textarea) + klauzula RODO (rozwijana) + zgoda wymagana
+ zgoda marketingowa opcjonalna. Wszystkie CTA „Umów konsultację” (nav + hero
+ sekcja kontakt na index) prowadzą tutaj.

Wysyłka: **Formspree** (`action="https://formspree.io/f/moeqzapr"`,
`method="post"`) — wybrane, bo hosting to Cloudflare Pages/Workers, gdzie
Netlify Forms (poprzednie podłączenie) nic nie dostarczało. Pola: ukryty
`_subject` (temat maila z powiadomieniem), ukryty `_next` (pełny adres
`https://fitpage.kacperbarczak11.workers.dev/dziekujemy.html` — **musi** być
pełnym URL-em, bo Formspree przekierowuje ze swojej domeny; **TODO:**
zaktualizować na docelową domenę, jeśli/gdy się pojawi), honeypot `_gotcha`
(Formspree po cichu odrzuca zgłoszenia z wypełnionym tym polem). Pole
`name="email"` jest automatycznie wykrywane przez Formspree jako adres
zwrotny (reply-to) — bez potrzeby `_replyto`. Bez JS formularz działa
natywnym POST-em wprost na Formspree, które po sukcesie przekierowuje na
`_next`; z JS — walidacja per-pole (komunikaty + `aria-invalid`/
`aria-describedby`), potem `fetch(form.action, { method: form.method, body:
new FormData(form), headers: { Accept: 'application/json' } })` z inline
potwierdzeniem, bez przeładowania (surowy `FormData` jako body, żeby
przeglądarka sama ustawiła multipart boundary — bez ręcznego urlencode).

Utwardzone (harden): fetch ma 15 s limit czasu przez `AbortController` (bez
tego, przy złej sieci albo martwym endpoincie, żądanie wisiałoby bez końca
z zablokowanym przyciskiem); przy odpowiedzi z błędem JS próbuje odczytać
JSON zwrócony przez Formspree (`errors[].message` / `error`) i pokazać
konkretniejszy komunikat zamiast zawsze tego samego ogólnego; przekroczenie
czasu ma osobny komunikat („wysyłka trwa zbyt długo”). Każdy wariant błędu
i tak kończy się podpowiedzią telefonu (535 721 592). Pola `imię i nazwisko`
(100), `e-mail` (254, wg RFC 5321), `telefon` (20) i `wizja` (4000) mają
`maxlength`, żeby ekstremalnie długi input nie trafiał bez ograniczeń do
Formspree/maila. Darmowy plan Formspree: limit 50 zgłoszeń/miesiąc — do
rozważenia przy realnym ruchu.

**Uwaga historyczna:** wcześniej rozważane MailChannels (darmowa wysyłka
maili z Cloudflare Workers) — ta integracja została zamknięta przez
MailChannels w sierpniu 2024, więc nie jest już opcją.

**`dziekujemy.html`** — strona potwierdzenia po wysłaniu briefu (cel `action`
formularza na `kontakt.html`, no-JS fallback). `<meta name=”robots” content=”noindex”>`,
bez wpisu w nav/stopce — trafia się tam tylko po submit.

**`proces.html`** — podstrona „Proces tworzenia strony” (wzór:
leadpage.pl/strony-internetowe/). Kompaktowy hero + 6 etapów (Analiza / Struktura /
Projekt / Development / Testy / Wdrożenie) w `.kroki__grid` / `.krok`. Każdy etap
ma krótki opis + rozwijane `<details class="krok__more">` („Więcej”) z dodatkowymi
informacjami. **Bez przycisków CTA i bez listy odnośników** — tylko link „Wróć na
stronę główną”. Wejście: link w stopce oraz „Proces” w nav (obie → `proces.html`).

## Paleta — motyw jasny
Świadomy wybór (nie domyślny jasny/ciemny wariant) — patrz `DESIGN.md`,
Creative North Star „The Morning Session”. Tło: płaski kremowy canvas
`--canvas #F7F3EA` na `body`/`html`, bez gradientu. Akcent: głęboka zieleń
butelkowa `--accent #1F3D2B` (hover `--accent-strong #2C6B47`) — używana
punktowo (guzik, linki, focus, numery kroków), nigdy jako duże wypełnienie.
Tekst na akcencie: jasny `--on-accent #FBF8F0` (odwrotność starego `--ink` —
akcent jest teraz ciemny, więc tekst na nim musi być jasny). Tekst ciemny
`--text #202821`, pomocniczy `--muted #52594F`. Błąd `--error #A13333`
(pogłębiony względem generycznego czerwonego — na jasnym tle płytszy
czerwony spada poniżej WCAG AA).

Sekcje nie mają własnego tła/obramowania/panelu — treść siedzi bezpośrednio
na canvasie, odstępy tylko przez padding. Jedyna świadomie ciemna
powierzchnia: stopka (`#16211B`, „Pine Black”) — linki w niej używają
`--on-accent`, bo `--accent-strong` traci tam kontrast. Nagłówki H1/H2 oraz
tekst hero/O nas/Kontakt mają subtelną, zazielenioną poświatę
(`text-shadow`, `rgba(31,45,36,.14)`). Zmienne w `:root` w `style.css`.

## Animacje przy scrollu
Scaffolding gotowy: klasa `.reveal` w HTML + współdzielony `IntersectionObserver`
w `script.js` dodający `.widoczna`, ze staggered `transitionDelay` dla rodzeństwa.
Bez JS treść jest normalnie widoczna (gate klasą `.js`). Respektuje
`prefers-reduced-motion`. Aby animować nowy element — dodaj mu klasę `.reveal`.

**Znany artefakt skanera (`impeccable detect <URL>`):** below-fold elementy
`.reveal` (np. `.faq__item`, `.krok__more`) bywają złapane przez headless
render w trakcie przejścia `opacity`, zanim `IntersectionObserver` je odsłoni
— skaner raportuje wtedy `low-contrast` z bardzo niskim „pixel contrast" na
snippetach opisanych jako „opacity stack". To nie jest realny błąd: policzone
ręcznie kontrasty rzeczywistych par kolorów (`--muted` na canvasie 6.54:1,
`--accent-strong` 5.74:1) mają zapas ponad wymagane WCAG AA 4.5:1. Sankcjonowany
wyjątek (`low-contrast` → `*` → `faq.html`/`proces.html`) jest już w
`.impeccable/config.json`. Jeśli finding wróci na kolejnej stronie z tym samym
below-fold `.reveal`-em i podpisem „opacity stack" — to ten sam artefakt, nie
nowy defekt; dodaj analogiczny ignore zamiast zmieniać tokeny kolorów.

## Dostępność
Domknięte pozostałe punkty z pierwszego audytu Impeccable:

- **Pierścień focusa** — globalna reguła `a:focus-visible, button:focus-visible,
  summary:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }`
  (góra `style.css`, sekcja Podstawy) pokrywa linki (nav, stopka, portfolio),
  `.btn`, `.nav__toggle` i wszystkie `<summary>` (FAQ, Proces, RODO) — dotąd
  polegały na domyślnym obramowaniu przeglądarki, które przy resetach
  (`border:0`, `list-style:none`) bywa niewidoczne. Pola formularza i
  custom checkbox zgody mają własny, wcześniejszy focus-ring (sekcja `.form`) —
  bez zmian.
- **Błąd pola tylko kolorem (WCAG 1.4.1/3.3.1)** — oprócz zmiany `border-color`
  i tekstu w `.form__error`, nieprawidłowe pole tekstowe/textarea oraz
  niezaznaczony wymagany checkbox zgody dostają dodatkowo ikonkę (koło
  z wykrzyknikiem, SVG data-URI z kolorem `--error`/`--on-accent` wpisanym na
  sztywno — ten sam wzorzec co ptaszek w `.form__consent-box`).
- **`.nav__toggle`** — `44×44px` (było `40×40px`, WCAG 2.5.5/2.5.8), padding
  przeliczony tak, żeby ikona hamburgera zostawała tego samego wizualnego rozmiaru.

## TODO przed publikacją
- [ ] Treść „O nas” — realna (lata doświadczenia, liczba stron, wyróżnik zespołu)
- [ ] FAQ — przejrzeć i doprecyzować odpowiedzi wg realnej oferty (bez wymyślonych cen/terminów)
- [ ] Bezpośredni e-mail w sekcji Kontakt na `index.html` (placeholder; telefon 535 721 592 już wstawiony)
- [ ] Klauzula RODO w `kontakt.html` — dane administratora, cel, podstawa prawna,
      **okres przechowywania** (ustalić wprost), prawa osoby, e-mail kontaktowy,
      prawo skargi do PUODO
- [ ] Zgoda marketingowa — doprecyzować kanał i podstawę (art. 10 uśude / art. 172 pt)
- [x] Podłączyć wysyłkę formularza z `kontakt.html` — Formspree, działa na
      obecnym hostingu (Cloudflare); darmowy plan ograniczony do 50
      zgłoszeń/miesiąc — do przypilnowania przy realnym ruchu
- [ ] `<title>` + meta description na obu stronach — sprawdzić, zero placeholderów
- [ ] Portfolio — opisy realizacji, ewentualnie miniatury (`object-fit: cover` + tło fallback)
- [ ] Test na 375px, test w incognito (obie strony)
- [ ] Wszystkie `<img>` mają `alt` (gdy dojdą zdjęcia)

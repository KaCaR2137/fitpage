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
`kontakt.html`, `style.css`, `script.js` (CSS i JS współdzielone przez obie strony).

## Strony
**`index.html`** — sekcje w kolejności:
1. Nav — logo `FitPage` + linki do sekcji + CTA „Umów konsultację” → `kontakt.html`
   (sticky, menu mobilne < 700px)
2. Hero — „Strony internetowe dla trenerów personalnych” + podtytuł + CTA „Umów konsultację”
3. O nas — tekst + grafika `mockup1.png` (telefon z ekranem strony) obok, po prawej.
   Układ `.o-nas__grid` (flex): mobile = kolumna (telefon pod tekstem, max 220px),
   od 900px = wiersz tekst | telefon (max 250px). Poświata w kolorze akcentu pod
   telefonem (`.o-nas__visual::before`). id `#o-nas`, klasa `.o-nas`.
   `mockup1.png` zmniejszony do 500×833 (~307 KB, alpha zachowana) — oryginał
   1857×3096 (~2,3 MB) w kopii poza repo. `<img>` ma `width/height` 500×833, bez `loading="lazy"`.
4. Portfolio — karty realizacji (na start: Marta Dominikowska → marta-strona-trener.netlify.app)
5. Kontakt (skrót) — CTA „Umów konsultację” + bezpośredni e-mail (placeholder) i
   telefon **535 721 592** (`tel:+48535721592`)
6. FAQ — akordeon `<details>`/`<summary>` (bez JS) + dodatkowy CTA „Umów konsultację” → `kontakt.html`
7. Footer — link **„Proces tworzenia strony”** (`.footer__link`) → `proces.html`,
   pod nim logo + copyright. Ten sam footer na wszystkich stronach.

**`kontakt.html`** — podstrona z briefem (wg standardu ze skilla: formularz na
osobnej podstronie, nie w modalu). Pola: imię i nazwisko, e-mail, telefon,
opis wizji strony (textarea) + klauzula RODO (rozwijana) + zgoda wymagana
+ zgoda marketingowa opcjonalna. Wszystkie CTA „Umów konsultację” (nav + hero
+ sekcja kontakt na index) prowadzą tutaj.

**`proces.html`** — podstrona „Proces tworzenia strony” (wzór:
leadpage.pl/strony-internetowe/). Kompaktowy hero + 6 etapów (Analiza / Struktura /
Projekt / Development / Testy / Wdrożenie) w `.kroki__grid` / `.krok`. Każdy etap
ma krótki opis + rozwijane `<details class="krok__more">` („Więcej”) z dodatkowymi
informacjami. **Bez przycisków CTA i bez listy odnośników** — tylko link „Wróć na
stronę główną”. Wejście: link w stopce oraz „Proces” w nav (obie → `proces.html`).

## Paleta — motyw ciemny
Tło całej strony: pionowy gradient **czerń → żółć** (`--page-grad` na `body`,
góra `#000` → dół `#f5c518`), rozciągnięty na całą wysokość dokumentu.
Akcent: żółty `#f5c518` (hover `#ffd23f`), tekst na żółtym: `--ink` `#1a1a1a`.
Tekst jasny (`--text #f2f2f2`, `--muted #c4c4c4`).

Czytelność mimo gradientu: treść każdej sekcji siedzi na półprzezroczystym
panelu `.section > .container` (`--panel rgba(16,16,16,.70)` + blur). Gradient
prześwituje w hero (u góry czerń), w odstępach między panelami i mocno na dole
(żółć) wokół FAQ / stopki. Hero i nav bez własnego koloru tła (nav: czarny
półprzezroczysty). Stopka: lity `#0a0a0a`. Zmienne w `:root` w `style.css`.

## Animacje przy scrollu
Scaffolding gotowy: klasa `.reveal` w HTML + współdzielony `IntersectionObserver`
w `script.js` dodający `.widoczna`, ze staggered `transitionDelay` dla rodzeństwa.
Bez JS treść jest normalnie widoczna (gate klasą `.js`). Respektuje
`prefers-reduced-motion`. Aby animować nowy element — dodaj mu klasę `.reveal`.

## TODO przed publikacją
- [ ] Treść „O nas” — realna (lata doświadczenia, liczba stron, wyróżnik zespołu)
- [ ] FAQ — przejrzeć i doprecyzować odpowiedzi wg realnej oferty (bez wymyślonych cen/terminów)
- [ ] Bezpośredni e-mail w sekcji Kontakt na `index.html` (placeholder; telefon 535 721 592 już wstawiony)
- [ ] Klauzula RODO w `kontakt.html` — dane administratora, cel, podstawa prawna,
      **okres przechowywania** (ustalić wprost), prawa osoby, e-mail kontaktowy,
      prawo skargi do PUODO
- [ ] Zgoda marketingowa — doprecyzować kanał i podstawę (art. 10 uśude / art. 172 pt)
- [ ] Podłączyć wysyłkę formularza z `kontakt.html` (Formspree / Netlify Forms / backend)
- [ ] `<title>` + meta description na obu stronach — sprawdzić, zero placeholderów
- [ ] Portfolio — opisy realizacji, ewentualnie miniatury (`object-fit: cover` + tło fallback)
- [ ] Test na 375px, test w incognito (obie strony)
- [ ] Wszystkie `<img>` mają `alt` (gdy dojdą zdjęcia)

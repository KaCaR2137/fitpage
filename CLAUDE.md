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
żyje po stronie dashboardu Cloudflare. Docelowa domena `fitpage.pl` jest
już podłączona i żywa (potwierdzone 17.09.2026: HTTP 200, serwuje tę samą
treść) — to na nią wskazują teraz `sitemap.xml`, `robots.txt`, wszystkie
`<link rel="canonical">` i przekierowania `_next` Formspree. Techniczny
adres Cloudflare (`https://fitpage.kacperbarczak11.workers.dev`) wciąż
działa równolegle jako dev/fallback URL, ale nie jest już nigdzie w kodzie
wskazywany jako docelowy.

Cały root repo trafia jako publiczne assety (brak build stepu), stąd
`.assetsignore` w korzeniu repo — bez niego `PRODUCT.md`, `DESIGN.md`,
`CLAUDE.md`, `.impeccable/`, `.git/` byłyby publicznie dostępne pod swoimi
ścieżkami. Format identyczny jak `.gitignore`, podejście „domyślnie ukryj
wszystko” (`*`) + jawne odsłonięcie plików strony (`!*.html`, `!style.css`
itd.) — nie rosnąca lista zakazów.

## Obrazy — WebP z fallbackiem
Wszystkie zdjęcia/grafiki użyte przez `<img>` (logo, mockup telefonu) mają
teraz WebP obok oryginału (PNG) i są wpięte przez
`<picture><source type="image/webp">...<img></picture>` — nowoczesna
przeglądarka pobiera tylko WebP (zweryfikowane: oryginał PNG/JPG w ogóle
nie trafia do sieci, `performance.getEntriesByType('resource')` to
potwierdza), starsza dostaje `<img>` z oryginałem. Konwersja przez Pillow
(`sips` na tym macOS nie zapisuje WebP) — grafiki płaskie/z przezroczystością
(logo, favicony) na `quality=90` (lżejsze niż lossless przy tej treści),
zdjęcia (JPG) na `quality=80`. Oszczędność łącznie ok. 77% (896KB → 204KB
dla wszystkich siedmiu plików).

**Tła CSS (`background-image` na `.hero--cover`, zdjęcia artykułów) NIE
używają `<picture>`** — ten tag działa tylko dla `<img>`, nie dla CSS.
Zamiast tego dwie warstwowe deklaracje w tym samym atrybucie `style`: zwykły
`url()` jako pierwsza (fallback, każda przeglądarka), potem
`image-set(url(...) type('image/webp'), url(...) type('image/jpeg'))` jako
druga — przeglądarka, która nie rozumie `image-set()`, po prostu ignoruje tę
deklarację i zostaje przy pierwszej.

**Favicony (`<link rel="icon">`, `apple-touch-icon`) zostały PNG-only** —
`<picture>` nie dotyczy `<link>`, więc nie ma tu odpowiednika tej samej
techniki; podwójne `<link rel="icon" type="...">` per format to inny
mechanizm, celowo pominięty (pliki i tak ważą 1-26 KB, zysk pomijalny
względem złożoności). `images/favicon-32.webp`/`images/favicon-512.webp`
istnieją na dysku (wygenerowane przy okazji), ale **nic ich nie
referencjuje** — zostały jako gotowe źródło, gdyby kiedyś ta technika
miała sens.

**Kolejny nowy obraz w `images/` lub przy artykule:** wygeneruj też jego
`.webp` (Pillow, jak wyżej) i owiń istniejący `<img>` w `<picture>` /
dodaj drugą warstwę `background-image` — ta sama zasada co przy artykułach
(patrz "Workflow wklejania artykułu" niżej), nie osobny, ręczny wybór za
każdym razem.

`images/logo-fitpage.png` — druga wersja loga od klienta (16.09.2026,
zastąpiła pierwszą, 2000×2000). Źródło: `logo2.png` w korzeniu repo
(596×596, realnie przezroczyste tło — zweryfikowane programowo, alfa=0 w
rogach i poza kształtem), użyty wprost bez zmiany rozmiaru (nadal z
zapasem rozdzielczości przy wyświetlaniu w 44px/125px przez CSS). Z niego
wygenerowane (Pillow) `images/logo-fitpage.webp` (jakość 90, jak inne
płaskie/przezroczyste grafiki) oraz — przez `resize` w Pillow, nie `sips` —
dwa favicony: `images/favicon-32.png` i `images/favicon-512.png` — te same
nazwy plików co poprzednio, więc `<head>` nie wymagał żadnej zmiany. Dwa
pozostałe warianty od klienta zostały w repo jako referencja/źródło, nic
ich nie używa: `logo1.svg` (pełne logo, ikona + wektorowy napis „FitPage” —
napis w nav/stopce to wciąż żywy tekst w Fraunces, nie ten SVG) i
`logo3.png` (wariant „badge" — pełne, nieprzezroczyste ciemnozielone
zaokrąglone tło, nie pasował do „przezroczyste tło"). Żaden z tych trzech
plików nie jest w `.assetsignore` allowlist, więc pozostają niepubliczne
mimo leżenia w korzeniu repo — tak samo jak oryginały-źródła innych grafik.

W nav logo to teraz para: ikona (`.nav__logo-img`, `44px` wysokości) + napis
`.nav__logo-text` „FitPage” (waga 800, `1.3rem`, tracking -0.03em) obok
siebie (`gap: 10px`) — rozmiar dobrany tak, żeby cały układ miał wysokość
zbliżoną do `.nav__cta` (zmierzone: `44px` vs `~43px`). `alt=""` na obrazku,
bo widoczny tekst obok przejmuje rolę nazwy dostępności — inaczej czytnik
ekranu ogłosiłby „FitPage” dwa razy.

Splash: `.splash` — pełnoekranowa nakładka z logo (96px), pierwsza rzecz w
`<body>` na każdej stronie, odtwarza się przy każdym wejściu (nie zapamiętuje
sesji). Czysty CSS, `animation-fill-mode: forwards` — nie wymaga JS do
zniknięcia, więc działa też bez niego. `prefers-reduced-motion`: nakładka
w ogóle się nie renderuje (`display:none`), zero opóźnienia w dostępie do treści.

## Strony
**`index.html`** — sekcje w kolejności:
1. Nav — logo (`.nav__logo-img` 44px + `.nav__logo-text` „FitPage”) + linki do
   sekcji (O nas, Portfolio, Proces, FAQ) + CTA „Umów konsultację” →
   `kontakt.html`, wszystko wewnątrz `.nav__right` (sticky, menu mobilne <
   700px). **CTA nie chowa się do hamburgera** — poniżej 700px znika tylko
   `.nav__links` (same linki tekstowe); przycisk zostaje widoczny w pasku nav
   obok hamburgera (dopasowany rozmiar: `10px 14px` padding → `11px 14px` od
   poprawki wysokości dotykowej niżej, `0.85rem`, `148×44px`, mieści się bez
   zawijania obok 44px hamburgera). Naprawione przez `/impeccable adapt` po
   krytyce, która złapała, że ukrywanie głównej akcji konwersji za
   hamburgerem kosztuje na stronie, której odbiorcy są w większości mobilni
   (PRODUCT.md). **Historia (nieaktualna liczba linków, zasada nadal
   obowiązuje):** z 7 elementami (6 linków + CTA, po dodaniu linku „Opinie”)
   `gap: 26px` przestał się mieścić w oknie 700-709px — naprawione
   zmniejszeniem `gap` do `20px`. Później (`/impeccable critique`, patrz
   niżej) `.nav__links` zredukowane do 4 linków (Artykuły/Opinie przeniesione
   do stopki), więc ten konkretny overflow już się nie powtórzy przy żadnej
   dotychczasowej szerokości — `gap: 20px` zostaje bez zmian, po prostu z
   większym zapasem niż wtedy. `.nav__cta` dobite do pełnych `44px` wysokości
   (WCAG 2.5.5/2.5.8, ten sam próg co `.nav__toggle`) pionowym paddingiem
   `11px` zamiast `10px` — poziomy padding/szerokość bez zmian.
2. Hero — „Niech Twoja forma nie będzie jedyną wizytówką” + podtytuł + CTA „Umów konsultację”
3. Treningi (pasek) — poziomy, zapętlony marquee (`.trainings`) z 8 ikonami+etykietami
   rodzajów treningu (trening siłowy, bieganie, pilates, balet, joga, boks,
   kolarstwo, pływanie), wzorowany na sekcji „Dla kogo” z marta-strona-trener.netlify.app.
   CSS-owa pętla bez JS: dwie kopie listy w jednym torze, `translateX(0 → -50%)`,
   `32s linear infinite`; druga kopia `aria-hidden`. Zatrzymuje się pod
   `prefers-reduced-motion`. Ikony neutralne, zielona kropka-separator jako jedyny akcent.
4. O nas — tekst + grafika `mockup1.png` (telefon z ekranem strony) obok, po prawej.
   Układ `.o-nas__grid` (flex): mobile = kolumna (telefon pod tekstem, max 220px),
   od 900px = wiersz tekst | telefon (max 250px). id `#o-nas`, klasa `.o-nas`.
   `mockup1.png` zmniejszony do 500×833 (~307 KB, alpha zachowana) — oryginał
   1857×3096 (~2,3 MB) w kopii poza repo. `<img>` ma `width/height` 500×833, bez `loading="lazy"`.
   Od WebP-konwersji: `<img>` owinięty w `<picture>` z `mockup1.webp` (~47 KB,
   patrz "Obrazy — WebP z fallbackiem" wyżej) — `mockup1.webp` jest w korzeniu
   repo obok `.png`, więc ma własny wpis `!mockup1.webp` w `.assetsignore`
   (sam `!mockup1.png` go nie odsłania — ten sam typ luki co wcześniej przy
   `artykuly/`, złapany i naprawiony od razu, zanim trafił na produkcję).
5. Portfolio — karty realizacji (na start: Marta Dominikowska → marta-strona-trener.netlify.app)
6. Artykuły (podgląd) — dawniej tu była sekcja „Kontakt (skrót)” (CTA „Umów
   konsultację” + telefon 535 721 592); usunięta i zastąpiona podglądem
   artykułów, ten sam markup co lista na `artykuly.html` (`.artykuly__grid`
   + `.artykul-card`, karty obok siebie na desktopie dzięki `auto-fit` —
   patrz sekcja `artykuly.html` niżej) + link „Zobacz wszystkie artykuły” →
   `artykuly.html`. **Uwaga (celowa rozbieżność od 16.09.2026):** to już
   **nie jest** zawsze pełne lustro pełnej listy — pokazuje tylko 3
   najstarsze z 4 obecnych artykułów (`jak-zdobyc-klientow-bez-reklam`,
   `ile-kosztuje-strona-dla-trenera`, `jak-wyroznic-sie-jako-trener`);
   najnowszy (`instagram-czy-strona`) pojawia się tylko na pełnej liście,
   na wyraźne życzenie — podgląd na stronie głównej ma pozostać krótki,
   pełna lista ma być jedynym miejscem, które rośnie wraz z każdym kolejnym
   artykułem. Przy dodawaniu kolejnych artykułów: domyślnie dopisuj tylko do
   `artykuly.html`, nie kopiuj automatycznie do tego podglądu, chyba że
   ktoś wyraźnie o to poprosi. To był też jedyny widoczny numer telefonu na
   stronie głównej poza nav/hero CTA — sam numer nigdzie indziej na
   `index.html` się teraz nie pojawia (formularz na `kontakt.html` nadal go
   pokazuje jako fallback błędu wysyłki).
7. Atuty (`.atuty`) — pasek 4 punktów (Bezpłatna konsultacja / Cała Polska, zdalnie /
   2 rundy poprawek w cenie / Trenerzy, instruktorzy, coache), bez panelu, akcent
   punktowo tylko na pierwszej ikonie.
8. CTA (domykające, `.cta-closing`) — „Gotowy zacząć?” + krótki podtekst +
   ten sam `.btn.btn--primary` co w hero/nav, wyśrodkowane, bez panelu (Flat
   Canvas Rule) i bez nowych efektów wizualnych. Dodane po `/impeccable
   critique`, która złapała naruszenie peak-end rule — strona kończyła się
   najsilniejszym blokiem zaufania (Atuty) i wpadała prosto w ciemną stopkę
   bez żadnego wezwania do działania.
9. Footer — rząd skrótów „O nas” / „Proces tworzenia strony” / „FAQ” /
   „Artykuły” / „Opinie” / „Kontakt” / „Polityka prywatności” (`.footer__links`,
   7 linków), pod nim logo + copyright. Ten sam footer (z tymi samymi 7
   linkami) na wszystkich stronach.

**`faq.html`** — najczęściej zadawane pytania, wydzielone z `index.html` na osobną
podstronę (dawniej sekcja `#faq` na stronie głównej). Kompaktowy hero + ten sam
akordeon `<details>`/`<summary>` (bez JS) co wcześniej + CTA „Umów konsultację” +
link „Wróć na stronę główną”. Wejście: „FAQ” w nav i w stopce (obie → `faq.html`).

**`artykuly.html`** — lista artykułów. Kompaktowy hero + `.artykuly__grid` —
`repeat(auto-fit, minmax(280px, 1fr))`, **nie** `auto-fill`/px-owy max jak
portfolio: puste tory zapadają się zamiast zostawiać widoczną dziurę, a
realne karty rozciągają się i wypełniają wiersz (2 karty → ~508px każda;
od 3 w górę mieszczą się obok siebie po ~331px, bez zmiany layoutu). Karty
`.artykul-card` (data, tytuł-link, **cały lead to teraz link** kończący się
inline strzałką w prawo — **nie** ikoną „otwiera w nowej karcie” z
portfolio, bo to nawigacja wewnętrzna). Żadnego osobnego „Czytaj dalej” —
usunięte świadomie, żeby przy kilku kartach obok siebie nie mnożyć
elementów; sam teaser niesie akcję (Leaf Green na hover), celowo nie jako
wypełniony `.btn` (3 zielone przyciski naraz łamałyby oszczędność akcentu).
Cała karta klikalna (`::after` na tytule + osobny, realny link na leadzie,
`z-index:1` żeby wygrać z `::after`), bez zagnieżdżania linków. Cień/
uniesienie tylko na hover/focus — karta w spoczynku jest płaska jak
`.krok`, zgodnie z „The Lift-Means-Interactive Rule” (cień w spoczynku jest
zastrzeżony dla portfolio). Wejście: „Artykuły” w nav i w stopce (wszystkie
strony), między FAQ a Kontakt. Cztery artykuły obecnie (najnowszy:
„Instagram czy własna strona internetowa? Co bardziej buduje zaufanie
klienta”, 16.09.2026 — początkowo bez zdjęcia w tle nagłówka, bo klient
nie dostarczył grafiki od razu; zdjęcie (`tlodoartykulu4.png`, rozmyty
telefon z ikonami Instagrama/social mediów na czarnym tle) doszło
17.09.2026 tym samym workflow co pozostałe artykuły — patrz „Opcjonalne
zdjęcie w tle nagłówka” niżej, teraz też `.hero--cover`) + komentarz
`<!-- TODO: kolejne artykuły -->`
pokazujący gdzie kopiować kolejne karty. Poniżej 480px karta jest wyraźnie ciaśniejsza
(mniejszy padding/odstępy/font nagłówka, lead przycięty do 3 linii przez
`-webkit-line-clamp`) — pojedyncza karta potrafiła zająć do ~37% wysokości
ekranu telefonu 390px, przez co nic nie sugerowało, że pod spodem jest więcej
artykułów; od 480px w górę wraca pełny, nieprzycięty rozmiar (patrz DESIGN.md,
sekcja Article card, po pełne wartości).

**`artykuly/<slug>.html`** (np. `artykuly/jak-wyroznic-sie-jako-trener.html`) —
szablon pojedynczego artykułu, w podkatalogu `artykuly/` (stąd `../` przed
każdym odnośnikiem do stylu/skryptu/obrazów/innych stron w nav i stopce —
łatwo przeoczyć przy kopiowaniu szablonu). Nagłówek: kompaktowy hero z datą
publikacji (`.artykul__meta`) nad tytułem (h1). Treść w `.artykul__body` —
typografia jak `.polityka` (tryb „Read”): tekst ograniczony do ~65ch, h2/h3
dozwolone (bez pomijania poziomów), `<strong>` w Text Primary, listy ze
standardowym odstępem. Po treści opcjonalny `.artykul__cta` (ten sam wzorzec
co `.faq__cta`: akapit + `.btn.btn--primary` do `kontakt.html`) — nie każdy
artykuł musi go mieć, dodaj gdy treść naturalnie kończy się wezwaniem do
kontaktu. Link powrotny `.artykul__back` → `artykuly.html`. Cała ta kolumna
(nagłówek + treść + CTA + link powrotny) jest owinięta w `.artykul`,
wycentrowana (`max-width: 65ch; margin-inline: auto`) w szerszym
`.container` — **nie** przyklejona do lewej krawędzi, bo to na desktopie
zostawiało puste miejsce wyłącznie po prawej stronie (złapane i naprawione
już po opublikowaniu pierwszego artykułu).

**Linkowanie międzyartykułowe (od 17.09.2026).** Każdy z czterech artykułów
ma teraz: (1) co najmniej jeden link w treści `.artykul__body` do innego
artykułu, wstawiony tylko tam, gdzie zdanie się do tego już nadawało (bez
naginania treści na siłę), i (2) blok `.artykul__related` tuż przed
`.artykul__cta` — hairline `border-top`, pogrubiona etykieta „Zobacz też”
(Text Primary) + jeden link (Leaf Green). Styl linku w treści: `color:
var(--accent-strong)`, bez podkreślenia w spoczynku, podkreślenie tylko na
`:hover`/`:focus-visible` (`.artykul__body a`, `style.css`) — to zwykły
link tekstowy w zdaniu, **nie** link-przycisk jak `.artykul__back`/
`.card__link` (te dostają `translateY` + cień na hover, patrz „Popraw
animacje interakcji” wyżej; uniesienie pojedynczego słowa w środku akapitu
wyglądałoby na złamane). Obecna sieć linków (nieprzypadkowa, dopasowana
tematycznie): `jak-wyroznic-sie-jako-trener` ↔ `instagram-czy-strona`
(oba linkują do siebie nawzajem inline — ten sam motyw: profil wyglądający
tak samo jak tysiące innych trenerów), `ile-kosztuje-strona-dla-trenera` →
`jak-wyroznic-sie-jako-trener` (przy wzmiance o gotowym szablonie „takim
samym jak u innych”), `jak-zdobyc-klientow-bez-reklam` →
`instagram-czy-strona` (przy temacie profilu ginącego w przewijaniu).
Sekcje „Zobacz też” domykają graf tak, żeby każdy artykuł prowadził do co
najmniej jednego innego: `jak-wyroznic-sie-jako-trener` → `ile-kosztuje`,
`ile-kosztuje` → `jak-zdobyc-klientow-bez-reklam`, `jak-zdobyc-klientow-bez-reklam`
→ `jak-wyroznic-sie-jako-trener`, `instagram-czy-strona` →
`jak-zdobyc-klientow-bez-reklam`. Przy dodawaniu piątego artykułu: szukaj
podobnych, realnych zazębień tematycznych zamiast linkować mechanicznie do
wszystkich naraz, i dodaj mu też własną sekcję „Zobacz też”.

**Workflow wklejania artykułu (obowiązuje dla każdego pliku, który zostanie
wskazany jako gotowy artykuł):** źródło to plik roboczy Markdown w korzeniu
repo (np. `artykul-<slug>-DRAFT.md`, wzorem `polityka-prywatnosci-DRAFT.md`)
— zostaje w repo jako referencja, ukryty w publicznych assetach przez
`.assetsignore` (`*.md`). Konwersja Markdown → HTML: `#` tytuł nie duplikuje
się w treści (już jest w hero jako h1), `##` → `<h2>` z zachowaną numeracją
w tekście nagłówka, akapity → `<p>`, `**pogrubienie**` → `<strong>`, cudzysłów
prosty `"..."` → typograficzny „...” (konwencja całej strony), zamykający
CTA-link w stylu `[tekst](/kontakt)` → prawdziwy `.btn.btn--primary` do
`../kontakt.html` w bloku `.artykul__cta` (nie zwykły link — to już
ugruntowany wzorzec CTA na stronie). `<meta name="description">` = ten sam
tekst zachęty, co na karcie listy/podglądu (jeśli już ustalony) — nie
wymyślać nowego. Pierwszy przykład: `jak-wyroznic-sie-jako-trener.html`,
z `artykul-jak-wyroznic-sie-DRAFT.md`.

**Opcjonalne zdjęcie w tle nagłówka** — jeśli do artykułu dostarczone jest
zdjęcie (od razu lub później, jak przy `instagram-czy-strona.html`, patrz
wyżej): zoptymalizować do JPEG (`sips -Z 1600 -s format jpeg -s
formatOptions 78`, docelowo `images/artykul-<slug>-hero.jpg` — oryginał
może zostać w korzeniu repo jako źródło, bezpieczny bo poza allowlistą
`.assetsignore`) **i** wygenerować `.webp` obok (Pillow, `quality=80` —
ten sam schemat co reszta zdjęć, patrz „Obrazy — WebP z fallbackiem”
wyżej). Dodać klasę `.hero--cover` do `<section class="hero
hero--compact">` tej strony + dwuwarstwowy `style="background-image:
url('../images/....jpg'); background-image: image-set(url('../images/....webp')
type('image/webp'), url('../images/....jpg') type('image/jpeg'));"`
inline (obraz to treść per-artykuł, reszta stylu już czeka w
`style.css`) — ten sam wzorzec `image-set()` co przy tłach CSS gdzie
indziej (patrz „Tła CSS” wyżej), nie `<picture>` (to działa tylko dla
`<img>`). Nie kopiować CSS `.hero--cover` między stronami — to
współdzielona klasa, jeden artykuł = jedna linijka inline z URL-ami
zdjęcia. Sprawdzić kontrast tekstu piksel po pikselu (PIL, jak przy
poprzednich zdjęciach) — jeśli najciemniejszy scrim (0.65) i najjaśniejszy
realny fragment zdjęcia i tak dają >=4.5:1, nic nie trzeba dostrajać.

**`polityka-prywatnosci.html`** — **Żywa i podlinkowana** (stopka, wszystkie
strony — jako ostatni link, po Kontakt) — `noindex` usunięty (16.09.2026).
Treść wklejona z `polityka-prywatnosci-DRAFT.md` (sam plik roboczy zostaje w
repo, nie jest częścią strony), wszystkie TODO uzupełnione realnymi danymi:
administrator — Kacper Barczak (osoba fizyczna, bez zarejestrowanej
działalności gospodarczej); kontakt w sprawach ochrony danych —
`kontakt@fitpage.pl`; okres przechowywania — 12 miesięcy od ostatniego
kontaktu, przy zawartej współpracy zgodnie z przepisami podatkowymi;
odbiorca danych — Formspree, Inc. (USA), z wprost dopisaną wzmianką o
możliwym transferze danych poza EOG (pkt 3); data ostatniej aktualizacji —
16 września 2026. Klauzula RODO w `kontakt.html` (`.form__rodo`) uzupełniona
tymi samymi danymi i linkuje na końcu do tej strony po realne informacje
o odbiorcach danych — nie duplikuje ich w całości.

**`opinie.html`** — opinie klientów. **Żywa i podlinkowana** (nav + stopka,
wszystkie strony) — `noindex` usunięty. Odsłonięta świadomie zanim pojawiła
się pierwsza realna opinia (decyzja klienta: „odsłoń stronę teraz, opinię
dodam sam/sama później”), więc zbiorczy wskaźnik (`.opinie__summary`) jest
teraz **uczciwym stanem pustym**, nie placeholderem: 5 konturowych
(niewypełnionych) gwiazdek SVG + tekst „0 opinii”, bez żadnej liczbowej
średniej — pokazanie oceny bez ani jednej opinii za nią byłoby fikcyjną
statystyką (patrz DESIGN.md, „Named Rule — no invented statistics”).
`.opinie__grid` (ten sam wzorzec siatki co `.artykuly__grid` —
`auto-fit, minmax(280px, 1fr)`) z kartami `.opinia-card` (płaskie w
spoczynku, cień tylko na hover, jak `.artykul-card`/`.krok`) — **wciąż
celowo pusta**, zero przykładowych opinii w kodzie, tylko zakomentowany
szablon karty (wypełnione gwiazdki, realna treść/autor) do skopiowania przy
wklejaniu pierwszej prawdziwej opinii. Gdy pojawi się pierwsza opinia:
wklej kartę z szablonu **i** zamień pusty stan wskaźnika na wypełnione
gwiazdki + realną średnią (np. „5.0” + aria-label „Ocena 5 na 5 gwiazdek” +
„(1 opinia)”) — instrukcja zapisana wprost w komentarzu HTML nad tą sekcją.

**`kontakt.html`** — podstrona z briefem (wg standardu ze skilla: formularz na
osobnej podstronie, nie w modalu). Wszystkie CTA „Umów konsultację” (nav +
hero + sekcja kontakt na index) prowadzą tutaj.

**Pola (rozbudowane 18.09.2026, kolejność jak w formularzu):**
- Wymagane: imię i nazwisko, e-mail, telefon, **miasto/forma zajęć**
  (`miasto_forma_zajec`, nowe — krótki tekst, placeholder „np. Poznań,
  stacjonarnie i online”).
- Opcjonalne (każde z `<span class="form__optional">(opcjonalnie)</span>`
  w etykiecie, żeby nie było wątpliwości które pola można pominąć):
  specjalizacja, oferta/pakiety (obie textarea), **ceny na stronie**
  (`.form__radio-group`, 2 opcje: „Chcę pokazać konkretne ceny” / „Wolę
  „Zapytaj o wycenę””), co Cię wyróżnia (textarea), Instagram/Facebook
  (tekst), **styl strony** (`.form__radio-group`, 3 opcje: poważnie i
  eksperckie / swobodnie i przyjaźnie / coś pomiędzy), inspiracja (tekst,
  link do strony wzorcowej).
- **„Twoja wizja strony”** (textarea, na samym końcu, tuż przed RODO) —
  była jedynym wymaganym polem opisowym, teraz **opcjonalna**, przemianowana
  w treści placeholdera na ogólne „dowolne uwagi, które nie zmieściły się w
  polach powyżej” (stare pytania z placeholdera — specjalizacja, oferta,
  linki-inspiracje — mają już własne, dedykowane pola, więc zostawienie
  starego tekstu dublowałoby je).

`.form__radio-group` — nowy, prosty wzorzec dla grupy radio z tekstowymi
opcjami (nie ocena gwiazdkowa jak `.form__rating-group`): natywne radio
**widoczne** (nie ukryte jak w ocenie — nie ma tu osobnej ikony do
narysowania), `accent-color: var(--accent)`, cel dotyku 44px na całej
etykiecie `<label>` (klik gdziekolwiek w label zaznacza input — to
wystarcza na WCAG 2.5.5/2.5.8 bez custom SVG). Oba pola radio są
opcjonalne, więc bez `required`/ikonki błędu — `script.js` i tak ich nie
zbiera do walidacji (selektor `formFields` łapie `.form__row input/textarea`
i `[required]` warianty konsentu/oceny, nie `.form__radio-group`).

Klauzula RODO: opis zbieranych danych celowo ogólny („dane kontaktowe oraz
informacje o Twojej działalności i wizji strony”), nie wymienia już pól
z nazwy — przy 11 polach dosłowna lista szybko się dezaktualizuje przy
każdej kolejnej zmianie formularza.

Wysyłka: **Formspree** (`action="https://formspree.io/f/moeqzapr"`,
`method="post"`) — wybrane, bo hosting to Cloudflare Pages/Workers, gdzie
Netlify Forms (poprzednie podłączenie) nic nie dostarczało. Pola: ukryty
`_subject` (temat maila z powiadomieniem), ukryty `_next` (pełny adres
`https://fitpage.pl/dziekujemy.html` — **musi** być pełnym URL-em, bo
Formspree przekierowuje ze swojej domeny; zaktualizowane z
`fitpage.kacperbarczak11.workers.dev` na `fitpage.pl` 17.09.2026, po
potwierdzeniu że domena już żyje), honeypot `_gotcha`
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
rozważenia przy realnym ruchu. **Uwaga:** ten limit bywa liczony per
konto, nie per formularz — jeśli tak, to `kontakt.html` i
`opinie-dodaj.html` (osobny formularz `mwlkdyvb`, ale to samo konto)
dzielą wspólną pulę 50/miesiąc; do zweryfikowania wprost w panelu
Formspree, jeśli ruch na obu formularzach zacznie rosnąć.

**Uwaga historyczna:** wcześniej rozważane MailChannels (darmowa wysyłka
maili z Cloudflare Workers) — ta integracja została zamknięta przez
MailChannels w sierpniu 2024, więc nie jest już opcją.

**`dziekujemy.html`** — strona potwierdzenia po wysłaniu briefu (cel `action`
formularza na `kontakt.html`, no-JS fallback). `<meta name=”robots” content=”noindex”>`,
bez wpisu w nav/stopce — trafia się tam tylko po submit.

**`opinie-dodaj.html`** — osobny, krótszy formularz do zbierania realnych opinii
od klientów, ten sam wzorzec co `kontakt.html`/`polityka-prywatnosci.html`:
`<meta name="robots" content="noindex">`, **celowo niepodlinkowana** z
nav/stopki — dostęp tylko przez bezpośredni link wysyłany klientom
indywidualnie po zakończeniu projektu (nie trafia tam nikt z ruchu
organicznego). Pola: imię i nazwisko, ocena w gwiazdkach (`.form__rating`,
5 natywnych radio-buttonów `name="ocena"`, wymagane), treść opinii
(textarea, wymagane), specjalizacja/kontekst współpracy (opcjonalnie), zgoda
na publikację imienia i nazwiska wraz z treścią opinii (`.form__consent`,
wymagana) + klauzula RODO (`.form__rodo`, te same placeholdery co w
`kontakt.html` — TODO przed wysyłką linku klientom). **Osobny formularz
Formspree** (`action="https://formspree.io/f/mwlkdyvb"`) — inny niż
`kontakt.html` (`moeqzapr`), żeby zgłoszenia opinii nie mieszały się w
jednej skrzynce z briefami nowych zapytań. `_next` → `dziekujemy-opinia.html`
(dedykowana, uogólniona strona potwierdzenia — treść `dziekujemy.html` mówi
wprost o "briefie", więc nie nadawała się do przekierowania po wysłaniu opinii).

**Ocena w gwiazdkach (`.form__rating`)** — klasyczna, czysto CSS-owa sztuczka:
DOM w kolejności odwróconej (5,4,3,2,1) + `flex-direction: row-reverse`
przywraca wizualny porządek 1→5, a `~` (ogólny selektor rodzeństwa) od
zaznaczonej/najechanej gwiazdki poprawnie zapala też wszystkie "niższe".
Natywne radio są wizualnie ukryte (ten sam wzorzec „visually hidden” co
`.form__consent > input`), ale zostają w drzewie dostępności i w tab-order —
w pełni obsługiwane z klawiatury. Każda etykieta to `44×44px` cel dotyku
(WCAG 2.5.5/2.5.8, ten sam próg co `.nav__toggle`) z ikoną SVG w środku (ten
sam kształt gwiazdki co na `opinie.html`), nie glif Unicode. **Uwaga
implementacyjna:** atrybut `required` musi być na **każdym** z 5 radio, nie
tylko na jednym (mimo że HTML5 semantycznie uznaje grupę za wymaganą już przy
jednym) — inaczej JS-owy selektor pól do walidacji (`input[required]`)
łapie tylko ten jeden input, więc tylko on dostaje listener `change`, i
kliknięcie innej gwiazdki nie czyści błędu na żywo (złapane i naprawione
przy budowie tej strony, zweryfikowane w przeglądarce).

**`opinie-dodaj.html` a `script.js`** — jeden współdzielony handler formularzy
obsługuje teraz oba formularze strony (`kontakt.html` = brief, `opinie-dodaj.html`
= opinia), bo każda podstrona ładuje tylko jeden `.form` naraz. `data-form`
na `<form>` (`"brief"` / `"opinia"`) wybiera tylko treść komunikatu
sukcesu/błędu (`formSuccessMessages`/`formGenericErrorMessages` w
`script.js`), cała reszta mechaniki — 15s timeout, parsowanie błędu JSON z
Formspree, walidacja per-pole, `maxlength` — jest w pełni wspólna. Błąd pola
z grupy radio jest przypisywany po `name`, nie po `id` (grupa nie ma
wspólnego id) — `errorIdFor()` w `script.js` rozróżnia oba przypadki.

**`dziekujemy-opinia.html`** — dedykowana strona potwierdzenia dla
`opinie-dodaj.html` (cel `_next`, no-JS fallback), analogiczna do
`dziekujemy.html` ale z treścią neutralną wobec opinii, nie briefu.
`<meta name="robots" content="noindex">`, bez wpisu w nav/stopce.

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

**Uogólniony fix wyścigu IO (wcześniej: tylko hero).** Element `.reveal`,
który jest w widocznym obszarze już przy pierwszym renderze, jest wykrywany
przez `getBoundingClientRect()` na starcie skryptu (nie przez `.closest('.hero')`)
i odsłaniany przez podwójny `requestAnimationFrame`, z pominięciem
`IntersectionObserver` — inaczej jego callback odpala się niemal natychmiast,
zanim przeglądarka zdąży wymalować stan `opacity:0`, i element zostaje trwale
niewidoczny (opacity utyka na 0) mimo dodanej klasy `.widoczna`. Wykryte przy
budowie `artykuly.html`: krótka podstrona z jednym kartą artykułu mieści całą
treść nad zakładką, więc karta (poza `.hero`) łapała dokładnie ten sam wyścig,
którego pierwotny fix (ograniczony do `.hero`) nie pokrywał. Konsekwencja na
przyszłość: każda krótka podstrona, gdzie `.reveal` spoza hero może się
zmieścić w pierwszym widoku bez scrollowania, jest już bezpieczna — nie trzeba
tego ręcznie wyłapywać per-sekcja.

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

## Stopka na samym dole (sticky footer)
`body` ma teraz `display: flex; flex-direction: column;` + `main { flex: 1 0
auto; }` — `.splash` (`position:fixed`) i `.nav` (`position:sticky`) nie są
tym dotknięte (fixed w ogóle wypada z flow, sticky zostaje normalnym
elementem flex). Bez tego `min-height:100vh` na samym `body` rozciągał tylko
sam element, ale stopka i tak kończyła się tam, gdzie kończyła się treść —
na krótkich stronach (np. `artykuly.html`, `opinie.html`, `dziekujemy.html`)
na wysokim ekranie zostawiało to puste, kremowe pole pod ciemną stopką
zamiast stopki na samym dole. Zmierzone i odtworzone w przeglądarce (symulacja
wysokiego viewportu przez iframe — realny `resize_window` w tym środowisku
nie działa niezawodnie, patrz notatka w pamięci sesji): przy 1300px wysokości
i krótkiej treści `artykuly.html` zostawiało 244px pustki pod stopką; po
poprawce 0px na każdej sprawdzonej stronie (krótkiej i długiej), bez zmiany
zachowania stron, gdzie treść i tak przekracza wysokość ekranu.

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
- [x] ~~Bezpośredni e-mail w sekcji Kontakt na `index.html`~~ — nieaktualne: ta
      sekcja („Kontakt (skrót)”) została usunięta z `index.html` (patrz punkt 6
      wyżej), więc nie ma już gdzie wstawić e-maila na tej stronie. E-mail
      kontaktowy (`kontakt@fitpage.pl`) jest teraz realną, potwierdzoną
      wartością — widoczny w klauzuli RODO na `kontakt.html` i w
      `polityka-prywatnosci.html`.
- [x] Klauzula RODO w `kontakt.html` — dane administratora, cel, podstawa prawna,
      okres przechowywania, prawa osoby, e-mail kontaktowy, prawo skargi do
      PUODO — uzupełnione 16.09.2026, patrz `polityka-prywatnosci.html` wyżej
- [ ] Zgoda marketingowa — doprecyzować kanał i podstawę (art. 10 uśude / art. 172 pt)
- [x] Podłączyć wysyłkę formularza z `kontakt.html` — Formspree, działa na
      obecnym hostingu (Cloudflare); darmowy plan ograniczony do 50
      zgłoszeń/miesiąc — do przypilnowania przy realnym ruchu
- [x] `<title>` + meta description na obu stronach — sprawdzone (`/impeccable audit`,
      15.09.2026): każda strona ma realny, unikalny `<title>` i opis, zero placeholderów
- [ ] Portfolio — opisy realizacji, ewentualnie miniatury (`object-fit: cover` + tło fallback)
- [ ] Test na 375px, test w incognito (obie strony)
- [ ] Wszystkie `<img>` mają `alt` (gdy dojdą zdjęcia)

/* ===================================================================
   FitPage — script.js
   1. Flaga .js (żeby bez JS treść była normalnie widoczna)
   2. Splash: pomijanie klikiem/klawiszem (reszta to czyste CSS, patrz
      style.css — ta sama "działa też bez JS" zasada co reszta strony)
   3. Menu mobilne (hamburger)
   4. Rok w stopce
   5. Animacje przy scrollu — elementy już widoczne przy pierwszym renderze
      odsłaniają się od razu (poza IO, patrz komentarz przy sekcji), reszta
      przez współdzielony IntersectionObserver + klasa .widoczna, ze
      staggered transitionDelay dla rodzeństwa.
   6. Formularze (kontakt + opinia) — walidacja per-pole + wysyłka (Formspree).
   =================================================================== */
(function () {
  'use strict';

  var docEl = document.documentElement;
  docEl.classList.add('js');

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------- 2. Splash: pomijanie klikiem/klawiszem ----------------------
     Cała sekwencja (tło, ikona, napis) to czyste CSS @keyframes z
     animation-fill-mode: forwards (patrz .splash w style.css) — kończy się
     sama, bez JS, więc bez niego splash po prostu odtworzy swój czas i
     zniknie (nowy wariant ~1.6s, stary ~1.44s — patrz style.css, "Przełącznik
     nowy/stary"). Ten kod to wyłącznie dodatek: pierwszy klik albo klawisz
     dodaje .splash--skip na OBA elementy .splash (nowy i stary — tylko
     jeden jest akurat widoczny, ale taniej dodać klasę na oba niż sprawdzać
     który to), co ściska WSZYSTKIE trwające animacje do prawie zera (reguła
     w style.css) — każda kończy swoją krzywą i ląduje na zdefiniowanym
     stanie końcowym, więc nic nie "skacze". Pod prefers-reduced-motion
     splash jest i tak ukryty przez CSS — nasłuch poniżej po prostu się nie
     podłącza, bo nie ma czego pomijać. */
  var splashEls = document.querySelectorAll('.splash');
  if (splashEls.length && !reduceMotion) {
    var skipSplash = function () {
      splashEls.forEach(function (el) { el.classList.add('splash--skip'); });
      document.removeEventListener('click', skipSplash);
      document.removeEventListener('keydown', skipSplash);
    };
    document.addEventListener('click', skipSplash);
    document.addEventListener('keydown', skipSplash);
  }

  /* ---------------------- 3. Menu mobilne ---------------------- */
  var nav = document.querySelector('.nav');
  var toggle = document.querySelector('.nav__toggle');

  if (nav && toggle) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });

    nav.querySelectorAll('.nav__links a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------------------- 4. Rok w stopce ---------------------- */
  var yearEl = document.getElementById('year');
  if (yearEl) { yearEl.textContent = String(new Date().getFullYear()); }

  /* ---------------------- 5. Animacje przy scrollu ----------------------
     Elementy .reveal, które są w widocznym obszarze już przy pierwszym
     renderze — nie tylko hero, także np. cała treść krótkiej podstrony
     (jedna karta artykułu, kompaktowy hero) mieszcząca się nad zakładką —
     nie są obserwowane przez IntersectionObserver. Dla elementu widocznego
     od startu obserwator odpala swój pierwszy callback niemal natychmiast,
     często zanim przeglądarka zdąży w ogóle wymalować stan początkowy
     `.reveal` (opacity:0). Bez osobnej klatki z tym stanem przejście CSS
     nie ma z czego animować — element zostaje trwale niewidoczny (opacity
     utyka na 0) mimo dodanej klasy .widoczna. Sprawdzamy to raz, na starcie
     skryptu, przez realną pozycję (getBoundingClientRect), nie przez
     przynależność do konkretnej sekcji jak `.hero`. Reszta — faktycznie
     poniżej zakładki — idzie przez IntersectionObserver jak dotąd. */
  function isInViewportNow(el) {
    var rect = el.getBoundingClientRect();
    return rect.bottom > 0 && rect.top < window.innerHeight;
  }

  /* Sprzątanie will-change po realnym zakończeniu przejścia (/impeccable
     audit, 22.09.2026, P2): baza CSS (.js .reveal) trzyma will-change:
     opacity, transform, żeby przeglądarka zdążyła przygotować warstwę
     kompozytora PRZED startem animacji — ale sama klasa .reveal nigdy nie
     jest usuwana po odsłonięciu (.widoczna tylko dokłada opacity:1), więc
     bez tej funkcji ponad 100 elementów tej klasy na stronie trzymałoby
     zarezerwowaną warstwę bezterminowo, długo po jednorazowym wjeździe przy
     scrollu. Czyścimy inline stylem (nadpisuje deklarację z klasy) dopiero
     gdy transitionend faktycznie przyjdzie od TEGO elementu, nie od
     dziecka z własnym przejściem (np. hover na linku/przycisku w środku
     karty) — stąd ręczne sprawdzenie e.target zamiast { once: true },
     które usunęłoby nasłuch po pierwszym, niekoniecznie właściwym
     zdarzeniu. Pod prefers-reduced-motion transition jest wyłączony w CSS
     (transition: none), więc transitionend nigdy by tu nie przyszedł —
     ten przypadek jest domknięty osobno, czysto w CSS (patrz
     prefers-reduced-motion w style.css). */
  function releaseWillChangeAfterReveal(el) {
    function onTransitionEnd(e) {
      if (e.target !== el) { return; }
      el.style.willChange = 'auto';
      el.removeEventListener('transitionend', onTransitionEnd);
    }
    el.addEventListener('transitionend', onTransitionEnd);
  }

  function markRevealed(el) {
    el.classList.add('widoczna');
    releaseWillChangeAfterReveal(el);
  }

  var allReveals = document.querySelectorAll('.reveal');
  var immediateReveals = [];
  var scrollReveals = [];
  allReveals.forEach(function (el) {
    (isInViewportNow(el) ? immediateReveals : scrollReveals).push(el);
  });

  var noAnimation = reduceMotion || !('IntersectionObserver' in window);

  function revealWithStagger(elements) {
    elements.forEach(function (el, index) {
      if (index > 0) { el.style.transitionDelay = (index * 90) + 'ms'; }
      markRevealed(el);
    });
  }

  if (noAnimation) {
    revealWithStagger(immediateReveals);
  } else {
    // podwójny requestAnimationFrame: pierwszy domyka bieżącą klatkę,
    // drugi gwarantuje, że przeglądarka zdążyła wymalować stan opacity:0,
    // zanim dodamy klasę wyzwalającą przejście.
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { revealWithStagger(immediateReveals); });
    });
  }

  if (noAnimation) {
    // brak animacji — po prostu pokaż wszystko
    scrollReveals.forEach(function (el) { markRevealed(el); });
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) { return; }

        var el = entry.target;

        // kaskada: opóźnienie zależne od pozycji wśród rodzeństwa .reveal
        var parent = el.parentElement;
        var siblings = parent
          ? Array.prototype.filter.call(parent.children, function (c) {
              return c.classList && c.classList.contains('reveal');
            })
          : [el];
        var index = siblings.indexOf(el);
        if (index > 0) { el.style.transitionDelay = (index * 90) + 'ms'; }

        markRevealed(el);
        observer.unobserve(el);
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    scrollReveals.forEach(function (el) { observer.observe(el); });
  }

  /* ---------------------- 6. Formularze (kontakt + opinia) ----------------------
     Wysyłka: Formspree (action na <form> — hosting to Cloudflare Pages,
     Netlify Forms tam nie działa). Ta sama logika obsługuje oba formularze
     strony (kontakt.html — brief, opinie-dodaj.html — opinia klienta), bo
     każda podstrona ładuje tylko jeden .form naraz; data-form na <form>
     ("brief" / "opinia") wybiera tylko treść komunikatów sukcesu/błędu,
     cała reszta mechaniki jest wspólna. Bez JS formularz działa natywnym
     POST-em wprost na Formspree, które po sukcesie przekierowuje na _next.
     Z JS: walidacja per-pole (komunikaty + aria-invalid/aria-describedby),
     potem fetch na form.action z inline potwierdzeniem, bez przeładowania. */
  var form = document.querySelector('.form');
  var status = document.getElementById('form-status');

  // Pakiet wybrany w cenniku (?pakiet=Trener z przycisków "Wybieram ...")
  // trafia do ukrytego pola briefu i do krótkiej notki nad formularzem.
  // Tylko znane nazwy, żeby z adresu nie dało się wstrzyknąć dowolnego tekstu.
  var pakietInput = document.getElementById('wybrany-pakiet');
  var pakietNote = document.getElementById('brief-pakiet');
  if (pakietInput) {
    var pakiety = ['Start', 'Trener', 'Online', 'Opieka', 'Opieka Plus'];
    var wybrany = new URLSearchParams(window.location.search).get('pakiet');
    if (pakiety.indexOf(wybrany) !== -1) {
      pakietInput.value = wybrany;
      if (pakietNote) {
        pakietNote.textContent = 'Wybrany pakiet: ' + wybrany + '. Jeśli zmienisz zdanie, napisz o tym w uwagach na końcu.';
        pakietNote.hidden = false;
      }
    }
  }
  var submitBtn = form ? form.querySelector('button[type="submit"]') : null;
  var formType = form ? (form.dataset.form || 'brief') : null;

  // Spinner + zamiana tekstu na przycisku w trakcie wysyłki ("Wysyłanie…",
  // 04.10.2026) — submitLabelDefault zapamiętany raz na starcie, żeby było
  // do czego wrócić po błędzie (po sukcesie panel i tak zastępuje cały
  // formularz dla briefu; dla opinii przycisk wraca do normalnego stanu,
  // bo tam nadal jest potrzebny, gdyby ktoś wysłał kolejną opinię).
  var submitLabel = submitBtn ? submitBtn.querySelector('.btn__label') : null;
  var submitLabelDefault = submitLabel ? submitLabel.textContent : '';

  // Panel sukcesu briefu — tylko kontakt.html ma te elementy w DOM, więc
  // na opinie-dodaj.html wszystkie poniższe będą null i formType==='brief'
  // nigdy tam nie zajdzie (data-form="opinia" na tamtym formularzu), więc
  // nie trzeba dodatkowo sprawdzać, która strona się właśnie wykonuje.
  var briefSection = document.getElementById('brief-section');
  var briefSuccessPanel = document.getElementById('brief-success');
  var briefSuccessText = document.getElementById('brief-success-text');
  var briefBackLink = document.querySelector('.brief__back');

  // Grupa radio/checkboxów nie ma wspólnego id: każdy input w grupie ma
  // inny id (albo żaden), ale ten sam name, więc błąd wiążemy przez name.
  function isGroupField(field) {
    return field.type === 'radio' || field.type === 'checkbox' && !!field.closest('[data-required-group]');
  }
  function errorIdFor(field) {
    return (isGroupField(field) ? field.name : field.id) + '-error';
  }

  var fieldMessages = {
    'imie-nazwisko': 'Podaj imię i nazwisko.',
    'nazwa': 'Podaj nazwę, pod którą działasz. Może to być samo imię i nazwisko.',
    'email': 'Podaj adres e-mail.',
    'telefon': 'Podaj numer telefonu.',
    'miasto': 'Podaj miasto, w którym pracujesz.',
    'forma_zajec': 'Zaznacz przynajmniej jedną formę zajęć.',
    'specjalizacja': 'Zaznacz przynajmniej jedną specjalizację.',
    'specjalizacja-inne': 'Wpisz, jaka to specjalizacja.',
    'grupa-docelowa': 'Napisz, z kim najczęściej pracujesz.',
    'kontakt_klientow': 'Zaznacz przynajmniej jeden sposób kontaktu.',
    'mail_domena': 'Wybierz jedną z opcji.',
    'termin': 'Wybierz termin.',
    'wizja': 'Napisz chociaż kilka zdań o Twojej wizji strony.',
    'zgoda-kontakt': 'Zaznacz zgodę, żeby wysłać brief.',
    'tresc-opinii': 'Napisz treść swojej opinii.',
    'ocena': 'Wybierz ocenę w gwiazdkach.',
    'zgoda-publikacja': 'Zaznacz zgodę, żeby opublikować opinię.'
  };

  function fieldErrorMessage(field) {
    if (isGroupField(field)) { return fieldMessages[field.name] || 'Wybierz jedną z opcji.'; }
    if (field.type === 'email' && field.validity.typeMismatch) {
      return 'Podaj poprawny adres e-mail (np. jan@przyklad.pl).';
    }
    return fieldMessages[field.id] || 'Uzupełnij to pole.';
  }

  function clearFieldError(field) {
    field.removeAttribute('aria-invalid');
    var group = field.closest('.form__radio-group');
    if (group) { group.classList.remove('is-invalid'); }
    var errorEl = document.getElementById(errorIdFor(field));
    if (errorEl) { errorEl.textContent = ''; }
  }

  function showFieldError(field) {
    field.setAttribute('aria-invalid', 'true');
    var group = field.closest('.form__radio-group');
    if (group) { group.classList.add('is-invalid'); }
    var errorEl = document.getElementById(errorIdFor(field));
    if (errorEl) { errorEl.textContent = fieldErrorMessage(field); }
  }

  function validateField(field) {
    if (field.checkValidity()) { clearFieldError(field); } else { showFieldError(field); }
  }

  // Komunikaty sukcesu/błędu zależne od typu formularza (data-form na <form>);
  // reszta logiki (timeout, parsowanie błędu Formspree, walidacja) jest wspólna.
  // "brief" w formSuccessMessages zostaje jako nieużywany fallback (sukces
  // briefu idzie teraz przez panel .brief-success, patrz niżej) — zostawiony
  // na wypadek, gdyby panel kiedyś zniknął z DOM na jakiejś stronie.
  var formSuccessMessages = {
    brief: 'Dziękuję! Brief dotarł, odezwę się wkrótce z propozycją zakresu i wyceną.',
    opinia: 'Dziękuję za opinię! Po weryfikacji pojawi się na stronie.'
  };
  // Błąd briefu (04.10.2026): jeden, stały komunikat zamiast rozróżniania
  // timeoutu/treści błędu Formspree/przypadku ogólnego jak wcześniej — to
  // właśnie ta różnorodność wariantów była częścią problemu z czytelnością.
  // Opinia zostaje przy starym, bardziej szczegółowym zachowaniu (patrz
  // .catch niżej) — nikt nie zgłaszał tam tego samego problemu.
  var formGenericErrorMessages = {
    brief: 'Coś poszło nie tak. Spróbuj jeszcze raz albo napisz na kontakt@fitpage.pl',
    opinia: 'Nie udało się wysłać opinii. Spróbuj ponownie albo zadzwoń: 535 721 592.'
  };

  if (form && status) {
    var formFields = Array.prototype.slice.call(form.querySelectorAll(
      '.form__row input, .form__row textarea, .form__consent > input[required], .form__rating-group input[required], .form__radio-group input[required]'
    ));

    // Grupa checkboxów "min. 1": błąd trzymamy na pierwszym polu grupy
    // (setCustomValidity), żeby działało zwykłe checkValidity().
    var requiredGroups = Array.prototype.slice.call(form.querySelectorAll('[data-required-group]'));
    function syncGroup(group) {
      var boxes = group.querySelectorAll('input[type="checkbox"]');
      var anyChecked = Array.prototype.some.call(boxes, function (b) { return b.checked; });
      boxes[0].setCustomValidity(anyChecked ? '' : 'min-1');
      return boxes[0];
    }
    requiredGroups.forEach(function (group) {
      var first = syncGroup(group);
      formFields.push(first);
      group.querySelectorAll('input[type="checkbox"]').forEach(function (box) {
        box.addEventListener('change', function () {
          syncGroup(group);
          first.classList.add('is-touched');
          validateField(first);
        });
      });
    });

    // Pola pokazywane po zaznaczeniu opcji (np. "Inne", "Domenę").
    // Ukryte pole jest wyłączone, więc nie trafia ani do walidacji, ani do wysyłki.
    var toggles = Array.prototype.slice.call(form.querySelectorAll('[data-toggles]'));
    function syncToggle(input) {
      var row = document.getElementById(input.dataset.toggles);
      if (!row) { return; }
      row.hidden = !input.checked;
      row.querySelectorAll('input, textarea').forEach(function (field) {
        field.disabled = !input.checked;
        if (field.hasAttribute('data-required-when-shown')) { field.required = input.checked; }
        if (!input.checked) { field.classList.remove('is-touched'); clearFieldError(field); }
      });
    }
    toggles.forEach(function (input) {
      syncToggle(input);
      input.addEventListener('change', function () { syncToggle(input); });
    });

    // "Jeszcze nic" wyklucza pozostałe opcje w swojej grupie i odwrotnie.
    form.querySelectorAll('[data-exclusive]').forEach(function (exclusive) {
      var siblings = exclusive.closest('fieldset').querySelectorAll('input[type="checkbox"]');
      siblings.forEach(function (box) {
        box.addEventListener('change', function () {
          if (!box.checked) { return; }
          siblings.forEach(function (other) {
            if ((box === exclusive) !== (other === exclusive) && other.checked) {
              other.checked = false;
              if (other.hasAttribute('data-toggles')) { syncToggle(other); }
            }
          });
        });
      });
    });

    function validateWithin(container) {
      var firstInvalid = null;
      requiredGroups.forEach(syncGroup);
      formFields.forEach(function (field) {
        if (field.disabled || !container.contains(field)) { return; }
        field.classList.add('is-touched');
        validateField(field);
        if (!firstInvalid && !field.validity.valid) { firstInvalid = field; }
      });
      return firstInvalid;
    }

    // Tryb krokowy włącza dopiero JS; bez niego kroki są jedną długą stroną.
    var steps = Array.prototype.slice.call(form.querySelectorAll('.form__step'));
    var currentStep = 0;
    var progress = form.querySelector('.form__progress');
    var progressLabel = form.querySelector('.form__progress-label');
    var progressFill = form.querySelector('.form__progress-fill');
    var stepped = steps.length > 1 && !!progress;

    function stepTitle(step) {
      var legend = step.querySelector('.form__step-title');
      return legend ? legend.lastChild.textContent.trim() : '';
    }

    function showStep(index, moveFocus) {
      currentStep = index;
      steps.forEach(function (step, i) { step.classList.toggle('is-active', i === index); });
      progressLabel.textContent = 'Krok ' + (index + 1) + ' z ' + steps.length + ': ' + stepTitle(steps[index]);
      progressFill.style.width = ((index + 1) / steps.length * 100) + '%';
      if (moveFocus) {
        progress.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
        steps[index].querySelector('.form__step-title').focus({ preventScroll: true });
      }
    }

    function goNext() {
      var invalid = validateWithin(steps[currentStep]);
      if (invalid) { invalid.focus(); return; }
      if (currentStep < steps.length - 1) { showStep(currentStep + 1, true); }
    }

    if (stepped) {
      form.classList.add('is-stepped');
      progress.hidden = false;
      form.querySelectorAll('.form__step-nav, [data-step-prev]').forEach(function (el) { el.hidden = false; });
      form.querySelectorAll('[data-step-next]').forEach(function (btn) { btn.addEventListener('click', goNext); });
      form.querySelectorAll('[data-step-prev]').forEach(function (btn) {
        btn.addEventListener('click', function () { showStep(Math.max(0, currentStep - 1), true); });
      });
      showStep(0, false);
    }

    // Pola wielokrotnego wyboru wysyłamy jako jedną wartość, po przecinku.
    function collectFormData() {
      var grouped = {};
      var order = [];
      new FormData(form).forEach(function (value, key) {
        if (!grouped[key]) { grouped[key] = []; order.push(key); }
        grouped[key].push(value);
      });
      var out = new FormData();
      order.forEach(function (key) { out.append(key, grouped[key].join(', ')); });
      return out;
    }

    formFields.forEach(function (field) {
      field.addEventListener('input', function () {
        if (field.classList.contains('is-touched')) { validateField(field); }
      });
      if (field.type === 'checkbox' || field.type === 'radio') {
        field.addEventListener('change', function () {
          field.classList.add('is-touched');
          validateField(field);
        });
      }
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Enter w polu na wcześniejszym kroku działa jak "Dalej".
      if (stepped && currentStep < steps.length - 1) { goNext(); return; }

      var firstInvalid = validateWithin(form);
      if (firstInvalid) {
        if (stepped) {
          var invalidStep = steps.findIndex(function (step) { return step.contains(firstInvalid); });
          if (invalidStep !== currentStep && invalidStep > -1) { showStep(invalidStep, false); }
        }
        status.textContent = 'Popraw zaznaczone pola.';
        status.className = 'form__status is-err';
        status.setAttribute('role', 'alert');
        firstInvalid.focus();
        return;
      }
      status.textContent = '';
      status.className = 'form__status';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.classList.add('is-loading');
      }
      if (submitLabel) { submitLabel.textContent = 'Wysyłanie…'; }
      status.textContent = 'Wysyłanie…';
      status.className = 'form__status';
      status.setAttribute('role', 'status');

      // 15 s limit na fetch — bez tego, przy złej sieci albo martwym
      // endpointzie, żądanie mogłoby wisieć bez końca, a przycisk zostałby
      // zablokowany na stałe.
      var controller = ('AbortController' in window) ? new AbortController() : null;
      var timeoutId = controller && setTimeout(function () { controller.abort(); }, 15000);
      var payload = collectFormData();

      fetch(form.action, {
        method: form.method,
        body: payload,
        headers: { 'Accept': 'application/json' },
        signal: controller ? controller.signal : undefined
      }).then(function (res) {
        if (res.ok) {
          // Wartości pól trzeba odczytać PRZED form.reset() niżej, bo reset
          // je czyści — potrzebne i do maila przez Resend, i do treści
          // panelu sukcesu (imię, e-mail w zdaniu "Potwierdzenie wysłałem
          // na...").
          var imieField = document.getElementById('imie-nazwisko');
          var emailField = document.getElementById('email');

          // Dodatkowe maile przez Resend (/api/potwierdz-kontakt), tylko dla
          // briefu z kontakt.html — niezależne od zgłoszenia do Formspree
          // powyżej, które zostaje bez zmian. Endpoint wysyła dwa maile:
          // podziękowanie do klienta i kopię całego briefu na
          // kontakt@fitpage.pl (dodane 04.10.2026 — druga, niezależna od
          // Formspree ścieżka dostarczenia treści formularza, na wypadek
          // gdyby Formspree oznaczył realne zgłoszenie jako spam i nie
          // wysłał maila). Fire-and-forget: błąd tego wywołania (sieć,
          // serwer, cokolwiek) jest tylko logowany do konsoli, nigdy nie
          // trafia do użytkownika — to dodatek, nie krytyczna ścieżka
          // zgłoszenia (ta już poszła do Formspree wyżej), i w szczególności
          // nigdy nie wpływa na to, który stan sukcesu widzi użytkownik
          // niżej — ten zależy wyłącznie od odpowiedzi Formspree.
          if (formType === 'brief') {
            // Ten sam honeypot co w zgłoszeniu do Formspree (name="_gotcha")
            // — przekazany dalej bez zmian, endpoint sam decyduje, co z nim zrobić.
            var gotchaField = form.querySelector('[name="_gotcha"]');
            if (imieField && emailField && imieField.value && emailField.value) {
              // Wszystkie pola briefu (poza honeypotem i plumbingiem
              // Formspree _subject/_next, które endpoint i tak by
              // zignorował) — do kopii briefu wysyłanej na
              // kontakt@fitpage.pl. Budowane z tego samego FormData co
              // zgłoszenie do Formspree powyżej, więc żadne pole nie
              // wymaga osobnego, ręcznego odczytu po id.
              var fields = {};
              payload.forEach(function (value, key) {
                if (key === '_subject' || key === '_next' || key === '_gotcha') { return; }
                fields[key] = value;
              });

              fetch('/api/potwierdz-kontakt', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  imie: imieField.value,
                  email: emailField.value,
                  honeypot: gotchaField ? gotchaField.value : '',
                  fields: fields
                })
              }).catch(function (err) {
                if (window.console && console.warn) {
                  console.warn('Maile przez Resend nie powiodły się:', err);
                }
              });
            }
          }

          // Panel sukcesu briefu (04.10.2026) — zastępuje cały formularz,
          // zamiast krótkiej linijki tekstu pod przyciskiem jak wcześniej.
          // Niezależny od wyniku autorespondera Resend powyżej: ten panel
          // reaguje wyłącznie na res.ok z Formspree, dokładnie jak wymaga
          // zadanie ("niezależnie od wyniku autorespondera"). Opinia
          // (formType !== 'brief') zostaje przy starym, krótkim komunikacie
          // w .form__status — ten panel istnieje tylko na kontakt.html.
          if (formType === 'brief' && briefSection && briefSuccessPanel && briefSuccessText) {
            var imieVal = imieField ? imieField.value.trim() : '';
            var emailVal = emailField ? emailField.value.trim() : '';
            briefSuccessText.textContent = 'Dzięki, ' + imieVal + '! Odezwę się w ciągu 24 godzin roboczych. '
              + 'Potwierdzenie wysłałem na ' + emailVal + '. Jeśli go nie widzisz, zajrzyj do spamu.';

            if (briefBackLink) { briefBackLink.hidden = true; }
            briefSection.classList.add('is-submitted');

            // scrollIntoView + focus, żeby panel był od razu widoczny także
            // na telefonie (formularz bywa dłuższy niż ekran, bez tego
            // panel pojawiłby się poza widokiem, przewinięty w miejscu,
            // gdzie stał przycisk) — smooth tylko bez
            // prefers-reduced-motion, reduceMotion zdefiniowany wyżej w tym
            // pliku (sekcja 1). tabindex="-1" w HTML pozwala na .focus()
            // mimo że to zwykły <div>, nie wchodzi przy tym w normalny
            // tab-order.
            briefSuccessPanel.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
            briefSuccessPanel.focus();
          } else {
            status.textContent = formSuccessMessages[formType] || formSuccessMessages.brief;
            status.className = 'form__status is-ok';
            status.setAttribute('role', 'status');
          }

          form.reset();
          formFields.forEach(function (field) {
            field.classList.remove('is-touched');
            clearFieldError(field);
          });
          requiredGroups.forEach(syncGroup);
          toggles.forEach(syncToggle);
          if (stepped) { showStep(0, false); }
          return;
        }
        // Formspree zwraca przy błędzie JSON z opisem (np. błąd walidacji
        // pola po stronie serwera albo przekroczony miesięczny limit
        // zgłoszeń) — spróbuj go odczytać zamiast od razu pokazywać
        // ten sam ogólny komunikat niezależnie od przyczyny.
        return res.json().catch(function () { return null; }).then(function (body) {
          var detail = null;
          if (body && Array.isArray(body.errors) && body.errors.length) {
            detail = body.errors.map(function (item) { return item.message; }).filter(Boolean).join(' ');
          } else if (body && typeof body.error === 'string') {
            detail = body.error;
          }
          throw new Error(detail || 'formspree-error');
        });
      }).catch(function (err) {
        if (window.console && console.warn) { console.warn('Wysyłka formularza nie powiodła się:', err); }
        if (formType === 'brief') {
          // Jeden, stały komunikat dla briefu (04.10.2026) — patrz
          // formGenericErrorMessages wyżej, niezależnie od przyczyny
          // (timeout, błąd Formspree, cokolwiek innego). Dane w polach
          // zostają: nie ma tu form.reset(), submitBtn wraca do stanu
          // aktywnego w .finally() niżej.
          status.textContent = formGenericErrorMessages.brief;
        } else {
          var timedOut = err && err.name === 'AbortError';
          var serverMessage = (!timedOut && err && err.message && err.message !== 'formspree-error') ? err.message : null;
          if (timedOut) {
            status.textContent = 'Wysyłka trwa zbyt długo, sprawdź połączenie i spróbuj ponownie, albo zadzwoń: 535 721 592.';
          } else if (serverMessage) {
            status.textContent = serverMessage + ' Możesz też zadzwonić: 535 721 592.';
          } else {
            status.textContent = formGenericErrorMessages[formType] || formGenericErrorMessages.brief;
          }
        }
        status.className = 'form__status is-err';
        status.setAttribute('role', 'alert');
      }).finally(function () {
        if (timeoutId) { clearTimeout(timeoutId); }
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.classList.remove('is-loading');
        }
        if (submitLabel) { submitLabel.textContent = submitLabelDefault; }
      });
    });
  }
})();

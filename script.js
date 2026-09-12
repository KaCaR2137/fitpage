/* ===================================================================
   FitPage — script.js
   1. Flaga .js (żeby bez JS treść była normalnie widoczna)
   2. Menu mobilne (hamburger)
   3. Rok w stopce
   4. Animacje przy scrollu — hero odsłania się od razu (poza IO, patrz
      komentarz przy sekcji), reszta przez współdzielony IntersectionObserver
      + klasa .widoczna, ze staggered transitionDelay dla rodzeństwa.
   5. Formularz kontaktowy — walidacja per-pole + wysyłka (Formspree).
   =================================================================== */
(function () {
  'use strict';

  var docEl = document.documentElement;
  docEl.classList.add('js');

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------- 2. Menu mobilne ---------------------- */
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

  /* ---------------------- 3. Rok w stopce ---------------------- */
  var yearEl = document.getElementById('year');
  if (yearEl) { yearEl.textContent = String(new Date().getFullYear()); }

  /* ---------------------- 4. Animacje przy scrollu ----------------------
     Hero (i hero--compact na podstronach) jest zawsze w widocznym obszarze
     już przy pierwszym renderze — nie obserwujemy go IntersectionObserverem.
     Dla elementu, który jest w viewport od startu, obserwator odpala swój
     pierwszy callback niemal natychmiast, często zanim przeglądarka zdąży
     w ogóle wymalować stan początkowy `.reveal` (opacity:0). Bez osobnej
     klatki z tym stanem przejście CSS nie ma z czego animować — stąd
     martwe/śladowe hero mimo że nikt nie scrolluje. Reszta sekcji (poniżej
     zakładki) faktycznie czeka na scroll, więc tam ten wyścig nie występuje. */
  var allReveals = document.querySelectorAll('.reveal');
  var heroReveals = [];
  var scrollReveals = [];
  allReveals.forEach(function (el) {
    (el.closest('.hero') ? heroReveals : scrollReveals).push(el);
  });

  var noAnimation = reduceMotion || !('IntersectionObserver' in window);

  function revealWithStagger(elements) {
    elements.forEach(function (el, index) {
      if (index > 0) { el.style.transitionDelay = (index * 90) + 'ms'; }
      el.classList.add('widoczna');
    });
  }

  if (noAnimation) {
    revealWithStagger(heroReveals);
  } else {
    // podwójny requestAnimationFrame: pierwszy domyka bieżącą klatkę,
    // drugi gwarantuje, że przeglądarka zdążyła wymalować stan opacity:0,
    // zanim dodamy klasę wyzwalającą przejście.
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { revealWithStagger(heroReveals); });
    });
  }

  if (noAnimation) {
    // brak animacji — po prostu pokaż wszystko
    scrollReveals.forEach(function (el) { el.classList.add('widoczna'); });
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

        el.classList.add('widoczna');
        observer.unobserve(el);
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    scrollReveals.forEach(function (el) { observer.observe(el); });
  }

  /* ---------------------- 5. Formularz kontaktowy ----------------------
     Wysyłka: Formspree (action na <form> w kontakt.html — hosting to
     Cloudflare Pages, Netlify Forms tam nie działa). Bez JS formularz
     działa natywnym POST-em wprost na Formspree, które po sukcesie
     przekierowuje na _next (dziekujemy.html). Z JS: walidacja per-pole
     (komunikaty + aria-invalid/aria-describedby), potem fetch na
     form.action z inline potwierdzeniem, bez przeładowania strony. */
  var form = document.querySelector('.form');
  var status = document.getElementById('form-status');
  var submitBtn = form ? form.querySelector('button[type="submit"]') : null;

  var fieldMessages = {
    'imie-nazwisko': 'Podaj imię i nazwisko.',
    'email': 'Podaj adres e-mail.',
    'telefon': 'Podaj numer telefonu.',
    'wizja': 'Napisz chociaż kilka zdań o Twojej wizji strony.'
  };

  function fieldErrorMessage(field) {
    if (field.type === 'checkbox') { return 'Zaznacz zgodę, żeby wysłać brief.'; }
    if (field.type === 'email' && field.validity.typeMismatch) {
      return 'Podaj poprawny adres e-mail (np. jan@przyklad.pl).';
    }
    return fieldMessages[field.id] || 'Uzupełnij to pole.';
  }

  function clearFieldError(field) {
    field.removeAttribute('aria-invalid');
    var errorEl = document.getElementById(field.id + '-error');
    if (errorEl) { errorEl.textContent = ''; }
  }

  function showFieldError(field) {
    field.setAttribute('aria-invalid', 'true');
    var errorEl = document.getElementById(field.id + '-error');
    if (errorEl) { errorEl.textContent = fieldErrorMessage(field); }
  }

  function validateField(field) {
    if (field.checkValidity()) { clearFieldError(field); } else { showFieldError(field); }
  }

  if (form && status) {
    var formFields = form.querySelectorAll(
      '.form__row input, .form__row textarea, .form__consent > input[required]'
    );

    formFields.forEach(function (field) {
      field.addEventListener('input', function () {
        if (field.classList.contains('is-touched')) { validateField(field); }
      });
      if (field.type === 'checkbox') {
        field.addEventListener('change', function () {
          field.classList.add('is-touched');
          validateField(field);
        });
      }
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      formFields.forEach(function (field) {
        field.classList.add('is-touched');
        validateField(field);
      });

      if (!form.checkValidity()) {
        status.textContent = 'Popraw zaznaczone pola poniżej.';
        status.className = 'form__status is-err';
        status.setAttribute('role', 'alert');
        var firstInvalid = form.querySelector(':invalid');
        if (firstInvalid) { firstInvalid.focus(); }
        return;
      }

      if (submitBtn) { submitBtn.disabled = true; }
      status.textContent = 'Wysyłanie…';
      status.className = 'form__status';
      status.setAttribute('role', 'status');

      // 15 s limit na fetch — bez tego, przy złej sieci albo martwym
      // endpointzie, żądanie mogłoby wisieć bez końca, a przycisk zostałby
      // zablokowany na stałe.
      var controller = ('AbortController' in window) ? new AbortController() : null;
      var timeoutId = controller && setTimeout(function () { controller.abort(); }, 15000);

      fetch(form.action, {
        method: form.method,
        body: new FormData(form),
        headers: { 'Accept': 'application/json' },
        signal: controller ? controller.signal : undefined
      }).then(function (res) {
        if (res.ok) {
          status.textContent = 'Dziękuję! Brief dotarł — odezwiemy się wkrótce z propozycją zakresu i wyceną.';
          status.className = 'form__status is-ok';
          status.setAttribute('role', 'status');
          form.reset();
          formFields.forEach(function (field) {
            field.classList.remove('is-touched');
            clearFieldError(field);
          });
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
        var timedOut = err && err.name === 'AbortError';
        var serverMessage = (!timedOut && err && err.message && err.message !== 'formspree-error') ? err.message : null;
        if (timedOut) {
          status.textContent = 'Wysyłka trwa zbyt długo — sprawdź połączenie i spróbuj ponownie, albo zadzwoń: 535 721 592.';
        } else if (serverMessage) {
          status.textContent = serverMessage + ' Możesz też zadzwonić: 535 721 592.';
        } else {
          status.textContent = 'Nie udało się wysłać briefu. Spróbuj ponownie albo zadzwoń: 535 721 592.';
        }
        status.className = 'form__status is-err';
        status.setAttribute('role', 'alert');
      }).finally(function () {
        if (timeoutId) { clearTimeout(timeoutId); }
        if (submitBtn) { submitBtn.disabled = false; }
      });
    });
  }
})();

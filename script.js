/* ===================================================================
   FitPage — script.js
   1. Flaga .js (żeby bez JS treść była normalnie widoczna)
   2. Menu mobilne (hamburger)
   3. Rok w stopce
   4. Animacje przy scrollu — jeden współdzielony IntersectionObserver
      + klasa .widoczna, ze staggered transitionDelay dla rodzeństwa.
   5. Formularz kontaktowy — walidacja + komunikat (wersja demo).
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

  /* ---------------------- 4. Animacje przy scrollu ---------------------- */
  var revealEls = document.querySelectorAll('.reveal');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    // brak animacji — po prostu pokaż wszystko
    revealEls.forEach(function (el) { el.classList.add('widoczna'); });
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

    revealEls.forEach(function (el) { observer.observe(el); });
  }

  /* ---------------------- 5. Formularz kontaktowy ----------------------
     Wysyłka: Netlify Forms (data-netlify na <form> w kontakt.html).
     Bez JS formularz działa natywnym POST-em na action="/dziekujemy.html".
     Z JS: walidacja per-pole (komunikaty + aria-invalid/aria-describedby),
     potem fetch na "/" (standardowy wzorzec AJAX Netlify Forms) z inline
     potwierdzeniem, bez przeładowania strony. */
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

      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(form)).toString()
      }).then(function (res) {
        if (!res.ok) { throw new Error('network'); }
        status.textContent = 'Dziękuję! Brief dotarł — odezwiemy się wkrótce z propozycją zakresu i wyceną.';
        status.className = 'form__status is-ok';
        status.setAttribute('role', 'status');
        form.reset();
        formFields.forEach(function (field) {
          field.classList.remove('is-touched');
          clearFieldError(field);
        });
      }).catch(function () {
        status.textContent = 'Nie udało się wysłać briefu. Spróbuj ponownie albo zadzwoń: 535 721 592.';
        status.className = 'form__status is-err';
        status.setAttribute('role', 'alert');
      }).finally(function () {
        if (submitBtn) { submitBtn.disabled = false; }
      });
    });
  }
})();

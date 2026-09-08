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

  /* ---------------------- 5. Formularz kontaktowy ---------------------- */
  var form = document.querySelector('.form');
  var status = document.getElementById('form-status');

  if (form && status) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      form.querySelectorAll('input, textarea').forEach(function (field) {
        field.classList.add('is-touched');
      });

      if (!form.checkValidity()) {
        status.textContent = 'Uzupełnij poprawnie wszystkie pola i zaznacz zgodę.';
        status.className = 'form__status is-err';
        var firstInvalid = form.querySelector(':invalid');
        if (firstInvalid) { firstInvalid.focus(); }
        return;
      }

      // TODO: podłączyć realną wysyłkę (Formspree / Netlify Forms / własny backend)
      status.textContent = 'Dziękuję! To wersja demonstracyjna — wysyłka nie jest jeszcze podłączona.';
      status.className = 'form__status is-ok';
      form.reset();
      form.querySelectorAll('.is-touched').forEach(function (field) {
        field.classList.remove('is-touched');
      });
    });
  }
})();

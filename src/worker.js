/**
 * Worker FitPage.
 *
 * Statyczne strony obsługuje [assets] (patrz wrangler.toml) bez zmian
 * względem dotychczasowego zachowania. Ten skrypt przejmuje wyłącznie
 * trasy /api/* (run_worker_first w wrangler.toml) — jedna na razie:
 *
 *   POST /api/potwierdz-kontakt
 *
 * Wysyła przez Resend DWA niezależne maile po wypełnieniu formularza na
 * kontakt.html: podziękowanie do osoby, która wysłała brief, oraz kopię
 * całej treści briefu na kontakt@fitpage.pl (dodane 04.10.2026 — powód:
 * Formspree potrafi oznaczyć realne zgłoszenie jako spam i nie dostarczyć
 * maila, więc Resend jest teraz drugą, niezależną ścieżką dostarczenia
 * treści formularza, nie tylko potwierdzeniem dla klienta). Obie wysyłki
 * są od siebie niezależne (Promise.allSettled) — niepowodzenie jednej nie
 * blokuje drugiej. To NIE zastępuje ani nie dotyka istniejącego
 * zgłoszenia do Formspree (patrz kontakt.html/script.js) — to osobne,
 * dodatkowe maile, wywoływane w trybie fire-and-forget z JS-a strony.
 * Jeśli ten endpoint całkiem zawiedzie, zgłoszenie do Formspree i tak już
 * dotarło; użytkownik nigdy nie widzi błędu stąd.
 *
 * Endpoint jest publicznie osiągalny (wysyła prawdziwe maile na dowolny
 * podany adres), więc ma cztery niezależne warstwy ochrony: ścisły
 * Origin, honeypot (dzielony z formularzem Formspree), limit żądań na IP
 * i walidację/escapowanie pól. Żadna z nich osobno nie jest
 * rozstrzygająca, razem tworzą sensowną barierę bez blokowania realnych
 * zgłoszeń.
 */

const ALLOWED_ORIGIN = 'https://fitpage.pl';
const ADMIN_EMAIL = 'kontakt@fitpage.pl';

// Pola briefu przekazywane w kopii do administratora — w tej kolejności
// (ta sama co pola na kontakt.html, dla czytelności), z własnym limitem
// długości dla każdego (ten sam limit co atrybut maxlength w HTML, ale
// wymuszony tu niezależnie — formularz i tak chroni przed nadmiarową
// długością po stronie przeglądarki, serwer nie ufa temu i sprawdza
// sam). Honeypot (_gotcha) i pola plumbingu Formspree (_subject, _next)
// celowo nie są tu wymienione — script.js ich w ogóle nie wysyła w
// obiekcie fields.
const BRIEF_FIELD_DEFS = [
  { key: 'imie_nazwisko', label: 'Imię i nazwisko', max: 100 },
  { key: 'email', label: 'E-mail', max: 254 },
  { key: 'telefon', label: 'Telefon', max: 20 },
  { key: 'miasto_forma_zajec', label: 'Miasto/forma zajęć', max: 100 },
  { key: 'specjalizacja', label: 'Specjalizacja', max: 2000 },
  { key: 'oferta_pakiety', label: 'Oferta/pakiety', max: 2000 },
  { key: 'ceny_na_stronie', label: 'Ceny na stronie', max: 100 },
  { key: 'wyroznienie', label: 'Co Cię wyróżnia', max: 2000 },
  { key: 'instagram_facebook', label: 'Instagram/Facebook', max: 200 },
  { key: 'styl_strony', label: 'Styl strony', max: 100 },
  { key: 'inspiracja', label: 'Inspiracja', max: 300 },
  { key: 'wizja', label: 'Twoja wizja strony', max: 4000 }
];

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === '/api/potwierdz-kontakt') {
      return handlePotwierdzKontakt(request, env);
    }

    // run_worker_first ogranicza się do /api/*, więc w praktyce ta gałąź
    // nie powinna być osiągana dla realnych żądań — zostaje jako
    // bezpieczny fallback, nie jako główna ścieżka routingu.
    return env.ASSETS.fetch(request);
  }
};

async function handlePotwierdzKontakt(request, env) {
  if (request.method !== 'POST') {
    return jsonResponse({ error: 'method_not_allowed' }, 405);
  }

  const origin = request.headers.get('Origin');
  if (origin !== ALLOWED_ORIGIN) {
    return jsonResponse({ error: 'forbidden_origin' }, 403);
  }

  if (env.RATE_LIMITER) {
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    const { success } = await env.RATE_LIMITER.limit({ key: ip });
    if (!success) {
      return jsonResponse({ error: 'rate_limited' }, 429);
    }
  }

  let data;
  try {
    data = await request.json();
  } catch {
    return jsonResponse({ error: 'invalid_json' }, 400);
  }

  // Honeypot: dzieli nazwę pola z istniejącym honeypotem Formspree
  // (name="_gotcha" w kontakt.html) — script.js przekazuje jego wartość
  // tu bez zmian. Wypełnione pole = bot. Zwracamy 200 bez wysyłki,
  // żeby nie zdradzić botowi, że został złapany.
  if (typeof data.honeypot === 'string' && data.honeypot.trim() !== '') {
    return jsonResponse({ ok: true }, 200);
  }

  const imie = typeof data.imie === 'string' ? data.imie.trim().slice(0, 100) : '';
  const email = typeof data.email === 'string' ? data.email.trim().slice(0, 254) : '';

  if (!imie || !email || !isValidEmail(email)) {
    return jsonResponse({ error: 'invalid_fields' }, 400);
  }

  if (!env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY nie jest ustawiony (wrangler secret put RESEND_API_KEY --name fitpage)');
    return jsonResponse({ error: 'server_misconfigured' }, 500);
  }

  // Pola pełnego briefu dla kopii do administratora — osobny obiekt od
  // imie/email powyżej (te zostają jak były, bo napędzają wyłącznie
  // podziękowanie do klienta). `data.fields` to zwykły obiekt string →
  // string zbudowany w script.js z FormData; każda wartość jest tu
  // niezależnie przycinana do limitu i stringowana, więc zły/brakujący
  // klucz nigdy nie wywraca całego żądania, tylko daje pustą wartość.
  const fields = {};
  const rawFields = (data.fields && typeof data.fields === 'object') ? data.fields : {};
  for (const def of BRIEF_FIELD_DEFS) {
    const raw = rawFields[def.key];
    fields[def.key] = typeof raw === 'string' ? raw.trim().slice(0, def.max) : '';
  }
  fields.zgoda_marketing = rawFields.zgoda_marketing ? 'Tak' : 'Nie';

  // Dwie wysyłki, całkowicie niezależne (Promise.allSettled, nie
  // Promise.all) — niepowodzenie jednej (np. Resend chwilowo nie
  // odpowiada przy drugim wywołaniu) nie może ubić tej, która już się
  // udała ani tej, która jeszcze nie wystartowała.
  const [clientResult, adminResult] = await Promise.allSettled([
    sendResendEmail(env, {
      to: [email],
      replyTo: 'kontakt@fitpage.pl',
      subject: 'Dziękujemy za zgłoszenie, FitPage',
      text: buildEmailText(imie),
      html: buildEmailHtml(imie)
    }),
    sendResendEmail(env, {
      to: [ADMIN_EMAIL],
      replyTo: email,
      subject: 'Nowy brief: ' + sanitizeHeaderValue(imie),
      text: buildAdminEmailText(fields),
      html: buildAdminEmailHtml(fields)
    })
  ]);

  const clientOk = clientResult.status === 'fulfilled' && clientResult.value.ok;
  const adminOk = adminResult.status === 'fulfilled' && adminResult.value.ok;

  if (!clientOk) {
    const reason = clientResult.status === 'rejected' ? clientResult.reason : clientResult.value.detail;
    console.error('Mail z podziękowaniem (Resend) nie powiódł się:', reason);
  }
  if (!adminOk) {
    const reason = adminResult.status === 'rejected' ? adminResult.reason : adminResult.value.detail;
    console.error('Kopia briefu do administratora (Resend) nie powiodła się:', reason);
  }

  return jsonResponse({ ok: clientOk || adminOk, client: clientOk, admin: adminOk }, (clientOk || adminOk) ? 200 : 502);
}

// Jedno wywołanie Resend API, dzielone przez oba maile (client/admin) —
// różni je tylko adresat, Reply-To, temat i treść, więc sama mechanika
// wysyłki (fetch, nagłówki, obsługa błędu) nie powinna być duplikowana.
// Zwraca { ok, detail } zamiast rzucać, żeby Promise.allSettled wyżej
// zawsze trafiał w gałąź "fulfilled" dla zwykłego odrzucenia przez
// Resend (błąd sieci to inna sprawa — ten faktycznie przechodzi przez
// catch niżej i trafia do "rejected", co i tak obsługujemy tak samo).
async function sendResendEmail(env, { to, replyTo, subject, text, html }) {
  let res;
  try {
    res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'FitPage <kontakt@fitpage.pl>',
        to,
        reply_to: replyTo,
        subject,
        text,
        html
      })
    });
  } catch (err) {
    return { ok: false, detail: err };
  }

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    return { ok: false, detail: res.status + ' ' + detail };
  }

  return { ok: true, detail: null };
}

// Usuwa znaki nowej linii z wartości, która trafia do nagłówka maila
// (temat) — bez tego ktoś mógłby wkleić do pola "imię i nazwisko" znak
// nowej linii i dopisać sobie dodatkowe nagłówki e-mail (header
// injection). Pole w HTML to zwykły <input> jednoliniowy, więc w
// praktyce przeglądarka tego nie wyśle, ale endpoint przyjmuje surowy
// JSON i nie ufa, że żądanie zawsze przyszło z tego formularza.
function sanitizeHeaderValue(value) {
  return value.replace(/[\r\n]+/g, ' ').trim();
}

// Świadomie luźna walidacja (RFC 5322 jest dużo szersze) — wystarczy
// odsiać oczywiste literówki/śmieci, resztę i tak zweryfikuje odbiorca
// poczty. Pole email w kontakt.html ma już walidację HTML5
// (type="email") po stronie przeglądarki; to jest druga, niezależna
// warstwa po stronie serwera.
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Stały szablon — jedyna zmienna od użytkownika to imię (samo escapowane
// w wersji HTML), nic więcej z danych wejściowych nie trafia do treści
// maila.
function buildEmailText(imie) {
  return 'Cześć ' + imie + ',\n\n'
    + 'Dziękujemy za zgłoszenie przez formularz kontaktowy na fitpage.pl. '
    + 'Odezwę się w ciągu 24 godzin roboczych z propozycją zakresu i wyceną.\n\n'
    + 'Pozdrawiam,\n'
    + 'Kacper, FitPage\n\n'
    + 'FitPage: strony internetowe dla trenerów personalnych';
}

// Wygląd świadomie odwzorowuje realną paletę strony (DESIGN.md): kremowy
// canvas #F7F3EA na zewnątrz, karta w Ivory #FBF8F0 z hairline borderem
// (fill jest prawie niewidoczny, obrys robi kształt, ten sam wzorzec co
// karty na stronie), Bottle Green #1F3D2B jako jedyny akcent na
// wordmarku. Stopka to Pine Black #16211B + Ivory przy 0.72 opacity,
// dokładnie ta sama para co stopka na żywej stronie (jedyna świadomie
// ciemna powierzchnia w całym systemie) — ta sama fraza co realny
// copyright w stopce (`© FitPage: strony internetowe dla trenerów
// personalnych.`), żeby mail czytał się jak część tej samej marki, nie
// osobny szablon. Wordmark w serif (Georgia/Times New Roman) zamiast
// Fraunces ze strony — webfonty nie ładują się niezawodnie w klientach
// poczty, ale serif sam w sobie niesie to samo skojarzenie co na stronie
// (nagłówki = poważny display serif, treść = neutralny sans-serif).
function buildEmailHtml(imie) {
  const safeImie = escapeHtml(imie);
  return `<!doctype html>
<html lang="pl">
<body style="margin:0;padding:0;background-color:#F7F3EA;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F7F3EA;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:480px;border-collapse:collapse;">
          <tr>
            <td style="background-color:#FBF8F0;border:1px solid rgba(31,61,43,0.16);border-bottom:none;border-radius:14px 14px 0 0;padding:32px;">
              <p style="margin:0 0 20px;font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:700;color:#1F3D2B;">FitPage</p>
              <p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#202821;">Cześć ${safeImie},</p>
              <p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#202821;">Dziękujemy za zgłoszenie przez formularz kontaktowy na fitpage.pl. Odezwę się w ciągu 24 godzin roboczych z propozycją zakresu i wyceną.</p>
              <p style="margin:0;font-size:16px;line-height:1.6;color:#202821;">Pozdrawiam,<br>Kacper, FitPage</p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#16211B;border-radius:0 0 14px 14px;padding:20px 32px;text-align:center;">
              <p style="margin:0 0 4px;font-size:14px;font-weight:700;color:#FBF8F0;">FitPage</p>
              <p style="margin:0;font-size:12px;line-height:1.5;color:rgba(251,248,240,0.72);">Strony internetowe dla trenerów personalnych</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// Kopia briefu do administratora — zwykła lista "etykieta: wartość" w
// kolejności BRIEF_FIELD_DEFS, pole po polu, żeby dało się ją przeczytać
// od razu w kliencie poczty bez przewijania do treści Formspree. Puste
// opcjonalne pole dostaje jawny placeholder "(nie podano)" zamiast
// zniknąć z maila — administrator widzi od razu, które pola brief
// faktycznie wypełnił, nie tylko te, które wypełnił. Linki (np. w polu
// "Inspiracja") trafiają tu jako zwykły tekst — nic w tej funkcji nie
// zamienia URL-i na klikalne <a>, w wersji tekstowej i tak nie ma takiej
// możliwości.
function buildAdminEmailText(fields) {
  const lines = ['Nowy brief z formularza kontaktowego fitpage.pl:', ''];
  for (const def of BRIEF_FIELD_DEFS) {
    lines.push(def.label + ': ' + (fields[def.key] || '(nie podano)'));
  }
  lines.push('Zgoda marketingowa: ' + fields.zgoda_marketing);
  lines.push('');
  lines.push('Odpowiedz bezpośrednio na tego maila (Reply-To ustawiony na adres z formularza).');
  return lines.join('\n');
}

function buildAdminEmailHtml(fields) {
  const rows = BRIEF_FIELD_DEFS.map(function (def) {
    const value = fields[def.key] ? escapeHtmlMultiline(fields[def.key]) : '<span style="color:#A7A094;">(nie podano)</span>';
    return '<tr>'
      + '<td style="padding:10px 0;border-top:1px solid rgba(31,61,43,0.12);font-size:13px;font-weight:700;color:#52594F;white-space:nowrap;vertical-align:top;">' + escapeHtml(def.label) + '</td>'
      + '<td style="padding:10px 0 10px 16px;border-top:1px solid rgba(31,61,43,0.12);font-size:15px;line-height:1.5;color:#202821;">' + value + '</td>'
      + '</tr>';
  }).join('');
  const zgodaRow = '<tr>'
    + '<td style="padding:10px 0;border-top:1px solid rgba(31,61,43,0.12);font-size:13px;font-weight:700;color:#52594F;white-space:nowrap;vertical-align:top;">Zgoda marketingowa</td>'
    + '<td style="padding:10px 0 10px 16px;border-top:1px solid rgba(31,61,43,0.12);font-size:15px;line-height:1.5;color:#202821;">' + escapeHtml(fields.zgoda_marketing) + '</td>'
    + '</tr>';

  return `<!doctype html>
<html lang="pl">
<body style="margin:0;padding:0;background-color:#F7F3EA;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F7F3EA;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:600px;border-collapse:collapse;">
          <tr>
            <td style="background-color:#FBF8F0;border:1px solid rgba(31,61,43,0.16);border-bottom:none;border-radius:14px 14px 0 0;padding:32px;">
              <p style="margin:0 0 20px;font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:700;color:#1F3D2B;">FitPage</p>
              <p style="margin:0 0 20px;font-size:16px;line-height:1.6;color:#202821;">Nowy brief z formularza kontaktowego fitpage.pl. Reply-To tego maila jest ustawiony na adres z formularza, więc możesz odpowiedzieć bezpośrednio.</p>
              <table role="presentation" width="100%" style="border-collapse:collapse;">
                ${rows}
                ${zgodaRow}
              </table>
            </td>
          </tr>
          <tr>
            <td style="background-color:#16211B;border-radius:0 0 14px 14px;padding:20px 32px;text-align:center;">
              <p style="margin:0 0 4px;font-size:14px;font-weight:700;color:#FBF8F0;">FitPage</p>
              <p style="margin:0;font-size:12px;line-height:1.5;color:rgba(251,248,240,0.72);">Strony internetowe dla trenerów personalnych</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Jak escapeHtml, plus zamiana znaków nowej linii na <br> — pola
// textarea (specjalizacja, oferta/pakiety, wizja...) mogą być
// wielowierszowe, zwykły escapeHtml zostawiłby je jako jeden zbity akapit
// w HTML. Zamiana PO escapowaniu, nie przed — inaczej <br> same
// zostałyby escapowane na &lt;br&gt;.
function escapeHtmlMultiline(str) {
  return escapeHtml(str).replace(/\n/g, '<br>');
}

function jsonResponse(body, status) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

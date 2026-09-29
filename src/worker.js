/**
 * Worker FitPage.
 *
 * Statyczne strony obsługuje [assets] (patrz wrangler.toml) bez zmian
 * względem dotychczasowego zachowania. Ten skrypt przejmuje wyłącznie
 * trasy /api/* (run_worker_first w wrangler.toml) — jedna na razie:
 *
 *   POST /api/potwierdz-kontakt
 *
 * Wysyła przez Resend mail z podziękowaniem do osoby, która właśnie
 * wypełniła formularz na kontakt.html. To NIE zastępuje ani nie dotyka
 * istniejącego zgłoszenia do Formspree (patrz kontakt.html/script.js) —
 * to osobny, niezależny mail, wywoływany dodatkowo, w trybie
 * fire-and-forget z JS-a strony. Jeśli ten endpoint zawiedzie, zgłoszenie
 * do Formspree i tak już dotarło; użytkownik nigdy nie widzi błędu stąd.
 *
 * Endpoint jest publicznie osiągalny (wysyła prawdziwe maile na dowolny
 * podany adres), więc ma cztery niezależne warstwy ochrony: ścisły
 * Origin, honeypot (dzielony z formularzem Formspree), limit żądań na IP
 * i walidację/escapowanie pól. Żadna z nich osobno nie jest
 * rozstrzygająca, razem tworzą sensowną barierę bez blokowania realnych
 * zgłoszeń.
 */

const ALLOWED_ORIGIN = 'https://fitpage.pl';

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

  let resendRes;
  try {
    resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'FitPage <kontakt@fitpage.pl>',
        to: [email],
        reply_to: 'kontakt@fitpage.pl',
        subject: 'Dziękujemy za zgłoszenie, FitPage',
        text: buildEmailText(imie),
        html: buildEmailHtml(imie)
      })
    });
  } catch {
    return jsonResponse({ error: 'resend_unreachable' }, 502);
  }

  if (!resendRes.ok) {
    const detail = await resendRes.text().catch(() => '');
    console.error('Resend odrzucił żądanie:', resendRes.status, detail);
    return jsonResponse({ error: 'resend_failed' }, 502);
  }

  return jsonResponse({ ok: true }, 200);
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

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function jsonResponse(body, status) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

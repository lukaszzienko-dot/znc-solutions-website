/* Shared site footer with crawlable links to every landing page.
   Used by build-items.mjs and build-furniture-page.mjs; build-items.mjs also re-applies it to the hand-written root pages
   so the footer stays in sync. Edit the lists below, then rerun the generators. */
import fs from 'fs'; import path from 'path';

const PHONE = '917-536-1245', TEL = '+19175361245';
const GROUPS = [
  ['Rentals', [
    ['/rentals/', 'All rentals'], ['/table-chair-rentals.html', 'Table & chair rentals'], ['/furniture-lounge-rentals.html', 'Event furniture & lounge'],
    ['/linen-rentals.html', 'Linen rentals'], ['/rentals/bars/', 'Bar rentals'], ['/tabletop-glassware-rentals.html', 'Tabletop & glassware'],
    ['/kitchen-equipment-rentals.html', 'Kitchen equipment'], ['/glassware-rental-nyc.html', 'Glassware rental'], ['/catering-equipment-rental.html', 'Catering equipment'],
    ['/bar-rental.html', 'Bar setups & barware'], ['/chair-rental.html', 'Chair rental'], ['/wall-panels.html', 'Gallery wall panels'], ['/holiday-party-rentals.html', 'Holiday party & NYE rentals']]],
  ['New Jersey', [
    ['/event-rentals-wayne-nj.html', 'Wayne'], ['/party-rentals-north-jersey.html', 'North Jersey'], ['/party-rentals-paterson.html', 'Paterson'],
    ['/party-rentals-montclair.html', 'Montclair'], ['/party-rentals-morristown.html', 'Morristown'], ['/party-rentals-hoboken.html', 'Hoboken'],
    ['/party-rentals-jersey-city.html', 'Jersey City']]],
  ['New York & Connecticut', [
    ['/party-rentals-nyc.html', 'New York City'], ['/table-chair-rentals-manhattan.html', 'Manhattan tables & chairs'], ['/table-chair-rentals-brooklyn.html', 'Brooklyn tables & chairs'],
    ['/party-rentals-stamford-ct.html', 'Stamford, CT'], ['/party-rentals-greenwich-ct.html', 'Greenwich, CT'], ['/tri-state-event-rentals.html', 'Tri-state overview']]],
  ['Gallery walls', [
    ['/wall-panels.html', 'Gallery wall rentals'], ['/gallery-walls-chelsea.html', 'Chelsea'], ['/gallery-walls-manhattan.html', 'Manhattan'],
    ['/gallery-walls-brooklyn.html', 'Brooklyn'], ['/gallery-walls-hoboken-jersey-city.html', 'Hoboken & Jersey City'], ['/portable-gallery-walls.html', 'Portable gallery walls']]],
  ['Company', [['/about.html', 'About ZNC Solutions'], ['/testimonials', 'Testimonials'], ['/trade-accounts.html', 'Trade accounts'], ['/contact.html', 'Request a quote']]],
];
const esc = s => s.replace(/&/g, '&amp;');
export const FOOTER_HTML = `<footer><div class="w fnav"><div class="fcol"><strong>ZNC SOLUTIONS</strong><br>Party rentals<br>Delivery across NYC, NJ &amp; CT<br><a href="mailto:info@zncsolutions.com">info@zncsolutions.com</a><br><a href="tel:${TEL}">${PHONE}</a></div>` +
  GROUPS.map(([h, l]) => `<div class="fcol"><p class="fh">${esc(h)}</p><ul>${l.map(([u, t]) => `<li><a href="${u}">${esc(t)}</a></li>`).join('')}</ul></div>`).join('') +
  `</div><div class="w fcopy">© <span id="year"></span> ZNC Solutions · Wayne, NJ</div></footer>`;

/* Homepage footer: no town / city / area lists on the main page (location landings stay linked from every other page). */
const HOME_GROUPS = GROUPS.filter(([h]) => h === 'Rentals' || h === 'Company');
export const HOME_FOOTER_HTML = `<footer><div class="w fnav fnav-home"><div class="fcol"><strong>ZNC SOLUTIONS</strong><br>Party rentals, gallery walls and event equipment<br><a href="mailto:info@zncsolutions.com">info@zncsolutions.com</a><br><a href="tel:${TEL}">${PHONE}</a></div>` +
  HOME_GROUPS.map(([h, l]) => `<div class="fcol"><p class="fh">${esc(h)}</p><ul>${l.map(([u, t]) => `<li><a href="${u}">${esc(t)}</a></li>`).join('')}</ul></div>`).join('') +
  `</div><div class="w fcopy">© <span id="year"></span> ZNC Solutions</div></footer>`;


/* Standard quote form (same FormSubmit fields + event type and guests). Keeps each page's own location/needs placeholders.
   Only name, email and phone are required, as before. The wall-panel booking form (#np) is left as is. Idempotent. */
const EVENT_TYPES = ['Holiday party / NYE', 'Birthday or private party', 'Wedding or engagement', 'Corporate or office event', 'Gallery, art show or exhibit', 'Other'];
export function quoteFormHtml(locPh, needsPh) {
  const fld = (lab, inner, full) => `<label class="fld${full ? ' full' : ''}"><span>${lab}</span>${inner}</label>`;
  return `<form id="quoteForm" class="form qf" data-qf="2">` +
    fld('Name', `<input id="n" name="name" autocomplete="name" placeholder="Your name" required>`) +
    fld('Email', `<input id="e" name="email" type="email" inputmode="email" autocomplete="email" placeholder="you@example.com" required>`) +
    fld('Phone', `<input id="p" name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="Best number to reach you" required>`) +
    fld('Event date <em>(optional)</em>', `<input id="d" name="date" type="date">`) +
    fld('Event type <em>(optional)</em>', `<select id="t" name="event_type"><option value="">Choose one</option>${EVENT_TYPES.map(t => `<option>${t}</option>`).join('')}</select>`) +
    fld('Guest count <em>(optional)</em>', `<input id="g" name="guests" inputmode="numeric" placeholder="e.g. 60 or 50-80">`) +
    fld('Delivery town or venue <em>(optional)</em>', `<input id="l" name="location" autocomplete="address-level2" placeholder="${locPh}">`, true) +
    fld('What do you need? <em>(optional)</em>', `<textarea id="x" name="needs" placeholder="${needsPh}"></textarea>`, true) +
    `<button type="submit">Send Quote Request</button><p id="formStatus" class="form-status" role="status" aria-live="polite">We will email and call you back.</p></form>`;
}
export function formify(html) {
  return html.replace(/<form id="?quoteForm"?[\s\S]*?<\/form>/, m => {
    if (/id="?np"?[\s>]/.test(m) || /data-qf="2"/.test(m)) return m;
    const ph = re => { const r = m.match(re); return r ? r[1].replace(/^"|"$/g, '') : ''; };
    const loc = ph(/id="?l"?[^>]*?placeholder=("[^"]*"|[^\s>]+)/) || 'Town, venue or neighborhood';
    const needs = ph(/<textarea[^>]*?placeholder=("[^"]*"|[^\s>]+)/) || 'Items, quantities and anything we should know';
    return quoteFormHtml(loc, needs);
  });
}


/* ---------- Seasonal look (holiday 2026) ----------
   ONE switch: set SEASONAL = false and rerun the generators (build-keyword-pages, build-items, build-testimonials, build-furniture-page)
   to strip everything: <html class="seasonal">, the Santa hat SVG in the logo, the Holiday ribbon under the header and /seasonal.js.
   All seasonal CSS in site.css is scoped to html.seasonal, so it goes inert on its own. */
export const SEASONAL = true;
const S_HAT = `<svg class="s-hat" aria-hidden="true" focusable="false" viewBox="0 0 40 32" width="28" height="22"><path d="M5 25C9 12 18 3 31 6c-4 3-5 9-4 17z" fill="#c8102e"/><path d="M27 23c-1-6 0-12 4-17 3 2 4 6 3 10" fill="#a50d26"/><rect x="2" y="22" width="29" height="7" rx="3.5" fill="#fff" stroke="#e3e3e3"/><circle cx="34" cy="17" r="4" fill="#fff" stroke="#e3e3e3"/></svg>`;
const S_RIBBON = `<a class="s-ribbon" href="/holiday-party-rentals.html"><span class="s-star" aria-hidden="true">✦</span> Holiday Party &amp; NYE Rentals <span aria-hidden="true">→</span></a>`;
export function seasonify(html) {
  html = html.replace(/<a class="s-ribbon"[^>]*>[\s\S]*?<\/a>/g, '').replace(/<svg class="s-hat"[\s\S]*?<\/svg>/g, '')
    .replace(/<script src="\/seasonal\.js" defer><\/script>/g, '').replace(/<html lang="?en"?(?: class="seasonal")?>/, '<html lang="en">');
  if (!SEASONAL) return html;
  html = html.replace('<html lang="en">', '<html lang="en" class="seasonal">');
  html = html.replace(/(<a class="?brand"? href="?\/"?>)/, '$1' + S_HAT);
  html = html.replace('</header>', '</header>' + S_RIBBON);
  return html.replace('</body>', '<script src="/seasonal.js" defer></script></body>');
}

/* Header nav: Testimonials link + a prominent "Call" link (desktop), and the sticky mobile call bar. Idempotent. */
const NAV_CALL = `<a class="nav-call" href="tel:${TEL}" data-track="call_click">Call ${PHONE}</a>`;
const CALLBAR = `<a class="callbar" href="tel:${TEL}" data-track="call_click">Call ${PHONE}</a>`;
/* Mobile sticky "Get a Quote" button beside the call bar (CSS shows it on phones only). */
const QUOTEBAR = `<a class="quotebar" href="/contact.html" data-track="quote_click">Get a Quote</a>`;
/* Social share image: first ZNC photo on the page (Wix media), resized to 1200px JPG; falls back to the homepage photo. */
const OG_DEFAULT = 'bbba71eec96f4bec842418a79189b67e~mv2.jpg';
function ogify(html) {
  if (/og:image/.test(html)) return html;
  const body = html.slice(Math.max(0, html.indexOf('<main')));
  const m = body.match(/static\.wixstatic\.com\/media\/e06c28_([0-9a-f]+~mv2\.(?:jpe?g|png))/);
  const url = `https://static.wixstatic.com/media/e06c28_${m ? m[1] : OG_DEFAULT}/v1/fit/w_1200,h_1200,q_80/zncsolutions.jpg`;
  return html.replace('</head>', `<meta property="og:image" content="${url}"></head>`);
}
export function navify(html) {
  html = html.replace(/<div class="?nav"?>([\s\S]*?)<\/div>/, (m, inner) => {
    let out = inner;
    if (!out.includes('href="/testimonials"') && !out.includes('href=/testimonials')) {
      const link = '<a href="/testimonials">Testimonials</a>'; const i = out.search(/<a class="?btn/);
      out = i < 0 ? out + link : out.slice(0, i) + link + out.slice(i);
    }
    if (!out.includes('nav-call')) { const i = out.search(/<a class="?btn/); out = i < 0 ? out + NAV_CALL : out.slice(0, i) + NAV_CALL + out.slice(i); }
    return m.replace(inner, out);
  });
  html = html.replace(/<a class="?callbar"?[^>]*>[^<]*<\/a>/, CALLBAR);
  if (!html.includes('class="callbar"')) html = html.replace(/(<script src="?\/app\.js"?>|<\/body>)/, m => CALLBAR + m);
  /* Pages with their own quote form (#contact) scroll to it; others go to /contact.html. */
  const QB = /id="?contact"?[\s>]/.test(html) ? QUOTEBAR.replace('href="/contact.html"', 'href="#contact"') : QUOTEBAR;
  html = html.replace(/<a class="quotebar"[^>]*>[^<]*<\/a>/, '');
  html = html.replace(CALLBAR, CALLBAR + QB);
  return seasonify(ogify(formify(html)));
}

/* Honest delivery line below the hero (never inside it) on the homepage and key rental pages. No setup claim, no prices. */
export const DELIVERY_PAGES = ['index.html', 'table-chair-rentals.html', 'furniture-lounge-rentals.html', 'linen-rentals.html', 'tabletop-glassware-rentals.html',
  'kitchen-equipment-rentals.html', 'wall-panels.html', 'party-rentals-nyc.html', 'glassware-rental-nyc.html', 'catering-equipment-rental.html', 'bar-rental.html',
  'chair-rental.html', 'trade-accounts.html', 'tri-state-event-rentals.html'];
const STRIP = `<div class="dstrip"><div class="w">Delivery and pickup across NY, NJ and CT · <a href="tel:${TEL}" data-track="call_click">Call ${PHONE}</a> · <a href="#contact">Request a quote</a></div></div>`;
export function deliverify(html, file) {
  if (!DELIVERY_PAGES.includes(file) || html.includes('class="dstrip"')) return html;
  const strip = html.includes('id="contact"') || html.includes('id=contact') ? STRIP : STRIP.replace('href="#contact"', 'href="/contact.html"');
  const mi = html.indexOf('<main'); const si = html.indexOf('</section>', mi < 0 ? 0 : mi);
  if (si < 0) return html;
  return html.slice(0, si + 10) + strip + html.slice(si + 10);
}

/* Replace the <footer>…</footer> block in every root-level .html file (idempotent). */
export function applyFooters(root) {
  const out = [];
  for (const f of fs.readdirSync(root)) {
    if (!f.endsWith('.html')) continue;
    const p = path.join(root, f); const s = fs.readFileSync(p, 'utf8');
    const foot = f === 'index.html' ? HOME_FOOTER_HTML : FOOTER_HTML;
    let n = /<footer[\s>]/.test(s) ? s.replace(/<footer[\s\S]*?<\/footer>/, () => foot) : s.replace(/(<a class="?callbar|<script src="?\/app\.js|<\/body>)/, m => foot + m);
    n = deliverify(navify(n), f);
    if (n !== s) { fs.writeFileSync(p, n); out.push(f); }
  }
  return out;
}

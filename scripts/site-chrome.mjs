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
    ['/bar-rental.html', 'Bar setups & barware'], ['/chair-rental.html', 'Chair rental'], ['/wall-panels.html', 'Gallery wall panels']]],
  ['New Jersey', [
    ['/event-rentals-wayne-nj.html', 'Wayne'], ['/party-rentals-north-jersey.html', 'North Jersey'], ['/party-rentals-paterson.html', 'Paterson'],
    ['/party-rentals-montclair.html', 'Montclair'], ['/party-rentals-morristown.html', 'Morristown'], ['/party-rentals-hoboken.html', 'Hoboken'],
    ['/party-rentals-jersey-city.html', 'Jersey City']]],
  ['New York & Connecticut', [
    ['/party-rentals-nyc.html', 'New York City'], ['/table-chair-rentals-manhattan.html', 'Manhattan tables & chairs'], ['/table-chair-rentals-brooklyn.html', 'Brooklyn tables & chairs'],
    ['/party-rentals-stamford-ct.html', 'Stamford, CT'], ['/party-rentals-greenwich-ct.html', 'Greenwich, CT'], ['/tri-state-event-rentals.html', 'Tri-state overview']]],
  ['Gallery walls', [
    ['/wall-panels.html', 'Gallery wall rentals'], ['/gallery-walls-chelsea.html', 'Chelsea'], ['/gallery-walls-manhattan.html', 'Manhattan'],
    ['/gallery-walls-brooklyn.html', 'Brooklyn'], ['/gallery-walls-hoboken-jersey-city.html', 'Hoboken & Jersey City'], ['/exhibition-wall-rental.html', 'Exhibition wall rental'], ['/portable-gallery-walls.html', 'Portable gallery walls']]],
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

/* Header nav: Testimonials link + a prominent "Call" link (desktop), and the sticky mobile call bar. Idempotent. */
const NAV_CALL = `<a class="nav-call" href="tel:${TEL}" data-track="call_click">Call ${PHONE}</a>`;
const CALLBAR = `<a class="callbar" href="tel:${TEL}" data-track="call_click">Call ${PHONE}</a>`;
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
  return html;
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

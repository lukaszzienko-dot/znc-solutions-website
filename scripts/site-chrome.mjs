/* Shared site footer with crawlable links to every landing page.
   Used by build-items.mjs and build-furniture-page.mjs; build-items.mjs also re-applies it to the hand-written root pages
   so the footer stays in sync. Edit the lists below, then rerun the generators. */
import fs from 'fs'; import path from 'path';

const PHONE = '917-536-1245', TEL = '+19175361245';
const GROUPS = [
  ['Rentals', [
    ['/rentals/', 'All rentals'], ['/table-chair-rentals.html', 'Table & chair rentals'], ['/furniture-lounge-rentals.html', 'Event furniture & lounge'],
    ['/linen-rentals.html', 'Linen rentals'], ['/rentals/bars/', 'Bar rentals'], ['/tabletop-glassware-rentals.html', 'Tabletop & glassware'],
    ['/kitchen-equipment-rentals.html', 'Kitchen equipment'], ['/wall-panels.html', 'Gallery wall panels']]],
  ['New Jersey', [
    ['/event-rentals-wayne-nj.html', 'Wayne'], ['/party-rentals-north-jersey.html', 'North Jersey'], ['/party-rentals-paterson.html', 'Paterson'],
    ['/party-rentals-montclair.html', 'Montclair'], ['/party-rentals-morristown.html', 'Morristown'], ['/party-rentals-hoboken.html', 'Hoboken'],
    ['/party-rentals-jersey-city.html', 'Jersey City']]],
  ['New York & Connecticut', [
    ['/party-rentals-nyc.html', 'New York City'], ['/table-chair-rentals-manhattan.html', 'Manhattan tables & chairs'], ['/table-chair-rentals-brooklyn.html', 'Brooklyn tables & chairs'],
    ['/party-rentals-stamford-ct.html', 'Stamford, CT'], ['/party-rentals-greenwich-ct.html', 'Greenwich, CT'], ['/tri-state-event-rentals.html', 'Tri-state overview']]],
  ['Gallery walls', [
    ['/wall-panels.html', 'Gallery wall rentals'], ['/gallery-walls-chelsea.html', 'Chelsea'], ['/gallery-walls-manhattan.html', 'Manhattan'],
    ['/gallery-walls-brooklyn.html', 'Brooklyn'], ['/gallery-walls-hoboken-jersey-city.html', 'Hoboken & Jersey City']]],
  ['Company', [['/about.html', 'About ZNC Solutions'], ['/testimonials', 'Testimonials'], ['/contact.html', 'Request a quote']]],
];
const esc = s => s.replace(/&/g, '&amp;');
export const FOOTER_HTML = `<footer><div class="w fnav"><div class="fcol"><strong>ZNC SOLUTIONS</strong><br>Party rentals from Wayne, NJ<br>NY · NJ · CT<br><a href="mailto:info@zncsolutions.com">info@zncsolutions.com</a><br><a href="tel:${TEL}">${PHONE}</a></div>` +
  GROUPS.map(([h, l]) => `<div class="fcol"><p class="fh">${esc(h)}</p><ul>${l.map(([u, t]) => `<li><a href="${u}">${esc(t)}</a></li>`).join('')}</ul></div>`).join('') +
  `</div><div class="w fcopy">© <span id="year"></span> ZNC Solutions · Wayne, NJ</div></footer>`;

/* Add the Testimonials link to the header nav of a page (idempotent). */
export function navify(html) {
  return html.replace(/<div class="?nav"?>([\s\S]*?)<\/div>/, (m, inner) => {
    if (inner.includes('href="/testimonials"') || inner.includes('href=/testimonials')) return m;
    const link = '<a href="/testimonials">Testimonials</a>';
    const i = inner.search(/<a class="?btn/);
    return m.replace(inner, i < 0 ? inner + link : inner.slice(0, i) + link + inner.slice(i));
  });
}

/* Replace the <footer>…</footer> block in every root-level .html file (idempotent). */
export function applyFooters(root) {
  const out = [];
  for (const f of fs.readdirSync(root)) {
    if (!f.endsWith('.html')) continue;
    const p = path.join(root, f); const s = fs.readFileSync(p, 'utf8');
    let n = /<footer[\s>]/.test(s) ? s.replace(/<footer[\s\S]*?<\/footer>/, () => FOOTER_HTML) : s.replace(/(<a class="?callbar|<script src="?\/app\.js|<\/body>)/, m => FOOTER_HTML + m);
    n = navify(n);
    if (n !== s) { fs.writeFileSync(p, n); out.push(f); }
  }
  return out;
}

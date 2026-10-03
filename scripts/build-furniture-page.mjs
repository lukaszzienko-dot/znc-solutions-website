#!/usr/bin/env node
/* Generates furniture-lounge-rentals.html from catalog.js (only real catalog items are listed).
   Run from the repo root:  node scripts/build-furniture-page.mjs
   Does NOT touch sitemap.xml: build-items.mjs keeps non-/rentals/ sitemap entries, so the page's entry survives reruns. */
import fs from 'fs'; import path from 'path'; import vm from 'vm';
import { FOOTER_HTML, navify } from './site-chrome.mjs';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const SITE = 'https://zncsolutions.com', PAGE = '/furniture-lounge-rentals.html';
const PHONE = '917-536-1245', TEL = '+19175361245';
const ctx = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'catalog.js'), 'utf8'), ctx);
const CATS = ctx.window.__ZNC_CATS, Z = ctx.window.__ZNC;
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const ext = img => (img.match(/\.(\w+)$/) || [, 'jpg'])[1];
const imgSized = (img, w, name, fmt) => `https://static.wixstatic.com/media/e06c28_${img}/v1/fit/w_${w},h_${w},q_85/${name}.${fmt || ext(img)}`;
const catOf = {}; for (const c of CATS) for (const it of Z[c.key] || []) catOf[it.slug] = { c, it };
const get = slug => { const o = catOf[slug]; if (!o || o.it.hidden) throw new Error('Not in catalog: ' + slug); return { ...o.it, cat: o.c, url: `/rentals/${o.c.slug}/${o.it.slug}.html` }; };
const fullName = it => it.name + (it.variant ? ` (${it.variant})` : '');
const addBtn = it => `<div class="ql-add"><input type="number" min="1" max="9999" value="1" data-ql-qty aria-label="Quantity for ${esc(fullName(it))}"><button type="button" class="ql-btn" data-ql-add data-ql-id="${esc(it.slug)}" data-ql-name="${esc(fullName(it))}" data-ql-cat="${esc(it.cat.label)}" data-ql-url="${it.url}">Add to quote</button></div>`;
const specLine = it => it.specs ? Object.entries(it.specs).filter(([k, v]) => k !== 'notes' && v).map(([, v]) => esc(v)).join('<br>') : '';
const card = it => { const sp = specLine(it); return `<div class="p"><a class="p-link" href="${it.url}"><img loading="lazy" src="${imgSized(it.img, 500, it.slug, 'webp')}" alt="${esc(fullName(it))} rental from ZNC Solutions, Wayne NJ" width="500" height="500"><b>${esc(fullName(it))}</b></a>${sp ? `<span>${sp}</span>` : ''}${addBtn(it)}<a class="p-more" href="${it.url}">View details</a></div>`; };
const cards = slugs => `<div class="grid">${slugs.map(s => card(get(s))).join('')}</div>`;
const catLink = (key, label) => { const c = CATS.find(x => x.key === key); return `<a href="/rentals/${c.slug}/">${esc(label || c.label)}</a>`; };

const hero = get('curved-green-velvet-chaise-lounge');
const heroSrc = imgSized(hero.img, 1200, hero.slug, 'webp');
const heroAlt = 'Curved green velvet chaise lounge, a lounge furniture rental from ZNC Solutions in Wayne, NJ for NYC, NJ and CT events';
const title = 'Event Furniture & Lounge Rentals | NYC · NJ · CT';
const desc = `Event furniture and lounge rentals from Wayne, NJ: velvet and corduroy sofas, chaise, coffee tables, rug, bars and tables for NYC, NJ and CT. Call ${PHONE}.`;
if (title.length > 60) throw new Error('title too long'); if (desc.length > 160) throw new Error('desc too long ' + desc.length);

const SEATING = ['mustard-velvet-tufted-couch', 'green-corduroy-two-seater-sofa', 'green-corduroy-armless-chair', 'curved-green-velvet-chaise-lounge', 'velowra-couch', 'modern-5-piece-outdoor-set'];
const LOUNGE_TABLES = ['sculptural-glass-coffee-table', 'organic-carved-wood-coffee-table', 'fleetwood-black-coffee-table', 'glossy-green-cylindrical-side-table', '9-x12-area-rug', 'blue-velvet-accent-pillows-set-of-2'];
const BARS = ['8-wooden-bar', 'custom-fabric-bar-screen'];
const TABLES = ['round-cocktail-tables', 'farmhouse-table', 'rectangular-tables', 'round-folding-table'];

const faqs = [
  ['What event furniture and lounge pieces can I rent?', 'ZNC Solutions rents velvet and corduroy sofas, a chaise lounge, coffee tables, side tables, a 9′ × 12′ area rug, accent pillows and an outdoor lounge set, plus bars, cocktail, farmhouse, rectangular and round tables from Wayne, NJ.'],
  ['Where do you deliver furniture rentals?', 'We deliver from Wayne, NJ across New York City, New Jersey and Connecticut. Tell us the venue, date and load-in details and we will confirm.'],
  ['Do you rent linens?', 'Yes. See our linen rentals page for table linens, or call 917-536-1245 or email info@zncsolutions.com for a quote.'],
  ['How do I get a quote for furniture rentals?', 'Add items to your quote list on this page, then send the request with your date, venue and quantities. You can also call 917-536-1245 or email info@zncsolutions.com.'],
];
const ld = { '@context': 'https://schema.org', '@graph': [
  { '@type': 'LocalBusiness', '@id': SITE + '/#business', name: 'ZNC Solutions', url: SITE + '/', telephone: '+19175361245', email: 'info@zncsolutions.com', address: { '@type': 'PostalAddress', addressLocality: 'Wayne', addressRegion: 'NJ', addressCountry: 'US' }, areaServed: ['New York City', 'New Jersey', 'Connecticut', 'Wayne'] },
  { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: SITE + '/' }, { '@type': 'ListItem', position: 2, name: 'Event Furniture & Lounge Rentals', item: SITE + PAGE }] },
  { '@type': 'WebPage', '@id': SITE + PAGE + '#webpage', url: SITE + PAGE, name: title, description: desc, primaryImageOfPage: heroSrc, isPartOf: { '@id': SITE + '/#business' } },
  { '@type': 'Service', name: 'Event furniture and lounge rentals', url: SITE + PAGE, serviceType: ['event furniture rentals', 'lounge furniture rentals', 'sofa rentals', 'bar and table rentals'], provider: { '@id': SITE + '/#business' }, areaServed: ['New York City', 'New Jersey', 'Connecticut'] },
  { '@type': 'FAQPage', mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
] };

const html = `<!doctype html><html lang=en><head><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1"><title>${esc(title)}</title><meta name=description content="${esc(desc)}"><link rel=canonical href="${SITE + PAGE}"><link rel=icon href=/favicon.svg type=image/svg+xml><meta name=theme-color content="#0d4a34"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${SITE + PAGE}"><meta property="og:type" content="website"><meta property="og:image" content="${heroSrc}"><link rel=stylesheet href=/site.css><script type=application/ld+json>${JSON.stringify(ld).replace(/</g, '\\u003c')}</script></head><body><header><div class=w><nav><a class=brand href=/>ZNC SOLUTIONS</a><div class=nav><a href=/#rentals>Rentals</a><a href=/wall-panels.html>Wall Panels</a><a class=btn href=#contact>Request a Quote</a></div></nav></div></header><main><section class=hero><div class="w hg"><div><div class=ey>Lounge · Bars · Tables</div><h1>Event Furniture &amp; Lounge Rentals</h1><p>Velvet and corduroy sofas, a chaise lounge, coffee tables and a rug, plus bars, specialty tables and linens, delivered from Wayne, NJ across New York, New Jersey and Connecticut. Call ${PHONE}.</p><a class=btn href=#contact>Request a Quote</a><ul class=specs><li>Velvet &amp; corduroy sofas, chaise, coffee tables, rug</li><li>Bars, cocktail and farmhouse tables</li><li>Add items to a quote list and send it in one request</li><li>Delivered from Wayne, NJ</li></ul><p><a href="/rentals/lounge-furniture/">All lounge furniture</a> · <a href="/rentals/bars/">Bars</a> · <a href="/rentals/tables/">Tables</a> · <a href=/linen-rentals.html>Linen rentals</a> · <a href=/wall-panels.html>Gallery walls</a> · <a href=/tri-state-event-rentals.html>NY · NJ · CT</a></p></div><div class=hero-pic><img src="${heroSrc}" alt="${esc(heroAlt)}" width=1200 height=1200 fetchpriority=high></div></div></section>
<section class="related"><div class=w><h2>Lounge seating: sofas, chaise &amp; chairs</h2><p class=lead>Lounge furniture ZNC owns for VIP corners, cocktail hours, gallery openings and exhibitor lounges. Browse the full ${catLink('lounge', 'Lounge Furniture')} category.</p>${cards(SEATING)}</div></section>
<section class="related"><div class=w><h2>Coffee tables, side table, rug &amp; pillows</h2><p class=lead>Pieces to finish a seating group. Outdoor heaters, umbrellas and umbrella stands are also in ${catLink('lounge', 'Lounge Furniture')}.</p>${cards(LOUNGE_TABLES)}</div></section>
<section class="related"><div class=w><h2>Bars</h2><p class=lead>Bar builds for receptions and openings. See all ${catLink('bars', 'Bars')} and ${catLink('barware', 'Barware')}.</p>${cards(BARS)}</div></section>
<section class="related"><div class=w><h2>Specialty tables</h2><p class=lead>Cocktail, farmhouse, rectangular and round tables. See all ${catLink('tables', 'Tables')}, ${catLink('chairs', 'Chairs &amp; Barstools')} and <a href=/table-chair-rentals.html>Table &amp; Chair Rentals</a>.</p>${cards(TABLES)}</div></section>
<section class="related"><div class=w><h2>Linens</h2><p class=lead>Table linens round out the setup. See <a href=/linen-rentals.html>Linen Rentals</a> or ask for linens in your quote request.</p><p><a class="btn btn-o" href=/linen-rentals.html>Linen Rentals</a></p></div></section>
<section id=trade class="feature"><div class=w><div class=ey>Trade</div><h2>Planners, Venues &amp; Exhibitors</h2><p>We rent to the people who run events. Build one quote list from lounge furniture, bars, tables and tabletop, add your date and venue, and send it in a single request.</p><h3>Event planners</h3><p>Pull seating, tables and bars into one quote instead of sourcing from several vendors. Call ${PHONE} or email <a href=mailto:info@zncsolutions.com>info@zncsolutions.com</a> with quantities and dates.</p><h3>Venues</h3><p>Furniture is delivered from Wayne, NJ to venues in New York, New Jersey and Connecticut. Share your load-in details with the quote request.</p><h3>Galleries</h3><p>Pair lounge seating and coffee tables with our 4′ × 7′ <a href=/wall-panels.html>gallery wall panels</a> for openings and shows.</p><h3>Exhibitors</h3><p>Lounge seating, tables and bars for exhibitor lounges, booths and hospitality areas. Tell us the show dates and location.</p></div></section>
<section class="feature faq"><div class=w><h2>FAQ: Event Furniture &amp; Lounge Rentals</h2>${faqs.map(([q, a]) => `<h3>${esc(q)}</h3><p>${esc(a).replace('917-536-1245', '<a href=tel:+19175361245>917-536-1245</a>').replace('info@zncsolutions.com', '<a href=mailto:info@zncsolutions.com>info@zncsolutions.com</a>')}</p>`).join('')}</div></section>
<section id=contact class=contact><div class="w cg"><div><h2>Tell us about the event.</h2><p><a href=mailto:info@zncsolutions.com>info@zncsolutions.com</a><br><a href=tel:${TEL}>${PHONE}</a><br>Quoted from Wayne, NJ</p><p><a class=btn href=/contact.html>Request a quote</a></p></div><form id=quoteForm class=form><input id=n placeholder="Your name" required><input id=e type=email placeholder=Email required><input id=p type=tel placeholder=Phone required><input id=d type=date aria-label="Event date"><input id=l placeholder="Venue / neighborhood"><textarea id=x placeholder="Furniture, bars and tables you need, quantities, date, load-in"></textarea><button type=submit>Send Quote Request</button><p id=formStatus class=form-status>We will email and call you back.</p></form></div></section></main>${FOOTER_HTML}<a class=callbar href=tel:${TEL}>${PHONE}</a><script src=/app.js></script></body></html>
`;
fs.writeFileSync(path.join(ROOT, PAGE.slice(1)), navify(html));
console.log('wrote', PAGE, 'title', title.length, 'desc', desc.length);

#!/usr/bin/env node
/* Generates the keyword landing pages (glassware-rental-nyc, catering-equipment-rental, bar-rental, chair-rental, trade-accounts)
   from catalog.js (only real, non-hidden catalog items are listed; the build fails if a slug is missing).
   Testimonial teasers quote scripts/google-reviews.json verbatim (HTML-escaped only).
   Run from the repo root:  node scripts/build-keyword-pages.mjs   then  node scripts/build-items.mjs (footer/nav/sitemap refresh).
   Sitemap: entries for these pages are added once here if missing; build-items.mjs keeps non-/rentals/ entries on reruns.
   TODO(prices): no prices are shown anywhere. Pending Lukasz's price list; do not add placeholder prices.
   TODO(delivery-timing): no order cut-off or delivery-timing promise. Add only after Lukasz confirms the exact policy. */
import fs from 'fs'; import path from 'path'; import vm from 'vm';
import { FOOTER_HTML, navify, deliverify } from './site-chrome.mjs';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const SITE = 'https://zncsolutions.com';
const LASTMOD = process.env.LASTMOD || new Date().toISOString().slice(0, 10);
const PHONE = '917-536-1245', TEL = '+19175361245';
const ctx = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'catalog.js'), 'utf8'), ctx);
const CATS = ctx.window.__ZNC_CATS, Z = ctx.window.__ZNC;
const R = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts/google-reviews.json'), 'utf8'));
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const ext = img => (img.match(/\.(\w+)$/) || [, 'jpg'])[1];
const imgSized = (img, w, name, fmt) => `https://static.wixstatic.com/media/e06c28_${img}/v1/fit/w_${w},h_${w},q_85/${name}.${fmt || ext(img)}`;
const pretty = t => String(t).replace(/(\d)\s*(?:''|")/g, '$1″').replace(/(\d)'/g, '$1′').replace(/\s+/g, ' ').trim();
const catOf = {}; for (const c of CATS) for (const it of Z[c.key] || []) catOf[it.slug] = { c, it };
const get = slug => { const o = catOf[slug]; if (!o || o.it.hidden) throw new Error('Not in catalog: ' + slug); return { ...o.it, cat: o.c, url: `/rentals/${o.c.slug}/${o.it.slug}.html` }; };
const fullName = it => pretty(it.name + (it.variant ? ` (${it.variant})` : ''));
const addBtn = it => `<div class="ql-add"><input type="number" min="1" max="9999" value="1" data-ql-qty aria-label="Quantity for ${esc(fullName(it))}"><button type="button" class="ql-btn" data-ql-add data-ql-id="${esc(it.slug)}" data-ql-name="${esc(fullName(it))}" data-ql-cat="${esc(it.cat.label)}" data-ql-url="${it.url}">Add to quote</button></div>`;
const specLine = it => it.specs ? Object.entries(it.specs).filter(([k, v]) => k !== 'notes' && v && v !== true).map(([, v]) => esc(v)).join('<br>') : '';
/* TODO(prices): render a price line here once Lukasz supplies his price list. Nothing is rendered until then. */
const card = it => { const sp = specLine(it); return `<div class="p"><a class="p-link" href="${it.url}"><img loading="lazy" src="${imgSized(it.img, 500, it.slug, 'webp')}" alt="${esc(fullName(it))}, ${esc(it.cat.label)} rental from ZNC Solutions" width="500" height="500"><b>${esc(fullName(it))}</b></a>${sp ? `<span>${sp}</span>` : ''}${addBtn(it)}<a class="p-more" href="${it.url}">View details</a></div>`; };
const cards = slugs => `<div class="grid">${slugs.map(s => card(get(s))).join('')}</div>`;
const stars = n => `<span class="tm-stars" role="img" aria-label="${n} out of 5 stars">${'★'.repeat(n)}${'☆'.repeat(5 - n)}</span>`;
const review = name => { const r = R.find(x => x.name === name); if (!r || !r.text || r.text.trim().toLowerCase() === 'no text') throw new Error('No review text: ' + name); return r; };
const teaser = names => `<section class="feature tm-list"><div class="w"><h2>What customers say</h2><p class="small">From Google reviews, shown exactly as written.</p><div class="tm-grid">${names.map(review).map(r => `<article class="tm"><h3 class="tm-name">${esc(r.name)}</h3>${stars(r.stars)}<p class="tm-text">${esc(r.text)}</p></article>`).join('')}</div><p class="tm-more"><a href="/testimonials">Read all testimonials</a></p></div></section>`;
const callBtns = `<a class="btn" href="#contact">Request a Quote</a> <a class="btn btn-o" href="tel:${TEL}">Call ${PHONE}</a>`;
const BUSINESS = { '@type': 'LocalBusiness', '@id': SITE + '/#business', name: 'ZNC Solutions', url: SITE + '/', telephone: '+1-917-536-1245', email: 'info@zncsolutions.com', address: { '@type': 'PostalAddress', addressLocality: 'Wayne', addressRegion: 'NJ', addressCountry: 'US' }, areaServed: [{ '@type': 'State', name: 'New York' }, { '@type': 'State', name: 'New Jersey' }, { '@type': 'State', name: 'Connecticut' }] };

const PAGES = [
{
  file: 'glassware-rental-nyc.html', crumb: 'Glassware Rental NYC', h1: 'Glassware Rental for NYC Events',
  title: 'Glassware Rental NYC | Wine, Coupe & Cocktail Glasses | ZNC',
  desc: 'Glassware rental for NYC, NJ and CT events: wine, flute, coupe, martini, rocks and highball glasses plus pitchers. Build a quote list or call 917-536-1245.',
  ey: 'Glassware · Bar service', hero: 'paris-coupe-glass-8-oz',
  heroAlt: 'Paris coupe glass, a glassware rental from ZNC Solutions for NYC, NJ and CT events',
  intro: `Wine, champagne, cocktail and spirits glasses for receptions, gallery openings, launches and dinners in New York City, New Jersey and Connecticut, delivered. Pick glasses by drink menu below and add each one to your quote list.`,
  specs: ['Stemmed and stemless wine glasses', 'Flutes and two coupe styles', 'Martini, rocks, highball and shot glasses', 'Pitchers, carafes and a beverage dispenser'],
  sections: [
    ['Wine &amp; champagne glasses', 'Red and white wine glasses in stemmed and stemless shapes, a flute for toasts and two coupe styles for champagne or cocktails served up.', ['red-wine-glass-16-oz', 'a-p-white-wine-glass-12-oz', 'stemless-red-wine-glass-17-oz', 'stemless-white-wine-glass-12-oz', 'flute-glass-7-oz', 'elegance-coupe-10-oz', 'paris-coupe-glass-8-oz']],
    ['Cocktail &amp; spirits glasses', 'Rocks, double rocks and highball glasses cover most bar menus. A stemless martini glass, a shot glass and a small sherbet glass handle the rest.', ['martini-glass-13-5-oz-stemless', 'old-fashioned-glass-8-oz', 'double-old-fashioned-13-oz', 'double-highball-glass-12-oz', 'charisma-glass-12-oz', 'shot-glass', 'sherbet-glass-5-oz']],
    ['Pitchers, carafes &amp; dispensers', 'For water service on the tables and batched drinks at the bar.', ['azul-glass-pitcher-53-oz', 'glass-carafe-24-oz', 'glass-beverage-dispenser-2-gal']],
  ],
  guide: `<h2>How to plan glassware for an event</h2><p>Start from the drink menu. A wine-and-champagne reception needs wine glasses and flutes or coupes. A full cocktail bar adds rocks and highball glasses, and a martini or coupe if drinks are served up. Water service at seated tables needs a water glass at each place plus pitchers or carafes.</p><p>Guests often take a fresh glass for each drink, so plan extras beyond your headcount, especially for a long cocktail hour without glass collection. Tell us the guest count, the length of the event and the drink menu, and we will help you settle the quantities on the quote.</p><h3>Glassware rental or full tabletop?</h3><p>This page is about drinking glasses for bar and toast service. For plates, bowls, platters, flatware and a complete place setting, see <a href="/tabletop-glassware-rentals.html">Tabletop &amp; Glassware Rentals</a>. To set up the bar itself, see <a href="/bar-rental.html">Bar Rental</a>.</p>`,
  faqs: [
    ['What glassware can I rent?', 'Red and white wine glasses (stemmed and stemless), a champagne flute, two coupe styles, a stemless martini glass, old fashioned, double old fashioned, highball, shot and sherbet glasses, plus a glass pitcher, carafe and beverage dispenser.'],
    ['Do you deliver glassware in New York City?', 'Yes. We deliver to events across New York City, New Jersey and Connecticut. Share your venue and load-in details with the quote request.'],
    ['How do I get a glassware quote?', 'Add glasses to your quote list on this page and send it with your date, venue and quantities, or call 917-536-1245 or email info@zncsolutions.com.'],
  ],
  reviews: ['UK Mission Press Office', 'Camillya Lima'],
  related: [['/tabletop-glassware-rentals.html', 'Tabletop & Glassware Rentals'], ['/bar-rental.html', 'Bar Rental'], ['/rentals/glassware/', 'All glassware'], ['/rentals/barware/', 'Barware'], ['/catering-equipment-rental.html', 'Catering Equipment Rental'], ['/trade-accounts.html', 'Trade Accounts']],
  form: 'Glasses you need, quantities, date, venue',
},
{
  file: 'catering-equipment-rental.html', crumb: 'Catering Equipment Rental', h1: 'Catering Equipment Rental',
  title: 'Catering Equipment Rental | Chafers, Buffet & Coffee | ZNC',
  desc: 'Catering equipment rental for NYC, NJ and CT: chafing dishes, food pans, heat lamps, buffet risers, trays, servers and coffee urns. Call 917-536-1245.',
  ey: 'Buffet · Hot holding · Coffee', hero: 'chafing-dish-8-qt',
  heroAlt: 'Chafing dish, a catering equipment rental from ZNC Solutions for NYC, NJ and CT events',
  intro: `Front-of-house catering equipment for buffets, family-style service and coffee stations: chafing dishes and food pans, hot-holding gear, display risers, trays, serving utensils and coffee makers, delivered across New York, New Jersey and Connecticut.`,
  specs: ['Chafing dishes, food pans and fuel', 'Heat lamp, bain-marie and warming cabinet', 'Buffet risers, trays and serving utensils', 'Coffee makers and a samovar'],
  sections: [
    ['Chafers &amp; hot holding', 'Keep food hot on the buffet line and behind it.', ['chafing-dish-8-qt', 'full-size-chafer-food-pan-8-qt', 'sterno-can-or-case', 'heat-lamp', 'bain-marie', 'warming-electric-cabinet']],
    ['Buffet display &amp; serving', 'Risers, trays and utensils to build a buffet or grazing table with height and a clear flow.', ['19-round-food-display', 'white-display-risers-set-of-6', 'glass-riser', 'hammered-tray-15', '12-gold-tray', 'black-square-resin-tray', 'silver-serving-spoon', 'silver-serving-fork', 'stainless-steel-scissor-tongs', '10-ladle']],
    ['Coffee service', 'For breakfast meetings, dessert courses and late-night coffee.', ['100-cup-coffee-maker', '30-cup-coffee-maker', 'stainless-steel-samovar', 'french-press-32-oz']],
    ['Back-of-house basics', 'Bus tubs and bins to keep service moving and the room clean.', ['bus-tub', '32-gallon-garbage-bin', 'cutting-boards']],
  ],
  guide: `<h2>Catering equipment rental vs. kitchen equipment</h2><p>This page covers the equipment guests see or that sits on the service line: chafers, buffet displays, serving pieces and coffee. If you are cooking on-site and need ovens, fryers, burners, proofing cabinets or refrigeration, see <a href="/kitchen-equipment-rentals.html">Kitchen Equipment Rentals</a>. Many caterers book both on one quote.</p><h3>Planning a buffet</h3><p>Count the hot dishes on the menu to set the number of chafers, then add fuel for the length of service. Risers and trays help the cold side of a buffet read as full. Let us know if the venue restricts open flames, so we can plan electric hot holding instead.</p>`,
  faqs: [
    ['What catering equipment do you rent?', 'Chafing dishes, full-size food pans, chafing fuel, a heat lamp, bain-marie, electric warming cabinet, buffet risers and displays, trays, serving utensils, 30- and 100-cup coffee makers and a samovar, plus ovens and other kitchen equipment on our kitchen equipment page.'],
    ['Do you work with caterers on repeat events?', 'Yes. See our trade accounts page, or call 917-536-1245 to talk about recurring orders.'],
    ['Where do you deliver catering equipment?', 'From Wayne, NJ across New York City, New Jersey and Connecticut. Share the venue and load-in details with your quote request.'],
  ],
  reviews: ['Annie Gonzalez', 'Kathleen Reddington'],
  related: [['/kitchen-equipment-rentals.html', 'Kitchen Equipment Rentals'], ['/rentals/serving-display/', 'Serving & display'], ['/rentals/coffee-tea-service/', 'Coffee & tea service'], ['/tabletop-glassware-rentals.html', 'Tabletop & Glassware Rentals'], ['/glassware-rental-nyc.html', 'Glassware Rental NYC'], ['/trade-accounts.html', 'Trade Accounts']],
  form: 'Equipment you need, quantities, date, venue, power',
},
{
  file: 'bar-rental.html', crumb: 'Bar Rental', h1: 'Bar Rental for Events',
  title: 'Bar Rental | Event Bars, Barware & Bar Stools | ZNC',
  desc: 'Event bar rental for NYC, NJ and CT: an 8′ wooden bar, a fabric bar screen, ice tubs, shakers, coolers, bar stools and cocktail tables. Call 917-536-1245.',
  ey: 'Bars · Barware · Stools', hero: '8-wooden-bar',
  heroAlt: '8 foot wooden bar, an event bar rental from ZNC Solutions for NYC, NJ and CT events',
  intro: `Everything to set up a working bar for a reception, opening, launch or private party: the bar itself, the tools behind it, and the stools and cocktail tables around it, delivered across New York, New Jersey and Connecticut.`,
  specs: ['8′ wooden bar or custom fabric bar screen', 'Ice tubs, buckets and a 150 qt cooler', 'Shakers, jiggers, scoops, mats and caddies', 'Bar stools and cocktail tables'],
  sections: [
    ['The bar', 'A wooden bar gives bartenders a proper station. A fabric-wrapped bar screen hides coolers and supplies.', ['8-wooden-bar', 'custom-fabric-bar-screen']],
    ['Ice &amp; chilling', 'Tubs and buckets for bottles on display, and a large cooler for backup ice.', ['gold-ice-tub', 'hammered-ice-tub-19', 'chrome-ice-bucket', 'gold-ice-bucket', '150qt-cooler', 'bar-scoop']],
    ['Bar tools', 'The working kit behind the bar.', ['cocktail-shaker', 'jigger', 'corkscrew-and-bottle-opener', 'bar-cutting-board', 'bar-floor-mat', 'bar-caddy', 'blender', 'glass-beverage-dispenser-2-gal', 'swing-bottle-34oz', 'paper-cocktail-napkins-50-ct']],
    ['Bar stools &amp; cocktail tables', 'Seating and standing tables for the bar area.', ['x-back-barstool', 'white-wooden-barstool', 'black-wooden-barstool', 'silver-chiavari-barstool', 'round-cocktail-tables']],
  ],
  guide: `<h2>Setting up an event bar</h2><p>Start with where the bar goes and how many guests it serves at peak. Add ice tubs or buckets for bottles on display, a cooler for backup ice, and the tools your bartenders work with. Glassware comes next: see <a href="/glassware-rental-nyc.html">Glassware Rental NYC</a> for wine, coupe, martini, rocks and highball glasses.</p><p>For a lounge next to the bar, see <a href="/furniture-lounge-rentals.html">Event Furniture &amp; Lounge Rentals</a>. The full catalog listings are in <a href="/rentals/bars/">Bars</a> and <a href="/rentals/barware/">Barware</a>.</p>`,
  faqs: [
    ['What bars can I rent?', 'An 8′ wooden bar and a custom fabric bar screen, plus barware, ice tubs, a 150 qt cooler, bar stools and cocktail tables.'],
    ['Do you rent glassware with the bar?', 'Yes. Wine, champagne, cocktail and spirits glasses are on our glassware rental NYC page and can go on the same quote.'],
    ['How do I get a bar rental quote?', 'Add items to your quote list on this page and send it with your date and venue, or call 917-536-1245 or email info@zncsolutions.com.'],
  ],
  reviews: ['UK Mission Press Office', 'Luke Heneghan'],
  related: [['/glassware-rental-nyc.html', 'Glassware Rental NYC'], ['/rentals/bars/', 'Bars'], ['/rentals/barware/', 'Barware'], ['/furniture-lounge-rentals.html', 'Event Furniture & Lounge'], ['/chair-rental.html', 'Chair Rental'], ['/trade-accounts.html', 'Trade Accounts']],
  form: 'Bar setup you need, quantities, date, venue',
},
{
  file: 'chair-rental.html', crumb: 'Chair Rental', h1: 'Chair Rental for Events',
  title: 'Chair Rental | Chiavari, Folding & X-Back Chairs | ZNC',
  desc: 'Event chair rental for NYC, NJ and CT: Chiavari chairs in six finishes, white and black folding chairs, X-back chairs and bar stools. Call 917-536-1245.',
  ey: 'Chiavari · Folding · Bar stools', hero: 'gold-chiavari-chair',
  heroAlt: 'Gold Chiavari chair, an event chair rental from ZNC Solutions for NYC, NJ and CT events',
  intro: `Chairs for weddings, ceremonies, seated dinners, galas and big headcounts: Chiavari chairs in several finishes, folding chairs, a rustic X-back chair and bar stools, delivered across New York, New Jersey and Connecticut.`,
  specs: ['Chiavari chairs: white, black, gold, natural wood, dark wood, transparent', 'White and black folding chairs', 'X-back rustic chair', 'Bar stools for high-top tables'],
  sections: [
    ['Chiavari chairs', 'The classic choice for weddings and seated dinners. Pick the finish to match your linens.', ['white-chiavari-chair', 'black-chiavari-chair', 'gold-chiavari-chair', 'natural-wood-chiavari-chair', 'dark-wood-chiavari-chair', 'transparent-chiavari-chair']],
    ['Folding &amp; rustic chairs', 'Folding chairs cover ceremonies, talks and large headcounts. The X-back suits farmhouse tables.', ['white-folding-chair', 'black-folding-chair', 'x-back-rustic-chair']],
    ['Bar stools', 'For bars, high-top cocktail tables and counters.', ['x-back-barstool', 'white-chiavari-barstool', 'silver-chiavari-barstool', 'black-wooden-barstool', 'white-wooden-barstool', 'barstool']],
  ],
  guide: `<h2>Choosing chairs by event</h2><p><strong>Weddings and seated dinners:</strong> Chiavari chairs, with the finish chosen to match linens and décor. <strong>Ceremonies, talks and screenings:</strong> folding chairs set in rows. <strong>Rustic or family-style dinners:</strong> X-back chairs at farmhouse tables. <strong>Cocktail hours:</strong> bar stools at high-top tables.</p><p>Plan one chair per guest for seated events, and tell us if the ceremony and dinner are in different spaces so we can work out whether chairs move between them or you need two sets.</p><h3>Need tables too?</h3><p>This page is about chairs. For round, rectangular, farmhouse and cocktail tables and complete seating plans, see <a href="/table-chair-rentals.html">Table &amp; Chair Rentals</a>.</p>`,
  faqs: [
    ['What chairs do you rent?', 'Chiavari chairs in white, black, gold, natural wood, dark wood and transparent, white and black folding chairs, an X-back rustic chair, and several bar stools.'],
    ['Do you set up chairs?', 'Tell us about the event and venue in your quote request and we will confirm what setup is included.'],
    ['How do I get a chair rental quote?', 'Add chairs to your quote list on this page and send it with your date, venue and headcount, or call 917-536-1245 or email info@zncsolutions.com.'],
  ],
  reviews: ['Lindsey Rupp', 'Zeena Arturo'],
  related: [['/table-chair-rentals.html', 'Table & Chair Rentals'], ['/rentals/chairs-barstools/', 'All chairs & bar stools'], ['/rentals/tables/', 'Tables'], ['/linen-rentals.html', 'Linen Rentals'], ['/bar-rental.html', 'Bar Rental'], ['/trade-accounts.html', 'Trade Accounts']],
  form: 'Chairs you need, quantities, date, venue',
},
{
  file: 'trade-accounts.html', crumb: 'Trade Accounts', h1: 'Trade Accounts for Caterers, Venues & Galleries',
  title: 'Trade Accounts for Caterers, Venues & Galleries | ZNC',
  desc: 'Trade accounts for caterers, venues and galleries in NYC, NJ and CT: one rental partner for kitchen gear, tabletop, bars, furniture and gallery walls.',
  ey: 'Trade · Repeat orders', hero: 'wall-panel-system',
  heroAlt: 'Modular 4 by 7 foot gallery wall panel system, rented by ZNC Solutions to galleries and venues',
  intro: `If you run events every month, not once a year, talk to us about a trade account. ZNC Solutions supplies caterers, venues and galleries across New York, New Jersey and Connecticut, with kitchen equipment, tabletop and glassware, bars, furniture and 4′ × 7′ gallery wall panels on one quote.`,
  specs: ['For caterers, venues, galleries and planners', 'Kitchen, tabletop, bars, furniture and walls on one quote', 'Talk to Lukasz directly: 917-536-1245', 'Delivery across NYC, NJ & CT'],
  /* TODO(trade-terms): billing terms, any trade pricing and ordering cut-offs are pending Lukasz. Do not publish terms until he confirms them. */
  sections: [
    ['For caterers', 'Hot holding, buffet service and on-site cooking equipment. See <a href="/catering-equipment-rental.html">Catering Equipment Rental</a> and <a href="/kitchen-equipment-rentals.html">Kitchen Equipment Rentals</a>.', ['chafing-dish-8-qt', 'warming-electric-cabinet', 'single-deck-full-size-electric-convection-oven', 'red-wine-glass-16-oz']],
    ['For venues', 'Seating, tables and bars to fill gaps in house inventory. See <a href="/chair-rental.html">Chair Rental</a> and <a href="/bar-rental.html">Bar Rental</a>.', ['white-folding-chair', 'round-cocktail-tables', '8-wooden-bar', 'rectangular-tables']],
    ['For galleries', 'Free-standing 4′ × 7′ walls for shows, art fairs and pop-ups, plus lounge seating for openings. See <a href="/wall-panels.html">Gallery Wall Panels</a>.', ['wall-panel-system', 'room-divider', 'mustard-velvet-tufted-couch', 'sculptural-glass-coffee-table']],
  ],
  guide: `<h2>How a trade account works</h2><p>Call or email with the kinds of events you run and how often. Lukasz will talk through what you rent most, your venues and load-in needs, and how ordering will work for you. Build a first quote list from the <a href="/rentals/">rental catalog</a> to get started.</p><p>Planners and exhibitors are welcome too: see <a href="/furniture-lounge-rentals.html#trade">Planners, Venues &amp; Exhibitors</a> on our furniture page.</p>`,
  faqs: [
    ['Who are trade accounts for?', 'Caterers, venues, galleries, planners and other businesses that rent event equipment regularly in New York, New Jersey and Connecticut.'],
    ['How do I open a trade account?', 'Call 917-536-1245 or email info@zncsolutions.com with your business name, the events you run and how often.'],
  ],
  reviews: ['Kathleen Reddington', 'Tiyé Bazzey'],
  related: [['/catering-equipment-rental.html', 'Catering Equipment Rental'], ['/kitchen-equipment-rentals.html', 'Kitchen Equipment Rentals'], ['/wall-panels.html', 'Gallery Wall Panels'], ['/furniture-lounge-rentals.html', 'Event Furniture & Lounge'], ['/glassware-rental-nyc.html', 'Glassware Rental NYC'], ['/rentals/', 'Full rental catalog']],
  form: 'Your business, the events you run, how often',
},
{
  file: 'exhibition-wall-rental.html', crumb: 'Exhibition Wall Rental', h1: 'Exhibition Wall Rental in NYC, NJ & CT',
  title: 'Exhibition Wall Rental NYC, NJ & CT | 4x7 Panels | ZNC',
  desc: 'Exhibition wall rental for art fairs, gallery shows and pop-ups: freestanding white 4x7 ft panels delivered across NYC, NJ and CT. Call 917-536-1245.',
  ey: 'Exhibition walls · 4′ × 7′ panels', hero: 'wall-panel-system',
  heroAlt: 'Freestanding white 4 by 7 foot exhibition wall panels rented by ZNC Solutions',
  intro: `Freestanding white exhibition walls for art fairs, gallery shows, brand activations, trade events and pop-ups in New York City, New Jersey and Connecticut. Every panel is a standard 4′ wide × 7′ tall, so you can plan a run of wall by counting panels, then build a quote list below.`,
  specs: ['Standard panel: 4′ wide × 7′ tall', '20-ft run = 5 panels', 'Modular or stationary layouts', 'Delivery across NYC, NJ & CT'],
  sections: [
    ['Exhibition wall panels', 'Clean white panels that stand on their own to create booths, corridors and hanging walls inside any event space.', ['wall-panel-system', 'room-divider']],
  ],
  guide: `<h2>How to plan an exhibition wall layout</h2><p>Measure the wall you want in feet and divide by 4: each panel adds 4′ of width at 7′ tall, so a 20-ft wall is 5 panels and a 40-ft run is 10. Straight runs suit a single hanging wall, L and U shapes make booth-style bays, and back-to-back runs give you hanging space on both sides. Send your floor plan, show dates and venue with the quote request and we will confirm the panel count. See also <a href="/portable-gallery-walls.html">portable gallery walls</a> and the main <a href="/wall-panels.html">gallery wall panels</a> page.</p>`,
  faqs: [
    ['What size are the exhibition wall panels?', "Every panel is a standard 4' wide x 7' tall."],
    ['How many panels do I need?', "Divide the wall length you want in feet by 4. A 20-ft run of wall takes 5 panels, a 40-ft run takes 10."],
    ['Where do you deliver exhibition walls?', 'We deliver across New York City, New Jersey and Connecticut. ZNC Solutions is based in Wayne, NJ.'],
    ['How do I get an exhibition wall quote?', 'Add panels to your quote list on this page and send it with your dates, venue and layout, or call 917-536-1245 or email info@zncsolutions.com.'],
  ],
  reviews: ['Kathleen Reddington', 'Tiyé Bazzey'],
  related: [['/wall-panels.html', 'Gallery Wall Panels'], ['/portable-gallery-walls.html', 'Portable Gallery Walls'], ['/gallery-walls-chelsea.html', 'Gallery walls Chelsea'], ['/gallery-walls-manhattan.html', 'Gallery walls Manhattan'], ['/furniture-lounge-rentals.html', 'Event Furniture & Lounge'], ['/trade-accounts.html', 'Trade Accounts']],
  form: 'Wall length or panel count, dates, venue',
},
{
  file: 'portable-gallery-walls.html', crumb: 'Portable Gallery Walls', h1: 'Portable Gallery Walls & Art Display Panel Rental in NYC',
  title: 'Portable Gallery Walls | Art Display Panel Rental NYC | ZNC',
  desc: 'Portable gallery walls and art display panel rental in NYC, NJ and CT: freestanding white 4x7 ft panels for shows, openings and pop-ups. Call 917-536-1245.',
  ey: 'Portable gallery walls · Art display panels', hero: 'wall-panel-system',
  heroAlt: 'Portable white gallery wall panels for art display, a ZNC Solutions rental',
  intro: `Portable gallery walls turn an empty room, lobby or loft into a place to hang art for a show, opening or pop-up. ZNC Solutions rents freestanding white art display panels, each a standard 4′ wide × 7′ tall, delivered across New York City, New Jersey and Connecticut.`,
  specs: ['Standard panel: 4′ wide × 7′ tall', 'Freestanding, no wall fixing', 'Modular or stationary layouts', 'Delivery across NYC, NJ & CT'],
  sections: [
    ['Art display panels', 'White panels for hanging artwork, photography and graphics, plus a room divider for screening off back-of-house space.', ['wall-panel-system', 'room-divider']],
  ],
  guide: `<h2>Planning portable gallery walls</h2><p>Count the works you want to hang and how much space each one needs, then add up the wall length. Each panel gives you 4′ of width, so 5 panels make a 20-ft hanging wall. Panels can run in a straight line, turn corners to make bays, or stand back to back for double-sided display. Pair the walls with <a href="/furniture-lounge-rentals.html">lounge furniture</a> for an opening night. See also <a href="/exhibition-wall-rental.html">exhibition wall rental</a> and <a href="/case-studies.html">recent wall panel projects</a>.</p>`,
  faqs: [
    ['What size are the portable gallery wall panels?', "Every panel is a standard 4' wide x 7' tall."],
    ['Do you rent art display panels in NYC?', 'Yes. We deliver art display panels across New York City, New Jersey and Connecticut.'],
    ['Can the panels be used on both sides?', 'Panels can be arranged back to back so there is hanging space on both sides of a run. Share your layout with the quote request and we will confirm the panel count.'],
    ['How do I get a quote for portable gallery walls?', 'Add panels to your quote list on this page and send it with your dates, venue and layout, or call 917-536-1245 or email info@zncsolutions.com.'],
  ],
  reviews: ['Kathleen Reddington', 'Tiyé Bazzey'],
  related: [['/wall-panels.html', 'Gallery Wall Panels'], ['/exhibition-wall-rental.html', 'Exhibition Wall Rental'], ['/case-studies.html', 'Wall Panel Projects'], ['/gallery-walls-brooklyn.html', 'Gallery walls Brooklyn'], ['/gallery-walls-hoboken-jersey-city.html', 'Gallery walls Hoboken & Jersey City'], ['/furniture-lounge-rentals.html', 'Event Furniture & Lounge']],
  form: 'Wall length or panel count, dates, venue',
},
{
  file: 'case-studies.html', crumb: 'Wall Panel Projects', h1: 'Wall Panel Projects in NYC',
  title: 'Wall Panel Projects & Case Studies | ZNC Solutions',
  desc: 'Recent ZNC Solutions wall panel projects: freestanding white 4x7 ft gallery walls for a gallery event and a corporate event in New York City. Call 917-536-1245.',
  ey: 'Case studies · Gallery walls', hero: 'wall-panel-system', noReviews: true,
  heroAlt: 'White 4 by 7 foot ZNC gallery wall panels set up for an event',
  intro: `A look at recent projects using ZNC Solutions gallery wall panels in New York City. Every panel is a standard 4′ wide × 7′ tall.`,
  specs: ['Standard panel: 4′ wide × 7′ tall', 'Gallery and corporate events', 'Delivery across NYC, NJ & CT'],
  extra: `<!-- DRAFT: every [CONFIRM WITH LUKASZ] placeholder must be replaced with facts from Lukasz before this page goes to main. No client names without permission. -->` +
    `<section class="feature cs"><div class="w"><h2>Project 1: Gallery event in NYC</h2><div class="cs-grid"><video class="cs-v" autoplay muted loop playsinline controls preload="metadata" poster="/assets/video/wall-panels-project-poster.jpg" width="608" height="1080" aria-label="Video of white 4 by 7 foot ZNC gallery wall panels set up in an event space"><source src="/assets/video/wall-panels-project.mp4" type="video/mp4"></video><div><ul class="specs cs-facts"><li><b>Event:</b> Gallery event, New York City</li><li><b>Venue type:</b> <mark class="ph">[CONFIRM WITH LUKASZ: venue type]</mark></li><li><b>Date:</b> <mark class="ph">[CONFIRM WITH LUKASZ: month/year]</mark></li><li><b>Panels:</b> <mark class="ph">[CONFIRM WITH LUKASZ: panel count]</mark> × 4′ × 7′</li><li><b>Layout:</b> <mark class="ph">[CONFIRM WITH LUKASZ: layout, e.g. straight runs / bays]</mark></li></ul><p><mark class="ph">[CONFIRM WITH LUKASZ: one or two sentences on what the client needed the walls for]</mark></p></div></div></div></section>` +
    `<section class="feature cs"><div class="w"><h2>Project 2: Corporate event in NYC</h2><div class="cs-grid"><img loading="lazy" src="https://static.wixstatic.com/media/e06c28_fe3a504cd4644d88b0ecd0c3ee54a27b~mv2.png/v1/fit/w_800,h_800,q_85/wall-panel-system.webp" alt="White ZNC gallery wall panels" width="800" height="800"><div><ul class="specs cs-facts"><li><b>Event:</b> Corporate event, New York City</li><li><b>Venue type:</b> <mark class="ph">[CONFIRM WITH LUKASZ: venue type]</mark></li><li><b>Date:</b> <mark class="ph">[CONFIRM WITH LUKASZ: month/year]</mark></li><li><b>Panels:</b> <mark class="ph">[CONFIRM WITH LUKASZ: panel count]</mark> × 4′ × 7′</li><li><b>Use:</b> <mark class="ph">[CONFIRM WITH LUKASZ: e.g. branded display walls / room division]</mark></li></ul><p><mark class="ph">[CONFIRM WITH LUKASZ: short description of the project]</mark></p></div></div></div></section>` +
    `<section class="feature cs"><div class="w"><h2>Project 3: <mark class="ph">[CONFIRM WITH LUKASZ: optional third project, gallery or corporate]</mark></h2><p><mark class="ph">[CONFIRM WITH LUKASZ: event type, venue type, date, panel count, photo to use, or delete this section]</mark></p></div></section>` +
    `<style>.cs-grid{display:grid;grid-template-columns:minmax(0,360px) 1fr;gap:1.5rem;align-items:start}.cs-v,.cs-grid img{display:block;width:100%;height:auto;border-radius:14px;box-shadow:0 10px 30px rgba(0,0,0,.12);background:#eee}.cs-v{aspect-ratio:608/1080;max-height:80vh;object-fit:cover}.ph{background:#fff3b0;padding:0 .2em;border-radius:3px}@media(max-width:720px){.cs-grid{grid-template-columns:1fr}}</style>`,
  sections: [],
  guide: `<h2>Planning your own wall panel project</h2><p>Each panel adds 4′ of wall at 7′ tall, so a 20-ft run is 5 panels. Read more on <a href="/exhibition-wall-rental.html">exhibition wall rental</a>, <a href="/portable-gallery-walls.html">portable gallery walls</a> and the main <a href="/wall-panels.html">gallery wall panels</a> page.</p>`,
  faqs: [
    ['What size are ZNC wall panels?', "Every panel is a standard 4' wide x 7' tall."],
    ['What kinds of events use the panels?', 'Gallery shows and openings, art fairs, corporate events, brand activations and pop-ups.'],
    ['Where do you deliver wall panels?', 'We deliver across New York City, New Jersey and Connecticut.'],
  ],
  related: [['/wall-panels.html', 'Gallery Wall Panels'], ['/exhibition-wall-rental.html', 'Exhibition Wall Rental'], ['/portable-gallery-walls.html', 'Portable Gallery Walls'], ['/gallery-walls-manhattan.html', 'Gallery walls Manhattan']],
  form: 'Wall length or panel count, dates, venue',
},
];

for (const P of PAGES) {
  const URL = '/' + P.file, hero = get(P.hero), heroSrc = imgSized(hero.img, 1000, hero.slug, 'webp');
  if (P.title.length > 60) throw new Error(P.file + ' title ' + P.title.length);
  if (P.desc.length < 120 || P.desc.length > 160) throw new Error(P.file + ' desc ' + P.desc.length);
  const ld = { '@context': 'https://schema.org', '@graph': [BUSINESS,
    { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: SITE + '/' }, { '@type': 'ListItem', position: 2, name: P.crumb, item: SITE + URL }] },
    { '@type': 'WebPage', '@id': SITE + URL + '#webpage', url: SITE + URL, name: P.title, description: P.desc, primaryImageOfPage: heroSrc, isPartOf: { '@id': SITE + '/#business' } },
    { '@type': 'Service', name: P.h1, url: SITE + URL, provider: { '@id': SITE + '/#business' }, areaServed: BUSINESS.areaServed },
    { '@type': 'FAQPage', mainEntity: P.faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) }] };
  const link = a => esc(a).replace('917-536-1245', `<a href="tel:${TEL}">917-536-1245</a>`).replace('info@zncsolutions.com', '<a href="mailto:info@zncsolutions.com">info@zncsolutions.com</a>');
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(P.title)}</title><meta name="description" content="${esc(P.desc)}"><link rel="canonical" href="${SITE + URL}"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><meta name="theme-color" content="#0d4a34"><meta property="og:title" content="${esc(P.title)}"><meta property="og:description" content="${esc(P.desc)}"><meta property="og:url" content="${SITE + URL}"><meta property="og:type" content="website"><meta property="og:image" content="${heroSrc}"><link rel="stylesheet" href="/site.css"><script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script></head><body>` +
    `<header><div class="w"><nav><a class="brand" href="/">ZNC SOLUTIONS</a><div class="nav"><a href="/rentals/">Rentals</a><a href="/wall-panels.html">Wall Panels</a><a href="/testimonials">Testimonials</a><a class="btn" href="/contact.html">Quote</a></div></nav></div></header>` +
    `<main><div class="w"><nav aria-label="Breadcrumb"><ol class="bc"><li><a href="/">Home</a></li><li aria-current="page">${esc(P.crumb)}</li></ol></nav></div>` +
    `<section class="hero kw-hero"><div class="w hg"><div><div class="ey kw-ey">${P.ey}</div><h1>${esc(P.h1)}</h1><p>${P.intro}</p><p>${callBtns}</p><ul class="specs">${P.specs.map(s => `<li>${esc(s)}</li>`).join('')}</ul></div><div class="hero-pic"><img src="${heroSrc}" alt="${esc(P.heroAlt)}" width="1000" height="1000" fetchpriority="high"></div></div></section>` +
    (P.extra || '') + `<!-- TODO(prices): prices pending Lukasz's price list. Do not render placeholder prices. -->` +
    `<!-- TODO(delivery-timing): any order cut-off or delivery-timing line awaits Lukasz's confirmation. Not shown until confirmed. -->` +
    P.sections.map(([h, lead, slugs]) => `<section class="related"><div class="w"><h2>${h}</h2><p class="lead">${lead}</p>${cards(slugs)}</div></section>`).join('') +
    `<section class="feature"><div class="w">${P.guide}<p>${callBtns}</p></div></section>` +
    (P.noReviews ? '' : teaser(P.reviews)) +
    `<section class="feature faq"><div class="w"><h2>FAQ</h2>${P.faqs.map(([q, a]) => `<h3>${esc(q)}</h3><p>${link(a)}</p>`).join('')}</div></section>` +
    `<section class="related"><div class="w"><h2>Related rentals</h2><p class="cat-links">${P.related.map(([u, t]) => `<a href="${u}">${esc(t)}</a>`).join('')}</p></div></section>` +
    `<section id="contact" class="contact"><div class="w cg"><div><h2>Tell us about the event.</h2><p><a href="mailto:info@zncsolutions.com">info@zncsolutions.com</a><br><a href="tel:${TEL}">${PHONE}</a><br>Delivery across NYC, NJ &amp; CT</p><p><a class="btn" href="tel:${TEL}">Call ${PHONE}</a></p></div><form id="quoteForm" class="form"><input id="n" placeholder="Your name" required><input id="e" type="email" placeholder="Email" required><input id="p" type="tel" placeholder="Phone" required><input id="d" type="date" aria-label="Event date"><input id="l" placeholder="Venue / neighborhood"><textarea id="x" placeholder="${esc(P.form)}"></textarea><button type="submit">Send Quote Request</button><p id="formStatus" class="form-status">We will email and call you back.</p></form></div></section></main>` +
    `${FOOTER_HTML}<a class="callbar" href="tel:${TEL}">${PHONE}</a><script src="/app.js"></script></body></html>\n`;
  fs.writeFileSync(path.join(ROOT, P.file), deliverify(navify(html), P.file));
  console.log('wrote', P.file, 'title', P.title.length, 'desc', P.desc.length);
}
/* Sitemap: add missing entries (build-items.mjs preserves them and bumps lastmod when the file changes). */
{
  const f = path.join(ROOT, 'sitemap.xml'); let s = fs.readFileSync(f, 'utf8');
  const add = PAGES.map(p => SITE + '/' + p.file).filter(u => !s.includes(`<loc>${u}</loc>`)).map(u => `<url><loc>${u}</loc><lastmod>${LASTMOD}</lastmod></url>`).join('');
  if (add) { s = s.replace(/(<url><loc>[^<]*\/rentals\/<\/loc>)/, add + '$1'); fs.writeFileSync(f, s); }
}

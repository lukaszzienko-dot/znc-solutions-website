#!/usr/bin/env node
/* Generates the New Jersey location pages: the NJ hub, Bergen County, Newark & Essex County,
   and the North Jersey, Wayne, Paterson, Montclair, Hoboken, Jersey City and Morristown landings.
   Unique body copy lives in this file. Run from the repo root:
     LASTMOD=YYYY-MM-DD node scripts/build-nj-pages.mjs
   then  node scripts/build-items.mjs  (footer/nav/sitemap refresh).
   If build-items.mjs rewrites vercel.json in an unrelated way, revert that file.
   Rules: no prices, no street address, Wayne, NJ is the only public location (never "from Wayne, NJ"),
   no setup/installation claims, no tours, generic venue types only (no invented venues, clients or numbers). */
import fs from 'fs';
import path from 'path';
import { FOOTER_HTML, navify, deliverify, quoteFormHtml } from './site-chrome.mjs';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const SITE = 'https://zncsolutions.com';
const LASTMOD = process.env.LASTMOD || new Date().toISOString().slice(0, 10);
const PHONE = '917-536-1245';
const TEL = '+19175361245';
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const HUB = '/event-rentals-new-jersey.html';

const BUSINESS = {
  '@type': 'LocalBusiness',
  '@id': SITE + '/#business',
  name: 'ZNC Solutions',
  url: SITE + '/',
  telephone: '+1-917-536-1245',
  email: 'info@zncsolutions.com',
  image: 'https://static.wixstatic.com/media/e06c28_bbba71eec96f4bec842418a79189b67e~mv2.jpg',
  address: { '@type': 'PostalAddress', addressLocality: 'Wayne', addressRegion: 'NJ', addressCountry: 'US' },
  areaServed: [
    { '@type': 'State', name: 'New Jersey' },
    { '@type': 'State', name: 'New York' },
    { '@type': 'State', name: 'Connecticut' }
  ]
};
const city = n => ({ '@type': 'City', name: n });
const county = n => ({ '@type': 'AdministrativeArea', name: n });

const callBtns = `<a class="btn" href="#contact">Request a Quote</a> <a class="btn btn-o" href="tel:${TEL}" data-track="call_click">Call ${PHONE}</a>`;
const linkify = a => esc(a)
  .replaceAll('917-536-1245', `<a href="tel:${TEL}" data-track="call_click">917-536-1245</a>`)
  .replaceAll('info@zncsolutions.com', '<a href="mailto:info@zncsolutions.com">info@zncsolutions.com</a>');
const section = (h2, html) => `<section class="feature"><div class="w"><h2>${h2}</h2>${html}</div></section>`;
const faqBlock = (heading, faqs) => `<section class="feature faq"><div class="w"><h2>${esc(heading)}</h2>${faqs.map(([q, a]) => `<h3>${esc(q)}</h3><p>${linkify(a)}</p>`).join('')}</div></section>`;
const contactBlock = (h2, locPh, needsPh) => `<section id="contact" class="contact"><div class="w cg"><div><h2>${esc(h2)}</h2><p><a href="mailto:info@zncsolutions.com">info@zncsolutions.com</a><br><a href="tel:${TEL}">${PHONE}</a></p><p>Delivery across NYC, NJ &amp; CT</p><p><a class="btn" href="tel:${TEL}" data-track="call_click">Call ${PHONE}</a></p></div>${quoteFormHtml(locPh, needsPh)}</div></section>`;

/* Lukasz's own job photos already used on the site (Wix media). No stock photos. */
const PHOTO_CSS = '<style>.njph{display:grid;grid-template-columns:repeat(2,1fr);gap:1rem;margin-top:1rem}.njph figure{margin:0}.njph img{display:block;width:100%;height:auto;border-radius:12px;aspect-ratio:1;object-fit:cover}@media(max-width:700px){.njph{grid-template-columns:1fr}}</style>';
const PH = {
  bar: ['e06c28_bbba71eec96f4bec842418a79189b67e~mv2.jpg', 'Wooden bar and party rental setting by ZNC Solutions', 'znc-party-rentals'],
  walls: ['e06c28_43074cfa6677487b8115be11d9908bfa~mv2.jpg', 'ZNC stationary gallery walls in an event space', 'znc-gallery-walls'],
  wallsJoined: ['e06c28_fe2f6271d2474dd88315d9e3ce490e91~mv2.png', 'ZNC modular gallery wall panels joined into a freestanding wall', 'znc-wall-panels'],
  wallsEvent: ['e06c28_8a2059f55dec4eea82cc6e43ab48fc60~mv2.png', 'ZNC gallery wall panels at an event', 'znc-event-walls']
};
const photos = (h2, keys, town) => PHOTO_CSS + `<section class="feature"><div class="w"><h2>${h2}</h2><div class="njph">` +
  keys.map(k => { const [f, alt, slug] = PH[k]; return `<figure><img src="https://static.wixstatic.com/media/${f}/v1/fit/w_800,h_800,q_80/${slug}.webp" alt="${esc(alt + (town ? ', available for ' + town + ' events' : ''))}" width="800" height="800" loading="lazy" decoding="async"></figure>`; }).join('') +
  `</div></div></section>`;

/* "More in New Jersey" link row, same on every NJ page (minus the page itself). */
const njMore = (self) => {
  const L = [[HUB, 'Event rentals in New Jersey'], ['/party-rentals-north-jersey.html', 'North Jersey party rentals'], ['/party-rentals-bergen-county-nj.html', 'Bergen County party rentals'],
    ['/party-rentals-essex-county-newark-nj.html', 'Newark and Essex County party rentals'], ['/event-rentals-wayne-nj.html', 'Wayne'], ['/party-rentals-paterson.html', 'Paterson'],
    ['/party-rentals-montclair.html', 'Montclair'], ['/party-rentals-morristown.html', 'Morristown'], ['/party-rentals-hoboken.html', 'Hoboken'], ['/party-rentals-jersey-city.html', 'Jersey City'],
    ['/gallery-walls-hoboken-jersey-city.html', 'Gallery walls in Hoboken and Jersey City']].filter(([u]) => u !== '/' + self);
  return `<section class="feature"><div class="w"><h2>More in New Jersey</h2><p>${L.map(([u, t]) => `<a href="${u}">${t}</a>`).join(' · ')}</p></div></section>`;
};

const PAGES = [];

/* ---------------- NJ hub ---------------- */
PAGES.push({
  file: 'event-rentals-new-jersey.html', hub: true,
  crumb: 'Event Rentals New Jersey',
  title: 'Event Rentals New Jersey | Tables, Chairs, Lounge & Walls',
  desc: 'Event rentals across New Jersey: tables, chairs, lounge furniture, bars, catering equipment and 4′ × 7′ wall panels. Call 917-536-1245.',
  ey: 'Passaic · Bergen · Essex · Hudson · Morris',
  h1: 'Event Rentals Across New Jersey',
  intro: 'Tables, chairs, lounge furniture, bars, catering equipment, linens and double-sided 4′ × 7′ wall panels for New Jersey weddings, galas, office parties and gallery shows. Call 917-536-1245.',
  links: [['/party-rentals-north-jersey.html', 'North Jersey'], ['/party-rentals-bergen-county-nj.html', 'Bergen County'], ['/party-rentals-essex-county-newark-nj.html', 'Newark &amp; Essex'], ['/party-rentals-jersey-city.html', 'Jersey City'], ['/party-rentals-hoboken.html', 'Hoboken'], ['/party-rentals-morristown.html', 'Morristown']],
  area: [county('Passaic County, NJ'), county('Bergen County, NJ'), county('Essex County, NJ'), county('Hudson County, NJ'), county('Morris County, NJ'), city('Wayne'), city('Paterson'), city('Newark'), city('Montclair'), city('Jersey City'), city('Hoboken'), city('Morristown')],
  locPh: 'New Jersey town or venue',
  needsPh: 'Event type, guest count and the pieces you need',
  formH2: 'Tell us about the New Jersey event.',
  faqH2: 'Event rentals in New Jersey: frequently asked questions',
  faqs: [
    ['Do you rent for events outside Wayne?', 'Yes. We deliver across New Jersey, New York City and Connecticut, with pickup after the event.'],
    ['Can I get tables, chairs and lounge furniture on one quote?', 'Yes. Send everything you need in one request and we quote it together, including linens, bars, catering equipment and wall panels.'],
    ['Which New Jersey counties do you cover most often?', 'Passaic, Bergen, Essex, Hudson and Morris Counties. If your venue is elsewhere in the state, send the town and we confirm delivery.'],
    ['How do I request availability?', 'Email info@zncsolutions.com with your date, venue and item list, call 917-536-1245, or use the quote form. We confirm availability before anything is reserved.']
  ],
  body: () =>
    section('One catalog for New Jersey events',
      `<p>ZNC Solutions rents event and party equipment to planners, venues, galleries, caterers and hosts across New Jersey, New York City and Connecticut. We are based in Wayne, NJ, and one catalog covers the pieces most New Jersey events ask for, so you can build a single quote list instead of calling several vendors for tables, seating, a bar and display walls.</p>
<p>Use this page as the starting point for the state. Each county and town page below covers the venues and questions we hear most often in that area, and every page links back here.</p>`) +
    section('What you can rent in New Jersey',
      `<ul class="specs">
<li><strong>Tables and chairs:</strong> 48″, 60″ and 72″ rounds, 24″ and 30″ cocktail tables, Chiavari and folding chairs, and barstools. See <a href="/table-chair-rentals.html">table and chair rental</a> and <a href="/chair-rental.html">chair rental</a>.</li>
<li><strong>Lounge furniture:</strong> sofas, a chaise, chairs, coffee tables, a rug and pillows for receptions, openings and weddings. See <a href="/furniture-lounge-rentals.html">lounge furniture rental</a>.</li>
<li><strong>Bars:</strong> an 8′ wooden bar, a fabric bar screen, ice tubs, shakers and coolers. See <a href="/bar-rental.html">event bar rental</a>.</li>
<li><strong>Catering equipment:</strong> chafing dishes, food pans, heat lamps, buffet risers, trays and coffee urns. See <a href="/catering-equipment-rental.html">catering equipment rental</a> and <a href="/kitchen-equipment-rentals.html">kitchen equipment rentals</a>.</li>
<li><strong>Wall panels:</strong> white, double-sided 4′ × 7′ panels, modular or freestanding, for gallery openings, pop-ups and event walls. A 20-foot run is 5 panels. See <a href="/wall-panels.html">wall panel rental</a>.</li>
<li><strong>Linens, glassware and tabletop:</strong> <a href="/linen-rentals.html">linen rentals</a>, <a href="/glassware-rental-nyc.html">glassware</a> and <a href="/tabletop-glassware-rentals.html">tabletop and glassware rentals</a>.</li>
</ul>`) +
    photos('From the ZNC catalog', ['bar', 'walls'], 'New Jersey') +
    section('Where we deliver in New Jersey',
      `<ul class="specs">
<li><strong>Passaic County:</strong> <a href="/event-rentals-wayne-nj.html">Wayne</a>, <a href="/party-rentals-paterson.html">Paterson</a>, Clifton and Little Falls. Start at <a href="/party-rentals-north-jersey.html">North Jersey party rentals</a>.</li>
<li><strong>Bergen County:</strong> Hackensack, Paramus, Teaneck, Fort Lee and Ridgewood. See <a href="/party-rentals-bergen-county-nj.html">party rentals in Bergen County</a>.</li>
<li><strong>Essex County:</strong> Newark, <a href="/party-rentals-montclair.html">Montclair</a>, Bloomfield and West Orange. See <a href="/party-rentals-essex-county-newark-nj.html">party rentals in Newark and Essex County</a>.</li>
<li><strong>Hudson County:</strong> <a href="/party-rentals-jersey-city.html">Jersey City</a> and <a href="/party-rentals-hoboken.html">Hoboken</a>, plus <a href="/gallery-walls-hoboken-jersey-city.html">gallery walls in Hoboken and Jersey City</a>.</li>
<li><strong>Morris County:</strong> <a href="/party-rentals-morristown.html">Morristown</a>, Madison and Parsippany.</li>
</ul>`) +
    section('Planning an event in New Jersey',
      `<p>Tell us the date, venue, guest count and the pieces you want. Include the load-in window and any building access rules, because delivery timing is confirmed in your quote. Weddings, corporate holiday parties, gallery openings, fundraisers and community events can all share one quote list, and a small order is welcome too: many hosts rent only a bar, a lounge grouping or a few wall panels to add to what the venue already has.</p>
<p>Banquet halls, restaurants, country clubs, houses of worship, school gyms, office lobbies, galleries, backyards and private homes each bring their own access questions. A note about stairs, a loading door or a narrow driveway helps us plan the delivery window before the day.</p>`) +
    section('New Jersey and New York City on one order',
      `<p>Many New Jersey planners also book events across the Hudson. The same catalog serves <a href="/party-rentals-nyc.html">party rentals in NYC</a>, <a href="/event-rentals-nyc.html">event rentals in NYC</a> and Connecticut towns such as <a href="/party-rentals-stamford-ct.html">Stamford</a> and <a href="/party-rentals-greenwich-ct.html">Greenwich</a>. See the <a href="/tri-state-event-rentals.html">tri-state overview</a> for the full delivery area.</p>`)
});

/* ---------------- Bergen County ---------------- */
PAGES.push({
  file: 'party-rentals-bergen-county-nj.html',
  crumb: 'Party Rentals Bergen County NJ',
  title: 'Party & Event Rentals Bergen County NJ | Tables, Chairs',
  desc: 'Party and event rentals in Bergen County, NJ: tables, Chiavari chairs, lounge furniture, bars, linens and 4′ × 7′ wall panels. Call 917-536-1245.',
  ey: 'Hackensack · Paramus · Teaneck · Fort Lee · Ridgewood',
  h1: 'Party and Event Rentals in Bergen County, NJ',
  intro: 'Tables, Chiavari chairs, lounge furniture, bars, linens and 4′ × 7′ wall panels for Bergen County receptions, fundraisers, office parties and backyard celebrations. Call 917-536-1245.',
  links: [[HUB, 'New Jersey event rentals'], ['/party-rentals-north-jersey.html', 'North Jersey'], ['/party-rentals-essex-county-newark-nj.html', 'Newark &amp; Essex'], ['/party-rentals-hoboken.html', 'Hoboken']],
  area: [county('Bergen County, NJ'), city('Hackensack'), city('Paramus'), city('Teaneck'), city('Fort Lee'), city('Ridgewood')],
  locPh: 'Bergen County town or venue',
  needsPh: 'Items, guest count and access notes',
  formH2: 'Tell us about the Bergen County event.',
  faqH2: 'Party rentals in Bergen County: frequently asked questions',
  faqs: [
    ['Do you deliver to all of Bergen County?', 'We deliver across Bergen County and the rest of North Jersey. Send your town and venue and we confirm.'],
    ['Can I rent only a few pieces?', 'Yes. Many hosts rent a bar, lounge pieces or wall panels to add to what a venue already provides.'],
    ['Do you rent linens with the tables?', 'Yes. Pick colors and textures from the linen swatch library and we quote them with the tables and chairs.'],
    ['How do I get a Bergen County quote?', 'Email info@zncsolutions.com, call 917-536-1245, or use the quote form with your date, town and guest count. We confirm availability by email before anything is reserved.']
  ],
  body: () =>
    section('Party rentals across Bergen County',
      `<p>ZNC Solutions delivers party and event rentals across Bergen County, from Hackensack and Paramus to Teaneck, Fort Lee, Ridgewood and nearby towns. We are based just west in Wayne, NJ, so Bergen events are part of our regular delivery area, and one quote can cover the tables, seating, bar, lounge and walls for the whole event.</p>`) +
    section('Event rentals Bergen County hosts ask for',
      `<ul class="specs">
<li><strong>Receptions and weddings:</strong> 60″ round tables for 8–10 guests, 72″ rounds for 10–12, Chiavari chairs in several finishes, linens, glassware and tabletop. See <a href="/table-chair-rentals.html">table and chair rental</a>, <a href="/linen-rentals.html">linen rentals</a> and <a href="/tabletop-glassware-rentals.html">tabletop and glassware</a>.</li>
<li><strong>Cocktail hours and lounges:</strong> sofas, a chaise, coffee tables, a rug and an 8′ wooden bar. See <a href="/furniture-lounge-rentals.html">lounge furniture rental</a> and <a href="/bar-rental.html">event bar rental</a>.</li>
<li><strong>Catered events and fundraisers:</strong> chafing dishes, food pans, buffet risers, trays and coffee urns. See <a href="/catering-equipment-rental.html">catering equipment rental</a>.</li>
<li><strong>Gallery shows and pop-ups:</strong> white, double-sided 4′ × 7′ wall panels, modular or freestanding. See <a href="/wall-panels.html">wall panel rental</a>.</li>
</ul>`) +
    section('Spaces we deliver to in Bergen County',
      `<p>Banquet halls, restaurants, galleries, houses of worship, school and community halls, corporate offices, backyards and private homes. Tell us the space, the entrance and the loading access, and we plan the delivery window with you. For an outdoor party, note whether the pieces will sit on grass, a patio or a tent floor so we can suggest tables and chairs that suit the ground.</p>`) +
    section('Sizing a Bergen County order',
      `<p>Start with the guest count and the style of the event. A seated dinner needs a chair for every guest and enough rounds to hold them: a 48″ round seats 6, a 60″ round seats 8–10 and a 72″ round seats 10–12. A standing reception works better with 24″ cocktail tables for 2–3 guests or 30″ tables for 3–5, plus a few barstools and a lounge corner for guests who want to sit. If you are unsure, send the head count and the room size and we suggest a list.</p>`) +
    section('How to get a quote',
      `<p>Send the event date, town, guest count and the pieces you need to info@zncsolutions.com, or use the form below. We confirm availability by email before anything is reserved. Planning across the river too? The same catalog covers <a href="/party-rentals-nyc.html">party rentals in NYC</a>.</p>`) +
    section('Nearby counties',
      `<p>Bergen County events often share guests and vendors with neighboring counties. See <a href="/party-rentals-north-jersey.html">Passaic County and North Jersey</a>, <a href="/party-rentals-essex-county-newark-nj.html">Newark and Essex County</a>, <a href="/party-rentals-hoboken.html">Hoboken</a> and <a href="/party-rentals-jersey-city.html">Jersey City</a> in Hudson County, or go back to <a href="${HUB}">event rentals in New Jersey</a> for the full state.</p>`)
});

/* ---------------- Essex County & Newark ---------------- */
PAGES.push({
  file: 'party-rentals-essex-county-newark-nj.html',
  crumb: 'Party Rentals Newark & Essex County NJ',
  title: 'Party Rentals Newark & Essex County NJ | Tables & Chairs',
  desc: 'Party and event rentals in Newark and Essex County, NJ: tables, chairs, lounge furniture, bars, catering equipment and wall panels. Call 917-536-1245.',
  ey: 'Newark · Montclair · Bloomfield · West Orange',
  h1: 'Party and Event Rentals in Newark and Essex County, NJ',
  intro: 'Tables, chairs, lounge furniture, bars, catering equipment and 4′ × 7′ wall panels for Newark and Essex County banquets, receptions, exhibits and holiday parties. Call 917-536-1245.',
  links: [[HUB, 'New Jersey event rentals'], ['/party-rentals-montclair.html', 'Montclair'], ['/party-rentals-north-jersey.html', 'North Jersey'], ['/party-rentals-bergen-county-nj.html', 'Bergen County']],
  area: [county('Essex County, NJ'), city('Newark'), city('Montclair'), city('Bloomfield'), city('West Orange')],
  locPh: 'Essex County town or venue',
  needsPh: 'Items, guest count and loading access',
  formH2: 'Tell us about the Essex County event.',
  faqH2: 'Party rentals in Newark and Essex County: frequently asked questions',
  faqs: [
    ['Do you deliver to Newark?', 'Yes. Send the venue name and the loading access with your request and we confirm the delivery window in your quote.'],
    ['Can you handle a small gallery or pop-up?', 'Yes. Wall panels come in 4′ × 7′ units, so you can start with a few panels and add more as the show grows.'],
    ['Can tables, chairs and catering equipment come on one order?', 'Yes. Tables, seating, linens, chafing dishes and coffee urns are quoted together in one reply.'],
    ['Where else do you deliver in New Jersey?', 'Across Passaic, Bergen, Hudson and Morris Counties too. See our New Jersey event rentals page for every area.']
  ],
  body: () =>
    section('Party rentals across Essex County',
      `<p>ZNC Solutions delivers party and event rentals across Essex County, including Newark, Montclair, Bloomfield, West Orange and nearby towns. We are based in Wayne, NJ, and the same catalog serves hosts, planners, venues and galleries on both sides of the Passaic River, from a downtown Newark office reception to a backyard graduation in the suburbs.</p>`) +
    section('What Essex County events rent from us',
      `<ul class="specs">
<li><strong>Tables and chairs</strong> for banquets and receptions: rounds in 48″, 60″ and 72″, cocktail tables, Chiavari and folding chairs. See <a href="/table-chair-rentals.html">table and chair rental</a>.</li>
<li><strong>Lounge furniture and bars</strong> for corporate receptions and holiday parties. See <a href="/furniture-lounge-rentals.html">lounge furniture rental</a> and <a href="/bar-rental.html">event bar rental</a>.</li>
<li><strong>Catering equipment</strong> for community and nonprofit events: chafing dishes, food pans, buffet risers and coffee urns. See <a href="/catering-equipment-rental.html">catering equipment rental</a>.</li>
<li><strong>Wall panels</strong> for exhibits, pop-ups and art shows in Newark and Montclair: white, double-sided 4′ × 7′ panels. See <a href="/wall-panels.html">wall panel rental</a>.</li>
</ul>`) +
    photos('Wall panels and event pieces from our catalog', ['wallsJoined', 'bar'], 'Essex County') +
    section('Newark offices, halls and arts spaces',
      `<p>Newark events range from office receptions and nonprofit galas to cultural events, campus programs and community celebrations. Larger buildings usually set a loading dock or freight elevator window, while halls and houses of worship may have a side entrance or a few steps at the door. Tell us the access details and we plan delivery and pickup around them.</p>`) +
    section('Montclair and beyond',
      `<p>Montclair has its own page: <a href="/party-rentals-montclair.html">party rentals in Montclair</a>. For Newark, the Oranges, Bloomfield, Nutley, Livingston and the rest of the county, send your town and venue and we confirm delivery. Gallery and exhibit organizers can also see <a href="/portable-gallery-walls.html">portable gallery walls</a> for a quick overview of the panel system.</p>`) +
    section('Nearby areas',
      `<p>Essex County shares borders with Passaic, Bergen and Hudson Counties. See <a href="/party-rentals-north-jersey.html">North Jersey party rentals</a>, <a href="/party-rentals-bergen-county-nj.html">Bergen County party rentals</a> and <a href="/party-rentals-jersey-city.html">party rentals in Jersey City</a>, or return to <a href="${HUB}">event rentals in New Jersey</a>.</p>`)
});

/* ---------------- North Jersey ---------------- */
PAGES.push({
  file: 'party-rentals-north-jersey.html',
  crumb: 'Party Rentals North Jersey',
  title: 'Party Rentals North Jersey | Passaic, Bergen & Essex | ZNC',
  desc: 'Party rentals across North Jersey: tables, chairs, linens, kitchen gear and 4×7 gallery walls for Passaic, Bergen, Essex, Morris and Hudson. Call 917-536-1245.',
  ey: 'Passaic · Bergen · Essex · Morris · Hudson',
  h1: 'Party Rentals North Jersey',
  intro: 'Delivered across Passaic, Bergen, Essex, Morris and Hudson Counties: tables, chairs, linens, kitchen equipment and 4×7 gallery walls for North Jersey parties. Call 917-536-1245.',
  links: [[HUB, 'New Jersey event rentals'], ['/event-rentals-wayne-nj.html', 'Wayne'], ['/party-rentals-paterson.html', 'Paterson'], ['/party-rentals-bergen-county-nj.html', 'Bergen County'], ['/party-rentals-essex-county-newark-nj.html', 'Newark &amp; Essex'], ['/party-rentals-montclair.html', 'Montclair'], ['/party-rentals-hoboken.html', 'Hoboken'], ['/party-rentals-jersey-city.html', 'Jersey City'], ['/party-rentals-morristown.html', 'Morristown']],
  area: [county('Passaic County, NJ'), county('Bergen County, NJ'), county('Essex County, NJ'), county('Morris County, NJ'), county('Hudson County, NJ'), city('Wayne'), city('Paterson'), city('Montclair'), city('Hoboken')],
  locPh: 'North Jersey town or venue',
  needsPh: 'Items, guest count and anything we should know',
  formH2: 'Tell us about the party.',
  faqH2: 'FAQ — Party Rentals North Jersey',
  faqs: [
    ['Do you rent party equipment in North Jersey?', 'Yes. We quote Wayne, Paterson, Montclair, Hoboken, Bergen County, Newark and nearby towns.'],
    ['What can I rent?', 'Tables, chairs, linens, china, glassware, kitchen equipment, bars, lounge pieces and 4×7 gallery walls.'],
    ['Which cities do you cover?', 'We have pages for Wayne, Paterson, Montclair, Hoboken, Jersey City and Morristown, plus Bergen County and Newark and Essex County. Other North Jersey venues on request.'],
    ['How do I get a quote?', 'Call 917-536-1245, email info@zncsolutions.com, or use the form below.']
  ],
  body: () =>
    section('North Jersey coverage',
      `<p>Planners in <a href="/event-rentals-wayne-nj.html">Wayne</a>, <a href="/party-rentals-paterson.html">Paterson</a>, <a href="/party-rentals-montclair.html">Montclair</a> and <a href="/party-rentals-hoboken.html">Hoboken</a> use the same catalog, so a backyard wedding in Wayne and a loft party in Hoboken share rounds, Chiavari chairs, linens and optional gallery walls. Tell us the city, guest count and load-in constraints, and we reply with a clear quote.</p>
<p>Bergen and Essex now have their own pages: <a href="/party-rentals-bergen-county-nj.html">party rentals in Bergen County</a> and <a href="/party-rentals-essex-county-newark-nj.html">party rentals in Newark and Essex County</a>. For the statewide view, see <a href="${HUB}">event rentals in New Jersey</a>.</p>`) +
    section('Tables, chairs and linens',
      `<p>Round tables come in 48″, 60″ and 72″ sizes for 6, 8–10 and 10–12 guests, and 24″ or 30″ cocktail tables cover standing receptions. Chiavari chairs come in white, gold, black, silver, transparent, natural wood and dark wood, with folding chairs for larger counts. Choose cloths from the <a href="/linen-rentals.html">linen rentals</a> swatch library and see every size on <a href="/table-chair-rentals.html">table and chair rental</a>.</p>`) +
    section('Bars, lounge and catering gear',
      `<p>An 8′ wooden bar or a custom fabric bar screen anchors a cocktail hour; add ice tubs, shakers and glassware from <a href="/bar-rental.html">event bar rental</a>. Sofas, a chaise and coffee tables from <a href="/furniture-lounge-rentals.html">lounge furniture rental</a> give guests a place to sit. Caterers can add chafing dishes, food pans and coffee urns from <a href="/catering-equipment-rental.html">catering equipment rental</a>, or ovens and proofing cabinets from <a href="/kitchen-equipment-rentals.html">kitchen equipment rentals</a>.</p>`) +
    section('Gallery walls in North Jersey',
      `<p>Double-sided 4′ × 7′ panels, modular or stationary, turn a hall, library or storefront into a temporary exhibition space. Five panels make a 20-foot run. See <a href="/wall-panels.html">wall panel rental</a> and <a href="/gallery-walls-hoboken-jersey-city.html">gallery walls in Hoboken and Jersey City</a>.</p>`) +
    section('Venues and spaces we deliver to',
      `<p>Backyards and private homes, banquet halls, country clubs, restaurants, houses of worship, school and community halls, corporate offices and galleries. Outdoor events can add propane heaters and umbrellas from the <a href="/rentals/lounge-furniture/">lounge furniture</a> catalog. When you request a quote, mention stairs, driveway width, a loading door or a freight elevator so the delivery window fits the venue.</p>`) +
    section('North Jersey by county',
      `<ul class="specs">
<li><strong>Passaic County:</strong> <a href="/event-rentals-wayne-nj.html">party rentals in Wayne</a> and <a href="/party-rentals-paterson.html">party rentals in Paterson</a>.</li>
<li><strong>Bergen County:</strong> <a href="/party-rentals-bergen-county-nj.html">Hackensack, Paramus, Teaneck, Fort Lee, Ridgewood</a> and nearby towns.</li>
<li><strong>Essex County:</strong> <a href="/party-rentals-essex-county-newark-nj.html">Newark and Essex County</a> and <a href="/party-rentals-montclair.html">party rentals in Montclair</a>.</li>
<li><strong>Morris County:</strong> <a href="/party-rentals-morristown.html">party rentals in Morristown</a>.</li>
<li><strong>Hudson County:</strong> <a href="/party-rentals-hoboken.html">Hoboken</a> and <a href="/party-rentals-jersey-city.html">Jersey City</a>.</li>
</ul>`) +
    section('Into New York City and Connecticut',
      `<p>The same catalog serves <a href="/party-rentals-nyc.html">party rentals in NYC</a> and <a href="/event-rentals-nyc.html">event rentals in NYC</a>, plus Stamford and Greenwich in Connecticut. See the <a href="/tri-state-event-rentals.html">tri-state overview</a>.</p>`)
});

/* ---------------- Wayne ---------------- */
PAGES.push({
  file: 'event-rentals-wayne-nj.html',
  crumb: 'Party Rentals Wayne NJ',
  title: 'Party Rentals Wayne NJ | Tables, Chairs & Gallery Walls',
  desc: 'Party rentals in Wayne, NJ: round and cocktail tables, Chiavari and folding chairs, linens, glassware and 4×7 gallery walls. Call 917-536-1245.',
  ey: 'Wayne · Passaic County · North Jersey',
  h1: 'Party Rentals in Wayne, NJ',
  intro: 'Tables, chairs, linens, glassware, bars and 4×7 gallery walls for Wayne backyard parties, showers, graduations, office events and receptions. No public street address—quotes by phone or email. Call 917-536-1245.',
  links: [[HUB, 'New Jersey event rentals'], ['/party-rentals-north-jersey.html', 'North Jersey'], ['/party-rentals-paterson.html', 'Paterson'], ['/party-rentals-montclair.html', 'Montclair'], ['/party-rentals-bergen-county-nj.html', 'Bergen County']],
  area: [city('Wayne'), county('Passaic County, NJ')],
  locPh: 'Wayne venue or neighborhood',
  needsPh: 'Items, guest count and anything we should know',
  formH2: 'Tell us about the Wayne party.',
  faqH2: 'Party rentals in Wayne: frequently asked questions',
  faqs: [
    ['Do you deliver party rentals in Wayne, NJ?', 'Yes. We deliver to homes, halls and venues across Wayne and the rest of Passaic County, with pickup after the event.'],
    ['Can I pick up in person?', 'There is no public street address or storefront. Quotes are handled by phone and email, and orders are delivered.'],
    ['What do Wayne backyard parties usually rent?', 'Round or cocktail tables, Chiavari or folding chairs, linens, a bar with ice tubs, and a propane heater or umbrella for the patio.'],
    ['How do I get a Wayne quote?', 'Call 917-536-1245, email info@zncsolutions.com, or use the quote form with your date, venue and guest count.']
  ],
  body: () =>
    section('Party rentals in Wayne',
      `<p>Wayne is our home town in Passaic County, and Wayne events are quoted from the same catalog that serves the rest of New Jersey, New York City and Connecticut. There is no public street address; quotes are handled by phone and email, and every order is delivered and picked up.</p>`) +
    section('What Wayne planners rent',
      `<p>Round tables in 48″, 60″ and 72″ sizes seat 6, 8–10 and 10–12 guests; 24″ and 30″ cocktail tables handle standing receptions. Chiavari chairs come in white, gold, black, silver, transparent, natural wood and dark wood. See <a href="/table-chair-rentals.html">table and chair rental</a>, <a href="/linen-rentals.html">linens</a>, <a href="/tabletop-glassware-rentals.html">tabletop and glassware</a> and <a href="/furniture-lounge-rentals.html">lounge furniture rental</a>.</p>`) +
    section('Backyards, halls and venues',
      `<p>Backyard parties, banquet rooms and community halls each have different needs, so tell us the guest count, the space and whether the event is indoors or outdoors. Outdoor events can add a propane heater or umbrella from the <a href="/rentals/lounge-furniture/">lounge furniture</a> catalog. Lakeside homes, clubhouses, houses of worship, school gyms and office parks around town all have their own access, so mention the driveway, the door and any steps.</p>`) +
    section('Bars and catering equipment',
      `<p>For a graduation or holiday party, an 8′ wooden bar with ice tubs and glassware gives guests one place to gather. See <a href="/bar-rental.html">event bar rental</a>. If a caterer or family cook is serving buffet style, add chafing dishes, food pans, buffet risers and coffee urns from <a href="/catering-equipment-rental.html">catering equipment rental</a>.</p>`) +
    section('Gallery walls for Wayne shows and events',
      `<p>School art shows, library exhibits, photo walls and community displays use our white, double-sided 4′ × 7′ panels. Five panels make a 20-foot run, and modular or stationary panels can form a straight line or a corner. See <a href="/wall-panels.html">wall panel rental</a> and <a href="/portable-gallery-walls.html">portable gallery walls</a>.</p>`) +
    section('Planning tips',
      `<p>Send the date, the guest count, a rough item list and a note about the space. If you are not sure how many tables you need, give us the head count and whether guests will sit or stand, and we suggest a list. We confirm availability by email before anything is reserved.</p>`) +
    section('Nearby towns',
      `<p>We also deliver to <a href="/party-rentals-paterson.html">Paterson</a>, <a href="/party-rentals-montclair.html">Montclair</a>, <a href="/party-rentals-morristown.html">Morristown</a>, <a href="/party-rentals-hoboken.html">Hoboken</a>, <a href="/party-rentals-bergen-county-nj.html">Bergen County</a> and the wider <a href="/party-rentals-north-jersey.html">North Jersey</a> area. For the whole state, see <a href="${HUB}">event rentals in New Jersey</a>.</p>`)
});

/* ---------------- Paterson ---------------- */
PAGES.push({
  file: 'party-rentals-paterson.html',
  crumb: 'Party Rentals Paterson NJ',
  title: 'Party Rentals Paterson NJ | Tables, Chairs & Linens | ZNC',
  desc: 'Party rentals in Paterson, NJ: round and cocktail tables, Chiavari chairs, linens, glassware and 4×7 gallery walls for Passaic County events. Call 917-536-1245.',
  ey: 'Paterson · Passaic County · North Jersey',
  h1: 'Party Rentals Paterson, NJ',
  intro: 'Tables, chairs, linens, kitchen gear and 4×7 walls for Paterson receptions, milestone birthdays, community gatherings and corporate events. Call 917-536-1245.',
  links: [[HUB, 'New Jersey event rentals'], ['/party-rentals-north-jersey.html', 'North Jersey'], ['/event-rentals-wayne-nj.html', 'Wayne'], ['/party-rentals-montclair.html', 'Montclair'], ['/party-rentals-bergen-county-nj.html', 'Bergen County']],
  area: [city('Paterson'), county('Passaic County, NJ')],
  locPh: 'Paterson venue or neighborhood',
  needsPh: 'Items, guest count and anything we should know',
  formH2: 'Tell us about the Paterson event.',
  faqH2: 'Frequently asked questions',
  faqs: [
    ['Do you deliver party rentals to Paterson, NJ?', 'Yes. ZNC Solutions delivers to Paterson and nearby Passaic County towns, with pickup after the event.'],
    ['What can I rent for a Paterson party?', 'Tables, Chiavari and folding chairs, linens, china, glassware, silverware, bars, lounge furniture, kitchen equipment and 4×7 gallery walls.'],
    ['Can I rent gallery walls in Paterson?', 'Yes. Modular or stationary 4×7 panels are quoted for Paterson and the rest of North Jersey.'],
    ['How do I get a Paterson quote?', 'Call 917-536-1245, email info@zncsolutions.com, or use the quote form with your date, venue and guest count.']
  ],
  body: () =>
    section('Party rentals for Paterson events',
      `<p>Paterson is the Passaic County seat, in the same county as our home town of Wayne, NJ, so Paterson events are part of our regular North Jersey delivery area. Whether you are planning a reception, a milestone birthday, a community gathering or a corporate event, one order can cover tables, seating, linens, tabletop and bar equipment.</p>`) +
    section('Tables and seating',
      `<p>Round tables come in 48″, 60″ and 72″ sizes, seating 6, 8–10 and 10–12 guests. Add 24″ or 30″ cocktail tables for standing areas, and choose Chiavari chairs in white, gold, black, silver, transparent, natural wood or dark wood, or folding chairs for larger headcounts. See all <a href="/table-chair-rentals.html">table and chair rentals</a> or the <a href="/rentals/chairs-barstools/">chairs and barstools</a> catalog.</p>`) +
    section('Tabletop, bars and kitchen gear',
      `<p>Build the table with <a href="/tabletop-glassware-rentals.html">tabletop and glassware</a>, then add an 8′ wooden bar or a custom fabric bar screen from <a href="/bar-rental.html">event bar rental</a>. Caterers working a Paterson event can add <a href="/catering-equipment-rental.html">catering equipment rental</a> such as chafing dishes and coffee urns, or <a href="/kitchen-equipment-rentals.html">kitchen equipment</a> such as ovens, proofing cabinets and baker racks.</p>`) +
    section('Gallery walls and display',
      `<p>The same 4′ × 7′ modular panels used in New York galleries are available for exhibitions, community displays and photo walls. A 20-foot run uses five panels, and each panel is double-sided. See <a href="/wall-panels.html">wall panel rental</a> for details.</p>`) +
    section('Venues and spaces we deliver to in Paterson',
      `<p>Banquet halls, restaurants, houses of worship, cultural and community centers, school gyms, offices, backyards and private homes. Many Paterson venues sit on busy streets with limited curb space, so tell us where a truck can stop, which entrance to use and whether there are stairs. If the event runs late, include the latest pickup time the venue allows.</p>`) +
    section('Delivery windows and timing',
      `<p>Delivery timing is confirmed in your quote. Send the event date, the earliest drop-off and the latest pickup your venue allows. For weekend events, book early so the pieces you want are reserved; we confirm availability by email before anything is held.</p>`) +
    section('Nearby towns we also deliver to',
      `<p>Paterson planners often compare options across the area. We deliver to <a href="/event-rentals-wayne-nj.html">Wayne</a>, <a href="/party-rentals-montclair.html">Montclair</a>, <a href="/party-rentals-bergen-county-nj.html">Bergen County</a>, <a href="/party-rentals-essex-county-newark-nj.html">Newark and Essex County</a> and the wider <a href="/party-rentals-north-jersey.html">North Jersey</a> area, and into <a href="/party-rentals-nyc.html">New York City</a> and Connecticut too. Start at <a href="${HUB}">event rentals in New Jersey</a> for the full list.</p>`)
});

/* ---------------- Montclair ---------------- */
PAGES.push({
  file: 'party-rentals-montclair.html',
  crumb: 'Party Rentals Montclair NJ',
  title: 'Party Rentals Montclair NJ | Tables, Chairs & Linens | ZNC',
  desc: 'Party rentals in Montclair, NJ: tables, Chiavari chairs, linens, tabletop, bars and 4×7 gallery walls in one delivery. Call 917-536-1245.',
  ey: 'Montclair · Essex County · North Jersey',
  h1: 'Party Rentals Montclair, NJ',
  intro: 'Montclair events often need tables, Chiavari chairs and linens in one delivery. ZNC delivers across Essex County, North Jersey and into NYC. Call 917-536-1245.',
  links: [[HUB, 'New Jersey event rentals'], ['/party-rentals-essex-county-newark-nj.html', 'Newark &amp; Essex'], ['/party-rentals-north-jersey.html', 'North Jersey'], ['/event-rentals-wayne-nj.html', 'Wayne'], ['/party-rentals-hoboken.html', 'Hoboken']],
  area: [city('Montclair'), county('Essex County, NJ')],
  locPh: 'Montclair venue or neighborhood',
  needsPh: 'Items, guest count and anything we should know',
  formH2: 'Tell us about the Montclair event.',
  faqH2: 'Frequently asked questions',
  faqs: [
    ['Do you deliver party rentals to Montclair, NJ?', 'Yes. ZNC Solutions delivers to Montclair and nearby Essex County towns.'],
    ['Can I get tables, chairs and linens in one order?', 'Yes. Linens are quoted with the tables and chairs, so everything is confirmed in one reply.'],
    ['Do you rent gallery walls in Montclair?', 'Yes. The same 4×7 modular or stationary panels we deliver to NYC galleries are available for Montclair shows and events.'],
    ['Can you supply outdoor seating or heaters?', 'The lounge furniture catalog includes a propane outdoor heater, an outdoor umbrella, an umbrella stand and a 5-piece outdoor set.'],
    ['How do I get a Montclair quote?', 'Call 917-536-1245, email info@zncsolutions.com, or use the quote form with your date, venue and guest count.']
  ],
  body: () =>
    section('Party rentals for Montclair events',
      `<p>Montclair is in Essex County, a short drive from our home town of Wayne in Passaic County. Montclair events usually want tables, chairs and linens that arrive together, so we quote them as one order: seating, table linens, tabletop, bar equipment and optional gallery walls.</p>`) +
    section('Dinners, receptions and open houses',
      `<p>For seated dinners, pair 60″ rounds (8–10 guests) or 72″ rounds (10–12 guests) with Chiavari chairs in the finish that suits your linens. For standing receptions and open houses, 24″ and 30″ cocktail tables with barstools keep guests mingling. Browse <a href="/table-chair-rentals.html">table and chair rental</a> and choose <a href="/linen-rentals.html">linens</a> from the swatch library.</p>`) +
    section('Backyards, galleries and community spaces',
      `<p>For shows, fundraisers and open studios, our 4′ × 7′ <a href="/wall-panels.html">wall panels</a> give you temporary hanging walls. Add <a href="/furniture-lounge-rentals.html">lounge furniture rental</a> to build a seating area around the walls, and an 8′ wooden bar from <a href="/bar-rental.html">event bar rental</a> for the opening night.</p>`) +
    section('Venues and spaces we deliver to in Montclair',
      `<p>Private homes and backyards, restaurants, galleries and arts spaces, houses of worship, school and college halls, community rooms and offices. Many Montclair homes have steep driveways or front steps, and downtown spaces may have tight curbside parking, so describe the approach when you request a quote.</p>`) +
    section('Plan the details',
      `<p>When you request a quote, share the guest count, the date, whether the event is indoors or outdoors, and any load-in notes such as stairs or parking. If the party is outside, propane heaters and umbrellas are in the <a href="/rentals/lounge-furniture/">lounge furniture</a> catalog. Caterers can add chafing dishes and coffee urns from <a href="/catering-equipment-rental.html">catering equipment rental</a>.</p>`) +
    section('More Essex County and North Jersey towns',
      `<p>See <a href="/party-rentals-essex-county-newark-nj.html">party rentals in Newark and Essex County</a> for Bloomfield, West Orange and the rest of the county. We also deliver to <a href="/event-rentals-wayne-nj.html">Wayne</a>, <a href="/party-rentals-paterson.html">Paterson</a>, <a href="/party-rentals-morristown.html">Morristown</a>, <a href="/party-rentals-hoboken.html">Hoboken</a> and <a href="/party-rentals-jersey-city.html">Jersey City</a>. See the <a href="/party-rentals-north-jersey.html">North Jersey overview</a> or <a href="${HUB}">event rentals in New Jersey</a>.</p>`)
});

/* ---------------- Hoboken ---------------- */
PAGES.push({
  file: 'party-rentals-hoboken.html',
  crumb: 'Party Rentals Hoboken NJ',
  title: 'Party Rentals Hoboken NJ | Cocktail Tables & Chairs | ZNC',
  desc: 'Party rentals in Hoboken, NJ: cocktail high-tops, Chiavari chairs, linens, barware and glassware for lofts and rooftops. Call 917-536-1245.',
  ey: 'Hoboken · Hudson County',
  h1: 'Party Rentals Hoboken, NJ',
  intro: 'Hoboken lofts and rooftops often need cocktail tables, Chiavari chairs, linens and barware sized to a tight floor plan. Delivered across Hudson County. Call 917-536-1245.',
  links: [[HUB, 'New Jersey event rentals'], ['/party-rentals-jersey-city.html', 'Jersey City'], ['/gallery-walls-hoboken-jersey-city.html', 'Hoboken gallery walls'], ['/party-rentals-nyc.html', 'NYC'], ['/party-rentals-north-jersey.html', 'North Jersey']],
  area: [city('Hoboken'), county('Hudson County, NJ')],
  locPh: 'Hoboken building or venue',
  needsPh: 'Items, guest count, floor and elevator notes',
  formH2: 'Tell us about the Hoboken party.',
  faqH2: 'Frequently asked questions',
  faqs: [
    ['Do you deliver party rentals to Hoboken, NJ?', 'Yes. ZNC Solutions delivers to Hoboken and the rest of Hudson County.'],
    ['What fits a Hoboken loft or rooftop?', 'Cocktail high-tops, barstools, Chiavari or folding chairs, linens, glassware and an 8′ wooden bar or fabric bar screen are the usual starting points.'],
    ['How many guests does a cocktail table hold?', 'A 24″ cocktail table seats 2–3 and a 30″ cocktail table seats 3–5.'],
    ['Do you cover Jersey City too?', 'Yes. See our Jersey City page; all of Hudson County is part of our delivery area.'],
    ['How do I get a Hoboken quote?', 'Call 917-536-1245, email info@zncsolutions.com, or use the quote form with your date, venue and guest count.']
  ],
  body: () =>
    section('Party rentals for Hoboken lofts and rooftops',
      `<p>Hoboken is a dense, walkable Hudson County city, and its apartments, lofts and rooftops tend to call for compact, well-planned rentals. ZNC Solutions quotes Hoboken events with furniture and tabletop sized to the floor plan you describe.</p>`) +
    section('Cocktail parties',
      `<p>For a standing party, 24″ round cocktail tables seat 2–3 and 30″ tables seat 3–5, and barstools add perches at the edge of the room. Add an 8′ wooden bar or a custom fabric bar screen from <a href="/bar-rental.html">event bar rental</a>, then <a href="/rentals/barware/">barware</a> and <a href="/rentals/glassware/">glassware</a> from the same order.</p>`) +
    section('Seated dinners and small receptions',
      `<p>For smaller seated groups, a 48″ round seats 6 and a 60″ round seats 8–10. Pair them with Chiavari or folding chairs and <a href="/linen-rentals.html">linens</a> in colors and textures from the swatch library. See <a href="/table-chair-rentals.html">table and chair rental</a>. For a lounge corner by the windows, add a sofa, coffee table and rug from <a href="/furniture-lounge-rentals.html">lounge furniture rental</a>.</p>`) +
    section('Venues and spaces we deliver to in Hoboken',
      `<p>Apartment rooftops and amenity lounges, lofts, restaurants and private dining rooms, galleries, offices and brownstone backyards. Each has its own rules, from elevator reservations to quiet hours, so include them with the request.</p>`) +
    section('Building access and load-in',
      `<p>Many Hoboken buildings have elevators, stairs or street-parking limits. When you request a quote, tell us the building rules, floor and elevator access so delivery and pickup can be planned around them. If the building needs a vendor list or a delivery window booked with the doorman, send those details too.</p>`) +
    section('Gallery walls and pop-ups',
      `<p>For exhibitions, pop-ups and photo walls, our double-sided 4′ × 7′ panels stand on their own without touching the building's walls. See <a href="/gallery-walls-hoboken-jersey-city.html">gallery walls in Hoboken and Jersey City</a> and <a href="/wall-panels.html">wall panel rental</a>.</p>`) +
    section('Nearby',
      `<p>Hoboken events often share a guest list with <a href="/party-rentals-jersey-city.html">Jersey City</a> and <a href="/party-rentals-nyc.html">New York City</a>; Manhattan hosts can also see <a href="/party-rentals-manhattan.html">party rentals in Manhattan</a>. More areas: <a href="/party-rentals-bergen-county-nj.html">Bergen County</a>, <a href="/party-rentals-north-jersey.html">North Jersey</a>, <a href="/party-rentals-montclair.html">Montclair</a> and the full <a href="${HUB}">New Jersey event rentals</a> page.</p>`)
});

/* ---------------- Jersey City ---------------- */
PAGES.push({
  file: 'party-rentals-jersey-city.html',
  crumb: 'Party Rentals Jersey City NJ',
  title: 'Party Rentals Jersey City NJ | Tables, Chairs & Bars',
  desc: 'Party rentals in Jersey City, NJ: Chiavari chairs, round and cocktail tables, linens, bars and glassware for Hudson County venues. Call 917-536-1245.',
  ey: 'Downtown · Paulus Hook · Journal Square · The Heights',
  h1: 'Party Rentals in Jersey City, NJ',
  intro: 'Waterfront rooftops, brownstone backyards and converted warehouse venues in Jersey City rarely share a floor plan. ZNC Solutions quotes each one—round and cocktail tables, Chiavari or folding chairs, linens, glassware and an 8′ wooden bar sized to the space and the elevator. Call 917-536-1245.',
  links: [[HUB, 'New Jersey event rentals'], ['/party-rentals-hoboken.html', 'Hoboken party rentals'], ['/gallery-walls-hoboken-jersey-city.html', 'Gallery walls in Jersey City'], ['/table-chair-rentals.html', 'Tables &amp; chairs'], ['/linen-rentals.html', 'Linens']],
  area: [city('Jersey City'), city('Hoboken'), city('Bayonne'), county('Hudson County, NJ')],
  locPh: 'Jersey City building or venue',
  needsPh: 'Items, guest count, floor and elevator notes',
  formH2: 'Request a quote.',
  faqH2: 'FAQ — Party rentals Jersey City',
  faqs: [
    ['Do you deliver party rentals to Jersey City?', 'Yes. ZNC Solutions delivers to Jersey City neighborhoods including Downtown, Paulus Hook, The Heights and Journal Square, plus nearby Hoboken and Bayonne.'],
    ['Can you handle high-rise or rooftop deliveries?', "Yes. Share the building's freight elevator hours and loading rules with your quote request and we schedule delivery and pickup to fit."],
    ['What is popular for Jersey City cocktail parties?', 'Round cocktail tables in 24″ or 30″, barstools, the 8′ wooden bar with a custom fabric bar screen, glassware and ice tubs.'],
    ['Do you rent linens with the tables?', 'Yes. Pick colors and textures from our linen swatch library and we quote them with the tables and chairs.'],
    ['How do I get a Jersey City party rental quote?', 'Call 917-536-1245, email info@zncsolutions.com, or send the quote form with your date, venue and guest count.']
  ],
  body: () =>
    section('Built for Hudson County venues',
      `<p>Downtown and Paulus Hook buildings often mean freight elevators, loading-dock windows and street-parking limits. Tell us the building rules when you request a quote and we plan delivery and pickup around them. A cocktail party often pairs 30″ high-tops with a bar, barware and a coat rack with numbered check tickets, all from one order.</p>`) +
    section('Seated dinners and receptions',
      `<p>For seated events we pair 60″ rounds (8–10 guests) or 72″ rounds (10–12 guests) with white, gold, black or natural-wood Chiavari chairs. Choose linen colors from the swatch library, then add china, stemware and chafing dishes if your caterer needs them. Propane heaters and umbrellas extend rooftop season. See <a href="/table-chair-rentals.html">table and chair rental</a> and <a href="/tabletop-glassware-rentals.html">tabletop and glassware rentals</a>.</p>`) +
    section('Bars and lounge corners',
      `<p>The 8′ wooden bar with a custom fabric bar screen gives a rooftop or loft a clear service point; add ice tubs, shakers and glassware from <a href="/bar-rental.html">event bar rental</a>. A sofa, chaise and coffee table from <a href="/furniture-lounge-rentals.html">lounge furniture rental</a> turn a corner of the room into a place to sit and talk.</p>`) +
    section('Venues and spaces we deliver to in Jersey City',
      `<p>Waterfront rooftops and amenity decks, converted warehouses and lofts, restaurants, galleries and arts spaces, offices, houses of worship, community halls and brownstone backyards. Tell us the venue type, the entrance and the elevator, and the latest pickup time the building allows.</p>`) +
    section('Gallery walls for Jersey City shows',
      `<p>Studios, galleries and pop-ups around Jersey City use our white, double-sided 4′ × 7′ panels for temporary exhibitions and photo walls. Five panels make a 20-foot run. See <a href="/gallery-walls-hoboken-jersey-city.html">gallery walls in Hoboken and Jersey City</a> and <a href="/wall-panels.html">wall panel rental</a>.</p>`) +
    section('Catering equipment for Hudson County events',
      `<p>If your caterer is not bringing service equipment, add chafing dishes, food pans, buffet risers and coffee urns from <a href="/catering-equipment-rental.html">catering equipment rental</a>. They are quoted with the tables and chairs, so one reply covers the whole order.</p>`) +
    section('Nearby',
      `<p>See <a href="/party-rentals-hoboken.html">party rentals in Hoboken</a>, <a href="/party-rentals-essex-county-newark-nj.html">Newark and Essex County</a> and <a href="/party-rentals-bergen-county-nj.html">Bergen County</a>, or cross the river with <a href="/party-rentals-nyc.html">party rentals in NYC</a> and <a href="/party-rentals-manhattan.html">party rentals in Manhattan</a>. For the whole state, start at <a href="${HUB}">event rentals in New Jersey</a>.</p>`)
});

/* ---------------- Morristown ---------------- */
PAGES.push({
  file: 'party-rentals-morristown.html',
  crumb: 'Party Rentals Morristown NJ',
  title: 'Party Rentals Morristown NJ | Tables, Chairs & Linens',
  desc: 'Party rentals in Morristown and Morris County, NJ: farmhouse and round tables, Chiavari chairs, linens, kitchen gear and heaters. Call 917-536-1245.',
  ey: 'Morristown · Morris Township · Madison · Morris County',
  h1: 'Party Rentals in Morristown, NJ',
  intro: 'Farmhouse and round tables, Chiavari chairs, linens, catering kitchen equipment and outdoor heaters for backyard graduations, estate dinners and corporate events around the Green. Call 917-536-1245.',
  links: [[HUB, 'New Jersey event rentals'], ['/party-rentals-north-jersey.html', 'North Jersey'], ['/event-rentals-wayne-nj.html', 'Wayne'], ['/party-rentals-montclair.html', 'Montclair'], ['/kitchen-equipment-rentals.html', 'Kitchen equipment']],
  area: [city('Morristown'), city('Madison'), city('Parsippany'), county('Morris County, NJ')],
  locPh: 'Morris County town or venue',
  needsPh: 'Items, guest count, indoor or outdoor',
  formH2: 'Request a quote.',
  faqH2: 'FAQ — Party rentals Morristown',
  faqs: [
    ['Do you deliver party rentals to Morristown?', 'Yes. Morristown, Morris Township, Madison, Parsippany and other Morris County towns are part of our regular delivery area.'],
    ['Can I rent farmhouse tables for a backyard dinner?', 'Yes. Farmhouse tables pair well with X-back rustic chairs; tell us the guest count and we suggest how many tables you need.'],
    ['Do you rent catering kitchen equipment?', 'Yes—convection ovens, refrigeration, proofing cabinets, burners, chafing dishes, sheet pans and baker racks.'],
    ['Do you have outdoor heaters?', 'Yes. Propane outdoor heaters and outdoor umbrellas with stands are available for patios and lawns.'],
    ['How do I request a Morristown quote?', 'Call 917-536-1245, email info@zncsolutions.com, or use the quote form with date, town and guest count.']
  ],
  body: () =>
    section('Party rentals in Morris County',
      `<p>Morristown is a short drive west of our home town of Wayne, which keeps delivery windows flexible for Morris County events. One quote can cover tables, seating, linens, a bar, lounge pieces and the kitchen equipment a caterer needs on site.</p>`) +
    section('Backyard and estate parties',
      `<p>Morris County lawns suit long farmhouse tables with X-back rustic chairs, or classic 60″ rounds with Chiavari chairs. Add a lounge corner with a velvet sofa and area rug from <a href="/furniture-lounge-rentals.html">lounge furniture rental</a>, outdoor umbrellas for daytime shade and propane heaters when a fall evening turns cool. See <a href="/table-chair-rentals.html">table and chair rental</a> for every size.</p>`) +
    section('Caterer-ready kitchens',
      `<p>If your caterer is cooking on site, we rent a full-size electric convection oven, single-door refrigerator, proofing cabinet, induction burners and 8 qt. chafing dishes, quoted together with the tables so everything arrives on one truck. See <a href="/kitchen-equipment-rentals.html">kitchen equipment rentals</a> and <a href="/catering-equipment-rental.html">catering equipment rental</a>.</p>`) +
    section('Bars, linens and tabletop',
      `<p>An 8′ wooden bar with ice tubs and shakers from <a href="/bar-rental.html">event bar rental</a> gives guests a place to gather before dinner. Finish the tables with cloths from <a href="/linen-rentals.html">linen rentals</a> and china, flatware and glasses from <a href="/tabletop-glassware-rentals.html">tabletop and glassware rentals</a>.</p>`) +
    section('Venues and spaces we deliver to in Morris County',
      `<p>Backyards and estates, country clubs, historic homes and halls, houses of worship, corporate campuses, restaurants and school and community rooms. For lawn events, tell us whether pieces will sit on grass, a patio or a tent floor, how far the drop-off point is from the party area, and whether there are steps or slopes along the way.</p>`) +
    section('Gallery walls for Morris County shows',
      `<p>Library exhibits, school art shows and corporate displays use our double-sided 4′ × 7′ panels for temporary hanging walls. See <a href="/wall-panels.html">wall panel rental</a>.</p>`) +
    section('Nearby',
      `<p>We also deliver to <a href="/event-rentals-wayne-nj.html">Wayne</a>, <a href="/party-rentals-montclair.html">Montclair</a>, <a href="/party-rentals-essex-county-newark-nj.html">Newark and Essex County</a>, <a href="/party-rentals-bergen-county-nj.html">Bergen County</a> and the rest of <a href="/party-rentals-north-jersey.html">North Jersey</a>. See <a href="${HUB}">event rentals in New Jersey</a> for the full state.</p>`)
});


/* Extra unique sections per page (appended after each page's main body copy). */
const EXTRA = {
  'party-rentals-bergen-county-nj.html':
    section('Holiday and corporate events in Bergen County',
      `<p>Office holiday parties, client receptions and year-end gatherings in Bergen County often book weeks ahead, and December dates go first. A typical order pairs cocktail tables and barstools with an 8′ wooden bar, a lounge grouping near the entrance and linens that match the company colors. If the event is in an office or a showpiece lobby, send the building's delivery rules and the hours the freight entrance is open so the drop-off and pickup land inside them. See <a href="/holiday-party-rentals.html">holiday party and New Year's Eve rentals</a> for seasonal pieces.</p>`),
  'party-rentals-essex-county-newark-nj.html':
    section('Galas, holiday parties and receptions',
      `<p>Nonprofit galas, company holiday parties and milestone receptions in Essex County usually need three things on one order: seated tables with linens, a bar for the cocktail hour, and a lounge corner where guests can sit away from the dance floor. Start with 60″ or 72″ rounds and Chiavari chairs, add an 8′ wooden bar with ice tubs and glassware, then a sofa, chaise and coffee table. See <a href="/holiday-party-rentals.html">holiday party and New Year's Eve rentals</a> for the season's most requested pieces.</p>`) +
    section('Community, school and faith events',
      `<p>Church halls, school cafeterias, community centers and cultural organizations across the county host dinners, fundraisers and celebrations that need simple, sturdy equipment in larger quantities. Folding chairs and 60″ rounds cover the seating, and chafing dishes, food pans and coffee urns cover a potluck or catered buffet. Tell us the head count and the hall's entrance and we suggest a list that fits.</p>`),
  'party-rentals-north-jersey.html':
    section('How a North Jersey quote works',
      `<p>Send the date, town, venue type, guest count and a first list of pieces by email or through the form. We reply with availability and a written quote that lists every item, plus the delivery window we can offer for your venue. Changes are easy before the event: add chairs, swap a linen color or drop a piece, and we update the quote. Nothing is reserved until you confirm, and pickup is scheduled after the event ends.</p>`),
  'event-rentals-wayne-nj.html':
    section('Seasonal events around Wayne',
      `<p>Spring brings showers, communions and graduation parties; summer is for backyard birthdays and block parties; fall fills up with fundraisers and school events; and December is office and family holiday parties. Each season has its own favorites: umbrellas and cocktail tables in summer, propane heaters for fall evenings, and bars, lounge seating and linens for holiday gatherings. Book early for June and December weekends, when the most popular pieces go first, and send your list as soon as the date is set. See <a href="/holiday-party-rentals.html">holiday party and New Year's Eve rentals</a>.</p>`),
  'party-rentals-paterson.html':
    section('Community and cultural celebrations',
      `<p>Paterson's community groups, congregations and families host christenings, quinceañeras, anniversaries, cultural festivals and holiday dinners that often run large. Folding chairs and 60″ or 72″ rounds handle the seating, linens dress the tables, and chafing dishes and food pans keep a buffet warm through a long evening. For a dessert or gift table, add a cocktail table or two near the entrance. Send the head count and we suggest quantities. If the celebration has a program or a first dance, tell us where the open floor needs to be so the table layout leaves room for it, and whether a lounge corner for older guests would help.</p>`),
  'party-rentals-montclair.html':
    section('Arts events and open studios',
      `<p>Montclair's arts calendar brings gallery openings, open studios, school art shows and pop-up markets. Double-sided 4′ × 7′ panels give artists hanging surface on both faces, so a short run in the middle of a room doubles the display space. Pair them with cocktail tables, a small bar and a lounge grouping for the opening reception. See <a href="/portable-gallery-walls.html">portable gallery walls</a> for how the panels connect, and send the room size so we can suggest a panel count.</p>`) +
    section('Holiday and family gatherings',
      `<p>Family dinners, engagement parties and December open houses in Montclair homes often need a few extra tables and chairs, a set of linens and enough glassware for a toast. A 60″ round with Chiavari chairs fits most dining rooms, and a cocktail table near the kitchen gives guests somewhere to set a drink. See <a href="/holiday-party-rentals.html">holiday party and New Year's Eve rentals</a>.</p>`),
  'party-rentals-hoboken.html':
    section('Planning for small spaces',
      `<p>In a Hoboken apartment or loft, every piece has to earn its floor space. Measure the room and the path from the elevator to the door, then plan one cocktail table for every six to eight standing guests, a few barstools along the wall and one service point for drinks. Leave a clear walkway to the kitchen and the exit. If the party moves to a rooftop, ask the building whether furniture can stay up there through the evening and when it must come down.</p>`) +
    section('Holiday parties in Hoboken',
      `<p>December brings office parties in private dining rooms and holiday gatherings in apartment amenity lounges. A bar, cocktail tables, linens and glassware cover most of them. See <a href="/holiday-party-rentals.html">holiday party and New Year's Eve rentals</a> for seasonal pieces and book early for weekend dates.</p>`),
  'party-rentals-jersey-city.html':
    section('Office and holiday events in Jersey City',
      `<p>Waterfront office towers and coworking floors host client receptions, team celebrations and year-end parties. A typical order is cocktail tables with linens, a bar, glassware and a lounge corner for guests who want to sit. Send the building's vendor rules, the loading dock hours and the floor, and we plan delivery and pickup within them. See <a href="/holiday-party-rentals.html">holiday party and New Year's Eve rentals</a>.</p>`),
  'party-rentals-morristown.html':
    section('Corporate and holiday events',
      `<p>Corporate campuses and offices around Morristown and Parsippany host client dinners, team celebrations and holiday parties. Rounds with Chiavari chairs and linens handle a seated dinner, while cocktail tables, an 8′ wooden bar and a lounge grouping suit a standing reception. Send the building's delivery hours and loading rules, and we schedule drop-off and pickup inside them. See <a href="/holiday-party-rentals.html">holiday party and New Year's Eve rentals</a>.</p>`) +
    section('Planning for the weather',
      `<p>Outdoor events in Morris County can swing from warm afternoons to cool evenings. Umbrellas with stands give shade at midday, propane heaters keep a patio comfortable after sunset, and a backup indoor room plan keeps the event on track if rain moves in. Tell us whether a tent is part of the plan so the tables and chairs fit its footprint.</p>`)
};

function assertMeta(P) {
  if (P.title.length > 60) throw new Error(P.file + ' title length ' + P.title.length + ': ' + P.title);
  if (P.desc.length < 120 || P.desc.length > 160) throw new Error(P.file + ' desc length ' + P.desc.length + ': ' + P.desc);
}
function visibleText(html) {
  return html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<form[\s\S]*?<\/form>/gi, ' ')
    .replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/&#x27;/g, "'").replace(/\s+/g, ' ').trim();
}
function paragraphsOf(html) {
  const out = []; const re = /<p\b[^>]*>([\s\S]*?)<\/p>/gi; let m;
  while ((m = re.exec(html))) { const t = visibleText(m[1]).toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim(); if (t.length >= 80) out.push(t); }
  return out;
}
function bannedHits(html, file) {
  const checks = [
    [/\bshowroom\b/i, 'showroom'], [/\bwalkthrough\b/i, 'walkthrough'], [/\btours?\b/i, 'tour'], [/\bset ?up\b/i, 'setup'], [/\binstall/i, 'install'],
    [/\boverflow tables\b/i, 'overflow tables'], [/\bpipe and drape\b/i, 'pipe and drape'], [/\bflorist/i, 'florist'], [/\bCOIs?\b/, 'COI'],
    [/certificate of insurance/i, 'certificate of insurance'], [/Pricing depends/i, 'Pricing depends'], [/\bprice/i, 'price'], [/\$/, '$'],
    [/from Wayne,\s*NJ/i, 'from Wayne, NJ'], [/Wayne,\s*NJ base/i, 'Wayne, NJ base'], [/from ZNC (Solutions )?in Wayne/i, 'from ZNC in Wayne'],
    [/www\.zncsolutions/i, 'www.'], [/47 Monterey/i, '47 Monterey'], [/\bTomek\b/i, 'Tomek'], [/exhibition-wall-rental/i, 'exhibition-wall-rental'],
    [/\bbackdrop\b/i, 'backdrop'], [/"priceRange"/, 'priceRange'], [/"openingHours"/, 'openingHours'], [/"aggregateRating"/, 'aggregateRating'], [/"@type"\s*:\s*"Review"/, 'Review schema']
  ];
  const hits = checks.filter(([re]) => re.test(html)).map(([, l]) => l);
  if (hits.length) throw new Error(file + ' banned term(s): ' + hits.join(', '));
}

const HEADER = `<header><div class="w"><nav><a class="brand" href="/">ZNC SOLUTIONS</a><div class="nav"><a href="/rentals/">Rentals</a><a href="/wall-panels.html">Wall Panels</a><a href="/testimonials">Testimonials</a><a class="btn" href="/contact.html">Quote</a></div></nav></div></header>`;
const seenParas = new Map();
const counts = [];

for (const P of PAGES) {
  assertMeta(P);
  const URL = '/' + P.file;
  const body = P.body() + (EXTRA[P.file] || '') + njMore(P.file);
  const quick = `<p>${P.links.map(([u, t]) => `<a href="${u}">${t}</a>`).join(' · ')}</p>`;
  const mainInner = `<section class="hero"><div class="w"><div class="ey">${P.ey}</div><h1>${esc(P.h1)}</h1><p>${P.intro}</p><p>${callBtns}</p>${quick}</div></section>` +
    body + faqBlock(P.faqH2, P.faqs) + contactBlock(P.formH2, P.locPh, P.needsPh);
  for (const para of paragraphsOf(body)) {  /* body copy must be unique per page; FAQ answers may repeat */
    if (seenParas.has(para)) throw new Error('Reused paragraph in ' + P.file + ' (also in ' + seenParas.get(para) + '): ' + para.slice(0, 120));
    seenParas.set(para, P.file);
  }
  const crumbs = [{ name: 'Home', item: SITE + '/' }];
  if (!P.hub) crumbs.push({ name: 'Event Rentals New Jersey', item: SITE + HUB });
  crumbs.push({ name: P.crumb, item: SITE + URL });
  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      BUSINESS,
      { '@type': 'BreadcrumbList', itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: c.item })) },
      { '@type': 'WebPage', '@id': SITE + URL + '#webpage', url: SITE + URL, name: P.title, description: P.desc, isPartOf: { '@id': SITE + '/#business' } },
      { '@type': 'Service', '@id': SITE + URL + '#service', name: P.h1, url: SITE + URL, serviceType: ['Party rentals', 'Event rentals'], provider: { '@id': SITE + '/#business' }, areaServed: P.area },
      { '@type': 'FAQPage', '@id': SITE + URL + '#faq', mainEntity: P.faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) }
    ]
  };
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(P.title)}</title><meta name="description" content="${esc(P.desc)}"><link rel="canonical" href="${SITE + URL}"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><meta name="theme-color" content="#0d4a34"><meta property="og:title" content="${esc(P.title)}"><meta property="og:description" content="${esc(P.desc)}"><meta property="og:url" content="${SITE + URL}"><meta property="og:type" content="website"><link rel="stylesheet" href="/site.css"><script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script></head><body>` +
    HEADER + `<main>${mainInner}</main>` + `${FOOTER_HTML}<a class="callbar" href="tel:${TEL}">${PHONE}</a><script src="/app.js"></script></body></html>\n`;
  bannedHits(html.replace(/<footer[\s\S]*?<\/footer>/, ''), P.file);
  const words = visibleText(`<main>${mainInner}</main>`).split(/\s+/).filter(Boolean).length;
  if (words < +(process.env.MINW || 700)) throw new Error(P.file + ' too thin: ' + words + ' words (form excluded)');
  const out = deliverify(navify(html), P.file);
  fs.writeFileSync(path.join(ROOT, P.file), out);
  counts.push({ file: P.file, title: P.title.length, desc: P.desc.length, words });
  console.log('wrote', P.file, 'title', P.title.length, 'desc', P.desc.length, 'words', words);
}

/* sitemap: add new pages (before the rentals block), bump lastmod on rewritten ones */
{
  const f = path.join(ROOT, 'sitemap.xml');
  let s = fs.readFileSync(f, 'utf8');
  for (const p of PAGES) {
    const u = SITE + '/' + p.file;
    const re = new RegExp(`<url><loc>${u.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')}</loc><lastmod>[^<]*</lastmod></url>`);
    if (re.test(s)) s = s.replace(re, `<url><loc>${u}</loc><lastmod>${LASTMOD}</lastmod></url>`);
    else s = s.replace(/(<url><loc>[^<]*\/rentals\/<\/loc>)/, `<url><loc>${u}</loc><lastmod>${LASTMOD}</lastmod></url>$1`);
  }
  fs.writeFileSync(f, s);
}

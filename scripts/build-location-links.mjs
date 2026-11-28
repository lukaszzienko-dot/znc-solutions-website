#!/usr/bin/env node
/* Idempotent edits to the hand-written pages for the NYC/NJ visibility update (Nov 28, 2026):
   homepage <title>/meta only, table-chair title/H1/meta, party-rentals-nyc copy + schema, NJ links on wall panels,
   tri-state, Greenwich, Stamford and Hoboken/Jersey City gallery-wall pages. Run from the repo root:
     node scripts/build-location-links.mjs   then   node scripts/build-items.mjs
   Every edit is a guarded string replace or a marker-checked insert, so rerunning changes nothing. */
import fs from 'fs';
import path from 'path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const changed = [];
function edit(file, fn) {
  const s = read(file); const n = fn(s);
  if (n !== s) { fs.writeFileSync(path.join(ROOT, file), n); changed.push(file); }
}
/* Replace a → b; fine if already applied (b present, a absent); otherwise fail loudly. */
function rep(s, a, b, file) {
  if (s.includes(a)) return s.split(a).join(b);
  if (s.includes(b)) return s;
  throw new Error(`${file}: expected text not found: ${a.slice(0, 90)}`);
}
function insertBefore(s, anchor, marker, html, file) {
  if (s.includes(marker)) return s;
  const i = s.indexOf(anchor);
  if (i < 0) throw new Error(`${file}: anchor not found: ${anchor}`);
  return s.slice(0, i) + html + s.slice(i);
}
function headMeta(s, file, oldT, newT, oldD, newD) {
  s = rep(s, `<title>${oldT}</title>`, `<title>${newT}</title>`, file);
  s = rep(s, `content="${oldD}"`, `content="${newD}"`, file); // description + og:description (same text)
  s = rep(s, `<meta property="og:title" content="${oldT}"`, `<meta property="og:title" content="${newT}"`, file);
  return s;
}

/* 1. Homepage: <title> and meta description (plus their og: mirrors) only. Body, hero, H1 and footer untouched. */
edit('index.html', s => headMeta(s, 'index.html',
  'Party Rentals NYC | Tables, Chairs &amp; Gallery Walls | NJ &amp; CT',
  'ZNC Solutions | Event Rentals NYC, New Jersey &amp; CT',
  'Party rentals in NYC, plus New Jersey and Connecticut. Tables, chairs, linens, kitchen gear and 4′ × 7′ gallery walls. Call 917-536-1245.',
  'Event and party rentals across NYC, New Jersey and Connecticut: tables, chairs, lounge, bars, catering gear and 4′ × 7′ wall panels. Call 917-536-1245.'));

/* 2. Table & chair rentals: NYC & NJ title/H1/meta (from the unpublished nj-rank-fix-nov20 branch) + NJ/NYC link section. */
edit('table-chair-rentals.html', s => {
  const f = 'table-chair-rentals.html';
  s = headMeta(s, f,
    'Table &amp; Chair Rentals NYC | Chiavari &amp; Rounds | ZNC',
    'Table &amp; Chair Rentals NYC &amp; NJ | Chiavari &amp; Rounds | ZNC',
    'Table and chair rentals in NYC: 48″, 60″ and 72″ rounds, cocktail tables, Chiavari and folding chairs, barstools. Call 917-536-1245.',
    'Table and chair rentals in NYC and New Jersey: 48″, 60″ and 72″ rounds, cocktail tables, Chiavari and folding chairs, barstools. Call 917-536-1245.');
  s = rep(s, '<h1>Table & Chair Rentals in NYC</h1>', '<h1>Table & Chair Rentals in NYC & NJ</h1>', f);
  s = rep(s, '<a href=/party-rentals-north-jersey.html>North Jersey</a> · <a href=/furniture-lounge-rentals.html>',
    '<a href=/party-rentals-north-jersey.html>North Jersey</a> · <a href=/event-rentals-new-jersey.html>New Jersey</a> · <a href=/furniture-lounge-rentals.html>', f);
  s = insertBefore(s, '<section class="feature faq">', 'id="tc-areas"',
    `<section class="feature" id="tc-areas"><div class="w"><h2>Table and chair rental in New Jersey</h2><p>We deliver tables and chairs across Bergen, Essex, Hudson, Passaic and Morris Counties for weddings, banquets, church and school events and backyard parties. See <a href="/event-rentals-new-jersey.html">event rentals in New Jersey</a>, <a href="/party-rentals-bergen-county-nj.html">table and chair rental in Bergen County</a>, <a href="/party-rentals-essex-county-newark-nj.html">Newark and Essex County</a>, <a href="/party-rentals-jersey-city.html">Jersey City</a>, <a href="/party-rentals-hoboken.html">Hoboken</a> and <a href="/party-rentals-north-jersey.html">North Jersey</a>.</p><h2>Table and chair rental in NYC</h2><p>For lofts, galleries, offices and halls across the five boroughs, see <a href="/table-chair-rentals-manhattan.html">table and chair rental in Manhattan</a>, <a href="/table-chair-rentals-brooklyn.html">table and chair rental in Brooklyn</a>, <a href="/party-rentals-queens.html">party rentals in Queens</a>, <a href="/party-rentals-bronx.html">the Bronx</a> and <a href="/party-rentals-staten-island.html">Staten Island</a>, or the citywide <a href="/party-rentals-nyc.html">party rentals NYC</a> page.</p></div></section>`, f);
  return s;
});

/* 3. Wall panels: short New Jersey section (title, H1 and URL unchanged). */
edit('wall-panels.html', s => insertBefore(s, '<section class="feature faq">', 'id="wp-nj"',
  `<section class="feature" id="wp-nj"><div class=w><h2>Wall panel rental in New Jersey</h2><p>The same rigid, double-sided 4′ × 7′ panels go to New Jersey galleries, schools, offices and pop-ups as an event wall or temporary exhibition wall. We deliver to Hoboken and Jersey City, Newark and Essex County, Bergen County and the rest of North Jersey. See <a href="/gallery-walls-hoboken-jersey-city.html">gallery walls in Hoboken and Jersey City</a>, <a href="/party-rentals-essex-county-newark-nj.html">Newark and Essex County</a>, <a href="/party-rentals-bergen-county-nj.html">Bergen County</a> and <a href="/event-rentals-new-jersey.html">event rentals in New Jersey</a>.</p></div></section>`, 'wall-panels.html'));

/* 4. Party rentals NYC: title/meta, hero, borough links up top, category links, NJ links, venue types, schema. */
edit('party-rentals-nyc.html', s => {
  const f = 'party-rentals-nyc.html';
  s = headMeta(s, f,
    'Party Rentals NYC | Tables, Chairs, Linens &amp; Walls | ZNC',
    'Party Rentals NYC | Tables, Chairs &amp; Walls in All 5 Boroughs',
    'Party rental NYC: tables, chairs, linens, glassware, bars and gallery walls for Manhattan, Brooklyn and across NYC. Call 917-536-1245.',
    'Party rentals NYC: tables, chairs, linens, bars and 4×7 gallery walls for Manhattan, Brooklyn, Queens, the Bronx and Staten Island. Call 917-536-1245.');
  s = rep(s, '<div class="ey">Manhattan · Brooklyn · NYC boroughs</div>', '<div class="ey">Manhattan · Brooklyn · Queens · The Bronx · Staten Island</div>', f);
  s = rep(s, 'Call 917-536-1245. Brooklyn is a service area—not HQ.</p>', 'Call 917-536-1245. Delivering across all five boroughs.</p>', f);
  s = rep(s, '<p><a href="/table-chair-rentals-manhattan.html">Manhattan tables &amp; chairs</a> · <a href="/table-chair-rentals-brooklyn.html">Brooklyn tables &amp; chairs</a> · <a href="/wall-panels.html">NYC gallery walls</a></p>',
    '<p><a href="/party-rentals-manhattan.html">Manhattan</a> · <a href="/party-rentals-brooklyn.html">Brooklyn</a> · <a href="/party-rentals-queens.html">Queens</a> · <a href="/party-rentals-bronx.html">The Bronx</a> · <a href="/party-rentals-staten-island.html">Staten Island</a> · <a href="/table-chair-rentals-manhattan.html">Manhattan tables &amp; chairs</a> · <a href="/table-chair-rentals-brooklyn.html">Brooklyn tables &amp; chairs</a> · <a href="/wall-panels.html">NYC gallery walls</a></p>', f);
  s = rep(s, '<h2>Rentals NYC planners ask for most</h2><p><a href="/event-rentals-nyc.html">Event rentals NYC</a> · <a href="/glassware-rental-nyc.html">Glassware rental NYC</a> · <a href="/bar-rental.html">Bar rental</a> · <a href="/chair-rental.html">Chair rental</a> · <a href="/catering-equipment-rental.html">Catering equipment rental</a> · <a href="/linen-rentals.html">Linen rentals</a> · <a href="/rentals/">Full rental catalog</a></p>',
    '<h2>Rentals NYC planners ask for most</h2><p>Most NYC party orders start with <a href="/table-chair-rentals.html">table and chair rental</a>, then add <a href="/linen-rentals.html">linen rentals</a>, <a href="/glassware-rental-nyc.html">glassware rental NYC</a> and an <a href="/bar-rental.html">event bar rental</a>. For a lounge corner, see <a href="/furniture-lounge-rentals.html">lounge furniture rental in NYC</a>; for buffets, <a href="/catering-equipment-rental.html">catering equipment rental</a>; for art and photo walls, <a href="/wall-panels.html">wall panel rental NYC</a>. Booking for a company or brand? See <a href="/event-rentals-nyc.html">event rentals NYC</a>, or browse the <a href="/rentals/">full rental catalog</a>.</p>', f);
  s = insertBefore(s, '<section class="feature"><div class="w"><h2>Furniture and tabletop</h2>', 'id="nyc-venues"',
    `<section class="feature" id="nyc-venues"><div class="w"><h2>Private parties we deliver to</h2><p>Birthdays, engagement parties, showers, anniversaries, graduations, holiday dinners and New Year's Eve gatherings land in every kind of NYC space: apartments and rooftops, brownstone parlors and backyards, lofts and photo studios, restaurant private rooms, community halls and houses of worship. Each comes with its own access, so tell us the building type, the floor and the entrance when you ask for a quote. Small orders are welcome; many hosts rent a few cocktail tables, a bar and glassware to fill out their own space.</p></div></section>`, f);
  s = rep(s, '<h2>Beyond the city</h2><p>We also serve <a href="/party-rentals-north-jersey.html">North Jersey</a>, <a href="/party-rentals-stamford-ct.html">Stamford</a> and <a href="/party-rentals-greenwich-ct.html">Greenwich</a>, Connecticut. See the <a href="/tri-state-event-rentals.html">tri-state overview</a>.</p>',
    '<h2>Beyond the city</h2><p>Across the Hudson, we deliver to <a href="/party-rentals-jersey-city.html">party rentals in Jersey City</a>, <a href="/party-rentals-hoboken.html">party rentals in Hoboken</a>, <a href="/party-rentals-bergen-county-nj.html">Bergen County</a>, <a href="/party-rentals-essex-county-newark-nj.html">Newark and Essex County</a> and the rest of <a href="/event-rentals-new-jersey.html">event rentals in New Jersey</a>. In Connecticut, see <a href="/party-rentals-stamford-ct.html">Stamford</a> and <a href="/party-rentals-greenwich-ct.html">Greenwich</a>, or the <a href="/tri-state-event-rentals.html">tri-state overview</a>.</p>', f);
  /* FAQ: replace the "based in" question with a delivery-area one (visible + schema). */
  s = rep(s, '<h3>Is ZNC based in New York City?</h3><p>No. ZNC is based in Wayne, NJ. New York City is a service area.</p>',
    '<h3>Which boroughs do you deliver to?</h3><p>All five: Manhattan, Brooklyn, Queens, the Bronx and Staten Island, plus New Jersey and Connecticut.</p>', f);
  s = rep(s, '{"@type":"Question","name":"Is ZNC based in New York City?","acceptedAnswer":{"@type":"Answer","text":"No. ZNC is based in Wayne, NJ. New York City is a service area."}}',
    '{"@type":"Question","name":"Which boroughs do you deliver to?","acceptedAnswer":{"@type":"Answer","text":"All five: Manhattan, Brooklyn, Queens, the Bronx and Staten Island, plus New Jersey and Connecticut."}}', f);
  /* Schema: BreadcrumbList + areaServed on the Service node. */
  s = rep(s, '{"@type":"Service","name":"Party rentals NYC","url":"https://zncsolutions.com/party-rentals-nyc.html","serviceType":["party rentals NYC"],"provider":{"@id":"https://zncsolutions.com/#business"}}',
    '{"@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://zncsolutions.com/"},{"@type":"ListItem","position":2,"name":"Party Rentals NYC","item":"https://zncsolutions.com/party-rentals-nyc.html"}]},{"@type":"Service","name":"Party rentals NYC","url":"https://zncsolutions.com/party-rentals-nyc.html","serviceType":["party rentals NYC"],"provider":{"@id":"https://zncsolutions.com/#business"},"areaServed":[{"@type":"City","name":"New York"},{"@type":"AdministrativeArea","name":"Manhattan"},{"@type":"AdministrativeArea","name":"Brooklyn"},{"@type":"AdministrativeArea","name":"Queens"},{"@type":"AdministrativeArea","name":"Bronx"},{"@type":"AdministrativeArea","name":"Staten Island"}]}', f);
  return s;
});

/* 5. Tri-state overview: drop "One Wayne, NJ inventory", link the NJ hub and county pages. */
edit('tri-state-event-rentals.html', s => {
  const f = 'tri-state-event-rentals.html';
  s = rep(s, '<h2>One Wayne, NJ inventory for three states</h2>', '<h2>One catalog for three states</h2>', f);
  s = rep(s, '<h2>New Jersey</h2><p>Wayne is our home base. We quote Passaic County events such as <a href="/party-rentals-paterson.html">Paterson</a>,',
    '<h2>New Jersey</h2><p>Wayne is our home base; start with <a href="/event-rentals-new-jersey.html">event rentals in New Jersey</a> for the whole state. We quote Passaic County events such as <a href="/party-rentals-paterson.html">Paterson</a>, Bergen County events (see <a href="/party-rentals-bergen-county-nj.html">party rentals in Bergen County</a>), Newark and the rest of Essex County (see <a href="/party-rentals-essex-county-newark-nj.html">Newark and Essex County</a>),', f);
  return s;
});

/* 6. Connecticut pages: no "from our base in Wayne, NJ" wording. */
edit('party-rentals-greenwich-ct.html', s => rep(s, 'Greenwich, Old Greenwich, Cos Cob and Riverside are delivered from our base in Wayne, NJ.',
  'Greenwich, Old Greenwich, Cos Cob and Riverside are part of our regular Connecticut delivery area.', 'party-rentals-greenwich-ct.html'));
edit('party-rentals-stamford-ct.html', s => rep(s, 'We deliver to Stamford and nearby Fairfield County towns such as Darien and Norwalk from our base in Wayne, NJ.',
  'We deliver to Stamford and nearby Fairfield County towns such as Darien and Norwalk.', 'party-rentals-stamford-ct.html'));

/* 7. Hoboken & Jersey City gallery walls: alt text without "from ZNC Solutions in Wayne, NJ". */
edit('gallery-walls-hoboken-jersey-city.html', s => rep(s, 'for Hoboken and Jersey City art shows, from ZNC Solutions in Wayne, NJ"',
  'for Hoboken and Jersey City art shows, from ZNC Solutions"', 'gallery-walls-hoboken-jersey-city.html'));

console.log('changed:', changed.join(', ') || '(none)');

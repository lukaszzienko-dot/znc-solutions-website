#!/usr/bin/env node
/* Generates the Event Rentals NYC page and the five borough party-rental landings.
   Unique body copy lives in this file. Run from the repo root:
     node scripts/build-nyc-pages.mjs
   then  node scripts/build-items.mjs  (footer/nav/sitemap refresh).
   If this script or build-items.mjs rewrites vercel.json in an unrelated way, revert that file. */
import fs from 'fs';
import path from 'path';
import { FOOTER_HTML, navify, deliverify, quoteFormHtml } from './site-chrome.mjs';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const SITE = 'https://zncsolutions.com';
const LASTMOD = process.env.LASTMOD || new Date().toISOString().slice(0, 10);
const PHONE = '917-536-1245';
const TEL = '+19175361245';
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const BUSINESS = {
  '@type': 'LocalBusiness',
  '@id': SITE + '/#business',
  name: 'ZNC Solutions',
  url: SITE + '/',
  telephone: '+1-917-536-1245',
  email: 'info@zncsolutions.com',
  address: { '@type': 'PostalAddress', addressLocality: 'Wayne', addressRegion: 'NJ', addressCountry: 'US' },
  areaServed: [
    { '@type': 'City', name: 'New York' },
    { '@type': 'State', name: 'New York' },
    { '@type': 'State', name: 'New Jersey' },
    { '@type': 'State', name: 'Connecticut' }
  ]
};

const callBtns = `<a class="btn" href="#contact">Request a Quote</a> <a class="btn btn-o" href="tel:${TEL}" data-track="call_click">Call ${PHONE}</a>`;

const linkify = a => esc(a)
  .replaceAll('917-536-1245', `<a href="tel:${TEL}" data-track="call_click">917-536-1245</a>`)
  .replaceAll('info@zncsolutions.com', '<a href="mailto:info@zncsolutions.com">info@zncsolutions.com</a>');

function section(h2, html) {
  return `<section class="feature"><div class="w"><h2>${h2}</h2>${html}</div></section>`;
}

function faqBlock(heading, faqs) {
  return `<section class="feature faq"><div class="w"><h2>${esc(heading)}</h2>${faqs.map(([q, a]) => `<h3>${esc(q)}</h3><p>${linkify(a)}</p>`).join('')}</div></section>`;
}

function contactBlock(h2, locPh, needsPh) {
  return `<section id="contact" class="contact"><div class="w cg"><div><h2>${esc(h2)}</h2><p><a href="mailto:info@zncsolutions.com">info@zncsolutions.com</a><br><a href="tel:${TEL}">${PHONE}</a></p><p>Delivery across NYC, NJ &amp; CT</p><p><a class="btn" href="tel:${TEL}" data-track="call_click">Call ${PHONE}</a></p></div>${quoteFormHtml(locPh, needsPh)}</div></section>`;
}

const PAGES = [
  {
    file: 'event-rentals-nyc.html',
    crumb: 'Event Rentals NYC',
    title: 'Event Rentals NYC | Furniture, Bars, Linens & Walls | ZNC',
    desc: 'Event rentals in NYC: tables, chairs, lounge furniture, bars, linens and double-sided 4×7 gallery walls. Delivery across NYC, NJ & CT. Call 917-536-1245.',
    ey: 'Corporate · Galleries · Launches · Receptions',
    h1: 'Event Rentals NYC',
    intro: 'Tables, chairs, lounge furniture, bars, linens and double-sided 4′ × 7′ gallery walls for New York City events. Call 917-536-1245.',
    areaName: 'New York City',
    locPh: 'NYC venue or borough',
    needsPh: 'Event type, guest count and the pieces you need',
    formH2: 'Tell us about the event.',
    faqH2: 'Event rentals NYC: frequently asked questions',
    faqs: [
      ['Do you provide event rentals in NYC?', 'Yes. ZNC Solutions delivers event furniture and equipment to all five boroughs, with pickup after the event. Share your date, venue and guest count for a quote.'],
      ['What is the difference between event rentals and party rentals?', 'The catalog is the same. This page is for work events, exhibitions, launches and receptions. Social gatherings are covered on our Party Rentals NYC page.'],
      ['Which boroughs do you deliver to?', 'Manhattan, Brooklyn, Queens, the Bronx and Staten Island, plus New Jersey and Connecticut. Delivery across NYC, NJ & CT.'],
      ['What should a planner include with an NYC event quote?', 'The date, borough and venue name, guest count, the rooms or floors in use, freight elevator or loading-dock hours, and a first list of tables, chairs, bars, linens or wall panels.'],
      ['How do I request an event rental quote?', 'Call 917-536-1245, email info@zncsolutions.com, or use the event quote form on this page.']
    ],
    body: () =>
      section('Event furniture and equipment for New York City',
        `<p>ZNC Solutions supplies event rentals for New York City work and public-facing gatherings: office holiday receptions, client dinners, product launches, gallery openings, press previews and brand activations. One catalog covers seating, tables, linens, bars, lounge furniture, tabletop, glassware, catering equipment and double-sided gallery wall panels, so a producer can gather the floor plan on a single quote list.</p>
<p>This page is written for people booking an event rather than a private party. If you are planning a birthday, wedding or apartment celebration, start with <a href="/party-rentals-nyc.html">party rentals NYC</a> and the borough pages linked below.</p>`) +
      section('Tables, chairs and place settings',
        `<p>Seated dinners, award programs and conference lunches usually begin with table size. A 48″ round seats 6, a 60″ round seats 8–10 and a 72″ round seats 10–12. Cocktail tables in 24″ and 30″ diameters hold a standing reception or a registration cluster near the door. Pair them with Chiavari chairs, folding chairs or barstools from the <a href="/table-chair-rentals.html">table and chair rentals</a> and <a href="/chair-rental.html">chair rental</a> pages, or browse <a href="/rentals/tables/">all tables</a> and <a href="/rentals/chairs-barstools/">chairs and barstools</a>.</p>
<p>When the event includes a plated or buffet meal, add china, flatware and glassware from <a href="/tabletop-glassware-rentals.html">tabletop and glassware rentals</a> and <a href="/glassware-rental-nyc.html">glassware rental NYC</a>.</p>`) +
      section('Bars for receptions and openings',
        `<p>A rented bar gives guests a clear place to gather at a launch, opening night or corporate reception, including rooms that have no built-in service counter. Choose a bar and barware from <a href="/bar-rental.html">bar rental</a> or the <a href="/rentals/bars/">bars catalog</a>, then add ice tubs, tools and glassware to match the drink menu. Tight Midtown conference rooms often do well with a single compact bar; a larger loft or hall can take a longer run with more pickup points.</p>`) +
      section('Lounge furniture for waiting rooms and VIP corners',
        `<p>Lounge seating turns an empty foyer, a pre-function corridor or a quiet corner of a loft into a place where guests can talk. Sofas, a chaise, coffee tables and a rug from <a href="/furniture-lounge-rentals.html">event furniture and lounge rentals</a> or <a href="/rentals/lounge-furniture/">lounge furniture</a> work well outside a keynote room, beside a registration desk or in a sponsor lounge. Tell us the floor plan and we will help you size the grouping to the space you actually have.</p>`) +
      section('Linens for rooms that photograph',
        `<p>Hotel event floors, gallery white cubes and office conference centers each read differently on camera. <a href="/linen-rentals.html">Linen rentals</a> cover tablecloths and overlays so the tabletops match the rest of the room. Share a color direction or a photo of the space with your quote request and we will pair linens with the tables and chairs on the same list.</p>`) +
      section('Gallery walls for exhibits and brand moments',
        `<p>Temporary exhibition and brand environments use our modular or stationary wall panels, each double-sided, 4 feet wide and 7 feet tall. Five panels make a 20-foot run. See <a href="/wall-panels.html">gallery wall panels</a>, <a href="/portable-gallery-walls.html">portable gallery walls</a>, and the neighborhood pages for <a href="/gallery-walls-chelsea.html">Chelsea</a>, <a href="/gallery-walls-manhattan.html">Manhattan</a> and <a href="/gallery-walls-brooklyn.html">Brooklyn</a>.</p>`) +
      section('How NYC event load-ins usually work',
        `<p>City buildings set their own vendor rules. A Midtown office tower may require a booked freight cab and a service entrance; a Chelsea gallery may have a narrow elevator; a Brooklyn studio may load through a roll-up door from the street. When you request a quote, include the floor, the freight elevator or dock window, the earliest drop-off and the latest pickup the venue allows, and any curb or parking limits near the door. We schedule delivery and pickup around those notes. Delivery across NYC, NJ &amp; CT.</p>`) +
      section('Event rentals by borough',
        `<p>Start with the borough page that matches your venue, then add the pieces you need:</p>
<ul class="specs">
<li><a href="/party-rentals-manhattan.html">Party rentals in Manhattan</a> — lofts, galleries, offices and hotel rooms.</li>
<li><a href="/party-rentals-brooklyn.html">Party rentals in Brooklyn</a> — studios, warehouses, waterfront rooms and brownstones.</li>
<li><a href="/party-rentals-queens.html">Party rentals in Queens</a> — Long Island City, Astoria, Flushing and beyond.</li>
<li><a href="/party-rentals-bronx.html">Party rentals in the Bronx</a> — Riverdale, Fordham, halls and waterfront rooms.</li>
<li><a href="/party-rentals-staten-island.html">Party rentals on Staten Island</a> — homes, halls and waterfront venues.</li>
</ul>
<p>Holiday receptions and New Year's Eve programs are also covered on <a href="/holiday-party-rentals.html">holiday party and NYE rentals</a>. For a wider view of New Jersey and Connecticut, see the <a href="/tri-state-event-rentals.html">tri-state overview</a>.</p>`)
  },

  {
    file: 'party-rentals-manhattan.html',
    crumb: 'Party Rentals Manhattan',
    title: 'Party Rentals Manhattan | Tables, Chairs & Walls | ZNC',
    desc: 'Party rentals in Manhattan: tables, chairs, bars, lounge furniture, linens and 4×7 gallery walls for lofts, offices and galleries. Call 917-536-1245.',
    ey: 'Chelsea · Midtown · FiDi · Upper East &amp; West Sides',
    h1: 'Party Rentals in Manhattan',
    intro: 'Tables, chairs, bars, lounge furniture, linens and double-sided 4′ × 7′ gallery walls for Manhattan lofts, galleries, offices and hotel rooms. Call 917-536-1245.',
    areaName: 'Manhattan',
    locPh: 'Manhattan venue or neighborhood',
    needsPh: 'Items, guest count and building load-in notes',
    formH2: 'Tell us about the Manhattan event.',
    faqH2: 'Party rentals in Manhattan: frequently asked questions',
    faqs: [
      ['Do you deliver party rentals to Manhattan?', 'Yes. ZNC Solutions delivers to Manhattan neighborhoods including Chelsea, Midtown, the Financial District and the Upper East and West Sides, with pickup after the event.'],
      ['What should I share about a high-rise load-in?', 'Tell us the floor, the freight elevator reservation window, whether vendors must use a service entrance, and the earliest drop-off and latest pickup the building allows.'],
      ['Which tables and chairs work in a Manhattan loft?', 'Cocktail tables in 24″ or 30″ suit a standing reception. For a seated dinner, a 60″ round seats 8–10 and pairs well with Chiavari chairs. See our Manhattan tables and chairs page for sizes.'],
      ['Can I rent gallery walls in Chelsea or elsewhere in Manhattan?', 'Yes. Double-sided 4′ × 7′ panels are quoted for Chelsea, Midtown and other Manhattan galleries, pop-ups and private events.'],
      ['How do I get a Manhattan party rental quote?', 'Call 917-536-1245, email info@zncsolutions.com, or send the Manhattan form with your date, venue and guest count.']
    ],
    body: () =>
      section('Rentals for Manhattan lofts, offices and galleries',
        `<p>Manhattan events often land in spaces that were not built as ballrooms: a converted loft south of 23rd Street, a Chelsea gallery, a Midtown office floor after business hours, a Financial District boardroom, a restaurant buyout, or a brownstone parlor on the Upper East or West Side. ZNC Solutions delivers the furniture and equipment those rooms need, then picks it up when the event ends.</p>
<p>Browse <a href="/table-chair-rentals-manhattan.html">Manhattan table and chair rentals</a> and <a href="/gallery-walls-manhattan.html">Manhattan gallery walls</a> for neighborhood-specific seating and exhibition pages, or keep reading for bars, lounge, linens and walls together.</p>`) +
      section('Tables and chairs for tight Manhattan rooms',
        `<p>Floor space is the first constraint in most Manhattan venues. A standing opening in a loft or gallery usually starts with 24″ or 30″ cocktail tables and a few barstools along the wall, leaving a clear path through the middle of the room. Seated dinners in hotel event rooms and townhouse parlors more often use 60″ rounds, which seat 8–10, or 48″ rounds when the room is narrow. Chiavari chairs are a frequent pair for those tables; folding chairs are a practical choice for talks, screenings and overflow seating along a wall. See <a href="/table-chair-rentals-manhattan.html">tables and chairs in Manhattan</a>, the citywide <a href="/table-chair-rentals.html">table and chair rentals</a> page, <a href="/chair-rental.html">chair rental</a>, <a href="/rentals/tables/">all tables</a> and <a href="/rentals/chairs-barstools/">chairs and barstools</a>.</p>`) +
      section('Bars that fit loft corners and reception rooms',
        `<p>Many Manhattan lofts and galleries have no built-in bar, and a Midtown conference floor rarely does either. A rented bar, placed against a column or in an alcove, gives bartenders a defined station without blocking the main circulation. Choose from <a href="/bar-rental.html">bar rental</a> or <a href="/rentals/bars/">the bars catalog</a>, then add glassware and barware to match the menu. For a cocktail-heavy opening, plan pickup space at both ends of a longer bar so a line does not cut the room in half.</p>`) +
      section('Lounge furniture for foyers and VIP corners',
        `<p>Pre-function corridors, hotel foyers and the far end of a loft benefit from a small lounge grouping: a sofa or loveseat, a coffee table and a rug, sometimes with a chaise. Guests use these pockets during remarks, while a presentation runs in the next room, or as a quieter alternative to cocktail tables. See <a href="/furniture-lounge-rentals.html">event furniture and lounge rentals</a> and <a href="/rentals/lounge-furniture/">lounge furniture</a>. Measure the pocket you want to fill, including radiator and column clearances, and include those notes with the quote.</p>`) +
      section('Linens for hotel rooms, lofts and townhouses',
        `<p>A hotel event floor, a loft with north light and a wood-floored townhouse dining room each ask for a different tabletop finish. <a href="/linen-rentals.html">Linen rentals</a> cover cloths and overlays that we quote with the tables and chairs. Send a photo of the room or a color cue from the invitation and we will help you pick a finish that holds up in that light.</p>`) +
      section('Gallery walls in Chelsea and across Manhattan',
        `<p>Galleries, pop-ups and brand exhibits use our wall panels to build temporary hanging surface without touching the building's walls. Every panel is double-sided, 4 feet wide by 7 feet tall; five panels make a 20-foot run, which is a common length along a Chelsea gallery's long axis. Start with <a href="/gallery-walls-chelsea.html">Chelsea gallery walls</a> or <a href="/gallery-walls-manhattan.html">Manhattan gallery walls</a>, or see the full <a href="/wall-panels.html">gallery wall panels</a> and <a href="/portable-gallery-walls.html">portable gallery walls</a> pages.</p>`) +
      section('Freight elevators, service entrances and street access',
        `<p>High-rise load-ins in Midtown and the Financial District almost always run through a booked freight elevator and a service entrance, often on a tight window. Brownstones and smaller walk-ups may mean stairs and a stoop, with little or no standing time at the curb. Events near Central Park, Bryant Park or the High Line can add extra walking distance from the nearest legal unloading spot. Include the floor number, elevator hours, dock rules, and any park-path or curb notes when you request a quote so delivery and pickup can be planned around the building, not against it.</p>
<p>Delivery across NYC, NJ &amp; CT. Questions? Call <a href="tel:${TEL}" data-track="call_click">917-536-1245</a>.</p>`) +
      section('Elsewhere in the city',
        `<p>Planning across the river or in another borough? See <a href="/party-rentals-brooklyn.html">party rentals in Brooklyn</a>, <a href="/party-rentals-queens.html">Queens</a>, <a href="/party-rentals-bronx.html">the Bronx</a> and <a href="/party-rentals-staten-island.html">Staten Island</a>, or the citywide <a href="/party-rentals-nyc.html">party rentals NYC</a> and <a href="/event-rentals-nyc.html">event rentals NYC</a> pages.</p>`)
  },

  {
    file: 'party-rentals-brooklyn.html',
    crumb: 'Party Rentals Brooklyn',
    title: 'Party Rentals Brooklyn | Tables, Chairs & Walls | ZNC',
    desc: 'Party rentals in Brooklyn: tables, chairs, bars, lounge, linens and 4×7 gallery walls for warehouses, studios and brownstones. Call 917-536-1245.',
    ey: 'Williamsburg · Dumbo · Gowanus · Park Slope · Bushwick',
    h1: 'Party Rentals in Brooklyn',
    intro: 'Tables, chairs, bars, lounge furniture, linens and double-sided 4′ × 7′ gallery walls for Brooklyn studios, warehouses, brownstones and waterfront rooms. Call 917-536-1245.',
    areaName: 'Brooklyn',
    locPh: 'Brooklyn venue or neighborhood',
    needsPh: 'Items, guest count and access notes (stoop, dock or roll-up door)',
    formH2: 'Tell us about the Brooklyn event.',
    faqH2: 'Party rentals in Brooklyn: frequently asked questions',
    faqs: [
      ['Do you deliver party rentals to Brooklyn?', 'Yes. ZNC Solutions delivers to Brooklyn neighborhoods including Williamsburg, Dumbo, Gowanus, Park Slope and Bushwick, with pickup after the event. Brooklyn is a delivery area.'],
      ['How do brownstone and warehouse load-ins differ?', 'Brownstones often mean stoops, stairs and tight one-way blocks. Warehouses and studios in Gowanus or Bushwick more often load through a roll-up door or a wide bay. Share whichever applies with your quote.'],
      ['What works for a Brooklyn backyard or parlor dinner?', 'A 48″ or 60″ round with Chiavari or folding chairs suits most parlors and paved yards. Cocktail tables help at a standing welcome near the stoop or in a garden.'],
      ['Do you rent gallery walls in Brooklyn?', 'Yes. Double-sided 4′ × 7′ panels are quoted for studios, warehouses and pop-ups. See the Brooklyn gallery walls page for neighborhood detail.'],
      ['How do I get a Brooklyn party rental quote?', 'Call 917-536-1245, email info@zncsolutions.com, or send a Brooklyn quote request with your date, venue and guest count.']
    ],
    body: () =>
      section('Furniture and equipment for Brooklyn venues',
        `<p>Brooklyn parties and events spread across very different buildings: a Williamsburg loft, a Dumbo or Red Hook waterfront room, a Gowanus or Bushwick warehouse, a photo or film studio, a Park Slope, Fort Greene or Brooklyn Heights brownstone, a backyard behind a row house, or a church or cultural hall. ZNC Solutions delivers party rentals into those spaces. Brooklyn is a delivery area, not a headquarters.</p>
<p>For seating-only requests, see <a href="/table-chair-rentals-brooklyn.html">Brooklyn table and chair rentals</a>. For exhibitions, see <a href="/gallery-walls-brooklyn.html">Brooklyn gallery walls</a>.</p>`) +
      section('Tables and chairs from parlors to warehouses',
        `<p>A brownstone parlor or a paved backyard usually takes a 48″ round (6 seats) or a 60″ round (8–10 seats) more comfortably than a 72″ table, which needs a wider clear radius. Warehouses and studios can take the larger rounds or a mix of rectangular tables for family-style dinners. Cocktail tables in 24″ and 30″ work at a standing welcome in a garden, on a rooftop, or just inside a roll-up door. Chiavari chairs suit seated dinners; folding chairs are a straightforward option for ceremonies, screenings and long tables. Browse <a href="/table-chair-rentals-brooklyn.html">Brooklyn tables and chairs</a>, <a href="/table-chair-rentals.html">table and chair rentals</a>, <a href="/chair-rental.html">chair rental</a>, <a href="/rentals/tables/">all tables</a> and <a href="/rentals/chairs-barstools/">chairs and barstools</a>.</p>`) +
      section('Bars for warehouse parties and waterfront receptions',
        `<p>An open warehouse or a waterfront loft often needs a freestanding bar because there is no house counter, just a wide floor and maybe a kitchenette. Place the bar on a short wall or beside a column so the center stays open for guests and for any performance or remarks. <a href="/bar-rental.html">Bar rental</a> and <a href="/rentals/bars/">bars</a> cover the stations; add glassware from <a href="/glassware-rental-nyc.html">glassware rental NYC</a> when the drink list is more than wine and beer. On a rooftop, tell us about door width and whether the bar must split into pieces to reach the terrace.</p>`) +
      section('Lounge clusters in studios and lofts',
        `<p>Photo studios and loft living rooms lend themselves to lounge groupings: a sofa, side tables and a rug at one end of the space, leaving the shooting or dining zone clear. In a raw warehouse, the same pieces can mark a quieter corner away from the bar. See <a href="/furniture-lounge-rentals.html">event furniture and lounge rentals</a> and <a href="/rentals/lounge-furniture/">lounge furniture</a>. If the floor is unfinished concrete or painted masonry, mention that so we can plan protection under the furniture feet.</p>`) +
      section('Linens for brick, waterfront light and backyard dinners',
        `<p>Brooklyn rooms run from exposed brick and factory windows to garden string lights and formal parlor wallpaper. <a href="/linen-rentals.html">Linen rentals</a> let you set a cloth that belongs in that room rather than fighting it. We quote linens with the tables so the colors and sizes are planned together. A photo of the space, or even the brick or floor tone, is enough to start.</p>`) +
      section('Gallery walls for Brooklyn studios and pop-ups',
        `<p>Studios, pop-up shops and warehouse exhibitions in Brooklyn often need temporary hanging walls that can come down cleanly after the closing. Our panels are 4′ wide by 7′ tall and finished on both sides, so a single run can face two aisles or hold work on the front and a sponsor or title panel on the back. A 20-foot wall uses five panels. See <a href="/gallery-walls-brooklyn.html">Brooklyn gallery walls</a>, <a href="/wall-panels.html">gallery wall panels</a> and <a href="/portable-gallery-walls.html">portable gallery walls</a>.</p>`) +
      section('Stoops, cobblestones, roll-up doors and park paths',
        `<p>Access changes block by block. Dumbo's cobblestones and one-way streets affect how close a truck can get to the door. Brownstone blocks in Park Slope or Brooklyn Heights often mean a stoop, a narrow hallway and little curb time. Gowanus and Bushwick industrial buildings are usually easier, with roll-up doors or wide bays, but may still have a loading window. Events near Prospect Park or Brooklyn Bridge Park may involve a path, a pier or a field gate after the last legal unloading point. Send those details — stairs versus elevator, door width, and any park or cobblestone notes — with your date and guest count.</p>
<p>Delivery across NYC, NJ &amp; CT.</p>`) +
      section('Other NYC boroughs',
        `<p>We also deliver party rentals to <a href="/party-rentals-manhattan.html">Manhattan</a>, <a href="/party-rentals-queens.html">Queens</a>, <a href="/party-rentals-bronx.html">the Bronx</a> and <a href="/party-rentals-staten-island.html">Staten Island</a>. Citywide pages: <a href="/party-rentals-nyc.html">party rentals NYC</a> and <a href="/event-rentals-nyc.html">event rentals NYC</a>.</p>`)
  },

  {
    file: 'party-rentals-queens.html',
    crumb: 'Party Rentals Queens',
    title: 'Party Rentals Queens | Tables, Chairs & Walls | ZNC',
    desc: 'Party rentals in Queens: tables, chairs, bars, lounge, linens and 4×7 gallery walls for Long Island City, Astoria, Flushing and beyond. Call 917-536-1245.',
    ey: 'Long Island City · Astoria · Flushing · Jackson Heights · Forest Hills',
    h1: 'Party Rentals in Queens',
    intro: 'Tables, chairs, bars, lounge furniture, linens and double-sided 4′ × 7′ gallery walls for Long Island City lofts, Astoria gatherings and Flushing halls. Call 917-536-1245.',
    areaName: 'Queens',
    locPh: 'Queens venue or neighborhood',
    needsPh: 'Items, guest count and venue access notes',
    formH2: 'Tell us about the Queens event.',
    faqH2: 'Party rentals in Queens: frequently asked questions',
    faqs: [
      ['Do you deliver party rentals to Queens?', 'Yes. ZNC Solutions delivers to Queens neighborhoods including Long Island City, Astoria, Flushing, Jackson Heights and Forest Hills, with pickup after the event.'],
      ['Can you deliver to both LIC high-rises and low-rise houses?', 'Yes. A Long Island City tower usually needs a freight elevator window. A house in Astoria, Jackson Heights or Ridgewood may load from a driveway, alley or the street. Tell us which one you have.'],
      ['What do banquet halls in Flushing or Forest Hills usually rent?', 'Rounds or rectangular tables, chairs, linens and sometimes a bar and lounge grouping, especially when the hall already has a kitchen. Send the hall house inventory so we fill only the gaps.'],
      ['Do you rent wall panels in Queens?', 'Yes. Double-sided 4 ft × 7 ft panels are quoted for Long Island City studios, cultural spaces and pop-ups, and for exhibits in halls and community rooms.'],
      ['How do I get a Queens party rental quote?', 'Call 917-536-1245, email info@zncsolutions.com, or send a Queens request with your date, neighborhood and guest count.']
    ],
    body: () =>
      section('Party rentals across Queens neighborhoods',
        `<p>Queens holds several event styles on one map. Long Island City has waterfront lofts, rooftops and new residential towers. Astoria mixes restaurant buyouts, backyard gatherings and community rooms. Flushing is known for banquet halls and cultural celebrations. Jackson Heights, Sunnyside, Woodside, Ridgewood and Forest Hills add family milestones, club luncheons and house parties. ZNC Solutions delivers one catalog to all of those settings: tables, chairs, linens, bars, lounge furniture, tabletop and gallery walls.</p>`) +
      section('Tables and chairs for lofts, halls and backyards',
        `<p>A Flushing or Forest Hills banquet hall often needs a full field of 60″ or 72″ rounds, sometimes in numbers the house inventory cannot cover. A Long Island City loft or rooftop leans toward cocktail tables and a smaller seated section. An Astoria or Ridgewood backyard usually fits 48″ or 60″ rounds, with folding or Chiavari chairs that can move from a patio into the house if the weather turns. See <a href="/table-chair-rentals.html">table and chair rentals</a>, <a href="/chair-rental.html">chair rental</a>, <a href="/rentals/tables/">all tables</a> and <a href="/rentals/chairs-barstools/">chairs and barstools</a>. If the hall already owns some tables, tell us the count and size so the quote fills only the gap.</p>`) +
      section('Bars for halls, rooftops and restaurant buyouts',
        `<p>Banquet halls may already have a service counter; a rooftop in Long Island City or a restaurant buyout in Astoria often does not have a second bar for a cocktail hour. A rented station from <a href="/bar-rental.html">bar rental</a> or <a href="/rentals/bars/">bars</a> can sit in a lobby, on a terrace or in a side room so the dining floor stays clear. Add glassware when the celebration includes a toast or a full cocktail list. Mention whether the venue limits alcohol service to a particular room, so the bar is planned for that room and not moved on the day.</p>`) +
      section('Lounge furniture for lobbies and family gatherings',
        `<p>Long Island City residential buildings and hotel-style event rooms often have a lobby or pre-function area that looks unfinished until it has somewhere to sit. A compact lounge set from <a href="/furniture-lounge-rentals.html">event furniture and lounge rentals</a> or <a href="/rentals/lounge-furniture/">lounge furniture</a> gives elders and early arrivals a place to wait, and it can mark a gift or dessert table without using dining chairs. In a house or backyard party, the same pieces can turn a garage bay or a covered porch into a second seating area.</p>`) +
      section('Linens for banquet halls and at-home celebrations',
        `<p>Halls and cultural celebrations often call for a consistent cloth color across many tables; a backyard or apartment party may only need a few cloths that hide folding-table edges and match a balloon or flower palette. <a href="/linen-rentals.html">Linen rentals</a> cover both scales, and we quote them with the tables so sizes are not guessed later. If the hall has a house linen, say so and we will work around it.</p>`) +
      section('Wall panels for LIC studios and community exhibits',
        `<p>Artists, cultural groups and pop-up exhibitors in Long Island City and western Queens use temporary walls when a studio, lobby or community room has little hanging surface. Our wall panels measure 4 ft × 7 ft and are double-sided, so a short run can divide a room and show work on both faces. See <a href="/wall-panels.html">gallery wall panels</a> and <a href="/portable-gallery-walls.html">portable gallery walls</a>. If you already know the wall length, a 20-foot run is five panels.</p>`) +
      section('High-rises, banquet halls, yards and park edges',
        `<p>A Long Island City tower is a freight-elevator job, with a booked cab and a service entrance, much like a Manhattan high-rise. A house or backyard in Astoria, Jackson Heights or Ridgewood is the opposite: a driveway, an alley or a curb drop, sometimes through a side gate or a basement entrance. Banquet halls usually have a loading zone or a back door sized for catering, which makes table deliveries straightforward if we have the dock hours. Parks such as Gantry Plaza, Astoria Park and Flushing Meadows-Corona Park can host gatherings where the last stretch is a path or a field; tell us about vehicle gates, path width and whether a dolly can roll from the curb to the site. LaGuardia-area traffic is worth planning around on the calendar, so send the event start time early.</p>
<p>Delivery across NYC, NJ &amp; CT.</p>`) +
      section('The rest of New York City',
        `<p>Queens events sometimes share a guest list with <a href="/party-rentals-brooklyn.html">Brooklyn</a> or <a href="/party-rentals-manhattan.html">Manhattan</a>. We also cover <a href="/party-rentals-bronx.html">the Bronx</a> and <a href="/party-rentals-staten-island.html">Staten Island</a>. See <a href="/party-rentals-nyc.html">party rentals NYC</a> and <a href="/event-rentals-nyc.html">event rentals NYC</a> for citywide catalog pages.</p>`)
  },

  {
    file: 'party-rentals-bronx.html',
    crumb: 'Party Rentals Bronx',
    title: 'Party Rentals Bronx | Tables, Chairs & Walls | ZNC',
    desc: 'Party rentals in the Bronx: tables, chairs, bars, lounge, linens and 4×7 gallery walls for halls, homes, campuses and waterfront rooms. Call 917-536-1245.',
    ey: 'Riverdale · Fordham · Arthur Avenue · City Island · Mott Haven',
    h1: 'Party Rentals in the Bronx',
    intro: 'Tables, chairs, bars, lounge furniture, linens and double-sided 4′ × 7′ gallery walls for Bronx halls, homes, campuses and waterfront rooms. Call 917-536-1245.',
    areaName: 'the Bronx',
    locPh: 'Bronx venue or neighborhood',
    needsPh: 'Items, guest count and hall or building access notes',
    formH2: 'Tell us about the Bronx event.',
    faqH2: 'Party rentals in the Bronx: frequently asked questions',
    faqs: [
      ['Do you deliver party rentals to the Bronx?', 'Yes. ZNC Solutions delivers to Bronx neighborhoods including Riverdale, Fordham, Arthur Avenue, Mott Haven and City Island, with pickup after the event.'],
      ['Can you deliver to a community hall or a private house?', 'Yes. Halls often have a back door or a short driveway. Private houses and Riverdale apartment buildings vary between elevators, walk-ups and a curb drop. Share the entrance you want us to use.'],
      ['What is typical for a Bronx hall reception?', 'A field of 60″ rounds with chairs and linens, plus a bar if the hall does not have a fixed one. Lounge seating can fill a lobby or a quiet side room.'],
      ['Do you bring gallery walls to the Bronx?', 'Yes. Double-sided panels, 4 feet by 7 feet, are quoted for campus shows, community exhibitions and loft pop-ups in places such as Mott Haven and Port Morris.'],
      ['How do I get a Bronx party rental quote?', 'Call 917-536-1245, email info@zncsolutions.com, or fill in the Bronx form with your date, venue and guest count.']
    ],
    body: () =>
      section('Party rentals for Bronx halls, homes and waterfront rooms',
        `<p>The Bronx mixes settings that each ask for a slightly different rental list. Riverdale apartments and private homes host dinners and milestone parties in club rooms or living rooms. Fordham and University Heights add campus-adjacent receptions and student or faculty gatherings. Arthur Avenue restaurants and social clubs run seated dinners. City Island leans toward waterfront get-togethers. Mott Haven and Port Morris have lofts and studios. Community halls across the borough handle receptions and cultural celebrations. ZNC Solutions delivers tables, chairs, linens, bars, lounge furniture and gallery walls to all of them.</p>`) +
      section('Tables and chairs for halls, club rooms and houses',
        `<p>A community hall or social club is usually a 60″-round floor, sometimes with a head table on rectangular banquet tables. Club rooms in Riverdale apartment buildings are smaller and may only fit 48″ rounds or a single long table. A private house can go either way, depending on whether the meal stays indoors or moves to a backyard or driveway tent the host already has. Chiavari chairs dress a seated dinner; folding chairs are a solid match for halls and outdoor overflows onto a patio. See <a href="/table-chair-rentals.html">table and chair rentals</a>, <a href="/chair-rental.html">chair rental</a>, <a href="/rentals/tables/">all tables</a> and <a href="/rentals/chairs-barstools/">chairs and barstools</a>. Cocktail tables help in a lobby or at a hall entrance during a receiving line.</p>`) +
      section('Bars for receptions, clubs and waterfront gatherings',
        `<p>Some Bronx halls already have a built-in bar; many club rooms and waterfront rentals do not. A station from <a href="/bar-rental.html">bar rental</a> or <a href="/rentals/bars/">bars</a> can sit at the short end of a hall, on a club-room wall, or on a City Island patio if the surface is level and covered. Add glassware when the toast is more than a disposable cup service. If the venue limits where drinks can be poured, put that rule in the quote request so the bar is planned for the approved spot.</p>`) +
      section('Lounge seating for lobbies and club rooms',
        `<p>Apartment-building club rooms and hall lobbies often have a television and a few house chairs, but not enough soft seating when a family arrives early or when speeches run long. A sofa, a loveseat and a coffee table from <a href="/furniture-lounge-rentals.html">event furniture and lounge rentals</a> or <a href="/rentals/lounge-furniture/">lounge furniture</a> fill that gap without turning the room into a dining floor. In a loft in Mott Haven or Port Morris, the same grouping can anchor a conversation area away from the tables.</p>`) +
      section('Linens for hall dinners and at-home milestones',
        `<p>Hall receptions look finished when every round wears the same cloth; a house dinner may only need a few linens that match a family color or a seasonal palette. <a href="/linen-rentals.html">Linen rentals</a> are quoted with the tables so the sizes line up. If a hall provides some cloths and not others, send a count and we will complete the set rather than replace it.</p>`) +
      section('Gallery walls for campuses and community exhibits',
        `<p>Campus shows, community-center exhibits and loft pop-ups in the South Bronx need walls that can be delivered, used and taken away without altering the building. Each panel is double-sided and measures 4 feet wide by 7 feet tall, which is a comfortable height for hanging work and for a title or sponsor panel on the reverse. See <a href="/wall-panels.html">gallery wall panels</a> and <a href="/portable-gallery-walls.html">portable gallery walls</a>. Five panels make a 20-foot wall, a useful length along a hallway exhibition or a studio's long side.</p>`) +
      section('Highways, halls, houses and park gates',
        `<p>Many Bronx venues are easier to reach by highway than a Midtown tower, but the last hundred feet still decide the plan. A hall may have a back door or a short driveway and a clear schedule for vendors. A Riverdale high-rise needs elevator hours. A walk-up or a private house may load from the curb or a driveway. Park-adjacent events at Van Cortlandt Park, Bronx Park or Pelham Bay Park often depend on a vehicle gate, a paved path or a field that will not take a loaded dolly after rain — send whatever the permit or park staff has told you. City Island's tighter streets are worth a note about where a truck can stand. Include the entrance you want us to use, and the earliest and latest times the venue allows.</p>
<p>Delivery across NYC, NJ &amp; CT.</p>`) +
      section('Across the city from the Bronx',
        `<p>Guests often come from <a href="/party-rentals-manhattan.html">Manhattan</a> or <a href="/party-rentals-queens.html">Queens</a> as well. We also deliver to <a href="/party-rentals-brooklyn.html">Brooklyn</a> and <a href="/party-rentals-staten-island.html">Staten Island</a>. For a citywide starting point, use <a href="/party-rentals-nyc.html">party rentals NYC</a> or <a href="/event-rentals-nyc.html">event rentals NYC</a>.</p>`)
  },

  {
    file: 'party-rentals-staten-island.html',
    crumb: 'Party Rentals Staten Island',
    title: 'Party Rentals Staten Island | Tables, Chairs & Walls | ZNC',
    desc: 'Party rentals on Staten Island: tables, chairs, bars, lounge, linens and 4×7 gallery walls for homes, halls and waterfront venues. Call 917-536-1245.',
    ey: 'St. George · Snug Harbor · Todt Hill · South Shore',
    h1: 'Party Rentals on Staten Island',
    intro: 'Tables, chairs, bars, lounge furniture, linens and double-sided 4′ × 7′ gallery walls for Staten Island homes, halls and waterfront venues. Call 917-536-1245.',
    areaName: 'Staten Island',
    locPh: 'Staten Island venue or neighborhood',
    needsPh: 'Items, guest count and driveway, hall or gate notes',
    formH2: 'Tell us about the Staten Island event.',
    faqH2: 'Party rentals on Staten Island: frequently asked questions',
    faqs: [
      ['Do you deliver party rentals to Staten Island?', 'Yes. ZNC Solutions delivers to Staten Island, including St. George, Snug Harbor, Todt Hill and the South Shore, with pickup after the event. Deliveries arrive by truck over the bridges, not on the ferry.'],
      ['Is a backyard or driveway party easier than a city walk-up?', 'Often, yes. Many Staten Island homes have a driveway or a side yard, which simplifies unloading. Still tell us about hills, tight streets, gates and whether the party is in the backyard.'],
      ['What do church and community halls usually need?', 'Rounds or rectangular tables, chairs and linens, and a bar if the hall does not have one. Send whatever furniture the hall already provides so we do not duplicate it.'],
      ['Can I rent gallery walls for a Staten Island exhibit?', 'Yes. Double-sided 4′ × 7′ panels are quoted for cultural spaces, school or community exhibits and temporary displays at halls and waterfront rooms.'],
      ['How do I get a Staten Island party rental quote?', 'Call 917-536-1245, email info@zncsolutions.com, or send a Staten Island request with your date, neighborhood and guest count.']
    ],
    body: () =>
      section('Party rentals for Staten Island homes, halls and the waterfront',
        `<p>Staten Island events often look more like a house party or a hall reception than a high-rise loft opening. Families host backyard dinners, milestone parties and holiday gatherings at private homes from Todt Hill to the South Shore. Churches, community centers and clubhouses run receptions and luncheons. St. George and the North Shore add waterfront rooms, and Snug Harbor hosts cultural programs that need seating and, at times, temporary walls. Guests may arrive on the Staten Island Ferry; the rentals themselves travel by truck over the Verrazzano-Narrows, Goethals or Bayonne Bridge. ZNC Solutions delivers the same catalog used in the other boroughs.</p>`) +
      section('Tables and chairs for backyards, dining rooms and halls',
        `<p>A backyard or a finished basement usually takes 48″ or 60″ rounds, or rectangular tables if the host wants one long family-style board. Dining rooms in private homes may only have space for a single 48″ round plus a cocktail table in the foyer. Halls and clubhouses can take a full set of 60″ or 72″ rounds. Chiavari chairs suit a seated celebration; folding chairs are a practical choice when the same set of seats must move from a ceremony on the lawn to a dinner under a house tent the host already has. See <a href="/table-chair-rentals.html">table and chair rentals</a>, <a href="/chair-rental.html">chair rental</a>, <a href="/rentals/tables/">all tables</a> and <a href="/rentals/chairs-barstools/">chairs and barstools</a>. Cocktail tables work on a deck or at a hall entrance during arrivals.</p>`) +
      section('Bars for hall receptions and home celebrations',
        `<p>A church hall or clubhouse may have a pass-through window but no front-facing bar; a home celebration often has only a kitchen island. A rented bar from <a href="/bar-rental.html">bar rental</a> or <a href="/rentals/bars/">bars</a> gives a clear service point in a foyer, on a covered patio or at the side of a hall, and it keeps drink service out of a working kitchen. If the party is outdoors, tell us about the surface — deck, pavers or grass — and whether the bar will sit under cover.</p>`) +
      section('Lounge furniture for living rooms, decks and foyers',
        `<p>Home parties sometimes need a second seating area because the dining table cannot hold every guest at once. A sofa, chairs and a coffee table from <a href="/furniture-lounge-rentals.html">event furniture and lounge rentals</a> or <a href="/rentals/lounge-furniture/">lounge furniture</a> can go in a living room, on a wide deck, or in a hall foyer so older relatives have a comfortable place to sit through speeches. In a clubhouse, the same pieces fill a room that otherwise has only banquet chairs.</p>`) +
      section('Linens for hall luncheons and backyard tables',
        `<p>Outdoor tabletops need cloths that stay put in island breeze and hide rental-table edges; hall luncheons usually want a single color across every round. <a href="/linen-rentals.html">Linen rentals</a> cover both, and we quote them with the tables. If you already have napkins or a runner, send a photo and we will match the cloths as closely as the library allows.</p>`) +
      section('Gallery walls for cultural rooms and school exhibits',
        `<p>Snug Harbor programs, school or community exhibits and temporary displays in hall lobbies often need hanging surface that is not already on the walls. The panels we rent are double-sided, four feet wide and seven feet tall, so a short wall can show work on one face and a schedule or title on the other. See <a href="/wall-panels.html">gallery wall panels</a> and <a href="/portable-gallery-walls.html">portable gallery walls</a>. Five panels build a 20-foot run, which fits many lobby or classroom-adjacent exhibits.</p>`) +
      section('Bridges, hills, driveways, ferries and parks',
        `<p>Deliveries to Staten Island come by truck over the bridges; the ferry is a passenger service and is not how furniture arrives. Driveways and parking lots are more common here than in Manhattan, which often makes unloading simpler, but hillside streets, tight courts and gated communities still need a plan. Share gate codes, the steepness of a driveway, and whether the party is in a backyard that can be reached only through the house. Waterfront and park gatherings at Silver Lake, Clove Lakes, Conference House, Great Kills or Midland Beach may add a path, a field or a lot that closes at a set hour — include those notes, and the earliest drop-off the site allows, so we can schedule around them rather than guess.</p>
<p>Delivery across NYC, NJ &amp; CT.</p>`) +
      section('The other four boroughs',
        `<p>We also deliver party rentals to <a href="/party-rentals-manhattan.html">Manhattan</a>, <a href="/party-rentals-brooklyn.html">Brooklyn</a>, <a href="/party-rentals-queens.html">Queens</a> and <a href="/party-rentals-bronx.html">the Bronx</a>. For a citywide view, see <a href="/party-rentals-nyc.html">party rentals NYC</a> and <a href="/event-rentals-nyc.html">event rentals NYC</a>.</p>`)
  }
];

function assertMeta(P) {
  if (P.title.length > 60) throw new Error(P.file + ' title length ' + P.title.length + ': ' + P.title);
  if (P.desc.length < 120 || P.desc.length > 165) throw new Error(P.file + ' desc length ' + P.desc.length + ': ' + P.desc);
}

function visibleText(html) {
  return html.replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/&#x27;/g, "'")
    .replace(/\s+/g, ' ').trim();
}

function paragraphsOf(html) {
  const out = [];
  const re = /<p\b[^>]*>([\s\S]*?)<\/p>/gi;
  let m;
  while ((m = re.exec(html))) {
    const t = visibleText(m[1]).toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
    if (t.length >= 80) out.push(t);
  }
  return out;
}

function bannedHits(html, file) {
  const checks = [
    [/\bshowroom\b/i, 'showroom'],
    [/\bwalkthrough\b/i, 'walkthrough'],
    [/\bstudio tours?\b/i, 'studio tour'],
    [/\boverflow tables\b/i, 'overflow tables'],
    [/\bpipe and drape\b/i, 'pipe and drape'],
    [/\bflorist/i, 'florist'],
    [/\bCOIs?\b/, 'COI'],
    [/certificate of insurance/i, 'certificate of insurance'],
    [/Pricing depends/i, 'Pricing depends'],
    [/from Wayne,\s*NJ/i, 'from Wayne, NJ'],
    [/www\./i, 'www.'],
    [/47 Monterey/i, '47 Monterey'],
    [/\bTomek\b/i, 'Tomek'],
    [/exhibition-wall-rental/i, 'exhibition-wall-rental'],
    [/"priceRange"/, 'priceRange'],
    [/"openingHours"/, 'openingHours'],
    [/"aggregateRating"/, 'aggregateRating'],
    [/"@type"\s*:\s*"Review"/, 'Review schema']
  ];
  const hits = [];
  for (const [re, label] of checks) if (re.test(html)) hits.push(label);
  if (hits.length) throw new Error(file + ' banned term(s): ' + hits.join(', '));
}

const HEADER = `<header><div class="w"><nav><a class="brand" href="/">ZNC SOLUTIONS</a><div class="nav"><a href="/rentals/">Rentals</a><a href="/wall-panels.html">Wall Panels</a><a href="/testimonials">Testimonials</a><a class="btn" href="/contact.html">Quote</a></div></nav></div></header>`;

const seenParas = new Map();
const counts = [];

for (const P of PAGES) {
  assertMeta(P);
  const URL = '/' + P.file;
  const body = P.body();
  const faqHtml = faqBlock(P.faqH2, P.faqs);
  const contact = contactBlock(P.formH2, P.locPh, P.needsPh);
  const mainInner = `<section class="hero"><div class="w"><div class="ey">${P.ey}</div><h1>${esc(P.h1)}</h1><p>${P.intro}</p><p>${callBtns}</p></div></section>` + body + faqHtml + contact;

  for (const para of paragraphsOf(mainInner)) {
    if (seenParas.has(para)) {
      throw new Error('Reused paragraph in ' + P.file + ' (also in ' + seenParas.get(para) + '): ' + para.slice(0, 120));
    }
    seenParas.set(para, P.file);
  }

  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      BUSINESS,
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE + '/' },
          { '@type': 'ListItem', position: 2, name: P.crumb, item: SITE + URL }
        ]
      },
      {
        '@type': 'WebPage',
        '@id': SITE + URL + '#webpage',
        url: SITE + URL,
        name: P.title,
        description: P.desc,
        isPartOf: { '@id': SITE + '/#business' }
      },
      {
        '@type': 'Service',
        '@id': SITE + URL + '#service',
        name: P.h1,
        url: SITE + URL,
        serviceType: [P.h1, P.crumb],
        provider: { '@id': SITE + '/#business' },
        areaServed: { '@type': 'AdministrativeArea', name: P.areaName }
      },
      {
        '@type': 'FAQPage',
        '@id': SITE + URL + '#faq',
        mainEntity: P.faqs.map(([q, a]) => ({
          '@type': 'Question',
          name: q,
          acceptedAnswer: { '@type': 'Answer', text: a }
        }))
      }
    ]
  };

  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(P.title)}</title><meta name="description" content="${esc(P.desc)}"><link rel="canonical" href="${SITE + URL}"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><meta name="theme-color" content="#0d4a34"><meta property="og:title" content="${esc(P.title)}"><meta property="og:description" content="${esc(P.desc)}"><meta property="og:url" content="${SITE + URL}"><meta property="og:type" content="website"><link rel="stylesheet" href="/site.css"><script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script></head><body>` +
    HEADER +
    `<main>${mainInner}</main>` +
    `${FOOTER_HTML}<a class="callbar" href="tel:${TEL}">${PHONE}</a><script src="/app.js"></script></body></html>\n`;

  bannedHits(html, P.file);
  const words = visibleText(`<main>${mainInner}</main>`).split(/\s+/).filter(Boolean).length;
  if (words < 550) throw new Error(P.file + ' too thin: ' + words + ' words');
  const out = deliverify(navify(html), P.file);
  bannedHits(out, P.file + ' (after chrome)');
  fs.writeFileSync(path.join(ROOT, P.file), out);
  counts.push({ file: P.file, title: P.title.length, desc: P.desc.length, words });
  console.log('wrote', P.file, 'title', P.title.length, 'desc', P.desc.length, 'words', words);
}

{
  const f = path.join(ROOT, 'sitemap.xml');
  let s = fs.readFileSync(f, 'utf8');
  const add = PAGES.map(p => SITE + '/' + p.file)
    .filter(u => !s.includes(`<loc>${u}</loc>`))
    .map(u => `<url><loc>${u}</loc><lastmod>${LASTMOD}</lastmod></url>`)
    .join('');
  if (add) {
    s = s.replace(/(<url><loc>[^<]*\/rentals\/<\/loc>)/, add + '$1');
    fs.writeFileSync(f, s);
    console.log('sitemap: added', PAGES.filter(p => add.includes(p.file)).map(p => p.file).join(', '));
  } else {
    console.log('sitemap: entries already present');
  }
}

console.log(JSON.stringify(counts, null, 2));

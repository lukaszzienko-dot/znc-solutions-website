#!/usr/bin/env node
/* Generates the /blog/ section: blog/index.html plus the planning-guide posts below.
   Run from the repo root:  LASTMOD=YYYY-MM-DD node scripts/build-blog.mjs
   Linked from the inner-page footer ("Planning guides"), never from the homepage.
   Rules: no prices, no street address, no setup/installation claims, no tours, no invented numbers or names. */
import fs from 'fs';
import path from 'path';
import { FOOTER_HTML, navify } from './site-chrome.mjs';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const SITE = 'https://zncsolutions.com';
const LASTMOD = process.env.LASTMOD || new Date().toISOString().slice(0, 10);
const PUBLISHED = '2026-11-28';
const PHONE = '917-536-1245', TEL = '+19175361245';
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const HEADER = `<header><div class="w"><nav><a class="brand" href="/">ZNC SOLUTIONS</a><div class="nav"><a href="/rentals/">Rentals</a><a href="/wall-panels.html">Wall Panels</a><a href="/testimonials">Testimonials</a><a class="btn" href="/contact.html">Quote</a></div></nav></div></header>`;
const img = (file, slug, alt) => `<figure style="margin:1rem 0"><img src="https://static.wixstatic.com/media/${file}/v1/fit/w_1000,h_1000,q_80/${slug}.webp" alt="${esc(alt)}" width="1000" height="1000" loading="lazy" decoding="async" style="display:block;width:100%;max-width:560px;height:auto;border-radius:12px"></figure>`;
const step = (n, h, body) => `<h2>${n}. ${h}</h2><p>${body}</p>`;
const cta = `<section id="contact" class="contact"><div class="w"><h2>Ready to plan?</h2><p>Email <a href="mailto:info@zncsolutions.com">info@zncsolutions.com</a> with your date, venue and list, call <a href="tel:${TEL}" data-track="call_click">${PHONE}</a>, or use the <a href="/contact.html">quote form</a>. Delivery across NYC, NJ &amp; CT.</p><p><a class="btn" href="/contact.html">Request a quote</a></p></div></section>`;

const POSTS = [
  {
    slug: 'gallery-wall-layout-nyc-nj',
    title: 'How to Plan a Gallery Wall Layout for an NYC or NJ Pop-Up',
    desc: 'Plan a gallery wall for an opening or pop-up in NYC or New Jersey: count your works, do the panel math, check door and elevator access, pick a layout.',
    h1: 'How to Plan a Gallery Wall Layout for a Pop-Up or Opening in NYC and New Jersey',
    ey: 'Gallery walls · Planning guide',
    body: () =>
      `<p class="lead">A temporary show lives or dies on wall space. Whether you are filling a loft in Brooklyn, a storefront in Jersey City or a hall in Bergen County, the planning steps are the same. Here is the order we suggest.</p>` +
      img('e06c28_8a2059f55dec4eea82cc6e43ab48fc60~mv2.png', 'gallery-wall-panels-event', 'White 4-by-7-foot gallery wall panels at an event') +
      step(1, 'Count the works and group them', 'List every piece you plan to hang, then group them by series or size. Groups tell you how many separate bays or runs you need.') +
      step(2, 'Do the panel math', 'Our wall panels are 4′ wide by 7′ tall. Each panel adds 4 feet of hanging width, so 5 panels make a 20-foot wall. Divide your total hanging width by 4 to get a panel count, then add a panel or two if you want breathing room at the ends of a run.') +
      step(3, 'Pick the layout', 'Panels can run in a straight line, turn corners to make bays, or stand back to back for double-sided display. Modular runs connect panels into one continuous wall. Stationary panels stand alone and work well for short dividers. A double-sided run lets you hang two groups of work in the same footprint.') +
      step(4, 'Check how the panels get in the room', 'In NYC and in older NJ buildings, access decides the plan: door widths, stairs, the freight elevator and the loading window. Send these details with your request so the delivery is planned around them.') +
      step(5, 'Plan the rest of the room', 'Leave circulation space in front of every wall. Many openings add a bar, lounge seating and cocktail tables so guests have somewhere to stand and talk. See our <a href="/wall-panels.html">wall panels</a>, <a href="/furniture-lounge-rentals.html">lounge furniture</a> and <a href="/bar-rental.html">event bars</a>.') +
      step(6, 'Send us the plan', 'Email <a href="mailto:info@zncsolutions.com">info@zncsolutions.com</a> with the date, venue, wall length or panel count and your layout idea. We confirm availability before anything is reserved. You can also sketch the wall with our <a href="/wall-builder.html">online wall planner</a>.') +
      `<p><em>Related:</em> <a href="/gallery-walls-chelsea.html">Gallery wall rentals in Chelsea</a> · <a href="/gallery-walls-manhattan.html">Manhattan</a> · <a href="/gallery-walls-brooklyn.html">Brooklyn</a> · <a href="/gallery-walls-hoboken-jersey-city.html">Hoboken and Jersey City</a> · <a href="/portable-gallery-walls.html">Portable gallery walls</a></p>`
  },
  {
    slug: 'holiday-event-rental-checklist-nyc-nj',
    title: 'Event Rental Checklist for NYC & NJ Planners | ZNC',
    desc: 'An event rental checklist for NYC and NJ planners: tables and chairs by guest count, lounge, bar, catering gear, and what to send for a quote.',
    h1: 'Event Rental Checklist for NYC and New Jersey Planners',
    ey: 'Holiday & year-end events · Planning guide',
    body: () =>
      `<p class="lead">Year-end and early-winter events book up first, and December dates go early. Use this checklist to build one complete list before you ask for a quote.</p>` +
      img('e06c28_bbba71eec96f4bec842418a79189b67e~mv2.jpg', 'event-bar-rental-znc', 'Wooden bar and party rental setting by ZNC Solutions') +
      step(1, 'Start with guest count and seating style', 'Round tables come in 48″ (seats 6), 60″ (seats 8 to 10) and 72″ (seats 10 to 12). Cocktail tables come in 24″ (seats 2 to 3) and 30″ (seats 3 to 5). Seated dinner needs a seat for every guest. A standing reception needs cocktail tables plus some seating for those who want it. See <a href="/table-chair-rentals.html">table and chair rental</a>.') +
      step(2, 'Choose the chair', 'Chiavari chairs suit formal rooms, folding chairs suit large counts and community halls, and barstools go with cocktail tables.') +
      step(3, 'Add a lounge corner', 'A sofa, a chaise, chairs, coffee tables and a rug give guests a place to settle in. See <a href="/furniture-lounge-rentals.html">lounge furniture rental</a>.') +
      step(4, 'Plan the bar', 'Decide where guests will line up, then pick the bar and the supporting pieces: ice tubs, shakers, coolers and bar stools. Note that bar rental here means furniture and equipment, not bartending. See <a href="/bar-rental.html">event bar rental</a>.') +
      step(5, "Don't forget the food side", 'If a caterer is not supplying equipment, check chafing dishes, food pans, heat lamps, buffet risers, trays and coffee urns. See <a href="/catering-equipment-rental.html">catering equipment rental</a>.') +
      step(6, 'Linens and glassware', 'Match linen colors to the room and confirm glass types for each drink. See <a href="/linen-rentals.html">linens</a> and <a href="/glassware-rental-nyc.html">glassware</a>.') +
      step(7, 'Add a wall if the room needs one', 'White 4′ × 7′ wall panels can divide a space, hang signage or show art. See <a href="/wall-panels.html">wall panels</a>.') +
      step(8, 'Gather the logistics before you ask for a quote', 'Event date, venue, town or borough, guest count, the pieces you want, the load-in window, and any building rules such as a freight elevator or loading dock. Venues in NYC and many NJ buildings set strict windows, so send these early.') +
      step(9, 'Send one request', 'Email <a href="mailto:info@zncsolutions.com">info@zncsolutions.com</a> with the list above. We confirm availability by email before anything is reserved.') +
      `<p><em>Related:</em> <a href="/holiday-party-rentals.html">Holiday party rentals</a> · <a href="/event-rentals-nyc.html">Event rentals NYC</a> · <a href="/event-rentals-new-jersey.html">Event rentals New Jersey</a></p>`
  }
];

function banned(html, file) {
  const checks = [/\bshowroom\b/i, /\bwalkthrough\b/i, /\btours?\b/i, /\binstall/i, /\bprice/i, /\$/, /from Wayne,\s*NJ/i, /www\.zncsolutions/i, /47 Monterey/i, /\bpipe and drape\b/i, /\bflorist/i, /\bbackdrop\b/i, /"priceRange"|"openingHours"|"aggregateRating"/];
  const hit = checks.find(re => re.test(html.replace(/<footer[\s\S]*?<\/footer>/, '')));
  if (hit) throw new Error(file + ' banned: ' + hit);
}
function page({ url, title, desc, crumbs, ld, main }) {
  if (title.length > 60) throw new Error(url + ' title ' + title.length);
  if (desc.length > 160) throw new Error(url + ' desc ' + desc.length);
  const graph = [{ '@type': 'BreadcrumbList', itemListElement: crumbs.map(([n, u], i) => ({ '@type': 'ListItem', position: i + 1, name: n, item: SITE + u })) }, ...ld];
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title><meta name="description" content="${esc(desc)}"><link rel="canonical" href="${SITE + url}"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><meta name="theme-color" content="#0d4a34"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${SITE + url}"><meta property="og:type" content="${url === '/blog/' ? 'website' : 'article'}"><link rel="stylesheet" href="/site.css"><script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c')}</script></head><body>` +
    HEADER + `<main><div class="w"><nav aria-label="Breadcrumb"><ol class="bc">${crumbs.map(([n, u], i) => i === crumbs.length - 1 ? `<li aria-current="page">${esc(n)}</li>` : `<li><a href="${u}">${esc(n)}</a></li>`).join('')}</ol></nav></div>${main}${cta}</main>` +
    `${FOOTER_HTML}<a class="callbar" href="tel:${TEL}">${PHONE}</a><script src="/app.js"></script></body></html>\n`;
}
const write = (file, html) => { banned(html, file); fs.mkdirSync(path.dirname(path.join(ROOT, file)), { recursive: true }); fs.writeFileSync(path.join(ROOT, file), navify(html)); console.log('wrote', file); };

for (const P of POSTS) {
  const url = `/blog/${P.slug}.html`;
  write(`blog/${P.slug}.html`, page({
    url, title: P.title, desc: P.desc, crumbs: [['Home', '/'], ['Planning guides', '/blog/'], [P.h1, url]],
    ld: [{ '@type': 'Article', headline: P.h1, description: P.desc, url: SITE + url, mainEntityOfPage: SITE + url, datePublished: PUBLISHED, dateModified: LASTMOD, author: { '@type': 'Organization', name: 'ZNC Solutions', url: SITE + '/' }, publisher: { '@id': SITE + '/#business' } }],
    main: `<section class="hero"><div class="w"><div class="ey">${P.ey}</div><h1>${esc(P.h1)}</h1></div></section><section class="feature"><div class="w">${P.body()}</div></section>`
  }));
}
write('blog/index.html', page({
  url: '/blog/', title: 'Event Planning Guides for NYC & NJ | ZNC Solutions',
  desc: 'Planning guides from ZNC Solutions for NYC and New Jersey events: gallery wall layouts, event rental checklists and what to send for a quote.',
  crumbs: [['Home', '/'], ['Planning guides', '/blog/']],
  ld: [{ '@type': 'Blog', name: 'ZNC Solutions planning guides', url: SITE + '/blog/', publisher: { '@id': SITE + '/#business' }, blogPost: POSTS.map(P => ({ '@type': 'BlogPosting', headline: P.h1, url: SITE + `/blog/${P.slug}.html`, datePublished: PUBLISHED })) }],
  main: `<section class="hero"><div class="w"><div class="ey">Planning guides</div><h1>Event Planning Guides for NYC and New Jersey</h1><p>Practical notes for planners, galleries and hosts booking event rentals in New York City, New Jersey and Connecticut.</p></div></section>` +
    POSTS.map(P => `<section class="feature"><div class="w"><h2><a href="/blog/${P.slug}.html">${esc(P.h1)}</a></h2><p>${esc(P.desc)}</p><p><a class="btn btn-o" href="/blog/${P.slug}.html">Read the guide</a></p></div></section>`).join('')
}));

/* sitemap: add or refresh the blog URLs (before the rentals block) */
{
  const f = path.join(ROOT, 'sitemap.xml'); let s = fs.readFileSync(f, 'utf8');
  for (const u of ['/blog/', ...POSTS.map(P => `/blog/${P.slug}.html`)]) {
    const loc = `<url><loc>${SITE + u}</loc><lastmod>`;
    const i = s.indexOf(loc);
    if (i >= 0) s = s.slice(0, i + loc.length) + LASTMOD + s.slice(i + loc.length + 10);
    else s = s.replace(/(<url><loc>[^<]*\/rentals\/<\/loc>)/, `<url><loc>${SITE + u}</loc><lastmod>${LASTMOD}</lastmod></url>$1`);
  }
  fs.writeFileSync(f, s);
}

#!/usr/bin/env node
/* Generates testimonials.html from scripts/google-reviews.json. Review text is rendered verbatim (HTML-escaped only), in file order.
   Relative dates ("3 weeks ago") are dropped; entries whose text is the placeholder "no text" show name and stars only.
   Run from the repo root:  node scripts/build-testimonials.mjs   (build-items.mjs re-applies the shared nav/footer afterwards) */
import fs from 'fs'; import path from 'path';
import { FOOTER_HTML, navify } from './site-chrome.mjs';
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const SITE = 'https://zncsolutions.com', URL_PATH = '/testimonials';
const PHONE = '917-536-1245', TEL = '+19175361245', GOOGLE = 'https://maps.google.com/?cid=13399259066193707839';
const R = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts/google-reviews.json'), 'utf8'));
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const avg = (R.reduce((a, r) => a + r.stars, 0) / R.length).toFixed(1);
const title = 'Testimonials | ZNC Solutions Event Rentals NJ/NY/CT';
const desc = `Testimonials for ZNC Solutions: ${avg} average from ${R.length} Google reviews for event rentals from Wayne, NJ across New York, New Jersey and Connecticut.`;
const stars = n => `<span class="tm-stars" role="img" aria-label="${n} out of 5 stars">${'★'.repeat(n)}${'☆'.repeat(5 - n)}</span>`;
const hasDate = d => d && !/\bago\s*$/i.test(d);
const card = r => `<article class="tm"><h3 class="tm-name">${esc(r.name)}</h3>${stars(r.stars)}${hasDate(r.date) ? `<p class="tm-date">${esc(r.date)}</p>` : ''}${r.text && r.text.trim().toLowerCase() !== 'no text' ? `<p class="tm-text">${esc(r.text)}</p>` : ''}</article>`;
const ld = { '@context': 'https://schema.org', '@graph': [
  { '@type': 'WebPage', '@id': SITE + URL_PATH + '#webpage', url: SITE + URL_PATH, name: title, description: desc, isPartOf: { '@id': SITE + '/#business' } },
  { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: SITE + '/' }, { '@type': 'ListItem', position: 2, name: 'Testimonials', item: SITE + URL_PATH }] }] };
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title><meta name="description" content="${esc(desc)}"><link rel="canonical" href="${SITE + URL_PATH}"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><meta name="theme-color" content="#0d4a34"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${SITE + URL_PATH}"><meta property="og:type" content="website"><link rel="stylesheet" href="/site.css"><script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script></head><body>` +
`<header><div class="w"><nav><a class="brand" href="/">ZNC SOLUTIONS</a><div class="nav"><a href="/rentals/">Rentals</a><a href="/wall-panels.html">Wall Panels</a><a class="btn" href="/contact.html">Quote</a></div></nav></div></header>` +
`<main><section class="hero tm-hero"><div class="w"><div class="ey">Customer feedback</div><h1>Testimonials</h1><p class="tm-lead">${avg} average from ${R.length} Google reviews for ZNC Solutions. We rent tables, chairs, linens, lounge furniture, tabletop, bars and 4′ × 7′ gallery walls from Wayne, NJ for events across New York, New Jersey and Connecticut.</p><p class="tm-score"><strong>${avg}</strong> ${stars(5)} <span>${R.length} Google reviews</span></p><p><a class="btn" href="/contact.html">Request a Quote</a> <a class="btn btn-o" href="tel:${TEL}">Call ${PHONE}</a></p></div></section>` +
`<section class="feature tm-list"><div class="w"><h2>What customers say</h2><p class="small">Posted on Google by customers, shown exactly as written.</p><div class="tm-grid">${R.map(card).join('')}</div><p class="tm-more"><a href="${GOOGLE}" target="_blank" rel="noopener noreferrer">Read more on Google</a></p></div></section>` +
`<section class="feature"><div class="w"><h2>Plan your event with ZNC</h2><p>Browse the <a href="/rentals/">rental catalog</a>, <a href="/table-chair-rentals.html">table and chair rentals</a>, <a href="/furniture-lounge-rentals.html">event furniture &amp; lounge rentals</a>, <a href="/linen-rentals.html">linens</a> and <a href="/wall-panels.html">gallery wall panels</a>, then send a quote request with your date, venue and guest count. Learn more <a href="/about.html">about ZNC Solutions</a> or see where we deliver in the <a href="/tri-state-event-rentals.html">tri-state area</a>.</p><p><a class="btn" href="/contact.html">Request a Quote</a> <a class="btn btn-o" href="tel:${TEL}">Call ${PHONE}</a></p></div></section></main>` +
`${FOOTER_HTML}<a class="callbar" href="tel:${TEL}">${PHONE}</a><script src="/app.js"></script></body></html>\n`;
fs.writeFileSync(path.join(ROOT, 'testimonials.html'), navify(html));
console.log('wrote testimonials.html', R.length, 'reviews; title', title.length, 'desc', desc.length);

#!/usr/bin/env node
/* Generates the static rental pages from catalog.js.
   Run from the repo root:  node scripts/build-items.mjs
   Writes:  rentals/index.html, rentals/<category>/index.html, rentals/<category>/<slug>.html
   Updates: sitemap.xml (rentals entries), item lists on landing pages (between <!--items:...--> markers),
            homepage category links, and vercel.json redirects for old Wix /product-page/<slug> URLs
            listed in scripts/wix-product-slugs.txt that match an item slug. */
import fs from 'fs'; import path from 'path'; import vm from 'vm';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const SITE = 'https://zncsolutions.com';
const LASTMOD = process.env.LASTMOD || new Date().toISOString().slice(0, 10);
const PHONE = '917-536-1245', TEL = '+19175361245';

const ctx = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'catalog.js'), 'utf8'), ctx);
const CATS = ctx.window.__ZNC_CATS, Z = ctx.window.__ZNC;

/* Landing pages that get an item list, and the landing page each category links back to. */
const LANDINGS = {
  'table-chair-rentals.html': { title: 'Tables & chairs we rent', cats: ['chairs', 'tables'] },
  'kitchen-equipment-rentals.html': { title: 'Kitchen equipment we rent', cats: ['kitchen'] },
  'tabletop-glassware-rentals.html': { title: 'Tabletop, glassware & silverware we rent', cats: ['china', 'glass', 'silver'], extra: ['coffee', 'display'] },
};
const CAT_LANDING = { chairs: ['/table-chair-rentals.html', 'Table & Chair Rentals'], tables: ['/table-chair-rentals.html', 'Table & Chair Rentals'], kitchen: ['/kitchen-equipment-rentals.html', 'Kitchen Equipment Rentals'], china: ['/tabletop-glassware-rentals.html', 'Tabletop & Glassware Rentals'], glass: ['/tabletop-glassware-rentals.html', 'Tabletop & Glassware Rentals'], silver: ['/tabletop-glassware-rentals.html', 'Tabletop & Glassware Rentals'], coffee: ['/tabletop-glassware-rentals.html', 'Tabletop & Glassware Rentals'], display: ['/tabletop-glassware-rentals.html', 'Tabletop & Glassware Rentals'], walls: ['/wall-panels.html', 'Gallery Wall Panels'] };
const SPEC_LABELS = [['dimensions', 'Dimensions'], ['seats', 'Seating'], ['colors', 'Colors'], ['material', 'Material'], ['stackable', 'Stackable'], ['minOrder', 'Minimum order'], ['notes', 'Notes']];

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const jsonld = o => JSON.stringify(o).replace(/</g, '\\u003c');
const media = (img) => 'https://static.wixstatic.com/media/e06c28_' + img;
const ext = img => (img.match(/\.(\w+)$/) || [, 'jpg'])[1];
const imgSized = (img, w, name, fmt) => `${media(img)}/v1/fit/w_${w},h_${w},q_85/${name}.${fmt || ext(img)}`;
const specVal = (k, v) => k === 'stackable' ? (v === true ? 'Yes' : v === false ? 'No' : String(v)) : String(v);
const filledSpecs = it => SPEC_LABELS.filter(([k]) => it.specs && it.specs[k] !== undefined && it.specs[k] !== null && it.specs[k] !== '').map(([k, l]) => [l, specVal(k, it.specs[k])]);

/* Build item index */
const cats = CATS.filter(c => (Z[c.key] || []).length);
const ITEMS = [], BY_SLUG = {};
for (const c of cats) for (const it of Z[c.key]) {
  if (!it.slug) throw new Error('Missing slug: ' + it.name);
  if (BY_SLUG[it.slug]) throw new Error('Duplicate slug: ' + it.slug);
  const o = { ...it, cat: c, url: `/rentals/${c.slug}/${it.slug}.html` };
  BY_SLUG[it.slug] = o; if (!it.hidden) ITEMS.push(o);
}
for (const k of Object.keys(Z)) if (!cats.find(c => c.key === k) && Z[k].length) throw new Error('Category missing from __ZNC_CATS: ' + k);
const itemsOf = c => ITEMS.filter(i => i.cat === c);
const catTitle = c => c.title || `${c.label} Rentals`;
const fullName = it => it.name + (it.variant ? ` (${it.variant})` : '');

function titleFor(n) {
  for (const t of [`${n} Rental | ZNC Solutions NJ/NY`, `${n} Rental | ZNC Solutions`, `${n} Rental | ZNC`]) if (t.length <= 60) return t;
  return n.slice(0, 54).trim() + ' | ZNC';
}
function descFor(it) {
  const n = fullName(it);
  for (const d of [`Rent the ${n} for your event from ZNC Solutions in Wayne, NJ. ${it.cat.label} rentals delivered across NJ, NYC and CT. Call ${PHONE}.`,
    `Rent the ${n} from ZNC Solutions in Wayne, NJ. ${it.cat.label} rentals for NJ, NYC and CT. Call ${PHONE}.`,
    `Rent the ${n} from ZNC Solutions in Wayne, NJ. Delivery across NJ, NYC and CT.`]) if (d.length <= 160) return d;
  return `Rent the ${n} from ZNC Solutions in Wayne, NJ.`;
}

const HEADER = `<header><div class="w"><nav><a class="brand" href="/">ZNC SOLUTIONS</a><div class="nav"><a href="/rentals/">Rentals</a><a href="/wall-panels.html">Wall Panels</a><a class="btn" href="/contact.html">Quote</a></div></nav></div></header>`;
const FOOTER = `<footer><div class="w fg"><div><strong>ZNC SOLUTIONS</strong><br>Party rentals from Wayne, NJ · NY · NJ · CT</div><div><a href="mailto:info@zncsolutions.com">info@zncsolutions.com</a> · <a href="tel:${TEL}">${PHONE}</a><br><a href="/rentals/">All rentals</a> · <a href="/contact.html">Request a quote</a></div></div></footer><a class="callbar" href="tel:${TEL}">${PHONE}</a><script src="/app.js"></script>`;

function head({ title, desc, canonical, ogImage, ogType, ld }) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title><meta name="description" content="${esc(desc)}"><link rel="canonical" href="${canonical}"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><meta name="theme-color" content="#0d4a34"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${canonical}"><meta property="og:type" content="${ogType || 'website'}">${ogImage ? `<meta property="og:image" content="${esc(ogImage)}">` : ''}<link rel="stylesheet" href="/site.css"><script type="application/ld+json">${jsonld(ld)}</script></head><body>`;
}
function crumbs(list) {
  const html = `<div class="w"><nav aria-label="Breadcrumb"><ol class="bc">${list.map(([n, u], i) => i === list.length - 1 ? `<li aria-current="page">${esc(n)}</li>` : `<li><a href="${u}">${esc(n)}</a></li>`).join('')}</ol></nav></div>`;
  const ld = { '@type': 'BreadcrumbList', itemListElement: list.map(([n, u], i) => ({ '@type': 'ListItem', position: i + 1, name: n, item: SITE + u })) };
  return { html, ld };
}
function addBtn(it, cls) {
  return `<div class="ql-add${cls ? ' ' + cls : ''}"><input type="number" min="1" max="9999" value="1" data-ql-qty aria-label="Quantity for ${esc(fullName(it))}"><button type="button" class="ql-btn" data-ql-add data-ql-id="${esc(it.slug)}" data-ql-name="${esc(fullName(it))}" data-ql-cat="${esc(it.cat.label)}" data-ql-url="${it.url}">Add to quote</button></div>`;
}
function card(it, withAdd) {
  const sp = filledSpecs(it).filter(([l]) => l !== 'Notes').map(([, v]) => esc(v)).join('<br>');
  return `<div class="p"><a class="p-link" href="${it.url}"><img loading="lazy" src="${imgSized(it.img, 500, it.slug, 'webp')}" alt="${esc(fullName(it))} rental"><b>${esc(fullName(it))}</b></a>${sp ? `<span>${sp}</span>` : ''}${withAdd ? addBtn(it) : ''}<a class="p-more" href="${it.url}">View details</a></div>`;
}
function write(rel, html) { const f = path.join(ROOT, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, html); }

/* Clean previous output */
fs.rmSync(path.join(ROOT, 'rentals'), { recursive: true, force: true });
const urls = [];

/* Item pages */
for (const it of ITEMS) {
  const c = it.cat, n = fullName(it), peers = itemsOf(c), idx = peers.indexOf(it);
  const related = []; for (let k = 1; k < peers.length && related.length < 8; k++) related.push(peers[(idx + k) % peers.length]);
  const pairs = (it.pairsWith || []).map(s => BY_SLUG[s]).filter(p => p && !p.hidden);
  const bc = crumbs([['Home', '/'], ['Rentals', '/rentals/'], [c.label, `/rentals/${c.slug}/`], [n, it.url]]);
  const specs = filledSpecs(it);
  const photos = [it.img, ...(it.gallery || []).filter(g => g !== it.img)];
  const product = { '@type': 'Product', '@id': SITE + it.url + '#product', name: n, url: SITE + it.url, image: photos.map(p => imgSized(p, 1000, it.slug)), description: `${n} available to rent from ZNC Solutions in Wayne, NJ, for events across New York, New Jersey and Connecticut.`, brand: { '@type': 'Brand', name: 'ZNC Solutions' }, category: c.label };
  if (specs.length) product.additionalProperty = specs.map(([l, v]) => ({ '@type': 'PropertyValue', name: l, value: v }));
  const landing = CAT_LANDING[c.key];
  const title = titleFor(n), desc = descFor(it);
  const html = head({ title, desc, canonical: SITE + it.url, ogImage: imgSized(it.img, 1000, it.slug), ogType: 'product', ld: { '@context': 'https://schema.org', '@graph': [bc.ld, product] } }) + HEADER +
    `<main>${bc.html}<section class="item"><div class="w item-g"><div class="item-media"><img id="itemPhoto" src="${imgSized(it.img, 800, it.slug)}" alt="${esc(n)} for rent from ZNC Solutions, Wayne NJ" width="800" height="800">` +
    (photos.length > 1 ? `<div class="thumbs">${photos.map((p, i) => `<button type="button" data-photo="${imgSized(p, 800, it.slug)}" aria-label="Show photo ${i + 1} of ${esc(n)}"><img loading="lazy" src="${imgSized(p, 160, it.slug, 'webp')}" alt="${esc(n)} photo ${i + 1}"></button>`).join('')}</div>` : '') +
    `</div><div class="item-info"><div class="ey">${esc(c.label)}</div><h1>${esc(it.name)}</h1>${it.variant ? `<p class="variant">${esc(it.variant)}</p>` : ''}<p class="lead">${esc(c.blurb)}</p>` +
    (specs.length ? `<dl class="spec-list">${specs.map(([l, v]) => `<dt>${esc(l)}</dt><dd>${esc(v)}</dd>`).join('')}</dl>` : '') +
    `${addBtn(it, 'ql-add-lg')}` +
    `<p class="item-cta"><a class="btn" href="/contact.html">Request a quote</a> <a class="btn btn-o" href="tel:${TEL}">Call ${PHONE}</a></p>` +
    `<p class="small">Delivered from Wayne, NJ across North Jersey, New York City and Connecticut.${landing ? ` See also <a href="${landing[0]}">${esc(landing[1])}</a>.` : ''}</p></div></div></section>` +
    (pairs.length ? `<section class="related"><div class="w"><h2>Pairs well with</h2><div class="grid">${pairs.map(p => card(p, true)).join('')}</div></div></section>` : '') +
    (related.length ? `<section class="related"><div class="w"><h2>More ${esc(c.label)}</h2><div class="grid">${related.map(p => card(p, true)).join('')}</div><p><a class="btn btn-o" href="/rentals/${c.slug}/">View all ${esc(c.label)}</a></p></div></section>` : '') +
    `</main>` + FOOTER + `</body></html>\n`;
  write(it.url.slice(1), html); urls.push(it.url);
}

/* Category pages */
for (const c of cats) {
  const list = itemsOf(c); if (!list.length) continue;
  const u = `/rentals/${c.slug}/`;
  const bc = crumbs([['Home', '/'], ['Rentals', '/rentals/'], [c.label, u]]);
  const title = (t => t.length <= 60 ? t : `${catTitle(c)} | ZNC Solutions`)(`${catTitle(c)} | ZNC Solutions NJ/NY`);
  const desc = `${c.label} rentals from ZNC Solutions in Wayne, NJ: ${list.length} items for events across NJ, NYC and CT. Build a quote list or call ${PHONE}.`;
  const itemList = { '@type': 'ItemList', name: `${c.label} rentals`, numberOfItems: list.length, itemListElement: list.map((it, i) => ({ '@type': 'ListItem', position: i + 1, url: SITE + it.url, name: fullName(it) })) };
  const landing = CAT_LANDING[c.key];
  const html = head({ title, desc, canonical: SITE + u, ogImage: imgSized(list[0].img, 1000, list[0].slug), ld: { '@context': 'https://schema.org', '@graph': [bc.ld, itemList] } }) + HEADER +
    `<main>${bc.html}<section class="cat-head"><div class="w"><div class="ey">ZNC Rentals</div><h1>${esc(catTitle(c))}</h1><p class="lead">${esc(c.blurb)}</p><p class="price-note">Add items to your quote list, then send it with your quote request.</p>${landing ? `<p class="small">See also <a href="${landing[0]}">${esc(landing[1])}</a>.</p>` : ''}</div></section>` +
    `<section class="related"><div class="w"><div class="grid">${list.map(it => card(it, true)).join('')}</div></div></section>` +
    `<section class="related"><div class="w"><h2>Other rental categories</h2><p class="cat-links">${cats.filter(o => o !== c && itemsOf(o).length).map(o => `<a href="/rentals/${o.slug}/">${esc(o.label)}</a>`).join('')}</p></div></section></main>` + FOOTER + `</body></html>\n`;
  write(u.slice(1) + 'index.html', html); urls.push(u);
}

/* Rentals index */
{
  const u = '/rentals/';
  const bc = crumbs([['Home', '/'], ['Rentals', u]]);
  const html = head({ title: 'Party Rental Catalog | ZNC Solutions Wayne NJ', desc: `Browse ${ITEMS.length} party rental items from ZNC Solutions in Wayne, NJ: chairs, tables, lounge, bars, tabletop, kitchen gear and gallery walls. Call ${PHONE}.`, canonical: SITE + u, ld: { '@context': 'https://schema.org', '@graph': [bc.ld, { '@type': 'ItemList', name: 'Rental categories', itemListElement: cats.filter(c => itemsOf(c).length).map((c, i) => ({ '@type': 'ListItem', position: i + 1, url: `${SITE}/rentals/${c.slug}/`, name: c.label })) }] } }) + HEADER +
    `<main>${bc.html}<section class="cat-head"><div class="w"><div class="ey">ZNC Rentals</div><h1>Rental Catalog</h1><p class="lead">Every item we rent, by category. Add items to your quote list and send it with your quote request.</p></div></section>` +
    cats.filter(c => itemsOf(c).length).map(c => `<section class="related"><div class="w"><h2><a href="/rentals/${c.slug}/">${esc(c.label)}</a></h2><p class="lead">${esc(c.blurb)}</p><ul class="item-links">${itemsOf(c).map(it => `<li><a href="${it.url}">${esc(fullName(it))}</a></li>`).join('')}</ul></div></section>`).join('') +
    `</main>` + FOOTER + `</body></html>\n`;
  write('rentals/index.html', html); urls.push(u);
}

/* Replace content between markers in a file (adds the block before `before` if markers are missing). */
function inject(file, name, block, before) {
  const f = path.join(ROOT, file); let s = fs.readFileSync(f, 'utf8');
  const a = `<!--${name}:start-->`, b = `<!--${name}:end-->`, full = a + block + b;
  if (s.includes(a)) s = s.replace(new RegExp(a + '[\\s\\S]*?' + b), () => full);
  else { const i = s.indexOf(before); if (i < 0) throw new Error(`${file}: anchor ${before} not found`); s = s.slice(0, i) + full + s.slice(i); }
  fs.writeFileSync(f, s);
}
for (const [file, cfg] of Object.entries(LANDINGS)) {
  const block = `<section class="related item-index"><div class="w"><h2>${esc(cfg.title)}</h2>` +
    cfg.cats.map(k => cats.find(c => c.key === k)).filter(Boolean).map(c => `<h3><a href="/rentals/${c.slug}/">${esc(c.label)}</a></h3><ul class="item-links">${itemsOf(c).map(it => `<li><a href="${it.url}">${esc(fullName(it))}</a></li>`).join('')}</ul>`).join('') +
    (cfg.extra ? `<p class="cat-links">${cfg.extra.map(k => cats.find(c => c.key === k)).filter(Boolean).map(c => `<a href="/rentals/${c.slug}/">${esc(c.label)}</a>`).join('')}</p>` : '') +
    `</div></section>`;
  inject(file, 'items', block, '</main>');
}
inject('index.html', 'catlinks', `<p class="cat-links home-cat-links"><span>Browse by category:</span>${cats.filter(c => itemsOf(c).length).map(c => `<a href="/rentals/${c.slug}/">${esc(c.label)}</a>`).join('')}<a href="/rentals/">All rentals</a></p>`, '</section>\n\n<section class="feature faq">');

/* sitemap.xml: keep non-rentals entries, replace rentals ones */
{
  const f = path.join(ROOT, 'sitemap.xml'); let s = fs.readFileSync(f, 'utf8');
  s = s.replace(/<url><loc>https:\/\/zncsolutions\.com\/rentals\/[^<]*<\/loc><lastmod>[^<]*<\/lastmod><\/url>/g, '');
  const touched = new Set(['/', ...Object.keys(LANDINGS).map(x => '/' + x)]);
  s = s.replace(/<url><loc>https:\/\/zncsolutions\.com([^<]*)<\/loc><lastmod>[^<]*<\/lastmod><\/url>/g, (m, p) => touched.has(p) ? `<url><loc>${SITE}${p}</loc><lastmod>${LASTMOD}</lastmod></url>` : m);
  const add = urls.sort((a, b) => a.split('/').length - b.split('/').length || a.localeCompare(b)).map(u => `<url><loc>${SITE}${u}</loc><lastmod>${LASTMOD}</lastmod></url>`).join('');
  s = s.replace('</urlset>', add + '</urlset>');
  fs.writeFileSync(f, s);
}

/* vercel.json: 301s from old Wix product URLs whose slug matches an item (manual aliases below). */
{
  const ALIAS = { 'white-chiavari-chair': 'white-chiavari-barstool', 'white-chiavari-chair-1': 'white-chiavari-chair', 'bar-kitcken-towel': 'bar-kitchen-towel', 'chome-ice-bucket': 'chrome-ice-bucket', 'white-icetub': 'white-ice-tub', 'rectangular-table': 'rectangular-tables', 'round-cocktail-table': 'round-cocktail-tables', 'swing-bottle': 'swing-bottle-34oz', 'pop-corn-machine': 'popcorn-machine', 'stainless-steel-bar-scoop': 'bar-scoop', 'copy-of-angle-platter-18-x12': 'angle-platter-18-x12', '72-round-foldingtable': 'round-folding-table', 'half-baker-rack-1': 'half-baker-rack', 'samovar': 'stainless-steel-samovar', 'silver-creamer': 'silver-creamer-20-oz', 'coupe-cup': 'coupe-coffee-cup', 'large-serving-bowl': 'large-serving-salad-bowl' };
  const f = path.join(ROOT, 'vercel.json'); const v = JSON.parse(fs.readFileSync(f, 'utf8'));
  const wixFile = path.join(ROOT, 'scripts/wix-product-slugs.txt');
  const wix = fs.existsSync(wixFile) ? fs.readFileSync(wixFile, 'utf8').split(/\s+/).filter(Boolean) : [];
  v.redirects = (v.redirects || []).filter(r => !r.source.startsWith('/product-page/'));
  const seen = new Set(), unmatched = [];
  for (const w of wix) {
    const t = BY_SLUG[ALIAS[w] || w];
    if (!t || t.hidden) { unmatched.push(w); continue; }
    if (seen.has(w)) continue; seen.add(w);
    v.redirects.push({ source: '/product-page/' + w, destination: t.url, statusCode: 301 });
  }
  fs.writeFileSync(f, JSON.stringify(v, null, 1) + '\n');
  console.log(`wix redirects: ${seen.size}, unmatched: ${unmatched.length} (${unmatched.join(' ')})`);
}
console.log(`items: ${ITEMS.length}, categories: ${cats.filter(c => itemsOf(c).length).length}, urls: ${urls.length}`);

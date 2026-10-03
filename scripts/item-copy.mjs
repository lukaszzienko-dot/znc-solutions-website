/* Copy for generated rental pages: item "About" + FAQ blocks and category planning guides.
   Only restates facts already on the site (sizes, seating counts, catalog names) plus plain planning advice. No prices, no invented claims. */
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const PHONE = '917-536-1245';

/* Families group look-alike items inside a category so each page can link to its true siblings. First match wins. */
const FAMILIES = {
  chairs: [[/barstool/i, 'barstools'], [/chiavari/i, 'Chiavari chairs'], [/folding/i, 'folding chairs'], [/chair/i, 'chairs']],
  china: [[/platter/i, 'platters'], [/bowl/i, 'bowls'], [/plate/i, 'plates']],
  glass: [[/wine/i, 'wine glasses'], [/old fashioned|highball|shot/i, 'short and tall tumblers'], [/coupe|flute|martini|sherbet/i, 'cocktail and sparkling stemware'], [/pitcher|charisma/i, 'pitchers and everyday glasses']],
  display: [[/tray/i, 'trays'], [/riser/i, 'risers'], [/tong|ladle|fork|spoon|server/i, 'serving utensils'], [/stand|display/i, 'cake stands and displays']],
  coffee: [[/creamer/i, 'creamers'], [/maker|samovar|press|pot|set/i, 'brewers and pots'], [/cup|saucer/i, 'cups and saucers']],
  kitchen: [[/oven|cabinet|proofing|warming|rack/i, 'ovens, proofing and warming'], [/fryer|burner|stove|cooktop|sterno/i, 'cooking and heating'], [/chaf|bain|pan|heat lamp/i, 'chafing and holding']],
  barware: [[/ice|cooler|cubes/i, 'ice and cooling'], [/shaker|jigger|opener|scoop|caddy|blender|towel|board|mat|napkin/i, 'bar tools'], [/carafe|dispenser|bottle/i, 'beverage service']],
  lounge: [[/table/i, 'tables'], [/couch|sofa|chaise|chair|set/i, 'seating'], [/heater|umbrella/i, 'outdoor comfort']],
  event: [[/coat|hanger|ticket/i, 'coat check'], [/tub|bin|bag|broom|slim|tray/i, 'back-of-house'], [/lantern|votive/i, 'ambient lighting']],
};
export const familyOf = it => ((FAMILIES[it.cat.key] || []).find(([re]) => re.test(it.name)) || [])[1] || null;

/* One short usage note per category. {n} = item name. */
const USE = {
  walls: n => `Share the wall length, ceiling height, door widths and load-in window in your quote request so we can confirm how many panels the ${n} setup needs.`,
  chairs: n => `Chair counts follow guest count: plan one chair per seat at each table, so a 60″ round that seats 8–10 needs 8–10 chairs. Tell us your table count and guest count and we will confirm that the ${n} is available for your date.`,
  tables: n => `Table counts follow guest count and layout. Tell us how many guests you expect, whether the event is seated or standing, and the room dimensions, and we will help plan how the ${n} fits.`,
  lounge: n => `Lounge pieces work best as a group. Pair the ${n} with a coffee table, a rug and side pieces from the same category, and tell us the footprint of the seating area when you request a quote.`,
  bars: n => `A bar needs a plan for ice, glassware and back-of-house storage. Add barware and glassware from the same order alongside the ${n} and describe the space so we can plan the setup.`,
  barware: n => `The ${n} is meant to be ordered with the rest of a bar setup. Tell us the guest count and the drink menu and we will help you decide how many pieces to add to the quote list.`,
  coffee: n => `Coffee and tea service quantities depend on guest count and how long service runs. Tell us both and we will confirm the ${n} and any matching cups, saucers or creamers.`,
  china: n => `Plates and bowls are ordered against the menu and the number of courses, not just the guest count. Share your menu style and headcount in the quote request so we can confirm the ${n} quantities.`,
  glass: n => `Glassware counts depend on how many drink types you serve and how long the event runs. Share your guest count and drink list and we will confirm the ${n} quantity.`,
  silver: n => `Flatware is ordered against the menu and number of courses. Share your guest count and course plan and we will confirm how many place settings of the ${n} you need.`,
  display: n => `Serving pieces are chosen against the buffet or dessert layout. Tell us the table length and what you plan to serve and we will help you pick the right quantity of the ${n}.`,
  kitchen: n => `Kitchen equipment is chosen against the menu, the power or fuel available at the venue, and your caterer's plan. Include those details when you request a quote for the ${n}.`,
  event: n => `Support items are easy to forget until load-in. Add the ${n} to the same quote list as your furniture and tabletop so everything is confirmed in one reply.`,
};

const FAQ3 = {
  chairs: it => [`Which tables pair with the ${it.fn}?`, /barstool/i.test(it.name) ? 'Barstools are meant for high-top and cocktail tables, such as our 24″ and 30″ round cocktail tables.' : 'Chairs pair with our 48″, 60″ and 72″ round tables, plus rectangular and farmhouse tables for family-style seating.'],
  tables: it => [`Can you help plan a layout with the ${it.fn}?`, 'Yes. Share your guest count and venue and we will help work out how many tables and chairs you need.'],
};

export function itemDetailHtml(it, ctx) {
  const { fullName, peers, byFamily, landing } = ctx;
  const n = fullName(it), c = it.cat, fam = familyOf(it);
  const sibs = fam ? peers.filter(p => p !== it && familyOf(p) === fam) : [];
  const bits = [`The ${n} is one of ${peers.length} items in the ${c.label} category that ZNC Solutions rents from Wayne, NJ for events in New Jersey, New York City and Connecticut.`];
  if (fam && sibs.length) bits.push(`In the catalog it sits with ${sibs.length} other ${fam}, listed below so you can compare sizes, finishes and styles before you build a quote list.`);
  const spec = ctx.specs.map(([l, v]) => `${l.toLowerCase()}: ${v}`).join('; ');
  if (spec) bits.push(`Listed details — ${spec}.`);
  const DIFF = {
    'white-chiavari-chair': 'This is the standard-height White Chiavari Chair for seated dining. The taller, bar-height version is the White Chiavari Barstool, which is meant for high-top and cocktail tables.',
    'white-chiavari-barstool': 'This is the bar-height White Chiavari Barstool for high-top and cocktail tables. For seated dining at standard tables, see the White Chiavari Chair.',
  };
  const diffHtml = DIFF[it.slug] ? `<p>${esc(DIFF[it.slug])}${it.slug === 'white-chiavari-chair' ? ' <a href="/rentals/chairs-barstools/white-chiavari-barstool.html">White Chiavari Barstool</a>.' : ' <a href="/rentals/chairs-barstools/white-chiavari-chair.html">White Chiavari Chair</a>.'}</p>` : '';
  const use = (USE[c.key] || USE.event)(n);
  const sibHtml = sibs.length ? `<h2>Other ${esc(fam)} we rent</h2><ul class="item-links">${sibs.map(p => `<li><a href="${p.url}">${esc(fullName(p))}</a></li>`).join('')}</ul>` : '';
  const f3 = FAQ3[c.key] ? FAQ3[c.key]({ ...it, fn: n }) : [`Can I combine the ${n} with other rentals?`, `Yes. One quote list can include furniture, tabletop, bar and kitchen items from the same inventory${landing ? `; see <a href="${landing[0]}">${esc(landing[1])}</a> for related items` : ''}.`];
  const faqs = [
    [`How do I rent the ${n}?`, 'Add it to your quote list from this page, then send the list with your event date, city and quantity. We reply with availability and a quote.'],
    [`Does ZNC deliver the ${n}?`, `ZNC delivers rentals from Wayne, NJ across North Jersey, New York City and Connecticut. Include the venue and load-in details in your request, or call <a href="tel:+19175361245">${PHONE}</a>.`],
    f3,
  ];
  return `<section class="feature item-detail"><div class="w"><h2>About the ${esc(n)}</h2><p>${esc(bits.join(' '))}</p>${diffHtml}<p>${esc(use)}</p>${sibHtml}</div></section>` +
    `<section class="feature faq"><div class="w"><h2>${esc(n)} rental questions</h2>${faqs.map(([q, a]) => `<h3>${esc(q)}</h3><p>${a.includes('<a') ? a : esc(a)}</p>`).join('')}</div></section>`;
}

const GUIDE = {
  walls: ['Gallery walls give galleries, pop-ups and brand activations temporary hanging space without a permanent build. Each panel is 4 feet wide by 7 feet tall, so a 20-foot wall uses five panels.', 'Choose modular panels for a long continuous run or stationary walls for a freestanding layout. A room divider covered in the fabric of your choice splits a space or screens off back-of-house areas.'],
  chairs: ['Chiavari chairs are the usual choice for weddings and seated dinners, and ZNC carries white, gold, black, silver, transparent, natural wood and dark wood finishes. Folding chairs cover ceremonies and larger headcounts, and barstools pair with high-top and cocktail tables.', 'Count one chair per seat: a 60″ round seats 8–10 and a 72″ round seats 10–12. Send your guest count and table plan and we will confirm availability for your date.'],
  tables: ['ZNC rents 48″, 60″ and 72″ round tables that seat 6, 8–10 and 10–12 guests, 24″ and 30″ round cocktail tables for standing guests, plus farmhouse and rectangular tables for buffets, gift tables and family-style meals.', 'Share your guest count and whether the event is seated or standing and we will help plan the layout.'],
  lounge: ['Lounge furniture turns a corner of the room into a seating area for cocktail hour, VIP guests or photo moments. The catalog includes velvet and corduroy sofas, a chaise lounge, coffee tables, side tables, a 9′ × 12′ area rug and accent pillows.', 'For outdoor events, a propane heater, umbrella and umbrella stand are rented separately. Browse the full <a href="/furniture-lounge-rentals.html">event furniture & lounge rentals</a> page for ways to combine them.'],
  bars: ['ZNC offers an 8′ wooden bar and a custom fabric bar screen in 6′ or 8′ widths that can be made in any tablecloth fabric, with an optional logo. A screen hides coolers and supplies and gives bartenders a clean station.', 'Order the bar together with barware and glassware so the full station arrives in one delivery.'],
  barware: ['Barware covers the small tools and service pieces a bartender reaches for: ice tubs and buckets, shakers, jiggers, scoops, mats, a cutting board, a beverage dispenser and a 150qt cooler.', 'Pair these with a bar from the <a href="/rentals/bars/">bars category</a> and stemware from <a href="/rentals/glassware/">glassware</a>.'],
  coffee: ['Coffee and tea service includes 30-cup and 100-cup coffee makers, a French press, a samovar, a tea pot, creamers, cups and saucers, and a silver coffee set.', 'Pair coffee service with <a href="/rentals/china-tabletop/">china and tabletop</a> pieces so cups, saucers and creamers match the rest of the table.'],
  china: ['China and tabletop includes plates, bowls and platters in a wide range of sizes, from small tasting plates to large serving platters and salad bowls. Sizes are in each item name, so you can match plates to courses and platters to the buffet.', 'Add <a href="/rentals/glassware/">glassware</a> and <a href="/rentals/silverware/">silverware</a> to finish the place setting.'],
  glass: ['Glassware includes red and white wine glasses, stemless wine glasses, flutes, coupes, martini glasses, old fashioned and highball glasses, shot glasses and a glass pitcher. Capacity is listed in each item name.', 'Match the glass to the drink menu, then add <a href="/rentals/barware/">barware</a> and a bar to complete the station.'],
  silver: ['ZNC rents three flatware styles: Gold Silverware, Eclipse Flatware and Square Flatware. Choose the finish that fits your linens and plates, and tell us the number of place settings you need.', 'Pair flatware with <a href="/rentals/china-tabletop/">china and tabletop</a> and <a href="/rentals/glassware/">glassware</a>.'],
  display: ['Serving and display pieces include trays, cake stands, risers, serving forks and spoons, tongs, ladles and a cake server set. Use risers to add height to a buffet and trays to group small items.', 'Combine serving pieces with <a href="/rentals/china-tabletop/">platters and bowls</a> and <a href="/rentals/kitchen-equipment/">kitchen equipment</a> for catered events.'],
  kitchen: ['Kitchen equipment is rented for caterers and event kitchens: a full-size electric convection oven, proofing cabinets, warming cabinets, baker racks, chafing dishes, deep fryers, burners and a refrigerator.', 'Tell us the menu, the power and fuel available at the venue and your caterer’s plan, and we will help confirm the right pieces.'],
  event: ['Event equipment covers the support items around furniture and tabletop: coat racks, hangers and numbered coat check tickets, a 4′ × 4′ portable stage unit, a popcorn machine, lanterns and votives, bus tubs, ice tubs and cleanup supplies.', 'Add them to the same quote list as your furniture and tabletop so everything is confirmed together.'],
};
export function catGuideHtml(c) {
  const g = GUIDE[c.key]; if (!g) return '';
  return `<section class="feature item-detail"><div class="w"><h2>Planning ${esc(c.label.toLowerCase())} for your event</h2>${g.map(p => `<p>${p.includes('<a') ? p : esc(p)}</p>`).join('')}<p>To rent, add items to your quote list and send it with your date, city and guest count, or call <a href="tel:+19175361245">${PHONE}</a>. ZNC delivers from Wayne, NJ across North Jersey, New York City and Connecticut.</p></div></section>`;
}

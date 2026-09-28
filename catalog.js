/* ZNC Solutions rental catalog. Single source of truth for the homepage catalog (app.js)
   and the static item pages (node scripts/build-items.mjs -> /rentals/...).

   Each item: { name, img, slug, ...optional fields }
     name       Display name.
     img        Wix media id (https://static.wixstatic.com/media/e06c28_<img>).
     slug       URL slug, unique across the whole catalog. Page: /rentals/<category slug>/<slug>.html
                Don't change a slug once live (it's the page URL); add a vercel.json redirect if you must.
   Optional (leave out when unknown; only filled fields are shown, nothing is invented):
     variant    Short label to tell apart two items with the same name, e.g. "Option 2".
     specs      { dimensions, seats, colors, material, stackable, minOrder, notes }
                  dimensions "30″ H × 18″ W"   seats "Seats 8–10"   colors "White, Black"
                  material "Wood"   stackable true/false   minOrder "Sold in sets of 10"   notes free text
     pairsWith  [slug, slug, ...]   Items shown as "Pairs well with".
     gallery    [img, img, ...]     Extra photos (Wix media ids).
     hidden     true = not shown on the site and no page generated.
   Categories (__ZNC_CATS): key, label, slug (URL), blurb (1-3 sentences), optional title (category page H1). */
window.__ZNC_CATS = [ { "key": "walls", "label": "Gallery Walls", "slug": "gallery-walls", "blurb": "Our 4′ × 7′ wall panels build clean, free-standing walls for art shows, pop-ups and brand activations. Link them into a long modular run or set them up as stationary walls, and use a room divider to split a space or screen off back-of-house areas." }, { "key": "chairs", "label": "Chairs & Barstools", "slug": "chairs-barstools", "blurb": "Chiavari chairs dress up weddings and seated dinners, folding chairs cover ceremonies and big headcounts, and barstools pair with high-top and cocktail tables. Mix finishes to match your linens and décor." }, { "key": "tables", "label": "Tables", "title": "Table Rentals", "slug": "tables", "blurb": "Round tables work well for seated dinners, rectangular and farmhouse tables handle family-style meals, buffets and gift tables, and cocktail tables keep a standing crowd mingling. Share your guest count and we'll help plan the layout." }, { "key": "lounge", "label": "Lounge Furniture", "slug": "lounge-furniture", "blurb": "Sofas, lounge chairs, coffee tables and rugs turn a corner into a relaxed seating area for cocktail hour, VIP guests or photo moments. Heaters and umbrellas keep outdoor lounges comfortable." }, { "key": "bars", "label": "Bars", "title": "Bar Rentals", "slug": "bars", "blurb": "A wooden bar or a fabric-wrapped bar screen gives bartenders a proper station and keeps coolers and supplies out of sight. Pair it with barware and glassware from the same order." }, { "key": "barware", "label": "Barware", "slug": "barware", "blurb": "Ice tubs, shakers, jiggers, scoops, mats and beverage dispensers set a bar up for cocktails, beer and wine service. Plan glassware around your drink menu to go with it." }, { "key": "coffee", "label": "Coffee & Tea Service", "slug": "coffee-tea-service", "blurb": "Coffee makers, a samovar, tea pots, French presses, cups and creamers for a self-serve coffee station or a dessert course. Great for morning meetings, brunches and late-night coffee bars." }, { "key": "china", "label": "China & Tabletop", "slug": "china-tabletop", "blurb": "Plates, bowls, platters and tasting pieces for plated dinners, buffets and passed bites. Keep one shape throughout for a clean table or mix sizes for a relaxed, grazing-style spread." }, { "key": "glass", "label": "Glassware", "slug": "glassware", "blurb": "Wine, champagne, cocktail and water glasses for toasts, bar service and dinner settings. Build the list from your drink menu and add a few extras for refills." }, { "key": "silver", "label": "Silverware", "slug": "silverware", "blurb": "Flatware for seated dinners and buffets in several styles, including gold. Match the flatware to your china and chargers for a finished place setting." }, { "key": "display", "label": "Serving & Display", "slug": "serving-display", "blurb": "Trays, cake stands, risers and serving utensils for buffets, dessert tables and grazing displays. Risers add height so a food table looks full from across the room." }, { "key": "kitchen", "label": "Kitchen Equipment", "slug": "kitchen-equipment", "blurb": "Ovens, warming and proofing cabinets, fryers, burners, refrigeration and chafing dishes for caterers cooking on-site. Tell us about the venue's power and space so we can confirm what fits." }, { "key": "event", "label": "Event Equipment", "slug": "event-equipment", "blurb": "The practical pieces that keep an event running: coat check racks and hangers, lanterns and votives, bins and bags, a portable stage unit, a popcorn machine and cleanup supplies." } ];
window.__ZNC = {
 "lounge": [
  {"name":"Modern 5 Piece Outdoor Set","img":"9bb08232d9e04862a223b41f40de9b25~mv2.jpg","slug":"modern-5-piece-outdoor-set"},
  {"name":"9'x12' Area Rug","img":"709dfdca136c420da560173af45de7b7~mv2.jpg","slug":"9-x12-area-rug"},
  {"name":"Mustard Velvet Tufted Couch","img":"bf9d18c4d0bb468c8cef043bf476867b~mv2.jpg","slug":"mustard-velvet-tufted-couch"},
  {"name":"Blue Velvet Accent Pillows (Set of 2)","img":"1cb5ce5515714ac7bfd4201c52b70ae0~mv2.jpg","slug":"blue-velvet-accent-pillows-set-of-2"},
  {"name":"Curved Green Velvet Chaise Lounge","img":"88bd4fbd32d243e3ae0f725a3562bb10~mv2.jpeg","slug":"curved-green-velvet-chaise-lounge"},
  {"name":"Glossy Green Cylindrical Side Table","img":"3f5616c5118549de9ad9d51c6adec989~mv2.png","slug":"glossy-green-cylindrical-side-table"},
  {"name":"Green Corduroy Two-Seater Sofa","img":"2c7a1ccbae6d47149ef1e11137e4d141~mv2.jpg","slug":"green-corduroy-two-seater-sofa"},
  {"name":"Green Corduroy Armless Chair","img":"f2c52cbe63c34d2a808c5a6832bbb1df~mv2.jpg","slug":"green-corduroy-armless-chair"},
  {"name":"Sculptural Glass Coffee Table","img":"272021c826674ac6934ebad761a28fc6~mv2.jpg","slug":"sculptural-glass-coffee-table"},
  {"name":"Organic Carved Wood Coffee Table","img":"a30744b4942445469d5c4f8ad0681608~mv2.jpg","slug":"organic-carved-wood-coffee-table"},
  {"name":"Fleetwood Black Coffee Table","img":"186be724e7654a528b1228b2e0683695~mv2.jpg","slug":"fleetwood-black-coffee-table"},
  {"name":"Propane Outdoor Heater","img":"50cc4d499d314daab5a7c1b78dc1a14d~mv2.jpg","slug":"propane-outdoor-heater"},
  {"name":"Umbrella Stand","img":"631e74836ece4602babc9c67005eac31~mv2.png","slug":"umbrella-stand"},
  {"name":"Velowra Couch","img":"5bee45dc74884ea980826f93ec4097cb~mv2.png","slug":"velowra-couch"},
  {"name":"Outdoor Umbrella","img":"9416a14f499047428d04a8b3d1182d5f~mv2.png","slug":"outdoor-umbrella"}
 ],
 "event": [
  {"name":"Hangers","img":"cd93fdf37c0149e9a1d8656b0c1a425e~mv2.png","slug":"hangers"},
  {"name":"Coat Check Ticket Numbers","img":"41d34d6ffea94df09db5d3c72218cd87~mv2.png","slug":"coat-check-ticket-numbers"},
  {"name":"Coat Rack","img":"0d6b97e279a04959ac9e75f1a075d9eb~mv2.jpg","slug":"coat-rack"},
  {"name":"Glass Votive for Candle","img":"376e1eecd33f44c1852e29a1b64a3611~mv2.png","slug":"glass-votive-for-candle"},
  {"name":"Black Lantern","img":"fbdedccd54014b1782c86de9fb0b807c~mv2.jpg","slug":"black-lantern"},
  {"name":"Clear Garbage Bag","img":"fad30a4855d1441a9a2902bbe3f0cfee~mv2.jpg","slug":"clear-garbage-bag"},
  {"name":"Black Garbage Bags","img":"aa7f5d42a1a244e4bb26c9fd4c3b1d7e~mv2.png","slug":"black-garbage-bags"},
  {"name":"32 Gallon Garbage Bin","img":"faa82c490cd14a93822aafa83bf09dd0~mv2.png","slug":"32-gallon-garbage-bin"},
  {"name":"Portable Stage Unit 4'x4'","img":"1a2399030cca488d97ac4915501c23fa~mv2.png","slug":"portable-stage-unit-4-x4"},
  {"name":"Reinforced Kraft Paper","img":"781ff100c4f64d3286486b0aad4a0e02~mv2.jpg","slug":"reinforced-kraft-paper"},
  {"name":"Popcorn Machine","img":"7ee5672a81224ed7a2f804c6357a38aa~mv2.jpg","slug":"popcorn-machine"},
  {"name":"Broom & Dustpan","img":"13ed649552224522b478579085823879~mv2.png","slug":"broom-dustpan"},
  {"name":"Ice Tub Strainer","img":"9d69f97623744f91a385d9f2158319b3~mv2.jpg","slug":"ice-tub-strainer"},
  {"name":"Bus Tub","img":"e05ec4ea36464f4ca1d2f0cc5a490893~mv2.png","slug":"bus-tub"},
  {"name":"White Ice Tub","img":"95d61b95afeb4a6d95d1a18fb86e7a3a~mv2.png","slug":"white-ice-tub"},
  {"name":"16\" Round Black Non-Skid Tray","img":"f66dffcbce504871a6b7c8a3a42b19cc~mv2.png","slug":"16-round-black-non-skid-tray"},
  {"name":"Slim Jim","img":"45f0d01e3f454df3a3a419bd8b550f92~mv2.png","slug":"slim-jim"}
 ],
 "barware": [
  {"name":"Gold Ice Tub","img":"44ddb2a7993c4384aa902fc6c8701200~mv2.jpg","slug":"gold-ice-tub"},
  {"name":"Gold Ice Bucket","img":"d0104e062efc41f18d039ee8612f0aa4~mv2.jpg","slug":"gold-ice-bucket"},
  {"name":"Glass Cubes","img":"137e8ec1160445ebb52143fe0283b110~mv2.png","slug":"glass-cubes"},
  {"name":"Jigger","img":"bc00480045f74136826999bc1de365ee~mv2.jpg","slug":"jigger"},
  {"name":"Bar Cutting Board","img":"45080a3d188d4b74b7bf4b584814d728~mv2.jpg","slug":"bar-cutting-board"},
  {"name":"Bar/Kitchen Towel","img":"0fbe4499e97d42718b2c86f8e3c01268~mv2.jpg","slug":"bar-kitchen-towel"},
  {"name":"Paper Cocktail Napkins (50 ct.)","img":"ad4541447a11481c87086ed68c0aa382~mv2.png","slug":"paper-cocktail-napkins-50-ct"},
  {"name":"Swing Bottle 34oz.","img":"f4497bf0db244a1eafa9b4e5112e1fd2~mv2.png","slug":"swing-bottle-34oz"},
  {"name":"Chrome Ice Bucket","img":"b5b781759c054a2fbd3b8c5cffa7d1df~mv2.jpg","slug":"chrome-ice-bucket"},
  {"name":"150qt Cooler","img":"b86f81dac68f4d5f967b05f025389d86~mv2.jpg","slug":"150qt-cooler"},
  {"name":"Hammered Ice Tub 19\"","img":"27f272bf89b8467687ac8431e2edbe90~mv2.png","slug":"hammered-ice-tub-19"},
  {"name":"Bar Scoop","img":"9947b859c9564aa1b937649c0263f012~mv2.png","slug":"bar-scoop"},
  {"name":"Glass Carafe 24 oz.","img":"aada7b135b5b4780bf1431f39e9b7eb2~mv2.png","slug":"glass-carafe-24-oz"},
  {"name":"Corkscrew and Bottle Opener","img":"a549faadcc4642b4b22db1636e053c9a~mv2.png","slug":"corkscrew-and-bottle-opener"},
  {"name":"Cocktail Shaker","img":"8a04fcfbb7564747aca7d1344524e226~mv2.png","slug":"cocktail-shaker"},
  {"name":"Glass Beverage Dispenser 2 Gal.","img":"d938b5d4c322461897eeacff0dc697b5~mv2.png","slug":"glass-beverage-dispenser-2-gal"},
  {"name":"Blender","img":"1542d6f40c9c400796826f03aed6bde0~mv2.png","slug":"blender"},
  {"name":"Bar Floor Mat","img":"9b7dfea7c85c415588ff98de21560623~mv2.png","slug":"bar-floor-mat"},
  {"name":"Bar Caddy","img":"a44e8eadc90d4e2f9b8e31731c37178d~mv2.png","slug":"bar-caddy"}
 ],
 "kitchen": [
  {"name":"Single Deck Full Size Electric Convection Oven","img":"a3745e2e12f1406d9e3635a295175100~mv2.jpeg","slug":"single-deck-full-size-electric-convection-oven"},
  {"name":"Heat Lamp","img":"526487fb91a748a2b4361a78f90e2fc2~mv2.jpg","slug":"heat-lamp"},
  {"name":"Bain Marie","img":"8ba20d0125714b73b444bfc8cab73dfc~mv2.jpg","slug":"bain-marie"},
  {"name":"Countertop Deep Fryer","img":"d0202652d94d4821b2a804f33b86565e~mv2.jpg","slug":"countertop-deep-fryer"},
  {"name":"Sterno (Can or Case)","img":"54d32ea103f44579a30c6b393ed08260~mv2.png","slug":"sterno-can-or-case"},
  {"name":"Cutting Boards","img":"370db1b55e7741fc959fc269b84b2ab9~mv2.png","slug":"cutting-boards"},
  {"name":"Standing Propane Deep Fryer","img":"96355a448ed044578feec3c1e1e598d0~mv2.jpg","slug":"standing-propane-deep-fryer"},
  {"name":"Single Door Refrigerator","img":"e327bc81a521409a96babdb039ca999e~mv2.jpg","slug":"single-door-refrigerator"},
  {"name":"Half Proofing Box","img":"e9f56eb703104762b32d0aaec15488f8~mv2.png","slug":"half-proofing-box"},
  {"name":"Half Baker Rack","img":"913ff447d01a44fdb471b1571cf850d0~mv2.png","slug":"half-baker-rack"},
  {"name":"Full Size Chafer Food Pan 8 Qt.","img":"2f4eaacdbf534c63872c1907c55e1ef4~mv2.png","slug":"full-size-chafer-food-pan-8-qt"},
  {"name":"Chafing Dish 8 Qt.","img":"a29f9f36fe5c4e45b1d4969c3a2ab235~mv2.png","slug":"chafing-dish-8-qt"},
  {"name":"Sheet Pan (3 sizes)","img":"52b68a2c54a74e50b46cb94f39c13390~mv2.png","slug":"sheet-pan-3-sizes"},
  {"name":"Half Baker Rack","img":"6413a13b8d3d455b83c63008900a033f~mv2.png","slug":"half-baker-rack-2","hidden":true},
  {"name":"Baker Rack","img":"85abbcf879d94bdc88eb028fc4c7044e~mv2.png","slug":"baker-rack"},
  {"name":"Cadco Oven","img":"83772d7ea87a4612ba086592849ac1df~mv2.png","slug":"cadco-oven"},
  {"name":"Proofing Cabinet","img":"7ef1745210d94eceb9da900a3315935b~mv2.png","slug":"proofing-cabinet"},
  {"name":"Warming Electric Cabinet","img":"c1a2e81cf48f4c3c80133c429018c599~mv2.png","slug":"warming-electric-cabinet"},
  {"name":"Induction Burner Cooktop","img":"9621c251ced2432189b666cfb511bc7b~mv2.png","slug":"induction-burner-cooktop"},
  {"name":"Cassette Furnace Butane Gas Stove","img":"cca2c51e3ce5404ebfa6a7421747221a~mv2.png","slug":"cassette-furnace-butane-gas-stove"}
 ],
 "display": [
  {"name":"Glass Riser","img":"630b948e4f524db4be9a425154a0fc15~mv2.jpg","slug":"glass-riser"},
  {"name":"10\" Pastry Tongs","img":"f81713bb9ecd42d7b5240d03092ebcb0~mv2.jpg","slug":"10-pastry-tongs"},
  {"name":"10\" Cake Server & Knife Set","img":"c9ebeafdee9a44ba83a9af097f523699~mv2.png","slug":"10-cake-server-knife-set"},
  {"name":"10\" Ladle","img":"9a3bf4ed119e41ceb13cacd51c1eafde~mv2.jpg","slug":"10-ladle"},
  {"name":"Elegance Sugar Tong 4\"","img":"eac4c27bf34144539d2d3ed98dd81da7~mv2.jpg","slug":"elegance-sugar-tong-4"},
  {"name":"12\" Gold Tray","img":"98c1da69cb7e42fdb1d724d7bb9befc0~mv2.jpg","slug":"12-gold-tray"},
  {"name":"12\" Gold Cake Stand","img":"81f97538377744ffaa976da8000f7522~mv2.png","slug":"12-gold-cake-stand"},
  {"name":"12\" Cake Stand","img":"51bbf25b778a45b1b1608c36a37f3879~mv2.jpg","slug":"12-cake-stand"},
  {"name":"Hammered Tray 15\"","img":"52424a7e1d974db59db3b3800f44a473~mv2.png","slug":"hammered-tray-15"},
  {"name":"White Display Risers (set of 6)","img":"72b6c62ea4834395bb3e2a4330e25a24~mv2.jpg","slug":"white-display-risers-set-of-6"},
  {"name":"Hammered Serving Fork 12\"","img":"90c01458b6b843f9ab991f74c814bf28~mv2.png","slug":"hammered-serving-fork-12"},
  {"name":"Hammered Serving Spoon 12\"","img":"cdda9ccdf81941b6b1c97328fed524d4~mv2.png","slug":"hammered-serving-spoon-12"},
  {"name":"Silver Serving Spoon","img":"2ca17ed1597e4f738015cab1f334d81d~mv2.png","slug":"silver-serving-spoon"},
  {"name":"Silver Serving Fork","img":"5224e107a28b45219c183f5fe198a248~mv2.png","slug":"silver-serving-fork"},
  {"name":"Black Square Resin Tray","img":"d439e5087a7a40949165a243553157e9~mv2.png","slug":"black-square-resin-tray"},
  {"name":"White Square Resin Tray","img":"3a6d4317bbdb4e689540ef8b3c8a318c~mv2.png","slug":"white-square-resin-tray"},
  {"name":"19\" Round Food Display","img":"7371ff84d8474c09a6eb972a4665810f~mv2.jpg","slug":"19-round-food-display"},
  {"name":"16.5\" Oval Wood Tray","img":"4f8f311554594045a3492b28be18272d~mv2.jpg","slug":"16-5-oval-wood-tray"},
  {"name":"12\" Wooden Round Tray","img":"7ee566d69d074840be236bba3f891048~mv2.jpg","slug":"12-wooden-round-tray"},
  {"name":"Round Gallery Tray 15\"","img":"78b15118162647d2b5edddcfc2fe08ab~mv2.png","slug":"round-gallery-tray-15"},
  {"name":"Stainless Steel Scissor Tongs","img":"897d669f31d54001a061f8f0adb6c693~mv2.jpg","slug":"stainless-steel-scissor-tongs"}
 ],
 "bars": [
  {"name":"Custom Fabric Bar Screen","img":"774ac52f42ee4e3d937a4081104ce0db~mv2.jpg","slug":"custom-fabric-bar-screen","specs":{"dimensions":"6′ or 8′","material":"Any tablecloth fabric","notes":"Optional logo"},"gallery":["774ac52f42ee4e3d937a4081104ce0db~mv2.jpg","c2e52d94b6cc4b4f8b5c646b12461545~mv2.jpg","bffdb87250644fbb86faea71f5298abd~mv2.jpg","655812636b164854a5a017e117c51c7d~mv2.jpg"]},
  {"name":"8' Wooden Bar","img":"679b181572d64393890a2f129534d6e8~mv2.png","slug":"8-wooden-bar"}
 ],
 "chairs": [
  {"name":"X Back Barstool","img":"49ef4321f732495d85b2cb42bf3f835e~mv2.png","slug":"x-back-barstool"},
  {"name":"White Chiavari Chair","img":"bac685a940624f0bb83461479387399d~mv2.png","slug":"white-chiavari-chair"},
  {"name":"Silver Chiavari Barstool","img":"f4fbd277ca3745f0841c13d46934a1a1~mv2.jpg","slug":"silver-chiavari-barstool"},
  {"name":"Black Wooden Barstool","img":"b2a934e5cb134d0abdf303d1b0ec9a58~mv2.png","slug":"black-wooden-barstool"},
  {"name":"White Wooden Barstool","img":"8e6c6505e6d54fa08a6697212aed50fd~mv2.png","slug":"white-wooden-barstool"},
  {"name":"Natural Wood Chiavari Chair","img":"ae7e504f84ec4d7b8ab7d4dc83099daa~mv2.png","slug":"natural-wood-chiavari-chair"},
  {"name":"Black Chiavari Chair","img":"f6268b20ff724279b7b645a50be491d3~mv2.jpg","slug":"black-chiavari-chair"},
  {"name":"Transparent Chiavari Chair","img":"2801d8f13f704e0184d9620ff75ded5c~mv2.jpg","slug":"transparent-chiavari-chair"},
  {"name":"White Chiavari Chair","img":"b9ce63b0547447628e563e9168ba26b0~mv2.jpg","slug":"white-chiavari-chair-2","variant":"Option 2"},
  {"name":"Gold Chiavari Chair","img":"d1c585ce10cc41939d2465c365e4ba12~mv2.jpg","slug":"gold-chiavari-chair"},
  {"name":"Barstool","img":"032199a8ab624bc0a09498ea02a51f30~mv2.png","slug":"barstool"},
  {"name":"White Folding Chair","img":"cee67b65a06d4943b5a35a005b91c03a~mv2.png","slug":"white-folding-chair"},
  {"name":"Black Folding Chair","img":"7da7bb254ff049d2bbc7542a88c34694~mv2.png","slug":"black-folding-chair"},
  {"name":"X Back Rustic Chair","img":"78dfad9aca3a416ab48b921e8814d1a5~mv2.png","slug":"x-back-rustic-chair"},
  {"name":"Dark Wood Chiavari Chair","img":"b4f591d670464642a2799965675b7591~mv2.png","slug":"dark-wood-chiavari-chair"}
 ],
 "coffee": [
  {"name":"Silver Coffee Set","img":"c3091b2b51a647fab70280fb426d1230~mv2.jpg","slug":"silver-coffee-set"},
  {"name":"Ceramic Tea Pot 32oz.","img":"cee85f41a0a545ea9f264199fb740b26~mv2.png","slug":"ceramic-tea-pot-32oz"},
  {"name":"Creamer 6 oz.","img":"10897d0b84e448768915d9d56b9b0ad0~mv2.jpg","slug":"creamer-6-oz"},
  {"name":"30 cup Coffee Maker","img":"d30f99eca83046338173b488c8a14fe1~mv2.png","slug":"30-cup-coffee-maker"},
  {"name":"100 cup Coffee Maker","img":"8a162b9f4a2e49708cf391b7e241e84c~mv2.png","slug":"100-cup-coffee-maker"},
  {"name":"Coupe Saucer 6\"","img":"bf8c27bfa99a433e8ec7f6623e09cb36~mv2.png","slug":"coupe-saucer-6"},
  {"name":"Coupe Coffee Cup","img":"81302a41256348d589f8e4359f59510c~mv2.png","slug":"coupe-coffee-cup"},
  {"name":"Silver Creamer 20 oz.","img":"f8d4604a48a643b388e7a27c42253e73~mv2.png","slug":"silver-creamer-20-oz"},
  {"name":"Glass Creamer","img":"82748e6267fa4a60a578a693c7e6b79f~mv2.png","slug":"glass-creamer"},
  {"name":"Coffee maker","img":"f505d3161b0d4d96970592a60322398c~mv2.png","slug":"coffee-maker"},
  {"name":"Stainless Steel Samovar","img":"a5a6c3998ba443b1a0114f0e74f4ba17~mv2.png","slug":"stainless-steel-samovar"},
  {"name":"French Press 32 oz.","img":"922b62bdb9d94bb881e46c3e36e42b4e~mv2.png","slug":"french-press-32-oz"}
 ],
 "walls": [
  {"name":"Room Divider","img":"96aab14665fb47078166131fcb7a1ad3~mv2.jpg","slug":"room-divider","specs":{"material":"You can choose any fabric to cover the panel"}},
  {"name":"Wall Panel System","img":"fe3a504cd4644d88b0ecd0c3ee54a27b~mv2.png","slug":"wall-panel-system","specs":{"dimensions":"4′ × 7′ per panel","notes":"Modular or stationary gallery walls"},"gallery":["fe3a504cd4644d88b0ecd0c3ee54a27b~mv2.png","fe2f6271d2474dd88315d9e3ce490e91~mv2.png","8a2059f55dec4eea82cc6e43ab48fc60~mv2.png","43074cfa6677487b8115be11d9908bfa~mv2.jpg"]}
 ],
 "china": [
  {"name":"12\" Round Bowl","img":"f3b7ae63c2b942a9842d6deaef544bcb~mv2.jpg","slug":"12-round-bowl"},
  {"name":"10.5\" Round Platter","img":"40e721ee1874402c819733a84a13c754~mv2.jpg","slug":"10-5-round-platter"},
  {"name":"Square Bowl 8.5\"x8.5\"","img":"1d40e13df2fa4fecbd21e018d72023aa~mv2.jpg","slug":"square-bowl-8-5-x8-5"},
  {"name":"Tasting Oval Bowl 4.25\"x2.25\"","img":"629b7ad649964cdca386804610b5665c~mv2.jpg","slug":"tasting-oval-bowl-4-25-x2-25"},
  {"name":"Tasting Bowl 4.75\" Square","img":"f72d5d567a974913a6c65a18f8e3aa30~mv2.jpg","slug":"tasting-bowl-4-75-square"},
  {"name":"Tasting Bowl 3.65\"","img":"170d4a1311aa426d85975d732c41794a~mv2.jpg","slug":"tasting-bowl-3-65"},
  {"name":"Square Tasting Plate 5.25\"","img":"d279ceb6cabc4ff58b67f5d9fc3126fe~mv2.jpg","slug":"square-tasting-plate-5-25"},
  {"name":"Platter 9.3\"x4.5\"","img":"a2dc0d2e562e44fd9be2b606f4e11e2c~mv2.jpg","slug":"platter-9-3-x4-5"},
  {"name":"Square Tasting Plate 2.5\"x3.75","img":"cfdc58802ff8463789cdf08169dc0ce5~mv2.jpg","slug":"square-tasting-plate-2-5-x3-75"},
  {"name":"3\" Round Tasting Plate","img":"62d82671c5114a9f8e50f3e6dc8e57f5~mv2.jpg","slug":"3-round-tasting-plate"},
  {"name":"Oval Tasting Bowl 4\"x3\"","img":"82ec86241b9f4378a444930b43d5e5af~mv2.jpg","slug":"oval-tasting-bowl-4-x3"},
  {"name":"Square Tasting Plate 4.75\"","img":"a384ff9e143c44168971794e8d2f88c3~mv2.jpg","slug":"square-tasting-plate-4-75"},
  {"name":"Square Tasting Plate 3.75\"","img":"b4b4d945cc43487fa62720df49c3ff6e~mv2.png","slug":"square-tasting-plate-3-75"},
  {"name":"Tasting Mercer Plate 5\"","img":"3438b47c90304fdfa957b24d8d783e4d~mv2.jpg","slug":"tasting-mercer-plate-5"},
  {"name":"Small Square Plate 4.25\"x4.25\"","img":"0106c021e2c14f15b461266350e248d0~mv2.png","slug":"small-square-plate-4-25-x4-25"},
  {"name":"Tasting Plate 6\"x6\"","img":"d284a7080ffd4f0fa53e5f87d58140b6~mv2.jpg","slug":"tasting-plate-6-x6"},
  {"name":"8\" Round Bowl","img":"1cdbc34decab4d9081b4aea122e53bd1~mv2.jpg","slug":"8-round-bowl"},
  {"name":"Large Oval Bowl","img":"82f29c20927c48f9b9f4fa3e4d9e8ef9~mv2.jpg","slug":"large-oval-bowl"},
  {"name":"Large Oval Platter w/Handles","img":"68d8073a18bd479d968104d6eac1b857~mv2.jpg","slug":"large-oval-platter-w-handles"},
  {"name":"Round Bowl 5\"","img":"b1d7a08f932d4d6aa97f59b57e3c19d9~mv2.jpg","slug":"round-bowl-5"},
  {"name":"Platter 9.5''x4.5''","img":"54fc22363b6d4d66b713871fca177f41~mv2.jpg","slug":"platter-9-5-x4-5"},
  {"name":"Square Straight Bowl 3.5''x3.5''","img":"e3e2ef14cd6f458183d80aee5bf7c424~mv2.jpg","slug":"square-straight-bowl-3-5-x3-5"},
  {"name":"Round Bowl 4''","img":"336df497b0c748d1aa9c0e98557449a1~mv2.jpg","slug":"round-bowl-4"},
  {"name":"Square Bowl 4''x4''","img":"89892a3b3fe64806b251b182579f69f8~mv2.jpg","slug":"square-bowl-4-x4"},
  {"name":"Angle Platter 18''x12''","img":"6803bafbc8be4d86847bb7a3a6a1dcdb~mv2.jpg","slug":"angle-platter-18-x12"},
  {"name":"Angle Platter 16''x9.5''","img":"6803bafbc8be4d86847bb7a3a6a1dcdb~mv2.jpg","slug":"angle-platter-16-x9-5"},
  {"name":"Angle Platter 12''x7.5''","img":"6803bafbc8be4d86847bb7a3a6a1dcdb~mv2.jpg","slug":"angle-platter-12-x7-5"},
  {"name":"Angle Platter 12''x5.5''","img":"1cf5be896bb04edd92bc91a01dc03553~mv2.jpg","slug":"angle-platter-12-x5-5"},
  {"name":"Angle Platter 10''x5.5''","img":"2e03edcd7d2f49ee83451f2f37885ddc~mv2.jpg","slug":"angle-platter-10-x5-5"},
  {"name":"Platter 10''x5.5''","img":"be4f8c186c9846cd8168e835d5919da0~mv2.jpg","slug":"platter-10-x5-5"},
  {"name":"Oval Platter 11.5\"","img":"0fb54c591cdf45f48254aa1045374b17~mv2.jpg","slug":"oval-platter-11-5"},
  {"name":"Oval Platter 15''","img":"a9ee901bf8af458d8607718a89e525d9~mv2.jpg","slug":"oval-platter-15"},
  {"name":"Wooden Round Bowl (Different Sizes)","img":"c230813222bd4c88b0f5f856ae12890f~mv2.png","slug":"wooden-round-bowl-different-sizes"},
  {"name":"Large Serving Salad Bowl","img":"73422eca6d434dd695fe516b9c77b75a~mv2.png","slug":"large-serving-salad-bowl"},
  {"name":"Square Plate","img":"b44e7e87c9474d3f8c59ec76a86eee78~mv2.png","slug":"square-plate"},
  {"name":"White Coupe Round Plate","img":"def835c44a1841df9741534e79b76465~mv2.jpg","slug":"white-coupe-round-plate"}
 ],
 "glass": [
  {"name":"Azul Glass Pitcher 53 oz.","img":"6cdbd6c179454936ab7ab63157590dc5~mv2.jpeg","slug":"azul-glass-pitcher-53-oz"},
  {"name":"Elegance Coupe 10 oz.","img":"d5e8357489644e71bf3921790e08d65c~mv2.png","slug":"elegance-coupe-10-oz"},
  {"name":"Charisma Glass 12 oz.","img":"cd370ee359e1439292809de8263e44bb~mv2.png","slug":"charisma-glass-12-oz"},
  {"name":"Shot Glass","img":"ceac41a3517744a09288b4fa7bdae9e7~mv2.png","slug":"shot-glass"},
  {"name":"Sherbet Glass 5 oz.","img":"0c692e3bbfce4d26998b0e5d0e218bc6~mv2.png","slug":"sherbet-glass-5-oz"},
  {"name":"Paris Coupe Glass 8 oz.","img":"258faaeeec0149f88be6afd5eed743bb~mv2.png","slug":"paris-coupe-glass-8-oz"},
  {"name":"Stemless White Wine Glass 12 oz.","img":"3061850a6e0246fbb8a4dcbb0b65d986~mv2.png","slug":"stemless-white-wine-glass-12-oz"},
  {"name":"Stemless Red Wine Glass 17 oz.","img":"ca523d185b434e25b673dca5ffc1d62b~mv2.jpg","slug":"stemless-red-wine-glass-17-oz"},
  {"name":"Old Fashioned Glass 8 oz.","img":"664511a6d58f4aa08fe35dd8f9d11071~mv2.png","slug":"old-fashioned-glass-8-oz"},
  {"name":"Double Old Fashioned 13 oz.","img":"02f59d73fbf9457dba055a8068c3f364~mv2.png","slug":"double-old-fashioned-13-oz"},
  {"name":"Double Highball Glass 12 oz.","img":"f14e16cca6244128a77735d5942920df~mv2.png","slug":"double-highball-glass-12-oz"},
  {"name":"A/P White Wine Glass 12 oz.","img":"d4e57279e78e413199099c1cedd166b3~mv2.png","slug":"a-p-white-wine-glass-12-oz"},
  {"name":"Red Wine Glass 16 oz.","img":"d4e57279e78e413199099c1cedd166b3~mv2.png","slug":"red-wine-glass-16-oz"},
  {"name":"Flute Glass 7 oz.","img":"c6982658240b4792ae7447546ac0143d~mv2.png","slug":"flute-glass-7-oz"},
  {"name":"Martini Glass 13.5 oz. Stemless","img":"2a97ffe9fc3440dea236fce849584509~mv2.png","slug":"martini-glass-13-5-oz-stemless"}
 ],
 "silver": [
  {"name":"Gold Silverware","img":"c1d71f2c0c2946c99f3ffe8889aaa359~mv2.png","slug":"gold-silverware"},
  {"name":"Eclipse Flatware","img":"ae619608cbf44670830fcf2fb1887ee5~mv2.png","slug":"eclipse-flatware"},
  {"name":"Square Flatware","img":"c5bb34a6d9fc4bcd93ff1cbd39285a56~mv2.png","slug":"square-flatware"}
 ],
 "tables": [
  {"name":"Round Folding Table","img":"c53800f70bf74ef6b8c49cc0651039dd~mv2.png","slug":"round-folding-table","specs":{"dimensions":"48″, 60″ and 72″ round","seats":"48″ seats 6 · 60″ seats 8–10 · 72″ seats 10–12"}},
  {"name":"Farmhouse Table","img":"d6749b4108704a2995da600ac34cd104~mv2.png","slug":"farmhouse-table","specs":{"notes":"Size options available on request"}},
  {"name":"Rectangular Tables","img":"c98e401f0bd64773b32d91d3b7c19add~mv2.png","slug":"rectangular-tables","specs":{"notes":"Multiple sizes available · exact dimensions on request"}},
  {"name":"Round Cocktail Tables","img":"d2bb76065b2241e6b32cb365107f0a0f~mv2.png","slug":"round-cocktail-tables","specs":{"dimensions":"24″ and 30″ round","seats":"24″ seats 2–3 · 30″ seats 3–5"}}
 ]
};

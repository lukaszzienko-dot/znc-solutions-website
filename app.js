/* ZNC Solutions site script: catalog, search, quote list, quote form, hero rotation. */
(function () {
  "use strict";
  var CAT = window.__ZNC || {};
  var LABELS = { chairs: "Chairs & Barstools", tables: "Tables", lounge: "Lounge Furniture", bars: "Bars", barware: "Barware", coffee: "Coffee & Tea Service", china: "China & Tabletop", glass: "Glassware", silver: "Silverware", display: "Serving & Display", kitchen: "Kitchen Equipment", event: "Event Equipment", walls: "Gallery Walls", other: "Other Rentals" };
  var ORDER = ["walls", "chairs", "tables", "lounge", "bars", "barware", "coffee", "china", "glass", "silver", "display", "kitchen", "event", "other"];
  var PLACEHOLDER = "6413a13b8d3d455b83c63008900a033f";
  var SPECS = { "Round Folding Table": "48″ round · seats 6<br>60″ round · seats 8–10<br>72″ round · seats 10–12", "Round Cocktail Tables": "24″ round · seats 2–3<br>30″ round · seats 3–5", "Farmhouse Table": "Size options available on request", "Rectangular Tables": "Multiple sizes available · exact dimensions on request", "Wall Panel System": "4′ × 7′ per panel · modular or stationary gallery walls", "Room Divider": "You can choose any fabric to cover the panel", "Custom Fabric Bar Screen": "6′ or 8′ · any tablecloth fabric · optional logo" };
  var GALLERIES = { "Wall Panel System": ["fe3a504cd4644d88b0ecd0c3ee54a27b~mv2.png", "fe2f6271d2474dd88315d9e3ce490e91~mv2.png", "8a2059f55dec4eea82cc6e43ab48fc60~mv2.png", "43074cfa6677487b8115be11d9908bfa~mv2.jpg"], "Custom Fabric Bar Screen": ["774ac52f42ee4e3d937a4081104ce0db~mv2.jpg", "c2e52d94b6cc4b4f8b5c646b12461545~mv2.jpg", "bffdb87250644fbb86faea71f5298abd~mv2.jpg", "655812636b164854a5a017e117c51c7d~mv2.jpg"] };
  function $(id) { return document.getElementById(id); }
  function img(id) { return "https://static.wixstatic.com/media/e06c28_" + id; }
  function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }
  function slugify(s) { return String(s).toLowerCase().replace(/&/g, " and ").replace(/[″"']/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""); }

  /* Build an index: every item gets a stable, globally unique id (slug). */
  var ITEMS = [];
  (function () {
    var seen = {};
    Object.keys(CAT).forEach(function (k) {
      (CAT[k] || []).forEach(function (row) {
        var base = slugify(row[0]), s = base, i = 2;
        while (seen[s]) s = base + "-" + i++;
        seen[s] = 1;
        ITEMS.push({ name: row[0], img: row[1], cat: k, slug: s });
      });
    });
  })();
  function itemsIn(k) { return ITEMS.filter(function (it) { return it.cat === k && it.img.indexOf(PLACEHOLDER) !== 0; }); }

  /* ---------- Quote list (localStorage) ---------- */
  var QKEY = "znc_quote_list_v1";
  function qLoad() { try { var v = JSON.parse(localStorage.getItem(QKEY) || "[]"); return Array.isArray(v) ? v : []; } catch (e) { return []; } }
  function qSave(list) { try { localStorage.setItem(QKEY, JSON.stringify(list)); } catch (e) {} qRender(); }
  function qCount(list) { return list.reduce(function (n, it) { return n + 1; }, 0); }
  function qAdd(item, qty) {
    var list = qLoad(), q = Math.max(1, Math.min(9999, parseInt(qty, 10) || 1));
    var hit = list.filter(function (it) { return it.id === item.id; })[0];
    if (hit) hit.qty = Math.min(9999, (parseInt(hit.qty, 10) || 1) + q); else list.push({ id: item.id, name: item.name, cat: item.cat || "", url: item.url || "", qty: q });
    qSave(list);
  }
  function qText(list) { return list.map(function (it) { return it.qty + " × " + it.name + (it.cat ? " (" + it.cat + ")" : ""); }).join("; "); }
  window.ZNCQuote = { load: qLoad, add: qAdd, text: function () { return qText(qLoad()); }, clear: function () { qSave([]); } };

  var pill, qpanel, qbody;
  function qBuildUI() {
    pill = el("button", "ql-pill"); pill.type = "button"; pill.setAttribute("aria-haspopup", "dialog"); pill.setAttribute("aria-controls", "qlPanel");
    pill.onclick = function () { qpanel.classList.contains("on") ? qClose() : qOpen(); };
    qpanel = el("div", "ql-panel"); qpanel.id = "qlPanel"; qpanel.setAttribute("role", "dialog"); qpanel.setAttribute("aria-label", "Quote list");
    var head = el("div", "ql-head"); head.appendChild(el("strong", null, "Quote list"));
    var x = el("button", "close", "Close"); x.type = "button"; x.onclick = qClose; head.appendChild(x);
    qbody = el("div", "ql-body");
    var foot = el("div", "ql-foot");
    var send = el("button", "btn ql-send", "Send with quote request"); send.type = "button"; send.onclick = qSend;
    var clr = el("button", "ql-clear", "Clear list"); clr.type = "button"; clr.onclick = function () { qSave([]); };
    foot.append(el("p", "ql-note", "Pricing depends on your date, item count and delivery town."), send, clr);
    qpanel.append(head, qbody, foot);
    document.body.append(qpanel, pill);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && qpanel.classList.contains("on")) qClose(); });
  }
  function qOpen() { qpanel.classList.add("on"); pill.setAttribute("aria-expanded", "true"); }
  function qClose() { qpanel.classList.remove("on"); pill.setAttribute("aria-expanded", "false"); }
  function qSend() {
    qClose();
    var f = $("quoteForm");
    if (f) { var c = $("contact") || f; c.scrollIntoView({ behavior: "smooth", block: "start" }); var n = $("n"); if (n) setTimeout(function () { n.focus({ preventScroll: true }); }, 500); }
    else location.href = "/contact.html#contact";
  }
  function qRender() {
    if (!pill) return;
    var list = qLoad(), n = qCount(list);
    pill.textContent = "Quote list (" + n + ")";
    pill.classList.toggle("on", n > 0);
    if (!n) qClose();
    qbody.innerHTML = "";
    if (!n) qbody.appendChild(el("p", "empty", "Your quote list is empty. Use “Add to quote” on any rental."));
    list.forEach(function (it, idx) {
      var row = el("div", "ql-row");
      var name = it.url ? el("a", "ql-name", it.name) : el("span", "ql-name", it.name); if (it.url) name.href = it.url;
      var q = el("input"); q.type = "number"; q.min = "1"; q.max = "9999"; q.value = it.qty; q.setAttribute("aria-label", "Quantity for " + it.name);
      q.onchange = function () { var l = qLoad(); if (l[idx]) { l[idx].qty = Math.max(1, Math.min(9999, parseInt(q.value, 10) || 1)); qSave(l); } };
      var rm = el("button", "ql-rm", "Remove"); rm.type = "button"; rm.setAttribute("aria-label", "Remove " + it.name);
      rm.onclick = function () { var l = qLoad(); l.splice(idx, 1); qSave(l); };
      row.append(name, q, rm); qbody.appendChild(row);
    });
    var fl = $("qlFormList");
    if (fl) {
      fl.innerHTML = "";
      fl.style.display = n ? "" : "none";
      if (n) {
        fl.appendChild(el("strong", null, "Items from your quote list (" + n + "):"));
        var ul = el("ul"); list.forEach(function (it) { ul.appendChild(el("li", null, it.qty + " × " + it.name)); }); fl.appendChild(ul);
        var ed = el("button", "ql-edit", "Edit list"); ed.type = "button"; ed.onclick = qOpen; fl.appendChild(ed);
      }
    }
  }
  /* "Add to quote" control markup, used by catalog cards (and static item pages use the same data attributes). */
  function addControl(item) {
    var box = el("div", "ql-add");
    var q = el("input"); q.type = "number"; q.min = "1"; q.max = "9999"; q.value = "1"; q.setAttribute("data-ql-qty", ""); q.setAttribute("aria-label", "Quantity for " + item.name);
    var b = el("button", "ql-btn", "Add to quote"); b.type = "button";
    b.setAttribute("data-ql-add", ""); b.dataset.qlId = item.id; b.dataset.qlName = item.name; b.dataset.qlCat = item.cat || ""; if (item.url) b.dataset.qlUrl = item.url;
    box.append(q, b); return box;
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("[data-ql-add]");
    if (!b) return;
    e.preventDefault(); e.stopPropagation();
    var box = b.closest(".ql-add"), qi = box && box.querySelector("[data-ql-qty]");
    qAdd({ id: b.dataset.qlId, name: b.dataset.qlName, cat: b.dataset.qlCat, url: b.dataset.qlUrl }, qi ? qi.value : 1);
    var t = b.textContent; b.textContent = "Added ✓"; b.disabled = true;
    setTimeout(function () { b.textContent = t; b.disabled = false; }, 1400);
    if (pill) { pill.classList.remove("bump"); void pill.offsetWidth; pill.classList.add("bump"); }
  }, true);

  /* ---------- Catalog (homepage) ---------- */
  var cats = $("cats"), grid = $("grid"), panel = $("panel"), pt = $("pt");
  function openPanel(title) { if (!panel) return; pt.textContent = title; panel.classList.add("on"); panel.scrollIntoView({ behavior: "smooth", block: "start" }); }
  function card(it, opts) {
    opts = opts || {};
    var d = el("div", "p");
    var im = el("img"); im.loading = "lazy"; im.src = img(opts.img || it.img); im.alt = it.name + " rental";
    d.append(im, el("b", null, it.name));
    if (SPECS[it.name]) { var sp = el("span"); sp.innerHTML = SPECS[it.name]; d.appendChild(sp); }
    else if (opts.showCat) d.appendChild(el("span", null, LABELS[it.cat]));
    if (!opts.noAdd) d.appendChild(addControl({ id: it.slug, name: it.name, cat: LABELS[it.cat] }));
    if (!opts.gallery && GALLERIES[it.name]) {
      d.style.cursor = "pointer";
      d.onclick = function (e) {
        if (e.target.closest(".ql-add,a")) return;
        grid.innerHTML = "";
        GALLERIES[it.name].forEach(function (g, i) { grid.appendChild(card(it, { img: g, gallery: true, noAdd: i > 0 })); });
        openPanel(it.name);
      };
    }
    return d;
  }
  function showCat(k) {
    if (!grid) return;
    grid.innerHTML = "";
    var list = itemsIn(k);
    if (k === "walls") list = list.slice().sort(function (a, b) { return (a.name === "Wall Panel System" ? 0 : 1) - (b.name === "Wall Panel System" ? 0 : 1); });
    list.forEach(function (it) { grid.appendChild(card(it)); });
    openPanel(LABELS[k]);
  }
  if (cats) {
    ORDER.forEach(function (k) {
      var list = CAT[k]; if (!list || !list.length) return;
      var t = el("div", "cat" + (k === "walls" ? " walls" : "")); t.tabIndex = 0;
      var im = el("img"); im.alt = LABELS[k];
      var src = list[0][1]; if (k === "walls") { var w = list.filter(function (r) { return r[0] === "Wall Panel System"; })[0]; if (w) src = w[1]; }
      im.src = img(src);
      t.append(im, el("strong", null, LABELS[k]));
      t.onclick = function () { showCat(k); };
      t.onkeydown = function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); showCat(k); } };
      cats.appendChild(t);
    });
    var LS = "https://rentallinenswatches.com/fabrics/texture/rattan/";
    var lt = el("div", "cat"); lt.tabIndex = 0;
    var li = el("img"); li.alt = "Linen Swatches"; li.src = "https://rentallinenswatches.com/wp-content/uploads/sites/45/2019/04/Rattan-Mint-797.jpg";
    lt.append(li, el("strong", null, "Linen Swatches"));
    lt.onclick = function () { location.href = LS; };
    lt.onkeydown = function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); location.href = LS; } };
    cats.appendChild(lt);
    if (!Object.keys(CAT).length) cats.innerHTML = "<p>Catalog failed to load. Call 917-536-1245.</p>";
  }

  /* ---------- Search ---------- */
  var searchForm = $("searchForm"), searchInput = $("searchInput"), resetSearch = $("resetSearch");
  if (searchForm && searchInput && grid) searchForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var q = searchInput.value.trim().toLowerCase(); if (!q) return;
    grid.innerHTML = "";
    var hits = [];
    ORDER.forEach(function (k) { itemsIn(k).forEach(function (it) { if ((it.name + " " + LABELS[k]).toLowerCase().indexOf(q) > -1) hits.push(it); }); });
    hits.forEach(function (it) { grid.appendChild(card(it, { showCat: true })); });
    if (!hits.length) grid.appendChild(el("p", "empty", "No rentals match that search."));
    if (resetSearch) resetSearch.classList.add("on");
    openPanel("Search Results");
  });
  if (resetSearch) resetSearch.addEventListener("click", function () { if (searchInput) searchInput.value = ""; resetSearch.classList.remove("on"); if (panel) panel.classList.remove("on"); if (grid) grid.innerHTML = ""; });

  /* ---------- Quote form ---------- */
  var quoteForm = $("quoteForm");
  if (quoteForm) {
    var ta = $("x");
    if (ta && !$("qlFormList")) { var fl = el("div", "ql-form-list"); fl.id = "qlFormList"; fl.style.display = "none"; ta.parentNode.insertBefore(fl, ta); }
    quoteForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var btn = quoteForm.querySelector("[type=submit]");
      function v(id) { var f = $(id); return f ? f.value : ""; }
      var list = qLoad();
      var payload = { name: v("n"), email: v("e"), phone: v("p"), date: v("d"), location: v("l"), needs: v("x"), _subject: "ZNC Solutions website quote request", _template: "table", _captcha: "false" };
      if (list.length) { payload.quote_list = qText(list); payload.quote_list_count = String(list.length); }
      window.__lastQuotePayload = payload;
      btn.disabled = true; btn.textContent = "Sending…";
      fetch("https://formsubmit.co/ajax/info@zncsolutions.com", { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(payload) })
        .then(function (r) { if (!r.ok) throw 0; $("formStatus").textContent = "Thanks. We got your quote request and will call or email you back."; quoteForm.reset(); if (list.length) qSave([]); })
        .catch(function () { $("formStatus").textContent = "Could not send. Call 917-536-1245 or email info@zncsolutions.com."; })
        .then(function () { btn.disabled = false; btn.textContent = "Send Quote Request"; });
    });
  }

  qBuildUI(); qRender();
  window.addEventListener("storage", function (e) { if (e.key === QKEY) qRender(); });

  /* ---------- Footer year + hero rotation ---------- */
  var y = $("year"); if (y) y.textContent = new Date().getFullYear();
  var hero = document.querySelector(".hero img");
  if (hero && ["/", "/index.html", "/wall-panels.html"].indexOf(location.pathname) > -1) {
    var M = "https://static.wixstatic.com/media/", slides = [[M + "e06c28_bbba71eec96f4bec842418a79189b67e~mv2.jpg", "Wooden bar and event rental setting by ZNC Solutions"], [M + "e06c28_fe3a504cd4644d88b0ecd0c3ee54a27b~mv2.png", "Gallery walls with lighting by ZNC Solutions"], [M + "e06c28_fe2f6271d2474dd88315d9e3ce490e91~mv2.png", "Modular gallery wall panels by ZNC Solutions"], [M + "e06c28_8a2059f55dec4eea82cc6e43ab48fc60~mv2.png", "Gallery wall panels set up by ZNC Solutions"], [M + "e06c28_43074cfa6677487b8115be11d9908bfa~mv2.jpg", "Stationary gallery walls by ZNC Solutions"]];
    slides.forEach(function (s) { new Image().src = s[0]; });
    var si = 0;
    setInterval(function () { si = (si + 1) % slides.length; hero.style.opacity = "0"; setTimeout(function () { hero.src = slides[si][0]; hero.alt = slides[si][1]; hero.style.opacity = "1"; }, 400); }, 5000);
  }
})();

/* Seasonal snow (holiday 2026). Removed with the SEASONAL flag in scripts/site-chrome.mjs. Runs after load; skipped for reduced motion. */
(function () {
  var d = document, h = d.documentElement;
  if (!h.classList.contains("seasonal") || !window.matchMedia || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  function go() {
    var n = innerWidth < 600 ? 16 : 34, box = d.createElement("div"), f = d.createDocumentFragment();
    box.className = "s-snow"; box.setAttribute("aria-hidden", "true");
    for (var i = 0; i < n; i++) {
      var s = d.createElement("i"), z = 3 + Math.random() * 5;
      s.style.cssText = "left:" + (Math.random() * 100).toFixed(1) + "%;width:" + z.toFixed(1) + "px;height:" + z.toFixed(1) + "px;opacity:" + (0.35 + Math.random() * 0.5).toFixed(2) +
        ";animation-duration:" + (9 + Math.random() * 9).toFixed(1) + "s;animation-delay:-" + (Math.random() * 18).toFixed(1) + "s";
      f.appendChild(s);
    }
    box.appendChild(f); d.body.appendChild(box);
  }
  if (d.readyState === "complete") setTimeout(go, 300); else addEventListener("load", function () { setTimeout(go, 300); });
})();

(function () {
  "use strict";

  document.getElementById("year").textContent = new Date().getFullYear();

  // --- Theme toggle -------------------------------------------------
  var root = document.documentElement;
  var toggle = document.getElementById("themeToggle");
  var stored = localStorage.getItem("theme");
  if (stored) root.setAttribute("data-theme", stored);

  function currentTheme() {
    if (root.getAttribute("data-theme")) return root.getAttribute("data-theme");
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function syncToggle() {
    var dark = currentTheme() === "dark";
    toggle.setAttribute("aria-pressed", String(dark));
    toggle.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
  }

  toggle.addEventListener("click", function () {
    var next = currentTheme() === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    syncToggle();
  });
  syncToggle();

  // --- Animate stat bars in once visible -----------------------------
  var bars = document.querySelectorAll(".stat[data-pct]");
  if ("IntersectionObserver" in window && bars.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          var pct = parseFloat(el.dataset.pct);
          var max = parseFloat(el.dataset.max) || 100;
          var fill = el.querySelector(".stat__bar span");
          if (fill) fill.style.width = Math.min(100, (pct / max) * 100) + "%";
          observer.unobserve(el);
        });
      },
      { threshold: 0.4 }
    );
    bars.forEach(function (el) { observer.observe(el); });
  } else {
    bars.forEach(function (el) {
      var pct = parseFloat(el.dataset.pct);
      var max = parseFloat(el.dataset.max) || 100;
      var fill = el.querySelector(".stat__bar span");
      if (fill) fill.style.width = Math.min(100, (pct / max) * 100) + "%";
    });
  }
})();

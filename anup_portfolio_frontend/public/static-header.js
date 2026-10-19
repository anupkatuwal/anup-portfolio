// Wires up the build-time project pages (dist/projects/*), which ship no
// React: theme toggle, mobile menu, scrolled top bar, scroll progress and the
// status-bar clock. Mirrors src/lib/theme.js, TopBar.jsx and StatusBar.jsx.
// Same-origin file: the CSP allows only one inline script (the no-flash
// theme script in each page's <head>, by hash).
(function () {
  var root = document.documentElement;
  var colors = { dark: "#0A0C09", light: "#F7F8F3" };

  function effective() {
    var set = root.getAttribute("data-theme");
    if (set === "light" || set === "dark") return set;
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  }

  var toggle = document.querySelector(".theme-toggle");
  function paint() {
    if (!toggle) return;
    var dark = effective() === "dark";
    toggle.querySelector(".icon-sun").toggleAttribute("hidden", !dark);
    toggle.querySelector(".icon-moon").toggleAttribute("hidden", dark);
    toggle.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
  }
  paint();
  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = effective() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      var metas = document.querySelectorAll('meta[name="theme-color"]');
      for (var i = 0; i < metas.length; i++) metas[i].setAttribute("content", colors[next]);
      try {
        window.localStorage.setItem("theme", next);
      } catch {
        // not persisted, but the switch still works for this visit
      }
      paint();
    });
  }

  var menu = document.querySelector(".menu-toggle");
  var drawer = document.getElementById("mobile-nav");
  if (menu && drawer) {
    menu.addEventListener("click", function () {
      var open = !drawer.classList.contains("open");
      drawer.classList.toggle("open", open);
      menu.setAttribute("aria-expanded", String(open));
      menu.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
  }

  var bar = document.querySelector(".topbar");
  var line = document.querySelector(".scroll-progress");
  function onScroll() {
    var y = window.scrollY;
    if (bar) bar.classList.toggle("is-scrolled", y > 8);
    var max = document.documentElement.scrollHeight - window.innerHeight;
    if (line) line.style.transform = "scaleX(" + (max > 0 ? Math.min(y / max, 1) : 0) + ")";
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  var time = document.querySelector(".status-time time");
  function tick() {
    if (!time) return;
    time.textContent = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kathmandu", hour: "2-digit", minute: "2-digit",
    }).format(new Date());
  }
  tick();
  window.setInterval(tick, 30000);
})();

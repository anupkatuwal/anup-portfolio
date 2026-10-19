// Wires up the theme toggle and the mobile menu on the build-time project
// pages (dist/projects/*), which ship no React. Mirrors ThemeToggle.jsx and
// Navbar.jsx. Same-origin file, because the CSP rules out inline scripts.
(function () {
  var root = document.documentElement;
  var toggle = document.querySelector(".theme-toggle");
  var meta = document.querySelector('meta[name="theme-color"]');

  function apply(theme) {
    root.setAttribute("data-theme", theme);
    if (toggle) toggle.setAttribute("aria-pressed", String(theme === "dark"));
    if (meta) meta.setAttribute("content", theme === "dark" ? "#141414" : "#fafaf7");
  }

  apply(root.getAttribute("data-theme") === "dark" ? "dark" : "light");

  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      apply(next);
      try {
        window.localStorage.setItem("theme", next);
      } catch {
        // not persisted, but the switch still works for this visit
      }
    });
  }

  var menu = document.querySelector(".menu-button");
  var drawer = document.getElementById("mobile-nav");
  if (menu && drawer) {
    menu.addEventListener("click", function () {
      var open = !drawer.classList.contains("open");
      drawer.classList.toggle("open", open);
      menu.setAttribute("aria-expanded", String(open));
      menu.textContent = open ? "Close" : "Menu";
    });
  }
})();

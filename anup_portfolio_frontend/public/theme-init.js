// Sets data-theme on <html> before first paint, so a returning visitor who
// picked a theme never sees the other one flash in first. Loaded as a
// blocking <script src> in index.html's <head>; the CSP (script-src 'self')
// rules out an inline script. Keep the logic in step with ThemeToggle.jsx.
(function () {
  var theme;
  try {
    theme = window.localStorage.getItem("theme");
  } catch (e) {
    // storage blocked (private mode, strict cookie settings) — fall through
  }
  if (theme !== "light" && theme !== "dark") {
    theme = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  }
  document.documentElement.setAttribute("data-theme", theme);
  var meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", theme === "dark" ? "#03040a" : "#0a1f44");
})();

// Sets data-theme on <html> before first paint, so a returning visitor who
// picked dark mode never sees the light theme flash in first. Loaded as a
// blocking <script src> in index.html's <head>; the CSP (script-src 'self')
// rules out an inline script. Keep the logic in step with ThemeToggle.jsx.
// Light is the default for everyone; dark only once the visitor chose it.
(function () {
  var theme = "light";
  try {
    if (window.localStorage.getItem("theme") === "dark") theme = "dark";
  } catch {
    // storage blocked (private mode, strict cookie settings) — keep light
  }
  document.documentElement.setAttribute("data-theme", theme);
  var meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", theme === "dark" ? "#141414" : "#fafaf7");
})();

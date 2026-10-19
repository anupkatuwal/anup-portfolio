// Applies a saved theme before first paint, so a returning visitor never sees
// the other theme flash in. Loaded as a blocking <script src> in <head>; the
// CSP (script-src 'self') rules out an inline script. With no saved choice,
// data-theme stays unset and the CSS follows the system preference (dark if
// none). Keep in step with src/lib/theme.js.
(function () {
  var theme;
  try {
    theme = window.localStorage.getItem("theme");
  } catch {
    // storage blocked (private mode, strict cookie settings)
  }
  if (theme !== "light" && theme !== "dark") return;
  document.documentElement.setAttribute("data-theme", theme);
  var color = theme === "dark" ? "#0A0C09" : "#F7F8F3";
  var metas = document.querySelectorAll('meta[name="theme-color"]');
  for (var i = 0; i < metas.length; i++) metas[i].setAttribute("content", color);
})();

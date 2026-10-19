// src/lib/theme.js — theme state shared by the toggle and the command palette.
// Order (DESIGN.md §5.13): saved choice → system preference → dark.
// The inline script from scripts/theme-init.mjs applies a saved choice before
// first paint; with no saved choice, data-theme stays unset and the CSS
// follows the system.

const THEME_COLOR = { dark: "#0A0C09", light: "#F7F8F3" };

function saved() {
  try {
    const t = window.localStorage.getItem("theme");
    return t === "light" || t === "dark" ? t : null;
  } catch {
    return null; // storage blocked (private mode, strict cookie settings)
  }
}

export function currentTheme() {
  if (typeof document === "undefined") return "dark"; // build-time render
  const set = document.documentElement.getAttribute("data-theme");
  if (set === "light" || set === "dark") return set;
  const stored = saved();
  if (stored) return stored;
  return window.matchMedia?.("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

export function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  document
    .querySelectorAll('meta[name="theme-color"]')
    .forEach((m) => m.setAttribute("content", THEME_COLOR[theme]));
  try {
    window.localStorage.setItem("theme", theme);
  } catch {
    /* not persisted, but the switch still works for this visit */
  }
  window.dispatchEvent(new CustomEvent("themechange", { detail: theme }));
}

export function toggleTheme() {
  applyTheme(currentTheme() === "dark" ? "light" : "dark");
}

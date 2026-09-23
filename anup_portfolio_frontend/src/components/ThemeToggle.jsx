import React, { useEffect, useState } from "react";

// public/theme-init.js has already set data-theme before first paint, so
// start from that rather than recomputing it. Storage access is wrapped:
// it throws when blocked (Safari private mode, strict cookie settings), and
// an uncaught throw here would blank the whole page.
function initialTheme() {
  const set = document.documentElement.getAttribute("data-theme");
  if (set === "light" || set === "dark") return set;
  try {
    const stored = window.localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    /* storage blocked — fall back to the OS preference */
  }
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

export function ThemeToggle() {
  const [theme, setTheme] = useState(initialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", theme === "dark" ? "#03040a" : "#0a1f44");
  }, [theme]);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    try {
      window.localStorage.setItem("theme", next);
    } catch {
      /* not persisted, but the switch still works for this visit */
    }
  };

  const label = theme === "dark" ? "Switch to light theme" : "Switch to dark theme";

  return (
    <button className="icon-button" type="button" onClick={toggle} aria-label={label} title={label}>
      <span aria-hidden="true">{theme === "dark" ? "☀️" : "🌙"}</span>
    </button>
  );
}

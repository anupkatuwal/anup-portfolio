import React, { useEffect, useState } from "react";

// Keep in step with public/theme-init.js.
const THEME_COLOR = { light: "#fafaf7", dark: "#141414" };

// public/theme-init.js has already set data-theme before first paint, so
// start from that rather than recomputing it. Storage access is wrapped:
// it throws when blocked (Safari private mode, strict cookie settings), and
// an uncaught throw here would blank the whole page. Light is the default —
// dark only applies once the visitor has chosen it.
function initialTheme() {
  const set = document.documentElement.getAttribute("data-theme");
  if (set === "light" || set === "dark") return set;
  try {
    if (window.localStorage.getItem("theme") === "dark") return "dark";
  } catch {
    /* storage blocked — use the default */
  }
  return "light";
}

export function ThemeToggle() {
  const [theme, setTheme] = useState(initialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", THEME_COLOR[theme]);
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

  return (
    <button
      className="text-button theme-toggle"
      type="button"
      onClick={toggle}
      aria-pressed={theme === "dark"}
    >
      Dark mode
    </button>
  );
}

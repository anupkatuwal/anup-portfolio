import React, { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { currentTheme, toggleTheme } from "../lib/theme";

function subscribe(onChange) {
  window.addEventListener("themechange", onChange);
  return () => window.removeEventListener("themechange", onChange);
}

export function ThemeToggle() {
  // "dark" during the build-time render and hydration, then the real theme
  // (which the CSS already shows). Follows the command palette's toggle too.
  const theme = useSyncExternalStore(subscribe, currentTheme, () => "dark");

  const label = theme === "dark" ? "Switch to light theme" : "Switch to dark theme";

  return (
    <button className="icon-btn" type="button" onClick={toggleTheme} aria-label={label} title={label}>
      {theme === "dark" ? (
        <Sun size={18} strokeWidth={1.5} aria-hidden="true" />
      ) : (
        <Moon size={18} strokeWidth={1.5} aria-hidden="true" />
      )}
    </button>
  );
}

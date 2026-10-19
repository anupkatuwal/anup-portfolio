import React, { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { currentTheme, toggleTheme } from "../lib/theme";

export function ThemeToggle() {
  const [theme, setTheme] = useState(currentTheme);

  // The command palette can switch the theme too; follow it.
  useEffect(() => {
    const sync = () => setTheme(currentTheme());
    window.addEventListener("themechange", sync);
    return () => window.removeEventListener("themechange", sync);
  }, []);

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

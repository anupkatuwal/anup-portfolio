import React, { useEffect, useState } from "react";

export function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    const stored = window.localStorage.getItem("theme");
    if (stored) return stored;
    return window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    window.localStorage.setItem("theme", next);
  };

  return (
    <button className="icon-button" type="button" onClick={toggle}>
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}

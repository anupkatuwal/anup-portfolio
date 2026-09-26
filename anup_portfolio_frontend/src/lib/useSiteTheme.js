// src/lib/useSiteTheme.js
// The site's light/dark choice lives on <html data-theme> (set by
// public/theme-init.js, flipped by ThemeToggle). Astryx's <Theme> takes a
// `mode` prop instead, so this mirrors the attribute into React state.
import { useEffect, useState } from "react";

function read() {
  const t = document.documentElement.getAttribute("data-theme");
  return t === "light" || t === "dark" ? t : "system";
}

export function useSiteTheme() {
  const [mode, setMode] = useState(read);

  useEffect(() => {
    const observer = new MutationObserver(() => setMode(read()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  return mode;
}

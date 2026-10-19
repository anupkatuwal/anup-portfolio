// src/lib/nav.js
// Single source of truth for the primary navigation, shared by the top bar,
// the command palette and the build-time prerender scripts. Every link is a
// homepage section, so on a sub-page like /research it needs a "/" prefix.
export const NAV_LINKS = [
  { label: "About",   id: "about" },
  { label: "Work",    id: "work" },
  { label: "Stack",   id: "stack" },
  { label: "Log",     id: "log" },
  { label: "Contact", id: "contact" },
];

export function sectionHref(id, isHome) {
  return isHome ? `#${id}` : `/#${id}`;
}

// "/" and "/index.html" are the homepage; everything else is a sub-page.
export function currentPath() {
  const path = window.location.pathname.replace(/\/index\.html$/, "/");
  return path.length > 1 ? path.replace(/\/+$/, "") : "/";
}

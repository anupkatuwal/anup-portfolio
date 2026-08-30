// src/lib/nav.js
// Single source of truth for the primary navigation, shared by the Navbar,
// the footer and the build-time prerender scripts.
//
// `hash` links point at a section of the homepage, so they need the "/" prefix
// when the visitor is on /research or /blog. `page` links are standalone routes.
export const NAV_LINKS = [
  { label: "Home",       href: "#top",         kind: "hash" },
  { label: "Research",   href: "/research",    kind: "page" },
  { label: "Projects",   href: "#projects",    kind: "hash" },
  { label: "Experience", href: "#experience",  kind: "hash" },
  { label: "Blog",       href: "/blog",        kind: "page" },
  { label: "Contact",    href: "#contact",     kind: "hash" },
];

// Resolve a link for the page it's being rendered on. On the homepage a hash
// link stays a plain in-page anchor; anywhere else it has to jump home first.
export function resolveHref(link, isHome) {
  if (link.kind === "page") return link.href;
  return isHome ? link.href : `/${link.href}`;
}

// "/" and "/index.html" are the homepage; everything else is a sub-page.
export function currentPath() {
  const path = window.location.pathname.replace(/\/index\.html$/, "/");
  return path.length > 1 ? path.replace(/\/+$/, "") : "/";
}

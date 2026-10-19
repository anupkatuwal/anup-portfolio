// Shared build-time markup for the static pages: the top bar and the status
// bar, in the same markup and classes React renders (TopBar.jsx,
// StatusBar.jsx), so a prerendered page looks the same before and after
// JavaScript runs. Icons are Lucide, rendered to SVG strings here.
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Menu, Moon, Sun } from "lucide-react";
import { NAV_LINKS, sectionHref } from "../src/lib/nav.js";
import { SITE } from "../src/data/content.js";

export const esc = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;")
           .replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const icon = (Icon, attrs = {}) =>
  renderToStaticMarkup(createElement(Icon, { size: 18, strokeWidth: 1.5, "aria-hidden": "true", ...attrs }));

// `staticPage` adds what a page without React needs: a theme toggle and a
// menu button that public/static-header.js wires up (no command palette).
export function headerHtml(path = "/", { staticPage = false } = {}) {
  const isHome = path === "/";
  const links = NAV_LINKS
    .map((l) => `<li><a class="nav-link" href="${sectionHref(l.id, isHome)}">${esc(l.label)}</a></li>`)
    .join("");
  return `
      <header class="topbar">
        <div class="container topbar-inner">
          <a href="${isHome ? "#top" : "/"}" class="brand">${esc(SITE.handle)}<span class="cursor" aria-hidden="true"></span></a>
          <nav class="topbar-nav" aria-label="Main navigation"><ul>${links}</ul></nav>
          <div class="topbar-actions">
            <button class="icon-btn theme-toggle" type="button" aria-label="Toggle theme">${icon(Sun, { className: "icon-sun" })}${icon(Moon, { className: "icon-moon", hidden: true })}</button>
            ${staticPage ? `<button class="icon-btn only-mobile menu-toggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-nav">${icon(Menu)}</button>` : ""}
          </div>
        </div>
        <span class="scroll-progress" aria-hidden="true"></span>
      </header>${staticPage ? `
      <nav id="mobile-nav" class="mobile-nav" aria-label="Mobile navigation"><ul class="container">${links}</ul></nav>` : ""}`;
}

export function footerHtml() {
  const host = SITE.siteUrl.replace(/^https?:\/\//, "");
  const available = SITE.available !== false;
  return `
      <footer class="statusbar">
        <div class="container statusbar-inner">
          <p class="status${available ? " is-available" : ""}"><span class="status-dot" aria-hidden="true"></span>${available ? "available for work" : "heads down"}</p>
          <p class="status-time">Kathmandu · NPT UTC+5:45 · <time>--:--</time></p>
          <p>© ${new Date().getFullYear()}<span class="status-host"> · ${esc(host)}</span></p>
        </div>
      </footer>`;
}

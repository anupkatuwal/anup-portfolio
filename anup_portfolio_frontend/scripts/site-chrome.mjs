// Shared build-time markup for the static pages: the header and footer, in
// the same markup and classes React renders (Navbar.jsx, Footer.jsx), so a
// prerendered page looks the same before and after JavaScript runs.
import { NAV_LINKS, resolveHref } from "../src/lib/nav.js";

export const esc = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;")
           .replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function headerHtml(path = "/") {
  const isHome = path === "/";
  const link = (l) => {
    const current = l.kind === "page" && l.href === path ? ' aria-current="page"' : "";
    return `<li><a class="nav-link" href="${resolveHref(l, isHome)}"${current}>${esc(l.label)}</a></li>`;
  };
  const links = NAV_LINKS.map(link).join("");
  return `
      <header class="site-header">
        <div class="container header-inner">
          <a href="${isHome ? "#top" : "/"}" class="site-name">Anup Katuwal</a>
          <nav class="site-nav" aria-label="Main navigation"><ul>${links}</ul></nav>
          <button class="text-button theme-toggle" type="button" aria-pressed="false">Dark mode</button>
          <button class="text-button menu-button" type="button" aria-expanded="false" aria-controls="mobile-nav">Menu</button>
        </div>
        <nav id="mobile-nav" class="mobile-nav" aria-label="Mobile navigation">
          <ul class="container">${links}<li><a class="nav-link" href="/resume.pdf">Resume (PDF)</a></li></ul>
        </nav>
      </header>`;
}

export function footerHtml() {
  return `
      <footer class="site-footer">
        <div class="container">
          <p>© ${new Date().getFullYear()} Anup Katuwal · <a href="mailto:contact@anup-katuwal.com.np">Email</a> · <a href="https://www.linkedin.com/in/anupkatuwal1989">LinkedIn</a> · <a href="https://github.com/anupkatuwal">GitHub</a></p>
        </div>
      </footer>`;
}

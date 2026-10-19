// Build-time prerender for /research. It is written as a real file in dist/,
// so Vercel serves it from the filesystem (ahead of the SPA rewrite) with its
// own <title>, description, canonical, Open Graph tags and JSON-LD — and with
// the page's real React markup (src/entry-server.jsx) already in the HTML,
// which main.jsx hydrates instead of re-rendering.
//
// The built dist/index.html is used as the shell, so the hashed CSS/JS bundles
// are picked up automatically. Runs after both `vite build` passes and BEFORE
// prerender-home.mjs, which consumes the same #root marker in dist/index.html.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { RESEARCH } from "../src/data/content.js";
import { esc } from "./site-chrome.mjs";
import { render as renderApp } from "../dist-ssr/entry-server.js";

const dist = join(dirname(fileURLToPath(import.meta.url)), "..", "dist");
const SITE_URL = (process.env.VITE_SITE_URL || "https://anup-katuwal.com.np").replace(/\/+$/, "");
const AUTHOR = "Anup Katuwal";

const clamp = (s, n = 158) => {
  const t = String(s).replace(/\s+/g, " ").trim();
  return t.length <= n ? t : `${t.slice(0, t.lastIndexOf(" ", n - 1)).trim()}…`;
};

const shell = readFileSync(join(dist, "index.html"), "utf8");
if (!shell.includes('<div id="root"><!--ssg--></div>')) {
  console.error("prerender-pages: <!--ssg--> marker not found in dist/index.html — refusing to write.");
  process.exit(1);
}

// Swap the shell's homepage metadata for this page's, then inject the content.
function render({ path, title, description, jsonld, type = "website" }) {
  const body = renderApp(path);
  const url = `${SITE_URL}${path}`;
  const head = [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="${type}" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta name="twitter:title" content="${esc(title)}" />`,
    `<meta name="twitter:description" content="${esc(description)}" />`,
    jsonld ? `<script type="application/ld+json">${JSON.stringify(jsonld)}</script>` : "",
  ].filter(Boolean).join("\n    ");

  let html = shell
    // Drop the homepage's title, description, canonical, OG/Twitter title+desc
    // and its ProfilePage JSON-LD; everything else (icons, fonts, bundles) stays.
    .replace(/<title>[\s\S]*?<\/title>/, "%%HEAD%%")
    .replace(/<meta\s+name="description"[\s\S]*?\/>/, "")
    .replace(/<link rel="canonical"[^>]*>/, "")
    .replace(/<meta property="og:(title|description|url|type)"[\s\S]*?\/>/g, "")
    .replace(/<meta name="twitter:(title|description)"[\s\S]*?\/>/g, "")
    .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, "")
    .replace("<!-- Structured data: Person + WebSite + ProfilePage (linked @graph) -->", "")
    .replace("%%HEAD%%", head)
    .replace('<div id="root"><!--ssg--></div>', `<div id="root" data-ssr>${body}</div>`);

  const out = join(dist, path.replace(/^\//, ""));
  mkdirSync(out, { recursive: true });
  writeFileSync(join(out, "index.html"), html);
  return url;
}

const written = [];

// ── /research ────────────────────────────────────────────────────────────────
written.push(
  render({
    path: "/research",
    title: `Research — ${RESEARCH.shortTitle}: ${RESEARCH.title} | ${AUTHOR}`,
    description: clamp(RESEARCH.abstract),
    type: "article",
    jsonld: {
      "@context": "https://schema.org",
      "@type": "ScholarlyArticle",
      headline: RESEARCH.title,
      abstract: RESEARCH.abstract,
      url: `${SITE_URL}/research`,
      keywords: RESEARCH.keywords.join(", "),
      author: { "@type": "Person", name: AUTHOR, url: `${SITE_URL}/` },
      ...(RESEARCH.thesisUrl ? { sameAs: RESEARCH.thesisUrl } : {}),
    },
  })
);

console.log(`prerender-pages: wrote ${written.length} page(s) — ${written.map((u) => u.replace(SITE_URL, "")).join(", ")}`);

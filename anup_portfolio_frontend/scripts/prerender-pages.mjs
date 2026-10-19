// Build-time prerender for /research. It is written as a real file in dist/,
// so Vercel serves it from the filesystem (ahead of the SPA rewrite) with its
// own <title>,
// description, canonical, Open Graph tags and JSON-LD — and with the page's
// content already in the HTML, before any JavaScript runs.
//
// The built dist/index.html is used as the shell, so the hashed CSS/JS bundles
// are picked up automatically and React mounts on top exactly as it does on
// the homepage. Runs after `vite build` and BEFORE prerender-home.mjs, which
// consumes the same <!--ssg--> marker in dist/index.html.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { RESEARCH } from "../src/data/content.js";
import { esc, headerHtml, footerHtml } from "./site-chrome.mjs";

const dist = join(dirname(fileURLToPath(import.meta.url)), "..", "dist");
const SITE_URL = (process.env.VITE_SITE_URL || "https://anup-katuwal.com.np").replace(/\/+$/, "");
const AUTHOR = "Anup Katuwal";

const clamp = (s, n = 158) => {
  const t = String(s).replace(/\s+/g, " ").trim();
  return t.length <= n ? t : `${t.slice(0, t.lastIndexOf(" ", n - 1)).trim()}…`;
};

const shell = readFileSync(join(dist, "index.html"), "utf8");
if (!shell.includes("<!--ssg-->")) {
  console.error("prerender-pages: <!--ssg--> marker not found in dist/index.html — refusing to write.");
  process.exit(1);
}

// Swap the shell's homepage metadata for this page's, then inject the content.
function render({ path, title, description, body, jsonld, type = "website" }) {
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
    .replace("<!--ssg-->", `<a class="skip-link" href="#main">Skip to content</a>${headerHtml(path)}\n      <main id="main" class="page">${body}</main>${footerHtml()}`);

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
    body: `
        <article class="container article">
          <nav class="crumb" aria-label="Breadcrumb"><a class="link" href="/">Home</a> <span aria-hidden="true">/</span> <span>Research</span></nav>
          <header class="article-head">
            <p class="label"><span class="idx">thesis</span> / ${esc(RESEARCH.shortTitle)}</p>
            <h1 class="article-title">${esc(RESEARCH.title)}</h1>
            <p class="article-meta">${esc(AUTHOR)} · ${esc(RESEARCH.venue)} · ${esc(RESEARCH.period)}</p>
            <ul class="chips" aria-label="Keywords">${RESEARCH.keywords.map((k) => `<li class="chip">${esc(k)}</li>`).join("")}</ul>
            ${RESEARCH.thesisUrl ? `<p class="article-actions"><a class="btn btn-primary" href="${esc(RESEARCH.thesisUrl)}">Read the full thesis ↗</a></p>` : ""}
          </header>
          <section class="article-section"><h2>Abstract</h2><p>${esc(RESEARCH.abstract)}</p></section>
          <section class="article-section"><h2>Methodology</h2>
            <ol class="method-list">${RESEARCH.methodology.map((m) => `<li class="method-step"><span class="method-num">${esc(m.step)}</span><div><h3>${esc(m.title)}</h3><p>${esc(m.detail)}</p></div></li>`).join("")}</ol>
          </section>
          <section class="article-section"><h2>Results</h2>
            ${RESEARCH.charts.map((c) => `<p>${esc(c.title)}: ${esc(
              (c.grouped
                ? c.bars.map((b) => `${b.label} ${b.before} before, ${b.after} after`)
                : c.bars.map((b) => `${b.label} ${b.value}`)
              ).join("; ")
            )}.</p>`).join("")}
            <ul class="bullets">${RESEARCH.results.map((r) => `<li>${esc(r)}</li>`).join("")}</ul>
          </section>
          <section class="article-section"><h2>References</h2>
            <ol class="ieee-list">${RESEARCH.references.map((r, i) => `<li class="ieee-item"><span class="ieee-num">[${i + 1}]</span><span>${esc(r)}</span></li>`).join("")}</ol>
          </section>
        </article>`,
  })
);

console.log(`prerender-pages: wrote ${written.length} page(s) — ${written.map((u) => u.replace(SITE_URL, "")).join(", ")}`);

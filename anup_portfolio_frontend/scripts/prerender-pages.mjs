// Build-time prerender for the standalone routes: /research, /blog and every
// /blog/<slug>. Each one is written as a real file in dist/, so Vercel serves
// it from the filesystem (ahead of the SPA rewrite) with its own <title>,
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
import { RESEARCH, BLOG_POSTS } from "../src/data/content.js";

const dist = join(dirname(fileURLToPath(import.meta.url)), "..", "dist");
const SITE_URL = (process.env.VITE_SITE_URL || "https://anup-katuwal.com.np").replace(/\/+$/, "");
const AUTHOR = "Anup Katuwal";

const esc = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;")
           .replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const clamp = (s, n = 158) => {
  const t = String(s).replace(/\s+/g, " ").trim();
  return t.length <= n ? t : `${t.slice(0, t.lastIndexOf(" ", n - 1)).trim()}…`;
};

const shell = readFileSync(join(dist, "index.html"), "utf8");
if (!shell.includes("<!--ssg-->")) {
  console.error("prerender-pages: <!--ssg--> marker not found in dist/index.html — refusing to write.");
  process.exit(1);
}

const nav = `
      <header class="navbar">
        <div class="navbar-inner">
          <a href="/" class="navbar-brand"><span class="brand-mark"><span>AK</span></span><span class="brand-text">Anup Katuwal</span></a>
          <nav class="navbar-nav" aria-label="Main navigation">
            <a href="/#top" class="navbar-link">Home</a>
            <a href="/research" class="navbar-link">Research</a>
            <a href="/#projects" class="navbar-link">Projects</a>
            <a href="/#experience" class="navbar-link">Experience</a>
            <a href="/blog" class="navbar-link">Blog</a>
            <a href="/#contact" class="navbar-link">Contact</a>
          </nav>
        </div>
      </header>`;

const footer = `
      <footer><p>© ${new Date().getFullYear()} ${AUTHOR} · <a href="mailto:contact@anup-katuwal.com.np">Contact</a> · <a href="https://www.linkedin.com/in/anupkatuwal1989">LinkedIn</a> · <a href="https://github.com/anupkatuwal">GitHub</a></p><p>“Knowledge applied through technology.”</p></footer>`;

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
    .replace("<!--ssg-->", `${nav}\n      <main>${body}</main>${footer}`);

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
        <article class="container paper">
          <h1 class="paper-title">${esc(RESEARCH.title)}</h1>
          <p class="paper-meta">${esc(AUTHOR)} · ${esc(RESEARCH.venue)} · ${esc(RESEARCH.period)}</p>
          <p><a href="${esc(RESEARCH.thesisUrl)}">Read Full Thesis</a></p>
          <h2>Abstract</h2>
          <p>${esc(RESEARCH.abstract)}</p>
          <h2>Methodology</h2>
          <ol>${RESEARCH.methodology.map((m) => `<li><strong>${esc(m.title)}</strong> — ${esc(m.detail)}</li>`).join("")}</ol>
          <h2>Results</h2>
          <ul>${RESEARCH.results.map((r) => `<li>${esc(r)}</li>`).join("")}</ul>
          ${RESEARCH.charts.map((c) => `<p>${esc(c.title)}: ${esc(
            (c.grouped
              ? c.bars.map((b) => `${b.label} ${b.before} before, ${b.after} after`)
              : c.bars.map((b) => `${b.label} ${b.value}`)
            ).join("; ")
          )}.</p>`).join("")}
          <h2>References</h2>
          <ol>${RESEARCH.references.map((r) => `<li>${esc(r)}</li>`).join("")}</ol>
        </article>`,
  })
);

// ── /blog and each post ──────────────────────────────────────────────────────
const posts = [...BLOG_POSTS].sort((a, b) => (a.date < b.date ? 1 : -1));

written.push(
  render({
    path: "/blog",
    title: `Blog — notes on data, NLP and ethics | ${AUTHOR}`,
    description: "Short technical posts by Anup Katuwal on data cleaning, AI ethics and feature engineering.",
    jsonld: {
      "@context": "https://schema.org",
      "@type": "Blog",
      name: `${AUTHOR} — Blog`,
      url: `${SITE_URL}/blog`,
      author: { "@type": "Person", name: AUTHOR, url: `${SITE_URL}/` },
      blogPost: posts.map((p) => ({
        "@type": "BlogPosting",
        headline: p.title,
        datePublished: p.date,
        url: `${SITE_URL}/blog/${p.slug}`,
        description: p.excerpt,
      })),
    },
    body: `
        <div class="container paper">
          <h1 class="paper-title">Blog</h1>
          ${posts.map((p) => `<article class="card">
            <h2 class="card-title"><a href="/blog/${esc(p.slug)}">${esc(p.title)}</a></h2>
            <p class="card-subtitle">${esc(p.date)} · ${esc(p.readingTime)} read · ${esc((p.tags || []).join(", "))}</p>
            <p>${esc(p.excerpt)}</p>
          </article>`).join("")}
        </div>`,
  })
);

for (const p of posts) {
  written.push(
    render({
      path: `/blog/${p.slug}`,
      title: `${p.title} | ${AUTHOR}`,
      description: clamp(p.excerpt),
      type: "article",
      jsonld: {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: p.title,
        datePublished: p.date,
        description: p.excerpt,
        url: `${SITE_URL}/blog/${p.slug}`,
        keywords: (p.tags || []).join(", "),
        author: { "@type": "Person", name: AUTHOR, url: `${SITE_URL}/` },
      },
      body: `
        <article class="container paper">
          <h1 class="paper-title">${esc(p.title)}</h1>
          <p class="paper-meta">${esc(p.date)} · ${esc(p.readingTime)} read</p>
          ${p.body.map((raw) =>
            raw.startsWith("## ") ? `<h2>${esc(raw.slice(3))}</h2>`
            : raw.startsWith("- ") ? `<ul><li>${esc(raw.slice(2))}</li></ul>`
            : `<p>${esc(raw)}</p>`).join("\n          ")}
          <p><a href="/blog">All posts</a></p>
        </article>`,
    })
  );
}

console.log(`prerender-pages: wrote ${written.length} page(s) — ${written.map((u) => u.replace(SITE_URL, "")).join(", ")}`);

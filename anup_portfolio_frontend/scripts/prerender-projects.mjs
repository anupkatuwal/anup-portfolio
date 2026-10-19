// Build-time prerender: emit a real, crawlable static HTML page per project at
// dist/projects/<id>/index.html, each with its own <title>, meta description,
// canonical, Open Graph, and JSON-LD (SoftwareSourceCode + BreadcrumbList).
// Runs after `vite build` (see package.json "build"), so it works on Vercel
// and in CI. Also rewrites dist/sitemap.xml to include the project URLs.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { PROJECTS, PROJECT_NOTES } from "../src/data/content.js";
import { liveLinkLabel, workItems } from "../src/lib/projects.js";
import { esc, headerHtml, footerHtml } from "./site-chrome.mjs";
import { themeInitTag } from "./theme-init.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const dist = join(root, "dist");

const SITE_URL = (process.env.VITE_SITE_URL || "https://anup-katuwal.com.np").replace(/\/+$/, "");
const AUTHOR = "Anup Katuwal";

const clamp = (s, n = 155) => {
  s = String(s).replace(/\s+/g, " ").trim();
  if (s.length <= n) return s;
  return s.slice(0, s.lastIndexOf(" ", n - 1)).trim() + "…";
};

// Reuse the hashed CSS bundle Vite just produced, so pages match the site.
const builtIndex = readFileSync(join(dist, "index.html"), "utf8");
const cssHref = (builtIndex.match(/href="(\/assets\/index-[^"]+\.css)"/) || [])[1] || "";

function pageHtml(p) {
  const url = `${SITE_URL}/projects/${p.id}`;
  const title = `${p.title} — ${AUTHOR}`;
  const desc = clamp(p.description);
  const stack = (p.tech || []).join(", ");

  const software = {
    "@type": "SoftwareSourceCode",
    name: p.title,
    description: p.description,
    url,
    ...(p.github ? { codeRepository: p.github } : {}),
    ...(stack ? { programmingLanguage: stack } : {}),
    author: { "@type": "Person", name: AUTHOR, url: `${SITE_URL}/` },
  };
  const breadcrumb = {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Work", item: `${SITE_URL}/#work` },
      { "@type": "ListItem", position: 3, name: p.title, item: url },
    ],
  };
  const jsonld = JSON.stringify({ "@context": "https://schema.org", "@graph": [software, breadcrumb] });

  const w = workItems(PROJECTS, PROJECT_NOTES).find((x) => x.id === p.id);
  const chips = w.stack.map((t) => `<li class="chip">${esc(t)}</li>`).join("");
  const links = [
    w.code && `<a class="btn btn-primary" href="${esc(w.code)}" target="_blank" rel="noreferrer">View code ↗</a>`,
    w.live && `<a class="btn btn-secondary" href="${esc(w.live)}" target="_blank" rel="noreferrer">${liveLinkLabel(w.live)} ↗</a>`,
    w.paper && `<a class="btn btn-secondary" href="${esc(w.paper)}">Read the paper</a>`,
  ].filter(Boolean).join("\n            ");

  // No app bundle here: main.jsx would mount the homepage over this page.
  // static-header.js wires the theme toggle, menu and status bar instead.
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="icon" type="image/png" href="/favicon.png" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <link rel="preload" href="/fonts/inter-tight-latin-600-normal.woff2" as="font" type="font/woff2" crossorigin />
    <link rel="preload" href="/fonts/inter-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin />
    <meta name="theme-color" content="#0A0C09" media="(prefers-color-scheme: dark)" />
    <meta name="theme-color" content="#F7F8F3" media="(prefers-color-scheme: light)" />
    ${themeInitTag()}
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(desc)}" />
    <meta name="author" content="${AUTHOR}" />
    <meta name="robots" content="index, follow, max-image-preview:large" />
    <link rel="canonical" href="${url}" />
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="${AUTHOR}" />
    <meta property="og:title" content="${esc(title)}" />
    <meta property="og:description" content="${esc(desc)}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${SITE_URL}/og.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(title)}" />
    <meta name="twitter:description" content="${esc(desc)}" />
    <meta name="twitter:image" content="${SITE_URL}/og.png" />
    <script type="application/ld+json">${jsonld}</script>
    ${cssHref ? `<link rel="stylesheet" href="${cssHref}" />` : ""}
    <script src="/static-header.js" defer></script>
  </head>
  <body>
    <a class="skip-link" href="#main">Skip to content</a>${headerHtml(`/projects/${p.id}`, { staticPage: true })}
    <main id="main" class="page">
      <article class="container article">
        <nav class="crumb" aria-label="Breadcrumb">
          <a class="link" href="/">Home</a> <span aria-hidden="true">/</span> <a class="link" href="/#work">Work</a> <span aria-hidden="true">/</span> <span>${esc(p.title)}</span>
        </nav>
        <header class="article-head">
          <p class="label"><span class="idx">project</span>${w.tag ? ` / ${esc(w.tag)}` : ""}</p>
          <h1 class="article-title">${esc(p.title)}</h1>
          ${chips ? `<ul class="chips" aria-label="Stack">${chips}</ul>` : ""}
        </header>
        <section class="article-section" aria-labelledby="problem">
          <h2 id="problem">Problem</h2>
          <p>${esc(w.problem)}</p>
        </section>
        ${w.outcome ? `<section class="article-section" aria-labelledby="outcome">
          <h2 id="outcome">Outcome</h2>
          <p>${esc(w.outcome)}</p>
        </section>` : ""}
        <section class="article-section" aria-labelledby="overview">
          <h2 id="overview">Overview</h2>
          <p>${esc(p.description)}</p>
          ${links ? `<p class="article-actions">
            ${links}
          </p>` : ""}
        </section>
        <p class="article-back"><a class="link" href="/#work">← Back to work</a></p>
      </article>
    </main>${footerHtml()}
  </body>
</html>
`;
}

let count = 0;
for (const p of PROJECTS) {
  const outDir = join(dist, "projects", p.id);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "index.html"), pageHtml(p));
  count++;
}

// Rewrite the sitemap to include the homepage + every project page.
const today = new Date().toISOString().slice(0, 10);
const urls = [
  { loc: `${SITE_URL}/`, priority: "1.0", changefreq: "weekly" },
  { loc: `${SITE_URL}/research`, priority: "0.9", changefreq: "monthly" },
  ...PROJECTS.map((p) => ({ loc: `${SITE_URL}/projects/${p.id}`, priority: "0.7", changefreq: "monthly" })),
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) =>
      `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`
  )
  .join("\n")}
</urlset>
`;
writeFileSync(join(dist, "sitemap.xml"), sitemap);

console.log(`prerender: wrote ${count} project page(s) + sitemap with ${urls.length} URLs`);

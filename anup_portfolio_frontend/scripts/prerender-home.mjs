// Build-time render of the homepage.
//
// Why: whatever sits inside #root in the shipped index.html is what a crawler
// sees before it runs any JavaScript, and what a visitor sees first. This
// puts the real React markup there — src/entry-server.jsx rendering the same
// components the browser runs — and marks #root data-ssr so main.jsx hydrates
// it instead of re-rendering. Googlebot does render JS, but on a deferred
// second pass; Bing, DuckDuckGo and the AI answer-engine crawlers are far
// less reliable at it.
//
// Runs after both `vite build` passes and after prerender-pages.mjs. Also
// writes llms.txt, a plain-text summary of the same content.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import {
  SITE, STACK, EXPERIENCES, EDUCATION, PROJECTS, PROJECT_NOTES, RESEARCH,
} from "../src/data/content.js";
import { workItems } from "../src/lib/projects.js";
import { render } from "../dist-ssr/entry-server.js";

const dist = join(dirname(fileURLToPath(import.meta.url)), "..", "dist");
const SITE_URL = (process.env.VITE_SITE_URL || "https://anup-katuwal.com.np").replace(/\/+$/, "");

const html = render("/");

const indexPath = join(dist, "index.html");
const src = readFileSync(indexPath, "utf8");
const MARKER = '<div id="root"><!--ssg--></div>';
if (!src.includes(MARKER)) {
  console.error("prerender-home: <!--ssg--> marker not found in dist/index.html — refusing to write.");
  process.exit(1);
}
writeFileSync(indexPath, src.replace(MARKER, `<div id="root" data-ssr>${html}</div>`));

// llms.txt — a plain-text summary for AI answer engines, which increasingly
// mediate "who is this person" queries. Same facts as the page, no markup.
const llms = `# ${SITE.name}

> ${SITE.role}, based in ${SITE.location}. ${SITE.lead}

Canonical site: ${SITE_URL}/

## Contact
- Email: ${SITE.email}
- GitHub: ${SITE.github}
- LinkedIn: ${SITE.linkedin}

## Education
${EDUCATION.map((d) => `- ${d.degree}, ${d.inst} (${d.period}) — ${d.details.replace(/\s+/g, " ")}`).join("\n")}

## Experience
${EXPERIENCES.map((e) => `- ${e.role}, ${e.org} (${e.period})`).join("\n")}

## Work
${workItems(PROJECTS, PROJECT_NOTES).map((p) => `- ${p.title} (${SITE_URL}/projects/${p.id}) — ${p.problem} ${p.outcome}`.trim()).join("\n")}

## Research
- ${RESEARCH.title} (${SITE_URL}/research) — ${RESEARCH.venue}, ${RESEARCH.period}.
${RESEARCH.results.map((r) => `- ${r}`).join("\n")}

## Stack
${STACK.map((r) => `- ${r.area}: ${r.tools} — ${r.use}`).join("\n")}
`;
writeFileSync(join(dist, "llms.txt"), llms);

const words = html.replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length;
console.log(`prerender-home: injected ~${words} words of static content + llms.txt`);

// src/lib/projects.js — presentation helpers shared by the Work section and
// the build-time pages (scripts/prerender-*.mjs).

// A project's own description, cut to its first sentence.
export function firstSentence(text = "") {
  const t = String(text).replace(/\s+/g, " ").trim();
  const m = t.match(/^.*?[.!?](?=\s|$)/);
  return m ? m[0] : t;
}

// A "live" URL on Upwork is a service listing, not a running demo.
export function liveLinkLabel(url = "") {
  try {
    const host = new URL(url).hostname;
    if (host === "upwork.com" || host.endsWith(".upwork.com")) return "Upwork service";
  } catch {
    /* relative or malformed URL — fall through */
  }
  return "Live";
}

const isTodo = (v) => !v || /^\s*TODO\b/i.test(String(v));

// Joins PROJECTS (title, links, tech) with PROJECT_NOTES (tag, problem,
// outcome) by id. Notes set the order and the featured card (the first);
// projects without a note follow in their stored order. A note field left as
// "TODO" falls back to the project's own text rather than showing "TODO".
export function workItems(projects = [], notes = []) {
  const byId = new Map(projects.map((p) => [p.id, p]));
  const ordered = [
    ...notes.filter((n) => byId.has(n.id)).map((n) => ({ ...byId.get(n.id), note: n })),
    ...projects.filter((p) => !notes.some((n) => n.id === p.id)).map((p) => ({ ...p, note: {} })),
  ];
  return ordered.map((p) => ({
    id: p.id,
    title: p.title,
    tag: isTodo(p.note.tag) ? "" : p.note.tag,
    problem: isTodo(p.note.problem) ? firstSentence(p.description) : p.note.problem,
    outcome: isTodo(p.note.outcome) ? p.metric || "" : p.note.outcome,
    stack: p.tech || [],
    code: p.github || "",
    live: p.live || "",
    paper: isTodo(p.note.paper) ? "" : p.note.paper,
    stats: p.note.stats || [],
  }));
}

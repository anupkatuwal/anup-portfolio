// src/lib/projects.js — presentation helpers shared by the projects section
// and the build-time project pages (scripts/prerender-projects.mjs).

// The card shows only the first sentence of a project's description, so the
// one-liner stays editable from /admin without a separate field.
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

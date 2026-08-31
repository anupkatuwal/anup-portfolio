// src/lib/posts.js — small helpers shared by the blog card, the blog page and
// the build-time prerender.
export const formatDate = (iso) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
  });

// Sort comparator: newest post first.
export const byNewest = (a, b) => (a.date < b.date ? 1 : -1);

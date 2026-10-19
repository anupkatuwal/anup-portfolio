// A short, stable, git-style hash for the experience log. Decorative: derived
// from the entry's text (FNV-1a), so it never changes between page loads.
export function shortHash(text = "") {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, "0").slice(0, 7);
}

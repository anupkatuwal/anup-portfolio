// The dark theme is declared twice in styles.css: once for an explicit
// data-theme="dark", once for visitors whose OS prefers dark before a theme
// has been set. CSS can't share one block between a selector and a media
// query, so this test is what keeps the two copies from drifting apart.
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// Read from disk: Vitest stubs CSS imports (even ?raw) to an empty string.
// Pass import.meta.url as a string — jsdom swaps in its own URL class,
// which node's fileURLToPath rejects.
const css = readFileSync(
  resolve(dirname(fileURLToPath(import.meta.url)), "../styles.css"),
  "utf8"
);

function tokens(block) {
  const out = {};
  for (const m of block.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
    out[m[1]] = m[2].trim().replace(/\s+/g, " ");
  }
  return out;
}

const explicitDark = css.match(/html\[data-theme="dark"\] \{([\s\S]*?)\n\}/)[1];
const systemDark = css.match(
  /@media \(prefers-color-scheme: dark\) \{\s*html:not\(\[data-theme\]\) \{([\s\S]*?)\n {2}\}/
)[1];
const root = css.match(/:root \{([\s\S]*?)\n\}/)[1];

test("both dark theme blocks define identical tokens", () => {
  expect(tokens(systemDark)).toEqual(tokens(explicitDark));
});

test("every dark token overrides one declared in :root", () => {
  const rootTokens = Object.keys(tokens(root));
  for (const name of Object.keys(tokens(explicitDark))) {
    expect(rootTokens).toContain(name);
  }
});

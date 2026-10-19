// The light theme is declared twice in styles/tokens.css: once for an
// explicit data-theme="light", once for visitors whose OS prefers light.
// CSS can't share one block between a selector and a media query, so this
// test keeps the two copies from drifting apart — and keeps colors out of
// styles.css, where DESIGN.md says they must never be hard-coded.
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// Read from disk: Vitest stubs CSS imports (even ?raw) to an empty string.
// Pass import.meta.url as a string — jsdom swaps in its own URL class,
// which node's fileURLToPath rejects.
const here = dirname(fileURLToPath(import.meta.url));
const tokensCss = readFileSync(resolve(here, "../styles/tokens.css"), "utf8");
const stylesCss = readFileSync(resolve(here, "../styles.css"), "utf8");

function tokens(block) {
  const out = {};
  for (const m of block.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
    out[m[1]] = m[2].replace(/\/\*.*?\*\//g, "").trim().replace(/\s+/g, " ");
  }
  return out;
}

const root = tokensCss.match(/:root \{([\s\S]*?)\n\}/)[1];
const explicitLight = tokensCss.match(/:root\[data-theme="light"\] \{([\s\S]*?)\n\}/)[1];
const systemLight = tokensCss.match(
  /@media \(prefers-color-scheme: light\) \{\s*:root:not\(\[data-theme="dark"\]\) \{([\s\S]*?)\n {2}\}/
)[1];

test("both light theme blocks define identical tokens", () => {
  expect(tokens(systemLight)).toEqual(tokens(explicitLight));
});

test("every light token overrides one declared in :root", () => {
  const rootTokens = Object.keys(tokens(root));
  for (const name of Object.keys(tokens(explicitLight))) {
    expect(rootTokens).toContain(name);
  }
});

test("styles.css hard-codes no colors (mask alpha aside)", () => {
  const hex = stylesCss.match(/#[0-9a-fA-F]{3,8}\b/g) || [];
  expect(hex.filter((h) => h !== "#000")).toEqual([]);
  expect(stylesCss).not.toMatch(/\brgba?\(/);
});

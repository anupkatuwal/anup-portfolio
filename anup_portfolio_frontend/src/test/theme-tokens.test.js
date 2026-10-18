// Light is the default theme; dark is one block that only applies once the
// visitor picks it. This keeps the dark block honest: every token it sets
// must override one declared in :root, and there must be no OS-preference
// copy of it (that would make dark the default for some visitors).
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

const dark = css.match(/html\[data-theme="dark"\] \{([\s\S]*?)\n\}/)[1];
const root = css.match(/:root \{([\s\S]*?)\n\}/)[1];

test("every dark token overrides one declared in :root", () => {
  const rootTokens = Object.keys(tokens(root));
  for (const name of Object.keys(tokens(dark))) {
    expect(rootTokens).toContain(name);
  }
});

test("dark mode is never applied from the OS preference alone", () => {
  expect(css).not.toMatch(/prefers-color-scheme:\s*dark/);
});

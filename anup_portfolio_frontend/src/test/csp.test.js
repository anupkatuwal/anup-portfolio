// The CSP allows exactly one inline script — the no-flash theme script — by
// its sha256 hash. Editing scripts/theme-init.inline.js changes the hash, and
// browsers would then silently block it; this test catches that first.
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const script = readFileSync(resolve(root, "scripts/theme-init.inline.js"), "utf8").trim();
const vercel = JSON.parse(readFileSync(resolve(root, "vercel.json"), "utf8"));

const csp = vercel.headers
  .flatMap((h) => h.headers)
  .find((h) => h.key === "Content-Security-Policy").value;
const scriptSrc = csp.split(";").map((d) => d.trim()).find((d) => d.startsWith("script-src"));

test("script-src allows the theme script by its current hash, and nothing else inline", () => {
  const hash = `'sha256-${createHash("sha256").update(script).digest("base64")}'`;
  expect(scriptSrc).toBe(`script-src 'self' ${hash}`);
  expect(scriptSrc).not.toContain("unsafe-inline");
});

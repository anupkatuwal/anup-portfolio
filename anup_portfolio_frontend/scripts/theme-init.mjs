// The no-flash theme script, inlined into every page's <head> so the first
// paint never waits on a separate request. It applies a saved theme choice
// before anything renders; with no saved choice, data-theme stays unset and
// the CSS follows the system preference (dark if none). Keep the logic in
// step with src/lib/theme.js.
//
// The CSP allows this one inline script by its hash. If you edit
// theme-init.inline.js, update the 'sha256-…' value in vercel.json's
// script-src — src/test/csp.test.js fails until the two match.
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export const THEME_INIT = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "theme-init.inline.js"),
  "utf8"
).trim();

export const THEME_INIT_HASH = `sha256-${createHash("sha256").update(THEME_INIT).digest("base64")}`;

export const themeInitTag = () => `<script>${THEME_INIT}</script>`;

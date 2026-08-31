# anup-portfolio

Personal portfolio of Anup Katuwal — React + Vite frontend with a FastAPI
backend (contact form storage + admin), deployed on Vercel with Neon Postgres.

## Architecture

```
Browser ── https://<site>/            static React build (Vercel CDN)
        ── https://<site>/research    thesis page (lazy chunk + prerendered HTML)
        ── https://<site>/projects/*  prerendered static project pages
        ── https://<site>/admin       same SPA, lazy-loaded admin chunk
        ── https://<site>/api/*       FastAPI serverless function (api/index.py)
                                          │
                                          └── Neon Postgres (pooled, table: contact_messages)
```

- The public page is a single React bundle; `/admin` and `/research` are
  code-split and only downloaded when visited. Auth on `/admin` is a 12h
  JWT kept in `sessionStorage`.
- Routing is a path match in `src/main.jsx` — no router library. Every route is
  a full page load, and `src/lib/nav.js` is the single source of truth for the
  primary navigation (shared by the navbar and the prerender scripts). New
  routes also need a rewrite in `vercel.json`.
- Build-time prerendering writes real HTML for every route
  (`scripts/prerender-projects.mjs` → project pages + sitemap,
  `scripts/prerender-pages.mjs` → `/research`,
  `scripts/prerender-home.mjs` → the homepage + `llms.txt`), so crawlers and
  no-JS visitors see the content before any JavaScript runs. They run in that
  order — the last two both consume the `<!--ssg-->` marker in
  `dist/index.html`.
- The contact form posts to `/api/contact` (validation, honeypot, 5/hour rate
  limit). Messages are read/managed at `/admin`.
- Performance budget (checked against `npm run build`): JS ≤ 80 KB gzip,
  CSS ≤ 10 KB gzip, hero image ≤ 60 KB. (Raised from 75/8 when the research
  and blog content moved into `content.js` — the post bodies ship in the main
  bundle because the whole content document is one object. Current: ~78 KB JS,
  ~8.3 KB CSS.)

## Environment variables

| Variable | Where | What |
|---|---|---|
| `DATABASE_URL` | Vercel + local `.env` | Neon **pooled** connection string (host contains `-pooler`) |
| `SECRET_KEY` | Vercel + local `.env` | JWT signing key — `python -c "import secrets; print(secrets.token_hex(32))"` |
| `ADMIN_USERNAME` | Vercel + local `.env` | Admin login name |
| `ADMIN_PASSWORD_HASH` | Vercel + local `.env` | bcrypt hash of the admin password (never the plaintext) |
| `RESEND_API_KEY` | Vercel + local `.env` (optional) | Resend API key — enables email notification on each contact-form submit. Without it, messages are still saved and readable at `/admin`; no email is sent. |
| `CONTACT_NOTIFY_TO` | Vercel (optional) | Where notifications are delivered; comma-separated for multiple inboxes. Default: `katuwalanup@gmail.com` |
| `CONTACT_NOTIFY_FROM` | Vercel (optional) | Sender for notifications. Default: `Portfolio Contact <onboarding@resend.dev>` |
| `VITE_SITE_URL` | Vercel (optional) | Public site URL; falls back to the value in `vite.config.js` |

## Contact-form email notifications

Every valid submit is stored in Neon (`contact_messages`, visible at `/admin`)
and — when `RESEND_API_KEY` is set — also emailed via
[Resend](https://resend.com), with the visitor's address as **Reply-To** so
replying in the mail client answers them directly.

The defaults use Resend's shared `onboarding@resend.dev` sender, which Resend
only delivers to the email that owns the Resend account. To route
notifications to the custom-domain inbox instead
(`contact@anup-katuwal.com.np`, hosted on Zoho):

1. In Resend, add and verify the domain `anup-katuwal.com.np` (it walks you
   through the DNS records: SPF, DKIM, and a verification TXT).
2. In Vercel, set `CONTACT_NOTIFY_FROM` to e.g.
   `Portfolio Contact <contact@anup-katuwal.com.np>` and `CONTACT_NOTIFY_TO`
   to `contact@anup-katuwal.com.np,katuwalanup@gmail.com` (comma-separated =
   both inboxes get every message), then redeploy.

Both steps are required — with the shared sender, Resend refuses delivery to
any address other than the account owner's. Receiving at the Zoho address is
free (Zoho's free plan only restricts IMAP/SMTP client access, not incoming
mail).

## Editing site content

All text content (about, projects, skills, experience, education,
certifications, resume highlights, research/thesis, testimonials)
lives in **`src/data/content.js`** — edit that one file and push; nothing else
needs touching. The file has an editing guide at the top, and every section is
also editable at `/admin`.

Two things to know:

- **Hero copy** is JSX in `src/components/Hero.jsx` and is mirrored by hand in
  the `HERO` object in `scripts/prerender-home.mjs`. Change one, change both.
- **Testimonials** ship empty on purpose. Add only real, attributable quotes
  you have permission to publish — the section renders nothing until then, and
  entries without both `quote` and `name` are skipped.

### Design system

Tokens live at the top of `src/styles.css`: navy `#0A1F44`, silver `#E0E0E0`,
accent teal `#00BFA6`; Merriweather for headings, Roboto for body text,
JetBrains Mono for eyebrows and metrics (all self-hosted via `@fontsource`,
imported in `src/main.jsx`). Light is the default theme; dark is a neutral
ink/charcoal variant (navy is the brand colour, not the dark surface) — every
colour is defined in both.

Section and card reveals are driven by `src/lib/useScrollReveal.js`: the CSS
holds `.card`, `.section-title` and friends at `opacity: 0` until the hook adds
`is-visible`, so **any new page that renders those classes must call the hook**
or its content stays invisible.

Research charts are hand-rolled inline SVG (`src/components/BarChart.jsx`) —
no chart library, so the strict CSP in `vercel.json` (`script-src 'self'`)
stays as it is. Series colours are validated for colour-blind separation in
both themes, and every bar is direct-labelled with its value.

## Changing the site URL (.com.np switch)

The public URL is defined in **one place**: the `VITE_SITE_URL` environment
variable, with a fallback in `vite.config.js`. It feeds the canonical tag,
Open Graph/Twitter tags, JSON-LD, `sitemap.xml`, and `robots.txt` (the last
two are regenerated on every build with the current date).

The live domain is `https://anup-katuwal.com.np` (the fallback in
`vite.config.js`). To override it, set `VITE_SITE_URL` in Vercel → Project →
Settings → Environment Variables and redeploy.

## Local development

```bash
# frontend
npm install
npm run dev            # http://localhost:5173

# backend (separate terminal)
python3 -m venv .venv && .venv/bin/pip install -r api/requirements.txt uvicorn
set -a && source .env && set +a
.venv/bin/uvicorn api.index:app --port 8000
```

Copy `.env.example` to `.env` and fill in the four variables (Neon pooled
`DATABASE_URL`, `SECRET_KEY`, `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH`). The
same four must be set in Vercel for production. `.env` is gitignored — never
commit it.

## Stack

- **Frontend:** React 19, Vite 7, plain CSS (`src/styles.css`), Vercel Analytics (cookieless)
- **Backend:** FastAPI (single file, `api/index.py`), SQLAlchemy 2 + psycopg, JWT auth, slowapi rate limiting
- **Database:** Neon Postgres (pooled connection string, NullPool on the app side)
- **Hosting:** Vercel — static frontend + Python serverless function under `/api`

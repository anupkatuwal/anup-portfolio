# Security

## Reporting a vulnerability

Email **contact@anup-katuwal.com.np**. The same address is published at
`/.well-known/security.txt` (generated at build time by `vite.config.js`).
Please include steps to reproduce; expect a reply within a few days.

---

## What the code enforces

| Control | Where | Notes |
|---|---|---|
| CSP, HSTS, frame/COOP/Permissions headers | `vercel.json` | `default-src 'self'`, `frame-ancestors 'none'`, `object-src 'none'`, `form-action 'self'`, `upgrade-insecure-requests` |
| Cross-origin write guard (CSRF) | `api/index.py` → `guard_cross_origin_writes` | Every `POST/PUT/PATCH/DELETE` under `/api/` must carry an `Origin` (or `Referer`) matching the host it was served on, or one of `ALLOWED_ORIGINS`. Blocks the "hidden form on another site posts to your API" attack that CORS does **not** stop |
| Rate limiting | `api/index.py` → `enforce_rate_limit` | DB-backed, so it survives serverless cold starts: contact 5/hour/IP, login 5/15min/IP. Keyed on `x-real-ip`, which Vercel overwrites and callers can't spoof |
| Honeypot | `ContactIn.company` | Bots that fill it get a fake success; nothing is stored |
| Admin auth | `require_admin` | HS256 JWT, 12h TTL, `iss`/`aud`/`exp`/`sub` all required — a token signed with the same key but minted for anything else is rejected |
| Password storage | `bcrypt` | Hash check always runs so response timing doesn't leak whether the username was right |
| Stored-content URL validation | `_validate_content` | `github`/`live`/`link` fields must be `http(s):`, `mailto:` or a `/relative` path — no `javascript:`/`data:` |
| Email escaping | `_notify` | All submitter-supplied fields are HTML-escaped before going into the notification email |
| `/admin` kept out of search | `vercel.json` + `Admin.jsx` | `X-Robots-Tag: noindex` header plus a `<meta name="robots">` override. Deliberately **not** in `robots.txt` — a `Disallow` line advertises the path to everyone while stopping nobody |
| No SPA catch-all for assets | `vercel.json` rewrites | Only extensionless paths fall through to `index.html`; a missing `.pdf`/`.png`/`.js` returns a real 404 (`dist/404.html`) instead of the app shell with a 200 |
| Single public entry point | `vercel.json` redirects | `anup-portfolio-one.vercel.app` 308-redirects to `anup-katuwal.com.np`. Preview deployments are separately covered by Vercel Authentication (Standard Protection, already enabled on the project) |

Admin tokens live in `sessionStorage`, not an `HttpOnly` cookie. That is a
deliberate trade-off: the strict CSP (`script-src 'self'`, no inline scripts)
is the primary defence against the XSS that would be needed to read them, and
cookie auth would need its own CSRF token layer for the admin writes. If the
CSP is ever relaxed, revisit this first.

---

## Manual setup — not in this repo

These live in DNS and the Vercel dashboard, so a commit can't change them.

### 1. Email authentication (highest impact)

Without this, anyone can send mail that appears to come from
`@anup-katuwal.com.np`. Current state as last reported: **two SPF records, two
MX sets, no DMARC** — two SPF records is a hard PermError, so SPF effectively
does not work at all right now.

**Zoho is the mail host to keep; the iCloud records get deleted.** DKIM is
already in place under the selector `anup` — the audit reported it missing, but
DKIM selectors cannot be enumerated, so a scanner guessing `zoho` would have
found nothing regardless. Confirm the record's host is `anup._domainkey` (not
bare `anup`), since receivers look it up at that exact name and nowhere else.

Target state:

| Type | Host | Value | Note |
|---|---|---|---|
| MX | `@` | `mx.zoho.com` (priority 10) | confirm the data centre in Zoho's console first — an EU/IN account uses `zoho.eu` / `zoho.in` |
| MX | `@` | `mx2.zoho.com` (priority 20) | |
| MX | `@` | `mx3.zoho.com` (priority 50) | |
| TXT | `@` | `v=spf1 include:zoho.com ~all` | exactly one such record |
| TXT | `anup._domainkey` | (Zoho's DKIM key) | already published |
| TXT | `_dmarc` | `v=DMARC1; p=none; rua=mailto:contact@anup-katuwal.com.np; fo=1` | new |

Delete: both iCloud MX records (`mx01`/`mx02.mail.icloud.com`), the
`include:icloud.com` SPF record, the `sig1._domainkey` CNAME, and any
`apple-domain=` TXT. Remove the domain from iCloud's Custom Email Domain
settings too, so Apple stops accepting mail for it.

Order matters: fix SPF and MX, confirm a test message reaches the Zoho inbox,
*then* add DMARC and clean up the Apple side.

Rules that matter:

- **Exactly one** `v=spf1` TXT record on `@`. Two is a PermError; receivers
  then treat SPF as broken, not as "one of them passed".
- **One** MX set. Two providers' MX records split delivery unpredictably.
- Start DMARC at `p=none` and read the `rua` reports for a week or two. Once
  nothing legitimate is failing, move to `p=quarantine`, then `p=reject`, and
  only then tighten SPF from `~all` to `-all`. Going straight to
  `p=quarantine; adkim=s; aspf=s` before the reports are clean will quietly
  quarantine your own mail.

If contact-form notifications are ever sent **from** the domain (setting
`CONTACT_NOTIFY_FROM` to a `@anup-katuwal.com.np` address instead of the
default `onboarding@resend.dev`), Resend also needs its own DKIM record and an
SPF include for whichever sending domain is verified in Resend — add those
before switching, or the notifications will fail DMARC.

Verify from a machine with DNS access:

```bash
dig +short TXT anup-katuwal.com.np           # exactly one v=spf1 line
dig +short MX  anup-katuwal.com.np           # Zoho's set only, no icloud.com
dig +short TXT _dmarc.anup-katuwal.com.np
dig +short TXT anup._domainkey.anup-katuwal.com.np   # the Zoho DKIM key
```

A step-by-step version of this, written for the register.com.np panel, is at
<https://claude.ai/code/artifact/a512f6b3-66d1-415d-b56e-eb247c6583c9>.

### 2. Vercel dashboard

Deployment Protection (Vercel Authentication) is already enabled for all
deployments except custom domains, which covers preview URLs. The
`anup-portfolio-one.vercel.app` alias stays reachable at the platform level
because Vercel treats it as an assigned production domain — the redirect in
`vercel.json` is what closes it off, so leave that rule in place.

### 3. Accepted, not fixed

- Contact addresses appear in the page HTML, JSON-LD and JS bundle. That is
  the point of a contact page; scraping is mitigated by the rate limiter, not
  by hiding the address.
- `/api/health` reports whether the database is reachable. It exposes no
  connection details and is useful for uptime monitoring.
- The backend source is public. Everything security-relevant depends on
  secrets in environment variables, never on the code being unread.

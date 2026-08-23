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

**Pick one mail provider and delete the other's records entirely.** iCloud is
the further-along one (its `sig1` DKIM key is already published), so these
examples assume iCloud; swap the values if you keep Zoho instead.

| Type | Host | Value |
|---|---|---|
| MX | `@` | `mx01.mail.icloud.com` (priority 10) |
| MX | `@` | `mx02.mail.icloud.com` (priority 10) |
| TXT | `@` | `v=spf1 include:icloud.com ~all` |
| CNAME | `sig1._domainkey` | `sig1.dkim.anup-katuwal.com.np.at.icloudmailadmin.com` |
| TXT | `_dmarc` | `v=DMARC1; p=none; rua=mailto:dmarc@anup-katuwal.com.np; pct=100` |

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
dig +short TXT anup-katuwal.com.np      # exactly one v=spf1 line
dig +short MX  anup-katuwal.com.np      # one provider's set
dig +short TXT _dmarc.anup-katuwal.com.np
dig +short CNAME sig1._domainkey.anup-katuwal.com.np
```

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

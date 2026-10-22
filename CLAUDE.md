# CLAUDE.md

## Layout
- Frontend: `anup_portfolio_frontend/src` (React 19 + Vite). Site text lives in `src/data/content.js`.
- API: `anup_portfolio_frontend/api` (Python, `index.py`).
- Prerender scripts: `anup_portfolio_frontend/scripts`.

## Done means
Run from `anup_portfolio_frontend`: `npm run lint`, `npm test`, `npm run build`.
Run from `anup_portfolio_frontend/api`: `pytest -q`.
All four pass, or say which one failed and why.

## Rules
- Don't open `public/` (images, PDFs, fonts) or `package-lock.json` unless the task is about them.
- Read only the files the task touches. Ask before reading the whole `src/` tree.
- Keep replies short: what changed, which files, test result. No restating the plan.
- Track the current task in `TASKS.md`. Update it before you stop.

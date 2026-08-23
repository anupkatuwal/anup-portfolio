# Anup Katuwal — Portfolio

Full-stack portfolio site showcasing projects, skills, and certifications. Built with React/Vite frontend. Live at **[anup-katuwal.com.np](https://anup-katuwal.com.np)**.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite 7 |
| Styling | CSS 3 (dark/light mode) |
| Deployment | Vercel (auto-deploy on push) |
| Analytics | Vercel Analytics |

## Project Structure

```
anup-portfolio-live/
└── anup_portfolio_frontend/
    ├── src/
    │   ├── components/        # React components (Hero, Projects, Skills, etc.)
    │   ├── data/
    │   │   └── content.js     # All portfolio content (projects, skills, certs)
    │   ├── App.jsx
    │   └── main.jsx
    ├── vite.config.js
    ├── package.json
    └── index.html
```

## Local Setup

### Prerequisites

- Node.js 22+ (required for Vite 7)

### Development

```bash
cd anup_portfolio_frontend
npm install
npm run dev
# App available at http://localhost:5173
```

## Building

```bash
npm run build
# Compiled output in dist/
```

## Deployment

Deployed on **Vercel** with auto-deploy on push to `main`:
1. Push to `github.com/anupkatuwal/anup-portfolio` main branch
2. Vercel automatically rebuilds and deploys to anup-katuwal.com.np

## Editing Content

All portfolio content (projects, skills, certifications) is defined in `anup_portfolio_frontend/src/data/content.js`. Edit that file to update:

- **Projects** — project cards shown in the Projects section
- **Skills** — skill tags and categories
- **Certifications** — training, courses, and certificates

No database required — content is static and deployed as part of the build.

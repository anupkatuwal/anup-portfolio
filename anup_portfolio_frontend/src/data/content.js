// src/data/content.js
//
// ─── DEFAULT / FALLBACK SITE CONTENT ─────────────────────────────────────────
//
// These exports are the *bundled defaults*. At runtime the site fetches any
// saved content from the API (/api/content, editable in /admin) and overlays
// it on top of these. If the API is empty or unreachable, the site renders
// these defaults — so it can never go blank.
//
// You can still edit this file directly to change the baseline (then push,
// Vercel rebuilds). For day-to-day edits, use the admin panel instead.
// ──────────────────────────────────────────────────────────────────────────────

/* ── SKILLS ───────────────────────────────────────────────────────────────────
   Each row = one domain. `primary: true` items render highlighted chips.     */

export const PRIMARY_SKILLS = ["Python", "SQL (MySQL)", "ETL", "Pandas"];

export const SKILLS = [
  { domain: "data & ml",    items: ["Python", "Pandas", "NumPy", "SQL (MySQL)", "ETL Pipelines", "Data Warehousing", "Star Schema", "BERT", "Transformers", "Scikit-learn", "Fairness Metrics"] },
  { domain: "engineering",  items: ["FastAPI", "React", "Vite", "REST APIs", "PostgreSQL", "GitHub Actions"] },
  { domain: "tools",        items: ["Git", "Jupyter", "Google Colab", "VS Code", "Linux", "Power BI"] },
];

/* ── EXPERIENCE ───────────────────────────────────────────────────────────────
   Newest first. `minor: true` renders a compact card with `description`
   instead of bullets.                                                        */

export const EXPERIENCES = [
  {
    role: "Graduate Researcher — NLP & Data Analytics",
    org: "NCIT, Pokhara University",
    period: "2020 – 2026",
    location: "Kathmandu, Nepal",
    bullets: [
      "Built data pipelines to preprocess and analyze 10,000 Reddit posts using Python and SQL.",
      "Thesis: FairBERT — bias mitigation in mental-health sentiment analysis using fine-tuned BERT (84% accuracy, macro-F1 0.688, written in IEEE format).",
      "Designed and maintained structured databases for storing research outputs and experimental results.",
    ],
  },
  {
    role: "Consultant Supervisor",
    org: "Bhatta IT Consultancy Services (Remote — Austin, TX)",
    period: "2021 – 2022",
    location: "Kathmandu, Nepal",
    bullets: [
      "Supervised junior developers on Java and Spring Boot projects.",
      "Code review, mentorship, and pair-programming to improve team quality.",
    ],
  },
  {
    role: "Teaching Assistant — Database Management Systems",
    org: "College of Applied Business (CAB)",
    period: "2018",
    location: "Kathmandu, Nepal",
    bullets: [
      "Delivered MySQL lab sessions covering database design, normalization, stored procedures, and complex SQL queries for 30+ students.",
      "Developed hands-on exercises on relational schema design, data modeling, and ETL fundamentals.",
    ],
  },
];

/* ── EDUCATION ──────────────────────────────────────────────────────────── */

export const EDUCATION = [
  {
    degree: "Master of Computer Information System (MCIS)",
    inst: "NCIT, Pokhara University",
    period: "Sep 2020 – Apr 2026",
    details: "CGPA 3.71 · Thesis: Bias Mitigation in Mental Health Sentiment Analysis using BERT with Fairness Techniques.",
  },
  {
    degree: "B.Sc. in Computer Information Systems",
    inst: "Columbia College, Denver, Colorado",
    period: "2010 – 2014",
    details: "GPA 3.34 · Focus on information systems and programming.",
  },
];

/* ── CERTIFICATIONS & TRAINING ────────────────────────────────────────────────
   `note` shows as a badge (e.g. "In Progress"). `id` is the credential ID
   (not currently displayed, kept for reference).                             */

export const TRAINING = [
  {
    name: "Advanced Data Analysis with Python",
    org: "Broadway Infosys",
    period: "May 2026 – Running",
    note: "In Progress",
    tag: "training",
  },
];

/* Featured certifications get full cards; everything in FOUNDATIONS renders
   as a single compact line with one link. */
export const CERTIFICATIONS = [
  {
    name: "Google Data Analytics Certificate",
    org: "Google on Coursera",
    period: "Jul 2024",
    note: "In Progress — 6/9 courses",
    tag: "cert",
  },
  {
    name: "Building Modern Java Applications on AWS",
    org: "Amazon Web Services (AWS)",
    period: "Mar 2022",
    link: "https://coursera.org/verify/VY4V3AXMX2S7",
    tag: "cert",
  },
  {
    name: "AWS Cloud Technical Essentials",
    org: "Amazon Web Services (AWS)",
    period: "Jan 2022",
    link: "https://coursera.org/share/28d3e6ca9e7dd3b819459f047bea25a2",
    tag: "cert",
  },
];

export const FOUNDATIONS = [
  {
    label: "Java foundations",
    items: [
      "TestPrep Java SE 8 Programmer I",
      "SE 8 Classes & Objects",
      "SE 8 Methods & Encapsulation",
      "SE 11 Arrays & Program Flow",
    ],
    note: "Skillsoft / Metrix Learning · Dec 2021",
    link: "/cert-java-se8.pdf",
    linkLabel: "download certificate ↗",
  },
  {
    label: "Foundations",
    items: [
      "Python for Everybody (Univ. of Michigan)",
      "Intro to Generative AI (Google Cloud)",
      "Business Analysis with Spreadsheets (Coursera)",
      "WordPress Website Build (Coursera)",
    ],
    note: "",
    link: "https://www.linkedin.com/in/anupkatuwal1989/details/certifications/",
    linkLabel: "view credentials ↗",
  },
];

/* ── RESUME HIGHLIGHTS ────────────────────────────────────────────────────────
   Bullet list shown next to the Download PDF button.                         */

export const RESUME_HIGHLIGHTS = [
  "Master's in Computer Information Systems — CGPA 3.71 (NCIT, Pokhara University)",
  "FairBERT thesis: fine-tuned BERT on 10,000 Reddit posts · 84% accuracy · 35% mean bias reduction (80% on dialect)",
  "End-to-End Food Order ETL Pipeline — MySQL stored procedures, star schema warehouse, Python orchestration, 20 automated tests, HTML dashboard · Available on Upwork",
  "Upwork Proposal Automation Agent · cuts proposal time from 20 min to under 2 min",
  "Google Data Analytics (6/9) · Python for Everybody · AWS · Intro to GenAI certified",
  "Currently training: Advanced Data Analysis with Python at Broadway Infosys (started May 2026)",
];

/* ── PROJECTS ─────────────────────────────────────────────────────────────────
   `featured: true` sorts a project to the top of the grid.
   `metric` is the one-line mono stat shown under the title.
   `tech` is a list of chip labels. Leave `live` as "" if there's no demo.    */

export const PROJECTS = [
  {
    id: "food-etl",
    metric: "MySQL · Star Schema · 20 tests · CI/CD",
    title: "End-to-End Food Order ETL Pipeline",
    description:
      "Production-style ETL pipeline replicating the architecture used by DoorDash and Uber Eats. Extracts raw CSV orders into a MySQL staging DB, transforms via stored procedures into a star schema warehouse (fact_orders + 4 dim tables), and serves an interactive HTML analytics dashboard. Includes idempotent loading, ETL job logging, 20 automated pytest tests, and GitHub Actions CI/CD.",
    tech: ["MySQL", "Python", "ETL", "Star Schema", "pytest", "GitHub Actions", "HTML", "Chart.js"],
    github: "https://github.com/anupkatuwal/food-order-etl-pipeline",
    live: "https://www.upwork.com/services/product/development-it-end-to-end-food-order-etl-pipeline-mysql-python-power-bi-2070932638680691364",
    featured: true,
  },
  {
    id: "thesis",
    metric: "84% accuracy · DPD −35.4% · Master's thesis",
    title: "Bias-Aware Mental Health Sentiment Analysis",
    description:
      "Master's thesis (FairBERT): fine-tuned BERT with adversarial debiasing and counterfactual augmentation on RMH-Bias-10K, a 10,000-post Reddit mental-health dataset built for this research. Achieved 84.0% accuracy, macro-F1 0.688, and ROC-AUC 0.843 — outperforming BiLSTM and vanilla BERT baselines — while reducing mean demographic parity difference by 35.4% and dialect DPD by 79.8% (0.327 → 0.066). Written as an IEEE-format thesis at NCIT, Pokhara University.",
    tech: ["Python", "BERT", "HuggingFace", "Pandas", "Scikit-learn", "Reddit API"],
    github: "https://github.com/anupkatuwal/bias-aware-sentiment-analysis-mental-health",
    live: "",
    featured: true,
  },
  {
    id: "upwork-agent",
    metric: "20 min → <2 min per proposal",
    title: "Upwork Proposal Automation Agent",
    description:
      "Python agent that reads job listings, generates tailored proposals using the Claude API, and exports to Google Docs. Reduces proposal time from 20 min to under 2 min.",
    tech: ["Python", "Claude API", "Google Docs API", "Automation"],
    github: "https://github.com/anupkatuwal/upwork-proposal-agent",
    live: "",
  },
  {
    id: "portfolio",
    metric: "React + FastAPI · serverless on Vercel",
    title: "Personal Portfolio — anup-portfolio",
    description:
      "This site. A React + Vite single-page frontend on a FastAPI serverless backend (Vercel), with site content managed through a JWT-protected admin panel and stored as JSON in Postgres (Neon). Hardened on the backend with bcrypt auth and in-app password changes, Postgres-backed plus edge (WAF) rate limiting, a full set of security headers (CSP, HSTS, and more), and a spam-resistant contact form that emails on submit. Front end features a dark/light theme, animated hero, scroll-aware navbar, and a skills table with primary-chip highlighting. Built and iterated entirely with Claude Code.",
    tech: ["React", "Vite", "FastAPI", "Python", "PostgreSQL", "JWT", "Vercel", "Claude Code"],
    github: "https://github.com/anupkatuwal/anup-portfolio",
    live: "https://anup-katuwal.com.np",
  },
  {
    id: "daily-briefing",
    metric: "multi-account · runs daily · zero-touch",
    title: "AI Daily Briefing",
    description:
      "Automated personal assistant that aggregates unread email across multiple Gmail accounts, the day's Google Calendar, and news headlines each morning, then has Claude generate a structured briefing delivered as a formatted HTML email. Replying to that email triggers Claude to respond to or delete messages on your behalf, routed back to the right account. Runs serverless on GitHub Actions on a fixed schedule.",
    tech: ["Python", "Claude AI", "Gmail API", "Google Calendar API", "GitHub Actions", "OAuth"],
    github: "https://github.com/anupkatuwal/daily-briefing",
    live: "",
  },
];

/* ── AGGREGATE ────────────────────────────────────────────────────────────────
   The full content document, in the same shape the admin panel edits and the
   API stores. Order of keys here defines the order sections appear in /admin. */

export const DEFAULT_CONTENT = {
  PRIMARY_SKILLS,
  SKILLS,
  EXPERIENCES,
  EDUCATION,
  TRAINING,
  CERTIFICATIONS,
  FOUNDATIONS,
  RESUME_HIGHLIGHTS,
  PROJECTS,
};

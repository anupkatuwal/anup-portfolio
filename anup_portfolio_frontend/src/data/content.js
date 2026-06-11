// src/data/content.js
//
// ─── THIS IS THE ONLY FILE YOU EDIT TO UPDATE THE SITE ───────────────────────
//
// Every section of the portfolio (Skills, Experience, Education,
// Certifications, Resume highlights, Projects) reads its content from here.
// The components in src/components/ only render what's in this file.
//
// HOW TO EDIT:
//   • Each section below is an exported array (or object) of plain entries.
//   • Copy an existing entry, change the text, save — the site updates.
//   • Strings go in quotes. Lists go in [square brackets], separated by commas.
//   • Don't delete the `export const ...` lines themselves.
//   • Set a field to "" or remove an entry entirely if you don't want it shown.
//
// After editing, run `npm run build` locally (or just push — Vercel builds it)
// ──────────────────────────────────────────────────────────────────────────────

/* ── SKILLS ───────────────────────────────────────────────────────────────────
   Each row = one domain. `primary: true` items render highlighted chips.     */

export const PRIMARY_SKILLS = ["Python", "SQL", "BERT", "Pandas", "FastAPI"];

export const SKILLS = [
  { domain: "data & ml",    items: ["Python", "Pandas", "NumPy", "SQL", "BERT", "Transformers", "Scikit-learn", "Fairness Metrics"] },
  { domain: "engineering",  items: ["FastAPI", "React", "Vite", "REST APIs", "PostgreSQL"] },
  { domain: "tools",        items: ["Git", "Jupyter", "Google Colab", "VS Code", "Linux"] },
];

/* ── EXPERIENCE ───────────────────────────────────────────────────────────────
   Newest first. `minor: true` renders a compact card with `description`
   instead of bullets.                                                        */

export const EXPERIENCES = [
  {
    role: "Graduate Researcher",
    org: "NCIT, Pokhara University",
    period: "2022 – 2026",
    location: "Kathmandu, Nepal",
    bullets: [
      "Thesis on bias mitigation in mental-health sentiment analysis using fine-tuned BERT.",
      "Published IEEE paper; worked with Reddit datasets and demographic fairness metrics.",
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
    role: "Teaching Assistant — DBMS",
    org: "College of Applied Business",
    period: "2020 – 2021",
    location: "Kathmandu, Nepal",
    bullets: [
      "Full semester DBMS instruction — SQL labs, schema design, assessments.",
      "Followed Tribhuvan University syllabus; maintained open availability for students.",
    ],
  },
  {
    role: "Assistant Manager",
    org: "Fine Dining Italian Restaurant",
    period: "2012 – 2016",
    location: "Denver, Colorado",
    description: "Operations, team management, and front-of-house at a fine dining venue.",
    bullets: [],
    minor: true,
  },
];

/* ── EDUCATION ──────────────────────────────────────────────────────────── */

export const EDUCATION = [
  {
    degree: "Master of Computer Information Systems (MCIS)",
    inst: "NCIT, Pokhara University",
    period: "2022 – Apr 2026",
    details: "CGPA 3.71 · Thesis: Bias Mitigation in Mental Health Sentiment Analysis using BERT.",
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
    period: "May 2026 – Aug 2026",
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
    id: "VY4V3AXMX2S7",
    tag: "cert",
  },
  {
    name: "AWS Cloud Technical Essentials",
    org: "Amazon Web Services (AWS)",
    period: "Jan 2022",
    id: "6L926FGW6DT3",
    tag: "cert",
  },
];

export const FOUNDATIONS = {
  label: "Foundations",
  items: [
    "Python for Everybody (Univ. of Michigan)",
    "Intro to Generative AI (Google Cloud)",
    "Business Analysis with Spreadsheets (Coursera)",
    "WordPress Website Build (Coursera)",
  ],
  link: "https://www.linkedin.com/in/anupkatuwal1989/details/certifications/",
  linkLabel: "view credentials ↗",
};

/* ── RESUME HIGHLIGHTS ────────────────────────────────────────────────────────
   Bullet list shown next to the Download PDF button.                         */

export const RESUME_HIGHLIGHTS = [
  "Master's in Computer Information Systems — CGPA 3.71 (NCIT, Pokhara University)",
  "FairBERT thesis: fine-tuned BERT on 52,000+ Reddit posts · 84% F1 · 54% bias reduction · IEEE paper",
  "Data analytics pipelines & dashboards (Python, Pandas, SQL, Tableau)",
  "Upwork Proposal Automation Agent · cuts proposal time from 20 min to under 2 min",
  "Google Data Analytics (6/9) · Python for Everybody · AWS · Intro to GenAI certified",
  "Currently training: Advanced Data Analysis with Python at Broadway Infosys (May–Aug 2026)",
];

/* ── PROJECTS ─────────────────────────────────────────────────────────────────
   `featured: true` sorts a project to the top of the grid.
   `metric` is the one-line mono stat shown under the title.
   `tech` is a list of chip labels. Leave `live` as "" if there's no demo.    */

export const PROJECTS = [
  {
    id: "thesis",
    metric: "84% F1 · ΔDP −54% · IEEE paper",
    title: "Bias-Aware Mental Health Sentiment Analysis",
    description:
      "Fine-tuned BERT on 52,000+ Reddit mental-health posts for sentiment classification. Achieved 84% F1-score. Reduced demographic parity gap by 54% (ΔDP: 0.211 → 0.098). Published as IEEE-format research paper.",
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
      "This site. React + Vite frontend with a FastAPI backend, JWT-protected admin panel, and Postgres (Neon) DB. Deployed serverless on Vercel. Features dark/light theme, animated hero, scroll-aware navbar, skills table with primary-chip highlighting, and a Certifications & Training section. Built and iterated entirely with Claude Code.",
    tech: ["React", "Vite", "FastAPI", "Python", "PostgreSQL", "JWT", "Vercel", "Claude Code"],
    github: "https://github.com/anupkatuwal/anup-portfolio",
    live: "https://anup-portfolio-one.vercel.app",
  },
  {
    id: "daily-briefing",
    metric: "runs daily at 10:00 · zero-touch",
    title: "AI Daily Briefing",
    description:
      "Automated personal assistant that fetches unread emails, Google Calendar events, and news headlines every morning, generates a structured briefing with Claude AI, and emails it at 10 AM. Replies to the briefing email trigger Claude to reply or delete emails on your behalf.",
    tech: ["Python", "Claude AI", "Gmail API", "Google Calendar API", "GitHub Actions", "RSS"],
    github: "https://github.com/anupkatuwal/daily-briefing",
    live: "",
  },
];

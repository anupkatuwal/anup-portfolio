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

/* ── ABOUT ────────────────────────────────────────────────────────────────────
   Short academic + professional bio shown in the About section, plus the
   three-step academic timeline graphic (B.Sc. → M.Sc. → Research).          */

export const ABOUT = {
  lead:
    "I'm a Computer Information Systems graduate who works at the seam between " +
    "academic research and production data engineering — reading the literature, " +
    "then building the pipeline that puts it to work.",
  body: [
    "My Master's research at NCIT (Pokhara University) studied fairness in " +
    "mental-health sentiment analysis: I built RMH-Bias-10K, a 10,000-post Reddit " +
    "corpus, and fine-tuned BERT with adversarial debiasing and counterfactual " +
    "augmentation to cut demographic bias without giving up accuracy.",
    "Alongside the research I build the unglamorous parts that make data usable — " +
    "ETL pipelines, star-schema warehouses, MySQL stored procedures, automated " +
    "test suites and CI/CD — and I've taught database design as a lab TA and " +
    "supervised junior developers on Java and Spring Boot work.",
  ],
  milestones: [
    {
      year: "2010 – 2014",
      title: "B.Sc. in Computer Information Systems",
      detail: "Columbia College, Denver, Colorado · GPA 3.34",
    },
    {
      year: "2020 – 2026",
      title: "M.Sc. in Computer Information Systems",
      detail: "NCIT, Pokhara University · CGPA 3.71",
    },
    {
      year: "2024 – present",
      title: "Research & Applied Projects",
      detail: "FairBERT thesis · ETL pipelines · data automation",
    },
  ],
};

/* ── RESEARCH ─────────────────────────────────────────────────────────────────
   Powers the /research page. `charts` are rendered as inline SVG bar charts —
   every number below comes from the thesis; do not add figures you can't cite.
   `references` are formatted IEEE-style ([1], [2], …) in source order.       */

export const RESEARCH = {
  title: "Bias Mitigation in Mental-Health Sentiment Analysis using BERT with Fairness Techniques",
  shortTitle: "FairBERT",
  venue: "M.Sc. thesis · NCIT, Pokhara University",
  period: "2024 – 2026",
  keywords: ["Fairness in NLP", "BERT", "Adversarial Debiasing", "Counterfactual Augmentation", "Mental Health"],
  thesisUrl: "https://github.com/anupkatuwal/bias-aware-sentiment-analysis-mental-health",
  abstract:
    "Sentiment classifiers trained on social-media mental-health text inherit the " +
    "demographic skew of their training data, and the resulting error is not evenly " +
    "distributed: posts written in non-standard dialects are misread far more often " +
    "than posts written in standard English. This work introduces FairBERT, a " +
    "fine-tuned BERT classifier trained on RMH-Bias-10K — a purpose-built corpus of " +
    "10,000 Reddit mental-health posts — that combines adversarial debiasing with " +
    "counterfactual data augmentation. FairBERT reaches 84.0% accuracy, 0.688 " +
    "macro-F1 and 0.843 ROC-AUC while reducing mean demographic parity difference " +
    "by 35.4%, with the largest gain on dialect, where DPD falls from 0.327 to " +
    "0.066 (−79.8%). The results show that a substantial share of the measured bias " +
    "can be removed at a small, quantifiable cost to raw accuracy.",
  methodology: [
    {
      step: "01",
      title: "Corpus construction",
      detail:
        "Collected 10,000 Reddit mental-health posts through the Reddit API and " +
        "assembled RMH-Bias-10K: de-duplicated, anonymised, sentiment-labelled, and " +
        "annotated with the demographic proxies (gender, dialect, age band) the " +
        "fairness metrics are measured over.",
    },
    {
      step: "02",
      title: "Baselines",
      detail:
        "Trained a BiLSTM and a vanilla fine-tuned BERT classifier as reference " +
        "points, so every fairness gain could be reported against a like-for-like " +
        "accuracy baseline rather than in isolation.",
    },
    {
      step: "03",
      title: "Counterfactual augmentation",
      detail:
        "Generated counterfactual variants of training posts by swapping demographic " +
        "markers while holding the sentiment-bearing content fixed, so the model sees " +
        "the same affect expressed across group identities.",
    },
    {
      step: "04",
      title: "Adversarial debiasing",
      detail:
        "Attached an adversary head that predicts the protected attribute from the " +
        "encoder representation and trained it against the classifier with a gradient " +
        "reversal layer, pushing group information out of the representation.",
    },
    {
      step: "05",
      title: "Evaluation",
      detail:
        "Reported accuracy, macro-F1 and ROC-AUC alongside demographic parity " +
        "difference and equalised-odds gaps per protected attribute — accuracy alone " +
        "is not a result in fairness work.",
    },
  ],
  /* Performance of the final FairBERT model. Baseline numbers for BiLSTM /
     vanilla BERT are not published here — add them once the exact figures are
     confirmed from the thesis tables, rather than estimating. */
  charts: [
    {
      id: "performance",
      title: "FairBERT — classification performance",
      note: "Final model, held-out test split of RMH-Bias-10K.",
      unit: "score",
      max: 1,
      bars: [
        { label: "Accuracy",  value: 0.84  },
        { label: "Macro-F1",  value: 0.688 },
        { label: "ROC-AUC",   value: 0.843 },
      ],
    },
    {
      id: "fairness",
      title: "Demographic parity difference — before vs. after debiasing",
      note: "Lower is fairer. Dialect DPD falls 79.8%; the mean across protected attributes falls 35.4%.",
      unit: "DPD",
      max: 0.35,
      grouped: true,
      bars: [
        { label: "Dialect", before: 0.327, after: 0.066 },
      ],
    },
  ],
  results: [
    "84.0% accuracy, 0.688 macro-F1 and 0.843 ROC-AUC on the held-out split — ahead of both the BiLSTM and vanilla-BERT baselines.",
    "Mean demographic parity difference reduced by 35.4% across the protected attributes measured.",
    "Dialect DPD reduced from 0.327 to 0.066 — a 79.8% reduction, the largest single fairness gain in the study.",
    "Counterfactual augmentation and adversarial debiasing are complementary: neither alone reproduced the combined result.",
  ],
  /* IEEE-style references, numbered in citation order. */
  references: [
    'J. Devlin, M.-W. Chang, K. Lee, and K. Toutanova, "BERT: Pre-training of deep bidirectional transformers for language understanding," in Proc. NAACL-HLT, Minneapolis, MN, USA, 2019, pp. 4171–4186.',
    'B. H. Zhang, B. Lemoine, and M. Mitchell, "Mitigating unwanted biases with adversarial learning," in Proc. AAAI/ACM Conf. AI, Ethics, and Society, New Orleans, LA, USA, 2018, pp. 335–340.',
    'M. Hardt, E. Price, and N. Srebro, "Equality of opportunity in supervised learning," in Adv. Neural Inf. Process. Syst., vol. 29, Barcelona, Spain, 2016, pp. 3315–3323.',
    'S. Barocas, M. Hardt, and A. Narayanan, Fairness and Machine Learning: Limitations and Opportunities. Cambridge, MA, USA: MIT Press, 2023.',
    'S. Blodgett, S. Barocas, H. Daumé III, and H. Wallach, "Language (technology) is power: A critical survey of ‘bias’ in NLP," in Proc. ACL, Online, 2020, pp. 5454–5476.',
    'Y. Ganin and V. Lempitsky, "Unsupervised domain adaptation by backpropagation," in Proc. Int. Conf. Machine Learning, Lille, France, 2015, pp. 1180–1189.',
  ],
};

/* ── SKILLS MATRIX ────────────────────────────────────────────────────────────
   Technical and soft skills, shown as a matrix in the Experience section.
   `level` is 1–5 and drives the meter width.                                */

export const SKILL_MATRIX = {
  technical: [
    { name: "Python (Pandas, NumPy)", level: 5 },
    { name: "SQL / MySQL",            level: 5 },
    { name: "ETL & Data Warehousing", level: 4 },
    { name: "NLP (BERT, Transformers)", level: 4 },
    { name: "Scikit-learn & ML workflow", level: 4 },
    { name: "FastAPI / REST APIs",    level: 3 },
    { name: "React & front-end",      level: 3 },
    { name: "Git & GitHub Actions",   level: 4 },
  ],
  professional: [
    { name: "Technical writing (IEEE)", level: 5 },
    { name: "Teaching & mentoring",     level: 5 },
    { name: "Research methodology",     level: 4 },
    { name: "Code review",              level: 4 },
    { name: "Client communication",     level: 4 },
    { name: "Data storytelling",        level: 4 },
  ],
};

/* ── TESTIMONIALS ─────────────────────────────────────────────────────────────
   Intentionally empty. Add only real, attributable quotes you have permission
   to publish — the section renders nothing while this list is empty.
   Shape: { quote, name, role, org }                                         */

export const TESTIMONIALS = [];

/* ── BLOG ─────────────────────────────────────────────────────────────────────
   Short technical posts. `body` is an array of paragraphs; a string starting
   with "- " renders as a bullet, and "## " as a subheading. The two newest
   posts (by `date`) are teased on the homepage.                             */

export const BLOG_POSTS = [
  {
    slug: "data-cleaning-is-the-analysis",
    title: "Data cleaning is the analysis",
    date: "2026-07-18",
    readingTime: "5 min",
    tags: ["Data Engineering", "Pandas"],
    excerpt:
      "The decisions you make while cleaning a dataset are modelling decisions. Treating them as chores is how silent bias gets in.",
    body: [
      "Every cleaning step is a claim about the world. Dropping rows with missing income is a claim that those rows are missing at random. Clipping outliers at the 99th percentile is a claim that the tail is measurement error rather than signal. Neither claim is obviously true, and neither shows up in the model card.",
      "## Write the rule down before you write the code",
      "When I built RMH-Bias-10K for my thesis, the single most useful habit was keeping a decision log next to the pipeline: what was removed, how many rows it cost, and why. It turned an invisible judgement call into a reviewable one — and twice it caught me discarding exactly the posts the fairness analysis needed.",
      "A practical version of this fits in a few lines:",
      "- Log the row count before and after every filter, not just at the end.",
      "- Make each step idempotent, so re-running the pipeline can never double-apply a transform.",
      "- Keep the raw extract immutable; clean into a new table, never in place.",
      "- Assert the invariants you believe in (no duplicate keys, no negative durations) and let the pipeline fail loudly when they break.",
      "## Cleaning is where fairness is decided",
      "In the thesis, dialect was the attribute with the worst bias — and part of the reason is that standard text-normalisation steps quietly erase dialect features before the model ever sees them. The classifier looked better on paper because the cleaning had already thrown away what made the hard cases hard.",
      "So the rule I now work by: if a cleaning step changes how a group is represented, it belongs in the results section, not in a helper function nobody reads.",
    ],
  },
  {
    slug: "fairness-metrics-are-not-interchangeable",
    title: "Fairness metrics are not interchangeable",
    date: "2026-06-02",
    readingTime: "6 min",
    tags: ["AI Ethics", "NLP"],
    excerpt:
      "Demographic parity, equalised odds and calibration answer different questions — and you generally cannot satisfy all three at once.",
    body: [
      "\"Is the model fair?\" is not a question a single number can answer. It's at least three questions, and the impossibility results tell us that outside of degenerate cases we cannot answer all of them yes at the same time.",
      "## The three questions",
      "- Demographic parity asks whether groups receive positive predictions at the same rate. It ignores whether the underlying base rates differ.",
      "- Equalised odds asks whether the error is distributed evenly — same true-positive and false-positive rates across groups. It accepts unequal prediction rates as long as mistakes are shared fairly.",
      "- Calibration asks whether a predicted score of 0.8 means the same thing for every group. Perfectly reasonable, and provably incompatible with equalised odds when base rates differ.",
      "## Choosing is a domain decision, not a technical one",
      "For mental-health sentiment classification I reported demographic parity difference as the headline metric, because the downstream harm I cared about was under-detection of distress in one group relative to another. Had the system been used to allocate a scarce clinical resource, equalised odds would have been the honest choice instead.",
      "The mistake to avoid is picking the metric that makes your numbers look best and calling the result \"fair\". Name the harm first, then pick the metric that measures it, then report the ones you did not optimise for as well — including where they got worse.",
      "## Report the cost",
      "Debiasing is rarely free. In my own work, cutting mean demographic parity difference by 35.4% cost measurable accuracy against the vanilla baseline. That trade-off is the result; hiding it would make the paper less useful, not more impressive.",
    ],
  },
  {
    slug: "feature-engineering-in-the-warehouse",
    title: "Feature engineering belongs in the warehouse",
    date: "2026-04-21",
    readingTime: "4 min",
    tags: ["Feature Engineering", "SQL"],
    excerpt:
      "If a feature is computed in a notebook, it exists once. If it's computed in the warehouse, it exists for every model you'll ever train.",
    body: [
      "The fastest way to end up with three subtly different definitions of \"active customer\" is to let three notebooks each define it. The definitions drift, the numbers stop reconciling, and nobody can say which dashboard is right.",
      "## Push the definition down",
      "Building the food-order ETL pipeline, the thing that made the analytics tractable wasn't the model layer — it was resolving the star schema properly: a fact table of orders and conformed dimensions for customer, restaurant, item and date. Once the grain is fixed and the dimensions are conformed, most \"features\" become a GROUP BY rather than a bespoke transform.",
      "- Define the feature once, as a view or a derived table with a documented grain.",
      "- Keep the transform in stored procedures or version-controlled SQL — reviewable, diffable, testable.",
      "- Test the feature like code: a row-count assertion and a known-value check beat a comment saying it works.",
      "## Notebooks are for questions, not for definitions",
      "There's still a place for a notebook: exploring, plotting, arguing with the data. But the moment a computed column becomes something a second person depends on, it should move out of the notebook and into the warehouse, where it gets a name, a test, and a history.",
    ],
  },
];

/* ── AGGREGATE ────────────────────────────────────────────────────────────────
   The full content document, in the same shape the admin panel edits and the
   API stores. Order of keys here defines the order sections appear in /admin. */

export const DEFAULT_CONTENT = {
  ABOUT,
  PRIMARY_SKILLS,
  SKILLS,
  EXPERIENCES,
  EDUCATION,
  TRAINING,
  CERTIFICATIONS,
  FOUNDATIONS,
  RESUME_HIGHLIGHTS,
  SKILL_MATRIX,
  TESTIMONIALS,
  PROJECTS,
  RESEARCH,
  BLOG_POSTS,
};

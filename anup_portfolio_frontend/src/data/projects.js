// src/data/projects.js

const projects = [
  {
    id: 1,
    title: "Bias-Aware Sentiment Analysis (Master’s Thesis)",
    description:
      "Fairness-aware sentiment analysis on Reddit mental health data using BERT, counterfactual data augmentation, and adversarial debiasing.",
    tech: ["Python", "BERT", "NLP", "Fairlearn", "IEEE"],
    github: "https://github.com/anupkatuwal/rmh-bias-fairbert",
    demo: null,
  },
  {
    id: 2,
    title: "AI Resume Screener",
    description:
      "An intelligent resume screening system that ranks candidates using NLP and transformer embeddings.",
    tech: ["FastAPI", "React", "NLP", "SQL"],
    github: "https://github.com/anupkatuwal/ai-resume-screener",
    demo: null,
  },
  {
    id: 3,
    title: "Personal Portfolio System",
    description:
      "A full-stack portfolio system with admin authentication, contact management, and responsive UI.",
    tech: ["FastAPI", "React", "JWT", "SQLite"],
    github: "https://github.com/anupkatuwal/portfolio-app",
    demo: null,
  },
  {
    id: 4,
    title: "AI Daily Briefing",
    description:
      "Automated personal assistant that fetches unread emails, Google Calendar events, and news headlines every morning, generates a structured briefing with Claude AI, and emails it at 10 AM. Replies to the briefing email trigger Claude to reply or delete emails on your behalf.",
    tech: ["Python", "Claude AI", "Gmail API", "Google Calendar API", "GitHub Actions", "RSS"],
    github: "https://github.com/anupkatuwal/daily-briefing",
    demo: null,
  },
];

export default projects;

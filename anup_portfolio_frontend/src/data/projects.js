// src/data/projects.js

const projects = [
  {
    id: 1,
    title: "Bias-Aware Sentiment Analysis (Master’s Thesis)",
    description:
      "Fine-tuned BERT on 52,000+ Reddit mental-health posts for sentiment classification. Achieved 84% F1-score. Reduced demographic parity gap by 56% (ΔDP: 0.211 → 0.098). Published as IEEE-format research paper.",
    tech: ["Python", "BERT", "NLP", "Fairlearn", "IEEE"],
    github: "https://github.com/anupkatuwal/rmh-bias-fairbert",
    demo: null,
    featured: true,
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

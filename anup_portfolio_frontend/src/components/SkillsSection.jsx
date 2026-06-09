import React from "react";
import { Section } from "./Section";

const PRIMARY = new Set(["Python", "SQL", "BERT", "Pandas", "FastAPI"]);

const SKILLS = [
  { domain: "data",   items: ["Python", "Pandas", "NumPy", "SQL", "Data Visualization"] },
  { domain: "ml/nlp", items: ["BERT", "Transformers", "Scikit-learn", "Sentiment Analysis", "Fairness Metrics"] },
  { domain: "web",    items: ["FastAPI", "React", "Vite", "REST APIs", "SQLite"] },
  { domain: "tools",  items: ["Git", "Jupyter", "Google Colab", "VS Code", "Linux"] },
];

export function SkillsSection() {
  return (
    <Section id="skills" title="Skills" eyebrow="// what I work with">
      <div className="skills-table">
        {SKILLS.map((row) => (
          <div key={row.domain} className="skill-row">
            <div className="skill-domain">{row.domain}</div>
            <div className="skill-items">
              {row.items.map((item) => (
                <span key={item} className={`skill-chip${PRIMARY.has(item) ? " skill-chip--primary" : ""}`}>{item}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

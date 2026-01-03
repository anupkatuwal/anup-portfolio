// src/components/SkillsSection.jsx
import React from "react";
import { Section } from "./Section";

const SKILL_GROUPS = [
  {
    title: "Programming & Data",
    items: ["Python", "Pandas / NumPy", "SQL (MySQL, MS SQL, SQLite)", "Data Visualization"],
  },
  {
    title: "Web & APIs",
    items: ["FastAPI", "Flask (basics)", "React", "RESTful APIs"],
  },
  {
    title: "Machine Learning & NLP",
    items: ["Scikit-learn", "Transformers / BERT", "Sentiment Analysis", "Model Evaluation"],
  },
  {
    title: "Tools & Platforms",
    items: ["Git & GitHub", "VS Code", "Google Colab", "Jupyter"],
  },
];

export function SkillsSection() {
  return (
    <Section id="skills" title="Skills" eyebrow="What I work with">
      <div className="skills-grid">
        {SKILL_GROUPS.map((group) => (
          <article key={group.title} className="card">
            <h3 className="card-title">{group.title}</h3>
            <ul className="pill-list">
              {group.items.map((item) => (
                <li key={item} className="pill">
                  {item}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </Section>
  );
}

// src/components/SkillsMatrix.jsx — technical vs. professional skills, each
// with a 1–5 proficiency meter. Rendered inside the Experience section.
import React from "react";
import { useContent } from "../context/ContentContext";

const LEVELS = ["Familiar", "Working", "Practised", "Strong", "Core"];

function Column({ heading, skills }) {
  if (!skills?.length) return null;
  return (
    <div className="matrix-col">
      <h4 className="matrix-heading">{heading}</h4>
      <ul className="matrix-list">
        {skills.map((s) => (
          <li key={s.name} className="matrix-row">
            <span className="matrix-name">{s.name}</span>
            <span
              className="matrix-meter"
              role="img"
              aria-label={`${s.name}: ${LEVELS[Math.min(s.level, 5) - 1] || ""} (${s.level} of 5)`}
            >
              {[1, 2, 3, 4, 5].map((step) => (
                <span
                  key={step}
                  className={`matrix-pip${step <= s.level ? " is-filled" : ""}`}
                />
              ))}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SkillsMatrix() {
  const { SKILL_MATRIX } = useContent();
  if (!SKILL_MATRIX) return null;
  const { technical = [], professional = [] } = SKILL_MATRIX;
  if (!technical.length && !professional.length) return null;

  return (
    <div className="skills-matrix">
      <h3 className="subsection-title">Skills matrix</h3>
      <div className="matrix-grid">
        <Column heading="Technical" skills={technical} />
        <Column heading="Professional" skills={professional} />
      </div>
    </div>
  );
}

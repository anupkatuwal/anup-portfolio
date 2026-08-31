// src/components/SkillsMatrix.jsx — what's in current use vs. what's being
// learned. Deliberately no numeric proficiency ratings: a "4/5" is a claim
// nobody can verify, and it isn't one the site owner made.
import React from "react";
import { useContent } from "../context/ContentContext";

function Column({ heading, note, skills, learning }) {
  if (!skills?.length) return null;
  return (
    <div className="matrix-col">
      <h4 className="matrix-heading">{heading}</h4>
      {note && <p className="matrix-note">{note}</p>}
      <ul className="matrix-list">
        {skills.map((name) => (
          <li key={name} className={`matrix-row${learning ? " matrix-row--learning" : ""}`}>
            <span className="matrix-name">{name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SkillsMatrix() {
  const { SKILL_MATRIX } = useContent();
  if (!SKILL_MATRIX) return null;
  const { using = [], learning = [] } = SKILL_MATRIX;
  if (!using.length && !learning.length) return null;

  return (
    <div className="skills-matrix">
      <h3 className="subsection-title">Skills</h3>
      <div className="matrix-grid">
        <Column heading="Working with" skills={using} />
        <Column heading="Learning" note="In progress — not claiming these yet." skills={learning} learning />
      </div>
    </div>
  );
}

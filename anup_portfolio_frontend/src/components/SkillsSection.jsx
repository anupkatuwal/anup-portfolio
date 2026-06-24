import React from "react";
import { Section } from "./Section";
import { useContent } from "../context/ContentContext";

export function SkillsSection() {
  const { SKILLS = [], PRIMARY_SKILLS = [] } = useContent();
  const PRIMARY = new Set(PRIMARY_SKILLS);
  return (
    <Section id="skills" title="Skills" eyebrow="// what I work with">
      <div className="skills-table">
        {SKILLS.map((row) => (
          <div key={row.domain} className="skill-row">
            <div className="skill-domain">{row.domain}</div>
            <div className="skill-items">
              {(row.items || []).map((item) => (
                <span key={item} className={`skill-chip${PRIMARY.has(item) ? " skill-chip--primary" : ""}`}>{item}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

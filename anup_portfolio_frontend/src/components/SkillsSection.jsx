import React from "react";
import { Section } from "./Section";
import { SKILLS, PRIMARY_SKILLS } from "../data/content";

const PRIMARY = new Set(PRIMARY_SKILLS);

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

// src/components/SkillsSection.jsx — one skills list, split into what's in
// current use and what's being learned (SKILL_MATRIX in content.js).
// Deliberately no numeric proficiency ratings: a "4/5" is a claim nobody can
// verify, and it isn't one the site owner made.
import React from "react";
import { Section } from "./Section";
import { useContent } from "../context/ContentContext";

export function SkillsSection() {
  const { SKILL_MATRIX } = useContent();
  if (!SKILL_MATRIX) return null;
  const { using = [], learning = [] } = SKILL_MATRIX;
  if (!using.length && !learning.length) return null;

  return (
    <Section id="skills" title="Skills">
      <dl className="skills">
        {using.length > 0 && (
          <>
            <dt>Working with</dt>
            <dd>
              <ul className="inline-list">
                {using.map((s) => <li key={s}>{s}</li>)}
              </ul>
            </dd>
          </>
        )}
        {learning.length > 0 && (
          <>
            <dt>Learning</dt>
            <dd>
              <ul className="inline-list">
                {learning.map((s) => <li key={s}>{s}</li>)}
              </ul>
            </dd>
          </>
        )}
      </dl>
    </Section>
  );
}

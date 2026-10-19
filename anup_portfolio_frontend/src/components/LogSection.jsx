// src/components/LogSection.jsx — `04 / log`: experience as a git log
// (DESIGN.md §5.9). Entries come from EXPERIENCES, newest first; the hash is
// decorative and derived from the entry, so it is stable between loads.
import React from "react";
import { Section } from "./Section";
import { useContent } from "../context/ContentContext";
import { shortHash } from "../lib/gitHash";

export function LogSection() {
  const { EXPERIENCES = [] } = useContent();

  return (
    <Section id="log" index="04" label="log" title="Experience">
      <ol className="git-log" data-reveal-group>
        {EXPERIENCES.map((e) => {
          const lines = e.bullets?.length ? e.bullets.slice(0, 2) : e.description ? [e.description] : [];
          return (
            <li key={e.role + e.org} className="commit">
              <p className="commit-meta">
                <span className="commit-hash">{shortHash(`${e.role} ${e.org}`)}</span>
                <span className="commit-date">{e.period}</span>
              </p>
              <h3 className="commit-title">{e.role} · {e.org}</h3>
              {lines.map((l) => <p key={l} className="commit-desc">{l}</p>)}
            </li>
          );
        })}
      </ol>
    </Section>
  );
}

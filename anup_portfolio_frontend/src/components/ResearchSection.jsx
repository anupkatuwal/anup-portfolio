// src/components/ResearchSection.jsx — homepage teaser linking to /research.
import React from "react";
import { Section } from "./Section";
import { useContent } from "../context/ContentContext";

export function ResearchSection() {
  const { RESEARCH } = useContent();
  if (!RESEARCH) return null;

  const { title, venue, period, abstract, keywords = [], results = [] } = RESEARCH;
  const teaser = abstract.split(". ").slice(0, 2).join(". ") + ".";

  return (
    <Section id="research" title="Research" eyebrow="// thesis">
      <article className="card research-card">
        <h3 className="research-title">{title}</h3>
        <p className="research-meta">{venue} · {period}</p>
        <p className="research-abstract">{teaser}</p>

        {results.length > 0 && (
          <ul className="bullet-list research-points">
            {results.slice(0, 2).map((r) => <li key={r}>{r}</li>)}
          </ul>
        )}

        {keywords.length > 0 && (
          <ul className="pill-list">
            {keywords.map((k) => <li key={k} className="pill">{k}</li>)}
          </ul>
        )}

        <div className="research-actions">
          <a className="btn btn-primary" href="/research">Read the research →</a>
        </div>
      </article>
    </Section>
  );
}

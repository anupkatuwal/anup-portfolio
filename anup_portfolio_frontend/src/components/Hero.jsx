// src/components/Hero.jsx — `> whoami` (DESIGN.md §5.2). Copy comes from SITE
// in content.js; scripts/prerender-home.mjs renders the same markup.
import React from "react";
import { SqlConsole } from "./SqlConsole";
import { useContent } from "../context/ContentContext";

export function Hero() {
  const { SITE = {} } = useContent();

  return (
    <section id="top" className="hero">
      <div className="container hero-grid">
        <div className="hero-main">
          <p className="label">&gt; whoami</p>
          <h1 className="hero-name">{SITE.name}</h1>
          <p className="hero-lead">{SITE.lead}</p>

          <SqlConsole console={SITE.console} />

          <div className="hero-actions">
            <a href="#work" className="btn btn-primary">View work</a>
            <a href={SITE.cvUrl} className="btn btn-secondary" target="_blank" rel="noreferrer">
              Download CV
            </a>
          </div>
        </div>

        <picture className="hero-photo">
          <source srcSet="/portrait.webp" type="image/webp" />
          <img
            src="/profile.jpg"
            alt={`${SITE.name}, portrait`}
            width="608"
            height="760"
            fetchPriority="high"
          />
        </picture>
      </div>
    </section>
  );
}

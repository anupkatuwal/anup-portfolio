// src/pages/Research.jsx — /research
// Thesis abstract, methodology, results (with charts) and IEEE references.
import React from "react";
import { useContent } from "../context/ContentContext";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { BarChart } from "../components/BarChart";
import { useScrollReveal } from "../lib/useScrollReveal";

export default function Research() {
  const { RESEARCH } = useContent();
  useScrollReveal(RESEARCH);
  if (!RESEARCH) return null;

  const {
    title, shortTitle, venue, period, keywords = [], thesisUrl,
    abstract, methodology = [], charts = [], results = [], references = [],
  } = RESEARCH;

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Navbar path="/research" />
      <main id="main" className="page">
        <article className="container paper">

          <nav className="crumb" aria-label="Breadcrumb">
            <a href="/">Home</a> <span aria-hidden="true">/</span> <span>Research</span>
          </nav>

          <header className="paper-head">
            <p className="section-eyebrow">// master&apos;s thesis · {shortTitle}</p>
            <h1 className="paper-title">{title}</h1>
            <p className="paper-meta">Anup Katuwal · {venue} · {period}</p>
            {keywords.length > 0 && (
              <ul className="pill-list paper-keywords">
                {keywords.map((k) => <li key={k} className="pill">{k}</li>)}
              </ul>
            )}
            {thesisUrl && (
              <p className="paper-cta">
                <a className="btn btn-accent" href={thesisUrl} target="_blank" rel="noreferrer">
                  Read Full Thesis ↗
                </a>
              </p>
            )}
          </header>

          <section className="paper-section" aria-labelledby="abstract">
            <h2 className="paper-h2" id="abstract">Abstract</h2>
            <p className="paper-abstract">{abstract}</p>
          </section>

          <section className="paper-section" aria-labelledby="methodology">
            <h2 className="paper-h2" id="methodology">Methodology</h2>
            <ol className="method-list">
              {methodology.map((m) => (
                <li key={m.step} className="card method-step">
                  <span className="method-num" aria-hidden="true">{m.step}</span>
                  <div>
                    <h3 className="card-title">{m.title}</h3>
                    <p className="card-text">{m.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="paper-section" aria-labelledby="results">
            <h2 className="paper-h2" id="results">Results</h2>
            <div className="chart-stack">
              {charts.map((c) => <BarChart key={c.id} chart={c} />)}
            </div>
            <ul className="bullet-list paper-results">
              {results.map((r) => <li key={r}>{r}</li>)}
            </ul>
          </section>

          {references.length > 0 && (
            <section className="paper-section" aria-labelledby="references">
              <h2 className="paper-h2" id="references">References</h2>
              <ol className="ieee-list">
                {references.map((r, i) => (
                  <li key={r} className="ieee-item">
                    <span className="ieee-num">[{i + 1}]</span>
                    <span className="ieee-text">{r}</span>
                  </li>
                ))}
              </ol>
            </section>
          )}

          <p className="paper-back"><a href="/">← Back to the homepage</a></p>
        </article>
      </main>
      <Footer />
    </>
  );
}

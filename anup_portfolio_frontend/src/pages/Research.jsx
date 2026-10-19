// src/pages/Research.jsx — /research
// Thesis abstract, methodology, results (with charts) and IEEE references.
import React from "react";
import { useContent } from "../context/ContentContext";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { BarChart } from "../components/BarChart";

export default function Research() {
  const { RESEARCH } = useContent();
  if (!RESEARCH) return null;

  const {
    title, venue, period, keywords = [], thesisUrl,
    abstract, methodology = [], charts = [], results = [], references = [],
  } = RESEARCH;

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Navbar path="/research" />
      <main id="main" className="page">
        <article className="container">

          <nav className="crumb" aria-label="Breadcrumb">
            <a href="/">Home</a> <span aria-hidden="true">/</span> <span>Research</span>
          </nav>

          <header className="page-head">
            <h1 className="page-title">{title}</h1>
            <p className="meta">Anup Katuwal · {venue} · {period}</p>
            {keywords.length > 0 && (
              <ul className="tags" aria-label="Keywords">
                {keywords.map((k) => <li key={k} className="tag">{k}</li>)}
              </ul>
            )}
            {thesisUrl && (
              <p className="page-actions">
                <a className="btn btn-primary" href={thesisUrl} target="_blank" rel="noreferrer">
                  Read the full thesis ↗
                </a>
              </p>
            )}
          </header>

          <section className="page-section" aria-labelledby="abstract">
            <h2 id="abstract">Abstract</h2>
            <p>{abstract}</p>
          </section>

          <section className="page-section" aria-labelledby="methodology">
            <h2 id="methodology">Methodology</h2>
            <ol className="method-list">
              {methodology.map((m) => (
                <li key={m.step} className="method-step">
                  <span className="method-num" aria-hidden="true">{m.step}</span>
                  <div>
                    <h3>{m.title}</h3>
                    <p>{m.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="page-section" aria-labelledby="results">
            <h2 id="results">Results</h2>
            <div className="chart-stack">
              {charts.map((c) => <BarChart key={c.id} chart={c} />)}
            </div>
            <ul className="bullets">
              {results.map((r) => <li key={r}>{r}</li>)}
            </ul>
          </section>

          {references.length > 0 && (
            <section className="page-section" aria-labelledby="references">
              <h2 id="references">References</h2>
              <ol className="ieee-list">
                {references.map((r, i) => (
                  <li key={r} className="ieee-item">
                    <span className="ieee-num">[{i + 1}]</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ol>
            </section>
          )}

          <p className="page-back"><a href="/">← Back to the homepage</a></p>
        </article>
      </main>
      <Footer />
    </>
  );
}

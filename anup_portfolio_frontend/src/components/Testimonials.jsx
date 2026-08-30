// src/components/Testimonials.jsx — supervisor / colleague quotes.
// Renders nothing until TESTIMONIALS in src/data/content.js (or the admin
// panel) holds real, attributable quotes.
import React from "react";
import { useContent } from "../context/ContentContext";

export function Testimonials() {
  const { TESTIMONIALS = [] } = useContent();
  // Skip half-filled entries — a quote with nobody attached is worse than none.
  const quotes = TESTIMONIALS.filter((t) => t && t.quote && t.name);
  if (!quotes.length) return null;

  return (
    <div className="testimonials">
      <h3 className="subsection-title">What colleagues say</h3>
      <div className="testimonial-grid">
        {quotes.map((t) => (
          <figure key={t.name + t.quote.slice(0, 20)} className="card testimonial">
            <blockquote className="testimonial-quote">“{t.quote}”</blockquote>
            <figcaption className="testimonial-source">
              <span className="testimonial-name">{t.name}</span>
              <span className="testimonial-role">
                {[t.role, t.org].filter(Boolean).join(" · ")}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

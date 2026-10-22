// src/components/BarChart.jsx
// Horizontal bar chart for the research results. Plain HTML and CSS — no chart
// library, so nothing extra loads and the strict CSP stays untouched. The
// text stays at body size at any width (a scaled SVG shrank it on phones).
//
// Two shapes, both driven by RESEARCH.charts in src/data/content.js:
//   simple   { label, value }           — one series, no legend
//   grouped  { label, before, after }   — two series, legend + direct labels
//
// Every bar is direct-labelled with its value, so identity never rests on
// colour alone (the two series sit close together under tritanopia).
import React from "react";

const fmt = (v) => String(Number(v.toFixed(3)));
const pct = (v, max) => `${Math.max(0.5, (Math.min(v, max) / max) * 100)}%`;

export function BarChart({ chart }) {
  const { bars = [], max = 1, unit, grouped, title, note, id } = chart;

  const series = grouped
    ? bars.flatMap((b) => [
        { key: `${b.label}-before`, label: b.label, sub: "before", value: b.before, tone: "a" },
        { key: `${b.label}-after`, label: "", sub: "after", value: b.after, tone: "b" },
      ])
    : bars.map((b) => ({ key: b.label, label: b.label, sub: "", value: b.value, tone: "b" }));

  const titleId = `chart-${id}-title`;

  return (
    <figure className="chart" aria-labelledby={titleId}>
      <figcaption className="chart-caption">
        <h3 className="chart-title" id={titleId}>{title}</h3>
        {note && <p className="chart-note">{note}</p>}
      </figcaption>

      {grouped && (
        <ul className="chart-legend">
          <li><span className="chart-swatch chart-swatch--a" aria-hidden="true" />Before debiasing</li>
          <li><span className="chart-swatch chart-swatch--b" aria-hidden="true" />After debiasing</li>
        </ul>
      )}

      <div
        className={`chart-plot${grouped ? " chart-plot--grouped" : ""}`}
        role="img"
        aria-label={`${title}. ${series
          .map((s) => `${s.label || bars[0]?.label} ${s.sub} ${fmt(s.value)}`.trim())
          .join("; ")}.`}
      >
        {series.map((s) => (
          <div key={s.key} className="chart-row" aria-hidden="true">
            <span className="chart-label">{s.label}</span>
            <span className="chart-track">
              <span
                className={`chart-bar chart-bar--${s.tone}`}
                style={{ width: pct(s.value, max) }}
                title={`${s.label || bars[0]?.label} ${s.sub}: ${fmt(s.value)}`.replace(" :", ":")}
              />
            </span>
            <span className="chart-value">{fmt(s.value)}{s.sub ? ` ${s.sub}` : ""}</span>
          </div>
        ))}
      </div>
      <p className="chart-unit">{`scale 0 – ${max} (${unit})`}</p>
    </figure>
  );
}

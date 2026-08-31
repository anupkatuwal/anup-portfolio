// src/components/BarChart.jsx
// Horizontal bar chart for the research results. Plain inline SVG — no chart
// library, so nothing extra loads and the strict CSP stays untouched.
//
// Two shapes, both driven by RESEARCH.charts in src/data/content.js:
//   simple   { label, value }           — one series, no legend
//   grouped  { label, before, after }   — two series, legend + direct labels
//
// Every bar is direct-labelled with its value, so identity never rests on
// colour alone (the two series sit close together under tritanopia).
import React from "react";

const BAR_H = 16;
const LABEL_W = 116;
const VALUE_W = 92;
const PAD_TOP = 10;
const PLOT_W = 1000 - LABEL_W - VALUE_W;

const fmt = (v) => String(Number(v.toFixed(3)));

export function BarChart({ chart }) {
  const { bars = [], max = 1, unit, grouped, title, note, id } = chart;

  const series = grouped
    ? bars.flatMap((b) => [
        { key: `${b.label}-before`, label: b.label, sub: "before", value: b.before, tone: "a" },
        { key: `${b.label}-after`, label: "", sub: "after", value: b.after, tone: "b" },
      ])
    : bars.map((b) => ({ key: b.label, label: b.label, sub: "", value: b.value, tone: "b" }));

  const rowH = grouped ? 30 : 44;
  const height = PAD_TOP + series.length * rowH + 26;
  const scale = (v) => Math.max(2, (Math.min(v, max) / max) * PLOT_W);
  const titleId = `chart-${id}-title`;

  return (
    <figure className="chart" aria-labelledby={titleId}>
      <figcaption className="chart-caption">
        <h4 className="chart-title" id={titleId}>{title}</h4>
        {note && <p className="chart-note">{note}</p>}
      </figcaption>

      {grouped && (
        <ul className="chart-legend">
          <li><span className="chart-swatch chart-swatch--a" aria-hidden="true" />Before debiasing</li>
          <li><span className="chart-swatch chart-swatch--b" aria-hidden="true" />After debiasing</li>
        </ul>
      )}

      <svg
        className="chart-svg"
        viewBox={`0 0 1000 ${height}`}
        role="img"
        aria-label={`${title}. ${series
          .map((s) => `${s.label || bars[0]?.label} ${s.sub} ${fmt(s.value)}`.trim())
          .join("; ")}.`}
        preserveAspectRatio="xMinYMin meet"
      >
        {/* Baseline — deliberately recessive */}
        <line
          className="chart-axis"
          x1={LABEL_W} y1={PAD_TOP - 4}
          x2={LABEL_W} y2={PAD_TOP + series.length * rowH}
        />
        {series.map((s, i) => {
          const y = PAD_TOP + i * rowH + (rowH - BAR_H) / 2;
          const w = scale(s.value);
          return (
            <g key={s.key}>
              {s.label && (
                <text className="chart-label" x={LABEL_W - 12} y={y + BAR_H - 3} textAnchor="end">
                  {s.label}
                </text>
              )}
              <rect
                className={`chart-bar chart-bar--${s.tone}`}
                x={LABEL_W} y={y} width={w} height={BAR_H} rx="4"
              >
                <title>{`${s.label || bars[0]?.label} ${s.sub}: ${fmt(s.value)}`}</title>
              </rect>
              <text className="chart-value" x={LABEL_W + w + 10} y={y + BAR_H - 3}>
                {fmt(s.value)}{s.sub ? ` ${s.sub}` : ""}
              </text>
            </g>
          );
        })}
        <text className="chart-unit" x={LABEL_W} y={height - 6}>
          {`scale 0 – ${max} (${unit})`}
        </text>
      </svg>
    </figure>
  );
}

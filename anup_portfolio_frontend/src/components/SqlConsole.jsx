// src/components/SqlConsole.jsx — the hero's query card (DESIGN.md §5.3).
// Types the query once (~35ms/char), then fades the result table in. Under
// prefers-reduced-motion it renders finished. The animated text is hidden
// from assistive tech; the full query sits in a visually-hidden copy.
import React, { useEffect, useState } from "react";

const KEYWORDS = new Set(["SELECT", "FROM", "WHERE", "AND", "OR", "ORDER", "BY", "LIMIT"]);

// Split the query into coloured tokens: keywords, numbers, everything else.
function tokenize(sql) {
  return sql.split(/(\s+|[;,=()])/).filter(Boolean).map((text) => ({
    text,
    kind: KEYWORDS.has(text.toUpperCase()) ? "kw" : /^\d+$/.test(text) ? "num" : "",
  }));
}

function typed(tokens, count) {
  const out = [];
  let left = count;
  for (const t of tokens) {
    if (left <= 0) break;
    out.push({ ...t, text: t.text.slice(0, left) });
    left -= t.text.length;
  }
  return out;
}

export function SqlConsole({ console: c }) {
  const query = c?.query || "";
  const rows = c?.rows || [];
  const tokens = tokenize(query);
  const [count, setCount] = useState(() =>
    typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
      ? query.length
      : 0
  );
  const done = count >= query.length;

  useEffect(() => {
    if (done) return;
    const t = window.setTimeout(() => setCount((n) => n + 1), 35);
    return () => window.clearTimeout(t);
  }, [count, done]);

  return (
    <figure className="console">
      <figcaption className="console-head">
        <span className="console-dots" aria-hidden="true"><i /><i /><i /></span>
        <span>{c?.file}</span>
      </figcaption>

      <div className="console-body">
        <p className="visually-hidden">{query}</p>
        <pre className="console-query" aria-hidden="true">
          {typed(tokens, count).map((t, i) => (
            <span key={i} className={t.kind ? `sql-${t.kind}` : undefined}>{t.text}</span>
          ))}
          <span className="cursor" />
        </pre>

        <table className={`console-result${done ? " is-shown" : ""}`}>
          <thead>
            <tr><th scope="col">focus</th><th scope="col">stack</th></tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.focus}><td>{r.focus}</td><td>{r.stack}</td></tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="console-foot">{c?.footer}</p>
    </figure>
  );
}

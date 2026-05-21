import React from "react";

export function Section({ id, title, eyebrow, children }) {
  return (
    <section id={id} className="section">
      <div className="container">
        {eyebrow && <p className="section-eyebrow">{eyebrow}</p>}
        {title && <h2 className="section-title">{title}</h2>}
        {children}
      </div>
    </section>
  );
}

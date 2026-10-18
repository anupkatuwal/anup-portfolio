import React from "react";

export function Section({ id, title, children }) {
  return (
    <section id={id} className="section" aria-labelledby={title ? `${id}-title` : undefined}>
      <div className="container">
        {title && <h2 className="section-title" id={`${id}-title`}>{title}</h2>}
        {children}
      </div>
    </section>
  );
}

import React from "react";

// A numbered homepage section: mono label ("02 / work") over the H2.
export function Section({ id, index, label, title, children }) {
  return (
    <section id={id} className="section" aria-labelledby={`${id}-title`}>
      <div className="container">
        <header className="section-head" data-reveal>
          <p className="label"><span className="idx">{index}</span> / {label}</p>
          <h2 id={`${id}-title`}>{title}</h2>
        </header>
        {children}
      </div>
    </section>
  );
}

// src/lib/useScrollReveal.js
// Fades sections and cards in as they scroll into view. The CSS keeps the
// targets at opacity 0 until "is-visible" lands on them (see SCROLL REVEAL in
// styles.css), so every page that renders those classes MUST run this hook —
// otherwise its content never becomes visible.
//
// `dep` re-runs the observer when it changes: site content loads from the API
// after the first paint, and newly rendered cards have to be observed too.
import { useEffect } from "react";

const SELECTOR = ".card, .timeline-item, .skill-row, .section-title, .section-eyebrow, .paper-title, .paper-h2";

export function useScrollReveal(dep) {
  useEffect(() => {
    const targets = document.querySelectorAll(SELECTOR);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -30px 0px" }
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [dep]);
}

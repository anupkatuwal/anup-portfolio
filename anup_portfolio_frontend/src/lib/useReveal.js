// src/lib/useReveal.js — fades [data-reveal] blocks in once as they scroll
// into view (DESIGN.md §6). Content is visible by default and only hidden
// once this hook has run, so the page never depends on JS to be readable.
// Children of a [data-reveal-group] stagger 60ms apart, up to 4.
import { useEffect } from "react";

export function useReveal(dep) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    document.querySelectorAll("[data-reveal-group]").forEach((group) => {
      [...group.children].forEach((child, i) => {
        child.setAttribute("data-reveal", "");
        child.style.setProperty("--reveal-delay", `${Math.min(i, 3) * 60}ms`);
      });
    });

    const targets = [...document.querySelectorAll("[data-reveal]:not(.is-revealed)")];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.15 }
    );
    targets.forEach((el) => {
      el.classList.add("reveal-pending");
      observer.observe(el);
    });
    return () => observer.disconnect();
  }, [dep]);
}

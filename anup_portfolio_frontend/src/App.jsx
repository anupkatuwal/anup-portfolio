// src/App.jsx — the public home page.
// The /admin page is a separate lazy chunk wired up in main.jsx so the
// public bundle stays small.
import { useEffect, useRef } from "react";

import { useContent } from "./context/ContentContext";
import { Hero } from "./components/Hero";
import { SkillsSection } from "./components/SkillsSection";
import { ExperienceSection } from "./components/ExperienceSection";
import { CertificationsSection } from "./components/CertificationsSection";
import { ResumeSection } from "./components/ResumeSection";
import { ProjectsSection } from "./components/ProjectsSection";
import { ContactSection } from "./components/ContactSection";

import { PageLayout } from "./layouts/PageLayout";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";

export default function App() {
  const spotlightRef = useRef(null);
  const content = useContent();

  // Section background tint
  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            document.body.dataset.section = entry.target.id;
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    sections.forEach((s) => observer.observe(s));
    return () => {
      observer.disconnect();
      delete document.body.dataset.section;
    };
  }, []);

  // Cursor spotlight — skip on touch-only devices
  useEffect(() => {
    const el = spotlightRef.current;
    if (!el || window.matchMedia("(hover: none)").matches) return;
    const move = (e) => {
      el.style.setProperty("--cx", `${e.clientX}px`);
      el.style.setProperty("--cy", `${e.clientY}px`);
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, []);

  // Scroll reveal — observe cards, timeline items, skill rows, section headings.
  // Re-runs when `content` changes: content loads async from the API after the
  // first paint, so any newly rendered cards must be (re)observed or they'd
  // stay stuck at the CSS-default opacity: 0.
  useEffect(() => {
    const targets = document.querySelectorAll(
      ".card, .timeline-item, .skill-row, .section-title, .section-eyebrow"
    );
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
  }, [content]);

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <div className="bg-fx" aria-hidden="true">
        <span className="bg-orb bg-orb-1" />
        <span className="bg-orb bg-orb-2" />
        <span className="bg-orb bg-orb-3" />
        <div className="bg-grid" />
      </div>
      <div ref={spotlightRef} className="cursor-spotlight" aria-hidden="true" />
      <Navbar />
      <main id="main">
        <PageLayout>
          <Hero />
          <SkillsSection />
          <ExperienceSection />
          <CertificationsSection />
          <ResumeSection />
          <ProjectsSection />
          <ContactSection />
        </PageLayout>
      </main>
      <Footer />
    </>
  );
}

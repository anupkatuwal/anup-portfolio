// src/App.jsx — the public home page.
// The /admin page is a separate lazy chunk wired up in main.jsx so the
// public bundle stays small.
import { useEffect, useRef } from "react";

import { useContent } from "./context/ContentContext";
import { useScrollReveal } from "./lib/useScrollReveal";
import { Hero } from "./components/Hero";
import { AboutSection } from "./components/AboutSection";
import { ResearchSection } from "./components/ResearchSection";
import { BlogSection } from "./components/BlogSection";
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

  // Scroll reveal — re-runs when `content` changes, since content arrives from
  // the API after the first paint and those cards must be observed too.
  useScrollReveal(content);

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
      <Navbar path="/" />
      <main id="main">
        <PageLayout>
          <Hero />
          <AboutSection />
          <ResearchSection />
          <ProjectsSection />
          <SkillsSection />
          <ExperienceSection />
          <CertificationsSection />
          <ResumeSection />
          <BlogSection />
          <ContactSection />
        </PageLayout>
      </main>
      <Footer />
    </>
  );
}

// src/App.jsx — the public home page.
// The /admin page is a separate lazy chunk wired up in main.jsx so the
// public bundle stays small.
import { useEffect } from "react";

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

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <div className="bg-fx" aria-hidden="true">
        <span className="bg-orb bg-orb-1" />
        <span className="bg-orb bg-orb-2" />
        <span className="bg-orb bg-orb-3" />
        <div className="bg-grid" />
      </div>
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

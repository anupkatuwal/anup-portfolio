// src/App.jsx
import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { Hero } from "./components/Hero";
import { SkillsSection } from "./components/SkillsSection";
import { ExperienceSection } from "./components/ExperienceSection";
import { EducationSection } from "./components/EducationSection";
import { CertificationsSection } from "./components/CertificationsSection";
import { ResumeSection } from "./components/ResumeSection";
import { CertificationsSection } from "./components/CertificationsSection";
import { ProjectsSection } from "./components/ProjectsSection";
import { ContactSection } from "./components/ContactSection"; // or ContactForm if that is what you named it

import { PageLayout } from "./layouts/PageLayout";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";

function HomePage() {
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
      <div className="bg-fx" aria-hidden="true">
        <span className="bg-orb bg-orb-1" />
        <span className="bg-orb bg-orb-2" />
        <span className="bg-orb bg-orb-3" />
        <div className="bg-grid" />
      </div>
      <Navbar />
      <PageLayout>
        <Hero />
        <SkillsSection />
        <ExperienceSection />
        <EducationSection />
        <CertificationsSection />
        <ResumeSection />
        <ProjectsSection />
        <ContactSection />
      </PageLayout>
      <Footer />
    </>
  );
}



export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      {/* Admin routes intentionally removed from production: the Vercel
          serverless DB is ephemeral so admin-created data cannot persist.
          Re-enable when migrated to a persistent DB (Vercel Postgres,
          Turso, Supabase, etc.) and proper credentials are configured. */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// src/App.jsx — the public home page.
// The /admin page is a separate lazy chunk wired up in main.jsx so the
// public bundle stays small.
import { Hero } from "./components/Hero";
import { AboutSection } from "./components/AboutSection";
import { ResearchSection } from "./components/ResearchSection";
import { ProjectsSection } from "./components/ProjectsSection";
import { ExperienceSection } from "./components/ExperienceSection";
import { EducationSection } from "./components/EducationSection";
import { SkillsSection } from "./components/SkillsSection";
import { CertificationsSection } from "./components/CertificationsSection";
import { InterestsSection } from "./components/InterestsSection";
import { ContactSection } from "./components/ContactSection";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Navbar path="/" />
      <main id="main">
        <Hero />
        <AboutSection />
        <ResearchSection />
        <ProjectsSection />
        <ExperienceSection />
        <EducationSection />
        <SkillsSection />
        <CertificationsSection />
        <InterestsSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}

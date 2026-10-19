// src/App.jsx — the public home page (DESIGN.md §4).
// The /admin and /research pages are separate lazy chunks wired up in
// main.jsx so the public bundle stays small.
import { useContent } from "./context/ContentContext";
import { useReveal } from "./lib/useReveal";
import { TopBar } from "./components/TopBar";
import { Hero } from "./components/Hero";
import { AboutSection } from "./components/AboutSection";
import { WorkSection } from "./components/WorkSection";
import { StackSection } from "./components/StackSection";
import { LogSection } from "./components/LogSection";
import { ContactSection } from "./components/ContactSection";
import { StatusBar } from "./components/StatusBar";
import { CommandPalette } from "./components/CommandPalette";

export default function App() {
  const content = useContent();
  // Re-run when content arrives from the API: new cards need observing too.
  useReveal(content);

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <TopBar path="/" />
      <main id="main">
        <Hero />
        <AboutSection />
        <WorkSection />
        <StackSection />
        <LogSection />
        <ContactSection />
      </main>
      <StatusBar />
      <CommandPalette path="/" />
    </>
  );
}

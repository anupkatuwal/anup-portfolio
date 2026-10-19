// src/components/TopBar.jsx — sticky top bar (DESIGN.md §5.1): handle with a
// blinking cursor, section links, the ⌘K chip, theme toggle and a 1px scroll
// progress line. Below 768px the links give way to search + menu buttons,
// both of which open the command palette.
import React, { useEffect, useRef, useState } from "react";
import { Menu, Search } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { openPalette } from "./CommandPalette";
import { NAV_LINKS, sectionHref } from "../lib/nav";
import { useContent } from "../context/ContentContext";

const isMac = () => /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent || "");

export function TopBar({ path = "/" }) {
  const { SITE = {} } = useContent();
  const isHome = path === "/";
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const [shortcut] = useState(() => (isMac() ? "⌘K" : "Ctrl K"));
  const progressRef = useRef(null);

  // Scrolled state + progress line, batched into one frame per scroll.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      setScrolled(y > 8);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Highlight the section in the middle of the viewport.
  useEffect(() => {
    if (!isHome || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    NAV_LINKS.forEach((l) => {
      const el = document.getElementById(l.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [isHome]);

  return (
    <header className={`topbar${scrolled ? " is-scrolled" : ""}`}>
      <div className="container topbar-inner">
        <a href={isHome ? "#top" : "/"} className="brand">
          {SITE.handle || "anup.katuwal"}
          <span className="cursor" aria-hidden="true" />
        </a>

        <nav className="topbar-nav" aria-label="Main navigation">
          <ul>
            {NAV_LINKS.map((l) => (
              <li key={l.id}>
                <a
                  className="nav-link"
                  href={sectionHref(l.id, isHome)}
                  {...(active === l.id ? { "aria-current": "location" } : {})}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="topbar-actions">
          <button
            type="button"
            className="kbd-chip"
            onClick={openPalette}
            aria-label="Open command palette"
            aria-keyshortcuts="Meta+K Control+K"
          >
            <kbd>{shortcut}</kbd>
          </button>
          <button type="button" className="icon-btn only-mobile" onClick={openPalette} aria-label="Search">
            <Search size={18} strokeWidth={1.5} aria-hidden="true" />
          </button>
          <ThemeToggle />
          <button type="button" className="icon-btn only-mobile" onClick={openPalette} aria-label="Open menu">
            <Menu size={18} strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>
      </div>
      <span ref={progressRef} className="scroll-progress" aria-hidden="true" />
    </header>
  );
}

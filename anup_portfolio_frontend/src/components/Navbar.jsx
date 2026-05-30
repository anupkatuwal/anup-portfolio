import React, { useEffect, useState } from "react";
import { ThemeToggle } from "./ThemeToggle";

const LINKS = [
  { href: "#skills", label: "Skills" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#resume", label: "Resume" },
  { href: "#contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    handler();
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Close the mobile menu when the viewport grows past the breakpoint.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 721px)");
    const onChange = (e) => {
      if (e.matches) setMobileOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const closeMenu = () => setMobileOpen(false);

  return (
    <header className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
      <div className="container navbar-inner">
        <a href="#top" className="navbar-brand" onClick={closeMenu}>
          <span className="brand-mark"><img src="/logo.jpg" alt="Anup Katuwal" /></span>
          <span className="brand-text">Anup Katuwal</span>
        </a>

        <nav className={`navbar-nav${mobileOpen ? " is-open" : ""}`}>
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="navbar-link"
              onClick={closeMenu}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="navbar-actions">
          <ThemeToggle />
          <button
            type="button"
            className={`nav-hamburger${mobileOpen ? " is-open" : ""}`}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            onClick={() => setMobileOpen((v) => !v)}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>
    </header>
  );
}

// src/components/Navbar.jsx
import React, { useEffect, useRef, useState } from "react";
import { ThemeToggle } from "./ThemeToggle";

// Trimmed from 7 → 5. Logo handles "Home". Education folds into Experience.
const LINKS = [
  { href: "#skills",          label: "Skills"         },
  { href: "#experience",      label: "Experience"     },
  { href: "#certifications",  label: "Certifications" },
  { href: "#projects",        label: "Projects"       },
  { href: "#resume",          label: "Resume"         },
  { href: "#contact",         label: "Contact"        },
];

export function Navbar() {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const menuRef = useRef(null);

  // Scroll detection
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    handler();
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Close mobile menu on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  // Close mobile menu when a link is clicked
  const handleLinkClick = () => setMenuOpen(false);

  return (
    <header className={`navbar${scrolled ? " navbar-scrolled" : ""}`} ref={menuRef}>
      <div className="navbar-inner">

        {/* Brand */}
        <a href="#top" className="navbar-brand" onClick={handleLinkClick}>
          <span className="brand-mark">
            <img src="/logo.jpg" alt="Anup Katuwal" />
          </span>
          <span className="brand-text">Anup Katuwal</span>
        </a>

        {/* Desktop nav */}
        <nav className="navbar-nav" aria-label="Main navigation">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href} className="navbar-link">
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right actions: theme toggle + hamburger */}
        <div className="navbar-actions">
          <ThemeToggle />

          {/* Hamburger — mobile only */}
          <button
            className="navbar-hamburger"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            {/* Simple 3-line / X icon in pure CSS */}
            <span className={`hamburger-icon${menuOpen ? " open" : ""}`}>
              <span /><span /><span />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <nav
        className={`navbar-mobile-nav${menuOpen ? " open" : ""}`}
        aria-label="Mobile navigation"
        aria-hidden={!menuOpen}
      >
        {LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="navbar-mobile-link"
            onClick={handleLinkClick}
          >
            {link.label}
          </a>
        ))}
        <a
          href="https://www.upwork.com/freelancers/~01fe60c948627059d5"
          target="_blank"
          rel="noopener noreferrer"
          className="navbar-mobile-link navbar-mobile-cta"
          onClick={handleLinkClick}
        >
          Upwork ↗
        </a>
      </nav>
    </header>
  );
}

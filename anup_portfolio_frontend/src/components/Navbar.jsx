// src/components/Navbar.jsx
// Sticky header: AK monogram + primary navigation + theme toggle.
import React, { useEffect, useRef, useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { NAV_LINKS, resolveHref, currentPath } from "../lib/nav";

export function Navbar({ path = "/" }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const here = path || currentPath();
  const isHome = here === "/";

  // Scroll detection — drives the header shadow
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
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

  const handleLinkClick = () => setMenuOpen(false);

  const linkProps = (link) => ({
    href: resolveHref(link, isHome),
    ...(link.kind === "page" && here === link.href ? { "aria-current": "page" } : {}),
  });

  return (
    <header className={`navbar${scrolled ? " navbar-scrolled" : ""}`} ref={menuRef}>
      <div className="navbar-inner">

        {/* Brand — AK monogram */}
        <a href={isHome ? "#top" : "/"} className="navbar-brand" onClick={handleLinkClick}>
          <span className="brand-mark" aria-hidden="true"><span>AK</span></span>
          <span className="brand-text">
            Anup Katuwal
            <span className="brand-sub">CIS Graduate &amp; Data Enthusiast</span>
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="navbar-nav" aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <a key={link.label} className="navbar-link" {...linkProps(link)}>
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right actions: theme toggle + hamburger */}
        <div className="navbar-actions">
          <ThemeToggle />

          <button
            className="navbar-hamburger"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((prev) => !prev)}
          >
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
        inert={!menuOpen}
      >
        {NAV_LINKS.map((link) => (
          <a
            key={link.label}
            className="navbar-mobile-link"
            onClick={handleLinkClick}
            {...linkProps(link)}
          >
            {link.label}
          </a>
        ))}
        <div className="navbar-mobile-ctas">
          <a
            href="/resume.pdf"
            className="navbar-mobile-link navbar-mobile-cta"
            onClick={handleLinkClick}
          >
            Resume (PDF) ↗
          </a>
          <a
            href="https://www.upwork.com/freelancers/~01fe60c948627059d5"
            target="_blank"
            rel="noopener noreferrer"
            className="navbar-mobile-link navbar-mobile-cta"
            onClick={handleLinkClick}
          >
            Upwork ↗
          </a>
        </div>
      </nav>
    </header>
  );
}

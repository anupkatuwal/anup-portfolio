// src/components/Navbar.jsx
// Sticky header: name on the left, primary navigation + theme toggle on the
// right. Below 720px the links collapse into a "Menu" drop-down.
import React, { useEffect, useRef, useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { NAV_LINKS, resolveHref, currentPath } from "../lib/nav";

export function Navbar({ path = "/" }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const here = path || currentPath();
  const isHome = here === "/";

  // Close the mobile menu on an outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  const close = () => setMenuOpen(false);

  const linkProps = (link) => ({
    href: resolveHref(link, isHome),
    ...(link.kind === "page" && here === link.href ? { "aria-current": "page" } : {}),
  });

  return (
    <header className="site-header" ref={menuRef}>
      <div className="container header-inner">
        <a href={isHome ? "#top" : "/"} className="site-name" onClick={close}>
          Anup Katuwal
        </a>

        <nav className="site-nav" aria-label="Main navigation">
          <ul>
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <a className="nav-link" {...linkProps(link)}>{link.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <ThemeToggle />

        <button
          className="text-button menu-button"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          {menuOpen ? "Close" : "Menu"}
        </button>
      </div>

      <nav
        id="mobile-nav"
        className={`mobile-nav${menuOpen ? " open" : ""}`}
        aria-label="Mobile navigation"
        inert={!menuOpen}
      >
        <ul className="container">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <a className="nav-link" onClick={close} {...linkProps(link)}>{link.label}</a>
            </li>
          ))}
          <li>
            <a className="nav-link" href="/resume.pdf" onClick={close}>Resume (PDF)</a>
          </li>
        </ul>
      </nav>
    </header>
  );
}

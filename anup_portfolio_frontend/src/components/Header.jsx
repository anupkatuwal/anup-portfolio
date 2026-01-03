// src/components/Header.jsx
import React from "react";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <div className="header-left">
          <span className="header-brand">Anup Katuwal</span>
        </div>

        <div className="header-right">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

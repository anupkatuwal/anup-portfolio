import React from "react";

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <p className="footer-text">
          © {new Date().getFullYear()} Anup Katuwal. All rights reserved.
        </p>
        <div className="footer-links">
          <a href="#" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href="#" target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}

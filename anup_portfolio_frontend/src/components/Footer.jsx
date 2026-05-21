import React from "react";

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <p className="footer-text">
          © {new Date().getFullYear()} Anup Katuwal. All rights reserved.
        </p>
        <div className="footer-links">
          <a
            href="https://github.com/anupkatuwal"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/anup-katuwal"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>
          <a href="mailto:katuwalanup@gmail.com">Email</a>
        </div>
      </div>
    </footer>
  );
}

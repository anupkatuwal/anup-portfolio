import React from "react";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <p>
          © {new Date().getFullYear()} Anup Katuwal ·{" "}
          <a href="mailto:contact@anup-katuwal.com.np">Email</a> ·{" "}
          <a href="https://www.linkedin.com/in/anupkatuwal1989" target="_blank" rel="noreferrer">LinkedIn</a> ·{" "}
          <a href="https://github.com/anupkatuwal" target="_blank" rel="noreferrer">GitHub</a>
        </p>
      </div>
    </footer>
  );
}

// src/components/StatusBar.jsx — the editor-style footer (DESIGN.md §5.11):
// availability, Kathmandu time (updates every 30s) and the copyright line.
import React, { useEffect, useState } from "react";
import { useContent } from "../context/ContentContext";

const ktmTime = () =>
  new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kathmandu",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());

export function StatusBar() {
  const { SITE = {} } = useContent();
  const [time, setTime] = useState(ktmTime);
  const available = SITE.available !== false;
  const host = (SITE.siteUrl || "").replace(/^https?:\/\//, "");

  useEffect(() => {
    const id = window.setInterval(() => setTime(ktmTime()), 30000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <footer className="statusbar">
      <div className="container statusbar-inner">
        <p className={`status${available ? " is-available" : ""}`}>
          <span className="status-dot" aria-hidden="true" />
          {available ? "available for work" : "heads down"}
        </p>
        <p className="status-time">
          Kathmandu · NPT UTC+5:45 · <time>{time}</time>
        </p>
        <p>© {new Date().getFullYear()}<span className="status-host"> · {host}</span></p>
      </div>
    </footer>
  );
}

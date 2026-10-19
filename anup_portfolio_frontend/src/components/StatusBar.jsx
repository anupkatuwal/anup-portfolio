// src/components/StatusBar.jsx — the editor-style footer (DESIGN.md §5.11):
// availability, Kathmandu time (updates every 30s) and the copyright line.
import React, { useSyncExternalStore } from "react";
import { useContent } from "../context/ContentContext";

const ktmTime = () =>
  new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kathmandu",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());

// Ticks every 30s. "--:--" in the build-time render and during hydration.
function subscribe(onTick) {
  const id = window.setInterval(onTick, 30000);
  return () => window.clearInterval(id);
}

export function StatusBar() {
  const { SITE = {} } = useContent();
  const time = useSyncExternalStore(subscribe, ktmTime, () => "--:--");
  const available = SITE.available !== false;
  const host = (SITE.siteUrl || "").replace(/^https?:\/\//, "");

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

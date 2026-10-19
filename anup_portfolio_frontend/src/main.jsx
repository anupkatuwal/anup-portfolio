// src/main.jsx
import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import { inject } from "@vercel/analytics";
import { injectSpeedInsights } from "@vercel/speed-insights";

// Self-hosted fonts (same origin, so the CSP's font-src 'self' covers them).
// JetBrains Mono for labels and data, Inter 500 for buttons. Inter Tight 600
// (headings) and Inter 400 (body text, including the LCP paragraph) are
// declared in styles/tokens.css and preloaded from index.html.
import "@fontsource/inter/latin-500.css";
import "@fontsource/jetbrains-mono/latin-400.css";
import "@fontsource/jetbrains-mono/latin-500.css";

import App from "./App";
import { ContentProvider } from "./context/ContentContext";
import "./index.css";

// Vercel Analytics (cookieless) + Speed Insights (Core Web Vitals) — deferred
// so they never block hydration.
const startTelemetry = () => {
  inject();
  injectSpeedInsights();
};
if ("requestIdleCallback" in window) requestIdleCallback(startTelemetry);
else setTimeout(startTelemetry, 2000);

// Routing. The site is small enough that a router library would cost more
// than it saves: every route is a full page load, so a path match at mount is
// all that's needed. /admin and /research are code-split so the homepage
// never pays for them.
//
// "/" and "/research" ship their React markup prerendered at build time
// (src/entry-server.jsx, marked data-ssr on #root), so they hydrate it rather
// than re-rendering — the first paint is already the final one.
const path = window.location.pathname.replace(/\/index\.html$/, "/").replace(/(.)\/+$/, "$1");
const rootEl = document.getElementById("root");

function mount(page) {
  const tree = (
    <React.StrictMode>
      <ContentProvider>{page}</ContentProvider>
    </React.StrictMode>
  );
  if (rootEl.hasAttribute("data-ssr")) ReactDOM.hydrateRoot(rootEl, tree);
  else ReactDOM.createRoot(rootEl).render(tree);
}

if (path === "/admin") {
  // /admin manages its own auth state and does not read site content.
  const Admin = lazy(() => import("./pages/Admin"));
  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <Suspense fallback={null}><Admin /></Suspense>
    </React.StrictMode>
  );
} else if (path === "/research") {
  // Load the chunk first: hydrating through a lazy boundary would render the
  // fallback and throw the prerendered markup away.
  import("./pages/Research").then((m) => {
    const Research = m.default;
    mount(<Research />);
  });
} else {
  mount(<App />);
}

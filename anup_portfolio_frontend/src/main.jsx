// src/main.jsx
import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import { inject } from "@vercel/analytics";
import { injectSpeedInsights } from "@vercel/speed-insights";

// Cascade-layer order — must be the first stylesheet (see the file).
import "./layers.css";

// Self-hosted fonts — only the weights the CSS actually uses.
// Merriweather (serif) carries the headings, Roboto (sans) the body text,
// JetBrains Mono the eyebrows, metrics and other small caps-y bits.
import "@fontsource/merriweather/latin-400.css";
import "@fontsource/merriweather/latin-700.css";
import "@fontsource/merriweather/latin-900.css";
import "@fontsource/merriweather/latin-400-italic.css";
import "@fontsource/roboto/latin-400.css";
import "@fontsource/roboto/latin-500.css";
import "@fontsource/roboto/latin-700.css";
import "@fontsource/jetbrains-mono/latin-400.css";
import "@fontsource/jetbrains-mono/latin-500.css";
import "@fontsource/jetbrains-mono/latin-600.css";
// Outfit + Inter drive the dark "space" theme only. The @font-face rules are
// cheap; the browser downloads a file only once dark mode renders text in it.
import "@fontsource-variable/outfit";
import "@fontsource-variable/inter";
// Astryx trial (contact form only), Neutral theme. Astryx's reset.css is
// deliberately NOT imported: it is global and would restyle the whole site.
import "@astryxdesign/core/astryx.css";
import "@astryxdesign/theme-neutral/theme.css";

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
const Admin = lazy(() => import("./pages/Admin"));
const Research = lazy(() => import("./pages/Research"));

const path = window.location.pathname.replace(/\/index\.html$/, "/").replace(/(.)\/+$/, "$1");

const route = (() => {
  if (path === "/admin") return <Admin />;
  if (path === "/research") return <Research />;
  return <App />;
})();

// /admin manages its own auth state and does not read site content.
const needsContent = path !== "/admin";

const tree = <Suspense fallback={null}>{route}</Suspense>;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {needsContent ? <ContentProvider>{tree}</ContentProvider> : tree}
  </React.StrictMode>
);

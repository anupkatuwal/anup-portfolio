// src/main.jsx
import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import { inject } from "@vercel/analytics";

// Self-hosted fonts — only the weights the CSS actually uses
import "@fontsource-variable/dm-sans";        // variable: covers 400–800
import "@fontsource/jetbrains-mono/latin-400.css";
import "@fontsource/jetbrains-mono/latin-500.css";
import "@fontsource/jetbrains-mono/latin-600.css";

import App from "./App";
import "./index.css";

// Vercel Analytics — cookieless; deferred so it never blocks hydration
const startAnalytics = () => inject();
if ("requestIdleCallback" in window) requestIdleCallback(startAnalytics);
else setTimeout(startAnalytics, 2000);

// /admin is code-split so the public page never pays for it.
const Admin = lazy(() => import("./pages/Admin"));
const isAdmin = window.location.pathname.replace(/\/+$/, "") === "/admin";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {isAdmin ? (
      <Suspense fallback={null}>
        <Admin />
      </Suspense>
    ) : (
      <App />
    )}
  </React.StrictMode>
);

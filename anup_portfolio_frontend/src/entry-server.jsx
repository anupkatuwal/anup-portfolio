// src/entry-server.jsx — build-time render of the public pages. The build
// bundles this with `vite build --ssr`, and scripts/prerender-*.mjs call
// render() to put the real React markup into dist/*.html. main.jsx then
// hydrates that markup instead of replacing it, so the first paint is the
// final paint (and crawlers get exactly what visitors see).
import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App from "./App";
import Research from "./pages/Research";
import { ContentProvider } from "./context/ContentContext";

export function render(path) {
  const page = path === "/research" ? <Research /> : <App />;
  return renderToString(
    <StrictMode>
      <ContentProvider>{page}</ContentProvider>
    </StrictMode>
  );
}

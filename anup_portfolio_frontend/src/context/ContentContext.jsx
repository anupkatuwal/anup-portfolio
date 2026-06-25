// src/context/ContentContext.jsx
// Provides the site content to every section. Starts from the bundled
// DEFAULT_CONTENT (so the first paint is instant and the site never blanks),
// then overlays whatever is saved in the API. A failed/empty fetch is a no-op.
import { createContext, useContext, useEffect, useState } from "react";
import { DEFAULT_CONTENT } from "../data/content";
import { apiFetch } from "../lib/api";

const ContentContext = createContext(DEFAULT_CONTENT);

export function ContentProvider({ children }) {
  const [content, setContent] = useState(DEFAULT_CONTENT);

  useEffect(() => {
    let cancelled = false;
    apiFetch("/api/content")
      .then((stored) => {
        if (cancelled || !stored || typeof stored !== "object") return;
        if (Object.keys(stored).length === 0) return; // nothing saved yet
        // Overlay saved sections on top of defaults; missing sections fall back.
        setContent((prev) => ({ ...prev, ...stored }));
      })
      .catch(() => {
        /* offline / DB down — keep bundled defaults */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <ContentContext.Provider value={content}>
      {children}
    </ContentContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useContent() {
  return useContext(ContentContext);
}

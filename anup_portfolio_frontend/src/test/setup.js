// Vitest global setup: adds jest-dom matchers (toBeInTheDocument, etc.)
import "@testing-library/jest-dom";

// jsdom ships no matchMedia; components read it for theme and reduced-motion.
if (!window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
    dispatchEvent: () => false,
  });
}

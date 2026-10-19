// src/components/CommandPalette.jsx — the ⌘K palette (DESIGN.md §5.12).
// Opens on ⌘K / Ctrl K, on "/", and from openPalette() (the top-bar chip and
// the mobile buttons). Keyboard: ↑ ↓ move, Enter runs, Esc closes. The search
// input keeps focus the whole time (results use aria-activedescendant), so
// the focus trap is simply "Tab stays on the input".
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight, Copy, Download, FolderGit2, Briefcase, Search, SunMoon,
} from "lucide-react";
import { NAV_LINKS, sectionHref } from "../lib/nav";
import { currentTheme, toggleTheme } from "../lib/theme";
import { useContent } from "../context/ContentContext";

const OPEN_EVENT = "palette:open";

// eslint-disable-next-line react-refresh/only-export-components
export function openPalette() {
  window.dispatchEvent(new CustomEvent(OPEN_EVENT));
}

const isTyping = (el) =>
  el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.tagName === "SELECT" || el.isContentEditable);

// Where focus returns on close. Module scope: there is one palette per page.
let returnFocus = null;

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function CommandPalette({ path = "/" }) {
  const { SITE = {} } = useContent();
  const isHome = path === "/";
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const [toast, setToast] = useState("");
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const close = useCallback(() => {
    setOpen(false);
    returnFocus?.focus?.();
  }, []);

  const show = useCallback(() => {
    returnFocus = document.activeElement;
    setQuery("");
    setIndex(0);
    setToast("");
    setOpen(true);
  }, []);

  const commands = useMemo(() => {
    const go = (id) => () => {
      close();
      const el = isHome && document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth" });
        history.replaceState(null, "", `#${id}`);
      } else {
        window.location.href = sectionHref(id, false);
      }
    };
    const external = (url) => () => {
      close();
      window.open(url, "_blank", "noopener,noreferrer");
    };
    return [
      ...NAV_LINKS.map((l) => ({
        group: "Navigate", id: `go-${l.id}`, label: `Go to ${l.label}`, hint: `#${l.id}`,
        Icon: ArrowRight, run: go(l.id),
      })),
      {
        group: "Actions", id: "copy-email", label: "Copy email", hint: SITE.email, Icon: Copy,
        run: async () => {
          try {
            await navigator.clipboard.writeText(SITE.email);
            setToast("Copied ✓");
          } catch {
            setToast(SITE.email);
          }
          window.setTimeout(() => setToast(""), 1500);
        },
      },
      { group: "Actions", id: "cv", label: "Download CV", hint: "PDF", Icon: Download, run: external(SITE.cvUrl) },
      {
        group: "Actions", id: "theme", label: "Toggle theme", hint: currentTheme() === "dark" ? "→ light" : "→ dark",
        Icon: SunMoon, run: () => toggleTheme(),
      },
      { group: "Links", id: "github", label: "Open GitHub", hint: "github.com", Icon: FolderGit2, run: external(SITE.github) },
      { group: "Links", id: "linkedin", label: "Open LinkedIn", hint: "linkedin.com", Icon: Briefcase, run: external(SITE.linkedin) },
    ];
    // currentTheme() is read when the palette opens; `open` re-computes it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [SITE, isHome, close, open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? commands.filter((c) => c.label.toLowerCase().includes(q)) : commands;
  }, [commands, query]);

  // Global shortcuts and the open event.
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (open) close();
        else show();
      } else if (e.key === "/" && !open && !isTyping(e.target)) {
        e.preventDefault();
        show();
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_EVENT, show);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_EVENT, show);
    };
  }, [open, show, close]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Keep the active row in view while arrowing through a long list.
  useEffect(() => {
    listRef.current?.querySelector('[aria-selected="true"]')?.scrollIntoView?.({ block: "nearest" });
  }, [index, open]);

  if (!open) return null;

  const active = Math.min(index, Math.max(results.length - 1, 0));

  const onKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIndex((active + 1) % Math.max(results.length, 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIndex((active - 1 + results.length) % Math.max(results.length, 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      results[active]?.run();
    } else if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "Tab") {
      e.preventDefault(); // focus trap: the input is the dialog's only stop
    }
  };

  const groups = [...new Set(results.map((c) => c.group))];

  return (
    <div className="palette-backdrop" onMouseDown={(e) => e.target === e.currentTarget && close()}>
      <div className="palette" role="dialog" aria-modal="true" aria-label="Command palette">
        <div className="palette-search">
          <Search size={18} strokeWidth={1.5} aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-list"
            aria-autocomplete="list"
            aria-activedescendant={results[active] ? `cmd-${results[active].id}` : undefined}
            aria-label="Type a command"
            placeholder="Type a command…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIndex(0);
            }}
            onKeyDown={onKeyDown}
            autoComplete="off"
            spellCheck="false"
          />
          <kbd className="palette-esc">esc</kbd>
        </div>

        <div id="palette-list" role="listbox" aria-label="Commands" className="palette-list" ref={listRef}>
          {results.length === 0 && <p className="palette-empty">No commands match “{query}”.</p>}
          {groups.map((g) => (
            <div key={g} role="group" aria-labelledby={`grp-${g}`}>
              <p className="palette-group" id={`grp-${g}`}>{g}</p>
              {results.filter((c) => c.group === g).map((c) => {
                const i = results.indexOf(c);
                return (
                  <div
                    key={c.id}
                    id={`cmd-${c.id}`}
                    role="option"
                    aria-selected={i === active}
                    className="palette-item"
                    onMouseMove={() => setIndex(i)}
                    onClick={() => c.run()}
                  >
                    <c.Icon size={18} strokeWidth={1.5} aria-hidden="true" />
                    <span className="palette-label">{c.label}</span>
                    <span className="palette-hint">{c.hint}</span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <p className="palette-toast" role="status" aria-live="polite">{toast}</p>
      </div>
    </div>
  );
}

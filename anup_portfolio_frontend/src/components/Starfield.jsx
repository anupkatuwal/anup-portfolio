// src/components/Starfield.jsx — twinkling canvas behind the dark "space" theme.
//
// Costs nothing outside dark mode: the loop only runs while the dark theme is
// active and the tab is visible. Under prefers-reduced-motion it paints one
// still frame and never animates.
import { useEffect, useRef } from "react";

const COLORS = ["#ffffff", "#e0e8ff", "#c4b5fd", "#93c5fd", "#6ee7b7"];
const FRAME_MS = 1000 / 30; // twinkle reads the same at 30fps, for half the work
const MAX_STARS = 420;

function isDark() {
  const theme = document.documentElement.getAttribute("data-theme");
  if (theme) return theme === "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function Starfield() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return; // jsdom, or a browser without canvas

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)");
    let stars = [];
    let raf = 0;
    let last = 0;
    let t = 0;

    const seed = () => {
      // Cap DPR at 2: sharp on retina, without 9x the pixels on a 3x phone.
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(MAX_STARS, Math.floor((w * h) / 3200));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.2 + 0.2,
        base: Math.random() * 0.55 + 0.15,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.6 + 0.2,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      }));
    };

    const paint = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      for (const s of stars) {
        const a = s.base + (1 - s.base) * 0.5 * (1 + Math.sin(t * s.speed + s.phase));
        ctx.fillStyle = s.color;
        ctx.globalAlpha = a;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
        // A faint halo on the bigger stars at their brightest. A flat
        // low-alpha disc — a gradient per star per frame is what makes
        // canvas starfields janky.
        if (s.r > 0.9 && a > 0.75) {
          ctx.globalAlpha = a * 0.12;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r * 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    };

    const loop = (now) => {
      raf = requestAnimationFrame(loop);
      if (now - last < FRAME_MS) return;
      t += (now - last) / 1000;
      last = now;
      paint();
    };

    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const sync = () => {
      stop();
      if (!isDark()) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }
      if (!stars.length) seed();
      if (reduceMotion.matches || document.hidden) {
        paint(); // one still frame
        return;
      }
      last = performance.now();
      raf = requestAnimationFrame(loop);
    };

    let resizeTimer = 0;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        stars = [];
        sync();
      }, 150);
    };

    // The theme toggle only flips data-theme on <html>, so watch that.
    const themeObserver = new MutationObserver(sync);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    systemDark.addEventListener("change", sync);
    reduceMotion.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    window.addEventListener("resize", onResize);
    sync();

    return () => {
      stop();
      clearTimeout(resizeTimer);
      themeObserver.disconnect();
      systemDark.removeEventListener("change", sync);
      reduceMotion.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="starfield" />;
}

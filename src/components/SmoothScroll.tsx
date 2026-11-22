"use client";

// Normand — Lenis-style smooth scrolling (lerped, like the original template).
// Skipped entirely when the user prefers reduced motion.
import { useEffect } from "react";
import Lenis from "lenis";

export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ autoRaf: true, lerp: 0.09 });
    return () => lenis.destroy();
  }, []);
  return null;
}

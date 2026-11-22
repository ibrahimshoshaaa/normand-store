"use client";

// Normand — Lenis-style smooth scrolling (lerped, like the original template).
// Skipped entirely when the user prefers reduced motion.
//
// Lenis owns the scroll position, so on a route change we reset it to the
// top ourselves: Next's scroll-to-top is overridden by Lenis re-applying
// its old value, and the new page would open mid-page with its top hidden
// under the sticky header.
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

export function SmoothScroll() {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ autoRaf: true, lerp: 0.09 });
    lenisRef.current = lenis;
    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    lenisRef.current?.scrollTo(0, { immediate: true });
  }, [pathname]);

  return null;
}

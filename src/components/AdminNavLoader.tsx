"use client";

// Normand — admin tab-switch loading indicator.
// Admin pages resolve so fast (and get prefetched) that loading.tsx never
// paints, so switching tabs felt dead. This shows a brief ink progress bar
// on a cream track at the top of the viewport on every admin tab click: it
// appears on click, stays at least ~350ms so the switch is visible, and
// always clears — when the navigation commits, or at most ~1.5s later if
// the navigation is instant or the click was for the current tab.
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavLoadingContext = createContext<() => void>(() => {});

export function AdminNavProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const startedAt = useRef(0);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const maxTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function start() {
    startedAt.current = Date.now();
    setLoading(true);
    if (maxTimer.current) clearTimeout(maxTimer.current);
    // Never stuck: clear even if the pathname never changes.
    maxTimer.current = setTimeout(() => setLoading(false), 1500);
  }

  useEffect(() => {
    if (!loading) return;
    // Navigation committed — keep the bar for at least ~350ms total, then hide.
    const wait = Math.max(0, 350 - (Date.now() - startedAt.current));
    hideTimer.current = setTimeout(() => setLoading(false), wait);
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, [pathname, loading]);

  useEffect(() => {
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
      if (maxTimer.current) clearTimeout(maxTimer.current);
    };
  }, []);

  return (
    <NavLoadingContext.Provider value={start}>
      {loading && (
        <div aria-hidden="true" className="fixed inset-x-0 top-0 z-50 h-1 bg-cream/70">
          <div className="admin-nav-progress h-full bg-ink" />
        </div>
      )}
      {children}
    </NavLoadingContext.Provider>
  );
}

export function AdminNavLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  const start = useContext(NavLoadingContext);
  return (
    <Link href={href} className={className} onClick={start}>
      {children}
    </Link>
  );
}

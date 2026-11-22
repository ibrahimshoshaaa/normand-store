"use client";

// Normand — sticky storefront header: wordmark, category nav, search overlay,
// account link and the Bag pill. Mobile nav is a horizontal scroller with a
// fade affordance so off-screen categories are visibly reachable.
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useCart } from "./CartProvider";
import { formatMoney } from "@/lib/format";
import type { ProductView } from "@/lib/store";
import { ProductImage } from "./ProductImage";

export function Header({ categories }: { categories: { name: string; slug: string }[] }) {
  const router = useRouter();
  const { count, openBag } = useCart();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProductView[]>([]);
  const [searching, setSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const requestId = useRef(0);

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    if (!searchOpen || query.trim().length < 2) {
      setResults([]);
      setSearching(false);
      return;
    }
    const id = ++requestId.current;
    const t = setTimeout(async () => {
      setSearching(true);
      // One retry: a cold serverless function or a slow wake-up can fail
      // the first request even though the search itself works.
      let res: Response | null = null;
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          res = await fetch(`/api/products?q=${encodeURIComponent(query)}`);
          if (res.ok) break;
        } catch {
          res = null;
        }
        if (attempt === 0) await new Promise((r) => setTimeout(r, 400));
      }
      if (requestId.current !== id) return; // a newer query superseded this one
      setSearching(false);
      setResults(res && res.ok ? await res.json() : []);
    }, 200);
    return () => clearTimeout(t);
  }, [query, searchOpen]);

  function goToShopResults() {
    const q = query.trim();
    if (q.length < 1) return;
    setSearchOpen(false);
    router.push(`/shop?q=${encodeURIComponent(q)}`);
  }

  return (
    <>
      <header className="sticky top-3 z-40 mx-auto w-[min(1200px,calc(100%-1.5rem))]">
        <div className="flex items-center justify-between gap-3 rounded-full bg-surface/90 px-4 py-2.5 shadow-[0_8px_30px_rgba(33,29,24,0.08)] backdrop-blur">
          <Link href="/" className="flex items-center gap-2" aria-label="Normand home">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink font-display text-lg font-bold text-cream">
              N
            </span>
            <span className="font-display text-xl font-extrabold tracking-tight">NORMAND</span>
          </Link>

          <nav
            aria-label="Categories"
            className="nav-fade no-scrollbar hidden flex-1 items-center gap-5 overflow-x-auto px-2 text-sm font-medium md:flex"
          >
            <Link href="/shop" className="shrink-0 hover:underline">
              Shop all
            </Link>
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/shop?category=${c.slug}`}
                className="shrink-0 hover:underline"
              >
                {c.name}
              </Link>
            ))}
            <Link href="/track" className="shrink-0 hover:underline">
              Track order
            </Link>
            <Link href="/admin" className="shrink-0 hover:underline">
              Admin
            </Link>
          </nav>

          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-cream"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
            </button>
            <Link
              href="/account"
              aria-label="Your account"
              className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-cream"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21c1.5-3.5 4.5-5 8-5s6.5 1.5 8 5" />
              </svg>
            </Link>
            <button
              type="button"
              onClick={openBag}
              className="flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-cream"
              aria-label={`Open bag, ${count} items`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M6 8h12l1 12H5L6 8Z" />
                <path d="M9 8V6a3 3 0 0 1 6 0v2" />
              </svg>
              Bag
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cream text-xs font-bold text-ink">
                {count}
              </span>
            </button>
          </div>
        </div>

        <nav
          aria-label="Categories"
          className="nav-fade no-scrollbar mt-2 flex gap-5 overflow-x-auto rounded-full bg-surface/80 px-4 py-2 text-sm font-medium shadow-sm backdrop-blur md:hidden"
        >
          <Link href="/shop" className="shrink-0">
            Shop all
          </Link>
          {categories.map((c) => (
            <Link key={c.slug} href={`/shop?category=${c.slug}`} className="shrink-0">
              {c.name}
            </Link>
          ))}
          <Link href="/track" className="shrink-0">
            Track order
          </Link>
          <Link href="/admin" className="shrink-0">
            Admin
          </Link>
        </nav>
      </header>

      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm" onClick={() => setSearchOpen(false)}>
          <div
            className="mx-auto mt-24 w-[min(560px,calc(100%-2rem))] rounded-[24px] bg-surface p-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-black/10 pb-3">
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") setSearchOpen(false);
                  if (e.key === "Enter") goToShopResults();
                }}
                placeholder="Search tees, hoodies, dresses…"
                className="w-full bg-transparent text-lg outline-none placeholder:text-ink-soft"
                aria-label="Search products"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="rounded-full bg-cream px-3 py-1.5 text-sm font-semibold"
              >
                Close
              </button>
            </div>
            {searching ? (
              <p className="py-6 text-center text-sm text-ink-soft" aria-live="polite">
                Searching…
              </p>
            ) : results.length > 0 ? (
              <>
                <ul className="max-h-80 divide-y divide-black/5 overflow-y-auto">
                  {results.map((p) => (
                    <li key={p.slug}>
                      <Link
                        href={`/product/${p.slug}`}
                        onClick={() => setSearchOpen(false)}
                        className="flex items-center gap-3 py-3"
                      >
                        <ProductImage garment={p.garment} imageUrl={p.imageUrl} bg={p.tint} className="h-12 w-12 rounded-2xl" label={p.name} />
                        <span className="flex-1">
                          <span className="block font-display font-bold">{p.name}</span>
                          <span className="text-sm text-ink-soft">{p.categoryName}</span>
                        </span>
                        <span className="font-display font-bold">{formatMoney(p.priceCents)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={goToShopResults}
                  className="mt-2 w-full rounded-full bg-cream py-2.5 text-sm font-semibold"
                >
                  See all results for “{query.trim()}” →
                </button>
              </>
            ) : (
              query.trim().length >= 2 && (
                <p className="py-6 text-center text-sm text-ink-soft">
                  Nothing found for “{query}”.
                </p>
              )
            )}
          </div>
        </div>
      )}
    </>
  );
}

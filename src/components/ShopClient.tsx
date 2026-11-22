"use client";

// Normand — shop filtering: search, category chips and sorting (client-side,
// over the server-provided catalog so it works with or without a database).
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { CategoryView, ProductView } from "@/lib/store";
import { ProductCard } from "./ProductCard";

export function ShopClient({
  products,
  categories,
  initialCategory,
  initialQuery = "",
}: {
  products: ProductView[];
  categories: CategoryView[];
  initialCategory: string;
  initialQuery?: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState("featured");

  // Soft navigation (header/footer category links, header search) changes
  // the URL while this component stays mounted — sync state from the URL
  // params so the products on screen always match the address bar.
  useEffect(() => {
    setCategory(initialCategory);
  }, [initialCategory]);
  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const activeCategory = categories.find((c) => c.slug === category);
  const heading = activeCategory ? activeCategory.name : "Shop all";

  const filtered = useMemo(() => {
    let list = products.filter((p) => p.live);
    if (category !== "all") list = list.filter((p) => p.categorySlug === category);
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.categoryName.toLowerCase().includes(q) ||
          p.blurb.toLowerCase().includes(q),
      );
    }
    const sorted = [...list];
    if (sort === "price-asc") sorted.sort((a, b) => a.priceCents - b.priceCents);
    if (sort === "price-desc") sorted.sort((a, b) => b.priceCents - a.priceCents);
    if (sort === "rating") sorted.sort((a, b) => b.rating - a.rating);
    if (sort === "newest") sorted.reverse();
    return sorted;
  }, [products, category, query, sort]);

  function pickCategory(slug: string) {
    setCategory(slug);
    // Keep the URL in sync with the state (preserving an active search),
    // so a refresh shows the same products.
    const params = new URLSearchParams();
    if (slug !== "all") params.set("category", slug);
    if (query.trim()) params.set("q", query.trim());
    const qs = params.toString();
    router.replace(qs ? `/shop?${qs}` : "/shop", { scroll: false });
  }

  function clearFilters() {
    setQuery("");
    setCategory("all");
    setSort("featured");
    router.push("/shop");
  }

  return (
    <div>
      <h1 className="font-display text-4xl font-extrabold md:text-5xl">{heading}</h1>
      <p className="mt-2 text-ink-soft">Calm clothing for slow days — every piece, in one place.</p>

      <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tees, hoodies, dresses…"
          aria-label="Search products"
          className="w-full rounded-full border border-black/15 bg-surface px-5 py-3 outline-none focus:border-ink md:max-w-sm"
        />
        <label className="flex items-center gap-2 text-sm">
          Sort by
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-full border border-black/15 bg-surface px-4 py-2.5 outline-none"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="rating">Top rated</option>
            <option value="newest">Newest</option>
          </select>
        </label>
      </div>

      <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => pickCategory("all")}
          className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${
            category === "all" ? "bg-ink text-cream" : "bg-surface"
          }`}
        >
          Shop all
        </button>
        {categories.map((c) => (
          <button
            key={c.slug}
            type="button"
            onClick={() => pickCategory(c.slug)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${
              category === c.slug ? "bg-ink text-cream" : "bg-surface"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      <p className="mt-4 text-sm text-ink-soft" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? "piece" : "pieces"}
      </p>

      {filtered.length === 0 ? (
        <div className="mt-10 rounded-[24px] bg-surface p-10 text-center">
          <p className="font-display text-xl font-bold">Nothing matches that yet.</p>
          <p className="mt-1 text-sm text-ink-soft">Try a different search or category.</p>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-4 inline-block rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-cream"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {filtered.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

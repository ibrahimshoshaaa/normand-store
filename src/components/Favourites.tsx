"use client";

// Normand — "This week's favourites" with filter tabs (All + one per
// category, styled like the demo: selected tab is a black pill). Switching
// tabs filters the grid with a brief fade-in of the new cards.
import { useState } from "react";
import { ProductCard } from "./ProductCard";
import type { CategoryView, ProductView } from "@/lib/store";

export function Favourites({
  products,
  categories,
}: {
  products: ProductView[];
  categories: CategoryView[];
}) {
  const [tab, setTab] = useState("all");
  const sorted = [...products].sort((a, b) => b.rating - a.rating);
  const shown = (tab === "all" ? sorted : sorted.filter((p) => p.categorySlug === tab)).slice(0, 4);

  const tabs = [{ slug: "all", name: "All" }, ...categories.map((c) => ({ slug: c.slug, name: c.name }))];

  return (
    <div>
      <div
        role="tablist"
        aria-label="Filter favourites by category"
        className="no-scrollbar mt-5 flex gap-2 overflow-x-auto pb-1"
      >
        {tabs.map((t) => (
          <button
            key={t.slug}
            type="button"
            role="tab"
            aria-selected={tab === t.slug}
            onClick={() => setTab(t.slug)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
              tab === t.slug
                ? "bg-ink text-cream"
                : "border border-black/15 bg-surface hover:border-ink/40"
            }`}
          >
            {t.name}
          </button>
        ))}
      </div>
      <div key={tab} className="fav-fade mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {shown.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
        {shown.length === 0 && (
          <p className="col-span-2 py-8 text-center text-sm text-ink-soft lg:col-span-4">
            Nothing here yet — check back soon.
          </p>
        )}
      </div>
    </div>
  );
}

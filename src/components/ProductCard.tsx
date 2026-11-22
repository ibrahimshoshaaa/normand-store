"use client";

// Normand — small client islands used across the storefront.
import Link from "next/link";
import { useCart } from "./CartProvider";
import { formatMoney } from "@/lib/format";
import type { ProductView } from "@/lib/store";
import { ProductImage } from "./ProductImage";

export function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-sm" aria-label={`${rating} out of 5 stars`}>
      <span className="text-amber-600">★</span>
      <span className="font-semibold">{rating.toFixed(1)}</span>
    </span>
  );
}

export function QuickAddButton({ product }: { product: ProductView }) {
  const { flyAdd } = useCart();
  return (
    <button
      type="button"
      aria-label={`Quick add ${product.name} to bag`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        flyAdd(
          {
            slug: product.slug,
            name: product.name,
            priceCents: product.priceCents,
            colour: product.colours[0]?.name ?? "",
            size: "M",
            garment: product.garment,
            imageUrl: product.imageUrl,
            tint: product.tint,
          },
          1,
          e.currentTarget.getBoundingClientRect(),
        );
      }}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-cream shadow-lg transition hover:scale-105"
    >
      <span className="text-xl leading-none">+</span>
    </button>
  );
}

/** Pill "Add to bag" button for the home hero coat tile — same fly-to-bag flow. */
export function HeroAddButton({ product }: { product: ProductView }) {
  const { flyAdd } = useCart();
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        flyAdd(
          {
            slug: product.slug,
            name: product.name,
            priceCents: product.priceCents,
            colour: product.colours[0]?.name ?? "",
            size: "M",
            garment: product.garment,
            imageUrl: product.imageUrl,
            tint: product.tint,
          },
          1,
          e.currentTarget.getBoundingClientRect(),
        );
      }}
      className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-cream transition hover:opacity-90"
    >
      Add to bag
    </button>
  );
}

export function ProductCard({ product }: { product: ProductView }) {
  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block"
      aria-label={`${product.name}, ${formatMoney(product.priceCents)}`}
    >
      <div
        className="relative overflow-hidden rounded-[24px]"
        style={{ background: product.tint }}
      >
        <ProductImage
          garment={product.garment}
          imageUrl={product.imageUrl}
          bg={product.tint}
          label={product.name}
          className="idle-drift aspect-square w-full transition duration-500 group-hover:scale-[1.04]"
        />
        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-ink px-3 py-1 text-xs font-semibold text-cream">
            {product.badge}
          </span>
        )}
        {product.compareCents && product.compareCents > product.priceCents && (
          <span className="absolute right-3 top-3 rounded-full bg-accent px-3 py-1 text-xs font-bold text-white">
            −{Math.round((1 - product.priceCents / product.compareCents) * 100)}%
          </span>
        )}
        <span className="absolute bottom-3 right-3 opacity-0 transition group-hover:opacity-100">
          <QuickAddButton product={product} />
        </span>
      </div>
      <div className="mt-3 flex items-start justify-between gap-2 px-1">
        <div>
          <p className="text-xs uppercase tracking-wide text-ink-soft">{product.categoryName}</p>
          <h3 className="font-display text-lg font-bold leading-tight">{product.name}</h3>
          <div className="mt-1 flex items-center gap-2">
            <Stars rating={product.rating} />
            <span className="text-xs text-ink-soft">· {product.reviews} reviews</span>
          </div>
          <div className="mt-2 flex gap-1.5">
            {product.colours.map((c) => (
              <span
                key={c.name}
                title={c.name}
                className="h-4 w-4 rounded-full border border-black/15"
                style={{ background: c.hex }}
              />
            ))}
          </div>
        </div>
        <div className="text-right">
          <p className="font-display text-lg font-bold">{formatMoney(product.priceCents)}</p>
          {product.compareCents && (
            <p className="text-sm text-ink-soft line-through">
              {formatMoney(product.compareCents)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

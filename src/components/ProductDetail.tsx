"use client";

// Normand — product detail interactions: colour/size swatches, quantity,
// add to bag (with a small fly-to-bag dot for delight).
import { useState } from "react";
import { useCart } from "./CartProvider";
import { formatMoney } from "@/lib/format";
import { Stars } from "./ProductCard";
import { ProductImage } from "./ProductImage";
import type { ProductView } from "@/lib/store";

export function ProductDetail({ product }: { product: ProductView }) {
  const { addItem, openBag } = useCart();
  const [colour, setColour] = useState(product.colours[0]?.name ?? "");
  const [size, setSize] = useState("M");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const selectedColour = product.colours.find((c) => c.name === colour) ?? product.colours[0];

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="relative overflow-hidden rounded-[24px]" style={{ background: product.tint }}>
        <ProductImage
          garment={product.garment}
          imageUrl={product.imageUrl}
          bg={product.tint}
          label={product.name}
          className="aspect-square w-full"
        />
        {product.badge && (
          <span className="absolute left-4 top-4 rounded-full bg-ink px-3 py-1 text-xs font-semibold text-cream">
            {product.badge}
          </span>
        )}
      </div>

      <div className="pt-2">
        <p className="text-sm uppercase tracking-wide text-ink-soft">{product.categoryName}</p>
        <h1 className="mt-1 font-display text-4xl font-extrabold leading-tight">{product.name}</h1>
        <div className="mt-3 flex items-center gap-3">
          <span className="font-display text-2xl font-bold">{formatMoney(product.priceCents)}</span>
          {product.compareCents && (
            <span className="text-lg text-ink-soft line-through">{formatMoney(product.compareCents)}</span>
          )}
          <Stars rating={product.rating} />
          <span className="text-sm text-ink-soft">· {product.reviews} reviews</span>
        </div>
        <p className="mt-4 leading-relaxed text-ink-soft">{product.description}</p>

        <div className="mt-6">
          <p className="text-sm font-semibold">
            Colour: <span className="font-normal text-ink-soft">{colour}</span>
          </p>
          <div className="mt-2 flex gap-2">
            {product.colours.map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={() => setColour(c.name)}
                aria-label={`Colour ${c.name}`}
                aria-pressed={colour === c.name}
                title={c.name}
                className={`h-9 w-9 rounded-full border-2 ${
                  colour === c.name ? "border-ink" : "border-black/15"
                }`}
                style={{ background: c.hex }}
              />
            ))}
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">Size</p>
            <span className="text-xs text-ink-soft">True to size · XS–XL</span>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSize(s)}
                aria-pressed={size === s}
                className={`h-11 w-12 rounded-full text-sm font-semibold ${
                  size === s ? "bg-ink text-cream" : "bg-surface border border-black/15"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <div className="flex items-center rounded-full border border-black/15 bg-surface">
            <button type="button" aria-label="Decrease quantity" onClick={() => setQty(Math.max(1, qty - 1))} className="px-4 py-3 text-lg">
              −
            </button>
            <span className="w-8 text-center font-semibold">{qty}</span>
            <button type="button" aria-label="Increase quantity" onClick={() => setQty(Math.min(product.stock, qty + 1))} className="px-4 py-3 text-lg">
              +
            </button>
          </div>
          <button
            type="button"
            onClick={() => {
              addItem({
                slug: product.slug,
                name: product.name,
                priceCents: product.priceCents,
                colour,
                size,
                garment: product.garment,
                imageUrl: product.imageUrl,
                tint: product.tint,
              }, qty);
              setAdded(true);
              setTimeout(() => setAdded(false), 2000);
              openBag();
            }}
            className="flex-1 rounded-full bg-ink py-3.5 font-semibold text-cream transition hover:opacity-90"
          >
            {added ? "✓ Added to bag" : `Add to bag · ${formatMoney(product.priceCents * qty)}`}
          </button>
        </div>

        <p className="mt-4 text-sm text-ink-soft">
          Ships in 48h · 30-night trial · {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
        </p>

        <div className="mt-6 divide-y divide-black/10 rounded-[24px] bg-surface px-5">
          {[
            ["Delivery & returns", "Free delivery over $150. 30-night returns, no questions asked."],
            ["Materials", "Organic cotton, washed linen and brushed wool from certified workshops."],
            ["Warranty", "10-year warranty on seams and stitching."],
          ].map(([title, body]) => (
            <details key={title} className="py-4">
              <summary className="cursor-pointer font-display font-bold">{title}</summary>
              <p className="mt-2 text-sm text-ink-soft">{body}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

// Normand — bag drawer sliding in from the right, with the free-shipping
// progress bar (free over $150) and quantity steppers.
import Link from "next/link";
import { useCart } from "./CartProvider";
import { FREE_SHIPPING_THRESHOLD_CENTS } from "@/lib/catalog";
import { formatMoney } from "@/lib/format";
import { ProductImage } from "./ProductImage";

export function BagDrawer() {
  const { items, isOpen, closeBag, setQuantity, removeItem, subtotalCents } = useCart();
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD_CENTS - subtotalCents);
  const progress = Math.min(100, (subtotalCents / FREE_SHIPPING_THRESHOLD_CENTS) * 100);

  return (
    <>
      <div
        aria-hidden="true"
        onClick={closeBag}
        className={`drawer-backdrop fixed inset-0 z-50 bg-ink/40 ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
      />
      <aside
        aria-label="Your bag"
        className={`drawer fixed right-0 top-0 z-50 flex h-full w-[min(420px,100%)] flex-col bg-surface shadow-2xl ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
          <h2 className="font-display text-xl font-bold">
            Your bag {items.length > 0 && `(${items.reduce((s, i) => s + i.quantity, 0)})`}
          </h2>
          <button
            type="button"
            onClick={closeBag}
            aria-label="Close bag"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-cream text-lg"
          >
            ×
          </button>
        </div>

        <div className="border-b border-black/10 px-5 py-3">
          {remaining > 0 ? (
            <p className="text-sm">
              You’re <strong>{formatMoney(remaining)}</strong> away from free delivery
            </p>
          ) : (
            <p className="text-sm font-semibold text-leaf">
              Free delivery on orders over $150 — you’ve unlocked it
            </p>
          )}
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-cream">
            <div className="h-full rounded-full bg-ink transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="pt-10 text-center">
              <p className="font-display text-lg font-bold">Your bag is empty.</p>
              <p className="mt-1 text-sm text-ink-soft">Slow down, browse a little.</p>
              <Link
                href="/shop"
                onClick={closeBag}
                className="mt-5 inline-block rounded-full bg-ink px-6 py-3 text-sm font-semibold text-cream"
              >
                Shop the collection
              </Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={`${item.slug}-${item.colour}-${item.size}`} className="flex gap-3">
                  <ProductImage
                    garment={item.garment}
                    imageUrl={item.imageUrl}
                    bg={item.tint}
                    label={item.name}
                    className="h-20 w-20 shrink-0 rounded-2xl"
                  />
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between gap-2">
                      <p className="font-display font-bold leading-tight">{item.name}</p>
                      <p className="font-display font-bold">{formatMoney(item.priceCents * item.quantity)}</p>
                    </div>
                    <p className="text-sm text-ink-soft">
                      {item.colour} · Size {item.size}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center rounded-full border border-black/15">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          onClick={() => setQuantity(item.slug, item.colour, item.size, item.quantity - 1)}
                          className="px-3 py-1 text-lg"
                        >
                          −
                        </button>
                        <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          onClick={() => setQuantity(item.slug, item.colour, item.size, item.quantity + 1)}
                          className="px-3 py-1 text-lg"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.slug, item.colour, item.size)}
                        className="text-sm text-ink-soft underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-black/10 px-5 py-4">
            <div className="flex justify-between font-display text-lg font-bold">
              <span>Subtotal</span>
              <span>{formatMoney(subtotalCents)}</span>
            </div>
            <p className="mt-1 text-xs text-ink-soft">Delivery calculated at checkout.</p>
            <Link
              href="/checkout"
              onClick={closeBag}
              className="mt-3 block rounded-full bg-ink py-3.5 text-center font-semibold text-cream"
            >
              Checkout
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}

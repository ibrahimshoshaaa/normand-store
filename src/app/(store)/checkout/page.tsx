"use client";

// Normand — checkout ("Almost yours."): delivery address, delivery speed,
// card details (no payment is processed online), order summary, place order.
import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartProvider";
import { placeOrderAction } from "@/lib/actions";
import { formatMoney } from "@/lib/format";
import { ProductImage } from "@/components/ProductImage";

export default function CheckoutPage() {
  const { items, subtotalCents, clear } = useCart();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [delivery, setDelivery] = useState<"Standard" | "Express">("Standard");
  const [card, setCard] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [placing, setPlacing] = useState(false);

  const deliveryCents = useMemo(() => {
    if (subtotalCents >= 15000) return 0;
    return delivery === "Express" ? 2500 : 0;
  }, [subtotalCents, delivery]);
  const total = subtotalCents + deliveryCents;

  if (items.length === 0) {
    return (
      <div className="mx-auto w-[min(720px,calc(100%-1.5rem))] pt-16 text-center">
        <h1 className="font-display text-4xl font-extrabold">Your bag is empty.</h1>
        <p className="mt-2 text-ink-soft">Add something calm first.</p>
        <Link href="/shop" className="mt-6 inline-block rounded-full bg-ink px-6 py-3 font-semibold text-cream">
          Shop the collection
        </Link>
      </div>
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPlacing(true);
    try {
      const res = await placeOrderAction({
        customerName: name.trim(),
        email: email.trim(),
        city: city.trim(),
        address: address.trim(),
        deliveryMethod: delivery,
        items: items.map((it) => ({
          slug: it.slug,
          colour: it.colour,
          size: it.size,
          quantity: it.quantity,
        })),
      });
      clear();
      router.push(`/thank-you?code=${res.code}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong placing your order.");
      setPlacing(false);
    }
  }

  const inputCls =
    "w-full rounded-2xl border border-black/15 bg-surface px-4 py-3 outline-none focus:border-ink";

  return (
    <div className="mx-auto w-[min(1020px,calc(100%-1.5rem))] pt-8">
      <h1 className="font-display text-4xl font-extrabold md:text-5xl">Almost yours.</h1>
      <p className="mt-2 text-ink-soft">A few details and it’s on its way.</p>

      <form onSubmit={submit} className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <section className="rounded-[24px] bg-surface p-6">
            <h2 className="font-display text-xl font-bold">Delivery address</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="text-sm font-semibold">Full name</label>
                <input id="name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" className={inputCls} />
              </div>
              <div>
                <label htmlFor="email" className="text-sm font-semibold">Email</label>
                <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={inputCls} />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="address" className="text-sm font-semibold">Street address</label>
                <input id="address" required value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Nørrebrogade 12" className={inputCls} />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="city" className="text-sm font-semibold">City</label>
                <input id="city" required value={city} onChange={(e) => setCity(e.target.value)} placeholder="Copenhagen" className={inputCls} />
              </div>
            </div>
          </section>

          <section className="rounded-[24px] bg-surface p-6">
            <h2 className="font-display text-xl font-bold">Delivery speed</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {(
                [
                  ["Standard", "Free · 2–3 days", 0],
                  ["Express", "Next day · +$25 · Free over $150", 2500],
                ] as const
              ).map(([method, label, fee]) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setDelivery(method)}
                  aria-pressed={delivery === method}
                  className={`rounded-2xl border-2 p-4 text-left ${
                    delivery === method ? "border-ink bg-cream" : "border-black/10"
                  }`}
                >
                  <span className="font-display font-bold">{method}</span>
                  <span className="block text-sm text-ink-soft">{label}</span>
                  <span className="mt-1 block text-sm font-semibold">
                    {subtotalCents >= 15000 || method === "Standard" ? "Free" : formatMoney(fee)}
                  </span>
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-[24px] bg-surface p-6">
            <h2 className="font-display text-xl font-bold">Payment</h2>
            <p className="mt-1 text-sm text-ink-soft">
              No payment is taken online — your order is placed without payment.
            </p>
            <label htmlFor="card" className="mt-4 block text-sm font-semibold">Card number</label>
            <input
              id="card"
              inputMode="numeric"
              value={card}
              onChange={(e) => setCard(e.target.value.replace(/[^\d ]/g, "").slice(0, 19))}
              placeholder="4242 4242 4242 4242"
              className={inputCls}
            />
          </section>

          {error && (
            <p role="alert" className="rounded-2xl bg-red-100 px-4 py-3 text-sm font-semibold text-red-800">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={placing}
            className="w-full rounded-full bg-ink py-4 font-semibold text-cream disabled:opacity-50"
          >
            {placing ? "Placing your order…" : `Place order · ${formatMoney(total)}`}
          </button>
        </div>

        <aside className="h-fit rounded-[24px] bg-surface p-6 lg:sticky lg:top-24">
          <h2 className="font-display text-xl font-bold">Order summary</h2>
          <ul className="mt-4 space-y-3">
            {items.map((it) => (
              <li key={`${it.slug}-${it.colour}-${it.size}`} className="flex items-center gap-3">
                <ProductImage garment={it.garment} imageUrl={it.imageUrl} bg={it.tint} label={it.name} className="h-14 w-14 rounded-2xl" />
                <span className="flex-1 text-sm">
                  <span className="block font-semibold">{it.name}</span>
                  <span className="text-ink-soft">
                    {it.colour} · {it.size} × {it.quantity}
                  </span>
                </span>
                <span className="text-sm font-semibold">{formatMoney(it.priceCents * it.quantity)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-1 border-t border-black/10 pt-4 text-sm">
            <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatMoney(subtotalCents)}</dd></div>
            <div className="flex justify-between"><dt>Delivery ({delivery})</dt><dd>{deliveryCents === 0 ? "Free" : formatMoney(deliveryCents)}</dd></div>
            <div className="flex justify-between font-display text-lg font-bold"><dt>Total</dt><dd>{formatMoney(total)}</dd></div>
          </dl>
        </aside>
      </form>
    </div>
  );
}

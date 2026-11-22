import Link from "next/link";
import { getOrderByCode } from "@/lib/store";
import { formatMoney } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const { code } = await searchParams;
  const order = code ? await getOrderByCode(code) : null;

  if (!order) {
    return (
      <div className="mx-auto w-[min(720px,calc(100%-1.5rem))] pt-16 text-center">
        <h1 className="font-display text-4xl font-extrabold">No order found.</h1>
        <p className="mt-2 text-ink-soft">Check your order code and try again.</p>
        <Link href="/track" className="mt-6 inline-block rounded-full bg-ink px-6 py-3 font-semibold text-cream">
          Track an order
        </Link>
      </div>
    );
  }

  const itemCount = order.items.reduce((s, i) => s + i.quantity, 0);
  return (
    <div className="mx-auto w-[min(720px,calc(100%-1.5rem))] pt-12">
      <div className="rounded-[24px] bg-surface p-10 text-center">
        <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-leaf text-4xl text-white" aria-hidden="true">
          ✓
        </span>
        <p className="mt-6 font-mono text-sm uppercase tracking-widest text-ink-soft">
          Order {order.code}
        </p>
        <h1 className="mt-2 font-display text-4xl font-extrabold">Thank you!</h1>
        <p className="mt-3 text-lg text-ink-soft">
          {formatMoney(order.totalCents)} · {itemCount} {itemCount === 1 ? "item" : "items"} heading
          to {order.city || "you"}. We’ll email you when it ships.
        </p>
        <ul className="mx-auto mt-6 max-w-sm space-y-2 text-left text-sm">
          {order.items.map((it, i) => (
            <li key={i} className="flex justify-between border-b border-black/5 pb-2">
              <span>
                {it.name} · {it.colour} · {it.size} × {it.quantity}
              </span>
              <span className="font-semibold">{formatMoney(it.priceCents * it.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href={`/track?code=${order.code}`} className="rounded-full bg-ink px-6 py-3 font-semibold text-cream">
            Track your order
          </Link>
          <Link href="/admin" className="rounded-full border border-black/20 px-6 py-3 font-semibold">
            See it in the dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

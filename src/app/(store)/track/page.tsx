import Link from "next/link";
import { getOrderByCode } from "@/lib/store";
import { formatMoney, formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

const STEPS = ["PREPARING", "SHIPPED", "DELIVERED"] as const;
const STEP_LABELS: Record<string, string> = {
  PREPARING: "Preparing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
};

export default async function TrackPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const { code } = await searchParams;
  const order = code ? await getOrderByCode(code) : null;
  const currentStep = order ? STEPS.indexOf(order.status as (typeof STEPS)[number]) : -1;

  return (
    <div className="mx-auto w-[min(720px,calc(100%-1.5rem))] pt-8">
      <h1 className="font-display text-4xl font-extrabold">Track your order</h1>
      <p className="mt-2 text-ink-soft">Enter the order code from your confirmation, e.g. NM-2401.</p>

      <form method="get" action="/track" className="mt-6 flex gap-2">
        <label htmlFor="code" className="sr-only">
          Order code
        </label>
        <input
          id="code"
          name="code"
          defaultValue={code ?? ""}
          placeholder="NM-2401"
          className="w-full rounded-full border border-black/15 bg-surface px-5 py-3 uppercase outline-none focus:border-ink"
        />
        <button type="submit" className="shrink-0 rounded-full bg-ink px-6 py-3 font-semibold text-cream">
          Track
        </button>
      </form>

      {code && !order && (
        <p role="alert" className="mt-6 rounded-2xl bg-red-100 px-4 py-3 text-sm font-semibold text-red-800">
          We couldn’t find order “{code}”. Double-check the code and try again.
        </p>
      )}

      {order && (
        <div className="mt-8 rounded-[24px] bg-surface p-6">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="font-mono text-sm uppercase tracking-widest text-ink-soft">Order {order.code}</p>
              <h2 className="mt-1 font-display text-2xl font-bold">
                {order.customerName} · {order.city}
              </h2>
              <p className="text-sm text-ink-soft">Placed {formatDate(order.createdAt)}</p>
            </div>
            <p className="font-display text-xl font-bold">{formatMoney(order.totalCents)}</p>
          </div>

          <ol className="mt-8 flex items-center" aria-label={`Status: ${STEP_LABELS[order.status] ?? order.status}`}>
            {STEPS.map((step, i) => (
              <li key={step} className={`flex items-center ${i < STEPS.length - 1 ? "flex-1" : ""}`}>
                <span className="flex flex-col items-center">
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${
                      i <= currentStep ? "bg-ink text-cream" : "bg-cream text-ink-soft"
                    }`}
                  >
                    {i <= currentStep ? "✓" : i + 1}
                  </span>
                  <span className="mt-2 whitespace-nowrap text-xs font-semibold">{STEP_LABELS[step]}</span>
                </span>
                {i < STEPS.length - 1 && (
                  <span className={`mx-2 mb-6 h-0.5 flex-1 ${i < currentStep ? "bg-ink" : "bg-black/10"}`} />
                )}
              </li>
            ))}
          </ol>

          <ul className="mt-6 space-y-2 border-t border-black/10 pt-4 text-sm">
            {order.items.map((it, i) => (
              <li key={i} className="flex justify-between">
                <span>
                  {it.name} · {it.colour} · {it.size} × {it.quantity}
                </span>
                <span className="font-semibold">{formatMoney(it.priceCents * it.quantity)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-ink-soft">
            Delivery: {order.deliveryMethod} · {order.address}, {order.city}
          </p>
          <Link href="/account" className="mt-4 inline-block font-semibold text-accent">
            See all your orders →
          </Link>
        </div>
      )}
    </div>
  );
}

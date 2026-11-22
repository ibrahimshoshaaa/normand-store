import Link from "next/link";
import { getOrdersByEmail } from "@/lib/store";
import { formatMoney, formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

// Normand — demo sign-in: enter the email you checked out with (no password
// in this demo build — add real auth before going live with real customers).
export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;
  const orders = email ? await getOrdersByEmail(email) : [];

  return (
    <div className="mx-auto w-[min(860px,calc(100%-1.5rem))] pt-8">
      <h1 className="font-display text-4xl font-extrabold">Your account</h1>
      <p className="mt-2 text-ink-soft">
        Sign in with the email you used at checkout to see your orders.
      </p>

      <form method="get" action="/account" className="mt-6 flex gap-2">
        <label htmlFor="email" className="sr-only">
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          defaultValue={email ?? ""}
          placeholder="you@example.com"
          className="w-full rounded-full border border-black/15 bg-surface px-5 py-3 outline-none focus:border-ink"
        />
        <button type="submit" className="shrink-0 rounded-full bg-ink px-6 py-3 font-semibold text-cream">
          Sign in
        </button>
      </form>

      {email && (
        <div className="mt-8">
          <h2 className="font-display text-2xl font-bold">Orders for {email}</h2>
          {orders.length === 0 ? (
            <p className="mt-3 rounded-[24px] bg-surface p-6 text-ink-soft">
              No orders found for this email yet.{" "}
              <Link href="/shop" className="font-semibold text-ink underline">
                Shop the collection
              </Link>
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {orders.map((o) => (
                <li key={o.code} className="flex flex-wrap items-center justify-between gap-3 rounded-[24px] bg-surface p-5">
                  <div>
                    <p className="font-mono text-sm uppercase tracking-widest text-ink-soft">{o.code}</p>
                    <p className="font-display font-bold">
                      {o.items.reduce((s, i) => s + i.quantity, 0)} items · {formatMoney(o.totalCents)}
                    </p>
                    <p className="text-sm text-ink-soft">
                      {formatDate(o.createdAt)} · {o.status} · {o.city}
                    </p>
                  </div>
                  <Link
                    href={`/track?code=${o.code}`}
                    className="rounded-full border border-black/20 px-5 py-2.5 text-sm font-semibold"
                  >
                    Track →
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

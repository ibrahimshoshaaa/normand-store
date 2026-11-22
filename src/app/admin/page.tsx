import Link from "next/link";
import { getAdminStats } from "@/lib/store";
import { CountUp } from "@/components/Reveal";
import { DashboardCharts } from "@/components/AdminForms";
import { formatMoney, timeAgo } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminOverview() {
  const stats = await getAdminStats();
  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const todayOrders = stats.latestOrders.filter((o) => {
    const d = new Date(o.createdAt);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  });
  const todayRevenue = todayOrders.reduce((s, o) => s + o.totalCents, 0);

  const kpis = [
    { label: "Revenue · 30 days", cents: stats.revenueCents, money: true },
    { label: "Orders · 30 days", cents: stats.orderCount, money: false },
    { label: "Avg. order value", cents: stats.aovCents, money: true },
    { label: "Customers · 30 days", cents: stats.customers, money: false },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm text-ink-soft">{today}</p>
          <h1 className="font-display text-3xl font-extrabold md:text-4xl">Good morning, Demo</h1>
          <p className="mt-1 text-sm text-ink-soft">
            Last order {stats.latestOrders[0] ? timeAgo(stats.latestOrders[0].createdAt) : "—"}
          </p>
        </div>
        <Link href="/" className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-cream">
          View storefront →
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-[24px] bg-surface p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-ink-soft">{k.label}</p>
            <p className="mt-2 font-display text-3xl font-extrabold">
              {k.money ? "$" : ""}
              <CountUp value={k.money ? Math.round(k.cents / 100) : k.cents} />
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <DashboardCharts series={stats.series} byCategory={stats.byCategory} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="rounded-[24px] bg-surface p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold">Today</h2>
            <span className="text-sm text-ink-soft">Goal $4,000</span>
          </div>
          <p className="mt-3 font-display text-3xl font-extrabold">{formatMoney(todayRevenue)}</p>
          <p className="text-sm text-ink-soft">
            {todayOrders.length} {todayOrders.length === 1 ? "order" : "orders"} so far
          </p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-cream">
            <div className="h-full rounded-full bg-ink" style={{ width: `${Math.min(100, (todayRevenue / 400000) * 100)}%` }} />
          </div>
        </div>

        <div className="rounded-[24px] bg-surface p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold">Top products</h2>
            <span className="text-sm text-ink-soft">By revenue · 30 days</span>
          </div>
          <ul className="mt-4 space-y-3">
            {stats.topProducts.map((p, i) => (
              <li key={p.name}>
                <div className="flex justify-between text-sm">
                  <span>
                    {i + 1}. {p.name} · {p.sold} sold
                  </span>
                  <strong>{formatMoney(Math.round(p.revenue * 100))}</strong>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-cream">
                  <div
                    className="h-full rounded-full bg-[#3b82f6]"
                    style={{ width: `${Math.max(4, (p.revenue / (stats.topProducts[0]?.revenue || 1)) * 100)}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="rounded-[24px] bg-surface p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold">Live orders</h2>
            <Link href="/admin/orders" className="text-sm font-semibold text-accent">
              All orders →
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-black/5">
            {stats.latestOrders.slice(0, 6).map((o) => (
              <li key={o.code} className="flex items-center gap-3 py-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cream font-display font-bold">
                  {o.customerName.split(" ").map((w) => w[0]).join("")}
                </span>
                <span className="flex-1">
                  <span className="block font-semibold">
                    {o.customerName} · {o.city}
                  </span>
                  <span className="text-sm text-ink-soft">
                    {o.items.reduce((s, i) => s + i.quantity, 0)} items · {timeAgo(o.createdAt)}
                  </span>
                </span>
                <span className="font-display font-bold">{formatMoney(o.totalCents)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-[24px] bg-surface p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold">Inventory</h2>
            <Link href="/admin/products" className="text-sm font-semibold text-accent">
              Manage →
            </Link>
          </div>
          <p className="mt-2 text-sm text-ink-soft">
            {stats.lowStock} {stats.lowStock === 1 ? "product" : "products"} running low
          </p>
          <p className="mt-4 text-sm text-ink-soft">
            Stock levels live in the Products tab — edit quantities there and the
            storefront updates immediately.
          </p>
        </div>
      </div>
    </div>
  );
}

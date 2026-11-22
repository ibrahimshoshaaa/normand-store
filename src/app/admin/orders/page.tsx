import { listOrders } from "@/lib/store";
import { OrderStatusSelect } from "@/components/AdminForms";
import { formatMoney, formatDateTime } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminOrders() {
  const orders = await listOrders();
  return (
    <div>
      <h1 className="font-display text-3xl font-extrabold">Orders</h1>
      <p className="mt-1 text-sm text-ink-soft">
        {orders.length} orders · newest first. New orders placed on the storefront show up here immediately.
      </p>
      <div className="mt-6 space-y-3">
        {orders.slice(0, 50).map((o) => (
          <div key={o.code} className="flex flex-wrap items-center gap-3 rounded-[24px] bg-surface p-5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cream font-display font-bold">
              {o.customerName.split(" ").map((w) => w[0]).join("")}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-display font-bold">
                <span className="font-mono text-sm uppercase tracking-widest text-ink-soft">{o.code}</span>{" "}
                {o.customerName} · {o.city}
              </p>
              <p className="text-sm text-ink-soft">
                {o.items.map((i) => `${i.name} × ${i.quantity}`).join(", ")} ·{" "}
                {formatDateTime(o.createdAt)} · {o.email}
              </p>
            </div>
            <span className="font-display text-lg font-bold">{formatMoney(o.totalCents)}</span>
            <OrderStatusSelect code={o.code} status={o.status} />
          </div>
        ))}
      </div>
    </div>
  );
}

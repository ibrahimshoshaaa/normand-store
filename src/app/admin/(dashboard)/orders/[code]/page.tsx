import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrderByCode } from "@/lib/store";
import { OrderStatusSelect } from "@/components/AdminForms";
import { formatDateTime, formatMoney } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminOrderDetail({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const order = await getOrderByCode(code);
  if (!order) notFound();

  return (
    <div>
      <Link href="/admin/orders" className="text-sm font-semibold text-ink-soft hover:underline">
        ← All orders
      </Link>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-extrabold">
          <span className="font-mono text-2xl uppercase tracking-widest">{order.code}</span>
        </h1>
        <OrderStatusSelect code={order.code} status={order.status} />
      </div>
      <p className="mt-1 text-sm text-ink-soft">{formatDateTime(order.createdAt)}</p>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <section className="rounded-[24px] bg-surface p-6">
          <h2 className="font-display text-lg font-bold">Customer</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-ink-soft">Name</dt>
              <dd className="font-semibold">{order.customerName}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-soft">Email</dt>
              <dd className="font-semibold">{order.email}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-soft">Address</dt>
              <dd className="text-right font-semibold">
                {order.address}
                {order.city ? `, ${order.city}` : ""}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-soft">Delivery</dt>
              <dd className="font-semibold">{order.deliveryMethod}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-soft">Payment</dt>
              <dd className="font-semibold">{order.paymentMethod}</dd>
            </div>
          </dl>
        </section>

        <section className="rounded-[24px] bg-surface p-6">
          <h2 className="font-display text-lg font-bold">Items</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {order.items.map((it, i) => (
              <li key={i} className="flex justify-between gap-3 border-b border-black/5 pb-2">
                <span>
                  {it.name} · {it.colour} · {it.size} × {it.quantity}
                </span>
                <span className="font-semibold">{formatMoney(it.priceCents * it.quantity)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-1 border-t border-black/10 pt-4 text-sm">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd>{formatMoney(order.itemsCents)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Delivery ({order.deliveryMethod})</dt>
              <dd>{order.deliveryCents === 0 ? "Free" : formatMoney(order.deliveryCents)}</dd>
            </div>
            <div className="flex justify-between font-display text-lg font-bold">
              <dt>Total</dt>
              <dd>{formatMoney(order.totalCents)}</dd>
            </div>
          </dl>
        </section>
      </div>
    </div>
  );
}

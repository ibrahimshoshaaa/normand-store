"use client";

// Normand — admin client islands: order status selector, product editor,
// category manager, and the dashboard chart tabs.
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  addCategoryAction,
  deleteProductAction,
  renameCategoryAction,
  saveProductAction,
  updateOrderStatusAction,
} from "@/lib/actions";
import { formatMoney } from "@/lib/format";
import type { CategoryView, ProductView } from "@/lib/store";
import { CategoryDonut, RevenueChart } from "./Charts";
import type { DailyPoint } from "@/lib/demo";

export function OrderStatusSelect({ code, status }: { code: string; status: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [failed, setFailed] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  async function change(value: string) {
    if (value === status) return;
    setBusy(true);
    setFailed(false);
    try {
      await updateOrderStatusAction(code, value);
      router.refresh();
      setSaved(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setSaved(false), 3000);
    } catch {
      setFailed(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <span className="inline-flex items-center gap-2">
      <select
        value={status}
        disabled={busy}
        aria-label={`Status for order ${code}`}
        onChange={(e) => change(e.target.value)}
        className="rounded-full border border-black/15 bg-surface px-3 py-1.5 text-sm font-semibold outline-none"
      >
        {["PREPARING", "SHIPPED", "DELIVERED"].map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      {saved && (
        <span role="status" className="text-sm font-semibold text-green-700">
          Saved ✓
        </span>
      )}
      {failed && (
        <span role="alert" className="text-sm font-semibold text-red-700">
          Couldn’t save — try again
        </span>
      )}
    </span>
  );
}

export function DashboardCharts({
  series,
  byCategory,
}: {
  series: DailyPoint[];
  byCategory: Array<{ name: string; revenue: number; share: number; tint: string }>;
}) {
  const [metric, setMetric] = useState<"revenue" | "orders">("revenue");
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
      <div className="rounded-[24px] bg-surface p-6">
        <div className="flex items-center gap-2">
          {(["revenue", "orders"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMetric(m)}
              className={`rounded-full px-4 py-2 text-sm font-semibold capitalize ${
                metric === m ? "bg-ink text-cream" : "bg-cream"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
        <div className="mt-4">
          <RevenueChart series={series} metric={metric} />
        </div>
      </div>
      <div className="rounded-[24px] bg-surface p-6">
        <h3 className="font-display text-lg font-bold">Sales by category</h3>
        <p className="text-sm text-ink-soft">Product sales · last 30 days</p>
        <div className="mt-4">
          <CategoryDonut data={byCategory} />
        </div>
      </div>
    </div>
  );
}

type ProductFormState = {
  name: string;
  categorySlug: string;
  price: string;
  compare: string;
  badge: string;
  stock: string;
  live: boolean;
  blurb: string;
  description: string;
};

function emptyForm(categories: CategoryView[]): ProductFormState {
  return {
    name: "",
    categorySlug: categories[0]?.slug ?? "",
    price: "",
    compare: "",
    badge: "",
    stock: "0",
    live: true,
    blurb: "",
    description: "",
  };
}

function toForm(p: ProductView): ProductFormState {
  return {
    name: p.name,
    categorySlug: p.categorySlug,
    price: String(p.priceCents / 100),
    compare: p.compareCents ? String(p.compareCents / 100) : "",
    badge: p.badge ?? "",
    stock: String(p.stock),
    live: p.live,
    blurb: p.blurb,
    description: p.description,
  };
}

export function ProductsManager({
  products,
  categories,
}: {
  products: ProductView[];
  categories: CategoryView[];
}) {
  const router = useRouter();
  const [filter, setFilter] = useState("");
  const [lowOnly, setLowOnly] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState<ProductFormState>(() => emptyForm(categories));
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const visible = useMemo(() => {
    let list = products;
    if (lowOnly) list = list.filter((p) => p.stock < 10);
    const q = filter.trim().toLowerCase();
    if (q) list = list.filter((p) => p.name.toLowerCase().includes(q));
    return list;
  }, [products, filter, lowOnly]);

  function startEdit(p: ProductView) {
    setEditing(p.slug);
    setAdding(false);
    setForm(toForm(p));
  }

  function startAdd() {
    setAdding(true);
    setEditing(null);
    setForm(emptyForm(categories));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await saveProductAction(editing, {
      name: form.name.trim(),
      categorySlug: form.categorySlug,
      priceCents: Math.round(parseFloat(form.price || "0") * 100),
      compareCents: form.compare ? Math.round(parseFloat(form.compare) * 100) : null,
      badge: form.badge.trim(),
      stock: parseInt(form.stock || "0", 10),
      live: form.live,
      blurb: form.blurb.trim(),
      description: form.description.trim(),
    });
    setSaving(false);
    setEditing(null);
    setAdding(false);
    router.refresh();
  }

  const formFields = (
    <>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm font-semibold">
          Name
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1 w-full rounded-2xl border border-black/15 bg-surface px-4 py-2.5 outline-none" />
        </label>
        <label className="text-sm font-semibold">
          Category
          <select value={form.categorySlug} onChange={(e) => setForm({ ...form, categorySlug: e.target.value })} className="mt-1 w-full rounded-2xl border border-black/15 bg-surface px-4 py-2.5 outline-none">
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-semibold">
          Price (EGP)
          <input required type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="mt-1 w-full rounded-2xl border border-black/15 bg-surface px-4 py-2.5 outline-none" />
        </label>
        <label className="text-sm font-semibold">
          Compare-at price (EGP, optional)
          <input type="number" min="0" step="0.01" value={form.compare} onChange={(e) => setForm({ ...form, compare: e.target.value })} className="mt-1 w-full rounded-2xl border border-black/15 bg-surface px-4 py-2.5 outline-none" />
        </label>
        <label className="text-sm font-semibold">
          Badge (optional)
          <input value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} placeholder="Bestseller / New in" className="mt-1 w-full rounded-2xl border border-black/15 bg-surface px-4 py-2.5 outline-none" />
        </label>
        <label className="text-sm font-semibold">
          Stock
          <input required type="number" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="mt-1 w-full rounded-2xl border border-black/15 bg-surface px-4 py-2.5 outline-none" />
        </label>
      </div>
      <label className="mt-3 block text-sm font-semibold">
        Short blurb
        <input value={form.blurb} onChange={(e) => setForm({ ...form, blurb: e.target.value })} className="mt-1 w-full rounded-2xl border border-black/15 bg-surface px-4 py-2.5 outline-none" />
      </label>
      <label className="mt-3 block text-sm font-semibold">
        Description
        <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="mt-1 w-full rounded-2xl border border-black/15 bg-surface px-4 py-2.5 outline-none" />
      </label>
      <label className="mt-3 flex items-center gap-2 text-sm font-semibold">
        <input type="checkbox" checked={form.live} onChange={(e) => setForm({ ...form, live: e.target.checked })} />
        Live on the storefront
      </label>
      <div className="mt-4 flex gap-2">
        <button type="submit" disabled={saving} className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-cream disabled:opacity-50">
          {saving ? "Saving…" : "Save product"}
        </button>
        <button
          type="button"
          onClick={() => {
            setEditing(null);
            setAdding(false);
          }}
          className="rounded-full border border-black/20 px-5 py-2.5 text-sm font-semibold"
        >
          Cancel
        </button>
      </div>
    </>
  );

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="search"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter products…"
          aria-label="Filter products"
          className="rounded-full border border-black/15 bg-surface px-4 py-2.5 outline-none"
        />
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input type="checkbox" checked={lowOnly} onChange={(e) => setLowOnly(e.target.checked)} />
          Low stock only
        </label>
        <button type="button" onClick={startAdd} className="ml-auto rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-cream">
          + Add product
        </button>
      </div>

      {adding && (
        <form onSubmit={submit} className="mt-4 rounded-[24px] bg-surface p-6">
          <h3 className="font-display text-lg font-bold">New product</h3>
          <div className="mt-3">{formFields}</div>
        </form>
      )}

      <ul className="mt-4 space-y-3">
        {visible.map((p) => (
          <li key={p.slug} className="rounded-[24px] bg-surface p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-display text-lg font-bold">
                  {p.name}{" "}
                  {!p.live && (
                    <span className="rounded-full bg-cream px-2 py-0.5 text-xs font-semibold text-ink-soft">Draft</span>
                  )}
                  {p.stock < 10 && (
                    <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">
                      Low stock
                    </span>
                  )}
                </p>
                <p className="text-sm text-ink-soft">
                  {p.categoryName} · {formatMoney(p.priceCents)} · Stock {p.stock} · ★ {p.rating.toFixed(1)}
                </p>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => startEdit(p)} className="rounded-full border border-black/20 px-4 py-2 text-sm font-semibold">
                  Edit
                </button>
                {confirmDelete === p.slug ? (
                  <>
                    <button
                      type="button"
                      onClick={async () => {
                        await deleteProductAction(p.slug);
                        setConfirmDelete(null);
                        router.refresh();
                      }}
                      className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white"
                    >
                      Delete for real?
                    </button>
                    <button type="button" onClick={() => setConfirmDelete(null)} className="rounded-full border border-black/20 px-4 py-2 text-sm font-semibold">
                      Keep it
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(p.slug)}
                    className="rounded-full border border-red-300 px-4 py-2 text-sm font-semibold text-red-700"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
            {editing === p.slug && (
              <form onSubmit={submit} className="mt-4 border-t border-black/10 pt-4">
                {formFields}
              </form>
            )}
          </li>
        ))}
      </ul>
      {visible.length === 0 && (
        <p className="mt-4 rounded-[24px] bg-surface p-6 text-center text-ink-soft">
          No products match this filter.
        </p>
      )}
    </div>
  );
}

export function CategoriesManager({ categories }: { categories: CategoryView[] }) {
  const router = useRouter();
  const [names, setNames] = useState<Record<string, string>>(
    Object.fromEntries(categories.map((c) => [c.slug, c.name])),
  );
  const [newName, setNewName] = useState("");
  const [saving, setSaving] = useState<string | null>(null);

  async function rename(slug: string) {
    const name = (names[slug] ?? "").trim();
    if (!name) return;
    setSaving(slug);
    await renameCategoryAction(slug, name);
    setSaving(null);
    router.refresh();
  }

  return (
    <div>
      <ul className="space-y-3">
        {categories.map((c) => (
          <li key={c.slug} className="flex flex-wrap items-center gap-3 rounded-[24px] bg-surface p-5">
            <span className="h-10 w-10 rounded-2xl" style={{ background: c.tint }} aria-hidden="true" />
            <input
              value={names[c.slug] ?? c.name}
              onChange={(e) => setNames({ ...names, [c.slug]: e.target.value })}
              aria-label={`Rename category ${c.name}`}
              className="w-48 rounded-2xl border border-black/15 bg-cream px-4 py-2.5 font-display font-bold outline-none focus:border-ink"
            />
            <span className="text-sm text-ink-soft">
              {c.liveCount} live · {c.productCount} total
            </span>
            <button
              type="button"
              disabled={saving === c.slug}
              onClick={() => rename(c.slug)}
              className="ml-auto rounded-full bg-ink px-4 py-2 text-sm font-semibold text-cream disabled:opacity-50"
            >
              {saving === c.slug ? "Saving…" : "Rename"}
            </button>
          </li>
        ))}
      </ul>

      <form
        className="mt-6 flex gap-2"
        onSubmit={async (e) => {
          e.preventDefault();
          const name = newName.trim();
          if (!name) return;
          await addCategoryAction(name);
          setNewName("");
          router.refresh();
        }}
      >
        <label htmlFor="new-category" className="sr-only">
          New category name
        </label>
        <input
          id="new-category"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="+ Add category…"
          className="w-full rounded-full border border-black/15 bg-surface px-5 py-3 outline-none focus:border-ink"
        />
        <button type="submit" className="shrink-0 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-cream">
          Add
        </button>
      </form>
      <p className="mt-3 text-sm text-ink-soft">
        Renaming a category moves every product in it in the same step — shop links keep working.
      </p>
    </div>
  );
}

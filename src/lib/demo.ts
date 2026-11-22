// Normand — deterministic demo-order generator.
// Produces ~497 orders over the last 30 days, roughly EGP 1.3m in product sales
// (items only, before delivery), matching the feel of the original template's
// dashboard. The same generator feeds:
//  - the Prisma seed script (real rows in Neon), and
//  - the in-memory demo fallback when no DATABASE_URL is configured.
// Deterministic (seeded PRNG) so the dashboard is stable across restarts.

import {
  EXPRESS_SHIPPING_CENTS,
  FREE_SHIPPING_THRESHOLD_CENTS,
  PRODUCTS,
  type ProductSeed,
} from "./catalog";

export type DemoOrderItem = {
  slug: string;
  name: string;
  priceCents: number;
  quantity: number;
  colour: string;
  size: string;
};

export type DemoOrder = {
  code: string;
  customerName: string;
  email: string;
  city: string;
  address: string;
  deliveryMethod: "Standard" | "Express";
  paymentMethod: "Cash on delivery";
  items: DemoOrderItem[];
  itemsCents: number;
  deliveryCents: number;
  totalCents: number;
  status: "PREPARING" | "SHIPPED" | "DELIVERED";
  createdAt: Date;
};

const CUSTOMERS: Array<[string, string, string]> = [
  ["Noura Hassan", "Cairo", "15 Talaat Harb St"],
  ["Omar Adel", "Alexandria", "22 Fouad St"],
  ["Mona Salem", "Giza", "8 Haram St"],
  ["Karim Nabil", "Luxor", "5 Corniche El Nil"],
  ["Sara Mahmoud", "Cairo", "30 Gameat El Dowal St"],
  ["Ahmed El-Sayed", "Mansoura", "12 El Gomhouria St"],
  ["Layla Ibrahim", "Tanta", "45 El Bahr St"],
  ["Mostafa Ali", "Zagazig", "7 El Galaa St"],
  ["Hana Mohamed", "Port Said", "18 Palestine St"],
  ["Youssef Khaled", "Suez", "3 El Geish St"],
  ["Mariam Tarek", "Hurghada", "27 Sheraton Rd"],
  ["Amr Fathy", "Aswan", "9 Corniche El Nil"],
  ["Dina Sherif", "Ismailia", "14 El Thalathiny St"],
  ["Khaled Hassan", "Fayoum", "6 El Horreya St"],
  ["Rania Atef", "Minya", "21 El Mahatta St"],
  ["Mohamed Samir", "Assiut", "11 El Nemis St"],
];

const SIZES = ["XS", "S", "M", "L", "XL"];

/** Small seeded PRNG so demo data is identical on every run. */
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateDemoOrders(
  products: ProductSeed[] = PRODUCTS,
  count = 497,
  days = 30,
  seed = 20261122,
): DemoOrder[] {
  const rand = mulberry32(seed);
  const now = Date.now();
  const orders: DemoOrder[] = [];

  for (let i = 0; i < count; i++) {
    // Spread orders over the last `days` days, weighted toward recent days.
    const ageDays = Math.pow(rand(), 1.4) * days;
    const createdAt = new Date(now - ageDays * 24 * 60 * 60 * 1000);
    const [name, city, address] = CUSTOMERS[Math.floor(rand() * CUSTOMERS.length)];
    const email = `${name.toLowerCase().replace(/[^a-z]+/g, ".")}@example.com`;

    // 1–3 distinct products, 1–2 of each — average order ≈ EGP 2,600.
    const itemCount = 1 + Math.floor(rand() * 3);
    const picked = [...products].sort(() => rand() - 0.5).slice(0, itemCount);
    const items: DemoOrderItem[] = picked.map((p) => {
      const colour = p.colours[Math.floor(rand() * p.colours.length)];
      return {
        slug: p.slug,
        name: p.name,
        priceCents: p.priceCents,
        quantity: rand() < 0.65 ? 1 : 2,
        colour: colour.name,
        size: SIZES[Math.floor(rand() * SIZES.length)],
      };
    });

    const itemsCents = items.reduce((s, it) => s + it.priceCents * it.quantity, 0);
    const express = rand() < 0.22;
    // Same rule as the storefront: free delivery over the threshold,
    // otherwise Express costs the express fee and Standard is free.
    const deliveryCents =
      itemsCents >= FREE_SHIPPING_THRESHOLD_CENTS
        ? 0
        : express
          ? EXPRESS_SHIPPING_CENTS
          : 0;
    const status: DemoOrder["status"] =
      ageDays < 0.7 ? "PREPARING" : ageDays < 3 ? "SHIPPED" : "DELIVERED";

    orders.push({
      code: `NM-${2400 + i}`,
      customerName: name,
      email,
      city,
      address,
      deliveryMethod: express ? "Express" : "Standard",
      paymentMethod: "Cash on delivery",
      items,
      itemsCents,
      deliveryCents,
      totalCents: itemsCents + deliveryCents,
      status,
      createdAt,
    });
  }

  // Newest first.
  orders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  return orders;
}

export type DailyPoint = { label: string; revenue: number; orders: number };

export function dailySeries(orders: DemoOrder[], days = 30): DailyPoint[] {
  const points: DailyPoint[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let d = days - 1; d >= 0; d--) {
    const day = new Date(today.getTime() - d * 24 * 60 * 60 * 1000);
    const next = new Date(day.getTime() + 24 * 60 * 60 * 1000);
    const dayOrders = orders.filter((o) => o.createdAt >= day && o.createdAt < next);
    points.push({
      label: day.toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
      // Product sales only (items, excl. delivery) — the same measure the
      // revenue KPI and the category donut use, so the three totals agree.
      revenue: dayOrders.reduce((s, o) => s + o.itemsCents, 0) / 100,
      orders: dayOrders.length,
    });
  }
  return points;
}

export function salesByCategory(
  orders: DemoOrder[],
  products: ProductSeed[] = PRODUCTS,
): Array<{ name: string; revenue: number; share: number; tint: string }> {
  const bySlug = new Map(products.map((p) => [p.slug, p]));
  const totals = new Map<string, number>();
  let grand = 0;
  for (const o of orders) {
    for (const it of o.items) {
      const p = bySlug.get(it.slug);
      if (!p) continue;
      const v = it.priceCents * it.quantity;
      totals.set(p.categorySlug, (totals.get(p.categorySlug) ?? 0) + v);
      grand += v;
    }
  }
  const tintFor: Record<string, string> = {
    "t-shirts": "#e8c97a",
    "hoodies-sweats": "#8aa878",
    jackets: "#d99a6c",
    trousers: "#7d9bb5",
    dresses: "#d69a9e",
  };
  const names: Record<string, string> = {
    "t-shirts": "T-Shirts",
    "hoodies-sweats": "Hoodies & Sweats",
    jackets: "Jackets",
    trousers: "Trousers",
    dresses: "Dresses",
  };
  return [...totals.entries()]
    .map(([slug, cents]) => ({
      name: names[slug] ?? slug,
      revenue: cents / 100,
      share: grand ? cents / grand : 0,
      tint: tintFor[slug] ?? "#c99a68",
    }))
    .sort((a, b) => b.revenue - a.revenue);
}

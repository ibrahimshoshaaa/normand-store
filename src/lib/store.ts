// Normand — data layer.
// Reads/writes Neon Postgres via Prisma when DATABASE_URL is set; otherwise
// falls back to the static catalog + deterministic demo orders in memory.
// The storefront therefore works out of the box, and every write (new order,
// admin edits) still works in demo mode for the running server instance.

import { CATEGORIES, PRODUCTS, type ProductSeed } from "./catalog";
import { dailySeries, generateDemoOrders, salesByCategory, type DemoOrder } from "./demo";
import { getPrisma } from "./prisma";

export type ProductView = {
  id: string;
  slug: string;
  name: string;
  categorySlug: string;
  categoryName: string;
  priceCents: number;
  compareCents: number | null;
  badge: string | null;
  rating: number;
  reviews: number;
  colours: { name: string; hex: string }[];
  sizes: string[];
  stock: number;
  live: boolean;
  garment: string;
  imageUrl: string | null;
  tint: string;
  blurb: string;
  description: string;
};

export type CategoryView = {
  id: string;
  name: string;
  slug: string;
  tint: string;
  sortOrder: number;
  productCount: number;
  liveCount: number;
};

export type OrderItemView = {
  slug: string;
  name: string;
  priceCents: number;
  quantity: number;
  colour: string;
  size: string;
};

export type OrderView = {
  id: string;
  code: string;
  customerName: string;
  email: string;
  city: string;
  address: string;
  deliveryMethod: string;
  itemsCents: number;
  deliveryCents: number;
  totalCents: number;
  status: string;
  createdAt: Date;
  items: OrderItemView[];
};

function seedToView(p: ProductSeed): ProductView {
  const cat = CATEGORIES.find((c) => c.slug === p.categorySlug);
  return {
    id: p.slug,
    slug: p.slug,
    name: p.name,
    categorySlug: p.categorySlug,
    categoryName: cat?.name ?? p.categorySlug,
    priceCents: p.priceCents,
    compareCents: p.compareCents ?? null,
    badge: p.badge ?? null,
    rating: p.rating,
    reviews: p.reviews,
    colours: p.colours,
    sizes: p.sizes,
    stock: p.stock,
    live: true,
    garment: p.garment,
    imageUrl: p.imageUrl,
    tint: p.tint,
    blurb: p.blurb,
    description: p.description,
  };
}

// ---- in-memory demo store (used when no DATABASE_URL) ----------------------
let memoryOrders: OrderView[] | null = null;
let memoryProducts: ProductView[] | null = null;
let memoryCategories: CategoryView[] | null = null;

function demoOrders(): OrderView[] {
  if (!memoryOrders) {
    memoryOrders = generateDemoOrders().map((o: DemoOrder) => ({
      id: o.code,
      code: o.code,
      customerName: o.customerName,
      email: o.email,
      city: o.city,
      address: o.address,
      deliveryMethod: o.deliveryMethod,
      itemsCents: o.itemsCents,
      deliveryCents: o.deliveryCents,
      totalCents: o.totalCents,
      status: o.status,
      createdAt: o.createdAt,
      items: o.items,
    }));
  }
  return memoryOrders;
}

function demoProducts(): ProductView[] {
  if (!memoryProducts) memoryProducts = PRODUCTS.map(seedToView);
  return memoryProducts;
}

function demoCategories(): CategoryView[] {
  if (!memoryCategories) {
    memoryCategories = CATEGORIES.map((c) => {
      const inCat = PRODUCTS.filter((p) => p.categorySlug === c.slug);
      return {
        id: c.slug,
        name: c.name,
        slug: c.slug,
        tint: c.tint,
        sortOrder: c.sortOrder,
        productCount: inCat.length,
        liveCount: inCat.length,
      };
    });
  }
  return memoryCategories;
}

// ---- reads ------------------------------------------------------------------

// Run a Prisma read, retrying once after a short delay. Neon free-tier
// databases suspend after inactivity and wake slowly; a first query can
// fail while the database is still waking up. Without the retry the code
// would silently fall back to freshly generated demo data, so dashboard
// totals changed on every load. Returns null only if both attempts fail.
async function withDbRetry<T>(fn: () => Promise<T>): Promise<T | null> {
  try {
    return await fn();
  } catch {
    await new Promise((resolve) => setTimeout(resolve, 900));
    try {
      return await fn();
    } catch {
      return null;
    }
  }
}

export async function listProducts(): Promise<ProductView[]> {
  const prisma = getPrisma();
  if (prisma) {
    const rows = await withDbRetry(() =>
      prisma.product.findMany({
        include: { category: true },
        orderBy: { createdAt: "asc" },
      }),
    );
    if (rows) {
      return rows.map((r) => ({
        id: r.id,
        slug: r.slug,
        name: r.name,
        categorySlug: r.category.slug,
        categoryName: r.category.name,
        priceCents: r.priceCents,
        compareCents: r.compareCents,
        badge: r.badge,
        rating: r.rating,
        reviews: r.reviews,
        colours: (r.colours as ProductView["colours"]) ?? [],
        sizes: (r.sizes as string[]) ?? [],
        stock: r.stock,
        live: r.live,
        garment: r.garment,
        imageUrl: r.imageUrl,
        tint: r.tint,
        blurb: r.blurb,
        description: r.description,
      }));
    }
  }
  // DB unreachable (or not configured) — fall through to demo data.
  return demoProducts();
}

export async function listLiveProducts(): Promise<ProductView[]> {
  return (await listProducts()).filter((p) => p.live);
}

export async function getProduct(slug: string): Promise<ProductView | null> {
  const all = await listProducts();
  return all.find((p) => p.slug === slug) ?? null;
}

export async function listCategories(): Promise<CategoryView[]> {
  const prisma = getPrisma();
  if (prisma) {
    const rows = await withDbRetry(() =>
      prisma.category.findMany({
        include: { products: true },
        orderBy: { sortOrder: "asc" },
      }),
    );
    if (rows) {
      return rows.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        tint: c.tint,
        sortOrder: c.sortOrder,
        productCount: c.products.length,
        liveCount: c.products.filter((p) => p.live).length,
      }));
    }
  }
  return demoCategories();
}

export async function listOrders(): Promise<OrderView[]> {
  const prisma = getPrisma();
  if (prisma) {
    const rows = await withDbRetry(() =>
      prisma.order.findMany({
        include: { items: { include: { product: true } } },
        orderBy: { createdAt: "desc" },
      }),
    );
    if (rows) {
      return rows.map((o) => ({
        id: o.id,
        code: o.code,
        customerName: o.customerName,
        email: o.email,
        city: o.city,
        address: o.address,
        deliveryMethod: o.deliveryMethod,
        itemsCents: o.itemsCents,
        deliveryCents: o.deliveryCents,
        totalCents: o.totalCents,
        status: o.status,
        createdAt: o.createdAt,
        items: o.items.map((it) => ({
          slug: it.product?.slug ?? "",
          name: it.name,
          priceCents: it.priceCents,
          quantity: it.quantity,
          colour: it.colour,
          size: it.size,
        })),
      }));
    }
  }
  return demoOrders();
}

export async function getOrderByCode(code: string): Promise<OrderView | null> {
  const orders = await listOrders();
  return orders.find((o) => o.code.toUpperCase() === code.trim().toUpperCase()) ?? null;
}

export async function getOrdersByEmail(email: string): Promise<OrderView[]> {
  const orders = await listOrders();
  return orders.filter((o) => o.email.toLowerCase() === email.trim().toLowerCase());
}

// ---- admin stats --------------------------------------------------------------
export async function getAdminStats() {
  const [orders, products] = await Promise.all([listOrders(), listProducts()]);
  const now = Date.now();
  const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
  const recent = orders.filter((o) => o.createdAt.getTime() >= thirtyDaysAgo);
  const revenueCents = recent.reduce((s, o) => s + o.totalCents, 0);
  const orderCount = recent.length;
  const customers = new Set(recent.map((o) => o.email)).size;
  const aovCents = orderCount ? Math.round(revenueCents / orderCount) : 0;

  const demoLike: DemoOrder[] = recent.map((o) => ({
    code: o.code,
    customerName: o.customerName,
    email: o.email,
    city: o.city,
    address: o.address,
    deliveryMethod: o.deliveryMethod as "Standard" | "Express",
    items: o.items.map((it) => ({
      slug: it.slug,
      name: it.name,
      priceCents: it.priceCents,
      quantity: it.quantity,
      colour: it.colour,
      size: it.size,
    })),
    itemsCents: o.itemsCents,
    deliveryCents: o.deliveryCents,
    totalCents: o.totalCents,
    status: o.status as DemoOrder["status"],
    createdAt: o.createdAt,
  }));
  const series = dailySeries(demoLike, 30);
  const byCategory = salesByCategory(demoLike, PRODUCTS);

  // Top products by revenue in the last 30 days.
  const byProduct = new Map<string, { name: string; revenue: number; sold: number }>();
  for (const o of recent) {
    for (const it of o.items) {
      const key = it.name;
      const cur = byProduct.get(key) ?? { name: key, revenue: 0, sold: 0 };
      cur.revenue += (it.priceCents * it.quantity) / 100;
      cur.sold += it.quantity;
      byProduct.set(key, cur);
    }
  }
  const topProducts = [...byProduct.values()].sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  const lowStock = products.filter((p) => p.stock < 10).length;

  return {
    revenueCents,
    orderCount,
    aovCents,
    customers,
    series,
    byCategory,
    topProducts,
    lowStock,
    latestOrders: orders.slice(0, 9),
  };
}

// ---- writes (DB when available, in-memory overlay otherwise) ----------------
export type NewOrderInput = {
  customerName: string;
  email: string;
  city: string;
  address: string;
  deliveryMethod: "Standard" | "Express";
  items: Array<{ slug: string; colour: string; size: string; quantity: number }>;
};

export async function createOrder(input: NewOrderInput): Promise<OrderView> {
  const products = await listProducts();
  const items: OrderItemView[] = [];
  let itemsCents = 0;
  for (const it of input.items) {
    const p = products.find((x) => x.slug === it.slug);
    if (!p) continue;
    items.push({
      slug: p.slug,
      name: p.name,
      priceCents: p.priceCents,
      quantity: it.quantity,
      colour: it.colour,
      size: it.size,
    });
    itemsCents += p.priceCents * it.quantity;
  }
  if (items.length === 0) throw new Error("Your bag is empty.");
  const deliveryCents =
    itemsCents >= 15000 ? 0 : input.deliveryMethod === "Express" ? 2500 : 0;

  const prisma = getPrisma();
  const code = `NM-${Math.floor(1000 + Math.random() * 9000)}`;
  if (prisma) {
    try {
      const created = await prisma.order.create({
        data: {
          code,
          customerName: input.customerName,
          email: input.email,
          city: input.city,
          address: input.address,
          deliveryMethod: input.deliveryMethod,
          itemsCents,
          deliveryCents,
          totalCents: itemsCents + deliveryCents,
          status: "PREPARING",
          items: {
            create: items.map((it) => ({
              product: { connect: { slug: it.slug } },
              name: it.name,
              priceCents: it.priceCents,
              quantity: it.quantity,
              colour: it.colour,
              size: it.size,
            })),
          },
        },
        include: { items: true },
      });
      return {
        id: created.id,
        code: created.code,
        customerName: created.customerName,
        email: created.email,
        city: created.city,
        address: created.address,
        deliveryMethod: created.deliveryMethod,
        itemsCents: created.itemsCents,
        deliveryCents: created.deliveryCents,
        totalCents: created.totalCents,
        status: created.status,
        createdAt: created.createdAt,
        items,
      };
    } catch {
      // fall through to in-memory
    }
  }
  const order: OrderView = {
    id: code,
    code,
    customerName: input.customerName,
    email: input.email,
    city: input.city,
    address: input.address,
    deliveryMethod: input.deliveryMethod,
    itemsCents,
    deliveryCents,
    totalCents: itemsCents + deliveryCents,
    status: "PREPARING",
    createdAt: new Date(),
    items,
  };
  demoOrders().unshift(order);
  return order;
}

export async function setOrderStatus(code: string, status: string): Promise<void> {
  const prisma = getPrisma();
  if (prisma) {
    try {
      await prisma.order.update({ where: { code }, data: { status } });
      return;
    } catch {
      // fall through
    }
  }
  const order = demoOrders().find((o) => o.code === code);
  if (order) order.status = status;
}

export type ProductInput = {
  name: string;
  categorySlug: string;
  priceCents: number;
  compareCents: number | null;
  badge: string;
  stock: number;
  live: boolean;
  blurb: string;
  description: string;
};

export async function saveProduct(
  slug: string | null,
  input: ProductInput,
): Promise<ProductView> {
  const prisma = getPrisma();
  if (prisma) {
    try {
      const cat = await prisma.category.findUnique({ where: { slug: input.categorySlug } });
      if (!cat) throw new Error("Category not found.");
      const data = {
        name: input.name,
        categoryId: cat.id,
        priceCents: input.priceCents,
        compareCents: input.compareCents,
        badge: input.badge || null,
        stock: input.stock,
        live: input.live,
        blurb: input.blurb,
        description: input.description,
      };
      const row = slug
        ? await prisma.product.update({
            where: { slug },
            data,
            include: { category: true },
          })
        : await prisma.product.create({
            data: {
              ...data,
              slug: input.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
              garment: "tee",
              tint: "#f6ead0",
            },
            include: { category: true },
          });
      return {
        id: row.id,
        slug: row.slug,
        name: row.name,
        categorySlug: row.category.slug,
        categoryName: row.category.name,
        priceCents: row.priceCents,
        compareCents: row.compareCents,
        badge: row.badge,
        rating: row.rating,
        reviews: row.reviews,
        colours: (row.colours as ProductView["colours"]) ?? [],
        sizes: (row.sizes as string[]) ?? [],
        stock: row.stock,
        live: row.live,
        garment: row.garment,
        imageUrl: row.imageUrl,
        tint: row.tint,
        blurb: row.blurb,
        description: row.description,
      };
    } catch (e) {
      if (e instanceof Error && e.message === "Category not found.") throw e;
      // fall through to in-memory
    }
  }
  const list = demoProducts();
  const cat = CATEGORIES.find((c) => c.slug === input.categorySlug);
  if (slug) {
    const p = list.find((x) => x.slug === slug);
    if (!p) throw new Error("Product not found.");
    Object.assign(p, {
      name: input.name,
      categorySlug: input.categorySlug,
      categoryName: cat?.name ?? p.categoryName,
      priceCents: input.priceCents,
      compareCents: input.compareCents,
      badge: input.badge || null,
      stock: input.stock,
      live: input.live,
      blurb: input.blurb,
      description: input.description,
    });
    return p;
  }
  const created: ProductView = {
    id: `new-${Date.now()}`,
    slug: input.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    name: input.name,
    categorySlug: input.categorySlug,
    categoryName: cat?.name ?? input.categorySlug,
    priceCents: input.priceCents,
    compareCents: input.compareCents,
    badge: input.badge || null,
    rating: 0,
    reviews: 0,
    colours: [{ name: "Natural", hex: "#e9ddc8" }],
    sizes: ["XS", "S", "M", "L", "XL"],
    stock: input.stock,
    live: input.live,
    garment: "tee",
    imageUrl: null,
    tint: "#f6ead0",
    blurb: input.blurb,
    description: input.description,
  };
  list.push(created);
  return created;
}

export async function deleteProduct(slug: string): Promise<void> {
  const prisma = getPrisma();
  if (prisma) {
    try {
      await prisma.product.delete({ where: { slug } });
      return;
    } catch {
      // fall through
    }
  }
  const list = demoProducts();
  const i = list.findIndex((p) => p.slug === slug);
  if (i >= 0) list.splice(i, 1);
}

export async function renameCategory(
  slug: string,
  newName: string,
): Promise<void> {
  const prisma = getPrisma();
  if (prisma) {
    try {
      await prisma.category.update({ where: { slug }, data: { name: newName } });
      return;
    } catch {
      // fall through
    }
  }
  const cat = demoCategories().find((c) => c.slug === slug);
  if (cat) cat.name = newName;
  for (const p of demoProducts()) {
    if (p.categorySlug === slug) p.categoryName = newName;
  }
}

export async function addCategory(name: string): Promise<void> {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const prisma = getPrisma();
  if (prisma) {
    try {
      await prisma.category.create({
        data: { name, slug, tint: "#f2dfe0", sortOrder: 99 },
      });
      return;
    } catch {
      // fall through
    }
  }
  const cats = demoCategories();
  if (!cats.some((c) => c.slug === slug)) {
    cats.push({
      id: slug,
      name,
      slug,
      tint: "#f2dfe0",
      sortOrder: 99,
      productCount: 0,
      liveCount: 0,
    });
  }
}

// ---- newsletter subscribers -------------------------------------------------
export type SubscriberView = { id: string; email: string; createdAt: Date };

let memorySubscribers: SubscriberView[] = [];

export async function subscribeNewsletter(email: string): Promise<void> {
  const clean = email.trim().toLowerCase();
  if (!clean.includes("@")) throw new Error("Enter a valid email address.");
  const prisma = getPrisma();
  if (prisma) {
    try {
      await prisma.subscriber.upsert({
        where: { email: clean },
        update: {},
        create: { email: clean },
      });
      return;
    } catch {
      // DB unreachable — keep the signup in memory so the visitor still
      // gets their confirmation instead of an error page.
    }
  }
  if (!memorySubscribers.some((s) => s.email === clean)) {
    memorySubscribers.push({ id: `sub-${Date.now()}`, email: clean, createdAt: new Date() });
  }
}

export async function listSubscribers(): Promise<SubscriberView[]> {
  const prisma = getPrisma();
  if (prisma) {
    const rows = await withDbRetry(() =>
      prisma.subscriber.findMany({ orderBy: { createdAt: "desc" } }),
    );
    if (rows) {
      return rows.map((r) => ({ id: r.id, email: r.email, createdAt: r.createdAt }));
    }
  }
  return [...memorySubscribers].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
  );
}

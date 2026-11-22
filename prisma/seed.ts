// Normand — seed script.
// Usage:  npm run seed        (needs DATABASE_URL pointing at Neon, database `normand`)
// Clears demo data and re-creates the 5 categories, 8 products and ~497 demo
// orders (~$163k revenue) so the admin dashboard looks alive on first login.
import { PrismaClient } from "@prisma/client";
import { CATEGORIES, PRODUCTS } from "../src/lib/catalog";
import { generateDemoOrders } from "../src/lib/demo";

const prisma = new PrismaClient();

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set. Copy .env.example to .env and fill it in.");
  }
  console.log("Seeding Normand…");

  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  const categoryIds = new Map<string, string>();
  for (const c of CATEGORIES) {
    const row = await prisma.category.create({
      data: { name: c.name, slug: c.slug, tint: c.tint, sortOrder: c.sortOrder },
    });
    categoryIds.set(c.slug, row.id);
  }

  for (const p of PRODUCTS) {
    await prisma.product.create({
      data: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        blurb: p.blurb,
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
        categoryId: categoryIds.get(p.categorySlug)!,
      },
    });
  }
  console.log(`Created ${CATEGORIES.length} categories, ${PRODUCTS.length} products.`);

  const demo = generateDemoOrders();
  const customerIds = new Map<string, string>();
  for (let i = 0; i < demo.length; i++) {
    const o = demo[i];
    let customerId = customerIds.get(o.email);
    if (!customerId) {
      const customer = await prisma.customer.create({
        data: { name: o.customerName, email: o.email, city: o.city },
      });
      customerId = customer.id;
      customerIds.set(o.email, customerId);
    }
    await prisma.order.create({
      data: {
        code: o.code,
        customerId,
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
        items: {
          create: o.items.map((it) => ({
            product: { connect: { slug: it.slug } },
            name: it.name,
            priceCents: it.priceCents,
            quantity: it.quantity,
            colour: it.colour,
            size: it.size,
          })),
        },
      },
    });
    if ((i + 1) % 100 === 0) console.log(`  …${i + 1} orders`);
  }

  const total = demo.reduce((s, o) => s + o.totalCents, 0) / 100;
  console.log(`Created ${demo.length} demo orders, total $${total.toLocaleString()}.`);
  console.log("Done. Run `npm run dev` and open http://localhost:3000");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

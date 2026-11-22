import { listCategories, listProducts } from "@/lib/store";
import { ShopClient } from "@/components/ShopClient";

export const dynamic = "force-dynamic";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const [products, categories] = await Promise.all([listProducts(), listCategories()]);
  return (
    <div className="mx-auto w-[min(1200px,calc(100%-1.5rem))] pt-8">
      <h1 className="font-display text-4xl font-extrabold md:text-5xl">Shop all</h1>
      <p className="mt-2 text-ink-soft">Calm clothing for slow days — every piece, in one place.</p>
      <div className="mt-6">
        <ShopClient
          products={products}
          categories={categories}
          initialCategory={params.category ?? "all"}
        />
      </div>
    </div>
  );
}

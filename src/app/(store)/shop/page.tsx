import { listCategories, listProducts } from "@/lib/store";
import { ShopClient } from "@/components/ShopClient";

export const dynamic = "force-dynamic";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const params = await searchParams;
  const [products, categories] = await Promise.all([listProducts(), listCategories()]);
  return (
    <div className="mx-auto w-[min(1200px,calc(100%-1.5rem))] pt-8">
      <ShopClient
        products={products}
        categories={categories}
        initialCategory={params.category ?? "all"}
        initialQuery={params.q ?? ""}
      />
    </div>
  );
}

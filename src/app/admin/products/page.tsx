import { listCategories, listProducts } from "@/lib/store";
import { ProductsManager } from "@/components/AdminForms";

export const dynamic = "force-dynamic";

export default async function AdminProducts() {
  const [products, categories] = await Promise.all([listProducts(), listCategories()]);
  return (
    <div>
      <h1 className="font-display text-3xl font-extrabold">Products</h1>
      <p className="mt-1 text-sm text-ink-soft">
        Add, edit and delete products. Switch any product between live and draft — edits reach the
        storefront straight away.
      </p>
      <div className="mt-6">
        <ProductsManager products={products} categories={categories} />
      </div>
    </div>
  );
}

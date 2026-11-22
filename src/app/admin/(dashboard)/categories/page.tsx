import { listCategories } from "@/lib/store";
import { CategoriesManager } from "@/components/AdminForms";

export const dynamic = "force-dynamic";

export default async function AdminCategories() {
  const categories = await listCategories();
  return (
    <div>
      <h1 className="font-display text-3xl font-extrabold">Categories</h1>
      <p className="mt-1 text-sm text-ink-soft">
        Every category with its live and total product counts. Rename in place — shop links keep working.
      </p>
      <div className="mt-6">
        <CategoriesManager categories={categories} />
      </div>
    </div>
  );
}

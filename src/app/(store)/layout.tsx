import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { listCategories } from "@/lib/store";

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const categories = await listCategories();
  return (
    <div className="flex min-h-screen flex-col">
      <Header categories={categories} />
      <main className="flex-1">{children}</main>
      <Footer categories={categories} />
    </div>
  );
}

import { notFound } from "next/navigation";
import Link from "next/link";
import { getProduct, listLiveProducts } from "@/lib/store";
import { ProductDetail } from "@/components/ProductDetail";
import { ProductCard } from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product || !product.live) notFound();
  const all = await listLiveProducts();
  const related = all
    .filter((p) => p.slug !== product.slug && p.categorySlug === product.categorySlug)
    .concat(all.filter((p) => p.slug !== product.slug && p.categorySlug !== product.categorySlug))
    .slice(0, 3);

  return (
    <div className="mx-auto w-[min(1200px,calc(100%-1.5rem))] pt-8">
      <nav aria-label="Breadcrumb" className="text-sm text-ink-soft">
        <Link href="/shop" className="hover:underline">
          Shop
        </Link>{" "}
        / {product.categoryName} / <span className="text-ink">{product.name}</span>
      </nav>
      <div className="mt-5">
        <ProductDetail product={product} />
      </div>

      <section aria-label="You may also like" className="mt-16">
        <h2 className="font-display text-3xl font-extrabold">You may also like</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-3">
          {related.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}

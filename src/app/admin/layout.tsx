import Link from "next/link";

const NAV = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/", label: "Storefront" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex w-[min(1280px,calc(100%-1.5rem))] gap-5 py-6">
      <aside className="hidden w-60 shrink-0 md:block">
        <div className="sticky top-6 rounded-[24px] bg-surface p-5">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink font-display text-lg font-bold text-cream">
              N
            </span>
            <span className="font-display text-xl font-extrabold">NORMAND</span>
            <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold text-white">DEMO</span>
          </Link>
          <nav aria-label="Admin" className="mt-6 space-y-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-full px-4 py-2.5 text-sm font-semibold hover:bg-cream"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-6 rounded-2xl bg-cream p-4 text-sm">
            <p className="flex items-center gap-2 font-semibold">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-leaf" />
              Live traffic — simulating shoppers
            </p>
            <p className="mt-1 text-ink-soft">Demo admin · demo@normand.store</p>
            <Link href="/" className="mt-2 inline-block font-semibold underline">
              View storefront →
            </Link>
          </div>
        </div>
      </aside>
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}

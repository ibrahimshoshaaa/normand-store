import Link from "next/link";
import { adminLogoutAction } from "@/lib/actions";
import { isAdminPasswordSet } from "@/lib/admin-auth";
import { AdminNavLink, AdminNavProvider } from "@/components/AdminNavLoader";

const NAV = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/subscribers", label: "Subscribers" },
  { href: "/", label: "Storefront" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const passwordSet = isAdminPasswordSet();
  return (
    <AdminNavProvider>
      <div className="mx-auto w-[min(1280px,calc(100%-1.5rem))] py-6">
        {!passwordSet && (
          <p role="alert" className="mb-4 rounded-2xl bg-amber-100 px-4 py-3 text-sm font-semibold text-amber-900">
            Admin password is not set — anyone who knows this URL can open the
            dashboard. Set ADMIN_PASSWORD in your environment (see README).
          </p>
        )}

        {/* Mobile nav — the sidebar is hidden below md. */}
        <nav aria-label="Admin" className="no-scrollbar mb-4 flex gap-2 overflow-x-auto md:hidden">
          {NAV.map((item) => (
            <AdminNavLink
              key={item.href}
              href={item.href}
              className="shrink-0 rounded-full bg-surface px-4 py-2 text-sm font-semibold"
            >
              {item.label}
            </AdminNavLink>
          ))}
        </nav>

        <div className="flex gap-5">
          <aside className="hidden w-60 shrink-0 md:block">
            <div className="sticky top-6 rounded-[24px] bg-surface p-5">
              <AdminNavLink href="/admin" className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink font-display text-lg font-bold text-cream">
                  N
                </span>
                <span className="font-display text-xl font-extrabold">Normand</span>
              </AdminNavLink>
              <nav aria-label="Admin" className="mt-6 space-y-1">
                {NAV.map((item) => (
                  <AdminNavLink
                    key={item.href}
                    href={item.href}
                    className="block rounded-full px-4 py-2.5 text-sm font-semibold hover:bg-cream"
                  >
                    {item.label}
                  </AdminNavLink>
                ))}
              </nav>
            {passwordSet && (
              <form action={adminLogoutAction} className="mt-6">
                <button
                  type="submit"
                  className="w-full rounded-full border border-black/20 px-4 py-2.5 text-sm font-semibold"
                >
                  Sign out
                </button>
              </form>
            )}
            <Link href="/" className="mt-3 block text-center text-sm font-semibold underline">
              View storefront →
            </Link>
          </div>
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
        </div>
      </div>
    </AdminNavProvider>
  );
}

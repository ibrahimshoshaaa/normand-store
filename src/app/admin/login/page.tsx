import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminPasswordSet } from "@/lib/admin-auth";
import { AdminLoginForm } from "@/components/AdminLoginForm";

// Must be dynamic: whether the gate is open depends on the runtime
// ADMIN_PASSWORD env var, not the value present at build time.
export const dynamic = "force-dynamic";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  // No password configured — the gate is open, so there is nothing to sign into.
  if (!isAdminPasswordSet()) redirect("/admin");
  const { next } = await searchParams;
  return (
    <div className="mx-auto flex min-h-[70vh] w-[min(420px,calc(100%-1.5rem))] items-center py-12">
      <div className="w-full rounded-[24px] bg-surface p-8">
        <Link href="/" className="flex items-center gap-2" aria-label="Normand home">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink font-display text-lg font-bold text-cream">
            N
          </span>
          <span className="font-display text-xl font-extrabold">Normand</span>
        </Link>
        <h1 className="mt-6 font-display text-3xl font-extrabold">Admin sign-in</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Enter the admin password to open the dashboard.
        </p>
        <AdminLoginForm next={next && next.startsWith("/") ? next : "/admin"} />
        <p className="mt-4 text-center text-sm text-ink-soft">
          <Link href="/" className="font-semibold underline">
            ← Back to the storefront
          </Link>
        </p>
      </div>
    </div>
  );
}

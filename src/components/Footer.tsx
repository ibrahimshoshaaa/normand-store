// Normand — black footer.
import Link from "next/link";

export function Footer({ categories }: { categories: { name: string; slug: string }[] }) {
  return (
    <footer className="mt-20 bg-ink text-cream">
      <div className="mx-auto w-[min(1200px,calc(100%-2rem))] py-14">
        <p className="font-display text-3xl font-bold leading-tight md:text-4xl">
          Calm clothing, made to be lived with.
        </p>
        <p className="mt-3 max-w-xl text-cream/70">
          Heavy cotton, washed linen and brushed wool from small workshops in
          Portugal and Denmark. Dispatched in 48 hours.
        </p>
        <div className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-3">
          <div>
            <p className="text-xs uppercase tracking-widest text-cream/50">Shop</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/shop" className="hover:underline">
                  Shop all
                </Link>
              </li>
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link href={`/shop?category=${c.slug}`} className="hover:underline">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-cream/50">Account</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/account" className="hover:underline">
                  Sign in
                </Link>
              </li>
              <li>
                <Link href="/track" className="hover:underline">
                  Track your order
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-cream/50">Normand</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>Calm clothing for slow days.</li>
              <li>© 2026 Normand</li>
              <li className="text-cream/50">Next.js · Tailwind · Prisma · Neon</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

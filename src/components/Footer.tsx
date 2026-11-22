// Normand — footer, like the demo: a photo banner above a dark panel
// with a giant wordmark at the bottom.
import Link from "next/link";

// Bestseller coat studio photo (Cloudinary, stable public URL).
const BANNER_IMAGE =
  "https://res.cloudinary.com/dzbvceezc/image/upload/havn-wool-coat.jpg";

export function Footer({ categories }: { categories: { name: string; slug: string }[] }) {
  return (
    <footer className="mt-20">
      <div className="mx-auto w-[min(1200px,calc(100%-1.5rem))] overflow-hidden rounded-[24px]">
        <img
          src={BANNER_IMAGE}
          alt="The Normand wool coat"
          loading="lazy"
          className="h-48 w-full object-cover md:h-64"
        />
      </div>
      <div className="mx-auto mt-4 w-[min(1200px,calc(100%-1.5rem))] rounded-[24px] bg-ink text-cream">
        <div className="px-6 py-12 sm:px-8 md:p-10">
          <p className="font-display text-3xl font-bold leading-tight md:text-4xl">
            Calm clothing, made to be lived with.
          </p>
          <p className="mt-3 max-w-xl text-cream/70">
            Heavy cotton, washed linen and brushed wool from small workshops in
            Egypt. Dispatched in 48 hours.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-8">
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
          </div>
          <p
            aria-hidden="true"
            className="mt-12 select-none whitespace-nowrap font-display text-[15vw] font-extrabold leading-none tracking-tight text-cream md:text-[9rem]"
          >
            NORMAND
          </p>
          <p className="mt-6 border-t border-cream/15 pt-4 text-sm text-cream/50">
            © 2026 Normand
          </p>
        </div>
      </div>
    </footer>
  );
}

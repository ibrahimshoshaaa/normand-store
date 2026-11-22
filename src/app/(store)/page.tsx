import Link from "next/link";
import { listCategories, listLiveProducts } from "@/lib/store";
import { HeroAddButton } from "@/components/ProductCard";
import { Favourites } from "@/components/Favourites";
import { ProductImage } from "@/components/ProductImage";
import { Marquee } from "@/components/Marquee";
import { Reveal, WordReveal, CountUp } from "@/components/Reveal";
import { NewsletterForm } from "@/components/NewsletterForm";
import { formatMoney } from "@/lib/format";

export const dynamic = "force-dynamic";

const REVIEWS = [
  {
    stars: 5,
    name: "Noura Hassan",
    text: "The coat is the first thing guests notice and the last thing they talk about. It holds its shape beautifully, winter after winter.",
  },
  {
    stars: 5,
    name: "Omar Adel",
    text: "The hoodie made our evenings slower. Heavy, soft, and the sand colour goes with absolutely everything.",
  },
  {
    stars: 5,
    name: "Mona Salem",
    text: "Ordered the dress on a Monday, wore it to dinner on Thursday. The linen softens with every wash.",
  },
];

export default async function HomePage() {
  const [products, categories] = await Promise.all([listLiveProducts(), listCategories()]);
  const coat = products.find((p) => p.slug === "havn-wool-coat") ?? products[0];
  const dress = products.find((p) => p.slug === "linne-linen-dress");

  return (
    <div className="mx-auto w-[min(1200px,calc(100%-1.5rem))] pt-6">
      {/* Hero bento */}
      <section aria-label="Featured" className="grid gap-4 md:grid-cols-3">
        <div className="hero-enter rounded-[24px] bg-surface p-6 md:col-span-2 md:p-10">
          <p className="hero-enter inline-flex items-center gap-2 rounded-full bg-cream px-3.5 py-1.5 text-sm font-medium" style={{ "--hero-delay": "0ms" } as React.CSSProperties}>
            <span className="h-2 w-2 rounded-full bg-[#2563eb]" aria-hidden="true" />
            New season · 8 pieces just landed
          </p>
          <h1 className="mt-4 font-display text-4xl font-extrabold leading-[0.95] sm:text-5xl md:text-7xl">
            <span className="hero-word-mask"><span className="hero-word" style={{ "--hero-delay": "80ms" } as React.CSSProperties}>Calm</span></span>{" "}
            <span className="hero-word-mask"><span className="hero-word" style={{ "--hero-delay": "170ms" } as React.CSSProperties}>clothing</span></span>
            <br />
            <span className="hero-word-mask"><span className="hero-word" style={{ "--hero-delay": "260ms" } as React.CSSProperties}>for</span></span>{" "}
            <span className="hero-word-mask"><span className="hero-word" style={{ "--hero-delay": "350ms" } as React.CSSProperties}>slow</span></span>{" "}
            <span className="hero-word-mask"><span className="hero-word" style={{ "--hero-delay": "440ms" } as React.CSSProperties}>days.</span></span>
          </h1>
          <p className="hero-enter mt-4 max-w-md text-base text-ink-soft md:text-lg" style={{ "--hero-delay": "520ms" } as React.CSSProperties}>
            Clothing that softens a day, not fills it. Heavy cotton, washed linen and
            brushed wool — no noise, no fast fashion.
          </p>
          <div className="hero-enter mt-6 flex flex-wrap gap-2 sm:gap-3" style={{ "--hero-delay": "640ms" } as React.CSSProperties}>
            <Link href="/shop" className="whitespace-nowrap rounded-full bg-ink px-5 py-3 text-sm font-semibold text-cream sm:px-6 sm:py-3.5 sm:text-base">
              Shop the collection
            </Link>
            <Link href="#our-way" className="whitespace-nowrap rounded-full border border-black/20 bg-surface px-5 py-3 text-sm font-semibold sm:px-6 sm:py-3.5 sm:text-base">
              Our story
            </Link>
          </div>
        </div>

        <Reveal delay={120} className="group relative overflow-hidden rounded-[24px]" >
          <div style={{ background: coat.tint }} className="relative h-full min-h-[320px]">
            <ProductImage garment={coat.garment} imageUrl={coat.imageUrl} bg={coat.tint} label={coat.name} eager className="idle-drift h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" />
            <span className="absolute left-4 top-4 rounded-full bg-leaf px-3 py-1 text-xs font-bold text-white">
              Bestseller
            </span>
            {/* Spinning material badge — like the demo: the text runs on a
                circular path and only the ring spins (14s); the leaf in the
                centre stays still. Text = this tile's product materials. */}
            <span className="absolute right-4 top-4 grid h-[84px] w-[84px] shrink-0 place-items-center rounded-full bg-surface/90 backdrop-blur">
              <svg viewBox="0 0 100 100" className="spin-slow absolute inset-0 size-full" aria-hidden="true">
                <defs>
                  <path id="badge-circle" d="M50,50 m-36,0 a36,36 0 1,1 72,0 a36,36 0 1,1 -72,0" />
                </defs>
                <text className="fill-ink font-mono text-[10px] uppercase">
                  <textPath href="#badge-circle" textLength="224" lengthAdjust="spacing">
                    Pure wool · Double-faced ·
                  </textPath>
                </text>
              </svg>
              <svg viewBox="0 0 24 24" className="size-5 text-ink" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
              </svg>
            </span>
            <div className="absolute inset-x-4 bottom-4 flex flex-wrap items-end justify-between gap-2">
              <div>
                <p className="font-display text-xl font-bold leading-tight">{coat.name}</p>
                <p className="text-sm text-ink-soft">{formatMoney(coat.priceCents)}</p>
              </div>
              <div className="flex gap-2">
                <HeroAddButton product={coat} />
                <Link
                  href={`/product/${coat.slug}`}
                  className="rounded-full bg-surface/90 px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-surface"
                >
                  View
                </Link>
              </div>
            </div>
          </div>
        </Reveal>

        {dress && (
          <Reveal delay={200} className="rounded-[24px] bg-sun p-6">
            <p className="font-display text-2xl font-bold">Soft linen.</p>
            <p className="mt-1 text-sm text-ink-soft">
              {dress.name} — washed linen for slow evenings.
            </p>
            <Link href={`/product/${dress.slug}`} className="mt-4 inline-block font-semibold underline">
              {formatMoney(dress.priceCents)} →
            </Link>
          </Reveal>
        )}
        <Reveal delay={260} className="overflow-hidden rounded-[24px] bg-surface p-6 md:col-span-2">
          <p className="font-display text-2xl font-bold">Free over EGP 1,500</p>
          <p className="mt-1 text-sm text-ink-soft">
            Free delivery on orders over EGP 1,500 — no code, no small print. Dispatched in 48 hours.
          </p>
          <div className="relative mt-6 h-9" aria-hidden="true">
            <div className="absolute inset-x-0 top-1/2 border-t-2 border-dashed border-ink/20" />
            <span className="truck-drive absolute top-0 text-ink">
              <svg width="44" height="28" viewBox="0 0 48 28" fill="currentColor" aria-hidden="true">
                <rect x="2" y="5" width="26" height="15" rx="2" />
                <path d="M30 9h8l8 7v4H30z" />
                <circle cx="10" cy="22" r="3.5" />
                <circle cx="22" cy="22" r="3.5" />
                <circle cx="38" cy="22" r="3.5" />
              </svg>
            </span>
          </div>
        </Reveal>
      </section>

      <div className="mt-4">
        <Marquee />
      </div>

      {/* This week's favourites */}
      <section aria-label="This week's favourites" className="mt-16">
        <Reveal className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl font-extrabold md:text-4xl">This week’s favourites</h2>
            <p className="mt-1 text-ink-soft">The pieces our customers keep coming back to.</p>
          </div>
          <Link href="/shop" className="shrink-0 font-semibold text-accent">
            View all →
          </Link>
        </Reveal>
        <Favourites products={products} categories={categories} />
      </section>

      {/* Categories bento */}
      <section aria-label="Categories" className="mt-16">
        <Reveal>
          <h2 className="font-display text-3xl font-extrabold md:text-4xl">Find your calm</h2>
          <p className="mt-1 text-ink-soft">Browse the shop by the thing it holds.</p>
        </Reveal>
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
          {categories.map((c, i) => (
            <Reveal key={c.slug} delay={i * 70} className={i === 0 ? "col-span-2 md:row-span-1" : ""}>
              <Link
                href={`/shop?category=${c.slug}`}
                className="group flex h-full min-h-[140px] flex-col justify-between rounded-[24px] p-5"
                style={{ background: c.tint }}
              >
                <span className="flex justify-end">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-surface text-lg transition-all group-hover:rotate-45 group-hover:bg-ink group-hover:text-cream">
                    →
                  </span>
                </span>
                <span>
                  <span className="font-display text-2xl font-bold">{c.name}</span>
                  <span className="block text-sm text-ink-soft">
                    {c.liveCount} {c.liveCount === 1 ? "piece" : "pieces"} · Shop {c.name} →
                  </span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Our Way */}
      <section id="our-way" aria-label="Our way" className="mt-20">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-widest text-ink-soft">Our way</p>
        </Reveal>
        <WordReveal
          className="mt-4 font-display text-3xl font-bold leading-snug md:text-5xl"
          text="We make clothing slowly, for days that are lived in. Heavy fabrics, honest stitching, and nothing you have to think about — pieces that last longer than the season they were made for."
        />
        <div className="mt-10 grid grid-cols-3 gap-3 text-center sm:gap-4">
          {[
            { value: 12, suffix: "", label: "workshops" },
            { value: 100, suffix: "%", label: "organic cotton" },
            { value: 10, suffix: "", label: "year warranty" },
          ].map((s) => (
            <Reveal key={s.label} className="min-w-0 rounded-[24px] bg-surface p-4 sm:p-6">
              <p className="font-display text-3xl font-extrabold sm:text-4xl md:text-5xl">
                <CountUp value={s.value} suffix={s.suffix} />
              </p>
              <p className="mt-1 text-xs text-ink-soft sm:text-sm">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Our Promise */}
      <section aria-label="Our promise" className="mt-16">
        <Reveal className="rounded-[24px] bg-ink p-6 text-cream sm:p-8 md:p-10">
          <h2 className="font-display text-3xl font-extrabold">Our promise, in writing.</h2>
          <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-4">
            {[
              ["48h", "Ships in 48 hours"],
              ["30 days", "Easy returns"],
              ["COD", "Cash on delivery"],
              ["100%", "Organic materials"],
            ].map(([big, small]) => (
              <div key={small} className="min-w-0">
                <p className="font-display text-xl font-bold sm:text-2xl">{big}</p>
                <p className="mt-1 text-sm text-cream/70">{small}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-sm text-cream/50">Read the fine print at checkout.</p>
        </Reveal>
      </section>

      {/* Reviews */}
      <section aria-label="Reviews" className="mt-16">
        <Reveal>
          <h2 className="font-display text-3xl font-extrabold md:text-4xl">Loved, lived with, and written about.</h2>
        </Reveal>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {REVIEWS.map((r, i) => (
            <Reveal key={r.name} delay={i * 90} className="rounded-[24px] bg-surface p-6">
              <p className="text-amber-600">{"★".repeat(r.stars)}</p>
              <p className="mt-3 leading-relaxed">“{r.text}”</p>
              <p className="mt-4 text-sm font-semibold">{r.name}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section aria-label="Newsletter" className="mt-16">
        <Reveal className="rounded-[24px] bg-surface p-8 md:p-10">
          <h2 className="font-display text-3xl font-extrabold">Slow mail, once a month.</h2>
          <p className="mt-2 max-w-md text-ink-soft">
            One letter a month: new pieces, restocks, and the stories behind them. No noise.
          </p>
          <div className="mt-5">
            <NewsletterForm />
          </div>
        </Reveal>
      </section>
    </div>
  );
}

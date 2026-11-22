import Link from "next/link";
import { listCategories, listLiveProducts } from "@/lib/store";
import { ProductCard } from "@/components/ProductCard";
import { ProductImage } from "@/components/ProductImage";
import { Marquee } from "@/components/Marquee";
import { Reveal, WordReveal, CountUp } from "@/components/Reveal";
import { NewsletterForm } from "@/components/NewsletterForm";
import { formatMoney } from "@/lib/format";

export const dynamic = "force-dynamic";

const REVIEWS = [
  {
    stars: 5,
    name: "Nora Lindqvist",
    text: "The Havn coat is the first thing guests notice and the last thing they talk about. It holds its shape beautifully, winter after winter.",
  },
  {
    stars: 5,
    name: "Marco Jensen",
    text: "The Dune hoodie made our evenings slower. Heavy, soft, and the sand colour goes with absolutely everything.",
  },
  {
    stars: 5,
    name: "Amalie Berg",
    text: "Ordered the Linne dress on a Monday, wore it to dinner on Thursday. The linen softens with every wash.",
  },
];

export default async function HomePage() {
  const [products, categories] = await Promise.all([listLiveProducts(), listCategories()]);
  const favourites = [...products].sort((a, b) => b.rating - a.rating).slice(0, 4);
  const coat = products.find((p) => p.slug === "havn-wool-coat") ?? products[0];
  const dress = products.find((p) => p.slug === "linne-linen-dress");

  return (
    <div className="mx-auto w-[min(1200px,calc(100%-1.5rem))] pt-6">
      {/* Hero bento */}
      <section aria-label="Featured" className="grid gap-4 md:grid-cols-3">
        <Reveal className="rounded-[24px] bg-surface p-8 md:col-span-2 md:p-10">
          <h1 className="font-display text-5xl font-extrabold leading-[0.95] md:text-7xl">
            Calm clothing
            <br />
            for slow days.
          </h1>
          <p className="mt-5 max-w-md text-lg text-ink-soft">
            Clothing that softens a day, not fills it. Heavy cotton, washed linen and
            brushed wool — no noise, no fast fashion.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/shop" className="rounded-full bg-ink px-6 py-3.5 font-semibold text-cream">
              Shop the collection
            </Link>
            <Link href="#our-way" className="rounded-full border border-black/20 bg-surface px-6 py-3.5 font-semibold">
              Our story
            </Link>
          </div>
        </Reveal>

        <Reveal delay={120} className="relative overflow-hidden rounded-[24px]" >
          <div style={{ background: coat.tint }} className="relative h-full min-h-[320px]">
            <ProductImage garment={coat.garment} imageUrl={coat.imageUrl} bg={coat.tint} label={coat.name} eager className="h-full w-full object-cover" />
            <span className="absolute left-4 top-4 rounded-full bg-leaf px-3 py-1 text-xs font-bold text-white">
              Bestseller
            </span>
            <span className="spin-slow absolute right-4 top-4 flex h-20 w-20 items-center justify-center rounded-full bg-surface/90 text-center text-[9px] font-bold uppercase leading-tight tracking-widest">
              Heavy cotton • Washed linen •
            </span>
            <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-2">
              <div>
                <p className="font-display text-xl font-bold leading-tight">{coat.name}</p>
                <p className="text-sm text-ink-soft">{formatMoney(coat.priceCents)}</p>
              </div>
              <Link
                href={`/product/${coat.slug}`}
                className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-cream"
              >
                View
              </Link>
            </div>
          </div>
        </Reveal>

        {dress && (
          <Reveal delay={200} className="rounded-[24px] bg-sun p-6">
            <p className="font-display text-2xl font-bold">Soft light.</p>
            <p className="mt-1 text-sm text-ink-soft">
              {dress.name} — washed linen for slow evenings.
            </p>
            <Link href={`/product/${dress.slug}`} className="mt-4 inline-block font-semibold underline">
              {formatMoney(dress.priceCents)} →
            </Link>
          </Reveal>
        )}
        <Reveal delay={260} className="rounded-[24px] bg-surface p-6 md:col-span-2">
          <p className="font-display text-2xl font-bold">Free over $150</p>
          <p className="mt-1 text-sm text-ink-soft">
            Free delivery on orders over $150 — no code, no small print. Dispatched in 48 hours.
          </p>
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
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {favourites.map((p, i) => (
            <Reveal key={p.slug} delay={i * 90}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
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
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-surface text-lg transition group-hover:rotate-45">
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
        <div className="mt-10 grid grid-cols-3 gap-4 text-center">
          {[
            { value: 12, suffix: "", label: "workshops" },
            { value: 100, suffix: "%", label: "organic cotton" },
            { value: 10, suffix: "", label: "year warranty" },
          ].map((s) => (
            <Reveal key={s.label} className="rounded-[24px] bg-surface p-6">
              <p className="font-display text-4xl font-extrabold md:text-5xl">
                <CountUp value={s.value} suffix={s.suffix} />
              </p>
              <p className="mt-1 text-sm text-ink-soft">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Our Promise */}
      <section aria-label="Our promise" className="mt-16">
        <Reveal className="rounded-[24px] bg-ink p-8 text-cream md:p-10">
          <h2 className="font-display text-3xl font-extrabold">Our promise, in writing.</h2>
          <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-4">
            {[
              ["48h", "Ships in 48 hours"],
              ["30 nights", "Try it at home"],
              ["10 years", "Warranty on seams"],
              ["100%", "Organic materials"],
            ].map(([big, small]) => (
              <div key={small}>
                <p className="font-display text-2xl font-bold">{big}</p>
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

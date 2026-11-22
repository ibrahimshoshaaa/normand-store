# Normand — Calm clothing for slow days

A minimalist clothing store with a full admin dashboard, built as a standalone
Next.js app you can own, deploy, and extend. A clean-room rebuild of the
original bento store template — same calm cream design, same pages and
flows — rebranded as **Normand** and wired to **Neon Postgres** (no Firebase).

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS 4** — warm cream `#f3efe6`, black text/buttons, pastel cards,
  ~24px rounded corners, pill buttons. **Fixed light theme only** — there is
  deliberately no dark-mode media query, so the store always looks the same.
- **Prisma 6** + **Neon Postgres** (Frankfurt `eu-central-1`)
- **Lenis** smooth scrolling + IntersectionObserver scroll reveals, count-up
  KPIs, marquee, rotating badge, sliding bag drawer
- Product visuals are self-contained inline SVG (no external images), so the
  store renders identically offline and on Vercel. Swap `ProductImage` for real
  photos when you have them.

## What's inside

- **Storefront** — bento hero, marquee, "This week's favourites", categories
  bento, Our Way scroll-reveal, Our Promise, reviews, newsletter, black footer
- **Shop** — live search, category filter, sorting
- **Product page** — colour/size swatches (XS–XL), quantity, Add to bag,
  "You may also like"
- **Bag drawer** — slides from the right, free-shipping progress bar (free over $150)
- **Checkout** — "Almost yours." delivery address, Standard (free) / Express (+$25),
  demo card step (no real payment — connect Stripe before selling for real)
- **Thank-you page** with order code (e.g. `NM-2401`) + **order tracking**
  (Preparing → Shipped → Delivered)
- **Account** — demo sign-in by email, lists your orders
- **Admin dashboard** (`/admin`) — Overview KPIs (revenue, orders, AOV, customers),
  30-day revenue/orders chart, sales-by-category donut, live orders, top products,
  plus Orders (status selector), Products (editor: edit fields, live/draft switch,
  low-stock filter, add, two-step delete) and Categories (rename in place)

## Database

Neon project **Normand** (`calm-pond-67213265`), region **AWS Europe Central 1
(Frankfurt)**, database **`normand`** (Postgres 18, production branch). An older empty database on the same branch exists but is unused.

Tables (Prisma): `Category`, `Product`, `Customer`, `Order`, `OrderItem`.

## Run locally

```bash
cp .env.example .env        # put your Neon connection string in DATABASE_URL
npm install
npx prisma migrate deploy   # or: npm run db:push  (creates the tables)
npm run seed                # 5 categories, 8 products, ~497 demo orders (~$163k)
npm run dev                 # http://localhost:3000
```

No database? The store still runs: with no `DATABASE_URL` it uses the static
catalog and generated demo orders in memory (demo mode). Connect Neon to make
orders and admin edits persist.

## Deploy to Vercel

1. Push this folder to a **private GitHub repo** (e.g. `normand-store`).
2. In Vercel: **Add New → Project → Import** the repo.
3. Set the environment variable `DATABASE_URL` to your Neon pooled connection
   string (Neon dashboard → project Normand → Connection string → pooled,
   `...-pooler.eu-central-1.aws.neon.tech/normand?sslmode=require`).
4. Deploy. Vercel runs `npm install`, `prisma generate` (part of `npm run build`)
   and `next build` automatically.
5. After the first deploy, run the seed once against Neon from your machine:
   `DATABASE_URL="..." npm run seed` (or `npx prisma migrate deploy` first if
   you haven't created the tables yet).

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server on http://localhost:3000 |
| `npm run build` | `prisma generate` + production build |
| `npm start` | Serve the production build |
| `npm run seed` | Seed Neon with catalog + ~497 demo orders |
| `npm run db:migrate` | Create a new Prisma migration (dev) |
| `npm run db:deploy` | Apply migrations (production) |
| `npm run db:push` | Push the schema to Neon without a migration |

## Notes / before going live

- **Payments are not included.** Checkout is a demo flow. Connect Stripe (or
  another provider) in `src/app/(store)/checkout/page.tsx` before taking real money.
- **Auth is demo-grade.** Account sign-in is email-only and the admin area is
  open. Add real auth (e.g. NextAuth) and protect `/admin` before launch.
- Demo orders are generated deterministically, so the dashboard shows the same
  ~$163k / 497 orders on every fresh seed.

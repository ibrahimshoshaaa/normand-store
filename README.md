# Normand — Calm clothing for slow days

A minimalist clothing store with a full admin dashboard — built as a standalone
Next.js app you can own, deploy, and extend. Warm cream design, Egyptian
prices (EGP), cash on delivery, and real product photography.

**Live demo:** https://normand-store.vercel.app/ · https://normand.shotechsolutions.net/

<p align="center">
  <img src="https://res.cloudinary.com/dzbvceezc/image/upload/havn-wool-coat.jpg" alt="Havn Wool Coat — Normand hero product" width="420">
</p>

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)
![Prisma](https://img.shields.io/badge/Prisma-6-2d3748)
![Neon Postgres](https://img.shields.io/badge/Neon-Postgres-00e5a0)
![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black)

## What's inside

**Storefront**

- Bento hero with masked word-reveal animation, marquee, "This week's
  favourites", category tiles, Our Way scroll-reveal stats, Our Promise,
  reviews, newsletter signup, and a black footer with a giant wordmark
- Spinning material badge on the hero product — circular text on an SVG path
  with a still leaf icon in the centre (14s rotation, like the original template)
- Lenis smooth scrolling, scroll reveals, count-up numbers, hover zoom, and a
  slow idle drift on product photos
- Fixed light theme only — there is deliberately no dark-mode media query, so
  the store always looks the same

**Shopping**

- Shop with live search, category filter, and sorting
- Product pages — colour and size swatches (XS–XL), quantity stepper,
  fly-to-bag animation, "You may also like"
- Bag drawer — a floating rounded panel that slides in with the demo's expo
  ease; free-delivery progress bar (free over **EGP 1,500**), quantity steppers,
  per-item cards
- Checkout — delivery address, Standard (free) / Express (+EGP 100, free over
  EGP 1,500), and **cash on delivery** as the only payment method
- Thank-you page with order code (e.g. `NM-4293`) and order tracking
  (Preparing → Shipped → Delivered)
- Account — sign in by email to see your orders

**Admin dashboard** (`/admin`, password-gated)

- Overview KPIs (revenue, orders, AOV, customers), 30-day revenue/orders
  chart, sales-by-category donut, live orders, top products
- Orders — status selector with instant "Saved ✓" feedback, per-order detail page
- Products — full editor (fields, live/draft switch, low-stock filter, add,
  two-step delete); Categories — rename in place; Subscribers — newsletter signups

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS 4** — warm cream `#f3efe6`, black text/buttons, pastel cards,
  ~24px rounded corners, pill buttons
- **Prisma 6** + **Neon Postgres** (Frankfurt `eu-central-1`)
- **Lenis** smooth scrolling · **Bricolage Grotesque** display font + **DM Sans** body
- Product photos on **Cloudinary** · Deployed on **Vercel**

## Run locally

```bash
cp .env.example .env        # put your Neon connection string in DATABASE_URL
npm install
npm run db:push             # create the tables in Neon
npm run seed                # 5 categories, 8 products, ~500 demo orders
npm run dev                 # http://localhost:3000
```

No database? The store still runs: with no `DATABASE_URL` it falls back to the
static catalog and generated demo orders in memory (demo mode). Connect Neon to
make orders and admin edits persist.

## Deploy to Vercel

1. Fork or clone this repo.
2. In Vercel: **Add New → Project → Import** the repo.
3. Set the environment variables `DATABASE_URL` (your Neon pooled connection
   string) and `ADMIN_PASSWORD` (a long random value for `/admin`).
4. Deploy. Vercel runs `npm install`, `prisma generate` (part of
   `npm run build`) and `next build` automatically.
5. After the first deploy, run the seed once against Neon from your machine:
   `DATABASE_URL="..." npm run seed`.

## Admin access

`/admin` is protected by a password. Set `ADMIN_PASSWORD` in `.env` locally
(and as a Vercel env var in production), then sign in at `/admin/login` — the
session cookie is httpOnly, HMAC-signed and lasts 7 days. If `ADMIN_PASSWORD`
is not set, the dashboard stays open and shows a warning banner instead.

## Project structure

```
src/
  app/
    (store)/            # storefront: home, shop, product/[slug], checkout,
                        #   thank-you, track, account
    admin/              # admin login + dashboard (orders, products,
                        #   categories, subscribers)
    api/                # orders, products, newsletter, auth
  components/           # Header, BagDrawer, ProductCard, ProductDetail, ...
  lib/                  # Prisma client, catalog, formatting, cart
prisma/
  schema.prisma         # Category, Product, Customer, Order, OrderItem, Subscriber
  seed.ts               # demo catalog + orders
```

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server on http://localhost:3000 |
| `npm run build` | `prisma generate` + production build |
| `npm start` | Serve the production build |
| `npm run seed` | Seed Neon with catalog + ~500 demo orders |
| `npm run db:migrate` | Create a new Prisma migration (dev) |
| `npm run db:deploy` | Apply migrations (production) |
| `npm run db:push` | Push the schema to Neon without a migration |

## Notes

- **Payments:** cash on delivery only — no card processing in this build.
- **Auth is demo-grade.** Account sign-in is email-only. Set a strong
  `ADMIN_PASSWORD` before launch.
- Demo orders are generated deterministically, so the dashboard shows the same
  ~500 orders on every fresh seed.

## Built by

[ShoTech Solutions](https://www.shotechsolutions.net/) — Ibrahim Shosha,
Full Stack Developer (Flutter, Next.js, Node.js, PostgreSQL).

## License

MIT — see [LICENSE](LICENSE).

// Normand — static catalog.
// Single source of truth for the 8 launch products + 5 categories.
// Used by the seed script AND as the demo-mode fallback when no DATABASE_URL
// is configured (so `npm run dev` works out of the box).

export type Colour = { name: string; hex: string };

export type CategorySeed = {
  name: string;
  slug: string;
  tint: string;
  sortOrder: number;
};

export const CATEGORIES: CategorySeed[] = [
  { name: "T-Shirts", slug: "t-shirts", tint: "#f6ead0", sortOrder: 1 },
  { name: "Hoodies & Sweats", slug: "hoodies-sweats", tint: "#dfe8d8", sortOrder: 2 },
  { name: "Jackets", slug: "jackets", tint: "#f3ddd0", sortOrder: 3 },
  { name: "Trousers", slug: "trousers", tint: "#dde6ec", sortOrder: 4 },
  { name: "Dresses", slug: "dresses", tint: "#f2dfe0", sortOrder: 5 },
];

export type ProductSeed = {
  slug: string;
  name: string;
  categorySlug: string;
  priceCents: number;
  compareCents?: number;
  badge?: string;
  rating: number;
  reviews: number;
  colours: Colour[];
  sizes: string[];
  stock: number;
  garment: "tee" | "hoodie" | "coat" | "dress" | "crew" | "jeans" | "trousers";
  imageUrl: string; // Cloudinary delivery URL (no folder prefix — Dynamic folders)
  tint: string;
  blurb: string;
  description: string;
};

export const SIZES = ["XS", "S", "M", "L", "XL"];

export const PRODUCTS: ProductSeed[] = [
  {
    slug: "ro-heavy-tee",
    name: "Ro Heavy Tee",
    categorySlug: "t-shirts",
    priceCents: 4800,
    compareCents: 6400,
    badge: "Bestseller",
    rating: 4.8,
    reviews: 214,
    colours: [
      { name: "White", hex: "#f7f5ef" },
      { name: "Cream", hex: "#ece1cc" },
      { name: "Black", hex: "#211d18" },
    ],
    sizes: SIZES,
    stock: 42,
    garment: "tee",
    imageUrl: "https://res.cloudinary.com/dzbvceezc/image/upload/ro-heavy-tee.jpg",
    tint: "#f6ead0",
    blurb: "Heavyweight organic cotton, structured drape.",
    description:
      "A heavyweight organic cotton tee with a structured drape and a ribbed collar that keeps its shape. Garment-dyed, pre-shrunk, and cut a little boxy so it sits right on its own or under a jacket.",
  },
  {
    slug: "dune-oversized-hoodie",
    name: "Dune Oversized Hoodie",
    categorySlug: "hoodies-sweats",
    priceCents: 9200,
    badge: "This week's favourite",
    rating: 4.9,
    reviews: 186,
    colours: [
      { name: "Sand", hex: "#d9c7a7" },
      { name: "Stone", hex: "#c6beb0" },
      { name: "Black", hex: "#211d18" },
    ],
    sizes: SIZES,
    stock: 36,
    garment: "hoodie",
    imageUrl: "https://res.cloudinary.com/dzbvceezc/image/upload/dune-oversized-hoodie.jpg",
    tint: "#dfe8d8",
    blurb: "Brushed fleece, dropped shoulders, deep hood.",
    description:
      "Our oversized hoodie in brushed back fleece. Dropped shoulders, a deep double-layer hood and a kangaroo pocket big enough for cold hands. The one people come back for.",
  },
  {
    slug: "havn-wool-coat",
    name: "Havn Wool Coat",
    categorySlug: "jackets",
    priceCents: 23200,
    compareCents: 29000,
    badge: "New in",
    rating: 4.9,
    reviews: 128,
    colours: [
      { name: "Camel", hex: "#c8a882" },
      { name: "Grey", hex: "#9a958c" },
    ],
    sizes: SIZES,
    stock: 20,
    garment: "coat",
    imageUrl: "https://res.cloudinary.com/dzbvceezc/image/upload/havn-wool-coat.jpg",
    tint: "#f3ddd0",
    blurb: "Double-faced wool, clean lines, made to last.",
    description:
      "A double-faced wool coat with clean lines and a hidden placket. Cut long enough to keep the wind out and light enough to wear indoors. Ten-year warranty on the seams.",
  },
  {
    slug: "linne-linen-dress",
    name: "Linne Linen Dress",
    categorySlug: "dresses",
    priceCents: 14800,
    badge: "This week's favourite",
    rating: 4.8,
    reviews: 204,
    colours: [
      { name: "Natural", hex: "#e9ddc8" },
      { name: "Sage", hex: "#cfd8c6" },
    ],
    sizes: SIZES,
    stock: 28,
    garment: "dress",
    imageUrl: "https://res.cloudinary.com/dzbvceezc/image/upload/linne-linen-dress.jpg",
    tint: "#f2dfe0",
    blurb: "Washed linen, easy fit, pockets included.",
    description:
      "Washed European linen in an easy, straight fit with side pockets and a tie waist you can wear loose or cinched. Softens with every wash and never goes out of season.",
  },
  {
    slug: "pil-crew",
    name: "Pil Crew Sweatshirt",
    categorySlug: "hoodies-sweats",
    priceCents: 7800,
    rating: 4.7,
    reviews: 96,
    colours: [
      { name: "Cream", hex: "#efe6d4" },
      { name: "Grey", hex: "#b0aca2" },
    ],
    sizes: SIZES,
    stock: 52,
    garment: "crew",
    imageUrl: "https://res.cloudinary.com/dzbvceezc/image/upload/pil-crew-sweatshirt.jpg",
    tint: "#dde6ec",
    blurb: "Loopwheel fleece crew, ribbed trims.",
    description:
      "A classic crew in loopwheel fleece with ribbed cuffs and hem. No logos, no fuss — the sweatshirt equivalent of a deep breath.",
  },
  {
    slug: "fjord-denim",
    name: "Fjord Denim Jeans",
    categorySlug: "trousers",
    priceCents: 11800,
    rating: 4.8,
    reviews: 167,
    colours: [
      { name: "Indigo", hex: "#3a4a63" },
      { name: "Washed", hex: "#7d8aa0" },
    ],
    sizes: SIZES,
    stock: 44,
    garment: "jeans",
    imageUrl: "https://res.cloudinary.com/dzbvceezc/image/upload/fjord-denim-jeans.jpg",
    tint: "#dde6ec",
    blurb: "Straight leg, rigid denim, breaks in beautifully.",
    description:
      "Straight-leg jeans in rigid 14oz denim. They feel firm on day one and mould to you by week two. Made with 98% cotton and 2% stretch for comfort.",
  },
  {
    slug: "tailor-trouser",
    name: "Tailor Trouser",
    categorySlug: "trousers",
    priceCents: 12800,
    rating: 4.6,
    reviews: 89,
    colours: [
      { name: "Charcoal", hex: "#3a3630" },
      { name: "Camel", hex: "#c8a882" },
    ],
    sizes: SIZES,
    stock: 30,
    garment: "trousers",
    imageUrl: "https://res.cloudinary.com/dzbvceezc/image/upload/tailor-trouser.jpg",
    tint: "#f6ead0",
    blurb: "High-rise, tapered leg, pressed crease.",
    description:
      "High-rise tailored trousers with a tapered leg and a pressed crease that survives the wash. Dress them up or wear them with a tee — they don't mind.",
  },
  {
    slug: "vida-jeans",
    name: "Vida Straight Jeans",
    categorySlug: "trousers",
    priceCents: 11000,
    rating: 4.7,
    reviews: 142,
    colours: [
      { name: "Blue", hex: "#4a6582" },
      { name: "Black", hex: "#211d18" },
    ],
    sizes: SIZES,
    stock: 39,
    garment: "jeans",
    imageUrl: "https://res.cloudinary.com/dzbvceezc/image/upload/vida-straight-jeans.jpg",
    tint: "#dfe8d8",
    blurb: "Everyday straight jeans, mid-rise, ankle length.",
    description:
      "The everyday straight jean: mid-rise, ankle length, and a wash that goes with everything you own. The pair you reach for without thinking.",
  },
];

export const FREE_SHIPPING_THRESHOLD_CENTS = 15000;
export const EXPRESS_SHIPPING_CENTS = 2500;

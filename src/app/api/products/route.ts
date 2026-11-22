import { NextResponse } from "next/server";
import { listLiveProducts } from "@/lib/store";

export const dynamic = "force-dynamic";

// Live search results for the header search overlay.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") ?? "").trim().toLowerCase();
  const products = await listLiveProducts();
  const results = q
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.categoryName.toLowerCase().includes(q) ||
          p.blurb.toLowerCase().includes(q),
      )
    : [];
  return NextResponse.json(results.slice(0, 6));
}

"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";

export function Toast() {
  const { toast, openBag } = useCart();
  if (!toast) return null;
  return (
    <div className="toast-in fixed bottom-6 left-1/2 z-[60] flex max-w-[calc(100vw-2rem)] -translate-x-1/2 items-center gap-3 whitespace-nowrap rounded-full bg-ink px-5 py-3 text-sm text-cream shadow-2xl">
      <span>{toast}</span>
      <button type="button" onClick={openBag} className="font-semibold text-accent underline">
        View bag
      </button>
    </div>
  );
}

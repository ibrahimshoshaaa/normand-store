"use client";

// Normand — bag (cart) state, persisted to localStorage, plus the
// fly-to-bag animation: a small copy of the product image flies from the
// clicked add button to the header Bag button, and the bag count only
// updates when the thumbnail lands (~0.8s). Reduced motion (or a
// bag button that is off-screen) skips the flight and commits at once.
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { ProductImage } from "./ProductImage";

export type BagItem = {
  slug: string;
  name: string;
  priceCents: number;
  colour: string;
  size: string;
  quantity: number;
  garment: string;
  imageUrl: string | null;
  tint: string;
};

export type FlyThumb = {
  id: number;
  /** Fixed-position top-left of the thumbnail when it detaches. */
  x: number;
  y: number;
  /** Delta from the thumbnail centre to the bag button centre. */
  dx: number;
  dy: number;
  size: number;
  imageUrl: string | null;
  garment: string;
  tint: string;
  name: string;
};

export type FlyFrom = { x: number; y: number; width: number; height: number };

type CartContextValue = {
  items: BagItem[];
  count: number;
  subtotalCents: number;
  isOpen: boolean;
  openBag: () => void;
  closeBag: () => void;
  addItem: (item: Omit<BagItem, "quantity">, quantity?: number) => void;
  /** Fly the product thumbnail to the bag button, then commit the add
      (and toast, unless silent) only when it lands. */
  flyAdd: (
    item: Omit<BagItem, "quantity">,
    quantity: number,
    from: FlyFrom,
    opts?: { silent?: boolean },
  ) => void;
  setQuantity: (slug: string, colour: string, size: string, quantity: number) => void;
  removeItem: (slug: string, colour: string, size: string) => void;
  clear: () => void;
  toast: string | null;
  /** The header Bag button element — the fly animation's landing target. */
  bagButtonRef: RefObject<HTMLButtonElement | null>;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "normand-bag";
const FLY_MS = 800;

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<BagItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [flies, setFlies] = useState<FlyThumb[]>([]);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flyId = useRef(0);
  const loaded = useRef(false);
  const bagButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw) as BagItem[]);
    } catch {
      // ignore corrupt storage
    }
    loaded.current = true;
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  const showToast = useCallback((message: string) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3500);
  }, []);

  const commitItem = useCallback((item: Omit<BagItem, "quantity">, quantity: number) => {
    setItems((prev) => {
      const i = prev.findIndex(
        (x) => x.slug === item.slug && x.colour === item.colour && x.size === item.size,
      );
      if (i >= 0) {
        const next = [...prev];
        next[i] = { ...next[i], quantity: next[i].quantity + quantity };
        return next;
      }
      return [...prev, { ...item, quantity }];
    });
  }, []);

  const addItem = useCallback(
    (item: Omit<BagItem, "quantity">, quantity = 1) => {
      commitItem(item, quantity);
      showToast(`✓ ${item.name} added to your bag`);
    },
    [commitItem, showToast],
  );

  const flyAdd = useCallback(
    (
      item: Omit<BagItem, "quantity">,
      quantity: number,
      from: FlyFrom,
      opts?: { silent?: boolean },
    ) => {
      const commit = () => {
        commitItem(item, quantity);
        if (!opts?.silent) showToast(`✓ ${item.name} added to your bag`);
      };
      const reduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const target = bagButtonRef.current?.getBoundingClientRect();
      const targetVisible =
        target &&
        target.width > 0 &&
        target.top > -80 &&
        target.top < window.innerHeight + 80 &&
        target.left > -80 &&
        target.left < window.innerWidth + 80;
      if (reduced || !targetVisible || !target) {
        commit();
        return;
      }
      const fromCx = from.x + from.width / 2;
      const fromCy = from.y + from.height / 2;
      const targetCx = target.left + target.width / 2;
      const targetCy = target.top + target.height / 2;
      const size = Math.min(96, Math.max(56, from.width));
      const id = ++flyId.current;
      setFlies((prev) => [
        ...prev,
        {
          id,
          x: fromCx - size / 2,
          y: fromCy - size / 2,
          dx: targetCx - fromCx,
          dy: targetCy - fromCy,
          size,
          imageUrl: item.imageUrl,
          garment: item.garment,
          tint: item.tint,
          name: item.name,
        },
      ]);
      window.setTimeout(() => {
        setFlies((prev) => prev.filter((f) => f.id !== id));
        commit();
      }, FLY_MS);
    },
    [commitItem, showToast],
  );

  const setQuantity = useCallback(
    (slug: string, colour: string, size: string, quantity: number) => {
      setItems((prev) =>
        quantity <= 0
          ? prev.filter((x) => !(x.slug === slug && x.colour === colour && x.size === size))
          : prev.map((x) =>
              x.slug === slug && x.colour === colour && x.size === size
                ? { ...x, quantity }
                : x,
            ),
      );
    },
    [],
  );

  const removeItem = useCallback((slug: string, colour: string, size: string) => {
    setItems((prev) =>
      prev.filter((x) => !(x.slug === slug && x.colour === colour && x.size === size)),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);
  const openBag = useCallback(() => setIsOpen(true), []);
  const closeBag = useCallback(() => setIsOpen(false), []);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((s, i) => s + i.quantity, 0);
    const subtotalCents = items.reduce((s, i) => s + i.priceCents * i.quantity, 0);
    return {
      items,
      count,
      subtotalCents,
      isOpen,
      openBag,
      closeBag,
      addItem,
      flyAdd,
      setQuantity,
      removeItem,
      clear,
      toast,
      bagButtonRef,
    };
  }, [items, isOpen, openBag, closeBag, addItem, flyAdd, setQuantity, removeItem, clear, toast]);

  return (
    <CartContext.Provider value={value}>
      {children}
      {/* Flying thumbnails: fixed at the click point, animated to the bag
          button by CSS custom properties (--fly-x/--fly-y). */}
      {flies.map((f) => (
        <div
          key={f.id}
          aria-hidden="true"
          className="fly-thumb pointer-events-none fixed z-[70] overflow-hidden rounded-2xl shadow-lg"
          style={
            {
              left: f.x,
              top: f.y,
              width: f.size,
              height: f.size,
              "--fly-x": `${f.dx}px`,
              "--fly-y": `${f.dy}px`,
            } as React.CSSProperties
          }
        >
          <ProductImage
            garment={f.garment}
            imageUrl={f.imageUrl}
            bg={f.tint}
            label={f.name}
            className="h-full w-full"
          />
        </div>
      ))}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}

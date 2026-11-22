"use client";

// Normand — bag (cart) state, persisted to localStorage.
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type BagItem = {
  slug: string;
  name: string;
  priceCents: number;
  colour: string;
  size: string;
  quantity: number;
  garment: string;
  tint: string;
};

type CartContextValue = {
  items: BagItem[];
  count: number;
  subtotalCents: number;
  isOpen: boolean;
  openBag: () => void;
  closeBag: () => void;
  addItem: (item: Omit<BagItem, "quantity">, quantity?: number) => void;
  setQuantity: (slug: string, colour: string, size: string, quantity: number) => void;
  removeItem: (slug: string, colour: string, size: string) => void;
  clear: () => void;
  toast: string | null;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "normand-bag";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<BagItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loaded = useRef(false);

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
    toastTimer.current = setTimeout(() => setToast(null), 3200);
  }, []);

  const addItem = useCallback(
    (item: Omit<BagItem, "quantity">, quantity = 1) => {
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
      showToast(`${item.name} added to your bag`);
    },
    [showToast],
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
      setQuantity,
      removeItem,
      clear,
      toast,
    };
  }, [items, isOpen, openBag, closeBag, addItem, setQuantity, removeItem, clear, toast]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}

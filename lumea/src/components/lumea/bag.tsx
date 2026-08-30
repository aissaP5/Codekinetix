"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

export interface BagItem {
  id: string;
  name: string;
  kind: string;
  price: number;
  image: string;
  qty: number;
}

interface BagContextValue {
  items: BagItem[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  addItem: (item: Omit<BagItem, "qty">, qty?: number) => void;
  removeItem: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  openBag: () => void;
  closeBag: () => void;
}

const BagContext = createContext<BagContextValue | null>(null);

export function useBag() {
  const ctx = useContext(BagContext);
  if (!ctx) throw new Error("useBag must be used within BagProvider");
  return ctx;
}

export function BagProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<BagItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = useCallback((item: Omit<BagItem, "qty">, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, qty: i.qty + qty } : i
        );
      }
      return [...prev, { ...item, qty }];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((i) => i.id !== id)
        : prev.map((i) => (i.id === id ? { ...i, qty } : i))
    );
  }, []);

  const openBag = useCallback(() => setIsOpen(true), []);
  const closeBag = useCallback(() => setIsOpen(false), []);

  const { count, subtotal } = useMemo(
    () => ({
      count: items.reduce((acc, i) => acc + i.qty, 0),
      subtotal: items.reduce((acc, i) => acc + i.qty * i.price, 0),
    }),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      count,
      subtotal,
      isOpen,
      addItem,
      removeItem,
      setQty,
      openBag,
      closeBag,
    }),
    [items, count, subtotal, isOpen, addItem, removeItem, setQty, openBag, closeBag]
  );

  return <BagContext.Provider value={value}>{children}</BagContext.Provider>;
}

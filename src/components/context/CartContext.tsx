"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { useAuth } from "@/components/auth/AuthContext";
import { Cart, CartService } from "../lib/CartService";

type Ctx = {
  cart: Cart | null;
  count: number;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  addItem: (productId: string, qty?: number) => Promise<void>;
};

const CartContext = createContext<Ctx | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!user) { setCart(null); return; }
    setLoading(true);
    setError(null);
    try {
      const c = await CartService.getMine();
      setCart(c);
    } catch (e: any) {
      setError(e?.message || "Error loading cart");
    } finally {
      setLoading(false);
    }
  }, [user]);

  const addItem = useCallback(async (productId: string, qty = 1) => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const c = await CartService.addItem(productId, qty);
      setCart(c);
    } catch (e: any) {
      await refresh();
      setError(e?.message || "Error adding to cart");
    } finally {
      setLoading(false);
    }
  }, [user, refresh]);

  useEffect(() => { refresh(); }, [refresh]);

  const count = useMemo(() => {
    const items = cart?.items ?? [];
    return items.reduce((s, it) => s + (Number(it.quantity) || 0), 0);
  }, [cart]);

  const value = useMemo(() => ({ cart, count, loading, error, refresh, addItem }), [cart, count, loading, error, refresh, addItem]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

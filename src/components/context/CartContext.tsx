"use client";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import { usePathname } from "next/navigation";
import { CartService, type Cart } from "@/components/lib/CartService";
import { useAuth } from "@/components/auth/AuthContext";

type Ctx = {
  cart: Cart | null;
  refresh: () => Promise<void>;
  addItem: (productId: string, qty?: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
};

const CartContext = createContext<Ctx | null>(null);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

const getToken = () =>
  localStorage.getItem("jwt_token") ||
  sessionStorage.getItem("jwt_token") ||
  localStorage.getItem("tte_token") ||
  "";

const isShopper = (r?: string) => (r ?? "").toLowerCase() === "shopper";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const pathname = usePathname();
  const { user } = useAuth();

  const refresh = useCallback(async () => {
    try {
      const data = await CartService.getActive();
      setCart(data);
    } catch {
      setCart(null);
    }
  }, []);

  const addItem = useCallback(
    async (productId: string, qty = 1) => {
      try {
        const data = await CartService.addItem(productId, qty);
        setCart(data ?? null);
      } catch {
        await refresh();
      }
    },
    [refresh]
  );

  const removeItem = useCallback(
    async (productId: string) => {
      try {
        const data = await CartService.removeItem(productId);
        setCart(data ?? null);
      } catch {
        await refresh();
      }
    },
    [refresh]
  );

  useEffect(() => {
    const onLogin = pathname?.startsWith("/login");
    const hasToken = !!getToken();
    const shopper = isShopper(user?.role);
    if (onLogin || !hasToken || !shopper) {
      setCart(null);
      return;
    }
    refresh();
  }, [pathname, user?.role, refresh]);

  const value = useMemo(
    () => ({ cart, refresh, addItem, removeItem }),
    [cart, refresh, addItem, removeItem]
  );
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

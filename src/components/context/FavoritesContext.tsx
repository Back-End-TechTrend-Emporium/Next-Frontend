"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type FavoriteID = string | number;

type Ctx = {
  items: FavoriteID[];
  isFavorite: (id: FavoriteID) => boolean;
  toggle: (id: FavoriteID) => void;
  clear: () => void;
};

const FavoritesContext = createContext<Ctx | null>(null);

const LS_KEY = "tte_favorites_v1";

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<FavoriteID[]>([]);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      setItems(raw ? (JSON.parse(raw) as FavoriteID[]) : []);
    } catch {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(items));
    } catch {}
  }, [items]);
  const toggle = useCallback((id: FavoriteID) => {
    setItems(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
  }, []);
  const isFavorite = useCallback((id: FavoriteID) => items.includes(id), [items]);
  const clear = useCallback(() => setItems([]), []);
  const value = useMemo(() => ({ items, isFavorite, toggle, clear }), [items, isFavorite, toggle, clear]);
  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used inside <FavoritesProvider>");
  return ctx;
}

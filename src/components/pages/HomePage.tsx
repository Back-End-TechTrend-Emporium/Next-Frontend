// src/pages/HomePage.tsx
"use client";
import { useEffect, useMemo, useState } from "react";
import LandingPage from "../templates/LandingPage";
import { ProductService } from "../lib/ProductService";
import { Product } from "../molecules/ProductGrid";
import { Category } from "../molecules/CategoryGrid";

const isDev = process.env.MODE === "development";

const DEV_FALLBACK: Product[] = [
  {
    id: 101 as any,
    name: "Jae Namaz",
    imageUrl: "https://picsum.photos/seed/101/800/600",
    price: 99,
  },
  {
    id: 102 as any,
    name: "Dates",
    imageUrl: "https://picsum.photos/seed/102/800/600",
    price: 12,
  },
  {
    id: 103 as any,
    name: "Miswak",
    imageUrl: "https://picsum.photos/seed/103/800/600",
    price: 7,
  },
  {
    id: 104 as any,
    name: "Prayer Rug",
    imageUrl: "https://picsum.photos/seed/104/800/600",
    price: 59,
  },
];

type RawProduct = {
  id: string | number;
  title: string;
  image?: string;
  price: number;
  category?: string;
  rating?: { rate?: number };
};

function toUI(arr: RawProduct[]): Product[] {
  return (arr ?? []).map((p) => ({
    id: p.id as any,
    name: p.title,
    imageUrl: p.image || `https://picsum.photos/seed/${p.id}/800/600`,
    price: p.price,
  }));
}

export default function HomePage() {
  const [approved, setApproved] = useState<RawProduct[]>([]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await ProductService.getApprovedProducts();
        if (active) setApproved(data ?? []);
      } catch {
        if (active) setApproved([]);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const allProductsUI = useMemo(() => toUI(approved), [approved]);

  const latest = useMemo(() => {
    const list = allProductsUI.slice(0, 6);
    return list.length ? list : isDev ? DEV_FALLBACK : [];
  }, [allProductsUI]);

  const bestSellers = useMemo(() => {
    const sorted = [...approved].sort(
      (a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0)
    );
    const top = toUI(sorted.slice(0, 4));
    return top.length ? top : isDev ? DEV_FALLBACK : [];
  }, [approved]);

  const bannerSource = useMemo(() => "/api/hero-carousel", []);

  const categories = useMemo<Category[]>(() => {
    if (!approved.length) return [];
    const map = new Map<string, { name: string; image: string }>();
    for (const p of approved) {
      const key = p.category || "";
      if (!key) continue;
      if (!map.has(key))
        map.set(key, {
          name: key,
          image: p.image || `https://picsum.photos/seed/${key}/400/300`,
        });
    }
    return Array.from(map.entries()).map(([id, data]) => ({
      id,
      name: data.name,
      imageUrl: data.image,
    }));
  }, [approved]);

  const landingProps = useMemo(
    () => ({ bannerSource, categories, latest, bestSellers }),
    [bannerSource, categories, latest, bestSellers]
  );

  return <LandingPage {...landingProps} />;
}

// src/pages/HomePage.tsx
"use client";
import { useEffect, useState } from "react";
import LandingPage from "../templates/LandingPage";
import { CategoryService } from "../lib/CategoryService";
import { ProductService } from "../lib/ProductService";
import { Product } from "../molecules/ProductGrid";
import { Category } from "../molecules/CategoryGrid";

const isDev = process.env.MODE === "development";

const DEV_FALLBACK: Product[] = [
  { id: 101 as any, name: "Jae Namaz",  imageUrl: "https://picsum.photos/seed/101/800/600", price: 99 },
  { id: 102 as any, name: "Dates",      imageUrl: "https://picsum.photos/seed/102/800/600", price: 12 },
  { id: 103 as any, name: "Miswak",     imageUrl: "https://picsum.photos/seed/103/800/600", price: 7 },
  { id: 104 as any, name: "Prayer Rug", imageUrl: "https://picsum.photos/seed/104/800/600", price: 59 },
];

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [latest, setLatest] = useState<Product[]>([]);
  const [best, setBest] = useState<Product[]>([]);
  const [banner, setBanner] = useState<string>("https://picsum.photos/id/1069/1600/500");

  useEffect(() => {
    (async () => {
      try {
        const apiCategories = await CategoryService.getCategories();
        const list = Array.isArray(apiCategories) ? apiCategories : [];
        const mapped = list.map((cat: any) => ({
          id: cat.id,
          name: cat.name,
          imageUrl: `https://picsum.photos/400/300?${cat.slug || cat.name.toLowerCase().replace(/\s+/g, "-")}`,
        }));
        setCategories(mapped);
      } catch {
        setCategories([]);
      }
    })();

    (async () => {
      try {
        const [latestRaw, bestRaw] = await Promise.all([
          ProductService.getLatestProducts(),
          ProductService.getBestProducts(),
        ]);

        const toUI = (arr: any[]): Product[] =>
          (arr ?? []).map((p: any) => ({
            id: p.id as any,
            name: p.title,
            imageUrl: p.image || `https://picsum.photos/seed/${p.id}/800/600`,
            price: p.price,
          }));

        const latestMapped = toUI(latestRaw);
        const bestMapped = toUI(bestRaw);

        setLatest(latestMapped.length ? latestMapped : (isDev ? DEV_FALLBACK : []));
        setBest(bestMapped.length ? bestMapped : (isDev ? DEV_FALLBACK : []));
        setBanner(bestMapped[0]?.imageUrl || latestMapped[0]?.imageUrl || "https://picsum.photos/id/1069/1600/500");

        const deriveFrom = [...(bestRaw || []), ...(latestRaw || [])];
        if (deriveFrom.length) {
          setCategories(prev => {
            if (prev.length) return prev;
            const names = Array.from(new Set(deriveFrom.map((p: any) => p.category).filter(Boolean)));
            const derived: Category[] = names.map((name: string) => {
              const first = deriveFrom.find((p: any) => p.category === name);
              return { id: name, name, imageUrl: first?.image || `https://picsum.photos/seed/${name}/400/300` };
            });
            return derived;
          });
        }
      } catch {
        setLatest(isDev ? DEV_FALLBACK : []);
        setBest(isDev ? DEV_FALLBACK : []);
        setBanner("https://picsum.photos/id/1069/1600/500");
      }
    })();
  }, []);

  return (
    <LandingPage
      bannerSource={banner}
      categories={categories}
      latest={latest}
      bestSellers={best}
    />
  );
}

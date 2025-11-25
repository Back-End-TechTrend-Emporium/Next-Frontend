// src/app/products/page.tsx
"use client";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProductsFilter, {
  ProductFiltersUI,
} from "@/components/products/ProductsFilter";
import {
  ProductService,
  type SearchParams,
  toGridProduct,
} from "@/components/lib/ProductService";
import ProductGrid, {
  Product as GridProduct,
} from "@/components/molecules/ProductGrid";

type PageData = { items: GridProduct[]; total: number };

export default function ProductsPage() {
  const sp = useSearchParams();
  const initialQ = sp.get("q") ?? "";

  const [filters, setFilters] = useState<ProductFiltersUI>({ q: initialQ });
  const [data, setData] = useState<PageData>({ items: [], total: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = sp.get("q") ?? "";
    setFilters((prev) => ({ ...prev, q }));
  }, [sp]);

  const params = useMemo<SearchParams>(() => {
    const min = filters.min ? Number(filters.min) : undefined;
    const max = filters.max ? Number(filters.max) : undefined;
    return {
      q: filters.q,
      category: filters.category,
      min,
      max,
      sort: filters.sort,
      page: 1,
      pageSize: 24,
    };
  }, [filters]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    ProductService.search(params)
      .then((res) => {
        if (!active) return;
        const items = (res.items ?? []).map(toGridProduct);
        setData({ items: items as any, total: res.totalItems ?? items.length });
      })
      .catch((e: any) => {
        if (!active) return;
        setError(e?.message || "Error");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [params]);

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <ProductsFilter initial={{ q: initialQ }} onChange={setFilters} />
      {loading && <div className="mt-6">Cargando...</div>}
      {error && <div className="mt-6 text-red-600">{error}</div>}
      {!loading && !error && (
        <div className="mt-6">
          <ProductGrid products={data.items as any} />
        </div>
      )}
    </main>
  );
}

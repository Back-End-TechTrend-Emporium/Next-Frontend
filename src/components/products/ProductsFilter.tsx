"use client";
import { useState, useEffect } from "react";
import { useDebouncedValue } from "../hooks/useDebouncedValue";

export type ProductFiltersUI = {
  q: string;
  category?: string;
  min?: string;
  max?: string;
  sort?: "" | "price_asc" | "price_desc" | "latest" | "bestsellers";
};

export default function ProductsFilter({
  initial,
  onChange,
}: {
  initial?: Partial<ProductFiltersUI>;
  onChange: (f: ProductFiltersUI) => void;
}) {
  const [q, setQ] = useState(initial?.q ?? "");
  const [category, setCategory] = useState(initial?.category ?? "");
  const [min, setMin] = useState(initial?.min ?? "");
  const [max, setMax] = useState(initial?.max ?? "");
  const [sort, setSort] = useState<ProductFiltersUI["sort"]>(
    initial?.sort ?? ""
  );

  const dq = useDebouncedValue(q, 400);
  const dcat = useDebouncedValue(category, 400);
  const dmin = useDebouncedValue(min, 400);
  const dmax = useDebouncedValue(max, 400);
  const dsort = useDebouncedValue(sort, 400);

  useEffect(() => {
    onChange({
      q: dq,
      category: dcat || undefined,
      min: dmin || undefined,
      max: dmax || undefined,
      sort: dsort,
    });
  }, [dq, dcat, dmin, dmax, dsort, onChange]);

  const handleSearch = () => {
    onChange({
      q,
      category: category || undefined,
      min: min || undefined,
      max: max || undefined,
      sort,
    });
  };

  return (
    <form
      className="grid grid-cols-1 sm:grid-cols-6 gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        handleSearch();
      }}
    >
      <input
        className="border rounded-lg px-3 py-2 sm:col-span-2"
        placeholder="Buscar"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <input
        className="border rounded-lg px-3 py-2"
        placeholder="Categoría"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
      <input
        className="border rounded-lg px-3 py-2"
        placeholder="Mín"
        inputMode="numeric"
        value={min}
        onChange={(e) => setMin(e.target.value)}
      />
      <input
        className="border rounded-lg px-3 py-2"
        placeholder="Máx"
        inputMode="numeric"
        value={max}
        onChange={(e) => setMax(e.target.value)}
      />
      <select
        className="border rounded-lg px-3 py-2"
        value={sort}
        onChange={(e) => setSort(e.target.value as any)}
      >
        <option value="">Ordenar</option>
        <option value="price_asc">Precio ↑</option>
        <option value="price_desc">Precio ↓</option>
        <option value="latest">Novedades</option>
        <option value="bestsellers">Más vendidos</option>
      </select>
      <button type="submit" className="rounded-lg border px-4 py-2">
        Search
      </button>
    </form>
  );
}

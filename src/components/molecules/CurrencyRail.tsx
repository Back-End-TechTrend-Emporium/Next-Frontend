"use client";
import Link from "next/link";

export default function CurrencyRail({
  currency = "USD",
  onSelect,
}: {
  currency?: string;
  onSelect?: () => void;
}) {
  return (
    <div className="w-full bg-black text-white text-xs">
      <div className="mx-auto max-w-7xl px-4 py-1 flex items-center justify-between">
        <button onClick={onSelect} className="px-2 py-0.5 rounded border border-white/10">
          {currency}
        </button>
        <div className="flex items-center gap-6 text-white/80">
          <Link href="#" className="hover:text-white">Shipping</Link>
          <Link href="#" className="hover:text-white">Support</Link>
          <Link href="#" className="hover:text-white">Stores</Link>
        </div>
      </div>
    </div>
  );
}

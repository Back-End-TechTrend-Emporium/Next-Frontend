"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HeaderSearch() {
  const [q, setQ] = useState("");
  const router = useRouter();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        router.push(`/products${q ? `?q=${encodeURIComponent(q)}` : ""}`);
      }}
      className="flex gap-2 w-full"
    >
      <input
        className="flex-1 border rounded-lg px-3 py-2"
        placeholder="Search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <button type="submit" className="rounded-lg border px-4 py-2">
        Search
      </button>
    </form>
  );
}

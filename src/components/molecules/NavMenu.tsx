"use client";
import Link from "next/link";

export type NavItem = { key: string; label: string; href: string };

export default function NavMenu({ items }: { items: NavItem[] }) {
  return (
    <nav className="hidden md:flex items-center gap-6">
      {items.map(i => (
        <Link key={i.key} href={i.href} className="text-sm hover:underline">
          {i.label}
        </Link>
      ))}
    </nav>
  );
}

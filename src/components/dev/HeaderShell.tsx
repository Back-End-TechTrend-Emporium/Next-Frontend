"use client";
import Header from "@/components/organisms/Header";
import { useAuth } from "@/components/auth/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import type { UserLike } from "@/components/molecules/UserDropdown";

export default function HeaderShell() {
  const { user: authUser } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const showHeader = pathname !== "/login" && pathname !== "/forgot-password";

  const user: UserLike | null = authUser
    ? {
        id: authUser.id,
        name: authUser.name,
        avatarUrl: authUser.avatarUrl,
        role: (() => {
          const r = String(authUser.role || "").toLowerCase();
          if (r.includes("admin")) return "admin";
          if (r.includes("employee")) return "employee";
          return "shopper";
        })(),
      }
    : null;

  if (!showHeader) return null;

  return (
    <Header
      currency="USD"
      user={user}
      cartCount={3}
      onSearch={(q: string) =>
        router.push(`/products${q ? `?q=${encodeURIComponent(q)}` : ""}`)
      }
      onGoToCart={() => router.push("/my-orders")}
      onGoToWishlist={() => router.push("/favorites")}
      onSelectCurrency={() => {}}
      onLogoClick={() => router.push("/")}
    />
  );
}

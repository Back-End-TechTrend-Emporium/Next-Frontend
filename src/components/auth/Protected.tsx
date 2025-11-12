"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/components/auth/AuthContext";
import { getRedirectForRole } from "@/components/auth/AuthContext";

type Props = { allowed: string[]; children: React.ReactNode };

export default function Protected({ allowed, children }: Props) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const allowedSet = new Set(allowed.map((r) => r.toLowerCase()));

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace(`/login?from=${encodeURIComponent(pathname)}`);
      return;
    }
    const role = (user.role ?? "").toString().toLowerCase();
    if (!allowedSet.has(role)) {
      router.replace(getRedirectForRole(role));
    }
  }, [user, isLoading, router, pathname]);

  if (!user) return null;
  const role = (user.role ?? "").toString().toLowerCase();
  if (!allowedSet.has(role)) return null;
  return <>{children}</>;
}

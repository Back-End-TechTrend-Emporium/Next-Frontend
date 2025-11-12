"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthContext";
import type { UserLike } from "@/components/molecules/UserDropdown";

type Role = UserLike["role"];

export default function Guard({
  allowedRoles,
  whenLoggedOutRedirectTo = "/login",
  whenLoggedInRedirectTo = "/",
  children,
}: {
  allowedRoles: Role[];
  whenLoggedOutRedirectTo?: string;
  whenLoggedInRedirectTo?: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user: authUser } = useAuth();

  const mappedRole: Role | null = authUser
    ? (() => {
        const raw = (authUser.role ?? "").toString().toLowerCase();
        if (raw.includes("employee")) return "employee";
        if (raw.includes("superadmin") || raw.includes("admin")) return "admin";
        return "shopper";
      })()
    : null;

  useEffect(() => {
    if (!authUser) {
      router.replace(whenLoggedOutRedirectTo);
      return;
    }
    if (!allowedRoles.includes(mappedRole as Role)) {
      router.replace(whenLoggedInRedirectTo);
    }
  }, [authUser, mappedRole, allowedRoles, router, whenLoggedInRedirectTo, whenLoggedOutRedirectTo]);

  if (!authUser) return null;
  if (!allowedRoles.includes(mappedRole as Role)) return null;

  return <>{children}</>;
}

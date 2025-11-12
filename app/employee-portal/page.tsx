"use client";

import { Button } from "@/components/atoms";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/components/auth/AuthContext";

export default function EmployeePortal() {
  const navigate = useRouter();
  const pathname = usePathname();
  const { user, isLoading } = useAuth();

  const allowed = new Set(["superadmin", "admin", "employee"]);
  const role = (user?.role ?? "").toString().toLowerCase();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      navigate.replace(`/login?from=${encodeURIComponent(pathname)}`);
      return;
    }
    if (!allowed.has(role)) {
      navigate.replace("/");
    }
  }, [user, isLoading, role, navigate, pathname]);

  if (isLoading) return null;
  if (!user) return null;
  if (!allowed.has(role)) return null;

  const cards = [
    { label: "Create Product", to: "/create-product" },
    { label: "Create Category", to: "/create-category" },
    { label: "List Products", to: "/list-products" },
    { label: "List Categories", to: "/list-categories" },
    { label: "Review Jobs", to: "/review-jobs" },
    { label: "Create Employee", to: "/create-employee" },
    { label: "View All Users", to: "/list-users" },
  ];

  return (
    <div className="bg-gray-100 min-h-screen p-6 sm:p-8">
      <h1 className="text-3xl md:text-5xl font-bold text-center mb-10 md:mb-12">
        Employee Portal
      </h1>

      <div className="mx-auto max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {cards.map((c) => (
          <Button
            key={c.label}
            onClick={() => navigate.push(c.to)}
            aria-label={c.label}
            className="
              w-full h-14 rounded-xl
              !bg-black !text-white
              hover:!bg-orange-500
              focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2
              transition-colors duration-200 ease-out
              shadow-sm hover:shadow
            "
          >
            {c.label}
          </Button>
        ))}
      </div>
    </div>
  );
}

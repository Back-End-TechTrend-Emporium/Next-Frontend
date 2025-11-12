import type { ReactNode } from "react";
// import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useRouter } from "next/navigation";

export default function RequireRole({ children, roles }: { children: ReactNode; roles: string[] }) {
  const router = useRouter();
  const { user } = useAuth();
  const has = user && roles.includes(user.role ?? "");
  // if (!has) return <Navigate to="/" replace />;
  if (!has) return router.push("/");
  return <>{children}</>;
}

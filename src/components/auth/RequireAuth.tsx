import type { ReactNode } from "react";
// import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useRouter } from "next/navigation";
// import { Button } from "../atoms";

export default function RequireAuth({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  // const location = useLocation();
  const router = useRouter();


  if (!user) {
    // redirect to login and keep current location for redirect after login
    // return <Navigate to="/login" state={{ from: location }} replace />
    return router.push("/login")
  }

  return <>{children}</>;
}

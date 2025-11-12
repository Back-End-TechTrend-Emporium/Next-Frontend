"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => new QueryClient({
    defaultOptions: {
      queries: { retry: false, refetchOnWindowFocus: false },
      mutations: {
        onError: (err: any) => {
          try {
            if (err?.status === 401) {
              localStorage.removeItem("jwt_token");
              localStorage.removeItem("user");
              window.location.reload();
            }
          } catch {}
        }
      }
    }
  }));
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

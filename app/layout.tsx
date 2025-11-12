// src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/dev/Providers";
import HeaderShell from "@/components/dev/HeaderShell";
import { FavoritesProvider } from "@/components/context/FavoritesContext";
import { CartProvider } from "@/components/context/CartContext";
import { AuthProvider } from "@/components/auth/AuthContext";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TechTrend Emporium",
  description: "Storefront",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <AuthProvider>
            <FavoritesProvider>
              <CartProvider>
                <HeaderShell />
                {children}
              </CartProvider>
            </FavoritesProvider>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}

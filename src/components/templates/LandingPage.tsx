"use client";
import { memo } from "react";
import Carousel from "../molecules/Carousel";
import CategoryGrid, { type Category } from "../molecules/CategoryGrid";
import ProductGrid, { type Product } from "../molecules/ProductGrid";
import Footer from "../organisms/Footer";

export type LandingPageProps = {
  bannerSource: string;
  categories: Category[];
  latest: Product[];
  bestSellers: Product[];
};

function LandingPageComponent({
  bannerSource,
  categories,
  latest,
  bestSellers,
}: LandingPageProps) {
  const showCategories = categories.length > 0;
  const showLatest = latest.length > 0;
  const showBestSellers = bestSellers.length > 0;

  return (
    <main className="flex flex-col gap-12 pb-20">
      <section className="bg-neutral-100">
        <div className="mx-auto w-full max-w-6xl px-4 py-6">
          <Carousel source={bannerSource} />
        </div>
      </section>

      {showCategories && <CategoryGrid categories={categories} />}

      {showLatest && (
        <ProductGrid title="Latest arrivals" products={latest} />
      )}

      {showBestSellers && (
        <ProductGrid title="Best sellers" products={bestSellers} />
      )}

      <Footer />
    </main>
  );
}

export default memo(LandingPageComponent);

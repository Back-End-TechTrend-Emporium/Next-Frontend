import { memo } from "react";
import { useRouter } from "next/navigation";
import { useFavoriteStatus } from "../context/FavoritesContext";


export type Product = {
  id: string | number;
  name: string;
  imageUrl?: string;
  price: number;
};

type ProductGridProps = {
  title?: string;
  products: Product[];
  withFavorites?: boolean;
};

const ProductGridItem = memo(
  ({ product, withFavorites }: { product: Product; withFavorites: boolean }) => {
    const navigate = useRouter();
    const { isFavorite, toggle } = useFavoriteStatus(product.id);

    const fallback = `https://picsum.photos/seed/${product.id}/800/600`;
    const img = product.imageUrl || fallback;

    return (
      <div className="relative rounded-xl border bg-white p-3 shadow-sm hover:shadow-md transition">
        <button
          onClick={() => navigate.push(`/product/${product.id}`)}
          className="block w-full aspect-[4/3] rounded-lg bg-gray-100 overflow-hidden"
          aria-label={`Go to ${product.name} details`}
        >
          <img
            src={img}
            alt={product.name}
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
            onError={(e) => {
              if (e.currentTarget.src !== fallback) {
                e.currentTarget.src = fallback;
              }
            }}
          />
        </button>

        {withFavorites && (
          <button
            type="button"
            onClick={toggle}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
            className="absolute top-2 right-2 p-1 rounded-full border bg-white/90 hover:bg-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className={`h-5 w-5 ${isFavorite ? "fill-current text-rose-600" : "stroke-current text-gray-700"}`}
              fill="none"
              strokeWidth="1.5"
            >
              <path d="M16.5 3.75c-1.657 0-3.09.99-4.5 3-1.41-2.01-2.843-3-4.5-3A4.75 4.75 0 0 0 2.75 8.5c0 5.25 7.75 9.75 9.25 10.75 1.5-1 9.25-5.5 9.25-10.75a4.75 4.75 0 0 0-4.75-4.75Z" />
            </svg>
          </button>
        )}

        <div className="mt-3">
          <button onClick={() => navigate.push(`/product/${product.id}`)} className="text-left text-sm">
            <div className="font-medium">{product.name}</div>
            <div className="text-gray-600">${product.price}</div>
          </button>
        </div>
      </div>
    );
  }
);

ProductGridItem.displayName = "ProductGridItem";

function ProductGridComponent({
  title,
  products,
  withFavorites = true,
}: ProductGridProps) {
  return (
    <section className="mx-auto max-w-6xl">
      {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}

      {products.length === 0 ? (
        <div className="rounded-2xl border p-10 text-center text-gray-700 bg-white">
          <p className="text-lg font-medium">No items to show yet</p>
          <p className="text-gray-600 mt-1">We’re curating the best tech for you.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <ProductGridItem
              key={p.id}
              product={p}
              withFavorites={withFavorites}
            />
          ))}
        </div>
      )}
    </section>
  );
}

const ProductGrid = memo(ProductGridComponent);
ProductGrid.displayName = "ProductGrid";

export default ProductGrid;

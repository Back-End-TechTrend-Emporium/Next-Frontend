import type { ProductDetail } from "./ProductService";

export function isAvailable(p: ProductDetail) {
  if (typeof p.isInStock === "boolean") return p.isInStock;
  return Number(p.inventoryAvailable ?? 0) > 0;
}

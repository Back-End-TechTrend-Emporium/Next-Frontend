import { http } from "./http";

const API_ROOT = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");
if (!API_ROOT) throw new Error("NEXT_PUBLIC_API_URL is required");
const STORE = `${API_ROOT}/api/store`;
const PRODUCT = `${API_ROOT}/api/product`;

export type ProductRating = { rate: number; count: number };
export type ProductStatus = "approved" | "unapproved";

export type Product = {
  id: string;
  title: string;
  price: number;
  category: string;
  image: string;
  description: string;
  rating: ProductRating;
  inventory?: number;
  status?: ProductStatus;
};

export type ProductDetail = {
  id: string;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: ProductRating;
  inventoryTotal: number;
  inventoryAvailable: number;
  isLowStock: boolean;
  isOutOfStock: boolean;
  isInStock: boolean;
};

export type ProductDraft = {
  title: string;
  price: number;
  categoryId?: string;
  category?: string;
  description: string;
  image: string;
  inventory: number;
  status: ProductStatus;
  createdBy?: { id: string; role: "employee" | "admin" };
};

function mapDraftToApi(d: ProductDraft) {
  return {
    title: d.title,
    price: d.price,
    description: d.description,
    image: d.image,
    inventory: d.inventory,
    status: d.status,
    categoryId: d.categoryId ?? undefined,
    category: d.category ?? undefined,
    createdBy: d.createdBy ?? undefined,
  };
}

export type PagedProductsResponse = {
  items: Product[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasMore: boolean;
};

async function checkDuplicateServerSide(title: string, categoryIdOrName?: string): Promise<boolean> {
  const titleQ = encodeURIComponent(title.trim());
  const catQ = categoryIdOrName ? encodeURIComponent(categoryIdOrName) : "";
  try {
    const url = categoryIdOrName
      ? `${STORE}/products/exists?title=${titleQ}&categoryId=${catQ}`
      : `${STORE}/products/exists?title=${titleQ}`;
    const res = await http.get<{ exists: boolean }>(url);
    if (typeof res.data?.exists === "boolean") return res.data.exists;
  } catch {}
  try {
    const url = categoryIdOrName
      ? `${STORE}/products?page=1&pageSize=1&title=${titleQ}&categoryId=${catQ}`
      : `${STORE}/products?page=1&pageSize=1&title=${titleQ}`;
    const res = await http.get<PagedProductsResponse>(url);
    if (Array.isArray(res.data?.items)) return res.data.items.length > 0;
  } catch {}
  try {
    const res = await http.get<PagedProductsResponse>(`${STORE}/products?page=1&pageSize=1000`);
    const items = res.data?.items ?? [];
    const t = title.trim().toLowerCase();
    return items.some((p) => {
      const sameTitle = p.title.trim().toLowerCase() === t;
      if (!categoryIdOrName) return sameTitle;
      const sameCat = p.category?.toString().toLowerCase() === categoryIdOrName.toLowerCase();
      return sameTitle && sameCat;
    });
  } catch {
    return false;
  }
}

function normalizeDetail(p: any): ProductDetail {
  const rate = typeof p.rating === "number" ? p.rating : p.rating?.rate ?? 0;
  const count = typeof p.rating === "object" ? p.rating?.count ?? 0 : p.ratingCount ?? 0;
  const invTotal = Number(p.inventoryTotal ?? p.inventory ?? 0);
  const invAvail = Number(p.inventoryAvailable ?? p.inventory ?? 0);
  const inStock = invAvail > 0;
  return {
    id: String(p.id ?? ""),
    title: String(p.title ?? p.name ?? ""),
    price: Number(p.price ?? 0),
    description: String(p.description ?? ""),
    category: String(p.category ?? p.categoryName ?? ""),
    image: String(p.image ?? p.imageUrl ?? ""),
    rating: { rate: Number(rate), count: Number(count) },
    inventoryTotal: invTotal,
    inventoryAvailable: invAvail,
    isLowStock: inStock && invAvail <= 5,
    isOutOfStock: !inStock,
    isInStock: inStock,
  };
}

export const ProductService = {
  getApprovedProducts: async (): Promise<ProductDetail[]> => {
    const res = await http.get<ProductDetail[]>(`${PRODUCT}/approved`);
    const arr = Array.isArray(res.data) ? res.data : [];
    return arr.map(normalizeDetail);
  },

  getProducts: async (page = 1, pageSize = 12): Promise<PagedProductsResponse> => {
    const res = await http.get<PagedProductsResponse>(`${STORE}/products?page=${page}&pageSize=${pageSize}`);
    return res.data;
  },

  getLatestProducts: async (): Promise<Product[]> => {
    const res = await http.get<PagedProductsResponse>(
      `${STORE}/products?page=1&pageSize=6&sortBy=Title&sortDir=Desc`
    );
    return res.data.items;
  },

  getBestProducts: async (): Promise<Product[]> => {
    const res = await http.get<PagedProductsResponse>(
      `${STORE}/products?page=1&pageSize=3&sortBy=Rating&sortDir=Desc`
    );
    return res.data.items;
  },

  getById: async (id: string): Promise<ProductDetail> => {
    const urls = [
      `${STORE}/products/${encodeURIComponent(id)}`,
      `${PRODUCT}/${encodeURIComponent(id)}`
    ];
    let lastErr: any;
    for (const url of urls) {
      try {
        const res = await http.get<any>(url);
        if (res?.data) return normalizeDetail(res.data);
      } catch (e) {
        lastErr = e;
      }
    }
    throw lastErr ?? new Error("Product not found");
  },

  existsByTitleAndCategory: async (title: string, categoryIdOrName?: string): Promise<boolean> => {
    return checkDuplicateServerSide(title, categoryIdOrName);
  },

  create: async (draft: ProductDraft): Promise<Product> => {
    const duplicated = await ProductService.existsByTitleAndCategory(
      draft.title,
      draft.categoryId ?? draft.category
    );
    if (duplicated) throw new Error("Product already exists in this category.");
    const payload = mapDraftToApi(draft);
    const res = await http.post<Product>(`${STORE}/products`, payload);
    return res.data;
  },
};

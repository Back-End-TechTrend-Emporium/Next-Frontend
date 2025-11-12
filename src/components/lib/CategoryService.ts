// src/lib/CategoryService.ts
import { http } from "./http";

const BASE =process.env.NEXT_PUBLIC_API_URL+ "/api/Test";

/* ---------------- Existing types (kept intact) ---------------- */

export type CategoryCreator = {
  id: string;
  name: string;
  email: string;
};

export type CategoryProduct = {
  id: string;
  title: string;
  price: number;
  category: string;
  image: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  state: number; // backend numeric state
  createdBy: string;
  approvedBy: string | null;
  createdAt: string;
  updatedAt: string | null;
  approvedAt: string | null;
  creator: CategoryCreator | null;
  approver: CategoryCreator | null;
  products: CategoryProduct[];
};

export const CategoryService = {
  getCategories: async (): Promise<Category[]> => {
    const response = await http.get<Category[]>(`${BASE}/categories`);
    return response.data;
  },

  /* ---------------- Added for F-503 (Create Category) ---------------- */

  /**
   * Semantic moderation status used by the app.
   * We map it to backend numeric `state`.
   */
  statusToState(status: CategoryStatus): number {
    // Adjust if your API uses different codes:
    // 1 = approved, 0 = unapproved is a common pattern.
    return status === "approved" ? 1 : 0;
  },

  /**
   * Case-insensitive duplicate check by name.
   * Tries dedicated endpoint, then filtered list, then full list as fallback.
   */
  async existsByName(name: string): Promise<boolean> {
    const q = encodeURIComponent(name.trim());

    // 1) Preferred: existence endpoint
    try {
      const res = await http.get<{ exists: boolean }>(`${BASE}/categories/exists?name=${q}`);
      if (typeof res.data?.exists === "boolean") return res.data.exists;
    } catch {
      /* ignore and try next */
    }

    // 2) Server-side filter (if supported)
    try {
      const res = await http.get<Category[]>(`${BASE}/categories?name=${q}`);
      if (Array.isArray(res.data)) {
        return res.data.some(
          (c) => c.name.trim().toLowerCase() === name.trim().toLowerCase()
        );
      }
    } catch {
      /* ignore and try fallback */
    }

    // 3) Fallback: fetch all and check client-side
    try {
      const all = await CategoryService.getCategories();
      return all.some(
        (c) => c.name.trim().toLowerCase() === name.trim().toLowerCase()
      );
    } catch {
      // If everything fails, do not block creation.
      return false;
    }
  },

  /**
   * Create a category (admin => approved, employee => unapproved).
   * Returns the server Category. Adjust payload keys if your API uses PascalCase.
   */
  async createCategory(params: CategoryDraft): Promise<Category> {
    const { name, status, createdBy } = params;

    // Client-side duplicate guard (server should validate too)
    const dup = await CategoryService.existsByName(name);
    if (dup) throw new Error("Category already exists.");

    // Map semantic status -> backend numeric state
    const state = CategoryService.statusToState(status);

    // Minimal payload expected by your API
    const payload: Record<string, unknown> = {
      name: name.trim(),
      state,                 // numeric moderation state
      // Optional metadata; include only if your API accepts it
      createdBy: createdBy?.id ?? undefined,
    };

    const res = await http.post<Category>(`${BASE}/categories`, payload);
    return res.data;
  },
};

/* ---------------- New exported types for F-503 ---------------- */

/** App-level moderation status */
export type CategoryStatus = "approved" | "unapproved";

/** Draft used by CreateCategoryPage form */
export type CategoryDraft = {
  name: string;
  status: CategoryStatus;
  createdBy?: { id: string; role: "employee" | "admin" };
};

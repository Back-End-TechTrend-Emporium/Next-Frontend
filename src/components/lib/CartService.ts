import { http } from "./http";

const API_ROOT = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");
if (!API_ROOT) throw new Error("NEXT_PUBLIC_API_URL is required");
const CART = `${API_ROOT}/api/Cart`;

export type CartItem = {
  productId: string;
  productTitle: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  productImage: string;
};

export type Cart = {
  id: string;
  userId: string;
  shoppingCart: (number | string)[] | null;
  items: CartItem[];
  couponApplied: string | null;
  totalBeforeDiscount: number;
  totalAfterDiscount: number;
  shippingCost: number;
  finalTotal: number;
  createdAt: string;
  updatedAt: string;
  status: string;
};

function pick(arr: any): Cart | null {
  const list = Array.isArray(arr) ? arr : [];
  return (list.find((c: any) => c?.status === "Active") ?? list[0] ?? null) as Cart | null;
}

async function getCurrent(): Promise<Cart> {
  const r = await http.get<Cart>(`${CART}/my-cart`);
  return r.data;
}

async function addItemDirect(productId: string, quantity = 1): Promise<Cart> {
  const r = await http.post<Cart>(`${CART}/add-item`, { productId, quantity });
  return r.data;
}

export const CartService = {
  async getMine(): Promise<Cart | null> {
    const r = await http.get<Cart[]>(`${CART}/my-carts`);
    return pick(r.data);
  },
  async addItem(productId: string, quantity = 1): Promise<Cart> {
    try {
      const direct = await addItemDirect(productId, quantity);
      if (direct) return direct;
    } catch {}
    const endpoints = [
      `${CART}/add-item`,
      `${CART}/my-carts/items`,
      `${CART}/items`,
      `${CART}/my-carts/add-item`,
      `${CART}`,
    ];
    const bodies = [
      { productId, quantity },
      { productID: productId, quantity },
      { items: [{ productId, quantity }] },
    ];
    let last: any;
    for (const url of endpoints) {
      for (const body of bodies) {
        try {
          const r = await http.post<Cart>(url, body);
          return r.data;
        } catch (e) {
          last = e;
        }
      }
    }
    try {
      const current = await getCurrent();
      return current;
    } catch {}
    throw last ?? new Error("ADD_TO_CART_FAILED");
  },
  getCurrent,
  addItemDirect,
};

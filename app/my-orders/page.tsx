"use client";
import { Fragment, useEffect, useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthContext";
import { Cart, CartService } from "@/components/lib/CartService";

function Badge({ status }: { status: string }) {
  const m: Record<string, string> = {
    Confirmed: "bg-green-100 text-green-800",
    CheckedOut: "bg-green-100 text-green-800",
    Paid: "bg-green-100 text-green-800",
    Processing: "bg-yellow-100 text-yellow-800",
    Cancelled: "bg-red-100 text-red-800",
    Active: "bg-zinc-100 text-zinc-700",
  };
  return (
    <span
      className={`rounded px-2 py-1 text-xs font-medium ${
        m[status] || "bg-gray-100 text-gray-800"
      }`}
    >
      {status}
    </span>
  );
}

function payLabel(s: string) {
  const v = (s || "").toLowerCase();
  if (["checkedout", "paid", "confirmed"].includes(v)) return "Paid";
  if (v === "cancelled") return "Cancelled";
  return "Pending";
}

type RangeKey = "7" | "30" | "all";

export default function Page() {
  const { user } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Cart[]>([]);
  const [activeCart, setActiveCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [range, setRange] = useState<RangeKey>("7");
  const [open, setOpen] = useState<Set<string>>(new Set());
  const [checkingOut, setCheckingOut] = useState(false);

  const fmtMoney = useMemo(
    () =>
      new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }),
    []
  );
  const fmtDate = (v?: string) => (v ? new Date(v).toLocaleDateString() : "-");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [list, active] = await Promise.all([
        CartService.getAllMine({ onlyOrders: true }),
        CartService.getActive(),
      ]);
      const done = list || [];
      done.sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
      );
      setOrders(done);
      setActiveCart(active);
    } catch (e: any) {
      setError(e?.message || "No se pudieron cargar las órdenes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    load();
  }, [user, load]);

  const filtered = useMemo(() => {
    if (range === "all") return orders;
    const days = range === "7" ? 7 : 30;
    const from = new Date();
    from.setDate(from.getDate() - days);
    return orders.filter((o) =>
      o.createdAt ? new Date(o.createdAt) >= from : true
    );
  }, [orders, range]);

  const doCheckout = async () => {
    if (!activeCart || checkingOut) return;
    setCheckingOut(true);
    try {
      await CartService.checkout();
      await load();
    } finally {
      setCheckingOut(false);
    }
  };

  if (!user) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-700">
          Inicia sesión para ver tus órdenes
        </div>
        <button
          onClick={() => router.push("/login")}
          className="rounded-lg bg-black px-4 py-2 text-white"
        >
          Ir a iniciar sesión
        </button>
      </div>
    );
  }

  if (loading)
    return (
      <div className="mx-auto max-w-6xl px-4 py-16">Cargando órdenes…</div>
    );
  if (error)
    return (
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-700">
          {error}
        </div>
        <button
          onClick={() => router.refresh()}
          className="rounded-lg bg-black px-4 py-2 text-white"
        >
          Reintentar
        </button>
      </div>
    );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {activeCart && (activeCart.items?.length || 0) > 0 && (
        <div className="mb-6 flex items-center justify-between rounded-lg border bg-amber-50 px-4 py-3 text-amber-800">
          <div className="text-sm">
            Tienes un carrito activo con {activeCart.items.length} item(s) por{" "}
            {fmtMoney.format(activeCart.finalTotal || 0)}.
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push("/cart")}
              className="rounded-md border px-3 py-2 text-sm"
            >
              Ver carrito
            </button>
            <button
              onClick={doCheckout}
              disabled={checkingOut}
              className="rounded-md bg-black px-3 py-2 text-sm text-white disabled:opacity-60"
            >
              {checkingOut ? "Procesando…" : "Checkout"}
            </button>
          </div>
        </div>
      )}

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">My Orders</h1>
        <select
          value={range}
          onChange={(e) => setRange(e.target.value as RangeKey)}
          className="rounded-md border px-3 py-2 text-sm"
        >
          <option value="7">Last 7 Days</option>
          <option value="30">Last 30 Days</option>
          <option value="all">All Time</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-xl border bg-white">
        <table className="min-w-full table-fixed">
          <thead className="bg-zinc-50 text-left text-sm text-zinc-600">
            <tr>
              <th className="px-5 py-3 font-medium">Order No.</th>
              <th className="px-5 py-3 font-medium">Customer Name</th>
              <th className="px-5 py-3 font-medium">Payment Status</th>
              <th className="px-5 py-3 font-medium">Amount</th>
              <th className="px-5 py-3 font-medium">Address</th>
              <th className="px-5 py-3 font-medium">Order Date</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y text-sm">
            {filtered.map((o) => {
              const isOpen = open.has(o.id);
              return (
                <Fragment key={o.id}>
                  <tr className="hover:bg-zinc-50">
                    <td className="px-5 py-4">{o.id.slice(0, 8)}</td>
                    <td className="px-5 py-4">{user?.name || "—"}</td>
                    <td className="px-5 py-4">{payLabel(o.status)}</td>
                    <td className="px-5 py-4 font-medium">
                      {fmtMoney.format(o.finalTotal ?? 0)}
                    </td>
                    <td className="px-5 py-4">
                      {(o as any).shippingAddress || "-"}
                    </td>
                    <td className="px-5 py-4">{fmtDate(o.createdAt)}</td>
                    <td className="px-5 py-4">
                      <Badge status={o.status} />
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        className="rounded-md border px-3 py-1 text-xs"
                        onClick={() => {
                          const next = new Set(open);
                          if (isOpen) next.delete(o.id);
                          else next.add(o.id);
                          setOpen(next);
                        }}
                      >
                        {isOpen ? "Hide" : "Details"}
                      </button>
                    </td>
                  </tr>

                  {isOpen && (
                    <tr className="bg-zinc-50">
                      <td colSpan={8} className="px-5 pb-5 pt-2">
                        <div className="overflow-hidden rounded-lg border bg-white">
                          <table className="min-w-full">
                            <thead className="bg-zinc-50 text-left text-xs text-zinc-600">
                              <tr>
                                <th className="px-4 py-2 font-medium">Item</th>
                                <th className="px-4 py-2 font-medium">
                                  Quantity
                                </th>
                                <th className="px-4 py-2 font-medium">
                                  Unit Price
                                </th>
                                <th className="px-4 py-2 font-medium">Total</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y">
                              {(o.items || []).map((it) => (
                                <tr key={`${o.id}-${it.productId}`}>
                                  <td className="px-4 py-2">
                                    {it.productTitle}
                                  </td>
                                  <td className="px-4 py-2">{it.quantity}</td>
                                  <td className="px-4 py-2">
                                    {fmtMoney.format(it.unitPrice)}
                                  </td>
                                  <td className="px-4 py-2">
                                    {fmtMoney.format(it.totalPrice)}
                                  </td>
                                </tr>
                              ))}
                              {!(o.items || []).length && (
                                <tr>
                                  <td
                                    colSpan={4}
                                    className="px-4 py-4 text-center text-zinc-500"
                                  >
                                    No items
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
            {!filtered.length && (
              <tr>
                <td
                  colSpan={8}
                  className="px-5 py-10 text-center text-zinc-500"
                >
                  No tienes órdenes
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

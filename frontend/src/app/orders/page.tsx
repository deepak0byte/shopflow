"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { api, type Order } from "@/lib/api";

function OrdersContent() {
  const params    = useSearchParams();
  const confirmed = params.get("confirmed");
  const initEmail = params.get("email") ?? "";

  const [email,   setEmail]   = useState(initEmail);
  const [orders,  setOrders]  = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  useEffect(() => {
    if (initEmail) fetchOrders(initEmail);
  }, [initEmail]); // eslint-disable-line

  async function fetchOrders(e: string) {
    if (!e.trim()) return;
    setLoading(true);
    setError("");
    try {
      setOrders(await api.orders(e));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }

  const statusColors: Record<string, string> = {
    completed:  "bg-green-100 text-green-700",
    processing: "bg-amber-100 text-amber-700",
    pending:    "bg-blue-100 text-blue-700",
    failed:     "bg-red-100 text-red-700",
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-extrabold mb-6">My Orders</h1>

      {confirmed && (
        <div className="bg-green-50 border border-green-200 rounded-2xl px-5 py-4 mb-6 flex gap-3 items-start">
          <span className="text-2xl">✅</span>
          <div>
            <p className="font-bold text-green-800">Order #{confirmed} placed!</p>
            <p className="text-sm text-green-600">
              You&apos;ll receive a confirmation shortly. Check the status below.
            </p>
          </div>
        </div>
      )}

      {/* Lookup */}
      <div className="flex gap-2 mb-8">
        <input
          type="email"
          placeholder="Enter your email…"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchOrders(email)}
          className="flex-1 border-2 border-gray-200 focus:border-brand rounded-xl px-4 py-2.5 text-sm outline-none transition-colors"
        />
        <button
          onClick={() => fetchOrders(email)}
          disabled={loading}
          className="bg-brand text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-brand/90 disabled:opacity-60"
        >
          {loading ? "…" : "Look up"}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 rounded-xl px-4 py-3 text-sm mb-4">{error}</div>
      )}

      {orders.length === 0 && !loading && email && !error && (
        <p className="text-gray-400 text-center py-10">No orders found for this email.</p>
      )}

      <div className="space-y-4">
        {orders.map((order) => {
          const doubleCharged = order.payments.length > 1;
          const isStuck = order.status === "processing";

          return (
            <div key={order.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="flex items-start justify-between px-5 py-4">
                <div>
                  <p className="font-bold text-gray-900">{order.order_number}</p>
                  <p className="text-sm text-gray-400">
                    {new Date(order.created_at).toLocaleDateString("en-US", {
                      year: "numeric", month: "long", day: "numeric",
                    })}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[order.status] ?? "bg-gray-100 text-gray-600"}`}>
                  {order.status.toUpperCase()}
                </span>
              </div>

              {/* Items */}
              <ul className="border-t divide-y px-5">
                {order.items.map((item, i) => (
                  <li key={i} className="py-2.5 flex justify-between text-sm">
                    <span className="text-gray-700">
                      {item.product_name} <span className="text-gray-400">× {item.quantity}</span>
                    </span>
                    <span className="font-semibold">${item.total_price.toFixed(2)}</span>
                  </li>
                ))}
              </ul>

              {/* Footer */}
              <div className="px-5 py-3 bg-gray-50 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  {order.promo_code && (
                    <span className="mr-3">Promo: <strong>{order.promo_code}</strong></span>
                  )}
                  Discount: ${(order.discount_amount ?? 0).toFixed(2)}
                </div>
                <p className="font-bold text-gray-900">Total: ${order.total.toFixed(2)}</p>
              </div>

              {/* Bug indicators (visible to the user so they can tell SelfHeal about them) */}
              {doubleCharged && (
                <div className="px-5 py-2.5 bg-red-50 border-t border-red-100 text-red-600 text-sm font-semibold">
                  ⚠️ {order.payments.length} payment records detected — possible double charge
                </div>
              )}
              {isStuck && (
                <div className="px-5 py-2.5 bg-amber-50 border-t border-amber-100 text-amber-700 text-sm">
                  ⏳ Order is still processing — this may take longer than expected
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense>
      <OrdersContent />
    </Suspense>
  );
}

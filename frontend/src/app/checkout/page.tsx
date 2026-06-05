"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/store";
import { api, type PromoResult } from "@/lib/api";
import Image from "next/image";

export default function CheckoutPage() {
  const router                    = useRouter();
  const { items, subtotal, clearCart } = useCartStore();

  const [email,     setEmail]     = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName,  setLastName]  = useState("");
  const [address,   setAddress]   = useState("");
  const [city,      setCity]      = useState("");
  const [state,     setState]     = useState("");
  const [zip,       setZip]       = useState("");

  const [promoCode,    setPromoCode]    = useState("");
  const [promoResult,  setPromoResult]  = useState<PromoResult | null>(null);
  const [promoError,   setPromoError]   = useState("");
  const [promoLoading, setPromoLoading] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const sub  = subtotal();
  const total = promoResult ? promoResult.final_total : sub;

  async function applyPromo() {
    if (!promoCode.trim()) return;
    setPromoLoading(true);
    setPromoError("");
    setPromoResult(null);
    try {
      const result = await api.validatePromo(promoCode, sub);
      setPromoResult(result);
    } catch (e: unknown) {
      setPromoError(e instanceof Error ? e.message : "Invalid code");
    } finally {
      setPromoLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!items.length) { setError("Your cart is empty"); return; }

    setLoading(true);
    setError("");

    try {
      const order = await api.checkout({
        user_email: email,
        items: items.map((i) => ({ product_id: i.product.id, quantity: i.quantity })),
        promo_code: promoResult?.code,
        shipping_address: {
          full_name: `${firstName} ${lastName}`,
          address,
          city,
          state,
          zip_code: zip,
          country: "US",
        },
      });
      clearCart();
      router.push(`/orders?confirmed=${order.order_number}&email=${encodeURIComponent(email)}`);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Checkout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!items.length) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <p className="text-5xl mb-4">🛒</p>
        <h1 className="font-bold text-2xl mb-2">Your cart is empty</h1>
        <button
          onClick={() => router.push("/")}
          className="mt-4 bg-brand text-white px-6 py-3 rounded-xl font-semibold hover:bg-brand/90"
        >
          Browse products
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-extrabold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* ── Form ─────────────────────────────────────────────────────── */}
        <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-6">
          {/* Contact */}
          <section className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="font-bold text-lg mb-4">Contact</h2>
            <input
              required type="email" placeholder="Email address"
              value={email} onChange={(e) => setEmail(e.target.value)}
              className="input w-full"
            />
          </section>

          {/* Shipping */}
          <section className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="font-bold text-lg mb-4">Shipping address</h2>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <input required placeholder="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="input" />
              <input required placeholder="Last name"  value={lastName}  onChange={(e) => setLastName(e.target.value)}  className="input" />
            </div>
            <input required placeholder="Address"     value={address}   onChange={(e) => setAddress(e.target.value)}   className="input w-full mb-3" />
            <div className="grid grid-cols-3 gap-3">
              <input required placeholder="City"    value={city}  onChange={(e) => setCity(e.target.value)}  className="input" />
              <input required placeholder="State"   value={state} onChange={(e) => setState(e.target.value)} className="input" />
              <input required placeholder="ZIP"     value={zip}   onChange={(e) => setZip(e.target.value)}   className="input" />
            </div>
          </section>

          {/* Payment (simulated) */}
          <section className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="font-bold text-lg mb-1">Payment</h2>
            <p className="text-sm text-gray-400 mb-4">This is a demo — no real card is charged.</p>
            <input placeholder="4242 4242 4242 4242" className="input w-full mb-3" disabled defaultValue="4242 4242 4242 4242" />
            <div className="grid grid-cols-2 gap-3">
              <input placeholder="MM / YY" className="input" disabled defaultValue="12 / 27" />
              <input placeholder="CVC"     className="input" disabled defaultValue="123" />
            </div>
          </section>

          {error && (
            <div className="bg-red-50 text-red-600 rounded-xl px-4 py-3 text-sm font-medium">
              {error}
            </div>
          )}

          <button
            type="submit" disabled={loading}
            className="w-full bg-brand-accent text-white font-bold py-4 rounded-xl text-lg hover:bg-red-600 transition-colors disabled:opacity-60"
          >
            {loading ? "Placing order…" : `Pay $${total.toFixed(2)}`}
          </button>
        </form>

        {/* ── Order Summary ─────────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h2 className="font-bold text-lg mb-4">Order summary</h2>

            <ul className="divide-y mb-4">
              {items.map(({ product, quantity }) => (
                <li key={product.id} className="flex gap-3 py-3">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                    {product.image_url && (
                      <Image src={product.image_url} alt={product.name} fill className="object-cover" sizes="48px" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{product.name}</p>
                    <p className="text-xs text-gray-400">Qty {quantity}</p>
                  </div>
                  <p className="text-sm font-bold">${(product.price * quantity).toFixed(2)}</p>
                </li>
              ))}
            </ul>

            {/* Promo */}
            <div className="flex gap-2 mb-3">
              <input
                placeholder="Promo code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="input flex-1 text-sm"
              />
              <button
                type="button" onClick={applyPromo} disabled={promoLoading}
                className="bg-brand text-white text-sm font-semibold px-4 rounded-lg hover:bg-brand/90 disabled:opacity-60"
              >
                Apply
              </button>
            </div>

            {promoError && (
              <p className="text-red-500 text-xs mb-2">{promoError}</p>
            )}
            {promoResult && (
              <div className={`text-xs rounded-lg px-3 py-2 mb-2 font-medium ${
                promoResult.final_total > sub
                  ? "bg-red-50 text-red-600"
                  : "bg-green-50 text-green-700"
              }`}>
                {promoResult.final_total > sub
                  ? `⚠️ Promo ${promoResult.code}: total went from $${sub.toFixed(2)} → $${promoResult.final_total.toFixed(2)}`
                  : `✓ ${promoResult.code}: -$${promoResult.discount_amount.toFixed(2)} off`}
              </div>
            )}

            <div className="border-t pt-3 space-y-1.5 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>${sub.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <div className="flex justify-between font-bold text-base border-t pt-2 mt-2">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .input {
          border: 1.5px solid #e5e7eb;
          border-radius: 10px;
          padding: 0.6rem 0.85rem;
          font-size: 0.9rem;
          width: 100%;
          outline: none;
          transition: border-color .15s;
        }
        .input:focus { border-color: #1a1a2e; }
        .input:disabled { background: #f9fafb; color: #9ca3af; }
      `}</style>
    </div>
  );
}

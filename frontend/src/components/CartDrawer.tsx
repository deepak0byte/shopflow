"use client";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/store";
import Image from "next/image";

type Props = { open: boolean; onClose: () => void };

export function CartDrawer({ open, onClose }: Props) {
  const router                          = useRouter();
  const { items, removeItem, updateQty, subtotal } = useCartStore();

  function goCheckout() {
    onClose();
    router.push("/checkout");
  }

  return (
    <>
      {/* backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-[380px] max-w-full bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h2 className="font-bold text-lg">Your Cart</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-2xl leading-none">
            ×
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-2">
            <span className="text-5xl">🛒</span>
            <p>Your cart is empty</p>
          </div>
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto divide-y">
              {items.map(({ product, quantity }) => (
                <li key={product.id} className="flex gap-3 p-4">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                    {product.image_url && (
                      <Image src={product.image_url} alt={product.name} fill className="object-cover" sizes="64px" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{product.name}</p>
                    <p className="text-gray-500 text-sm">${product.price.toFixed(2)}</p>
                    {product.compare_at_price !== undefined && (
                      <p className="text-xs text-gray-400 line-through">Was ${product.compare_at_price!.toFixed(2)}</p>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        onClick={() => updateQty(product.id, quantity - 1)}
                        className="w-6 h-6 rounded border text-sm font-bold flex items-center justify-center hover:bg-gray-100"
                      >−</button>
                      <span className="text-sm w-4 text-center">{quantity}</span>
                      <button
                        onClick={() => updateQty(product.id, quantity + 1)}
                        className="w-6 h-6 rounded border text-sm font-bold flex items-center justify-center hover:bg-gray-100"
                      >+</button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => removeItem(product.id)}
                      className="text-red-400 hover:text-red-600 text-xs"
                    >
                      Remove
                    </button>
                    <p className="font-bold text-sm">${(product.price * quantity).toFixed(2)}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t p-5 space-y-3">
              <div className="flex justify-between font-bold text-lg">
                <span>Subtotal</span>
                <span>${subtotal().toFixed(2)}</span>
              </div>
              <button
                onClick={goCheckout}
                className="w-full bg-brand-accent text-white font-bold py-3 rounded-xl hover:bg-red-600 transition-colors"
              >
                Checkout →
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}

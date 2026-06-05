"use client";
import Link from "next/link";
import { useState } from "react";
import { useCartStore } from "@/lib/store";
import { CartDrawer } from "./CartDrawer";

export function Navbar() {
  const [cartOpen, setCartOpen] = useState(false);
  const itemCount = useCartStore((s) => s.itemCount());

  return (
    <>
      <nav className="bg-brand sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <Link href="/" className="text-white font-bold text-xl tracking-tight">
            Shop<span className="text-brand-accent">Flow</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/orders"
              className="text-white/70 hover:text-white text-sm font-medium transition-colors"
            >
              My Orders
            </Link>

            <button
              onClick={() => setCartOpen(true)}
              className="relative flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              🛒 Cart
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-brand-accent text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}

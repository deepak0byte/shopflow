"use client";
import { useState } from "react";
import { useCartStore } from "@/lib/store";
import type { Product } from "@/lib/api";
import clsx from "clsx";

export function AddToCartButton({ product }: { product: Product }) {
  const addItem = useCartStore(s => s.addItem);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  }

  return (
    <button
      disabled={product.stock === 0}
      onClick={handleAdd}
      className={clsx(
        "w-full py-3.5 rounded-xl font-bold text-base transition-all",
        product.stock === 0
          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
          : added
          ? "bg-green-500 text-white"
          : "bg-brand-accent text-white hover:bg-red-600 active:scale-95"
      )}
    >
      {product.stock === 0 ? "Out of Stock" : added ? "✓ Added to Cart!" : "Add to Cart"}
    </button>
  );
}
